"use client"

import { useState, useRef, useEffect } from "react"
import {
  Search,
  Briefcase,
  Mail,
  Bookmark,
  ChevronDown,
  Zap,
  Star,
  BookOpen,
  TrendingUp,
  Layers,
  Cpu,
  Code,
  Database,
  PenTool,
  Smartphone,
  Sliders,
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Slider from "@mui/material/Slider"
import Drawer from "@mui/material/Drawer"
import { FaWandMagicSparkles } from "react-icons/fa6"
import { Wifi } from "lucide-react"
import { createPortal } from "react-dom"
import { Progress } from "./components/progress"
import { Badge } from "./components/badge"
import QuickApplyModal from "./components/quick-apply-modal"
import JobCard from "@/app/(app)/student/jobs/job-listings/components/job-cards"
import JobDetails from "@/app/(app)/student/jobs/job-listings/components/job-details"
import { Dialog } from "@mui/material"

export default function StudentDashboard() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null)
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false)

  const rightSectionRef = useRef<HTMLDivElement | null>(null)
  const leftSectionRef = useRef<HTMLDivElement | null>(null)

  const handleJobSelect = (id: number) => {
    setSelectedJob(id === selectedJob ? null : id)
  }

  useEffect(() => {
    document.documentElement.style.overflow = "hidden"
    document.body.style.overflow = "hidden"

    return () => {
      document.documentElement.style.overflow = ""
      document.body.style.overflow = ""
    }
  }, [])

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
          <StudentProfile />
        </Drawer>

        <motion.h1
          className="text-lg font-bold text-blue-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Job Matches
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
        {/* Left Column - Student Profile - Hidden on mobile, visible on md and up */}
        <div className="hidden md:block w-80 flex-shrink-0 overflow-y-auto border-r border-blue-200">
          <StudentProfile />
        </div>

        {/* Middle Column - Job Matches - SCROLLABLE */}
        <div
          ref={leftSectionRef}
          className="flex-1 overflow-y-auto"
          style={{ width: selectedJob !== null ? "65%" : "100%" }}
        >
          {/* Job Listings Component */}
          <JobMatches onSelectJob={handleJobSelect} selectedJob={selectedJob} />
        </div>

        {/* Right Column - Job Details - Only visible when a job is selected */}
        {selectedJob !== null && (
          <div
            ref={rightSectionRef}
            className="hidden lg:block flex-shrink-0 overflow-y-auto border-l border-blue-200 transition-all duration-300 ease-in-out"
            style={{ width: "35%" }}
          >
            <JobDetails onClose={() => setSelectedJob(null)} />
          </div>
        )}
      </div>
    </div>
  )
}

