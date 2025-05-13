"use client"

import { motion } from "framer-motion"
import { Trophy, Calendar, Eye, FileText, BarChart3 } from "lucide-react"

export default function TopJobListing() {
  return (
    <motion.div
      className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg mb-6 p-6 border-2 border-blue-200 relative overflow-hidden h-[350px]" // Reduced height
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Trophy badge */}
      <div className="absolute -right-1 -top-1">
        <motion.div
          className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-gold-900 p-3 rounded-bl-2xl rounded-tr-xl shadow-md flex items-center gap-1.5" // Updated colors
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          whileHover={{ scale: 1.05 }}
        >
          <Trophy className="h-4 w-4 text-white" />
          <span className="text-xs font-bold text-white">TOP PICK</span>
        </motion.div>
      </div>

      {/* Header */}
      <div className="mb-5 mt-5">
        <motion.div
          className="flex items-center gap-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
            Top Performing Job
          </h3>
        </motion.div>
      </div>

      {/* Job details */}
      <div className="space-y-4 mt-5">
        <motion.p
          className="font-bold text-lg text-blue-700" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Senior Frontend Developer
        </motion.p>

        {/* Metrics */}
        <motion.div
          className="grid grid-cols-2 gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div
            className="flex items-center gap-2 bg-white p-2.5 rounded-xl shadow-sm"
            whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <Calendar className="h-4 w-4 text-blue-600" />
            <p className="text-sm font-medium text-gray-700">
              Posted: <span className="text-blue-700">Apr 25</span>
            </p>
          </motion.div>

          <motion.div
            className="flex items-center gap-2 bg-white p-2.5 rounded-xl shadow-sm"
            whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <Eye className="h-4 w-4 text-blue-600" />
            <p className="text-sm font-medium text-gray-700">
              Views: <span className="text-blue-700">1,284</span>
            </p>
          </motion.div>

          <motion.div
            className="flex items-center gap-2 bg-white p-2.5 rounded-xl shadow-sm"
            whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <FileText className="h-4 w-4 text-blue-600" />
            <p className="text-sm font-medium text-gray-700">
              Applications: <span className="text-blue-700">67</span>
            </p>
          </motion.div>

          <motion.div
            className="flex items-center gap-2 bg-white p-2.5 rounded-xl shadow-sm"
            whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <p className="text-sm font-medium text-gray-700">
              Engagement: <span className="text-blue-700">92%</span>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* CTA Button */}
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <motion.button
          className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View Job
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
