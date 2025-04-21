"use client"
import type React from "react"
import { Bookmark, Clock, Briefcase, DollarSign, CheckCircle, Star, MapPin } from "lucide-react"
import { motion } from "framer-motion"

interface Job {
  id: number
  title: string
  company: string
  logo: string
  location: string
  reviews: string
  closing: string
  match: string
  salary: string
  posted: string
  type: string
}

const jobs: Job[] = [
  {
    id: 0,
    title: "Software Engineer",
    company: "Alibaba Group",
    logo: "A",
    location: "San Francisco, CA",
    reviews: "4.2/5 (12 reviews)",
    closing: "Closing in 1 month",
    match: "98%",
    salary: "800 / a day",
    posted: "1hr ago",
    type: "On-the-Job Training",
  },
  {
    id: 1,
    title: "Frontend Developer",
    company: "Meta",
    logo: "M",
    location: "Remote",
    reviews: "4.5/5 (24 reviews)",
    closing: "Closing in 2 weeks",
    match: "95%",
    salary: "900 / a day",
    posted: "3hr ago",
    type: "Full-time",
  },
  {
    id: 2,
    title: "Product Manager",
    company: "Google",
    logo: "G",
    location: "Mountain View, CA",
    reviews: "4.7/5 (18 reviews)",
    closing: "Closing in 1 week",
    match: "92%",
    salary: "950 / a day",
    posted: "5hr ago",
    type: "Contract",
  },
  {
    id: 3,
    title: "Data Analyst",
    company: "Apple",
    logo: "A",
    location: "Cupertino, CA",
    reviews: "4.3/5 (15 reviews)",
    closing: "Closing in 3 days",
    match: "89%",
    salary: "850 / a day",
    posted: "7hr ago",
    type: "Part-time",
  },
]

interface JobCardsProps {
  onSelectJob?: (id: number) => void
  selectedJob?: number | null
}

const JobCards: React.FC<JobCardsProps> = ({ onSelectJob, selectedJob }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      {jobs.map((job) => (
        <motion.div
          key={job.id}
          className={`bg-white rounded-3xl border-2 ${
            selectedJob === job.id ? "border-blue-300 ring-4 ring-blue-100" : "border-blue-200 hover:border-blue-300"
          } p-6 relative shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden`}
          onClick={() => onSelectJob && onSelectJob(job.id)}
          variants={item}
          whileHover={{
            y: -8,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-100 rounded-full opacity-50"></div>
          <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-blue-100 rounded-full opacity-50"></div>

          <motion.button
            className="absolute top-4 right-4 text-blue-400 hover:text-blue-600 transition-colors duration-200 z-10"
            whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
            whileTap={{ scale: 0.9 }}
          >
            <Bookmark size={24} />
          </motion.button>

          <div className="flex gap-4 relative z-10">
            <motion.div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center text-white font-bold text-xl shadow-lg`}
              whileHover={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5 }}
            >
              {job.logo}
            </motion.div>
            <div>
              <h3 className="font-bold text-xl text-blue-800">{job.title}</h3>
              <p className="text-sm text-blue-600">{job.company}</p>
              <div className="flex items-center mt-1">
                <div className="flex">
                  {[1, 2, 3, 4].map((star) => (
                    <Star key={star} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                  <Star size={14} className="text-yellow-400" fill={job.id === 2 ? "rgb(250 204 21)" : "transparent"} />
                </div>
                <span className="text-xs ml-1 text-blue-500">{job.reviews}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center mt-3 text-xs text-blue-500 relative z-10">
            <MapPin size={14} className="mr-1" />
            <span>{job.location}</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 relative z-10">
            <motion.div
              className="flex items-center text-sm bg-blue-50 p-3 rounded-xl border border-blue-100"
              whileHover={{ y: -3, backgroundColor: "rgb(219 234 254)" }}
            >
              <Clock size={16} className="text-blue-500 mr-2 flex-shrink-0" />
              <span className="text-blue-700 text-xs">{job.closing}</span>
            </motion.div>
            <motion.div
              className="flex items-center text-sm bg-blue-50 p-3 rounded-xl border border-blue-100"
              whileHover={{ y: -3, backgroundColor: "rgb(219 234 254)" }}
            >
              <Briefcase size={16} className="text-blue-500 mr-2 flex-shrink-0" />
              <span className="text-blue-700 text-xs">{job.type}</span>
            </motion.div>
            <motion.div
              className="flex items-center text-sm bg-blue-50 p-3 rounded-xl border border-blue-100 col-span-2"
              whileHover={{ y: -3, backgroundColor: "rgb(219 234 254)" }}
            >
              <DollarSign size={16} className="text-blue-500 mr-2 flex-shrink-0" />
              <span className="text-blue-700 text-xs">{job.salary}</span>
            </motion.div>
          </div>

          <div className="mt-4 relative z-10">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-xl py-3 px-4 flex items-center justify-center shadow-md"
              whileHover={{
                scale: 1.03,
                boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <CheckCircle size={18} className="mr-2 flex-shrink-0" />
              </motion.div>
              <span className="text-sm font-medium">You are {job.match} matched to this job</span>
            </motion.div>
          </div>

          <div className="mt-3 text-right text-xs text-blue-400 relative z-10">Posted {job.posted}</div>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default JobCards
