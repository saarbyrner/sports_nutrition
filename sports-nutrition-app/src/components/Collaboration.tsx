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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import {
  MessageCircle,
  Users,
  Send,
  Search,
  Plus,
  Phone,
  Video,
  MoreHorizontal,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Image,
  Paperclip,
  Star,
} from "lucide-react";

// Mock data for collaboration
const conversations = [
  {
    id: "c1",
    type: "direct",
    name: "Marcus Johnson",
    avatar: "MJ",
    lastMessage: "Thanks for the meal plan updates!",
    timestamp: "2 hours ago",
    unread: 2,
    online: true,
  },
  {
    id: "c2",
    type: "direct",
    name: "Sarah Williams",
    avatar: "SW",
    lastMessage: "Can we adjust the pre-workout meal?",
    timestamp: "4 hours ago",
    unread: 0,
    online: false,
  },
  {
    id: "c3",
    type: "group",
    name: "Men's Soccer Team",
    avatar: "MS",
    lastMessage: "Coach: Training moved to 3pm tomorrow",
    timestamp: "1 day ago",
    unread: 5,
    online: true,
  },
  {
    id: "c4",
    type: "direct",
    name: "Coach Mike Rivera",
    avatar: "MR",
    lastMessage: "Let's discuss nutrition strategy",
    timestamp: "2 days ago",
    unread: 1,
    online: true,
  },
];

const messages = [
  {
    id: "m1",
    sender: "Marcus Johnson",
    senderAvatar: "MJ",
    content:
      "Hi Dr. Johnson! I wanted to ask about the new meal plan.",
    timestamp: "10:30 AM",
    isOwn: false,
  },
  {
    id: "m2",
    sender: "You",
    senderAvatar: "SJ",
    content:
      "Hi Marcus! I'm glad you reached out. What specific questions do you have about the plan?",
    timestamp: "10:32 AM",
    isOwn: true,
  },
  {
    id: "m3",
    sender: "Marcus Johnson",
    senderAvatar: "MJ",
    content:
      "I'm finding it hard to fit in the afternoon snack between classes. Is there a way to adjust the timing?",
    timestamp: "10:35 AM",
    isOwn: false,
  },
  {
    id: "m4",
    sender: "You",
    senderAvatar: "SJ",
    content:
      "Absolutely! Let me adjust that for you. What time works best for your schedule?",
    timestamp: "10:37 AM",
    isOwn: true,
  },
  {
    id: "m5",
    sender: "Marcus Johnson",
    senderAvatar: "MJ",
    content:
      "Maybe around 2:30 PM? That's when I have a break between classes.",
    timestamp: "10:40 AM",
    isOwn: false,
  },
  {
    id: "m6",
    sender: "You",
    senderAvatar: "SJ",
    content:
      "Perfect! I'll update your plan to show the snack at 2:30 PM instead. You should see the changes in your app within the next few minutes.",
    timestamp: "10:42 AM",
    isOwn: true,
  },
  {
    id: "m7",
    sender: "Marcus Johnson",
    senderAvatar: "MJ",
    content:
      "Thanks for the meal plan updates! This works much better with my schedule.",
    timestamp: "11:15 AM",
    isOwn: false,
  },
];

const teamAnnouncements = [
  {
    id: "a1",
    title: "New Hydration Guidelines",
    content:
      "Updated hydration recommendations for the summer training season. Please review the attached document.",
    author: "Dr. Sarah Johnson",
    timestamp: "2 hours ago",
    priority: "high",
    attachments: ["hydration-guidelines.pdf"],
  },
  {
    id: "a2",
    title: "Team Meal Schedule Update",
    content:
      "Pre-game meal time has been moved to 3 hours before kickoff instead of 2 hours.",
    author: "Coach Mike Rivera",
    timestamp: "1 day ago",
    priority: "medium",
    attachments: [],
  },
  {
    id: "a3",
    title: "Nutrition Workshop Next Week",
    content:
      "Mandatory nutrition education session scheduled for all team members.",
    author: "Dr. Sarah Johnson",
    timestamp: "3 days ago",
    priority: "low",
    attachments: ["workshop-details.pdf"],
  },
];

