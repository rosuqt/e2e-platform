"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Mail,
  Phone,
  Clock,
  Briefcase,
  Star,
  CheckCircle,
  XCircle,
  Calendar,

  User
} from "lucide-react"
import Avatar from "@mui/material/Avatar"
import { Progress } from "@/components/ui/progress"
import type React from "react"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { MdStars } from "react-icons/md"
import { TbMessage } from "react-icons/tb"
import { TfiMoreAlt } from "react-icons/tfi"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { ArrowUpRight } from "lucide-react"
import InterviewScheduleModal from "./modals/interview-schedule"
import { FaHandHoldingUsd, FaRegCalendarTimes } from "react-icons/fa"
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogHeader, DialogTitle as UIDialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import TimelineTab from "./tabs/timeline-tab"
import ResumeTab from "./tabs/resume-tab"
import NoteTab from "./tabs/note-tab"
import { motion } from "framer-motion"
import SendOfferModal from "./modals/send-offer"
import QuestionsTab from "./tabs/questions-tab"
import { calculateSkillsMatch } from "../../../../../../lib/match-utils"


type AnswersMap = Record<string, string | string[]>;

interface Applicant {
  pay_amount: string | undefined
  pay_type: string | undefined
  work_type: string | undefined
  remote_options: string | undefined
  perks_and_benefits: string[] | undefined
  location: string | undefined
  contactInfo: {
    email?: string
    phone?: string
    socials?: { key: string; url: string }[]
    countryCode?: string
  }
  application_id: string
  job_id: string
  job_title?: string
  status?: string
  first_name?: string
  last_name?: string
  address?: string
  experience_years?: string
  applied_date?: string
  applied_at?: string
  skills?: string[]
  education?: { degree: string; school: string; year: string }[]
  work_history?: { company: string; position: string; duration: string; description: string }[]
  timeline?: { status: string; date: string; icon: React.JSX.Element; iconBg: string; current?: boolean }[]
  notes?: string
  email?: string
  phone?: string
  linkedin?: string
  github?: string
  documents?: { name: string; date: string; size: string }[]
  expertise?: { skill: string; mastery: number }[]
  profile_image_url?: string
  course?: string
  year?: string
  resume?: string
  application_answers?: AnswersMap
  job_skills?: string[]
  achievements?: string[]
  portfolio?: string[]
  raw_achievements?: string | string[] | Record<string, unknown> | null | undefined
  raw_portfolio?: string | string[] | Record<string, unknown> | null | undefined
  gpt_score?: number
}

interface RecruiterApplicationDetailsProps {
  applicant: Applicant | null
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
}

const statusIconMap: Record<string, { icon: React.JSX.Element; iconBg: string }> = {
  new: { icon: <Clock className="h-4 w-4 text-white" />, iconBg: "bg-yellow-400" },
  shortlisted: { icon: <Star className="h-4 w-4 text-white" />, iconBg: "bg-cyan-500" },
  interview: { icon: <Calendar className="h-4 w-4 text-white" />, iconBg: "bg-purple-500" },
  invited: { icon: <Mail className="h-4 w-4 text-white" />, iconBg: "bg-yellow-500" },
  waitlisted: { icon: <Clock className="h-4 w-4 text-white" />, iconBg: "bg-blue-400" },
  rejected: { icon: <XCircle className="h-4 w-4 text-white" />, iconBg: "bg-red-500" },
  hired: { icon: <CheckCircle className="h-4 w-4 text-white" />, iconBg: "bg-green-600" },
}

type TimelineEvent = {
  status: string
  date: string
  icon: React.JSX.Element
  iconBg: string
  message: string
  current?: boolean
}

type ActivityApiResponse = {
  type: string
  created_at: string
  message: string
}

type InterviewData = {
  id?: string
  mode?: string
  platform?: string
  address?: string
  team?: string[]
  date?: string
  time?: string
  notes?: string
  summary?: string
  application_id?: string
  student_id?: string
  employer_id?: string
  company_name?: string
}

