"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Filter } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import SavedJobsSearchSection from "./components/saved-job-search-section"
import SavedJobsSidebar from "./components/saved-jobs-sidebar"
import SavedJobCard from "./components/saved-job-card"
import { useRouter } from "next/navigation"

type SavedJob = {
  id: string
  title?: string
  job_title?: string
  description?: string
  location?: string
  type?: string
  company?: string
  savedDate?: string
  status?: string
  match_percentage?: number
  pay_type?: string
  pay_amount?: string | number
  created_at?: string
  remote_options?: string
  skills?: string[]
}

export default function SavedJobsPage() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [showProfileColumn, setShowProfileColumn] = useState(true)
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
  const [filteredJobs, setFilteredJobs] = useState<SavedJob[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState("recent")
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)
  const jobsPerPage = 5
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  useEffect(() => {
    document.documentElement.classList.add("overflow-hidden")
    return () => {
      document.documentElement.classList.remove("overflow-hidden")
    }
  }, [])

  useEffect(() => {
    fetch("/api/students/job-listings/saved-jobs")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.jobs)) {
          setSavedJobs(
            data.jobs.map((job: Record<string, unknown>) => ({
              ...job,
              savedDate: (job as { saved_at?: string; created_at?: string }).saved_at || (job as { created_at?: string }).created_at,
              id: (job as { id?: string; job_id?: string; jobId?: string }).id || (job as { job_id?: string }).job_id || (job as { jobId?: string }).jobId,
            })),
          )
        }
      })
  }, [])

  useEffect(() => {
    let filtered = [...savedJobs]

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (job) =>
          (job.title || job.job_title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (job.company || "").toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (sortBy === "recent") {
      filtered.sort(
        (a, b) =>
          new Date(b.savedDate || b.created_at || "").getTime() - new Date(a.savedDate || a.created_at || "").getTime(),
      )
    } else if (sortBy === "match") {
      filtered.sort((a, b) => (b.match_percentage || 0) - (a.match_percentage || 0))
    } else if (sortBy === "company") {
      filtered.sort((a, b) => (a.company || "").localeCompare(b.company || ""))
    }

    setFilteredJobs(filtered)
    setCurrentPage(1)
  }, [savedJobs, searchQuery, sortBy])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleRemoveJob = async (jobId: number | string) => {
    await fetch("/api/students/job-listings/saved-jobs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    })
    setSavedJobs((prev) => prev.filter((job) => job.id !== jobId))
    if (selectedJob === String(jobId)) {
      setSelectedJob(null)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = setTimeout(() => {
        if (scrollContainerRef.current!.scrollTop > 50) {
          setIsHeaderCollapsed(true)
        } else {
          setIsHeaderCollapsed(false)
        }
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
  }, [])

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)
  const currentJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage)

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
      <div className="flex flex-col items-center gap-2 min-h-[80px]">
        <div className="flex items-center gap-1 relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <div className="flex items-center relative mx-2">
            {visiblePages.map((page, index) => (
              <div key={`${page}-${index}`} className="relative">
                {page === "…" ? (
                  <span className="px-3 py-2 text-gray-400 text-sm">…</span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page as number)}
                    className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "border-blue-200 text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-sm text-blue-600" style={{ minHeight: 20 }}>
          Page {currentPage} of {totalPages}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
      {/* Mobile Navigation */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm md:hidden">
        <motion.h1
          className="text-lg font-bold text-blue-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Saved Jobs
        </motion.h1>
      </div>

      <div className="flex flex-col md:flex-row h-[calc(100vh-56px)] md:h-screen bg-gradient-to-br from-blue-50 to-sky-100">
        {/* Left Column - Sidebar */}
        {showProfileColumn && (
          <div className="hidden md:block w-80 flex-shrink-0 overflow-y-auto border-r border-blue-200 relative">
            <button
              className="absolute top-2 right-2 z-20 bg-white border border-blue-200 rounded-full p-1 shadow hover:bg-blue-50 transition-colors"
              title="Hide Column"
              onClick={() => setShowProfileColumn(false)}
            >
              <ChevronLeft className="w-4 h-4 text-blue-600" />
            </button>
            <div className="p-4 mt-1">
              <SavedJobsSidebar />
            </div>
          </div>
        )}

        {!showProfileColumn && (
          <div className="hidden md:flex w-6 flex-shrink-0 items-start justify-center pt-4">
            <button
              className="bg-white border border-blue-200 rounded-full p-1 shadow hover:bg-blue-50 transition-colors"
              title="Show Sidebar"
              onClick={() => setShowProfileColumn(true)}
            >
              <ChevronRight className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        )}

        {/* Middle Column - Saved Jobs List */}
        <div className="flex-1 overflow-y-auto" ref={scrollContainerRef}>
          <div className="p-4">
            <SavedJobsSearchSection onSearch={handleSearch} isCollapsed={isHeaderCollapsed} />

            {/* Controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-blue-600">{filteredJobs.length} saved jobs</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-600">Sort by</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white px-3 py-1 rounded-full text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-50"
                  >
                    <option value="recent">Recently Saved</option>
                    <option value="match">Best Match</option>
                    <option value="company">Company Name</option>
                  </select>
                </div>
              </div>
              <Button
                variant="outline"
                className="bg-white px-3 py-1 rounded-full text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-50"
              >
                <Filter className="w-4 h-4 mr-1" />
                Filters
              </Button>
            </div>

            {/* Jobs List */}
            <div className="space-y-4 mb-20">
              {currentJobs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg mb-2">No saved jobs found</div>
                  <div className="text-gray-400 text-sm">
                    {searchQuery ? "Try adjusting your search terms" : "Start saving jobs to see them here"}
                  </div>
                </div>
              ) : (
                currentJobs.map((job) => (
                  <SavedJobCard
                    key={job.id}
                    isSelected={selectedJob === String(job.id)}
                    onSelect={() => setSelectedJob(selectedJob === String(job.id) ? null : String(job.id))}
                    onQuickApply={() => {}}
                    onRemove={handleRemoveJob}
                    job={job}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>

        {/* Right Column - Job Details (when selected) */}
        {selectedJob && (
          <div className="hidden lg:block w-[35%] max-w-[600px] flex-shrink-0 overflow-y-auto border-l border-blue-200">
            <div className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-blue-600 mb-2">Job Details</h3>
                <p className="text-gray-600 mb-4">Detailed view for selected job would appear here</p>
                <Button
                  onClick={() => router.push("/students/jobs/job-listings")}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Close Details
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
