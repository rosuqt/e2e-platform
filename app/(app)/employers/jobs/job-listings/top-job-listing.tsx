"use client"

import { motion } from "framer-motion"
import { Trophy, Calendar, Eye, FileText, BarChart3 } from "lucide-react"
import { useState, useEffect } from "react"

interface TopPerformingJob {
  title: string;
  applicants: number;
  views: number;
  posted: string;
  engagement: string;
}

export default function TopJobListing() {
  const [topJob, setTopJob] = useState<TopPerformingJob | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/employers/analytics")
      .then(res => res.json())
      .then(data => {
        if (data.topPerformingJob) {
          setTopJob(data.topPerformingJob);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <motion.div
        className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg mb-6 p-6 border-2 border-blue-200 relative overflow-hidden h-[300px] flex items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </motion.div>
    );
  }

  if (!topJob || topJob.applicants === 0) {
    return (
      <motion.div
        className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg mb-6 p-6 border-2 border-blue-200 relative overflow-hidden h-[300px] flex items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="text-center text-gray-500">
          <Trophy className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No top performing job yet</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg mb-6 p-6 border-2 border-blue-200 relative overflow-hidden h-[300px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Trophy badge */}
      <div className="absolute -right-1 -top-1">
        <motion.div
          className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-gold-900 p-3 rounded-bl-2xl rounded-tr-xl shadow-md flex items-center gap-1.5" 
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
          {topJob.title}
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
              Posted: <span className="text-blue-700">{topJob.posted}</span>
            </p>
          </motion.div>

          <motion.div
            className="flex items-center gap-2 bg-white p-2.5 rounded-xl shadow-sm"
            whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <Eye className="h-4 w-4 text-blue-600" />
            <p className="text-sm font-medium text-gray-700">
              Views: <span className="text-blue-700">{topJob.views.toLocaleString()}</span>
            </p>
          </motion.div>

          <motion.div
            className="flex items-center gap-2 bg-white p-2.5 rounded-xl shadow-sm"
            whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <FileText className="h-4 w-4 text-blue-600" />
            <p className="text-sm font-medium text-gray-700">
              Applications: <span className="text-blue-700">{topJob.applicants}</span>
            </p>
          </motion.div>

          <motion.div
            className="flex items-center gap-2 bg-white p-2.5 rounded-xl shadow-sm"
            whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <p className="text-sm font-medium text-gray-700">
              Engagement: <span className="text-blue-700">{topJob.engagement}</span>
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
