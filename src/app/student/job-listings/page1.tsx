"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import {
  Clock,
  Users,
  Filter,
  User,
  Search,
  ChevronDown,
  Heart,
  CheckCircle,
  Calendar,
  DollarSign,
  Award,
  BookOpen,
  X,
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function JobListingPage() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null)
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false)

  const searchRef = useRef<HTMLDivElement | null>(null)
  const rightSectionRef = useRef<HTMLDivElement | null>(null)
  const leftSectionRef = useRef<HTMLDivElement | null>(null)

  const handleJobSelect = (id: number) => {
    setSelectedJob(id === selectedJob ? null : id)
  }

  useEffect(() => {
    const adjustSectionWidths = () => {
      if (leftSectionRef.current && rightSectionRef.current) {
        const containerWidth = window.innerWidth - 40 // Adjust for padding

        if (selectedJob !== null) {
          // When job is selected, split the width
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
    <div className="min-h-screen bg-white">
      {/* Mobile Navigation */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <User className="h-5 w-5" />
              <span className="sr-only">Open profile sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[85%] sm:w-[350px] p-0 overflow-y-auto bg-white">
            <MobileUserProfile />
          </SheetContent>
        </Sheet>

        <motion.h1
          className="text-lg font-bold text-blue-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Job Listings
        </motion.h1>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Filter className="h-5 w-5" />
              <span className="sr-only">Open filters</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85%] sm:w-[350px] p-0 overflow-y-auto bg-white">
            <FilterSection />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Area with 3 columns */}
      <div className="flex flex-col md:flex-row h-[calc(100vh-56px)] md:h-screen overflow-hidden bg-white">
        {/* Left Column - User Profile - Hidden on mobile, visible on md and up */}
        <div className="hidden md:block w-80 flex-shrink-0 overflow-y-auto border-r border-gray-200">
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
            className="hidden lg:block flex-shrink-0 overflow-y-auto border-l border-gray-200 transition-all duration-300 ease-in-out bg-white"
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
        className="bg-white rounded-lg shadow-sm mb-6 p-4 border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Job Matches</h3>
          <motion.button
            className="text-blue-500 hover:text-blue-700 transition-colors"
            whileHover={{ scale: 1.1 }}
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
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(249, 250, 251, 0.8)",
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
                  <p className="font-medium text-gray-800">{job.name}</p>
                  <p className="text-xs text-gray-500">{job.location}</p>
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
      className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-300"
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
          <h3 className="font-medium text-gray-800">Kemly Rose</h3>
          <p className="text-sm text-gray-500">BS: Information Technology</p>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-sm font-medium text-gray-700">Profile Completion</h4>
          <span className="text-sm font-medium text-gray-700">{completionPercentage}%</span>
        </div>
        <Progress value={completionPercentage} className="h-2" />
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
      className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Filter by</h3>
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
          <h4 className="font-medium mb-3 text-gray-700">Job Type</h4>
          <div className="space-y-2">
            {[
              { id: "fulltime", label: "Fulltime" },
              { id: "parttime", label: "Part-time" },
              { id: "ojt", label: "OJT", checked: true },
              { id: "internship", label: "Internship" },
            ].map((item, index) => (
              <div key={item.id} className="flex items-center gap-2">
                <Checkbox id={item.id} checked={item.checked} />
                <label htmlFor={item.id} className="text-sm text-gray-600 cursor-pointer">
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <h4 className="font-medium mb-3 text-gray-700">Location</h4>
          <div className="space-y-2">
            {[
              { id: "remote", label: "Remote" },
              { id: "onsite", label: "Onsite" },
              { id: "hybrid", label: "Hybrid", checked: true },
            ].map((item, index) => (
              <div key={item.id} className="flex items-center gap-2">
                <Checkbox id={item.id} checked={item.checked} />
                <label htmlFor={item.id} className="text-sm text-gray-600 cursor-pointer">
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Salary Range */}
        <div>
          <h4 className="font-medium mb-3 text-gray-700">Salary Range</h4>
          <div className="px-1">
            <Slider defaultValue={[50]} max={100} step={1} className="my-4" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>15,000 ₱</span>
              <span>30,000 ₱</span>
            </div>
          </div>
        </div>

        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Apply filters
        </Button>
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
      <div className="sticky top-0 z-30 pt-2 pb-4 bg-white">
        <motion.div
          className="bg-white rounded-lg shadow-sm p-6 mb-4 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2
            className="text-2xl font-bold mb-2 text-gray-800"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Find your perfect job
          </motion.h2>

          <motion.p
            className="text-gray-500 text-sm mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explore job listings tailored to your skills and interests. Find the right opportunity and take the next
            step in your career!
          </motion.p>

          <motion.div
            className="bg-white rounded-lg p-1 flex flex-col sm:flex-row border border-gray-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
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
            className="mt-3 text-sm flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span className="text-gray-500">Sort by:</span>
            <motion.button
              className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-gray-200 transition-colors text-gray-700"
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
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
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
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
            <Clock className="mr-1 h-3 w-3" /> Closing soon
          </Badge>
        )}
        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
          {matchPercentages[id % matchPercentages.length]}% Matched
        </Badge>
        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
          <Users className="mr-1 h-3 w-3" /> {23 - id * 3} applicants
        </Badge>
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
            Apply
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
            Save
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
        className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-blue-600 p-4 text-white">
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
              <h4 className="font-medium text-lg text-gray-700">Personal Information</h4>
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
              <h4 className="font-medium text-lg text-gray-700">Resume & Cover Letter</h4>
              <div className="space-y-3">
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
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
                      className="text-gray-400 mb-2"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <path d="M16 13H8" />
                      <path d="M16 17H8" />
                      <path d="M10 9H8" />
                    </svg>
                    <p className="text-sm text-gray-700 font-medium">Upload your resume</p>
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
              <h4 className="font-medium text-lg text-gray-700">Additional Questions</h4>
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

// Job Details Component - Redesigned to match the image
function JobDetails({ jobId, onClose }: { jobId: number; onClose: () => void }) {
  const matchPercentage = jobId === 0 ? 15 : jobId === 1 ? 45 : 65
  const isStrongMatch = matchPercentage > 50

  return (
    <div className="h-full bg-white overflow-y-auto p-6">
      {/* Header with company and job info */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold">
          {jobId === 0 ? "Mark.it" : jobId === 1 ? "M" : "G"}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-800">
              {jobId === 0 ? "UI/UX Designer" : jobId === 1 ? "Frontend Developer" : "Product Manager"}
            </h1>
            {jobId === 0 && (
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
          <p className="text-gray-600">{jobId === 0 ? "Fb Mark-it Place" : jobId === 1 ? "Meta" : "Google"}</p>
          <p className="text-sm text-gray-500 mt-1">
            {jobId === 0
              ? "D3686 Jumper Road, Fairway Drive San Jose Del Monte Malabacat, Pampanga, NCR"
              : jobId === 1
                ? "Makati City, Metro Manila"
                : "BGC, Taguig City"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mb-6">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium shadow-sm flex-1">
          Apply
        </Button>
        <Button
          variant="outline"
          className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-md font-medium shadow-sm border border-gray-200 flex-1"
        >
          Save
        </Button>
      </div>

      {/* Job stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
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

      {/* Match percentage */}
      <div className="mb-6 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-16 h-16 transform -rotate-90">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="3"
                strokeDasharray="100, 100"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={isStrongMatch ? "#22c55e" : "#ef4444"}
                strokeWidth="3"
                strokeDasharray={`${matchPercentage}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-800">
              {matchPercentage}%
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-800">
              {isStrongMatch ? "This Job is a Strong Match" : "This Job Isn't a Strong Match"}
            </h3>
            <p className="text-sm text-gray-600">
              {isStrongMatch
                ? "We've checked your resume and selected skills, and this job is a great match for your profile."
                : "We've checked your resume and selected skills, and unfortunately, this job isn't the best match for your profile. You can still apply, but there may be better candidates with different qualifications."}
            </p>
          </div>
        </div>
        <div className="mt-3">
          <Button variant="link" className="text-blue-600 p-0 h-auto text-sm">
            View Details
          </Button>
          <span className="mx-2 text-gray-300">|</span>
          <Button variant="link" className="text-blue-600 p-0 h-auto text-sm flex items-center">
            <span className="mr-1">How can I make myself a stronger candidate?</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 text-yellow-400"
            >
              <path
                fillRule="evenodd"
                d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Job description */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">About the Job</h2>
        <p className="text-gray-600 mb-4">
          {jobId === 0
            ? "Seeking a creative UI/UX Designer to craft intuitive and visually engaging user experiences. You will design user-friendly interfaces that enhance functionality and aesthetics."
            : jobId === 1
              ? "We're looking for a Frontend Developer with experience in React, Next.js, and TailwindCSS to join our fast-paced team. You'll work closely with designers and backend engineers to build sleek, scalable, and user-friendly interfaces."
              : "We need an experienced Product Manager to lead our product development initiatives, define product strategy, and work with cross-functional teams to deliver exceptional user experiences."}
        </p>
        <p className="text-gray-600">
          This is a remote first role with flexible hours, competitive pay, and opportunities for career growth!
        </p>
      </div>

      {/* Responsibilities */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Responsibilities</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          {jobId === 0 ? (
            <>
              <li>
                Develop and maintain responsive, high-performance web applications using React.js, Next.js, and
                TailwindCSS.
              </li>
              <li>Collaborate with UI/UX designers to implement beautiful and functional designs.</li>
              <li>Optimize web applications for speed, scalability, and accessibility.</li>
              <li>Work with backend engineers to integrate APIs and manage data flow efficiently.</li>
              <li>Write clean, reusable, and maintainable code while following best practices.</li>
              <li>Participate in code reviews and contribute to improving our development workflows.</li>
            </>
          ) : jobId === 1 ? (
            <>
              <li>
                Build responsive, high-performance web applications using React.js and modern JavaScript frameworks.
              </li>
              <li>Implement UI/UX designs with pixel-perfect accuracy and attention to detail.</li>
              <li>Optimize application performance and ensure cross-browser compatibility.</li>
              <li>Collaborate with backend developers to integrate RESTful APIs.</li>
              <li>Write clean, maintainable code and participate in code reviews.</li>
              <li>Stay updated with the latest frontend technologies and best practices.</li>
            </>
          ) : (
            <>
              <li>Define product vision, strategy, and roadmap based on market research and user feedback.</li>
              <li>Lead cross-functional teams to deliver product features and improvements.</li>
              <li>Gather and prioritize product requirements and create detailed specifications.</li>
              <li>Work closely with engineering, design, and marketing teams throughout the product lifecycle.</li>
              <li>Analyze product metrics and user feedback to inform product decisions.</li>
              <li>Present product plans and progress to stakeholders and executive leadership.</li>
            </>
          )}
        </ul>
      </div>

      {/* Qualifications */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Qualifications</h2>
        <h3 className="font-bold text-gray-700 mb-2">Must-Haves:</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-4">
          {jobId === 0 ? (
            <>
              <li>2+ years of experience in Frontend Development (React.js, Next.js).</li>
              <li>Proficiency in HTML, CSS, JavaScript, and TailwindCSS.</li>
              <li>Strong understanding of component-based architecture and state management.</li>
              <li>Experience with RESTful APIs & handling asynchronous requests.</li>
              <li>Ability to write clean, efficient, and well-documented code.</li>
              <li>A good eye for design and attention to detail.</li>
            </>
          ) : jobId === 1 ? (
            <>
              <li>Bachelor's degree in Computer Science or related field.</li>
              <li>2+ years of experience with React.js and modern JavaScript frameworks.</li>
              <li>Strong proficiency in HTML, CSS, and JavaScript.</li>
              <li>Experience with responsive design and cross-browser compatibility.</li>
              <li>Knowledge of frontend build tools and package managers.</li>
              <li>Familiarity with version control systems (Git).</li>
            </>
          ) : (
            <>
              <li>Bachelor's degree in Business, Computer Science, or related field.</li>
              <li>3+ years of experience in product management.</li>
              <li>Strong analytical and problem-solving skills.</li>
              <li>Excellent communication and leadership abilities.</li>
              <li>Experience with agile methodologies.</li>
              <li>Proven track record of successful product launches.</li>
            </>
          )}
        </ul>

        <h3 className="font-bold text-gray-700 mb-2">Nice-to-Haves:</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          {jobId === 0 ? (
            <>
              <li>Experience with TypeScript.</li>
              <li>Knowledge of backend technologies (Node.js, Express, Firebase, or similar).</li>
              <li>Familiarity with CI/CD and version control (Git, GitHub).</li>
              <li>Understanding of SEO & web performance optimization.</li>
            </>
          ) : jobId === 1 ? (
            <>
              <li>Experience with TypeScript and state management libraries.</li>
              <li>Knowledge of testing frameworks (Jest, React Testing Library).</li>
              <li>Familiarity with UI/UX design principles.</li>
              <li>Experience with GraphQL or other API technologies.</li>
            </>
          ) : (
            <>
              <li>MBA or advanced degree in a relevant field.</li>
              <li>Experience in the tech industry or SaaS products.</li>
              <li>Knowledge of data analysis tools and techniques.</li>
              <li>Understanding of UX design principles.</li>
            </>
          )}
        </ul>
      </div>

      {/* Perks & Benefits */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Perks & Benefits</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Remote & Flexible Work: Work from anywhere with flexible hours.</li>
          <li>Competitive Salary & Bonuses: Performance-based incentives.</li>
          <li>Learning & Growth: Access to courses, workshops, and conferences.</li>
          <li>Paid Time Off: Generous vacation and sick leave.</li>
          <li>Tech Allowance: We provide the tools you need to succeed!</li>
        </ul>
      </div>

      <Separator className="my-6" />

      {/* Job posted by */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Job Posted by</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <Image
                src="/placeholder.svg?height=48&width=48"
                alt="Profile"
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-medium text-gray-800">Juan Ponce Dionisio</p>
              <p className="text-sm text-gray-500">HR Manager at Fb Mark-It Place</p>
              <p className="text-xs text-gray-400">Job poster</p>
            </div>
          </div>
          <Button variant="outline" className="text-blue-600 border-blue-200">
            Message
          </Button>
        </div>
      </div>

      {/* About the company */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">About the Company</h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
            <Image
              src="/placeholder.svg?height=64&width=64&text=JA"
              alt="Company logo"
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Job-All Tech Solutions</h3>
            <p className="text-sm text-gray-600">Software Development</p>
            <p className="text-xs text-gray-500">San Francisco, USA | Berlin, Germany</p>
            <p className="text-xs text-gray-500">Medium (200-500 employees)</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Job-All Tech Solutions is a leading software development company specializing in AI-driven solutions and
          enterprise applications. With a global presence in San Francisco and Berlin, we are committed to innovation,
          efficiency, and excellence...
        </p>
        <Button variant="link" className="text-blue-600 p-0 h-auto text-sm">
          View company
        </Button>
      </div>
    </div>
  )
}
