/**
 * Real-time Nutrition Validation Component
 * 
 * Provides instant feedback on nutrition quality with expert recommendations.
 * Integrates seamlessly into meal planning workflow.
 * 
 * Features:
 * - Real-time validation as users add/remove foods
 * - Visual nutrition indicators with traffic light system
 * - Progressive disclosure of validation details
 * - Actionable recommendations with one-click fixes
 * - Context-aware feedback (training vs rest days)
 * - Accessible design with screen reader support
 * 
 * UX Design Principles:
 * - Non-intrusive feedback that doesn't interrupt flow
 * - Positive reinforcement for good choices
 * - Clear visual hierarchy for priorities
 * - Educational tooltips for learning
 * - Mobile-optimized condensed view
 * 
 * @author Claude Code (Expert UX Designer & Sports Nutritionist)
 * @version 2.0.0 - Real-time Nutrition Validation
 */

import React, { useState, useMemo } from 'react'
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Zap, 
  Heart,
  ChevronDown,
  ChevronUp,
  Info,
  Target,
  Clock,
  Droplets,
  Activity,
  Plus
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Separator } from '../ui/separator'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'
import {
  ValidationResult,
  ValidationLevel,
  NutritionSummary,
  MealItem,
  AthleteProfile,
  validateNutrition,
  calculateNutritionSummary
} from '../../lib/nutrition/nutritionValidator'

interface NutritionValidationProps {
  meals: MealItem[]
  profile: AthleteProfile
  onRecommendationClick?: (recommendation: any) => void
  compact?: boolean
  className?: string
}

const LEVEL_COLORS = {
  [ValidationLevel.EXCELLENT]: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: 'text-green-600',
    progress: 'bg-green-500'
  },
  [ValidationLevel.GOOD]: {
    bg: 'bg-blue-50',
    border: 'border-blue-200', 
    text: 'text-blue-800',
    icon: 'text-blue-600',
    progress: 'bg-blue-500'
  },
  [ValidationLevel.FAIR]: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: 'text-yellow-600',
    progress: 'bg-yellow-500'
  },
  [ValidationLevel.POOR]: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-800',
    icon: 'text-orange-600',
    progress: 'bg-orange-500'
  },
  [ValidationLevel.CRITICAL]: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: 'text-red-600',
    progress: 'bg-red-500'
  }
}

const LEVEL_ICONS = {
  [ValidationLevel.EXCELLENT]: CheckCircle,
  [ValidationLevel.GOOD]: CheckCircle,
  [ValidationLevel.FAIR]: AlertTriangle,
  [ValidationLevel.POOR]: AlertTriangle,
  [ValidationLevel.CRITICAL]: XCircle
}

