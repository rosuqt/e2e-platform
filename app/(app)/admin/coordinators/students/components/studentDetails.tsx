import { Badge as UIBadge } from "@/components/ui/badge"
import { CheckCircle, MessageSquare, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DialogFooter, Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Tooltip from "@mui/material/Tooltip"
import { motion } from "framer-motion"
import {  HiRocketLaunch } from "react-icons/hi2"
import { RiProgress6Fill, RiCheckboxCircleFill } from "react-icons/ri"
import { FaMagnifyingGlass, FaStar } from "react-icons/fa6"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { TbBulb } from "react-icons/tb"
import { MdMarkEmailRead, MdEditCalendar } from "react-icons/md"
import { LiaBusinessTimeSolid } from "react-icons/lia"
import { AiFillCloseCircle } from "react-icons/ai"
import { Checkbox } from "@/components/ui/checkbox"
import OJTProgressTab, { OJTStudent } from "./ojt-progress-tab"

import { PiWarningCircleBold } from "react-icons/pi"

import Lottie from "lottie-react"
import ojtTrackAnimation from "@/../public/animations/ojt-track.json"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"


type TimelineItem = {
  name: string
  position: string
  update: string
  time: string
  icon: string
  application_id: string
  type: string
  created_at: string
  message: string
  category?: string
  job_title?: string
}

type OJTApplication = {
  id: string | number
  companyName?: string
  company_name?: string
  status?: string
  created_at?: string
  applied_at?: string
  job_title?: string
  company_logo_image_path?: string
}

type StudentInfo = {
  email: string
  name: string
  studentId: string
  status: string
  course?: string
  year?: string | number
  company?: string
  employer?: string
  progress: number
  profile_img?: string | null
  section?: string | null
  id?: string | number
  application_id?: string
  student_id?: string | number
}

function getStatusDisplay(status: string) {
  switch (status.toLowerCase()) {
    case "new":
      return {
        label: "Not Applied",
        bg: "bg-orange-100",
        text: "text-orange-700",
        border: "border-orange-200",
        icon: <PiWarningCircleBold className="inline-block mr-1 -mt-0.5" size={16} />,
      }
    case "shortlisted":
    case "waitlisted":
      return {
        label: "Seeking Jobs",
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        border: "border-yellow-200",
        icon: <FaMagnifyingGlass className="inline-block mr-1 -mt-0.5" size={15} />,
      }
    case "interview scheduled":
      return {
        label: "In Progress",
        bg: "bg-blue-100",
        text: "text-blue-700",
        border: "border-blue-200",
        icon: <RiProgress6Fill className="inline-block mr-1 -mt-0.5" size={16} />,
      }
    case "hired":
      return {
        label: "Hired",
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-200",
        icon: <HiRocketLaunch className="inline-block mr-1 -mt-0.5" size={16} />,
      }
    case "rejected":
      return {
        label: "",
        bg: "",
        text: "",
        border: "",
        icon: null,
      }
    default:
      return {
        label: status.charAt(0).toUpperCase() + status.slice(1),
        bg: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-200",
        icon: null,
      }
  }
}

function StatusBadge({ status }: { status: string }) {
  const display = getStatusDisplay(status)
  if (!display.label) return null
  let tooltip = "Indicates the highest progress reached in the application process."
  if (display.label === "Not Applied") {
    tooltip = "This student hasn't applied for any jobs yet."
  } else if (display.label === "Seeking Jobs") {
    tooltip = "This student has applied for some jobs and is awaiting updates."
  } else if (display.label === "In Progress") {
    tooltip = "This student has an application currently in progress."
  } else if (display.label === "Hired") {
    tooltip = "This student has been hired for an OJT placement."
  } else if (display.label === "Rejected") {
    tooltip = "This student's application was not successful."
  }
  return (
    <Tooltip title={tooltip} arrow>
      <span>
        <UIBadge
          variant="outline"
          className={`${display.bg} ${display.text} ${display.border} flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold`}
        >
          {display.icon}
          {display.label}
        </UIBadge>
      </span>
    </Tooltip>
  )
}

function formatTimelineDate(dateString: string) {
  if (!dateString) return ""
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  const month = monthNames[date.getMonth()]
  const day = date.getDate().toString().padStart(2, '0')
  const year = date.getFullYear()
  let hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? "PM" : "AM"
  hours = hours % 12
  if (hours === 0) hours = 12
  return `${month} ${day} ${year}, ${hours}:${minutes} ${ampm}`
}

function getTimelineIcon(type: string) {
  switch (type?.toLowerCase()) {
    case "new":
    case "applied":
    case "applied-for":
      return <MdMarkEmailRead className="h-4 w-4 text-yellow-500" />
    case "shortlisted":
      return <FaStar className="h-4 w-4 text-cyan-500" />
    case "interview scheduled":
    case "interview":
      return <MdEditCalendar className="h-4 w-4 text-purple-500" />
    case "waitlisted":
      return <LiaBusinessTimeSolid className="h-4 w-4 text-blue-500" />
    case "hired":
      return <RiCheckboxCircleFill className="h-4 w-4 text-green-500" />
    case "rejected":
      return <AiFillCloseCircle className="h-4 w-4 text-red-500" />
    default:
      return <CheckCircle className="h-4 w-4 text-gray-400" />
  }
}

function getTimelineDescription(item: TimelineItem) {
  let position = ""
  if (item.job_title && item.job_title.trim() !== "") {
    position = `for the position ${item.job_title}`
  } else if (item.position && item.position.trim() !== "") {
    position = `for the position ${item.position}`
  }
  if (!position && item.update) {
    const match = item.update.match(/for the position ([^.]*)/i)
    if (match && match[1]) {
      position = `for the position ${match[1]}`
    }
  }
  switch (item.type?.toLowerCase()) {
    case "new":
      return `Application submitted ${position}.`
    case "applied-for":
      return `Application submitted ${position}.`
    case "shortlisted":
      return `Shortlisted ${position}.`
    case "waitlisted":
      return `Placed on the waitlist ${position}.`
    case "interview scheduled":
    case "interview":
      return `Interview scheduled ${position}.`
    case "hired":
      return `Hired ${position}.`
    case "rejected":
      return `Not selected ${position}.`
    case "completed":
      return `Internship completed ${position}.`
    default:
      return item.update || ""
  }
}

export default function StudentDetailsModalContent({
  student,
  onClose,
}: {
  student: StudentInfo
  onClose: () => void
}) {
  const [tab, setTab] = useState("info")
  const [, setAvatarUrl] = useState<string | null>(null)
  const [timeline, setTimeline] = useState<TimelineItem[]>([])
  const [timelineLoading, setTimelineLoading] = useState(false)
  const [timelineFilterOptions, setTimelineFilterOptions] = useState<{ value: string, label: string }[]>([])
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [selectedPositions, setSelectedPositions] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [ojtApplications, setOjtApplications] = useState<OJTApplication[]>([])

  useEffect(() => {
    async function fetchAvatar() {
      if (student.profile_img) {
        const res = await fetch("/api/students/get-signed-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bucket: "user.avatars",
            path: student.profile_img,
          }),
        })
        const data = await res.json()
        if (data.signedUrl) setAvatarUrl(data.signedUrl)
        else setAvatarUrl(null)
      } else {
        setAvatarUrl(null)
      }
    }
    fetchAvatar()
  }, [student.profile_img])

  useEffect(() => {
    if (tab === "timeline" && student && student.student_id) {
      setTimelineLoading(true)
      fetch(`/api/superadmin/coordinators/fetchTimeline?student_id=${student.student_id}`)
        .then(res => res.json())
        .then(data => {
          setTimeline(Array.isArray(data) ? data : [])
          setTimelineLoading(false)
        })
        .catch(() => setTimelineLoading(false))
    }
  }, [tab, student.student_id])

  useEffect(() => {
    if (tab === "ojt" && student && student.student_id) {
      fetch(`/api/superadmin/coordinators/fetchOJTProgress?student_id=${student.student_id}`)
        .then(res => res.json())
        .then(data => {
          setOjtApplications(Array.isArray(data) ? data : [])
        })
        .catch(() => {
        })
    }
  }, [tab, student.student_id])

  useEffect(() => {
    if (tab === "timeline" && timeline.length > 0) {
      const positions = Array.from(new Set(timeline.map(item => item.position).filter(Boolean)))
      const statuses = Array.from(new Set(timeline.map(item => item.type).filter(Boolean)))
      setTimelineFilterOptions([
        { value: "all", label: "All activities" },
        ...positions.map(pos => ({ value: `position:${pos}`, label: pos })),
        ...statuses.map(st => ({ value: `status:${st}`, label: getStatusDisplay(st).label || st })),
      ])
    }
  }, [timeline, tab])

  const positionOptions = timelineFilterOptions.filter(opt => opt.value.startsWith("position:"))
  const statusOptions = timelineFilterOptions.filter(opt => opt.value.startsWith("status:"))

  let filteredTimeline = timeline
  if (selectedPositions.length > 0 || selectedStatuses.length > 0) {
    filteredTimeline = timeline.filter(item =>
      (selectedPositions.length === 0 || selectedPositions.includes(item.position)) ||
      (selectedStatuses.length === 0 || selectedStatuses.includes(item.type))
    )
  }

  function handlePositionToggle(pos: string) {
    setSelectedPositions(prev =>
      prev.includes(pos) ? prev.filter(p => p !== pos) : [...prev, pos]
    )
  }
  function handleStatusToggle(st: string) {
    setSelectedStatuses(prev =>
      prev.includes(st) ? prev.filter(s => s !== st) : [...prev, st]
    )
  }
  function clearFilters() {
    setSelectedPositions([])
    setSelectedStatuses([])
    setFilterModalOpen(false)
  }

  const ojtStudent: OJTStudent = {
    id: String(student.id ?? student.student_id ?? ""),
    name: student.name,
    email: student.email,
    isHired: (student.status?.toLowerCase() === "hired"),
    companyName:
      student.company ||
      ojtApplications.find(app => app.companyName || app.company_name)?.companyName ||
      ojtApplications.find(app => app.companyName || app.company_name)?.company_name ||
      "",
    applicationsSent: ojtApplications.length,
    applications: ojtApplications.map(app => ({
      id: String(app.id),
      companyName: app.companyName || app.company_name || "-",
      jobTitle: app.job_title || "-",
      status: app.status || "",
      dateApplied: app.applied_at || app.created_at || "",
      companyLogo: app.company_logo_image_path || "",
    })),
    course: student.course || ""
  }

  if (!student) return null
  return (
    <div className="grid gap-6 py-4 max-h-[70vh] w-full max-w-[800px] overflow-y-auto pr-4" style={{ scrollbarGutter: "stable" }}>
      <DialogHeader>
        <VisuallyHidden>
          <DialogTitle>Student Details</DialogTitle>
        </VisuallyHidden>
      </DialogHeader>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4 w-full flex">

          <TabsTrigger value="ojt" className="flex-1">
            OJT Progress
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex-1">
            Full Timeline
          </TabsTrigger>
          <TabsTrigger value="status" className="flex-1">
            Status Breakdown
          </TabsTrigger>
        </TabsList>
 
        <TabsContent value="ojt">
          <div className="mt-6">
            {tab === "ojt" && ojtApplications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-40 h-40 mb-4 flex items-center justify-center">
                  <Lottie
                    animationData={ojtTrackAnimation}
                    loop
                    autoplay
                    style={{ width: 160, height: 160 }}
                  />
                </div>
                <span className="mt-2 text-blue-700 font-semibold text-lg animate-pulse">
                  Fetching OJT Progress...
                </span>
              </div>
            ) : (
              <OJTProgressTab student={ojtStudent} />
            )}
          </div>
        </TabsContent>
        <TabsContent value="timeline">
          <h4 className="font-medium mb-2">Student Progress Timeline</h4>
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-full border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 shadow hover:scale-105 transition-transform"
              onClick={() => setFilterModalOpen(true)}
              asChild={false}
            >
              <motion.span
                initial={{ rotate: -10, scale: 1 }}
                animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="inline-block"
              >
                <Sparkles className="h-5 w-5 text-blue-400" />
              </motion.span>
              Filter Timeline
            </Button>
            <Dialog open={filterModalOpen} onOpenChange={setFilterModalOpen}>
              <DialogContent className="max-w-md w-full rounded-2xl shadow-2xl border-2 border-blue-200 bg-gradient-to-br from-white via-blue-50 to-purple-50">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-blue-700">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    Timeline Filters
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-2">
                  <Button
                    variant={selectedPositions.length === 0 && selectedStatuses.length === 0 ? "default" : "outline"}
                    className="w-full rounded-xl"
                    onClick={clearFilters}
                  >
                    All activities
                  </Button>
                  <div>
                    <div className="font-semibold text-blue-700 mb-1">By Job Position</div>
                    <div className="flex flex-col gap-2 max-h-32 overflow-auto">
                      {positionOptions.map(opt => (
                        <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={selectedPositions.includes(opt.label)}
                            onCheckedChange={() => handlePositionToggle(opt.label)}
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-700 mb-1">By Status</div>
                    <div className="flex flex-col gap-2 max-h-32 overflow-auto">
                      {statusOptions.map(opt => (
                        <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={selectedStatuses.includes(opt.value.replace("status:", ""))}
                            onCheckedChange={() => handleStatusToggle(opt.value.replace("status:", ""))}
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" className="w-full" onClick={() => setFilterModalOpen(false)}>
                    Done
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <motion.div
              initial={{ scale: 0.95, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-xs text-blue-400 font-semibold"
            >
              {(selectedPositions.length === 0 && selectedStatuses.length === 0)
                ? "All activities"
                : [
                    ...selectedPositions.map(p => `Job: ${p}`),
                    ...selectedStatuses.map(s => `Status: ${getStatusDisplay(s).label || s}`)
                  ].join(", ")
              }
            </motion.div>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            {timelineLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground py-8">
                <Loader2 className="animate-spin h-5 w-5" />
                Loading timeline...
              </div>
            ) : filteredTimeline.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No timeline activity yet</div>
            ) : (
              filteredTimeline.map((item, idx) => (
                <div key={item.time + idx} className="relative pl-12 pb-8">
                  <div className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center bg-white border" style={{
                    backgroundColor:
                      item.type?.toLowerCase() === "new" || item.type?.toLowerCase() === "applied" || item.type?.toLowerCase() === "applied-for"
                        ? "#FEF9C3"
                        : item.type?.toLowerCase() === "shortlisted"
                        ? "#CFFAFE"
                        : item.type?.toLowerCase() === "interview"
                        ? "#EDE9FE"
                        : item.type?.toLowerCase() === "waitlisted"
                        ? "#DBEAFE"
                        : item.type?.toLowerCase() === "hired"
                        ? "#DCFCE7"
                        : item.type?.toLowerCase() === "rejected"
                        ? "#FECACA"
                        : "#F3F4F6"
                  }}>
                    {getTimelineIcon(item.type)}
                  </div>
                  <div className={`border rounded-lg p-3 ${idx === 0 ? "border-blue-300 bg-blue-50" : "border-gray-200"}`}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{item.update}</span>
                      {idx === 0 && (
                        <Tooltip title="Student's newest activity" arrow>
                          <UIBadge className="bg-green-500 text-white ml-2 px-2 py-0.5 rounded-full text-xs font-semibold">
                            Latest
                          </UIBadge>
                        </Tooltip>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{formatTimelineDate(item.time)}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {getTimelineDescription(item)}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div className="relative pl-12 pb-4">
              <div className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200">
                <TbBulb className="h-4 w-4 text-gray-500" />
              </div>
              <div className="text-sm text-gray-600">
                <strong>Coordinator Guidance:</strong> <br />
                <em>
                  Review the student&apos;s progress and activity logs above. Use this timeline to monitor application milestones, follow up with employers, and provide timely support to help the student succeed in their placement journey.
                </em>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="status">
          <h4 className="font-medium mb-2">Status Breakdown</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <StatusBadge status="new" />
              <span>Not Applied</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status="shortlisted" />
              <span>Seeking Jobs</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status="interview" />
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status="hired" />
              <span>Hired</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status="rejected" />
              <span>Rejected</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Message Employer
        </Button>
      </DialogFooter>
    </div>
  )
}
