/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, AlertCircle } from "lucide-react"

type DTRDailyLogProps = {
  onClose: () => void
  onSubmit: (data: any) => void
  startDate?: string
}

const absenceReasons = [
  "Sick Leave",
  "Personal Emergency",
  "Family Matters",
  "School Activity",
  "Other"
]

export default function DTRDailyLog({ onClose, onSubmit, startDate }: DTRDailyLogProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    hours: "",
    imageProof: null as File | null,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [isAbsent, setIsAbsent] = useState(false)
  const [absenceReason, setAbsenceReason] = useState(absenceReasons[0])
  const [customReason, setCustomReason] = useState("")

  const todayStr = new Date().toISOString().split("T")[0]
  const minDate = startDate || ""

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, imageProof: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isAbsent) {
      if (!absenceReason) {
        alert("Please select a reason for absence")
        return
      }
      setLoading(true)
      try {
        onSubmit({
          date: formData.date,
          absent: true,
          reason: absenceReason === "Other" ? customReason : absenceReason,
        })
      } finally {
        setLoading(false)
      }
      return
    }
    if (!formData.date || !formData.description || !formData.hours || !formData.imageProof) {
      alert("Please fill in all required fields")
      return
    }
    setLoading(true)
    const submitData = new FormData()
    submitData.append("date", formData.date)
    submitData.append("description", formData.description)
    submitData.append("hours", formData.hours)
    if (formData.imageProof) {
      submitData.append("imageProof", formData.imageProof)
    }
    try {
      onSubmit({
        date: formData.date,
        description: formData.description,
        hours: Number.parseFloat(formData.hours),
        imageProof: imagePreview,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-sky-500 px-6 py-6 flex items-center justify-between rounded-t-2xl z-20">
            <h2 className="text-2xl font-bold text-white">Log Daily Hours</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 ">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                min={minDate}
                max={todayStr}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setIsAbsent(a => !a)}
                className={`absolute top-0 right-0 mt-1 mr-1 px-3 py- rounded-lg text-sm font-semibold transition-colors ${
                  isAbsent
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                }`}
              >
                {isAbsent ? "Back to Log Entry" : "Mark this day as absent"}
              </button>
            </div>
            {!isAbsent && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Hours Completed <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="hours"
                      value={formData.hours}
                      onChange={handleInputChange}
                      placeholder="e.g., 8.5"
                      step="0.5"
                      min="0"
                      max="24"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium mr-5">hrs</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Activity Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe what you did today, tasks completed, accomplishments..."
                    rows={4}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Proof of Work (Image) <span className="text-red-500">*</span>
                  </label>
                  <div
                    className="border-2 border-dashed border-blue-200 rounded-lg p-6 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                      className="hidden"
                    />

                    {imagePreview ? (
                      <div className="text-center">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg mx-auto mb-3"
                        />
                        <p className="text-sm font-medium text-gray-900">Image selected</p>
                        <p className="text-xs text-gray-600 mt-1">Click to change</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-900">Click or drag to upload</p>
                        <p className="text-xs text-gray-600 mt-1">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-900">
                    Provide a clear, verifiable proof of your work completion for accountability and tracking purposes.
                  </p>
                </div>
              </>
            )}
            {isAbsent && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Reason for Absence <span className="text-red-500">*</span>
                </label>
                <select
                  value={absenceReason}
                  onChange={e => setAbsenceReason(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  required
                >
                  {absenceReasons.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
                {absenceReason === "Other" && (
                  <input
                    type="text"
                    value={customReason}
                    onChange={e => setCustomReason(e.target.value)}
                    placeholder="Enter your reason"
                    className="mt-3 w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    required
                  />
                )}
              </div>
            )}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-lg border border-gray-300 text-gray-900 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-blue-300 rounded-full animate-spin"></span>
                ) : (
                  isAbsent ? "Save Absence" : "Save Log"
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
