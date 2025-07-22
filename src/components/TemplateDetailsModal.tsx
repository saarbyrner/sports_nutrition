/**
 * Template Details Modal
 * 
 * Read-only template viewing component with full nutrition breakdown.
 * Safe implementation with no editing capabilities.
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
import { Separator } from './ui/separator';
import { 
  BookOpen,
  Clock,
  Users,
  Calendar,
  Tag,
  Target,
  Utensils
} from 'lucide-react';
import { Template } from '@/lib/services/types';
import { NutritionSummary } from './shared/NutritionSummary';

interface TemplateDetailsModalProps {
  template: Template | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TemplateDetailsModal({
  template,
  open,
  onOpenChange
}: TemplateDetailsModalProps) {
  if (!template) return null;

  const nutritionData = {
    calories: template.calories || 0,
    protein: template.protein || 0,
    carbs: template.carbs || 0,
    fat: template.fat || 0,
    fiber: template.fiber || 0
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            {template.name}
          </DialogTitle>
          <DialogDescription>
            Template details and nutrition breakdown
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Template Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <p className="text-sm mt-1">
                      {template.description || 'No description provided'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Category</label>
                    <div className="mt-1">
                      {template.category ? (
                        <Badge variant="outline" className="text-sm">
                          {template.category}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">Uncategorized</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tags</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.tags && template.tags.length > 0 ? (
                        template.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No tags</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">{template.times_used}</span> times used
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      Created {new Date(template.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">{template.calories}</span> calories per day
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nutrition Breakdown */}
          <NutritionSummary 
            data={nutritionData}
            title="Nutrition Breakdown"
            layout="detailed"
            showProgress={false}
          />

          {/* Meal Plan Details */}
          {template.meal_plan && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Utensils className="w-5 h-5" />
                  Daily Meal Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(template.meal_plan).map(([mealType, meal]: [string, any], index) => (
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
                          // Handle array of food objects or strings
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
                          // Handle single food description
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

                    {index < Object.entries(template.meal_plan).length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Template Usage Notes */}
          {template.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Usage Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {template.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}