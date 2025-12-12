/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Tooltip, Badge } from "@mui/material"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Lottie from "lottie-react"
import blueLoaderAnimation from "../../../../../public/animations/blue_loader.json"
import { HiBadgeCheck } from "react-icons/hi"
import { BadgeCheck as LuBadgeCheck } from "lucide-react"
import { styled } from "@mui/material/styles"
import { tooltipClasses } from "@mui/material/Tooltip"

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
    verify_status?: string | null
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

const CustomTooltip = styled(Tooltip)(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    color: "#222",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    fontSize: 13,
    borderRadius: 8,
    padding: "8px 14px",
    fontWeight: 500,
    letterSpacing: 0.1,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#fff",
  },
}))

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
  const [totalJobs, setTotalJobs] = useState(0)
  const [savedJobIds, setSavedJobIds] = useState<string[]>([])
  const [saving, setSaving] = useState<string | null>(null)
  const [viewedJobs, setViewedJobs] = useState<Set<string>>(new Set())
  const [matchScores, setMatchScores] = useState<Record<string, number | null>>({})
  const [studentPrefs, setStudentPrefs] = useState<{ workTypes: string[], remoteOptions: string[] }>({ workTypes: [], remoteOptions: [] });
  const [allowUnrelatedJobs, setAllowUnrelatedJobs] = useState<boolean | null>(null)
  const pageSize = 8
  const firstCardRef = useRef<HTMLDivElement | null>(null)
  const { data: session } = useSession()
  const jobsToHideRef = useRef<Set<string>>(new Set())
  const [companyRatings, setCompanyRatings] = useState<Record<string, { rating: number, count: number }>>({})

  useEffect(() => {
    setLoading(true)
    setError(null)
    const params = new URLSearchParams()
    params.set("page", String(page))
    params.set("limit", String(pageSize))
    if (searchTitle) params.set("searchTitle", searchTitle)
    if (searchLocation) params.set("searchLocation", searchLocation)
    if (filters.workType) params.set("workType", filters.workType)
    if (filters.remoteOption) params.set("remoteOption", filters.remoteOption)
    if (filters.program) params.set("program", filters.program)
    if (filters.listedAnytime) params.set("listedAnytime", filters.listedAnytime)
    fetch(`/api/students/job-listings?${params.toString()}`)
      .then(async res => {
        if (res.status === 401 || res.status === 400) {
          try {
            const data = await res.json()
            if (
              data &&
              typeof data.message === "string" &&
              data.message.toLowerCase().includes("invalidjwt")
            ) {
              // Just set error, do not sign out or reload
              setError("Session expired. Please sign in again.")
              setLoading(false)
              return
            }
          } catch {}
          setError("Session expired. Please sign in again.")
          setLoading(false)
          return
        }
        if (!res.ok) throw new Error()
        const data = await res.json()
        const jobsArray = Array.isArray(data.jobs) ? data.jobs : Array.isArray(data) ? data : []
        setJobs(jobsArray.filter((job: Job) => job && job.id && job.job_title))
        setTotalJobs(typeof data.total === "number" ? data.total : jobsArray.length)
        setStudentPrefs({
          workTypes: Array.isArray(data.preferredTypes)
            ? data.preferredTypes
                .map((t: string) =>
                  t
                    .replace(/[\[\]"]/g, "")
                    .replace(/^internship$/, "ojt/internship")
                    .replace(/^ojt$/, "ojt/internship")
                    .trim()
                    .toLowerCase()
                )
                .filter(Boolean)
            : [],
          remoteOptions: Array.isArray(data.preferredLocations)
            ? data.preferredLocations
                .map((r: string) =>
                  r
                    .replace(/[\[\]"]/g, "")
                    .replace(/^onsite$/, "on-site")
                    .replace(/^wfh$/, "work from home")
                    .trim()
                    .toLowerCase()
                )
                .filter(Boolean)
            : [],
        })
        setAllowUnrelatedJobs(typeof data.allowUnrelatedJobs === "boolean" ? data.allowUnrelatedJobs : null)
        setLoading(false)
      })
      .catch(() => {
        setError("Could not load jobs.")
        setLoading(false)
      })
  // Remove session and status from dependencies to prevent infinite loop
  }, [page, searchTitle, searchLocation, filters.workType, filters.remoteOption, filters.program, filters.listedAnytime])

  useEffect(() => {
    fetch("/api/students/job-listings/saved-jobs")
      .then(res => res.json())
      .then((data) => {
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

  useEffect(() => {
    if (!jobs.length) return
    const standardJobs = jobs.filter(job => job.registered_employers?.verify_status === "standard")
    const companyJobCounts: Record<string, number> = {}
    for (const job of standardJobs) {
      const company =
        job.registered_employers?.company_name ||
        job.employers?.company_name ||
        [job.employers?.first_name, job.employers?.last_name].filter(Boolean).join(" ") ||
        ""
      if (!companyJobCounts[company]) companyJobCounts[company] = 0
      companyJobCounts[company]++
    }
    const jobsToHide: Set<string> = new Set()
    for (const company in companyJobCounts) {
      const jobsOfCompany = standardJobs.filter(job =>
        (job.registered_employers?.company_name ||
          job.employers?.company_name ||
          [job.employers?.first_name, job.employers?.last_name].filter(Boolean).join(" ") ||
          "") === company
      )
      let hideCount = Math.min(3, 1 + Math.floor(jobsOfCompany.length / 5))
      if (jobsOfCompany.length > 10) hideCount = Math.min(5, Math.floor(jobsOfCompany.length / 3))
      if (hideCount > jobsOfCompany.length) hideCount = jobsOfCompany.length
      const shuffled = [...jobsOfCompany]
        .map(j => j.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, hideCount)
      shuffled.forEach(id => jobsToHide.add(String(id)))
    }
    jobsToHideRef.current = jobsToHide
  }, [jobs])

  const filteredJobs = jobs
    .filter((job: Job) => job.registered_employers?.verify_status !== "basic")
    .filter((job: Job) => {
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

      let matchesListedAnytime = true
      if (filters.listedAnytime && job.created_at) {
        const now = Date.now()
        const created = new Date(job.created_at).getTime()
        if (filters.listedAnytime === "24h") {
          matchesListedAnytime = created >= now - 24 * 60 * 60 * 1000
        } else if (filters.listedAnytime === "7d") {
          matchesListedAnytime = created >= now - 7 * 24 * 60 * 60 * 1000
        } else if (filters.listedAnytime === "30d") {
          matchesListedAnytime = created >= now - 30 * 24 * 60 * 60 * 1000
        }
      }

      return matchesTitle && matchesLocation && matchesWorkType && matchesRemoteOption && matchesListedAnytime
    })

  const fullJobs = filteredJobs.filter(job => job.registered_employers?.verify_status === "full")
  const standardJobs = filteredJobs.filter(job => job.registered_employers?.verify_status === "standard")
  const visibleStandardJobs = standardJobs.filter(job => !jobsToHideRef.current.has(String(job.id)))
  const jobsToDisplay = [
    ...fullJobs,
    ...visibleStandardJobs,
  ]
  const totalPages = Math.max(1, Math.ceil((totalJobs || jobsToDisplay.length) / pageSize))
  const paginatedJobs = jobsToDisplay

  useEffect(() => {
    async function fetchMatchScores() {
      const studentId = session?.user?.studentId
      if (!studentId) return
      const res = await fetch("/api/ai-matches/fetch-current-matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId }),
      })
      const data = await res.json()
      if (Array.isArray(data.matches)) {
        const scores: Record<string, number | null> = {}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.matches.forEach((m: any) => {
          if (typeof m.gpt_score === "number" && m.gpt_score > 5) {
            scores[m.job_id] = m.gpt_score;
          } else {
            scores[m.job_id] = null;
          }
        })
        setMatchScores(scores)
      }
    }
    fetchMatchScores()
  }, [session])

  function getMatchIcon(percent: number) {
    if (percent >= 70) return <AiFillSmile color="#4CAF50" size={20} />
    if (percent >= 40) return <AiOutlineMeh color="#FFC107" size={20} />
    return <TbMoodConfuzed color="#F44336" size={20} />
  }

  useEffect(() => {
    async function fetchRatings() {
      const ratings: Record<string, { rating: number, count: number }> = {}
      const companyIds = Array.from(
        new Set(
          jobs
            .map(job => (job as any).company_id)
            .filter(Boolean)
        )
      )
      await Promise.all(
        companyIds.map(async (companyId) => {
          try {
            
            const res = await fetch(`/api/employers/fetchRatings/fetchCompanyAvg?companyId=${encodeURIComponent(companyId)}`)
            if (res.ok) {
              const data = await res.json()
              if (typeof data.rating === "number" && typeof data.count === "number") {
                ratings[companyId] = { rating: data.rating, count: data.count }
              }
            }
          } catch {}
        })
      )
      setCompanyRatings(ratings)
    }
    if (jobs.length) fetchRatings()
  }, [jobs])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Lottie animationData={blueLoaderAnimation} loop className="w-20 h-20" />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!filteredJobs.length) {
    return (
      <div className="flex flex-col items-center justify-center h-80 w-full">
        <div className="w-full flex flex-col items-center mb-2">
          <div className="w-full max-w-md border-t border-gray-300 mb-4"></div>
          <PiFileMagnifyingGlassBold size={100} className="text-blue-300 mb-4" />
          {searchTitle || searchLocation ? (
            <>
              <div className="text-blue-400 text-base font-semibold">No jobs found for your search.</div>
              <span className="text-blue-400 text-base font-semibold">Try adjusting your search or filters.</span>
            </>
          ) : allowUnrelatedJobs === true ? (
            <>
              <div className="text-gray-500 text-sm font-medium mb-2">Displaying jobs outside your set preferences</div>
              <div className="text-blue-400 text-base font-semibold">Nothing here right now, </div>
              <span className="text-blue-400 text-base font-semibold">but opportunities may pop up soon!</span>
            </>
          ) : (
            <>
              <div className="text-gray-500 text-sm font-medium mb-2">
                That’s all the jobs matching your preferences! Edit them in{' '}
                <Link href="/students/settings" className="text-gray-400 font-bold underline">
                  Settings
                </Link>{' '}
                to find new opportunities.
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  function JobCardLogo({ logoPath, fallback }: { logoPath?: string | null, fallback: React.ReactNode }) {
    const [logoUrl, setLogoUrl] = useState<string | null>(() => {
      const safeLogoPath = typeof logoPath === "string" ? logoPath : "";
      if (safeLogoPath.length > 0 && logoUrlCache[safeLogoPath]) {
        return logoUrlCache[safeLogoPath];
      }
      if (safeLogoPath.length > 0 && typeof window !== "undefined") {
        const cached = sessionStorage.getItem(`companyLogoUrl:${safeLogoPath}`);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed && typeof parsed === "object" && parsed.url && typeof parsed.url === "string") {
              logoUrlCache[safeLogoPath] = parsed.url;
              return parsed.url;
            }
            // Add: handle "notfound" marker
            if (parsed && parsed.notfound) {
              return null;
            }
          } catch {
            sessionStorage.removeItem(`companyLogoUrl:${safeLogoPath}`);
          }
        }
      }
      return null;
    });
    const [loadingLogo, setLoadingLogo] = useState(false);

    useEffect(() => {
      let ignore = false;
      const safeLogoPath = typeof logoPath === "string" ? logoPath : "";
      if (safeLogoPath.length === 0) {
        setLogoUrl(null);
        setLoadingLogo(false);
        return;
      }
      if (logoUrlCache[safeLogoPath]) {
        setLogoUrl(logoUrlCache[safeLogoPath]);
        setLoadingLogo(false);
        return;
      }
      const cacheKey = `companyLogoUrl:${safeLogoPath}`;
      const cached =
        typeof window !== "undefined"
          ? sessionStorage.getItem(cacheKey)
          : null;
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === "object" && parsed.url && typeof parsed.url === "string") {
            logoUrlCache[safeLogoPath] = parsed.url;
            setLogoUrl(parsed.url);
            setLoadingLogo(false);
            return;
          }
          // Add: handle "notfound" marker
          if (parsed && parsed.notfound) {
            setLogoUrl(null);
            setLoadingLogo(false);
            return;
          }
        } catch {
          sessionStorage.removeItem(cacheKey);
        }
      }
      async function fetchLogoUrl() {
        setLoadingLogo(true);
        try {
          const res = await fetch("/api/employers/get-signed-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bucket: "company.logo",
              path: safeLogoPath,
            }),
          });
          if (res.status === 401 || res.status === 400) {
            // Cache notfound marker
            if (typeof window !== "undefined")
              sessionStorage.setItem(cacheKey, JSON.stringify({ notfound: true }));
            setLogoUrl(null);
            setLoadingLogo(false);
            return;
          }
          const json = await res.json();
          if (!ignore) {
            if (json.signedUrl && typeof json.signedUrl === "string") {
              logoUrlCache[safeLogoPath] = json.signedUrl;
              if (typeof window !== "undefined")
                sessionStorage.setItem(cacheKey, JSON.stringify({ url: json.signedUrl }));
              setLogoUrl(json.signedUrl);
            } else {
              // Cache notfound marker
              if (typeof window !== "undefined")
                sessionStorage.setItem(cacheKey, JSON.stringify({ notfound: true }));
              setLogoUrl(null);
            }
            setLoadingLogo(false);
          }
        } catch {
          if (!ignore) {
            // Cache notfound marker
            if (typeof window !== "undefined")
              sessionStorage.setItem(cacheKey, JSON.stringify({ notfound: true }));
            setLogoUrl(null);
            setLoadingLogo(false);
          }
        }
      }
      fetchLogoUrl();
      return () => {
        ignore = true;
      };
    }, [logoPath])

    if (loadingLogo) {
      return (
        <div className="flex items-center justify-center w-16 h-16">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-400 border-solid"></div>
        </div>
      )
    }
    if (logoUrl && typeof logoUrl === "string") {
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

  const trackJobView = async (jobId: string) => {
    if (viewedJobs.has(jobId)) return
    
    try {
      const response = await fetch("/api/employers/job-metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, action: "view" }),
      })
      
      if (response.ok) {
        setViewedJobs(prev => new Set([...prev, jobId]))
      }
    } catch (error) {
      console.error("Failed to track job view:", error)
    }
  }

  const trackJobClick = async (jobId: string) => {
    try {
      await fetch("/api/employers/job-metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, action: "click" }),
      })
    } catch (error) {
      console.error("Failed to track job click:", error)
    }
  }

  return (
    <motion.div className="space-y-6 z-0" variants={container} initial="hidden" animate="show">
      {(() => {
        const isPreferred = (job: Job) => {
          const jobWorkType = (job.work_type || "").toLowerCase().trim();
          const jobRemoteOption = (job.remote_options || "").toLowerCase().trim();
          return (
            (studentPrefs.workTypes.length > 0 && studentPrefs.workTypes.includes(jobWorkType)) ||
            (studentPrefs.remoteOptions.length > 0 && studentPrefs.remoteOptions.includes(jobRemoteOption))
          );
        };

        let lastPrefGlobalIdx = -1;
        for (let i = 0; i < jobs.length; i++) {
          if (isPreferred(jobs[i])) lastPrefGlobalIdx = i;
        }
        const globalLastPrefId = lastPrefGlobalIdx >= 0 ? jobs[lastPrefGlobalIdx]?.id : undefined;

        const cards: React.ReactNode[] = [];
        paginatedJobs.forEach((job, idx) => {
          const isSaved = savedJobIds.includes(job.id);
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
          const matchPercent = matchScores[job.id] ?? null
          const matchedPrefs: string[] = [];
          const jobWorkType = (job.work_type || "").toLowerCase().trim();
          const jobRemoteOption = (job.remote_options || "").toLowerCase().trim();
          if (studentPrefs.workTypes.length > 0 && studentPrefs.workTypes.includes(jobWorkType)) {
            matchedPrefs.push(job.work_type || "");
          }
          if (studentPrefs.remoteOptions.length > 0 && studentPrefs.remoteOptions.includes(jobRemoteOption)) {
            matchedPrefs.push(job.remote_options || "");
          }
          const companyId = (job as any).company_id
          const ratingObj = companyId ? companyRatings[companyId] : undefined
          const card = (
            <motion.div
              key={job.id}
              ref={idx === 0 ? firstCardRef : undefined}
              className={`bg-white rounded-3xl border-2 ${
                selectedJob === job.id ? "border-blue-300 ring-4 ring-blue-100" : "border-blue-200 hover:border-blue-300"
              } p-6 relative shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-visible`}
              onClick={() => {
                trackJobView(job.id);
                trackJobClick(job.id);
                onSelectJob(job.id);
              }}
              onMouseEnter={() => trackJobView(job.id)}
              whileHover={{
                y: -4,
                boxShadow: "0 10px 15px -5px rgba(0, 0, 0, 0.1)",
              }}
              transition={{ duration: 0.2 }}
              data-company-id={companyId}
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
                <Tooltip title={isSaved ? "Unsave this job" : "Save this job"} placement="top" arrow>
                  <span aria-label={isSaved ? "Unsave this job" : "Save this job"}>
                    {isSaved ? <BookmarkFilled size={28} fill="currentColor" /> : <Bookmark size={28} />}
                  </span>
                </Tooltip>
              </motion.button>

              {/* Preference badges*/}
              {matchedPrefs.length > 0 && (
                <div className="absolute bottom-2 left-5 flex flex-row gap-2 z-30 items-center">
                  {matchedPrefs.map((pref) => (
                    <Tooltip key={pref} title="This matches your set preferences" placement="top" arrow>
                      <Badge
                        badgeContent={pref}
                        color={pref === job.work_type ? "primary" : "secondary"}
                        sx={{
                          "& .MuiBadge-badge": {
                            fontSize: "0.70rem",
                            padding: "2px 8px",
                            borderRadius: "10px",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                            minWidth: "unset",
                            height: "18px",
                            lineHeight: "16px",
                            background: pref === job.work_type ? "#E3F2FD" : "#F3E5F5",
                            color: pref === job.work_type ? "#1976d2" : "#9c27b0",
                            position: "static",
                            transform: "none",
                            fontWeight: 500,
                          }
                        }}
                      >
                        <span />
                      </Badge>
                    </Tooltip>
                  ))}
                </div>
              )}

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
                  <h3
                    className="font-bold text-xl text-blue-800 truncate max-w-[20rem]"
                    title={job.job_title}
                  >
                    {job.job_title.length > 50
                      ? job.job_title.slice(0, 47) + "..."
                      : job.job_title}
                  </h3>
                  <p className="text-sm text-blue-600 flex items-center">
                    {job.employers
                      ? `${job.employers.first_name} ${job.employers.last_name}`
                      : "Unknown Employer"}
                    {job.registered_employers?.company_name
                      ? ` | ${job.registered_employers.company_name}`
                      : ""}
                    {job.registered_employers?.verify_status === "full" ? (
                      <CustomTooltip title="Fully verified and trusted company" arrow>
                        <span style={{ display: "inline-flex", marginLeft: 8 }}>
                          <HiBadgeCheck className="w-4 h-4 text-blue-600" />
                        </span>
                      </CustomTooltip>
                    ) : job.registered_employers?.verify_status === "standard" ? (
                      <CustomTooltip title="Partially verified, exercise some caution" arrow>
                        <span style={{ display: "inline-flex", marginLeft: 8 }}>
                          <LuBadgeCheck className="w-4 h-4" style={{ color: "#7c3aed" }} />
                        </span>
                      </CustomTooltip>
                    ) : null}
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={14} className={ratingObj && ratingObj.rating >= star ? "text-yellow-400" : "text-gray-300"} fill={ratingObj && ratingObj.rating >= star ? "rgb(250 204 21)" : "none"} />
                      ))}
                    </div>
                    <span className="text-xs ml-1 text-blue-500">
                      {ratingObj
                        ? `${ratingObj.rating.toFixed(1)}/5 (${ratingObj.count} rating${ratingObj.count === 1 ? "" : "s"})`
                        : <span className="text-gray-400">No Ratings Yet</span>}
                    </span>
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
                {matchPercent !== null ? (
                  <div
                    className="rounded-xl py-3 px-4 flex items-center justify-center shadow-md"
                    style={{
                      background:
                        matchPercent >= 70
                          ? "#E6F4EA"
                          : matchPercent >= 40
                          ? "#FFF8E1"
                          : "#FDECEA",
                      color:
                        matchPercent >= 70
                          ? "#256029"
                          : matchPercent >= 40
                          ? "#8D6E00"
                          : "#B71C1C"
                    }}
                  >
                    {getMatchIcon(matchPercent)}
                    <span className="text-sm font-medium ml-2">
                      AI Match Score: {matchPercent}%
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
          );
          cards.push(card);

          if (
            allowUnrelatedJobs === false &&
            job.id === globalLastPrefId &&
            idx === paginatedJobs.length - 1
          ) {
            cards.push(
              <div key="divider-nomatch" className="w-full flex items-center my-6">
                <div className="flex-grow border-t border-gray-300"></div>
                <div className="mx-3 max-w-[70%] text-center text-gray-400 text-sm font-medium">
                  That’s all the jobs matching your preferences! Edit them in{' '}
                  <Link href="/students/settings" className="text-gray-400 font-bold underline">
                    Settings
                  </Link>{' '}
                  to find new opportunities.
                </div>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
            );
          }
        });

        if (allowUnrelatedJobs === true) {
          const preferredCards: React.ReactNode[] = [];
          const unrelatedCards: React.ReactNode[] = [];
          paginatedJobs.forEach((job, idx) => {
            if (isPreferred(job)) {
              preferredCards.push(cards[idx]);
            } else {
              unrelatedCards.push(cards[idx]);
            }
          });
          if (preferredCards.length > 0 && unrelatedCards.length > 0) {
            return [
              ...preferredCards,
              <div key="divider-unrelated" className="w-full flex items-center my-6">
                <div className="flex-grow border-t border-gray-400"></div>
                <span className="mx-4 text-gray-400 text-sm font-medium whitespace-nowrap">
                  More Jobs Outside Your Preferences
                </span>
                <div className="flex-grow border-t border-gray-400"></div>
              </div>,
              ...unrelatedCards,
            ];
          }
          if (preferredCards.length === 0 && unrelatedCards.length > 0) {
            return unrelatedCards;
          }
          if (preferredCards.length > 0 && unrelatedCards.length === 0) {
            return preferredCards;
          }
        }

        return cards;
      })()}
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
          {
            (() => {
              let pages: (number | string)[] = [];
              if (totalPages <= 5) {
                pages = Array.from({ length: totalPages }, (_, i) => i + 1);
              } else {
                if (page <= 3) {
                  pages = [1, 2, 3, 4, '...', totalPages];
                } else if (page >= totalPages - 2) {
                  pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
                } else {
                  pages = [1, '...', page - 1, page, page + 1, '...', totalPages];
                }
              }
              return pages.map((p, idx) => {
                if (p === '...') {
                  return (
                    <span key={`ellipsis-${idx}`} className="mx-1 w-9 h-9 flex items-center justify-center text-blue-400 select-none">...</span>
                  );
                }
                return (
                  <button
                    key={p}
                    className={`mx-1 w-9 h-9 flex items-center justify-center rounded-full transition text-base ${
                      page === p
                        ? "bg-blue-500 text-white font-bold"
                        : "text-blue-600 hover:underline"
                    }`}
                    style={{ background: page === p ? undefined : "none", border: "none" }}
                    onClick={() => setPage(Number(p))}
                    type="button"
                  >
                    {p}
                  </button>
                );
              });
            })()
          }
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
          Page {page} of {totalPages} &middot; {totalJobs || filteredJobs.length} jobs
        </div>
      </div>
    </motion.div>
  )
}



export default JobCards
