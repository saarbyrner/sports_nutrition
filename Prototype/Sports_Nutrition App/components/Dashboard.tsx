import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  Target,
  Brain,
  MessageSquare,
  ChevronRight,
  Clock,
  Activity
} from 'lucide-react';

interface DashboardProps {
  onPlayerSelect: (playerId: string) => void;
}

// Mock data for dashboard
const dashboardMetrics = {
  totalPlayers: 127,
  activePlans: 89,
  complianceRate: 87,
  alertsCount: 3,
  aiGeneratedPlans: 24,
  messagesCount: 12
};

const recentActivity = [
  { id: 1, type: 'plan', player: 'Marcus Johnson', action: 'AI meal plan generated', time: '2 hours ago' },
  { id: 2, type: 'alert', player: 'Sarah Williams', action: 'Low protein intake detected', time: '4 hours ago' },
  { id: 3, type: 'message', player: 'David Chen', action: 'Sent feedback on meal plan', time: '1 day ago' },
  { id: 4, type: 'compliance', player: 'Emily Rodriguez', action: 'Reached weekly nutrition goals', time: '1 day ago' }
];

const upcomingEvents = [
  { id: 1, event: 'Team Nutrition Workshop', date: '2025-01-15', time: '2:00 PM' },
  { id: 2, event: 'Pre-Season Assessment', date: '2025-01-18', time: '10:00 AM' },
  { id: 3, event: 'Competition Prep Meeting', date: '2025-01-20', time: '3:30 PM' }
];

const atRiskPlayers = [
  { id: 'p1', name: 'Alex Thompson', issue: 'Low energy availability', risk: 'high' },
  { id: 'p2', name: 'Maria Santos', issue: 'Inconsistent meal timing', risk: 'medium' },
  { id: 'p3', name: 'James Wilson', issue: 'Hydration concerns', risk: 'low' }
];

function Dashboard({ onPlayerSelect }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardMetrics.totalPlayers}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardMetrics.activePlans}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardMetrics.activePlans}/{dashboardMetrics.totalPlayers} players
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardMetrics.complianceRate}%</div>
            <Progress value={dashboardMetrics.complianceRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Generated Plans</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardMetrics.aiGeneratedPlans}</div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="flex-shrink-0">
                    {activity.type === 'plan' && <Target className="h-4 w-4 text-blue-500" />}
                    {activity.type === 'alert' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                    {activity.type === 'message' && <MessageSquare className="h-4 w-4 text-green-500" />}
                    {activity.type === 'compliance' && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.player}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-3 rounded-lg border">
                  <p className="text-sm font-medium">{event.event}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{event.date}</span>
                    <Clock className="h-3 w-3 text-muted-foreground ml-2" />
                    <span className="text-xs text-muted-foreground">{event.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* At-Risk Players */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Players Requiring Attention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {atRiskPlayers.map((player) => (
              <div 
                key={player.id} 
                className="p-4 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                onClick={() => onPlayerSelect(player.id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="text-xs">
                      {player.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{player.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{player.issue}</p>
                  </div>
                  <Badge 
                    variant={player.risk === 'high' ? 'destructive' : player.risk === 'medium' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {player.risk}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 flex-col gap-2">
              <Brain className="h-6 w-6" />
              Generate AI Plan
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="h-6 w-6" />
              Add New Player
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <MessageSquare className="h-6 w-6" />
              Send Team Message
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Calendar className="h-6 w-6" />
              Schedule Event
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;