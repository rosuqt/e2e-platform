"use client"
import React, { useEffect, useState, useRef } from "react"
import { Bookmark, Bookmark as BookmarkFilled, Clock, Briefcase, Star, MapPin , Globe} from "lucide-react"
import { motion } from "framer-motion"
import { FaMoneyBill } from "react-icons/fa"
import Image from "next/image"
import { PiFileMagnifyingGlassBold } from "react-icons/pi"
import { AiFillSmile, AiOutlineMeh } from "react-icons/ai"
import { TbMoodConfuzed } from "react-icons/tb"
import { SiStarship } from "react-icons/si"
import { calculateSkillsMatch } from "../../../../../lib/match-utils"

const logoUrlCache: Record<string, string> = {}

interface Job {
  id: string
  job_title: string
  employers: {
    first_name: string
    last_name: string
    company_name?: string | null
  } | null
  location: string | null
  application_deadline: string | null
  work_type: string | null
  pay_amount: string | null
  created_at: string | null
  match?: string
  registered_employers?: {
    company_name?: string | null
    company_logo?: string | null
  } | null
  remote_options?: string | null
}

type JobCardsProps = {
  onSelectJob: (id: string) => void
  selectedJob: string | null
  searchTitle: string
  searchLocation: string
  filters: {
    workType: string
    remoteOption: string
    program: string
    listedAnytime: string
  }
}

