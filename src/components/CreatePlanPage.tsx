import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Calendar } from './ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { 
  ArrowLeft,
  Save,
  Sparkles,
  Brain,
  Plus,
  Trash2,
  Clock,
  Target,
  Utensils,
  Wand2,
  CheckCircle,
  Copy,
  RotateCcw,
  User,
  Calendar as CalendarIcon,
  BookOpen,
  Tag,
  Search
} from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';

import { usePlayerSelection } from '@/hooks/useUnifiedPlayer';
import { SimplePlayerSelector } from './shared/PlayerSelector';
import { NutritionCards } from './shared/NutritionSummary';

const sampleMealPlan = {
  breakfast: {
    time: "7:00 AM",
    foods: [
      { name: "Oatmeal with berries", amount: "1 cup", calories: 280, protein: 10, carbs: 54, fat: 6 },
      { name: "Greek yogurt", amount: "150g", calories: 150, protein: 15, carbs: 8, fat: 4 },
      { name: "Banana", amount: "1 medium", calories: 105, protein: 1, carbs: 27, fat: 0 },
      { name: "Almonds", amount: "15g", calories: 45, protein: 2, carbs: 3, fat: 8 }
    ],
    calories: 580,
    protein: 28,
    carbs: 92,
    fat: 18,
  },
  snack1: {
    time: "10:00 AM",
    foods: [
      { name: "Protein smoothie", amount: "250ml", calories: 220, protein: 20, carbs: 25, fat: 6 },
      { name: "Apple slices", amount: "1 medium", calories: 95, protein: 0, carbs: 25, fat: 0 }
    ],
    calories: 315,
    protein: 20,
    carbs: 50,
    fat: 6,
  },
  lunch: {
    time: "1:00 PM",
    foods: [
      { name: "Grilled chicken breast", amount: "150g", calories: 280, protein: 53, carbs: 0, fat: 6 },
      { name: "Quinoa", amount: "100g cooked", calories: 120, protein: 4, carbs: 22, fat: 2 },
      { name: "Steamed vegetables", amount: "200g", calories: 50, protein: 3, carbs: 10, fat: 0 },
      { name: "Avocado", amount: "1/2 medium", calories: 160, protein: 2, carbs: 9, fat: 15 }
    ],
    calories: 610,
    protein: 62,
    carbs: 41,
    fat: 23,
  },
  snack2: {
    time: "4:00 PM",
    foods: [
      { name: "Whole grain crackers", amount: "6 pieces", calories: 120, protein: 3, carbs: 20, fat: 4 },
      { name: "Hummus", amount: "30g", calories: 90, protein: 4, carbs: 8, fat: 6 },
      { name: "Carrots", amount: "100g", calories: 40, protein: 1, carbs: 9, fat: 0 }
    ],
    calories: 250,
    protein: 8,
    carbs: 37,
    fat: 10,
  },
  dinner: {
    time: "7:00 PM",
    foods: [
      { name: "Salmon fillet", amount: "120g", calories: 280, protein: 39, carbs: 0, fat: 13 },
      { name: "Sweet potato", amount: "200g", calories: 180, protein: 4, carbs: 41, fat: 0 },
      { name: "Green salad", amount: "100g", calories: 20, protein: 2, carbs: 4, fat: 0 },
      { name: "Olive oil dressing", amount: "1 tbsp", calories: 120, protein: 0, carbs: 0, fat: 14 }
    ],
    calories: 600,
    protein: 45,
    carbs: 45,
    fat: 27,
  },
  snack3: {
    time: "9:30 PM",
    foods: [
      { name: "Greek yogurt", amount: "100g", calories: 100, protein: 15, carbs: 6, fat: 3 },
      { name: "Mixed berries", amount: "80g", calories: 40, protein: 1, carbs: 10, fat: 0 },
      { name: "Walnuts", amount: "10g", calories: 65, protein: 2, carbs: 1, fat: 7 }
    ],
    calories: 205,
    protein: 18,
    carbs: 17,
    fat: 10,
  },
};

interface CreatePlanPageProps {
  onBack: () => void;
  onPlanCreate: (planData: any) => void;
  templates: any[];
}