export function RecruiterApplicationDetailsModal({
  applicant,
  isModalOpen,
  setIsModalOpen,
  refreshApplicants,
}: RecruiterApplicationDetailsProps & { refreshApplicants?: () => void }) {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [showInterviewModal, setShowInterviewModal] = useState(false)
  const [editInterviewMode, setEditInterviewMode] = useState(false)
  const [editInterviewData, setEditInterviewData] = useState<InterviewData | null>(null)
  const [cancelInterviewOpen, setCancelInterviewOpen] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [showSendOfferModal, setShowSendOfferModal] = useState(false)
  const [jobSkills, setJobSkills] = useState<string[]>([])
  const [showMarkDoneModal, setShowMarkDoneModal] = useState(false)
  const [markDoneLoading, setMarkDoneLoading] = useState(false)
  useEffect(() => {
    setResumeUrl(null)
    setTimeline([])
    setJobSkills([])
    if (applicant?.resume) {
      fetch("/api/students/get-signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bucket: "student.documents",
          path: applicant.resume
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.signedUrl) setResumeUrl(data.signedUrl)
        })
    }
    if (applicant?.application_id) {
      fetch(`/api/employers/applications/activity?application_id=${applicant.application_id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setTimeline(
              data
                .slice()
                .reverse()
                .map((item: ActivityApiResponse, idx: number): TimelineEvent => {
                  const type = (item.type || "").toLowerCase()
                  const iconInfo = statusIconMap[type] || { icon: <Clock className="h-4 w-4 text-white" />, iconBg: "bg-gray-300" }
                  return {
                    status: type.charAt(0).toUpperCase() + type.slice(1),
                    date: item.created_at,
                    icon: iconInfo.icon,
                    iconBg: iconInfo.iconBg,
                    message: item.message,
                    current: idx === data.length - 1
                  }
                })
            )
          }
        })
    }
    if (applicant?.job_id) {
      fetch(`/api/jobs/${applicant.job_id}/skills`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data.skills)) setJobSkills(data.skills)
        })
    }
  }, [applicant])

  useEffect(() => {
    function handleOpenInterviewModal() {
      setEditInterviewMode(false)
      setShowInterviewModal(true)
    }
    window.addEventListener("__openInterviewModal", handleOpenInterviewModal)
    return () => window.removeEventListener("__openInterviewModal", handleOpenInterviewModal)
  }, [])

  if (!applicant) return null

  const matchScore = typeof applicant?.gpt_score === "number"
    ? Math.round(applicant.gpt_score)
    : calculateSkillsMatch(
        applicant?.skills || [],
        jobSkills
      )

  const contactInfo = applicant && typeof applicant.contactInfo === "object" && applicant.contactInfo !== null
    ? (applicant.contactInfo as {
        email?: string
        phone?: string
        socials?: { key: string; url: string }[]
        countryCode?: string
      })
    : null;

  const application = {
    id: applicant.application_id, 
    job_id: applicant.job_id,
    name: `${applicant.first_name || "Applicant"} ${applicant.last_name || ""}`.trim(),
    title: applicant.job_title || "Job Applicant",
    status: applicant.status || "New",
    statusColor:
      (applicant.status || "").toLowerCase() === "interview"
        ? "bg-purple-100 text-purple-700"
        : (applicant.status || "").toLowerCase() === "invited"
        ? "bg-green-100 text-green-700"
        : "bg-yellow-100 text-yellow-700",
    location: applicant.address || "N/A",
    experience: applicant.experience_years || "N/A",
    appliedDate: applicant.applied_date || applicant.applied_at || "N/A",
    matchScore,
    skills: applicant.skills || [],
    expertise: applicant.expertise || [],
    education: applicant.education || [],
    workHistory: applicant.work_history || [],
    timeline: timeline,
    notes: applicant.notes || "",
    contact: {
      email: contactInfo?.email || "",
      phone: contactInfo?.phone || "",
      linkedin: Array.isArray(contactInfo?.socials)
        ? (contactInfo.socials.find((s) => s.key === "linkedin")?.url || "")
        : "",
      github: Array.isArray(contactInfo?.socials)
        ? (contactInfo.socials.find((s) => s.key === "github")?.url || "")
        : "",
      portfolio: Array.isArray(applicant.portfolio)
        ? (applicant.portfolio.length > 0 ? applicant.portfolio[0] : "")
        : (typeof applicant.portfolio === "string" ? applicant.portfolio : ""),
      countryCode: contactInfo?.countryCode || "",
    },
    documents: applicant.documents || [],
    course: applicant.course,
    year: applicant.year,
    resume: applicant.resume,
    application_answers: applicant.application_answers,
    achievements: applicant.achievements || [],
    portfolio: applicant.portfolio || [],
    profile_image_url: applicant.profile_image_url,
  }

  async function handleCancelInterview() {
    if (!applicant?.application_id) return
    setCancelLoading(true)
    try {
      await fetch("/api/employers/applications/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ application_id: applicant.application_id, action: "shortlist" }),
      })
      setIsModalOpen(false)
    } finally {
      setCancelLoading(false)
      setCancelInterviewOpen(false)
    }
  }

  async function handleMarkAsDone() {
    if (!applicant?.application_id) return
    setMarkDoneLoading(true)
    try {
      await fetch("/api/employers/applications/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ application_id: applicant.application_id, action: "waitlist" }),
      })
      setIsModalOpen(false)
     if (typeof refreshApplicants === "function") {
       setTimeout(() => refreshApplicants(), 100)
     }
    } finally {
      setMarkDoneLoading(false)
      setShowMarkDoneModal(false)
    }
  }

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={open => {
        if (!open && showInterviewModal) setShowInterviewModal(false)
        setIsModalOpen(open)
      }}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto mt-10 p-0">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white rounded-t-lg relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    fontWeight: "bold",
                    bgcolor: "#fff",
                    color: "#2563EB",
                    fontSize: 28,
                    border: "2px solid #fff",
                  }}
                  src={applicant.profile_image_url || undefined}
                >
                  {!applicant.profile_image_url && application.name.charAt(0)}
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{application.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Briefcase className="h-4 w-4 text-blue-100" />
                    <span className="text-blue-100">{application.title}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <motion.div whileHover={{ scale: 1.08 }} style={{ display: "inline-block" }}>
                  <Badge className={
                    application.status.toLowerCase() === "new"
                      ? "bg-amber-100 text-amber-700 px-3 py-1 text-sm font-medium pointer-events-none"
                      : application.status.toLowerCase() === "shortlisted"
                      ? "bg-cyan-100 text-cyan-700 px-3 py-1 text-sm font-medium pointer-events-none" 
                      : application.status.toLowerCase() === "rejected"
                      ? "bg-red-100 text-red-700 px-3 py-1 text-sm font-medium pointer-events-none"
                      : (application.status.toLowerCase() === "interview" || application.status.toLowerCase() === "interview scheduled")
                      ? "bg-purple-100 text-purple-700 px-3 py-1 text-sm font-medium pointer-events-none"
                      : application.status.toLowerCase() === "waitlisted"
                      ? "bg-blue-100 text-blue-700 px-3 py-1 text-sm font-medium pointer-events-none"
                      : application.status.toLowerCase() === "hired"
                      ? "bg-green-600 text-white px-3 py-1 text-sm font-medium pointer-events-none"
                      : "bg-yellow-100 text-yellow-700 px-3 py-1 text-sm font-medium pointer-events-none"
                  }>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1).toLowerCase() === "Interview scheduled"
                      ? "Interview Scheduled"
                      : application.status.charAt(0).toUpperCase() + application.status.slice(1).toLowerCase()}
                  </Badge>
                </motion.div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <DialogTitle className="sr-only">Applicant Details</DialogTitle>
            <RecruiterApplicationDetailsContent
              application={application}
              resumeUrl={resumeUrl}
              jobSkills={jobSkills}
              onOpenMarkDoneModal={() => setShowMarkDoneModal(true)}
              onOpenInterviewModal={() => {
                setIsModalOpen(false)
                setEditInterviewMode(false)
                setTimeout(() => setShowInterviewModal(true), 200)
              }}
              onOpenEditInterviewModal={async () => {
                setIsModalOpen(false)
                setEditInterviewMode(true)
                let interviewData = null
                try {
                  const res = await fetch(`/api/employers/applications/postInterviewSched?application_id=${applicant?.application_id}`)
                  if (res.ok) {
                    const text = await res.text()
                    if (text) {
                      interviewData = JSON.parse(text).data || null
                    }
                  }
                } catch {}
                setEditInterviewData(interviewData)
                setTimeout(() => setShowInterviewModal(true), 200)
              }}
              onOpenCancelInterviewModal={() => setCancelInterviewOpen(true)}
              setIsModalOpen={setIsModalOpen}
              setShowSendOfferModal={setShowSendOfferModal}
            />
          </div>
        </DialogContent>
      </Dialog>
      <InterviewScheduleModal
        open={showInterviewModal}
        onClose={() => { setShowInterviewModal(false); setEditInterviewMode(false); setEditInterviewData(null); }}
        initial={editInterviewMode && editInterviewData ? {
          ...editInterviewData,
          application_id: applicant?.application_id,
          student_id: applicant?.job_id,
          employer_id: applicant?.job_id,
          company_name: undefined
        } : applicant ? {
          application_id: applicant?.application_id,
          student_id: applicant?.job_id,
          employer_id: applicant?.job_id,
          company_name: undefined
        } : undefined}
        editMode={editInterviewMode}
      />
      {/* Cancel Interview Dialog */}
      <UIDialog open={cancelInterviewOpen} onOpenChange={setCancelInterviewOpen}>
        <UIDialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <FaRegCalendarTimes className="w-6 h-6 text-purple-600" />
            </div>
            <UIDialogTitle className="text-lg">Cancel Interview?</UIDialogTitle>
            <DialogDescription className="text-center">
              This will move {applicant?.first_name}&apos;s application back to Shortlisted.
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
            <Button variant="destructive" onClick={handleCancelInterview} className="flex-1" disabled={cancelLoading}>
              {cancelLoading ? (
                <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "Yes, Cancel Interview"
              )}
            </Button>
          </DialogFooter>
        </UIDialogContent>
      </UIDialog>
      <SendOfferModal
        open={showSendOfferModal}
        onClose={() => setShowSendOfferModal(false)}
        initial={
          applicant
            ? {
                application_id: applicant.application_id,
                student_id: applicant.job_id,
                employer_id: applicant.job_id,
                applicant_name: `${applicant.first_name || "Applicant"} ${applicant.last_name || ""}`.trim(),
                job_title: applicant.job_title || "",
                job_postings: {
                  pay_amount: applicant.pay_amount,
                  pay_type: applicant.pay_type,
                  work_type: applicant.work_type,
                  remote_options: applicant.remote_options,
                  perks_and_benefits: applicant.perks_and_benefits,
                  job_title: applicant.job_title,
                  location: applicant.location,
                }
              }
            : undefined
        }
      />
      {/* Mark as Done Modal */}
      <UIDialog open={showMarkDoneModal} onOpenChange={setShowMarkDoneModal}>
        <UIDialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          <div className="flex flex-col items-center justify-center py-8 px-6 bg-white">
            <div className="flex flex-col items-center">
              <div className="mb-4 w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center shadow">
                <CheckCircle className="w-7 h-7 text-blue-600" />
              </div>
              <UIDialogTitle className="text-lg text-center font-semibold mb-2">
                Mark Interview as Finished?
              </UIDialogTitle>
              <DialogDescription className="text-center text-gray-600 mb-4">
                This will move <span className="font-semibold text-blue-700">{applicant?.first_name}</span>&apos;s application to <span className="font-semibold text-blue-700">Waitlisted</span> status.<br />
                <span className="text-xs text-muted-foreground block mt-2">
                  Are you sure you want to mark this interview as finished?
                </span>
              </DialogDescription>
            </div>
            <div className="flex gap-3 w-full mt-2">
              <Button
                variant="outline"
                onClick={() => setShowMarkDoneModal(false)}
                className="flex-1 border-gray-300"
                disabled={markDoneLoading}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleMarkAsDone}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={markDoneLoading}
              >
                {markDoneLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  "Yes, Mark as Finished"
                )}
              </Button>
            </div>
          </div>
        </UIDialogContent>
      </UIDialog>
    </>
  )
}

interface Application {
  id: string
  name: string
  title: string
  status: string
  statusColor: string
  location: string
  experience: string
  appliedDate: string
  matchScore: number
  skills: string[]
  education: { degree: string; school: string; year: string }[]
  workHistory: { company: string; position: string; duration: string; description: string }[]
  timeline: TimelineEvent[]
  notes: string
  contact: {
    countryCode: string
    email: string
    phone: string
    linkedin?: string
    github?: string
    portfolio?: string
  }
  documents: { name: string; date: string; size: string }[]
  course?: string
  year?: string
  application_answers?: AnswersMap
}

function formatAppliedDate(dateString?: string) {
  if (!dateString) return "N/A"
  let date: Date | null = null
  let cleaned = dateString
  if (typeof cleaned === 'string' && cleaned.match(/^\d{4}-\d{2}-\d{2} /)) {
    cleaned = cleaned.replace(' ', 'T')
    cleaned = cleaned.replace(/\.[0-9]+/, '')
    if (cleaned.match(/([+-]00:?00|\+00|\+0000|\+00:00)$/)) {
      cleaned = cleaned.replace(/([+-]00:?00|\+00|\+0000|\+00:00)$/, 'Z')
    } else if (!cleaned.endsWith('Z')) {
      cleaned = cleaned + 'Z'
    }
  }
  if (typeof cleaned === 'string' && cleaned.includes('T')) {
    date = new Date(cleaned)
  } else if (typeof cleaned === 'string') {
    date = new Date(Date.parse(cleaned))
  }
  if (!date || isNaN(date.getTime())) return "N/A"
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const month = monthNames[date.getMonth()]
  const day = date.getDate().toString().padStart(2, '0')
  const year = date.getFullYear().toString()
  return `${month} ${day} ${year}`
}

type RecruiterNote = {
  employer_name: string
  job_title: string
  date_added: string
  note: string
  profile_img?: string | null
  isEmployer?: boolean
}
function RecruiterApplicationDetailsContent({
  application,
  resumeUrl,
  jobSkills,
  onOpenInterviewModal,
  onOpenEditInterviewModal,
  onOpenCancelInterviewModal,
  onOpenMarkDoneModal,
  setIsModalOpen,
  setShowSendOfferModal
}: {
  application: Application & { expertise?: { skill: string; mastery: number }[], resume?: string, job_id?: string, application_answers?: AnswersMap, achievements?: string[], portfolio?: string[], profile_image_url?: string },
  resumeUrl?: string | null,
  jobSkills: string[],
  onOpenInterviewModal?: () => void,
  onOpenEditInterviewModal?: () => void,
  onOpenCancelInterviewModal?: () => void,
  onOpenMarkDoneModal?: () => void,
  setIsModalOpen?: (open: boolean) => void,
  setShowSendOfferModal?: (open: boolean) => void
}) {
  const { data: session } = useSession()
  const [notes, setNotes] = useState<RecruiterNote[]>([])
  const [newNote, setNewNote] = useState("")
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editNoteIdx, setEditNoteIdx] = useState<number | null>(null)
  const [editNoteText, setEditNoteText] = useState("")
  const [employerName, setEmployerName] = useState<string>("")
  const [employerJobTitle, setEmployerJobTitle] = useState<string>("")
  const [employerProfileImg, setEmployerProfileImg] = useState<string | null>(null)
  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  // const open = Boolean(anchorEl)
  const [signedAchievements, setSignedAchievements] = useState<{ name: string; url: string }[]>([])
  const [signedPortfolio, setSignedPortfolio] = useState<{ name: string; url: string }[]>([])

  useEffect(() => {
    const employerId = (session?.user as { employerId?: string })?.employerId
    if (employerId) {
      fetch(`/api/employers/applications/notes?employer_id=${employerId}&info=employer`)
        .then(res => res.json())
        .then(async data => {
          if (data && (data.first_name || data.last_name)) {
            setEmployerName(`${data.first_name || ""} ${data.last_name || ""}`.trim())
          }
          if (data && data.job_title) {
            setEmployerJobTitle(data.job_title)
          }
          if (data && data.profile_img) {
            const res = await fetch("/api/employers/get-signed-url", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ bucket: "user.avatars", path: data.profile_img }),
            })
            if (res.ok) {
              const { signedUrl } = await res.json()
              setEmployerProfileImg(signedUrl)
            } else {
              setEmployerProfileImg(null)
            }
          } else {
            setEmployerProfileImg(null)
          }
        })
    }
  }, [session?.user])

  useEffect(() => {
    if (application.id) {
      fetch(`/api/employers/applications/notes?application_id=${application.id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setNotes(data)
        })
    }
  }, [application.id])

  async function handleAddNote() {
    if (!newNote.trim()) return
    setLoading(true)
    const note: RecruiterNote = {
      employer_name: employerName || session?.user?.name || "Recruiter",
      job_title: employerJobTitle || application.title,
      date_added: new Date().toISOString(),
      note: newNote.trim(),
      profile_img: employerProfileImg ? employerProfileImg : null,
      isEmployer: true
    }
    const res = await fetch("/api/employers/applications/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        application_id: application.id,
        note,
      }),
    })
    if (res.ok) {
      setNotes([note, ...notes])
      setNewNote("")
    }
    setLoading(false)
  }

  async function handleEditNote(idx: number) {
    setEditMode(true)
    setEditNoteIdx(idx)
    setEditNoteText(notes[idx].note)
  }

  async function handleSaveEditNote() {
    if (editNoteIdx === null || !editNoteText.trim()) return
    setLoading(true)
    const updatedNotes = [...notes]
    updatedNotes[editNoteIdx] = {
      ...updatedNotes[editNoteIdx],
      note: editNoteText.trim(),
      date_added: new Date().toISOString(),
    }
    const res = await fetch("/api/employers/applications/notes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        application_id: application.id,
        notes: updatedNotes,
      }),
    })
    if (res.ok) {
      setNotes(updatedNotes)
      setEditMode(false)
      setEditNoteIdx(null)
      setEditNoteText("")
    }
    setLoading(false)
  }

  async function handleDeleteNote(idx: number) {
    setLoading(true)
    const updatedNotes = notes.filter((_, i) => i !== idx)
    const res = await fetch("/api/employers/applications/notes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        application_id: application.id,
        notes: updatedNotes,
      }),
    })
    if (res.ok) {
      setNotes(updatedNotes)
      setEditMode(false)
      setEditNoteIdx(null)
      setEditNoteText("")
    }
    setLoading(false)
  }

  useEffect(() => {
    async function signFiles(files: (string | { name: string; url: string })[] = []) {
      const normalized = normalizeFiles(files)
      const signed = await Promise.all(
        normalized.map(async (file) => {
          if (!file.url) return file
          if (file.url.startsWith("http")) return file
          try {
            const res = await fetch("/api/students/get-signed-url", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ bucket: "student.documents", path: file.url })
            })
            const data = await res.json()
            if (data.signedUrl) {
              return { ...file, url: data.signedUrl }
            }
          } catch {}
          return file
        })
      )
      return signed
    }

    signFiles(application.achievements).then(setSignedAchievements)
    signFiles(application.portfolio).then(setSignedPortfolio)
  }, [application.achievements, application.portfolio])

  const matchedSkillsCount = jobSkills.filter(
    skill => (application.skills || []).map(s => s.trim().toLowerCase()).includes(skill.trim().toLowerCase())
  ).length

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="resume">Resume</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 pt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-semibold text-blue-700">Candidate Summary</h3>
            </div>
            <div className="text-xs text-gray-500 mt-1 ml-auto text-right" style={{ maxWidth: 220 }}>
              {getMatchMessage(application.matchScore)}
            </div>
          </div>

          <Separator />

          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Job Match</h2>
            <div className="flex items-start gap-4">
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={
                      application.matchScore >= 70
                        ? "#22c55e"
                        : application.matchScore >= 40
                        ? "#f97316"
                        : "#ef4444"
                    }
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={
                      2 * Math.PI * 40 * (1 - (application.matchScore ?? 0) / 100)
                    }
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.5s, stroke 0.5s" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold">{application.matchScore}%</span>
                </div>
              </div>
              <div className="flex-1">
                <h3
                  style={{
                    color:
                      application.matchScore >= 70
                        ? "#22c55e"
                        : application.matchScore >= 40
                        ? "#f59e42"
                        : "#ef4444",
                    fontWeight: 600,
                    fontSize: "1.125rem"
                  }}
                  className="font-semibold"
                >
                  {application.matchScore >= 70
                    ? "This Applicant Is a Strong Match"
                    : application.matchScore >= 40
                    ? "This Applicant Is a Partial Match"
                    : "This Applicant Isn’t a Strong Match"}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {application.matchScore >= 70
                    ? "Their background and skills closely match what this role is looking for — it could be a great fit!"
                    : application.matchScore >= 40
                    ? "They match some key aspects of this role. With a bit of alignment, it could be a solid opportunity."
                    : "Their profile doesn’t closely match the main requirements for this role, but other opportunities may suit them better."}
                </p>
                <div className="mt-2 text-sm text-blue-700 font-medium">
                  {matchedSkillsCount} Skills Matched
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Candidate Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-blue-700">Application Date:</span>
                <span className="text-sm">Applied on {formatAppliedDate(application.appliedDate)}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-blue-700">Name:</span>
                <span className="text-sm">{application.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-blue-700">Course:</span>
                <span className="text-sm">{application.course || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-blue-700">Year:</span>
                <span className="text-sm">{application.year || 'N/A'}</span>
              </div>
            </div>
            <div className="flex items-start gap-3 mb-2 mt-5">
              <span className="text-sm font-medium text-blue-700 min-w-[70px]">Location:</span>
              <span className="text-sm whitespace-pre-line">{application.location}</span>
            </div>  
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-md font-semibold text-blue-700">Skills</h3>
            <span className="text-sm text-gray-500">Highlighted skills are applicant&apos;s skills that matches this job </span> 
            <div className="flex flex-wrap gap-2">
              {application.skills.map((skill: string, index: number) => {
                const isMatched = jobSkills
                  .map(s => s.trim().toLowerCase())
                  .includes(skill.trim().toLowerCase())
                return (
                  <span
                    key={index}
                    className="inline-block"
                  >
                    <Badge
                      className={
                        "cursor-pointer pointer-events-auto transition-transform transition-colors duration-200 " +
                        (isMatched
                          ? "bg-blue-700 text-white border-blue-700"
                          : "")
                      }
                      variant="outline"
                      style={{ transition: "transform 0.18s" }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.transform = "scale(1.12)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.transform = "";
                      }}
                    >
                      {skill}
                    </Badge>
                  </span>
                )
              })}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-md font-semibold text-blue-700">Expertise</h3>
            <div className="flex flex-wrap gap-3">
              {(application.expertise || []).map((exp: { skill: string; mastery: number }, idx: number) => (
                <div key={idx} className="flex flex-col items-start bg-blue-50 border rounded-md p-3 min-w-[160px]">
                  <span className="font-medium text-blue-800">{exp.skill}</span>
                  <div className="flex items-center gap-2 mt-1 w-full">
                    <Progress value={exp.mastery} className="h-2 w-24" />
                    <span className="text-xs text-blue-700 font-semibold">{exp.mastery}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-md font-semibold text-blue-700">Education</h3>
            {(application.education || []).map((edu: { degree: string; school: string; year?: string; years?: string; acronym?: string; iconColor?: string; level?: string }, index: number) => (
              <div key={index} className="bg-gray-50 border rounded-md p-3 flex items-center gap-3">
                <span className="inline-block w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: edu.iconColor || '#facc15' }}>
                  {edu.acronym
                    ? <span className="text-sm font-bold text-white">{edu.acronym}</span>
                    : <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0 0H6m6 0h6" />
                      </svg>
                  }
                </span>
                <div>
                  <div className="font-medium">{edu.degree}</div>
                  <div className="text-sm text-gray-500">{edu.school}{edu.acronym ? '' : ''}, {edu.years || edu.year}</div>
                  <div className="text-xs text-gray-400">{edu.level}</div>
                </div>
              </div>
            ))}
          </div>
          <Separator />

          <div className="space-y-2">
            <h3 className="text-md font-semibold text-blue-700">Work Experience</h3>
            {application.experience && (
              <div className="bg-gray-50 border rounded-md p-3">
                <div className="font-medium">
                  {application.experience.toLowerCase() === "no experience"
                    ? "No experience"
                    : `${application.experience} experience`}
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-md font-semibold text-blue-700">Contact Information</h3>
            <div className="bg-gray-50 border rounded-md p-3 flex items-center gap-4 border-blue-200">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {application.profile_image_url ? (
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      fontWeight: "bold",
                      bgcolor: "#DBEAFE",
                      color: "#2563EB",
                      fontSize: 22,
                    }}
                    src={application.profile_image_url}
                  >
                    {application.name ? application.name[0] : ""}
                  </Avatar>
                ) : (
                  <span className="text-sm font-medium">
                    {application.name ? application.name[0] : ""}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm flex items-center gap-1">
                  {application.name}
                </div>
                <div className="text-xs text-gray-500">
                  {application.year || "N/A"} | {application.course || "N/A"}
                </div>
                <div className="flex items-center gap-3 mt-2">
                  {application.contact.email && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Mail className="h-3 w-3" />
                      {application.contact.email ? application.contact.email : "No email provided"}
                    </span>
                  )}
                  {application.contact.phone && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Phone className="h-3 w-3" />
                      {application.contact.countryCode
                        ? `+${application.contact.countryCode} ${application.contact.phone}`
                        : application.contact.phone}
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-100 hover:text-blue-700 ml-2 flex items-center"
                style={{ borderWidth: 1, background: "transparent" }}
                size="sm"
              >
                <TbMessage className="h-4 w-4 mr-1" />
                Message
              </Button>
            </div>
          </div>
          <Separator />

        </TabsContent>

        <TabsContent value="resume" className="space-y-4 pt-4">
          <ResumeTab
            resumeUrl={resumeUrl}
            resume={application.resume}
            documents={application.documents || []}
            achievements={signedAchievements}
            portfolio={signedPortfolio}
          />
        </TabsContent>

        <TabsContent value="questions" className="space-y-4 pt-4">
          <QuestionsTab jobId={application.job_id || ""} answers={application.application_answers || {}} />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4 pt-4">
          <TimelineTab timeline={application.timeline || []} status={(application.status || "").toLowerCase()} />
        </TabsContent>

        <TabsContent value="notes" className="space-y-4 pt-4">
          <NoteTab
            notes={notes}
            employerName={employerName}
            editMode={editMode}
            editNoteIdx={editNoteIdx}
            editNoteText={editNoteText}
            loading={loading}
            newNote={newNote}
            setEditMode={setEditMode}
            setEditNoteIdx={setEditNoteIdx}
            setEditNoteText={setEditNoteText}
            handleEditNote={handleEditNote}
            handleSaveEditNote={handleSaveEditNote}
            handleDeleteNote={handleDeleteNote}
            setNewNote={setNewNote}
            handleAddNote={handleAddNote}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-between pt-4 border-t">
        <div className="flex gap-2">
          {(() => {
            const status = application.status.toLowerCase()
            if (status === "new" || status === "shortlisted") {
              return (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-gray-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                      >
                        <TfiMoreAlt className="h-4 w-4 mr-2" />
                        More Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      sideOffset={8}
                      className="min-w-[200px]"
                    >
                      <DropdownMenuItem onSelect={() => {}}>
                        <User className="w-4 h-4 mr-2 text-gray-500" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => {
                        window.location.href = `/employers/jobs/job-listings?job=${application.job_id}`;
                      }}>
                        <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
                        View Job Listing
                      </DropdownMenuItem>
                      {status === "new" && (
                        <DropdownMenuItem
                          onSelect={e => {
                            e.preventDefault()
                            if (setIsModalOpen) setIsModalOpen(false)
                            setTimeout(() => {
                              window.dispatchEvent(new CustomEvent("__openInterviewModal"))
                            }, 200)
                          }}
                        >
                          <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                          Schedule Interview
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onSelect={e => {
                          e.preventDefault()
                          setIsModalOpen?.(false)
                          setTimeout(() => setShowSendOfferModal?.(true), 200)
                        }}
                      >
                        <ArrowUpRight className="w-4 h-4 mr-2 text-yellow-500" />
                        Send Offer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </>
              )
            }
            if (status === "shortlisted") {
              return (
                <>
                  <Button
                    variant="outline"
                    className="text-purple-700 border-purple-200 hover:bg-purple-50"
                    onClick={() => {
                      if (onOpenInterviewModal) onOpenInterviewModal()
                    }}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Invite to Interview
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                </>
              )
            }
            if (status === "interview" || status === "interview scheduled") {
              return (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-gray-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                      >
                        <TfiMoreAlt className="h-4 w-4 mr-2" />
                        More Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" sideOffset={8} className="min-w-[200px]">
                      <DropdownMenuItem onSelect={() => {}}>
                        <User className="w-4 h-4 mr-2 text-gray-500" />
                        View Profile
                      </DropdownMenuItem>
<DropdownMenuItem onSelect={() => {
  window.location.href = `/employers/jobs/job-listings?job=${application.job_id}`;
}}>
  <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
  View Job Listing
</DropdownMenuItem>
<DropdownMenuItem onSelect={e => {
  e.preventDefault();
  if (setIsModalOpen) setIsModalOpen(false);
  setTimeout(() => { if (onOpenMarkDoneModal) onOpenMarkDoneModal(); }, 200);
}}>
  <CheckCircle className="w-4 h-4 mr-2 hover:text-green-600 text-green-500" />
  Mark as Done
</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    onClick={() => {
                      if (onOpenCancelInterviewModal) onOpenCancelInterviewModal()
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Interview
                  </Button>
                </>
              )
            }
            if (status === "waitlisted") {
              return (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-gray-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                      >
                        <TfiMoreAlt className="h-4 w-4 mr-2" />
                        More Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" sideOffset={8} className="min-w-[200px]">
                      <DropdownMenuItem onSelect={() => {}}>
                        <User className="w-4 h-4 mr-2 text-gray-500" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => {
                        window.location.href = `/employers/jobs/job-listings?job=${application.job_id}`;
                      }}>
                        <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
                        View Job Listing
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </>
              )
            }
            if (status === "rejected") {
              return (
                <>
                  <Button
                    variant="outline"
                    className="text-green-700 border-green-200 hover:bg-green-50"
                  >
                    Restore
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                </>
              )
            }
      
            return (
              <>
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </>
            )
          })()}
        </div>
        <div className="flex gap-2 justify-end w-full">
          {(() => {
            const status = application.status.toLowerCase()
            if (status === "new") {
              return (
                <>
                  <Button
                    variant="outline"
                    className="text-green-700 border-green-200 hover:bg-green-50 flex items-center gap-2"
                    onClick={() => {
                      setIsModalOpen?.(false)
                      setTimeout(() => onOpenMarkDoneModal?.(), 200)
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Mark as Done
                  </Button>
                  <Button
                    className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2"
                    onClick={async () => {
                      await fetch("/api/employers/applications/actions", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ application_id: application.id, action: "shortlist" }),
                      })
                      setIsModalOpen?.(false)
                    }}
                  >
                    <MdStars className="w-4 h-4 mr-1" />
                    Shortlist Applicant
                  </Button>
                </>
              )
            }
            if (status === "shortlisted") {
              return (
                <>
                  <Button
                    variant="outline"
                    className="text-green-700 border-green-200 hover:bg-green-50 flex items-center gap-2"
                    onClick={() => {
                      setIsModalOpen?.(false)
                      setTimeout(() => onOpenMarkDoneModal?.(), 200)
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Mark as Done
                  </Button>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                    onClick={() => {
                      if (onOpenInterviewModal) onOpenInterviewModal()
                    }}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Invite to Interview
                  </Button>
                </>
              )
            }
            if (status === "interview" || status === "interview scheduled") {
              return (
                <>
                  <Button
                    variant="outline"
                    className="text-green-700 border-green-200 hover:bg-green-50 flex items-center gap-2"
                    onClick={() => {
                      setIsModalOpen?.(false)
                      setTimeout(() => onOpenMarkDoneModal?.(), 200)
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Mark as Done
                  </Button>
                  <Button
                    variant="outline"
                    className="border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100"
                    onClick={() => {
                      if (onOpenEditInterviewModal) onOpenEditInterviewModal()
                    }}
                  >
                    <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                    Resched Interview
                  </Button>
                </>
              )
            }
            if (status === "waitlisted") {
              return (
                <>
                  <Button
                    variant="outline"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                  >
                    <TbMessage className="h-4 w-4 mr-2 text-blue-500" />
                    Message Applicant
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                    onClick={() => {
                      setIsModalOpen?.(false)
                      setTimeout(() => setShowSendOfferModal?.(true), 200)
                    }}
                  >
                    <FaHandHoldingUsd className="h-4 w-4 mr-2" />
                    Send Job Offer
                  </Button>
                </>
              )
            }
            if (status === "hired") {
              return null
            }
            if (status === "rejected") {
              return null
            }
            return null
          })()}
          {(() => {
            const status = application.status.toLowerCase()
            if (status === "hired") {
              return (
                <Button
                  variant="outline"
                  className="bg-yellow-100 text-yellow-600 hover:bg-yellow-200 hover:text-yellow-600 flex items-center gap-2 ml-auto"
                >
                  <MdStars className="w-4 h-4 mr-1" />
                  Rate Applicant
                </Button>
              )
            }
            return null
          })()}
        </div>
      </div>
    </div>
  )
}

function getMatchMessage(percent: number) {
  if (percent >= 70) return "Great fit for this job"
  if (percent >= 40) return "Somewhat matches the requirements"
  return "Low skill match for this job"
}

function normalizeFiles(arr: (string | { name: string; url: string })[] = []): { name: string; url: string }[] {
  return arr.map(item => {
    if (typeof item === "string") {
      const name = item.split("/").pop() || item
      return { name, url: item }
    }
    return item
  })
}
