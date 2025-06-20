"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  Search,
  Calendar,
  MapPin,
  FileText,
  Bookmark,
  Filter,
  MoreHorizontal,
  ArrowUpRight,
  ChevronRight,
  CheckCircle,
  ChevronLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RecruiterApplicationDetailsModal } from "./recruiter-application-details"
import InterviewScheduleModal from "./modals/interview-schedule"
import { toast } from "react-toastify"
import Avatar from "@mui/material/Avatar"
import { motion } from "framer-motion"
import {
  MdStars,
  MdOutlineEditCalendar,
  MdRestore
} from "react-icons/md"
import { TbUserSearch } from "react-icons/tb"
import { Menu, MenuItem } from "@mui/material"
import { Briefcase, User, Calendar as CalendarIcon } from "lucide-react"
import Tooltip from "@mui/material/Tooltip"
import { IoIosCloseCircleOutline } from "react-icons/io"
import { Dialog,  DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { RiEmotionSadLine } from "react-icons/ri"
import { LuCalendarCog } from "react-icons/lu"
import { FaRegCalendarTimes } from "react-icons/fa"
import { FaHandHoldingDollar } from "react-icons/fa6"

type Applicant = {
  application_id: string
  job_id: string
  job_title?: string
  status?: string
  first_name?: string
  last_name?: string
  address?: string
  experience_years?: string
  applied_at?: string
  student_id?: string
  profile_image_url?: string
}

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
    <div className="flex flex-col items-center gap-2  min-h-[130px]">
      <div className="flex items-center gap-1 relative">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3   text-gray-600 hover:text-blue-500 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Previous</span>
        </button>
        <div className="flex items-center relative mx-4">
          {visiblePages.map((page, index) => (
            <div key={`${page}-${index}`} className="relative">
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
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="text-sm text-gray-500" style={{ minHeight: 20 }}>
        Page {currentPage} of {totalPages}
      </div>
    </div>
  )
}

function capitalize(str?: string) {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export default function RecruiterApplicationTracker() {
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([])
  const [jobPostings, setJobPostings] = useState<{ id: string; title: string }[]>([])
  const [selectedJob, setSelectedJob] = useState<{ id: string; title: string } | null>(null)
  const [tab, setTab] = useState("all")
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const [page, setPage] = useState(1)
  const limit = 5
  const [loading, setLoading] = useState(true)
  const [interviewModalOpen, setInterviewModalOpen] = useState(false)
  const [interviewApplicant, setInterviewApplicant] = useState<Applicant | null>(null)
  const [companyName, setCompanyName] = useState<string | undefined>(undefined)
  const [employerId, setEmployerId] = useState<string | undefined>(undefined)
  const [editInterviewMode, setEditInterviewMode] = useState(false)
  type InterviewData = {
    date?: string
    time?: string
    location?: string
    [key: string]: unknown
  }
  const [editInterviewData, setEditInterviewData] = useState<InterviewData | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch("/api/employers/applications")
      .then(res => res.json())
      .then(async data => {
    
        let employerIdFromSession: string | undefined
        try {
          const sessionRes = await fetch("/api/auth/session")
          const sessionData = await sessionRes.json()
          employerIdFromSession = sessionData?.user?.employerId
          setEmployerId(employerIdFromSession)
        } catch {}
        if (employerIdFromSession) {
          fetch(`/api/employers/colleagues/fetchCompanyName?employer_id=${employerIdFromSession}`)
            .then(res => res.json())
            .then(companyData => {
              if (companyData.company_name) setCompanyName(companyData.company_name)
            })
        }

        const applicants: Applicant[] = (data.applicants as Applicant[]) || []
        const applicantsWithProfileImg = await Promise.all(
          applicants.map(async (a) => {
            if (!a.student_id) return a
            try {
              const res = await fetch(`/api/employers/applications/getStudentDetails?student_id=${a.student_id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
              })
              const details = await res.json()
              // Debug log
              // console.log("student_id:", a.student_id, "profile_img:", details.profile_img)
              let profile_image_url = ""
              if (details && details.profile_img) {
                const imgPath = details.profile_img
                const signedUrlRes = await fetch("/api/students/get-signed-url", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    bucket: "user.avatars",
                    path: imgPath
                  })
                })
                const signedUrlData = await signedUrlRes.json()
                if (signedUrlData && signedUrlData.signedUrl) {
                  profile_image_url = signedUrlData.signedUrl
                }
              }
              return { ...a, profile_image_url }
            } catch {}
            return a
          })
        )
        setApplicants(applicantsWithProfileImg)
        const jobs = Array.from(
          new Map(
            applicantsWithProfileImg.map((a) => [
              a.job_id,
              { id: a.job_id, title: a.job_title || "Job Posting" },
            ])
          ).values()
        )
        setJobPostings([{ id: "all", title: "All Job Postings" }, ...jobs])
        setSelectedJob({ id: "all", title: "All Job Postings" })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (selectedJob?.id === "all") {
      setFilteredApplicants(applicants)
    } else {
      setFilteredApplicants(applicants.filter(a => a.job_id === selectedJob?.id))
    }
  }, [selectedJob, applicants])

  function getTabStatus(applicantStatus: string | undefined) {
    if (!applicantStatus) return ""
    const status = capitalize(applicantStatus)
    if (status === "Interview scheduled" || status === "Interview Scheduled") return "Interview"
    return status
  }

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

  const handleViewDetails = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const applicant = applicants.find(a => a.application_id === id)
    setSelectedApplicant(applicant || null)
    setIsModalOpen(true)
  }

  const handleInviteToInterview = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const applicant = applicants.find(a => a.application_id === id)
    setInterviewApplicant(applicant || null)
    setInterviewModalOpen(true)
  }

  const handleReschedInterview = async (applicant: Applicant, e: React.MouseEvent) => {
    e.stopPropagation()
    setInterviewApplicant(applicant)
    setEditInterviewMode(true)
    let interviewData = null
    try {
      const res = await fetch(`/api/employers/applications/postInterviewSched?application_id=${applicant.application_id}`)
      if (res.ok) {
        const text = await res.text()
        if (text) {
          interviewData = JSON.parse(text).data || null
        }
      }
    } catch {}
    setEditInterviewData(interviewData)
    setInterviewModalOpen(true)
  }

  const totalApplicants = filteredApplicants.length
  const newApplicants = filteredApplicants.filter(a => capitalize(a.status) === "New").length

  useEffect(() => {
    setPage(1)
  }, [selectedJob, tab, applicants])

  const updateApplicantStatus = async (application_id: string, action: "shortlist" | "reject") => {
    try {
      const res = await fetch("/api/employers/applications/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ application_id, action }),
      })
      const data = await res.json()
      if (res.ok && data.status) {
        setApplicants(prev =>
          prev.map(app =>
            app.application_id === application_id
              ? { ...app, status: capitalize(data.status) }
              : app
          )
        )
        toast.success(
          action === "shortlist"
            ? "Applicant shortlisted!"
            : "Applicant rejected."
        )
      } else {
        toast.error(data.error || "Failed to update status")
      }
    } catch {
      toast.error("Failed to update status")
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
        <div className="container mx-auto p-4">
          <div className="mb-6">
            <div
              className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl shadow-xl text-white mb-4 relative overflow-hidden transition-all duration-300"
              style={{
                padding: isHeaderCollapsed ? "16px" : "32px",
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
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold relative z-1">Applicant Tracking</h2>
                    <p className="text-blue-100 text-sm relative z-1 mt-2">
                      Manage and review all applicants for your job postings
                    </p>
                  </div>
                  <div>
                    <select
                      className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-white border border-white/30"
                      value={selectedJob?.id || ""}
                      onChange={(e) => {
                        const job = jobPostings.find((j) => j.id === e.target.value)
                        if (job) setSelectedJob(job)
                      }}
                    >
                      {jobPostings.map((job) => (
                        <option key={job.id} value={job.id} className="text-gray-800">
                          {job.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 mt-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                    <p className="text-xs text-white/80">Total Applicants</p>
                    <p className="text-xl font-bold text-white">{totalApplicants}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                    <p className="text-xs text-white/80">New Today</p>
                    <p className="text-xl font-bold text-white">{newApplicants}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                    <p className="text-xs text-white/80">Interviews Scheduled</p>
                    <p className="text-xl font-bold text-white">8</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                    <p className="text-xs text-white/80">Offers Extended</p>
                    <p className="text-xl font-bold text-white">2</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-2 flex flex-col sm:flex-row relative z-1  ">
                <Input
                  type="text"
                  placeholder="Search applicants by name, skills, or experience"
                  className="border-0 text-black focus-visible:ring-0 focus-visible:ring-offset-0 mb-1 sm:mb-0"
                />
                <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-2/3" ref={scrollContainerRef}>
              <Card className="shadow-sm border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="mb-2 text-blue-700 text-xl">Your Applicants</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[200px] py-12">
                      <div className="flex items-center justify-center mb-4">
                        <span className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
                      </div>
                      <span className="mt-2 text-blue-700 font-semibold text-base animate-pulse">
                        Fetching applicants, please wait...
                      </span>
                    </div>
                  ) : (
                    <Tabs value={tab} onValueChange={v => { setTab(v); setPage(1); }} className="w-full">
                    <TabsList className="flex w-full border-b border-gray-200">
                      <TabsTrigger value="all" className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent hover:text-blue-600 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600">
                        All
                      </TabsTrigger>
                      <TabsTrigger value="new" className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent hover:text-blue-600 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600">
                        New
                      </TabsTrigger>
                      <TabsTrigger value="shortlisted" className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent hover:text-blue-600 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600">
                        Shortlisted
                      </TabsTrigger>
                      <TabsTrigger value="interview" className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent hover:text-blue-600 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600">
                        Interview
                      </TabsTrigger>
                      <TabsTrigger value="waitlisted" className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent hover:text-blue-600 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600">
                        Waitlisted
                      </TabsTrigger>
                      <TabsTrigger value="rejected" className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent hover:text-blue-600 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600">
                        Rejected
                      </TabsTrigger>
                    </TabsList>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-blue-600">
                          {
                            (() => {
                              if (tab === "all") return filteredApplicants.length
                              return filteredApplicants.filter(a => a.status === tab).length
                            })()
                          } applicants
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-blue-600">Sort by</span>
                          <button className="bg-white px-3 py-1 rounded-full text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 flex items-center gap-1">
                            Match Score
                          </button>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="bg-white px-3 py-1 rounded-full text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Filter className="w-4 h-4 mr-1" />
                        Filters
                      </Button>
                    </div>

                    <TabsContent value="all" className="mt-4 space-y-4">
                      {
                        (() => {
                          const filtered = filteredApplicants
                          const totalPages = Math.max(1, Math.ceil(filtered.length / limit))
                          const paginated = filtered.slice((page - 1) * limit, page * limit)
                          if (filtered.length === 0) {
                            return (
                              <div className="flex flex-col items-center justify-center min-h-[220px]">
                                <TbUserSearch size={64} className="text-gray-300 mb-2"  />
                                <div className="text-lg font-semibold text-gray-500">No applicants yet</div>
                                <div className="text-sm text-blue-500 mt-1">You&apos;ll see applicants here once they apply</div>
                              </div>
                            )
                          }
                          return (
                            <>
                              {paginated.map(app =>
                                <ApplicantCard
                                  key={app.application_id}
                                  applicant={app}
                                  selected={selectedApplication === app.application_id}
                                  setSelected={() => setSelectedApplication(app.application_id)}
                                  handleViewDetails={handleViewDetails}
                                  handleInviteToInterview={handleInviteToInterview}
                                  handleReschedInterview={handleReschedInterview}
                                  onShortlist={async () => await updateApplicantStatus(app.application_id, "shortlist")}
                                  onReject={async () => await updateApplicantStatus(app.application_id, "reject")}
                                />
                              )}
                              {totalPages > 1 && (
                                <Pagination
                                  totalPages={totalPages}
                                  currentPage={page}
                                  onPageChange={setPage}
                                />
                              )}
                            </>
                          )
                        })()
                      }
                    </TabsContent>
                    <TabsContent value="new" className="mt-4 space-y-4">
                      {
                        (() => {
                          const filtered = filteredApplicants.filter(a => capitalize(a.status) === "New")
                          const totalPages = Math.max(1, Math.ceil(filtered.length / limit))
                          const paginated = filtered.slice((page - 1) * limit, page * limit)
                          if (filtered.length === 0) {
                            return (
                              <div className="flex flex-col items-center justify-center min-h-[220px]">
                                <TbUserSearch size={64} className="text-gray-300 mb-2" />
                                <div className="text-lg font-semibold text-gray-500">No new applicants</div>
                                <div className="text-sm text-blue-500 mt-1">Check back soon for new applications</div>
                              </div>
                            )
                          }
                          return (
                            <>
                              {paginated.map(app =>
                                <ApplicantCard
                                  key={app.application_id}
                                  applicant={app}
                                  selected={selectedApplication === app.application_id}
                                  setSelected={() => setSelectedApplication(app.application_id)}
                                  handleViewDetails={handleViewDetails}
                                  handleInviteToInterview={handleInviteToInterview}
                                  handleReschedInterview={handleReschedInterview}
                                  onShortlist={async () => await updateApplicantStatus(app.application_id, "shortlist")}
                                  onReject={async () => await updateApplicantStatus(app.application_id, "reject")}
                                />
                              )}
                              {totalPages > 1 && (
                                <Pagination
                                  totalPages={totalPages}
                                  currentPage={page}
                                  onPageChange={setPage}
                                />
                              )}
                            </>
                          )
                        })()
                      }
                    </TabsContent>
                    <TabsContent value="shortlisted" className="mt-4 space-y-4">
                      {
                        (() => {
                          const filtered = filteredApplicants.filter(a => capitalize(a.status) === "Shortlisted")
                          const totalPages = Math.max(1, Math.ceil(filtered.length / limit))
                          const paginated = filtered.slice((page - 1) * limit, page * limit)
                          if (filtered.length === 0) {
                            return (
                              <div className="flex flex-col items-center justify-center min-h-[220px]">
                                <TbUserSearch size={64} className="text-gray-300 mb-2" />
                                <div className="text-lg font-semibold text-gray-500">No shortlisted applicants</div>
                                <div className="text-sm text-blue-500 mt-1">Shortlisted applicants will appear here</div>
                              </div>
                            )
                          }
                          return (
                            <>
                              {paginated.map(app =>
                                <ApplicantCard
                                  key={app.application_id}
                                  applicant={app}
                                  selected={selectedApplication === app.application_id}
                                  setSelected={() => setSelectedApplication(app.application_id)}
                                  handleViewDetails={handleViewDetails}
                                  handleInviteToInterview={handleInviteToInterview}
                                  handleReschedInterview={handleReschedInterview}
                                  onShortlist={async () => await updateApplicantStatus(app.application_id, "shortlist")}
                                  onReject={async () => await updateApplicantStatus(app.application_id, "reject")}
                                />
                              )}
                              {totalPages > 1 && (
                                <Pagination
                                  totalPages={totalPages}
                                  currentPage={page}
                                  onPageChange={setPage}
                                />
                              )}
                            </>
                          )
                        })()
                      }
                    </TabsContent>
                    <TabsContent value="interview" className="mt-4 space-y-4">
                      {
                        (() => {
                          const filtered = filteredApplicants.filter(a => getTabStatus(a.status) === "Interview")
                          const totalPages = Math.max(1, Math.ceil(filtered.length / limit))
                          const paginated = filtered.slice((page - 1) * limit, page * limit)
                          if (filtered.length === 0) {
                            return (
                              <div className="flex flex-col items-center justify-center min-h-[220px]">
                                <TbUserSearch size={64} className="text-gray-300 mb-2"  />
                                <div className="text-lg font-semibold text-gray-500">No interviews scheduled</div>
                                <div className="text-sm text-blue-500 mt-1">Invite applicants to interview</div>
                              </div>
                            )
                          }
                          return (
                            <>
                              {paginated.map(app =>
                                <ApplicantCard
                                  key={app.application_id}
                                  applicant={app}
                                  selected={selectedApplication === app.application_id}
                                  setSelected={() => setSelectedApplication(app.application_id)}
                                  handleViewDetails={handleViewDetails}
                                  handleInviteToInterview={handleInviteToInterview}
                                  handleReschedInterview={handleReschedInterview}
                                  onShortlist={async () => await updateApplicantStatus(app.application_id, "shortlist")}
                                  onReject={async () => await updateApplicantStatus(app.application_id, "reject")}
                                />
                              )}
                              {totalPages > 1 && (
                                <Pagination
                                  totalPages={totalPages}
                                  currentPage={page}
                                  onPageChange={setPage}
                                />
                              )}
                            </>
                          )
                        })()
                      }
                    </TabsContent>
                    <TabsContent value="invited" className="mt-4 space-y-4">
                      {
                        (() => {
                          const filtered = filteredApplicants.filter(a => capitalize(a.status) === "Invited")
                          const totalPages = Math.max(1, Math.ceil(filtered.length / limit))
                          const paginated = filtered.slice((page - 1) * limit, page * limit)
                          if (filtered.length === 0) {
                            return (
                              <div className="flex flex-col items-center justify-center min-h-[220px]">
                                <TbUserSearch size={64} className="text-gray-300 mb-2" />
                                <div className="text-lg font-semibold text-gray-500">No invitations sent</div>
                                <div className="text-sm text-blue-500 mt-1">Invite applicants to interview</div>
                              </div>
                            )
                          }
                          return (
                            <>
                              {paginated.map(app =>
                                <ApplicantCard
                                  key={app.application_id}
                                  applicant={app}
                                  selected={selectedApplication === app.application_id}
                                  setSelected={() => setSelectedApplication(app.application_id)}
                                  handleViewDetails={handleViewDetails}
                                  handleInviteToInterview={handleInviteToInterview}
                                  handleReschedInterview={handleReschedInterview}
                                  onShortlist={async () => await updateApplicantStatus(app.application_id, "shortlist")}
                                  onReject={async () => await updateApplicantStatus(app.application_id, "reject")}
                                />
                              )}
                              {totalPages > 1 && (
                                <Pagination
                                  totalPages={totalPages}
                                  currentPage={page}
                                  onPageChange={setPage}
                                />
                              )}
                            </>
                          )
                        })()
                      }
                    </TabsContent>
                    <TabsContent value="rejected" className="mt-4 space-y-4">
                      {
                        (() => {
                          const filtered = filteredApplicants.filter(a => capitalize(a.status) === "Rejected")
                          const totalPages = Math.max(1, Math.ceil(filtered.length / limit))
                          const paginated = filtered.slice((page - 1) * limit, page * limit)
                          if (filtered.length === 0) {
                            return (
                              <div className="flex flex-col items-center justify-center min-h-[220px]">
                                <TbUserSearch size={64} className="text-gray-300 mb-2"/>
                                <div className="text-lg font-semibold text-gray-500">No rejected applicants</div>
                                <div className="text-sm text-blue-500 mt-1">Rejected applicants will appear here</div>
                              </div>
                            )
                          }
                          return (
                            <>
                              {paginated.map(app =>
                                <ApplicantCard
                                  key={app.application_id}
                                  applicant={app}
                                  selected={selectedApplication === app.application_id}
                                  setSelected={() => setSelectedApplication(app.application_id)}
                                  handleViewDetails={handleViewDetails}
                                  handleInviteToInterview={handleInviteToInterview}
                                  handleReschedInterview={handleReschedInterview}
                                  onShortlist={async () => await updateApplicantStatus(app.application_id, "shortlist")}
                                  onReject={async () => await updateApplicantStatus(app.application_id, "reject")}
                                />
                              )}
                              {totalPages > 1 && (
                                <Pagination
                                  totalPages={totalPages}
                                  currentPage={page}
                                  onPageChange={setPage}
                                />
                              )}
                            </>
                          )
                        })()
                      }
                    </TabsContent>
                    <TabsContent value="waitlisted" className="mt-4 space-y-4">
                      {
                        (() => {
                          const filtered = filteredApplicants.filter(a => capitalize(a.status) === "Waitlisted")
                          const totalPages = Math.max(1, Math.ceil(filtered.length / limit))
                          const paginated = filtered.slice((page - 1) * limit, page * limit)
                          if (filtered.length === 0) {
                            return (
                              <div className="flex flex-col items-center justify-center min-h-[220px]">
                                <TbUserSearch size={64} className="text-gray-300 mb-2" />
                                <div className="text-lg font-semibold text-gray-500">No waitlisted applicants</div>
                                <div className="text-sm text-blue-500 mt-1">Waitlisted applicants will appear here</div>
                              </div>
                            )
                          }
                          return (
                            <>
                              {paginated.map(app =>
                                <ApplicantCard
                                  key={app.application_id}
                                  applicant={app}
                                  selected={selectedApplication === app.application_id}
                                  setSelected={() => setSelectedApplication(app.application_id)}
                                  handleViewDetails={handleViewDetails}
                                  handleInviteToInterview={handleInviteToInterview}
                                  handleReschedInterview={handleReschedInterview}
                                  onShortlist={async () => await updateApplicantStatus(app.application_id, "shortlist")}
                                  onReject={async () => await updateApplicantStatus(app.application_id, "reject")}
                                />
                              )}
                              {totalPages > 1 && (
                                <Pagination
                                  totalPages={totalPages}
                                  currentPage={page}
                                  onPageChange={setPage}
                                />
                              )}
                            </>
                          )
                        })()
                      }
                    </TabsContent>
                  </Tabs>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="w-full lg:w-1/3 space-y-6">
              <Card className="shadow-sm border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: "Alex Johnson",
                        position: "Frontend Developer",
                        update: "Submitted application",
                        time: "2 hours ago",
                        icon: <FileText className="h-4 w-4 text-white" />,
                        iconBg: "bg-green-500",
                      },
                      {
                        name: "Sarah Williams",
                        position: "Frontend Developer",
                        update: "Accepted interview invitation",
                        time: "1 day ago",
                        icon: <CheckCircle className="h-4 w-4 text-white" />,
                        iconBg: "bg-blue-500",
                      },
                      {
                        name: "Michael Chen",
                        position: "Frontend Developer",
                        update: "Completed technical assessment",
                        time: "2 days ago",
                        icon: <FileText className="h-4 w-4 text-white" />,
                        iconBg: "bg-yellow-500",
                      },
                    ].map((update, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="relative">
                          <div className={`w-8 h-8 rounded-full ${update.iconBg} flex items-center justify-center`}>
                            {update.icon}
                          </div>
                          {update.time.includes("hours") && index < 1 ? (
                            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                          ) : null}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{update.name}</p>
                          <p className="text-xs text-gray-500">{update.position}</p>
                          <p className="text-xs font-medium text-blue-600 mt-1">{update.update}</p>
                          <p className="text-xs text-gray-400 mt-1">{update.time}</p>
                        </div>
                        <button className="text-gray-400 hover:text-blue-500">
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    Top 3 Highest Match Applicants
                    <Badge className="ml-2 bg-green-500 text-white text-xs">95%+ Match</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        name: "Alex Johnson",
                        title: "Senior Frontend Developer",
                        match: "98%",
                        skills: ["React", "TypeScript", "Next.js"],
                        experience: "5 years",
                      },
                      {
                        name: "Emily Zhang",
                        title: "Frontend Engineer",
                        match: "97%",
                        skills: ["React", "JavaScript", "CSS"],
                        experience: "4 years",
                      },
                      {
                        name: "Michael Brown",
                        title: "UI Developer",
                        match: "95%",
                        skills: ["React", "Tailwind", "TypeScript"],
                        experience: "3 years",
                      },
                    ].map((candidate, index) => (
                      <div
                        key={index}
                        className="border border-green-100 rounded-lg p-3 hover:bg-green-50 transition-colors"
                      >
                        <div className="flex gap-3 items-start">
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              fontWeight: "bold",
                              bgcolor: "#DCFCE7",
                              color: "#15803D",
                              fontSize: 22,
                            }}
                          >
                            {candidate.name.charAt(0)}
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className="font-medium text-gray-800">{candidate.name}</p>
                              <Badge className="bg-green-100 text-green-700">{candidate.match} Match</Badge>
                            </div>
                            <p className="text-xs text-gray-500">{candidate.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{candidate.experience}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {candidate.skills.map((skill, i) => (
                                <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" className="bg-blue-600 text-xs flex-1">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 text-xs flex-1">
                            Invite to Interview
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <RecruiterApplicationDetailsModal
          applicant={selectedApplicant}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
        <InterviewScheduleModal
          open={interviewModalOpen}
          onClose={() => { setInterviewModalOpen(false); setEditInterviewMode(false); setEditInterviewData(null); }}
          initial={editInterviewMode && editInterviewData ? {
            ...editInterviewData,
            application_id: interviewApplicant?.application_id,
            student_id: interviewApplicant?.student_id,
            employer_id: employerId,
            company_name: companyName
          } : interviewApplicant ? {
            application_id: interviewApplicant.application_id,
            student_id: interviewApplicant.student_id,
            employer_id: employerId,
            company_name: companyName
          } : undefined}
          editMode={editInterviewMode}
          onInterviewScheduled={(application_id) => {
            setApplicants(prev => prev.map(app => app.application_id === application_id ? { ...app, status: "Interview scheduled" } : app))
          }}
        />
      </div>
    </>
  )
}

function ApplicantCard({
  applicant,
  setSelected,
  handleViewDetails,
  handleInviteToInterview,
  handleReschedInterview,
  onShortlist,
  onReject,
}: {
  applicant: Applicant
  selected: boolean 
  setSelected: () => void
  handleViewDetails: (id: string, e: React.MouseEvent) => void
  handleInviteToInterview: (id: string, e: React.MouseEvent) => void
  handleReschedInterview: (applicant: Applicant, e: React.MouseEvent) => void
  onShortlist: () => Promise<void>
  onReject: () => Promise<void>
}) {

  const formattedLocation = applicant.address
    ? applicant.address.split(",")[0].trim()
    : ""

  function formatAppliedAt(dateString?: string) {
    if (!dateString) return ""
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    const diffWeeks = Math.floor(diffDays / 7)

    if (diffMins < 1) return "just now"
    if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`
    if (diffHours < 24) return `${diffHours} hr${diffHours === 1 ? "" : "s"} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`
    if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks === 1 ? "" : "s"} ago`
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
  }

  const formattedAppliedAt = applicant.applied_at ? formatAppliedAt(applicant.applied_at) : ""

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const [loadingShortlist, setLoadingShortlist] = useState(false)
  const [loadingReject, setLoadingReject] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [cancelInterviewOpen, setCancelInterviewOpen] = useState(false)

  const handleReject = async () => {
    setLoadingReject(true)
    await onReject()
    setLoadingReject(false)
    setRejectOpen(false)
  }

  const handleCancelInterview = async () => {
    setLoadingShortlist(true)
    await onShortlist()
    setLoadingShortlist(false)
    setCancelInterviewOpen(false)
  }

  return (
    <>
      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <RiEmotionSadLine   className="w-6 h-6 text-orange-600" />
            </div>
            <DialogTitle className="text-lg">Are you sure?</DialogTitle>
            <DialogDescription className="text-center">
              This will reject {applicant.first_name}&apos;s application.
              <br />
              <span className="text-sm text-muted-foreground mt-2 block">
                We know it&apos;s never easy to say no to talented people.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setRejectOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} className="flex-1" disabled={loadingReject}>
              {loadingReject ? (
                <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "Yes, Reject"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Interview Dialog */}
      <Dialog open={cancelInterviewOpen} onOpenChange={setCancelInterviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <FaRegCalendarTimes className="w-6 h-6 text-purple-600" />
            </div>
            <DialogTitle className="text-lg">Cancel Interview?</DialogTitle>
            <DialogDescription className="text-center">
              This will move {applicant.first_name}&apos;s application back to Shortlisted.
              <br />
              <span className="text-sm text-muted-foreground mt-2 block">
                Are you sure you want to cancel this interview?
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setCancelInterviewOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleCancelInterview} className="flex-1" disabled={loadingShortlist}>
              {loadingShortlist ? (
                <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "Yes, Cancel Interview"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <motion.div
      className={`bg-white rounded-lg shadow-md shadow-blue-50 p-5 border-l-4 transition-colors duration-200
        ${
          capitalize(applicant.status) === "New"
            ? "border-l-amber-500"
            : capitalize(applicant.status) === "Shortlisted"
            ? "border-l-cyan-500"
            : capitalize(applicant.status) === "Rejected"
            ? "border-l-red-500"
            : (capitalize(applicant.status) === "Interview" || capitalize(applicant.status) === "Interview scheduled")
            ? "border-l-purple-500"
            : capitalize(applicant.status) === "Invited"
            ? "border-l-yellow-500"
            : capitalize(applicant.status) === "Waitlisted"
            ? "border-l-blue-500"
            : "border-l-gray-200"
        }
      `}
      whileHover={{ scale: 1.025 }}
      onClick={() => setSelected()}
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <Avatar
            sx={{ width: 48, height: 48, fontWeight: "bold", bgcolor: "#DBEAFE", color: "#2563EB", fontSize: 22 }}
            src={applicant.profile_image_url || undefined}
          >
            {!applicant.profile_image_url && (applicant.first_name?.charAt(0) || "A")}
          </Avatar>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-lg text-gray-800">
                {applicant.first_name} {applicant.last_name}
              </h3>
              <motion.div whileHover={{ scale: 1.15 }}>
                <Badge className={
                  capitalize(applicant.status) === "New"
                    ? "bg-amber-100 text-amber-700 hover:bg-amber-300 hover:text-amber-800 pointer-events-none"
                    : capitalize(applicant.status) === "Shortlisted"
                    ? "bg-cyan-100 text-cyan-700 hover:bg-cyan-300 hover:text-cyan-800 pointer-events-none"
                    : capitalize(applicant.status) === "Rejected"
                    ? "bg-red-100 text-red-700 hover:bg-red-300 hover:text-red-800 pointer-events-none"
                    : (capitalize(applicant.status) === "Interview" || capitalize(applicant.status) === "Interview scheduled")
                    ? "bg-purple-100 text-purple-700 hover:bg-purple-300 hover:text-purple-800 pointer-events-none"
                    : capitalize(applicant.status) === "Waitlisted"
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-300 hover:text-blue-800 pointer-events-none"
                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-300 hover:text-yellow-800 pointer-events-none"
                }>
                  {capitalize(applicant.status) === "Interview scheduled" ? "Interview Scheduled" : (capitalize(applicant.status) || "New")}
                </Badge>
              </motion.div>
              {capitalize(applicant.status) === "Interview scheduled" && null}
            </div>
            <p className="text-sm text-gray-500">
              Applied for {applicant.job_title || "Job"}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <MapPin className="h-3 w-3" />
                <span>{formattedLocation}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Briefcase className="h-3 w-3" />
                <span>
                  {applicant.experience_years === "No experience"
                    ? "No experience"
                    : `${applicant.experience_years} experience`}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Calendar className="h-3 w-3" />
                <span>Applied at {formattedAppliedAt}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <Badge className="bg-green-100 text-green-700">Match</Badge>
          <button className="text-gray-400 hover:text-blue-500 transition-colors p-1.5 rounded-full hover:bg-blue-50" onClick={e => e.stopPropagation()}>
            <Bookmark className="h-4 w-4" />
          </button>
          <div>
            <button
              className="text-gray-400 hover:text-blue-500 transition-colors p-1.5 rounded-full hover:bg-blue-50"
              onClick={e => {
                e.stopPropagation()
                setAnchorEl(e.currentTarget)
              }}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              slotProps={{
                paper: {
                  sx: { minWidth: 180, borderRadius: 2, boxShadow: 2, p: 0.5 }
                }
              }}
            >
              <MenuItem onClick={() => setAnchorEl(null)}>
                <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
                View Job Listing
              </MenuItem>
              <MenuItem onClick={() => setAnchorEl(null)}>
                <User className="w-4 h-4 mr-2 text-gray-500" />
                View Profile
              </MenuItem>
              {(() => {
                const status = capitalize(applicant.status)
                if (status === "New" || status === "Shortlisted") {
                  return [
                    <MenuItem key="set-interview" onClick={() => setAnchorEl(null)}>
                      <CalendarIcon className="w-4 h-4 mr-2 text-green-500" />
                      Set Interview
                    </MenuItem>,
                    <MenuItem key="send-offer" onClick={() => setAnchorEl(null)}>
                      <ArrowUpRight className="w-4 h-4 mr-2 text-yellow-500" />
                      Send Offer
                    </MenuItem>
                  ]
                }
                if (status === "Interview" || status === "Interview scheduled") {
                  return [
                    <MenuItem key="send-offer" onClick={() => setAnchorEl(null)}>
                      <ArrowUpRight className="w-4 h-4 mr-2 text-yellow-500" />
                      Send Offer
                    </MenuItem>,
                    <MenuItem key="reject" onClick={() => { setAnchorEl(null); setRejectOpen(true); }}>
                      <IoIosCloseCircleOutline className="w-4 h-4 mr-2 text-red-500" />
                      Reject
                    </MenuItem>
                  ]
                }
                return null
              })()}
            </Menu>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          {capitalize(applicant.status) === "New" && (
            <>
              <Button
                size="sm"
                className="bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center gap-1 text-xs font-medium shadow-none border-0"
                style={{ boxShadow: 'none', border: 'none' }}
                onClick={async e => {
                  e.stopPropagation()
                  setLoadingShortlist(true)
                  await onShortlist()
                  setLoadingShortlist(false)
                }}
                disabled={loadingShortlist || loadingReject}
              >
                {loadingShortlist ? (
                  <span className="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <MdStars className="w-4 h-4" />
                )}
                Shortlist
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 text-xs"
                onClick={e => {
                  e.stopPropagation()
                  setSelected()
                  handleViewDetails(applicant.application_id, e)
                }}
                disabled={loadingShortlist || loadingReject}
              >
                View Details
              </Button>
              <button
                type="button"
                className="flex items-center gap-1 text-red-600 text-xs font-medium px-2 py-1 rounded-none bg-transparent border-0 shadow-none hover:bg-red-50 hover:text-red-700 transition-colors"
                style={{ minWidth: 0 }}
                onClick={e => {
                  e.stopPropagation()
                  setRejectOpen(true)
                }}
                disabled={loadingShortlist || loadingReject}
              >
                <IoIosCloseCircleOutline className="w-4 h-4" />
                Reject
              </button>
            </>
          )}
          {capitalize(applicant.status) === "Rejected" && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 text-xs"
                onClick={e => {
                  e.stopPropagation()
                  setSelected()
                  handleViewDetails(applicant.application_id, e)
                }}
                disabled={loadingReject}
              >
                View Details
              </Button>
              <Tooltip title="Mark as new applicant again" arrow>
                <span
                  className="text-green-700 text-xs cursor-pointer flex items-center gap-1"
                  onClick={async e => {
                    e.stopPropagation()
                    setLoadingShortlist(true)
                    await onShortlist()
                    setLoadingShortlist(false)
                  }}
                  style={{ padding: "6px 12px", borderRadius: "6px", fontWeight: 500 }}
                >
                  <MdRestore className="w-4 h-4" />
                  Restore
                </span>
              </Tooltip>
            </>
          )}
          {(capitalize(applicant.status) === "Shortlisted" || capitalize(applicant.status) === "Interview scheduled" || capitalize(applicant.status) === "Interview" || capitalize(applicant.status) === "Invited" || capitalize(applicant.status) === "Waitlisted") && (
            <>
              {capitalize(applicant.status) === "Shortlisted" && (
                <Button
                  size="sm"
                  className="bg-purple-100 text-purple-700 hover:bg-purple-200 flex items-center gap-1 text-xs font-medium shadow-none border-0"
                  style={{ boxShadow: 'none', border: 'none' }}
                  onClick={e => handleInviteToInterview(applicant.application_id, e)}
                >
                  <MdOutlineEditCalendar className="w-4 h-4" />
                  Invite to Interview
                </Button>
              )}
              {(capitalize(applicant.status) === "Interview scheduled") && (
                <Button
                  size="sm"
                  className="bg-purple-200 text-purple-800 hover:bg-purple-300 flex items-center gap-1 text-xs font-medium shadow-none border-0"
                  style={{ boxShadow: 'none', border: 'none' }}
                  onClick={e => { e.stopPropagation(); handleReschedInterview(applicant, e); }}
                >
                  <LuCalendarCog className="w-4 h-4" />
                  Resched
                </Button>
              )}
              {capitalize(applicant.status) === "Waitlisted" && (
                <Button
                  size="sm"
                  className="bg-green-600 text-white hover:bg-green-700 flex items-center gap-1 text-xs font-medium shadow-none border-0"
                  style={{ boxShadow: 'none', border: 'none' }}
                  onClick={e => { e.stopPropagation(); /* send offe*/ }}
                >
                  <FaHandHoldingDollar className="w-4 h-4 mr-1" />
                  Send offer
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 text-xs ml-0"
                onClick={e => {
                  e.stopPropagation()
                  setSelected()
                  handleViewDetails(applicant.application_id, e)
                }}
                disabled={loadingReject}
              >
                View Details
              </Button>
              {(capitalize(applicant.status) === "Interview scheduled") && (
                <Tooltip title="This will move the applicant back to Shortlisted" arrow>
                  <button
                    type="button"
                    className="flex items-center gap-1 text-red-600 text-xs font-medium px-2 py-1 rounded bg-transparent border-0 shadow-none hover:bg-red-50 hover:text-red-700 transition-colors ml-0"
                    style={{ minWidth: 0 }}
                    onClick={e => { e.stopPropagation(); setCancelInterviewOpen(true); }}
                    disabled={loadingShortlist || loadingReject}
                  >
                    <FaRegCalendarTimes className="w-4 h-4" />
                    Cancel Interview
                  </button>
                </Tooltip>
              )}
              {(capitalize(applicant.status) !== "Interview scheduled") && (
                <button
                  type="button"
                  className="flex items-center gap-1 text-red-600 text-xs font-medium px-2 py-1 rounded bg-transparent border-0 shadow-none hover:bg-red-50 hover:text-red-700 transition-colors"
                  style={{ minWidth: 0 }}
                  onClick={e => {
                    e.stopPropagation()
                    setRejectOpen(true)
                  }}
                  disabled={loadingReject}
                >
                  <IoIosCloseCircleOutline className="w-4 h-4" />
                  Reject
                </button>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">
            {capitalize(applicant.status) === "New"
              ? "New application"
              : capitalize(applicant.status) === "Review"
              ? "In review"
              : capitalize(applicant.status) === "Interview"
              ? "Interview phase"
              : capitalize(applicant.status) === "Invited"
              ? "Invitation sent"
              : capitalize(applicant.status) === "Shortlisted"
              ? "Shortlisted"
              : capitalize(applicant.status) === "Waitlisted"
              ? "Waitlisted"
              : ""}
          </span>
          <ArrowUpRight className="h-3 w-3 text-gray-600" />
        </div>
      </div>
    </motion.div>
    </>
  )
}


