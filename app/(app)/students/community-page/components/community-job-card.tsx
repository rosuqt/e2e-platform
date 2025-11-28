"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ThumbsUp,
  Bookmark,
  Eye,
  ExternalLink,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react"
import { FaGraduationCap, FaLaughSquint } from "react-icons/fa"
import { AiFillLike, AiFillDislike, AiOutlineLike } from "react-icons/ai"
import { FaHeart } from "react-icons/fa"
import { BiSolidLaugh, BiSolidShocked } from "react-icons/bi"
import { IoMdCloseCircleOutline, IoMdCloseCircle } from "react-icons/io"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { ShareModal } from "../../../employers/jobs/post-a-job/components/share-modal"
import { createPortal } from "react-dom"
import { BsCheckCircle, BsCheckCircleFill } from "react-icons/bs"
import { useSession } from "next-auth/react"
import { Dialog } from "@/components/ui/dialog"

interface CommunityJob {
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
  userTried?: boolean
  userLiked?: boolean
  dislike?: boolean
  haha?: boolean
  wow?: boolean
  notRecommended?: boolean
  postedBy: {
    name: string
    avatar?: string
    role: string
    course?: string
    studentId?: string
  }
  createdAt?: string
  hashtags?: string[]
}

interface CommunityJobCardProps {
  job: CommunityJob
  onReaction: (
    jobId: string,
    type: "upvote" | "like" | "tried" | "dislike" | "haha" | "wow" | "not_recommended",
    action: "add" | "remove"
  ) => void
  onSave: (jobId: string, isSaved: boolean) => void
  onEdit?: (job: CommunityJob) => void
  onDelete?: (jobId: string) => void
}

const statusConfig = {
  applied: {
    label: "I’ve Applied",
    description: "I’ve already sent my application for this role.",
    color: "border-blue-500 bg-gradient-to-r from-blue-50 to-sky-50",
    emoji: "✅",
  },
  found: {
    label: "Found Something Promising",
    description: "I came across this and thought it looked like a great opportunity.",
    color: "border-blue-500 bg-gradient-to-r from-blue-50 to-sky-50",
    emoji: "🎯",
  },
  interesting: {
    label: "Looks Interesting",
    description: "This job caught my eye — sharing it here in case others find it useful too!",
    color: "border-blue-500 bg-gradient-to-r from-blue-50 to-sky-50",
    emoji: "⭐",
  },
  hired: {
    label: "I Was Hired Here",
    description: "I actually got hired for this position before — wanted to share it here!",
    color: "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50",
    emoji: "🏆",
  },
}

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (typeof window === "undefined" && process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
  ""

export default function CommunityJobCard({ job, onReaction, onSave, onEdit, onDelete }: CommunityJobCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [likeDialogOpen, setLikeDialogOpen] = useState(false)
  const [likeDialogPos, setLikeDialogPos] = useState<{ x: number; y: number } | null>(null)
  const [selectedReaction, setSelectedReaction] = useState<"" | "like" | "heart" | "dislike" | "haha" | "wow">("")
  const [activeTried, setActiveTried] = useState(job.userTried)
  const [activeNotRecommended, setActiveNotRecommended] = useState(job.notRecommended)
  const [comments, setComments] = useState<
    {
      id: string
      job_id: string
      student_id: string
      comment_text: string
      created_at?: string
      postedBy?: {
        name?: string
        avatar?: string
      }
    }[]
  >([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentSubmitting, setCommentSubmitting] = useState(false)
  const [editCommentId, setEditCommentId] = useState<string | null>(null)
  const [editCommentText, setEditCommentText] = useState("")
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  const [showAllTags, setShowAllTags] = useState(false)
  const [showAllDescription, setShowAllDescription] = useState(false)
  const descriptionLimit = 180

  const [expandedComments, setExpandedComments] = useState<{ [id: string]: boolean }>({})
  const commentLimit = 120

  const likeDialogTimeout = useRef<NodeJS.Timeout | null>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()
  const studentId = session?.user?.studentId

  const [hasViewed, setHasViewed] = useState(false)

  const handleLikeDialogEnter = () => {
    if (likeDialogTimeout.current) clearTimeout(likeDialogTimeout.current)
    setLikeDialogOpen(true)
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setLikeDialogPos({ x: rect.left + rect.width / 2, y: rect.bottom })
    }
  }
  const handleLikeDialogLeave = () => {
    likeDialogTimeout.current = setTimeout(() => {
      setLikeDialogOpen(false)
      setLikeDialogPos(null)
    }, 120)
  }
  const config =
    statusConfig[job.status] ??
    {
      label: "Unknown",
      description: "",
      color: "border-gray-300 bg-gray-50",
      emoji: "❓",
    }

  const formatDate = (date: string) => {
    if (!date) return ""
    const d = new Date(date)
    if (isNaN(d.getTime())) return ""
    const month = d.toLocaleString("default", { month: "long" })
    const day = d.getDate()
    const year = d.getFullYear()
    let hour = d.getHours()
    const min = String(d.getMinutes()).padStart(2, "0")
    const ampm = hour >= 12 ? "PM" : "AM"
    hour = hour % 12
    hour = hour === 0 ? 12 : hour
    return `${month} ${day}, ${year} ${hour}:${min} ${ampm}`
  }

  function getCourseBadge(course?: string) {
    if (!course) return null
    let color = "bg-gray-100 text-gray-700"
    if (course === "BS - Information Technology") color = "bg-blue-100 text-blue-700"
    else if (course === "BS - Hospitality Management") color = "bg-pink-100 text-pink-700"
    else if (course === "BS - Tourism") color = "bg-yellow-100 text-yellow-700"
    else if (course === "BS - Business Administrator") color = "bg-purple-100 text-purple-700"
    return (
      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${color}`}>
        <FaGraduationCap className="w-4 h-4" />
        {course}
      </span>
    )
  }

  function getProfileImg(avatar?: string) {
    let src = avatar
    if (src && !/^https?:\/\//.test(src)) {
      src = `${BASE_URL}${src.startsWith("/") ? "" : "/"}${src}`
    }
    if (!src) return (
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
        {(job.company?.charAt(0) ?? "?").toUpperCase()}
      </div>
    )
    return (
      <img
        src={src}
        alt="Profile"
        className="w-14 h-14 rounded-full object-cover shadow-lg border-2 border-blue-200"
      />
    )
  }

  const handleReactionChange = (type: "like" | "heart" | "dislike" | "haha" | "wow") => {
    if (selectedReaction === type) {
      if (type === "like" && job.userUpvoted) {
        onReaction(job.id, "upvote", "remove")
      }
      if (type === "heart" && job.userLiked) {
        onReaction(job.id, "like", "remove")
      }
      if (type === "dislike" && job.dislike) {
        onReaction(job.id, "dislike", "remove")
      }
      if (type === "haha" && job.haha) {
        onReaction(job.id, "haha", "remove")
      }
      if (type === "wow" && job.wow) {
        onReaction(job.id, "wow", "remove")
      }
      setSelectedReaction("")
    } else {
      setSelectedReaction(type)
      if (type === "like") onReaction(job.id, "upvote", "add")
      else if (type === "heart") onReaction(job.id, "like", "add")
      else if (type === "dislike") onReaction(job.id, "dislike", "add")
      else if (type === "haha") onReaction(job.id, "haha", "add")
      else if (type === "wow") onReaction(job.id, "wow", "add")
    }
    setLikeDialogOpen(false)
  }

  const handleTriedClick = () => {
    setActiveTried(!activeTried)
    onReaction(job.id, "tried", job.userTried ? "remove" : "add")
  }
  const handleNotRecommendedClick = () => {
    setActiveNotRecommended(!activeNotRecommended)
    onReaction(job.id, "not_recommended", activeNotRecommended ? "remove" : "add")
  }

  useEffect(() => {
    if (showComments) {
      setCommentsLoading(true)
      fetch(`/api/community-page/comments?jobId=${job.id}`)
        .then(res => res.json())
        .then(data => {
          setComments(Array.isArray(data.comments) ? data.comments : [])
          setCommentsLoading(false)
        })
        .catch(() => setCommentsLoading(false))
    }
  }, [showComments, job.id])

  const handlePostComment = async () => {
    if (!commentText || !studentId) return
    setCommentSubmitting(true)
    await fetch("/api/community-page/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        job_id: job.id,
        student_id: studentId,
        comment_text: commentText,
      }),
    })
    setCommentText("")
    setCommentSubmitting(false)
    fetch(`/api/community-page/comments?jobId=${job.id}`)
      .then(res => res.json())
      .then(data => setComments(Array.isArray(data.comments) ? data.comments : []))
  }

  const handleEditComment = async () => {
    if (!editCommentText || !studentId || !editCommentId) return
    setCommentSubmitting(true)
    await fetch("/api/community-page/comments", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editCommentId,
        student_id: studentId,
        comment_text: editCommentText,
      }),
    })
    setEditCommentId(null)
    setEditCommentText("")
    setCommentSubmitting(false)
    fetch(`/api/community-page/comments?jobId=${job.id}`)
      .then(res => res.json())
      .then(data => setComments(Array.isArray(data.comments) ? data.comments : []))
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!studentId) return
    await fetch("/api/community-page/comments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: commentId,
        student_id: studentId,
      }),
    })
    fetch(`/api/community-page/comments?jobId=${job.id}`)
      .then(res => res.json())
      .then(data => setComments(Array.isArray(data.comments) ? data.comments : []))
  }

  const fetchUserAvatar = useCallback(async () => {
    if (!studentId) return
    const res = await fetch(`/api/community-page/getStudentProfileImg?studentId=${studentId}`)
    if (res.ok) {
      const { avatar } = await res.json()
      let src = avatar
      if (src && !/^https?:\/\//.test(src)) {
        src = `${BASE_URL}${src.startsWith("/") ? "" : "/"}${src}`
      }
      setUserAvatar(src || null)
    }
  }, [studentId])

  useEffect(() => {
    fetchUserAvatar()
  }, [fetchUserAvatar])

  const hashtags = Array.isArray(job.hashtags) ? job.hashtags : []
  const maxTags = 5
  const displayedTags = showAllTags ? hashtags : hashtags.slice(0, maxTags)

  const tagColors = [
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-yellow-100 text-yellow-700",
    "bg-purple-100 text-purple-700",
    "bg-pink-100 text-pink-700",
    "bg-orange-100 text-orange-700",
    "bg-indigo-100 text-indigo-700",
    "bg-red-100 text-red-700",
  ]

  const [showDeleteWarning, setShowDeleteWarning] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleCardHover = async () => {
    if (!hasViewed && studentId && job.id) {
      setHasViewed(true)
      await fetch("/api/community-page/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: job.id,
          student_id: studentId,
          metric: "view",
        }),
      })
    }
  }

  useEffect(() => {
    if (job.userUpvoted) setSelectedReaction("like")
    else if (job.userLiked) setSelectedReaction("heart")
    else if (job.dislike) setSelectedReaction("dislike")
    else if (job.haha) setSelectedReaction("haha")
    else if (job.wow) setSelectedReaction("wow")
    else setSelectedReaction("")
  }, [job.userUpvoted, job.userLiked, job.dislike, job.haha, job.wow])

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl border border-blue-100/50 overflow-hidden transition-all duration-300 hover:border-blue-200"
        whileHover={{ y: -4 }}
        onMouseEnter={handleCardHover}
      >
        {/* Card Header */}
        <div className="p-5 border-b border-blue-50/50 bg-gradient-to-r from-white via-blue-50/30 to-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-1">
              {getProfileImg(job.postedBy?.avatar)}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-gray-900">{job.postedBy?.name ?? "Unknown"}</h3>
                  {getCourseBadge(job.postedBy?.course)}
                </div>
                <p className="text-xs text-gray-500 mt-1">Posted {formatDate(job.created_at)}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-blue-100 rounded-full transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5 text-gray-600" />
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setShareModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </DropdownMenuItem>
                {job.postedBy?.studentId === studentId && (
                  <>
                    <DropdownMenuItem
                      onClick={() => {
                        if (onEdit) onEdit(job)
                      }}
                      className="flex items-center gap-2"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowDeleteWarning(true)}
                      className="flex items-center gap-2 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Job Title and Company */}
          <div className="mb-3">
            <h2 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {job.title}
            </h2>
            <p className="text-sm text-gray-600 font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              {job.company}
            </p>
          </div>

          {/* Status Badge  */}
          <div className="flex items-center gap-2 mt-3">
            <div
              className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${config.color}`}
            >
              <span className="text-xl">{config.emoji}</span>
              <div>
                <div className="font-bold text-gray-900">{config.label}</div>
                {config.description && (
                  <div className="text-sm text-gray-600">{config.description}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 border-b border-blue-50/50">
          {job.description && (
            <div>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                {showAllDescription || job.description.length <= descriptionLimit
                  ? job.description
                  : <>
                      {job.description.slice(0, descriptionLimit)}
                      ...{' '}
                      <button
                        type="button"
                        className="text-xs text-blue-600"
                        onClick={() => setShowAllDescription(v => !v)}
                      >
                        Show more
                      </button>
                    </>
                }
                {showAllDescription && job.description.length > descriptionLimit && (
                  <>
                    {' '}
                    <button
                      type="button"
                      className="text-xs text-blue-600"
                      onClick={() => setShowAllDescription(v => !v)}
                    >
                      Show less
                    </button>
                  </>
                )}
              </p>
            </div>
          )}
          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-end mb-2">
              {displayedTags.map((tag, idx) => (
                <motion.span
                  key={tag + idx}
                  whileHover={{ scale: 1.15 }}
                  className={`${tagColors[idx % tagColors.length]} px-2 py-1 rounded-full text-xs font-semibold shadow-sm`}
                  style={{ pointerEvents: "none" }}
                >
                  {tag}
                </motion.span>
              ))}
              {hashtags.length > maxTags && (
                <button
                  type="button"
                  className="text-xs text-blue-600 underline ml-2"
                  onClick={() => setShowAllTags(v => !v)}
                >
                  {showAllTags ? "View less" : "View more"}
                </button>
              )}
            </div>
          )}

          {/* Engagement Metrics */}
          <div className="grid grid-cols-3 gap-2 mb-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg p-3 border border-blue-100/50">
            <div className="flex flex-col items-center justify-center">
              <Eye className="w-4 h-4 text-blue-600 mb-1" />
              <span className="text-xs font-bold text-gray-900">{job.viewCount}</span>
              <span className="text-xs text-gray-600">Views</span>
            </div>
            <div className="flex flex-col items-center justify-center border-l border-r border-blue-200">
              <MessageCircle className="w-4 h-4 text-blue-600 mb-1" />
              <span className="text-xs font-bold text-gray-900">{job.commentCount || 0}</span>
              <span className="text-xs text-gray-600">Comments</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Share2 className="w-4 h-4 text-blue-600 mb-1" />
              <span className="text-xs font-bold text-gray-900">{job.shareCount || 0}</span>
              <span className="text-xs text-gray-600">Shares</span>
            </div>
          </div>

          {/* External Link Button - CHANGE: More playful with gradient and better interaction */}
          <motion.a
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl active:shadow-md"
          >
            View Full Job Posting
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-3 border-b border-blue-50/50 flex items-center justify-between flex-wrap gap-2">
          {[
            {
              id: "upvote",
              icon: ThumbsUp,
              label:
                selectedReaction === "like"
                  ? "Like"
                  : selectedReaction === "heart"
                  ? "Heart"
                  : selectedReaction === "dislike"
                  ? "Dislike"
                  : selectedReaction === "haha"
                  ? "Haha"
                  : selectedReaction === "wow"
                  ? "Wow"
                  : "Like",
              isActive: job.userUpvoted || job.userLiked || job.dislike || job.haha || job.wow,
              onClick: () => {
                if (selectedReaction === "like") {
                  onReaction(job.id, "upvote", "remove")
                  setSelectedReaction("")
                } else if (selectedReaction === "heart") {
                  onReaction(job.id, "like", "remove")
                  setSelectedReaction("")
                } else if (selectedReaction === "dislike") {
                  onReaction(job.id, "dislike", "remove")
                  setSelectedReaction("")
                } else if (selectedReaction === "haha") {
                  onReaction(job.id, "haha", "remove")
                  setSelectedReaction("")
                } else if (selectedReaction === "wow") {
                  onReaction(job.id, "wow", "remove")
                  setSelectedReaction("")
                } else {
                  setSelectedReaction("like")
                  onReaction(job.id, "upvote", "add")
                }
              },
              activeColor:
                selectedReaction === "like"
                  ? "bg-blue-100 text-blue-700"
                  : selectedReaction === "heart"
                  ? "bg-red-100 text-red-600"
                  : selectedReaction === "dislike"
                  ? "bg-red-100 text-[#47413cff]"
                  : selectedReaction === "haha"
                  ? "bg-yellow-100 text-yellow-600"
                  : selectedReaction === "wow"
                  ? "bg-black text-orange-400"
                  : "",
              color: "text-gray-600",
              custom: true,
            },
            {
              id: "tried",
              icon: activeTried || job.userTried
                ? () => <BsCheckCircleFill className="w-5 h-5" color="#22c55e" />
                : () => <BsCheckCircle className="w-5 h-5" color="#64748b" />,
              label: `Tried It`,
              isActive: activeTried || job.userTried,
              onClick: handleTriedClick,
              activeColor: "bg-green-100 text-green-700",
              color: "text-gray-600",
            },
            {
              id: "not-recommended",
              icon: activeNotRecommended
                ? () => <IoMdCloseCircle className="w-5 h-5" color="#ef4444" />
                : () => <IoMdCloseCircleOutline className="w-5 h-5" color="#64748b" />,
              label: "Disapprove",
              isActive: activeNotRecommended,
              onClick: handleNotRecommendedClick,
              activeColor: "bg-red-100 text-red-600",
              color: "text-gray-600",
            },
            {
              id: "comment",
              icon: MessageCircle,
              label: "Comment",
              isActive: showComments,
              onClick: () => setShowComments(!showComments),
              activeColor: "bg-purple-100 text-purple-700",
              color: "text-gray-600",
            },
            {
              id: "save",
              icon: Bookmark,
              label: "Save",
              isActive: job.saved,
              onClick: () => onSave(job.id, !job.saved),
              activeColor: "bg-blue-100 text-blue-700",
              color: "text-gray-600",
            },
          ].map(({ id, icon: Icon, label, isActive, onClick, activeColor, color }) => {
            let renderedIcon
            if (id === "tried" || id === "not-recommended") {
              renderedIcon = <Icon />
            } else if (id === "upvote") {
              renderedIcon = null
            } else {
              renderedIcon = Icon ? <Icon className="w-5 h-5" fill={isActive ? "currentColor" : "none"} /> : null
            }
            return id === "upvote" ? (
              <div
                key={id}
                className="relative flex-1 z-10 flex"
                ref={buttonRef}
                onMouseEnter={handleLikeDialogEnter}
                onMouseLeave={handleLikeDialogLeave}
                style={{ minWidth: 0 }}
              >
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={onClick}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all justify-center w-full h-full ${
                    isActive ? activeColor : `${color} hover:bg-gray-100`
                  }`}
                  style={{ minWidth: "120px" }}
                >
                  <motion.span
                    key={selectedReaction}
                    initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
                    animate={{ scale: 1.1, rotate: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="flex items-center"
                  >
                    {selectedReaction === "like" && <AiFillLike className="w-5 h-5" color="#2563eb" />}
                    {selectedReaction === "" && <AiOutlineLike className="w-5 h-5" color="#64748b" />}
                    {selectedReaction === "heart" && <FaHeart className="w-5 h-5" color="#ef4444" />}
                    {selectedReaction === "dislike" && <AiFillDislike className="w-5 h-5" color="#47413cff" />}
                    {selectedReaction === "haha" && <BiSolidLaugh className="w-5 h-5" color="#facc15" />}
                    {selectedReaction === "wow" && <BiSolidShocked className="w-5 h-5" color="#f071ddff" />}
                  </motion.span>
                  <span>{label}</span>
                </motion.button>
                {likeDialogOpen && likeDialogPos &&
                  createPortal(
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      style={{
                        position: "fixed",
                        left: likeDialogPos.x,
                        top: likeDialogPos.y + 12,
                        transform: "translate(-50%, 0)",
                        zIndex: 9999,
                      }}
                      className="bg-white border border-blue-100 rounded-xl shadow-lg px-4 py-3 flex gap-4"
                      onMouseEnter={handleLikeDialogEnter}
                      onMouseLeave={handleLikeDialogLeave}
                    >
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.2 }}
                        className="flex flex-col items-center gap-1"
                        onClick={() => handleReactionChange("like")}
                      >
                        <AiFillLike className="w-7 h-7" color="#2563eb" />
                        <span className="text-xs text-blue-700 font-bold">Like</span>
                      </motion.button>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.2 }}
                        className="flex flex-col items-center gap-1"
                        onClick={() => handleReactionChange("heart")}
                      >
                        <FaHeart className="w-7 h-7" color="#ef4444" />
                        <span className="text-xs text-red-600 font-bold">Heart</span>
                      </motion.button>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.2 }}
                        className="flex flex-col items-center gap-1"
                        onClick={() => handleReactionChange("dislike")}
                      >
                        <AiFillDislike className="w-7 h-7" color="#47413cff" />
                        <span className="text-xs text-[#47413cff] font-bold">Dislike</span>
                      </motion.button>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.2 }}
                        className="flex flex-col items-center gap-1"
                        onClick={() => handleReactionChange("haha")}
                      >
                        <FaLaughSquint  className="w-7 h-7" color="#facc15" />
                        <span className="text-xs text-yellow-600 font-bold">Haha</span>
                      </motion.button>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.2 }}
                        className="flex flex-col items-center gap-1"
                        onClick={() => handleReactionChange("wow")}
                      >
                        <BiSolidShocked className="w-8 h-8" color="#f071ddff" />
                        <span className="text-xs text-[#f071ddff] font-bold">Wow</span>
                      </motion.button>
                    </motion.div>,
                    document.body
                  )
                }
              </div>
            ) : (
              <motion.button
                key={id}
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={onClick}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all flex-1 justify-center ${
                  isActive ? activeColor : `${color} hover:bg-gray-100`
                }`}
              >
                {renderedIcon}
                <span>{label}</span>
              </motion.button>
            )
          })}
        </div>
        {/* Comments Section - CHANGE: Smoother animations and better styling */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-5 py-4 bg-gradient-to-b from-blue-50/50 to-white border-t border-blue-50/50"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  {userAvatar ? (
                    <img src={userAvatar} alt="User avatar" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {(job.company?.charAt(0) ?? "?").toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    {editCommentId ? (
                      <>
                        <input
                          type="text"
                          placeholder="Edit your comment..."
                          value={editCommentText}
                          onChange={e => setEditCommentText(e.target.value)}
                          className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                        <motion.button
                          type="button"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onClick={handleEditComment}
                          disabled={commentSubmitting}
                          className="mt-2 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg"
                        >
                          Save
                        </motion.button>
                        <motion.button
                          type="button"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onClick={() => setEditCommentId(null)}
                          className="mt-2 ml-2 bg-gray-100 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg"
                        >
                          Cancel
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <input
                          type="text"
                          placeholder="Share your thoughts..."
                          value={commentText}
                          onChange={e => setCommentText(e.target.value)}
                          className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                        {commentText && (
                          <motion.button
                            type="button"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={handlePostComment}
                            disabled={commentSubmitting}
                            className="mt-2 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center min-w-[90px]"
                          >
                            {commentSubmitting ? (
                              <Loader2 className="animate-spin w-5 h-5" />
                            ) : (
                              "Post"
                            )}
                          </motion.button>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-3 mt-4 bg-white rounded-lg p-3 border border-blue-100">
                  {commentsLoading ? (
                    <div className="space-y-3">
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex items-start gap-3 animate-pulse">
                          <div className="w-8 h-8 rounded-full bg-blue-100" />
                          <div className="flex-1">
                            <div className="bg-blue-50 rounded-lg px-3 py-2">
                              <div className="h-3 w-24 bg-blue-100 rounded mb-2" />
                              <div className="h-4 w-full bg-blue-100 rounded" />
                            </div>
                            <div className="h-3 w-20 bg-blue-100 rounded mt-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : comments.length === 0 ? (
                    <div className="text-sm text-gray-500">No comments yet.</div>
                  ) : (
                    comments.map((c) => (
                      <div key={c.id} className="flex items-start gap-3">
                        {c.postedBy && c.postedBy.avatar ? (
                          <img src={/^https?:\/\//.test(c.postedBy.avatar) ? c.postedBy.avatar : `${BASE_URL}${c.postedBy.avatar.startsWith("/") ? "" : "/"}${c.postedBy.avatar}`} alt="Commenter avatar" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {(c.postedBy?.name?.charAt(0) ?? "?").toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="bg-blue-50 rounded-lg px-3 py-2">
                            <p className="text-xs font-bold text-gray-900">{c.postedBy?.name ?? "Community Member"}</p>
                            <p className="text-sm text-gray-700 mt-1">
                              {expandedComments[c.id] || (c.comment_text?.length ?? 0) <= commentLimit
                                ? <>
                                    {c.comment_text}
                                    {(c.comment_text?.length ?? 0) > commentLimit && expandedComments[c.id] && (
                                      <>
                                        {' '}
                                        <button
                                          type="button"
                                          className="text-xs text-blue-600"
                                          onClick={() =>
                                            setExpandedComments(prev => ({
                                              ...prev,
                                              [c.id]: !prev[c.id]
                                            }))
                                          }
                                        >
                                          Show less
                                        </button>
                                      </>
                                    )}
                                  </>
                                : <>
                                    {c.comment_text.slice(0, commentLimit)}
                                    ...{' '}
                                    <button
                                      type="button"
                                      className="text-xs text-blue-600"
                                      onClick={() =>
                                        setExpandedComments(prev => ({
                                          ...prev,
                                          [c.id]: !prev[c.id]
                                        }))
                                      }
                                    >
                                      Show more
                                    </button>
                                  </>
                              }
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {c.created_at ? formatDate(c.created_at) : ""}
                            {studentId === c.student_id && (
                              <>
                                <button
                                  type="button"
                                  className="ml-2 text-xs text-blue-600 hover:underline"
                                  onClick={() => {
                                    setEditCommentId(c.id)
                                    setEditCommentText(c.comment_text)
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="ml-2 text-xs text-red-600 hover:underline"
                                  onClick={() => handleDeleteComment(c.id)}
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <ShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        shareUrl={job.link}
        jobId={job.id}
      />
      {showDeleteWarning && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <Dialog open={showDeleteWarning} onOpenChange={setShowDeleteWarning}>
            <div className="p-6 max-w-sm w-full bg-white rounded-xl shadow-xl flex flex-col items-center gap-4">
              <Trash2 className="w-10 h-10 text-red-600" />
              <div className="font-bold text-lg text-gray-900">Delete Job?</div>
              <div className="text-gray-600 text-center">
                Are you sure you want to delete this job? This action cannot be undone.
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200"
                  onClick={() => setShowDeleteWarning(false)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 flex items-center justify-center min-w-[90px]"
                  disabled={deleting}
                  onClick={async () => {
                    if (!onDelete) return
                    setDeleting(true)
                    try {
                      await onDelete(job.id)
                      setShowDeleteWarning(false)
                    } finally {
                      setDeleting(false)
                    }
                  }}
                >
                  {deleting ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </Dialog>
        </div>
      )}
    </>
  )
}
