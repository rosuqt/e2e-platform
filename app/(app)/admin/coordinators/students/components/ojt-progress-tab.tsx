/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ChevronRight,
  Building2,
  Calendar,
  FileText,
  CheckCircle,
  ChevronLeft,
} from "lucide-react"
import { AiOutlineFileSearch } from "react-icons/ai"
import { motion } from "framer-motion"
import { FaRegCalendarCheck } from "react-icons/fa"
import { FaCircleCheck } from "react-icons/fa6"
import { IoCloseCircle } from "react-icons/io5"
import { LuNotebookPen } from "react-icons/lu"
import { MdEventNote } from "react-icons/md"
import Image from "next/image"
import { Loader2, AlertCircle, Clock } from "lucide-react"
import { Maximize2, X as CloseIcon } from "lucide-react"



interface Application {
  id: string
  companyName: string
  jobTitle?: string
  status: string
  dateApplied: string
  companyLogo?: string
  company_name?: string
}

interface WeeklyActivity {
  week: number
  activities: string
  hoursLogged: number
  date: string
}

interface Document {
  name: string
  status: "Submitted" | "Pending" | "Approved" | "Rejected"
  dateSubmitted?: string
}

export interface OJTStudent {
  course: string
  id: string
  name: string
  email: string
  isHired: boolean
  applicationsSent?: number
  applications?: Application[]
  companyName?: string
  startDate?: string
  ojtStatus?: "In Progress" | "Completed" | "On Hold"
  hoursCompleted?: number
  requiredHours?: number
  weeklyActivities?: WeeklyActivity[]
  supervisorFeedback?: string
  documents?: Document[]
}

