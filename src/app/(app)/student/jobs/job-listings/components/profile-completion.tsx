"use client"

import { motion } from "framer-motion"
import LinearProgress from "@mui/material/LinearProgress"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Image from "next/image"

export default function ProfileCompletion() {
  const completionPercentage = 75

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-4 mb-6 border-2 border-blue-200 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-300"
          whileHover={{ scale: 1.1 }}
        >
          <Image
            src="/placeholder.svg?height=48&width=48"
            alt="Profile"
            width={48}
            height={48}
            className="object-cover"
          />
        </motion.div>
        <div>
          <h3 className="font-medium text-blue-700">Kemly Rose</h3>
          <p className="text-sm text-blue-500">BS: Information Technology</p>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-sm font-medium text-blue-700">Profile Completion</h4>
          <span className="text-sm font-medium text-blue-700">{completionPercentage}%</span>
        </div>
        <LinearProgress
          variant="determinate"
          value={completionPercentage}
          className="h-2"
        />
      </div>

      <div className="space-y-2 mt-4">
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-gray-600">Basic information</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-gray-600">Education details</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="h-4 w-4 text-gray-300" />
          <span className="text-gray-400">Upload resume</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="h-4 w-4 text-gray-300" />
          <span className="text-gray-400">Complete skills assessment</span>
        </div>
      </div>

      <div className="mt-4">
        <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50">
          Complete Profile
        </Button>
      </div>
    </motion.div>
  )
}
