import React, { useState, useCallback } from "react";
import {
  Calendar,
  momentLocalizer,
  Views,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/calendar.css";
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
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Users,
  User,
  Utensils,
  Activity,
  Target,
  AlertTriangle,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Bell,
  MapPin,
  Video,
  FileText,
} from "lucide-react";

const localizer = momentLocalizer(moment);

// Mock data
const mockPlayers = [
  {
    id: "1",
    name: "Marcus Johnson",
    team: "Basketball",
    position: "Forward",
    initials: "MJ",
  },
  {
    id: "2",
    name: "Sarah Williams",
    team: "Soccer",
    position: "Midfielder",
    initials: "SW",
  },
  {
    id: "3",
    name: "David Chen",
    team: "Swimming",
    position: "Freestyle",
    initials: "DC",
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    team: "Basketball",
    position: "Guard",
    initials: "ER",
  },
  {
    id: "5",
    name: "Alex Thompson",
    team: "Soccer",
    position: "Defender",
    initials: "AT",
  },
];

const teams = ["Basketball", "Soccer", "Swimming", "Track & Field"];

// Event types with colors
const eventTypes = {
  consultation: {
    label: "1-on-1 Consultation",
    color: "#3b82f6",
    icon: User,
  },
  meal_planning: {
    label: "Meal Planning Session",
    color: "#10b981",
    icon: Utensils,
  },
  team_meeting: {
    label: "Team Nutrition Meeting",
    color: "#8b5cf6",
    icon: Users,
  },
  workshop: {
    label: "Education Workshop",
    color: "#f59e0b",
    icon: FileText,
  },
  assessment: {
    label: "Nutrition Assessment",
    color: "#ef4444",
    icon: Target,
  },
  follow_up: {
    label: "Follow-up Check",
    color: "#06b6d4",
    icon: Activity,
  },
  emergency: {
    label: "Emergency Consultation",
    color: "#dc2626",
    icon: AlertTriangle,
  },
};

// Sample events
const initialEvents = [
  {
    id: "1",
    title: "Marcus Johnson - Pre-Season Assessment",
    start: new Date(2025, 0, 15, 10, 0),
    end: new Date(2025, 0, 15, 11, 0),
    type: "assessment",
    playerId: "1",
    location: "Nutrition Office",
    description: "Initial assessment for pre-season planning",
    attendees: ["Marcus Johnson"],
    recurring: "none",
  },
  {
    id: "2",
    title: "Basketball Team - Game Day Nutrition",
    start: new Date(2025, 0, 16, 14, 0),
    end: new Date(2025, 0, 16, 15, 30),
    type: "team_meeting",
    location: "Team Meeting Room",
    description: "Discussing game day nutrition strategies",
    attendees: ["Basketball Team"],
    recurring: "none",
  },
  {
    id: "3",
    title: "Sarah Williams - Weekly Check-in",
    start: new Date(2025, 0, 17, 9, 0),
    end: new Date(2025, 0, 17, 9, 30),
    type: "follow_up",
    playerId: "2",
    location: "Virtual",
    description: "Weekly progress review",
    attendees: ["Sarah Williams"],
    recurring: "weekly",
  },
  {
    id: "4",
    title: "Hydration Workshop",
    start: new Date(2025, 0, 18, 16, 0),
    end: new Date(2025, 0, 18, 17, 0),
    type: "workshop",
    location: "Conference Room A",
    description: "Team workshop on hydration strategies",
    attendees: ["All Athletes"],
    recurring: "none",
  },
  {
    id: "5",
    title: "David Chen - Competition Prep",
    start: new Date(2025, 0, 20, 11, 0),
    end: new Date(2025, 0, 20, 12, 0),
    type: "consultation",
    playerId: "3",
    location: "Nutrition Office",
    description: "Competition preparation nutrition plan",
    attendees: ["David Chen"],
    recurring: "none",
  },
];

// Custom toolbar component
const CustomToolbar = ({ label, onNavigate, onView, view }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("PREV")}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("TODAY")}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("NEXT")}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <h2 className="text-xl font-semibold">{label}</h2>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant={view === "month" ? "default" : "outline"}
          size="sm"
          onClick={() => onView("month")}
        >
          Month
        </Button>
        <Button
          variant={view === "week" ? "default" : "outline"}
          size="sm"
          onClick={() => onView("week")}
        >
          Week
        </Button>
        <Button
          variant={view === "day" ? "default" : "outline"}
          size="sm"
          onClick={() => onView("day")}
        >
          Day
        </Button>
        <Button
          variant={view === "agenda" ? "default" : "outline"}
          size="sm"
          onClick={() => onView("agenda")}
        >
          Agenda
        </Button>
      </div>
    </div>
  );
};

// Event icon component
const EventIcon = ({ type }) => {
  const IconComponent = eventTypes[type]?.icon || CalendarIcon;
  return <IconComponent className="w-4 h-4" />;
};

interface NutritionCalendarProps {
  onPlayerSelect: (playerId: string) => void;
}

