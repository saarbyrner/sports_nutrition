import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
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
} from "./ui/alert-dialog";
import {
  Brain,
  Sparkles,
  Clock,
  Target,
  Utensils,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Plus,
  Calendar,
  User,
  Settings,
  Download,
  Share,
  Edit,
  Trash2,
  Search,
  Filter,
  ArrowLeft,
  Activity,
  Zap,
  BarChart3,
  Users,
  BookOpen,
  Copy,
  Star,
  Tag,
  FileText,
  Bookmark
} from "lucide-react";

// Enhanced mock data for meal plans with AI insights
const initialMealPlans = [
  {
    id: "plan1",
    playerName: "Marcus Johnson",
    playerId: "p1",
    planType: "Weight Gain",
    dateCreated: "2025-01-12",
    status: "active",
    calories: 3200,
    aiConfidence: 94,
    editedBy: "AI + Manual Review",
    duration: "2 weeks",
    avatar: "MJ",
    mealPlan: {
      breakfast: {
        time: "7:00 AM",
        foods: ["Oatmeal with berries", "Greek yogurt", "Banana", "Almonds"],
        calories: 580,
        protein: 28,
        carbs: 78,
        fat: 18,
      },
      lunch: {
        time: "1:00 PM", 
        foods: ["Grilled chicken breast", "Quinoa", "Steamed vegetables", "Avocado"],
        calories: 750,
        protein: 52,
        carbs: 65,
        fat: 22,
      },
      dinner: {
        time: "7:00 PM",
        foods: ["Salmon fillet", "Sweet potato", "Green salad", "Olive oil dressing"],
        calories: 680,
        protein: 42,
        carbs: 58,
        fat: 25,
      }
    },
    aiInsights: [
      {
        type: "suggestion",
        message: "Based on training intensity, consider adding a post-workout protein shake within 30 minutes of training.",
        confidence: 89,
        impact: "high"
      },
      {
        type: "optimization", 
        message: "Meal timing aligns well with training schedule. Current carb distribution supports energy needs.",
        confidence: 92,
        impact: "medium"
      }
    ],
    compliance: 92,
    lastUpdated: "2 hours ago"
  },
  {
    id: "plan2",
    playerName: "Sarah Williams",
    playerId: "p2", 
    planType: "Competition Prep",
    dateCreated: "2025-01-11",
    status: "pending_review",
    calories: 2800,
    aiConfidence: 87,
    editedBy: "AI Generated",
    duration: "1 week",
    avatar: "SW",
    mealPlan: {
      breakfast: {
        time: "6:30 AM",
        foods: ["Protein pancakes", "Mixed berries", "Almond butter"],
        calories: 520,
        protein: 35,
        carbs: 45,
        fat: 18,
      },
      lunch: {
        time: "12:30 PM",
        foods: ["Turkey wrap", "Sweet potato fries", "Side salad"],
        calories: 680,
        protein: 42,
        carbs: 65,
        fat: 20,
      },
      dinner: {
        time: "6:30 PM",
        foods: ["Lean beef", "Brown rice", "Steamed broccoli"],
        calories: 620,
        protein: 45,
        carbs: 50,
        fat: 22,
      }
    },
    aiInsights: [
      {
        type: "alert",
        message: "Protein intake is consistently 10% below target. Consider adding whey protein supplement.",
        confidence: 94,
        impact: "high"
      },
      {
        type: "suggestion",
        message: "Competition is in 5 days. Consider increasing carb loading from day 3.",
        confidence: 88,
        impact: "medium"
      }
    ],
    compliance: 78,
    lastUpdated: "1 day ago"
  },
  {
    id: "plan3", 
    playerName: "David Chen",
    playerId: "p3",
    planType: "Recovery",
    dateCreated: "2025-01-10",
    status: "approved",
    calories: 2950,
    aiConfidence: 91,
    editedBy: "AI + Manual Review", 
    duration: "1 week",
    avatar: "DC",
    mealPlan: {
      breakfast: {
        time: "8:00 AM",
        foods: ["Overnight oats", "Protein powder", "Blueberries", "Walnuts"],
        calories: 540,
        protein: 30,
        carbs: 60,
        fat: 20,
      },
      lunch: {
        time: "1:30 PM",
        foods: ["Grilled salmon", "Quinoa salad", "Roasted vegetables"],
        calories: 720,
        protein: 48,
        carbs: 55,
        fat: 25,
      },
      dinner: {
        time: "7:30 PM", 
        foods: ["Turkey meatballs", "Whole grain pasta", "Marinara sauce"],
        calories: 640,
        protein: 40,
        carbs: 70,
        fat: 18,
      }
    },
    aiInsights: [
      {
        type: "optimization",
        message: "Anti-inflammatory foods are well integrated. Omega-3 levels are optimal for recovery.",
        confidence: 95,
        impact: "medium"
      },
      {
        type: "suggestion",
        message: "Consider adding tart cherry juice in evening for sleep quality improvement.",
        confidence: 76,
        impact: "low"
      }
    ],
    compliance: 95,
    lastUpdated: "6 hours ago"
  },
  {
    id: "plan4",
    playerName: "Emily Rodriguez", 
    playerId: "p4",
    planType: "Endurance",
    dateCreated: "2025-01-09",
    status: "active",
    calories: 3100,
    aiConfidence: 89,
    editedBy: "AI Generated",
    duration: "3 weeks", 
    avatar: "ER",
    mealPlan: {
      breakfast: {
        time: "6:00 AM",
        foods: ["Banana smoothie", "Granola", "Greek yogurt"],
        calories: 600,
        protein: 25,
        carbs: 85,
        fat: 15,
      },
      lunch: {
        time: "12:00 PM",
        foods: ["Chicken quinoa bowl", "Mixed vegetables", "Tahini dressing"],
        calories: 780,
        protein: 50,
        carbs: 70,
        fat: 28,
      },
      dinner: {
        time: "7:00 PM",
        foods: ["Lentil curry", "Brown rice", "Naan bread"],
        calories: 720,
        protein: 35,
        carbs: 95,
        fat: 20,
      }
    },
    aiInsights: [
      {
        type: "suggestion",
        message: "Carbohydrate periodization could be optimized. Increase carbs on high-intensity training days.",
        confidence: 87,
        impact: "high"
      }
    ],
    compliance: 88,
    lastUpdated: "4 hours ago"
  }
];

