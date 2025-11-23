"use client"

import { useState, useEffect } from "react"
import {
  Users,
  PlusCircle,
  Briefcase,
  UserCheck,
  ArrowUpRight,
  SortAsc,
  RefreshCw,
  Calendar,
  GraduationCap,
  Star,
  ArrowDownLeft,
} from "lucide-react"
import { motion } from "framer-motion"
import { Avatar } from "@mui/material"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader, DashboardLayout, DashboardMain, DashboardSection } from "./dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { RecruiterApplicationDetailsModal } from "../../jobs/applications/components/recruiter-application-details"
import InterviewDetailsModal from "./interview-details-modal"
import { MdOutlineContentPasteSearch, MdStars } from "react-icons/md";
import { IoCloseCircle } from "react-icons/io5";
import { RiUserSearchFill } from "react-icons/ri"
import { FaUsers } from "react-icons/fa"
import { PiCalendarCheckDuotone, PiCoffeeFill } from "react-icons/pi"
import { LuCalendarSearch } from "react-icons/lu"
import { TbFileSad } from "react-icons/tb"
import { Menu, MenuItem, MenuList, Tooltip } from "@mui/material"
import { useSession } from "next-auth/react"

type EducationItem = { degree: string; school: string; year: string }

type Applicant = {
  id: number
  application_id: string
  job_id: string
  job_title?: string
  status?: string
  first_name: string
  last_name: string
  name: string
  position: string
  initials: string
  photo: string
  location: string
  experience: string
  appliedDate: string
  match: number
  email: string
  phone: string
  skills?: string[]
  education?: EducationItem[] | undefined
  expertise?: { skill: string; mastery: number }[] | undefined
  resume?: string
  application_answers?: Record<string, string | string[]>
  achievements?: string[]
  portfolio?: string[]
  raw_achievements?: string | string[] | Record<string, unknown> | null | undefined
  raw_portfolio?: string | string[] | Record<string, unknown> | null | undefined
  profile_image_url?: string
  course?: string
  year?: string
  contactInfo: {
    email?: string
    phone?: string
    socials?: { key: string; url: string }[]
    countryCode?: string
  }
  pay_amount?: string
  pay_type?: string
  work_type?: string
  remote_options?: string
  perks_and_benefits?: string[]
}

type InterviewSchedule = {
  id: string
  application_id?: string
  mode: string
  platform?: string
  address?: string
  team?: string[]
  date: string
  time: string
  notes?: string
  summary?: string
  created_at?: string
  updated_at?: string
  student_id?: string
  employer_id?: string
  student_name?: string
}

function getYearString(year: string | number | null | undefined): string {
  if (!year) return ""
  const y = typeof year === "number" ? year : parseInt(year)
  if (isNaN(y)) return ""
  switch (y) {
    case 1: return "1st year"
    case 2: return "2nd year"
    case 3: return "3rd year"
    case 4: return "4th year"
    default: return `${y}th year`
  }
}

