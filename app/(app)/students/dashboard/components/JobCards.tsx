"use client"
import React, { useEffect, useState, useRef } from "react"
import { Bookmark, Clock, Briefcase, DollarSign, CheckCircle, Star, MapPin } from "lucide-react"
import { motion } from "framer-motion"

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
  } | null

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
  const pageSize = 8
  const firstCardRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    fetch("/api/students/job-listings")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch")
        return res.json()
      })
      .then(data => {
        if (Array.isArray(data)) {
          setJobs(
            data
              .filter(job => job && job.id && job.job_title)
              .map((job) => ({
                ...job,
                match: "98%"
              }))
          )
        } else {
          setJobs([])
        }
        setLoading(false)
      })
      .catch(() => {
        setError("Could not load jobs.")
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (firstCardRef.current) {
      const y = firstCardRef.current.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: Math.max(y - 80, 0), behavior: "smooth" })
    }
  }, [page])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const filteredJobs = jobs.filter(job => {
    const matchesTitle =
      !searchTitle ||
      job.job_title?.toLowerCase().includes(searchTitle.toLowerCase())
    const matchesLocation =
      !searchLocation ||
      (job.location && job.location.toLowerCase().includes(searchLocation.toLowerCase()))
    const matchesWorkType =
      !filters.workType ||
      (job.work_type && job.work_type.toLowerCase().includes(filters.workType.toLowerCase()))
    const matchesRemoteOption =
      !filters.remoteOption ||
      (job.location && job.location.toLowerCase().includes(filters.remoteOption.toLowerCase()))
    return matchesTitle && matchesLocation && matchesWorkType && matchesRemoteOption
  })

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!filteredJobs.length) {
    return <div className="text-blue-500">No jobs found.</div>
  }

  const totalPages = Math.ceil(filteredJobs.length / pageSize)
  const paginatedJobs = filteredJobs.slice((page - 1) * pageSize, page * pageSize)

  return (
    <motion.div className="space-y-6 z-0" variants={container} initial="hidden" animate="show">
      {paginatedJobs.map((job, idx) => (
        <motion.div
          key={job.id}
          ref={idx === 0 ? firstCardRef : undefined}
          className={`bg-white rounded-3xl border-2 ${
            selectedJob === job.id ? "border-blue-300 ring-4 ring-blue-100" : "border-blue-200 hover:border-blue-300"
          } p-6 relative shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden`}
          onClick={() => onSelectJob && onSelectJob(job.id)}
          whileHover={{
            y: -4,
            boxShadow: "0 10px 15px -5px rgba(0, 0, 0, 0.1)",
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-transparent hover:bg-blue-100 text-blue-400 hover:text-blue-600 transition-colors duration-200 z-10"
            whileHover={{ scale: 1.2, rotate: [0, -10, 10, -10, 0] }}
            whileTap={{ scale: 0.95 }}
          >
            <Bookmark size={24} />
          </motion.button>

          <div className="flex gap-4 relative z-10">
            <motion.div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center text-white font-bold text-xl shadow-lg`}
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5 }}
            >
              {job.employers?.first_name?.[0] || "?"}
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
            <div className="flex items-center text-sm bg-blue-50 p-3 rounded-xl border border-blue-100 col-span-2">
              <DollarSign size={16} className="text-blue-500 mr-2 flex-shrink-0" />
              <span className="text-blue-700 text-xs">{job.pay_amount || "N/A"}</span>
            </div>
          </div>

          <div className="mt-4 relative z-10">
            <div className="bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-xl py-3 px-4 flex items-center justify-center shadow-md">
              <CheckCircle size={18} className="mr-2 flex-shrink-0" />
              <span className="text-sm font-medium">
                You are {typeof job.match === "string" ? job.match : "a"} matched to this job
              </span>
            </div>
          </div>

          <div className="mt-3 text-right text-xs text-blue-400 relative z-10">
            Posted {job.created_at ? new Date(job.created_at).toLocaleDateString() : "N/A"}
          </div>
        </motion.div>
      ))}
      <div className="flex justify-center mt-6 gap-2">
        <button
          className="px-3 py-1 rounded border bg-blue-50 text-blue-700 border-blue-200 disabled:opacity-50"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`px-3 py-1 rounded border ${page === i + 1 ? "bg-blue-200 text-blue-800 font-bold" : "bg-blue-50 text-blue-700"} border-blue-200`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 rounded border bg-blue-50 text-blue-700 border-blue-200 disabled:opacity-50"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </motion.div>
  )
}

export default JobCards
