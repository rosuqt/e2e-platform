/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useEffect, useState, useRef, useMemo, useCallback } from "react"
import {
  Search,
  Calendar,
  FileText,
  Filter,
  MoreHorizontal,
  ArrowUpRight,
  ChevronRight,
  Briefcase,
  Globe,
  X as XIcon,
  ChevronDown,
  ChevronUp,
  BarChart2,
  CalendarDays,
  Edit,
  Mail,
  RotateCw
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ApplicationDetailsModal } from "./application-details"
import { FollowUpChatModal } from "./follow-up-chat-modal"
import { JobRatingModal } from "./job-rating-modal"
import { ViewOfferModal } from "./view-offer"
import { toast } from "react-toastify"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import IconButton from "@mui/material/IconButton"
import { PiMoneyDuotone } from "react-icons/pi"
import Image from "next/image"
import { TbUserSearch } from "react-icons/tb"
import { MdOutlineExitToApp } from "react-icons/md"
import { HiBadgeCheck } from "react-icons/hi"
import { RiErrorWarningLine, RiMailStarFill } from "react-icons/ri"
import { BadgeCheck as LuBadgeCheck } from "lucide-react"
import Tooltip from "@mui/material/Tooltip"
import { styled } from "@mui/material/styles"
import { AiFillStar } from "react-icons/ai"
import { useSearchParams, useRouter } from "next/navigation"
import { BsMailbox2Flag } from "react-icons/bs"
import { IoIosCloseCircleOutline } from "react-icons/io"
import { FaUserCheck } from "react-icons/fa"
import { TbClockQuestion } from "react-icons/tb"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { StudentFilterModal as FilterModal } from "./filter-modal"
import type { Filters } from "./filter-modal"
import { ApplicationTips } from "./application-tips"
import { useSession } from "next-auth/react"
import { WarningModal } from "./ui/warningmodal"

type JobPosting = {
  employer_id?: string
  job_title?: string
  location?: string
  remote_options?: string
  work_type?: string
  pay_type?: string
  pay_amount?: string | number
  recommended_course?: string
  job_description?: string
  job_summary?: string
  must_have_qualifications?: string[]
  nice_to_have_qualifications?: string[]
  application_deadline?: string
  max_applicants?: number
  perks_and_benefits?: string[]
  verification_tier?: string
  created_at?: string
  responsibilities?: string
  id?: string
  paused?: boolean
  company_id?: string
  company_logo_image_path?: string
  registered_employers?: {
    company_name?: string
    first_name?: string
    last_name?: string
    job_title?: string
    email?: string
    phone?: string
    country_code?: string
  }
  achievements?: string[]
  portfolio?: string[]
}

type ApplicationData = {
  job_postings?: JobPosting
  applied_at?: string
  match_score?: string
  company_name?: string
  status?: string
  remote_options?: string
  company_logo_image_path?: string
  profile_img?: string
  resume?: string
  resumeUrl?: string
  id?: string | number
  achievements?: string[]
  portfolio?: string[]
  application_id?: string | number
  job_id?: string | number | null
  gpt_score?: number | string
  is_inivted?: boolean
  is_invited?: boolean
  is_archived?: boolean
  application_answers?: any
  notes?: { note: string; date_added: string; isEmployer?: boolean }[] | string
  followed_up: boolean
}

type JobRatingData = {
  companyLogo: string
  jobTitle: string
  recruiterName: string
  companyName: string
  dateOfHiring: string
  jobType: string
  department: string
  location: string
}

type StudentRecentActivity = {
  company: string
  position: string
  update: string
  time: string
  status?: string
}

const CustomTooltip = styled(Tooltip)(() => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: "#fff",
    color: "#222",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    fontSize: 13,
    borderRadius: 8,
    padding: "8px 14px",
    fontWeight: 500,
    letterSpacing: 0.1,
  },
  [`& .MuiTooltip-arrow`]: {
    color: "#fff",
  },
}))

const studentActivityIconMap: Record<string, { icon: React.ReactNode; iconBg: string }> = {
  new: { icon: <FileText className="h-4 w-4 text-white" />, iconBg: "bg-yellow-500" },
  shortlisted: { icon: <Search className="h-4 w-4 text-white" />, iconBg: "bg-cyan-500" },
  interview: { icon: <Calendar className="h-4 w-4 text-white" />, iconBg: "bg-purple-500" },
  offer_sent: {
    icon: <PiMoneyDuotone className="h-4 w-4 text-white" />,
    iconBg: "bg-lime-500"
  },
  offer_rejected: {
    icon: <IoIosCloseCircleOutline className="h-4 w-4 text-white" />,
    iconBg: "bg-red-400"
  },
  student_rating: {
    icon: <AiFillStar className="h-4 w-4 text-yellow-400" />,
    iconBg: "bg-yellow-300"
  },
  waitlisted: { icon: <TbClockQuestion className="h-4 w-4 text-white" />, iconBg: "bg-blue-500" },
  rejected: { icon: <IoIosCloseCircleOutline className="h-4 w-4 text-white" />, iconBg: "bg-red-500" },
  hired: { icon: <FaUserCheck className="h-4 w-4 text-white" />, iconBg: "bg-green-700" },
  withdrawn: { icon: <MdOutlineExitToApp className="h-4 w-4 text-white" />, iconBg: "bg-gray-500" },
}

function formatStudentActivityTime(dateString?: string) {
  if (!dateString) return ""
  let date: Date | null = null
  if (typeof dateString === "string" && dateString.includes("T")) {
    date = new Date(dateString)
  } else if (typeof dateString === "string") {
    date = new Date(Date.parse(dateString))
  }
  if (!date || isNaN(date.getTime())) return dateString
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const month = monthNames[date.getMonth()]
  const day = date.getDate().toString().padStart(2, "0")
  const year = date.getFullYear().toString()
  return `${month} ${day} ${year}`
}

