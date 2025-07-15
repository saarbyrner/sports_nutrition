import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Building2,
  Brain,
  Database,
  Shield,
  Link,
  Save,
  Upload,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Users,
  Crown,
  Mail,
  Calendar,
  Key,
  HardDrive,
  RefreshCw,
  ExternalLink,
  Activity,
  Palette,
  Image,
  ChefHat,
} from "lucide-react";

interface User {
  name: string;
  role: string;
  organization: string;
  initials: string;
  userRole: string;
}

interface Branding {
  organizationName: string;
  tagline: string;
  logo: string | null;
  primaryColor: string;
}

interface SettingsPageProps {
  user: User;
  branding: Branding;
  onBrandingUpdate: (branding: Partial<Branding>) => void;
}

// Mock organization settings for admins
const organizationSettings = {
  name: "Elite Sports Academy",
  type: "Sports Academy",
  country: "United Kingdom",
  timezone: "Europe/London",
  language: "English (UK)",
  units: "metric",
  currency: "GBP",
  address: "123 Sports Complex Drive, London, UK",
  phone: "+44 20 1234 5678",
  email: "info@elitesportsacademy.com",
  website: "https://elitesportsacademy.com",
  logo: null,
  branding: {
    primaryColor: "#030213",
    secondaryColor: "#3B82F6",
  },
};

const userRoles = [
  {
    value: "admin",
    label: "Organization Admin",
    description: "Full access to all features and settings",
  },
  {
    value: "dietitian",
    label: "Dietitian/Nutritionist",
    description:
      "Full access to nutrition planning and athlete data",
  },
  {
    value: "coach",
    label: "Coach/Performance Staff",
    description:
      "View access to nutrition data with commenting ability",
  },
  {
    value: "athlete",
    label: "Athlete",
    description: "Access to own nutrition plans and data",
  },
];

// Color palette options
const colorOptions = [
  { name: "Dark Blue (Default)", value: "#030213" },
  { name: "Ocean Blue", value: "#0369a1" },
  { name: "Emerald Green", value: "#059669" },
  { name: "Purple", value: "#7c3aed" },
  { name: "Orange", value: "#ea580c" },
  { name: "Rose", value: "#e11d48" },
  { name: "Slate", value: "#334155" },
  { name: "Teal", value: "#0d9488" },
];

