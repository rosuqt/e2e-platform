"use client"

import { useState, useRef, useEffect } from "react"
import {
  Search,
  ChevronDown,
  X,
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

import Drawer from "@mui/material/Drawer"
import { createPortal } from "react-dom"
import FilterModal from "../job-listings/components/filter-modal"
import JobCard from "../job-listings/components/job-cards"
import JobDetails from "../job-listings/components/job-details"
import { useRouter } from "next/navigation"
import MatchAnalysis from "./components/match-analysis"
import YourSkills from "./components/your-skills"
import { GiFairyWand } from "react-icons/gi"
import Lottie from "lottie-react"
import notFoundAnimation from "../../../../../public/animations/not-found.json"
import loadingAnimation from "../../../../../public/animations/loading_purpleblue.json"

export default function JobListingPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false)
  const [showProfileColumn, setShowProfileColumn] = useState(true) 
  const router = useRouter();

  const rightSectionRef = useRef<HTMLDivElement | null>(null)
  const leftSectionRef = useRef<HTMLDivElement | null>(null)

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-sky-100">

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


      </div>

      {/* Main Content Area with 3 columns */}
      <div
        className={`
          flex flex-col md:flex-row h-[calc(100vh-56px)] md:h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-sky-100
        `}
      >
        {/* Left Column - User Profile - Hidden on mobile, visible on md and up */}
        {showProfileColumn && (
          <div className="hidden md:block w-80 flex-shrink-0 border-r border-blue-200 relative">
            {/* Go Back Button */}
            <button
              className="absolute right-2 z-20 bg-white border border-blue-200 rounded-full p-1 shadow hover:bg-blue-50 transition-colors"
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
            <UserProfile router={router} />
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
        {/* Middle Column - Job Listings - SCROLLABLE */}
        <div
          ref={leftSectionRef}
          className={`
            flex-1 overflow-y-auto
            transition-all duration-300
            ${selectedJob !== null ? "lg:basis-2/3" : ""}
          `}
        >
          <JobListings selectedJob={selectedJob} onSelectJob={setSelectedJob} />
        </div>

        {/* Right Column - Job Details - Only visible when a job is selected */}
        {selectedJob !== null && (
          <div
            ref={rightSectionRef}
            className={`
              hidden lg:block flex-shrink-0 overflow-y-auto border-l border-blue-200 transition-all duration-300 ease-in-out
              w-[35%] max-w-[600px]
            `}
          >
            <JobDetails
              onClose={() => setSelectedJob(null)}
              jobId={selectedJob || ""}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// Mobile User Profile Component
function MobileUserProfile() {

  const router = useRouter();
  return <UserProfile router={router} />
}

// User Profile Component
function UserProfile({ router }: { router?: ReturnType<typeof useRouter> }) {
  return (
    <div className="p-4 mt-1">

      <MatchAnalysis />

      <YourSkills />

      {/* Go Back Button */}
      {router && (
        <button
          className="flex items-center gap-2 px-3 py-2  bg-white border border-blue-200 rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
          onClick={() => router.push("/students/jobs/job-listings")}
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
            className="lucide lucide-arrow-left"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Go Back to Job Listings
        </button>
      )}
    </div>
  )
}

// Job Listings Component
function JobListings({ onSelectJob, selectedJob }: { onSelectJob: (id: string | null) => void; selectedJob: string | null }) {
  const [jobIds, setJobIds] = useState<(string | number)[]>([])

  type Job = {
    id: string | number
    job_id?: string | number
    title?: string
    job_title?: string
    company?: string
    registered_employers?: { company_name?: string }
    employers?: { company_name?: string; first_name?: string; last_name?: string }
    posted_at?: string
    gpt_score?: number
    location?: string
    type?: string
    salary?: number
    error?: boolean
    [key: string]: unknown
  }
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [showQuickApply, setShowQuickApply] = useState(false)
  const [currentJobId, setCurrentJobId] = useState<number | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeTab] = useState("recommended")
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchInput, setSearchInput] = useState("")

  type Filters = {
    location?: string
    type?: string
    salaryMin?: number
    salaryMax?: number
  }
  const [filters, setFilters] = useState<Filters>({})
  const [sortBy, setSortBy] = useState("relevant")
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPagesState, setTotalPagesState] = useState<number>(1)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch("/api/match-booster/fetchJobMatches", { method: "POST" })
      .then(res => res.json())
      .then(data => {
        const ids = Array.isArray(data.jobs) ? data.jobs.map((j: Job) => j.id || j.job_id) : []
        setJobIds(ids)
        setTotalPagesState(Math.max(1, Math.ceil(ids.length / limit)))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [limit])

  useEffect(() => {
    if (jobIds.length === 0) {
      setJobs([])
      return
    }
    setLoading(true)
    Promise.all(
      jobIds.map(id =>
        fetch(`/api/students/job-listings/${id}`)
          .then(res => res.json())
          .catch(() => null)
      )
    ).then(results => {
      let filteredSortedJobs = results
        .filter((j: Job | null): j is Job => !!j && !j.error)
      if (sortBy === "score-desc") {
        filteredSortedJobs = filteredSortedJobs.slice().sort((a, b) => {
          const aScore = typeof a.gpt_score === "number" ? a.gpt_score : -Infinity;
          const bScore = typeof b.gpt_score === "number" ? b.gpt_score : -Infinity;
          if (aScore === -Infinity && bScore === -Infinity) return 0;
          if (aScore === -Infinity) return 1;
          if (bScore === -Infinity) return -1;
          return bScore - aScore;
        });
      } else if (sortBy === "score-asc") {
        filteredSortedJobs = filteredSortedJobs.slice().sort((a, b) => {
          const aScore = typeof a.gpt_score === "number" ? a.gpt_score : Infinity;
          const bScore = typeof b.gpt_score === "number" ? b.gpt_score : Infinity;
          if (aScore === Infinity && bScore === Infinity) return 0;
          if (aScore === Infinity) return 1;
          if (bScore === Infinity) return -1;
          return aScore - bScore;
        });
      } else if (sortBy === "newest") {
        filteredSortedJobs = filteredSortedJobs.slice().sort((a, b) => {
          const aDate = a.posted_at ? new Date(a.posted_at).getTime() : 0;
          const bDate = b.posted_at ? new Date(b.posted_at).getTime() : 0;
          return bDate - aDate;
        });
      }
      setJobs(filteredSortedJobs);
      setLoading(false);
    })
  }, [jobIds, sortBy])

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = setTimeout(() => {
        setIsHeaderCollapsed(scrollContainerRef.current!.scrollTop > 50)
      }, 100)
    }
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll)
      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll)
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [isHeaderCollapsed])

  type TabKey = "recommended" | "recent"
  const tabFilters: Record<TabKey, (job: Job) => boolean> = {
    recommended: () => true,
    recent: (job: Job) => {
      if (!job.posted_at) return false
      const postedDate = new Date(job.posted_at)
      const now = new Date()
      return (now.getTime() - postedDate.getTime()) < 1000 * 60 * 60 * 24 * 7
    },
  }

  const applyFilters = (jobList: Job[]) => {
    let filtered = jobList
    if (activeTab && tabFilters[activeTab as TabKey]) {
      filtered = filtered.filter(tabFilters[activeTab as TabKey])
    }
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase()
      filtered = filtered.filter(
        job => {
          const title =
            (job.title || job.job_title || "").toString().trim().toLowerCase()
          const company =
            (job.company ||
              job.registered_employers?.company_name ||
              job.employers?.company_name ||
              (job.employers?.first_name ? job.employers?.first_name + " " + job.employers?.last_name : "") ||
              "").toString().trim().toLowerCase()
          return title.includes(term) || company.includes(term)
        }
      )
    }
    if (filters.location !== undefined) {
      filtered = filtered.filter(
        job =>
          job.location !== undefined &&
          job.location.toLowerCase().includes(filters.location!.toLowerCase())
      )
    }
    if (filters.type) {
      filtered = filtered.filter(job => job.type && job.type === filters.type)
    }
    if (filters.salaryMin !== undefined) {
      filtered = filtered.filter(job => job.salary !== undefined && filters.salaryMin !== undefined && job.salary >= filters.salaryMin)
    }
    if (typeof filters.salaryMax === "number") {
      filtered = filtered.filter(job => job.salary !== undefined && job.salary <= filters.salaryMax!)
    }
    return filtered
  }

  const filteredJobs = applyFilters(jobs)
  const paginatedJobs = filteredJobs.slice((page - 1) * limit, page * limit)

  let matchMessage = ""
  if (filteredJobs.length >= 10) {
    matchMessage = `You’re on a roll! We found ${filteredJobs.length} job matches that could be your next big step!`
  } else if (filteredJobs.length >= 4) {
    matchMessage = `Your effort’s paying off—${filteredJobs.length} jobs match your skills and goals!`
  } else {
    matchMessage = `Don’t be discouraged — new opportunities appear every day!`
  }

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto h-full">
        <div className="sticky top-0 z-30 pt-2 pb-4 bg-gradient-to-br from-blue-50 to-sky-100 mx-2 -mb-6">
          <motion.div
            className=" mt-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 rounded-2xl shadow-xl text-white  relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              padding: isHeaderCollapsed ? "8px 16px" : "48px 16px",
              transition: "padding 0.3s ease",
            }}
          >
            <motion.div
              style={{
                height: isHeaderCollapsed ? 0 : "auto",
                opacity: isHeaderCollapsed ? 0 : 1,
                overflow: "hidden",
                marginBottom: isHeaderCollapsed ? 0 : 16,
                transition: "height 0.5s ease, opacity 0.5s ease, margin-bottom 0.5s ease",
              }}
            >
              <motion.h2
                className="text-2xl font-bold relative z-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Your Job Matches
              </motion.h2>

              <motion.p
                className="text-blue-100 text-sm relative z-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Discover job matches tailored to your skills and interests. See opportunities picked just for you and take the next step in your career!
              </motion.p>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-2 flex flex-col sm:flex-row relative z-10 items-center justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="relative flex-1 w-full">
                <Input
                  type="text"
                  placeholder="Search jobs"
                  className="border-0 text-black focus-visible:ring-0 focus-visible:ring-offset-0 mb-1 sm:mb-0 flex-1 pr-10"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                />
                {searchInput && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                    onClick={() => {
                      setSearchInput("")
                      setSearchTerm("")
                    }}
                    tabIndex={0}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Button
                className="bg-blue-400 hover:bg-blue-700 w-full sm:w-auto"
                onClick={() => setSearchTerm(searchInput)}
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </motion.div>
            <div className="flex items-center justify-between mt-2">
              <motion.div
                className="flex items-center text-base text-white font-semibold"
                initial={{ x: -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.4 }}
              >
                <GiFairyWand className="mr-2 h-5 w-5" />
                {loading ? (
                  <span className="h-5 w-48 bg-white/30 rounded animate-pulse inline-block" />
                ) : (
                  <motion.span
                    initial={{ opacity: 1 }}
                    animate={{ opacity: selectedJob === null ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ display: "inline-block" }}
                  >
                    {matchMessage}
                  </motion.span>
                )}
              </motion.div>
              <div className="flex items-center gap-4">
                <div className="relative flex items-center gap-1">
                  <span className="text-sm font-medium text-white">Sort by</span>
                  <Select
                    value={sortBy}
                    onValueChange={val => setSortBy(val)}
                  >
                    <SelectTrigger className="bg-white/10 px-3 py-1 rounded-full text-sm font-medium text-white border border-white/30 hover:bg-white/20 flex items-center w-[180px] h-8">
                      <SelectValue>
                        {(() => {
                          if (sortBy === "newest") return "Newest";
                          return "Relevant";
                        })()}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevant">Relevant</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="bg-white/10 px-3 py-1 rounded-full text-sm font-medium text-white border border-white/30 hover:bg-white/20"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  {isFilterOpen ? "Close Filters" : "Filters"}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">

            </div>
          </motion.div>

          <div className="flex items-center justify-between pb-2 mb-2 scrollbar-hide">

          </div>
        </div>

        <div className="space-y-4 p-4 mb-20 ">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-44 h-44 mx-auto">
                <Lottie animationData={loadingAnimation} loop={true} />
              </div>
              <span className="mt-4 text-blue-700 font-semibold text-base animate-pulse">
                Loading job matches, please wait...
              </span>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <div className="bg-white rounded-full shadow-lg flex items-center justify-center mt-10 w-64 h-64">
                <Lottie animationData={notFoundAnimation} loop={true} />
              </div>
              <span className="mt-4 text-gray-500 font-medium text-base text-center">
                Uh oh, looks like your perfect match hasn’t shown up yet! Try tweaking your search or check back soon.
              </span>
            </div>
          ) : (
            paginatedJobs.map(
              ({
                id,
                gpt_score,
                ...rest
              }) => (
                <JobCard
                  key={id}
                  id={id}
                  job={{ ...rest, id, gpt_score }}
                  isSelected={selectedJob === String(id)}
                  onSelect={() => onSelectJob(selectedJob === String(id) ? null : String(id))}
                  onQuickApply={() => {
                    setCurrentJobId(typeof id === "number" ? id : Number(id))
                    setShowQuickApply(true)
                  }}
                />
              )
            )
          ) }
        </div>
        {!loading && filteredJobs.length > 0 && totalPagesState > 1 && (
          <Pagination
            totalPages={totalPagesState}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
      </div>
      {isFilterOpen &&
        createPortal(
          <FilterModal
            onClose={() => setIsFilterOpen(false)}
            onApply={(newFilters: Filters) => {
              setFilters(newFilters)
              setIsFilterOpen(false)
            }}
            currentFilters={filters}
          />,
          document.body
        )}
      {showQuickApply &&
        createPortal(<QuickApplyModal jobId={currentJobId!} onClose={() => setShowQuickApply(false)} />, document.body)}
    </div>
  );
}

