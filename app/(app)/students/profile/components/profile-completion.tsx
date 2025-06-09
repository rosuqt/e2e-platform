"use client"

import LinearProgress from "@mui/material/LinearProgress"
import { CheckCircle } from "lucide-react"
import Skeleton from "@mui/material/Skeleton"
import { useEffect, useState } from "react"

export default function ProfileCompletion() {
  const [loading, setLoading] = useState(true)
  const [completion, setCompletion] = useState({
    basic: false,
    education: false,
    resume: false,
    skills: false,
    percent: 0,
  })

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const profileRes = await fetch("/api/students/student-profile/getHandlers", {
          credentials: "include",
        })
        if (profileRes.ok) {
          const profile = await profileRes.json()
          const basic =
            !!profile.introduction &&
            !!profile.career_goals &&
            !!profile.contact_info &&
            !!profile.short_bio
          const education =
            Array.isArray(profile.educations) && profile.educations.length > 0
          const resume =
            (Array.isArray(profile.certs) && profile.certs.length > 0)
          const skills =
            (Array.isArray(profile.skills) && profile.skills.length > 0) ||
            (Array.isArray(profile.expertise) && profile.expertise.length > 0)
          const steps = [basic, education, resume, skills]
          const percent = Math.round((steps.filter(Boolean).length / steps.length) * 100)
          setCompletion({ basic, education, resume, skills, percent })
        } else {
          setCompletion({ basic: false, education: false, resume: false, skills: false, percent: 0 })
        }
      } catch {
        setCompletion({ basic: false, education: false, resume: false, skills: false, percent: 0 })
      }
      setLoading(false)
    })()
  }, [])

  return (
    <>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-blue-700">Profile Completion</span>
        <span className="text-sm font-medium text-blue-700">
          {loading ? <Skeleton variant="text" width={24} height={16} /> : `${completion.percent}%`}
        </span>
      </div>
      <LinearProgress
        variant="determinate"
        value={completion.percent}
        className="h-2 mb-4"
      />
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className={`h-4 w-4 ${completion.basic ? "text-green-500" : "text-gray-300"}`} />
          <span className={completion.basic ? "text-gray-600" : "text-gray-400"}>Basic information</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className={`h-4 w-4 ${completion.education ? "text-green-500" : "text-gray-300"}`} />
          <span className={completion.education ? "text-gray-600" : "text-gray-400"}>Education details</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className={`h-4 w-4 ${completion.resume ? "text-green-500" : "text-gray-300"}`} />
          <span className={completion.resume ? "text-gray-600" : "text-gray-400"}>Upload resume</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className={`h-4 w-4 ${completion.skills ? "text-green-500" : "text-gray-300"}`} />
          <span className={completion.skills ? "text-gray-600" : "text-gray-400"}>Complete skills assessment</span>
        </div>
      </div>
    </>
  )
}
