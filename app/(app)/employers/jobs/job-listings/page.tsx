"use client"

import React, { useState, useRef, useEffect } from "react"
import {
  Search,
  MapPin,
  Archive,
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Drawer from "@mui/material/Drawer"
import EmployerJobCard, { EmployerJobCardJob, sortJobsActiveFirst } from "./components/job-cards"
import EmployerJobOverview from "./components/tabs/overview-tab"
import CandidateMatches from "./components/candidate-matches"
import TopJobListing from "./top-job-listing"
import { useRouter, useSearchParams } from "next/navigation"
import Lottie from "lottie-react"
import { FaFolderOpen } from "react-icons/fa6"
import QuickEditModal from "./components/quick-edit-modal"
import DraftsModal from "./components/drafts-modal"
import DuplicateModal from "./components/duplicate-modal"

export default function JobListingPage() {
  useEffect(() => {
    document.body.classList.remove("overflow-hidden")
    document.body.classList.add("overflow-hidden")

    window.scrollTo(0, 0)

    return () => {
      document.body.classList.remove("overflow-hidden")
    }
  }, [])

  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showProfileColumn, setShowProfileColumn] = useState(true)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editJobData, setEditJobData] = useState<Record<string, unknown> | null>(null)
  const [draftsModalOpen, setDraftsModalOpen] = useState(false)
  const [draftsModalData, setDraftsModalData] = useState<Record<string, unknown> | null>(null)
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false)
  const [duplicateModalData, setDuplicateModalData] = useState<Record<string, unknown> | null>(null)

  const refetchRef = useRef<(() => void) | null>(null)

  const rightSectionRef = useRef<HTMLDivElement | null>(null)
  const leftSectionRef = useRef<HTMLDivElement | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleJobSelect = (id: string) => {
    router.push(`/employers/jobs/job-listings?job=${id}`)
  }

  const closeModal = () => {
    router.push("/employers/jobs/job-listings")
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

  useEffect(() => {
    const jobParam = searchParams?.get("job")
    if (jobParam) {
      setSelectedJob(jobParam)
      setIsModalOpen(true)
    } else {
      setSelectedJob(null)
      setIsModalOpen(false)
    }
  }, [searchParams])

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
            <JobListings
              onSelectJob={handleJobSelect}
              selectedJob={selectedJob}
              onEditJob={jobData => {
                setEditJobData(jobData)
                setEditModalOpen(true)
              }}
              setDraftsModalOpen={setDraftsModalOpen}
              setDraftsModalData={setDraftsModalData}
              setDuplicateModalOpen={setDuplicateModalOpen}
              setDuplicateModalData={setDuplicateModalData}
              refetchRef={refetchRef}
            />
          </div>
        </div>
      </div>

      {/* Employer Job Overview Modal */}
      {isModalOpen && selectedJob && (
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

      <QuickEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        draftData={editJobData}
        onSuccess={() => {
          if (refetchRef.current) {
            refetchRef.current()
          }
        }}
      />
      <DraftsModal
        open={draftsModalOpen}
        onClose={() => setDraftsModalOpen(false)}
        draftData={draftsModalData}
        onSuccess={() => {
          if (refetchRef.current) {
            refetchRef.current()
          }
        }}
      />
      <DuplicateModal
        open={duplicateModalOpen}
        onClose={() => setDuplicateModalOpen(false)}
        jobData={duplicateModalData}
        onSuccess={() => {
          if (refetchRef.current) {
            refetchRef.current()
          }
        }}
      />
    </div>
  )
}

// Mobile User Profile Component
function MobileUserProfile() {
  return <UserProfile />
}

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
function JobListings({
  onSelectJob,
  selectedJob,
  onEditJob,
  setDraftsModalOpen,
  setDraftsModalData,
  setDuplicateModalOpen,
  setDuplicateModalData,
  refetchRef,
}: {
  onSelectJob: (id: string) => void
  selectedJob: string | null
  onEditJob: (jobData: Record<string, unknown>) => void
  setDraftsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setDraftsModalData: React.Dispatch<React.SetStateAction<Record<string, unknown> | null>>
  setDuplicateModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setDuplicateModalData: React.Dispatch<React.SetStateAction<Record<string, unknown> | null>>
  refetchRef: React.MutableRefObject<(() => void) | null>
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [sortOption, setSortOption] = useState("Newest first")
  const [locationFilter, setLocationFilter] = useState("All job types")
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const debounceRef = useRef<number | null>(null)
  const collapsedRef = useRef(false)
  const [collapsed, setCollapsed] = useState(false)
  const [jobs, setJobs] = useState<EmployerJobCardJob[]>([])
  const [drafts, setDrafts] = useState<EmployerJobCardJob[]>([])
  const [archivedJobs, setArchivedJobs] = useState<EmployerJobCardJob[]>([])
  const [loading, setLoading] = useState(true)
  const [listLoadAnimation, setListLoadAnimation] = useState<object | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoading(true)
    fetch("/animations/list-load.json")
      .then(res => res.json())
      .then(data => setListLoadAnimation(data))
    
    Promise.all([
      fetch("/api/job-listings/job-cards").then(res => res.json()),
      fetch("/api/job-listings/drafts").then(res => res.json()),
      fetch("/api/job-listings/archived").then(res => res.json())
    ]).then(([jobsData, draftsData, archivedData]) => {
      setJobs(Array.isArray(jobsData) ? jobsData : jobsData.data || [])
      
      const mappedDrafts: EmployerJobCardJob[] = Array.isArray(draftsData.data)
        ? draftsData.data.map((draft: Record<string, unknown>) => ({
            id: String(draft.id),
            title: String(draft.job_title ?? ""),
            status: "Draft",
            closing: "",
            type: String(draft.work_type ?? ""),
            salary: String(draft.pay_amount ?? ""),
            posted: String(draft.created_at ?? ""),
            recommended_course: typeof draft.recommended_course === "string" ? draft.recommended_course : undefined,
            paused: false,
            companyName: undefined,
          }))
        : []
      setDrafts(mappedDrafts)
      
      setArchivedJobs(Array.isArray(archivedData.data) ? archivedData.data : [])
      setLoading(false)
    }).catch(() => {
      setJobs([])
      setDrafts([])
      setArchivedJobs([])
      setLoading(false)
    })
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
    if (job.is_archived) return "archived"
    return "active"
  }

  const tabCounts = jobs.concat(drafts).concat(archivedJobs).reduce(
    (acc, job) => {
      const status = getJobStatus(job)
      acc.all++
      if (status === "active") acc.active++
      if (status === "paused") acc.paused++
      if (status === "closed") acc.closed++
      if (status === "draft") acc.draft++
      if (status === "archived") acc.archived++
      return acc
    },
    { all: 0, active: 0, paused: 0, closed: 0, draft: 0, archived: 0 }
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const filteredJobs = jobs.filter((job) => {
    const status = getJobStatus(job)
    const matchesTab = activeTab === "all" || status === activeTab
    
    let matchesLocation = true
    if (locationFilter !== "All job types") {
      if (locationFilter.toLowerCase() === "internship") {
        matchesLocation = job.type?.toLowerCase() === "internship" || job.type?.toLowerCase() === "ojt/internship"
      } else {
        matchesLocation = job.type?.toLowerCase() === locationFilter.toLowerCase()
      }
    }

    let matchesSearch = true
    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase()
      matchesSearch = 
        (job.title?.toLowerCase().includes(searchLower) ?? false) ||
        (job.type?.toLowerCase().includes(searchLower) ?? false) ||
        (job.companyName?.toLowerCase().includes(searchLower) ?? false)
    }

    return matchesTab && matchesLocation && matchesSearch
  })

  const filteredDrafts = drafts
  const filteredArchivedJobs = archivedJobs.filter((job) => {
    let matchesLocation = true
    if (locationFilter !== "All job types") {
      if (locationFilter.toLowerCase() === "internship") {
        matchesLocation = job.type?.toLowerCase() === "internship" || job.type?.toLowerCase() === "ojt/internship"
      } else {
        matchesLocation = job.type?.toLowerCase() === locationFilter.toLowerCase()
      }
    }

    let matchesSearch = true
    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase()
      matchesSearch = 
        (job.title?.toLowerCase().includes(searchLower) ?? false) ||
        (job.type?.toLowerCase().includes(searchLower) ?? false)
    }

    return matchesLocation && matchesSearch
  })

  function parsePostedToDate(posted: string): Date {
    if (!posted) return new Date(0)
    if (posted.includes("just now")) return new Date()
    const match = posted.match(/(\d+)\s+(minute|hour|day|week|month|year)s?\s+ago/)
    if (!match) return new Date(0)
    const value = parseInt(match[1])
    const unit = match[2]
    const now = new Date()
    switch (unit) {
      case "minute": now.setMinutes(now.getMinutes() - value); break
      case "hour": now.setHours(now.getHours() - value); break
      case "day": now.setDate(now.getDate() - value); break
      case "week": now.setDate(now.getDate() - value * 7); break
      case "month": now.setMonth(now.getMonth() - value); break
      case "year": now.setFullYear(now.getFullYear() - value); break
    }
    return now
  }

  function parseClosingToDays(closing: string): number {
    if (!closing) return Number.MAX_SAFE_INTEGER
    if (closing === "Closed") return Number.MAX_SAFE_INTEGER
    const match = closing.match(/(\d+)/)
    if (!match) return Number.MAX_SAFE_INTEGER
    return parseInt(match[1])
  }

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortOption === "Newest first") {
      return parsePostedToDate(b.posted).getTime() - parsePostedToDate(a.posted).getTime()
    }
    if (sortOption === "Oldest first") {
      return parsePostedToDate(a.posted).getTime() - parsePostedToDate(b.posted).getTime()
    }
    if (sortOption === "Most applications") {
      return (b.total_applicants ?? 0) - (a.total_applicants ?? 0)
    }
    if (sortOption === "Closing soon") {
      return parseClosingToDays(a.closing) - parseClosingToDays(b.closing)
    }
    return 0
  })

  const tabs = [
    { id: "all", label: "All Listings", count: tabCounts.all },
    { id: "active", label: "Active", count: tabCounts.active },
    { id: "paused", label: "Paused", count: tabCounts.paused },
    { id: "closed", label: "Closed", count: tabCounts.closed },
    { id: "draft", label: "Drafts", count: tabCounts.draft },
    { id: "archived", label: "Archived", count: tabCounts.archived, icon: Archive },
  ]

  const handleViewDraftDetails = async (draft: EmployerJobCardJob) => {
    setDraftsModalData(draft)
    setDraftsModalOpen(true)
  }

  const handleEditJob = (jobData: Record<string, unknown>) => {
    onEditJob(jobData)
    if (jobData && jobData.id) {
      moveJobToTop(String(jobData.id))
    }
  }

  function moveJobToTop(jobId: string) {
    setJobs(prevJobs => {
      const idx = prevJobs.findIndex(j => String(j.id) === String(jobId));
      if (idx === -1) return prevJobs;
      const updatedJob = prevJobs[idx];
      return [updatedJob, ...prevJobs.slice(0, idx), ...prevJobs.slice(idx + 1)];
    });
  }

  const refetchData = React.useCallback(async () => {
    setLoading(true)
    try {
      const [jobsRes, draftsRes, archivedRes] = await Promise.all([
        fetch("/api/job-listings/job-cards"),
        fetch("/api/job-listings/drafts"),
        fetch("/api/job-listings/archived")
      ])
      
      const jobsData = await jobsRes.json()
      setJobs(Array.isArray(jobsData) ? jobsData : jobsData.data || [])
      
      const draftsData = await draftsRes.json()
      const mappedDrafts: EmployerJobCardJob[] = Array.isArray(draftsData.data)
        ? draftsData.data.map((draft: Record<string, unknown>) => ({
            id: String(draft.id),
            title: String(draft.job_title ?? ""),
            status: "Draft",
            closing: "",
            type: String(draft.work_type ?? ""),
            salary: String(draft.pay_amount ?? ""),
            posted: String(draft.created_at ?? ""),
            recommended_course: typeof draft.recommended_course === "string" ? draft.recommended_course : undefined,
            paused: false,
            companyName: undefined,
          }))
        : []
      setDrafts(mappedDrafts)
      
      const archivedData = await archivedRes.json()
      setArchivedJobs(Array.isArray(archivedData.data) ? archivedData.data : [])
    } catch (error) {
      console.error("Error refetching data:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    refetchRef.current = refetchData
  }, [refetchData])

  const handleSearch = () => {
    setDebouncedSearchTerm(searchTerm)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className="flex gap-2">
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="h-10 w-[180px] border-blue-200 bg-white text-black focus:ring-2 focus:ring-blue-500">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <SelectValue placeholder="All job types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All job types">All job types</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSearch}>
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
                {tab.icon && <tab.icon className="h-4 w-4" />}
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
            Showing <span className="font-medium text-blue-600">
              {activeTab === "archived" ? filteredArchivedJobs.length : filteredJobs.length}
            </span> {activeTab === "all" ? "job listings" : `${activeTab} job listings`}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="h-8 w-[140px] border-none bg-transparent text-blue-600 font-medium focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Newest first">Newest first</SelectItem>
                <SelectItem value="Oldest first">Oldest first</SelectItem>
                <SelectItem value="Most applications">Most applications</SelectItem>
                <SelectItem value="Closing soon">Closing soon</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4 mr-2 mb-24 pb-40">
          {loading && listLoadAnimation && (
            <div className="flex flex-col items-center justify-center">
              <div className="w-80 h-80">
                <Lottie animationData={listLoadAnimation} loop autoPlay />
              </div>
              <span className="text-blue-500 font-semibold text-lg -mt-10">Fetching job listings...</span>
            </div>
          )}
          {activeTab === "draft" ? (
            filteredDrafts.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <span className="flex justify-center items-center mb-2">
                  <FaFolderOpen className="text-gray-400 h-40 w-40" />
                </span>
                <div className="text-gray-500 text-center">No drafts found.</div>
              </div>
            ) : (
              !loading && filteredDrafts.map((draft) => (
                <EmployerJobCard
                  key={draft.id}
                  job={draft}
                  isSelected={selectedJob === String(draft.id)}
                  onSelect={() => handleViewDraftDetails(draft)}
                  onEdit={() => onEditJob(draft)}
                  onStatusChange={refetchData}
                />
              ))
            )
          ) : activeTab === "archived" ? (
            filteredArchivedJobs.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <span className="flex justify-center items-center mb-2">
                  <FaFolderOpen className="text-gray-400 h-40 w-40" />
                </span>
                <div className="text-gray-500 text-center">No archived jobs found.</div>
              </div>
            ) : (
              !loading && filteredArchivedJobs.map((job) => (
                <EmployerJobCard
                  key={job.id}
                  job={job}
                  isSelected={selectedJob === String(job.id)}
                  onSelect={() => onSelectJob(String(job.id))}
                  onEdit={() => handleEditJob(job)}
                  onDuplicate={(jobData) => {
                    setDuplicateModalData(jobData)
                    setDuplicateModalOpen(true)
                  }}
                  onStatusChange={refetchData}
                />
              ))
            )
          ) : (
            filteredJobs.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <span className="flex justify-center items-center mb-2">
                  <FaFolderOpen className="text-gray-400 h-40 w-40" />
                </span>
                <div className="text-gray-500 text-center">Nothing to see here.</div>
              </div>
            ) : (
              !loading && sortJobsActiveFirst(sortedJobs).map((job) => (
                <EmployerJobCard
                  key={job.id}
                  job={job}
                  isSelected={selectedJob === String(job.id)}
                  onSelect={() => onSelectJob(String(job.id))}
                  onEdit={() => handleEditJob(job)}
                  onDuplicate={(jobData) => {
                    setDuplicateModalData(jobData)
                    setDuplicateModalOpen(true)
                  }}
                  onStatusChange={refetchData}
                />
              ))
            )
          )}
        </div>
      </div>
    </div>
  )
}