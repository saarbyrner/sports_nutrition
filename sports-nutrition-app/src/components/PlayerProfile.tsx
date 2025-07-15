import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  ArrowLeft,
  Edit,
  MessageSquare,
  Calendar,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  User,
  Activity,
  Utensils,
  Droplets,
  Clock,
  Plus,
  FileText,
  Heart,
  Scale,
  Brain
} from 'lucide-react';

interface PlayerProfileProps {
  playerId: string | null;
  onBack: () => void;
}

// Mock player data with detailed information
const mockPlayerData = {
  id: 'p1',
  name: 'Marcus Johnson',
  position: 'Forward',
  team: 'Men\'s Soccer',
  age: 22,
  height: '6\'2"',
  weight: '180 lbs',
  bodyFat: '12%',
  status: 'active',
  joinDate: '2024-08-15',
  avatar: 'MJ',
  goals: ['Weight gain', 'Performance enhancement'],
  allergies: ['Shellfish'],
  dietaryPreferences: ['No restrictions'],
  medicalConditions: ['None'],
  currentPlan: {
    id: 'plan1',
    name: 'Pre-Season Weight Gain',
    startDate: '2025-01-08',
    endDate: '2025-02-08',
    calories: 3200,
    protein: 160,
    carbs: 400,
    fat: 111,
    status: 'active'
  },
  dailyTargets: {
    calories: 3200,
    protein: 160,
    carbs: 400,
    fat: 111,
    water: 3.5
  },
  todayProgress: {
    calories: 2845,
    protein: 142,
    carbs: 375,
    fat: 98,
    water: 2.8
  },
  weeklyCompliance: 87,
  recentWeight: [
    { date: '2025-01-06', weight: 178 },
    { date: '2025-01-08', weight: 179 },
    { date: '2025-01-10', weight: 179.5 },
    { date: '2025-01-12', weight: 180 }
  ],
  alerts: [
    { type: 'info', message: 'Consistently meeting protein targets', date: '2025-01-12' },
    { type: 'warning', message: 'Hydration below target yesterday', date: '2025-01-11' }
  ],
  upcomingMeals: [
    { time: '3:00 PM', meal: 'Post-training snack', calories: 450, status: 'pending' },
    { time: '7:00 PM', meal: 'Dinner', calories: 850, status: 'pending' },
    { time: '9:30 PM', meal: 'Evening snack', calories: 300, status: 'pending' }
  ]
};

function PlayerProfile({ playerId, onBack }: PlayerProfileProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!playerId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No player selected</p>
      </div>
    );
  }

  const player = mockPlayerData;

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Players
        </Button>
      </div>

      {/* Player Info Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="text-lg">
                  {player.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{player.name}</h1>
                <p className="text-muted-foreground">{player.position} • {player.team}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {player.status}
                  </Badge>
                  <Badge variant="outline">
                    {player.weeklyCompliance}% Compliance
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="text-lg font-semibold">{player.age}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Height</p>
                <p className="text-lg font-semibold">{player.height}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Weight</p>
                <p className="text-lg font-semibold">{player.weight}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Body Fat</p>
                <p className="text-lg font-semibold">{player.bodyFat}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Message
              </Button>
              <Button variant="outline">
                <Brain className="h-4 w-4 mr-2" />
                AI Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Progress */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Today's Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Calories</span>
                    <span className="text-sm text-muted-foreground">
                      {player.todayProgress.calories} / {player.dailyTargets.calories}
                    </span>
                  </div>
                  <Progress 
                    value={getProgressPercentage(player.todayProgress.calories, player.dailyTargets.calories)} 
                    className="h-2"
                  />

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Protein</span>
                    <span className="text-sm text-muted-foreground">
                      {player.todayProgress.protein}g / {player.dailyTargets.protein}g
                    </span>
                  </div>
                  <Progress 
                    value={getProgressPercentage(player.todayProgress.protein, player.dailyTargets.protein)} 
                    className="h-2"
                  />

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Carbs</span>
                    <span className="text-sm text-muted-foreground">
                      {player.todayProgress.carbs}g / {player.dailyTargets.carbs}g
                    </span>
                  </div>
                  <Progress 
                    value={getProgressPercentage(player.todayProgress.carbs, player.dailyTargets.carbs)} 
                    className="h-2"
                  />

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Fat</span>
                    <span className="text-sm text-muted-foreground">
                      {player.todayProgress.fat}g / {player.dailyTargets.fat}g
                    </span>
                  </div>
                  <Progress 
                    value={getProgressPercentage(player.todayProgress.fat, player.dailyTargets.fat)} 
                    className="h-2"
                  />

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Water</span>
                    <span className="text-sm text-muted-foreground">
                      {player.todayProgress.water}L / {player.dailyTargets.water}L
                    </span>
                  </div>
                  <Progress 
                    value={getProgressPercentage(player.todayProgress.water, player.dailyTargets.water)} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Meals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-5 w-5" />
                  Upcoming Meals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {player.upcomingMeals.map((meal, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-medium">{meal.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{meal.meal}</p>
                        <p className="text-xs text-muted-foreground">{meal.calories} cal</p>
                      </div>
                      <Badge variant="outline">
                        {meal.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Alerts & Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {player.alerts.map((alert, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                    {alert.type === 'info' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {alert.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                    <div className="flex-1">
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nutrition Tab */}
        <TabsContent value="nutrition" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Nutrition Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{player.currentPlan.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {player.currentPlan.startDate} - {player.currentPlan.endDate}
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    {player.currentPlan.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Daily Calories</p>
                    <p className="text-xl font-bold">{player.currentPlan.calories}</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Protein</p>
                    <p className="text-xl font-bold">{player.currentPlan.protein}g</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Carbs</p>
                    <p className="text-xl font-bold">{player.currentPlan.carbs}g</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Fat</p>
                    <p className="text-xl font-bold">{player.currentPlan.fat}g</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button>
                    <Edit className="h-4 w-4 mr-2" />
                    Modify Plan
                  </Button>
                  <Button variant="outline">
                    <Brain className="h-4 w-4 mr-2" />
                    AI Suggestions
                  </Button>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Export Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Weight Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  {player.recentWeight.map((entry, index) => (
                    <div key={index} className="text-center p-3 border rounded-lg">
                      <p className="text-xs text-muted-foreground">{entry.date}</p>
                      <p className="text-lg font-semibold">{entry.weight} lbs</p>
                    </div>
                  ))}
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    +2 lbs gained since plan started
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Meal Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Detailed meal plans will be displayed here</p>
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Goals</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {player.goals.map((goal, index) => (
                        <Badge key={index} variant="outline">{goal}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Allergies</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {player.allergies.map((allergy, index) => (
                        <Badge key={index} variant="destructive">{allergy}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Dietary Preferences</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {player.dietaryPreferences.map((pref, index) => (
                        <Badge key={index} variant="outline">{pref}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Medical Conditions</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {player.medicalConditions.map((condition, index) => (
                        <Badge key={index} variant="outline">{condition}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PlayerProfile;