function SettingsPage({
  user,
  branding,
  onBrandingUpdate,
}: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState("branding");
  const [showDeleteDialog, setShowDeleteDialog] =
    useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // AI preferences state
  const [aiPreferences, setAiPreferences] = useState({
    autoGenerate: true,
    confidenceThreshold: 85,
    includeAlternatives: true,
    learningMode: "conservative",
    dataSharing: true,
    explanations: true,
    reviewRequired: true,
  });

  // Organization security settings state
  const [orgSecuritySettings, setOrgSecuritySettings] =
    useState({
      sessionTimeout: 480, // 8 hours in minutes
      passwordPolicy: "strong",
      twoFactorRequired: false,
      ipWhitelisting: false,
      auditLogging: true,
    });

  const isAdmin = user.userRole === "admin";
  const isDietitian =
    user.userRole === "dietitian" || user.userRole === "admin";

  const handleSaveChanges = () => {
    console.log("Saving organization settings...");
    setUnsavedChanges(false);
  };

  const handleFormChange = (
    section: string,
    field: string,
    value: any,
  ) => {
    setUnsavedChanges(true);
    switch (section) {
      case "ai":
        setAiPreferences((prev) => ({
          ...prev,
          [field]: value,
        }));
        break;
      case "security":
        setOrgSecuritySettings((prev) => ({
          ...prev,
          [field]: value,
        }));
        break;
    }
  };

  const handleLogoUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onBrandingUpdate({ logo: result });
        setUnsavedChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBrandingChange = (
    field: keyof Branding,
    value: string,
  ) => {
    onBrandingUpdate({ [field]: value });
    setUnsavedChanges(true);
  };

  // Create dynamic tabs based on user role
  const getTabs = () => {
    const tabs = [];

    if (isAdmin) {
      tabs.push({ id: "branding", label: "Branding" });
      tabs.push({ id: "organization", label: "Organization" });
    }

    if (isDietitian) {
      tabs.push({ id: "ai", label: "AI Settings" });
    }

    tabs.push(
      { id: "data", label: "Data" },
      { id: "security", label: "Security" },
      { id: "integrations", label: "Integrations" },
    );

    console.log(
      "Generated tabs:",
      tabs,
      "isAdmin:",
      isAdmin,
      "isDietitian:",
      isDietitian,
      "userRole:",
      user.userRole,
    );
    return tabs;
  };

  const tabs = getTabs();

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="flex w-full">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Branding Settings (Admin Only) */}
        {isAdmin && (
          <TabsContent value="branding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Brand Identity
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Customize your organization's branding and
                  visual identity
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Logo Section */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">
                      Organization Logo
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Upload a logo to represent your
                      organization. Recommended size: 64x64px or
                      larger, square format.
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-lg">
                      {branding.logo ? (
                        <img
                          src={branding.logo}
                          alt="Organization Logo"
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <ChefHat className="w-8 h-8 text-primary-foreground" />
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <label
                            htmlFor="logo-upload"
                            className="cursor-pointer"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Logo
                          </label>
                        </Button>
                        <input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        {branding.logo && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleBrandingChange("logo", "")
                            }
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG, or SVG. Max file size 2MB.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Organization Name & Tagline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="org-name">
                      Organization Name
                    </Label>
                    <Input
                      id="org-name"
                      value={branding.organizationName}
                      onChange={(e) =>
                        handleBrandingChange(
                          "organizationName",
                          e.target.value,
                        )
                      }
                      placeholder="Enter organization name"
                    />
                    <p className="text-xs text-muted-foreground">
                      This appears in the sidebar and throughout
                      the application
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={branding.tagline}
                      onChange={(e) =>
                        handleBrandingChange(
                          "tagline",
                          e.target.value,
                        )
                      }
                      placeholder="Enter tagline"
                    />
                    <p className="text-xs text-muted-foreground">
                      Brief description shown below the
                      organization name
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Color Customization */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">
                      Primary Color
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Choose the primary color for buttons and
                      highlights throughout the application
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-3">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          onClick={() =>
                            handleBrandingChange(
                              "primaryColor",
                              color.value,
                            )
                          }
                          className={`relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                            branding.primaryColor ===
                            color.value
                              ? "border-ring shadow-sm"
                              : "border-border hover:border-ring/50"
                          }`}
                        >
                          <div
                            className="w-8 h-8 rounded-full border border-border"
                            style={{
                              backgroundColor: color.value,
                            }}
                          />
                          <span className="text-xs text-center font-medium">
                            {color.name}
                          </span>
                          {branding.primaryColor ===
                            color.value && (
                            <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-primary bg-background rounded-full" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-4">
                      <Label htmlFor="custom-color">
                        Custom Color:
                      </Label>
                      <div className="flex items-center gap-2">
                        <input
                          id="custom-color"
                          type="color"
                          value={branding.primaryColor}
                          onChange={(e) =>
                            handleBrandingChange(
                              "primaryColor",
                              e.target.value,
                            )
                          }
                          className="w-10 h-8 rounded border border-border cursor-pointer"
                        />
                        <Input
                          value={branding.primaryColor}
                          onChange={(e) =>
                            handleBrandingChange(
                              "primaryColor",
                              e.target.value,
                            )
                          }
                          placeholder="#000000"
                          className="w-24 font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Preview Section */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">
                      Preview
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      See how your branding changes will look
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="flex items-center justify-center w-8 h-8 rounded-lg"
                        style={{
                          backgroundColor:
                            branding.primaryColor,
                        }}
                      >
                        {branding.logo ? (
                          <img
                            src={branding.logo}
                            alt="Logo Preview"
                            className="w-5 h-5 object-contain"
                          />
                        ) : (
                          <ChefHat className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">
                          {branding.organizationName}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {branding.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        style={{
                          backgroundColor:
                            branding.primaryColor,
                        }}
                        className="text-white hover:opacity-90"
                      >
                        Primary Button
                      </Button>
                      <Button variant="outline" size="sm">
                        Secondary Button
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Organization Settings (Admin Only) */}
        {isAdmin && (
          <TabsContent
            value="organization"
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Organization Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Organization Name</Label>
                    <Input value={organizationSettings.name} />
                  </div>
                  <div className="space-y-2">
                    <Label>Organization Type</Label>
                    <Select value={organizationSettings.type}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sports Academy">
                          Sports Academy
                        </SelectItem>
                        <SelectItem value="Professional Club">
                          Professional Club
                        </SelectItem>
                        <SelectItem value="University">
                          University
                        </SelectItem>
                        <SelectItem value="High School">
                          High School
                        </SelectItem>
                        <SelectItem value="Training Center">
                          Training Center
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Select
                      value={organizationSettings.country}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="United Kingdom">
                          United Kingdom
                        </SelectItem>
                        <SelectItem value="United States">
                          United States
                        </SelectItem>
                        <SelectItem value="Canada">
                          Canada
                        </SelectItem>
                        <SelectItem value="Australia">
                          Australia
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select
                      value={organizationSettings.timezone}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/London">
                          London (GMT)
                        </SelectItem>
                        <SelectItem value="America/New_York">
                          New York (EST)
                        </SelectItem>
                        <SelectItem value="America/Los_Angeles">
                          Los Angeles (PST)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea
                    value={organizationSettings.address}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={organizationSettings.phone} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={organizationSettings.email} />
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input
                      value={organizationSettings.website}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">
                      Invite Users
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Add new team members to your organization
                    </p>
                  </div>
                  <Button>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Invites
                  </Button>
                </div>
                <Separator />
                <div className="space-y-3">
                  {userRoles.map((role) => (
                    <div
                      key={role.value}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-primary" />
                          <span className="font-medium">
                            {role.label}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {role.description}
                        </p>
                      </div>
                      <Badge variant="outline">3 users</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* AI Preferences (Dietitians and Admins) */}
        {isDietitian && (
          <TabsContent value="ai" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Assistant Configuration
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure organization-wide AI settings for
                  meal planning and recommendations
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Auto-Generate Meal Plans</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow AI to automatically create meal
                      plans for athletes
                    </p>
                  </div>
                  <Switch
                    checked={aiPreferences.autoGenerate}
                    onCheckedChange={(checked) =>
                      handleFormChange(
                        "ai",
                        "autoGenerate",
                        checked,
                      )
                    }
                  />
                </div>

                <div className="space-y-3">
                  <Label>
                    AI Confidence Threshold:{" "}
                    {aiPreferences.confidenceThreshold}%
                  </Label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={aiPreferences.confidenceThreshold}
                    onChange={(e) =>
                      handleFormChange(
                        "ai",
                        "confidenceThreshold",
                        parseInt(e.target.value),
                      )
                    }
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Only show AI suggestions with confidence
                    above this threshold
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Include Alternative Options</Label>
                    <p className="text-sm text-muted-foreground">
                      Show multiple meal options when generating
                      plans
                    </p>
                  </div>
                  <Switch
                    checked={aiPreferences.includeAlternatives}
                    onCheckedChange={(checked) =>
                      handleFormChange(
                        "ai",
                        "includeAlternatives",
                        checked,
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Learning Mode</Label>
                  <Select
                    value={aiPreferences.learningMode}
                    onValueChange={(value) =>
                      handleFormChange(
                        "ai",
                        "learningMode",
                        value,
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">
                        Conservative - Stick to proven
                        recommendations
                      </SelectItem>
                      <SelectItem value="balanced">
                        Balanced - Mix of proven and innovative
                        suggestions
                      </SelectItem>
                      <SelectItem value="innovative">
                        Innovative - Include latest research and
                        trends
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Require Manual Review</Label>
                    <p className="text-sm text-muted-foreground">
                      All AI-generated plans require dietitian
                      approval before publishing
                    </p>
                  </div>
                  <Switch
                    checked={aiPreferences.reviewRequired}
                    onCheckedChange={(checked) =>
                      handleFormChange(
                        "ai",
                        "reviewRequired",
                        checked,
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Show AI Explanations</Label>
                    <p className="text-sm text-muted-foreground">
                      Display reasoning behind AI
                      recommendations
                    </p>
                  </div>
                  <Switch
                    checked={aiPreferences.explanations}
                    onCheckedChange={(checked) =>
                      handleFormChange(
                        "ai",
                        "explanations",
                        checked,
                      )
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Sharing & Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Contribute to AI Improvement</Label>
                    <p className="text-sm text-muted-foreground">
                      Help improve AI recommendations by sharing
                      anonymized usage data
                    </p>
                  </div>
                  <Switch
                    checked={aiPreferences.dataSharing}
                    onCheckedChange={(checked) =>
                      handleFormChange(
                        "ai",
                        "dataSharing",
                        checked,
                      )
                    }
                  />
                </div>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    All data is anonymized and encrypted. No
                    personal athlete information is shared.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Data Management */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Data Import & Export
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Import Data</h4>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Import Athletes (CSV)
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Import Meal Plans (JSON)
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Import Food Database
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Export Data</h4>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export All Data (ZIP)
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Athletes Data (CSV)
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Meal Plans (PDF)
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="w-5 h-5" />
                Storage & Backup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Data Usage</h4>
                  <p className="text-sm text-muted-foreground">
                    2.4 GB of 10 GB used
                  </p>
                </div>
                <div className="w-48 bg-muted rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2"
                    style={{ width: "24%" }}
                  ></div>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">
                    Automatic Backups
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Daily backups at 2:00 AM UTC
                  </p>
                </div>
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Backup Now
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="w-5 h-5" />
                Data Deletion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Deleting data is permanent and cannot be
                  undone. Please export any data you need before
                  deletion.
                </AlertDescription>
              </Alert>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Inactive Athletes (180 days)
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Old Meal Plans (1 year)
                </Button>
                <Dialog
                  open={showDeleteDialog}
                  onOpenChange={setShowDeleteDialog}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete All Organization Data
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete All Data</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will
                        permanently delete all athlete data,
                        meal plans, and settings for your
                        organization.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() =>
                          setShowDeleteDialog(false)
                        }
                      >
                        Cancel
                      </Button>
                      <Button variant="destructive">
                        Delete Everything
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Organization Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Organization Security Policy
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure security settings for all users in
                your organization
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Password Policy</Label>
                  <Select
                    value={orgSecuritySettings.passwordPolicy}
                    onValueChange={(value) =>
                      handleFormChange(
                        "security",
                        "passwordPolicy",
                        value,
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">
                        Basic - 8 characters minimum
                      </SelectItem>
                      <SelectItem value="strong">
                        Strong - 12 characters, mixed case,
                        numbers
                      </SelectItem>
                      <SelectItem value="strict">
                        Strict - 16 characters, special
                        characters required
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Password requirements for all organization
                    users
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>
                      Require Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Force all users to enable 2FA for their
                      accounts
                    </p>
                  </div>
                  <Switch
                    checked={
                      orgSecuritySettings.twoFactorRequired
                    }
                    onCheckedChange={(checked) =>
                      handleFormChange(
                        "security",
                        "twoFactorRequired",
                        checked,
                      )
                    }
                  />
                </div>

                <div className="space-y-3">
                  <Label>Default Session Timeout</Label>
                  <Select
                    value={orgSecuritySettings.sessionTimeout.toString()}
                    onValueChange={(value) =>
                      handleFormChange(
                        "security",
                        "sessionTimeout",
                        parseInt(value),
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="240">
                        4 hours
                      </SelectItem>
                      <SelectItem value="480">
                        8 hours
                      </SelectItem>
                      <SelectItem value="1440">
                        24 hours
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Automatically log out users after period of
                    inactivity
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>IP Whitelisting</Label>
                    <p className="text-sm text-muted-foreground">
                      Restrict access to specific IP addresses
                      or ranges
                    </p>
                  </div>
                  <Switch
                    checked={orgSecuritySettings.ipWhitelisting}
                    onCheckedChange={(checked) =>
                      handleFormChange(
                        "security",
                        "ipWhitelisting",
                        checked,
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Audit Logging</Label>
                    <p className="text-sm text-muted-foreground">
                      Log all user actions for security and
                      compliance
                    </p>
                  </div>
                  <Switch
                    checked={orgSecuritySettings.auditLogging}
                    onCheckedChange={(checked) =>
                      handleFormChange(
                        "security",
                        "auditLogging",
                        checked,
                      )
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Compliance & Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium">
                      GDPR Compliant
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Data processing and storage meets EU privacy
                    standards
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium">
                      SOC 2 Type II
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Security controls independently verified and
                    audited
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5" />
                Connected Services
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Connect with external platforms to enhance your
                nutrition management
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        Google Calendar
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Sync training schedules and meal times
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        Fitness Trackers
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Import activity data from wearable
                        devices
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-green-600"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Database className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        Athlete Management System
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Import athlete data from existing
                        systems
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        Email Marketing
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Send nutrition newsletters and updates
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <p className="text-sm text-muted-foreground">
                Generate API keys for custom integrations
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">
                    API Documentation
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Learn how to integrate with our platform
                  </p>
                </div>
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Docs
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">
                    Generate API Key
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Create new API keys for integration
                  </p>
                </div>
                <Button>
                  <Key className="w-4 h-4 mr-2" />
                  Generate Key
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SettingsPage;