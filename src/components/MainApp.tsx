'use client'

import React, { useState, useEffect } from "react";
import { useAuth } from '@/contexts/AuthContext';
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
} from "./ui/sidebar";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Home,
  Users,
  Brain,
  MessageCircle,
  Settings,
  LogOut,
  ChefHat,
  BarChart3,
  Calendar,
} from "lucide-react";

// Import components
import Dashboard from "./Dashboard";
import PlayerManagementReal from "./PlayerManagementReal";
import PlayerProfile from "./PlayerProfile";
import MealPlanManagementTest from "./MealPlanManagementTest";
import CreatePlanPage from "./CreatePlanPage";
import Collaboration from "./Collaboration";
import NutritionCalendarReal from "./NutritionCalendarReal";
import AnalyticsReal from "./AnalyticsReal";
import SettingsPage from "./Settings";
import UserProfile from "./UserProfile";

// Default branding settings
const defaultBranding = {
  organizationName: "NutriSport AI",
  tagline: "Sports Nutrition",
  logo: null as string | null,
  primaryColor: "#030213",
};

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

export default function MainApp() {
  const { user, signOut } = useAuth();
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [currentReport, setCurrentReport] = useState<string | null>(null);
  const [branding, setBranding] = useState(defaultBranding);
  const [mealPlans, setMealPlans] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);

  // Mock user data - will be replaced with real user data
  const mockUser = {
    name: user?.first_name && user?.last_name 
      ? `${user.first_name} ${user.last_name}`
      : user?.email || "User",
    role: user?.role || "dietitian",
    organization: user?.organization || "Elite Sports Academy",
    initials: user?.first_name && user?.last_name 
      ? `${user.first_name[0]}${user.last_name[0]}`
      : user?.email?.[0]?.toUpperCase() || "U",
    userRole: user?.role || "dietitian",
  };

  // Update CSS custom properties when primary color changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", branding.primaryColor);
    root.style.setProperty("--sidebar-primary", branding.primaryColor);
  }, [branding.primaryColor]);

  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayerId(playerId);
    setActiveView("player-profile");
  };

  const handleAvatarClick = () => {
    setActiveView("user-profile");
  };

  const handleBrandingUpdate = (newBranding: Partial<typeof branding>) => {
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

  const handleSignOut = async () => {
    await signOut();
  };

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard onPlayerSelect={handlePlayerSelect} />;
      case "players":
        return <PlayerManagementReal onPlayerSelect={handlePlayerSelect} />;
      case "player-profile":
        return (
          <PlayerProfile
            playerId={selectedPlayerId}
            onBack={() => setActiveView("players")}
          />
        );
      case "ai-planning":
        return (
          <MealPlanManagementTest 
            onPlanSelect={(planId) => console.log('Selected plan:', planId)}
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
        return <AnalyticsReal />;
      case "calendar":
        return <NutritionCalendarReal onPlayerSelect={handlePlayerSelect} />;
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
        return <Dashboard onPlayerSelect={handlePlayerSelect} />;
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
        const navItem = [...navigationItems, ...settingsItems].find(
          (item) => item.id === activeView
        );
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
                        onClick={() => handleNavigation(item.id)}
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
                        onClick={() => handleNavigation(item.id)}
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
                <p className="text-sm font-medium truncate">{mockUser.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {mockUser.role}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
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
                <h1 className="text-xl font-semibold">{getActiveTitle()}</h1>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}