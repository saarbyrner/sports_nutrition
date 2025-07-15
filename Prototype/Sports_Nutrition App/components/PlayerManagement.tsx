import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  User,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Grid3X3,
  List,
  ArrowUpDown,
  Eye,
  Hash,
  Tag
} from 'lucide-react';
import AddPlayerModal from './AddPlayerModal';
import PlayerTagManager from './PlayerTagManager';

interface PlayerManagementProps {
  onPlayerSelect: (playerId: string) => void;
}

interface Player {
  id: string;
  name: string;
  position: string;
  team: string;
  age: number;
  status: string;
  planStatus: string;
  compliance: number;
  lastActivity: string;
  alerts: number;
  goals: string;
  avatar: string;
  tags: string[];
}

// Enhanced mock player data with tags
const mockPlayers: Player[] = [
  {
    id: 'p1',
    name: 'Marcus Johnson',
    position: 'Forward',
    team: 'Men\'s Soccer',
    age: 22,
    status: 'active',
    planStatus: 'current',
    compliance: 92,
    lastActivity: '2 hours ago',
    alerts: 0,
    goals: 'Weight gain',
    avatar: 'MJ',
    tags: ['Weight-Gain', 'High-Protein', 'Pre-Season', 'Veteran']
  },
  {
    id: 'p2',
    name: 'Sarah Williams',
    position: 'Midfielder',
    team: 'Women\'s Soccer',
    age: 20,
    status: 'active',
    planStatus: 'needs_review',
    compliance: 78,
    lastActivity: '1 day ago',
    alerts: 2,
    goals: 'Performance',
    avatar: 'SW',
    tags: ['Vegetarian', 'Performance', 'Needs-Attention', 'Captain']
  },
  {
    id: 'p3',
    name: 'David Chen',
    position: 'Guard',
    team: 'Men\'s Basketball',
    age: 21,
    status: 'active',
    planStatus: 'current',
    compliance: 95,
    lastActivity: '4 hours ago',
    alerts: 0,
    goals: 'Recovery',
    avatar: 'DC',
    tags: ['Recovery', 'Dairy-Free', 'In-Season', 'High-Priority']
  },
  {
    id: 'p4',
    name: 'Emily Rodriguez',
    position: 'Striker',
    team: 'Women\'s Soccer',
    age: 19,
    status: 'active',
    planStatus: 'current',
    compliance: 88,
    lastActivity: '6 hours ago',
    alerts: 1,
    goals: 'Lean mass',
    avatar: 'ER',
    tags: ['Muscle-Building', 'Gluten-Free', 'New-Player', 'Follow-Up']
  },
  {
    id: 'p5',
    name: 'Alex Thompson',
    position: 'Defense',
    team: 'Men\'s Soccer',
    age: 23,
    status: 'inactive',
    planStatus: 'paused',
    compliance: 45,
    lastActivity: '3 days ago',
    alerts: 3,
    goals: 'Weight loss',
    avatar: 'AT',
    tags: ['Weight-Loss', 'Injured', 'Close-Monitor', 'Returning']
  },
  {
    id: 'p6',
    name: 'Maria Santos',
    position: 'Center',
    team: 'Women\'s Basketball',
    age: 20,
    status: 'active',
    planStatus: 'current',
    compliance: 85,
    lastActivity: '1 day ago',
    alerts: 1,
    goals: 'Strength',
    avatar: 'MS',
    tags: ['Endurance', 'Supplement-User', 'Competition', 'Trial']
  }
];