const globalAIInsights = [
  {
    type: "team_trend",
    message: "Team average protein compliance is 87%. 3 athletes need attention.",
    confidence: 91,
    impact: "medium",
    affectedPlayers: ["Sarah Williams", "Alex Thompson", "Maria Santos"]
  },
  {
    type: "optimization",
    message: "Meal timing analysis suggests moving team lunch 30 minutes earlier for better afternoon training performance.",
    confidence: 83,
    impact: "high",
    affectedPlayers: ["Team-wide recommendation"]
  },
  {
    type: "alert",
    message: "Iron intake is below recommended levels for 2 female athletes this month.",
    confidence: 94,
    impact: "high", 
    affectedPlayers: ["Sarah Williams", "Emily Rodriguez"]
  }
];

// Mock players for template usage
const mockPlayers = [
  { id: "p1", name: "Marcus Johnson", avatar: "MJ", team: "Men's Soccer" },
  { id: "p2", name: "Sarah Williams", avatar: "SW", team: "Women's Soccer" },
  { id: "p3", name: "David Chen", avatar: "DC", team: "Men's Basketball" },
  { id: "p4", name: "Emily Rodriguez", avatar: "ER", team: "Women's Soccer" },
  { id: "p5", name: "Alex Thompson", avatar: "AT", team: "Men's Soccer" },
];

interface AIPlanningProps {
  onCreatePlan: () => void;
  mealPlans: any[];
  onPlanCreate: (planData: any) => void;
  templates: any[];
  onTemplateCreate: (templateData: any) => void;
  onTemplateUpdate: (templateId: string, updatedData: any) => void;
  onTemplateDelete: (templateId: string) => void;
}

