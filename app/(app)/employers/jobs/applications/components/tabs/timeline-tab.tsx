import React from "react"
import { Clock } from "lucide-react"
import { MdMarkEmailRead } from "react-icons/md"

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
            <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
              event.status.toLowerCase().replace(/\s/g, "") === "offersent"
                ? "bg-green-600"
                : event.iconBg
            }`}>
              {event.status.toLowerCase().replace(/\s/g, "") === "offersent"
                ? <MdMarkEmailRead  className="h-5 w-5 text-white" />
                : event.icon}
            </div>
            <div className={`border rounded-lg p-3 ${event.current ? "border-purple-300 bg-purple-50" : "border-gray-200"}`}>
              <div className="font-medium text-sm" style={
                event.status.toLowerCase().replace(/\s/g, "") === "offersent"
                  ? { color: "#16a34a" }
                  : undefined
              }>
                {event.status}
              </div>
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
              🎉 Take a moment to review this candidate’s resume. If you like what you see, move them forward and make their day!
            </em>
          )}
          {status === "shortlisted" && (
            <em>
              🚀 Ready to connect? Invite this awesome candidate to an interview and start a great conversation!
            </em>
          )}
          {status === "interview" && (
            <em>
              💬 Time to shine! Conduct the interview and discover what makes this candidate special. Don’t forget to share your feedback!
            </em>
          )}
          {status === "invited" && (
            <em>
              ⏰ Waiting for a response! Give the candidate a little time to confirm their interview slot. Exciting times ahead!
            </em>
          )}
          {status === "waitlisted" && (
            <em>
              🌱 Keep an eye out! This candidate is on your radar for future opportunities. Stay in touch and keep them engaged!
            </em>
          )}
          {status === "offersent" && (
            <em>
              🟢 Offer sent! Awaiting candidate&apos;s response to your job offer.
            </em>
          )}
          {status === "hired" && (
            <em>
              🎊 Congratulations! Welcome your new team member and help them settle in for an amazing journey together!
            </em>
          )}
          {status === "rejected" && (
            <em>
              🙏 Thank you for considering this candidate. No further action needed, but a kind note can go a long way!
            </em>
          )}
        </div>
      </div>
    </div>
  )
}
