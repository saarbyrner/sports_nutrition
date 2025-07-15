import React, { useState, useEffect } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "./components/ui/sidebar";
import { Button } from "./components/ui/button";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import { Badge } from "./components/ui/badge";
import {
  Home,
  Users,
  UserCircle,
  Brain,
  MessageCircle,
  Settings,
  LogOut,
  ChefHat,
  BarChart3,
  Calendar,
} from "lucide-react";

// Import components
import Dashboard from "./components/Dashboard";
import PlayerManagement from "./components/PlayerManagement";
import PlayerProfile from "./components/PlayerProfile";
import AIPlanning from "./components/AIPlanning";
import CreatePlanPage from "./components/CreatePlanPage";
import Collaboration from "./components/Collaboration";
import NutritionCalendar from "./components/NutritionCalendar";
import Analytics from "./components/Analytics";
import SettingsPage from "./components/Settings";
import UserProfile from "./components/UserProfile";

// Mock user data
const mockUser = {
  name: "Dr. Sarah Johnson",
  role: "Lead Sports Dietitian",
  organization: "Elite Sports Academy",
  initials: "SJ",
  userRole: "admin", // For role-based access - admin can access branding settings
};

// Default branding settings
const defaultBranding = {
  organizationName: "NutriSport AI",
  tagline: "Sports Nutrition",
  logo: null as string | null,
  primaryColor: "#030213",
};

