import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
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
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Brain,
  Sparkles,
  Clock,
  Utensils,
  Wand2,
  Edit,
  CheckCircle,
  Download,
  X,
  AlertTriangle
} from 'lucide-react';
import { useMealPlanService } from '@/hooks/useMealPlanService';
import { usePlayerService } from '@/hooks/usePlayerService';
import { Player, CreateMealPlanData } from '@/lib/services/types';


const sampleMealPlan = {
  breakfast: {
    time: "7:00 AM",
    foods: [
      "Oatmeal with berries",
      "Greek yogurt", 
      "Banana",
      "Almonds",
    ],
    calories: 580,
    protein: 28,
    carbs: 78,
    fat: 18,
  },
  snack1: {
    time: "10:00 AM",
    foods: ["Protein smoothie", "Apple slices"],
    calories: 320,
    protein: 25,
    carbs: 35,
    fat: 8,
  },
  lunch: {
    time: "1:00 PM",
    foods: [
      "Grilled chicken breast",
      "Quinoa",
      "Steamed vegetables",
      "Avocado",
    ],
    calories: 750,
    protein: 52,
    carbs: 65,
    fat: 22,
  },
  snack2: {
    time: "4:00 PM",
    foods: ["Whole grain crackers", "Hummus", "Carrots"],
    calories: 280,
    protein: 12,
    carbs: 42,
    fat: 10,
  },
  dinner: {
    time: "7:00 PM",
    foods: [
      "Salmon fillet",
      "Sweet potato",
      "Green salad",
      "Olive oil dressing",
    ],
    calories: 680,
    protein: 42,
    carbs: 58,
    fat: 25,
  },
  snack3: {
    time: "9:30 PM",
    foods: ["Greek yogurt", "Berries", "Nuts"],
    calories: 250,
    protein: 18,
    carbs: 22,
    fat: 12,
  },
};

interface CreatePlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlanCreate?: () => void;
}

