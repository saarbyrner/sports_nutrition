'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  User,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  AlertTriangle
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { usePlayerService } from '@/hooks/usePlayerService'
import { Player } from '@/lib/services/types'
import { format } from 'date-fns'
import AddPlayerModalReal from './AddPlayerModalReal'
import EditPlayerModalReal from './EditPlayerModalReal'
import PlayerImportModal from './PlayerImportModal'
import SectionErrorBoundary from './SectionErrorBoundary'
import PlayerTableSkeleton from './skeletons/PlayerTableSkeleton'
import PlayerStatsSkeleton from './skeletons/PlayerStatsSkeleton'

interface PlayerManagementRealProps {
  onPlayerSelect?: (playerId: string) => void
}

export default function PlayerManagementReal({ onPlayerSelect }: PlayerManagementRealProps) {
  const [players, setPlayers] = useState<Player[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [teamFilter, setTeamFilter] = useState('all')
  const [sportFilter, setSportFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  const {
    loading,
    error,
    clearError,
    getPlayers,
    deletePlayer,
    getPlayerStats
  } = usePlayerService()

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    injured: 0,
    suspended: 0,
    byTeam: {} as Record<string, number>,
    bySport: {} as Record<string, number>
  })

  // Load players and stats
  const loadData = useCallback(async () => {
    const filters: any = {}
    
    if (searchTerm) filters.search = searchTerm
    if (statusFilter !== 'all') filters.status = statusFilter
    if (teamFilter !== 'all') filters.team = teamFilter
    if (sportFilter !== 'all') filters.sport = sportFilter

    const [playersResult, statsResult] = await Promise.all([
      getPlayers({
        pagination: { page: currentPage, limit: pageSize },
        sort: { column: 'user.last_name', ascending: true },
        filters
      }),
      getPlayerStats()
    ])

    if (playersResult.data) {
      setPlayers(playersResult.data)
    }

    if (statsResult) {
      setStats(statsResult)
    }
  }, [searchTerm, statusFilter, teamFilter, sportFilter, currentPage, pageSize, getPlayers, getPlayerStats])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Get unique teams and sports for filters
  const uniqueTeams = Array.from(new Set(players.map(p => p.team).filter(Boolean)))
  const uniqueSports = Array.from(new Set(players.map(p => p.sport).filter(Boolean)))

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player)
    setShowEditModal(true)
  }

  const handlePlayerUpdated = async (updatedPlayer: Player) => {
    await loadData() // Refresh the list to show updated data
  }

  const handleDeletePlayer = async (playerId: string) => {
    if (window.confirm('Are you sure you want to delete this player? This action cannot be undone.')) {
      const success = await deletePlayer(playerId)
      if (success) {
        await loadData() // Refresh the list
      }
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'inactive': return 'secondary'
      case 'injured': return 'destructive'
      case 'suspended': return 'outline'
      default: return 'secondary'
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy')
    } catch {
      return 'Unknown'
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Player Management</h1>
          <p className="text-muted-foreground">
            Manage player profiles, track progress, and organize teams
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <PlayerImportModal onPlayersImported={loadData} />
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <AddPlayerModalReal onPlayerAdded={loadData} />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-destructive/15 border border-destructive/20 rounded-lg p-4 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="ghost" size="sm" onClick={clearError} className="ml-auto">
            Dismiss
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <SectionErrorBoundary 
        title="Stats Loading Error"
        description="Unable to load player statistics"
      >
        {loading ? (
          <PlayerStatsSkeleton />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Players</CardTitle>
            <div className="h-2 w-2 bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Injured</CardTitle>
            <div className="h-2 w-2 bg-red-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.injured}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teams</CardTitle>
            <div className="h-2 w-2 bg-blue-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(stats.byTeam).length}</div>
          </CardContent>
        </Card>
          </div>
        )}
      </SectionErrorBoundary>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="injured">Injured</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={teamFilter} onValueChange={setTeamFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                {uniqueTeams.map(team => (
                  <SelectItem key={team} value={team}>{team}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sportFilter} onValueChange={setSportFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                {uniqueSports.map(sport => (
                  <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Players Table */}
      <SectionErrorBoundary 
        title="Player Table Error"
        description="Unable to load player data table"
      >
        {loading ? (
          <PlayerTableSkeleton rows={pageSize} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Players ({players.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Player</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Sport</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Jersey #</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {players.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No players found
                    </TableCell>
                  </TableRow>
                ) : (
                  players.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={player.user?.avatar_url} />
                            <AvatarFallback>
                              {player.user ? getInitials(player.user.first_name, player.user.last_name) : '??'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div 
                              className="font-medium cursor-pointer hover:text-blue-600 hover:underline transition-colors"
                              onClick={() => onPlayerSelect?.(player.id)}
                            >
                              {player.user ? `${player.user.first_name} ${player.user.last_name}` : 'Unknown'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {player.user?.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{player.position || '-'}</TableCell>
                      <TableCell>{player.team || '-'}</TableCell>
                      <TableCell>{player.sport || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(player.status)}>
                          {player.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{player.jersey_number || '-'}</TableCell>
                      <TableCell>{formatDate(player.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onPlayerSelect?.(player.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditPlayer(player)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Player
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeletePlayer(player.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Player
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
        )}
      </SectionErrorBoundary>

      {/* Edit Player Modal */}
      <EditPlayerModalReal
        player={editingPlayer}
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onPlayerUpdated={handlePlayerUpdated}
      />
    </div>
  )
}