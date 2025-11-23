"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, LinkIcon, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"

type JobStatus = "applied" | "found" | "interesting"

interface CreateJobModalProps {
  onClose: () => void
  onSubmit: (data: {
    title: string
    company: string
    link: string
    status: JobStatus
    description?: string
  }) => void
}

export default function CreateJobModal({ onClose, onSubmit }: CreateJobModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    link: "",
    status: "found" as JobStatus,
    description: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const totalSteps = 2

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

  const handleSubmit = () => {
    onSubmit(formData)
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
  ]

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CHANGE: Enhanced header with gradient and decorative elements */}
        <div className="bg-gradient-to-r from-blue-600 via-sky-500 to-blue-500 p-6 text-white flex justify-between items-start relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5" />
              <h2 className="text-2xl font-bold">Share a Gem</h2>
            </div>
            <p className="text-blue-100 text-sm">Help the community find their next opportunity</p>
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

        {/* CHANGE: Enhanced progress bar with animation */}
        <div className="h-2 bg-gray-200 relative overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 to-sky-500"
            initial={{ width: 0 }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
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
                  placeholder="e.g., Vercel"
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
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3.5 flex items-center gap-2">
                  <span>📍</span> What's your status with this job? <span className="text-red-500">*</span>
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

          {/* CHANGE: Enhanced buttons with better styling and animations */}
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
                className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold hover:from-green-700 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Share Gem
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