function PlayerManagement({ onPlayerSelect }: PlayerManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeam, setFilterTeam] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTag, setFilterTag] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [players, setPlayers] = useState<Player[]>(mockPlayers);

  const teams = [...new Set(mockPlayers.map(p => p.team))];
  const allTags = [...new Set(mockPlayers.flatMap(p => p.tags))].sort();
  
  // Handle adding new player from modal
  const handlePlayerAdd = (playerData: any) => {
    const newPlayer: Player = {
      id: `p${players.length + 1}`,
      name: `${playerData.firstName} ${playerData.lastName}`,
      position: playerData.position || 'Unknown',
      team: playerData.team,
      age: playerData.dateOfBirth ? new Date().getFullYear() - new Date(playerData.dateOfBirth).getFullYear() : 0,
      status: 'active',
      planStatus: 'needs_review',
      compliance: 0,
      lastActivity: 'Just added',
      alerts: 0,
      goals: 'New player',
      avatar: `${playerData.firstName.charAt(0)}${playerData.lastName.charAt(0)}`,
      tags: ['New-Player']
    };

    setPlayers(prev => [...prev, newPlayer]);
    console.log('Player added successfully:', newPlayer);
  };

  // Handle tag updates for players
  const handlePlayerTagsUpdate = (playerId: string, newTags: string[]) => {
    setPlayers(prev => prev.map(player => 
      player.id === playerId ? { ...player, tags: newTags } : player
    ));
  };

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTeam = filterTeam === 'all' || player.team === filterTeam;
    const matchesStatus = filterStatus === 'all' || player.status === filterStatus;
    const matchesTag = filterTag === 'all' || player.tags.includes(filterTag);
    
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'active' && player.status === 'active') ||
                      (activeTab === 'needs_attention' && (player.alerts > 0 || player.compliance < 80));
    
    return matchesSearch && matchesTeam && matchesStatus && matchesTag && matchesTab;
  });

  // Sort players based on current sort configuration
  const sortedPlayers = React.useMemo(() => {
    if (!sortConfig) return filteredPlayers;

    return [...filteredPlayers].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof Player];
      const bValue = b[sortConfig.key as keyof Player];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredPlayers, sortConfig]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="text-gray-600 border-gray-600">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPlanStatusBadge = (planStatus: string) => {
    switch (planStatus) {
      case 'current':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Current</Badge>;
      case 'needs_review':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Needs Review</Badge>;
      case 'paused':
        return <Badge variant="outline" className="text-gray-600 border-gray-600">Paused</Badge>;
      default:
        return <Badge variant="outline">{planStatus}</Badge>;
    }
  };

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 90) return 'text-green-600';
    if (compliance >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const stats = {
    total: players.length,
    active: players.filter(p => p.status === 'active').length,
    needsAttention: players.filter(p => p.alerts > 0 || p.compliance < 80).length,
    avgCompliance: Math.round(players.reduce((sum, p) => sum + p.compliance, 0) / players.length)
  };

  const SortableHeader = ({ children, sortKey }: { children: React.ReactNode; sortKey: string }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(sortKey)}
      className="h-auto p-0 font-medium hover:bg-transparent"
    >
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className="h-3 w-3" />
      </div>
    </Button>
  );

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total Players</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Active Players</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Need Attention</p>
                <p className="text-2xl font-bold">{stats.needsAttention}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Avg Compliance</p>
                <p className="text-2xl font-bold">{stats.avgCompliance}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Player Roster */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <CardTitle>Player Roster</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setShowAddPlayerModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Player
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search players, positions, teams, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterTeam} onValueChange={setFilterTeam}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                {teams.map(team => (
                  <SelectItem key={team} value={team}>{team}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>
                    <div className="flex items-center">
                      <Hash className="h-3 w-3 mr-1" />
                      {tag}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <TabsList className="grid w-full sm:w-auto grid-cols-3">
                <TabsTrigger value="all">All Players</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="needs_attention">Needs Attention</TabsTrigger>
              </TabsList>
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 border rounded-lg p-1">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className="h-8 px-3"
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">Cards</span>
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">Table</span>
                </Button>
              </div>
            </div>
            
            <TabsContent value={activeTab} className="space-y-4 mt-6">
              {viewMode === 'cards' ? (
                // Card View
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedPlayers.map((player) => (
                    <Card 
                      key={player.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => onPlayerSelect(player.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className="text-sm">
                                {player.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{player.name}</h3>
                              <p className="text-sm text-muted-foreground">{player.position}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Team:</span>
                            <span className="text-sm font-medium">{player.team}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Status:</span>
                            {getStatusBadge(player.status)}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Plan:</span>
                            {getPlanStatusBadge(player.planStatus)}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Compliance:</span>
                            <span className={`text-sm font-semibold ${getComplianceColor(player.compliance)}`}>
                              {player.compliance}%
                            </span>
                          </div>
                        </div>

                        {/* Tags Section */}
                        <div className="mt-4 pt-3 border-t">
                          <div className="mb-2">
                            <span className="text-sm text-muted-foreground">Tags:</span>
                          </div>
                          <PlayerTagManager
                            tags={player.tags}
                            onTagsChange={(newTags) => handlePlayerTagsUpdate(player.id, newTags)}
                            maxTags={6}
                            placeholder="Add tag..."
                          />
                        </div>

                        <div className="mt-4 pt-3 border-t">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{player.lastActivity}</span>
                            </div>
                            {player.alerts > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {player.alerts} alert{player.alerts > 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                // Table View
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">
                          <SortableHeader sortKey="name">Player</SortableHeader>
                        </TableHead>
                        <TableHead>
                          <SortableHeader sortKey="team">Team</SortableHeader>
                        </TableHead>
                        <TableHead>
                          <SortableHeader sortKey="position">Position</SortableHeader>
                        </TableHead>
                        <TableHead>
                          <SortableHeader sortKey="age">Age</SortableHeader>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Plan Status</TableHead>
                        <TableHead>
                          <SortableHeader sortKey="compliance">Compliance</SortableHeader>
                        </TableHead>
                        <TableHead className="w-[250px]">
                          <div className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            Tags
                          </div>
                        </TableHead>
                        <TableHead>
                          <SortableHeader sortKey="alerts">Alerts</SortableHeader>
                        </TableHead>
                        <TableHead>Last Activity</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedPlayers.map((player) => (
                        <TableRow 
                          key={player.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => onPlayerSelect(player.id)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="text-xs">
                                  {player.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{player.name}</div>
                                <div className="text-sm text-muted-foreground">{player.goals}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{player.team}</TableCell>
                          <TableCell>{player.position}</TableCell>
                          <TableCell>{player.age}</TableCell>
                          <TableCell>{getStatusBadge(player.status)}</TableCell>
                          <TableCell>{getPlanStatusBadge(player.planStatus)}</TableCell>
                          <TableCell>
                            <span className={`font-medium ${getComplianceColor(player.compliance)}`}>
                              {player.compliance}%
                            </span>
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <PlayerTagManager
                              tags={player.tags}
                              onTagsChange={(newTags) => handlePlayerTagsUpdate(player.id, newTags)}
                              maxTags={8}
                              placeholder="Add tag..."
                            />
                          </TableCell>
                          <TableCell>
                            {player.alerts > 0 ? (
                              <Badge variant="destructive" className="text-xs">
                                {player.alerts}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {player.lastActivity}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onPlayerSelect(player.id);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Handle more actions
                                }}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {sortedPlayers.length === 0 && (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No players found matching your filters</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add Player Modal */}
      <AddPlayerModal
        open={showAddPlayerModal}
        onOpenChange={setShowAddPlayerModal}
        onPlayerAdd={handlePlayerAdd}
      />
    </div>
  );
}

export default PlayerManagement;