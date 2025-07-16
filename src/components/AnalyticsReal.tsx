'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import { 
  BarChart3,
  Users,
  TrendingUp,
  Target,
  Activity,
  ChefHat,
  Download,
  RefreshCw,
  AlertTriangle,
  Trophy,
  Utensils,
  Calendar,
  Scale
} from 'lucide-react'
import { useAnalyticsService } from '@/hooks/useAnalyticsService'
import { AnalyticsData } from '@/lib/services/analytics'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function AnalyticsReal() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [teamComparison, setTeamComparison] = useState<any[]>([])
  const [selectedTeam, setSelectedTeam] = useState('all')
  const [timeRange, setTimeRange] = useState('8_weeks')

  const { getDashboardAnalytics, getTeamComparison, loading, error, clearError } = useAnalyticsService()

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    const [analyticsData, teamData] = await Promise.all([
      getDashboardAnalytics(),
      getTeamComparison()
    ])

    if (analyticsData) {
      setAnalytics(analyticsData)
    }

    if (teamData) {
      setTeamComparison(teamData)
    }
  }

  if (!analytics) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          {loading ? (
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading analytics...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-4" />
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={loadAnalytics}>Try Again</Button>
            </div>
          ) : (
            <div className="text-center">
              <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
              <p>No analytics data available</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Prepare chart data
  const playerStatusData = Object.entries(analytics.playersByStatus).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count,
    percentage: Math.round((count / analytics.totalPlayers) * 100)
  }))

  const mealPlanTypeData = Object.entries(analytics.mealPlansByType).map(([type, count]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    count,
    percentage: Math.round((count / analytics.totalMealPlans) * 100)
  }))

  const teamComplianceData = analytics.complianceByTeam.map(team => ({
    ...team,
    team: team.team.length > 15 ? team.team.substring(0, 15) + '...' : team.team
  }))

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Performance insights and nutrition analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4_weeks">Last 4 weeks</SelectItem>
              <SelectItem value="8_weeks">Last 8 weeks</SelectItem>
              <SelectItem value="3_months">Last 3 months</SelectItem>
              <SelectItem value="6_months">Last 6 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={loadAnalytics} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
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

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Athletes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalPlayers}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.activePlayers} active ({Math.round((analytics.activePlayers / analytics.totalPlayers) * 100)}%)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meal Plans</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalMealPlans}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.activeMealPlans} active plans
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Compliance</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgComplianceRate}%</div>
            <p className="text-xs text-muted-foreground">
              Across all athletes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Calories</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgCalories}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.avgProtein}g protein
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Player Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Player Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={playerStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {playerStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, 'Players']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {playerStatusData.map((item, index) => (
                    <div key={item.status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm">{item.status}</span>
                      </div>
                      <span className="text-sm font-medium">{item.count} ({item.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Meal Plan Types */}
            <Card>
              <CardHeader>
                <CardTitle>Meal Plan Types</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mealPlanTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Meal Plan Creation */}
          <Card>
            <CardHeader>
              <CardTitle>Meal Plan Creation Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.weeklyMealPlanCreation}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Top Performing Athletes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topPerformingPlayers.map((player, index) => (
                    <div key={player.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{player.name}</p>
                          {player.team && (
                            <p className="text-sm text-muted-foreground">{player.team}</p>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                        {player.compliance}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Compliance by Team */}
            <Card>
              <CardHeader>
                <CardTitle>Team Compliance Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={teamComplianceData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="team" type="category" width={80} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Compliance']} />
                    <Bar dataKey="avgCompliance" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Nutrition Tab */}
        <TabsContent value="nutrition" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Average Nutrition</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Calories</span>
                  <span className="font-medium">{analytics.avgCalories}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Protein</span>
                  <span className="font-medium">{analytics.avgProtein}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Carbs</span>
                  <span className="font-medium">{analytics.avgCarbs}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Fat</span>
                  <span className="font-medium">{analytics.avgFat}g</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Teams Tab */}
        <TabsContent value="teams" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamComparison.map((team, index) => (
                  <div key={team.team} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{team.team}</h3>
                      <Badge variant="outline">{team.playerCount} players</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Compliance</p>
                        <p className="font-medium">{team.avgCompliance}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Calories</p>
                        <p className="font-medium">{team.avgCalories}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Active Plans</p>
                        <p className="font-medium">{team.activeMealPlans}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}