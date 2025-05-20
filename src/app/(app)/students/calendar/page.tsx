"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight, Cloud } from "lucide-react"
import { motion } from "framer-motion"
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

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  const generateEvents = (currentDate: Date): {
    id: number;
    title: string;
    date: Date;
    location: string;
    timeStart: string;
    timeEnd: string;
  }[] => {
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
    const events: {
      id: number;
      title: string;
      date: Date;
      location: string;
      timeStart: string;
      timeEnd: string;
    }[] = [];
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    daysInMonth.forEach((day, index) => {
      if (index % 3 === 0) {
        events.push({
          id: index + 1,
          title: sampleTitles[index % sampleTitles.length],
          date: day,
          location: sampleLocations[index % sampleLocations.length],
          timeStart: "10:00 AM",
          timeEnd: "11:00 AM",
        });
      }
    });

    return events;
  };

  const events = generateEvents(currentDate);

  const selectedDateEvents = events.filter((event) => isSameDay(event.date, selectedDate))

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
      <div className="max-w-6xl mx-auto p-4 md:p-8 pt-[6rem]">
        <div className="mt-20 z-50 bg-gradient-to-br from-blue-50 to-sky-100">
          <motion.h1
            className="text-3xl font-bold text-blue-600 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Calendar
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - All Events for the Month */}
          <motion.div
            className="space-y-4 sticky top-[10rem] z-40 bg-gradient-to-br from-blue-50 to-sky-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-blue-500 mr-2" />
              <h2 className="text-lg font-semibold text-blue-700">{format(currentDate, "MMMM yyyy")} Events</h2>
            </div>

            {events.length > 0 ? (
              events.map((event) => (
                <motion.div
                  key={event.id}
                  className="bg-white top-20 rounded-xl shadow-md p-4 border border-blue-100 hover:shadow-lg transition-shadow"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
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

          {/* Right Column - Calendar */}
          <motion.div
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-xl overflow-hidden sticky top-[6rem] z-40 h-fit"
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
                    >
                      {format(day, "d")}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            <div className="bg-white p-6 flex flex-col space-y-4">
              {selectedDateEvents.length === 0 ? (
                <div className="text-center">
                  <p className="text-gray-500 mb-20">No events for this day</p>
                  <Cloud className="w-12 h-12 text-gray-300 mx-auto" />
                </div>
              ) : (
                selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-blue-50 rounded-lg p-4 shadow-md border border-blue-100"
                  >
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
  )
}