const JobCards: React.FC<JobCardsProps> = ({
  onSelectJob,
  selectedJob,
  searchTitle,
  searchLocation,
  filters,
}) => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [savedJobIds, setSavedJobIds] = useState<string[]>([])
  const [saving, setSaving] = useState<string | null>(null)
  const [studentSkills, setStudentSkills] = useState<string[]>([])
  const [jobSkillsMap, setJobSkillsMap] = useState<Record<string, string[]>>({})
  const pageSize = 8
  const firstCardRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    async function fetchAllJobs() {
      let allJobs: Job[] = []
      let page = 1
      let hasMore = true
      const pageSize = 50 

      while (hasMore) {
        const res = await fetch(`/api/students/job-listings?page=${page}&pageSize=${pageSize}`)
        if (!res.ok) break
        const data = await res.json()
        const jobsArray = Array.isArray(data) ? data : Array.isArray(data.jobs) ? data.jobs : []
        allJobs = allJobs.concat(
          jobsArray
            .filter((job: Job) => job && job.id && job.job_title)
            .map((job: Job) => ({
              ...job,
              match: "98%"
            }))
        )
        if (jobsArray.length < pageSize) {
          hasMore = false
        } else {
          page += 1
        }
      }
      setJobs(allJobs)
      setLoading(false)
    }
    fetchAllJobs().catch(() => {
      setError("Could not load jobs.")
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    fetch("/api/students/job-listings/saved-jobs")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.jobIds)) setSavedJobIds(data.jobIds.map(String))
      })
  }, [])

  useEffect(() => {
    if (firstCardRef.current) {
      const y = firstCardRef.current.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: Math.max(y - 80, 0), behavior: "smooth" })
    }
  }, [page])

  useEffect(() => {
    setPage(1)
  }, [searchTitle, searchLocation, filters.workType, filters.remoteOption, filters.program, filters.listedAnytime])

  const handleToggleSave = async (jobId: string, isSaved: boolean) => {
    setSaving(jobId)
    if (isSaved) {
      await fetch("/api/students/job-listings/saved-jobs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      })
      setSavedJobIds(ids => ids.filter(id => id !== jobId))
    } else {
      await fetch("/api/students/job-listings/saved-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      })
      setSavedJobIds(ids => [...ids, jobId])
    }
    setSaving(null)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const filteredJobs = jobs.filter((job: Job) => {
    const matchesTitle =
      !searchTitle ||
      (job.job_title && job.job_title.toLowerCase().includes(searchTitle.toLowerCase()))
    const matchesLocation =
      !searchLocation ||
      (job.location && job.location.toLowerCase().includes(searchLocation.toLowerCase()))
    const matchesWorkType =
      !filters.workType ||
      (job.work_type && job.work_type.toLowerCase().includes(filters.workType.toLowerCase()))
    const matchesRemoteOption =
      !filters.remoteOption ||
      (job.location && job.location.toLowerCase().includes(filters.remoteOption.toLowerCase())) ||
      (job.remote_options && job.remote_options.toLowerCase().includes(filters.remoteOption.toLowerCase()))
    return matchesTitle && matchesLocation && matchesWorkType && matchesRemoteOption
  })

  useEffect(() => {
    fetch("/api/students/student-profile/getHandlers")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.skills)) setStudentSkills(data.skills)
        else if (typeof data.skills === "string") {
          try {
            const arr = JSON.parse(data.skills)
            if (Array.isArray(arr)) setStudentSkills(arr)
            else setStudentSkills(
              (data.skills as string).split(",").map((s: string) => s.trim()).filter((s: string) => !!s)
            )
          } catch {
            setStudentSkills(
              (data.skills as string).split(",").map((s: string) => s.trim()).filter((s: string) => !!s)
            )
          }
        } else setStudentSkills([])
      })
      .catch(() => setStudentSkills([]))
  }, [])

  useEffect(() => {
    async function fetchSkillsForJobs() {
      const map: Record<string, string[]> = {}
      await Promise.all(jobs.map(async (job) => {
        if (!job.id) return
        try {
          const res = await fetch(`/api/jobs/${job.id}/skills`)
          const json = await res.json()
          map[job.id] = Array.isArray(json.skills) ? json.skills : []
        } catch {
          map[job.id] = []
        }
      }))
      setJobSkillsMap(map)
    }
    if (jobs.length > 0) fetchSkillsForJobs()
  }, [jobs])

  function getMatchIcon(percent: number) {
    if (percent >= 70) return <AiFillSmile color="#4CAF50" size={20} />
    if (percent >= 40) return <AiOutlineMeh color="#FFC107" size={20} />
    return <TbMoodConfuzed color="#F44336" size={20} />
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-400 border-solid"></div>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!filteredJobs.length) {
    return (
      <div className="flex flex-col items-center justify-center h-80">
        <PiFileMagnifyingGlassBold size={100} className="text-blue-300 mb-4" />
        <div className="text-blue-400 text-base font-semibold">Nothing here right now, </div>
          <span className="text-blue-400 text-base font-semibold">but opportunities may pop up soon!</span>
      </div>
    )
  }

  const totalPages = Math.ceil(filteredJobs.length / pageSize)
  const paginatedJobs = filteredJobs.slice((page - 1) * pageSize, page * pageSize)

  function JobCardLogo({ logoPath, fallback }: { logoPath?: string | null, fallback: React.ReactNode }) {
    const [logoUrl, setLogoUrl] = useState<string | null>(() => {
      const safeLogoPath = typeof logoPath === "string" ? logoPath : "";
      if (safeLogoPath.length > 0 && logoUrlCache[safeLogoPath]) {
        return logoUrlCache[safeLogoPath];
      }
      if (safeLogoPath.length > 0 && typeof window !== "undefined") {
        const cached = sessionStorage.getItem(`companyLogoUrl:${safeLogoPath}`);
        if (cached) {
          logoUrlCache[safeLogoPath] = cached;
          return cached;
        }
      }
      return null;
    });

    useEffect(() => {
      let ignore = false;
      const safeLogoPath = typeof logoPath === "string" ? logoPath : "";
      if (safeLogoPath.length === 0) {
        setLogoUrl(null);
        return;
      }
      if (logoUrlCache[safeLogoPath]) {
        setLogoUrl(logoUrlCache[safeLogoPath]);
        return;
      }
      const cacheKey = `companyLogoUrl:${safeLogoPath}`;
      const cached =
        typeof window !== "undefined"
          ? sessionStorage.getItem(cacheKey)
          : null;
      if (cached) {
        logoUrlCache[safeLogoPath] = cached;
        setLogoUrl(cached);
        return;
      }
      async function fetchLogoUrl() {
        try {
          const res = await fetch(
            `/api/employers/get-signed-url?bucket=company.logo&path=${encodeURIComponent(
              safeLogoPath
            )}`
          );
          const json = await res.json();
          if (!ignore) {
            if (json.signedUrl) {
              logoUrlCache[safeLogoPath] = json.signedUrl;
              if (typeof window !== "undefined")
                sessionStorage.setItem(cacheKey, json.signedUrl);
            }
            setLogoUrl(json.signedUrl || null);
          }
        } catch {
          if (!ignore) setLogoUrl(null);
        }
      }
      fetchLogoUrl();
      return () => {
        ignore = true;
      };
    }, [logoPath])

    if (logoUrl) {
      return (
        <Image
          src={logoUrl}
          alt="Company Logo"
          width={64}
          height={64}
          className="object-cover w-16 h-16 rounded-2xl"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none"
          }}
        />
      )
    }
    return <>{fallback}</>
  }

  return (
    <motion.div className="space-y-6 z-0" variants={container} initial="hidden" animate="show">
      {paginatedJobs.map((job, idx) => {
        const isSaved = savedJobIds.includes(job.id)
        let logoPath: string | undefined;
        if (job.registered_employers?.company_logo) {
          logoPath = job.registered_employers.company_logo;
        } else if (
          job.hasOwnProperty("registered_companies") &&
          typeof (job as unknown as { registered_companies?: { company_logo_image_path?: unknown } }).registered_companies?.company_logo_image_path === "string"
        ) {
          logoPath = (job as unknown as { registered_companies?: { company_logo_image_path?: string } }).registered_companies!.company_logo_image_path;
        } else if (
          typeof (job as unknown as { company_logo_image_path?: unknown }).company_logo_image_path === "string"
        ) {
          logoPath = (job as unknown as { company_logo_image_path: string }).company_logo_image_path;
        } else {
          logoPath = undefined;
        }
        const jobSkills = jobSkillsMap[job.id] || []
        const matchPercent = studentSkills.length > 0 && jobSkills.length > 0
          ? calculateSkillsMatch(studentSkills, jobSkills)
          : null
        return (
        <motion.div
          key={job.id}
          ref={idx === 0 ? firstCardRef : undefined}
          className={`bg-white rounded-3xl border-2 ${
            selectedJob === job.id ? "border-blue-300 ring-4 ring-blue-100" : "border-blue-200 hover:border-blue-300"
          } p-6 relative shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-visible`}
          onClick={() => onSelectJob && onSelectJob(job.id)}
          whileHover={{
            y: -4,
            boxShadow: "0 10px 15px -5px rgba(0, 0, 0, 0.1)",
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            className="absolute top-2 right-2 flex items-center justify-center w-12 h-12 rounded-full bg-transparent hover:bg-blue-100 text-blue-400 hover:text-blue-600 transition-colors duration-200 z-20"
            style={{ pointerEvents: "auto" }}
            whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
            whileTap={{ scale: 0.95 }}
            disabled={saving === job.id}
            onClick={e => {
              e.stopPropagation();
              handleToggleSave(job.id, isSaved)
            }}
          >
            {isSaved ? <BookmarkFilled size={28} fill="currentColor" /> : <Bookmark size={28} />}
          </motion.button>

          <div className="flex gap-4 relative z-10">
            <motion.div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center text-white font-bold text-xl shadow-lg overflow-hidden`}
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <JobCardLogo
                logoPath={logoPath}
                fallback={job.employers?.first_name?.[0] || "?"}
              />
            </motion.div>
            <div>
              <h3 className="font-bold text-xl text-blue-800">{job.job_title}</h3>
              <p className="text-sm text-blue-600">
                {job.employers
                  ? `${job.employers.first_name} ${job.employers.last_name}`
                  : "Unknown Employer"}
                {job.registered_employers?.company_name
                  ? ` | ${job.registered_employers.company_name}`
                  : ""}
              </p>
              <div className="flex items-center mt-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={14} className="text-yellow-400" fill="rgb(250 204 21)" />
                  ))}
                </div>
                <span className="text-xs ml-1 text-blue-500">{"4.5/5 (N/A)"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center mt-3 text-xs text-blue-500 relative z-10">
            <MapPin size={14} className="mr-1" />
            <span>{job.location || "N/A"}</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 relative z-10">
            <div className="flex items-center text-sm bg-blue-50 p-3 rounded-xl border border-blue-100">
              <Clock size={16} className="text-blue-500 mr-2 flex-shrink-0" />
              <span className="text-blue-700 text-xs">
                {job.application_deadline
                  ? `Closing ${new Date(job.application_deadline).toLocaleDateString()}`
                  : "No deadline"}
              </span>
            </div>
            <div className="flex items-center text-sm bg-blue-50 p-3 rounded-xl border border-blue-100">
              <Briefcase size={16} className="text-blue-500 mr-2 flex-shrink-0" />
              <span className="text-blue-700 text-xs">{job.work_type || "N/A"}</span>
            </div>
            <div className="flex items-center text-sm bg-blue-50 p-3 rounded-xl border border-blue-100">
              <FaMoneyBill size={16} className="text-blue-500 mr-2 flex-shrink-0" />
              <span className="text-blue-700 text-xs">{job.pay_amount || "No Pay"}</span>
            </div>
            <div className="flex items-center text-sm bg-blue-50 p-3 rounded-xl border border-blue-100">
              <Globe size={16} className="text-blue-500 mr-2 flex-shrink-0" />
              <span className="text-blue-700 text-xs">
                {job.remote_options === "Hybrid"
                  ? "Hybrid"
                  : job.remote_options === "Work from home"
                  ? "Work from home"
                  : job.remote_options === "On-site"
                  ? "On-site"
                  : job.remote_options
                  ? job.remote_options
                  : "N/A"}
              </span>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            {studentSkills.length > 0 && jobSkills.length > 0 ? (
              <div
                className="rounded-xl py-3 px-4 flex items-center justify-center shadow-md"
                style={{
                  background:
                    matchPercent !== null && matchPercent >= 70
                      ? "#E6F4EA"
                      : matchPercent !== null && matchPercent >= 40
                      ? "#FFF8E1"
                      : "#FDECEA",
                  color:
                    matchPercent !== null && matchPercent >= 70
                      ? "#256029"
                      : matchPercent !== null && matchPercent >= 40
                      ? "#8D6E00"
                      : "#B71C1C"
                }}
              >
                {getMatchIcon(matchPercent ?? 0)}
                <span className="text-sm font-medium ml-2">
                  You are {matchPercent}% match to this job.
                </span>
              </div>
            ) : (
              <div
                className="rounded-xl py-3 px-4 flex items-center justify-center shadow-md"
                style={{
                  background: "#F3F4F6",
                  color: "#6B7280"
                }}
              >
                <SiStarship size={18} color="#9CA3AF" className="mr-2" />
                <span className="text-sm font-medium">
                  Set up your profile to get a match for you.
                </span>
              </div>
            )}
          </div>

          <div className="mt-3 text-right text-xs text-blue-400 relative z-10">
            Posted {job.created_at ? new Date(job.created_at).toLocaleDateString() : "N/A"}
          </div>
        </motion.div>
      )})}
      <div className="flex flex-col items-center mt-8 gap-1">
        <div className="flex items-center gap-1">
          <motion.button
            className="w-9 h-9 flex items-center justify-center rounded-full text-blue-500 hover:bg-blue-100 transition disabled:opacity-40"
            whileHover={{ scale: page > 1 ? 1.1 : 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            type="button"
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
          </motion.button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`mx-1 w-9 h-9 flex items-center justify-center rounded-full transition text-base ${
                page === i + 1
                  ? "bg-blue-500 text-white font-bold"
                  : "text-blue-600 hover:underline"
              }`}
              style={{ background: page === i + 1 ? undefined : "none", border: "none" }}
              onClick={() => setPage(i + 1)}
              type="button"
            >
              {i + 1}
            </button>
          ))}
          <motion.button
            className="w-9 h-9 flex items-center justify-center rounded-full text-blue-500 hover:bg-blue-100 transition disabled:opacity-40"
            whileHover={{ scale: page < totalPages ? 1.1 : 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            type="button"
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>
          </motion.button>
        </div>
        <div className="text-xs text-blue-400 mt-1">
          Page {page} of {totalPages} &middot; {filteredJobs.length} jobs
        </div>
      </div>
    </motion.div>
  )
}



export default JobCards
