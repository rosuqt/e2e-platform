"use client"

import { motion } from "framer-motion"
import LinearProgress from "@mui/material/LinearProgress"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Image from "next/image"
import Skeleton from "@mui/material/Skeleton"
import { useEffect, useState } from "react"

export default function ProfileCompletion() {
  const [studentName, setStudentName] = useState<string | null>(null)
  const [profileImg, setProfileImg] = useState<string | null>(null)
  const [course, setCourse] = useState<string | null>(null)
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
        const detailsRes = await fetch("/api/students/get-student-details", {
          credentials: "include",
        })
        if (detailsRes.ok) {
          const { first_name, last_name, course, profile_img } = await detailsRes.json()
          setStudentName(
            first_name && last_name
              ? `${first_name} ${last_name}`
              : first_name || last_name || null
          )
          setCourse(course || null)
          if (profile_img) {
            try {
              const signedRes = await fetch("/api/students/get-signed-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bucket: "user.avatars", path: profile_img }),
                credentials: "include",
              })
              if (signedRes.ok) {
                const { signedUrl } = await signedRes.json()
                setProfileImg(signedUrl)
              } else {
                setProfileImg(null)
              }
            } catch {
              setProfileImg(null)
            }
          } else {
            setProfileImg(null)
          }
        } else {
          setStudentName(null)
          setCourse(null)
          setProfileImg(null)
        }

        // Fetch profile completion data
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
        setStudentName(null)
        setCourse(null)
        setProfileImg(null)
        setCompletion({ basic: false, education: false, resume: false, skills: false, percent: 0 })
      }
      setLoading(false)
    })()
  }, [])

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-4 mb-6 border-2 border-blue-200 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-300 bg-blue-50 flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
        >
          {loading ? (
            <Skeleton variant="circular" width={48} height={48} />
          ) : profileImg ? (
            <Image
              src={profileImg}
              alt="Profile"
              width={48}
              height={48}
              className="object-cover"
            />
          ) : (
            <span className="text-blue-700 font-bold text-lg">
              {studentName
                ? studentName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "?"}
            </span>
          )}
        </motion.div>
        <div>
          <h3 className="font-medium text-blue-700">
            {loading ? <Skeleton variant="text" width={80} height={20} /> : studentName || "Full Name"}
          </h3>
          <p className="text-sm text-blue-500">
            {loading ? <Skeleton variant="text" width={120} height={16} /> : course || "Course"}
          </p>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-sm font-medium text-blue-700">Profile Completion</h4>
          <span className="text-sm font-medium text-blue-700">
            {loading ? <Skeleton variant="text" width={24} height={16} /> : `${completion.percent}%`}
          </span>
        </div>
        <LinearProgress
          variant="determinate"
          value={completion.percent}
          className="h-2"
        />
      </div>

      <div className="space-y-2 mt-4">
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

      <div className="mt-4">
        <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50">
          Complete Profile
        </Button>
      </div>
    </motion.div>
  )
}