// Pagination Component
function Pagination({
  totalPages = 1,
  currentPage = 1,
  onPageChange,
}: {
  totalPages?: number
  currentPage?: number
  onPageChange?: (page: number) => void
}) {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange?.(page)
    }
  }

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "…")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("…", totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex flex-col items-center gap-2 min-h-[130px]">
      <div className="flex items-center gap-1 relative">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 text-gray-600 hover:text-blue-500 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronDown className="w-4 h-4 rotate-90" />
          <span className="text-sm font-medium">Previous</span>
        </button>
        <div className="flex items-center relative mx-4">
          {visiblePages.map((page) => (
            <div key={page} className="relative">
              {page === "…" ? (
                <span className="px-3 py-2 text-gray-400 text-sm">…</span>
              ) : (
                <button
                  onClick={() => handlePageChange(page as number)}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                    currentPage === page ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
                  }`}
                >
                  {page}
                  {currentPage === page && (
                    <motion.div
                      layoutId="pagination-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-blue-500 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <span className="text-sm font-medium">Next</span>
          <ChevronDown className="w-4 h-4 -rotate-90" />
        </button>
      </div>
      <div className="text-sm text-gray-500" style={{ minHeight: 20 }}>
        Page {currentPage} of {totalPages}
      </div>
    </div>
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
