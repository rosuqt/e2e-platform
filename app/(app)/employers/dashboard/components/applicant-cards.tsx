"use client"
import type React from "react"
import { Bookmark, Clock, Briefcase, CheckCircle, MapPin, Mail, Phone } from "lucide-react"
import { motion } from "framer-motion"

interface Applicant {
  id: number
  name: string
  position: string
  photo: string
  location: string
  experience: string
  appliedDate: string
  match: string
  email: string
  phone: string
  status: "new" | "reviewed" | "interview" | "offer"
}

const applicants: Applicant[] = [
  {
    id: 0,
    name: "Sarah Johnson",
    position: "Software Engineer",
    photo: "SJ",
    location: "San Francisco, CA",
    experience: "5 years",
    appliedDate: "Today",
    match: "98%",
    email: "sarah.j@example.com",
    phone: "(123) 456-7890",
    status: "new",
  },
  {
    id: 1,
    name: "Michael Chen",
    position: "Frontend Developer",
    photo: "MC",
    location: "Remote",
    experience: "3 years",
    appliedDate: "Yesterday",
    match: "95%",
    email: "michael.c@example.com",
    phone: "(234) 567-8901",
    status: "reviewed",
  },
  {
    id: 2,
    name: "Emily Rodriguez",
    position: "Product Manager",
    photo: "ER",
    location: "New York, NY",
    experience: "7 years",
    appliedDate: "2 days ago",
    match: "92%",
    email: "emily.r@example.com",
    phone: "(345) 678-9012",
    status: "interview",
  },
  {
    id: 3,
    name: "David Kim",
    position: "Data Analyst",
    photo: "DK",
    location: "Chicago, IL",
    experience: "4 years",
    appliedDate: "3 days ago",
    match: "89%",
    email: "david.k@example.com",
    phone: "(456) 789-0123",
    status: "offer",
  },
]

interface ApplicantCardsProps {
  onSelectApplicant?: (id: number) => void
  selectedApplicant?: number | null
}

const ApplicantCards: React.FC<ApplicantCardsProps> = ({ onSelectApplicant, selectedApplicant }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500"
      case "reviewed":
        return "bg-yellow-500"
      case "interview":
        return "bg-purple-500"
      case "offer":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "new":
        return "New Application"
      case "reviewed":
        return "Application Reviewed"
      case "interview":
        return "Interview Scheduled"
      case "offer":
        return "Offer Extended"
      default:
        return "Unknown Status"
    }
  }

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      {applicants.map((applicant) => (
        <motion.div
          key={applicant.id}
          className={`bg-white rounded-3xl border-2 ${
            selectedApplicant === applicant.id
              ? "border-blue-300 ring-4 ring-blue-100"
              : "border-blue-200 hover:border-blue-300"
          } p-6 relative shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden`}
          onClick={() => onSelectApplicant && onSelectApplicant(applicant.id)}
          whileHover={{
            y: -4,
            boxShadow: "0 10px 15px -5px rgba(0, 0, 0, 0.1)",
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-transparent hover:bg-blue-100 text-blue-400 hover:text-blue-600 transition-colors duration-200 z-10"
            whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
            whileTap={{ scale: 0.95 }}
          >
            <Bookmark size={24} />
          </motion.button>

          <div className="flex gap-4 relative z-10">
            <motion.div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center text-white font-bold text-xl shadow-lg`}
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5 }}
            >
              {applicant.photo}
            </motion.div>
            <div>
              <h3 className="font-bold text-xl text-blue-800">{applicant.name}</h3>
              <p className="text-sm text-blue-600">{applicant.position}</p>
              <div className="flex items-center mt-1">
                <div className={`${getStatusColor(applicant.status)} h-2 w-2 rounded-full mr-2`}></div>
                <span className="text-xs text-blue-500">{getStatusText(applicant.status)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center mt-3 text-xs text-blue-500 relative z-10">
            <MapPin size={14} className="mr-1" />
            <span>{applicant.location}</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 relative z-10">
            <div className="flex items-center text-sm bg-blue-50 p-3 rounded-xl border border-blue-100">
              <Briefcase size={16} className="text-blue-500 mr-2 flex-shrink-0" />
              <span className="text-blue-700 text-xs">{applicant.experience} experience</span>
            </div>
            <div className="flex items-center text-sm bg-blue-50 p-3 rounded-xl border border-blue-100">
              <Clock size={16} className="text-blue-500 mr-2 flex-shrink-0" />
              <span className="text-blue-700 text-xs">Applied {applicant.appliedDate}</span>
            </div>
            <div className="flex items-center text-sm bg-blue-50 p-3 rounded-xl border border-blue-100">
              <Mail size={16} className="text-blue-500 mr-2 flex-shrink-0" />
              <span className="text-blue-700 text-xs truncate">{applicant.email}</span>
            </div>
            <div className="flex items-center text-sm bg-blue-50 p-3 rounded-xl border border-blue-100">
              <Phone size={16} className="text-blue-500 mr-2 flex-shrink-0" />
              <span className="text-blue-700 text-xs">{applicant.phone}</span>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <div className="bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-xl py-3 px-4 flex items-center justify-center shadow-md">
              <CheckCircle size={18} className="mr-2 flex-shrink-0" />
              <span className="text-sm font-medium">{applicant.match} match for this position</span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default ApplicantCards
