/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Search, RefreshCw } from "lucide-react"
import { useSession } from "next-auth/react"
import CommunityWarningBanner from "./components/warning-banner"
import CreateJobModal from "./components/community-job-modal"
import CommunityJobCard from "./components/community-job-card"
import Lottie from "lottie-react"
import blueLoader from "../../../../public/animations/blue_loader.json"
import TrendingSidebar from "./components/trending-sidebar"

type CommunityJob = {
  created_at: string
  id: string
  title: string
  company: string
  link: string
  status: "applied" | "found" | "interesting" | "hired"
  description?: string
  upvotes: number
  triedCount: number
  viewCount: number
  commentCount?: number
  shareCount?: number
  saved: boolean
  userUpvoted?: boolean
  userLiked?: boolean
  dislike?: boolean
  haha?: boolean
  wow?: boolean
  userTried?: boolean
  notRecommended?: boolean
  postedBy: {
    name: string
    avatar?: string
    role: string
    course?: string
  }
  createdAt?: string
  hashtags?: string[]
}

type APIJob = CommunityJob & {
  student?: {
    first_name?: string
    last_name?: string
    course?: string
    avatar?: string
    id?: string
  }
  createdAt?: string
  postedBy?: {
    name?: string
    role?: string
    avatar?: string
    course?: string
  }
}

