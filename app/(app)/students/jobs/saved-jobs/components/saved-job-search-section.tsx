"use client"

import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import type React from "react"
import { useState } from "react"

interface SavedJobsSearchSectionProps {
  title?: string
  description?: string
  placeholderText?: string
  icon?: React.ReactNode
  onSearch?: (query: string) => void
  isCollapsed?: boolean
}

export default function SavedJobsSearchSection({
  title = "Your Saved Jobs",
  description = "Manage and review all the job opportunities you've bookmarked. Keep track of positions that caught your interest and take action when you're ready!",
  icon,
  placeholderText = "Search saved jobs...",
  onSearch,
  isCollapsed = false,
}: SavedJobsSearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="sticky top-0 z-30 bg-gradient-to-br from-blue-50 to-sky-100">
      <motion.div
        className="mt-3 bg-gradient-to-r from-blue-700 to-blue-400 rounded-2xl shadow-xl text-white mb-4 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          padding: isCollapsed ? "8px 16px" : "48px 16px",
          transition: "padding 0.3s ease",
        }}
      >
        {icon && <div className="absolute top-4 left-4 z-20 flex items-center">{icon}</div>}
        <motion.div
          style={{
            height: isCollapsed ? 0 : "auto",
            opacity: isCollapsed ? 0 : 1,
            overflow: "hidden",
            marginBottom: isCollapsed ? 0 : 16,
            transition: "height 0.5s ease, opacity 0.5s ease, margin-bottom 0.5s ease",
          }}
        >
          <motion.h2
            className="text-2xl font-bold relative z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {title}
          </motion.h2>

          <motion.p
            className="text-blue-100 text-sm relative z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {description}
          </motion.p>
        </motion.div>

        <motion.form
          className="bg-white rounded-xl p-2 flex flex-col sm:flex-row relative z-10 items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          onSubmit={handleSearch}
        >
          <Input
            type="text"
            placeholder={placeholderText}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 text-black focus-visible:ring-0 focus-visible:ring-offset-0 mb-1 sm:mb-0 flex-1"
          />
          <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto" type="submit">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </motion.form>
      </motion.div>
    </div>
  )
}
    