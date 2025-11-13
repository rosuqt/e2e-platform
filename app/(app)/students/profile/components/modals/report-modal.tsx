"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ReportModal({ isOpen, onClose }: ReportModalProps) {
  const [step, setStep] = useState<"form" | "success">("form")

  const [formData, setFormData] = useState({
    problem: "",
    description: "",
    severity: "medium",
    browser: "",
    page: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setStep("form")
      setFormData({
        problem: "",
        description: "",
        severity: "medium",
        browser: "",
        page: ""
      })
      setIsSubmitting(false)
    }
  }, [isOpen])

  const handleClose = () => {
    if (isSubmitting) return
    onClose()
  }

  const handleSubmit = async () => {
    if (!formData.problem.trim()) {
      alert("Please describe the problem you encountered")
      return
    }
    if (!formData.description.trim()) {
      alert("Please provide a detailed description")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/bug-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
        
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Failed to submit bug")

      // ✅ Show success screen
      setStep("success")
    } catch (err) {
      alert(`Failed to submit bug report: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const severityOptions = [
    { value: "low", label: "Low", icon: "🟡", description: "Minor issue, doesn't affect core functionality" },
    { value: "medium", label: "Medium", icon: "🟠", description: "Moderate issue, some functionality affected" },
    { value: "high", label: "High", icon: "🔴", description: "Major issue, significant functionality broken" },
    { value: "critical", label: "Critical", icon: "💥", description: "Critical issue, app unusable" }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black bg-opacity-60">
      {/* Background overlay */}
      <div className="absolute inset-0" onClick={handleClose} />

      <AnimatePresence>
        {step === "form" && (
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-2xl">
              <h2 className="text-xl font-bold">Report a Bug</h2>
              <p className="text-red-100 text-sm">Help us improve by reporting issues</p>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6">
              {/* Problem Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What's the problem? *</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="e.g., Login button not working"
                  value={formData.problem}
                  onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description *</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  rows={4}
                  placeholder="Steps to reproduce, expected behavior..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Severity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Severity Level</label>
                <div className="grid grid-cols-1 gap-2">
                  {severityOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                        formData.severity === option.value
                          ? "border-red-500 bg-red-50 ring-1 ring-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="severity"
                        value={option.value}
                        checked={formData.severity === option.value}
                        onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-3 flex-1">
                        <span className="text-xl">{option.icon}</span>
                        <div>
                          <div className="font-medium text-gray-900">{option.label}</div>
                          <div className="text-xs text-gray-500">{option.description}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Optional */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Browser (optional)"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  value={formData.browser}
                  onChange={(e) => setFormData({ ...formData, browser: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Page (optional)"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  value={formData.page}
                  onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                className="flex-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                onClick={handleSubmit}
                disabled={!formData.problem.trim() || !formData.description.trim() || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Bug Report"}
              </button>
            </div>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">🎉 Thank you!</h3>
            <p className="text-gray-600 mb-6">
              Your bug report has been submitted. We’ll look into it right away.
            </p>
            <button
              className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-medium"
              onClick={handleClose}
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
