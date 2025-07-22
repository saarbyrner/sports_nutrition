/**
 * Unified Player Selector Component
 * 
 * Standardized player selection dropdown for consistent UX across
 * meal plan creation, assignment, and management interfaces.
 * 
 * Features:
 * - Search functionality
 * - Team filtering
 * - Consistent styling
 * - Loading states
 * - Error handling
 * 
 * @author Claude Code (Expert Software Engineer)
 * @version 1.0.0
 */

import React, { useState, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Search, Users, Loader2 } from 'lucide-react';
import { usePlayerSelection } from '@/hooks/useUnifiedPlayer';

interface PlayerSelectorProps {
  value?: string;
  onValueChange: (playerId: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  showTeamFilter?: boolean;
  showSearch?: boolean;
  className?: string;
}

export default function PlayerSelector({
  value,
  onValueChange,
  placeholder = "Choose a player",
  required = false,
  disabled = false,
  showTeamFilter = false,
  showSearch = false,
  className
}: PlayerSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [teamFilter, setTeamFilter] = useState('all');
  const { players, teams, loading, error } = usePlayerSelection();

  // Filter players based on search and team filter
  const filteredPlayers = useMemo(() => {
    let filtered = players;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(player =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (player.team && player.team.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply team filter
    if (teamFilter !== 'all') {
      filtered = filtered.filter(player => player.team === teamFilter);
    }

    return filtered;
  }, [players, searchTerm, teamFilter]);

  const selectedPlayer = players.find(p => p.id === value);

  if (error) {
    return (
      <div className="p-3 border border-destructive/20 rounded-md bg-destructive/5">
        <p className="text-sm text-destructive">Error loading players: {error}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Search and Team Filter */}
      {(showSearch || showTeamFilter) && (
        <div className="space-y-2 mb-3">
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          )}
          
          {showTeamFilter && teams.length > 0 && (
            <Select value={teamFilter} onValueChange={setTeamFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team} value={team}>
                    {team}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {/* Player Selection */}
      <Select value={value} onValueChange={onValueChange} disabled={disabled || loading}>
        <SelectTrigger className="w-full">
          <div className="flex items-center gap-2 flex-1">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : selectedPlayer ? (
              <>
                <Avatar className="h-6 w-6">
                  <AvatarImage src={selectedPlayer.avatar} />
                  <AvatarFallback className="text-xs">
                    {selectedPlayer.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2 flex-1">
                  <span className="truncate">{selectedPlayer.name}</span>
                  {selectedPlayer.team && (
                    <Badge variant="secondary" className="text-xs">
                      {selectedPlayer.team}
                    </Badge>
                  )}
                </div>
              </>
            ) : (
              <>
                <Users className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder={placeholder} />
              </>
            )}
          </div>
        </SelectTrigger>
        
        <SelectContent>
          {filteredPlayers.length === 0 ? (
            <div className="p-3 text-center text-sm text-muted-foreground">
              {searchTerm || teamFilter !== 'all' ? 'No players match your criteria' : 'No players available'}
            </div>
          ) : (
            filteredPlayers.map((player) => (
              <SelectItem key={player.id} value={player.id}>
                <div className="flex items-center gap-3 w-full">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={player.avatar} />
                    <AvatarFallback className="text-xs">
                      {player.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{player.name}</span>
                      <Badge 
                        variant={player.status === 'active' ? 'default' : 'secondary'} 
                        className="text-xs"
                      >
                        {player.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {player.team && <span>{player.team}</span>}
                      {player.team && player.sport && <span>•</span>}
                      {player.sport && <span>{player.sport}</span>}
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {required && !value && (
        <p className="text-sm text-destructive mt-1">Player selection is required</p>
      )}

      {/* Player count indicator */}
      {filteredPlayers.length > 0 && (
        <p className="text-xs text-muted-foreground mt-1">
          {filteredPlayers.length} player{filteredPlayers.length === 1 ? '' : 's'} available
        </p>
      )}
    </div>
  );
}

/**
 * Simplified Player Selector for quick selection scenarios
 */
export function SimplePlayerSelector({ 
  value, 
  onValueChange, 
  placeholder = "Select player",
  disabled = false,
  className 
}: Pick<PlayerSelectorProps, 'value' | 'onValueChange' | 'placeholder' | 'disabled' | 'className'>) {
  return (
    <PlayerSelector
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      showTeamFilter={false}
      showSearch={false}
    />
  );
}

/**
 * Advanced Player Selector with all filtering options
 */
export function AdvancedPlayerSelector({
  value,
  onValueChange,
  placeholder = "Search and select player",
  disabled = false,
  className
}: Pick<PlayerSelectorProps, 'value' | 'onValueChange' | 'placeholder' | 'disabled' | 'className'>) {
  return (
    <PlayerSelector
      value={value}
      onValueChange={onValueChange}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      showTeamFilter={true}
      showSearch={true}
      required={true}
    />
  );
}