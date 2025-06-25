import React from "react"
import { Clock } from "lucide-react"

type TimelineEvent = {
  status: string
  date: string
  icon: React.JSX.Element
  iconBg: string
  message: string
  current?: boolean
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

export default function TimelineTab({
  timeline,
  status
}: {
  timeline: TimelineEvent[]
  status: string
}) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      {timeline.length === 0 ? (
        <div className="text-center text-gray-400 py-8">No timeline activity yet</div>
      ) : (
        timeline.map((event, index) => (
          <div key={index} className="relative pl-12 pb-8">
            <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${event.iconBg}`}>
              {event.icon}
            </div>
            <div className={`border rounded-lg p-3 ${event.current ? "border-blue-300 bg-blue-50" : "border-gray-200"}`}>
              <div className="font-medium text-sm">{event.status}</div>
              <div className="text-xs text-gray-500 mt-1">{formatTimelineDate(event.date)}</div>
              <div className="text-xs text-gray-400 mt-1">{event.message}</div>
            </div>
          </div>
        ))
      )}
      <div className="relative pl-12 pb-4">
        <div className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200">
          <Clock className="h-4 w-4 text-gray-500" />
        </div>
        <div className="text-sm text-gray-600">
          <strong>Next Steps:</strong> <br />
          {status === "new" && (
            <em>
              🕒 Your application has been submitted! Keep an eye on your email for updates from the employer.
            </em>
          )}
          {status === "shortlisted" && (
            <em>
              🎉 You’ve been shortlisted! Prepare for possible interviews and review the job requirements.
            </em>
          )}
          {status === "interview scheduled" && (
            <em>
              💬 Interview scheduled! Check your email for details and get ready to impress.
            </em>
          )}
          {status === "waitlisted" && (
            <em>
              ⏳ You’re on the waitlist. Stay positive and keep applying to other opportunities!
            </em>
          )}
          {status === "hired" && (
            <em>
              🎊 Congratulations! You’ve been hired. The employer will contact you with next steps.
            </em>
          )}
          {status === "rejected" && (
            <em>
              🙏 Thank you for applying. Don’t be discouraged—keep applying and improving!
            </em>
          )}
        </div>
      </div>
    </div>
  )
}
