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
import EmployerJobCard, { EmployerJobCardJob, sortJobsActiveFirst } from "./components/job-cards"
import EmployerJobOverview from "./components/tabs/overview-tab"
import QuickEditModal from "./components/quick-edit-modal"
import CandidateMatches from "./components/candidate-matches"
import TopJobListing from "./top-job-listing"
import { useRouter } from "next/navigation"
import Lottie from "lottie-react"
import { FaFolderOpen } from "react-icons/fa6"

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
  const [showProfileColumn, setShowProfileColumn] = useState(true)

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
        {/* Collapsible Profile Column */}
        {showProfileColumn && (
          <div className="hidden md:block w-80 flex-shrink-0 overflow-y-auto border-r border-blue-200 relative">
            {/* Toggle button to hide column */}
            <button
              className="absolute top-2 right-2 z-20 bg-white border border-blue-200 rounded-full p-1 shadow hover:bg-blue-50 transition-colors"
              title="Hide Column"
              onClick={() => setShowProfileColumn(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-left text-blue-600"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <UserProfile />
          </div>
        )}
        {/* Show button when column is hidden */}
        {!showProfileColumn && (
          <div className="hidden md:flex w-6 flex-shrink-0 items-start justify-center pt-4">
            <button
              className="bg-white border border-blue-200 rounded-full p-1 shadow hover:bg-blue-50 transition-colors"
              title="Show Profile Column"
              onClick={() => setShowProfileColumn(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-right text-blue-600"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}
        <div
          ref={leftSectionRef}
          className="flex-1"
          style={{ width: "100%" }}
        >
          <div className="ml-3 mt-3 flex flex-col h-full">
            <JobListings onSelectJob={handleJobSelect} selectedJob={selectedJob} />
          </div>
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
            className="bg-white mt-36 mb-20 rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden max-h-screen "
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
    <div className="p-4 mt-2 mb-16">
      {/* Candidate Matches Section */}
      <CandidateMatches />

      <div className="h-[250px]"> 
        <TopJobListing />
      </div>
    </div>
  )
}

// Job Listings Component
function JobListings({ onSelectJob, selectedJob }: { onSelectJob: (id: number) => void; selectedJob: number | null }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [showQuickApply, setShowQuickApply] = useState(false)
  const [currentJobId, setCurrentJobId] = useState<number | null>(null)
  const debounceRef = useRef<number | null>(null)
  const collapsedRef = useRef(false)
  const [collapsed, setCollapsed] = useState(false)
  const [jobs, setJobs] = useState<EmployerJobCardJob[]>([])
  const [loading, setLoading] = useState(true)
  const [listLoadAnimation, setListLoadAnimation] = useState<object | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoading(true)
    fetch("/animations/list-load.json")
      .then(res => res.json())
      .then(data => setListLoadAnimation(data))
    fetch("/api/job-listings/job-cards")
      .then((res) => res.json())
      .then((data) => {
        setJobs(Array.isArray(data) ? data : data.data || []);
        setLoading(false)
      })
      .catch(() => {
        setJobs([]);
        setLoading(false)
      });
  }, []);

  useEffect(() => {
    collapsedRef.current = collapsed
  }, [collapsed])

  useEffect(() => {
    function handleScroll() {
      if (!scrollContainerRef.current) return

      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      debounceRef.current = window.setTimeout(() => {
        const scrollTop = scrollContainerRef.current!.scrollTop
        if (!collapsedRef.current && scrollTop > 60) {
          setCollapsed(true)
        } else if (collapsedRef.current && scrollTop < 10) {
          setCollapsed(false)
        }
      }, 350) 
    }

    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll)
      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll)
        if (debounceRef.current) clearTimeout(debounceRef.current)
      }
    }
  }, [])

  function getJobStatus(job: EmployerJobCardJob) {
    if (job.status === "Draft") return "draft"
    if (job.closing === "Closed") return "closed"
    if (job.paused) return "paused"
    return "active"
  }

  const tabCounts = jobs.reduce(
    (acc, job) => {
      const status = getJobStatus(job)
      acc.all++
      if (status === "active") acc.active++
      if (status === "paused") acc.paused++
      if (status === "closed") acc.closed++
      if (status === "draft") acc.draft++
      return acc
    },
    { all: 0, active: 0, paused: 0, closed: 0, draft: 0 }
  )

  const filteredJobs = jobs.filter((job) => {
    const status = getJobStatus(job)
    if (activeTab === "all") return true
    return status === activeTab
  })

  const tabs = [
    { id: "all", label: "All Listings", count: tabCounts.all },
    { id: "active", label: "Active", count: tabCounts.active },
    { id: "paused", label: "Paused", count: tabCounts.paused },
    { id: "closed", label: "Closed", count: tabCounts.closed },
    { id: "draft", label: "Drafts", count: tabCounts.draft },
  ]

  return (
    <div className="flex flex-col h-full">
      <div
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-y-auto"
      >
        <div className="mr-2 sticky top-0 z-30 -mt-4 mb-10 pt-4 bg-gradient-to-br from-blue-50 to-sky-100">
          <motion.div
            className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl shadow-xl text-white mb-4 relative overflow-hidden px-4"
            initial={false}
            animate={{
              paddingTop: collapsed ? 16 : 32,
              paddingBottom: collapsed ? 16 : 32,
              transition: { type: "spring", stiffness: 300, damping: 30 }
            }}
          >
            <motion.div
              className="flex justify-between items-center mb-4"
              initial={false}
              animate={{
                height: collapsed ? 0 : "auto",
                opacity: collapsed ? 0 : 1,
                marginBottom: collapsed ? 0 : 16,
                overflow: "hidden",
                transition: { duration: 0.3 }
              }}
            >
              <motion.h2
                className="text-2xl font-bold relative z-10"
                initial={false}
                animate={{ opacity: collapsed ? 0 : 1, transition: { duration: 0.2 } }}
              >
                My Job Listings
              </motion.h2>
              <Button
                className="bg-white text-blue-700 hover:bg-blue-100 font-semibold"
                style={{
                  opacity: collapsed ? 0 : 1,
                  pointerEvents: collapsed ? "none" : "auto",
                  transition: "opacity 0.2s"
                }}
                onClick={() => router.push("/employers/jobs/post-a-job")}
              >
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
            </motion.div>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search job title or keywords"
                  className="pl-10 border-blue-200 focus-visible:ring-blue-500 bg-white text-black"
                />
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <select className="h-10 rounded-md border border-blue-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-8 text-black">
                    <option>All Locations</option>
                    <option>Remote</option>
                    <option>Onsite</option>
                    <option>Hybrid</option>
                  </select>
                  <MapPin className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                </div>
                <div className="relative">
                  <select className="h-10 rounded-md border border-blue-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-8 text-black">
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
        <div className="flex overflow-x-auto pb-2 pt-2 mb-2 scrollbar-hide">
          <div className="flex space-x-2">
            {tabs.map((tab) => (
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

        <div className="flex justify-between items-center mb-5 mt-5">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium text-blue-600">{filteredJobs.length}</span> {activeTab === "all" ? "job listings" : `${activeTab} job listings`}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select className="mr-3 text-sm border-none bg-transparent focus:ring-0 text-blue-600 font-medium cursor-pointer">
              <option>Newest first</option>
              <option>Oldest first</option>
              <option>Most applications</option>
              <option>Closing soon</option>
            </select>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-4 mr-2 mb-24 pb-40">
          {loading && listLoadAnimation && (
            <div className="flex flex-col items-center justify-center">
              <div className="w-80 h-80">
                <Lottie animationData={listLoadAnimation} loop autoPlay />
              </div>
              <span className="text-blue-500 font-semibold text-lg -mt-10">Fetching job listings...</span>
            </div>
          )}
          {filteredJobs.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <span className="flex justify-center items-center mb-2">
                <FaFolderOpen className="text-gray-400 h-40 w-40" />
              </span>
              <div className="text-gray-500 text-center">Nothing to see here.</div>
            </div>
          ) : (
            !loading && sortJobsActiveFirst(filteredJobs).map((job) => (
              <EmployerJobCard
                key={job.id}
                job={job}
                isSelected={selectedJob === job.id}
                onSelect={() => onSelectJob(job.id)}
                onEdit={() => {
                  setCurrentJobId(job.id);
                  setShowQuickApply(true);
                }}
              />
            ))
         ) }
        </div>

        {/* Quick Edit Modal */}
        {showQuickApply && (
          <QuickEditModal
            open={showQuickApply}
            job={
              currentJobId !== null
                ? {
                    id: currentJobId,
                    jobTitle: `Job Title ${currentJobId}`,
                    location: "Sample Location",
                    jobDescription: "Sample job description.",
                  }
                : null
            }
            onClose={() => setShowQuickApply(false)}
            onSave={() => setShowQuickApply(false)}
          />
        )}
      </div>
    </div>
  )
}
