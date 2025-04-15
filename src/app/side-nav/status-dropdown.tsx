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
        return "bg-green-400"
      case "idle":
        return "bg-orange-400"
      case "unavailable":
        return "bg-red-400"
      default:
        return "bg-gray-500"
    }
  }

  const getTextColor = (status: Status) => {
    switch (status) {
      case "active":
        return "text-green-800";
      case "idle":
        return "text-orange-800";
      case "unavailable":
        return "text-red-800";
      default:
        return "text-gray-800";
    }
  };

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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center rounded-full transition-all",
          getStatusColor(status),
          "w-full px-3 py-0.5   ",
          getTextColor(status)
        )}
      >
        <StatusIcon status={status} className={getTextColor(status)} />
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={cn("ml-2 flex-1 text-left", getTextColor(status))}
            >
              {statusOptions.find((option) => option.value === status)?.label}
            </motion.div>
          )}
        </AnimatePresence>
        {expanded && <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "transform rotate-180")} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              "absolute z-20 mt-2 rounded-lg shadow-lg overflow-hidden",
              "w-full"
            )}
          >
            <div className="bg-white text-gray-800 py-1">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onStatusChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center w-full px-4 py-1 text-left hover:bg-gray-100",
                    status === option.value && "bg-gray-100",
                    getTextColor(option.value)
                  )}
                >
                  <StatusIcon status={option.value} className={getTextColor(option.value)} />
                  <span className={cn("ml-2", getTextColor(option.value))}>{option.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
