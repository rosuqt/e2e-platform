"use client"

import { useState, useEffect } from "react"
import { Calendar, ChevronLeft, ChevronRight, Plus, Edit, Trash2, X, Clock, MapPin, Loader2 } from "lucide-react"
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
import AddressAutocomplete from "@/components/AddressAutocomplete"
import { TimePicker, DatePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import dayjs from 'dayjs'
import { RiSave3Line } from "react-icons/ri"
import Lottie from "lottie-react"
import dayNightAnimation from "../../../../public/animations/day_night.json"
import Tooltip from '@mui/material/Tooltip'

type CalendarEvent = {
  id: number
  title: string
  date: Date
  location: string
  timeStart: string
  timeEnd: string
  desc?: string
}

function EventModal({ open, onClose, onSave, initialEvent, date }: {
  open: boolean
  onClose: () => void
  onSave: (event: Omit<CalendarEvent, "id"> | CalendarEvent) => void
  initialEvent?: CalendarEvent
  date: Date
}) {
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [endTime, setEndTime] = useState<Date | null>(null)
  const [eventDate, setEventDate] = useState<Date>(date || new Date())
  const [submitted, setSubmitted] = useState(false)
  const [desc, setDesc] = useState("")

  useEffect(() => {
    setTitle(initialEvent?.title || "")
    setLocation(initialEvent?.location || "")
    setStartTime(initialEvent?.timeStart ? parseTime(initialEvent.timeStart) : null)
    setEndTime(initialEvent?.timeEnd ? parseTime(initialEvent.timeEnd) : null)
    setEventDate(initialEvent?.date || date || new Date())
    setDesc(initialEvent?.desc || "")
  }, [initialEvent, date, open])

  function parseTime(str: string) {
        const d = new Date()
        const [time, period] = str.split(' ')
        if (!time || !period) return null
        const parts = time.split(':')
        if (parts.length !== 2) return null
        let h = parts[0]
        const m = parts[1]
        h = period === 'PM' ? String((parseInt(h) % 12) + 12) : h
        d.setHours(Number(h))
        const min = Number(m)
        d.setMinutes(min)
        d.setSeconds(0)
        return d
    }

  function formatTime(date: Date | null) {
    if (!date) return ''
    let h = date.getHours()
    const m = date.getMinutes()
    const period = h >= 12 ? 'PM' : 'AM'
    h = h % 12 || 12
    return `${h}:${m.toString().padStart(2, '0')} ${period}`
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    if (!title.trim()) return
    if (!eventDate) return
    onSave({
      ...initialEvent,
      title,
      location,
      timeStart: startTime ? formatTime(startTime) : "",
      timeEnd: endTime ? formatTime(endTime) : "",
      date: eventDate,
      desc,
    })
    setSubmitted(false)
    onClose()
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-7 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-700 text-base h-[44px]"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  placeholder="Write your event title"
                />
                {submitted && title.trim() === "" && (
                  <div className="text-xs text-red-500 mt-1">Title is required</div>
                )}
              </div>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div className="mb-5">
                  <label className="block text-sm font-semibold mb-2 text-blue-600">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    value={eventDate}
                    onChange={val => setEventDate(val && dayjs.isDayjs(val) ? val.toDate() : (val as Date ?? new Date()))}
                    slotProps={{
                      textField: {
                        required: true,
                        className: "w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300",
                      } as Record<string, unknown>
                    }}
                  />
                  {submitted && !eventDate && (
                    <div className="text-xs text-red-500 mt-1">Date is required</div>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="flex-1 min-w-0 max-w-xs">
                    <label className="block text-sm font-semibold mb-2 text-blue-600">Start Time</label>
                    <TimePicker
                      value={startTime}
                      onChange={val => setStartTime(val && dayjs.isDayjs(val) ? val.toDate() : (val as Date ?? null))}
                      slotProps={{
                        textField: {
                          className: "w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300",
                        } as Record<string, unknown>
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0 max-w-xs">
                    <label className="block text-sm font-semibold mb-2 text-blue-600">End Time</label>
                    <TimePicker
                      value={endTime}
                      onChange={val => setEndTime(val && dayjs.isDayjs(val) ? val.toDate() : (val as Date ?? null))}
                      slotProps={{
                        textField: {
                          className: "w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300",
                        } as Record<string, unknown>
                      }}
                    />
                  </div>
                </div>
              </LocalizationProvider>
              <div>
                <label className="block text-sm font-semibold mb-2 text-blue-600">Location</label>
                <AddressAutocomplete
                  value={location}
                  onChange={setLocation}
                  error={false}
                  helperText={null}
                  label={null}
                  className="w-full"
                  placeholder="Search for a location"
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: '0.5rem',
                      borderColor: '#bfdbfe',
                      paddingLeft: '1rem',
                      paddingRight: '1rem',
                      fontSize: '1rem',
                    },
                  }}
                  InputLabelProps={{ shrink: false }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-blue-600">Desc</label>
                <textarea
                  className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base min-h-[80px]"
                  value={desc}
                  onChange={e => {
                    if (e.target.value.length <= 300) setDesc(e.target.value)
                  }}
                  maxLength={300}
                  placeholder="Add a description (max 300 characters)"
                />
                <div className="text-xs text-gray-400 text-right">{desc.length}/300</div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition shadow flex items-center justify-center gap-2">
                <RiSave3Line className="w-5 h-5" />
                Save
              </button>
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
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalDate, setModalDate] = useState<Date | null>(null)
  const [editEvent, setEditEvent] = useState<CalendarEvent | undefined>(undefined)
  const [descExpanded, setDescExpanded] = useState<{ [key: number]: boolean }>({})
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [leftPage, setLeftPage] = useState(0)
  const [rightPage, setRightPage] = useState(0)

  const leftEventsPerPage = 3
  const rightEventsPerPage = 4

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  async function fetchEvents() {
    const res = await fetch("/api/students/calendar")
    if (res.ok) {
      const data = await res.json()
      setEvents(
        data.map((e: {
          id: number
          title: string
          event_date: string
          location: string
          time_start: string
          time_end: string
          desc?: string
        }) => ({
          id: e.id,
          title: e.title,
          date: new Date(e.event_date),
          location: e.location,
          timeStart: e.time_start,
          timeEnd: e.time_end,
          desc: e.desc,
        }))
      )
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

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
  const handleDeleteEvent = async (id: number) => {
    setDeletingId(id)
    await fetch(`/api/students/calendar`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    setDeletingId(null)
    fetchEvents()
  }
  const handleSaveEvent = async (event: Omit<CalendarEvent, "id"> | CalendarEvent) => {
    const formattedDate = format(event.date, "yyyy-MM-dd")
    if ("id" in event && event.id) {
      await fetch(`/api/students/calendar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: event.id,
          title: event.title,
          event_date: formattedDate,
          location: event.location,
          time_start: event.timeStart,
          time_end: event.timeEnd,
          desc: event.desc,
        }),
      })
    } else {
      await fetch("/api/students/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: event.title,
          event_date: formattedDate,
          location: event.location,
          time_start: event.timeStart,
          time_end: event.timeEnd,
          desc: event.desc,
        }),
      })
    }
    fetchEvents()
    setModalOpen(false)
    setEditEvent(undefined)
    setModalDate(null)
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const selectedDateEvents = events.filter((event) => isSameDay(event.date, selectedDate))
  const leftTotalPages = Math.ceil(selectedDateEvents.length / leftEventsPerPage)
  const leftEventsToShow = selectedDateEvents.slice(leftPage * leftEventsPerPage, (leftPage + 1) * leftEventsPerPage)

  const eventsInMonth = events.filter(e => isSameMonth(e.date, currentDate))
  const rightTotalPages = Math.ceil(eventsInMonth.length / rightEventsPerPage)
  const rightEventsToShow = eventsInMonth.slice(rightPage * rightEventsPerPage, (rightPage + 1) * rightEventsPerPage)

  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

  // Add toggle function
  const toggleDesc = (id: number) => {
    setDescExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-100 to-blue-200 flex justify-center items-start">
      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveEvent}
        initialEvent={editEvent}
        date={modalDate || selectedDate}
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
                  const hasEvents = events.some((event) => isSameDay(event.date, day))
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
                      onDoubleClick={() => handleAddEvent(day)}
                    >
                      {format(day, "d")}
                      {hasEvents && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full"></span>
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
                  className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm shadow"
                  onClick={() => handleAddEvent(selectedDate)}
                >
                  <Plus className="w-4 h-4" /> Add Event
                </button>
              </div>
              {selectedDateEvents.length === 0 ? (
                <div className="text-center">
                  <Lottie animationData={dayNightAnimation} className="w-36 h-36 mx-auto" loop={true} />
                  <p className="text-gray-500 mb-5 text-sm">Looks like your day’s wide open — perfect time to relax or add something new to your calendar</p>
                  
                </div>
              ) : (
                <>
                  {leftEventsToShow.map((event) => (
                    <div key={event.id} className="bg-blue-50 rounded-xl p-5 shadow-md border border-blue-100 relative flex flex-col">
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button
                          className="text-blue-500 hover:text-blue-700 bg-blue-100 rounded-full p-1 transition"
                          onClick={() => handleEditEvent(event)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-400 hover:text-red-600 bg-red-100 rounded-full p-1 transition flex items-center justify-center"
                          onClick={() => handleDeleteEvent(event.id)}
                          disabled={deletingId === event.id}
                        >
                          {deletingId === event.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <h3 className="font-semibold text-blue-800 text-lg">{event.title}</h3>
                      {event.desc && (
                        <>
                          <div className="text-sm text-gray-500 mb-2 flex flex-wrap items-center">
                            {event.desc.length > 78 && !descExpanded[event.id] ? (
                              <>
                                {(() => {
                                  const truncated = event.desc.slice(0, 78)
                                  const lastSpace = truncated.lastIndexOf(' ')
                                  const shown = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated
                                  const lastWord = lastSpace > 0 ? truncated.slice(lastSpace) : ''
                                  return (
                                    <>
                                      {shown}
                                      <span>
                                        {lastWord}
                                        <button
                                          className="text-xs text-blue-600 underline ml-1"
                                          onClick={() => toggleDesc(event.id)}
                                        >
                                          View more
                                        </button>
                                      </span>
                                      ...
                                    </>
                                  )
                                })()}
                              </>
                            ) : (
                              <>
                                {event.desc}
                                {event.desc.length > 78 && (
                                  <button
                                    className="text-xs text-blue-600 underline ml-1"
                                    onClick={() => toggleDesc(event.id)}
                                  >
                                    View less
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </>
                      )}
                      <div className="mt-2 text-sm text-gray-600">
                        <div className="flex items-center mb-1">
                          <Clock className="w-4 h-4 mr-2 text-blue-400" />
                          <span>
                            {event.timeStart
                              ? event.timeEnd
                                ? `${event.timeStart} - ${event.timeEnd}`
                                : event.timeStart
                              : "No time set"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                          <span>{event.location ? event.location : "No location set"}</span>
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
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        className="text-blue-500 hover:text-blue-700 bg-blue-50 rounded-full p-1 transition"
                        onClick={() => handleEditEvent(event)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="text-red-400 hover:text-red-600 bg-red-50 rounded-full p-1 transition flex items-center justify-center"
                        onClick={() => handleDeleteEvent(event.id)}
                        disabled={deletingId === event.id}
                      >
                        {deletingId === event.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <h3 className="font-semibold text-blue-800 text-lg">{event.title}</h3>
                    {event.desc && (
                      <>
                        <div className="text-sm text-gray-500 mb-2 flex flex-wrap items-center">
                          {event.desc.length > 78 && !descExpanded[event.id] ? (
                            <>
                              {(() => {
                                const truncated = event.desc.slice(0, 78)
                                const lastSpace = truncated.lastIndexOf(' ')
                                const shown = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated
                                const lastWord = lastSpace > 0 ? truncated.slice(lastSpace) : ''
                                return (
                                  <>
                                    {shown}
                                    <span>
                                      {lastWord}
                                      <button
                                        className="text-xs text-blue-600 underline ml-1"
                                        onClick={() => toggleDesc(event.id)}
                                      >
                                        View more
                                      </button>
                                    </span>
                                    ...
                                  </>
                                )
                              })()}
                            </>
                          ) : (
                            <>
                              {event.desc}
                              {event.desc.length > 78 && (
                                <button
                                  className="text-xs text-blue-600 underline ml-1"
                                  onClick={() => toggleDesc(event.id)}
                                >
                                  View less
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </>
                    )}
                    <div className="mt-2 space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                        <span>{format(event.date, "MMMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                        <span>
                          {event.location
                            ? (
                              <Tooltip title={event.location} arrow>
                                <span>
                                  {event.location.length > 32
                                    ? event.location.slice(0, 32) + "..."
                                    : event.location}
                                </span>
                              </Tooltip>
                            )
                            : "No location set"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-blue-400" />
                        <span>
                          {event.timeStart
                            ? event.timeEnd
                              ? `${event.timeStart} - ${event.timeEnd}`
                              : event.timeStart
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
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 shadow">
                  <Calendar className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="font-semibold text-blue-800 mb-1 text-lg">No events scheduled</h3>
                <p className="text-sm text-gray-500">There are no events scheduled for this month.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}