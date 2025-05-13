"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, Mail, User, Bookmark, FileText } from "lucide-react"

export default function ActivityLogPage() {
  const [isTodayExpanded, setIsTodayExpanded] = useState(true)
  const [isPastDateExpanded, setIsPastDateExpanded] = useState(true)

  const today = [
    {
      id: 1,
      time: "12 mins ago",
      icon: <Mail className="h-4 w-4 text-white" />,
      iconBg: "bg-blue-500",
      title: "You applied for a job",
      description: "Applied for UI/UX Designer at Kemly Inc.",
      hasView: true,
    },
    {
      id: 2,
      time: "8 hours ago",
      icon: <User className="h-4 w-4 text-white" />,
      iconBg: "bg-purple-500",
      title: "Followed John Doe (Recruiter at Google)",
      description: "You started following John Doe.",
      hasView: true,
    },
    {
      id: 3,
      time: "9:20 am",
      icon: <Bookmark className="h-4 w-4 text-white" />,
      iconBg: "bg-blue-500",
      title: "Saved Data Analyst Intern at Microsoft",
      description: "You bookmarked this job posting for later.",
      hasView: true,
    },
  ]

  const pastDate = [
    {
      id: 4,
      time: "1:00 am",
      icon: <FileText className="h-4 w-4 text-white" />,
      iconBg: "bg-blue-500",
      title: "Accepted interview with Google",
      description: "You confirmed the interview for March 28, 2025.",
      hasView: true,
    },
    {
      id: 5,
      time: "3:12 am",
      icon: <FileText className="h-4 w-4 text-white" />,
      iconBg: "bg-blue-500",
      title: "Withdrew application for Software Engineer Intern at Google",
      description:
        "You withdrew your application at 3:15 PM. This job will no longer appear in your active applications.",
      hasView: true,
    },
    {
      id: 6,
      time: "9:20 am",
      icon: <FileText className="h-4 w-4 text-white" />,
      iconBg: "bg-blue-500",
      title: "Accepted invitation and applied for Software Engineer Intern at Google",
      description: "You applied through the recruiter invitation at 11:15 AM.",
      hasView: true,
    },
  ]

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="pb-4">
        <h2 className="text-2xl font-bold">Activity Log</h2>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <select className="appearance-none bg-white border rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Sort by</option>
                <option>Newest first</option>
                <option>Oldest first</option>
                <option>Applications</option>
                <option>Saved jobs</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>

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
            />
          </div>
        </div>

        <div className="space-y-10">
          {/* Today Section */}
          <div>
            <div
              className="flex items-center gap-2 mb-6 cursor-pointer"
              onClick={() => setIsTodayExpanded(!isTodayExpanded)}
            >
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transform transition-transform ${
                    isTodayExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>
              <h3 className="font-semibold text-lg">Today</h3>
            </div>

            {isTodayExpanded && (
              <div className="space-y-8 ml-6">
                {today.map((activity) => (
                  <div key={activity.id} className="relative">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 ${activity.iconBg} rounded-full flex items-center justify-center`}>
                        {activity.icon}
                      </div>
                      <div className="text-xs text-gray-500">{activity.time}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{activity.title}</h4>
                          {activity.hasView && (
                            <Button variant="link" className="text-blue-600 p-0 h-auto text-sm">
                              View
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                    </div>
                    <div className="absolute left-4 top-8 bottom-0 w-px bg-gray-200 -ml-px"></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Date Section */}
          <div>
            <div
              className="flex items-center gap-2 mb-6 cursor-pointer"
              onClick={() => setIsPastDateExpanded(!isPastDateExpanded)}
            >
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transform transition-transform ${
                    isPastDateExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>
              <h3 className="font-semibold text-lg">Dec 22, 2001</h3>
            </div>

            {isPastDateExpanded && (
              <div className="space-y-8 ml-6">
                {pastDate.map((activity) => (
                  <div key={activity.id} className="relative">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 ${activity.iconBg} rounded-full flex items-center justify-center`}>
                        {activity.icon}
                      </div>
                      <div className="text-xs text-gray-500">{activity.time}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{activity.title}</h4>
                          {activity.hasView && (
                            <Button variant="link" className="text-blue-600 p-0 h-auto text-sm">
                              View
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                    </div>
                    {activity.id !== pastDate[pastDate.length - 1].id && (
                      <div className="absolute left-4 top-8 bottom-0 w-px bg-gray-200 -ml-px"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
