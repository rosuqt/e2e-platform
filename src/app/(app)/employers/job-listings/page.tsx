"use client"

import { useState, useRef, useEffect } from "react"
import {
  Search,
  Clock,
  MapPin,
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Drawer from "@mui/material/Drawer"
import EmployerJobCard from "./components/job-cards"
import EmployerJobOverview from "./components/tabs/overview-tab"
import QuickEditModal from "./components/quick-edit-modal"
import CandidateMatches from "./components/candidate-matches"
import TopJobListing from "./top-job-listing"

export default function JobListingPage() {
  useEffect(() => {
    document.documentElement.classList.add("overflow-hidden")

    return () => {
      document.documentElement.classList.remove("overflow-hidden")
    }
  }, [])

  const [selectedJob, setSelectedJob] = useState<number | null>(null)
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const rightSectionRef = useRef<HTMLDivElement | null>(null)
  const leftSectionRef = useRef<HTMLDivElement | null>(null)

  const handleJobSelect = (id: number) => {
    setSelectedJob(id)
    setIsModalOpen(true) 
  }

  const closeModal = () => {
    setIsModalOpen(false) 
  }

  useEffect(() => {
    const adjustSectionWidths = () => {
      if (leftSectionRef.current && rightSectionRef.current) {
        const containerWidth = window.innerWidth - 40

        if (selectedJob !== null) {
          const leftSectionWidth = containerWidth * 0.65
          const rightSectionWidth = containerWidth * 0.35

          leftSectionRef.current.style.width = `${leftSectionWidth}px`
          rightSectionRef.current.style.width = `${rightSectionWidth}px`
          rightSectionRef.current.style.maxWidth = "calc(100% - 40px)"
        } else {
          leftSectionRef.current.style.width = "100%"
        }
      }
    }

    window.addEventListener("resize", adjustSectionWidths)
    adjustSectionWidths()

    return () => {
      window.removeEventListener("resize", adjustSectionWidths)
    }
  }, [selectedJob])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
      {/* Mobile Navigation */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm md:hidden">
        <Drawer
          anchor="left"
          open={isSidebarMinimized}
          onClose={() => setIsSidebarMinimized(false)}
          className="w-[85%] sm:w-[350px] p-0 overflow-y-auto bg-gradient-to-br from-blue-50 to-sky-100"
        >
          <MobileUserProfile />
        </Drawer>

        <motion.h1
          className="text-lg font-bold text-blue-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Job Listings
        </motion.h1>

        <Drawer
          anchor="right"
          open={isSidebarMinimized}
          onClose={() => setIsSidebarMinimized(false)}
          className="w-[85%] sm:w-[350px] p-0 overflow-y-auto bg-gradient-to-br from-blue-50 to-sky-100"
        >
         
        </Drawer>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row h-[calc(100vh-56px)] md:h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-sky-100">
        {/* Left Column - User Profile - Hidden on mobile, visible on md and up */}
        <div className="hidden md:block w-80 flex-shrink-0 overflow-y-auto border-r border-blue-200">
          <UserProfile />
        </div>

        {/* Middle Column - Job Listings - SCROLLABLE */}
        <div
          ref={leftSectionRef}
          className="flex-1 overflow-y-auto"
          style={{ width: "100%" }}
        >
          <JobListings onSelectJob={handleJobSelect} selectedJob={selectedJob} />
        </div>
      </div>

      {/* Employer Job Overview Modal */}
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={closeModal}
        >
          <motion.div
            className="bg-white mt-36 mb-20 rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden max-h-screen"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300, 
              damping: 20,  
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <EmployerJobOverview selectedJob={selectedJob} onClose={closeModal} />
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

// Mobile User Profile Component
function MobileUserProfile() {
  return <UserProfile />
}

// User Profile Component - Redesigned
function UserProfile() {
  return (
    <div className="p-4 mt-12">
      {/* Candidate Matches Section */}
      <CandidateMatches />

      <div className="h-[250px]"> {/* Reduced height */}
        <TopJobListing />
      </div>
    </div>
  )
}

// Job Listings Component
function JobListings({ onSelectJob, selectedJob }: { onSelectJob: (id: number) => void; selectedJob: number | null }) {
  const [activeTab, setActiveTab] = useState("active")
  const [showQuickApply, setShowQuickApply] = useState(false)
  const [currentJobId, setCurrentJobId] = useState<number | null>(null)

  return (
    <div className="p-4">
      {/* Sticky Search and Sort - Now with position sticky */}
      <div className="sticky top-0 z-30 pt-2 pb-4 bg-gradient-to-br from-blue-50 to-sky-100">
        <div className="flex justify-between items-center mb-4">
          <motion.h2
            className="text-2xl font-bold relative z-10 text-blue-700"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            My Job Listings
          </motion.h2>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Post New Job
          </Button>
        </div>

        <motion.div
          className="bg-white rounded-xl p-4 relative z-10 shadow-md mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search job title or keywords"
                className="pl-10 border-blue-200 focus-visible:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select className="h-10 rounded-md border border-blue-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-8">
                  <option>All Locations</option>
                  <option>Remote</option>
                  <option>Onsite</option>
                  <option>Hybrid</option>
                </select>
                <MapPin className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              </div>
              <div className="relative">
                <select className="h-10 rounded-md border border-blue-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-8">
                  <option>All Statuses</option>
                  <option>Active</option>
                  <option>Paused</option>
                  <option>Closed</option>
                  <option>Draft</option>
                </select>
                <Clock className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Job Status Tabs */}
      <div className="flex overflow-x-auto pb-2 mb-2 scrollbar-hide">
        <div className="flex space-x-2">
          {[
            { id: "all", label: "All Listings", count: 18 },
            { id: "active", label: "Active", count: 5 },
            { id: "paused", label: "Paused", count: 2 },
            { id: "closed", label: "Closed", count: 8 },
            { id: "draft", label: "Drafts", count: 3 },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-1 ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
              }`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{tab.label}</span>
              <span
                className={`text-xs rounded-full px-1.5 ${activeTab === tab.id ? "bg-white text-blue-600" : "bg-blue-100"}`}
              >
                {tab.count}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium text-blue-600">5</span> active job listings
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select className="text-sm border-none bg-transparent focus:ring-0 text-blue-600 font-medium cursor-pointer">
            <option>Newest first</option>
            <option>Oldest first</option>
            <option>Most applications</option>
            <option>Closing soon</option>
          </select>
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {[0, 1, 2, 3, 4].map((id) => (
          <EmployerJobCard
            key={id}
            id={id}
            isSelected={selectedJob === id}
            onSelect={() => onSelectJob(id)}
            onEdit={() => {
              setCurrentJobId(id);
              setShowQuickApply(true);
            }}
          />
        ))}
      </div>

      {/* Quick Edit Modal */}
      {showQuickApply && <QuickEditModal jobId={currentJobId!} onClose={() => setShowQuickApply(false)} />}
    </div>
  )
}
