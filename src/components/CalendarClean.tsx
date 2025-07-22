'use client'

import React, { useState, useCallback, useEffect } from "react";
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
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import {
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Users,
  Utensils,
  UserCheck,
  AlertTriangle,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  MapPin,
  RefreshCw,
  CheckCircle,
  XCircle,
  Lock,
} from "lucide-react";
import { useCalendarService } from '@/hooks/useCalendarService'
import { usePlayerService } from '@/hooks/usePlayerService'
import { CreateCalendarEventData, CalendarEventWithAttendees } from '@/lib/services/calendar'
import { EventType, Player } from '@/lib/services/types'
import { useAuth } from '@/contexts/AuthContext'

const localizer = momentLocalizer(moment);

// Clean event types with modern icons
const eventTypes = {
  meal_plan: {
    label: "Meal Plan",
    color: "#10b981",
    icon: Utensils,
    description: "Nutrition planning and meal scheduling"
  },
  appointment: {
    label: "Appointment",
    color: "#3b82f6",
    icon: UserCheck,
    description: "Meetings, consultations, and check-ins"
  },
};

// Modern toolbar component
const CustomToolbar = ({ label, onNavigate, onView, view }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("PREV")}
            className="h-9"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("TODAY")}
            className="h-9 px-4"
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("NEXT")}
            className="h-9"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">{label}</h2>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant={view === "month" ? "default" : "outline"}
          size="sm"
          onClick={() => onView("month")}
          className="h-9"
        >
          Month
        </Button>
        <Button
          variant={view === "week" ? "default" : "outline"}
          size="sm"
          onClick={() => onView("week")}
          className="h-9"
        >
          Week
        </Button>
        <Button
          variant={view === "day" ? "default" : "outline"}
          size="sm"
          onClick={() => onView("day")}
          className="h-9"
        >
          Day
        </Button>
      </div>
    </div>
  );
};

// Event icon component
const EventIcon = ({ type }: { type: EventType }) => {
  const IconComponent = eventTypes[type]?.icon || CalendarIcon;
  return <IconComponent className="w-4 h-4" />;
};

// Privacy indicator component
const PrivacyIndicator = ({ isPrivate }: { isPrivate: boolean }) => {
  if (!isPrivate) return null;
  return (
    <div className="flex items-center gap-1 text-xs text-gray-500">
      <Lock className="w-3 h-3" />
      <span>Private</span>
    </div>
  );
};

interface CalendarCleanProps {
  onPlayerSelect?: (playerId: string) => void;
}

