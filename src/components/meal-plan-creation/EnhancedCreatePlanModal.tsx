/**
 * Enhanced Create Plan Modal with Full Integration
 * 
 * Complete meal plan creation workflow integrating:
 * - Real food database with search
 * - Visual template library  
 * - Real-time nutrition validation
 * - Progressive disclosure UX
 * 
 * UX Design Principles:
 * - Multiple pathways: Quick AI, Template-based, Custom build
 * - Real-time validation and feedback
 * - Visual food and template selection
 * - Expert guidance throughout
 * 
 * @author Claude Code (Expert Software Engineer & UX Designer)
 * @version 3.0.0 - Full Integration
 */

import React, { useState, useCallback, useMemo } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { 
  Brain,
  Sparkles,
  CheckCircle,
  X,
  AlertTriangle,
  Zap,
  Clock,
  Target,
  Rocket,
  BookOpen,
  ChefHat,
  Search,
  Grid,
  Utensils
} from 'lucide-react'

// Import our new integrated components
import { TemplateLibrary } from './TemplateLibrary'
import { FoodSelector } from './FoodSelector'
import { NutritionValidation } from './NutritionValidation'

// Import services and types
import { useUnifiedMealPlan } from '@/hooks/useUnifiedMealPlan'
import { CreateMealPlanData } from '@/lib/services/types'
import { PlayerSelector } from '../shared/PlayerSelector'
import { NutritionSummary } from '../shared/NutritionSummary'
import { foodSearch } from '@/lib/data/foodDatabase'
import { 
  AthleteProfile, 
  MealItem, 
  validateNutrition,
  calculateNutritionSummary 
} from '@/lib/nutrition/nutritionValidator'

interface EnhancedCreatePlanModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPlanCreate?: () => void
}

type CreationMode = 'select' | 'ai' | 'template' | 'custom'
type CreationStep = 'setup' | 'build' | 'validate' | 'preview' | 'success'

