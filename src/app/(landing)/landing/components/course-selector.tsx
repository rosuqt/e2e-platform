"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Search } from "lucide-react"


export default function CourseSelector() {
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [selectedJob, setSelectedJob] = useState<string>("")
  const [isOpenCourse, setIsOpenCourse] = useState(false)
  const [isOpenJob, setIsOpenJob] = useState(false)

  const courseOptions: string[] = ["BSIT", "BSBA", "BSTM", "BSHM"]
  const jobOptions: { [key: string]: string[] } = {
    BSIT: ["Web Developer", "Software Engineer", "System Analyst", "UI/UX Designer", "Cybersecurity Analyst"],
    BSBA: ["Marketing Manager", "Financial Analyst", "HR Specialist", "Business Consultant", "Entrepreneur"],
    BSTM: ["Tour Guide", "Travel Agent", "Event Planner", "Airline Customer Service", "Resort Manager"],
    BSHM: ["Hotel Manager", "Restaurant Manager", "Chef", "Food and Beverage Director", "Catering Manager"],
  }

  return (
    <div className="mt-8 flex flex-col sm:flex-row gap-4">
      {/* Course Dropdown */}
      <div className="relative z-20">
        <div className="text-sm text-blue-100 mb-1">I&apos;m studying</div>
        <div
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 w-full sm:w-[180px] flex items-center justify-between cursor-pointer"
          onClick={() => setIsOpenCourse(!isOpenCourse)}
        >
          <span className={selectedCourse ? "text-white" : "text-blue-200"}>{selectedCourse || "Select course"}</span>
          <ChevronDown className="w-4 h-4 text-blue-200" />
        </div>

        <AnimatePresence>
          {isOpenCourse && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute mt-1 w-full bg-white rounded-lg shadow-lg max-h-[200px] overflow-y-auto z-30"
            >
              {courseOptions.map((course) => (
                <div
                  key={course}
                  className="p-3 hover:bg-blue-50 cursor-pointer"
                  onClick={() => {
                    setSelectedCourse(course)
                    setIsOpenCourse(false)
                    setSelectedJob("")
                  }}
                >
                  {course}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Job Dropdown */}
      <div className="relative z-10">
        <div className="text-sm text-blue-100 mb-1">I&apos;m looking for</div>
        <div
          className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 w-full sm:w-[250px] flex items-center justify-between ${
            selectedCourse ? "cursor-pointer" : "opacity-70"
          }`}
          onClick={() => {
            if (selectedCourse) {
              setIsOpenJob(!isOpenJob)
            }
          }}
        >
          <span className={selectedJob ? "text-white" : "text-blue-200"}>
            {selectedJob || (selectedCourse ? `e.g. ${jobOptions[selectedCourse]?.[0]}` : "Select course first")}
          </span>
          <ChevronDown className="w-4 h-4 text-blue-200" />
        </div>

        <AnimatePresence>
          {isOpenJob && selectedCourse && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute mt-1 w-full bg-white rounded-lg shadow-lg max-h-[200px] overflow-y-auto"
            >
              {jobOptions[selectedCourse]?.map((job) => (
                <div
                  key={job}
                  className="p-3 hover:bg-blue-50 cursor-pointer"
                  onClick={() => {
                    setSelectedJob(job)
                    setIsOpenJob(false)
                  }}
                >
                  {job}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search Button */}
      <motion.button
        className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-medium rounded-lg p-3 flex items-center justify-center gap-2 mt-auto"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Search className="w-4 h-4" />
        <span>Find Jobs</span>
      </motion.button>
    </div>
  )
}
