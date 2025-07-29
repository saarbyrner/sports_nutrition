/**
 * Unified Player Selector Component
 * 
 * Standardized player selection dropdown for consistent UX across
 * meal plan creation, assignment, and management interfaces.
 * 
 * @author Claude Code (Expert Software Engineer)
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Search, User, Users, Filter } from 'lucide-react';
import { useUnifiedPlayer } from '@/hooks/useUnifiedPlayer';
import type { Player } from '@/lib/services/types';

interface PlayerSelectorProps {
  value?: string;
  onPlayerSelect: (playerId: string) => void;
  placeholder?: string;
  variant?: 'basic' | 'simple' | 'advanced';
  showTeamFilter?: boolean;
  className?: string;
}

export function PlayerSelector({
  value,
  onPlayerSelect,
  placeholder = "Select a player",
  variant = 'basic',
  showTeamFilter = false,
  className = ""
}: PlayerSelectorProps) {
  const { players, loading, error } = useUnifiedPlayer();
  const [searchTerm, setSearchTerm] = useState('');
  const [teamFilter, setTeamFilter] = useState<string>('');

  // Filter players based on search term and team filter
  const filteredPlayers = (players || []).filter(player => {
    const matchesSearch = !searchTerm || 
      `${player.user?.first_name} ${player.user?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.position?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTeam = !teamFilter || teamFilter === 'all' || player.team === teamFilter;
    
    return matchesSearch && matchesTeam;
  });

  // Get unique teams for filter
  const teams = Array.from(new Set((players || []).map(p => p.team).filter(Boolean)));

  // Find selected player
  const selectedPlayer = (players || []).find(p => p.id === value);

  if (loading) {
    return (
      <Select disabled>
        <SelectTrigger className={className}>
          <SelectValue placeholder="Loading players..." />
        </SelectTrigger>
      </Select>
    );
  }

  if (error) {
    return (
      <Select disabled>
        <SelectTrigger className={className}>
          <SelectValue placeholder="Error loading players" />
        </SelectTrigger>
      </Select>
    );
  }

  // Basic variant - simple dropdown with better selection display
  if (variant === 'basic') {
    return (
      <Select value={value || ""} onValueChange={onPlayerSelect}>
        <SelectTrigger className={`${className} min-h-[48px]`}>
          {selectedPlayer ? (
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={selectedPlayer.user?.avatar_url} />
                <AvatarFallback className="text-xs">
                  {selectedPlayer.user ? 
                    `${selectedPlayer.user.first_name?.charAt(0) || ''}${selectedPlayer.user.last_name?.charAt(0) || ''}` : 
                    'P'
                  }
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <div className="font-medium text-sm">
                  {selectedPlayer.user ? 
                    `${selectedPlayer.user.first_name} ${selectedPlayer.user.last_name}` : 
                    `Player ${selectedPlayer.id.substring(0, 8)}`
                  }
                </div>
                <div className="text-xs text-muted-foreground">
                  {selectedPlayer.position} • {selectedPlayer.team || 'No team'}
                </div>
              </div>
            </div>
          ) : (
            <SelectValue placeholder={placeholder} />
          )}
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {filteredPlayers.length === 0 ? (
            <div className="p-3 text-center text-sm text-muted-foreground">
              No players available
            </div>
          ) : (
            filteredPlayers.map((player) => (
              <SelectItem key={player.id} value={player.id} className="p-2">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={player.user?.avatar_url} />
                    <AvatarFallback className="text-xs">
                      {player.user ? 
                        `${player.user.first_name?.charAt(0) || ''}${player.user.last_name?.charAt(0) || ''}` : 
                        'P'
                      }
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">
                      {player.user ? 
                        `${player.user.first_name} ${player.user.last_name}` : 
                        `Player ${player.id.substring(0, 8)}`
                      }
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {player.position} • {player.team || 'No team'}
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    );
  }

  // Simple variant - streamlined single component with integrated search
  if (variant === 'simple') {
    return (
      <Select value={value || ""} onValueChange={onPlayerSelect}>
        <SelectTrigger className={`${className} min-h-[60px]`}>
          {selectedPlayer ? (
            <div className="flex items-center gap-3 py-2">
              <Avatar className="w-10 h-10">
                <AvatarImage src={selectedPlayer.user?.avatar_url} />
                <AvatarFallback className="text-sm">
                  {selectedPlayer.user ? 
                    `${selectedPlayer.user.first_name?.charAt(0) || ''}${selectedPlayer.user.last_name?.charAt(0) || ''}` : 
                    'P'
                  }
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <div className="font-medium">
                  {selectedPlayer.user ? 
                    `${selectedPlayer.user.first_name} ${selectedPlayer.user.last_name}` : 
                    `Player ${selectedPlayer.id.substring(0, 8)}`
                  }
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedPlayer.position} • {selectedPlayer.team || 'No team'}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Search className="h-4 w-4" />
              <span>{placeholder}</span>
            </div>
          )}
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          <div className="sticky top-0 bg-background border-b p-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, position, or team..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          {filteredPlayers.length === 0 ? (
            <div className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">
                {searchTerm ? 'No players match your search' : 'No players found'}
              </p>
              {searchTerm && (
                <p className="text-xs text-muted-foreground mt-1">
                  Try a different search term
                </p>
              )}
            </div>
          ) : (
            <div className="p-1">
              {filteredPlayers.map((player) => (
                <SelectItem key={player.id} value={player.id} className="p-3 cursor-pointer">
                  <div className="flex items-center gap-3 w-full">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarImage src={player.user?.avatar_url} />
                      <AvatarFallback className="text-sm">
                        {player.user ? 
                          `${player.user.first_name?.charAt(0) || ''}${player.user.last_name?.charAt(0) || ''}` : 
                          'P'
                        }
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {player.user ? 
                          `${player.user.first_name} ${player.user.last_name}` : 
                          `Player ${player.id.substring(0, 8)}`
                        }
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {player.position} • {player.team || 'No team'}
                      </div>
                    </div>
                    {player.status === 'active' && (
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                    )}
                  </div>
                </SelectItem>
              ))}
            </div>
          )}
          {filteredPlayers.length > 0 && (
            <div className="border-t p-2 text-xs text-muted-foreground text-center">
              {filteredPlayers.length} player{filteredPlayers.length !== 1 ? 's' : ''} available
            </div>
          )}
        </SelectContent>
      </Select>
    );
  }

  // Advanced variant - with team filtering and enhanced features
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        {showTeamFilter && teams.length > 0 && (
          <Select value={teamFilter} onValueChange={setTeamFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All Teams" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              {teams.map((team) => (
                <SelectItem key={team} value={team!}>
                  {team}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <Select value={value || ""} onValueChange={onPlayerSelect}>
        <SelectTrigger className={className}>
          {selectedPlayer ? (
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={selectedPlayer.user?.avatar_url} />
                <AvatarFallback>
                  {selectedPlayer.user ? 
                    `${selectedPlayer.user.first_name?.charAt(0) || ''}${selectedPlayer.user.last_name?.charAt(0) || ''}` : 
                    'P'
                  }
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <div className="font-medium">
                  {selectedPlayer.user ? 
                    `${selectedPlayer.user.first_name} ${selectedPlayer.user.last_name}` : 
                    `Player ${selectedPlayer.id.substring(0, 8)}`
                  }
                </div>
                <div className="text-xs text-muted-foreground">
                  {selectedPlayer.position} • {selectedPlayer.team || 'No team'}
                </div>
              </div>
            </div>
          ) : (
            <SelectValue placeholder={placeholder} />
          )}
        </SelectTrigger>
        <SelectContent>
          {filteredPlayers.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No players found</p>
              {searchTerm && (
                <p className="text-xs mt-1">Try adjusting your search</p>
              )}
            </div>
          ) : (
            filteredPlayers.map((player) => (
              <SelectItem key={player.id} value={player.id}>
                <div className="flex items-center gap-3 py-1">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={player.user?.avatar_url} />
                    <AvatarFallback>
                      {player.user ? 
                        `${player.user.first_name?.charAt(0) || ''}${player.user.last_name?.charAt(0) || ''}` : 
                        'P'
                      }
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">
                      {player.user ? 
                        `${player.user.first_name} ${player.user.last_name}` : 
                        `Player ${player.id.substring(0, 8)}`
                      }
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>{player.position}</span>
                      {player.team && (
                        <>
                          <span>•</span>
                          <Badge variant="outline" className="text-xs">
                            {player.team}
                          </Badge>
                        </>
                      )}
                      <span>•</span>
                      <span>{player.status}</span>
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {filteredPlayers.length > 0 && (
        <div className="text-xs text-muted-foreground">
          Showing {filteredPlayers.length} of {players.length} players
        </div>
      )}
    </div>
  );
}