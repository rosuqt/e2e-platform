/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

import { AiOutlineBell } from "react-icons/ai";
import { useSession } from "next-auth/react";
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
} from "lucide-react";

function getNotificationContent(notification: any) {
  const type = notification.type?.toLowerCase() || "default";
  const name =
    notification.student
      ? `${notification.student.first_name ?? ""} ${notification.student.last_name ?? ""}`.trim()
      : notification.applicant_name || "";
  const jobTitle = notification.job_title || "";

  switch (type) {
    case "new":
    case "applications":
      return {
        title: `New Applicant: ${name}`,
        description: `${name} has applied for ${jobTitle}. Check out their application!`,
      };
    case "shortlisted":
      return {
        title: `Applicant Shortlisted: ${name}`,
        description: `${name} has been shortlisted for ${jobTitle}. Consider scheduling an interview!`,
      };
    case "interview":
      return {
        title: `Interview Scheduled: ${name}`,
        description: `${name} has been scheduled for an interview for ${jobTitle}. Get ready to meet them!`,
      };
    case "waitlisted":
      return {
        title: `Interview Completed: ${name}`,
        description: `${name} has completed their interview for ${jobTitle}. You can send an offer now!`,
      };
    case "offer_updated":
      return {
        title: `Offer Updated: ${name}`,
        description: `The offer for ${name} has been updated for ${jobTitle}. Check the latest details!`,
      };
    case "offer sent":
    case "job_offers":
      return {
        title: `Offer Sent: ${name}`,
        description: `An offer has been sent to ${name} for ${jobTitle}. Awaiting their response.`,
      };
    case "hired":
      return {
        title: `Applicant Hired: ${name}`,
        description: `${name} has been successfully hired for ${jobTitle}. Congratulations!`,
      };
    case "rejected":
      return {
        title: `Applicant Rejected: ${name}`,
        description: `${name} has been rejected for ${jobTitle}. You can move to the next candidate.`,
      };
    case "event_reminder":
      return {
        title: `Interview Tomorrow: ${name}`,
        description: notification.content,
      };
    case "event_today":
      return {
        title: `Interview Today: ${name}`,
        description: notification.content,
      };
    default:
      return {
        title: notification.title,
        description: notification.content,
      };
  }
}

interface NotificationsModalProps {
  notifications: {
  company_name: string;
  content: string;
  created_at: Date;
  external_id: string;
  source: string;
  title: string;
  updated_at: Date;
  user_id: string}[];
  onClose: () => void;
  positionRef: React.RefObject<HTMLAnchorElement | null>;
}

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
};

export function NotificationsModal({ notifications, onClose, positionRef }: NotificationsModalProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // --- Begin: Fetch employer notifications if employer ---
  const [employerNotifs, setEmployerNotifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const role = (session?.user as { role?: string })?.role;
    if (role === "employer") {
      setLoading(true);
      fetch("/api/employers/notifications")
        .then(res => res.json())
        .then(data => {
          if (data?.notifications) setEmployerNotifs(data.notifications);
        })
        .finally(() => setLoading(false));
    }
  }, [session]);
  // --- End: Fetch employer notifications if employer ---

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setTimeout(onClose, 200);
  }, [onClose]);

  useEffect(() => {
    // Only close on actual outside mouse clicks, not on window blur/alt-tab
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleClose]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [handleClose]);

  useEffect(() => {
    if (positionRef.current) {
      const rect = positionRef.current.getBoundingClientRect();
      setPosition({ 
        top: rect.bottom + window.scrollY, 
        left: rect.left + window.scrollX + 50 
      });
    }
  }, [positionRef]);

  const handleViewAllClick = () => {
    const role = (session?.user as { role?: string })?.role;
    const path =
      role === "employer"
        ? "/employers/notifications"
        : "/students/notifications";
    router.push(path);
    onClose();
  };

  // Use employerNotifs if employer, otherwise use props.notifications
  const role = (session?.user as { role?: string })?.role;
  const notifList = role === "employer" ? employerNotifs : notifications;

  const topNotifications = [...notifList]
    .sort((a, b) => new Date(b.updated_at ?? b.created_at).getTime() - new Date(a.updated_at ?? a.created_at).getTime())
    .slice(0, 3);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute z-50"
          style={{ top: position.top, left: position.left }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg overflow-hidden w-80"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="p-4 border-b border-gray-100 flex items-center gap-2 mt-3">
              <AiOutlineBell className="text-blue-500" />
              <h3 className="text-lg font-medium text-blue-800">Notifications</h3>
            </div>

            <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
              {loading ? (
                <div className="text-center text-gray-400 py-8">
                  <AiOutlineBell className="mx-auto mb-2 text-3xl text-blue-200" />
                  <div>Loading...</div>
                </div>
              ) : topNotifications.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <AiOutlineBell className="mx-auto mb-2 text-3xl text-blue-200" />
                  <div>No notifications yet.</div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {topNotifications.map((notification, idx) => {
                    const { title } = getNotificationContent(notification);
                    const typeKey = notification.type?.toLowerCase() || "default";
                    const { icon, bg } = iconMap[typeKey] || iconMap["default"];
                    const dateStr = notification.updated_at ?? notification.created_at;
                    const formattedDate = dateStr
                      ? new Date(dateStr).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "";
                    return (
                      <div
                        key={notification.id ? `${notification.id}-${idx}` : idx}
                        className="relative flex flex-row items-start bg-blue-50/40 rounded-lg p-3 border border-blue-100"
                      >
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${bg}`}>
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0 ml-3 flex flex-col">
                          <h4 className="font-medium text-blue-800 text-sm mb-2">{title ?? notification.title ?? "Notification"}</h4>
                          <div className="flex-1" />
                          <div className="text-xs text-gray-500 self-end">{formattedDate}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100">
              <button
                className="w-full text-center text-blue-600 hover:underline"
                onClick={handleViewAllClick}
              >
                View All
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}