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
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  Sparkles,
  Target,
} from "lucide-react"
import { AiOutlineFileSearch } from "react-icons/ai"
import { motion } from "framer-motion"
import { FaRegCalendarCheck } from "react-icons/fa"
import { FaCircleCheck } from "react-icons/fa6"
import { IoCloseCircle } from "react-icons/io5"
import { LuNotebookPen } from "react-icons/lu"
import { MdEventNote } from "react-icons/md"
import { Checkbox } from "@/components/ui/checkbox"
import { HiMiniClipboardDocumentList } from "react-icons/hi2"
import Image from "next/image"

const REQUIRED_DOCUMENTS = [
  "Application Letter",
  "Resume/CV",
  "School Endorsement Letter",
  "Medical Certificate",
  "Insurance Certificate",
  "Parent's Consent Form",
  "Company Acceptance Letter",
  "Training Plan",
  "Weekly Time Records",
  "Monthly Progress Reports",
  "Final Evaluation Form",
  "Certificate of Completion",
]

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

export default function OJTProgressTab({
  student,
}: {
  student: OJTStudent
}) {
  const [page, setPage] = useState(1)
  const perPage = 5
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(null)

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

  function calculateWeekdaysBetween(startDate: Date, endDate: Date) {
    let count = 0
    for (const current = new Date(startDate); current <= endDate; current.setDate(current.getDate() + 1)) {
      const day = current.getDay()
      if (day !== 0 && day !== 6) count++
    }
    return count
  }

  let calculatedHoursCompleted = student.hoursCompleted

  if (hasHired) {
    const appliedDateStr = hiredApplication?.dateApplied || student.startDate
    if (appliedDateStr) {
      const startDate = new Date(appliedDateStr)
      const today = new Date()
      const weekdays = calculateWeekdaysBetween(startDate, today)
      calculatedHoursCompleted = weekdays * 8
    }
  }

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
  const progressPercentage =
    student.isHired && calculatedHoursCompleted && requiredHours ? (calculatedHoursCompleted / requiredHours) * 100 : 0

  const [docs, setDocs] = useState<Document[]>(
    REQUIRED_DOCUMENTS.map((name) => {
      const found = student.documents?.find((d) => d.name === name)
      return found || { name, status: "Pending" }
    }),
  )

  useEffect(() => {
    setDocs(
      REQUIRED_DOCUMENTS.map((name) => {
        const found = student.documents?.find((d) => d.name === name)
        return found || { name, status: "Pending" }
      }),
    )
  }, [student.documents])

  function handleToggleDoc(index: number, checked: boolean | "indeterminate") {
    setDocs((prev) =>
      prev.map((doc, i) =>
        i === index
          ? {
              ...doc,
              status: checked === true ? "Submitted" : "Pending",
            }
          : doc,
      ),
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {effectiveOjtStatus?.toLowerCase() !== "hired" ? (
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

                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">OJT Status:</span>
                    <span>{getStatusBadge(student.ojtStatus || "N/A")}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-white" />
                    <span className="font-medium text-white">Hours:</span>
                    <span className="text-emerald-100">
                      {calculatedHoursCompleted}/{requiredHours}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white px-6 py-6 border-t border-emerald-100">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Completed: {calculatedHoursCompleted} hours</span>
                  <span>Required: {requiredHours > 0 ? requiredHours + " hours" : "N/A"}</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                <div className="text-center text-sm text-gray-500">{progressPercentage.toFixed(1)}% Complete</div>
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

          {/* Document Checklist - Using purple theme */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="rounded-t-lg bg-gradient-to-r from-purple-600 to-violet-600 px-6 pt-4 pb-6">
              <div className="flex items-center gap-2">
                <HiMiniClipboardDocumentList className="w-8 h-8 text-white" />
                <span className="text-lg font-semibold text-white">Document Submission Progress</span>
              </div>
              {(() => {
                const submittedCount = docs.filter(
                  (doc) => doc.status === "Submitted" || doc.status === "Approved",
                ).length
                const progressPercentage = docs.length > 0 ? (submittedCount / docs.length) * 100 : 0

                return (
                  <>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-white font-medium">
                        Submitted: {submittedCount} of {docs.length}
                      </span>
                      <span className="text-white font-medium">{progressPercentage.toFixed(0)}% Complete</span>
                    </div>
                    <div className="relative w-full h-3 rounded-full bg-white/20 border border-white/20 overflow-hidden mt-4">
                      <div
                        className="absolute left-0 top-0 h-full bg-white/80 transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </>
                )
              })()}
            </div>

            <CardContent className="pt-6">
              {(() => {
                const submittedCount = docs.filter(
                  (doc) => doc.status === "Submitted" || doc.status === "Approved",
                ).length
                const progressPercentage = docs.length > 0 ? (submittedCount / docs.length) * 100 : 0

                return (
                  <div className="space-y-6">
                    {progressPercentage === 100 && (
                      <div className="flex items-center gap-2 text-purple-600 font-medium bg-purple-50 p-3 rounded-lg border border-purple-200">
                        <Sparkles className="w-5 h-5" />
                        All documents submitted! 🎉
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-4 text-gray-700 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-purple-500" />
                          Document Name
                        </h4>
                        <div className="space-y-3">
                          {docs.map((doc, index) => (
                            <div
                              key={index}
                              className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                                doc.status === "Submitted" || doc.status === "Approved"
                                  ? "bg-purple-50 border-purple-200 shadow-sm"
                                  : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              <span
                                className={`text-sm font-medium ${
                                  doc.status === "Submitted" || doc.status === "Approved"
                                    ? "text-purple-800"
                                    : "text-gray-700"
                                }`}
                              >
                                {doc.name}
                              </span>
                              {(doc.status === "Submitted" || doc.status === "Approved") && (
                                <CheckCircle className="w-4 h-4 text-purple-500" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-4 text-gray-700 flex items-center gap-2">
                          <Target className="w-4 h-4 text-purple-500" />
                          Submitted?
                        </h4>
                        <div className="space-y-3">
                          {docs.map((doc, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-center p-3 rounded-lg border bg-white"
                            >
                              <Checkbox
                                checked={doc.status === "Submitted" || doc.status === "Approved"}
                                onCheckedChange={(checked) => handleToggleDoc(index, checked)}
                                className="w-5 h-5 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 cursor-pointer"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
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
