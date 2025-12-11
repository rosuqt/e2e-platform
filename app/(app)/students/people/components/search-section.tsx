"use client"

import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import React, { useState } from "react"

interface SearchSectionProps {
  title?: string
  description?: string
  placeholderFirstName?: string
  placeholderLastName?: string
  placeholder?: string
  icon?: React.ReactNode
  onSearch?: (params: { firstName: string; lastName: string }) => void
  bgColor?: string
}

export default function SearchSection({
  title = "Find your perfect job",
  description = "Explore job listings tailored to your skills and interests. Find the right opportunity and take the next step in your career!",
  icon,
  placeholderFirstName="First name",
  placeholderLastName="Last name",
  placeholder = "Search by name",
  onSearch,
  bgColor = "bg-gradient-to-r from-blue-700 to-purple-500",
}: SearchSectionProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  const handleSearch = () => {
    if (onSearch) {
      onSearch({ firstName, lastName })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <motion.div
      className={`mt-3 ${bgColor} rounded-2xl shadow-xl text-white mb-4 relative overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        padding: "48px 16px",
        transition: "padding 0.3s ease",
      }}
    >
      {icon && (
        <div className="absolute top-4 left-4 z-20 flex items-center">
          {icon}
        </div>
      )}
      <motion.div
        style={{
          height: "auto",
          opacity: 1,
          overflow: "visible",
          marginBottom: 16,
          transition: "none",
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

      <motion.div
        className="bg-transparent p-2 flex flex-col sm:flex-row relative z-10 items-center justify-between"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="flex w-full items-center bg-white rounded-full px-2 py-1 gap-0 shadow-sm">
          <Input
            type="text"
            placeholder={placeholderFirstName || placeholder}
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 rounded-none rounded-l-full text-black focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 bg-transparent"
          />
          <div className="w-px h-8 bg-gray-300 mx-2" />
          <Input
            type="text"
            placeholder={placeholderLastName || placeholder}
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 rounded-none rounded-r-full text-black focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 bg-transparent"
          />
          <button
            type="button"
            className="ml-2 text-gray-400 hover:text-gray-600 p-2 rounded-full"
            aria-label="Clear search"
            onClick={() => {
              setFirstName("")
              setLastName("")
            }}
            style={{ display: firstName || lastName ? "inline-flex" : "none" }}
          >
            <X className="h-4 w-4" />
          </button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 rounded-full ml-2 flex items-center justify-center px-6"
            onClick={handleSearch}
            type="button"
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}