// Initial templates data
const initialTemplates = [
  {
    id: "template-1",
    name: "High-Intensity Training Day",
    description: "For athletes during intense training sessions with focus on quick energy and recovery",
    category: "Training",
    calories: 3200,
    type: "High-Intensity",
    createdBy: "Dr. Sarah Johnson",
    dateCreated: "2025-01-10",
    timesUsed: 15,
    tags: ["high-carb", "protein", "recovery"],
    mealPlan: {
      breakfast: {
        time: "6:30 AM",
        foods: [
          { name: "Overnight oats with banana", amount: "1 cup", calories: 320, protein: 12, carbs: 58, fat: 8 },
          { name: "Greek yogurt", amount: "150g", calories: 150, protein: 15, carbs: 8, fat: 4 },
          { name: "Berries", amount: "100g", calories: 60, protein: 1, carbs: 14, fat: 0 },
        ],
        calories: 530,
        protein: 28,
        carbs: 80,
        fat: 12,
      },
      snack1: {
        time: "9:00 AM",
        foods: [
          { name: "Banana", amount: "1 large", calories: 120, protein: 1, carbs: 31, fat: 0 },
          { name: "Almond butter", amount: "15g", calories: 90, protein: 3, carbs: 3, fat: 8 },
        ],
        calories: 210,
        protein: 4,
        carbs: 34,
        fat: 8,
      },
      lunch: {
        time: "12:30 PM",
        foods: [
          { name: "Grilled chicken breast", amount: "150g", calories: 280, protein: 53, carbs: 0, fat: 6 },
          { name: "Brown rice", amount: "100g cooked", calories: 120, protein: 3, carbs: 25, fat: 1 },
          { name: "Steamed broccoli", amount: "150g", calories: 40, protein: 4, carbs: 8, fat: 0 },
          { name: "Avocado", amount: "1/2 medium", calories: 160, protein: 2, carbs: 9, fat: 15 },
        ],
        calories: 600,
        protein: 62,
        carbs: 42,
        fat: 22,
      },
      snack2: {
        time: "3:30 PM",
        foods: [
          { name: "Protein shake", amount: "1 scoop", calories: 140, protein: 25, carbs: 5, fat: 2 },
          { name: "Apple", amount: "1 medium", calories: 95, protein: 0, carbs: 25, fat: 0 },
        ],
        calories: 235,
        protein: 25,
        carbs: 30,
        fat: 2,
      },
      dinner: {
        time: "7:00 PM",
        foods: [
          { name: "Salmon fillet", amount: "120g", calories: 280, protein: 39, carbs: 0, fat: 13 },
          { name: "Sweet potato", amount: "200g", calories: 180, protein: 4, carbs: 41, fat: 0 },
          { name: "Mixed vegetables", amount: "150g", calories: 50, protein: 3, carbs: 10, fat: 0 },
          { name: "Olive oil", amount: "1 tbsp", calories: 120, protein: 0, carbs: 0, fat: 14 },
        ],
        calories: 630,
        protein: 46,
        carbs: 51,
        fat: 27,
      },
      snack3: {
        time: "9:30 PM",
        foods: [
          { name: "Cottage cheese", amount: "100g", calories: 100, protein: 12, carbs: 4, fat: 4 },
          { name: "Walnuts", amount: "15g", calories: 100, protein: 2, carbs: 2, fat: 10 },
        ],
        calories: 200,
        protein: 14,
        carbs: 6,
        fat: 14,
      },
    },
  },
  {
    id: "template-2",
    name: "Weight Gain Foundation",
    description: "Calorie-dense meals for athletes looking to gain muscle mass",
    category: "Weight Gain",
    calories: 3500,
    type: "Weight Gain",
    createdBy: "Dr. Sarah Johnson",
    dateCreated: "2025-01-08",
    timesUsed: 22,
    tags: ["high-calorie", "muscle-building", "protein"],
    mealPlan: {
      breakfast: {
        time: "7:00 AM",
        foods: [
          { name: "Scrambled eggs", amount: "3 eggs", calories: 210, protein: 18, carbs: 2, fat: 15 },
          { name: "Whole grain toast", amount: "2 slices", calories: 160, protein: 8, carbs: 30, fat: 2 },
          { name: "Peanut butter", amount: "30g", calories: 180, protein: 8, carbs: 6, fat: 16 },
          { name: "Orange juice", amount: "250ml", calories: 110, protein: 2, carbs: 26, fat: 0 },
        ],
        calories: 660,
        protein: 36,
        carbs: 64,
        fat: 33,
      },
      snack1: {
        time: "10:00 AM",
        foods: [
          { name: "Protein smoothie", amount: "300ml", calories: 280, protein: 25, carbs: 35, fat: 8 },
          { name: "Granola", amount: "30g", calories: 150, protein: 4, carbs: 22, fat: 6 },
        ],
        calories: 430,
        protein: 29,
        carbs: 57,
        fat: 14,
      },
      lunch: {
        time: "1:00 PM",
        foods: [
          { name: "Lean beef", amount: "150g", calories: 330, protein: 50, carbs: 0, fat: 13 },
          { name: "Quinoa", amount: "100g cooked", calories: 120, protein: 4, carbs: 22, fat: 2 },
          { name: "Mixed salad", amount: "100g", calories: 20, protein: 2, carbs: 4, fat: 0 },
          { name: "Olive oil dressing", amount: "15ml", calories: 120, protein: 0, carbs: 0, fat: 14 },
        ],
        calories: 590,
        protein: 56,
        carbs: 26,
        fat: 29,
      },
      snack2: {
        time: "4:00 PM",
        foods: [
          { name: "Trail mix", amount: "50g", calories: 250, protein: 8, carbs: 20, fat: 16 },
          { name: "Chocolate milk", amount: "250ml", calories: 190, protein: 8, carbs: 26, fat: 8 },
        ],
        calories: 440,
        protein: 16,
        carbs: 46,
        fat: 24,
      },
      dinner: {
        time: "7:30 PM",
        foods: [
          { name: "Chicken thigh", amount: "150g", calories: 320, protein: 45, carbs: 0, fat: 15 },
          { name: "Pasta", amount: "100g dry", calories: 350, protein: 12, carbs: 70, fat: 2 },
          { name: "Marinara sauce", amount: "100ml", calories: 50, protein: 2, carbs: 10, fat: 1 },
          { name: "Parmesan cheese", amount: "20g", calories: 80, protein: 8, carbs: 1, fat: 5 },
        ],
        calories: 800,
        protein: 67,
        carbs: 81,
        fat: 23,
      },
      snack3: {
        time: "10:00 PM",
        foods: [
          { name: "Casein protein", amount: "1 scoop", calories: 120, protein: 24, carbs: 3, fat: 1 },
          { name: "Whole milk", amount: "250ml", calories: 150, protein: 8, carbs: 12, fat: 8 },
          { name: "Almonds", amount: "20g", calories: 120, protein: 4, carbs: 3, fat: 10 },
        ],
        calories: 390,
        protein: 36,
        carbs: 18,
        fat: 19,
      },
    },
  },
  {
    id: "template-3",
    name: "Competition Day Prep",
    description: "Optimized nutrition for game day performance",
    category: "Competition",
    calories: 2800,
    type: "Competition Prep",
    createdBy: "Dr. Sarah Johnson",
    dateCreated: "2025-01-05",
    timesUsed: 8,
    tags: ["gameday", "performance", "easily-digestible"],
    mealPlan: {
      breakfast: {
        time: "8:00 AM",
        foods: [
          { name: "Oatmeal", amount: "1 cup", calories: 150, protein: 5, carbs: 30, fat: 3 },
          { name: "Banana", amount: "1 medium", calories: 105, protein: 1, carbs: 27, fat: 0 },
          { name: "Honey", amount: "1 tbsp", calories: 60, protein: 0, carbs: 16, fat: 0 },
          { name: "Low-fat milk", amount: "200ml", calories: 100, protein: 8, carbs: 12, fat: 2 },
        ],
        calories: 415,
        protein: 14,
        carbs: 85,
        fat: 5,
      },
      snack1: {
        time: "10:30 AM",
        foods: [
          { name: "Sports drink", amount: "250ml", calories: 60, protein: 0, carbs: 15, fat: 0 },
          { name: "Energy bar", amount: "1 bar", calories: 200, protein: 8, carbs: 40, fat: 4 },
        ],
        calories: 260,
        protein: 8,
        carbs: 55,
        fat: 4,
      },
      lunch: {
        time: "12:00 PM",
        foods: [
          { name: "Grilled chicken", amount: "100g", calories: 185, protein: 35, carbs: 0, fat: 4 },
          { name: "White rice", amount: "100g cooked", calories: 130, protein: 3, carbs: 28, fat: 0 },
          { name: "Steamed carrots", amount: "100g", calories: 35, protein: 1, carbs: 8, fat: 0 },
        ],
        calories: 350,
        protein: 39,
        carbs: 36,
        fat: 4,
      },
      snack2: {
        time: "2:30 PM",
        foods: [
          { name: "White bread", amount: "2 slices", calories: 160, protein: 6, carbs: 32, fat: 2 },
          { name: "Jam", amount: "20g", calories: 50, protein: 0, carbs: 13, fat: 0 },
        ],
        calories: 210,
        protein: 6,
        carbs: 45,
        fat: 2,
      },
      dinner: {
        time: "6:00 PM",
        foods: [
          { name: "Pasta", amount: "100g dry", calories: 350, protein: 12, carbs: 70, fat: 2 },
          { name: "Tomato sauce", amount: "100ml", calories: 40, protein: 2, carbs: 8, fat: 0 },
          { name: "Lean ground turkey", amount: "80g", calories: 150, protein: 28, carbs: 0, fat: 4 },
        ],
        calories: 540,
        protein: 42,
        carbs: 78,
        fat: 6,
      },
      snack3: {
        time: "8:30 PM",
        foods: [
          { name: "Crackers", amount: "10 pieces", calories: 120, protein: 3, carbs: 20, fat: 4 },
          { name: "Electrolyte drink", amount: "250ml", calories: 40, protein: 0, carbs: 10, fat: 0 },
        ],
        calories: 160,
        protein: 3,
        carbs: 30,
        fat: 4,
      },
    },
  },
];

