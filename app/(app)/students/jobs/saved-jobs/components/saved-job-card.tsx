"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Bookmark, Briefcase, Globe, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CgSmile } from "react-icons/cg"
import { IoIosRocket } from "react-icons/io"
import { useState, useEffect } from "react"
import { PiMoneyDuotone } from "react-icons/pi"
import Image from "next/image"

type SavedJob = {
  id: number | string
  title?: string
  job_title?: string
  description?: string
  location?: string
  type?: string
  company?: string
  savedDate?: string
  status?: string
  match_percentage?: number
  pay_type?: string
  pay_amount?: string | number
  created_at?: string
  remote_options?: string
  skills?: string[]
}

function extractCityRegionCountry(address?: string) {
  if (!address) return "Unknown Location"
  const parts = address
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
  if (parts.length === 0) return "Unknown Location"
  if (parts.length >= 3) {
    return parts.slice(-3).join(", ")
  }
  return parts.join(", ")
}

function formatPostedDate(postedDate?: string) {
  if (!postedDate) return ""
  const posted = new Date(postedDate)
  const now = new Date()
  const diffMs = now.getTime() - posted.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return "Saved today"
  if (diffDays === 1) return "Saved 1 day ago"
  if (diffDays <= 7) return `Saved ${diffDays} days ago`
  return posted.toLocaleString("default", { month: "short", day: "numeric" })
}

