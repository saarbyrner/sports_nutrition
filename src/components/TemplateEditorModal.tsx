/**
 * Template Editor Modal
 * 
 * Full-featured template editing component with comprehensive validation.
 * Supports creating new templates and editing existing ones.
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
  BookOpen,
  Plus,
  Minus,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  Utensils,
  Target,
  Tag
} from 'lucide-react';
import { Template } from '@/lib/services/types';
import { NutritionSummary } from './shared/NutritionSummary';

interface TemplateEditorModalProps {
  template?: Template | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (template: Partial<Template>) => Promise<boolean>;
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
  name: string;
  description: string;
  category: string;
  tags: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  notes: string;
  meal_plan: {
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
  name: '',
  description: '',
  category: '',
  tags: [],
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
  notes: '',
  meal_plan: {
    breakfast: { ...DEFAULT_MEAL, time: '8:00 AM' },
    lunch: { ...DEFAULT_MEAL, time: '12:00 PM' },
    dinner: { ...DEFAULT_MEAL, time: '6:00 PM' }
  }
};

const CATEGORIES = [
  'Training',
  'Competition', 
  'Recovery',
  'General',
  'Weight Loss',
  'Muscle Gain',
  'Maintenance',
  'Custom'
];

export default function TemplateEditorModal({
  template,
  open,
  onOpenChange,
  onSave,
  mode
}: TemplateEditorModalProps) {
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Initialize form data when template changes
  useEffect(() => {
    if (template && mode === 'edit') {
      setFormData({
        name: template.name || '',
        description: template.description || '',
        category: template.category || '',
        tags: template.tags || [],
        calories: template.calories || 0,
        protein: template.protein || 0,
        carbs: template.carbs || 0,
        fat: template.fat || 0,
        fiber: template.fiber || 0,
        notes: template.notes || '',
        meal_plan: {
          breakfast: template.meal_plan?.breakfast || { ...DEFAULT_MEAL, time: '8:00 AM' },
          lunch: template.meal_plan?.lunch || { ...DEFAULT_MEAL, time: '12:00 PM' },
          dinner: template.meal_plan?.dinner || { ...DEFAULT_MEAL, time: '6:00 PM' },
          ...(template.meal_plan?.snacks && { snacks: template.meal_plan.snacks })
        }
      });
    } else if (mode === 'create') {
      setFormData(DEFAULT_FORM_DATA);
    }
  }, [template, mode, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Template name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.calories <= 0) {
      newErrors.calories = 'Calories must be greater than 0';
    }

    // Validate each meal
    Object.entries(formData.meal_plan).forEach(([mealType, meal]) => {
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
    const totalCalories = Object.values(formData.meal_plan).reduce((sum, meal) => sum + meal.calories, 0);
    if (Math.abs(totalCalories - formData.calories) > 50) {
      newErrors.nutrition_mismatch = 'Total meal calories should roughly match template calories';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotalNutrition = () => {
    const totals = Object.values(formData.meal_plan).reduce((acc, meal) => ({
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

  const handleMealUpdate = (mealType: keyof FormData['meal_plan'], field: keyof MealData, value: any) => {
    setFormData(prev => ({
      ...prev,
      meal_plan: {
        ...prev.meal_plan,
        [mealType]: {
          ...prev.meal_plan[mealType],
          [field]: value
        }
      }
    }));
    
    // Recalculate nutrition after meal updates
    setTimeout(calculateTotalNutrition, 100);
  };

  const addFoodToMeal = (mealType: keyof FormData['meal_plan']) => {
    const meal = formData.meal_plan[mealType];
    handleMealUpdate(mealType, 'foods', [...meal.foods, '']);
  };

  const removeFoodFromMeal = (mealType: keyof FormData['meal_plan'], index: number) => {
    const meal = formData.meal_plan[mealType];
    const newFoods = meal.foods.filter((_, i) => i !== index);
    handleMealUpdate(mealType, 'foods', newFoods);
  };

  const updateFood = (mealType: keyof FormData['meal_plan'], index: number, value: string) => {
    const meal = formData.meal_plan[mealType];
    const newFoods = [...meal.foods];
    newFoods[index] = value;
    handleMealUpdate(mealType, 'foods', newFoods);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const templateData: Partial<Template> = {
        ...formData,
        // Include ID for edits
        ...(mode === 'edit' && template?.id && { id: template.id })
      };

      const success = await onSave(templateData);
      if (success) {
        onOpenChange(false);
        setFormData(DEFAULT_FORM_DATA);
        setErrors({});
      }
    } catch (error) {
      console.error('Error saving template:', error);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            {mode === 'create' ? 'Create New Template' : `Edit Template: ${template?.name}`}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Create a reusable nutrition plan template'
              : 'Modify this template to update all future meal plans based on it'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Template Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Pre-Competition High Carb"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe when and how to use this template..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {errors.category}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add tag..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" variant="outline" size="sm" onClick={addTag}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 ml-1"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
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
                <CardTitle className="text-lg flex items-center gap-2">
                  <Utensils className="w-5 h-5" />
                  Daily Meal Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(formData.meal_plan).map(([mealType, meal]) => (
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
                          onChange={(e) => handleMealUpdate(mealType as keyof FormData['meal_plan'], 'time', e.target.value)}
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
                                onChange={(e) => updateFood(mealType as keyof FormData['meal_plan'], index, e.target.value)}
                                placeholder="e.g., Grilled chicken breast (150g)"
                                className="flex-1"
                              />
                              {meal.foods.length > 1 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeFoodFromMeal(mealType as keyof FormData['meal_plan'], index)}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addFoodToMeal(mealType as keyof FormData['meal_plan'])}
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
                            onChange={(e) => handleMealUpdate(mealType as keyof FormData['meal_plan'], 'calories', Number(e.target.value))}
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
                            onChange={(e) => handleMealUpdate(mealType as keyof FormData['meal_plan'], 'protein', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label>Carbs (g)</Label>
                          <Input
                            type="number"
                            value={meal.carbs}
                            onChange={(e) => handleMealUpdate(mealType as keyof FormData['meal_plan'], 'carbs', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label>Fat (g)</Label>
                          <Input
                            type="number"
                            value={meal.fat}
                            onChange={(e) => handleMealUpdate(mealType as keyof FormData['meal_plan'], 'fat', Number(e.target.value))}
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
                  placeholder="Usage instructions, modifications, or any special notes..."
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel - 1/3 width */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              <NutritionSummary 
                data={nutritionData}
                title="Nutrition Preview"
                layout="compact"
                showProgress={false}
              />

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Template Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Total Meals:</span>
                    <span className="font-medium">{Object.keys(formData.meal_plan).length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Food Items:</span>
                    <span className="font-medium">
                      {Object.values(formData.meal_plan).reduce((sum, meal) => sum + meal.foods.length, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tags:</span>
                    <span className="font-medium">{formData.tags.length}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
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
                  {mode === 'create' ? 'Create Template' : 'Save Changes'}
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}