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
  default: {
    icon: <FileText className="h-5 w-5 text-white" />,
    bg: "bg-gray-400",
  },
}

interface Notification {
  id: string;
  content: string;
  title: string;
  created_at: string;
  updated_at?: string;
  user_id: string;
  type?: string;
  student?: {
    first_name?: string;
    last_name?: string;
    course?: string;
    year?: string;
    section?: string;
  };
  job_title?: string;
  applicant_name?: string;
}

interface NotificationItemProps {
  notification: Notification
  onClick: () => void
}

function getNotificationContent(notification: Notification) {
  const type = notification.type?.toLowerCase() || "default"
  const name =
    notification.student
      ? `${notification.student.first_name ?? ""} ${notification.student.last_name ?? ""}`.trim()
      : notification.applicant_name || ""
  const jobTitle = notification.job_title || ""

  switch (type) {
    case "new":
    case "applications":
      return {
        title: `
         Applicant: ${name}`,
        description: `${name} has applied for ${jobTitle}. Check out their application!`,
      }
    case "shortlisted":
      return {
        title: `Applicant Shortlisted: ${name}`,
        description: `${name} has been shortlisted for ${jobTitle}. Consider scheduling an interview!`,
      }
    case "interview":
      return {
        title: `Interview Scheduled: ${name}`,
        description: `${name} has been scheduled for an interview for ${jobTitle}. Get ready to meet them!`,
      }
    case "waitlisted":
      return {
        title: `Interview Completed: ${name}`,
        description: `${name} has completed their interview for ${jobTitle}. You can send an offer now!`,
      }
    case "offer_updated":
      return {
        title: `Offer Updated: ${name}`,
        description: `The offer for ${name} has been updated for ${jobTitle}. Check the latest details!`,
      }
    case "offer sent":
    case "job_offers":
      return {
        title: `Offer Sent: ${name}`,
        description: `An offer has been sent to ${name} for ${jobTitle}. Awaiting their response.`,
      }
    case "hired":
      return {
        title: `Applicant Hired: ${name}`,
        description: `${name} has been successfully hired for ${jobTitle}. Congratulations!`,
      }
    case "rejected":
      return {
        title: `Applicant Rejected: ${name}`,
        description: `${name} has been rejected for ${jobTitle}. You can move to the next candidate.`,
      }
    case "offer_rejected":
      return {
        title: `Offer Rejected: ${name}`,
        description: `${name} has rejected the job offer for ${jobTitle}.`,
      }
    case "withdrawn":
      return {
        title: `Application Withdrawn: ${name}`,
        description: `${name} has withdrawn their application for ${jobTitle}.`,
      }
    case "event_reminder":
      return {
        title: `Interview Tomorrow: ${name}`,
        description: notification.content,
      }
    case "event_today":
      return {
        title: `Interview Today: ${name}`,
        description: notification.content,
      }
    default:
      return {
        title: notification.title,
        description: notification.content,
      }
  }
}

export default function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const typeKey = notification.type?.toLowerCase() || "default"
  const { icon, bg } = iconMap[typeKey] || iconMap["default"]
  const { title, description } = getNotificationContent(notification)

  return (
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
      </div>
      <div className="text-xs text-gray-500 whitespace-nowrap">
        {new Date(notification.updated_at ?? notification.created_at).toLocaleString(undefined, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </div>
    </div>
  )
}