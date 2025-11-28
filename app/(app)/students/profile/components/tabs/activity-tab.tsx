"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ChevronDown,
  Mail,
  Star,
  XCircle,
  Frown,
  ThumbsUp,
  Clock,
  Calendar,
  Pencil,
  Gift,
  Send,
  FileText,
} from "lucide-react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

type ActivityType =
  | "shortlisted"
  | "withdrawn"
  | "new"
  | "student_rating"
  | "waitlisted"
  | "interview"
  | "offer_updated"
  | "hired"
  | "offer sent"
  | "rejected"
  | "event_posted"
  | string

interface Activity {
  application_id: string
  created_at: string
  position?: string
  type?: ActivityType
  update?: string
}

const iconMap: Record<string, { icon: React.ReactNode; bg: string }> = {
  shortlisted: {
    icon: <Star className="h-5 w-5 text-white" />,
    bg: "bg-yellow-500",
  },
  withdrawn: {
    icon: <XCircle className="h-5 w-5 text-white" />,
    bg: "bg-red-500",
  },
  new: {
    icon: <Mail className="h-5 w-5 text-white" />,
    bg: "bg-blue-500",
  },
  student_rating: {
    icon: <ThumbsUp className="h-5 w-5 text-white" />,
    bg: "bg-green-500",
  },
  waitlisted: {
    icon: <Clock className="h-5 w-5 text-white" />,
    bg: "bg-orange-500",
  },
  interview: {
    icon: <Calendar className="h-5 w-5 text-white" />,
    bg: "bg-purple-500",
  },
  offer_updated: {
    icon: <Pencil className="h-5 w-5 text-white" />,
    bg: "bg-indigo-500",
  },
  hired: {
    icon: <Gift className="h-5 w-5 text-white" />,
    bg: "bg-green-600",
  },
  "offer sent": {
    icon: <Send className="h-5 w-5 text-white" />,
    bg: "bg-cyan-500",
  },
  rejected: {
    icon: <Frown className="h-5 w-5 text-white" />,
    bg: "bg-gray-500",
  },
  event_posted: {
    icon: <Calendar className="h-5 w-5 text-white" />,
    bg: "bg-teal-500",
  },
  default: {
    icon: <FileText className="h-5 w-5 text-white" />,
    bg: "bg-gray-400",
  },
}

function groupByDate(activities: Activity[]) {
  const groups: { [date: string]: Activity[] } = {}
  activities.forEach((a) => {
    const date = new Date(a.created_at)
    const dateStr = date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
    if (!groups[dateStr]) groups[dateStr] = []
    groups[dateStr].push(a)
  })
  return groups
}