export function NutritionValidation({ 
  meals, 
  profile, 
  onRecommendationClick,
  compact = false,
  className = ''
}: NutritionValidationProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  
  // Calculate validation in real-time
  const validation = useMemo(() => {
    return validateNutrition(meals, profile)
  }, [meals, profile])
  
  const summary = useMemo(() => {
    return calculateNutritionSummary(meals, profile)
  }, [meals, profile])
  
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }
  
  const overallColors = LEVEL_COLORS[validation.overall]
  const OverallIcon = LEVEL_ICONS[validation.overall]
  
  if (compact) {
    return (
      <Card className={`${overallColors.bg} ${overallColors.border} ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <OverallIcon className={`w-5 h-5 ${overallColors.icon}`} />
              <div>
                <span className={`font-medium ${overallColors.text}`}>
                  Nutrition Score: {validation.score}/100
                </span>
                <p className="text-xs text-muted-foreground">
                  {validation.overall.charAt(0).toUpperCase() + validation.overall.slice(1)} balance
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
          
          {showDetails && (
            <div className="mt-4 space-y-2">
              <Progress 
                value={validation.score} 
                className="h-2"
                
              />
              <div className="text-xs space-y-1">
                {validation.recommendations.slice(0, 2).map((rec, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    <span>{rec.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
  
  return (
    <TooltipProvider>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Nutrition Analysis
              <Badge variant="outline">{validation.score}/100</Badge>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${overallColors.bg} ${overallColors.border}`}>
              <OverallIcon className={`w-4 h-4 ${overallColors.icon}`} />
              <span className={`text-sm font-medium ${overallColors.text}`}>
                {validation.overall.charAt(0).toUpperCase() + validation.overall.slice(1)}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Nutrition Score</span>
              <span className="font-medium">{validation.score}/100</span>
            </div>
            <Progress value={validation.score} className="h-3" />
          </div>
          
          {/* Quick Nutrition Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{summary.calories}</div>
              <div className="text-xs text-muted-foreground">calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{summary.protein}g</div>
              <div className="text-xs text-muted-foreground">protein</div>
              <div className="text-xs text-muted-foreground">({summary.proteinPerKg}g/kg)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{summary.carbs}g</div>
              <div className="text-xs text-muted-foreground">carbs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{summary.fat}g</div>
              <div className="text-xs text-muted-foreground">fat</div>
            </div>
          </div>
          
          {/* Priority Recommendations */}
          {validation.recommendations.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Top Recommendations
              </h3>
              {validation.recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className={`p-1 rounded-full ${
                    rec.priority === 'high' ? 'bg-red-100' : 
                    rec.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    <Target className={`w-3 h-3 ${
                      rec.priority === 'high' ? 'text-red-600' : 
                      rec.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">{rec.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
                    {rec.expectedImpact && (
                      <p className="text-xs text-green-600 mt-1">💡 {rec.expectedImpact}</p>
                    )}
                  </div>
                  {onRecommendationClick && (
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => onRecommendationClick(rec)}
                      className="h-8 px-2"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Warnings */}
          {validation.warnings.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2 text-orange-600">
                <AlertTriangle className="w-4 h-4" />
                Nutrition Alerts
              </h3>
              {validation.warnings.map((warning, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  warning.severity === 'error' ? 'bg-red-50 border-red-200' :
                  warning.severity === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <p className="text-sm font-medium">{warning.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{warning.recommendation}</p>
                </div>
              ))}
            </div>
          )}
          
          {/* Detailed Categories */}
          <Collapsible open={showDetails} onOpenChange={setShowDetails}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                <span>Detailed Analysis</span>
                {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-4 mt-4">
              {Object.entries(validation.categories).map(([key, category]) => {
                const colors = LEVEL_COLORS[category.level]
                const Icon = key === 'calories' ? Zap :
                           key === 'macros' ? Target :
                           key === 'micronutrients' ? Heart :
                           key === 'timing' ? Clock :
                           Droplets
                
                return (
                  <div key={key} className={`p-4 rounded-lg ${colors.bg} ${colors.border} border`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${colors.icon}`} />
                        <span className="font-medium capitalize">{key}</span>
                        <Badge variant="outline" className={colors.text}>
                          {category.score}/100
                        </Badge>
                      </div>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{category.message}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    
                    <Progress value={category.score} className="h-2 mb-3" />
                    
                    <p className={`text-sm ${colors.text} mb-2`}>{category.message}</p>
                    
                    {category.details.length > 0 && (
                      <Collapsible>
                        <CollapsibleTrigger 
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => toggleSection(key)}
                        >
                          {expandedSections.has(key) ? 'Hide details' : 'Show details'}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2">
                          <ul className="text-xs space-y-1">
                            {category.details.map((detail, index) => (
                              <li key={index} className="text-muted-foreground">
                                • {detail}
                              </li>
                            ))}
                          </ul>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </div>
                )
              })}
            </CollapsibleContent>
          </Collapsible>
          
          {/* Educational Footer */}
          <div className="text-xs text-muted-foreground border-t pt-4">
            <p>
              💡 Nutrition targets are personalized for {profile.sport} athletes. 
              {profile.isTrainingDay ? ' Training day recommendations active.' : ' Rest day recommendations active.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

/**
 * Simplified validation indicator for inline use
 */
export function NutritionIndicator({ 
  level, 
  score, 
  className = '' 
}: { 
  level: ValidationLevel
  score: number
  className?: string 
}) {
  const colors = LEVEL_COLORS[level]
  const Icon = LEVEL_ICONS[level]
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Icon className={`w-4 h-4 ${colors.icon}`} />
      <span className={`text-sm font-medium ${colors.text}`}>
        {score}/100
      </span>
    </div>
  )
}