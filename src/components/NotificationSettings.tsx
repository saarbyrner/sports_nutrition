import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
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
import { Input } from "./ui/input";
import {
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  Calendar,
  AlertTriangle,
  Users,
  Target,
  Brain,
  Activity,
  Clock,
  Volume2,
  VolumeX,
  Save,
  TestTube,
  CheckCircle,
  Info,
} from "lucide-react";

interface User {
  name: string;
  role: string;
  organization: string;
  initials: string;
  userRole: string;
}

interface NotificationSettingsProps {
  user: User;
}

function NotificationSettings({
  user,
}: NotificationSettingsProps) {
  const [activeTab, setActiveTab] = useState("preferences");
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Email notification preferences
  const [emailNotifications, setEmailNotifications] = useState({
    playerUpdates: true,
    planChanges: true,
    aiInsights: true,
    systemAlerts: true,
    weeklyReports: true,
    complianceAlerts: true,
    teamAnnouncements: true,
    calendarReminders: true,
    messageNotifications: true,
    frequency: "immediate", // immediate, hourly, daily, weekly
    quietHoursEnabled: true,
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
  });

  // In-app notification preferences
  const [inAppNotifications, setInAppNotifications] = useState({
    popupAlerts: true,
    soundEnabled: true,
    desktopNotifications: true,
    badgeCounters: true,
    autoHide: true,
    autoHideDelay: 5000,
    priorityOnly: false,
  });

  // SMS notification preferences (for critical alerts)
  const [smsNotifications, setSmsNotifications] = useState({
    enabled: false,
    emergencyOnly: true,
    phoneNumber: "+44 7700 900123",
    criticalAlerts: true,
    weekendEnabled: false,
  });

  // Push notification preferences (for mobile)
  const [pushNotifications, setPushNotifications] = useState({
    enabled: true,
    playerEmergencies: true,
    dailyReminders: true,
    planUpdates: true,
    messages: true,
    quietHours: true,
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
  });

  const isDietitian =
    user.userRole === "dietitian" || user.userRole === "admin";
  const isAthlete = user.userRole === "athlete";

  const handleEmailChange = (key: string, value: any) => {
    setEmailNotifications((prev) => ({
      ...prev,
      [key]: value,
    }));
    setUnsavedChanges(true);
  };

  const handleInAppChange = (key: string, value: any) => {
    setInAppNotifications((prev) => ({
      ...prev,
      [key]: value,
    }));
    setUnsavedChanges(true);
  };

  const handleSmsChange = (key: string, value: any) => {
    setSmsNotifications((prev) => ({ ...prev, [key]: value }));
    setUnsavedChanges(true);
  };

  const handlePushChange = (key: string, value: any) => {
    setPushNotifications((prev) => ({ ...prev, [key]: value }));
    setUnsavedChanges(true);
  };

  const handleSaveChanges = () => {
    console.log("Saving notification preferences...");
    setUnsavedChanges(false);
  };

  const sendTestNotification = (type: string) => {
    console.log(`Sending test ${type} notification...`);
  };

  // Recent notifications for history view
  const recentNotifications = [
    {
      id: 1,
      type: "ai_insight",
      title: "AI Insight: Protein Intake Alert",
      message:
        "Marcus Johnson's protein intake has been below target for 3 consecutive days.",
      timestamp: "2 hours ago",
      read: false,
      priority: "medium",
    },
    {
      id: 2,
      type: "plan_update",
      title: "Meal Plan Updated",
      message:
        "Sarah Williams' meal plan has been updated for next week.",
      timestamp: "4 hours ago",
      read: true,
      priority: "low",
    },
    {
      id: 3,
      type: "system_alert",
      title: "System Maintenance Scheduled",
      message:
        "Planned maintenance window: Jan 15, 2:00-4:00 AM UTC",
      timestamp: "1 day ago",
      read: true,
      priority: "low",
    },
    {
      id: 4,
      type: "compliance_alert",
      title: "Low Compliance Alert",
      message:
        "Team average compliance dropped to 78% this week.",
      timestamp: "2 days ago",
      read: false,
      priority: "high",
    },
    {
      id: 5,
      type: "message",
      title: "New Message from David Chen",
      message: "Question about pre-training meal timing",
      timestamp: "3 days ago",
      read: true,
      priority: "medium",
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ai_insight":
        return <Brain className="w-4 h-4 text-blue-500" />;
      case "plan_update":
        return <Target className="w-4 h-4 text-green-500" />;
      case "system_alert":
        return (
          <AlertTriangle className="w-4 h-4 text-orange-500" />
        );
      case "compliance_alert":
        return <Activity className="w-4 h-4 text-red-500" />;
      case "message":
        return (
          <MessageSquare className="w-4 h-4 text-purple-500" />
        );
      default:
        return (
          <Bell className="w-4 h-4 text-muted-foreground" />
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="destructive" className="text-xs">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="secondary" className="text-xs">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge variant="outline" className="text-xs">
            Low
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="preferences">
            Preferences
          </TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="test">Test</TabsTrigger>
        </TabsList>

        {/* Notification Preferences */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Email Notifications
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose what email notifications you want to
                receive
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Athlete-specific notifications */}
              {isAthlete ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Meal Plan Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        When your dietitian updates your meal
                        plans
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications.planChanges}
                      onCheckedChange={(checked) =>
                        handleEmailChange(
                          "planChanges",
                          checked,
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Meal Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Reminders for upcoming meals and snacks
                      </p>
                    </div>
                    <Switch
                      checked={
                        emailNotifications.calendarReminders
                      }
                      onCheckedChange={(checked) =>
                        handleEmailChange(
                          "calendarReminders",
                          checked,
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Messages from Staff</Label>
                      <p className="text-sm text-muted-foreground">
                        When dietitians or coaches send you
                        messages
                      </p>
                    </div>
                    <Switch
                      checked={
                        emailNotifications.messageNotifications
                      }
                      onCheckedChange={(checked) =>
                        handleEmailChange(
                          "messageNotifications",
                          checked,
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Weekly Progress Reports</Label>
                      <p className="text-sm text-muted-foreground">
                        Summary of your nutrition goals and
                        progress
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications.weeklyReports}
                      onCheckedChange={(checked) =>
                        handleEmailChange(
                          "weeklyReports",
                          checked,
                        )
                      }
                    />
                  </div>
                </>
              ) : (
                /* Dietitian/Staff notifications */
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Player Profile Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        When athletes update their profiles or
                        log data
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications.playerUpdates}
                      onCheckedChange={(checked) =>
                        handleEmailChange(
                          "playerUpdates",
                          checked,
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>
                        AI Insights & Recommendations
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        When AI generates new insights or
                        recommendations
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications.aiInsights}
                      onCheckedChange={(checked) =>
                        handleEmailChange("aiInsights", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Compliance Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        When athletes fall below compliance
                        thresholds
                      </p>
                    </div>
                    <Switch
                      checked={
                        emailNotifications.complianceAlerts
                      }
                      onCheckedChange={(checked) =>
                        handleEmailChange(
                          "complianceAlerts",
                          checked,
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Team Announcements</Label>
                      <p className="text-sm text-muted-foreground">
                        Organization-wide announcements and
                        updates
                      </p>
                    </div>
                    <Switch
                      checked={
                        emailNotifications.teamAnnouncements
                      }
                      onCheckedChange={(checked) =>
                        handleEmailChange(
                          "teamAnnouncements",
                          checked,
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Calendar Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Upcoming appointments and scheduled
                        events
                      </p>
                    </div>
                    <Switch
                      checked={
                        emailNotifications.calendarReminders
                      }
                      onCheckedChange={(checked) =>
                        handleEmailChange(
                          "calendarReminders",
                          checked,
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">
                        Team performance and compliance
                        summaries
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications.weeklyReports}
                      onCheckedChange={(checked) =>
                        handleEmailChange(
                          "weeklyReports",
                          checked,
                        )
                      }
                    />
                  </div>
                </>
              )}

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Email Frequency</Label>
                  <Select
                    value={emailNotifications.frequency}
                    onValueChange={(value) =>
                      handleEmailChange("frequency", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">
                        Immediate
                      </SelectItem>
                      <SelectItem value="hourly">
                        Hourly Digest
                      </SelectItem>
                      <SelectItem value="daily">
                        Daily Digest
                      </SelectItem>
                      <SelectItem value="weekly">
                        Weekly Digest
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Quiet Hours</Label>
                    <p className="text-sm text-muted-foreground">
                      Pause notifications during specified hours
                    </p>
                  </div>
                  <Switch
                    checked={
                      emailNotifications.quietHoursEnabled
                    }
                    onCheckedChange={(checked) =>
                      handleEmailChange(
                        "quietHoursEnabled",
                        checked,
                      )
                    }
                  />
                </div>

                {emailNotifications.quietHoursEnabled && (
                  <div className="grid grid-cols-2 gap-4 ml-6">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={
                          emailNotifications.quietHoursStart
                        }
                        onChange={(e) =>
                          handleEmailChange(
                            "quietHoursStart",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={emailNotifications.quietHoursEnd}
                        onChange={(e) =>
                          handleEmailChange(
                            "quietHoursEnd",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                In-App Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Popup Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Show popup notifications in the application
                  </p>
                </div>
                <Switch
                  checked={inAppNotifications.popupAlerts}
                  onCheckedChange={(checked) =>
                    handleInAppChange("popupAlerts", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Sound Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Play sound when notifications arrive
                  </p>
                </div>
                <Switch
                  checked={inAppNotifications.soundEnabled}
                  onCheckedChange={(checked) =>
                    handleInAppChange("soundEnabled", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Desktop Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Show browser notifications even when app is
                    minimized
                  </p>
                </div>
                <Switch
                  checked={
                    inAppNotifications.desktopNotifications
                  }
                  onCheckedChange={(checked) =>
                    handleInAppChange(
                      "desktopNotifications",
                      checked,
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto-hide Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically hide notifications after a few
                    seconds
                  </p>
                </div>
                <Switch
                  checked={inAppNotifications.autoHide}
                  onCheckedChange={(checked) =>
                    handleInAppChange("autoHide", checked)
                  }
                />
              </div>

              {inAppNotifications.autoHide && (
                <div className="ml-6 space-y-2">
                  <Label>
                    Auto-hide Delay:{" "}
                    {inAppNotifications.autoHideDelay / 1000}s
                  </Label>
                  <input
                    type="range"
                    min="3000"
                    max="15000"
                    step="1000"
                    value={inAppNotifications.autoHideDelay}
                    onChange={(e) =>
                      handleInAppChange(
                        "autoHideDelay",
                        parseInt(e.target.value),
                      )
                    }
                    className="w-full"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Channels */}
        <TabsContent value="channels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                SMS Notifications
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Receive critical alerts via text message
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Enable SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive urgent notifications via SMS
                  </p>
                </div>
                <Switch
                  checked={smsNotifications.enabled}
                  onCheckedChange={(checked) =>
                    handleSmsChange("enabled", checked)
                  }
                />
              </div>

              {smsNotifications.enabled && (
                <>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      type="tel"
                      value={smsNotifications.phoneNumber}
                      onChange={(e) =>
                        handleSmsChange(
                          "phoneNumber",
                          e.target.value,
                        )
                      }
                      placeholder="+44 7700 900123"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Emergency Alerts Only</Label>
                      <p className="text-sm text-muted-foreground">
                        Only send SMS for critical system alerts
                      </p>
                    </div>
                    <Switch
                      checked={smsNotifications.emergencyOnly}
                      onCheckedChange={(checked) =>
                        handleSmsChange(
                          "emergencyOnly",
                          checked,
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Weekend Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive SMS notifications on weekends
                      </p>
                    </div>
                    <Switch
                      checked={smsNotifications.weekendEnabled}
                      onCheckedChange={(checked) =>
                        handleSmsChange(
                          "weekendEnabled",
                          checked,
                        )
                      }
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Push Notifications
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Mobile push notifications (requires mobile app)
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Push notifications require the NutriSport
                  mobile app. Download from your device's app
                  store.
                </AlertDescription>
              </Alert>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Enable Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications on your mobile device
                  </p>
                </div>
                <Switch
                  checked={pushNotifications.enabled}
                  onCheckedChange={(checked) =>
                    handlePushChange("enabled", checked)
                  }
                />
              </div>

              {pushNotifications.enabled && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Daily Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Meal and hydration reminders
                      </p>
                    </div>
                    <Switch
                      checked={pushNotifications.dailyReminders}
                      onCheckedChange={(checked) =>
                        handlePushChange(
                          "dailyReminders",
                          checked,
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Plan Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        When meal plans are updated
                      </p>
                    </div>
                    <Switch
                      checked={pushNotifications.planUpdates}
                      onCheckedChange={(checked) =>
                        handlePushChange("planUpdates", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Messages</Label>
                      <p className="text-sm text-muted-foreground">
                        New messages from team members
                      </p>
                    </div>
                    <Switch
                      checked={pushNotifications.messages}
                      onCheckedChange={(checked) =>
                        handlePushChange("messages", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Quiet Hours</Label>
                      <p className="text-sm text-muted-foreground">
                        Pause push notifications during quiet
                        hours
                      </p>
                    </div>
                    <Switch
                      checked={pushNotifications.quietHours}
                      onCheckedChange={(checked) =>
                        handlePushChange("quietHours", checked)
                      }
                    />
                  </div>

                  {pushNotifications.quietHours && (
                    <div className="grid grid-cols-2 gap-4 ml-6">
                      <div className="space-y-2">
                        <Label>Start Time</Label>
                        <Input
                          type="time"
                          value={
                            pushNotifications.quietHoursStart
                          }
                          onChange={(e) =>
                            handlePushChange(
                              "quietHoursStart",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Time</Label>
                        <Input
                          type="time"
                          value={
                            pushNotifications.quietHoursEnd
                          }
                          onChange={(e) =>
                            handlePushChange(
                              "quietHoursEnd",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification History */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Notifications
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                View your notification history and manage read
                status
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 p-4 rounded-lg border ${
                      !notification.read ? "bg-accent/30" : ""
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium truncate">
                          {notification.title}
                        </h4>
                        {getPriorityBadge(
                          notification.priority,
                        )}
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <Button variant="outline">
                  Mark All as Read
                </Button>
                <Button variant="outline">Clear History</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Test Notifications */}
        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5" />
                Test Notifications
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Send test notifications to verify your settings
                are working correctly
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() => sendTestNotification("email")}
                >
                  <Mail className="w-6 h-6" />
                  Test Email
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() => sendTestNotification("push")}
                >
                  <Smartphone className="w-6 h-6" />
                  Test Push
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() => sendTestNotification("sms")}
                  disabled={!smsNotifications.enabled}
                >
                  <MessageSquare className="w-6 h-6" />
                  Test SMS
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() => sendTestNotification("in-app")}
                >
                  <Bell className="w-6 h-6" />
                  Test In-App
                </Button>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Test notifications help ensure your settings
                  are configured correctly. They may take a few
                  minutes to arrive.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Notification Troubleshooting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium">
                      Email Delivery
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Check spam folder if emails aren't
                      arriving
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-green-600"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Working
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium">
                      Browser Permissions
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Desktop notifications require browser
                      permission
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Check Permission
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium">
                      Mobile App
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Install mobile app for push notifications
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Download App
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default NotificationSettings;