function NutritionCalendar({
  onPlayerSelect,
}: NutritionCalendarProps) {
  const [events, setEvents] = useState(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "consultation",
    start: new Date(),
    end: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
    location: "",
    description: "",
    attendees: [],
    playerId: "",
    recurring: "none",
  });

  // Filter events based on search and type
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === "all" || event.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  }, []);

  const handleSelectSlot = useCallback(({ start, end }) => {
    setNewEvent({
      ...newEvent,
      start,
      end,
    });
    setShowCreateDialog(true);
  }, [newEvent]);

  const eventStyleGetter = (event) => {
    const eventType = eventTypes[event.type];
    return {
      style: {
        backgroundColor: eventType?.color || "#3174ad",
        borderColor: eventType?.color || "#3174ad",
        color: "white",
        border: "none",
        fontSize: "12px",
        borderRadius: "4px",
      },
    };
  };

  const handleCreateEvent = () => {
    if (!newEvent.title) return;

    const event = {
      ...newEvent,
      id: Date.now().toString(),
    };

    setEvents([...events, event]);
    setShowCreateDialog(false);
    setNewEvent({
      title: "",
      type: "consultation",
      start: new Date(),
      end: new Date(Date.now() + 60 * 60 * 1000),
      location: "",
      description: "",
      attendees: [],
      playerId: "",
      recurring: "none",
    });
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter((e) => e.id !== eventId));
    setShowEventDialog(false);
  };

  return (
    <div className="space-y-8">
      {/* Filters and Create Button */}
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-80"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              {Object.entries(eventTypes).map(([key, type]) => (
                <SelectItem key={key} value={key}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Calendar */}
      <Card className="shadow-lg">
        <CardContent className="p-0">
          <div className="h-[800px] p-6">
            <Calendar
              localizer={localizer}
              events={filteredEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100%" }}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              eventPropGetter={eventStyleGetter}
              views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              components={{
                toolbar: CustomToolbar,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Event Legend */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Event Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {Object.entries(eventTypes).map(([key, type]) => (
              <div
                key={key}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
              >
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: type.color }}
                />
                <span className="text-sm font-medium truncate">
                  {type.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Event Details Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-3">
              {selectedEvent && <EventIcon type={selectedEvent.type} />}
              <span className="text-lg">{selectedEvent?.title}</span>
            </DialogTitle>
            <DialogDescription>
              View and manage event details
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className="px-3 py-1"
                  style={{
                    backgroundColor:
                      eventTypes[selectedEvent.type]?.color + "20",
                    borderColor: eventTypes[selectedEvent.type]?.color,
                    color: eventTypes[selectedEvent.type]?.color,
                  }}
                >
                  {eventTypes[selectedEvent.type]?.label}
                </Badge>
                {selectedEvent.recurring !== "none" && (
                  <Badge variant="outline" className="px-3 py-1">
                    Recurring {selectedEvent.recurring}
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {moment(selectedEvent.start).format("MMMM D, YYYY")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {moment(selectedEvent.start).format("h:mm A")} -{" "}
                      {moment(selectedEvent.end).format("h:mm A")}
                    </p>
                  </div>
                </div>

                {selectedEvent.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <p className="text-sm">{selectedEvent.location}</p>
                  </div>
                )}

                {selectedEvent.attendees &&
                  selectedEvent.attendees.length > 0 && (
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-muted-foreground" />
                      <p className="text-sm">
                        {selectedEvent.attendees.join(", ")}
                      </p>
                    </div>
                  )}

                {selectedEvent.description && (
                  <div className="space-y-2">
                    <p className="font-medium">Description</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                {selectedEvent.playerId && (
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      onPlayerSelect(selectedEvent.playerId);
                      setShowEventDialog(false);
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    View Player
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Event Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg">Create New Event</DialogTitle>
            <DialogDescription>
              Create a new nutrition-related event or appointment
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Event Title *</label>
              <Input
                placeholder="Enter event title..."
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    title: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Event Type *</label>
              <Select
                value={newEvent.type}
                onValueChange={(value) =>
                  setNewEvent({ ...newEvent, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(eventTypes).map(([key, type]) => (
                    <SelectItem key={key} value={key}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">Start Date *</label>
                <Input
                  type="datetime-local"
                  value={moment(newEvent.start).format("YYYY-MM-DDTHH:mm")}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      start: new Date(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium">End Date *</label>
                <Input
                  type="datetime-local"
                  value={moment(newEvent.end).format("YYYY-MM-DDTHH:mm")}
                  onChange={(e) =>
                    setNewEvent({
                      ...newEvent,
                      end: new Date(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Location</label>
              <Input
                placeholder="Enter location..."
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    location: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Attendees</label>
              <Select
                onValueChange={(value) =>
                  setNewEvent({
                    ...newEvent,
                    attendees: [value],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select attendees..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Athletes">All Athletes</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team} value={team}>
                      {team}
                    </SelectItem>
                  ))}
                  {mockPlayers.map((player) => (
                    <SelectItem key={player.id} value={player.name}>
                      {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {newEvent.type === "consultation" && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Player</label>
                <Select
                  onValueChange={(value) =>
                    setNewEvent({
                      ...newEvent,
                      playerId: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select player..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPlayers.map((player) => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.name} - {player.team}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-3">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Enter event description..."
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    description: e.target.value,
                  })
                }
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Recurring</label>
              <Select
                value={newEvent.recurring}
                onValueChange={(value) =>
                  setNewEvent({ ...newEvent, recurring: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Repeat</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleCreateEvent}
                disabled={!newEvent.title}
              >
                Create Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default NutritionCalendar;