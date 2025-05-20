"use client"

import { BriefcaseIcon } from "lucide-react"

interface Notification {
  id: number
  title: string
  description: string
  time: string
  read: boolean
}

interface NotificationItemProps {
  notification: Notification
  onClick: () => void
}

export default function NotificationItem({ notification, onClick }: NotificationItemProps) {
  return (
    <div
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
        <BriefcaseIcon className="h-5 w-5 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-blue-800">{notification.title}</h4>
        <p className="text-sm text-gray-600 mt-0.5">{notification.description}</p>
      </div>
      <div className="text-xs text-gray-500 whitespace-nowrap">{notification.time}</div>
    </div>
  )
}