function getStatusBadge(status: string) {
  let displayStatus = status
  switch (status?.toLowerCase()) {
    case "new":
      displayStatus = "Pending"
      break
    case "shortlisted":
      displayStatus = "Under Review"
      break
    case "interview scheduled":
      displayStatus = "Interview Schedule"
      break
    case "waitlisted":
      displayStatus = "Interviewed"
      break
    case "hired":
      displayStatus = "Hired"
      break
    case "rejected":
      displayStatus = "Rejected"
      break
    default:
      displayStatus = status
  }

  const variants: Record<string, "outline" | "default" | "destructive" | "secondary"> = {
    Pending: "secondary",
    "Under Review": "secondary",
    "Interview Schedule": "default",
    Interviewed: "default",
    Hired: "default",
    Rejected: "destructive",
    "In Progress": "default",
    Completed: "secondary",
    "On Hold": "secondary",
    Submitted: "secondary",
    Approved: "secondary",
    PendingDoc: "secondary",
  }

  const lucideIcons: Record<string, React.ReactNode> = {
    Pending: <Clock className="w-3 h-3" />,
    "Under Review": <LuNotebookPen className="w-3 h-3" />,
    "Interview Schedule": <MdEventNote className="w-3 h-3" />,
    Interviewed: <FaRegCalendarCheck className="w-3 h-3" />,
    Hired: <FaCircleCheck className="w-3 h-3" />,
    Rejected: <IoCloseCircle className="w-3 h-3" />,
    Submitted: <FileText className="w-3 h-3" />,
    Approved: <CheckCircle className="w-3 h-3" />,
    PendingDoc: <AlertCircle className="w-3 h-3" />,
  }

  const colorMap: Record<string, { base: string; hover: string }> = {
    Interviewed: {
      base: "bg-indigo-100 text-indigo-700 border border-indigo-200",
      hover: "hover:bg-indigo-200 hover:text-indigo-900",
    },
    "Interview Schedule": {
      base: "bg-purple-100 text-purple-700 border border-purple-200",
      hover: "hover:bg-purple-200 hover:text-purple-900",
    },
    "Under Review": {
      base: "bg-amber-100 text-amber-700 border border-amber-200",
      hover: "hover:bg-amber-200 hover:text-amber-900",
    },
    Hired: {
      base: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      hover: "hover:bg-emerald-200 hover:text-emerald-900",
    },
    Pending: {
      base: "bg-orange-100 text-orange-700 border border-orange-200",
      hover: "hover:bg-orange-200 hover:text-orange-900",
    },
    Rejected: {
      base: "",
      hover: "",
    },
  }

  const color = colorMap[displayStatus] || { base: "", hover: "" }
  const Icon = lucideIcons[displayStatus] || null

  return (
    <Badge
      variant={variants[displayStatus] || "secondary"}
      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${color.base} ${color.hover}`}
    >
      {Icon}
      {displayStatus}
    </Badge>
  )
}

function DTRTimeline({ studentId }: { studentId: string }) {
  const [loading, setLoading] = useState(true)
  const [job, setJob] = useState<any>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [fullscreenImg, setFullscreenImg] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDTR() {
      setLoading(true)
      setError(null)
      setJob(null)
      setLogs([])
      try {
        const jobRes = await fetch(`/api/students/dtr/getJobInfo?studentId=${encodeURIComponent(studentId)}`)
        const jobData = await jobRes.json()
        if (!jobData.jobs || jobData.jobs.length === 0) {
          setLoading(false)
          setJob(null)
          setLogs([])
          return
        }
        const jobInfo = jobData.jobs[0]
        setJob(jobInfo)
        const logsRes = await fetch(`/api/students/dtr/getLogs?jobId=${encodeURIComponent(jobInfo.id)}`)
        const logsData = await logsRes.json()
        setLogs(logsData.logs || [])
      } catch (e) {
        setError("Failed to fetch DTR data.")
      }
      setLoading(false)
    }
    if (studentId) fetchDTR()
  }, [studentId])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-2" />
        <span className="text-gray-500 font-medium">Loading DTR timeline...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
        <span className="text-red-600 font-medium">{error}</span>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Image src="/animations/ojt-track.json" alt="No DTR" width={96} height={96} unoptimized />
        <span className="mt-2 text-gray-700 font-semibold text-base text-center">
          No DTR records found for this student yet.
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>DTR Timeline</CardTitle>
          <CardContent>
            <div className="mb-2 text-gray-600">
              {job.jobTitle} at {job.company} <br />
              Started: {job.startDate ? new Date(job.startDate).toLocaleDateString() : "N/A"}
            </div>
            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <AlertCircle className="w-6 h-6 text-yellow-500 mb-2" />
                <span className="text-gray-500 font-medium">No DTR logs available.</span>
              </div>
            ) : (
              <ol className="relative border-l border-indigo-300">
                {logs.map((log, idx) => (
                  <li key={log.id || idx} className="mb-10 ml-6">
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-full -left-4 ring-4 ring-white">
                      <Clock className="w-5 h-5 text-indigo-500" />
                    </span>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-indigo-700">
                        {log.date ? new Date(log.date).toLocaleDateString() : "Unknown Date"}
                      </span>
                      <span className="text-gray-700 text-sm">
                        {log.time_in} - {log.time_out}
                      </span>
                      {log.imageProofUrl && (
                        <div className="relative mt-2 flex items-center gap-2">
                          <Image
                            src={log.imageProofUrl}
                            alt="Proof"
                            width={80}
                            height={80}
                            className="rounded border cursor-pointer"
                            unoptimized
                            onClick={() => setFullscreenImg(log.imageProofUrl)}
                          />
                          <button
                            type="button"
                            className="p-1 rounded-full bg-white border shadow hover:bg-gray-50"
                            title="View Fullscreen"
                            onClick={() => setFullscreenImg(log.imageProofUrl)}
                          >
                            <Maximize2 className="w-4 h-4 text-gray-700" />
                          </button>
                        </div>
                      )}
                      {log.remarks && (
                        <span className="text-gray-500 text-xs mt-1">Remarks: {log.remarks}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}
            {/* Fullscreen Modal */}
            {fullscreenImg && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
                onClick={() => setFullscreenImg(null)}
                style={{ cursor: "zoom-out" }}
              >
                <div className="relative">
                  <Image
                    src={fullscreenImg}
                    alt="Proof Fullscreen"
                    width={800}
                    height={800}
                    className="max-w-[90vw] max-h-[90vh] rounded shadow-lg"
                    unoptimized
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-200"
                    onClick={e => {
                      e.stopPropagation()
                      setFullscreenImg(null)
                    }}
                    title="Close"
                  >
                    <CloseIcon className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  )
}

export default function OJTProgressTab({
  student,
}: {
  student: OJTStudent
}) {
  const [page, setPage] = useState(1)
  const perPage = 5
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(null)
  const [editableHoursCompleted, setEditableHoursCompleted] = useState<number>(student.hoursCompleted ?? 0)
  const [hoursLoading, setHoursLoading] = useState(false)
  const [hoursError, setHoursError] = useState<string | null>(null)

  // Calculate requiredHours before any usage
  let requiredHours = 0
  if (student && student.course && typeof student.course === "string") {
    const course = student.course.toLowerCase()
    if (
      course.includes("information technology") ||
      course.includes("abm") ||
      course.includes("humss") ||
      course.includes("it mobile app") ||
      course.includes("web development")
    ) {
      requiredHours = 486
    } else {
      requiredHours = 600
    }
  }
  requiredHours = requiredHours || 0

  let calculatedHoursCompleted = editableHoursCompleted

  const applications = student.applications || []
  const hasHired = applications.some((app) => app.status && app.status.toLowerCase() === "hired")
  const hiredApplication = applications.find((app) => app.status && app.status.toLowerCase() === "hired")

  const displayCompanyName =
    hiredApplication?.company_name ||
    hiredApplication?.companyName ||
    student.companyName ||
    hiredApplication?.jobTitle ||
    "No Company Assigned"

  const effectiveOjtStatus = hasHired ? "hired" : student.ojtStatus

  useEffect(() => {
    async function fetchLogo() {
      const logoPath = hiredApplication?.companyLogo
      if (logoPath) {
        const res = await fetch(
          `/api/employers/get-signed-url?bucket=company.logo&path=${encodeURIComponent(logoPath)}`,
        )
        const data = await res.json()
        if (data.signedUrl) setCompanyLogoUrl(data.signedUrl)
        else setCompanyLogoUrl(null)
      } else {
        setCompanyLogoUrl(null)
      }
    }
    fetchLogo()
  }, [hiredApplication?.companyLogo])

  useEffect(() => {
    async function fetchHours() {
      setHoursLoading(true)
      setHoursError(null)
      try {
        const res = await fetch("/api/superadmin/coordinators/useandPost?student_id=" + encodeURIComponent(student.id))
        const data = await res.json()
        if (typeof data.hours === "number") {
          setEditableHoursCompleted(data.hours)
        } else {
          setEditableHoursCompleted(student.hoursCompleted ?? 0)
        }
      } catch (e) {
        setHoursError("Failed to fetch hours.")
        setEditableHoursCompleted(student.hoursCompleted ?? 0)
      }
      setHoursLoading(false)
    }
    fetchHours()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student.id])

  function calculateWeekdaysBetween(startDate: Date, endDate: Date) {
    let count = 0
    for (const current = new Date(startDate); current <= endDate; current.setDate(current.getDate() + 1)) {
      const day = current.getDay()
      if (day !== 0 && day !== 6) count++
    }
    return count
  }

  if (hasHired) {
    const appliedDateStr = hiredApplication?.dateApplied || student.startDate
    if (appliedDateStr && !student.hoursCompleted) {
      const startDate = new Date(appliedDateStr)
      const today = new Date()
      const weekdays = calculateWeekdaysBetween(startDate, today)
      calculatedHoursCompleted = weekdays * 8
    }
  }

  // Clamp hours to requiredHours
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  calculatedHoursCompleted = Math.min(calculatedHoursCompleted, requiredHours)

  const totalPages = Math.ceil(applications.length / perPage)
  const pagedApplications = applications.slice((page - 1) * perPage, page * perPage)

  function getVisiblePages(currentPage: number, totalPages: number) {
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

  const visiblePages = getVisiblePages(page, totalPages)

 
 

  // Fallback: no OJT progress data
  const noProgress =
    !student.hoursCompleted &&
    (!student.applications || student.applications.length === 0) &&
    !student.isHired

  return (
    <div className="space-y-6 animate-fade-in">
      {noProgress ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Image
            src="/animations/ojt-track.json"
            alt="No OJT Progress"
            width={128}
            height={128}
            className="w-32 h-32 mb-4 object-contain"
            unoptimized
          />
          <span className="mt-2 text-slate-700 font-semibold text-base text-center">
            No OJT progress data available for this student yet.
          </span>
        </div>
      ) : effectiveOjtStatus?.toLowerCase() !== "hired" ? (
        <div className="space-y-4">
          <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="w-5 h-5" />
                Status: Not Hired Yet
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-amber-600" />
                <span className="font-medium text-gray-700">Applications Sent:</span>
                <Badge
                  variant="secondary"
                  className="bg-amber-600 text-white font-bold px-3 py-1 rounded-full text-base shadow pointer-events-none"
                >
                  {student.applicationsSent}
                </Badge>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  OJT logs will be visible once the student is placed.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Companies Applied To
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-md border-0 overflow-x-auto">
                {applications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <AiOutlineFileSearch className="w-12 h-12 text-gray-400 mb-4" />
                    <div className="text-gray-500 text-base font-medium">
                      This student hasn&apos;t applied for any companies yet
                    </div>
                  </div>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 border-b border-gray-200">
                          <TableHead className="px-6 py-3 text-base font-semibold text-gray-700">
                            Company Name
                          </TableHead>
                          <TableHead className="px-6 py-3 text-base font-semibold text-gray-700">Job Title</TableHead>
                          <TableHead className="px-6 py-3 text-base font-semibold text-gray-700">Status</TableHead>
                          <TableHead className="px-6 py-3 text-base font-semibold text-gray-700">
                            Date Applied
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pagedApplications.map((application, idx) => {
                          const key = application.id ? String(application.id) : `row-${idx}`
                          return (
                            <TableRow
                              key={key}
                              className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                              style={{ height: 60 }}
                            >
                              <TableCell className="px-6 py-3 text-base">{application.companyName}</TableCell>
                              <TableCell className="px-6 py-3 text-base">{application.jobTitle || "-"}</TableCell>
                              <TableCell className="px-6 py-3 text-base">
                                {getStatusBadge(application.status)}
                              </TableCell>
                              <TableCell className="px-6 py-3 text-base">
                                {application.dateApplied ? new Date(application.dateApplied).toLocaleDateString() : "-"}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>

                    <div className="flex flex-col items-center gap-2 min-h-[80px] mt-4 pb-4">
                      <div className="flex items-center gap-1 relative">
                        <button
                          onClick={() => setPage(page - 1)}
                          disabled={page === 1}
                          className="flex items-center gap-1 px-3 text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span className="text-sm font-medium">Previous</span>
                        </button>

                        <div className="flex items-center relative mx-4">
                          {visiblePages.map((p, idx) => (
                            <div key={`${p}-${idx}`} className="relative">
                              {p === "…" ? (
                                <span className="px-3 py-2 text-gray-400 text-sm">…</span>
                              ) : (
                                <button
                                  onClick={() => setPage(p as number)}
                                  className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                                    page === p ? "text-gray-800" : "text-gray-600 hover:text-gray-800"
                                  }`}
                                >
                                  {p}
                                  {page === p && (
                                    <motion.div
                                      layoutId="pagination-indicator"
                                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-600 rounded-full"
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
                          onClick={() => setPage(page + 1)}
                          disabled={page === totalPages}
                          className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                          <span className="text-sm font-medium">Next</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-sm text-gray-500" style={{ minHeight: 20 }}>
                        Page {page} of {totalPages}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Company Information Card*/}
          <div className="border border-emerald-200 rounded-xl overflow-hidden shadow-lg bg-white">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 px-6 py-6">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="flex items-center gap-3">
                    {companyLogoUrl ? (
                      <Image
                        src={companyLogoUrl || "/placeholder.svg"}
                        alt={displayCompanyName || "Company Logo"}
                        width={56}
                        height={56}
                        className="w-14 h-14 rounded-full object-cover bg-white border-2 border-white shadow-md"
                        unoptimized
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-emerald-600 text-xl font-bold shadow-md">
                        {displayCompanyName?.charAt(0) || "?"}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold text-white">
                        {hiredApplication?.jobTitle && displayCompanyName
                          ? `${hiredApplication.jobTitle} at ${displayCompanyName}`
                          : displayCompanyName}
                      </span>
                      {hiredApplication?.jobTitle && (
                        <span className="text-sm text-emerald-100 mt-0.5">Student&apos;s current Job Position</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-b border-emerald-300/30 my-3" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-white" />
                    <span className="font-medium text-white">Start Date:</span>
                    <span className="text-emerald-100">
                      {hiredApplication?.dateApplied
                        ? new Date(hiredApplication.dateApplied).toLocaleDateString()
                        : student.startDate
                          ? new Date(student.startDate).toLocaleDateString()
                          : "N/A"}
                    </span>
                  </div>

                  {/* Only show OJT Status if present */}
                  {student.ojtStatus && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">OJT Status:</span>
                      <span>{getStatusBadge(student.ojtStatus)}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-white" />
                    <span className="font-medium text-white">Hours:</span>
                    <span className="text-emerald-100 flex flex-col">
                      {/* Show actual hours first, then editable input */}
                      <span className="text-xs text-emerald-200">
                        Actual: {student.hoursCompleted ?? 0} / {requiredHours}
                      </span>
                      <span className="flex items-center gap-1">
                        <input
                          type="number"
                          min={0}
                          max={requiredHours}
                          value={editableHoursCompleted}
                          onChange={e => {
                            const val = Math.max(0, Math.min(Number(e.target.value), requiredHours))
                            setEditableHoursCompleted(val)
                            setHoursError(null)
                          }}
                          onBlur={handleHoursBlur}
                          disabled={hoursLoading}
                          className="w-20 px-2 py-1 rounded bg-white text-emerald-700 font-semibold border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                          style={{ width: 60 }}
                        />
                        /{requiredHours}
                        <span className="text-xs text-emerald-200 ml-2">(Editable)</span>
                      </span>
                      {hoursLoading && (
                        <span className="text-xs text-emerald-500 mt-1">Saving...</span>
                      )}
                      {hoursError && (
                        <span className="text-xs text-red-500 mt-1">{hoursError}</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white px-6 py-6 border-t border-emerald-100">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  {/* Show both actual and editable values */}
                  <span>
                    Completed: {editableHoursCompleted} hours
                    <span className="ml-2 text-xs text-gray-400">
                      (Actual: {student.hoursCompleted ?? 0})
                    </span>
                  </span>
                  <span>Required: {requiredHours > 0 ? requiredHours + " hours" : "N/A"}</span>
                </div>
                <Progress value={requiredHours ? Math.min((editableHoursCompleted / requiredHours) * 100, 100) : 0} className="h-3" />
                <div className="text-center text-sm text-gray-500">
                  {requiredHours ? Math.min((editableHoursCompleted / requiredHours) * 100, 100).toFixed(1) : "0.0"}% Complete
                </div>
              </div>
            </div>
          </div>

          {/* Supervisor Feedback */}
          {student.supervisorFeedback && (
            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg">
                <CardTitle className="text-lg">Supervisor Feedback</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                  {student.supervisorFeedback}
                </p>
              </CardContent>
            </Card>
          )}

          {effectiveOjtStatus?.toLowerCase() === "hired" && (
        <div className="space-y-6">
          <DTRTimeline studentId={student.id} />
        </div>
      )}
        </div>
      )}
    </div>
  )

  async function handleHoursBlur() {
    setHoursLoading(true)
    setHoursError(null)
    try {
      const res = await fetch("/api/superadmin/coordinators/useandPost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: student.id,
          hours: editableHoursCompleted,
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setHoursError(data.error || "Failed to update hours.")
      }
    } catch (e) {
      setHoursError("Failed to update hours.")
    }
    setHoursLoading(false)
  }
}

export function OJTProgressWrapper({
  ojtStudent,
  ojtApplicationsLoading,
}: {
  ojtStudent: OJTStudent
  ojtApplicationsLoading: boolean
}) {
  return (
    <div className="animate-fade-in">
      {ojtApplicationsLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-32 h-32 mb-4">
            <Image
              src="/animations/ojt-track.json"
              alt="Loading"
              width={128}
              height={128}
              className="w-full h-full object-contain"
              unoptimized
            />
          </div>
          <span className="mt-2 text-slate-700 font-semibold text-base animate-pulse">Loading OJT progress...</span>
        </div>
      ) : (
        <OJTProgressTab student={ojtStudent} />
      )}
    </div>
  )
}