function CalendarClean({ onPlayerSelect }: CalendarCleanProps) {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEventWithAttendees[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventWithAttendees | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<EventType | "all">("all");
  const [showPrivateEvents, setShowPrivateEvents] = useState(true);
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const {
    loading: calendarLoading,
    error: calendarError,
    getEvents,
    createEvent,
    deleteEvent,
    clearError
  } = useCalendarService()

  const {
    loading: playersLoading,
    getPlayers
  } = usePlayerService()

  const [newEvent, setNewEvent] = useState<Partial<CreateCalendarEventData>>({
    title: "",
    event_type: "appointment",
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    location: "",
    description: "",
    attendees: [],
    is_private: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Load data with improved error handling
  const loadData = useCallback(async () => {
    try {
      const startOfMonth = moment(date).startOf('month').toISOString()
      const endOfMonth = moment(date).endOf('month').toISOString()

      const [eventsResult, playersResult] = await Promise.all([
        getEvents({
          filters: {
            start_date: startOfMonth,
            end_date: endOfMonth,
            ...(filterType !== "all" && { event_type: filterType as EventType }),
            include_private: showPrivateEvents
          },
          sort: { column: 'start_time', ascending: true }
        }),
        getPlayers({
          pagination: { limit: 100 },
          sort: { column: 'created_at', ascending: false }
        })
      ])

      if (eventsResult?.data) {
        let filteredEvents = eventsResult.data
        if (searchTerm) {
          filteredEvents = eventsResult.data.filter(event =>
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        }
        setEvents(filteredEvents)
      }

      if (playersResult?.data) {
        setPlayers(playersResult.data)
      }
    } catch (error) {
      console.error('Error loading calendar data:', error)
    }
  }, [date, filterType, searchTerm, showPrivateEvents, getEvents, getPlayers])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Convert calendar events to react-big-calendar format
  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.is_private ? `🔒 ${event.title}` : event.title,
    start: new Date(event.start_time),
    end: new Date(event.end_time),
    type: event.event_type,
    originalEvent: event,
    resource: event
  }))

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event.originalEvent)
    setShowEventDialog(true)
  }, [])

  const handleSelectSlot = useCallback(({ start, end }) => {
    setNewEvent({
      ...newEvent,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
    })
    setShowCreateDialog(true)
    setFormErrors({})
  }, [newEvent])

  const eventStyleGetter = (event) => {
    const eventType = eventTypes[event.type]
    const baseStyle = {
      backgroundColor: eventType?.color || "#3174ad",
      borderColor: eventType?.color || "#3174ad",
      color: "white",
      border: "none",
      fontSize: "12px",
      borderRadius: "4px",
      padding: "2px 6px",
    }

    // Style private events differently
    if (event.resource?.is_private) {
      return {
        style: {
          ...baseStyle,
          background: `linear-gradient(45deg, ${eventType?.color || "#3174ad"}, ${eventType?.color || "#3174ad"}AA)`,
          border: `1px dashed ${eventType?.color || "#3174ad"}`,
        }
      }
    }

    return { style: baseStyle }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!newEvent.title?.trim()) {
      errors.title = "Event title is required"
    }
    
    if (!newEvent.start_time) {
      errors.start_time = "Start time is required"
    }
    
    if (!newEvent.end_time) {
      errors.end_time = "End time is required"
    }
    
    if (newEvent.start_time && newEvent.end_time && 
        new Date(newEvent.start_time) >= new Date(newEvent.end_time)) {
      errors.end_time = "End time must be after start time"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateEvent = async () => {
    if (!validateForm()) {
      return
    }

    const eventData: CreateCalendarEventData = {
      title: newEvent.title!.trim(),
      description: newEvent.description?.trim() || undefined,
      event_type: newEvent.event_type as EventType,
      start_time: newEvent.start_time!,
      end_time: newEvent.end_time!,
      location: newEvent.location?.trim() || undefined,
      attendees: newEvent.attendees || [],
      is_private: newEvent.is_private || false,
      metadata: {}
    }

    const created = await createEvent(eventData)
    if (created) {
      setShowCreateDialog(false)
      setNewEvent({
        title: "",
        event_type: "appointment",
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        location: "",
        description: "",
        attendees: [],
        is_private: false,
      })
      setFormErrors({})
      await loadData()
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const success = await deleteEvent(eventId)
      if (success) {
        setShowEventDialog(false)
        await loadData()
      }
    }
  }

  const canViewEventDetails = (event: CalendarEventWithAttendees | null): boolean => {
    if (!event) return false
    if (!event.is_private) return true
    if (event.created_by === user?.id) return true
    return event.attendees?.includes(user?.id || '') || false
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {calendarError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Error:</span>
              <span>{calendarError}</span>
              <Button variant="ghost" size="sm" onClick={clearError}>
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      <Card className="border-gray-200">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-80"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-48">
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
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-private"
                  checked={showPrivateEvents}
                  onCheckedChange={setShowPrivateEvents}
                />
                <Label htmlFor="show-private" className="text-sm">
                  Show private events
                </Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={loadData}
                disabled={calendarLoading || playersLoading}
                className="h-10"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${(calendarLoading || playersLoading) ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={() => setShowCreateDialog(true)} className="h-10">
                <Plus className="w-4 h-4 mr-2" />
                New Event
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card className="shadow-lg border-gray-200">
        <CardContent className="p-0">
          <div className="h-[800px] p-6">
            {calendarLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="text-lg text-gray-600">Loading calendar...</span>
                </div>
              </div>
            ) : (
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%" }}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                selectable
                eventPropGetter={eventStyleGetter}
                views={[Views.MONTH, Views.WEEK, Views.DAY]}
                view={view}
                onView={setView}
                date={date}
                onNavigate={setDate}
                components={{
                  toolbar: CustomToolbar,
                }}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Event Types Legend */}
      <Card className="border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Event Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(eventTypes).map(([key, type]) => (
              <div
                key={key}
                className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: type.color }}
                />
                <div className="flex-1">
                  <span className="font-medium text-sm">{type.label}</span>
                  <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                </div>
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
              {selectedEvent && <EventIcon type={selectedEvent.event_type} />}
              <span className="text-lg">{selectedEvent?.title}</span>
              <PrivacyIndicator isPrivate={selectedEvent?.is_private || false} />
            </DialogTitle>
            <DialogDescription>
              {selectedEvent && canViewEventDetails(selectedEvent) ? 
                "View and manage event details" : 
                "This is a private event"
              }
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className="px-3 py-1"
                  style={{
                    backgroundColor: eventTypes[selectedEvent.event_type]?.color + "20",
                    borderColor: eventTypes[selectedEvent.event_type]?.color,
                    color: eventTypes[selectedEvent.event_type]?.color,
                  }}
                >
                  {eventTypes[selectedEvent.event_type]?.label}
                </Badge>
                {selectedEvent.is_private && (
                  <Badge variant="secondary" className="gap-1">
                    <Lock className="w-3 h-3" />
                    Private
                  </Badge>
                )}
              </div>

              {selectedEvent && canViewEventDetails(selectedEvent) ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {moment(selectedEvent.start_time).format("MMMM D, YYYY")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {moment(selectedEvent.start_time).format("h:mm A")} -{" "}
                        {moment(selectedEvent.end_time).format("h:mm A")}
                      </p>
                    </div>
                  </div>

                  {selectedEvent.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                      <p className="text-sm">{selectedEvent.location}</p>
                    </div>
                  )}

                  {selectedEvent.attendee_users && selectedEvent.attendee_users.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-muted-foreground" />
                        <p className="font-medium">Attendees</p>
                      </div>
                      <div className="ml-8 space-y-1">
                        {selectedEvent.attendee_users.map(attendee => (
                          <div key={attendee.id} className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {attendee.first_name?.[0]}{attendee.last_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              {attendee.first_name} {attendee.last_name}
                            </span>
                          </div>
                        ))}
                      </div>
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
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Lock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>This is a private event.</p>
                  <p className="text-sm">Only the creator and attendees can view details.</p>
                </div>
              )}
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
              Schedule a new meal plan session or appointment
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Event Title *</label>
              <Input
                placeholder="Enter event title..."
                value={newEvent.title || ''}
                onChange={(e) => {
                  setNewEvent({ ...newEvent, title: e.target.value })
                  if (formErrors.title) {
                    setFormErrors({ ...formErrors, title: '' })
                  }
                }}
                className={formErrors.title ? 'border-red-500' : ''}
              />
              {formErrors.title && (
                <p className="text-sm text-red-600">{formErrors.title}</p>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Event Type *</label>
              <Select
                value={newEvent.event_type}
                onValueChange={(value: EventType) =>
                  setNewEvent({ ...newEvent, event_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(eventTypes).map(([key, type]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <EventIcon type={key as EventType} />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">Start Time *</label>
                <Input
                  type="datetime-local"
                  value={newEvent.start_time ? moment(newEvent.start_time).format("YYYY-MM-DDTHH:mm") : ''}
                  onChange={(e) => {
                    const dateValue = e.target.value
                    if (dateValue) {
                      setNewEvent({ ...newEvent, start_time: new Date(dateValue).toISOString() })
                      if (formErrors.start_time) {
                        setFormErrors({ ...formErrors, start_time: '' })
                      }
                    }
                  }}
                  className={formErrors.start_time ? 'border-red-500' : ''}
                />
                {formErrors.start_time && (
                  <p className="text-sm text-red-600">{formErrors.start_time}</p>
                )}
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium">End Time *</label>
                <Input
                  type="datetime-local"
                  value={newEvent.end_time ? moment(newEvent.end_time).format("YYYY-MM-DDTHH:mm") : ''}
                  onChange={(e) => {
                    const dateValue = e.target.value
                    if (dateValue) {
                      setNewEvent({ ...newEvent, end_time: new Date(dateValue).toISOString() })
                      if (formErrors.end_time) {
                        setFormErrors({ ...formErrors, end_time: '' })
                      }
                    }
                  }}
                  className={formErrors.end_time ? 'border-red-500' : ''}
                />
                {formErrors.end_time && (
                  <p className="text-sm text-red-600">{formErrors.end_time}</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Location</label>
              <Input
                placeholder="Enter location (optional)..."
                value={newEvent.location || ''}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, location: e.target.value })
                }
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Enter event description (optional)..."
                value={newEvent.description || ''}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
              <Switch
                id="is-private"
                checked={newEvent.is_private || false}
                onCheckedChange={(checked) =>
                  setNewEvent({ ...newEvent, is_private: checked })
                }
              />
              <div className="flex-1">
                <Label htmlFor="is-private" className="font-medium">
                  Private Event
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Private events are only visible to attendees and the creator
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowCreateDialog(false)
                  setFormErrors({})
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleCreateEvent}
                disabled={calendarLoading}
              >
                {calendarLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Create Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CalendarClean;