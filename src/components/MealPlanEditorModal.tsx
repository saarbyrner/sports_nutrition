/**
 * Meal Plan Editor Modal
 * 
 * Full-featured meal plan editing component with comprehensive validation.
 * Supports creating new meal plans and editing existing ones with player assignment.
 * 
 * @author Claude Code (Expert Software Engineer)
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  Utensils,
  Plus,
  Minus,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Target,
  Calendar,
  Activity
} from 'lucide-react';
import { MealPlan } from '@/lib/services/types';
import { PlayerSelector } from './shared/PlayerSelector';
import { NutritionSummary } from './shared/NutritionSummary';

interface MealPlanEditorModalProps {
  mealPlan?: MealPlan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (mealPlan: Partial<MealPlan>) => Promise<boolean>;
  mode: 'create' | 'edit';
}

interface MealData {
  time: string;
  foods: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface FormData {
  title: string;
  description: string;
  player_id: string;
  plan_type: 'training' | 'competition' | 'recovery' | 'general';
  status: 'draft' | 'active' | 'completed' | 'archived';
  start_date: string;
  end_date: string;
  duration_days: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  notes: string;
  meal_data: {
    breakfast: MealData;
    lunch: MealData;
    dinner: MealData;
    snacks?: MealData;
  };
}

const DEFAULT_MEAL: MealData = {
  time: '',
  foods: [''],
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0
};

const DEFAULT_FORM_DATA: FormData = {
  title: '',
  description: '',
  player_id: '',
  plan_type: 'general',
  status: 'draft',
  start_date: new Date().toISOString().split('T')[0],
  end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  duration_days: 30,
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
  notes: '',
  meal_data: {
    breakfast: { ...DEFAULT_MEAL, time: '8:00 AM' },
    lunch: { ...DEFAULT_MEAL, time: '12:00 PM' },
    dinner: { ...DEFAULT_MEAL, time: '6:00 PM' }
  }
};

const PLAN_TYPES = [
  { value: 'training', label: 'Training', color: 'bg-blue-100 text-blue-800' },
  { value: 'competition', label: 'Competition', color: 'bg-red-100 text-red-800' },
  { value: 'recovery', label: 'Recovery', color: 'bg-green-100 text-green-800' },
  { value: 'general', label: 'General', color: 'bg-gray-100 text-gray-800' }
];

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
  { value: 'completed', label: 'Completed', color: 'bg-blue-100 text-blue-800' },
  { value: 'archived', label: 'Archived', color: 'bg-gray-100 text-gray-800' }
];

export default function MealPlanEditorModal({
  mealPlan,
  open,
  onOpenChange,
  onSave,
  mode
}: MealPlanEditorModalProps) {
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Initialize form data when meal plan changes
  useEffect(() => {
    if (mealPlan && mode === 'edit') {
      const startDate = mealPlan.start_date || new Date().toISOString().split('T')[0];
      const endDate = mealPlan.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      setFormData({
        title: mealPlan.title || '',
        description: mealPlan.description || '',
        player_id: mealPlan.player_id || '',
        plan_type: mealPlan.plan_type || 'general',
        status: mealPlan.status || 'draft',
        start_date: startDate,
        end_date: endDate,
        duration_days: mealPlan.duration_days || calculateDurationDays(startDate, endDate),
        calories: mealPlan.calories || 0,
        protein: mealPlan.protein || 0,
        carbs: mealPlan.carbs || 0,
        fat: mealPlan.fat || 0,
        fiber: mealPlan.fiber || 0,
        notes: mealPlan.notes || '',
        meal_data: {
          breakfast: mealPlan.meal_data?.breakfast || { ...DEFAULT_MEAL, time: '8:00 AM' },
          lunch: mealPlan.meal_data?.lunch || { ...DEFAULT_MEAL, time: '12:00 PM' },
          dinner: mealPlan.meal_data?.dinner || { ...DEFAULT_MEAL, time: '6:00 PM' },
          ...(mealPlan.meal_data?.snacks && { snacks: mealPlan.meal_data.snacks })
        }
      });
    } else if (mode === 'create') {
      setFormData(DEFAULT_FORM_DATA);
    }
  }, [mealPlan, mode, open]);

  const calculateDurationDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.title.trim()) {
      newErrors.title = 'Plan title is required';
    }

    if (!formData.player_id) {
      newErrors.player_id = 'Player assignment is required';
    }

    if (formData.calories <= 0) {
      newErrors.calories = 'Calories must be greater than 0';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }

    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    }

    // Date validation
    if (formData.start_date && formData.end_date && new Date(formData.start_date) >= new Date(formData.end_date)) {
      newErrors.date_range = 'End date must be after start date';
    }

    // Validate each meal
    Object.entries(formData.meal_data).forEach(([mealType, meal]) => {
      if (!meal.time) {
        newErrors[`${mealType}_time`] = `${mealType} time is required`;
      }
      if (meal.foods.length === 0 || meal.foods.every(f => !f.trim())) {
        newErrors[`${mealType}_foods`] = `${mealType} must have at least one food item`;
      }
      if (meal.calories <= 0) {
        newErrors[`${mealType}_calories`] = `${mealType} calories must be greater than 0`;
      }
    });

    // Check if nutrition totals match
    const totalCalories = Object.values(formData.meal_data).reduce((sum, meal) => sum + meal.calories, 0);
    if (Math.abs(totalCalories - formData.calories) > 50) {
      newErrors.nutrition_mismatch = 'Total meal calories should roughly match plan calories';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotalNutrition = () => {
    const totals = Object.values(formData.meal_data).reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    // Auto-update form totals if they're significantly different
    if (Math.abs(totals.calories - formData.calories) > 50) {
      setFormData(prev => ({
        ...prev,
        calories: totals.calories,
        protein: totals.protein,
        carbs: totals.carbs,
        fat: totals.fat
      }));
    }
  };

  const handleDateChange = (field: 'start_date' | 'end_date', value: string) => {
    const updatedData = { ...formData, [field]: value };
    
    if (updatedData.start_date && updatedData.end_date) {
      updatedData.duration_days = calculateDurationDays(updatedData.start_date, updatedData.end_date);
    }
    
    setFormData(updatedData);
  };

  const handleMealUpdate = (mealType: keyof FormData['meal_data'], field: keyof MealData, value: any) => {
    setFormData(prev => ({
      ...prev,
      meal_data: {
        ...prev.meal_data,
        [mealType]: {
          ...prev.meal_data[mealType],
          [field]: value
        }
      }
    }));
    
    // Recalculate nutrition after meal updates
    setTimeout(calculateTotalNutrition, 100);
  };

  const addFoodToMeal = (mealType: keyof FormData['meal_data']) => {
    const meal = formData.meal_data[mealType];
    handleMealUpdate(mealType, 'foods', [...meal.foods, '']);
  };

  const removeFoodFromMeal = (mealType: keyof FormData['meal_data'], index: number) => {
    const meal = formData.meal_data[mealType];
    const newFoods = meal.foods.filter((_, i) => i !== index);
    handleMealUpdate(mealType, 'foods', newFoods);
  };

  const updateFood = (mealType: keyof FormData['meal_data'], index: number, value: string) => {
    const meal = formData.meal_data[mealType];
    const newFoods = [...meal.foods];
    newFoods[index] = value;
    handleMealUpdate(mealType, 'foods', newFoods);
  };

  const addSnacks = () => {
    setFormData(prev => ({
      ...prev,
      meal_data: {
        ...prev.meal_data,
        snacks: { ...DEFAULT_MEAL, time: '3:00 PM' }
      }
    }));
  };

  const removeSnacks = () => {
    setFormData(prev => {
      const { snacks, ...remainingMeals } = prev.meal_data;
      return {
        ...prev,
        meal_data: remainingMeals
      };
    });
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const mealPlanData: Partial<MealPlan> = {
        ...formData,
        // Include ID for edits
        ...(mode === 'edit' && mealPlan?.id && { id: mealPlan.id })
      };

      const success = await onSave(mealPlanData);
      if (success) {
        onOpenChange(false);
        setFormData(DEFAULT_FORM_DATA);
        setErrors({});
      }
    } catch (error) {
      console.error('Error saving meal plan:', error);
    } finally {
      setSaving(false);
    }
  };

  const nutritionData = {
    calories: formData.calories,
    protein: formData.protein,
    carbs: formData.carbs,
    fat: formData.fat,
    fiber: formData.fiber
  };

  const currentPlanType = PLAN_TYPES.find(type => type.value === formData.plan_type);
  const currentStatus = STATUS_OPTIONS.find(status => status.value === formData.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Utensils className="w-5 h-5" />
            {mode === 'create' ? 'Create New Meal Plan' : `Edit Meal Plan: ${mealPlan?.title}`}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Create a personalized nutrition plan for an athlete'
              : 'Modify this meal plan to adjust nutrition targets and meals'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Form - 3/4 width */}
          <div className="lg:col-span-3 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Plan Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Plan Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., John's Competition Prep Plan"
                      className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="player">Assigned Player *</Label>
                    <PlayerSelector
                      value={formData.player_id}
                      onPlayerSelect={(playerId) => setFormData(prev => ({ ...prev, player_id: playerId }))}
                      variant="simple"
                      className={errors.player_id ? 'border-red-500' : ''}
                    />
                    {errors.player_id && (
                      <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {errors.player_id}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the purpose and goals of this nutrition plan..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Plan Type</Label>
                    <Select 
                      value={formData.plan_type} 
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, plan_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PLAN_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map(status => (
                          <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Duration</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={formData.duration_days}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration_days: Number(e.target.value) }))}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">days</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Start Date *</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => handleDateChange('start_date', e.target.value)}
                      className={errors.start_date ? 'border-red-500' : ''}
                    />
                    {errors.start_date && (
                      <p className="text-sm text-red-600 mt-1">{errors.start_date}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="end_date">End Date *</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => handleDateChange('end_date', e.target.value)}
                      className={errors.end_date ? 'border-red-500' : ''}
                    />
                    {errors.end_date && (
                      <p className="text-sm text-red-600 mt-1">{errors.end_date}</p>
                    )}
                  </div>
                </div>

                {errors.date_range && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {errors.date_range}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Nutrition Targets */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Daily Nutrition Targets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="calories">Calories *</Label>
                    <Input
                      id="calories"
                      type="number"
                      value={formData.calories}
                      onChange={(e) => setFormData(prev => ({ ...prev, calories: Number(e.target.value) }))}
                      className={errors.calories ? 'border-red-500' : ''}
                    />
                    {errors.calories && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.calories}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="protein">Protein (g)</Label>
                    <Input
                      id="protein"
                      type="number"
                      value={formData.protein}
                      onChange={(e) => setFormData(prev => ({ ...prev, protein: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="carbs">Carbs (g)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      value={formData.carbs}
                      onChange={(e) => setFormData(prev => ({ ...prev, carbs: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fat">Fat (g)</Label>
                    <Input
                      id="fat"
                      type="number"
                      value={formData.fat}
                      onChange={(e) => setFormData(prev => ({ ...prev, fat: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                {errors.nutrition_mismatch && (
                  <p className="text-sm text-yellow-600 mt-2 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {errors.nutrition_mismatch}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Meal Plan */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Utensils className="w-5 h-5" />
                    Daily Meal Plan
                  </CardTitle>
                  <div className="flex gap-2">
                    {!formData.meal_data.snacks && (
                      <Button variant="outline" size="sm" onClick={addSnacks}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add Snacks
                      </Button>
                    )}
                    {formData.meal_data.snacks && (
                      <Button variant="outline" size="sm" onClick={removeSnacks}>
                        <Minus className="w-4 h-4 mr-1" />
                        Remove Snacks
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(formData.meal_data).map(([mealType, meal]) => (
                  <div key={mealType}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium capitalize flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {mealType}
                      </h4>
                    </div>

                    <div className="ml-6 space-y-3 border-l-2 border-gray-100 pl-4">
                      {/* Time */}
                      <div>
                        <Label>Time</Label>
                        <Input
                          value={meal.time}
                          onChange={(e) => handleMealUpdate(mealType as keyof FormData['meal_data'], 'time', e.target.value)}
                          placeholder="e.g., 8:00 AM"
                          className={errors[`${mealType}_time`] ? 'border-red-500' : ''}
                        />
                        {errors[`${mealType}_time`] && (
                          <p className="text-sm text-red-600 mt-1">{errors[`${mealType}_time`]}</p>
                        )}
                      </div>

                      {/* Foods */}
                      <div>
                        <Label>Foods</Label>
                        <div className="space-y-2">
                          {meal.foods.map((food, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={food}
                                onChange={(e) => updateFood(mealType as keyof FormData['meal_data'], index, e.target.value)}
                                placeholder="e.g., Grilled chicken breast (150g)"
                                className="flex-1"
                              />
                              {meal.foods.length > 1 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeFoodFromMeal(mealType as keyof FormData['meal_data'], index)}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addFoodToMeal(mealType as keyof FormData['meal_data'])}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Food
                          </Button>
                        </div>
                        {errors[`${mealType}_foods`] && (
                          <p className="text-sm text-red-600 mt-1">{errors[`${mealType}_foods`]}</p>
                        )}
                      </div>

                      {/* Nutrition */}
                      <div className="grid grid-cols-4 gap-3">
                        <div>
                          <Label>Calories</Label>
                          <Input
                            type="number"
                            value={meal.calories}
                            onChange={(e) => handleMealUpdate(mealType as keyof FormData['meal_data'], 'calories', Number(e.target.value))}
                            className={errors[`${mealType}_calories`] ? 'border-red-500' : ''}
                          />
                          {errors[`${mealType}_calories`] && (
                            <p className="text-sm text-red-600 mt-1">{errors[`${mealType}_calories`]}</p>
                          )}
                        </div>
                        <div>
                          <Label>Protein (g)</Label>
                          <Input
                            type="number"
                            value={meal.protein}
                            onChange={(e) => handleMealUpdate(mealType as keyof FormData['meal_data'], 'protein', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label>Carbs (g)</Label>
                          <Input
                            type="number"
                            value={meal.carbs}
                            onChange={(e) => handleMealUpdate(mealType as keyof FormData['meal_data'], 'carbs', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label>Fat (g)</Label>
                          <Input
                            type="number"
                            value={meal.fat}
                            onChange={(e) => handleMealUpdate(mealType as keyof FormData['meal_data'], 'fat', Number(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="mt-4" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Special instructions, modifications, or important notes for the athlete..."
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel - 1/4 width */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              <NutritionSummary 
                data={nutritionData}
                title="Daily Targets"
                layout="compact"
                showProgress={false}
              />

              {/* Plan Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Plan Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Type:</span>
                    {currentPlanType && (
                      <Badge className={currentPlanType.color}>{currentPlanType.label}</Badge>
                    )}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    {currentStatus && (
                      <Badge className={currentStatus.color}>{currentStatus.label}</Badge>
                    )}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Duration:</span>
                    <span className="font-medium">{formData.duration_days} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Meals:</span>
                    <span className="font-medium">{Object.keys(formData.meal_data).length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Food Items:</span>
                    <span className="font-medium">
                      {Object.values(formData.meal_data).reduce((sum, meal) => sum + meal.foods.length, 0)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span>Validation:</span>
                    <Badge variant={Object.keys(errors).length === 0 ? "default" : "destructive"} className="text-xs">
                      {Object.keys(errors).length === 0 ? (
                        <><CheckCircle className="w-3 h-3 mr-1" />Ready</>
                      ) : (
                        <><AlertTriangle className="w-3 h-3 mr-1" />{Object.keys(errors).length} errors</>
                      )}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full" disabled>
                    <User className="w-4 h-4 mr-2" />
                    From Template
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" disabled>
                    <Calendar className="w-4 h-4 mr-2" />
                    Copy Existing
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" disabled>
                    <Activity className="w-4 h-4 mr-2" />
                    AI Suggest
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {Object.keys(errors).length > 0 && (
              <span className="text-red-600">
                Please fix {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? 's' : ''} before saving
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving || Object.keys(errors).length > 0}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {mode === 'create' ? 'Create Meal Plan' : 'Save Changes'}
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}