"use client"

import LinearProgress from "@mui/material/LinearProgress"
import { CheckCircle } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import Tooltip from "@mui/material/Tooltip"

export default function ProfileCompletion({ onRefetch }: { onRefetch?: (refetch: () => void) => void } = {}) {
    const [completion, setCompletion] = useState({
        basic: false,
        achievements: false,
        resume: false,
        skills: false,
        portfolio: false,
        percent: 0,
    })

    const isFetching = useRef(false)

    const fetchProfileCompletion = async () => {
        if (isFetching.current) return
        isFetching.current = true
        try {
            const profileRes = await fetch("/api/students/student-profile/getHandlers", {
                credentials: "include",
            })
            let resume = false
            if (profileRes.ok) {
                const profile = await profileRes.json()

                resume =
                    Array.isArray(profile.uploaded_resume_url)
                        ? profile.uploaded_resume_url.length > 0
                        : !!profile.uploaded_resume_url

                const basic =
                    !!profile.introduction &&
                    !!profile.career_goals &&
                    !!profile.contact_info &&
                    !!profile.short_bio
                const achievements =
                    Array.isArray(profile.certs) && profile.certs.length > 0
                const skills =
                    (Array.isArray(profile.skills) && profile.skills.length > 0) ||
                    (Array.isArray(profile.expertise) && profile.expertise.length > 0)
                const portfolio =
                    Array.isArray(profile.portfolio) && profile.portfolio.length > 0
                const steps = [basic, achievements, resume, skills, portfolio]
                const percent = Math.round((steps.filter(Boolean).length / steps.length) * 100)
                setCompletion({ basic, achievements, resume, skills, portfolio, percent })
            } else {
                setCompletion({ basic: false, achievements: false, resume: false, skills: false, portfolio: false, percent: 0 })
            }
        } catch {
            setCompletion({ basic: false, achievements: false, resume: false, skills: false, portfolio: false, percent: 0 })
        }
        isFetching.current = false
    }

    useEffect(() => {
        fetchProfileCompletion()
        if (onRefetch) onRefetch(fetchProfileCompletion)

        const interval = setInterval(fetchProfileCompletion, 5000)
        return () => clearInterval(interval)
    }, [onRefetch])

    return (
        <>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-blue-700">Profile Completion</span>
                <span className="text-sm font-medium text-blue-700">
                    {`${completion.percent}%`}
                </span>
            </div>
            <LinearProgress
                variant="determinate"
                value={completion.percent}
                className="h-2 mb-4"
            />
            <div className="space-y-2">
                <Tooltip title="Fill out introduction, career goals, contact info, and short bio" arrow>
                    <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className={`h-4 w-4 ${completion.basic ? "text-green-500" : "text-gray-300"}`} />
                        <span className={completion.basic ? "text-gray-600" : "text-gray-400"}>Basic information</span>
                    </div>
                </Tooltip>
                <Tooltip title="Complete at least one skills or expertise assessment" arrow>
                    <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className={`h-4 w-4 ${completion.skills ? "text-green-500" : "text-gray-300"}`} />
                        <span className={completion.skills ? "text-gray-600" : "text-gray-400"}>Complete skills assessment</span>
                    </div>
                </Tooltip>
                <Tooltip title="Upload your resume document" arrow>
                    <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className={`h-4 w-4 ${completion.resume ? "text-green-500" : "text-gray-300"}`} />
                        <span className={completion.resume ? "text-gray-600" : "text-gray-400"}>Upload resume</span>
                    </div>
                </Tooltip>
                <Tooltip title="Add at least one certificate or achievement" arrow>
                    <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className={`h-4 w-4 ${completion.achievements ? "text-green-500" : "text-gray-300"}`} />
                        <span className={completion.achievements ? "text-gray-600" : "text-gray-400"}>Add achievement(s)</span>
                    </div>
                </Tooltip>
                <Tooltip title="Add at least one portfolio project" arrow>
                    <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className={`h-4 w-4 ${completion.portfolio ? "text-green-500" : "text-gray-300"}`} />
                        <span className={completion.portfolio ? "text-gray-600" : "text-gray-400"}>Add portfolio project(s)</span>
                    </div>
                </Tooltip>
            </div>
        </>
    )
}