export default function ApplicationTrackerNoSidebar() {
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalApplicationId, setModalApplicationId] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false)
  const [followUpDetails] = useState<{ employerName: string; jobTitle: string; company: string; application_id: any; } | null>(null)

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [menuCardId, setMenuCardId] = useState<string | null>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    event.stopPropagation()
    setMenuAnchorEl(event.currentTarget)
    setMenuCardId(id)
  }
  const handleMenuClose = () => {
    setMenuAnchorEl(null)
    setMenuCardId(null)
  }

  const [confirmWithdrawOpen, setConfirmWithdrawOpen] = useState(false)
  const [confirmWithdrawId, setConfirmWithdrawId] = useState<string | null>(null)
  const [applicationsData, setApplicationsData] = useState<ApplicationData[] | null>(null)
  const confirmWithdrawTitle = useMemo(() => {
    if (!confirmWithdrawId) return ""
    const app = applicationsData?.find(a =>
      String(a.application_id ?? a.id ?? a.job_postings?.id ?? "") === confirmWithdrawId
    )
    return app?.job_postings?.job_title || "this application"
  }, [confirmWithdrawId, applicationsData])

  const withdrawApplication = async (logicalId: string) => {
    try {
      const res = await fetch("/api/employers/applications/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ application_id: logicalId, action: "withdraw" }),
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json?.error || "Failed to withdraw application")
        return
      }
      setApplicationsData(prev =>
        (prev || []).map(a => {
          const id = String(a.application_id ?? a.id ?? a.job_postings?.id ?? "")
          return id === logicalId ? { ...a, status: "withdrawn" } : a
        })
      )
      toast.success("Application withdrawn")
    } catch {
      toast.error("Failed to withdraw application")
    }
  }

  const handleWithdraw = async () => {
    if (!menuCardId) return
    setConfirmWithdrawId(menuCardId)
    setConfirmWithdrawOpen(true)
    handleMenuClose()
  }
  const handleEdit = () => {
    toast.info("Edit application " + menuCardId)
    handleMenuClose()
  }
  const handleViewCompany = () => {
    toast.info("View company for application " + menuCardId)
    handleMenuClose()
  }



  const menuIsPending = useMemo(() => {
    if (!menuCardId || !applicationsData) return false
    const app = applicationsData.find(
      a => String(a.application_id ?? a.id ?? a.job_postings?.id ?? "") === menuCardId
    )
    if (!app) return false
    return mapAppStatus(app.status) === "pending"
  }, [menuCardId, applicationsData])

  const [logoUrls, setLogoUrls] = useState<{ [key: string]: string | null }>({})
  const [logoRetryCounts, setLogoRetryCounts] = useState<{ [path: string]: number }>({})
  const searchParams = useSearchParams()
  const router = useRouter()
  const [prefilledApplicationId, setPrefilledApplicationId] = useState<string | null>(null)
  const [prefillHandled, setPrefillHandled] = useState(false)
  const [highlightLogicalId, setHighlightLogicalId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [recentUpdates, setRecentUpdates] = useState<StudentRecentActivity[] | null>(null)

  const [activeTab, setActiveTab] = useState("all")
  const [page, setPage] = useState(1)
  const pageSize = 5

  const [searchQuery, setSearchQuery] = useState("")
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"match" | "date">("date")
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc") 
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>({})

  const withdrawnActive = (filters.status?.length === 1 && filters.status[0] === "withdrawn")

  const [studentId, setStudentId] = useState<string | null>(null)
  const matchesMergedRef = useRef(false)
  const { data: session } = useSession()


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

  const [refreshing, setRefreshing] = useState(false)
  const fetchApplications = async () => {
    setLoading(true)
    setRefreshing(true)
    try {
      const res = await fetch("/api/students/applications")
      const data = await res.json()
      const applicationsWithResume = await Promise.all(
        (data.applications || []).map(async (app: any) => {
          let resumeUrl = app.resumeUrl ?? ""
          const resume = app.resume ?? ""
          if (resume && !resumeUrl) {
            let found = false
            for (const bucket of ["student.documents"]) {
              try {
                const res = await fetch("/api/students/get-signed-url", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ bucket, path: resume })
                })
                const json = await res.json()
                if (json && json.signedUrl) {
                  resumeUrl = json.signedUrl
                  found = true
                  break
                }
              } catch {}
            }
            if (!found) resumeUrl = ""
          }
          return {
            ...app,
            resume,
            resumeUrl,
            achievements: app.achievements || [],
            portfolio: app.portfolio || [],
            job_id: app.job_id ?? (app as any).job_posting_id ?? app.job_postings?.id ?? undefined,
            application_answers: app.application_answers,
            notes: app.notes,
          }
        })
      )
      setApplicationsData(applicationsWithResume)
      if (studentId) {
        const activityRes = await fetch(`/api/employers/applications/activity?student_id=${studentId}`)
        const activityData = await activityRes.json()
        const recent: StudentRecentActivity[] = (activityData || [])
          .map((act: any) => ({
            company: "",
            position: act.job_title || act.position || "Position",
            update:
              act.type === "hired"
                ? "Congratulations! You've been hired!"
                : act.type === "waitlisted"
                  ? "Your interview has been completed, awaiting further review!"
                : act.type === "interview_scheduled" || act.type === "interview"
                  ? "You are scheduled for an interview!"
                  : act.type === "shortlisted"
                    ? "Your application has been shortlisted!"
                  : act.type === "offer_sent" || act.type === "offer sent"
                    ? "You've received a job offer! 🎉"
                  : act.type === "offer_rejected"
                    ? "You have rejected the job offer."
                  : act.type === "student_rating"
                    ? "Please rate your job experience!"
                  : act.message || act.update,
            time: act.created_at || act.time || "",
            status: act.type || "",
          }))
          .sort((a: StudentRecentActivity, b: StudentRecentActivity) => {
            const ta = new Date(a.time).getTime()
            const tb = new Date(b.time).getTime()
            return tb - ta
          })
          .slice(0, 6)
        setRecentUpdates(recent)
      }
    } catch {}
    setLoading(false)
    setRefreshing(false)
  }
  useEffect(() => {
    fetchApplications()
  }, [studentId])

  useEffect(() => {
    const param = searchParams?.get("application")
    if (param && !prefillHandled) {
      setPrefilledApplicationId(param)
      setHighlightLogicalId(param)
    }
  }, [searchParams, prefillHandled])

  useEffect(() => {
    if (!applicationsData || !prefilledApplicationId || prefillHandled) return

    const normalized = String(prefilledApplicationId)
    const idx = applicationsData.findIndex(app =>
      String(app.application_id ?? app.id ?? app.job_postings?.id ?? "") === normalized
    )

    if (idx !== -1) {
      const reordered = [
        applicationsData[idx],
        ...applicationsData.filter((_, i) => i !== idx),
      ]
      setApplicationsData(reordered)
      setSelectedApplication(normalized)

      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search)
        params.set("application", normalized)
        const query = params.toString() ? `?${params.toString()}` : ""
        router.replace(`/students/jobs/applications${query}`)
      }

      setPrefillHandled(true)
      setTimeout(() => {
        setHighlightLogicalId(null)
      }, 2000)
    }
  }, [applicationsData, prefilledApplicationId, prefillHandled, router])

  useEffect(() => {
    async function fetchLogos() {
      if (!applicationsData) return
      const newLogoUrls: { [key: string]: string | null } = {}
      const updatedRetryCounts: { [path: string]: number } = { ...logoRetryCounts }
      const maxRetries = 3

      await Promise.all(
        applicationsData.map(async (app, idx) => {
          const logoPath = app.company_logo_image_path || app.job_postings?.company_logo_image_path
          const key = String(app.application_id ?? app.id ?? app.job_postings?.id ?? idx)
          if (!logoPath) {
            newLogoUrls[key] = null
            return
          }

          const cacheKey = `companyLogoUrl:${logoPath}`
          const cached = sessionStorage.getItem(cacheKey)

          let shouldFetchNew = true
          if (cached) {
            try {
              const parsed = JSON.parse(cached)
              const candidate =
                typeof parsed === "string"
                  ? parsed
                  : parsed && typeof parsed === "object" && (parsed as any).url && typeof (parsed as any).url === "string"
                    ? (parsed as any).url
                    : null

              if (candidate) {
                try {
                  const headRes = await fetch(candidate, { method: "HEAD" })
                  if (headRes.ok) {
                    newLogoUrls[key] = candidate
                    shouldFetchNew = false
                  } else {
                    sessionStorage.removeItem(cacheKey)
                  }
                } catch {
                  sessionStorage.removeItem(cacheKey)
                }
              } else {
                sessionStorage.removeItem(cacheKey)
              }
            } catch {
              sessionStorage.removeItem(cacheKey)
            }
          }

          if (!shouldFetchNew) return

          const currentRetries = updatedRetryCounts[logoPath] ?? 0
          if (currentRetries >= maxRetries) {
            newLogoUrls[key] = null
            return
          }

          try {
            const res = await fetch("/api/employers/get-signed-url", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                bucket: "company.logo",
                path: logoPath,
              }),
            })
            const json = await res.json()

            let url = ""
            if (typeof json.signedUrl === "string") {
              url = json.signedUrl
            } else if (json.url && typeof json.url === "string") {
              url = json.url
            }

            if (url && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/"))) {
              newLogoUrls[key] = url
              sessionStorage.setItem(cacheKey, JSON.stringify(url))
              updatedRetryCounts[logoPath] = currentRetries + 1
            } else {
              newLogoUrls[key] = null
              sessionStorage.removeItem(cacheKey)
              updatedRetryCounts[logoPath] = currentRetries + 1
            }
          } catch {
            newLogoUrls[key] = null
            sessionStorage.removeItem(cacheKey)
            updatedRetryCounts[logoPath] = currentRetries + 1
          }
        })
      )

      setLogoRetryCounts(updatedRetryCounts)
      setLogoUrls(prev => ({ ...prev, ...newLogoUrls }))
    }
    fetchLogos()
  }, [applicationsData, logoRetryCounts])

  useEffect(() => {
    async function fetchProfileImgs() {
      if (!applicationsData) return
      const newProfileImgUrls: { [key: number]: string | null } = {}
      await Promise.all(
        applicationsData.map(async (app, idx) => {
          const profile_img = app?.profile_img
          if (!profile_img) {
            newProfileImgUrls[idx] = null
            return
          }
          if (profile_img.startsWith("http")) {
            newProfileImgUrls[idx] = profile_img
            return
          }
          const url =
            typeof window !== "undefined"
              ? `${window.location.origin}/api/employers/get-signed-url?bucket=user.avatars&path=${encodeURIComponent(
                  profile_img
                )}`
              : `/api/employers/get-signed-url?bucket=user.avatars&path=${encodeURIComponent(
                  profile_img
                )}`
          try {
            const res = await fetch(url)
            const data = await res.json()
            newProfileImgUrls[idx] = data.signedUrl || null
          } catch {
            newProfileImgUrls[idx] = null
          }
        })
      )

    }
    fetchProfileImgs()
  }, [applicationsData])

  const handleViewDetails = (logicalId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setModalApplicationId(logicalId)
    setIsModalOpen(true)
  }

  const handleFollowUp = async (logicalId: string, e: React.MouseEvent,) => {
    try {
      setLoading(true);
      console.log(logicalId)
      const res = await fetch("/api/students/applications/follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: logicalId,
          content: "Hello! I would like to follow up on my application.", 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error:", data.error);
      } else {
        console.log("Message sent:", data);
      }

    } catch (err) {
      console.error("Unexpected error:", err);
    }

    setLoading(false);
  
  }

  const [isJobRatingModalOpen, setIsJobRatingModalOpen] = useState(false)
  const [jobRatingData, setJobRatingData] = useState<JobRatingData | null>(null)
  const [jobRatingCompanyImg, setJobRatingCompanyImg] = useState<string>("")
  const [jobRatingRecruiterImg, setJobRatingRecruiterImg] = useState<string>("")
  const [jobRatingRecruiterName, setJobRatingRecruiterName] = useState<string>("")
  const [jobRatingJobId, setJobRatingJobId] = useState<string>("")

  async function handleOpenJobRatingModal(app: ApplicationData) {
    setJobRatingJobId(app.job_postings?.id || "")
    let logo = ""
    let recruiterImg = ""
    let recruiterName = ""
    const logoPath = app.company_logo_image_path || app.job_postings?.company_logo_image_path || ""
    if (logoPath) {
      try {
        const res = await fetch("/api/employers/get-signed-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bucket: "company.logo",
            path: logoPath,
          }),
        })
        const json = await res.json()
        if (json.signedUrl && typeof json.signedUrl === "string") {
          logo = json.signedUrl
        }
      } catch {
        logo = ""
      }
    }
    const recruiterProfileImg = app.profile_img || ""
    if (recruiterProfileImg) {
      if (recruiterProfileImg.startsWith("http")) {
        recruiterImg = recruiterProfileImg
      } else {
        try {
          const res = await fetch("/api/employers/get-signed-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bucket: "user.avatars",
              path: recruiterProfileImg,
            }),
          })
          const json = await res.json()
          recruiterImg = json.signedUrl || ""
        } catch {
          recruiterImg = ""
        }
      }
    }
    recruiterName = app.job_postings?.registered_employers?.first_name
      ? `${app.job_postings?.registered_employers?.first_name} ${app.job_postings?.registered_employers?.last_name || ""}`.trim()
      : ""
    setJobRatingCompanyImg(logo)
    setJobRatingRecruiterImg(recruiterImg)
    setJobRatingRecruiterName(recruiterName)
    setJobRatingData({
      companyLogo: logo,
      jobTitle: app.job_postings?.job_title || "",
      recruiterName,
      companyName: app.company_name || app.job_postings?.registered_employers?.company_name || "",
      dateOfHiring: app.applied_at || "",
      jobType: app.job_postings?.work_type || "",
      department: "",
      location: app.job_postings?.location || "",
    })
    setIsJobRatingModalOpen(true)
  }

  const [acceptOfferOpen, setAcceptOfferOpen] = useState(false)
  const [acceptOfferId, setAcceptOfferId] = useState<string | null>(null)
  const [viewOfferOpen, setViewOfferOpen] = useState(false)
  const [viewOfferId, setViewOfferId] = useState<string | null>(null)
  const acceptOfferTitle = useMemo(() => {
    if (!acceptOfferId) return ""
    const app = applicationsData?.find(a =>
      String(a.application_id ?? a.id ?? a.job_postings?.id ?? "") === acceptOfferId
    )
    return app?.job_postings?.job_title || "this offer"
  }, [acceptOfferId, applicationsData])

  const acceptOffer = useCallback(async (logicalId: string) => {
    try {
      const res = await fetch("/api/employers/applications/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ application_id: logicalId, action: "accept_offer" }),
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json?.error || "Failed to accept offer")
        return
      }
      setApplicationsData(prev =>
        (prev || []).map(a => {
          const id = String(a.application_id ?? a.id ?? a.job_postings?.id ?? "")
          return id === logicalId ? { ...a, status: "hired" } : a
        })
      )
      toast.success("Offer accepted! Congratulations!")
      setViewOfferId(logicalId)
      setViewOfferOpen(true)
    } catch {
      toast.error("Failed to accept offer")
    }
  }, [])

  const allAppsRaw = applicationsData || []
  const pendingAppsRaw = allAppsRaw.filter(a => (a.status || "").toLowerCase() === "new")
  const reviewAppsRaw = allAppsRaw.filter(a => (a.status || "").toLowerCase() === "shortlisted")
  const interviewAppsRaw = allAppsRaw.filter(a => (a.status || "").toLowerCase() === "interview")
  const hiredAppsRaw = allAppsRaw.filter(a => (a.status || "").toLowerCase() === "hired")
  const rejectedAppsRaw = allAppsRaw.filter(a => (a.status || "").toLowerCase() === "rejected")
  const offerAppsRaw = allAppsRaw.filter(a => (a.status || "").toLowerCase() === "offer_sent")

  const normalize = (value?: string) => (value || "").toLowerCase()

  const filterBySearch = (apps: ApplicationData[]) => {
    if (!appliedSearchQuery.trim()) return apps
    const q = normalize(appliedSearchQuery)
    return apps.filter(app => {
      const title = normalize(app.job_postings?.job_title || "")
      const company = normalize(app.company_name || app.job_postings?.registered_employers?.company_name || "")
      const location = normalize(app.job_postings?.location || "")
      const status = normalize(app.status || "")
      return (
        title.includes(q) ||
        company.includes(q) ||
        location.includes(q) ||
        status.includes(q)
      )
    })
  }

  function applyFilters(apps: ApplicationData[]) {
    let out = [...apps]
    if (filters.status?.length) {
      out = out.filter(a => filters.status!.includes((a.status || "").toLowerCase()))
    }
    if (filters.workType?.length) {
      out = out.filter(a => filters.workType!.includes((a.job_postings?.work_type || "").toLowerCase()))
    }
    if (filters.remote?.length) {
      out = out.filter(a => filters.remote!.includes((a.job_postings?.remote_options || a.remote_options || "").toLowerCase()))
    }
    if (filters.location?.length) {
      out = out.filter(a => filters.location!.includes((a.job_postings?.location || "").toLowerCase()))
    }
    if (filters.payType?.length) {
      out = out.filter(a => filters.payType!.includes((a.job_postings?.pay_type || "").toLowerCase()))
    }
    if (filters.verification?.length) {
      out = out.filter(a => filters.verification!.includes((a.job_postings?.verification_tier || "").toLowerCase()))
    }
    if (filters.company?.length) {
      out = out.filter(a => filters.company!.includes((a.company_name || a.job_postings?.registered_employers?.company_name || "").toLowerCase()))
    }
    if (filters.matchScoreMin !== undefined || filters.matchScoreMax !== undefined) {
      const min = filters.matchScoreMin ?? 0
      const max = filters.matchScoreMax ?? 100
      out = out.filter(a => {
        const raw = a.gpt_score ?? a.match_score
        let score = 0
        if (typeof raw === "number") score = raw
        else if (typeof raw === "string") {
          const n = parseFloat(raw.replace("%", ""))
          score = isNaN(n) ? 0 : n
        }
        return score >= min && score <= max
      })
    }
    if (filters.dateFrom || filters.dateTo) {
      const from = filters.dateFrom ? new Date(filters.dateFrom).getTime() : 0
      const to = filters.dateTo ? new Date(filters.dateTo).getTime() : Number.MAX_SAFE_INTEGER
      out = out.filter(a => {
        const t = a.applied_at ? new Date(a.applied_at).getTime() : 0
        return t >= from && t <= to
      })
    }
    return out
  }

  function sortApps(apps: ApplicationData[]) {
    if (sortBy === "match") {
      const getScore = (x?: string | number) => {
        if (typeof x === "number") return x
        if (!x) return 0
        const n = parseFloat(String(x).replace("%", ""))
        return isNaN(n) ? 0 : n
      }
      const scored = [...apps].sort((a, b) =>
        getScore(b.gpt_score ?? b.match_score) - getScore(a.gpt_score ?? a.match_score)
      )
      if (sortDir === "asc") scored.reverse()
      return scored
    }
    const dated = [...apps].sort((a, b) => {
      const aDate = a.applied_at ? new Date(a.applied_at).getTime() : 0
      const bDate = b.applied_at ? new Date(b.applied_at).getTime() : 0
      return sortDir === "desc" ? bDate - aDate : aDate - bDate
    })
    return dated
  }

  const allAppsUnfiltered = applyFilters(filterBySearch(allAppsRaw))
  const allApps = allAppsUnfiltered.filter(a => {
    const s = (a.status || "").toLowerCase()
    if (filters.status?.includes("withdrawn")) return true
    if (s === "offer_rejected" || s === "rejected") return false
    return s !== "withdrawn"
  })
  const pendingApps = applyFilters(filterBySearch(pendingAppsRaw))
  const reviewApps = applyFilters(filterBySearch(reviewAppsRaw))
  const interviewApps = applyFilters(filterBySearch(interviewAppsRaw))
  const hiredApps = applyFilters(filterBySearch(hiredAppsRaw))
  const rejectedApps = applyFilters(filterBySearch(rejectedAppsRaw)).filter(
    a => {
      const s = (a.status || "").toLowerCase()
      return s !== "offer_rejected" && s !== "rejected"
    }
  )
  const offerApps = applyFilters(filterBySearch(offerAppsRaw))

  const totalCount = allApps.length
  const activeCount = allApps.filter(a => {
    const s = (a.status || "").toLowerCase()
    return s === "new" || s === "shortlisted" || s === "interview scheduled" || s === "offer_sent"
  }).length
  const interviewsCount = interviewApps.length
  const offersCount = offerApps.length

  useEffect(() => {
    setPage(1)
  }, [activeTab, allApps.length, pendingApps.length, reviewApps.length, interviewApps.length, hiredApps.length, rejectedApps.length, offerApps.length])

  function getAppsForTab() {
    if (activeTab === "pending") return pendingApps
    if (activeTab === "review") return reviewApps
    if (activeTab === "interview") return interviewApps
    if (activeTab === "offers") return offerApps
    if (activeTab === "hired") return hiredApps
    if (activeTab === "rejected") return rejectedApps
    if (withdrawnActive) {
      return allAppsUnfiltered.filter(a => {
        const s = (a.status || "").toLowerCase()
        return s === "withdrawn" || s === "offer_rejected" || s === "rejected"
      })
    }
    return allApps
  }

  const currentTabApps = sortApps(getAppsForTab())
  const totalPages = Math.max(1, Math.ceil(currentTabApps.length / pageSize))
  const startIndex = (page - 1) * pageSize
  const paginatedApps = currentTabApps.slice(startIndex, startIndex + pageSize)

  const tabCount = (tab: string) => {
    if (tab === "all") return allApps.length
    if (tab === "pending") return pendingApps.length
    if (tab === "review") return reviewApps.length
    if (tab === "interview") return interviewApps.length
    if (tab === "offers") return offerApps.length
    if (tab === "hired") return hiredApps.length
    if (tab === "rejected") return rejectedApps.length
    return 0
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setAppliedSearchQuery(searchQuery)
    setPage(1)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setAppliedSearchQuery("")
    setPage(1)
  }

  useEffect(() => {
    const sid = (session?.user as { studentId?: string })?.studentId
    if (sid) setStudentId(String(sid))
  }, [session])

  useEffect(() => {
    if (!applicationsData || !studentId || matchesMergedRef.current) return
    const needsScores = applicationsData.some(a => a.gpt_score === undefined || a.gpt_score === null)
    if (!needsScores) { matchesMergedRef.current = true; return }
    ;(async () => {
      try {
        const res = await fetch("/api/ai-matches/fetch-current-matches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_id: studentId }),
        })
        const json = await res.json()
        const matches = Array.isArray(json.matches) ? json.matches : []
        if (matches.length === 0) { matchesMergedRef.current = true; return }

        const scoreByJobId = new Map<string, number | string>(
          matches.map((m: any) => [String(m.job_id).trim().toLowerCase(), m.gpt_score as number | string])
        )

        setApplicationsData(prev => {
          if (!prev) return prev
          let changed = false
          const next = prev.map(app => {
            const candidatesRaw = [
              app.job_postings?.id,
              (app as any).job_posting_id,
              (app as any).job_id,
              (app.job_postings as any)?.job_id,
            ]
            const candidates = candidatesRaw
              .map(v => v !== undefined && v !== null ? String(v).trim().toLowerCase() : "")
              .filter(Boolean)

            const foundKey = candidates.find(c => scoreByJobId.has(c))
            if (foundKey) {
              const newScore = scoreByJobId.get(foundKey)
              if (newScore !== undefined && app.gpt_score !== newScore) {
                changed = true
                return { ...app, gpt_score: newScore as number | string }
              }
            }
            return app
          })
          return changed ? next : prev
        })
        matchesMergedRef.current = true
      } catch {}
    })()
  }, [applicationsData, studentId])

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
                    <h2 className="text-2xl font-bold relative z-10 flex items-center gap-2">
                      Applications Tracking
                    </h2>
                    <p className="text-blue-100 text-sm relative z-10 mt-2">
                      Track and manage all your job applications in one place.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 mt-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                    <p className="text-xs text-white/80">Total</p>
                    <p className="text-xl font-bold text-white">{totalCount}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                    <p className="text-xs text-white/80">Active</p>
                    <p className="text-xl font-bold text-white">{activeCount}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                    <p className="text-xs text-white/80">Interviews</p>
                    <p className="text-xl font-bold text-white">{interviewsCount}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                    <p className="text-xs text-white/80">Offers</p>
                    <p className="text-xl font-bold text-white">{offersCount}</p>
                  </div>
                </div>
              </div>

              <form
                className="bg-white rounded-xl p-2 flex flex-col sm:flex-row relative z-10 gap-2"
                onSubmit={handleSearchSubmit}
              >
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Search applications"
                    className="border-0 text-black focus-visible:ring-0 focus-visible:ring-offset-0 pr-8"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </form>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-2/3" ref={scrollContainerRef}>
              <Card className="shadow-sm border-blue-100">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="mb-2 text-blue-700 text-xl flex items-center gap-2">
                    My Applications
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto text-blue-600 hover:bg-blue-100"
                    onClick={fetchApplications}
                    disabled={refreshing}
                  >
                    <RotateCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
                  </Button>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[200px] py-12">
                      <div className="flex items-center justify-center mb-4">
                        <span className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
                      </div>
                      <span className="mt-2 text-blue-700 font-semibold text-base animate-pulse">
                        Fetching applications, please wait...
                      </span>
                    </div>
                  ) : (
                    <Tabs
                      value={activeTab}
                      onValueChange={v => {
                        setActiveTab(v)
                        setPage(1)
                      }}
                      defaultValue="all"
                      className="w-full"
                    >
                      <TabsList className="flex w-full border-b border-gray-200">
                        <TabsTrigger
                          value="all"
                          className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent
                                     hover:text-blue-600 hover:border-gray-300
                                     data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 group"
                        >
                          All
                          <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold
                                           bg-gray-200 text-gray-400
                                           group-hover:bg-blue-100 group-hover:text-blue-700
                                           group-data-[state=active]:bg-blue-100 group-data-[state=active]:text-blue-700 transition-colors">
                            {tabCount("all")}
                          </span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="pending"
                          className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent
                                     hover:text-yellow-600 hover:border-yellow-300
                                     data-[state=active]:text-yellow-600 data-[state=active]:border-yellow-600 group"
                        >
                          Pending
                          <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold
                                           bg-gray-200 text-gray-400
                                           group-hover:bg-yellow-100 group-hover:text-yellow-700
                                           group-data-[state=active]:bg-yellow-100 group-data-[state=active]:text-yellow-700 transition-colors">
                            {tabCount("pending")}
                          </span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="review"
                          className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent
                                     hover:text-cyan-600 hover:border-cyan-300
                                     data-[state=active]:text-cyan-600 data-[state=active]:border-cyan-600 group"
                        >
                          Under Review
                          <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold
                                           bg-gray-200 text-gray-400
                                           group-hover:bg-cyan-100 group-hover:text-cyan-700
                                           group-data-[state=active]:bg-cyan-100 group-data-[state=active]:text-cyan-700 transition-colors">
                            {tabCount("review")}
                          </span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="interview"
                          className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent
                                     hover:text-purple-600 hover:border-purple-300
                                     data-[state=active]:text-purple-600 data-[state=active]:border-purple-600 group"
                        >
                          Interview
                          <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold
                                           bg-gray-200 text-gray-400
                                           group-hover:bg-purple-100 group-hover:text-purple-700
                                           group-data-[state=active]:bg-purple-100 group-data-[state=active]:text-purple-700 transition-colors">
                            {tabCount("interview")}
                          </span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="offers"
                          className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent
                                     hover:text-lime-600 hover:border-lime-300
                                     data-[state=active]:text-lime-600 data-[state=active]:border-lime-500 group"
                        >
                          Offers
                          <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold
                                           bg-gray-200 text-gray-400
                                           group-hover:bg-lime-100 group-hover:text-lime-700
                                           group-data-[state=active]:bg-lime-100 group-data-[state=active]:text-lime-700 transition-colors">
                            {tabCount("offers")}
                          </span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="hired"
                          className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent
                                     hover:text-green-700 hover:border-green-200
                                     data-[state=active]:text-green-700 data-[state=active]:border-green-700 group"
                        >
                          Hired
                          <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold
                                           bg-gray-200 text-gray-400
                                           group-hover:bg-green-100 group-hover:text-green-700
                                           group-data-[state=active]:bg-green-100 group-data-[state=active]:text-green-700 transition-colors">
                            {tabCount("hired")}
                          </span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="rejected"
                          className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent
                                     hover:text-red-600 hover:border-red-300
                                     data-[state=active]:text-red-600 data-[state=active]:border-red-600 group"
                        >
                          Rejected
                          <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold
                                           bg-gray-200 text-gray-400
                                           group-hover:bg-red-100 group-hover:text-red-700
                                           group-data-[state=active]:bg-red-100 group-data-[state=active]:text-red-700 transition-colors">
                            {tabCount("rejected")}
                          </span>
                        </TabsTrigger>
                      </TabsList>

                      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-blue-600">
                            {tabCount(activeTab)} applications
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-blue-600">Sort by</span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  className="bg-white px-3 py-1 rounded-full text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-1"
                                  variant="outline"
                                >
                                  {sortBy === "match" ? (
                                    <>
                                      <BarChart2 className="w-4 h-4 mr-1" />
                                      Match Score
                                    </>
                                  ) : (
                                    <>
                                      <CalendarDays className="w-4 h-4 mr-1" />
                                      Date Applied
                                    </>
                                  )}
                                  {sortDir === "desc" ? (
                                    <ChevronDown className="w-4 h-4 ml-1" />
                                  ) : (
                                    <ChevronUp className="w-4 h-4 ml-1" />
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuItem
                                  onClick={() => {
                                    if (sortBy === "date") {
                                      setSortDir(sortDir === "desc" ? "asc" : "desc")
                                    } else {
                                      setSortBy("date"); setSortDir("desc")
                                    }
                                  }}
                                >
                                  <CalendarDays className="w-4 h-4 mr-2" />
                                  Date Applied
                                  {sortBy === "date" && (sortDir === "desc" ? <ChevronDown className="w-4 h-4 ml-auto" /> : <ChevronUp className="w-4 h-4 ml-auto" />)}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    if (sortBy === "match") {
                                      setSortDir(sortDir === "desc" ? "asc" : "desc")
                                    } else {
                                      setSortBy("match"); setSortDir("desc")
                                    }
                                  }}
                                >
                                  <BarChart2 className="w-4 h-4 mr-2" />
                                  Match Score
                                  {sortBy === "match" && (sortDir === "desc" ? <ChevronDown className="w-4 h-4 ml-auto" /> : <ChevronUp className="w-4 h-4 ml-auto" />)}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            className="bg-white px-3 py-1 rounded-full text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 hover:text-blue-700 relative"
                            onClick={() => setFilterModalOpen(true)}
                          >
                            <Filter className="w-4 h-4 mr-1" />
                            Filters
                            {(
                              (filters.status?.length || 0) +
                              (filters.workType?.length || 0) +
                              (filters.remote?.length || 0) +
                              (filters.location?.length || 0) +
                              (filters.payType?.length || 0) +
                              (filters.verification?.length || 0) +
                              (filters.company?.length || 0) +
                              (filters.matchScoreMin ? 1 : 0) +
                              (filters.matchScoreMax ? 1 : 0) +
                              (filters.dateFrom ? 1 : 0) +
                              (filters.dateTo ? 1 : 0)
                            ) > 0 && (
                              <span className="ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-blue-600 text-white text-[10px]">
                                {(filters.status?.length || 0) +
                                  (filters.workType?.length || 0) +
                                  (filters.remote?.length || 0) +
                                  (filters.location?.length || 0) +
                                  (filters.payType?.length || 0) +
                                  (filters.verification?.length || 0) +
                                  (filters.company?.length || 0) +
                                  (filters.matchScoreMin ? 1 : 0) +
                                  (filters.matchScoreMax ? 1 : 0) +
                                  (filters.dateFrom ? 1 : 0) +
                                  (filters.dateTo ? 1 : 0)}
                              </span>
                            )}
                          </Button>

                          {/* Withdrawn Jobs quick filter */}
                          <Button
                            variant="outline"
                            aria-pressed={withdrawnActive}
                            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center
                              ${withdrawnActive
                                ? "text-white bg-gray-500 hover:bg-red-gray border border-gray-600 hover:text-gray-200"
                                : "bg-gray-200/30 text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-gray-700 "}`}
                            onClick={() => {
                              setActiveTab("all")
                              setFilters(prev =>
                                withdrawnActive
                                  ? { ...prev, status: undefined }
                                  : { ...prev, status: ["withdrawn"] }
                              )
                              setPage(1)
                            }}
                          >
                            <motion.span
                              initial={false}
                              animate={{ scaleX: withdrawnActive ? -1 : 1 }}
                              transition={{ type: "spring", stiffness: 400, damping: 30 }}
                              style={{ originX: 0.5 }}
                              className="inline-flex mr-1"
                            >
                              <MdOutlineExitToApp className="w-4 h-4" />
                            </motion.span>
                            {withdrawnActive ? "Go Back" : "Withdrawn Jobs"}
                          </Button>
                        </div>
                      </div>

                      <TabsContent value="all" className="mt-4 space-y-4">
                        {allApps.length
                          ? (
                            <>
                              {generateApplicationCards(
                                paginatedApps,
                                "all",
                                selectedApplication,
                                setSelectedApplication,
                                handleViewDetails,
                                handleFollowUp,
                                handleMenuOpen,
                                logoUrls,
                                handleOpenJobRatingModal,
                                highlightLogicalId,
                                setConfirmWithdrawId,
                                setConfirmWithdrawOpen,
                                setAcceptOfferId,
                                setAcceptOfferOpen
                              )}
                              {totalPages > 1 && (
                                <div className="flex flex-col items-center gap-2 mt-4">
                                  <div className="flex items-center gap-4">
                                    <button
                                      type="button"
                                      disabled={page === 1}
                                      onClick={() => setPage(p => Math.max(1, p - 1))}
                                      className="text-xs text-gray-600 disabled:text-gray-300 hover:text-blue-600"
                                    >
                                      Previous
                                    </button>
                                    <span className="text-xs text-gray-500">
                                      Page {page} of {totalPages}
                                    </span>
                                    <button
                                      type="button"
                                      disabled={page === totalPages}
                                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                      className="text-xs text-gray-600 disabled:text-gray-300 hover:text-blue-600"
                                    >
                                      Next
                                    </button>
                                  </div>
                                </div>
                              )}
                            </>
                          )
                          : (
                            <div className="flex flex-col items-center justify-center min-h-[220px]">
                              <TbUserSearch size={64} className="text-gray-300 mb-2" />
                              <div className="text-lg font-semibold text-gray-500">No applications yet</div>
                              <div className="text-sm text-blue-500 mt-1">You&apos;ll see your applications here once you apply</div>
                            </div>
                          )
                        }
                      </TabsContent>

                      <TabsContent value="pending" className="mt-4 space-y-4">
                        {pendingApps.length
                          ? (
                            <>
                              {generateApplicationCards(
                                paginatedApps,
                                "pending",
                                selectedApplication,
                                setSelectedApplication,
                                handleViewDetails,
                                handleFollowUp,
                                handleMenuOpen,
                                logoUrls,
                                handleOpenJobRatingModal,
                                highlightLogicalId,
                                setConfirmWithdrawId,
                                setConfirmWithdrawOpen,
                                setAcceptOfferId,
                                setAcceptOfferOpen
                              )}
                              {totalPages > 1 && (
                                <div className="flex flex-col items-center gap-2 mt-4">
                                  <div className="flex items-center gap-4">
                                    <button
                                      type="button"
                                      disabled={page === 1}
                                      onClick={() => setPage(p => Math.max(1, p - 1))}
                                      className="text-xs text-gray-600 disabled:text-gray-300 hover:text-blue-600"
                                    >
                                      Previous
                                    </button>
                                    <span className="text-xs text-gray-500">
                                      Page {page} of {totalPages}
                                    </span>
                                    <button
                                      type="button"
                                      disabled={page === totalPages}
                                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                      className="text-xs text-gray-600 disabled:text-gray-300 hover:text-blue-600"
                                    >
                                      Next
                                    </button>
                                  </div>
                                </div>
                              )}
                            </>
                          )
                          : (
                            <div className="flex flex-col items-center justify-center min-h-[220px]">
                              <TbUserSearch size={64} className="text-gray-300 mb-2" />
                              <div className="text-lg font-semibold text-gray-500">No pending applications</div>
                              <div className="text-sm text-blue-500 mt-1">Pending applications will appear here</div>
                            </div>
                          )
                        }
                      </TabsContent>
                      <TabsContent value="review" className="mt-4 space-y-4">
                        {reviewApps.length
                          ? (
                            <>
                              {generateApplicationCards(
                                paginatedApps,
                                "review",
                                selectedApplication,
                                setSelectedApplication,
                                handleViewDetails,
                                handleFollowUp,
                                handleMenuOpen,
                                logoUrls,
                                handleOpenJobRatingModal,
                                highlightLogicalId,
                                setConfirmWithdrawId,
                                setConfirmWithdrawOpen,
                                setAcceptOfferId,
                                setAcceptOfferOpen
                              )}
                              {totalPages > 1 && (
                                <div className="flex flex-col items-center gap-2 mt-4">
                                  <div className="flex items-center gap-4">
                                    <button
                                      type="button"
                                      disabled={page === 1}
                                      onClick={() => setPage(p => Math.max(1, p - 1))}
                                      className="text-xs text-gray-600 disabled:text-gray-300 hover:text-blue-600"
                                    >
                                      Previous
                                    </button>
                                    <span className="text-xs text-gray-500">
                                      Page {page} of {totalPages}
                                    </span>
                                    <button
                                      type="button"
                                      disabled={page === totalPages}
                                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                      className="text-xs text-gray-600 disabled:text-gray-300 hover:text-blue-600"
                                    >
                                      Next
                                    </button>
                                  </div>
                                </div>
                              )}
                            </>
                          )
                          : (
                            <div className="flex flex-col items-center justify-center min-h-[220px]">
                              <TbUserSearch size={64} className="text-gray-300 mb-2" />
                              <div className="text-lg font-semibold text-gray-500">No applications under review</div>
                              <div className="text-sm text-blue-500 mt-1">Reviewed applications will appear here</div>
                            </div>
                          )
                        }
                      </TabsContent>
                      <TabsContent value="interview" className="mt-4 space-y-4">
                        {
                          (() => {
                            const ongoing = interviewApps.filter(a => (a.status || "").toLowerCase() === "interview scheduled")
                            // Add waitlisted to finished
                            const finished = interviewApps.filter(a => {
                              const s = (a.status || "").toLowerCase()
                              return s === "interview finished" || s === "waitlisted"
                            })
                            return (
                              <>
                                <div className="mb-2 mt-2 text-base font-semibold text-purple-700 border-b border-purple-200 pb-1">
                                  Ongoing Interviews
                                </div>
                                {ongoing.length ? (
                                  generateApplicationCards(
                                    ongoing,
                                    "interview",
                                    selectedApplication,
                                    setSelectedApplication,
                                    handleViewDetails,
                                    handleFollowUp,
                                    handleMenuOpen,
                                    logoUrls,
                                    handleOpenJobRatingModal,
                                    highlightLogicalId,
                                    setConfirmWithdrawId,
                                    setConfirmWithdrawOpen,
                                    setAcceptOfferId,
                                    setAcceptOfferOpen
                                  )
                                ) : (
                                  <div className="flex flex-col items-center justify-center min-h-[120px]">
                                    <TbUserSearch size={40} className="text-gray-300 mb-2" />
                                    <div className="text-base font-semibold text-gray-500">No ongoing interviews</div>
                                  </div>
                                )}
                                <div className="mb-2 mt-6 text-base font-semibold text-purple-700 border-b border-purple-200 pb-1">
                                  Finished Interviews
                                </div>
                                {finished.length ? (
                                  generateApplicationCards(
                                    finished,
                                    "interview",
                                    selectedApplication,
                                    setSelectedApplication,
                                    handleViewDetails,
                                    handleFollowUp,
                                    handleMenuOpen,
                                    logoUrls,
                                    handleOpenJobRatingModal,
                                    highlightLogicalId,
                                    setConfirmWithdrawId,
                                    setConfirmWithdrawOpen,
                                    setAcceptOfferId,
                                    setAcceptOfferOpen
                                  )
                                ) : (
                                  <div className="flex flex-col items-center justify-center min-h-[120px]">
                                    <TbUserSearch size={40} className="text-gray-300 mb-2" />
                                    <div className="text-base font-semibold text-gray-500">No finished interviews</div>
                                  </div>
                                )}
                              </>
                            )
                          })()
                        }
                        {totalPages > 1 && (
                          <div className="flex flex-col items-center gap-2 mt-4">
                            <div className="flex items-center gap-4">
                              <button
                                type="button"
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                className="text-xs text-gray-600 disabled:text-gray-300 hover:text-blue-600"
                              >
                                Previous
                              </button>
                              <span className="text-xs text-gray-500">
                                Page {page} of {totalPages}
                              </span>
                              <button
                                type="button"
                                disabled={page === totalPages}
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                className="text-xs text-gray-600 disabled:text-gray-300 hover:text-blue-600"
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        )}
                      </TabsContent>
                      <TabsContent value="offers" className="mt-4 space-y-4">
                        {offerApps.length
                          ? (
                            <>
                              {generateApplicationCards(
                                paginatedApps,
                                "offers",
                                selectedApplication,
                                setSelectedApplication,
                                handleViewDetails,
                                handleFollowUp,
                                handleMenuOpen,
                                logoUrls,
                                handleOpenJobRatingModal,
                                highlightLogicalId,
                                setConfirmWithdrawId,
                                setConfirmWithdrawOpen,
                                setAcceptOfferId,
                                setAcceptOfferOpen
                              )}
                              {totalPages > 1 && (
                                <div className="flex flex-col items-center gap-2 mt-4">
                                  <div className="flex items-center gap-4">
                                    <button
                                      type="button"
                                      disabled={page === 1}
                                      onClick={() => setPage(p => Math.max(1, p - 1))}
                                      className="text-xs text-gray-600 disabled:text-gray-300 hover:text-blue-600"
                                    >
                                      Previous
                                    </button>
                                    <span className="text-xs text-gray-500">
                                      Page {page} of {totalPages}
                                    </span>
                                    <button
                                      type="button"
                                      disabled={page === totalPages}
                                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                      className="text-xs text-gray-600 disabled:text-gray-300 hover:text-blue-600"
                                    >
                                      Next
                                    </button>
                                  </div>
                                </div>
                              )}
                            </>
                          )
                          : (
                            <div className="flex flex-col items-center justify-center min-h-[220px]">
                              <TbUserSearch size={64} className="text-gray-300 mb-2" />
                              <div className="text-lg font-semibold text-gray-500">No offers yet</div>
                              <div className="text-sm text-lime-500 mt-1">Offers you receive will appear here</div>
                            </div>
                          )
                        }
                      </TabsContent>
                      <TabsContent value="hired" className="mt-4 space-y-4">
                        {hiredApps.length
                          ? (
                            <>
                              {generateApplicationCards(
                                paginatedApps,
                                "hired",
                                selectedApplication,
                                setSelectedApplication,
                                handleViewDetails,
                                handleFollowUp,
                                handleMenuOpen,
                                logoUrls,
                                handleOpenJobRatingModal,
                                highlightLogicalId,
                                setConfirmWithdrawId,
                                setConfirmWithdrawOpen
                              )}
                              {totalPages > 1 && (
                                <div className="flex flex-col items-center gap-2 mt-4">
                                  <div className="flex items-center gap-4">
                                    <button
                                      type="button"
                                      disabled={page === 1}
                                      onClick={() => setPage(p => Math.max(1, p - 1))}
                                      className="text-xs text-gray-600 disabled:text-gray-300 hover:text-blue-600"
                                    >
                                      Previous
                                    </button>
                                    <span className="text-xs text-gray-500">
                                      Page {page} of {totalPages}
                                    </span>
                                    <button
                                      type="button"
                                      disabled={page === totalPages}
                                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                      className="text-xs text-gray-600 disabled:text-gray-300 hover:text-blue-600"
                                    >
                                      Next
                                    </button>
                                  </div>
                                </div>
                              )}
                            </>
                          )
                          : (
                            <div className="flex flex-col items-center justify-center min-h-[220px]">
                              <TbUserSearch size={64} className="text-gray-300 mb-2" />
                              <div className="text-lg font-semibold text-gray-500">No hired applications</div>
                              <div className="text-sm text-blue-500 mt-1">Hired applications will appear here</div>
                            </div>
                          )
                        }
                      </TabsContent>
                      <TabsContent value="rejected" className="mt-4 space-y-4">
                        {rejectedApps.length
                          ? (
                            <>
                              {generateApplicationCards(
                                paginatedApps,
                                "rejected",
                                selectedApplication,
                                setSelectedApplication,
                                handleViewDetails,
                                handleFollowUp,
                                handleMenuOpen,
                                logoUrls,
                                handleOpenJobRatingModal,
                                highlightLogicalId,
                                setConfirmWithdrawId,
                                setConfirmWithdrawOpen
                              )}
                              {totalPages > 1 && (
                                <div className="flex flex-col items-center gap-2 mt-4">
                                  <div className="flex items-center gap-4">
                                    <button
                                      type="button"
                                      disabled={page === 1}
                                      onClick={() => setPage(p => Math.max(1, p - 1))}
                                      className="text-xs text-gray-600 disabled:text-gray-300 hover:text-blue-600"
                                    >
                                      Previous
                                    </button>
                                    <span className="text-xs text-gray-500">
                                      Page {page} of {totalPages}
                                    </span>
                                    <button
                                      type="button"
                                      disabled={page === totalPages}
                                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                      className="text-xs text-gray-600 disabled:text-gray-300 hover:text-blue-600"
                                    >
                                      Next
                                    </button>
                                  </div>
                                </div>
                              )}
                            </>
                          )
                          : (
                            <div className="flex flex-col items-center justify-center min-h-[220px]">
                              <TbUserSearch size={64} className="text-gray-300 mb-2" />
                              <div className="text-lg font-semibold text-gray-500">No rejected applications</div>
                              <div className="text-sm text-blue-500 mt-1">Rejected applications will appear here</div>
                            </div>
                          )
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
                  <CardTitle>Recent Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      <div className="flex flex-col items-center justify-center mb-2 py-6">
                        <span className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
                        <div className="text-gray-400 text-sm mt-2">Loading updates...</div>
                      </div>
                    ) : recentUpdates === null || recentUpdates.length === 0 ? (
                      <div className="flex flex-col items-center justify-center mb-2">
                        <TbClockQuestion size={48} className="text-gray-300 mb-1" />
                        <div className="text-gray-400 text-sm text-center">No recent updates yet</div>
                      </div>
                    ) : (
                      recentUpdates.map((update, index) => {
                        let key = (update.status || "").toLowerCase()
                        if (key === "interview scheduled") key = "interview"
                        if (key === "offer sent") key = "offer_sent"
                        const iconInfo =
                          studentActivityIconMap[key] ||
                          { icon: <FileText className="h-4 w-4 text-white" />, iconBg: "bg-blue-400" }
                        return (
                          <div key={index} className="flex gap-3 hover:bg-blue-50 rounded-lg transition-colors">
                            <div className="relative">
                              <div className={`w-8 h-8 rounded-full ${iconInfo.iconBg} flex items-center justify-center`}>
                                {iconInfo.icon}
                              </div>
                              {index === 0 ? (
                                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                              ) : null}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{update.position}</p>
                              <p className="text-xs font-medium text-blue-600 mt-1">{update.update}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatStudentActivityTime(update.time)}
                              </p>
                            </div>
                            <button className="text-gray-400 hover:text-blue-500">
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          </div>
                        )
                      })
                    )}
                  </div>
                </CardContent>
              </Card>

              <ApplicationTips />
            </div>
          </div>
        </div>

        <ApplicationDetailsModal
          applicationId={modalApplicationId}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          applicationData={
            modalApplicationId && applicationsData
              ? (() => {
                  const app = applicationsData.find(app =>
                    String(app.application_id ?? app.id ?? app.job_postings?.id ?? "") === modalApplicationId
                  )
                  return app
                    ? {
                        ...app,
                        resume: app.resume ?? "",
                        resumeUrl: app.resumeUrl ?? "",
                        achievements: app.achievements || [],
                        portfolio: app.portfolio || [],
                        job_id: app.job_id ?? app.job_postings?.id,
                        student_id: studentId ?? undefined,
                        application_answers: app.application_answers,
                        notes: app.notes,
                      }
                    : undefined
                })()
              : undefined
          }
        />
      </div>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {menuIsPending && (
          <MenuItem onClick={handleWithdraw}>
            <MdOutlineExitToApp className="h-4 w-4 mr-2" />
            Withdraw
          </MenuItem>
        )}
        {menuIsPending && (
          <MenuItem onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            if (!menuCardId || !applicationsData) { handleMenuClose(); return }
            const app = applicationsData.find(a => String(a.application_id ?? a.id ?? a.job_postings?.id ?? "") === menuCardId)
            const jobId = app?.job_postings?.id
            if (jobId) {
              router.push(`/students/jobs/job-listings?jobId=${encodeURIComponent(String(jobId))}`)
                                          
                   }
            handleMenuClose()
          }}
        >
          <ArrowUpRight className="h-4 w-4 mr-2" />
          View Job Posting
        </MenuItem>
      </Menu>

      <FollowUpChatModal
        isOpen={isFollowUpModalOpen}
       
        onClose={() => setIsFollowUpModalOpen(false)}
        employerName={followUpDetails?.employerName || ""}
        jobTitle={followUpDetails?.jobTitle || ""}
        company={followUpDetails?.company || ""}
      />

      <JobRatingModal
        isOpen={isJobRatingModalOpen}
        onClose={() => setIsJobRatingModalOpen(false)}
        jobId={jobRatingJobId}

        jobTitle={jobRatingData?.jobTitle || ""}
        companyName={jobRatingData?.companyName || ""}
        recruiterProfileImg={jobRatingRecruiterImg}
        companyLogoImg={jobRatingCompanyImg}
        recruiterName={jobRatingRecruiterName}
      />
      <FilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={(f) => { setFilters(f); setFilterModalOpen(false); setPage(1) }}
        initial={filters}
        sourceApps={allAppsRaw}
      />

      <WarningModal
        open={confirmWithdrawOpen}
        title="Withdraw Application"
        message={`Are you sure you want to withdraw ${confirmWithdrawTitle}? This action cannot be undone.`}
        confirmText="Withdraw"
        cancelText="Cancel"
        loading={false}
        onConfirm={() => {
          if (confirmWithdrawId) {
            withdrawApplication(confirmWithdrawId)
          }
          setConfirmWithdrawOpen(false)
          setConfirmWithdrawId(null)
        }}
        onCancel={() => {
          setConfirmWithdrawOpen(false)
          setConfirmWithdrawId(null)
        }}
      />

      <ViewOfferModal
        open={viewOfferOpen || acceptOfferOpen}
        onClose={() => {
          setViewOfferOpen(false)
          setAcceptOfferOpen(false)
          setAcceptOfferId(null)
        }}
        applicationId={viewOfferId || acceptOfferId}
      />
    </>
  )
}

function mapAppStatus(appStatus?: string) {
  switch ((appStatus || "").toLowerCase()) {
    case "new":
      return "pending"
    case "shortlisted":
      return "review"
    case "interview scheduled":
      return "interview"
    case "offer_sent":
      return "offers"
    case "offer_rejected":
      return "offer_rejected"
    case "student_rating":
      return "student_rating"
    case "hired":
      return "hired"
    case "rejected":
      return "rejected"
    case "waitlisted":
      return "waitlisted"
    case "withdrawn":
      return "withdrawn"
    default:
      return "pending"
  }
}

function generateApplicationCards(
  applicationsData: ApplicationData[],
  status: string,
  selectedApplication: string | null,
  setSelectedApplication: (id: string | null) => void,
  handleViewDetails: (logicalId: string, e: React.MouseEvent) => void,
  handleFollowUp: (logicalId: string, e: React.MouseEvent) => void,
  handleMenuOpen: (event: React.MouseEvent<HTMLButtonElement>, id: string) => void,
  logoUrls?: { [key: string]: string | null },
  handleOpenJobRatingModal?: (app: ApplicationData) => void,
  highlightLogicalId?: string | null,
  setConfirmWithdrawId?: (id: string) => void,
  setConfirmWithdrawOpen?: (open: boolean) => void,
  setAcceptOfferId?: (id: string) => void,
  setAcceptOfferOpen?: (open: boolean) => void
) {
  // Get withdrawnActive from the parent scope if available, otherwise fallback to false
  const globalAny = globalThis as any
  const withdrawnActive: boolean =
    typeof globalAny !== "undefined" && typeof (globalAny.__withdrawnActive) === "boolean"
      ? globalAny.__withdrawnActive
      : false

  const statusConfig = {
    all: { title: "Mixed", badge: "", hover: "hover:border-l-yellow-400" },
    pending: { title: "Pending", badge: "bg-yellow-100 text-yellow-700", hover: "hover:border-l-yellow-400" },
    review: { title: "Under Review", badge: "bg-cyan-100 text-cyan-700", hover: "hover:border-l-cyan-400" },
    interview: { title: "To be Interviewed", badge: "bg-purple-100 text-purple-700", hover: "hover:border-l-purple-400" },
    offers: { title: "Offer Received", badge: "bg-lime-100 text-lime-700", hover: "hover:border-l-lime-400" },
    offer_rejected: { title: "Offer Rejected", badge: "bg-red-100 text-red-700", hover: "hover:border-l-red-400" },
    student_rating: { title: "Awaiting Rating", badge: "bg-yellow-100 text-yellow-700", hover: "hover:border-l-yellow-400" },
    hired: { title: "Hired", badge: "bg-green-100 text-green-700", hover: "hover:border-l-green-400" },
    rejected: { title: "Rejected", badge: "bg-red-100 text-red-700", hover: "hover:border-l-red-400" },
    waitlisted: { title: "Waitlisted", badge: "bg-blue-100 text-blue-700", hover: "hover:border-l-blue-400" },
    withdrawn: { title: "Withdrawn", badge: "bg-gray-100 text-gray-700", hover: "hover:border-l-gray-400" },
  } as const

  const canFollowUp = true; //

  // Add this line to define hoverBorder based on cardStatus
  const hoverBorder = (statusConfig as any)[status]?.hover || "hover:border-l-yellow-400";

  return (
    <>
      {applicationsData.map((app, index) => {
        const logicalIdForCard = String(app.application_id ?? app.id ?? app.job_postings?.id ?? index)


        let cardStatus = status
        const appStatus = mapAppStatus(app.status)
        if (status === "all") cardStatus = appStatus

        // For withdrawn jobs tab, show rejected as offer_rejected if status is rejected and withdrawnActive
        let badgeClass = (statusConfig as any)[cardStatus]?.badge
        let badgeTitle = titleCase(statusConfig[cardStatus as keyof typeof statusConfig]?.title || "Pending")
        if (withdrawnActive && (app.status || "").toLowerCase() === "rejected") {
          badgeClass = statusConfig.offer_rejected.badge
          badgeTitle = statusConfig.offer_rejected.title
        }

        const workType = app.job_postings?.work_type || ""
        const appliedAt = app.applied_at
          ? new Date(app.applied_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : ""
        const remoteOptions = app.job_postings?.remote_options || app.remote_options || ""
        const verificationTier = app.job_postings?.verification_tier || "basic"

        const shouldHighlight = !!highlightLogicalId && logicalIdForCard === String(highlightLogicalId) && index === 0

        const matchDisplay = formatMatchScore(app.gpt_score ?? app.match_score)

        const isInvited = Boolean((app as any).is_inivited ?? (app as any).is_invited)

        return (
          <motion.div
            key={logicalIdForCard}
            className={`relative overflow-hidden rounded-lg shadow-sm p-5 border-l-4 border-l-gray-200 ${hoverBorder} transition-colors duration-200 ${
              selectedApplication === logicalIdForCard ? "bg-yellow-100/40" : "bg-white"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration:  0.5, delay: index * 0.1 }}
            whileHover={{
              y: -2,
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            onClick={() =>
              setSelectedApplication(selectedApplication === logicalIdForCard ? null : logicalIdForCard)
            }
          >
            {shouldHighlight && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{
                  x: "-100%",
                  background:
                    "linear-gradient(90deg, rgba(216,180,254,0) 0%, rgba(216,180,254,0.9) 35%, rgba(251,207,232,0.9) 65%, rgba(251,207,232,0) 100%)",
                }}
                animate={{ x: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            )}

            <div className="flex justify-between items-start relative">
              <div className="flex gap-3">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold ${
                    index % 2 === 0 ? "bg-blue-600" : index % 3 ===  0 ? "bg-green-600" : "bg-purple-600"
                  }`}
                >
                  {logoUrls && logoUrls[logicalIdForCard] === undefined ? (
                    <span className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
                  ) : logoUrls && logoUrls[logicalIdForCard] ? (
                    <Image
                      src={logoUrls[logicalIdForCard] as string}
                      alt="Company logo"
                      width={48}
                      height={48}
                      className="object-cover rounded-lg"
                    />
                  ) : app.company_name
                    ? app.company_name.charAt(0)
                    : "C"}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                      {app.job_postings?.job_title || "Position"}
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white">
                        {verificationTier === "full" ? (
                          <CustomTooltip title="Fully verified and trusted company" arrow>
                            <motion.span whileHover={{ scale: 1.25 }} style={{ display: "inline-flex" }}>
                              <HiBadgeCheck className="w-4 h-4 text-blue-600" />
                            </motion.span>
                          </CustomTooltip>
                        ) : verificationTier === "standard" ? (
                          <CustomTooltip title="Partially verified, exercise some caution" arrow>
                            <motion.span whileHover={{ scale: 1.25 }} style={{ display: "inline-flex" }}>
                              <LuBadgeCheck className="w-4 h-4" style={{ color: "#7c3aed" }} />
                            </motion.span>
                          </CustomTooltip>
                        ) : (
                          <CustomTooltip title="Not verified, proceed carefully" arrow>
                            <motion.span whileHover={{ scale: 1.25 }} style={{ display: "inline-flex" }}>
                              <RiErrorWarningLine className="w-4 h-4 text-orange-500" />
                            </motion.span>
                          </CustomTooltip>
                        )}
                      </span>
                    </h3>
                    <motion.div whileHover={{ scale: 1.15 }} className="pointer-events-auto">
                      <Badge className={`${badgeClass} pointer-events-none`}>
                        {badgeTitle}
                      </Badge>
                    </motion.div>
                    {app.is_archived && (
                      <motion.div whileHover={{ scale: 1.15 }} className="pointer-events-auto">
                        <Badge className="bg-[#b35102]/20  text-gray-600 border border-amber-200 pointer-events-none">
                          Archived
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-500">
                      {
                        (() => {
                          let company =
                            app.company_name ||
                            app.job_postings?.registered_employers?.company_name ||
                            ""
                          if (Array.isArray(company)) company = company.join(", ")
                          let location = app.job_postings?.location
                          if (Array.isArray(location)) location = location.join(", ")
                          if (location && company) return `${company} — ${location}`
                          if (location) return location
                          return company
                        })()
                      }
                    </p>
                  </div>
                  <div className="mt-4 flex flex-row gap-6 items-center">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <Briefcase className="h-3 w-3" />
                      <span>{titleCase(workType)}</span>
                      {remoteOptions && (
                        <>
                          <Globe className="h-3 w-3 ml-4" />
                          <span>{titleCase(remoteOptions)}</span>
                        </>
                      )}
                      <Calendar className="h-3 w-3 ml-4" />
                      <span>Applied {appliedAt}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-1 items-center">
                {matchDisplay && (
                  <motion.div whileHover={{ scale: 1.15 }} className="pointer-events-auto">
                    <Badge className="bg-green-100 text-green-700 pointer-events-none">
                      {matchDisplay} Match
                    </Badge>
                  </motion.div>
                )}
                {/* Removed Archived badge from this right-side group */}
                {isInvited ? (
                  <Tooltip title="You joined this opportunity through an invite — great move!🎉" arrow>
                    <motion.span
                      whileHover={{ scale: 1.15 }}
                      className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-400 text-cyan-50"
                    >
                      <RiMailStarFill className="w-4 h-4" />
                    </motion.span>
                  </Tooltip>
                ) : null}
                <IconButton
                  size="small"
                  className="text-gray-400 hover:text-blue-500 transition-colors p-1.5 rounded-full hover:bg-blue-50"
                  onClick={(e) => handleMenuOpen(e, logicalIdForCard)}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </IconButton>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                {cardStatus === "interview" && (
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Prepare
                  </Button>
                )}
                {cardStatus === "hired" && (
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-xs flex items-center gap-1"
                    onClick={async e => {
                      e.stopPropagation()
                      if (handleOpenJobRatingModal) {
                        await handleOpenJobRatingModal(app)
                      }
                    }}
                  >
                    <AiFillStar className="w-4 h-4" />
                    Rate Job
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 text-xs"
                  onClick={(e) => handleViewDetails(logicalIdForCard, e)}
                >
                  View Details
                </Button>
                {cardStatus === "pending" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700 text-xs flex items-center gap-1 px-2"
                    onClick={e => {
                      e.stopPropagation()
                      if (setConfirmWithdrawId && setConfirmWithdrawOpen) {
                        setConfirmWithdrawId(logicalIdForCard)
                        setConfirmWithdrawOpen(true)
                      }
                    }}
                  >
                    <MdOutlineExitToApp className="w-4 h-4" />
                    Withdraw Application
                  </Button>
                )}
                {cardStatus === "offers" && (
                  <>
                    <Button
                      size="sm"
                      className="bg-lime-600 hover:bg-lime-700 text-xs"
                      onClick={e => {
                        e.stopPropagation()
                        if (setAcceptOfferId) setAcceptOfferId(logicalIdForCard)
                        if (setAcceptOfferOpen) setAcceptOfferOpen(true)
                        if (typeof setAcceptOfferId === "function") setAcceptOfferId(logicalIdForCard)
                        if (typeof setAcceptOfferOpen === "function") setAcceptOfferOpen(true)
                      }}
                    >
                      Accept Offer
                    </Button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">
                  {cardStatus === "pending"
                    ? "Awaiting response"
                    : cardStatus === "review"
                      ? "In progress"
                      : cardStatus === "interview"
                        ? "Interview phase"
                        : cardStatus === "hired"
                          ? "Congratulations!"
                          : cardStatus === "waitlisted"
                            ? "Waitlisted"
                            : cardStatus === "withdrawn"
                              ? "Withdrawn"
                              : "Better luck next time"}
                </span>
                <ArrowUpRight className="h-3 w-3 text-gray-600" />
              </div>
            </div>
          </motion.div>
        )
      })}
    </>
  )
}

function titleCase(s?: string) {
  if (!s) return ""
  return s
    .split(/[\s_-]+/)
    .map(p => p ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() : p)
    .join(" ")
}

function formatMatchScore(score?: string | number) {
  if (score === undefined || score === null) return ""
  if (typeof score === "number") return `${Math.round(score)}%`
  const s = String(score).trim()
  if (!s) return ""
  if (s.includes("%")) return s
  const n = parseFloat(s)
  if (isNaN(n)) return ""
  return `${Math.round(n)}%`
}



