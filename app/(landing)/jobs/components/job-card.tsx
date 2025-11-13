"use client"

import { motion } from "framer-motion"
import { BookOpen, Clock, Users, Award, Bookmark } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { IoIosRocket } from "react-icons/io"
import { CgSmile } from "react-icons/cg"
import { useState } from "react"
import CtaModal from "./cta-modal"

type JobData = {
  id: number
  course: string
  job: string
  company: string
  title: string
  description: string
  match: number
}

function JobCard({
  id,
  isSelected,
  onSelect,
  jobData,
}: {
  id: number
  isSelected: boolean
  onSelect: () => void
  jobData?: JobData
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const companies = ["Fb Mark-it Place", "Meta", "Google", "Amazon", "Microsoft"]
  const titles = ["UI/UX Designer", "Frontend Developer", "Product Manager", "Software Engineer", "Data Analyst"]
  const descriptions = [
    "Seeking a creative UI/UX Designer to craft intuitive and visually engaging user experiences.",
    "Looking for a talented Frontend Developer to build responsive web applications.",
    "Hiring a Product Manager to lead our product development initiatives.",
    "Join our engineering team to build scalable software solutions.",
    "Help us analyze data and provide insights to drive business decisions.",
  ]
  const matchPercentages = [93, 87, 76, 95, 82]

  const handleQuickApply = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsModalOpen(true)
  }

  return (
    <>
      <motion.div
        className={`bg-white rounded-lg shadow-sm p-5 border-l-4 ${
          isSelected ? "border-l-blue-500 border-blue-200" : "border-l-transparent border-gray-200"
        } relative overflow-hidden`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: id * 0.1 }}
        whileHover={{
          y: -2,
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          borderColor: "rgba(96, 165, 250, 0.8)",
        }}
      >
        <div className="flex justify-between">
          <div className="flex gap-3">
            <motion.div
              className="w-12 h-12 bg-black rounded-full flex items-center justify-center overflow-hidden text-white"
              whileHover={{ scale: 1.1 }}
            >
              {id === 0 ? (
                <div className="text-center text-xs font-bold">{jobData?.company?.slice(0,7) || "Mark.it"}</div>
              ) : (
                <Image
                  src={`/placeholder.svg?height=48&width=48&text=${(jobData?.company || companies[id % companies.length]).charAt(0)}`}
                  alt="Company logo"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              )}
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg text-gray-800">{jobData?.title || titles[id % titles.length]}</h3>
                {id === 0 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-blue-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <p className="text-sm text-gray-500">{jobData?.company || companies[id % companies.length]}</p>
            </div>
          </div>
          <motion.button
            className={`text-gray-400 hover:text-blue-500 transition-colors ${isSelected ? "text-blue-500" : ""}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <Bookmark size={20} className={isSelected ? "fill-blue-500" : ""} />
          </motion.button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">React</Badge>
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none">Node.js</Badge>
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-none">UI/UX</Badge>
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-none">Python</Badge>
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none">Java</Badge>
        </div>

        {(jobData?.description || descriptions[id % descriptions.length]) && (
          <p className="text-gray-600 text-sm mt-3">{jobData?.description || descriptions[id % descriptions.length]}</p>
        )}

        {(jobData?.match || matchPercentages[id % matchPercentages.length]) && (
          <div className="bg-green-100 text-green-700 text-sm font-semibold mt-4 px-4 py-2 rounded-lg flex items-center gap-2">
            <CgSmile className="w-5 h-5" />
            <span>
              You are {jobData?.match || matchPercentages[id % matchPercentages.length]}% match to this job.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            <span>3 days left</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
            <span>Full-time</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-gray-400" />
            <span>5 vacancies left</span>
          </div>
          <div className="flex items-center">
            <Award className="h-4 w-4 mr-2 text-gray-400" />
            <span>Muntinlupa</span>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <motion.button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium shadow-sm flex-1 sm:flex-none flex items-center justify-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.stopPropagation()
                onSelect()
              }}
            >
              View Details
            </motion.button>
            <motion.button
              className="bg-white hover:bg-blue-50 text-blue-600 px-6 py-2 rounded-full font-medium shadow-sm border border-blue-600 flex-1 sm:flex-none flex items-center justify-center gap-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleQuickApply}
            >
              <IoIosRocket className="w-4 h-4" />
              Quick Apply
            </motion.button>
          </div>
        </div>
      </motion.div>
      <CtaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

export default JobCard