export default function EmployeeDashboard() {
  const [selectedApplicant, setSelectedApplicant] = useState<number | null>(null)
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [selectedApplicantObj, setSelectedApplicantObj] = useState<Applicant | null>(null)
  const [loadingAction, setLoadingAction] = useState<{ [id: number]: "shortlist" | "reject" | null }>({})
  const [analytics, setAnalytics] = useState<{
    totalApplicants: number
    newToday: number
    activeJobs: number
    interviewsScheduled: number
    hiringProgress?: number
    topPerformingJob?: { title: string; applicants: number; views: number; applicationsRate: string }
    totalApplicantsLastMonth?: number
    totalApplicantsThisMonth?: number
    newJobsThisWeek?: number
  } | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [, setAnalyticsError] = useState<string | null>(null)
  const router = useRouter()
  const [loadingApplicants, setLoadingApplicants] = useState(true)
  const [refreshingApplicants, setRefreshingApplicants] = useState(false)
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null)
  const [sortBy, setSortBy] = useState<"date" | "match" | "job" | "year" | "course">("date")


  const candidateMatches = [
    { name: "Alice Brown", position: "Backend Developer", match: 96 },
    { name: "John Doe", position: "UI/UX Designer", match: 92 },
    { name: "Jane Smith", position: "DevOps Engineer", match: 89 },
    { name: "Linda Lee", position: "Mobile Developer", match: 88 },
    { name: "Tom White", position: "Cloud Architect", match: 91 },
    { name: "Nina Gupta", position: "Data Scientist", match: 93 },
  ]

  const fetchApplicants = async () => {
    setLoadingApplicants(true)
    setRefreshingApplicants(true)
    try {
      const res = await fetch("/api/employers/applications")
      const data = await res.json()
      if (Array.isArray(data.applicants)) {
        const applicantsWithDetails = await Promise.all(
          data.applicants.map(async (app: Record<string, unknown>, idx: number): Promise<Applicant> => {
            const first_name = (app.first_name as string) || ""
            const last_name = (app.last_name as string) || ""
            const name = `${first_name} ${last_name}`.trim() || "Unknown"
            let course = ""
            let year: string | number | undefined = undefined
            let profile_image_url: string | undefined = app.profile_image_url as string | undefined
            if (app.student_id) {
              try {
                const detailsRes = await fetch(`/api/employers/applications/getStudentDetails?student_id=${app.student_id}`)
                const details = await detailsRes.json()
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
                if (details) {
                  course = typeof details.course === "string" ? details.course : ""
                  year = typeof details.year === "string" || typeof details.year === "number" ? details.year : undefined
                }
              } catch {}
            }
            const socials = Array.isArray((app as { socials?: unknown }).socials)
              ? ((app as { socials?: { key: string; url: string }[] }).socials ?? [])
              : [];
            const countryCode = typeof (app as { countryCode?: unknown }).countryCode === "string"
              ? (app as { countryCode?: string }).countryCode
              : "";
            const contactInfo = {
              email: typeof (app as { personal_email?: unknown }).personal_email === "string"
                ? (app as { personal_email: string }).personal_email
                : (typeof app.email === "string" ? app.email : ""),
              phone: typeof (app as { personal_phone?: unknown }).personal_phone === "string"
                ? (app as { personal_phone: string }).personal_phone
                : (typeof app.phone === "string" ? app.phone : ""),
              socials,
              countryCode,
            }
            return {
              id: idx,
              application_id: (app.application_id as string) || "",
              job_id: (app.job_id as string) || "",
              job_title: (app.job_title as string) || "",
              status: (app.status as string) || "new",
              first_name,
              last_name,
              name,
              position: (app.job_title as string) || "Unknown",
              initials: (first_name && last_name)
                ? `${first_name[0]}${last_name[0]}`.toUpperCase()
                : (first_name || last_name || "U").slice(0, 2).toUpperCase(),
              photo: "",
              location: (course && year !== undefined)
                ? `${getYearString(year)} ${course}`
                : course || (year !== undefined ? getYearString(year) : "N/A"),
              experience: (app.experience as string) || "",
              appliedDate:
                app.created_at
                  ? new Date(app.created_at as string).toLocaleDateString()
                  : app.applied_at
                    ? new Date(app.applied_at as string).toLocaleDateString()
                    : "",
              match: (app.match_score as number) || 90,
              email: (app.email as string) || "",
              phone: (app.phone as string) || "",
              education: Array.isArray(app.education)
                ? (app.education as unknown[]).map((edu) => {
                    if (typeof edu === "object" && edu !== null) {
                      const e = edu as Record<string, unknown>
                      return {
                        degree: typeof e.degree === "string" ? e.degree : "",
                        school: typeof e.school === "string" ? e.school : "",
                        year: typeof e.year === "string" ? e.year : "",
                      }
                    }
                    return { degree: "", school: "", year: "" }
                  })
                : undefined,
              skills: app.skills as string[] | undefined,
              expertise: Array.isArray(app.expertise)
                ? (app.expertise as unknown[]).filter(
                    (e): e is { skill: string; mastery: number } =>
                      typeof e === "object" &&
                      e !== null &&
                      typeof (e as { skill?: unknown }).skill === "string" &&
                      typeof (e as { mastery?: unknown }).mastery === "number"
                  )
                : undefined,
              resume: app.resume as string | undefined,
              application_answers: app.application_answers as Record<string, string | string[]> | undefined,
              achievements: app.achievements as string[] | undefined,
              portfolio: app.portfolio as string[] | undefined,
              raw_achievements: app.raw_achievements as string | string[] | Record<string, unknown> | null | undefined,
              raw_portfolio: app.raw_portfolio as string | string[] | Record<string, unknown> | null | undefined,
              profile_image_url,
              course: course,
              year: year ? String(year) : undefined,
              contactInfo,
              pay_amount: app.pay_amount as string | undefined,
              pay_type: app.pay_type as string | undefined,
              work_type: app.work_type as string | undefined,
              remote_options: app.remote_options as string | undefined,
              perks_and_benefits: Array.isArray(app.perks_and_benefits) ? app.perks_and_benefits : undefined,
            }
          })
        )
        setApplicants(applicantsWithDetails)
       // console.log("Applicants with details:", applicantsWithDetails)
      }
    } finally {
      setLoadingApplicants(false)
      setRefreshingApplicants(false)
    }
  }

  useEffect(() => {
    fetchApplicants()
  }, [])

  useEffect(() => {
    setAnalyticsLoading(true)
    fetch("/api/employers/applications/analytics")
      .then(res => res.json())
      .then(data => {
        setAnalytics({
          totalApplicants: data.totalApplicants ?? 0,
          newToday: data.newToday ?? 0,
          activeJobs: data.activeJobs ?? 0,
          interviewsScheduled: data.interviewsScheduled ?? 0,
          hiringProgress: data.hiringProgress,
          topPerformingJob: data.topPerformingJob ?? {
            title: "",
            applicants: 0,
            views: 0,
            applicationsRate: "",
          },
          totalApplicantsLastMonth: data.totalApplicantsLastMonth ?? 0,
          totalApplicantsThisMonth: data.totalApplicantsThisMonth ?? 0,
          newJobsThisWeek: data.newJobsThisWeek ?? 0,
        })
        setAnalyticsError(null)
      })
      .catch(() => setAnalyticsError("Failed to load analytics"))
      .finally(() => setAnalyticsLoading(false))
  }, [])

  const getStatusText = (status: string) => {
    switch (status) {
      case "new":
        return "New"
      case "reviewed":
        return "Reviewed"
      case "interview":
        return "Interview"
      case "offer":
        return "Offer"
      default:
        return "Unknown"
    }
  }

  function formatAppliedAgo(dateString?: string) {
    if (!dateString) return ""
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ""
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    const diffWeeks = Math.floor(diffDays / 7)
    const diffMonths = Math.floor(diffDays / 30)
    if (diffMonths >= 1) return date.toLocaleDateString(undefined, { month: "2-digit", day: "2-digit", year: "2-digit" })
    if (diffSecs < 60) return `${diffSecs} second${diffSecs === 1 ? "" : "s"} ago`
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`
    if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks === 1 ? "" : "s"} ago`
    return date.toLocaleDateString(undefined, { month: "2-digit", day: "2-digit", year: "2-digit" })
  }

  async function handleApplicantAction(applicant: Applicant, action: "shortlist" | "reject") {
    setLoadingAction(prev => ({ ...prev, [applicant.id]: action }))
    try {
      const res = await fetch("/api/employers/applications/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ application_id: applicant.application_id, action }),
      })
      const data = await res.json()
      if (res.ok && data.status) {
        setApplicants(prev =>
          prev.map(a =>
            a.id === applicant.id
              ? { ...a, status: data.status }
              : a
          )
        )
      }
    } finally {
      setLoadingAction(prev => ({ ...prev, [applicant.id]: null }))
    }
  }

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget)
  }
  const handleFilterClose = () => {
    setFilterAnchorEl(null)
  }
  const handleSortChange = (key: typeof sortBy) => {
    setSortBy(key)
    setFilterAnchorEl(null)
  }

  const sortedApplicants = applicants
    .filter(applicant => (applicant.status || "").toLowerCase() === "new")
    .sort((a, b) => {
      if (sortBy === "match") {
        return (b.match ?? 0) - (a.match ?? 0)
      }
      if (sortBy === "job") {
        return (a.position || "").localeCompare(b.position || "")
      }
      if (sortBy === "year") {
        return (parseInt(b.year || "0") || 0) - (parseInt(a.year || "0") || 0)
      }
      if (sortBy === "course") {
        return (a.course || "").localeCompare(b.course || "")
      }
      const dateA = new Date(
        ((a as Applicant & { created_at?: string; applied_at?: string }).created_at) ||
        ((a as Applicant & { created_at?: string; applied_at?: string }).applied_at) ||
        a.appliedDate
      ).getTime()
      const dateB = new Date(
        ((b as Applicant & { created_at?: string; applied_at?: string }).created_at) ||
        ((b as Applicant & { created_at?: string; applied_at?: string }).applied_at) ||
        b.appliedDate
      ).getTime()
      return dateB - dateA
    })
    .slice(0, 6)

  const [agenda, setAgenda] = useState<InterviewSchedule[]>([])
  const [agendaLoading, setAgendaLoading] = useState(true)
  const { data: session } = useSession()
  const employerId = session?.user?.employerId

  const [selectedInterview, setSelectedInterview] = useState<InterviewSchedule | null>(null)
  const [interviewModalOpen, setInterviewModalOpen] = useState(false)
  const [interviewsScheduled, setInterviewsScheduled] = useState<number>(0)

  useEffect(() => {
    async function fetchAgenda() {
      setAgendaLoading(true)
      if (!employerId) {
        setAgenda([])
        setInterviewsScheduled(0)
        setAgendaLoading(false)
        return
      }
      const res = await fetch(`/api/employers/applications/agenda?employer_id=${employerId}`)
      const data = await res.json()
      setAgenda(Array.isArray(data.agenda) ? data.agenda : [])
      setInterviewsScheduled(typeof data.interviewsScheduled === "number" ? data.interviewsScheduled : 0)
      setAgendaLoading(false)
    }
    fetchAgenda()
  }, [employerId])

  return (
    <div className="overflow-x-hidden -mt-20">
      <DashboardLayout>
        {/* Header */}
        <DashboardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <motion.div
                className="p-3 bg-white rounded-xl shadow-lg"
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.05 }}
                transition={{ duration: 0.5 }}
              >
                <Briefcase className="h-8 w-8 text-blue-600" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-white">Recruitment Dashboard</h1>
                <p className="text-blue-100">Grow your team with top talent</p>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="transition-transform duration-300"
              >
                <Button
                  size="lg"
                  className="h-12 px-6 bg-white text-blue-600 font-bold shadow-md border border-blue-300 hover:bg-blue-50 hover:shadow-lg"
                  onClick={() => router.push("/employers/jobs/post-a-job")}
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  <span>Post Job</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </DashboardHeader>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="overflow-hidden border-blue-200 bg-gradient-to-br from-white to-blue-50 h-full flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardDescription className="text-blue-600 font-medium">Total Applicants</CardDescription>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FaUsers className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-3xl text-blue-900">
                  {analyticsLoading
                    ? "..."
                    : (analytics?.totalApplicants ?? 0) === 0
                      ? ""
                      : analytics?.totalApplicants}
                </CardTitle>
              </CardHeader>
              <CardContent className="min-h-[48px] flex-1 flex items-center">
                {analyticsLoading ? (
                  <div className="flex items-center text-sm font-medium" style={{ color: "#f59e42" }}>Loading...</div>
                ) : (analytics?.totalApplicants ?? 0) === 0 ? (
                  <div className="flex items-center text-sm font-medium text-gray-400 gap-2 w-full">
                    <PiCoffeeFill className="h-5 w-5 text-gray-300" />
                    Looks like there&apos;s no applicants yet
                  </div>
                ) : (
                  (() => {
                    const thisMonth = analytics?.totalApplicantsThisMonth ?? 0
                    const lastMonth = analytics?.totalApplicantsLastMonth ?? 0
                    const percent = lastMonth === 0
                      ? (thisMonth > 0 ? 100 : 0)
                      : Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
                    if (thisMonth <= lastMonth) {
                      return (
                        <div className="flex items-center text-sm font-medium text-red-500">
                          <ArrowDownLeft className="h-4 w-4 mr-1" />
                          No new applicants this month
                        </div>
                      )
                    }
                    return (
                      <div className="flex items-center text-sm font-medium" style={{ color: "#16a34a" }}>
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        {percent}% increase this month
                      </div>
                    )
                  })()
                )}
              </CardContent>
              <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600 mt-auto"></div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="overflow-hidden border-blue-200 bg-gradient-to-br from-white to-blue-50 h-full flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardDescription className="text-blue-600 font-medium">Active Jobs</CardDescription>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-3xl text-blue-900">
                  {analyticsLoading
                    ? "..."
                    : (analytics?.activeJobs ?? 0) === 0
                      ? ""
                      : analytics?.activeJobs}
                </CardTitle>
              </CardHeader>
              <CardContent className="min-h-[48px] flex-1 flex items-center">
                {analyticsLoading ? (
                  <div className="flex items-center text-sm font-medium" style={{ color: "#f59e42" }}>Loading...</div>
                ) : (analytics?.activeJobs ?? 0) === 0 ? (
                  <div className="flex items-center text-sm  font-medium text-gray-400 gap-2 w-full">
                    <MdOutlineContentPasteSearch  className="h-9 w-9 text-gray-300" />
                    Nothing here. Ope n some listings or create one!
                  </div>
                ) : (
                  <div className="flex items-center text-sm font-medium text-green-600">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    {analytics?.newJobsThisWeek === 0
                      ? "No new postings this week"
                      : `${analytics?.newJobsThisWeek} new postings this week`}
                  </div>
                )}
              </CardContent>
              <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600 mt-auto"></div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="overflow-hidden border-blue-200 bg-gradient-to-br from-white to-blue-50 h-full flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardDescription className="text-blue-600 font-medium">Interviews Scheduled</CardDescription>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <UserCheck className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-3xl text-blue-900">
                  {analyticsLoading
                    ? "..."
                    : (interviewsScheduled ?? 0) === 0
                      ? ""
                      : interviewsScheduled}
                </CardTitle>
              </CardHeader>
              <CardContent className="min-h-[48px] flex-1 flex items-center">
                {analyticsLoading ? (
                  <div className="flex items-center text-sm font-medium" style={{ color: "#f59e42" }}>Loading...</div>
                ) : (interviewsScheduled ?? 0) === 0 ? (
                  <div className="flex items-center text-sm font-medium text-gray-400 gap-2 w-full">
                    <LuCalendarSearch className="h-5 w-5 text-gray-300" />
                    No Interviews scheduled
                  </div>
                ) : (
                  <div className="flex items-center text-sm font-medium text-green-600">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    {interviewsScheduled === 1
                      ? "1 interview scheduled"
                      : `${interviewsScheduled} interviews scheduled`}
                  </div>
                )}
              </CardContent>
              <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600 mt-auto"></div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="overflow-hidden border-blue-200 bg-gradient-to-br from-white to-blue-50 h-full flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardDescription className="text-blue-600 font-medium">Top Performing Job Listing</CardDescription>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-blue-900">
                  {analyticsLoading
                    ? "..."
                    : !analytics?.topPerformingJob?.title || analytics?.topPerformingJob?.applicants === 0
                      ? ""
                      : analytics?.topPerformingJob?.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="min-h-[48px] flex-1 flex items-center">
                {analyticsLoading ? null : !analytics?.topPerformingJob?.title || analytics?.topPerformingJob?.applicants === 0 ? (
                  <div className="flex items-center text-sm font-medium text-gray-400 gap-2 w-full">
                    <TbFileSad  className="h-6 w-6 text-gray-300" />
                    No job listings are trending yet.
                  </div>
                ) : (
                  <div className="flex items-center text-sm font-medium text-green-600 gap-2 mt-1">
                    <FaUsers className="h-4 w-4" />
                    <span>
                      {analytics.topPerformingJob.applicants} applicants
                    </span>
                  </div>
                )}
              </CardContent>
              <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600 mt-auto"></div>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <DashboardMain>
          {/* Applicants Section */}
          <DashboardSection colSpan="col-span-12 lg:col-span-7 flex flex-col">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="h-full flex flex-col">
              <Card className="border-blue-200 overflow-visible flex flex-col h-full min-h-[600px] max-h-none">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <div>
                    <CardTitle className="text-white flex items-center">
                      <Users className="mr-2 h-5 w-5" /> New Applicants
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      View your recent applicants and manage their applications
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-blue-600/30 border-blue-400 text-white hover:bg-blue-600/50 hover:text-white"
                      onClick={handleFilterClick}
                    >
                      <SortAsc className="h-4 w-4 mr-1" />
                      Sort By
                    </Button>
                    <Menu
                      anchorEl={filterAnchorEl}
                      open={Boolean(filterAnchorEl)}
                      onClose={handleFilterClose}
                      PaperProps={{
                        style: { minWidth: 180, marginTop: 8, background: "#fff" }
                      }}
                    >
                      <MenuList>
                        <MenuItem selected={sortBy === "date"} onClick={() => handleSortChange("date")}>Sort by Date</MenuItem>
                        <MenuItem selected={sortBy === "match"} onClick={() => handleSortChange("match")}>Sort by Match</MenuItem>
                        <MenuItem selected={sortBy === "job"} onClick={() => handleSortChange("job")}>Sort by Job Title</MenuItem>
                        <MenuItem selected={sortBy === "year"} onClick={() => handleSortChange("year")}>Sort by Year</MenuItem>
                        <MenuItem selected={sortBy === "course"} onClick={() => handleSortChange("course")}>Sort by Course</MenuItem>
                      </MenuList>
                    </Menu>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-blue-600/30 border-blue-400 text-white hover:bg-blue-600/50 hover:text-white"
                      onClick={fetchApplicants}
                      disabled={refreshingApplicants}
                    >
                      <Tooltip title="Refresh Applicants" arrow>
                        <span>
                          {refreshingApplicants ? (
                            <span className="w-4 h-4 border-2 border-blue-200 border-t-transparent rounded-full animate-spin inline-block" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </span>
                      </Tooltip>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 min-h-0 overflow-visible">
                  <div className="divide-y divide-blue-100">
                    {loadingApplicants ? (
                      <div className="flex flex-col justify-center items-center min-h-[300px] w-full py-16">
                        <span className="inline-block w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
                        <span className="mt-4 text-blue-500 text-base font-medium animate-pulse">Fetching new applicants...</span>
                      </div>
                    ) : sortedApplicants.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 min-h-[600px] h-full">
                        <span className="mb-3">
                          <span className="inline-flex items-center justify-center rounded-full bg-gray-100 p-4">
                            <span className="text-4xl text-gray-400">
                              <RiUserSearchFill className="h-8 w-8" />
                            </span>
                          </span>
                        </span>
                        <div className="text-gray-500 text-base font-medium mt-2 flex items-center gap-2">
                          <span className="text-xl"></span>
                          You don&apos;t have any new applicants yet.
                        </div>
                        <div className="text-gray-400 text-sm mt-1">Check back soon to see new applications here.</div>
                        <div className="w-full flex justify-center mt-6">
                          <Button
                            className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 mt-3 rounded-md font-semibold"
                            style={{ borderRadius: "8px" }}
                            onClick={e => {
                              e.stopPropagation();
                              router.push("/employers/jobs/applications");
                            }}
                          >
                            View All Applicants
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {sortedApplicants.map((applicant) => (
                          <motion.div
                            key={applicant.id}
                            className={`flex items-center p-4 hover:bg-blue-50 transition-colors cursor-pointer ${
                              selectedApplicant === applicant.id ? "bg-yellow-50" : ""
                            }`}
                            onClick={() => {
                              setSelectedApplicant(applicant.id)
                              setSelectedApplicantObj(applicant)
                              setDetailsModalOpen(true)
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            <Avatar
                              className="h-12 w-12 mr-4 border-2 border-blue-200"
                              src={typeof applicant.profile_image_url === "string" ? applicant.profile_image_url : undefined}
                            >
                              {applicant.initials}
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-blue-900 flex items-center">
                                  {applicant.name}
                                  {(applicant.status || "").toLowerCase() === "new" && (
                                    <Badge className="ml-2 bg-yellow-100 text-yellow-600 border-none">New</Badge>
                                  )}
                                </h4>
                                {applicant.status === "new" && (
                                  <Badge className="ml-2 bg-yellow-500 text-white border-none">{getStatusText(applicant.status ?? "")}</Badge>
                                )}
                                {applicant.status === "reviewed" && (
                                  <Badge className="ml-2 bg-amber-500 text-white border-none">{getStatusText(applicant.status ?? "")}</Badge>
                                )}
                                {applicant.status === "interview" && (
                                  <Badge className="ml-2 bg-purple-500 text-white border-none">{getStatusText(applicant.status)}</Badge>
                                )}
                                {applicant.status === "offer" && (
                                  <Badge className="ml-2 bg-green-600 text-white border-none">{getStatusText(applicant.status)}</Badge>
                                )}
                              </div>
                              <div className="flex items-center text-sm text-blue-700">
                                <Briefcase className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span className="truncate">
                                  {applicant.position.length > 30
                                    ? applicant.position.slice(0, 30) + "…"
                                    : applicant.position}
                                </span>
                                <span className="mx-2 text-blue-300">•</span>
                                <span className="text-xs">
                                  Applied {formatAppliedAgo(
                                    ((applicant as Applicant & { created_at?: string; applied_at?: string }).created_at) ||
                                    ((applicant as Applicant & { created_at?: string; applied_at?: string }).applied_at) ||
                                    applicant.appliedDate
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center mt-1 text-xs text-blue-600">
                                <div className="flex items-center mr-3">
                                  <GraduationCap className="h-3 w-3 mr-1" />
                                  <span>{applicant.location}</span>
                                </div>
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 mr-1 text-yellow-500 fill-yellow-500" />
                                  <span className="font-medium">{applicant.match}% match</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <span title="Shortlist">
                                <button
                                  type="button"
                                  className="p-2 rounded-full hover:bg-blue-100 transition-colors"
                                  onClick={e => {
                                    e.stopPropagation()
                                    handleApplicantAction(applicant, "shortlist")
                                  }}
                                  disabled={loadingAction[applicant.id] === "shortlist" || loadingAction[applicant.id] === "reject"}
                                >
                                  {loadingAction[applicant.id] === "shortlist" ? (
                                    <span className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin inline-block" />
                                  ) : (
                                    <MdStars className="w-5 h-5 text-blue-600" />
                                  )}
                                </button>
                              </span>
                              <span title="Reject">
                                <button
                                  type="button"
                                  className="p-2 rounded-full hover:bg-red-100 transition-colors"
                                  onClick={e => {
                                    e.stopPropagation()
                                    handleApplicantAction(applicant, "reject")
                                  }}
                                  disabled={loadingAction[applicant.id] === "shortlist" || loadingAction[applicant.id] === "reject"}
                                >
                                  {loadingAction[applicant.id] === "reject" ? (
                                    <span className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin inline-block" />
                                  ) : (
                                    <IoCloseCircle className="w-5 h-5 text-red-600" />
                                  )}
                                </button>
                              </span>
                            </div>
                          </motion.div>
                        ))}
                        <div className="w-full flex justify-center mt-4">
                          <Button
                            className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 mt-3 rounded-md font-semibold"
                            style={{ borderRadius: "8px" }}
                            onClick={e => {
                              e.stopPropagation();
                              router.push("/employers/jobs/applications");
                            }}
                          >
                            View All Applicants
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
               
              </Card>
            </motion.div>
          </DashboardSection>

          {/* Agenda and Candidate Matches Section */}
          <DashboardSection colSpan="col-span-12 lg:col-span-5 flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="h-full flex flex-col"
            >
              <Card className="border-blue-200 bg-gradient-to-br from-blue-600 to-blue-700 text-white overflow-visible flex flex-col h-full min-h-[600px] max-h-none">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <Calendar className="mr-2 h-5 w-5" /> Today&apos;s Agenda
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-blue-100 hover:text-white hover:bg-blue-500/20">
                      View Calendar
                    </Button>
                  </div>
                  <CardDescription className="text-blue-200">
                    {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 min-h-0 overflow-visible">
                  <div className="space-y-4">
                    {agendaLoading ? (
                      <div className="flex flex-col items-center justify-center py-16 min-h-[200px]">
                        <span className="inline-block w-10 h-10 border-4 border-blue-300 border-t-transparent rounded-full animate-spin"></span>
                      </div>
                    ) : agenda.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 min-h-[200px]">
                        <PiCalendarCheckDuotone className="h-24 w-24 text-blue-300 mb-3" />
                        <div className="text-blue-300 text-base font-normal">
                          Nothing scheduled for today. Enjoy your day!
                        </div>
                      </div>
                    ) : (
                      <>
                        {agenda.slice(0, 3).map((item, index) => {
                          let displayTime = item.time;
                          if (item.time) {
                            const [h, m] = item.time.split(":");
                            const hour = parseInt(h, 10);
                            const ampm = hour >= 12 ? "PM" : "AM";
                            const hour12 = ((hour + 11) % 12 + 1);
                            displayTime = `${hour12}:${m.padStart(2, "0")} ${ampm}`;
                          }
                          const truncate = (str?: string, n = 32) =>
                            str && str.length > n ? str.slice(0, n - 1) + "…" : str;

                          return (
                            <motion.div
                              key={item.id}
                              className="flex items-start cursor-pointer"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 * index + 0.3 }}
                              whileHover={{ y: -3, transition: { duration: 0.2 } }}
                              onClick={() => {
                                setSelectedInterview(item);
                                setInterviewModalOpen(true);
                              }}
                            >
                              <div className="flex flex-col items-center mr-4">
                                <div className="text-sm font-medium text-blue-200">
                                  {displayTime}
                                </div>
                                {index < Math.min(agenda.length, 3) - 1 && (
                                  <div className="w-px h-full bg-blue-400/30 my-1 flex-grow"></div>
                                )}
                              </div>
                              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 flex-1 shadow-lg hover:bg-white/20 transition-colors">
                                <div className="flex items-start">
                                  <div
                                    className={`p-2 rounded-md mr-3 ${
                                      item.mode === "Online"
                                        ? "bg-purple-500/20"
                                        : "bg-blue-500/20"
                                    }`}
                                  >
                                    <UserCheck className="h-4 w-4 text-purple-200" />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-white">
                                      Interview{item.student_name ? ` with ${item.student_name}` : ""}
                                    </h4>
                                    <p className="text-xs text-blue-200 mt-1">
                                      {item.mode} Meeting
                                      {" | "}
                                      {item.mode === "Online"
                                        ? item.platform || ""
                                        : truncate(item.address || "")}
                                    </p>
                                    {/* Notes and summary removed from card */}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                        {agenda.length > 3 && (
                          <div className="flex justify-center mt-2">
                            <button
                              type="button"
                              className="text-blue-200 mt-5 hover:text-white text-sm font-medium px-3 py-2 bg-transparent border-none cursor-pointer"
                              onClick={() => {
                                router.push("/employers/calendar");
                              }}
                            >
                              Show all {agenda.length} Agenda
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="bg-gradient-to-b from-blue-700 to-blue-800 p-4">
                  <div className="flex flex-col items-center">
                    <h3 className="text-lg font-medium text-white mb-4">Candidate Matches for You</h3>
                    <div className="grid grid-cols-3 gap-3 justify-center">
                      {candidateMatches.slice(0, 6).map((candidate, index) => (
                        <motion.div
                          key={index}
                          className="flex flex-col justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors min-h-[72px]"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.05 * index }}
                        >
                          <div>
                            <h4 className="text-sm font-medium text-white">{candidate.name}</h4>
                            <p className="text-xs text-blue-200">{candidate.position}</p>
                          </div>
                          <div className="text-sm font-medium text-yellow-400 mt-2">{candidate.match}%</div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex justify-end w-full mt-3">
                      <button type="button" className="text-blue-200 hover:text-white text-sm font-medium px-2 py-1 bg-transparent border-none cursor-pointer">
                        View More
                      </button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </DashboardSection>
        </DashboardMain>
      </DashboardLayout>
      <RecruiterApplicationDetailsModal
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        applicant={selectedApplicantObj as any}
        isModalOpen={detailsModalOpen}
        setIsModalOpen={setDetailsModalOpen}
      />
      <InterviewDetailsModal
        open={interviewModalOpen}
        onClose={() => setInterviewModalOpen(false)}
        interview={selectedInterview}
      />
      <svg style={{ display: "none" }}>
        <symbol id="mdstars" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </symbol>
        <symbol id="ioclosecircle" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
        </symbol>
      </svg>
    </div>
  )
}




