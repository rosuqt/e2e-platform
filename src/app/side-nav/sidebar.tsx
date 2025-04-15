"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Calendar, BookOpen, Settings, MessageSquare, Bell } from "lucide-react"
import { cn } from "../lib/utils"
import { StatusDropdown } from "./status-dropdown"
import { StatusIcon } from "./status-icon"

type Status = "active" | "idle" | "unavailable"

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true)
  const [status, setStatus] = useState<Status>("active")
  const [activeItem, setActiveItem] = useState<number | null>(null)
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  const toggleSidebar = () => {
    setExpanded(!expanded)
  }

  const menuItems = [
    { icon: Home, text: "Dashboard" },
    { icon: Calendar, text: "Schedule" },
    { icon: BookOpen, text: "Courses" },
    { icon: MessageSquare, text: "Messages" },
    { icon: Bell, text: "Notifications" },
    { icon: Settings, text: "Settings" },
  ]

  return (
    <div className="flex h-screen">
      <motion.div
        className="bg-[#1551A9] text-white flex flex-col h-full shadow-lg relative overflow-hidden overflow-x-hidden"
        animate={{
          width: expanded ? 280 : 80,
        }}
        transition={{
          duration: 0.5,
          ease: [0.19, 1, 0.22, 1],
        }}
      >
        {/* Fixed position burger icon */}
        <div className="absolute top-6 right-2 z-10">
          <div className="relative w-6 h-6">
            <button
              onClick={toggleSidebar}
              className="text-white focus:outline-none absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                className="relative w-6 h-6"
                initial={false}
                animate={{
                  rotate: expanded ? 0 : 0,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {/* Top line */}
                <motion.div
                  className="absolute w-5 h-0.5 bg-white"
                  initial={false}
                  animate={{
                    y: expanded ? 0 : -6.5,
                    rotate: expanded ? -45 : 0, 
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
                {/* Middle line */}
                <motion.div
                  className="absolute w-5 h-0.5 bg-white"
                  initial={false}
                  animate={{
                    opacity: expanded ? 0 : 1,
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
                {/* Bottom line */}
                <motion.div
                  className="absolute w-5 h-0.5 bg-white"
                  initial={false}
                  animate={{
                    y: expanded ? 0 : 6.5,
                    rotate: expanded ? 45 : 0,
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </motion.div>
            </button>
          </div>
        </div>

        {/* Fixed height header section */}
        <div className="h-14"></div>

        {/* Profile section with fixed height */}
        <div className="flex items-center px-4 py-3 h-[72px] mt-2">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
              KR
            </div>
            <div className="absolute top-0 right-0">
              <StatusIcon status={status} size="sm" />
            </div>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="ml-3 overflow-hidden"
              >
                <div className="font-medium">Kemly Rose</div>
                <div className="text-xs text-white/70">BS-Information Technology</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status dropdown with fixed height container */}
        <div className="h-[42px] px-4 flex items-center">
          {expanded && <StatusDropdown status={status} onStatusChange={setStatus} expanded={expanded} />}
        </div>

        {/* Navigation with fixed top margin */}
        <div
          className="mt-12 flex-1 overflow-y-auto relative z-10 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent"
        >
          <ul className="space-y-4">
            {menuItems.map((item, index) => (
              <li key={index} className="relative px-2 overflow-hidden">
                <a
                  href="#"
                  onClick={() => setActiveItem(index)}
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={cn(
                    "flex items-center h-[46px] transition-all relative z-10",
                    "pl-6",
                    expanded ? "pr-4" : "pr-0",
                    hoveredItem === index && activeItem !== index ? "scale-105" : ""
                  )}
                >
                  {/* Background highlight for selected item */}
                  {activeItem === index && (
                    <motion.div
                      className="absolute inset-y-0 right-0 w-full -mr-2 bg-white -z-10 rounded-l-full overflow-hidden"
                      initial={{ width: "0%", opacity: 0 }}
                      animate={{ width: "100%", opacity: 1 }}
                      exit={{ width: "0%", opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        mass: 1,
                      }}
                    />
                  )}

                  <item.icon
                    className={cn(
                      "w-6 h-6 min-w-6 transition-transform",
                      hoveredItem === index ? "scale-105" : "",
                      activeItem === index ? "text-[#1551A9]" : ""
                    )}
                  />
                  <AnimatePresence>
                    {expanded && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className={cn(
                          "ml-3 whitespace-nowrap transition-transform",
                          hoveredItem === index ? "scale-105" : "",
                          activeItem === index ? "text-[#1551A9]" : ""
                        )}
                      >
                        {item.text}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  )
}
