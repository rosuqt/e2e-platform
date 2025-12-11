"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Skeleton from "@mui/material/Skeleton"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"

export default function ProfileCompletion() {
  const [studentName, setStudentName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [completion, setCompletion] = useState({
    basic: false,
    achievements: false,
    resume: false,
    skills: false,
    portfolio: false,
    percent: 0,
  })
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      let first_name: string | null = null
      let last_name: string | null = null
      try {
        const detailsRes = await fetch("/api/students/get-student-details", {
          credentials: "include",
        })
        if (detailsRes.ok) {
          const details = await detailsRes.json()
          first_name = details.first_name ?? null
          last_name = details.last_name ?? null
          setStudentName(
            first_name && last_name
              ? `${first_name} ${last_name}`
              : first_name || last_name || null
          )
        } else {
          setStudentName(null)
        }

        const profileRes = await fetch("/api/students/student-profile/getHandlers", {
          credentials: "include",
        })
        let newCompletion
        if (profileRes.ok) {
          const profile = await profileRes.json()
          const basic =
            !!profile.introduction &&
            !!profile.career_goals &&
            !!profile.contact_info &&
            !!profile.short_bio
          const achievements =
            Array.isArray(profile.certs) && profile.certs.length > 0
          const resume =
            Array.isArray(profile.uploaded_resume_url)
              ? profile.uploaded_resume_url.length > 0
              : !!profile.uploaded_resume_url
          const skills =
            (Array.isArray(profile.skills) && profile.skills.length > 0) ||
            (Array.isArray(profile.expertise) && profile.expertise.length > 0)
          const portfolio =
            Array.isArray(profile.portfolio) && profile.portfolio.length > 0
          const steps = [basic, achievements, resume, skills, portfolio]
          const percent = Math.round((steps.filter(Boolean).length / steps.length) * 100)
          newCompletion = { basic, achievements, resume, skills, portfolio, percent }
          setCompletion(newCompletion)
        } else {
          newCompletion = { basic: false, achievements: false, resume: false, skills: false, portfolio: false, percent: 0 }
          setCompletion(newCompletion)
        }
      } catch {
        setStudentName(null)
        setCompletion({ basic: false, achievements: false, resume: false, skills: false, portfolio: false, percent: 0 })
      }
      setLoading(false)
    })()
  }, [])

  return (
    <motion.div
      className="bg-white rounded-xl shadow p-3 mb-4 border border-blue-100 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-3">
        <h3 className="font-medium text-blue-700 text-sm">
          {loading ? (
            <Skeleton variant="text" width={80} height={16} />
          ) : studentName ? (
            `Hello ${studentName.split(" ")[0]}!`
          ) : (
            "Hello!"
          )}
        </h3>
        <p className="text-xs text-blue-500">
          {loading ? <Skeleton variant="text" width={50} height={12} /> : "Find your future—countless jobs await."}
        </p>
      </div>

      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-xs font-medium text-blue-700">Profile Completion</h4>
          <span className="text-xs font-medium text-blue-700">
            {loading ? <Skeleton variant="text" width={20} height={12} /> : `${completion.percent}%`}
          </span>
        </div>
        <div className="relative">
          <Progress value={completion.percent} className="h-2" />
          {!loading && (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-blue-700 font-semibold">
              {completion.percent}%
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-3">
        <div className="flex items-center gap-1 text-sm">
          <CheckCircle className={`h-3 w-3 ${completion.basic ? "text-green-500" : "text-gray-300"}`} />
          <span className={completion.basic ? "text-gray-700" : "text-gray-400"}>Basic Info</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <CheckCircle className={`h-3 w-3 ${completion.skills ? "text-green-500" : "text-gray-300"}`} />
          <span className={completion.skills ? "text-gray-700" : "text-gray-400"}>Skills</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <CheckCircle className={`h-3 w-3 ${completion.resume ? "text-green-500" : "text-gray-300"}`} />
          <span className={completion.resume ? "text-gray-700" : "text-gray-400"}>Resume</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <CheckCircle className={`h-3 w-3 ${completion.achievements ? "text-green-500" : "text-gray-300"}`} />
          <span className={completion.achievements ? "text-gray-700" : "text-gray-400"}>Achievements</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <CheckCircle className={`h-3 w-3 ${completion.portfolio ? "text-green-500" : "text-gray-300"}`} />
          <span className={completion.portfolio ? "text-gray-700" : "text-gray-400"}>Portfolio</span>
        </div>
      </div>

      <div className="mt-3">
        <Button
          variant="outline"
          className="w-full text-blue-600 border-blue-100 hover:bg-blue-50 hover:text-blue-700 text-xs py-2"
          onClick={() => router.push("/students/profile")}
        >
          {completion.percent === 100 ? "View Profile" : "Complete Profile"}
        </Button>
      </div>
    </motion.div>
  )
}