export default function CommunityPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [sortBy, setSortBy] = useState<"trending" | "recent" | "saved">("trending")
  const [searchQuery, setSearchQuery] = useState("")
  const [jobs, setJobs] = useState<CommunityJob[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()
  const studentId = session?.user?.studentId
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [jobToEdit, setJobToEdit] = useState<CommunityJob | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const fetchJobs = () => {
    setLoading(true)
    const url = studentId
      ? `/api/community-page/displayJobs?studentId=${studentId}`
      : "/api/community-page/displayJobs"
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const jobsArr = Array.isArray(data.jobs) ? data.jobs : []
        setJobs(
          jobsArr.map((job: APIJob) => {
            const hasStudent = job.student !== undefined
            const student = hasStudent ? job.student : undefined
            const hasPostedBy = job.postedBy !== undefined
            const postedBy = hasPostedBy ? job.postedBy : undefined
            return {
              ...job,
              created_at: job.created_at ?? job.createdAt ?? "",
              postedBy: postedBy ?? {
                name:
                  student?.first_name && student?.last_name
                    ? `${student.first_name} ${student.last_name}`
                    : "Unknown",
                role: student?.course ?? "Unknown",
                avatar: student?.avatar ?? undefined,
              },
            }
          }),
        )
        setLoading(false)
        setRefreshing(false)
      })
      .catch(() => {
        setLoading(false)
        setRefreshing(false)
      })
  }

  useEffect(() => {
    fetchJobs()
  }, [studentId])

  const filteredJobs = jobs
    .filter((job) =>
      selectedTag
        ? job.hashtags?.includes(selectedTag)
        : searchQuery === ""
        ? true
        : job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .filter((job) => {
      if (sortBy === "saved") {
        return job.saved
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === "trending") {
        return b.upvotes + b.triedCount - (a.upvotes + a.triedCount)
      } else if (sortBy === "recent") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      } else {
        return 0
      }
    })

  const updateJobReaction = async (jobId: string, type: string, action: "add" | "remove") => {
    if (!studentId) return
    await fetch("/api/community-page/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        job_id: jobId,
        student_id: studentId,
        metric: type,
        action,
      }),
    })
    setJobs((prevJobs) =>
      prevJobs.map((job) => {
        if (job.id !== jobId) return job
        const updated = { ...job }
        if (type === "upvote") updated.userUpvoted = action === "add"
        if (type === "like") updated.userLiked = action === "add"
        if (type === "dislike") updated.dislike = action === "add"
        if (type === "haha") updated.haha = action === "add"
        if (type === "wow") updated.wow = action === "add"
        if (type === "tried") updated.userTried = action === "add"
        if (type === "not_recommended") updated.notRecommended = action === "add"
        return updated
      }),
    )
  }

  const saveJob = async (jobId: string, isSaved: boolean) => {
    if (!studentId) return
    await fetch("/api/community-page/saveJobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId,
        studentId,
        action: isSaved ? "save" : "unsave",
      }),
    })
    setJobs((prevJobs) =>
      prevJobs.map((job) => (job.id === jobId ? { ...job, saved: isSaved } : job)),
    )
  }

  // Replace the addJob function with one that prepends the new job
  const addJob = (newJob: CommunityJob) => {
    setJobs((prev) => [newJob, ...prev])
  }

  const handleEditJob = (job: CommunityJob) => {
    setJobToEdit(job)
    setEditModalOpen(true)
  }

  const handleDeleteJob = async (jobId: string) => {
    await fetch("/api/community-page/deleteJob", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    })
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId))
  }

  const handleEditSubmit = async (data: {
    title: string
    company: string
    link: string
    status: "applied" | "found" | "interesting" | "hired"
    description?: string
    hashtags?: string[]
    id?: string
  }) => {
    await fetch("/api/community-page/editJob", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === data.id
          ? {
              ...job,
              ...data,
            }
          : job
      ),
    )
    setEditModalOpen(false)
    setJobToEdit(null)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchJobs()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-slate-50">
      <CommunityWarningBanner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-600 via-blue-500 to-sky-500 rounded-2xl shadow-lg p-6 sticky top-20 group hover:shadow-xl transition-all duration-300 overflow-hidden relative z-20"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />
              <div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors"
                >
                  <span className="text-2xl">✨</span>
                </motion.div>
                <h3 className="text-white font-bold text-lg mb-2">Share a Gem</h3>
                <p className="text-white/80 text-sm mb-6 leading-relaxed">
                  Found an amazing job? Share it with the community and help others!
                </p>
                <motion.button
                  whileHover={{ scale: 1.05, translateY: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsCreateModalOpen(true)}
                  className="w-full bg-white hover:bg-slate-50 text-blue-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl active:shadow-md"
                >
                  <Plus className="w-5 h-5" />
                  Post New Opportunity
                </motion.button>
              </div>
            </motion.div>
            <div>
              <TrendingSidebar onTagClick={(tag) => setSelectedTag(tag)} />
            </div>
          </div>
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-blue-100/50 p-5 mb-8 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-sky-50 rounded-full px-5 py-3.5 mb-5 border border-blue-100/50 focus-within:border-blue-300 transition-colors">
                <Search className="w-5 h-5 text-blue-500" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, keywords..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setSelectedTag(null)
                  }}
                  className="flex-1 bg-transparent outline-none text-base placeholder:text-gray-500 font-medium"
                />
                {selectedTag && (
                  <button
                    type="button"
                    className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full"
                    onClick={() => setSelectedTag(null)}
                  >
                    Clear tag: {selectedTag}
                  </button>
                )}
              </div>
              <div className="flex gap-2 flex-wrap items-center">

                {["trending", "recent", "saved"].map((id) => (
                  <motion.button
                    key={id}
                    whileHover={{ scale: 1.08, translateY: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSortBy(id as "trending" | "recent" | "saved")}
                    className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
                      sortBy === id
                        ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-400/30"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                    }`}
                  >
                    {id.charAt(0).toUpperCase() + id.slice(1)}{" "}
                    {id === "trending" ? "🔥" : id === "recent" ? "✨" : "⭐"}
                  </motion.button>
                ))}
                <button
                  type="button"
                  className="ml-auto p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  aria-label="Refresh jobs"
                  style={{ marginLeft: "auto" }}
                >
                  <RefreshCw className={`w-5 h-5 text-blue-600 ${refreshing ? "animate-spin" : ""}`} />
                </button>
              </div>
            </motion.div>
            <div className="space-y-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-32 h-32">
                    <Lottie animationData={blueLoader} loop={true} />
                  </div>
                </div>
              ) : filteredJobs.length === 0 && sortBy === "saved" ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-16 text-center shadow-sm border border-yellow-100"
                >
                  <div className="text-6xl mb-4">⭐</div>
                  <p className="text-gray-700 text-lg font-semibold mb-2">No saved jobs yet!</p>
                  <p className="text-gray-600">Save jobs to see them here.</p>
                </motion.div>
              ) : filteredJobs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl p-16 text-center shadow-sm border border-blue-100"
                >
                  <div className="text-6xl mb-4">🌍</div>
                  <p className="text-gray-700 text-lg font-semibold mb-2">No jobs found yet!</p>
                  <p className="text-gray-600">Be the first to share an opportunity with the community.</p>
                </motion.div>
              ) : (
                filteredJobs.map((job, index) => (
                  <motion.div
                    key={job.id ?? `job-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <CommunityJobCard
                      job={job}
                      onReaction={updateJobReaction}
                      onSave={saveJob}
                      onEdit={handleEditJob}
                      onDelete={handleDeleteJob}
                    />
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      {isCreateModalOpen && (
        <CreateJobModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={async (jobData: any) => {
            // Save job to backend and get the created job object
            const res = await fetch("/api/community-page/createJob", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(jobData),
            })
            if (res.ok) {
              const { job: createdJob } = await res.json()
              addJob(createdJob)
            }
            setIsCreateModalOpen(false)
          }}
        />
      )}
      {editModalOpen && jobToEdit && (
        <CreateJobModal
          onClose={() => {
            setEditModalOpen(false)
            setJobToEdit(null)
          }}
          onSubmit={handleEditSubmit}
          jobToEdit={jobToEdit}
          editMode={true}
        />
      )}
    </div>
  )
}
