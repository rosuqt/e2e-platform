/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useRouter } from "next/navigation"
import { Bookmark, ArrowLeft, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { PiShootingStarFill } from "react-icons/pi"
import { getSession } from "next-auth/react"

type SavedJob = {
  id: string
  title?: string
  job_title?: string
  company?: string
  saved_at?: string
  created_at?: string
  application_deadline?: string
  deadline?: string
  paused?: boolean
}

type JobMatch = {
  job_id: string
  job_title: string
  company_name: string
  gpt_score: number
}

function getStatus(job: SavedJob) {
  const applicationDeadline = job.application_deadline || job.deadline
  const paused = job.paused
  if (paused) {
    return { label: "Closed", className: "bg-red-100 text-red-700" }
  } else if (applicationDeadline) {
    const deadlineDate = new Date(applicationDeadline)
    const now = new Date()
    const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays < 0) {
      return { label: "Closed", className: "bg-red-100 text-red-700" }
    } else if (diffDays <= 3) {
      return { label: "Closing Soon", className: "bg-orange-100 text-orange-700" }
    } else {
      return { label: "Active", className: "bg-green-100 text-green-700" }
    }
  } else {
    return { label: "Active", className: "bg-green-100 text-green-700" }
  }
}

export default function SavedJobsSidebar() {
  const router = useRouter()
  const [recentJobs, setRecentJobs] = useState<SavedJob[]>([])
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([])

  useEffect(() => {
    fetch("/api/students/job-listings/saved-jobs?limit=3")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.jobs)) {
          setRecentJobs(
            data.jobs.map((job: SavedJob) => ({
              id: job.id,
              title: job.title || job.job_title,
              company: job.company,
              saved_at: job.saved_at || job.created_at,
              application_deadline: job.application_deadline,
              deadline: job.deadline,
              paused: job.paused,
            }))
          )
        }
      })
    getSession().then((session: any) => {
      const student_id = session?.user?.studentId
      if (!student_id) return
      fetch("/api/ai-matches/fetch-current-matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id }),
      })
        .then((res) => res.json())
        .then((data) => {
          const sorted = (data.matches || [])
            .sort((a: any, b: any) => b.gpt_score - a.gpt_score)
            .slice(0, 3)
          setJobMatches(sorted)
        })
    })
  }, [])

  function getBadgeColor(match: number) {
    if (match >= 60) return "bg-green-100 text-green-700 border-green-300"
    if (match >= 31) return "bg-orange-100 text-orange-700 border-orange-300"
    return "bg-red-100 text-red-700 border-red-300"
  }

  return (
    <div className="space-y-4">
      {/* Recent Saved Jobs */}
      <Card className="bg-white rounded-xl shadow p-4 border-2 border-blue-200 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-blue-600" />
            <span className="text-base font-semibold text-blue-700">Recently Saved</span>
          </div>
        </div>
        <div className="space-y-2">
          {recentJobs.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-2">
                        <PiShootingStarFill className="text-gray-400 text-3xl mb-2" />
                     
                      <div className="text-gray-500 text-sm">Nothing saved for now — your dream job might be just a scroll away!</div> </div>
          ) : (
            recentJobs.map((job) => {
              const status = getStatus(job)
              return (
                <div
                  key={job.id}
                  className="bg-white border border-blue-100 rounded-lg px-3 py-2 flex flex-col shadow-sm transition-transform duration-200 hover:scale-105"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-gray-900">{job.title || "Untitled"}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{job.company || "Unknown Company"}</span>
                  <span className="text-xs text-blue-600 mt-1">
                    Saved {job.saved_at ? new Date(job.saved_at).toLocaleDateString() : ""}
                  </span>
                </div>
              )
            })
          )}
        </div>
      </Card>

      {/* Job Matches Section */}
      <Card className="bg-white rounded-xl shadow p-4 border-2 border-blue-200 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span className="text-base font-semibold text-blue-700">Job Matches</span>
          </div>
          <button
            className="text-blue-600 border border-blue-100 hover:bg-blue-50 text-xs py-1 px-3 h-7 rounded-md transition-colors"
            onClick={() => router.push("/students/jobs/job-matches")}
          >
            View All
          </button>
        </div>
        <div className="space-y-2">
          {jobMatches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-2">
              <PiShootingStarFill className="text-gray-400 text-3xl mb-2" />
              <div className="text-gray-500 text-sm">Looks like we couldn’t find any matches. Maybe your profile needs a little tune-up?</div>
            </div>
          ) : (
            jobMatches.map((job) => (
              <div
                key={job.job_id}
                className="bg-white border border-blue-100 rounded-lg px-3 py-2 flex flex-col shadow-sm transition-transform duration-200 hover:scale-105"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-gray-900">{job.job_title || "Untitled"}</span>
                  <span className="flex items-center gap-1">
                    <span
                      className={`border text-xs font-semibold px-2 py-0.5 rounded ${getBadgeColor(job.gpt_score)}`}
                    >
                      {job.gpt_score}%
                    </span>
                  </span>
                </div>
                <span className="text-xs text-gray-500">{job.company_name || "Unknown Company"}</span>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Go Back Button */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl shadow p-4 text-white">
        <Button
          onClick={() => router.push("/students/jobs/job-listings")}
          className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back to Job Listings
        </Button>
      </Card>
    </div>
  )
}
