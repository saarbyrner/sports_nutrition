/**
 * Meal Plan Details Modal
 * 
 * Read-only meal plan viewing component with full nutrition breakdown
 * and player assignment information. Safe implementation with no editing.
 * 
 * @author Claude Code (Expert Software Engineer)  
 * @version 1.0.0
 */

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { 
  Utensils,
  Clock,
  User,
  Calendar,
  Target,
  Activity,
  CheckCircle,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { MealPlan } from '@/lib/services/types';
import { NutritionSummary } from './shared/NutritionSummary';
import { format } from 'date-fns';

interface MealPlanDetailsModalProps {
  mealPlan: MealPlan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MealPlanDetailsModal({
  mealPlan,
  open,
  onOpenChange
}: MealPlanDetailsModalProps) {
  if (!mealPlan) return null;

  const nutritionData = {
    calories: mealPlan.calories || 0,
    protein: mealPlan.protein || 0,
    carbs: mealPlan.carbs || 0,
    fat: mealPlan.fat || 0,
    fiber: mealPlan.fiber || 0
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'draft':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'archived':
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-300';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Unknown';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Utensils className="w-5 h-5" />
            {mealPlan.title}
          </DialogTitle>
          <DialogDescription>
            Detailed nutrition plan overview and breakdown
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Plan Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <p className="text-sm mt-1">
                      {mealPlan.description || 'No description provided'}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(mealPlan.status)}
                        <Badge className={getStatusColor(mealPlan.status)}>
                          {mealPlan.status}
                        </Badge>
                      </div>
                    </div>
                    
                    {mealPlan.plan_type && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Type</label>
                        <div className="mt-1">
                          <Badge variant="outline">
                            {mealPlan.plan_type}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm font-medium">Created:</span>
                      <span className="text-sm ml-2">{formatDate(mealPlan.created_at)}</span>
                    </div>
                  </div>

                  {mealPlan.duration_days && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <span className="text-sm font-medium">Duration:</span>
                        <span className="text-sm ml-2">{mealPlan.duration_days} days</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm font-medium">Daily Target:</span>
                      <span className="text-sm ml-2">{mealPlan.calories} calories</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Player Assignment */}
          {mealPlan.player && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Assigned Player
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={mealPlan.player.user?.avatar_url} />
                    <AvatarFallback>
                      {mealPlan.player.user ? 
                        `${mealPlan.player.user.first_name?.charAt(0) || ''}${mealPlan.player.user.last_name?.charAt(0) || ''}` : 
                        'P'
                      }
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">
                      {mealPlan.player.user ? 
                        `${mealPlan.player.user.first_name} ${mealPlan.player.user.last_name}` : 
                        `Player ${mealPlan.player_id}`
                      }
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {mealPlan.player.position && <span>{mealPlan.player.position}</span>}
                      {mealPlan.player.team && (
                        <>
                          {mealPlan.player.position && <span>•</span>}
                          <span>{mealPlan.player.team}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Nutrition Breakdown */}
          <NutritionSummary 
            data={nutritionData}
            title="Daily Nutrition Targets"
            layout="detailed"
            showProgress={false}
          />

          {/* Meal Plan Details */}
          {mealPlan.meal_data && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Utensils className="w-5 h-5" />
                  Daily Meal Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(mealPlan.meal_data).map(([mealType, meal]: [string, any], index) => (
                  <div key={mealType}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <h4 className="font-medium capitalize">
                          {mealType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h4>
                        {meal.time && (
                          <Badge variant="outline" className="text-xs">
                            {meal.time}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm font-medium">
                        {meal.calories} cal
                      </div>
                    </div>

                    {meal.foods && meal.foods.length > 0 && (
                      <div className="ml-6 space-y-2">
                        {Array.isArray(meal.foods) ? (
                          meal.foods.map((food: any, foodIndex: number) => (
                            <div key={foodIndex} className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                {typeof food === 'string' ? food : food.name}
                                {food.amount && <span className="ml-1">({food.amount})</span>}
                              </span>
                              {food.calories && (
                                <span className="font-medium">{food.calories} cal</span>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            {meal.foods}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Macros breakdown */}
                    <div className="mt-3 ml-6 grid grid-cols-3 gap-4 text-xs">
                      {meal.protein && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Protein:</span>
                          <span className="font-medium text-blue-600">{meal.protein}g</span>
                        </div>
                      )}
                      {meal.carbs && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Carbs:</span>
                          <span className="font-medium text-green-600">{meal.carbs}g</span>
                        </div>
                      )}
                      {meal.fat && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fat:</span>
                          <span className="font-medium text-purple-600">{meal.fat}g</span>
                        </div>
                      )}
                    </div>

                    {index < Object.entries(mealPlan.meal_data).length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Plan Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Plan Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-semibold capitalize">{mealPlan.status}</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Target className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Daily Calories</p>
                  <p className="font-semibold">{mealPlan.calories}</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-semibold">{mealPlan.duration_days || 'Ongoing'} days</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-semibold">{formatDate(mealPlan.created_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          {mealPlan.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {mealPlan.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}