// Student Profile Component
function StudentProfile() {
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false)

  const handleOpenSkillsModal = () => setIsSkillsModalOpen(true)
  const handleCloseSkillsModal = () => setIsSkillsModalOpen(false)

  return (
    <div className="p-4">
      {/* Skills Section */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg mb-6 p-4 border-2 border-blue-200 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-blue-700">Your Skills</h3>
          <motion.button
            className="text-blue-500 hover:text-blue-700 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sliders className="h-4 w-4" />
          </motion.button>
        </div>

        <div className="space-y-3">
          {/* Display only the first 3 skills */}
          {[{ skill: "Frontend Development", level: "Expert", value: 95, icon: Code },
            { skill: "Backend Development", level: "Advanced", value: 80, icon: Database },
            { skill: "UI/UX Design", level: "Intermediate", value: 70, icon: PenTool }]
            .map(({ skill, level, value, icon: Icon }, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">{skill}</span>
                  </div>
                  <span className="text-xs font-medium text-blue-600">{level}</span>
                </div>
                <Progress value={value} className="h-1.5" />
              </div>
            ))}

          {/* View More Button */}
          <button
            className="text-blue-600 text-sm hover:underline mt-2"
            onClick={handleOpenSkillsModal}
          >
            View More
          </button>
        </div>

        {/* Pill-shaped skills */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">React</Badge>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">Next.js</Badge>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">TypeScript</Badge>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">Node.js</Badge>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">Figma</Badge>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">Tailwind</Badge>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">MongoDB</Badge>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">+5 more</Badge>
        </div>

        {/* Update Skills Button */}
        <div className="mt-4">
          <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50">
            Update Skills
          </Button>
        </div>
      </motion.div>

      {/* Recommended Skills Section */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg mb-6 p-4 border-2 border-blue-200 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-blue-700">Recommended Skills</h3>
          <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full">Based on job market</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 hover:bg-blue-50 rounded-lg transition-colors">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700">Docker</span>
            </div>
            <Badge className="bg-green-100 text-green-700 border-none">High Demand</Badge>
          </div>

          <div className="flex items-center justify-between p-2 hover:bg-blue-50 rounded-lg transition-colors">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700">AWS</span>
            </div>
            <Badge className="bg-green-100 text-green-700 border-none">High Demand</Badge>
          </div>

          <div className="flex items-center justify-between p-2 hover:bg-blue-50 rounded-lg transition-colors">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700">GraphQL</span>
            </div>
            <Badge className="bg-yellow-100 text-yellow-700 border-none">Medium Demand</Badge>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50">
            <FaWandMagicSparkles className="mr-2 h-4 w-4" />
            Skill Development Plan
          </Button>
        </div>
      </motion.div>

      {/* Skills Modal */}
      <Dialog open={isSkillsModalOpen} onClose={handleCloseSkillsModal}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">All Skills</h3>
          <div className="space-y-3">
            {[{ skill: "Frontend Development", level: "Expert", value: 95, icon: Code },
              { skill: "Backend Development", level: "Advanced", value: 80, icon: Database },
              { skill: "UI/UX Design", level: "Intermediate", value: 70, icon: PenTool },
              { skill: "Mobile Development", level: "Beginner", value: 40, icon: Smartphone },
              { skill: "Machine Learning", level: "Beginner", value: 30, icon: Cpu }]
              .map(({ skill, level, value, icon: Icon }, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">{skill}</span>
                    </div>
                    <span className="text-xs font-medium text-blue-600">{level}</span>
                  </div>
                  <Progress value={value} className="h-1.5" />
                </div>
              ))}
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
              onClick={handleCloseSkillsModal}
            >
              Close
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

// Filter Section
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
        {/* Match Percentage */}
        <div>
          <h4 className="font-medium mb-3 text-blue-700">Match Percentage</h4>
          <div className="px-1">
            <Slider defaultValue={70} max={100} step={5} className="my-4" valueLabelDisplay="auto" />
            <div className="flex justify-between text-xs text-blue-500">
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Job Type */}
        <div>
          <h4 className="font-medium mb-3 text-blue-700">Job Type</h4>
          <div className="space-y-2">
            {[
              { id: "fulltime", label: "Fulltime" },
              { id: "parttime", label: "Part-time" },
              { id: "ojt", label: "OJT", checked: true },
              { id: "internship", label: "Internship", checked: true },
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
              { id: "remote", label: "Remote", checked: true },
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
            <Slider defaultValue={50} max={100} step={1} className="my-4" valueLabelDisplay="auto" />
            <div className="flex justify-between text-xs text-blue-500">
              <span>15,000 ₱</span>
              <span>30,000 ₱</span>
            </div>
          </div>
        </div>

        {/* Industry */}
        <div>
          <h4 className="font-medium mb-3 text-blue-700">Industry</h4>
          <div className="space-y-2">
            {[
              { id: "tech", label: "Technology", checked: true },
              { id: "finance", label: "Finance" },
              { id: "healthcare", label: "Healthcare" },
              { id: "education", label: "Education", checked: true },
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

// Job Matches Component
function JobMatches({ onSelectJob, selectedJob }: { onSelectJob: (id: number) => void; selectedJob: number | null }) {
  const [showQuickApply, setShowQuickApply] = useState(false)
  const [currentJobId, setCurrentJobId] = useState<number | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("recommended")
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current && scrollContainerRef.current.scrollTop > 50) {
        setIsHeaderCollapsed(true)
      } else {
        setIsHeaderCollapsed(false)
      }
    }

    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll)
      return () => scrollContainer.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-30 pt-2 pb-4 bg-gradient-to-br from-blue-50 to-sky-100">
          <div
            className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl shadow-xl text-white mb-4 relative overflow-hidden transition-all duration-300"
            style={{
              padding: isHeaderCollapsed ? "8px 16px" : "48px 16px",
            }}
          >
            <div
              className="transition-all duration-300 overflow-hidden"
              style={{
                maxHeight: isHeaderCollapsed ? "0" : "200px",
                opacity: isHeaderCollapsed ? 0 : 1,
                marginBottom: isHeaderCollapsed ? 0 : 16,
              }}
            >
              <h2 className="text-2xl font-bold relative z-10">Your Job Matches</h2>
              <p className="text-blue-100 text-sm relative z-10 mt-2">
                We&apos;ve found 24 jobs that match your skills and preferences. Apply now to take the next step in your
                career!
              </p>
            </div>

            <div className="bg-white rounded-xl p-2 flex flex-col sm:flex-row relative z-10">
              <Input
                type="text"
                placeholder="Search job matches"
                className="border-0 text-black focus-visible:ring-0 focus-visible:ring-offset-0 mb-1 sm:mb-0"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>

          {/* Job Category Tabs with improved design */}
          <div className="flex overflow-x-auto pb-2 mb-2 scrollbar-hide">
            <div className="flex space-x-2">
              {[
                { id: "recommended", label: "Recommended", icon: <Star className="w-3 h-3" /> },
                { id: "highMatch", label: "High Match", icon: <Zap className="w-3 h-3" /> },
                { id: "saved", label: "Saved", icon: <Bookmark className="w-3 h-3" /> },
                { id: "applied", label: "Applied", icon: <Mail className="w-3 h-3" /> },
                { id: "remote", label: "Remote", icon: <Wifi className="w-3 h-3" /> },
                { id: "internship", label: "Internship", icon: <BookOpen className="w-3 h-3" /> },
                { id: "fulltime", label: "Full-time", icon: <Briefcase className="w-3 h-3" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-1 ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <span className="ml-1 bg-white text-blue-600 text-xs rounded-full px-1.5">24</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sort and Filter Buttons */}
          <div className="mt-3 text-sm flex items-center gap-2 relative z-10">
            <span>Sort by:</span>
            <button className="bg-blue-600/30 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-blue-600/50 transition-colors">
              Match Percentage
              <ChevronDown className="h-3 w-3" />
            </button>
            <div className="relative">
              <button
                className="bg-white px-3 py-1 rounded-full text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-50"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                {isFilterOpen ? "Close" : "Filters"}
              </button>
              {isFilterOpen &&
                createPortal(
                  <div className="fixed top-44 left-[600px] transform -translate-x-1/2 w-64 rounded-2xl z-50">
                    <FilterModal />
                  </div>,
                  document.body,
                )}
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-4 p-4">
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
      </div>

      {/* Quick Apply Modal */}
      {showQuickApply &&
        createPortal(<QuickApplyModal jobId={currentJobId!} onClose={() => setShowQuickApply(false)} />, document.body)}
    </div>
  )
}

function FilterModal() {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-5 border-2 border-blue-200 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
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
        {/* Match Percentage */}
        <div>
          <h4 className="font-medium mb-3 text-blue-700">Match Percentage</h4>
          <div className="px-1">
            <Slider defaultValue={70} max={100} step={5} className="my-4" valueLabelDisplay="auto" />
            <div className="flex justify-between text-xs text-blue-500">
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Job Type */}
        <div>
          <h4 className="font-medium mb-3 text-blue-700">Job Type</h4>
          <div className="space-y-2">
            {[
              { id: "fulltime", label: "Fulltime" },
              { id: "parttime", label: "Part-time" },
              { id: "ojt", label: "OJT", checked: true },
              { id: "internship", label: "Internship", checked: true },
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
              { id: "remote", label: "Remote", checked: true },
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
            <Slider defaultValue={50} max={100} step={1} className="my-4" valueLabelDisplay="auto" />
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

