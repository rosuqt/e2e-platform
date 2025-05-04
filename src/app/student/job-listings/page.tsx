"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import {
  Users,
  Search,
  ChevronDown,
  Heart,
  ArrowRight,
  CheckCircle,
  Clock,
  BookOpen,
  Calendar,
  DollarSign,
  Award,
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Slider from "@mui/material/Slider"
import Drawer from "@mui/material/Drawer"
import LinearProgress from "@mui/material/LinearProgress"
import Chip from "@mui/material/Chip"

export default function JobListingPage() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null)
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false)

  const rightSectionRef = useRef<HTMLDivElement | null>(null)
  const leftSectionRef = useRef<HTMLDivElement | null>(null)

  const handleJobSelect = (id: number) => {
    setSelectedJob(id === selectedJob ? null : id)
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
          // When no job is selected, job listings take full width
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
          <FilterSection />
        </Drawer>
      </div>

      {/* Main Content Area with 3 columns */}
      <div className="flex flex-col md:flex-row h-[calc(100vh-56px)] md:h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-sky-100">
        {/* Left Column - User Profile - Hidden on mobile, visible on md and up */}
        <div className="hidden md:block w-80 flex-shrink-0 overflow-y-auto border-r border-blue-200">
          <UserProfile />
        </div>

        {/* Middle Column - Job Listings - SCROLLABLE */}
        <div
          ref={leftSectionRef}
          className="flex-1 overflow-y-auto"
          style={{ width: selectedJob !== null ? "65%" : "100%" }}
        >
          <JobListings onSelectJob={handleJobSelect} selectedJob={selectedJob} />
        </div>

        {/* Right Column - Job Details - Only visible when a job is selected */}
        {selectedJob !== null && (
          <div
            ref={rightSectionRef}
            className="hidden lg:block flex-shrink-0 overflow-y-auto border-l border-blue-200 transition-all duration-300 ease-in-out"
            style={{ width: "35%" }}
          >
            <JobDetails jobId={selectedJob} onClose={() => setSelectedJob(null)} />
          </div>
        )}
      </div>
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
    <div className="p-4">
      {/* Profile Completion */}
      <ProfileCompletion />

      {/* Job Matches */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg mb-6 p-4 border-2 border-blue-200 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-blue-700">Job Matches</h3>
          <motion.button
            className="text-blue-500 hover:text-blue-700 transition-colors"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-maximize-2"
            >
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" x2="14" y1="3" y2="10" />
              <line x1="3" x2="10" y1="21" y2="14" />
            </svg>
          </motion.button>
        </div>

        <div className="space-y-3">
          {[
            { company: "ABC", name: "Software Engineer", location: "Fb Mark-it Place", match: 96 },
            {
              company: ">",
              name: "Software Engineer",
              location: "Fb Mark-it Place",
              match: 98,
              bgColor: "bg-purple-100",
              textColor: "text-purple-600",
            },
            {
              company: "O",
              name: "Software Engineer",
              location: "Fb Mark-it Place",
              match: 92,
              bgColor: "bg-blue-100",
              textColor: "text-blue-600",
            },
          ].map((job, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between p-3 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors"
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(219, 234, 254, 0.8)",
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 ${job.bgColor || "bg-red-100"} rounded-lg flex items-center justify-center ${job.textColor || "text-red-600"} font-bold text-xs`}
                >
                  {job.company}
                </div>
                <div>
                  <p className="font-medium text-blue-700">{job.name}</p>
                  <p className="text-xs text-blue-500">{job.location}</p>
                </div>
              </div>
              <motion.div
                className="bg-green-500 text-white text-xs px-2 py-1 rounded-full"
                whileHover={{ scale: 1.1 }}
              >
                {job.match}%
              </motion.div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <motion.button
            className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All
          </motion.button>
        </div>

        <motion.div
          className="absolute -top-12 -left-12 w-32 h-32 bg-blue-100 rounded-full opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -45, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 2,
          }}
        />
      </motion.div>

      {/* Filter Section - Moved from right sidebar */}
      <FilterSection />
    </div>
  )
}

// New Profile Completion Component
function ProfileCompletion() {
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

// Filter Section - Extracted from FilterSidebar
function FilterSection() {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-5 border-2 border-blue-200 relative overflow-hidden mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-blue-700">Filter by</h3>
        <motion.button
          className="text-blue-600 text-sm hover:text-blue-800 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Clear
        </motion.button>
      </div>

      <div className="space-y-5">
        {/* Job Type */}
        <div>
          <h4 className="font-medium mb-3 text-blue-700">Job Type</h4>
          <div className="space-y-2">
            {[
              { id: "fulltime", label: "Fulltime" },
              { id: "parttime", label: "Part-time" },
              { id: "ojt", label: "OJT", checked: true },
              { id: "internship", label: "Internship" },
            ].map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <Checkbox id={item.id} checked={item.checked} />
                <label htmlFor={item.id} className="text-sm text-blue-600 cursor-pointer">
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <h4 className="font-medium mb-3 text-blue-700">Location</h4>
          <div className="space-y-2">
            {[
              { id: "remote", label: "Remote" },
              { id: "onsite", label: "Onsite" },
              { id: "hybrid", label: "Hybrid", checked: true },
            ].map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <Checkbox id={item.id} checked={item.checked} />
                <label htmlFor={item.id} className="text-sm text-blue-600 cursor-pointer">
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Salary Range */}
        <div>
          <h4 className="font-medium mb-3 text-blue-700">Salary Range</h4>
          <div className="px-1">
            <Slider
              defaultValue={50}
              max={100}
              step={1}
              className="my-4"
              valueLabelDisplay="auto"
            />
            <div className="flex justify-between text-xs text-blue-500">
              <span>15,000 ₱</span>
              <span>30,000 ₱</span>
            </div>
          </div>
        </div>

        <motion.button
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
          whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)" }}
          whileTap={{ scale: 0.97 }}
        >
          Apply filters
        </motion.button>
      </div>
    </motion.div>
  )
}

// Job Listings Component
function JobListings({ onSelectJob, selectedJob }: { onSelectJob: (id: number) => void; selectedJob: number | null }) {
  const [activeTab, setActiveTab] = useState("recommended")
  const [showQuickApply, setShowQuickApply] = useState(false)
  const [currentJobId, setCurrentJobId] = useState<number | null>(null)

  return (
    <div className="p-4">
      {/* Sticky Search and Sort - Now with position sticky */}
      <div className="sticky top-0 z-30 pt-2 pb-4 bg-gradient-to-br from-blue-50 to-sky-100">
        <motion.div
          className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl shadow-xl p-6 text-white mb-4 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400 rounded-full opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 45, 0],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />

          <motion.div
            className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-300 rounded-full opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -45, 0],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: 2,
            }}
          />

          <motion.h2
            className="text-2xl font-bold mb-2 relative z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Find your perfect job
          </motion.h2>

          <motion.p
            className="text-blue-100 text-sm mb-4 relative z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explore job listings tailored to your skills and interests. Find the right opportunity and take the next
            step in your career!
          </motion.p>

          <motion.div
            className="bg-white rounded-xl p-1 flex flex-col sm:flex-row relative z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <Input
              type="text"
              placeholder="Search jobs"
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 mb-1 sm:mb-0"
            />
            <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </motion.div>

          <motion.div
            className="mt-3 text-sm flex items-center gap-2 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span>Sort by:</span>
            <motion.button
              className="bg-blue-600/30 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-blue-600/50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Relevance
              <ChevronDown className="h-3 w-3" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Job Category Tabs */}
        <div className="flex overflow-x-auto pb-2 mb-2 scrollbar-hide">
          <div className="flex space-x-2">
            {[
              { id: "recommended", label: "Recommended" },
              { id: "recent", label: "Recent" },
              { id: "saved", label: "Saved" },
              { id: "applied", label: "Applied" },
              { id: "remote", label: "Remote" },
              { id: "tech", label: "Tech" },
              { id: "design", label: "Design" },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
                }`}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {[0, 1, 2, 3, 4].map((id) => (
          <JobCard
            key={id}
            id={id}
            isSelected={selectedJob === id}
            onSelect={() => onSelectJob(id)}
            onQuickApply={() => {
              setCurrentJobId(id)
              setShowQuickApply(true)
            }}
          />
        ))}
      </div>

      {/* Quick Apply Modal */}
      {showQuickApply && <QuickApplyModal jobId={currentJobId!} onClose={() => setShowQuickApply(false)} />}
    </div>
  )
}

// Job Card Component with Quick Apply button
function JobCard({
  id,
  isSelected,
  onSelect,
  onQuickApply,
}: {
  id: number
  isSelected: boolean
  onSelect: () => void
  onQuickApply: () => void
}) {
  const companies = ["Fb Mark-it Place", "Meta", "Google", "Amazon", "Microsoft"]
  const titles = ["UI/UX Designer", "Frontend Developer", "Product Manager", "Software Engineer", "Data Analyst"]
  const descriptions = [
    "Seeking a creative UI/UX Designer to craft intuitive and visually engaging user experiences.",
    "Looking for a talented Frontend Developer to build responsive web applications.",
    "Hiring a Product Manager to lead our product development initiatives.",
    "Join our engineering team to build scalable software solutions.",
    "Help us analyze data and provide insights to drive business decisions.",
  ]
  const locations = [
    "D3686 Jumper Road, Fairway Drive San Jose Del Monte Malabacat, Pampanga, NCR",
    "Makati City, Metro Manila",
    "BGC, Taguig City",
    "Ortigas Center, Pasig City",
    "Alabang, Muntinlupa City",
  ]
  const matchPercentages = [93, 87, 76, 95, 82]

  return (
    <motion.div
      className={`bg-white rounded-lg shadow-sm p-5 border ${isSelected ? "border-blue-400" : "border-gray-200"} relative overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: id * 0.1 }}
      whileHover={{
        y: -2,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        borderColor: "rgba(96, 165, 250, 0.8)",
      }}
      onClick={onSelect}
    >
      <div className="flex justify-between">
        <div className="flex gap-3">
          <motion.div
            className="w-12 h-12 bg-black rounded-full flex items-center justify-center overflow-hidden text-white"
            whileHover={{ scale: 1.1 }}
          >
            {id === 0 ? (
              <div className="text-center text-xs font-bold">Mark.it</div>
            ) : (
              <Image
                src={`/placeholder.svg?height=48&width=48&text=${companies[id % companies.length].charAt(0)}`}
                alt="Company logo"
                width={48}
                height={48}
                className="object-cover"
              />
            )}
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg text-gray-800">{titles[id % titles.length]}</h3>
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
            <p className="text-sm text-gray-500">{companies[id % companies.length]}</p>
            <p className="text-xs text-gray-400 mt-1">{locations[id % locations.length]}</p>
          </div>
        </div>
        <motion.button
          className={`text-gray-400 hover:text-blue-500 transition-colors ${isSelected ? "text-blue-500" : ""}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation()
            // Toggle favorite logic would go here
          }}
        >
          <Heart size={20} className={isSelected ? "fill-blue-500" : ""} />
        </motion.button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {id === 0 && (
          <Chip label="Closing soon" className="bg-red-50 text-red-600 border-red-200" />
        )}
        <Chip label={`${matchPercentages[id % matchPercentages.length]}% Matched`} className="bg-blue-50 text-blue-600 border-blue-200" />
        <Chip label={`${23 - id * 3} applicants`} className="bg-gray-50 text-gray-600 border-gray-200" />
      </div>

      <p className="text-gray-600 text-sm mt-3">{descriptions[id % descriptions.length]}</p>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="flex items-center text-sm text-gray-600">
          <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
          <span>On-the-Job Training</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
          <span>Closes at March 28, 2025</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
          <span>800 / Day</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2 text-gray-400" />
          <span>Posted 7 days ago</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Users className="h-4 w-4 mr-2 text-gray-400" />
          <span>5 vacancies</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Award className="h-4 w-4 mr-2 text-gray-400" />
          <span>Recommended for BSIT Students</span>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2 w-full sm:w-auto">
          <motion.button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium shadow-sm flex-1 sm:flex-none flex items-center justify-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => {
              e.stopPropagation()
              onQuickApply()
            }}
          >
            View Details
          </motion.button>
          <motion.button
            className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-md font-medium shadow-sm border border-gray-200 flex-1 sm:flex-none flex items-center justify-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => {
              e.stopPropagation()
              // Save logic would go here
            }}
          >
            Quick Apply
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// Quick Apply Modal
function QuickApplyModal({ jobId, onClose }: { jobId: number; onClose: () => void }) {
  const [step, setStep] = useState(1)
  const totalSteps = 3

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xl">Quick Apply</h3>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={onClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <p className="text-blue-100 text-sm">
            {jobId === 0
              ? "UI/UX Designer at Fb Mark-it Place"
              : jobId === 1
                ? "Frontend Developer at Meta"
                : "Product Manager at Google"}
          </p>

          {/* Progress bar */}
          <div className="mt-4 h-1.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-1 text-blue-100">
            <span>
              Step {step} of {totalSteps}
            </span>
            <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="font-medium text-lg text-blue-700">Personal Information</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <Input defaultValue="Kemly Rose" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input defaultValue="kemly.rose@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <Input placeholder="Enter your phone number" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h4 className="font-medium text-lg text-blue-700">Resume & Cover Letter</h4>
              <div className="space-y-3">
                <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-500 mb-2"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <path d="M16 13H8" />
                      <path d="M16 17H8" />
                      <path d="M10 9H8" />
                    </svg>
                    <p className="text-sm text-blue-700 font-medium">Upload your resume</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOCX or TXT (Max 5MB)</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Browse Files
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter (Optional)</label>
                  <textarea
                    className="w-full min-h-[100px] rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us why you're a good fit for this position..."
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h4 className="font-medium text-lg text-blue-700">Additional Questions</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    How many years of experience do you have in this field?
                  </label>
                  <select className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Less than 1 year</option>
                    <option>1-2 years</option>
                    <option>3-5 years</option>
                    <option>5+ years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">When can you start?</label>
                  <select className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Immediately</option>
                    <option>In 2 weeks</option>
                    <option>In 1 month</option>
                    <option>More than 1 month</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">What is your expected salary?</label>
                  <Input placeholder="Enter amount in PHP" />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : (
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}

            {step < totalSteps ? (
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setStep(step + 1)}>
                Continue
              </Button>
            ) : (
              <Button className="bg-green-600 hover:bg-green-700" onClick={onClose}>
                Submit Application
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Job Details Component
function JobDetails({ jobId, onClose }: { jobId: number; onClose: () => void }) {
  return (
    <motion.div
      className="h-full bg-gradient-to-br from-blue-500 to-sky-600 p-6 rounded-3xl shadow-2xl relative overflow-hidden"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400 rounded-full opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 45, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <motion.div
        className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-300 rounded-full opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, -45, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          delay: 2,
        }}
      />

      <div className="mb-6 mt-3 relative z-10">
        <div className="flex items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-4 text-white hover:bg-white/30 transition-all"
          >
            <ArrowRight className="h-6 w-6" />
          </motion.button>
          <h1 className="font-bold text-2xl text-white">Job Details</h1>
        </div>
        <p className="text-blue-100 text-sm ml-16">View complete information about this position</p>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 h-[calc(100%-100px)] overflow-y-auto">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mr-4 shadow-lg overflow-hidden">
            <Image
              src={
                jobId === 0
                  ? "/placeholder.svg?height=64&width=64&text=FB"
                  : jobId === 1
                    ? "/placeholder.svg?height=64&width=64&text=M"
                    : "/placeholder.svg?height=64&width=64&text=G"
              }
              alt="Company logo"
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {jobId === 0 ? "UI/UX Designer" : jobId === 1 ? "Frontend Developer" : "Product Manager"}
            </h2>
            <p className="text-blue-100">{jobId === 0 ? "Fb Mark-it Place" : jobId === 1 ? "Meta" : "Google"}</p>
          </div>
        </div>

        <div className="space-y-6">
          <motion.div
            className="bg-white/10 rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300"
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <h3 className="text-white font-bold mb-2 text-lg">Job Description</h3>
            <p className="text-blue-100 text-sm">
              {jobId === 0
                ? "We are looking for a talented UI/UX Designer to join our creative team. You will be responsible for designing intuitive and visually appealing user interfaces for our digital products."
                : jobId === 1
                  ? "We're seeking a skilled Frontend Developer to build responsive web applications using modern JavaScript frameworks. You'll work closely with our design and backend teams."
                  : "We need an experienced Product Manager to lead our product development initiatives, define product strategy, and work with cross-functional teams to deliver exceptional user experiences."}
            </p>
          </motion.div>

          <motion.div
            className="bg-white/10 rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300"
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <h3 className="text-white font-bold mb-2 text-lg">Requirements</h3>
            <ul className="text-blue-100 text-sm space-y-3">
              <li className="flex items-start">
                <motion.span
                  className="inline-block w-3 h-3 rounded-full bg-blue-300 mt-1.5 mr-2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                ></motion.span>
                {jobId === 0
                  ? "Bachelor's degree in Design, HCI, or related field"
                  : jobId === 1
                    ? "Strong proficiency in JavaScript, HTML, and CSS"
                    : "Bachelor's degree in Business, Computer Science, or related field"}
              </li>
              <li className="flex items-start">
                <motion.span
                  className="inline-block w-3 h-3 rounded-full bg-blue-300 mt-1.5 mr-2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                ></motion.span>
                {jobId === 0
                  ? "2+ years of experience in UI/UX design"
                  : jobId === 1
                    ? "Experience with React.js and modern frontend frameworks"
                    : "3+ years of experience in product management"}
              </li>
              <li className="flex items-start">
                <motion.span
                  className="inline-block w-3 h-3 rounded-full bg-blue-300 mt-1.5 mr-2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                ></motion.span>
                {jobId === 0
                  ? "Proficiency in design tools like Figma or Adobe XD"
                  : jobId === 1
                    ? "Knowledge of responsive design and cross-browser compatibility"
                    : "Experience with agile methodologies and product lifecycle management"}
              </li>
              <li className="flex items-start">
                <motion.span
                  className="inline-block w-3 h-3 rounded-full bg-blue-300 mt-1.5 mr-2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1.5 }}
                ></motion.span>
                {jobId === 0
                  ? "Strong portfolio demonstrating UI/UX skills"
                  : jobId === 1
                    ? "Experience with version control systems like Git"
                    : "Excellent communication and leadership skills"}
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="bg-white/10 rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300"
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <h3 className="text-white font-bold mb-2 text-lg">Benefits</h3>
            <ul className="text-blue-100 text-sm space-y-3">
              <li className="flex items-start">
                <motion.span
                  className="inline-block w-3 h-3 rounded-full bg-blue-300 mt-1.5 mr-2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                ></motion.span>
                Competitive salary (₱20,000-30,000 / month)
              </li>
              <li className="flex items-start">
                <motion.span
                  className="inline-block w-3 h-3 rounded-full bg-blue-300 mt-1.5 mr-2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                ></motion.span>
                Health insurance and wellness programs
              </li>
              <li className="flex items-start">
                <motion.span
                  className="inline-block w-3 h-3 rounded-full bg-blue-300 mt-1.5 mr-2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                ></motion.span>
                Flexible working hours and remote options
              </li>
              <li className="flex items-start">
                <motion.span
                  className="inline-block w-3 h-3 rounded-full bg-blue-300 mt-1.5 mr-2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1.5 }}
                ></motion.span>
                Professional development opportunities
              </li>
            </ul>
          </motion.div>

          <motion.button
            className="w-full bg-gradient-to-r from-blue-400 to-sky-400 text-white font-bold py-4 rounded-xl hover:from-blue-500 hover:to-sky-500 transition-all duration-300 shadow-lg"
            whileHover={{
              scale: 1.03,
              boxShadow: "0 15px 25px -5px rgba(0, 0, 0, 0.2)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            Apply Now
          </motion.button>

          {/* Similar Jobs Section */}
          <div className="mt-8">
            <h3 className="text-white font-bold mb-4 text-lg">Similar Jobs</h3>
            <div className="space-y-3">
              {[
                {
                  title: jobId === 0 ? "Product Designer" : jobId === 1 ? "React Developer" : "Senior Product Manager",
                  company: "Amazon",
                  match: 94,
                },
                {
                  title: jobId === 0 ? "UX Researcher" : jobId === 1 ? "Full Stack Developer" : "Product Owner",
                  company: "Microsoft",
                  match: 91,
                },
                {
                  title:
                    jobId === 0 ? "UI Designer" : jobId === 1 ? "JavaScript Engineer" : "Technical Product Manager",
                  company: "Apple",
                  match: 88,
                },
              ].map((job, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
                  whileHover={{ y: -2, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                        <Image
                          src={`/placeholder.svg?height=40&width=40&text=${job.company.charAt(0)}`}
                          alt={`${job.company} logo`}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm">{job.title}</h4>
                        <p className="text-blue-100 text-xs">{job.company}</p>
                      </div>
                    </div>
                    <div className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">
                      {job.match}% match
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