const activeDiscussions = [
  {
    id: "d1",
    title: "Pre-Competition Meal Strategy",
    participants: [
      "Dr. Sarah Johnson",
      "Coach Mike Rivera",
      "Marcus Johnson",
    ],
    lastActivity: "30 minutes ago",
    messageCount: 12,
  },
  {
    id: "d2",
    title: "Supplement Protocol Review",
    participants: ["Dr. Sarah Johnson", "Team Doctor"],
    lastActivity: "2 hours ago",
    messageCount: 8,
  },
];

function Collaboration() {
  const [activeConversation, setActiveConversation] =
    useState("c1");
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("messages");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage("");
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentConversation = conversations.find(
    (c) => c.id === activeConversation
  );

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="announcements">
            Announcements
          </TabsTrigger>
          <TabsTrigger value="discussions">
            Discussions
          </TabsTrigger>
        </TabsList>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Conversations
                  </CardTitle>
                  <Button size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search conversations..."
                      value={searchTerm}
                      onChange={(e) =>
                        setSearchTerm(e.target.value)
                      }
                      className="pl-10"
                    />
                  </div>
                </div>
                <ScrollArea className="h-[500px]">
                  <div className="p-2">
                    {filteredConversations.map(
                      (conversation) => (
                        <div
                          key={conversation.id}
                          className={`p-3 mx-2 mb-1 rounded-lg cursor-pointer transition-colors ${
                            activeConversation ===
                            conversation.id
                              ? "bg-primary/10 border-primary border"
                              : "hover:bg-accent"
                          }`}
                          onClick={() =>
                            setActiveConversation(
                              conversation.id
                            )
                          }
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative flex-shrink-0">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="text-sm">
                                  {conversation.avatar}
                                </AvatarFallback>
                              </Avatar>
                              {conversation.online && (
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <p className="font-medium truncate text-sm">
                                  {conversation.name}
                                </p>
                                <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                                  {conversation.timestamp}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {conversation.lastMessage}
                              </p>
                            </div>
                            {conversation.unread > 0 && (
                              <Badge
                                variant="destructive"
                                className="text-xs flex-shrink-0 min-w-[20px] h-5 flex items-center justify-center"
                              >
                                {conversation.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Window */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarFallback className="text-sm">
                        {currentConversation?.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">
                        {currentConversation?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {currentConversation?.online
                          ? "Online"
                          : "Offline"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.isOwn ? "justify-end" : "justify-start"}`}
                      >
                        {!message.isOwn && (
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className="text-xs">
                              {message.senderAvatar}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[70%] ${message.isOwn ? "order-first" : ""}`}
                        >
                          <div
                            className={`p-3 rounded-lg ${
                              message.isOwn
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p className="text-sm break-words">
                              {message.content}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 px-1">
                            {message.timestamp}
                          </p>
                        </div>
                        {message.isOwn && (
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className="text-xs">
                              {message.senderAvatar}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="flex-shrink-0">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-shrink-0">
                      <Image className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) =>
                        setNewMessage(e.target.value)
                      }
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      className="flex-1 min-w-0"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="flex-shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Announcements Tab */}
        <TabsContent
          value="announcements"
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Team Announcements</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Announcement
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamAnnouncements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3 gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-semibold">
                            {announcement.title}
                          </h3>
                          <Badge
                            variant={
                              announcement.priority === "high"
                                ? "destructive"
                                : announcement.priority ===
                                    "medium"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="flex-shrink-0"
                          >
                            {announcement.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {announcement.content}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                          <span>{announcement.author}</span>
                          <span>{announcement.timestamp}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="flex-shrink-0">
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>

                    {announcement.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {announcement.attachments.map(
                          (attachment, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs"
                            >
                              <FileText className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{attachment}</span>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Discussions Tab */}
        <TabsContent value="discussions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Discussions</CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Start Discussion
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeDiscussions.map((discussion) => (
                  <div
                    key={discussion.id}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3 gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1">
                          {discussion.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {discussion.participants.join(", ")}
                        </p>
                      </div>
                      <Badge variant="outline" className="flex-shrink-0">
                        {discussion.messageCount} messages
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 min-w-0">
                        <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-muted-foreground truncate">
                          Last activity: {discussion.lastActivity}
                        </span>
                      </div>
                      <Button variant="outline" size="sm" className="flex-shrink-0">
                        Join Discussion
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Collaboration;