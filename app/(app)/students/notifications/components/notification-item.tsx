/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {
  BriefcaseIcon,
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
import { useState } from "react"
import { Button } from "@/components/ui/button"
import StudentInvitationPreview from "../../jobs/invitations/component/interview-preview-student"

const iconMap: Record<string, { icon: React.ReactNode; bg: string }> = {
  new: {
    icon: <Mail className="h-5 w-5 text-white" />,
    bg: "bg-yellow-400",
  },
  applications: {
    icon: <Mail className="h-5 w-5 text-white" />,
    bg: "bg-blue-500",
  },
  shortlisted: {
    icon: <Star className="h-5 w-5 text-white" />,
    bg: "bg-yellow-500",
  },
  withdrawn: {
    icon: <XCircle className="h-5 w-5 text-white" />,
    bg: "bg-red-500",
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
  job_offers: {
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
  job_team_access: {
    icon: <BriefcaseIcon className="h-5 w-5 text-white" />,
    bg: "bg-blue-400",
  },
  event_reminder: {
    icon: <Calendar className="h-5 w-5 text-white" />,
    bg: "bg-purple-400",
  },
  event_today: {
    icon: <Calendar className="h-5 w-5 text-white" />,
    bg: "bg-pink-500",
  },
  invite_sent: {
    icon: <Mail className="h-5 w-5 text-white" />,
    bg: "bg-blue-600",
  },
  default: {
    icon: <FileText className="h-5 w-5 text-white" />,
    bg: "bg-gray-400",
  },
}

interface Notif {
  company_name: string;
  content: string;
  created_at: Date;
  external_id?: string;
  source: string;
  title: string;
  updated_at: Date;
  user_id: string;
  type?: string;
  job_title: string;
}

interface NotificationItemProps {
  notif: Notif
  onClick: () => void
}

function getNotificationContent(notif: Notif) {
  const type = notif.type?.toLowerCase() || notif.source?.toLowerCase() || "default"
  const jobTitle = notif.job_title || ""
  switch (type) {
    case "applications":
    case "new":
      return {
        title: `You applied for ${jobTitle}`,
        description: `Your application for ${jobTitle} was submitted.`,
      }
    case "shortlisted":
      return {
        title: `Shortlisted for ${jobTitle}`,
        description: `You have been shortlisted for ${jobTitle}.`,
      }
    case "interview":
      return {
        title: `Interview Scheduled for ${jobTitle}`,
        description: `An interview for ${jobTitle} has been scheduled.`,
      }
    case "waitlisted":
      return {
        title: `Interview Completed for ${jobTitle}`,
        description: `You completed your interview for ${jobTitle}.`,
      }
    case "offer_updated":
      return {
        title: `Offer Updated for ${jobTitle}`,
        description: `Your offer for ${jobTitle} has been updated.`,
      }
    case "job_offers":
    case "offer sent":
      return {
        title: `Job Offer for ${jobTitle}`,
        description: `You received a job offer for ${jobTitle}.`,
      }
    case "hired":
      return {
        title: `Hired for ${jobTitle}`,
        description: `Congratulations! You have been hired for ${jobTitle}.`,
      }
    case "rejected":
      return {
        title: `Application Rejected for ${jobTitle}`,
        description: `Your application for ${jobTitle} was not successful.`,
      }
    case "offer_rejected":
      return {
        title: `Offer Rejected for ${jobTitle}`,
        description: `You have rejected the job offer for ${jobTitle}.`,
      }
    case "withdrawn":
      return {
        title: `You Withdrew Application for ${jobTitle}`,
        description: `You have withdrawn your application for ${jobTitle}.`,
      }
    case "event_reminder":
      return {
        title: `Interview Tomorrow`,
        description: notif.content,
      }
    case "event_today":
      return {
        title: `Interview Today`,
        description: notif.content,
      }
    case "invite_sent":
      return {
        title: `You've been invited for ${jobTitle}`,
        description: `You received a job interview invitation for ${jobTitle}.`,
      }
    default:
      return {
        title: notif.title,
        description: notif.content,
      }
  }
}

export default function NotificationItem({ notif, onClick }: NotificationItemProps) {
  const typeKey = notif.type?.toLowerCase() || notif.source?.toLowerCase() || "default"
  const { icon, bg } = iconMap[typeKey] || iconMap["default"]
  const { title, description } = getNotificationContent(notif)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteData, setInviteData] = useState<any>(null)
  const [loadingInvite, setLoadingInvite] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)

  // Extract invitation id (assume external_id or notif.invitation_id)
  const invitationId = (notif as any).invitation_id || (notif as any).external_id || (notif as any).id

  async function handleViewMore(e: React.MouseEvent) {
    e.stopPropagation()
    setShowInviteModal(true)
    setLoadingInvite(true)
    setInviteError(null)
    try {
      const res = await fetch(`/api/students/invitations?invitation_id=${invitationId}`)
      const json = await res.json()
      if (json.invitation) {
        setInviteData(json.invitation)
      } else {
        setInviteError(json.error || "Failed to load invitation details")
      }
    } catch (err: any) {
      setInviteError(err.message || "Failed to load invitation details")
    } finally {
      setLoadingInvite(false)
    }
  }

  return (
    <>
      <div
        className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
        onClick={onClick}
      >
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${bg}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-blue-800">{title}</h4>
          <p className="text-sm text-gray-600 mt-0.5">{description}</p>
          {typeKey === "invite_sent" && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={handleViewMore}
              disabled={loadingInvite}
            >
              {loadingInvite ? "Loading..." : "View More"}
            </Button>
          )}
        </div>
        <div className="text-xs text-gray-500 whitespace-nowrap">
          {notif.updated_at
            ? notif.updated_at.toLocaleString(undefined, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : notif.created_at.toLocaleString(undefined, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
        </div>
      </div>
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => {
                setShowInviteModal(false)
                setInviteData(null)
                setInviteError(null)
              }}
              aria-label="Close"
            >
              ×
            </button>
            {loadingInvite && (
              <div className="text-center py-8 text-gray-500">Loading invitation...</div>
            )}
            {inviteError && (
              <div className="text-center py-8 text-red-500">{inviteError}</div>
            )}
            {inviteData && (
              <StudentInvitationPreview
                invitationId={inviteData.id}
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}