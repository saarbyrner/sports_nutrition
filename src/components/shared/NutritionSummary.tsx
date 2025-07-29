/**
 * Nutrition Summary Component
 * 
 * Standardized nutrition information display for consistent presentation
 * across meal plan creation, editing, and viewing interfaces.
 * 
 * @author Claude Code (Expert Software Engineer)
 * @version 1.0.0
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Target, Activity, TrendingUp, Zap } from 'lucide-react';

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

interface NutritionTarget extends NutritionData {
  // Optional target values for progress calculation
}

interface NutritionSummaryProps {
  data: NutritionData;
  target?: NutritionTarget;
  title?: string;
  layout?: 'compact' | 'detailed' | 'cards';
  showProgress?: boolean;
  className?: string;
}

export function NutritionSummary({
  data,
  target,
  title = "Nutrition Summary",
  layout = 'detailed',
  showProgress = true,
  className = ""
}: NutritionSummaryProps) {
  const calculateProgress = (current: number, targetValue: number) => {
    if (!targetValue) return 0;
    return Math.min((current / targetValue) * 100, 100);
  };

  if (layout === 'compact') {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="w-4 h-4" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Calories:</span>
              <span className="font-medium">{data.calories}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Protein:</span>
              <span className="font-medium text-blue-600">{data.protein}g</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Carbs:</span>
              <span className="font-medium text-green-600">{data.carbs}g</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fat:</span>
              <span className="font-medium text-purple-600">{data.fat}g</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (layout === 'cards') {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-sm text-muted-foreground">Calories</p>
            <p className="text-lg font-bold">{data.calories}</p>
            {target && showProgress && (
              <Progress 
                value={calculateProgress(data.calories, target.calories)} 
                className="h-1 mt-2" 
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Activity className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-sm text-muted-foreground">Protein</p>
            <p className="text-lg font-bold text-blue-600">{data.protein}g</p>
            {target && showProgress && (
              <Progress 
                value={calculateProgress(data.protein, target.protein)} 
                className="h-1 mt-2" 
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground">Carbs</p>
            <p className="text-lg font-bold text-green-600">{data.carbs}g</p>
            {target && showProgress && (
              <Progress 
                value={calculateProgress(data.carbs, target.carbs)} 
                className="h-1 mt-2" 
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-sm text-muted-foreground">Fat</p>
            <p className="text-lg font-bold text-purple-600">{data.fat}g</p>
            {target && showProgress && (
              <Progress 
                value={calculateProgress(data.fat, target.fat)} 
                className="h-1 mt-2" 
              />
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default 'detailed' layout
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 border rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-sm text-muted-foreground">Calories</p>
            <p className="text-xl font-bold">{data.calories}</p>
            {target && showProgress && (
              <Progress 
                value={calculateProgress(data.calories, target.calories)} 
                className="h-2 mt-2" 
              />
            )}
          </div>

          <div className="text-center p-3 border rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Activity className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-sm text-muted-foreground">Protein</p>
            <p className="text-xl font-bold text-blue-600">{data.protein}g</p>
            {target && showProgress && (
              <Progress 
                value={calculateProgress(data.protein, target.protein)} 
                className="h-2 mt-2" 
              />
            )}
          </div>

          <div className="text-center p-3 border rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground">Carbs</p>
            <p className="text-xl font-bold text-green-600">{data.carbs}g</p>
            {target && showProgress && (
              <Progress 
                value={calculateProgress(data.carbs, target.carbs)} 
                className="h-2 mt-2" 
              />
            )}
          </div>

          <div className="text-center p-3 border rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-sm text-muted-foreground">Fat</p>
            <p className="text-xl font-bold text-purple-600">{data.fat}g</p>
            {target && showProgress && (
              <Progress 
                value={calculateProgress(data.fat, target.fat)} 
                className="h-2 mt-2" 
              />
            )}
          </div>
        </div>

        {data.fiber && (
          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Fiber:</span>
              <Badge variant="outline" className="text-sm">
                {data.fiber}g
              </Badge>
            </div>
          </div>
        )}

        {target && showProgress && (
          <div className="pt-2 border-t text-xs text-muted-foreground">
            <p>Progress shown relative to targets</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}