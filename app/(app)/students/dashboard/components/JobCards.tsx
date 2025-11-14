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

  const [viewedJobs, setViewedJobs] = useState<Set<string>>(new Set())
  const [matchScores, setMatchScores] = useState<Record<string, number | null>>({})
  const [studentPrefs, setStudentPrefs] = useState<{ workTypes: string[], remoteOptions: string[] }>({ workTypes: [], remoteOptions: [] });
  const [allowUnrelatedJobs, setAllowUnrelatedJobs] = useState<boolean | null>(null)
  const pageSize = 8
  const firstCardRef = useRef<HTMLDivElement | null>(null)
  const { data: session } = useSession()

  useEffect(() => {
    async function fetchAllJobs() {
      let allJobs: Job[] = []
      let page = 1
      let hasMore = true
      const pageSize = 50 
      let preferredTypes: string[] = []
      let preferredLocations: string[] = []
      let unrelatedJobsFlag: boolean | null = null

      while (hasMore) {
        const res = await fetch(`/api/students/job-listings?page=${page}&limit=${pageSize}`)
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
        if (Array.isArray(data.preferredTypes)) preferredTypes = data.preferredTypes
        if (Array.isArray(data.preferredLocations)) preferredLocations = data.preferredLocations
        if (typeof data.allowUnrelatedJobs === "boolean") unrelatedJobsFlag = data.allowUnrelatedJobs
        if (jobsArray.length < pageSize) {
          hasMore = false
        } else {
          page += 1
        }
      }
      setJobs(allJobs)
      setLoading(false)
      setStudentPrefs({
        workTypes: preferredTypes
          .map((t: string) =>
            t
              .replace(/[\[\]"]/g, "") 
              .replace(/^internship$/, "ojt/internship")
              .replace(/^ojt$/, "ojt/internship")
              .trim()
              .toLowerCase()
          )
          .filter(Boolean),
        remoteOptions: preferredLocations
          .map((r: string) =>
            r
              .replace(/[\[\]"]/g, "")
              .replace(/^onsite$/, "on-site") 
              .replace(/^wfh$/, "work from home")
              .trim()
              .toLowerCase()
          )
          .filter(Boolean),
      });
      setAllowUnrelatedJobs(unrelatedJobsFlag)
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
          scores[m.job_id] = typeof m.gpt_score === "number" ? m.gpt_score : null
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
          try {
            const parsed = JSON.parse(cached);
            if (parsed && typeof parsed === "object" && parsed.url && typeof parsed.url === "string") {
              logoUrlCache[safeLogoPath] = parsed.url;
              return parsed.url;
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
          const json = await res.json();
          if (!ignore) {
            if (json.signedUrl && typeof json.signedUrl === "string") {
              logoUrlCache[safeLogoPath] = json.signedUrl;
              if (typeof window !== "undefined")
                sessionStorage.setItem(cacheKey, JSON.stringify({ url: json.signedUrl }));
              setLogoUrl(json.signedUrl);
            } else {
              setLogoUrl(null);
            }
            setLoadingLogo(false);
          }
        } catch {
          if (!ignore) {
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
          Page {page} of {totalPages} &middot; {filteredJobs.length} jobs
        </div>
      </div>
    </motion.div>
  )
}



export default JobCards