export function EnhancedCreatePlanModal({ 
  open, 
  onOpenChange, 
  onPlanCreate
}: EnhancedCreatePlanModalProps) {
  // State management
  const [mode, setMode] = useState<CreationMode>('select')
  const [step, setStep] = useState<CreationStep>('setup')
  const [selectedPlayer, setSelectedPlayer] = useState('')
  const [planTitle, setPlanTitle] = useState('')
  const [planType, setPlanType] = useState('')
  const [duration, setDuration] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  
  // Meal planning state
  const [selectedMeals, setSelectedMeals] = useState<MealItem[]>([])
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false)
  const [showFoodSelector, setShowFoodSelector] = useState(false)
  
  // Services
  const { createMealPlan, loading: mealPlanLoading } = useUnifiedMealPlan()

  // Build athlete profile for validation
  const athleteProfile: AthleteProfile | null = useMemo(() => {
    if (!selectedPlayer || !planType) return null
    
    // In a real app, this would come from player data
    return {
      age: 25,
      gender: 'male',
      weight: 80,
      height: 180,
      sport: planType || 'general',
      trainingIntensity: 'high',
      trainingFrequency: 5,
      primaryGoal: 'performance',
      isTrainingDay: true,
      dietaryRestrictions: [],
      mealsPerDay: 3
    }
  }, [selectedPlayer, planType])

  // Calculate nutrition summary
  const nutritionSummary = useMemo(() => {
    if (!athleteProfile || selectedMeals.length === 0) return null
    return calculateNutritionSummary(selectedMeals, athleteProfile)
  }, [selectedMeals, athleteProfile])

  // Validation results
  const validationResults = useMemo(() => {
    if (!athleteProfile || selectedMeals.length === 0) return null
    return validateNutrition(selectedMeals, athleteProfile)
  }, [selectedMeals, athleteProfile])

  const handleClose = useCallback(() => {
    setMode('select')
    setStep('setup')
    setSelectedPlayer('')
    setPlanTitle('')
    setPlanType('')
    setDuration('')
    setSelectedMeals([])
    setIsGenerating(false)
    onOpenChange(false)
  }, [onOpenChange])


  const handleTemplateSelect = useCallback((template: any) => {
    // Convert template to meal items
    const templateMeals: MealItem[] = template.previewMeals.map((meal: any, index: number) => {
      // Find food in database or create mock
      const food = foodSearch.search(meal.mainIngredients[0])[0] || {
        id: `template-food-${index}`,
        name: meal.name,
        category: 'proteins' as any,
        nutrition: {
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.calories * 0.4 / 4, // Estimate
          fat: meal.calories * 0.3 / 9 // Estimate
        },
        portions: [
          { id: 'default', name: '1 serving', grams: 100, isDefault: true }
        ],
        dietaryInfo: {
          vegetarian: false,
          vegan: false,
          glutenFree: true,
          dairyFree: true,
          nutFree: true,
          allergens: [],
          tags: []
        },
        searchTerms: [meal.name.toLowerCase()],
        verified: false,
        lastUpdated: new Date().toISOString()
      }

      return {
        food,
        portionId: 'default',
        quantity: 1,
        mealType: meal.type as any
      }
    })

    setSelectedMeals(templateMeals)
    setPlanTitle(template.name)
    setShowTemplateLibrary(false)
    setStep('validate')
  }, [])

  const handleFoodAdd = useCallback((foodItem: any, portion: any, quantity: number, mealType: string) => {
    const newMeal: MealItem = {
      food: foodItem,
      portionId: portion.id,
      quantity,
      mealType: mealType as any
    }
    
    setSelectedMeals(prev => [...prev, newMeal])
    setShowFoodSelector(false)
  }, [])

  const handleCreatePlan = useCallback(async () => {
    if (!selectedPlayer || !planTitle || selectedMeals.length === 0) return

    setIsGenerating(true)
    try {
      // Convert meals to plan format
      const planData: CreateMealPlanData = {
        title: planTitle,
        player_id: selectedPlayer,
        plan_type: planType || 'custom',
        duration: duration || '7 days',
        description: `Custom meal plan with ${selectedMeals.length} meals`,
        nutrition_targets: nutritionSummary || {
          calories: 2000,
          protein: 150,
          carbs: 200,
          fat: 80
        },
        meals: selectedMeals.map(meal => ({
          name: meal.food.name,
          type: meal.mealType,
          calories: meal.food.nutrition.calories * (meal.food.portions.find(p => p.id === meal.portionId)?.grams || 100) / 100 * meal.quantity,
          protein: meal.food.nutrition.protein * (meal.food.portions.find(p => p.id === meal.portionId)?.grams || 100) / 100 * meal.quantity,
          carbs: meal.food.nutrition.carbs * (meal.food.portions.find(p => p.id === meal.portionId)?.grams || 100) / 100 * meal.quantity,
          fat: meal.food.nutrition.fat * (meal.food.portions.find(p => p.id === meal.portionId)?.grams || 100) / 100 * meal.quantity,
          ingredients: [meal.food.name],
          instructions: `Prepare ${meal.quantity} × ${meal.food.portions.find(p => p.id === meal.portionId)?.name || 'serving'} of ${meal.food.name}`
        })),
        preferences: {
          dietary_restrictions: [],
          allergies: [],
          preferred_foods: selectedMeals.map(m => m.food.name),
          disliked_foods: []
        }
      }

      const result = await createMealPlan(planData)
      if (result.success) {
        setStep('success')
        onPlanCreate?.()
      } else {
        console.error('Failed to create meal plan:', result.error)
      }
    } catch (error) {
      console.error('Error creating meal plan:', error)
    } finally {
      setIsGenerating(false)
    }
  }, [selectedPlayer, planTitle, planType, duration, selectedMeals, nutritionSummary, createMealPlan, onPlanCreate])

  const canProceed = selectedPlayer && planTitle && (planType || selectedMeals.length > 0)

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ChefHat className="w-5 h-5" />
              Create Nutrition Plan
              {mode !== 'select' && (
                <Badge variant="outline" className="ml-2">
                  {mode === 'ai' ? 'AI Generated' : 
                   mode === 'template' ? 'Template Based' : 
                   mode === 'custom' ? 'Custom Build' : 'Quick Setup'}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              {step === 'setup' && 'Choose your creation method and set up plan details'}
              {step === 'build' && 'Add meals and foods to your plan'}
              {step === 'validate' && 'Review nutrition and make adjustments'}
              {step === 'preview' && 'Final review before creating'}
              {step === 'success' && 'Plan created successfully!'}
            </DialogDescription>
          </DialogHeader>

          {/* Combined Setup Step with Mode Selection */}
          {step === 'setup' && (
            <div className="space-y-6 py-4">
              {/* Creation Method Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Creation Method</label>
                <div className="grid md:grid-cols-3 gap-3">
                  <Card 
                    className={`cursor-pointer transition-all border-2 ${
                      mode === 'ai' ? 'border-blue-500 bg-blue-50' : 'border-dashed hover:border-blue-300'
                    }`}
                    onClick={() => setMode('ai')}
                  >
                    <CardContent className="p-4 text-center">
                      <Brain className={`w-8 h-8 mx-auto mb-2 ${mode === 'ai' ? 'text-blue-600' : 'text-blue-500'}`} />
                      <h3 className="font-medium text-sm">AI Generated</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Smart nutrition plans
                      </p>
                      {mode === 'ai' && <Badge className="mt-2 bg-blue-100 text-blue-700 text-xs">Selected</Badge>}
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer transition-all border-2 ${
                      mode === 'template' ? 'border-green-500 bg-green-50' : 'border-dashed hover:border-green-300'
                    }`}
                    onClick={() => setMode('template')}
                  >
                    <CardContent className="p-4 text-center">
                      <BookOpen className={`w-8 h-8 mx-auto mb-2 ${mode === 'template' ? 'text-green-600' : 'text-green-500'}`} />
                      <h3 className="font-medium text-sm">Template Library</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Expert-designed plans
                      </p>
                      {mode === 'template' && <Badge className="mt-2 bg-green-100 text-green-700 text-xs">Selected</Badge>}
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer transition-all border-2 ${
                      mode === 'custom' ? 'border-purple-500 bg-purple-50' : 'border-dashed hover:border-purple-300'
                    }`}
                    onClick={() => setMode('custom')}
                  >
                    <CardContent className="p-4 text-center">
                      <Target className={`w-8 h-8 mx-auto mb-2 ${mode === 'custom' ? 'text-purple-600' : 'text-purple-500'}`} />
                      <h3 className="font-medium text-sm">Custom Build</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Build from scratch
                      </p>
                      {mode === 'custom' && <Badge className="mt-2 bg-purple-100 text-purple-700 text-xs">Selected</Badge>}
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Plan Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Player</label>
                  <PlayerSelector
                    value={selectedPlayer}
                    onPlayerSelect={setSelectedPlayer}
                    placeholder="Choose a player..."
                    variant="basic"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Plan Title</label>
                  <Input
                    placeholder="e.g., Pre-Season Training Plan"
                    value={planTitle}
                    onChange={(e) => setPlanTitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Plan Type</label>
                  <Select value={planType || ""} onValueChange={setPlanType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strength">Strength Training</SelectItem>
                      <SelectItem value="endurance">Endurance</SelectItem>
                      <SelectItem value="weight_loss">Weight Loss</SelectItem>
                      <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                      <SelectItem value="recovery">Recovery</SelectItem>
                      <SelectItem value="competition">Competition Prep</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="1"
                      max="365"
                      placeholder="1"
                      value={duration.match(/\d+/)?.[0] || ''}
                      onChange={(e) => {
                        const num = e.target.value;
                        const unit = duration.includes('week') ? 'week' : duration.includes('month') ? 'month' : 'day';
                        setDuration(num ? `${num}_${unit}${parseInt(num) !== 1 ? 's' : ''}` : '');
                      }}
                      className="w-20"
                    />
                    <Select 
                      value={duration.includes('week') ? 'weeks' : duration.includes('month') ? 'months' : 'days'} 
                      onValueChange={(unit) => {
                        const num = duration.match(/\d+/)?.[0] || '1';
                        const singular = unit.slice(0, -1);
                        setDuration(`${num}_${parseInt(num) !== 1 ? unit : singular}`);
                      }}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                        <SelectItem value="months">Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Build Step - Template or Custom */}
          {step === 'build' && (
            <div className="space-y-4 py-4">
              {mode === 'template' && (
                <div className="text-center">
                  <Button 
                    onClick={() => setShowTemplateLibrary(true)}
                    className="mb-4"
                  >
                    <Grid className="w-4 h-4 mr-2" />
                    Browse Template Library
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Choose from expert-designed meal plan templates
                  </p>
                </div>
              )}

              {mode === 'custom' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Build Your Meal Plan</h3>
                    <Button 
                      onClick={() => setShowFoodSelector(true)}
                      variant="outline"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Add Foods
                    </Button>
                  </div>
                  
                  {selectedMeals.length === 0 ? (
                    <Card className="border-dashed border-2 p-8 text-center">
                      <Utensils className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                      <p className="text-muted-foreground">
                        No meals added yet. Click "Add Foods" to start building your plan.
                      </p>
                    </Card>
                  ) : (
                    <div className="space-y-2">
                      {selectedMeals.map((meal, index) => (
                        <Card key={index}>
                          <CardContent className="p-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">{meal.food.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {meal.mealType} • {meal.quantity}x {meal.food.portions.find(p => p.id === meal.portionId)?.name}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedMeals(prev => prev.filter((_, i) => i !== index))}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Validation Step */}
          {step === 'validate' && athleteProfile && (
            <div className="py-4">
              <NutritionValidation
                meals={selectedMeals}
                profile={athleteProfile}
                compact={false}
              />
            </div>
          )}

          {/* Preview Step */}
          {step === 'preview' && nutritionSummary && (
            <div className="space-y-4 py-4">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Plan Summary</h3>
                      <Badge className="bg-green-100 text-green-800">
                        Ready to Create
                      </Badge>
                    </div>
                    <NutritionSummary data={nutritionSummary} layout="detailed" />
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Plan Details</h4>
                  <div className="space-y-1 text-sm">
                    <div>Title: {planTitle}</div>
                    <div>Type: {planType}</div>
                    <div>Duration: {duration}</div>
                    <div>Meals: {selectedMeals.length}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Validation Status</h4>
                  {validationResults && (
                    <div className="text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Score: {validationResults.score}/100</span>
                      </div>
                      <div className="text-muted-foreground mt-1">
                        {validationResults.overall} nutrition balance
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Plan Created Successfully!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  The nutrition plan has been added to the player's profile
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {step === 'setup' && mode === 'ai' && (
                <>
                  <Brain className="w-4 h-4" />
                  <span>AI-powered generation</span>
                </>
              )}
              {step === 'validate' && validationResults && (
                <>
                  <Target className="w-4 h-4" />
                  <span>Nutrition Score: {validationResults.score}/100</span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {step !== 'setup' && step !== 'success' && (
                <Button variant="outline" onClick={() => setStep('setup')}>
                  Back
                </Button>
              )}
              
              {step === 'setup' && (
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
              )}
              
              {step === 'setup' && mode !== 'select' && (
                <Button 
                  onClick={() => setStep(mode === 'template' ? 'build' : mode === 'ai' ? 'preview' : 'build')}
                  disabled={!canProceed}
                >
                  {mode === 'ai' ? 'Generate Plan' : 'Continue'}
                </Button>
              )}
              
              {step === 'build' && selectedMeals.length > 0 && (
                <Button onClick={() => setStep('validate')}>
                  Validate Nutrition
                </Button>
              )}
              
              {step === 'validate' && (
                <Button onClick={() => setStep('preview')}>
                  Preview Plan
                </Button>
              )}
              
              {step === 'preview' && (
                <Button 
                  onClick={handleCreatePlan} 
                  disabled={mealPlanLoading || isGenerating}
                >
                  {mealPlanLoading || isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 mr-2" />
                      Create Plan
                    </>
                  )}
                </Button>
              )}
              
              {step === 'success' && (
                <Button onClick={handleClose}>
                  Close
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Library Modal */}
      <TemplateLibrary
        open={showTemplateLibrary}
        onOpenChange={setShowTemplateLibrary}
        onTemplateSelect={handleTemplateSelect}
        playerContext={{
          sport: planType,
          goals: [planType],
          dietaryRestrictions: []
        }}
      />

      {/* Food Selector Modal */}
      <Dialog open={showFoodSelector} onOpenChange={setShowFoodSelector}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Add Foods to Meal Plan</DialogTitle>
            <DialogDescription>
              Search and select foods to add to your custom meal plan
            </DialogDescription>
          </DialogHeader>
          <FoodSelector
            onFoodSelect={handleFoodAdd}
            playerProfile={athleteProfile || undefined}
            className="h-[60vh]"
          />
        </DialogContent>
      </Dialog>
    </>
  )
}