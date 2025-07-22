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
import {
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Users,
  User,
  Utensils,
  UserCheck,
  AlertTriangle,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  MapPin,
  FileText,
  RefreshCw,
} from "lucide-react";
import { useCalendarService } from '@/hooks/useCalendarService'
import { usePlayerService } from '@/hooks/usePlayerService'
import { CreateCalendarEventData, CalendarEventWithAttendees } from '@/lib/services/calendar'
import { EventType, Player } from '@/lib/services/types'

const localizer = momentLocalizer(moment);

// Event types with colors
const eventTypes = {
  meal_plan: {
    label: "Meal Plan",
    color: "#10b981",
    icon: Utensils,
  },
  appointment: {
    label: "Appointment",
    color: "#3b82f6",
    icon: UserCheck,
  },
};

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
      </div>
    </div>
  );
};

// Event icon component
const EventIcon = ({ type }) => {
  const IconComponent = eventTypes[type]?.icon || CalendarIcon;
  return <IconComponent className="w-4 h-4" />;
};

interface NutritionCalendarRealProps {
  onPlayerSelect: (playerId: string) => void;
}

function NutritionCalendarReal({
  onPlayerSelect,
}: NutritionCalendarRealProps) {
  const [events, setEvents] = useState<CalendarEventWithAttendees[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventWithAttendees | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<CreateCalendarEventData> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<EventType | "all">("all");
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const {
    loading: calendarLoading,
    error: calendarError,
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    clearError
  } = useCalendarService()

  const {
    loading: playersLoading,
    getPlayers
  } = usePlayerService()

  const [newEvent, setNewEvent] = useState<Partial<CreateCalendarEventData>>({
    title: "",
    event_type: "meal_plan",
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour later
    location: "",
    description: "",
    attendees: [],
    is_private: false,
  });

  // Load data
  const loadData = useCallback(async () => {
    const startOfMonth = moment(date).startOf('month').toISOString()
    const endOfMonth = moment(date).endOf('month').toISOString()

    const [eventsResult, playersResult] = await Promise.all([
      getEvents({
        filters: {
          start_date: startOfMonth,
          end_date: endOfMonth,
          ...(filterType !== "all" && { event_type: filterType as EventType })
        },
        sort: { column: 'start_time', ascending: true }
      }),
      getPlayers({
        pagination: { limit: 100 },
        sort: { column: 'created_at', ascending: false }
      })
    ])

    if (eventsResult?.data) {
      // Filter by search term if provided
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
  }, [date, filterType, searchTerm, getEvents, getPlayers])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Convert calendar events to react-big-calendar format
  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: new Date(event.start_time),
    end: new Date(event.end_time),
    type: event.event_type,
    originalEvent: event
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
  }, [newEvent])

  const eventStyleGetter = (event) => {
    const eventType = eventTypes[event.type]
    return {
      style: {
        backgroundColor: eventType?.color || "#3174ad",
        borderColor: eventType?.color || "#3174ad",
        color: "white",
        border: "none",
        fontSize: "12px",
        borderRadius: "4px",
      },
    }
  }

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.start_time || !newEvent.end_time || !newEvent.event_type) {
      return
    }

    const eventData: CreateCalendarEventData = {
      title: newEvent.title,
      description: newEvent.description,
      event_type: newEvent.event_type as EventType,
      start_time: newEvent.start_time,
      end_time: newEvent.end_time,
      location: newEvent.location || '',
      attendees: newEvent.attendees || [],
      is_private: false,
      metadata: {}
    }

    const created = await createEvent(eventData)
    if (created) {
      setShowCreateDialog(false)
      setNewEvent({
        title: "",
        event_type: "meal_plan",
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        location: "",
        description: "",
        attendees: [],
        is_private: false,
      })
      await loadData() // Refresh events
    }
  }

  const handleEditEvent = (event: CalendarEventWithAttendees) => {
    setEditingEvent({
      title: event.title,
      description: event.description || '',
      event_type: event.event_type,
      start_time: event.start_time,
      end_time: event.end_time,
      location: event.location || '',
      attendees: event.attendees || [],
      is_private: event.is_private || false,
    })
    setShowEventDialog(false)
    setShowEditDialog(true)
  }

  const handleUpdateEvent = async () => {
    if (!selectedEvent || !editingEvent?.title || !editingEvent?.start_time || !editingEvent?.end_time || !editingEvent?.event_type) {
      return
    }

    const eventData = {
      title: editingEvent.title,
      description: editingEvent.description,
      event_type: editingEvent.event_type as EventType,
      start_time: editingEvent.start_time,
      end_time: editingEvent.end_time,
      location: editingEvent.location || '',
      attendees: editingEvent.attendees || [],
      is_private: editingEvent.is_private || false,
      metadata: {}
    }

    const updated = await updateEvent(selectedEvent.id, eventData)
    if (updated) {
      setShowEditDialog(false)
      setEditingEvent(null)
      await loadData() // Refresh events
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const success = await deleteEvent(eventId)
      if (success) {
        setShowEventDialog(false)
        await loadData() // Refresh events
      }
    }
  }

  const getPlayerById = (playerId: string) => {
    return players.find(p => p.id === playerId)
  }

  const getUserByAttendeeId = (attendeeId: string) => {
    const player = players.find(p => p.user_id === attendeeId)
    return player?.user
  }

  return (
    <div className="space-y-8">
      {/* Header with error handling */}
      {calendarError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Calendar Error:</span>
              <span>{calendarError}</span>
              <Button variant="ghost" size="sm" onClick={clearError}>
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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

        <div className="flex gap-2">
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Calendar */}
      <Card className="shadow-lg">
        <CardContent className="p-0">
          <div className="h-[800px] p-6">
            {calendarLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Loading events...</span>
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

      {/* Event Legend */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Event Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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
              {selectedEvent && <EventIcon type={selectedEvent.event_type} />}
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
                      eventTypes[selectedEvent.event_type]?.color + "20",
                    borderColor: eventTypes[selectedEvent.event_type]?.color,
                    color: eventTypes[selectedEvent.event_type]?.color,
                  }}
                >
                  {eventTypes[selectedEvent.event_type]?.label}
                </Badge>
              </div>

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
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEditEvent(selectedEvent)}
                >
                  <Edit className="w-4 w-4 mr-2" />
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
                value={newEvent.title || ''}
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
                  value={newEvent.start_time ? moment(newEvent.start_time).format("YYYY-MM-DDTHH:mm") : ''}
                  onChange={(e) => {
                    const dateValue = e.target.value
                    if (dateValue) {
                      setNewEvent({
                        ...newEvent,
                        start_time: new Date(dateValue).toISOString(),
                      })
                    }
                  }}
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium">End Date *</label>
                <Input
                  type="datetime-local"
                  value={newEvent.end_time ? moment(newEvent.end_time).format("YYYY-MM-DDTHH:mm") : ''}
                  onChange={(e) => {
                    const dateValue = e.target.value
                    if (dateValue) {
                      setNewEvent({
                        ...newEvent,
                        end_time: new Date(dateValue).toISOString(),
                      })
                    }
                  }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Location</label>
              <Input
                placeholder="Enter location..."
                value={newEvent.location || ''}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    location: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Enter event description..."
                value={newEvent.description || ''}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    description: e.target.value,
                  })
                }
                rows={3}
              />
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
                disabled={!newEvent.title || calendarLoading}
              >
                {calendarLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Create Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg">Edit Event</DialogTitle>
            <DialogDescription>
              Update your event details
            </DialogDescription>
          </DialogHeader>

          {editingEvent && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">Event Title *</label>
                <Input
                  placeholder="Enter event title..."
                  value={editingEvent.title || ''}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Event Type *</label>
                <Select
                  value={editingEvent.event_type}
                  onValueChange={(value: EventType) =>
                    setEditingEvent({ ...editingEvent, event_type: value })
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
                  <label className="text-sm font-medium">Start Time *</label>
                  <Input
                    type="datetime-local"
                    value={editingEvent.start_time ? moment(editingEvent.start_time).format("YYYY-MM-DDTHH:mm") : ''}
                    onChange={(e) => {
                      const dateValue = e.target.value
                      if (dateValue) {
                        setEditingEvent({
                          ...editingEvent,
                          start_time: new Date(dateValue).toISOString(),
                        })
                      }
                    }}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium">End Time *</label>
                  <Input
                    type="datetime-local"
                    value={editingEvent.end_time ? moment(editingEvent.end_time).format("YYYY-MM-DDTHH:mm") : ''}
                    onChange={(e) => {
                      const dateValue = e.target.value
                      if (dateValue) {
                        setEditingEvent({
                          ...editingEvent,
                          end_time: new Date(dateValue).toISOString(),
                        })
                      }
                    }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Location</label>
                <Input
                  placeholder="Enter location..."
                  value={editingEvent.location || ''}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      location: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Enter event description..."
                  value={editingEvent.description || ''}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowEditDialog(false)
                    setEditingEvent(null)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleUpdateEvent}
                  disabled={!editingEvent.title || calendarLoading}
                >
                  {calendarLoading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Edit className="w-4 h-4 mr-2" />
                  )}
                  Update Event
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default NutritionCalendarReal;