function SavedJobCard({
  isSelected,
  onSelect,
  onQuickApply,
  onRemove,
  job,
}: {
  isSelected: boolean
  onSelect: () => void
  onQuickApply: () => void
  onRemove: (jobId: number | string) => void
  job: SavedJob
}) {
  const [removing, setRemoving] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoLoading, setLogoLoading] = useState(true)
  const [skills, setSkills] = useState<string[]>([])

  const logoPath =
    (job as { company_logo_image_path?: string }).company_logo_image_path ||
    (job as { registered_companies?: { company_logo_image_path?: string } }).registered_companies?.company_logo_image_path

  useEffect(() => {
    setLogoLoading(true)
    let ignore = false
    async function fetchLogoUrl() {
      if (!logoPath) {
        setLogoUrl(null)
        setLogoLoading(false)
        return
      }
      const cacheKey = `companyLogoUrl:${logoPath}`
      const cached = sessionStorage.getItem(cacheKey)
      if (cached) {
        try {
          const { url, expiry } = JSON.parse(cached)
          if (
            typeof url === "string" &&
            url.startsWith("http") &&
            expiry &&
            Date.now() < expiry
          ) {
            setLogoUrl(url)
            setLogoLoading(false)
            return
          } else {
            sessionStorage.removeItem(cacheKey)
          }
        } catch {
          sessionStorage.removeItem(cacheKey)
        }
      }
      const res = await fetch(
        `/api/employers/get-signed-url?bucket=company.logo&path=${encodeURIComponent(logoPath)}`
      )
      const json = await res.json()
      if (!ignore) {
        if (json.signedUrl && typeof json.signedUrl === "string" && json.signedUrl.startsWith("http")) {
          setLogoUrl(json.signedUrl)
        } else {
          setLogoUrl(null)
          sessionStorage.removeItem(cacheKey)
        }
        setLogoLoading(false)
      }
    }
    fetchLogoUrl()
    return () => { ignore = true }
  }, [logoPath])

  useEffect(() => {
    let ignore = false
    async function fetchSkills() {
      if (!job.id) return
      const res = await fetch(`/api/jobs/${job.id}/skills`)
      const json = await res.json()
      if (!ignore) setSkills(Array.isArray(json.skills) ? json.skills : [])
    }
    fetchSkills()
    return () => { ignore = true }
  }, [job.id])

  const company =
    job.company ||
    (job as { registered_employers?: { company_name?: string } }).registered_employers?.company_name ||
    (job as { employers?: { company_name?: string } }).employers?.company_name ||
    [
      (job as { employers?: { first_name?: string } }).employers?.first_name,
      (job as { employers?: { last_name?: string } }).employers?.last_name,
    ].filter(Boolean).join(" ") ||
    "Unknown Company"
  const title = job.job_title || job.title || "Untitled Position"
  const description = job.description || ""
  const location = extractCityRegionCountry(job.location)
  const remoteOptions = job.remote_options || "On-site"
  const type = job.type || "Full-time"
  const matchPercentage = job.match_percentage || 85
  const payType = job.pay_type || "N/A"
  const payAmount = job.pay_amount ? job.pay_amount : "N/A"
  const savedDate = formatPostedDate(job.savedDate || job.created_at)

  let statusLabel = ""
  let statusClass = ""
  const applicationDeadline =
    (job as { application_deadline?: string }).application_deadline ||
    (job as { deadline?: string }).deadline
  const paused = (job as { paused?: boolean }).paused

  if (paused) {
    statusLabel = "Closed"
    statusClass = "bg-red-100 text-red-700"
  } else if (applicationDeadline) {
    const deadlineDate = new Date(applicationDeadline)
    const now = new Date()
    const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays < 0) {
      statusLabel = "Closed"
      statusClass = "bg-red-100 text-red-700"
    } else if (diffDays <= 3) {
      statusLabel = "Closing Soon"
      statusClass = "bg-orange-100 text-orange-700"
    } else {
      statusLabel = "Active"
      statusClass = "bg-green-100 text-green-700"
    }
  } else {
    statusLabel = "Active"
    statusClass = "bg-green-100 text-green-700"
  }

  async function handleRemove(e: React.MouseEvent) {
    e.stopPropagation()
    setRemoving(true)
    setTimeout(() => {
      onRemove(job.id)
      setRemoving(false)
    }, 500)
  }

  return (
    <motion.div
      className={`bg-white rounded-lg shadow-sm p-5 border-l-4  ${
        isSelected ? "border-l-blue-500 border-blue-200" : "border-l-transparent border-gray-200"
      } relative overflow-hidden mt-2`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        y: -2,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        borderColor: "rgba(96, 165, 250, 0.8)",
      }}
    >
      <div className="flex justify-between">
        <div className="flex gap-3">
          <motion.div
            className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden text-white"
            whileHover={{ scale: 1.1 }}
          >
            {logoLoading ? (
              <div className="w-12 h-12 rounded-full animate-pulse bg-gradient-to-br from-blue-400 via-blue-500 to-purple-400" />
            ) : logoUrl && logoUrl.startsWith("http") ? (
              <Image
                src={logoUrl}
                alt="Company logo"
                width={48}
                height={48}
                className="object-cover"
                onLoad={() => setLogoLoading(false)}
                onError={() => setLogoLoading(false)}
              />
            ) : (
              <Briefcase size={20} color="#ffffff" />
            )}
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
              {statusLabel && (
                <span className={`ml-2 ${statusClass} text-xs font-semibold px-2 py-0.5 rounded-full`}>
                  {statusLabel}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {company}
              {location && location !== "Unknown Location" && (
                <>
                  {" "}
                  <span className="text-gray-400">| {location}</span>
                </>
              )}
            </p>
          </div>
        </div>
        <motion.button
          className="text-gray-400 hover:text-red-500 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleRemove}
          disabled={removing}
          title="Remove from saved jobs"
        >
          <X size={20} className={removing ? "animate-spin" : ""} />
        </motion.button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {skills.map((skill: string, i: number) => (
          <Badge key={i} className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">
            {skill}
          </Badge>
        ))}
      </div>

      {description && <p className="text-gray-600 text-sm mt-3">{description}</p>}

      <div className="bg-blue-100 text-blue-700 text-sm font-semibold mt-4 px-4 py-2 rounded-lg flex items-center gap-2">
        <Bookmark className="w-5 h-5 fill-blue-700" />
        <span>{savedDate}</span>
      </div>

      {matchPercentage && (
        <div className="bg-green-100 text-green-700 text-sm font-semibold mt-2 px-4 py-2 rounded-lg flex items-center gap-2">
          <CgSmile className="w-5 h-5" />
          <span>You are {matchPercentage}% match to this job.</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-sm text-gray-600">
        <div className="flex items-center">
          <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
          <span>{type}</span>
        </div>
        <div className="flex items-center">
          <PiMoneyDuotone className="h-4 w-4 mr-2 text-gray-400" />
          <span>
            {payType}
            {payAmount !== "N/A" && ` / ${payAmount}`}
          </span>
        </div>
        <div className="flex items-center">
          <Globe className="h-4 w-4 mr-2 text-gray-400" />
          <span>{remoteOptions}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2 w-full sm:w-auto">
          {isSelected ? (
            <motion.button
              className="bg-blue-500 hover:bg-gray-300 text-white px-6 py-2 rounded-full font-medium shadow-sm flex-1 sm:flex-none flex items-center justify-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.stopPropagation()
                onSelect()
              }}
            >
              Close
            </motion.button>
          ) : (
            <motion.button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium shadow-sm flex-1 sm:flex-none flex items-center justify-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.stopPropagation()
                onSelect()
              }}
            >
              View Details
            </motion.button>
          )}
          <motion.button
            className="bg-white hover:bg-blue-50 text-blue-600 px-6 py-2 rounded-full font-medium shadow-sm border border-blue-600 flex-1 sm:flex-none flex items-center justify-center gap-2"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => {
              e.stopPropagation()
              onQuickApply()
            }}
          >
            <IoIosRocket className="w-4 h-4" />
            Quick Apply
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default SavedJobCard

