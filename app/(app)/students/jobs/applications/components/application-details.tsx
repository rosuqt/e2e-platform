"use client"

import React, { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  Search,
  MessageCircle,
  Edit,
  Building,
  MapPin,
  Briefcase,
  Calendar,
  Globe,
  Award,
  BookOpen,
  Bus,
  ClockIcon,
  UserCheck,
  Trash2,
} from "lucide-react"
import { Mail, Phone } from "lucide-react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { HiBadgeCheck } from "react-icons/hi"
import { RiErrorWarningLine } from "react-icons/ri"
import { BadgeCheck as LuBadgeCheck } from "lucide-react"
import Tooltip from "@mui/material/Tooltip"
import { styled } from "@mui/material/styles"
import { motion } from "framer-motion"
import TimelineTab from "./tabs/timeline-tab"
import ResumeTab from "./tabs/resume-tab"
import { ViewOfferModal } from "./view-offer"

type ApplicationAnswers = Record<string, string> | string | null

type ApplicationData = {
  resume: string
  resumeUrl: string
  job_postings?: {
    location?: string
    remote_options?: string
    company?: string
    job_title?: string
    work_type?: string
    pay_amount?: string | number
    pay_type?: string
    job_summary?: string
    employer_id?: string
    recommended_course?: string
    job_description?: string
    must_have_qualifications?: string[]
    nice_to_have_qualifications?: string[]
    application_deadline?: string
    max_applicants?: number
    perks_and_benefits?: string[]
    verification_tier?: string
    created_at?: string
    responsibilities?: string | string[]
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
  applied_at?: string
  match_score?: string
  company_name?: string
  status?: string
  remote_options?: string
  company_logo_image_path?: string
  profile_img?: string
  achievements?: string[]
  portfolio?: string[]
  job_id?: string | number | null
  student_id?: string | number | null
  notes?: { note: string; date_added: string; isEmployer?: boolean }[] | string
  application_answers?: ApplicationAnswers
}

interface ApplicationDetailsProps {
  applicationId: string | null
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
  applicationData?: ApplicationData
}

function getStatusBadgeProps(status: string) {
  const s = status.toLowerCase()
  if (s === "new" || s === "pending") return { className: "bg-yellow-100 text-yellow-700", label: "Pending" }
  if (s === "shortlisted" || s === "review") return { className: "bg-cyan-100 text-cyan-700", label: "Under Review" }
  if (s === "interview scheduled" || s === "interview") return { className: "bg-purple-100 text-purple-700", label: "To be Interviewed" }
  if (s === "offer_sent") return { className: "bg-lime-100 text-lime-700", label: "Offer Received" }
  if (s === "hired") return { className: "bg-green-100 text-green-700", label: "Hired" }
  if (s === "rejected") return { className: "bg-red-100 text-red-700", label: "Rejected" }
  if (s === "waitlisted") return { className: "bg-blue-100 text-blue-700", label: "Waitlisted" }
  return { className: "bg-yellow-100 text-yellow-700", label: "Pending" }
}

function buildTimeline(applicationData?: ApplicationData) {
  if (!applicationData) return []
  const timeline: {
    status: string
    date: string
    icon: React.JSX.Element
    iconBg: string
    current?: boolean
  }[] = []

  if (applicationData.applied_at) {
    timeline.push({
      status: "Application Submitted",
      date: applicationData.applied_at,
      icon: <FileText className="h-4 w-4 text-white" />,
      iconBg: "bg-green-500",
    })
  }
  if (
    applicationData.status &&
    ["shortlisted", "review", "interview scheduled", "interview", "hired", "rejected", "waitlisted"].includes(
      applicationData.status.toLowerCase()
    )
  ) {
    if (
      ["shortlisted", "review", "interview scheduled", "interview", "hired", "rejected", "waitlisted"].includes(
        applicationData.status.toLowerCase()
      )
    ) {
      timeline.push({
        status: "Application Under Review",
        date: applicationData.applied_at || "",
        icon: <Search className="h-4 w-4 text-white" />,
        iconBg: "bg-blue-500",
      })
    }
    if (
      ["interview scheduled", "interview", "hired"].includes(applicationData.status.toLowerCase())
    ) {
      timeline.push({
        status: "Interview Scheduled",
        date: applicationData.applied_at || "",
        icon: <MessageCircle className="h-4 w-4 text-white" />,
        iconBg: "bg-purple-500",
        current: applicationData.status.toLowerCase().includes("interview"),
      })
    }
  }

  if (timeline.length && !timeline.some(e => e.current)) {
    timeline[timeline.length - 1].current = true
  }
  return timeline
}

function WarningModalLocal({
  open,
  title,
  message,
  confirmText,
  cancelText,
  loading,
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  message: string
  confirmText: string
  cancelText: string
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={v => !v && onCancel()}>
      <DialogContent className="max-w-sm w-full p-6">
        <DialogTitle className="mb-2">{title}</DialogTitle>
        <div className="mb-4 text-gray-700">{message}</div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel} disabled={loading}>{cancelText}</Button>
          <Button onClick={onConfirm} disabled={loading}>{confirmText}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ApplicationDetailsModal({ applicationId, isModalOpen, setIsModalOpen, applicationData }: ApplicationDetailsProps) {
  const [isClient, setIsClient] = useState(false)
  const [acceptOfferOpen, setAcceptOfferOpen] = useState(false)
  const [acceptOfferLoading, setAcceptOfferLoading] = useState(false)
  const [localStatus, setLocalStatus] = useState(applicationData?.status || "")
  const [viewOfferOpen, setViewOfferOpen] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    setLocalStatus(applicationData?.status || "")
  }, [applicationData?.status])

  const acceptOffer = useCallback(async () => {
    if (!applicationId) return
    setAcceptOfferLoading(true)
    try {
      const res = await fetch("/api/employers/applications/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ application_id: applicationId, action: "accept_offer" }),
      })
      if (!res.ok) {
        setAcceptOfferLoading(false)
        return
      }
      setLocalStatus("hired")
      if (applicationData) applicationData.status = "hired"
      setViewOfferOpen(true)
    } catch {
    }
    setAcceptOfferLoading(false)
    setAcceptOfferOpen(false)
  }, [applicationId, applicationData])

  if (!isClient) return null

  const applications = [
    {
      id: 1,
      company: "Google",
      position: "Frontend Developer",
      status: "Interview",
      statusColor: "bg-purple-100 text-purple-700",
      location: "Remote",
      salary: "$120K - $150K",
      appliedDate: "May 10, 2025",
      description:
        "Google is seeking a talented Frontend Developer to join our team. You will be responsible for building and maintaining user interfaces for our products.",
      timeline: [
        {
          status: "Application Submitted",
          date: "May 10, 2025",
          icon: <FileText className="h-4 w-4 text-white" />,
          iconBg: "bg-green-500",
        },
        {
          status: "Application Under Review",
          date: "May 13, 2025",
          icon: <Search className="h-4 w-4 text-white" />,
          iconBg: "bg-blue-500",
        },
        {
          status: "Interview Scheduled",
          date: "May 17, 2025",
          icon: <MessageCircle className="h-4 w-4 text-white" />,
          iconBg: "bg-purple-500",
          current: true,
        },
      ],
      notes: "Prepare for technical interview. Review React hooks and performance optimization.",
      contacts: [
        {
          name: "Sarah Johnson",
          role: "Recruiter",
          email: "sarah.johnson@google.com",
          phone: "123-456-7890",
        },
      ],
      documents: [
        {
          name: "Resume_Frontend_2025.pdf",
          date: "May 10, 2025",
          time: "2:30 PM",
          phone: "123-456-7890",
        },
        {
          name: "Cover_Letter_Google.pdf",
          date: "May 10, 2025",
          time: "12:30 PM",
          phone: "123-456-7890",
        },
      ],
    },
    {
      id: 2,
      company: "Meta",
      position: "UI/UX Designer",
      status: "Applied",
      statusColor: "bg-blue-100 text-blue-700",
      location: "On-site",
      salary: "$100K - $120K",
      appliedDate: "May 12, 2025",
      description:
        "Meta is looking for a creative UI/UX Designer to design user-friendly interfaces for our applications.",
      timeline: [
        {
          status: "Application Submitted",
          date: "May 12, 2025",
          icon: <FileText className="h-4 w-4 text-white" />,
          iconBg: "bg-green-500",
        },
      ],
      notes: "Research Meta's design guidelines and prepare a portfolio presentation.",
      contacts: [
        {
          name: "John Doe",
          role: "Hiring Manager",
          email: "john.doe@meta.com",
          phone: "987-654-3210",
        },
      ],
      documents: [
        {
          name: "Portfolio_Meta_2025.pdf",
          date: "May 12, 2025",
          time: "10:00 AM",
          phone: "987-654-3210",
        },
      ],
    },
    {
      id: 3,
      company: "Amazon",
      position: "Software Engineer",
      status: "Offer",
      statusColor: "bg-green-100 text-green-700",
      location: "Hybrid",
      salary: "$130K - $160K",
      appliedDate: "May 8, 2025",
      description:
        "Amazon is hiring a Software Engineer to develop scalable solutions for our e-commerce platform.",
      timeline: [
        {
          status: "Application Submitted",
          date: "May 8, 2025",
          icon: <FileText className="h-4 w-4 text-white" />,
          iconBg: "bg-green-500",
        },
        {
          status: "Application Under Review",
          date: "May 10, 2025",
          icon: <Search className="h-4 w-4 text-white" />,
          iconBg: "bg-blue-500",
        },
        {
          status: "Interview Scheduled",
          date: "May 14, 2025",
          icon: <MessageCircle className="h-4 w-4 text-white" />,
          iconBg: "bg-purple-500",
        },
        {
          status: "Offer Extended",
          date: "May 18, 2025",
          icon: <FileText className="h-4 w-4 text-white" />,
          iconBg: "bg-green-500",
          current: true,
        },
      ],
      notes: "Review the offer details and prepare for negotiation.",
      contacts: [
        {
          name: "Emily Smith",
          role: "HR Specialist",
          email: "emily.smith@amazon.com",
          phone: "456-789-0123",
        },
      ],
      documents: [
        {
          name: "Offer_Letter_Amazon_2025.pdf",
          date: "May 18, 2025",
          time: "9:00 AM",
          phone: "456-789-0123",
        },
      ],
    },
  ]

  let employerContact = null
  if (
    applicationData?.job_postings &&
    (applicationData.job_postings as {
      registered_employers?: {
        first_name?: string
        last_name?: string
        job_title?: string
        email?: string
        phone?: string
        country_code?: string
      }
    }).registered_employers
  ) {
    const regEmp = (applicationData.job_postings as {
      registered_employers?: {
        first_name?: string
        last_name?: string
        job_title?: string
        email?: string
        phone?: string
        country_code?: string
      }
    }).registered_employers
    employerContact = {
      name: [regEmp?.first_name, regEmp?.last_name].filter(Boolean).join(" "),
      role: regEmp?.job_title || "",
      email: regEmp?.email || "",
      phone: regEmp?.phone || "",
    }
  }

  const parsedNotes =
    applicationData && applicationData.notes
      ? Array.isArray(applicationData.notes)
        ? applicationData.notes.filter(n => !n.isEmployer)
        : (() => {
            try {
              const arr: { note: string; date_added: string; isEmployer?: boolean }[] = JSON.parse(applicationData.notes as string)
              return Array.isArray(arr) ? arr.filter((n) => !n.isEmployer) : []
            } catch {
              return []
            }
          })()
      : []

  const application =
    applicationData && applicationId
      ? {
          id: applicationId,
          company: applicationData.company_name || applicationData.job_postings?.company || "",
          position: applicationData.job_postings?.job_title || "",
          status: applicationData.status || "",
          statusColor: "",
          location: applicationData.job_postings?.location || "",
          salary:
            applicationData.job_postings?.pay_amount && applicationData.job_postings?.pay_type
              ? `${applicationData.job_postings.pay_amount} / ${applicationData.job_postings.pay_type}`
              : applicationData.job_postings?.pay_amount
                ? `${applicationData.job_postings.pay_amount}`
                : "",
          job_summary: applicationData.job_postings?.job_summary || "",
          work_type: applicationData.job_postings?.work_type || "",
          remote_options: applicationData.job_postings?.remote_options || applicationData.remote_options || "",
          pay_amount: applicationData.job_postings?.pay_amount || "",
          pay_type: applicationData.job_postings?.pay_type || "",
          appliedDate: applicationData.applied_at
            ? new Date(applicationData.applied_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "",
          description: applicationData.job_postings?.job_summary || "",
          timeline: buildTimeline(applicationData),
          notes: parsedNotes,
          contacts: employerContact ? [employerContact] : [],
          documents: [],
          profile_img: applicationData.profile_img || "",
          job_postings: applicationData.job_postings || undefined,
          resume: applicationData.resume,
          resumeUrl: applicationData.resumeUrl,
          achievements: applicationData.achievements || applicationData.job_postings?.achievements || [],
          portfolio: applicationData.portfolio || applicationData.job_postings?.portfolio || [],
          job_id: (applicationData.job_id ?? applicationData.job_postings?.id) ?? undefined,
          student_id: applicationData.student_id ?? undefined,
          application_answers: applicationData.application_answers,
        }
      : applications.find((app) => String(app.id) === applicationId)

  if (!application) {
    return null
  }

  const badgeProps = getStatusBadgeProps(localStatus || application.status)

  let verificationTier = "basic"
  if (
    typeof application === "object" &&
    "job_postings" in application &&
    application.job_postings &&
    typeof application.job_postings === "object" &&
    application.job_postings.verification_tier
  ) {
    verificationTier = application.job_postings.verification_tier
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <DialogTitle className="sr-only">Application Details</DialogTitle>
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white relative shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{application.position}</h2>
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white">
                  {verificationTier === "full" ? (
                    <CustomTooltip title="Fully verified and trusted company" arrow>
                      <motion.span whileHover={{ scale: 1.25 }} style={{ display: "inline-flex" }}>
                        <HiBadgeCheck className="w-5 h-5 text-blue-600" />
                      </motion.span>
                    </CustomTooltip>
                  ) : verificationTier === "standard" ? (
                    <CustomTooltip title="Partially verified, exercise some caution" arrow>
                      <motion.span whileHover={{ scale: 1.25 }} style={{ display: "inline-flex" }}>
                        <LuBadgeCheck className="w-5 h-5" style={{ color: "#7c3aed" }} />
                      </motion.span>
                    </CustomTooltip>
                  ) : (
                    <CustomTooltip title="Not verified, proceed carefully" arrow>
                      <motion.span whileHover={{ scale: 1.25 }} style={{ display: "inline-flex" }}>
                        <RiErrorWarningLine className="w-5 h-5 text-orange-500" />
                      </motion.span>
                    </CustomTooltip>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Building className="h-4 w-4 text-blue-100" />
                <span className="text-blue-100">{application.company}</span>
              </div>
            </div>
            <div className="pointer-events-none">
              <Badge
                className={`${badgeProps.className} px-3 py-1 text-sm font-medium pointer-events-none transition-transform duration-150`}
                style={{ transform: "scale(1)", transition: "transform 0.15s" }}
              >
                {badgeProps.label}
              </Badge>
            </div>
          </div>
        </div>
        <div className="p-6 overflow-y-auto">
          <ApplicationDetailsContent application={{ ...application, status: localStatus || application.status }} />
        </div>
        {((localStatus || application.status) === "offer_sent") && (
          <div className="flex justify-end p-6 pt-0">
            <Button
              className="bg-lime-600 hover:bg-lime-700 text-white"
              onClick={() => setAcceptOfferOpen(true)}
              disabled={acceptOfferLoading}
            >
              Accept Offer
            </Button>
          </div>
        )}
        <WarningModalLocal
          open={acceptOfferOpen}
          title="Accept Offer"
          message={`Are you sure you want to accept this offer?`}
          confirmText="Accept Offer"
          cancelText="Cancel"
          loading={acceptOfferLoading}
          onConfirm={acceptOffer}
          onCancel={() => setAcceptOfferOpen(false)}
        />
        <ViewOfferModal
          open={viewOfferOpen}
          onClose={() => setViewOfferOpen(false)}
          applicationId={applicationId}
        />
      </DialogContent>
    </Dialog>
  )
}

interface Application {
  id: string | number
  company: string
  position: string
  status: string
  statusColor: string
  location: string
  salary: string
  job_summary?: string
  work_type?: string
  remote_options?: string
  pay_amount?: string | number
  pay_type?: string
  appliedDate: string
  description: string
  timeline: {
    status: string
    date: string
    icon: React.ReactNode
    iconBg: string
    current?: boolean
  }[]
  notes: string | { note: string; date_added: string }[]
  contacts: {
    name: string
    role: string
    email: string
    phone: string
  }[]
  documents: {
    name: string
    date: string
    time: string
    phone: string
  }[]
  profile_img?: string
  job_postings?: ApplicationData["job_postings"]
  resume?: string
  resumeUrl?: string
  achievements?: string[]
  portfolio?: string[]
  job_id?: string | number
  student_id?: string | number
  application_answers?: ApplicationAnswers
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

function ApplicationDetailsContent({ application }: { application: Application }) {
  const [profileImgUrl, setProfileImgUrl] = useState<string | null>(null)
  const [showMore, setShowMore] = useState(false)

  type Note = { note: string; date_added: string }
  const [notes, setNotes] = useState<Note[]>(() =>
    Array.isArray(application.notes)
      ? application.notes.map((n: Partial<Note>) => ({
          note: n.note ?? "",
          date_added: n.date_added || new Date().toISOString(),
        }))
      : []
  )
  const [editMode, setEditMode] = useState(false)
  const [editNoteIdx, setEditNoteIdx] = useState<number | null>(null)
  const [editNoteText, setEditNoteText] = useState("")
  const [loading, setLoading] = useState(false)
  const [newNote, setNewNote] = useState("")

  useEffect(() => {
    if (Array.isArray(application.notes)) {
      setNotes(
        application.notes.map((n: Partial<Note>) => ({
          note: n.note ?? "",
          date_added: n.date_added || new Date().toISOString(),
        }))
      )
    }
  }, [application.notes])

  function formatNoteDate(dateString?: string) {
    if (!dateString) return ""
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const month = monthNames[date.getMonth()]
    const day = date.getDate().toString().padStart(2, '0')
    const year = date.getFullYear().toString()
    return `${month} ${day} ${year}`
  }

  function handleEditNote(idx: number) {
    setEditMode(true)
    setEditNoteIdx(idx)
    setEditNoteText(notes[idx].note)
  }

  function handleSaveEditNote() {
    if (editNoteIdx === null) return
    setLoading(true)
    setTimeout(() => {
      setNotes((prev) =>
        prev.map((n, i) =>
          i === editNoteIdx ? { ...n, note: editNoteText } : n
        )
      )
      setEditMode(false)
      setEditNoteIdx(null)
      setEditNoteText("")
      setLoading(false)
    }, 500)
  }

  function handleDeleteNote(idx: number) {
    setLoading(true)
    setTimeout(() => {
      setNotes((prev) => prev.filter((_, i) => i !== idx))
      setLoading(false)
    }, 500)
  }

  function handleAddNote() {
    if (!newNote.trim()) return
    setLoading(true)
    fetch("/api/students/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicationId: application.id,
        note: newNote,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (Array.isArray(data.notes)) {
            setNotes(
              data.notes.map((n: { note?: string; date_added?: string }) => ({
                note: n.note ?? "",
                date_added: n.date_added || new Date().toISOString(),
              }))
            )
          }
          setNewNote("")
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    async function fetchSignedUrl() {
      if (application.profile_img) {
        if (application.profile_img.startsWith("http")) {
          setProfileImgUrl(application.profile_img)
          return
        }
        const url =
          typeof window !== "undefined"
            ? `${window.location.origin}/api/employers/get-signed-url?bucket=user.avatars&path=${encodeURIComponent(
                application.profile_img
              )}`
            : `/api/employers/get-signed-url?bucket=user.avatars&path=${encodeURIComponent(
                application.profile_img
              )}`;
        const res = await fetch(url)
        const data = await res.json()
        if (data.signedUrl) {
          setProfileImgUrl(data.signedUrl)
        } else {
          setProfileImgUrl(null)
        }
      } else {
        setProfileImgUrl(null)
      }
    }
    fetchSignedUrl()
  }, [application.profile_img])


  const resumeUrl = application.resumeUrl
  const resume = application.resume

  const [achievements, setAchievements] = useState<{ name: string; url: string }[]>([])
  const [portfolio, setPortfolio] = useState<{ name: string; url: string }[]>([])

  const applicationQuestionsInitial: { id: string | number; question_text: string; answer?: string | null }[] = []
  const [applicationQuestions, setApplicationQuestions] = useState<
    { id: string | number; question_text: string; answer?: string | null }[]
  >(applicationQuestionsInitial)
  const [questionsLoading, setQuestionsLoading] = useState(false)
  const [questionsError, setQuestionsError] = useState<string | null>(null)

  useEffect(() => {
    const rawAnswers = (application as unknown as Record<string, unknown>).application_answers
    if (!rawAnswers) {
      setApplicationQuestions([])
      return
    }

    const jobId =
      (application.job_postings as { id?: string | number } | undefined)?.id ??
      application.job_id ??
      (application as unknown as Record<string, unknown>).job_id ??
      null

    if (!jobId) {
      setApplicationQuestions([])
      return
    }

    async function loadQuestionsAndAnswers() {
      try {
        setQuestionsLoading(true)
        setQuestionsError(null)

        const params = new URLSearchParams()
        params.set("job_id", String(jobId))

        const questionsRes = await fetch(`/api/employers/applications/getQuestions?${params.toString()}`)
        if (!questionsRes.ok) throw new Error("questions_failed")
        const questionsJson = await questionsRes.json()
        const rawQuestions: { id?: string | number; question_text?: string; question?: string }[] = Array.isArray(questionsJson.questions) ? questionsJson.questions : []

        let answerMap: Record<string, string> = {}
        if (typeof rawAnswers === "string") {
          try {
            answerMap = JSON.parse(rawAnswers as string)
          } catch {
            answerMap = {}
          }
        } else if (typeof rawAnswers === "object" && rawAnswers !== null) {
          answerMap = rawAnswers as Record<string, string>
        }

        const merged = rawQuestions.map((q) => {
          const qid = q.id ?? (q as { question_id?: string | number }).question_id
          const key = qid != null ? String(qid) : ""
          const ans = key && answerMap[key] != null ? String(answerMap[key]) : ""
          return {
            id: qid ?? String(Math.random()),
            question_text: q.question_text ?? (q as { question?: string }).question ?? "",
            answer: ans,
          }
        })

        setApplicationQuestions(merged)
        setQuestionsLoading(false)
      } catch {
        setQuestionsError("Unable to load questions right now.")
        setQuestionsLoading(false)
      }
    }

    loadQuestionsAndAnswers()
  }, [application.id, application.job_postings, application.job_id, (application as unknown as Record<string, unknown>).application_answers])

  useEffect(() => {
    const fetchAchievementPortfolio = async () => {
      const jobPostings = application.job_postings as
        | (ApplicationData["job_postings"] & { achievements?: string[]; portfolio?: string[] })
        | undefined
      let achArr = (application.achievements && application.achievements.length > 0
        ? application.achievements
        : jobPostings?.achievements) || []
      let portArr = (application.portfolio && application.portfolio.length > 0
        ? application.portfolio
        : jobPostings?.portfolio) || []
      if (!Array.isArray(achArr)) achArr = []
      if (!Array.isArray(portArr)) portArr = []
      const fetchSigned = async (path: string): Promise<string | null> => {
        if (!path) return null
        try {
          const res = await fetch("/api/students/get-signed-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bucket: "student.documents",
              path
            })
          })
          const json: { signedUrl?: string } = await res.json()
          return typeof json.signedUrl === "string" ? json.signedUrl : null
        } catch {
          return null
        }
      }
      const achFiles = await Promise.all(
        achArr.map(async (file: string) => {
          const url = await fetchSigned(file)
          return url ? { name: file.split("/").pop() || file, url } : null
        })
      )
      const portFiles = await Promise.all(
        portArr.map(async (file: string) => {
          const url = await fetchSigned(file)
          return url ? { name: file.split("/").pop() || file, url } : null
        })
      )
      setAchievements(achFiles.filter((f): f is { name: string; url: string } => !!f))
      setPortfolio(portFiles.filter((f): f is { name: string; url: string } => !!f))
      console.log("Details: setAchievements", achFiles)
      console.log("Details: setPortfolio", portFiles)
    }
    fetchAchievementPortfolio()
  }, [
    application,
    application.achievements,
    application.portfolio,
    application.job_postings
  ])

  let verificationTier = "basic"
  if (
    typeof application === "object" &&
    "job_postings" in application &&
    application.job_postings &&
    typeof application.job_postings === "object" &&
    application.job_postings.verification_tier
  ) {
    verificationTier = application.job_postings.verification_tier
  }

  function getTimelineWithMessages(
    timeline: {
      status: string
      date: string
      icon: React.ReactNode
      iconBg: string
      current?: boolean
    }[],
  ) {
   
    return timeline.map((event) => ({
      ...event,
      icon: (event.icon ?? <></>) as React.JSX.Element,
      message:
        event.status === "Application Submitted"
          ? "Your application was submitted and is awaiting review."
          : event.status === "Application Under Review"
            ? "The employer is reviewing your application."
            : event.status === "Interview Scheduled"
              ? "An interview has been scheduled. Prepare well!"
              : event.status === "Offer Extended"
                ? "You have received an offer. Review and respond."
                : "",
    }))
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-semibold text-blue-700 flex items-center gap-2">
                Application Summary
                
              </h3>
            </div>
            <p className="text-sm text-gray-600">{application.job_summary || application.description}</p>
          </div>
          <Separator />
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Job Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 rounded-xl p-6 shadow-sm border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 rounded-full p-2 flex items-center justify-center">
                  <Briefcase className="h-4 w-4 text-blue-700" />
                </div>
                <span className="text-sm font-medium text-blue-900">{application.work_type || "N/A"}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 rounded-full p-2 flex items-center justify-center">
                  <Globe className="h-4 w-4 text-purple-700" />
                </div>
                <span className="text-sm font-medium text-purple-900">{application.remote_options || "N/A"}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 rounded-full p-2 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-yellow-700" />
                </div>
                <span className="text-sm font-medium text-yellow-900">Applied {application.appliedDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-pink-100 rounded-full p-2 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-pink-700" />
                </div>
                <span className="text-sm font-medium text-pink-900">{application.location || "N/A"}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 rounded-full p-2 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-700" />
                </div>
                <span className="text-sm font-medium text-blue-900">
                  {
                    application.status?.toLowerCase() === "offer_sent"
                      ? "Offer Received"
                      : application.status || "N/A"
                  }
                </span>
              </div>
            </div>
            <div className="flex justify-center mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                onClick={() => setShowMore(v => !v)}
              >
                {showMore ? "Show Less" : "Show More"}
                {showMore ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>
            {showMore && (
              <div className="mt-4 bg-white rounded-xl p-6 shadow border border-blue-100">
                <div className="mb-6">
                  <span className="text-xs font-semibold text-blue-700">Job Description</span>
                  <div className="text-sm font-medium text-gray-900 mt-1 whitespace-pre-line">
                    {application.job_postings?.job_description
                      ? application.job_postings.job_description.charAt(0).toUpperCase() + application.job_postings.job_description.slice(1)
                      : "N/A"}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Swap the order of the columns */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="text-xs font-semibold text-blue-700">Responsibilities</span>
                      <div className="text-sm font-medium text-gray-900 mt-1 whitespace-pre-line">
                        {(() => {
                          const resp = application.job_postings?.responsibilities;
                          if (Array.isArray(resp)) {
                            return resp.length > 0 ? (
                              <ul className="list-disc list-inside">
                                {resp.map((r: string, i: number) => (
                                  <li key={i}>{r}</li>
                                ))}
                              </ul>
                            ) : "N/A";
                          }
                          if (typeof resp === "string") {
                            const trimmed = resp.trim();
                            if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
                              try {
                                const arr = JSON.parse(trimmed);
                                if (Array.isArray(arr) && arr.length > 0) {
                                  return (
                                    <ul className="list-disc list-inside">
                                      {arr.map((r: string, i: number) => (
                                        <li key={i}>{r}</li>
                                      ))}
                                    </ul>
                                  );
                                }
                                return "N/A";
                              } catch {
          
                              }
                            }
                            return trimmed || "N/A";
                          }
                          return "N/A";
                        })()}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-blue-700">Must Have Qualifications</span>
                      {application.job_postings?.must_have_qualifications?.length ? (
                        <ul className="list-disc text-sm list-inside text-gray-900 font-medium mt-1">
                          {application.job_postings.must_have_qualifications.map((q, i) => (
                            <li key={i}>
                              {q
                                .split(" ")
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                .join(" ")}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-sm font-medium text-gray-900 mt-1">N/A</div>
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-blue-700">Nice To Have Qualifications</span>
                      {application.job_postings?.nice_to_have_qualifications?.length ? (
                        <ul className="list-disc text-sm list-inside text-gray-900 font-medium mt-1">
                          {application.job_postings.nice_to_have_qualifications.map((q, i) => (
                            <li key={i}>
                              {q
                                .split(" ")
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                .join(" ")}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-sm font-medium text-gray-900 mt-1">N/A</div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="text-xs font-semibold text-blue-700">Recommended Course</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {application.job_postings?.recommended_course
                          ? application.job_postings.recommended_course
                              .split(",")
                              .map(c => c.trim())
                              .map((course, i) => {
                                let label = course
                                let color = "bg-gray-200 text-gray-800"
                                if (/bsit/i.test(course)) {
                                  label = "BSIT"
                                  color = "bg-green-100 text-green-700"
                                } else if (/bsba/i.test(course)) {
                                  label = "BSBA"
                                  color = "bg-blue-100 text-blue-700"
                                } else if (/bshm/i.test(course)) {
                                  label = "BSHM"
                                  color = "bg-pink-100 text-pink-700"
                                } else if (/bstm/i.test(course)) {
                                  label = "BSTM"
                                  color = "bg-yellow-100 text-yellow-700"
                                }
                                return (
                                  <span key={i} className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>
                                    {label}
                                  </span>
                                )
                              })
                          : <span className="text-sm font-medium text-gray-900">N/A</span>
                        }
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-blue-700">Max Applicants</span>
                      <div className="text-sm font-medium text-gray-900 mt-1">
                        {application.job_postings?.max_applicants !== undefined && application.job_postings?.max_applicants !== null
                          ? application.job_postings.max_applicants
                          : "No Max Applicants"}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-blue-700">Created At</span>
                      <div className="text-sm font-medium text-gray-900 mt-1">
                        {application.job_postings?.created_at
                          ? new Date(application.job_postings.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
                {application.job_postings?.perks_and_benefits && application.job_postings.perks_and_benefits.length > 0 && (
                  <div className="mt-8">
                    <span className="text-xs font-semibold text-blue-700">Perks and Benefits</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      {[
                        { id: "training", label: "Free Training & Workshops - Skill development", icon: <BookOpen className="h-5 w-5 text-green-500" /> },
                        { id: "certification", label: "Certification Upon Completion - Proof of experience", icon: <Award className="h-5 w-5 text-blue-500" /> },
                        { id: "potential", label: "Potential Job Offer - Possible full-time employment", icon: <Briefcase className="h-5 w-5 text-yellow-500" /> },
                        { id: "transportation", label: "Transportation Allowance - Support for expenses", icon: <Bus className="h-5 w-5 text-purple-500" /> },
                        { id: "mentorship", label: "Mentorship & Guidance - Hands-on learning", icon: <UserCheck className="h-5 w-5 text-orange-500" /> },
                        { id: "flexible", label: "Flexible Hours - Adjusted schedules for students", icon: <ClockIcon className="h-5 w-5 text-pink-500" /> },
                      ]
                        .filter(perk =>
                          application.job_postings?.perks_and_benefits?.includes(perk.id)
                        )
                        .map(perk => (
                          <div
                            key={perk.id}
                            className="flex items-start p-3 rounded-lg border border-blue-200 bg-blue-50 gap-3"
                          >
                            <div className="mt-1">{perk.icon}</div>
                            <div className="text-sm text-blue-900">{perk.label}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
  
          <div className="px-6 mt-2">
            <h2 className="text-lg font-semibold mb-3">Application Questions &amp; Answers</h2>
            {questionsLoading ? (
              <div className="text-sm text-gray-500">Loading questions...</div>
            ) : questionsError ? (
              <div className="text-sm text-red-500">{questionsError}</div>
            ) : !applicationQuestions.length ? (
              <div className="text-sm text-gray-500">No application questions for this job.</div>
            ) : (
              <div className="space-y-3">
                {applicationQuestions.map((q, idx) => (
                  <div
                    key={q.id ?? idx}
                    className="rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3"
                  >
                    <div className="text-xs font-semibold text-blue-700 mb-1">
                      Question {idx + 1}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {q.question_text || "No question text"}
                    </div>
                    <div className="mt-2 text-xs font-semibold text-gray-500">
                      Your Answer
                    </div>
                    <div className="mt-1 text-sm text-gray-800 whitespace-pre-line">
                      {q.answer && String(q.answer).trim()
                        ? q.answer
                        : "No answer recorded."}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />
          <div className="space-y-2">
            <h3 className="text-md font-semibold text-blue-700">Contact Information</h3>
            {application.contacts.length === 0 && (
              <div className="text-sm text-gray-500">No contact information available.</div>
            )}
            {application.contacts.map((contact: { [key: string]: string }, index: number) => (
              <div key={index} className="bg-gray-50 border rounded-md p-3 flex items-center gap-4 border-blue-200">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {profileImgUrl ? (
                    <Image
                      src={profileImgUrl}
                      alt="Employer profile"
                      width={48}
                      height={48}
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-sm font-medium">
                      {contact.name ? contact.name[0] : ""}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm flex items-center gap-1">
                    {contact.name}
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white ml-1">
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
                  </div>
                  <div className="text-xs text-gray-500">
                    {contact.role}
                    {application.company ? ` at ${application.company}` : ""}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    {contact.email && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Mail className="h-3 w-3" />
                        {contact.email}
                      </span>
                    )}
                    {contact.phone && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Phone className="h-3 w-3" />
                        {contact.country_code && (
                          <span className="font-mono">{contact.country_code}</span>
                        )}
                        {contact.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Separator />
          <div className="space-y-2">
            <h3 className="text-md font-semibold text-blue-700">Notes</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 min-h-[48px]">
              {notes.length === 0 && <p className="text-sm text-gray-500">No notes yet.</p>}
              {notes.map((n, idx) => (
                <div key={idx} className="mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-base">
                      S
                    </div>
                    <div>
                      <div className="font-medium text-sm">You</div>
                      <div className="text-xs text-gray-500">{formatNoteDate(n.date_added)}</div>
                    </div>
                  </div>
                  {editMode && editNoteIdx === idx ? (
                    <div className="mt-2">
                      <textarea
                        className="w-full border border-gray-200 rounded-md p-2 text-sm"
                        rows={3}
                        value={editNoteText}
                        onChange={e => setEditNoteText(e.target.value)}
                      />
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" onClick={handleSaveEditNote} disabled={loading}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { setEditMode(false); setEditNoteIdx(null); }}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-gray-700">{n.note}</p>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditNote(idx)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteNote(idx)} disabled={loading}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <textarea
              className="w-full border border-gray-200 rounded-md p-3 text-sm mt-2"
              rows={4}
              placeholder="Add your notes about this application..."
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              disabled={loading}
            ></textarea>
            <Button size="sm" className="mt-2" onClick={handleAddNote} disabled={loading || !newNote.trim()}>
              <Edit className="h-4 w-4 mr-2" />
              Save Note
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="timeline" className="space-y-4 pt-4">
          <TimelineTab
            timeline={getTimelineWithMessages(application.timeline)}
            status={application.status?.toLowerCase?.() || ""}
          />
        </TabsContent>
        <TabsContent value="documents" className="space-y-4 pt-4">
          <ResumeTab
            resumeUrl={resumeUrl}
            resume={resume}
            documents={
              (application?.documents || []).map((doc: { name: string; date: string; time: string; phone: string; size?: string }) => ({
                name: doc.name,
                date: doc.date,
                size: doc.size ?? "",
              }))
            }
            achievements={achievements}
            portfolio={portfolio}
          />
        </TabsContent>
      </Tabs>
      <div className="flex justify-between pt-4 border-t">
        {!(
          ["hired", "withdrawn", "rejected", "offer_rejected"].includes(
            (application.status || "").toLowerCase()
          )
        ) && (
          <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
            Withdraw Application
          </Button>
        )}
        <div className="flex gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700">Next</Button>
        </div>
      </div>
    </div>
  )
}

