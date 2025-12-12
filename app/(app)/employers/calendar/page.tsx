/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight, Plus, Edit, Trash2, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  format,
  addMonths,
  subMonths,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
} from "date-fns"
import Lottie from "lottie-react"
import dayNightAnimation from "../../../../public/animations/day_night.json"

type CalendarEvent = {
  id: number
  event_title: string
  event_location: string
  event_date: Date
  event_start: string
  event_end: string
  // Add job_title for interview schedules
  job_title?: string
}

function EventModal({ open, onClose, initialEvent }: {
  open: boolean
  onClose: () => void
  initialEvent?: CalendarEvent
}) {
  const [eventTitle, setEventTitle] = useState("")
  const [eventLocation, setEventLocation] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [eventStart, setEventStart] = useState("")
  const [eventEnd, setEventEnd] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    setEventTitle(initialEvent?.event_title || "")
    setEventLocation(initialEvent?.event_location || "")
    setEventDate(initialEvent?.event_date ? format(initialEvent.event_date, "yyyy-MM-dd") : "")
    setEventStart(initialEvent?.event_start || "")
    setEventEnd(initialEvent?.event_end || "")
    setSubmitted(false)
    setMessage(null)
  }, [initialEvent, open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setMessage(null)
    if (!eventTitle.trim() || !eventDate || !eventStart || !eventEnd) return
    if (eventStart > eventEnd) {
      setMessage("❌ Start time must be before end time")
      return
    }
    setLoading(true)
    try {
      const isEditing = Boolean(initialEvent?.id)
      const method = isEditing ? "PUT" : "POST"
      const url = "/api/employers/calendar-set-event"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: initialEvent?.id,
          eventTitle,
          eventLocation,
          eventDate,
          eventStart,
          eventEnd,
        }),
      })
      const data: { error?: string } = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save event")
      setMessage(isEditing ? "✏️ Event updated successfully!" : "✅ Event created successfully!")
      setTimeout(() => {
        setLoading(false)
        setMessage(null)
        onClose()
      }, 800)
    } catch (err) {
      const error = err as Error
      setMessage(`❌ Error saving event: ${error.message}`)
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative border border-blue-100"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <button className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 transition" onClick={onClose}>
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-2 text-blue-700">{initialEvent ? "Edit Event" : "Add Event"}</h2>
            {!initialEvent && (
              <div className="mb-6 text-xs text-gray-400">
                Have something you don’t want to forget? Pop it in your calendar — future you will be thankful for the reminder!
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-blue-600">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-700 text-base h-[44px]"
                  value={eventTitle}
                  onChange={e => setEventTitle(e.target.value)}
                  required
                  placeholder="Write your event title"
                />
                {submitted && eventTitle.trim() === "" && (
                  <div className="text-xs text-red-500 mt-1">Title is required</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-blue-600">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={eventDate}
                  onChange={e => setEventDate(e.target.value)}
                  required
                />
                {submitted && !eventDate && (
                  <div className="text-xs text-red-500 mt-1">Date is required</div>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-0 max-w-xs">
                  <label className="block text-sm font-semibold mb-2 text-blue-600">Start Time <span className="text-red-500">*</span></label>
                  <input
                    type="time"
                    className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    value={eventStart}
                    onChange={e => setEventStart(e.target.value)}
                    required
                  />
                  {submitted && !eventStart && (
                    <div className="text-xs text-red-500 mt-1">Start time is required</div>
                  )}
                </div>
                <div className="flex-1 min-w-0 max-w-xs">
                  <label className="block text-sm font-semibold mb-2 text-blue-600">End Time <span className="text-red-500">*</span></label>
                  <input
                    type="time"
                    className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    value={eventEnd}
                    onChange={e => setEventEnd(e.target.value)}
                    required
                  />
                  {submitted && !eventEnd && (
                    <div className="text-xs text-red-500 mt-1">End time is required</div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-blue-600">Location</label>
                <input
                  className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
                  value={eventLocation}
                  onChange={e => setEventLocation(e.target.value)}
                  placeholder="Add a location"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition shadow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              {message && <div className="text-center text-sm mt-2">{message}</div>}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      setInterval(async () => {
        try {
          const res = await fetch("/api/employers/calendar-set-event");
          if (!res.ok) throw new Error("Failed to fetch events");
          const { events } = await res.json();
          setEvents(events);
        } catch (err) {
          console.error("Error fetching events:", err);
        }
      }, 5000);
    }; 
    fetchEvents();
  }, []);

  // Fetch interview schedules for employer from new API
  useEffect(() => {
    async function fetchSchedules() {
      try {
        const res = await fetch("/api/students/calendar/fetchSchedsforEmployers");
        if (!res.ok) throw new Error("Failed to fetch interview schedules");
        const data = await res.json();
        // Map API data to CalendarEvent[]
        const mapped: CalendarEvent[] = (data ?? []).map((sched: any) => ({
          id: sched.id || sched.schedule_id || Math.random(), // fallback if no id
          event_title: sched.job_title ? `Interview: ${sched.job_title}` : "Interview",
          event_location: sched.location || "",
          event_date: sched.scheduled_date ? new Date(sched.scheduled_date) : new Date(),
          event_start: sched.start_time || "",
          event_end: sched.end_time || "",
          job_title: sched.job_title,
        }));
        setEvents(mapped);
      } catch (err) {
        console.error("Error fetching interview schedules:", err);
      }
    }
    fetchSchedules();
    // Optionally, poll every 30s for updates:
    // const interval = setInterval(fetchSchedules, 30000);
    // return () => clearInterval(interval);
  }, []);

  async function handleDeleteEvent(id: number) {
    try {
      const res = await fetch("/api/employers/calendar-set-event", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      });

      const data: { error?: string } = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete event");
      }
      setEvents(events => events.filter(e => e.id !== id))
      alert("🗑️ Event deleted successfully!");
    } catch (err) {
      const error = err as Error;
      alert(`❌ Error deleting event: ${error.message}`);
    }
  }

  const [modalOpen, setModalOpen] = useState(false)
  const [editEvent, setEditEvent] = useState<CalendarEvent | undefined>(undefined)
  const [leftPage, setLeftPage] = useState(0)
  const [rightPage, setRightPage] = useState(0)
  const leftEventsPerPage = 3
  const rightEventsPerPage = 4

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  const handleAddEvent = () => {
    setEditEvent(undefined)
    setModalOpen(true)
  }
  const handleEditEvent = (event: CalendarEvent) => {
    setEditEvent(event)
    setModalOpen(true)
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const eventsInMonth = events.filter(e => isSameMonth(e.event_date, currentDate))
  const selectedDateEvents = events.filter((event) => isSameDay(event.event_date, selectedDate))
  const leftTotalPages = Math.ceil(selectedDateEvents.length / leftEventsPerPage)
  const leftEventsToShow = selectedDateEvents.slice(leftPage * leftEventsPerPage, (leftPage + 1) * leftEventsPerPage)
  const rightTotalPages = Math.ceil(eventsInMonth.length / rightEventsPerPage)
  const rightEventsToShow = eventsInMonth.slice(rightPage * rightEventsPerPage, (rightPage + 1) * rightEventsPerPage)
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-100 to-blue-200 flex justify-center items-start">
      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialEvent={editEvent}
      />
      <div className="max-w-7xl w-full mx-auto p-4 md:p-8">
        <div className="rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none shadow-2xl bg-gradient-to-br from-blue-50 via-white to-sky-100 border border-blue-100 flex flex-col md:flex-row">
          <motion.div
            className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none shadow-2xl w-full md:w-2/3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">{format(currentDate, "MMMM yyyy")}</h2>
                <div className="flex space-x-2">
                  <button onClick={prevMonth} className="p-2 rounded-full hover:bg-blue-400/40 transition-colors bg-blue-600/30">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={nextMonth} className="p-2 rounded-full hover:bg-blue-400/40 transition-colors bg-blue-600/30">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 mb-2">
                {dayNames.map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-blue-200 tracking-wide">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {daysInMonth.map((day) => {
                  const hasEvents = events.some((event) => isSameDay(event.event_date, day))
                  const isSelected = isSameDay(day, selectedDate)
                  const isToday = isSameDay(day, new Date())
                  return (
                    <motion.button
                      key={day.toString()}
                      className={`
                        aspect-square rounded-xl flex items-center justify-center text-base font-medium
                        transition-all duration-150
                        ${!isSameMonth(day, currentDate) ? "text-blue-300 bg-blue-600/10" : ""}
                        ${isSelected ? "bg-white text-blue-700 font-bold shadow-lg border-2 border-blue-400" : ""}
                        ${!isSelected && isSameMonth(day, currentDate) ? "text-white bg-blue-600/40" : ""}
                        ${isToday && !isSelected ? "border-2 border-white" : ""}
                        ${hasEvents && !isSelected ? "font-bold bg-blue-700/60" : ""}
                        hover:bg-white hover:text-blue-700
                        relative
                      `}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setSelectedDate(day)}
                      onDoubleClick={() => handleAddEvent()}
                    >
                      {format(day, "d")}
                      {hasEvents && (
                        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </div>
            <div className="bg-white p-8 flex flex-col space-y-5 rounded-b-3xl md:rounded-bl-none md:rounded-b-3xl">
              <div className="flex items-center mb-2">
                <span className="font-bold text-blue-700 text-lg mr-2">{format(selectedDate, "MMMM d, yyyy")}</span>
                <button
                  className="ml-auto flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs"
                  onClick={handleAddEvent}
                >
                  <Plus className="w-3 h-3" /> Add Event
                </button>
              </div>
              {selectedDateEvents.length === 0 ? (
                <div className="text-center">
                  <Lottie animationData={dayNightAnimation} className="w-36 h-36 mx-auto" loop={true} />
                  <p className="text-gray-500 mb-5 text-sm">
                    Your day looks wide open — perfect time to relax or check what&apos;s already on your calendar.
                  </p>
                </div>
              ) : (
                <>
                  {leftEventsToShow.map((event) => (
                    <div key={event.id} className="bg-blue-50 rounded-xl p-5 shadow-md border border-blue-100 relative flex flex-col">
                      <div className="absolute top-3 right-3 flex gap-2">
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => handleEditEvent(event)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-400 hover:text-red-600"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <h3 className="font-semibold text-blue-800 text-lg max-w-[90%] break-words">
                        {event.event_title.length > 22
                          ? (
                              <>
                                {event.event_title.slice(0, 22)}
                                <wbr />
                                <br />
                                {event.event_title.slice(22, 40) + (event.event_title.length > 40 ? "..." : "")}
                              </>
                            )
                          : event.event_title}
                      </h3>
                      {/* No desc field in employer events, skip description */}
                      <div className="mt-2 text-sm text-gray-600">
                        <div className="flex items-center mb-1">
                          <Clock className="w-4 h-4 mr-2 text-blue-400" />
                          <span>
                            {event.event_start
                              ? event.event_end
                                ? `${event.event_start} - ${event.event_end}`
                                : event.event_start
                              : "No time set"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                          <span>{event.event_location ? event.event_location : "No location set"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {leftTotalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-2">
                      <button
                        className="p-2 rounded-full bg-blue-100 text-blue-600 disabled:opacity-40"
                        onClick={() => setLeftPage(p => Math.max(0, p - 1))}
                        disabled={leftPage === 0}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-sm text-blue-700">{leftPage + 1} / {leftTotalPages}</span>
                      <button
                        className="p-2 rounded-full bg-blue-100 text-blue-600 disabled:opacity-40"
                        onClick={() => setLeftPage(p => Math.min(leftTotalPages - 1, p + 1))}
                        disabled={leftPage === leftTotalPages - 1}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
          <motion.div
            className="w-full md:w-1/3 p-0 md:p-8 flex flex-col space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center mb-2 mt-8 md:mt-0 px-8 md:px-0">
              <Calendar className="w-5 h-5 text-blue-500 mr-2" />
              <h2 className="text-lg font-semibold text-blue-700">{format(currentDate, "MMMM yyyy")} Events</h2>
            </div>
            {eventsInMonth.length > 0 ? (
              <>
                {rightEventsToShow.map((event) => (
                  <motion.div key={event.id} className="bg-white rounded-2xl shadow-lg p-5 border border-blue-100 hover:shadow-xl transition-shadow relative mx-8 md:mx-0" whileHover={{ y: -3, scale: 1.02 }} transition={{ duration: 0.2 }}>
                    {/* No edit/delete buttons here */}
                    <h3 className="font-semibold text-blue-800 text-lg max-w-[90%] break-words">
                      {event.event_title.length > 22
                        ? (
                            <>
                              {event.event_title.slice(0, 22)}
                              <wbr />
                              <br />
                              {event.event_title.slice(22, 40) + (event.event_title.length > 40 ? "..." : "")}
                            </>
                          )
                        : event.event_title}
                    </h3>
                    {/* No desc field in employer events, skip description */}
                    <div className="mt-2 space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                        <span>{format(event.event_date, "MMMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                        <span>
                          {event.event_location
                            ? (
                              <span>
                                {event.event_location.length > 32
                                  ? event.event_location.slice(0, 32) + "..."
                                  : event.event_location}
                              </span>
                            )
                            : "No location set"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-blue-400" />
                        <span>
                          {event.event_start
                            ? event.event_end
                              ? `${event.event_start} - ${event.event_end}`
                              : event.event_start
                            : "No time set"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {rightTotalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-2">
                    <button
                      className="p-2 rounded-full bg-blue-100 text-blue-600 disabled:opacity-40"
                      onClick={() => setRightPage(p => Math.max(0, p - 1))}
                      disabled={rightPage === 0}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-blue-700">{rightPage + 1} / {rightTotalPages}</span>
                    <button
                      className="p-2 rounded-full bg-blue-100 text-blue-600 disabled:opacity-40"
                      onClick={() => setRightPage(p => Math.min(rightTotalPages - 1, p + 1))}
                      disabled={rightPage === rightTotalPages - 1}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <motion.div
                className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100 flex flex-col items-center justify-center text-center mx-8 md:mx-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Lottie animationData={dayNightAnimation} className="w-36 h-36 mx-auto" loop={true} />
                <h3 className="font-semibold text-blue-800 mb-1 text-lg">No events scheduled</h3>
                <p className="text-sm text-gray-500">
                  Your month looks wide open — perfect time to relax or check what&apos;s already on your calendar.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
  
}