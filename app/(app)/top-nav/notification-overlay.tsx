"use client"

import { X, BriefcaseIcon, Calendar,  Building } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

interface Notification {
  company_name: string;
  content: string;
  created_at: Date;
  external_id: string;
  source: string;
  title: string;
  updated_at: Date;
  user_id: string;
}

interface NotificationOverlayProps {
  notification: Notification
  onClose: () => void
}

export default function NotificationOverlay({ notification, onClose }: NotificationOverlayProps) {
  const router = useRouter()
  const { data: session } = useSession()

  const handleViewApplication = () => {
    const role = session?.user?.role
    if (role === "employer") {
      router.push("/employers/notifications")
    } else {
      router.push("/students/notifications") 
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[1050] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-blue-50 border-b border-blue-100">
          <h3 className="text-lg font-semibold text-blue-800">Notification Details</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-blue-100 transition-colors">
            <X className="h-5 w-5 text-blue-700" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <BriefcaseIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-lg text-blue-800">{notification.title}</h4>
              <p className="text-sm text-gray-500">{new Date(notification.updated_at).toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-700">{notification.content}</p>

            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <h5 className="font-medium text-blue-800">Job Details</h5>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-700">{notification.company_name}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-700">{new Date(notification.updated_at).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3 justify-end">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
              Dismiss
            </button>
            <button
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={handleViewApplication}
            >
              View Application
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}