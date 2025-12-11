"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles, X, LinkIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

type JobStatus = "applied" | "found" | "interesting" | "hired"
type HashtagSuggestion = { emoji: string; tag: string; label: string }
type TopHashtag = { tag: string; count: number }
type HashtagItem = HashtagSuggestion | TopHashtag

interface CreateJobModalProps {
  onClose: () => void
  onSubmit: (data: {
    title: string
    company: string
    link: string
    status: JobStatus
    description?: string
    hashtags?: string[]
    id?: string
  }) => void
  jobToEdit?: {
    id: string
    title: string
    company: string
    link: string
    status: JobStatus
    description?: string
    hashtags?: string[]
  }
  editMode?: boolean
}

export default function CreateJobModal({ onClose, onSubmit, jobToEdit, editMode }: CreateJobModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: jobToEdit?.title || "",
    company: jobToEdit?.company || "",
    link: jobToEdit?.link || "",
    status: jobToEdit?.status || "found",
    description: jobToEdit?.description || "",
    hashtags: jobToEdit?.hashtags || [],
    id: jobToEdit?.id,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [customHashtag, setCustomHashtag] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState("")
  const [hashtagCounts, setHashtagCounts] = useState<Record<string, number>>({})
  const [topHashtags, setTopHashtags] = useState<{ tag: string; count: number }[]>([])
  const [hotTags, setHotTags] = useState<string[]>([])

  const totalSteps = 3

  useEffect(() => {
    fetch("/api/community-page/hashtagCounter")
      .then(res => res.json())
      .then(data => {
        const parsed: Record<string, number> = {}
        Object.entries(data).forEach(([tag, count]) => {
          parsed[tag] = typeof count === "number" ? count : typeof count === "string" ? parseInt(count) : 0
        })
        setHashtagCounts(parsed)
        const arr = Object.entries(parsed)
          .map(([tag, count]) => ({ tag, count }))
          .sort((a, b) => b.count - a.count)
        setTopHashtags(arr.slice(0, 10))
        setHotTags(arr.slice(0, 3).map(t => t.tag))
      })
      .catch(() => {
        setHashtagCounts({})
        setTopHashtags([])
        setHotTags([])
      })
  }, [])

  const validateStep = () => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = "Job title is required"
      if (!formData.company.trim()) newErrors.company = "Company name is required"
      if (!formData.link.trim()) newErrors.link = "Job link is required"
      else if (!isValidUrl(formData.link)) newErrors.link = "Please enter a valid URL"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1)
    }
  }

  const handleHashtagToggle = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      hashtags: prev.hashtags.includes(tag)
        ? prev.hashtags.filter((t) => t !== tag)
        : [...prev.hashtags, tag],
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setApiError("")
    try {
      const url = editMode && jobToEdit?.id
        ? `/api/community-page/editJob`
        : `/api/community-page/addJob`
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const data = await res.json()
        if (typeof data.error === "object" && data.error !== null) {
          setApiError(
            [
              data.error.message,
              data.error.details,
              data.error.hint,
              data.error.code,
            ]
              .filter(Boolean)
              .join(" | ")
          )
        } else {
          setApiError(data.error || "Failed to post job")
        }
        setLoading(false)
        return
      }
      await Promise.resolve(onSubmit(formData))
    } finally {
      setLoading(false)
    }
  }

  const statusOptions: { value: JobStatus; label: string; description: string; emoji: string }[] = [
    {
      value: "applied",
      label: "Have Applied",
      description: "I've already applied to this position",
      emoji: "✅",
    },
    {
      value: "found",
      label: "Found Promising",
      description: "This looks like a great opportunity",
      emoji: "🎯",
    },
    {
      value: "interesting",
      label: "Interesting",
      description: "Worth checking out",
      emoji: "⭐",
    },
    {
      value: "hired",
      label: "Previous Hired",
      description: "I've been hired for this position before",
      emoji: "🏆",
    },
  ]

  const hashtagSuggestions = [
    { emoji: "🔥", tag: "#TrendingNow", label: "Hot opportunities this week" },
    { emoji: "💻", tag: "#TechJobs", label: "Tech Jobs" },
    { emoji: "🎓", tag: "#Internship", label: "Internship" },
    { emoji: "🚀", tag: "#StartupLife", label: "Startup Life" },
    { emoji: "🏠", tag: "#RemoteWork", label: "Remote Work" },
    { emoji: "📊", tag: "#DataScience", label: "Data Science" },
    { emoji: "🌐", tag: "#WebDevelopment", label: "Web Development" },
  ]

  const emojiList = [
    "🔥", "💻", "🎓", "🚀", "🏠", "📊", "🌐", "🦄", "🧠", "🎉", "💡", "🏆", "⭐", "🛠️", "📈", "🧑‍💻", "🕹️", "🗺️", "🧳", "🪐"
  ]

  function getRandomEmoji(tag: string) {
    let hash = 0
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash)
    }
    const idx = Math.abs(hash) % emojiList.length
    return emojiList[idx]
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-600 via-sky-500 to-blue-500 p-6 text-white flex justify-between items-start relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5" />
              <h2 className="text-2xl font-bold">
                {editMode ? "Edit Modal" : "Share a Gem"}
              </h2>
            </div>
            <p className="text-blue-100 text-sm">
              {editMode ? "Edit your job post details" : "Help the community find their next opportunity"}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-full transition-colors relative z-10"
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        <div className="h-2 bg-gray-200 relative overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 to-sky-500"
            initial={{ width: 0 }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2.5 flex items-center gap-2">
                  <span>💼</span> Job Title <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g., Senior React Developer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`rounded-lg ${errors.title ? "border-red-500" : "border-blue-200 focus:border-blue-400"}`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1.5 font-medium">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2.5 flex items-center gap-2">
                  <span>🏢</span> Company Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g., Triumph"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className={`rounded-lg ${errors.company ? "border-red-500" : "border-blue-200 focus:border-blue-400"}`}
                />
                {errors.company && <p className="text-red-500 text-sm mt-1.5 font-medium">{errors.company}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2.5 flex items-center gap-2">
                  <span>🔗</span> Job Link <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-blue-400" />
                  <Input
                    placeholder="https://..."
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className={`pl-10 rounded-lg ${errors.link ? "border-red-500" : "border-blue-200 focus:border-blue-400"}`}
                  />
                </div>
                {errors.link && <p className="text-red-500 text-sm mt-1.5 font-medium">{errors.link}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3.5 flex items-center gap-2">
                  <span>📍</span> What&rsquo;s your status with this job? <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2.5">
                  {statusOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.02, translateX: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, status: option.value })}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left group ${
                        formData.status === option.value
                          ? "border-blue-500 bg-gradient-to-r from-blue-50 to-sky-50 shadow-md"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{option.emoji}</span>
                        <div>
                          <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {option.label}
                          </div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2.5 flex items-center gap-2">
                  <span>🏷️</span> Hashtags <span className="text-gray-400">(optional)</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold cursor-pointer hover:bg-blue-200"
                      onClick={() => handleHashtagToggle(tag)}
                    >
                      {tag}
                      <X className="w-3 h-3 ml-1" />
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {[...topHashtags, ...hashtagSuggestions.filter(s => !topHashtags.some(h => h.tag === s.tag))]
                    .slice(0, 6)
                    .map((h: HashtagItem) => (
                      <button
                        key={h.tag}
                        type="button"
                        onClick={() => handleHashtagToggle(h.tag)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all text-left text-xs font-semibold
                          {formData.hashtags.includes(h.tag)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/30"}
                        `}
                      >
                        <span className="text-lg">{("emoji" in h ? h.emoji : getRandomEmoji(h.tag))}</span>
                        <span>{h.tag}</span>
                        {hotTags.includes(h.tag) && <span className="text-red-500 font-bold ml-1">Hot</span>}
                        {hashtagCounts[h.tag] !== undefined && (
                          <span className="ml-auto text-gray-400">{hashtagCounts[h.tag]}</span>
                        )}
                      </button>
                    ))}
                </div>
                {!showCustomInput ? (
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(true)}
                    className="mt-2 px-3 py-2 rounded-lg border-2 border-blue-300 text-blue-700 font-semibold text-xs hover:bg-blue-50 transition"
                  >
                    + Add custom hashtag
                  </button>
                ) : (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={customHashtag}
                      onChange={(e) => setCustomHashtag(e.target.value)}
                      placeholder="#YourTag"
                      className="flex-1 px-3 py-2 rounded-lg border-2 border-blue-300 focus:outline-none focus:border-blue-500 text-xs"
                      maxLength={32}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const tag = customHashtag.trim();
                        if (tag && !formData.hashtags.includes(tag)) {
                          setFormData((prev) => ({
                            ...prev,
                            hashtags: [...prev.hashtags, tag.startsWith("#") ? tag : `#${tag}`],
                          }))
                        }
                        setCustomHashtag("")
                        setShowCustomInput(false)
                      }}
                      className="px-3 py-2 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomHashtag("")
                        setShowCustomInput(false)
                      }}
                      className="px-3 py-2 rounded-lg border-2 border-gray-300 text-gray-600 font-semibold text-xs hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2.5 flex items-center gap-2">
                  <span>💬</span> Additional Notes <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  placeholder="Share your thoughts about this opportunity..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3.5 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none hover:border-blue-300 transition-colors"
                  rows={3}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-7">
            {step > 1 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(step - 1)}
                className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-all"
              >
                Back
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-all"
              >
                Cancel
              </motion.button>
            )}

            {step < totalSteps ? (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold hover:from-blue-700 hover:to-sky-600 transition-all shadow-lg hover:shadow-xl"
              >
                Next
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={loading}
                className={`flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold hover:from-green-700 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {loading ? (
                  <span className="animate-spin w-5 h-5 border-2 border-white border-t-blue-200 rounded-full"></span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {editMode ? "Save Changes" : "Share Gem"}
                  </>
                )}
              </motion.button>
            )}
          </div>
          {apiError && (
            <div className="mt-4 text-red-600 text-sm font-semibold bg-red-50 border border-red-200 rounded-lg p-3">
              {apiError}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