function AIPlanning({ 
  onCreatePlan, 
  mealPlans, 
  onPlanCreate, 
  templates, 
  onTemplateCreate, 
  onTemplateUpdate, 
  onTemplateDelete 
}: AIPlanningProps) {
  const [activeTab, setActiveTab] = useState("plans");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPlanDetail, setShowPlanDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [templateSearchTerm, setTemplateSearchTerm] = useState("");
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState("all");
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [showUseTemplate, setShowUseTemplate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    category: "",
    type: "",
    tags: [],
    mealPlan: null
  });

  // Combine initial mock plans with any new plans created
  const allPlans = [...mealPlans, ...initialMealPlans];

  const filteredPlans = allPlans.filter(plan => {
    const matchesSearch = plan.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.planType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || plan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(templateSearchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(templateSearchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(templateSearchTerm.toLowerCase()));
    const matchesCategory = templateCategoryFilter === "all" || template.category === templateCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const templateCategories = [...new Set(templates.map(t => t.category))];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Active
          </Badge>
        );
      case "pending_review":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending Review
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Approved
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "suggestion":
        return <Sparkles className="h-4 w-4 text-blue-500" />;
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "optimization":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "team_trend":
        return <BarChart3 className="h-4 w-4 text-purple-500" />;
      default:
        return <Brain className="h-4 w-4 text-primary" />;
    }
  };

  const handlePlanClick = (plan: any) => {
    setSelectedPlan(plan);
    setShowPlanDetail(true);
  };

  const handleBackToPlans = () => {
    setShowPlanDetail(false);
    setSelectedPlan(null);
  };

  const handleCreateTemplateFromPlan = (plan: any) => {
    setNewTemplate({
      name: `${plan.planType} Template`,
      description: `Template created from ${plan.playerName}'s ${plan.planType} plan`,
      category: plan.planType,
      type: plan.planType,
      tags: [plan.planType.toLowerCase().replace(' ', '-')],
      mealPlan: plan.mealPlan
    });
    setShowCreateTemplate(true);
  };

  const handleSaveTemplate = () => {
    if (!newTemplate.name || !newTemplate.description || !newTemplate.category) return;

    const templateData = {
      id: `template-${Date.now()}`,
      name: newTemplate.name,
      description: newTemplate.description,
      category: newTemplate.category,
      type: newTemplate.type || newTemplate.category,
      calories: newTemplate.mealPlan ? Object.values(newTemplate.mealPlan).reduce((sum: number, meal: any) => sum + meal.calories, 0) : 0,
      createdBy: "Dr. Sarah Johnson",
      dateCreated: new Date().toISOString().split('T')[0],
      timesUsed: 0,
      tags: newTemplate.tags,
      mealPlan: newTemplate.mealPlan || {
        breakfast: { time: "7:00 AM", foods: [], calories: 0, protein: 0, carbs: 0, fat: 0 },
        snack1: { time: "10:00 AM", foods: [], calories: 0, protein: 0, carbs: 0, fat: 0 },
        lunch: { time: "1:00 PM", foods: [], calories: 0, protein: 0, carbs: 0, fat: 0 },
        snack2: { time: "4:00 PM", foods: [], calories: 0, protein: 0, carbs: 0, fat: 0 },
        dinner: { time: "7:00 PM", foods: [], calories: 0, protein: 0, carbs: 0, fat: 0 },
        snack3: { time: "9:30 PM", foods: [], calories: 0, protein: 0, carbs: 0, fat: 0 },
      }
    };

    onTemplateCreate(templateData);
    setShowCreateTemplate(false);
    setNewTemplate({ name: "", description: "", category: "", type: "", tags: [], mealPlan: null });
  };

  const handleUseTemplate = (template: any, selectedPlayerId: string) => {
    const selectedPlayerData = mockPlayers.find(p => p.id === selectedPlayerId);
    if (!selectedPlayerData) return;

    const planData = {
      id: `plan-${Date.now()}`,
      playerName: selectedPlayerData.name,
      playerId: selectedPlayerId,
      planName: `${template.name} - ${selectedPlayerData.name}`,
      planType: template.type,
      duration: "1 week",
      dateCreated: new Date().toISOString().split('T')[0],
      status: 'active',
      calories: template.calories,
      aiConfidence: null,
      editedBy: `Template: ${template.name}`,
      specialConsiderations: `Created from template: ${template.name}`,
      mealPlan: template.mealPlan,
      avatar: selectedPlayerData.avatar,
      compliance: 0,
      lastUpdated: 'Just created',
      aiInsights: [
        {
          type: "suggestion",
          message: `Plan created from "${template.name}" template. Review and customize as needed.`,
          confidence: 85,
          impact: "medium"
        }
      ]
    };

    // Update template usage count
    onTemplateUpdate(template.id, { timesUsed: template.timesUsed + 1 });
    
    onPlanCreate(planData);
    setShowUseTemplate(false);
    setSelectedTemplate(null);
  };

  const stats = {
    totalPlans: allPlans.length,
    activePlans: allPlans.filter(p => p.status === 'active').length,
    pendingReview: allPlans.filter(p => p.status === 'pending_review').length,
    avgCompliance: Math.round(allPlans.reduce((sum, p) => sum + (p.compliance || 0), 0) / allPlans.length)
  };

  if (showPlanDetail && selectedPlan) {
    return (
      <div className="space-y-6">
        {/* Plan Detail Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleBackToPlans}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Plans
            </Button>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback>{selectedPlan.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold">{selectedPlan.playerName}</h1>
                <p className="text-muted-foreground">{selectedPlan.planType} Plan</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(selectedPlan.status)}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleCreateTemplateFromPlan(selectedPlan)}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Save as Template
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Plan
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Plan Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Daily Calories</p>
                  <p className="text-xl font-bold">{selectedPlan.calories}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">AI Confidence</p>
                  <p className="text-xl font-bold">{selectedPlan.aiConfidence}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Compliance</p>
                  <p className="text-xl font-bold">{selectedPlan.compliance}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-xl font-bold">{selectedPlan.duration}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Meal Plan Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="w-5 h-5" />
                Daily Meal Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(selectedPlan.mealPlan).map(([mealType, meal]) => (
                  <div key={mealType} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium capitalize">
                          {mealType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({meal.time})
                        </span>
                      </div>
                      <span className="font-semibold">
                        {meal.calories} cal
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      {meal.foods.join(", ")}
                    </div>
                    <div className="flex gap-6 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Protein:</span>
                        <span className="font-medium">{meal.protein}g</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Carbs:</span>
                        <span className="font-medium">{meal.carbs}g</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Fat:</span>
                        <span className="font-medium">{meal.fat}g</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Insights for this plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedPlan.aiInsights.map((insight, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium capitalize">
                            {insight.type.replace('_', ' ')}
                          </span>
                          <Badge
                            variant="outline"
                            className={
                              insight.impact === "high"
                                ? "border-red-500 text-red-700"
                                : insight.impact === "medium"
                                  ? "border-yellow-500 text-yellow-700"
                                  : "border-green-500 text-green-700"
                            }
                          >
                            {insight.impact}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {insight.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Confidence: {insight.confidence}%
                          </span>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                              Apply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Total Plans</p>
                    <p className="text-2xl font-bold">{stats.totalPlans}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Active Plans</p>
                    <p className="text-2xl font-bold">{stats.activePlans}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium">Pending Review</p>
                    <p className="text-2xl font-bold">{stats.pendingReview}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">Avg Compliance</p>
                    <p className="text-2xl font-bold">{stats.avgCompliance}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plans List Header */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <CardTitle>Meal Plans</CardTitle>
                <Button onClick={onCreatePlan}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Plan
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search plans..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={statusFilter === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("active")}
                  >
                    Active
                  </Button>
                  <Button
                    variant={statusFilter === "pending_review" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("pending_review")}
                  >
                    Pending
                  </Button>
                </div>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPlans.map((plan) => (
                  <Card 
                    key={plan.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/20"
                    onClick={() => handlePlanClick(plan)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="text-sm">
                              {plan.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{plan.playerName}</h3>
                            <p className="text-sm text-muted-foreground">{plan.planType}</p>
                          </div>
                        </div>
                        {getStatusBadge(plan.status)}
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Calories:</span>
                          <span className="text-sm font-medium">{plan.calories}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Duration:</span>
                          <span className="text-sm font-medium">{plan.duration}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Compliance:</span>
                          <span className={`text-sm font-medium ${plan.compliance >= 90 ? 'text-green-600' : plan.compliance >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {plan.compliance}%
                          </span>
                        </div>
                      </div>

                      {/* AI Insights Preview */}
                      {plan.aiInsights && plan.aiInsights.length > 0 && (
                        <div className="border-t pt-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">AI Insights</span>
                          </div>
                          <div className="space-y-1">
                            {plan.aiInsights.slice(0, 2).map((insight, index) => (
                              <div key={index} className="flex items-center gap-2">
                                {getInsightIcon(insight.type)}
                                <span className="text-xs text-muted-foreground truncate">
                                  {insight.message.substring(0, 60)}...
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="border-t pt-3 mt-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Updated {plan.lastUpdated}</span>
                          <span>AI {plan.aiConfidence}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredPlans.length === 0 && (
                <div className="text-center py-8">
                  <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No meal plans found matching your criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Team AI Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {globalAIInsights.map((insight, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getInsightIcon(insight.type)}
                        <span className="font-medium capitalize">
                          {insight.type.replace('_', ' ')}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          insight.impact === "high"
                            ? "border-red-500 text-red-700"
                            : insight.impact === "medium"
                              ? "border-yellow-500 text-yellow-700"
                              : "border-green-500 text-green-700"
                        }
                      >
                        {insight.impact} impact
                      </Badge>
                    </div>

                    <p className="text-sm mb-3">
                      {insight.message}
                    </p>

                    {insight.affectedPlayers && (
                      <div className="mb-3">
                        <p className="text-xs text-muted-foreground mb-1">Affected players:</p>
                        <div className="flex flex-wrap gap-1">
                          {insight.affectedPlayers.map((player, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {player}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        AI Confidence: {insight.confidence}%
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Apply to Team
                        </Button>
                        <Button size="sm" variant="ghost">
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Meal Plan Templates
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Save and reuse meal plans as templates for faster planning
                  </p>
                </div>
                <Button onClick={() => setShowCreateTemplate(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Template Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search templates..."
                    value={templateSearchTerm}
                    onChange={(e) => setTemplateSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={templateCategoryFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTemplateCategoryFilter("all")}
                  >
                    All Categories
                  </Button>
                  {templateCategories.map((category) => (
                    <Button
                      key={category}
                      variant={templateCategoryFilter === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTemplateCategoryFilter(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Templates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="relative group">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{template.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {template.description}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedTemplate(template);
                              setShowUseTemplate(true);
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Template</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{template.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onTemplateDelete(template.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Calories:</span>
                          <span className="text-sm font-medium">{template.calories}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Times Used:</span>
                          <span className="text-sm font-medium">{template.timesUsed}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Created:</span>
                          <span className="text-sm font-medium">{template.dateCreated}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {template.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="border-t pt-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>By {template.createdBy}</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedTemplate(template);
                              setShowUseTemplate(true);
                            }}
                          >
                            Use Template
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No templates found matching your criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Template Modal */}
      <Dialog open={showCreateTemplate} onOpenChange={setShowCreateTemplate}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>
              Create a reusable meal plan template for faster planning
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Template Name</label>
              <Input
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                placeholder="e.g., High-Intensity Training Day"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                placeholder="Brief description of when to use this template..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select
                  value={newTemplate.category}
                  onValueChange={(value) => setNewTemplate({ ...newTemplate, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Weight Gain">Weight Gain</SelectItem>
                    <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                    <SelectItem value="Competition">Competition</SelectItem>
                    <SelectItem value="Recovery">Recovery</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <Input
                  value={newTemplate.type}
                  onChange={(e) => setNewTemplate({ ...newTemplate, type: e.target.value })}
                  placeholder="e.g., High-Intensity"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tags (comma-separated)</label>
              <Input
                value={newTemplate.tags.join(', ')}
                onChange={(e) => setNewTemplate({ 
                  ...newTemplate, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                })}
                placeholder="e.g., high-carb, protein, recovery"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateTemplate(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveTemplate}>
                Save Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Use Template Modal */}
      <Dialog open={showUseTemplate} onOpenChange={setShowUseTemplate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Use Template: {selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              Select an athlete to apply this template to
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Player</label>
              <Select onValueChange={(playerId) => handleUseTemplate(selectedTemplate, playerId)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a player" />
                </SelectTrigger>
                <SelectContent>
                  {mockPlayers.map((player) => (
                    <SelectItem key={player.id} value={player.id}>
                      <div className="flex items-center gap-2">
                        <span>{player.name}</span>
                        <span className="text-xs text-muted-foreground">
                          - {player.team}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-sm font-medium">Template Preview:</p>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedTemplate?.description}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Calories: {selectedTemplate?.calories} | Category: {selectedTemplate?.category}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AIPlanning;