"use client"

import { motion } from "framer-motion"
import { Briefcase, Home } from "lucide-react"
import Link from "next/link"

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200 sticky top-0 z-40"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900">JobFeed</h1>
            <p className="text-xs text-gray-500">Community Job Board</p>
          </div>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/community"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            <Home className="w-4 h-4" />
            Community
          </Link>
        </nav>
      </div>
    </motion.header>
  )
}
