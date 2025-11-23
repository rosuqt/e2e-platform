"use client"

import { useState } from "react"

export interface CommunityJob {
  id: string
  title: string
  company: string
  link: string
  status: "applied" | "found" | "interesting"
  description?: string
  upvotes: number
  triedCount: number
  viewCount: number
  commentCount: number
  shareCount: number
  saved: boolean
  userUpvoted?: boolean
  userTried?: boolean
  userLiked?: boolean
  postedBy: {
    name: string
    avatar?: string
    role: string
  }
  createdAt: string
}

// Mock data for demonstration
const mockJobs: CommunityJob[] = [
  {
    id: "1",
    title: "Senior Full Stack Engineer",
    company: "Vercel",
    link: "https://vercel.com/careers",
    status: "found",
    description: "Amazing opportunity to work on Next.js and modern web technologies. Great team and benefits!",
    upvotes: 24,
    triedCount: 8,
    viewCount: 156,
    commentCount: 5,
    shareCount: 3,
    saved: false,
    userUpvoted: false,
    userTried: false,
    userLiked: false,
    postedBy: {
      name: "Sarah Chen",
      role: "Product Manager",
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "React Developer",
    company: "Stripe",
    link: "https://stripe.com/jobs",
    status: "applied",
    description: "Already applied! Looks very promising based on the job description.",
    upvotes: 18,
    triedCount: 5,
    viewCount: 92,
    commentCount: 3,
    shareCount: 2,
    saved: false,
    userUpvoted: false,
    userTried: false,
    userLiked: false,
    postedBy: {
      name: "Alex Rodriguez",
      role: "Software Engineer",
    },
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    title: "Frontend Engineer",
    company: "Figma",
    link: "https://figma.com/careers",
    status: "interesting",
    upvotes: 12,
    triedCount: 3,
    viewCount: 67,
    commentCount: 2,
    shareCount: 1,
    saved: false,
    userUpvoted: false,
    userTried: false,
    userLiked: false,
    postedBy: {
      name: "Jordan Kim",
      role: "Designer",
    },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export function useCommunityJobs() {
  const [jobs, setJobs] = useState<CommunityJob[]>(mockJobs)
  const [loading, setLoading] = useState(false)

  const addJob = (jobData: {
    title: string
    company: string
    link: string
    status: "applied" | "found" | "interesting"
    description?: string
  }) => {
    const newJob: CommunityJob = {
      id: Date.now().toString(),
      ...jobData,
      upvotes: 0,
      triedCount: 0,
      viewCount: 1,
      commentCount: 0,
      shareCount: 0,
      saved: false,
      userUpvoted: false,
      userTried: false,
      userLiked: false,
      postedBy: {
        name: "You",
        role: "Student",
      },
      createdAt: new Date().toISOString(),
    }
    setJobs([newJob, ...jobs])
  }

  const updateJobReaction = (jobId: string, type: "upvote" | "tried" | "like", action: "add" | "remove") => {
    setJobs(
      jobs.map((job) => {
        if (job.id === jobId) {
          if (type === "upvote") {
            return {
              ...job,
              upvotes: action === "add" ? job.upvotes + 1 : job.upvotes - 1,
              userUpvoted: action === "add",
            }
          } else if (type === "tried") {
            return {
              ...job,
              triedCount: action === "add" ? job.triedCount + 1 : job.triedCount - 1,
              userTried: action === "add",
            }
          } else if (type === "like") {
            return {
              ...job,
              userLiked: action === "add",
            }
          }
        }
        return job
      }),
    )
  }

  const saveJob = (jobId: string, isSaved: boolean) => {
    setJobs(jobs.map((job) => (job.id === jobId ? { ...job, saved: isSaved } : job)))
  }

  return {
    jobs,
    loading,
    addJob,
    updateJobReaction,
    saveJob,
  }
}