export default function ActivityLogPage() {
  const [activity, setActivity] = useState<Activity[]>([])
  const { data: session } = useSession()
  const studentId = session?.user?.studentId
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [typeFilters, setTypeFilters] = useState<string[]>([])

  useEffect(() => {
    if (!studentId) return
    setLoading(true)
    fetch(`/api/employers/applications/activity?student_id=${studentId}`)
      .then((res) => res.json())
      .then((data) => setActivity(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [studentId])

  function getActivityContent(activity: Activity) {
    const jobTitle = activity.position || ""
    switch (activity.type?.toLowerCase()) {
      case "shortlisted":
        return {
          title: "You have been shortlisted for your Application.",
          description: `You made it to the shortlist for ${jobTitle} — way to go!`,
        }
      case "withdrawn":
        return {
          title: `You have withdrawn your application for ${jobTitle}.`,
          description: "Sad to see you go! Don’t worry, there are plenty more opportunities waiting..",
        }
      case "new":
        return {
          title: `You just applied for ${jobTitle}!`,
          description: "Nice work! You’ve successfully applied — a great step forward toward your next opportunity.",
        }
      case "student_rating":
        return {
          title: `You've succesfully rated ${jobTitle}!`,
          description: "Thanks for taking the time to rate! Your voice helps make the hiring process better for everyone..",
        }
      case "waitlisted":
        return {
          title: `Your Interview for ${jobTitle} has been completed`,
          description: "Well done on finishing your interview! Fingers crossed for what’s next.",
        }
      case "interview":
        return {
          title: `An interview for ${jobTitle} has been scheduled`,
          description: "Awesome news — your interview’s been scheduled! Take a moment to prepare and get ready to impress..",
        }
      case "offer_updated":
        return {
          title: `Your job offer for ${jobTitle} has been modified`,
          description: "Good news — there’s an update to your job offer. Check the details to see what’s new!",
        }
      case "hired":
        return {
          title: "You got the job! 🎉",
          description: "Congratulations — you’ve been officially hired! Get ready to start an exciting new chapter in your career..",
        }
      case "offer sent":
        return {
          title: "You’ve received a job offer!",
          description: "Amazing news — an employer has sent you an offer! Review the details and take the next step toward your new role.",
        }
      case "rejected":
        return {
          title: "Oh no! your application wasn’t selected",
          description: "We’re sorry to share that you weren’t chosen for this role. Don’t lose heart — keep going, your next opportunity is just around the corner.",
        }
      case "event_posted":
        return {
          title: "Event added to your calendar.",
          description: "Awesome — your event’s been saved to your calendar. We’ll keep it right where it belongs!",
        }
      default:
        return {
          title: activity.update,
          description: activity.position,
        }
    }
  }

  const allTypes: ActivityType[] = [
    "shortlisted",
    "withdrawn",
    "new",
    "student_rating",
    "waitlisted",
    "interview",
    "offer_updated",
    "hired",
    "offer sent",
    "rejected",
    "event_posted",
  ]

  const filteredActivity = activity.filter((a) => {
    if (typeFilters.length && (!a.type || !typeFilters.includes(a.type.toLowerCase()))) return false
    if (!search.trim()) return true
    const { title, description } = getActivityContent(a)
    const term = search.toLowerCase()
    return (
      (title && title.toLowerCase().includes(term)) ||
      (description && description.toLowerCase().includes(term)) ||
      (a.position && a.position.toLowerCase().includes(term))
    )
  })

  const grouped = groupByDate(filteredActivity)
  const todayStr = new Date().toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
  const dateKeys = Object.keys(grouped)
  dateKeys.sort((a, b) =>
    sortOrder === "newest"
      ? new Date(b).getTime() - new Date(a).getTime()
      : new Date(a).getTime() - new Date(b).getTime()
  )

  const [expandedDates, setExpandedDates] = useState<{ [date: string]: boolean }>({})

  React.useEffect(() => {
    const initial: { [date: string]: boolean } = {}
    dateKeys.forEach((date) => {
      initial[date] = date === todayStr
    })
    const isDifferent =
      Object.keys(initial).length !== Object.keys(expandedDates).length ||
      Object.keys(initial).some((key) => initial[key] !== expandedDates[key])
    if (isDifferent) {
      setExpandedDates(initial)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKeys.join(","), todayStr])

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="pb-4">
        <h2 className="text-2xl font-bold">Activity Log</h2>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as "newest" | "oldest")}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-sm flex items-center gap-1">
                  Filters
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filter Activities</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  {allTypes.map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={typeFilters.includes(type)}
                        onCheckedChange={(checked) => {
                          setTypeFilters((f) =>
                            checked ? [...f, type] : f.filter((t) => t !== type)
                          )
                        }}
                      />
                      <span className="capitalize">{type.replace("_", " ")}</span>
                    </label>
                  ))}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setTypeFilters([])}>
                    Clear
                  </Button>
                  <Button onClick={() => setFilterOpen(false)}>Apply</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="relative w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="search"
              className="pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
              placeholder="Search activities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-10">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-8 ml-6">
                <div className="relative rounded-xl px-4 py-4">
                  <div className="flex items-center gap-5">
                    <div className="rounded-full bg-gray-200 animate-pulse w-[44px] h-[44px]" />
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                    <div className="flex-1">
                      <div className="h-5 w-2/3 bg-gray-200 rounded mb-2 animate-pulse" />
                      <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            dateKeys.map((date) => (
              <div key={date}>
                <div
                  className="flex items-center gap-2 mb-6 cursor-pointer"
                  onClick={() => setExpandedDates((prev) => ({ ...prev, [date]: !prev[date] }))}
                >
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                    <ChevronDown
                      className={`h-4 w-4 text-gray-500 transform transition-transform ${
                        expandedDates[date] ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <h3 className="font-semibold text-lg">{date === todayStr ? "Today" : date}</h3>
                </div>
                {expandedDates[date] && (
                  <div className="space-y-8 ml-6">
                    {grouped[date].map((activity, idx) => {
                      const { title, description } = getActivityContent(activity)
                      const typeKey = activity.type?.toLowerCase() || "default"
                      const { icon, bg } = iconMap[typeKey] || iconMap["default"]
                      return (
                        <div
                          key={activity.application_id + activity.created_at + idx}
                          className="relative transition-colors rounded-xl hover:bg-blue-50 px-4 py-4"
                        >
                          <div className="flex items-center gap-5">
                            <div className={`flex items-center justify-center rounded-full ${bg}`} style={{ width: 44, height: 44 }}>
                              {icon}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(activity.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium">{title}</h4>
                              </div>
                              <p className="text-sm text-gray-600">{description}</p>
                            </div>
                          </div>
                          {idx !== grouped[date].length - 1 && (
                            <div className="absolute left-4 top-8 bottom-0 w-px bg-gray-200 -ml-px"></div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
