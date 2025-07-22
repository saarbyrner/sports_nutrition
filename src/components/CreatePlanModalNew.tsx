/**
 * Quick Create Plan Modal
 * 
 * Simplified modal for fast meal plan creation following the progressive
 * disclosure UX pattern. Focuses on essential inputs with AI generation.
 * 
 * Features:
 * - Quick player selection
 * - Plan type selection
 * - Duration picker
 * - AI generation
 * - Success feedback
 * 
 * @author Claude Code (Expert Software Engineer)
 * @version 2.0.0 - Standardized UX Design System
 */

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Brain,
  Sparkles,
  CheckCircle,
  X,
  AlertTriangle,
  Zap,
  Clock,
  Target,
  Rocket
} from 'lucide-react';
import { useMealPlanService } from '@/hooks/useMealPlanService';
import { CreateMealPlanData } from '@/lib/services/types';
import { SimplePlayerSelector } from './shared/PlayerSelector';
import { QuickNutritionSummary } from './shared/NutritionSummary';

// Quick AI-generated sample plan for demonstration
const quickSamplePlan = {
  breakfast: {
    time: "7:00 AM",
    foods: ["Oatmeal with berries", "Greek yogurt", "Almonds"],
    calories: 580,
    protein: 28,
    carbs: 78,
    fat: 18,
  },
  lunch: {
    time: "1:00 PM", 
    foods: ["Grilled chicken", "Quinoa", "Vegetables"],
    calories: 750,
    protein: 52,
    carbs: 65,
    fat: 22,
  },
  dinner: {
    time: "7:00 PM",
    foods: ["Salmon", "Sweet potato", "Green salad"],
    calories: 680,
    protein: 42,
    carbs: 58,
    fat: 25,
  }
};

interface CreatePlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlanCreate?: () => void;
  onAdvancedCreate?: () => void;
}

export default function CreatePlanModal({ 
  open, 
  onOpenChange, 
  onPlanCreate,
  onAdvancedCreate 
}: CreatePlanModalProps) {
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [planType, setPlanType] = useState("");
  const [duration, setDuration] = useState("");
  const [planTitle, setPlanTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [step, setStep] = useState<'setup' | 'preview' | 'success'>('setup');

  const { createMealPlan, loading: mealPlanLoading, error: mealPlanError, clearError } = useMealPlanService();

  const handleGeneratePlan = async () => {
    if (!selectedPlayer || !planType || !duration) return;

    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setGeneratedPlan(quickSamplePlan);
      setIsGenerating(false);
      setStep('preview');
    }, 2000);
  };

  const handleCreatePlan = async () => {
    if (!generatedPlan || !selectedPlayer) return;

    const mealPlanData: CreateMealPlanData = {
      player_id: selectedPlayer,
      title: planTitle || `${planType.replace('_', ' ')} Plan`,
      description: `Quick-generated ${planType.replace('_', ' ').toLowerCase()} plan`,
      plan_type: planType,
      calories: Object.values(generatedPlan).reduce((sum: number, meal: any) => sum + meal.calories, 0),
      protein: Object.values(generatedPlan).reduce((sum: number, meal: any) => sum + meal.protein, 0),
      carbs: Object.values(generatedPlan).reduce((sum: number, meal: any) => sum + meal.carbs, 0),
      fat: Object.values(generatedPlan).reduce((sum: number, meal: any) => sum + meal.fat, 0),
      duration_days: getDurationDays(),
      meal_data: generatedPlan
    };

    const result = await createMealPlan(mealPlanData);
    if (result) {
      setStep('success');
      setTimeout(() => {
        onPlanCreate?.();
        handleClose();
      }, 2000);
    }
  };

  const getDurationDays = () => {
    switch (duration) {
      case '1_week': return 7;
      case '2_weeks': return 14;
      case '1_month': return 30;
      default: return 7;
    }
  };

  const handleClose = () => {
    setStep('setup');
    setSelectedPlayer("");
    setPlanType("");
    setDuration("");
    setPlanTitle("");
    setGeneratedPlan(null);
    setIsGenerating(false);
    clearError();
    onOpenChange(false);
  };

  const canProceed = selectedPlayer && planType && duration;
  const totalNutrition = generatedPlan ? {
    calories: Object.values(generatedPlan).reduce((sum: number, meal: any) => sum + meal.calories, 0),
    protein: Object.values(generatedPlan).reduce((sum: number, meal: any) => sum + meal.protein, 0),
    carbs: Object.values(generatedPlan).reduce((sum: number, meal: any) => sum + meal.carbs, 0),
    fat: Object.values(generatedPlan).reduce((sum: number, meal: any) => sum + meal.fat, 0),
  } : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === 'setup' && <Rocket className="w-5 h-5" />}
            {step === 'preview' && <Sparkles className="w-5 h-5" />}
            {step === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
            {step === 'setup' && "New Nutrition Plan"}
            {step === 'preview' && "AI Generated Plan"}
            {step === 'success' && "Plan Created!"}
          </DialogTitle>
          <DialogDescription>
            {step === 'setup' && "Get started quickly with an AI-generated nutrition plan"}
            {step === 'preview' && "Review and customize your AI-generated plan"}
            {step === 'success' && "Your meal plan has been created successfully"}
          </DialogDescription>
        </DialogHeader>

        {/* Setup Step */}
        {step === 'setup' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Player *</label>
              <SimplePlayerSelector
                value={selectedPlayer}
                onValueChange={setSelectedPlayer}
                placeholder="Select a player"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Plan Name</label>
              <Input
                value={planTitle}
                onChange={(e) => setPlanTitle(e.target.value)}
                placeholder="Optional custom name"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type *</label>
                <Select value={planType} onValueChange={setPlanType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Plan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="competition">Competition</SelectItem>
                    <SelectItem value="recovery">Recovery</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Duration *</label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1_week">1 Week</SelectItem>
                    <SelectItem value="2_weeks">2 Weeks</SelectItem>
                    <SelectItem value="1_month">1 Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {mealPlanError && (
              <div className="bg-destructive/15 border border-destructive/20 rounded-lg p-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{mealPlanError}</p>
              </div>
            )}
          </div>
        )}

        {/* Preview Step */}
        {step === 'preview' && totalNutrition && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Daily Nutrition</h3>
                    <Badge className="bg-purple-100 text-purple-800">
                      AI Generated
                    </Badge>
                  </div>
                  <QuickNutritionSummary data={totalNutrition} />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Sample Meals
              </h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                {Object.entries(generatedPlan).map(([mealType, meal]: [string, any]) => (
                  <div key={mealType} className="flex justify-between">
                    <span className="capitalize">{mealType}:</span>
                    <span>{meal.calories} cal</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">Plan Created Successfully!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                The meal plan has been added to the player's profile
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {step === 'setup' && (
              <>
                <Brain className="w-4 h-4" />
                <span>AI-powered generation</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {step === 'setup' && (
              <>
                <Button variant="ghost" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="outline" onClick={onAdvancedCreate}>
                  Advanced Create
                </Button>
                <Button 
                  onClick={handleGeneratePlan} 
                  disabled={!canProceed || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Plan
                    </>
                  )}
                </Button>
              </>
            )}
            {step === 'preview' && (
              <>
                <Button variant="outline" onClick={() => setStep('setup')}>
                  Back
                </Button>
                <Button 
                  onClick={handleCreatePlan} 
                  disabled={mealPlanLoading}
                >
                  {mealPlanLoading ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Create Plan
                    </>
                  )}
                </Button>
              </>
            )}
            {step === 'success' && (
              <Button onClick={handleClose}>
                Done
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { CreatePlanModal };