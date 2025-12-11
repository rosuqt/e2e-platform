"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"
import { IoSettingsSharp } from "react-icons/io5"

type TabItem = {
  id: string
  icon: LucideIcon
  label: string
  description: string
}

interface TabListProps {
  items: TabItem[]
  defaultTab?: string
  onTabChange?: (id: string) => void
}

export function TabList({ items, defaultTab, onTabChange }: TabListProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || items[0]?.id)

  const handleTabChange = (id: string) => {
    setActiveTab(id)
    if (onTabChange) {
      onTabChange(id)
    }
  }

  return (
    <div className="w-full max-w-xs bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500/50 rounded-full p-2">
           <IoSettingsSharp className="text-blue-700" size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account all in one place.
        </p>
      </div>
      <div className="py-2">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              className={cn(
                "w-full flex items-start p-4 text-left relative transition-colors",
                "hover:bg-blue-50 focus:outline-none focus:bg-blue-50",
                isActive && "bg-white",
              )}
              onClick={() => handleTabChange(item.id)}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full mr-3 shrink-0",
                  isActive ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500",
                )}
              >
                <Icon size={18} />
              </div>
              <div>
                <div className={cn("font-medium", isActive ? "text-blue-600" : "text-gray-700")}>{item.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