// Navigation items based on user role
const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "players", label: "Player Management", icon: Users },
  { id: "ai-planning", label: "Meal Plans", icon: Brain },
  {
    id: "collaboration",
    label: "Collaboration",
    icon: MessageCircle,
  },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "calendar", label: "Calendar", icon: Calendar },
];

const settingsItems = [
  { id: "settings", label: "Settings", icon: Settings },
];

function App() {
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedPlayerId, setSelectedPlayerId] = useState<
    string | null
  >(null);
  const [currentReport, setCurrentReport] = useState<
    string | null
  >(null);
  const [branding, setBranding] = useState(defaultBranding);
  const [mealPlans, setMealPlans] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>(initialTemplates);

  // Update CSS custom properties when primary color changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", branding.primaryColor);
    root.style.setProperty(
      "--sidebar-primary",
      branding.primaryColor,
    );
  }, [branding.primaryColor]);

  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayerId(playerId);
    setActiveView("player-profile");
  };

  const handleAvatarClick = () => {
    setActiveView("user-profile");
  };

  const handleBrandingUpdate = (
    newBranding: Partial<typeof branding>,
  ) => {
    setBranding((prev) => ({ ...prev, ...newBranding }));
  };

  const handleReportChange = (reportId: string | null) => {
    setCurrentReport(reportId);
  };

  const handleNavigation = (viewId: string) => {
    setActiveView(viewId);
    // Reset analytics report when navigating away from analytics
    if (viewId !== "analytics") {
      setCurrentReport(null);
    }
  };

  const handleCreatePlan = () => {
    setActiveView("create-plan");
  };

  const handlePlanCreate = (planData: any) => {
    setMealPlans(prev => [planData, ...prev]);
  };

  const handleTemplateCreate = (templateData: any) => {
    setTemplates(prev => [templateData, ...prev]);
  };

  const handleTemplateUpdate = (templateId: string, updatedData: any) => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === templateId ? { ...template, ...updatedData } : template
      )
    );
  };

  const handleTemplateDelete = (templateId: string) => {
    setTemplates(prev => prev.filter(template => template.id !== templateId));
  };

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <Dashboard onPlayerSelect={handlePlayerSelect} />
        );
      case "players":
        return (
          <PlayerManagement
            onPlayerSelect={handlePlayerSelect}
          />
        );
      case "player-profile":
        return (
          <PlayerProfile
            playerId={selectedPlayerId}
            onBack={() => setActiveView("players")}
          />
        );
      case "ai-planning":
        return (
          <AIPlanning 
            onCreatePlan={handleCreatePlan}
            mealPlans={mealPlans}
            onPlanCreate={handlePlanCreate}
            templates={templates}
            onTemplateCreate={handleTemplateCreate}
            onTemplateUpdate={handleTemplateUpdate}
            onTemplateDelete={handleTemplateDelete}
          />
        );
      case "create-plan":
        return (
          <CreatePlanPage
            onBack={() => setActiveView("ai-planning")}
            onPlanCreate={handlePlanCreate}
            templates={templates}
          />
        );
      case "collaboration":
        return <Collaboration />;
      case "analytics":
        return (
          <Analytics
            currentReport={currentReport}
            onReportChange={handleReportChange}
          />
        );
      case "calendar":
        return (
          <NutritionCalendar
            onPlayerSelect={handlePlayerSelect}
          />
        );
      case "settings":
        return (
          <SettingsPage
            user={mockUser}
            branding={branding}
            onBrandingUpdate={handleBrandingUpdate}
          />
        );
      case "user-profile":
        return (
          <UserProfile
            user={mockUser}
            onBack={() => setActiveView("dashboard")}
          />
        );
      default:
        return (
          <Dashboard onPlayerSelect={handlePlayerSelect} />
        );
    }
  };

  const getActiveTitle = () => {
    switch (activeView) {
      case "user-profile":
        return "My Profile";
      case "analytics":
        return currentReport ? "Report View" : "Analytics";
      case "create-plan":
        return "Create Meal Plan";
      default:
        const navItem = [
          ...navigationItems,
          ...settingsItems,
        ].find((item) => item.id === activeView);
        return navItem?.label || "Dashboard";
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-background">
        <Sidebar className="border-r border-border">
          <SidebarHeader className="border-b border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                {branding.logo ? (
                  <img
                    src={branding.logo}
                    alt="Logo"
                    className="w-5 h-5 object-contain"
                  />
                ) : (
                  <ChefHat className="w-5 h-5 text-primary-foreground" />
                )}
              </div>
              <div>
                <h2 className="text-sm font-semibold">
                  {branding.organizationName}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {branding.tagline}
                </p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-2">
            <SidebarGroup>
              <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={activeView === item.id}
                        onClick={() =>
                          handleNavigation(item.id)
                        }
                        className="w-full justify-start"
                      >
                        <item.icon className="w-4 h-4 mr-3" />
                        {item.label}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {settingsItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={activeView === item.id}
                        onClick={() =>
                          handleNavigation(item.id)
                        }
                        className="w-full justify-start"
                      >
                        <item.icon className="w-4 h-4 mr-3" />
                        {item.label}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-border p-4">
            <div className="flex items-center gap-3">
              <Avatar
                className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-ring transition-all"
                onClick={handleAvatarClick}
              >
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {mockUser.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {mockUser.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {mockUser.role}
                </p>
              </div>
              <Button variant="ghost" size="sm">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="flex items-center justify-between p-4 border-b border-border bg-card">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-xl font-semibold">
                  {getActiveTitle()}
                </h1>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default App;