"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, MapPin, Clock, Building } from "lucide-react"

type JobProps = {
  job: {
    id: number
    title: string
    department: string
    location: string
    type: string
    salary: string
    posted: string
    description: string
  }
  onClick: () => void
}

export default function JobCard({ job, onClick }: JobProps) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md cursor-pointer"
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{job.title}</h3>

            <div className="mt-3 space-y-2">
              <div className="flex items-center text-gray-600">
                <Building className="h-4 w-4 mr-2 text-blue-700" />
                <span>{job.department}</span>
              </div>

              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2 text-blue-700" />
                <span>{job.location}</span>
              </div>

              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2 text-blue-700" />
                <span>Posted {job.posted}</span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
              </span>
              <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {(() => {
                  if (job.salary && job.salary.includes(",")) {
                    const [min, max] = job.salary.split(",").map(s => s.trim())
                    return `₱${min} - ₱${max}`
                  }
                  if (job.salary) return `₱${job.salary}`
                  return ""
                })()}
              </span>
            </div>

            <p className="mt-3 text-gray-600 line-clamp-2 text-sm">{job.description}</p>

            <div className="mt-4 text-blue-700 font-medium flex items-center">
              View Details
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
