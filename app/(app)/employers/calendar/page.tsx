"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight, Cloud, Plus, Edit, Trash2, X } from "lucide-react"
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

type CalendarEvent = {
  id: number
  title: string
  date: Date
  location: string
  timeStart: string
  timeEnd: string
}

function EventModal({ open, onClose, onSave, initialEvent, date }: {
  open: boolean
  onClose: () => void
  onSave: (event: Omit<CalendarEvent, "id"> | CalendarEvent) => void
  initialEvent?: CalendarEvent
  date: Date
}) {
  const [title, setTitle] = useState(initialEvent?.title || "")
  const [location, setLocation] = useState(initialEvent?.location || "")
  const [timeStart, setTimeStart] = useState(initialEvent?.timeStart || "")
  const [timeEnd, setTimeEnd] = useState(initialEvent?.timeEnd || "")

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl relative"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={onClose}>
              <X />
            </button>
            <h2 className="text-xl font-semibold mb-4">{initialEvent ? "Edit Event" : "Add Event"}</h2>
            <form
              onSubmit={e => {
                e.preventDefault()
                onSave({
                  ...initialEvent,
                  title,
                  location,
                  timeStart,
                  timeEnd,
                  date,
                })
                onClose()
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input className="w-full border rounded px-3 py-2" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input className="w-full border rounded px-3 py-2" value={location} onChange={e => setLocation(e.target.value)} required />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Start Time</label>
                  <input className="w-full border rounded px-3 py-2" value={timeStart} onChange={e => setTimeStart(e.target.value)} required placeholder="10:00 AM" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">End Time</label>
                  <input className="w-full border rounded px-3 py-2" value={timeEnd} onChange={e => setTimeEnd(e.target.value)} required placeholder="11:00 AM" />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 transition">Save</button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const sampleTitles = [
      "Team Meeting",
      "Project Deadline",
      "Client Presentation",
      "Code Review",
      "Lunch with Team",
    ];
    const sampleLocations = [
      "Office",
      "Zoom",
      "Google Meet",
      "Client's Office",
      "Cafeteria",
    ];
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const arr: CalendarEvent[] = [];
    daysInMonth.forEach((day, index) => {
      if (index % 3 === 0) {
        arr.push({
          id: index + 1,
          title: sampleTitles[index % sampleTitles.length],
          date: day,
          location: sampleLocations[index % sampleLocations.length],
          timeStart: "10:00 AM",
          timeEnd: "11:00 AM",
        });
      }
    });
    return arr;
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [modalDate, setModalDate] = useState<Date | null>(null)
  const [editEvent, setEditEvent] = useState<CalendarEvent | undefined>(undefined)

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  const handleAddEvent = (date: Date) => {
    setEditEvent(undefined)
    setModalDate(date)
    setModalOpen(true)
  }
  const handleEditEvent = (event: CalendarEvent) => {
    setEditEvent(event)
    setModalDate(event.date)
    setModalOpen(true)
  }
  const handleDeleteEvent = (id: number) => {
    setEvents(events => events.filter(e => e.id !== id))
  }
  const handleSaveEvent = (event: Omit<CalendarEvent, "id"> | CalendarEvent) => {
    if ("id" in event && event.id) {
      setEvents(events => events.map(e => e.id === event.id ? { ...event, id: event.id } : e))
    } else {
      setEvents(events => [
        ...events,
        { ...event, id: Math.max(0, ...events.map(e => e.id)) + 1 }
      ])
    }
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const eventsInMonth = events.filter(e => isSameMonth(e.date, currentDate))
  const selectedDateEvents = events.filter((event) => isSameDay(event.date, selectedDate))

  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 flex justify-center items-start">
      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveEvent}
        initialEvent={editEvent}
        date={modalDate || selectedDate}
      />
      <div className="max-w-6xl w-full mx-auto p-4 md:p-8">
        <div className="rounded-3xl shadow-lg bg-gradient-to-br from-blue-50 to-sky-100">
          <div className="bg-gradient-to-br from-blue-50 to-sky-100">
            <motion.h1
              className="text-3xl font-bold text-blue-600 mb-6 bg-gradient-to-br from-blue-50 to-sky-100"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Calendar
            </motion.h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              className="space-y-4 bg-gradient-to-br from-blue-50 to-sky-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                <h2 className="text-lg font-semibold text-blue-700">{format(currentDate, "MMMM yyyy")} Events</h2>
                <button
                  className="ml-auto flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  onClick={() => handleAddEvent(selectedDate)}
                >
                  <Plus className="w-4 h-4" /> Add Event
                </button>
              </div>

              {eventsInMonth.length > 0 ? (
                eventsInMonth.map((event) => (
                  <motion.div
                    key={event.id}
                    className="bg-white top-20 rounded-xl shadow-md p-4 border border-blue-100 hover:shadow-lg transition-shadow relative"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
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
                    <h3 className="font-semibold text-blue-800">{event.title}</h3>
                    <div className="mt-2 space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                        <span>{format(event.date, "MMMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-blue-400" />
                        <span>
                          {event.timeStart} - {event.timeEnd}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="bg-white rounded-xl shadow-md p-6 border border-blue-100 flex flex-col items-center justify-center text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-blue-800 mb-1">No events scheduled</h3>
                  <p className="text-sm text-gray-500">There are no events scheduled for this month.</p>
                </motion.div>
              )}
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-xl overflow-hidden sticky top-[6rem] z-0 -mt-3 h-fit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="p-6 text-white">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">{format(currentDate, "MMMM yyyy")}</h2>
                  <div className="flex space-x-2">
                    <button onClick={prevMonth} className="p-2 rounded-full hover:bg-blue-400/30 transition-colors">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={nextMonth} className="p-2 rounded-full hover:bg-blue-400/30 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-2">
                  {dayNames.map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-blue-100">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {daysInMonth.map((day) => {
                    const hasEvents = events.some((event) => isSameDay(event.date, day))
                    const isSelected = isSameDay(day, selectedDate)
                    const isToday = isSameDay(day, new Date())
                    return (
                      <motion.button
                        key={day.toString()}
                        className={`
                          aspect-square rounded-full flex items-center justify-center text-sm
                          ${!isSameMonth(day, currentDate) ? "text-blue-300" : ""}
                          ${isSelected ? "bg-white text-blue-600 font-bold" : ""}
                          ${!isSelected && isSameMonth(day, currentDate) ? "text-white" : ""}
                          ${isToday && !isSelected ? "border border-white" : ""}
                          ${hasEvents && !isSelected ? "font-bold" : ""}
                          hover:bg-blue-400/30 transition-colors
                        `}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedDate(day)}
                        onDoubleClick={() => handleAddEvent(day)}
                      >
                        {format(day, "d")}
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              <div className="bg-white p-6 flex flex-col space-y-4">
                <div className="flex items-center mb-2">
                  <span className="font-semibold text-blue-700 mr-2">{format(selectedDate, "MMMM d, yyyy")}</span>
                  <button
                    className="ml-auto flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs"
                    onClick={() => handleAddEvent(selectedDate)}
                  >
                    <Plus className="w-3 h-3" /> Add Event
                  </button>
                </div>
                {selectedDateEvents.length === 0 ? (
                  <div className="text-center">
                    <p className="text-gray-500 mb-5">No events for this day</p>
                    <Cloud className="w-12 h-12 text-gray-300 mx-auto" />
                  </div>
                ) : (
                  selectedDateEvents.map((event) => (
                    <div
                      key={event.id}
                      className="bg-blue-50 rounded-lg p-4 shadow-md border border-blue-100 relative"
                    >
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
                      <h3 className="font-semibold text-blue-800">{event.title}</h3>
                      <div className="mt-2 text-sm text-gray-600">
                        <div className="flex items-center mb-1">
                          <Clock className="w-4 h-4 mr-2 text-blue-400" />
                          <span>
                            {event.timeStart} - {event.timeEnd}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
