"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Image from "next/image"
import Skeleton from "@mui/material/Skeleton"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { FaUser } from "react-icons/fa"

export default function ProfileCompletion() {
  const [studentName, setStudentName] = useState<string | null>(null)
  const [profileImg, setProfileImg] = useState<string | null>(null)
  const [course, setCourse] = useState<string | null>(null)
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
    (async () => {
      setLoading(true)
      let first_name: string | null = null
      let last_name: string | null = null
      let course: string | null = null
      let profile_img: string | null = null
      try {
        const detailsRes = await fetch("/api/students/get-student-details", {
          credentials: "include",
        })
        if (detailsRes.ok) {
          const details = await detailsRes.json()
          first_name = details.first_name ?? null
          last_name = details.last_name ?? null
          course = details.course ?? null
          profile_img = details.profile_img ?? null
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
              const apiResponse = await signedRes.json();
              if (signedRes.ok && apiResponse.signedUrl) {
                setProfileImg(apiResponse.signedUrl)
                sessionStorage.setItem(
                  "studentProfileCompletion",
                  JSON.stringify({
                    profileImg: apiResponse.signedUrl,
                  })
                );
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
        setCourse(null)
        setProfileImg(null)
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
      <div className="flex items-center gap-2 mb-3">
        <motion.div
          className="relative w-10 h-10 rounded-full overflow-hidden border border-blue-200 bg-blue-50 flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
        >
          {loading ? (
            <Skeleton variant="circular" width={40} height={40} />
          ) : profileImg ? (
            <Image
              src={profileImg}
              alt="Profile"
              width={40}
              height={40}
              className="object-cover"
              onError={() => {
                setProfileImg(null);
              }}
            />
          ) : studentName ? (
            <span className="text-blue-700 font-bold text-lg">
              {studentName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </span>
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center">
              <FaUser className="text-white w-4 h-4" />
            </div>
          )}
        </motion.div>
        <div>
          <h3 className="font-medium text-blue-700 text-sm">
            {loading ? <Skeleton variant="text" width={60} height={16} /> : studentName || "Full Name"}
          </h3>
          <p className="text-xs text-blue-500">
            {loading ? <Skeleton variant="text" width={80} height={12} /> : course || "Course"}
          </p>
        </div>
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