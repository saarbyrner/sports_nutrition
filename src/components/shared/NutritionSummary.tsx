/**
 * Nutrition Summary Component
 * 
 * Standardized nutrition information display for consistent presentation
 * across meal plan creation, editing, and viewing interfaces.
 * 
 * Features:
 * - Consistent macro display
 * - Progress indicators
 * - Customizable layouts
 * - Accessibility compliant
 * 
 * @author Claude Code (Expert Software Engineer)
 * @version 1.0.0
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Target, 
  Zap, 
  Dumbbell, 
  Wheat, 
  Droplet,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface NutritionTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

interface NutritionSummaryProps {
  data: NutritionData;
  targets?: NutritionTargets;
  title?: string;
  layout?: 'compact' | 'detailed' | 'cards';
  showProgress?: boolean;
  showPercentages?: boolean;
  className?: string;
}

export default function NutritionSummary({
  data,
  targets,
  title = "Nutrition Summary",
  layout = 'detailed',
  showProgress = false,
  showPercentages = false,
  className
}: NutritionSummaryProps) {
  
  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressStatus = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 90 && percentage <= 110) return 'optimal';
    if (percentage >= 80 && percentage <= 120) return 'good';
    if (percentage < 70 || percentage > 130) return 'warning';
    return 'acceptable';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'acceptable': return 'text-yellow-600';
      case 'warning': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimal': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'good': return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  // Compact layout for quick viewing
  if (layout === 'compact') {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="flex items-center gap-1">
          <Zap className="h-4 w-4 text-orange-500" />
          <span className="font-semibold">{data.calories}</span>
          <span className="text-xs text-muted-foreground">cal</span>
        </div>
        <div className="flex items-center gap-1">
          <Dumbbell className="h-4 w-4 text-blue-500" />
          <span className="font-semibold">{data.protein}g</span>
        </div>
        <div className="flex items-center gap-1">
          <Wheat className="h-4 w-4 text-green-500" />
          <span className="font-semibold">{data.carbs}g</span>
        </div>
        <div className="flex items-center gap-1">
          <Droplet className="h-4 w-4 text-purple-500" />
          <span className="font-semibold">{data.fat}g</span>
        </div>
      </div>
    );
  }

  // Card layout for dashboard display
  if (layout === 'cards') {
    const macros = [
      { name: 'Calories', value: data.calories, unit: '', icon: Zap, color: 'text-orange-600', target: targets?.calories },
      { name: 'Protein', value: data.protein, unit: 'g', icon: Dumbbell, color: 'text-blue-600', target: targets?.protein },
      { name: 'Carbs', value: data.carbs, unit: 'g', icon: Wheat, color: 'text-green-600', target: targets?.carbs },
      { name: 'Fat', value: data.fat, unit: 'g', icon: Droplet, color: 'text-purple-600', target: targets?.fat },
    ];

    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${className}`}>
        {macros.map(({ name, value, unit, icon: Icon, color, target }) => {
          const status = target ? getProgressStatus(value, target) : 'acceptable';
          
          return (
            <Card key={name} className="relative">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-4 w-4 ${color}`} />
                  <span className="text-sm font-medium">{name}</span>
                  {target && getStatusIcon(status)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold">{value}</span>
                    <span className="text-sm text-muted-foreground">{unit}</span>
                  </div>
                  {target && (
                    <div className="text-xs text-muted-foreground">
                      Target: {target}{unit}
                    </div>
                  )}
                  {target && showProgress && (
                    <Progress 
                      value={getProgressPercentage(value, target)} 
                      className="h-1"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  // Detailed layout (default)
  const macros = [
    { name: 'Calories', value: data.calories, unit: '', icon: Zap, color: 'text-orange-600', target: targets?.calories },
    { name: 'Protein', value: data.protein, unit: 'g', icon: Dumbbell, color: 'text-blue-600', target: targets?.protein },
    { name: 'Carbohydrates', value: data.carbs, unit: 'g', icon: Wheat, color: 'text-green-600', target: targets?.carbs },
    { name: 'Fat', value: data.fat, unit: 'g', icon: Droplet, color: 'text-purple-600', target: targets?.fat },
  ];

  if (data.fiber !== undefined) {
    macros.push({ name: 'Fiber', value: data.fiber, unit: 'g', icon: Wheat, color: 'text-emerald-600', target: targets?.fiber });
  }

  return (
    <Card className={className}>
      {title && (
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-4">
          {macros.map(({ name, value, unit, icon: Icon, color, target }) => {
            const status = target ? getProgressStatus(value, target) : null;
            const percentage = target ? getProgressPercentage(value, target) : null;
            
            return (
              <div key={name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${color}`} />
                    <span className="font-medium">{name}</span>
                    {status && getStatusIcon(status)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {value}{unit}
                    </span>
                    {target && (
                      <span className="text-sm text-muted-foreground">
                        / {target}{unit}
                      </span>
                    )}
                    {showPercentages && percentage && (
                      <Badge variant="outline" className="text-xs">
                        {Math.round(percentage)}%
                      </Badge>
                    )}
                  </div>
                </div>
                
                {showProgress && target && (
                  <div className="space-y-1">
                    <Progress 
                      value={percentage || 0}
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className={status ? getStatusColor(status) : ''}>
                        {status === 'optimal' ? 'Optimal' : 
                         status === 'good' ? 'Good' :
                         status === 'warning' ? 'Needs attention' : 'Acceptable'}
                      </span>
                      <span>{Math.round(percentage || 0)}% of target</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Additional nutrition info */}
        {(data.sugar !== undefined || data.sodium !== undefined) && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-medium mb-3">Additional Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {data.sugar !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sugar:</span>
                  <span>{data.sugar}g</span>
                </div>
              )}
              {data.sodium !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sodium:</span>
                  <span>{data.sodium}mg</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Quick nutrition display for inline use
 */
export function QuickNutritionSummary({ data }: { data: NutritionData }) {
  return (
    <NutritionSummary 
      data={data} 
      layout="compact"
      className="inline-flex"
    />
  );
}

/**
 * Nutrition cards for dashboard
 */
export function NutritionCards({ 
  data, 
  targets,
  showProgress = true 
}: { 
  data: NutritionData; 
  targets?: NutritionTargets;
  showProgress?: boolean;
}) {
  return (
    <NutritionSummary 
      data={data} 
      targets={targets}
      layout="cards"
      showProgress={showProgress}
      showPercentages={true}
    />
  );
}