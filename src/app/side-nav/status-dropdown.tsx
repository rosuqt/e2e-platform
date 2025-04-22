"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "../lib/utils"
import { StatusIcon } from "./status-icon"

type Status = "active" | "idle" | "unavailable"

interface StatusDropdownProps {
  status: Status
  onStatusChange: (status: Status) => void
  expanded: boolean
}

export function StatusDropdown({ status, onStatusChange, expanded }: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const statusOptions: { value: Status; label: string }[] = [
    { value: "active", label: "Active" },
    { value: "idle", label: "Idle" },
    { value: "unavailable", label: "Unavailable" },
  ]

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "active":
        return "from-green-400 to-green-500"
      case "idle":
        return "from-orange-400 to-orange-500"
      case "unavailable":
        return "from-red-400 to-red-500"
      default:
        return "from-gray-400 to-gray-500"
    }
  }

  const getTextColor = (status: Status) => {
    switch (status) {
      case "active":
        return "text-green-800"
      case "idle":
        return "text-orange-800"
      case "unavailable":
        return "text-red-800"
      default:
        return "text-gray-800"
    }
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div ref={dropdownRef} className="relative ml-12 w-[170px]">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center rounded-full transition-all bg-gradient-to-r shadow-md",
          getStatusColor(status),
          "w-full px-3 py-1.5",
          "text-white",
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        layout
      >
        <StatusIcon status={status} className="text-white" />
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="ml-2 flex-1 text-left text-white"
            >
              {statusOptions.find((option) => option.value === status)?.label}
            </motion.div>
          )}
        </AnimatePresence>
        {expanded && (
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown className="w-4 h-4 text-white" />
          </motion.div>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 mt-2 rounded-xl shadow-xl overflow-hidden w-full backdrop-blur-sm"
            style={{
              transformOrigin: "top center",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="bg-white/90 backdrop-blur-sm text-gray-800 py-1 rounded-xl">
              {statusOptions.map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => {
                    onStatusChange(option.value)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 transition-all",
                    status === option.value ? "bg-gray-100" : "",
                  )}
                  whileHover={{
                    backgroundColor: "rgba(243, 244, 246, 0.8)",
                    x: 4,
                  }}
                >
                  <StatusIcon status={option.value} className={getTextColor(option.value)} />
                  <span className={cn("ml-2", getTextColor(option.value))}>{option.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