function CreatePlanPage({ onBack, onPlanCreate, templates }: CreatePlanPageProps) {
  const [activeTab, setActiveTab] = useState("setup");
  const [planMode, setPlanMode] = useState<"ai" | "manual" | "template">("ai");
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [planType, setPlanType] = useState("");
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: undefined,
    to: undefined
  });
  const [planName, setPlanName] = useState("");
  const [specialConsiderations, setSpecialConsiderations] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [mealPlan, setMealPlan] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [templateSearchTerm, setTemplateSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const { players } = usePlayerSelection();
  const selectedPlayerData = players.find(p => p.id === selectedPlayer);

  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(templateSearchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(templateSearchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(templateSearchTerm.toLowerCase())
  );

  // Calculate duration from date range
  const getDurationString = () => {
    if (!dateRange.from || !dateRange.to) return "";
    const days = differenceInDays(dateRange.to, dateRange.from) + 1;
    if (days === 1) return "1 day";
    if (days <= 7) return `${days} days`;
    if (days <= 14) return `${Math.ceil(days / 7)} week${Math.ceil(days / 7) > 1 ? 's' : ''}`;
    if (days <= 31) return `${Math.ceil(days / 7)} weeks`;
    return `${Math.ceil(days / 30)} month${Math.ceil(days / 30) > 1 ? 's' : ''}`;
  };

  // Get formatted date range display
  const getDateRangeDisplay = () => {
    if (!dateRange.from) return "Select dates";
    if (!dateRange.to) return format(dateRange.from, "MMM dd, yyyy");
    if (dateRange.from.getTime() === dateRange.to.getTime()) {
      return format(dateRange.from, "MMM dd, yyyy");
    }
    return `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd, yyyy")}`;
  };

  // Quick date range presets
  const setQuickRange = (days: number) => {
    const today = new Date();
    const endDate = addDays(today, days - 1);
    setDateRange({ from: today, to: endDate });
  };

  const handleGenerateAIPlan = async () => {
    if (!selectedPlayer || !planType || !dateRange.from || !dateRange.to) return;

    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setMealPlan(sampleMealPlan);
      setIsGenerating(false);
      setActiveTab("plan");
      setHasUnsavedChanges(true);
    }, 3000);
  };

  const handleCreateManualPlan = () => {
    // Initialize empty meal plan structure
    const emptyMealPlan = {
      breakfast: { time: "7:00 AM", foods: [], calories: 0, protein: 0, carbs: 0, fat: 0 },
      snack1: { time: "10:00 AM", foods: [], calories: 0, protein: 0, carbs: 0, fat: 0 },
      lunch: { time: "1:00 PM", foods: [], calories: 0, protein: 0, carbs: 0, fat: 0 },
      snack2: { time: "4:00 PM", foods: [], calories: 0, protein: 0, carbs: 0, fat: 0 },
      dinner: { time: "7:00 PM", foods: [], calories: 0, protein: 0, carbs: 0, fat: 0 },
      snack3: { time: "9:30 PM", foods: [], calories: 0, protein: 0, carbs: 0, fat: 0 },
    };
    setMealPlan(emptyMealPlan);
    setActiveTab("plan");
    setHasUnsavedChanges(true);
  };

  const handleUseTemplate = (template: any) => {
    setSelectedTemplate(template);
    setMealPlan(template.mealPlan);
    setPlanType(template.type);
    if (!planName) {
      setPlanName(`${template.name} - ${selectedPlayerData?.name || 'Custom'}`);
    }
    setSpecialConsiderations(prev => 
      prev ? `${prev}\n\nBased on template: ${template.name}` : `Based on template: ${template.name}`
    );
    setActiveTab("plan");
    setHasUnsavedChanges(true);
    setShowTemplateSelector(false);
  };

  const addFoodToMeal = (mealKey: string) => {
    // Simple food addition - in real app this would open a food picker
    const newFood = {
      name: "New food item",
      amount: "1 serving",
      calories: 100,
      protein: 5,
      carbs: 15,
      fat: 3
    };

    setMealPlan(prev => ({
      ...prev,
      [mealKey]: {
        ...prev[mealKey],
        foods: [...prev[mealKey].foods, newFood],
        calories: prev[mealKey].calories + newFood.calories,
        protein: prev[mealKey].protein + newFood.protein,
        carbs: prev[mealKey].carbs + newFood.carbs,
        fat: prev[mealKey].fat + newFood.fat,
      }
    }));
    setHasUnsavedChanges(true);
  };

  const removeFoodFromMeal = (mealKey: string, foodIndex: number) => {
    const meal = mealPlan[mealKey];
    const foodToRemove = meal.foods[foodIndex];

    setMealPlan(prev => ({
      ...prev,
      [mealKey]: {
        ...prev[mealKey],
        foods: meal.foods.filter((_, index) => index !== foodIndex),
        calories: prev[mealKey].calories - foodToRemove.calories,
        protein: prev[mealKey].protein - foodToRemove.protein,
        carbs: prev[mealKey].carbs - foodToRemove.carbs,
        fat: prev[mealKey].fat - foodToRemove.fat,
      }
    }));
    setHasUnsavedChanges(true);
  };

  const updateMealTime = (mealKey: string, newTime: string) => {
    setMealPlan(prev => ({
      ...prev,
      [mealKey]: {
        ...prev[mealKey],
        time: newTime
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSavePlan = () => {
    if (!mealPlan || !selectedPlayer || !dateRange.from || !dateRange.to) return;

    const planData = {
      id: `plan-${Date.now()}`,
      playerName: selectedPlayerData?.name,
      playerId: selectedPlayer,
      planName: planName || `${planType.replace('_', ' ')} Plan`,
      planType: planType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      startDate: dateRange.from.toISOString().split('T')[0],
      endDate: dateRange.to.toISOString().split('T')[0],
      duration: getDurationString(),
      dateCreated: new Date().toISOString().split('T')[0],
      status: 'active',
      calories: Object.values(mealPlan).reduce((sum: number, meal: any) => sum + meal.calories, 0),
      aiConfidence: planMode === 'ai' ? Math.floor(Math.random() * 15) + 85 : planMode === 'template' ? 80 : null,
      editedBy: planMode === 'ai' ? 'AI Generated' : planMode === 'template' ? `Template: ${selectedTemplate?.name}` : 'Manual Creation',
      specialConsiderations,
      mealPlan,
      avatar: selectedPlayerData?.avatar,
      compliance: 0,
      lastUpdated: 'Just created',
      aiInsights: planMode === 'ai' ? [
        {
          type: "suggestion",
          message: "Newly created plan based on player profile and goals.",
          confidence: 90,
          impact: "high"
        }
      ] : planMode === 'template' ? [
        {
          type: "suggestion",
          message: `Plan created from "${selectedTemplate?.name}" template. Review and customize as needed.`,
          confidence: 85,
          impact: "medium"
        }
      ] : []
    };

    onPlanCreate(planData);
    setHasUnsavedChanges(false);
    onBack();
  };

  const getTotalNutrients = () => {
    if (!mealPlan) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    return Object.values(mealPlan).reduce((total: any, meal: any) => ({
      calories: total.calories + meal.calories,
      protein: total.protein + meal.protein,
      carbs: total.carbs + meal.carbs,
      fat: total.fat + meal.fat,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const resetPlan = () => {
    setMealPlan(null);
    setSelectedTemplate(null);
    setActiveTab("setup");
    setHasUnsavedChanges(false);
  };

  const canProceed = selectedPlayer && planType && dateRange.from && dateRange.to && (planName || planType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Plans
          </Button>
          <div className="h-6 w-px bg-border" />
          <div>
            <h1 className="text-2xl font-semibold">Create Nutrition Plan</h1>
            <p className="text-muted-foreground">
              {planMode === 'ai' ? 'Use AI to generate a personalized nutrition plan' : 
               planMode === 'template' ? 'Start with a template and customize' : 
               'Create a custom nutrition plan manually'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <Badge variant="outline" className="text-orange-600 border-orange-300">
              Unsaved changes
            </Badge>
          )}
          {mealPlan && (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset meal plan?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will delete all current meal plan data and return to the setup stage. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={resetPlan}>Reset</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button onClick={handleSavePlan} disabled={!canProceed}>
                <Save className="w-4 h-4 mr-2" />
                Save & Publish Plan
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="setup" disabled={false}>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Setup
            </div>
          </TabsTrigger>
          <TabsTrigger value="plan" disabled={!mealPlan}>
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              Plan Details
            </div>
          </TabsTrigger>
          <TabsTrigger value="review" disabled={!mealPlan}>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Review
            </div>
          </TabsTrigger>
        </TabsList>

        {/* Setup Tab */}
        <TabsContent value="setup" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Plan Mode Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Creation Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={planMode === 'ai' ? 'default' : 'outline'}
                    onClick={() => setPlanMode('ai')}
                    className="h-20 flex-col gap-2"
                  >
                    <Brain className="w-6 h-6" />
                    <span className="text-sm">AI Generated</span>
                  </Button>
                  <Button
                    variant={planMode === 'template' ? 'default' : 'outline'}
                    onClick={() => setPlanMode('template')}
                    className="h-20 flex-col gap-2"
                  >
                    <BookOpen className="w-6 h-6" />
                    <span className="text-sm">From Template</span>
                  </Button>
                  <Button
                    variant={planMode === 'manual' ? 'default' : 'outline'}
                    onClick={() => setPlanMode('manual')}
                    className="h-20 flex-col gap-2"
                  >
                    <User className="w-6 h-6" />
                    <span className="text-sm">Manual Creation</span>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {planMode === 'ai' 
                    ? 'AI will generate a personalized meal plan based on the player\'s profile and your specifications.' 
                    : planMode === 'template'
                    ? 'Start with a pre-built template and customize it for the specific athlete.'
                    : 'Create a meal plan from scratch with full control over every meal and ingredient.'}
                </p>
              </CardContent>
            </Card>

            {/* Plan Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Plan Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Plan Name</label>
                  <Input
                    placeholder="Enter plan name..."
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Select Player *</label>
                  <SimplePlayerSelector
                    value={selectedPlayer}
                    onValueChange={setSelectedPlayer}
                    placeholder="Choose a player"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Plan Type *</label>
                  <Select value={planType} onValueChange={setPlanType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight_gain">Weight Gain</SelectItem>
                      <SelectItem value="weight_loss">Weight Loss</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="competition_prep">Competition Prep</SelectItem>
                      <SelectItem value="recovery">Recovery</SelectItem>
                      <SelectItem value="endurance">Endurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Plan Duration *</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {getDateRangeDisplay()}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="p-3 border-b">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">Select Date Range</h4>
                          {dateRange.from && dateRange.to && (
                            <Badge variant="outline" className="text-xs">
                              {getDurationString()}
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2 mb-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setQuickRange(7)}
                            className="text-xs"
                          >
                            1 Week
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setQuickRange(14)}
                            className="text-xs"
                          >
                            2 Weeks
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setQuickRange(30)}
                            className="text-xs"
                          >
                            1 Month
                          </Button>
                        </div>
                      </div>
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={(range) => setDateRange(range || {from: undefined, to: undefined})}
                        numberOfMonths={2}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      />
                    </PopoverContent>
                  </Popover>
                  {dateRange.from && dateRange.to && (
                    <div className="text-sm text-muted-foreground">
                      Plan duration: {getDurationString()} 
                      <span className="text-xs ml-2">
                        ({format(dateRange.from, "MMM dd")} to {format(dateRange.to, "MMM dd, yyyy")})
                      </span>
                    </div>
                  )}
                </div>

                {planMode === 'template' && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Template</label>
                    <Button
                      variant="outline"
                      onClick={() => setShowTemplateSelector(true)}
                      className="w-full justify-start"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      {selectedTemplate ? selectedTemplate.name : 'Choose Template'}
                    </Button>
                    {selectedTemplate && (
                      <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded">
                        <p className="font-medium">{selectedTemplate.name}</p>
                        <p>{selectedTemplate.description}</p>
                        <p className="mt-1">
                          <Badge variant="outline" className="text-xs">
                            {selectedTemplate.category}
                          </Badge>
                          <span className="ml-2">{selectedTemplate.calories} calories</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Special Considerations */}
          <Card>
            <CardHeader>
              <CardTitle>Special Considerations</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={specialConsiderations}
                onChange={(e) => setSpecialConsiderations(e.target.value)}
                placeholder="Enter any special considerations, dietary restrictions, training schedule notes, or preferences..."
                rows={4}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            {planMode === 'ai' ? (
              <Button
                onClick={handleGenerateAIPlan}
                disabled={!canProceed || isGenerating}
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    Generating Plan...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Generate AI Plan
                  </>
                )}
              </Button>
            ) : planMode === 'template' ? (
              <Button
                onClick={() => selectedTemplate && handleUseTemplate(selectedTemplate)}
                disabled={!canProceed || !selectedTemplate}
                size="lg"
              >
                <Copy className="w-5 h-5 mr-2" />
                Use Template
              </Button>
            ) : (
              <Button
                onClick={handleCreateManualPlan}
                disabled={!canProceed}
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Manual Plan
              </Button>
            )}
          </div>
        </TabsContent>

        {/* Meal Plan Tab */}
        <TabsContent value="plan" className="space-y-6">
          {isGenerating ? (
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Sparkles className="h-16 w-16 text-primary mx-auto animate-pulse" />
                    <div className="space-y-2">
                      <p className="text-lg font-medium">AI is creating your personalized meal plan...</p>
                      <p className="text-sm text-muted-foreground">This may take a few moments</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : mealPlan ? (
            <>
              {/* Plan Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Daily Meal Plan</CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total Calories</p>
                        <p className="text-2xl font-bold text-primary">
                          {getTotalNutrients().calories}
                        </p>
                      </div>
                      {planMode === 'ai' && (
                        <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                          AI Generated
                        </Badge>
                      )}
                      {planMode === 'template' && selectedTemplate && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                          From Template
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <NutritionCards 
                    data={getTotalNutrients()} 
                    showProgress={false}
                  />
                </CardContent>
              </Card>

              {/* Meal Entries */}
              <div className="space-y-4">
                {Object.entries(mealPlan).map(([mealKey, meal]) => (
                  <Card key={mealKey}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <h3 className="font-semibold capitalize">
                              {mealKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </h3>
                            <Input
                              value={meal.time}
                              onChange={(e) => updateMealTime(mealKey, e.target.value)}
                              className="text-sm w-24 h-6 mt-1"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold">
                            {meal.calories} cal
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addFoodToMeal(mealKey)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {meal.foods.map((food, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{food.name}</p>
                            <p className="text-sm text-muted-foreground">{food.amount}</p>
                          </div>
                          <div className="flex items-center gap-6 text-sm">
                            <div className="text-center">
                              <p className="font-medium">{food.calories}</p>
                              <p className="text-xs text-muted-foreground">cal</p>
                            </div>
                            <div className="text-center">
                              <p className="font-medium text-blue-600">{food.protein}g</p>
                              <p className="text-xs text-muted-foreground">protein</p>
                            </div>
                            <div className="text-center">
                              <p className="font-medium text-green-600">{food.carbs}g</p>
                              <p className="text-xs text-muted-foreground">carbs</p>
                            </div>
                            <div className="text-center">
                              <p className="font-medium text-orange-600">{food.fat}g</p>
                              <p className="text-xs text-muted-foreground">fat</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFoodFromMeal(mealKey, index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {meal.foods.length === 0 && (
                        <div className="text-center py-4 text-muted-foreground">
                          <p>No foods added yet</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addFoodToMeal(mealKey)}
                            className="mt-2"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Food
                          </Button>
                        </div>
                      )}

                      <Separator />
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-medium">{meal.calories}</p>
                          <p className="text-xs text-muted-foreground">Total Calories</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-blue-600">{meal.protein}g</p>
                          <p className="text-xs text-muted-foreground">Protein</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-green-600">{meal.carbs}g</p>
                          <p className="text-xs text-muted-foreground">Carbs</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-orange-600">{meal.fat}g</p>
                          <p className="text-xs text-muted-foreground">Fat</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : null}
        </TabsContent>

        {/* Review Tab */}
        <TabsContent value="review" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plan Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Plan Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Player:</span>
                      <span>{selectedPlayerData?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plan Type:</span>
                      <span>{planType?.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{getDurationString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date Range:</span>
                      <span>{getDateRangeDisplay()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Creation Method:</span>
                      <span>
                        {planMode === 'ai' ? 'AI Generated' : 
                         planMode === 'template' ? `Template: ${selectedTemplate?.name}` : 
                         'Manual'}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Nutrition Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Calories:</span>
                      <span className="font-medium">{getTotalNutrients().calories}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Protein:</span>
                      <span className="font-medium text-blue-600">{getTotalNutrients().protein}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Carbohydrates:</span>
                      <span className="font-medium text-green-600">{getTotalNutrients().carbs}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fat:</span>
                      <span className="font-medium text-orange-600">{getTotalNutrients().fat}g</span>
                    </div>
                  </div>
                </div>
              </div>

              {specialConsiderations && (
                <div>
                  <h4 className="font-medium mb-2">Special Considerations</h4>
                  <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                    {specialConsiderations}
                  </p>
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={handleSavePlan} size="lg" className="px-8">
                  <Save className="w-5 h-5 mr-2" />
                  Save & Publish Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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

      {/* Template Selector Modal */}
      <Dialog open={showTemplateSelector} onOpenChange={setShowTemplateSelector}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Choose Template</DialogTitle>
            <DialogDescription>
              Select a template to start your meal plan
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Template Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={templateSearchTerm}
                onChange={(e) => setTemplateSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className={`cursor-pointer transition-all border-2 hover:border-primary/50 ${
                    selectedTemplate?.id === template.id ? 'border-primary' : ''
                  }`}
                  onClick={() => handleUseTemplate(template)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{template.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {template.description}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {template.calories} cal
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Used {template.timesUsed} times</span>
                      <span>By {template.createdBy}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No templates found matching your search</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreatePlanPage;