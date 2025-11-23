"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ThumbsUp,
  Bookmark,
  Eye,
  ExternalLink,
  CheckCircle,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Heart,
  Sparkles,
} from "lucide-react"

interface CommunityJob {
  id: string
  title: string
  company: string
  link: string
  status: "applied" | "found" | "interesting"
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
  postedBy: {
    name: string
    avatar?: string
    role: string
  }
  createdAt: string
}

interface CommunityJobCardProps {
  job: CommunityJob
  onReaction: (jobId: string, type: "upvote" | "tried" | "like", action: "add" | "remove") => void
  onSave: (jobId: string, isSaved: boolean) => void
}

const statusConfig = {
  applied: {
    label: "Applied",
    color: "bg-green-100 text-green-700",
    emoji: "✅",
    accent: "from-green-400 to-emerald-500",
  },
  found: { label: "Promising", color: "bg-blue-100 text-blue-700", emoji: "🎯", accent: "from-blue-400 to-blue-600" },
  interesting: {
    label: "Interesting",
    color: "bg-purple-100 text-purple-700",
    emoji: "⭐",
    accent: "from-purple-400 to-pink-500",
  },
}

export default function CommunityJobCard({ job, onReaction, onSave }: CommunityJobCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [liked, setLiked] = useState(false)
  const config = statusConfig[job.status]

  const formatDate = (date: string) => {
    const now = new Date()
    const posted = new Date(date)
    const diffMs = now.getTime() - posted.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return posted.toLocaleDateString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl border border-blue-100/50 overflow-hidden transition-all duration-300 hover:border-blue-200"
      whileHover={{ y: -4 }}
    >
      {/* Card Header */}
      <div className="p-5 border-b border-blue-50/50 bg-gradient-to-r from-white via-blue-50/30 to-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            {/* CHANGE: Gradient avatar with hover effect */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`w-14 h-14 rounded-full bg-gradient-to-br ${config.accent} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
            >
              {job.company.charAt(0).toUpperCase()}
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-gray-900">{job.postedBy.name}</h3>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${config.color} flex items-center gap-1`}
                >
                  {config.emoji} {job.postedBy.role}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Posted {formatDate(job.createdAt)}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.2, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-blue-100 rounded-full transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </motion.button>
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

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${config.color}`}>
            {config.emoji} {config.label}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 border-b border-blue-50/50">
        {job.description && (
          <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-2">{job.description}</p>
        )}

        {/* Engagement Metrics - CHANGE: Redesigned layout with better visual hierarchy */}
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
          <Sparkles className="w-4 h-4" />
          View Full Job Posting
          <ExternalLink className="w-4 h-4" />
        </motion.a>
      </div>

      {/* Action Buttons - CHANGE: Enhanced design with better spacing and animation */}
      <div className="px-4 py-3 border-b border-blue-50/50 flex items-center justify-between flex-wrap gap-2">
        {[
          {
            id: "upvote",
            icon: ThumbsUp,
            label: `${job.upvotes}`,
            isActive: job.userUpvoted,
            onClick: () => onReaction(job.id, "upvote", job.userUpvoted ? "remove" : "add"),
            activeColor: "bg-blue-100 text-blue-700",
            color: "text-gray-600",
          },
          {
            id: "tried",
            icon: CheckCircle,
            label: `${job.triedCount}`,
            isActive: job.userTried,
            onClick: () => onReaction(job.id, "tried", job.userTried ? "remove" : "add"),
            activeColor: "bg-green-100 text-green-700",
            color: "text-gray-600",
          },
          {
            id: "like",
            icon: Heart,
            label: "Like",
            isActive: job.userLiked,
            onClick: () => onReaction(job.id, "like", job.userLiked ? "remove" : "add"),
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
            id: "share",
            icon: Share2,
            label: "Share",
            isActive: false,
            onClick: () => {},
            activeColor: "",
            color: "text-gray-600",
          },
          {
            id: "save",
            icon: Bookmark,
            label: "Save",
            isActive: job.saved,
            onClick: () => onSave(job.id, !job.saved),
            activeColor: "bg-amber-100 text-amber-700",
            color: "text-gray-600",
          },
        ].map(({ id, icon: Icon, label, isActive, onClick, activeColor, color }) => (
          <motion.button
            key={id}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onClick}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition-all flex-1 justify-center ${
              isActive ? activeColor : `${color} hover:bg-gray-100`
            }`}
          >
            <Icon className="w-5 h-5" fill={isActive ? "currentColor" : "none"} />
            <span>{label}</span>
          </motion.button>
        ))}
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
              {/* Comment Input */}
              <div className="flex items-start gap-3">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Share your thoughts..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  {commentText && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-2 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg"
                    >
                      Post
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Sample Comments */}
              <div className="space-y-3 mt-4 bg-white rounded-lg p-3 border border-blue-100">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500" />
                    <div className="flex-1">
                      <div className="bg-blue-50 rounded-lg px-3 py-2">
                        <p className="text-xs font-bold text-gray-900">Community Member</p>
                        <p className="text-sm text-gray-700 mt-1">This looks like a great opportunity! 🚀</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{i === 1 ? "2h ago" : "1h ago"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