function CreatePlanModal({ open, onOpenChange, onPlanCreate }: CreatePlanModalProps) {
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [planType, setPlanType] = useState("");
  const [duration, setDuration] = useState("");
  const [planTitle, setPlanTitle] = useState("");
  const [specialConsiderations, setSpecialConsiderations] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [players, setPlayers] = useState<Player[]>([]);

  const { createMealPlan, loading: mealPlanLoading, error: mealPlanError, clearError } = useMealPlanService();
  const { getPlayers, loading: playersLoading } = usePlayerService();

  // Load players when modal opens
  useEffect(() => {
    if (open) {
      loadPlayers();
    }
  }, [open]);

  const loadPlayers = async () => {
    const result = await getPlayers();
    if (result?.data) {
      setPlayers(result.data);
    }
  };

  const handleGeneratePlan = async () => {
    if (!selectedPlayer || !planType || !duration) return;

    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setGeneratedPlan(sampleMealPlan);
      setIsGenerating(false);
    }, 3000);
  };

  const handleCreatePlan = async () => {
    if (!generatedPlan || !selectedPlayer) return;

    const mealPlanData: CreateMealPlanData = {
      player_id: selectedPlayer,
      title: planTitle || `${planType.replace('_', ' ')} Plan`,
      description: specialConsiderations || undefined,
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
      onPlanCreate?.();
      handleReset();
      onOpenChange(false);
    }
  };

  const getDurationDays = () => {
    switch (duration) {
      case '1_week': return 7;
      case '2_weeks': return 14;
      case '1_month': return 30;
      case '3_months': return 90;
      default: return 7;
    }
  };

  const handleReset = () => {
    setSelectedPlayer("");
    setPlanType("");
    setDuration("");
    setPlanTitle("");
    setSpecialConsiderations("");
    setGeneratedPlan(null);
    setIsGenerating(false);
    clearError();
  };

  const handleCancel = () => {
    handleReset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <Brain className="w-6 h-6" />
            Create New Meal Plan
          </DialogTitle>
          <DialogDescription className="text-base">
            Use AI to generate a personalized meal plan for your athlete.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plan Generator */}
          <Card className="h-fit">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <Wand2 className="h-5 w-5" />
                Plan Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Select Player *
                </label>
                <Select
                  value={selectedPlayer}
                  onValueChange={setSelectedPlayer}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Choose a player" />
                  </SelectTrigger>
                  <SelectContent>
                    {players.map((player) => (
                      <SelectItem
                        key={player.id}
                        value={player.id}
                      >
                        {player.user ? `${player.user.first_name} ${player.user.last_name}` : 'Unknown Player'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Plan Title
                </label>
                <Input
                  value={planTitle}
                  onChange={(e) => setPlanTitle(e.target.value)}
                  placeholder="Enter plan title (optional)"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Plan Type *
                </label>
                <Select
                  value={planType}
                  onValueChange={setPlanType}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select plan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="training">
                      Training
                    </SelectItem>
                    <SelectItem value="competition">
                      Competition
                    </SelectItem>
                    <SelectItem value="recovery">
                      Recovery
                    </SelectItem>
                    <SelectItem value="general">
                      General
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Duration *
                </label>
                <Select
                  value={duration}
                  onValueChange={setDuration}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1_week">
                      1 Week
                    </SelectItem>
                    <SelectItem value="2_weeks">
                      2 Weeks
                    </SelectItem>
                    <SelectItem value="1_month">
                      1 Month
                    </SelectItem>
                    <SelectItem value="3_months">
                      3 Months
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Special Considerations
                </label>
                <Textarea
                  value={specialConsiderations}
                  onChange={(e) => setSpecialConsiderations(e.target.value)}
                  placeholder="e.g., training schedule, dietary restrictions, preferences..."
                  rows={4}
                  className="resize-none"
                />
              </div>

              <Button
                onClick={handleGeneratePlan}
                disabled={
                  !selectedPlayer ||
                  !planType ||
                  !duration ||
                  isGenerating ||
                  playersLoading
                }
                className="w-full h-12 text-base"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="h-5 w-5 mr-3 animate-spin" />
                    Generating Plan...
                  </>
                ) : playersLoading ? (
                  <>
                    <Sparkles className="h-5 w-5 mr-3 animate-spin" />
                    Loading Players...
                  </>
                ) : (
                  <>
                    <Brain className="h-5 w-5 mr-3" />
                    Generate AI Plan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Plan Preview */}
          <Card className="h-fit">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <Utensils className="h-5 w-5" />
                Generated Plan Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="min-h-[500px]">
              {isGenerating ? (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center space-y-4">
                    <Sparkles className="h-16 w-16 text-primary mx-auto animate-pulse" />
                    <div className="space-y-2">
                      <p className="text-base font-medium">AI is creating your personalized meal plan...</p>
                      <p className="text-sm text-muted-foreground">This may take a few moments</p>
                    </div>
                  </div>
                </div>
              ) : generatedPlan ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <h3 className="text-lg font-semibold">
                      Daily Meal Plan
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        Total Calories:
                      </span>
                      <span className="text-lg font-semibold text-primary">
                        {Object.values(generatedPlan).reduce((sum: number, meal: any) => sum + meal.calories, 0)} cal
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {Object.entries(generatedPlan).map(
                      ([mealType, meal]) => (
                        <div
                          key={mealType}
                          className="p-5 border-2 border-border rounded-lg hover:border-primary/20 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Clock className="h-5 w-5 text-muted-foreground" />
                              <span className="text-base font-semibold capitalize">
                                {mealType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </span>
                              <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                                {meal.time}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-semibold text-primary">
                                {meal.calories}
                              </span>
                              <span className="text-sm text-muted-foreground ml-1">
                                cal
                              </span>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {meal.foods.join(" • ")}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 pt-3 border-t border-muted">
                            <div className="text-center">
                              <div className="text-sm font-medium text-blue-600">
                                {meal.protein}g
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Protein
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium text-green-600">
                                {meal.carbs}g
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Carbs
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium text-orange-600">
                                {meal.fat}g
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Fat
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 space-y-6">
                  <Brain className="h-20 w-20 text-muted-foreground mx-auto" />
                  <div className="space-y-2">
                    <p className="text-base font-medium">Ready to Generate Your Plan</p>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                      Configure the plan parameters on the left and click "Generate AI Plan" to create a personalized meal plan.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {mealPlanError && (
          <div className="bg-destructive/15 border border-destructive/20 rounded-lg p-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <p className="text-sm text-destructive">{mealPlanError}</p>
            <Button variant="ghost" size="sm" onClick={clearError} className="ml-auto">
              Dismiss
            </Button>
          </div>
        )}

        <DialogFooter className="flex items-center justify-between pt-6 border-t">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Brain className="w-5 h-5" />
            <span>AI-powered meal plan generation</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleCancel} className="h-11 px-6">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleCreatePlan} 
              disabled={!generatedPlan || mealPlanLoading}
              className="h-11 px-6"
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
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePlanModal;