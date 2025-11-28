/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"

type JobSetupProps = {
  onSubmit: (data: any) => void
}

export default function DTRJobSetup({ onSubmit }: JobSetupProps) {
  const [step, setStep] = useState<"choice" | "form">("choice")
  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    totalHours: "",
    startDate: "",
    externalApplication: false,
  })
  const [loading, setLoading] = useState(false)
  const [seekrJobs, setSeekrJobs] = useState<any[]>([])
  const [seekrSelected, setSeekrSelected] = useState<any | null>(null)

  const handleChoice = async (isExternal: boolean) => {
    if (!isExternal) {
      setLoading(true)
      const res = await fetch("/api/students/dtr/checkApplications")
      const jobs = await res.json()
      console.log("Fetched Seekr jobs:", jobs)
      setSeekrJobs(jobs)
      setSeekrSelected(null)
      setLoading(false)
    } else {
      setFormData((prev) => ({ ...prev, externalApplication: true }))
      setSeekrSelected(null)
    }
    setStep("form")
  }

  const handleSelectSeekrJob = (job: any) => {
    console.log("Selected Seekr job:", job)
    setSeekrSelected(job)
    setFormData({
      jobTitle: job.job_title || "",
      company: job.company_name || "",
      totalHours: "",
      startDate: "",
      externalApplication: false,
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.jobTitle || !formData.company || !formData.totalHours || !formData.startDate) {
      alert("Please fill in all fields")
      return
    }
    onSubmit({
      ...formData,
      totalHours: Number.parseInt(formData.totalHours),
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
      {/* Left Side - Welcome */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gradient-to-br from-blue-600 via-blue-500 to-sky-500 rounded-2xl shadow-lg p-8 relative overflow-hidden h-full min-h-96 flex flex-col justify-between"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to DTR</h1>
          <p className="text-white/80 text-lg leading-relaxed mb-6">
            Document your daily work activities, track hours, and monitor your progress towards completion.
          </p>
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="text-white font-semibold mb-2">Daily Time Record Features:</p>
              <ul className="text-white/80 text-sm space-y-2">
                <li>✓ Track daily hours and activities</li>
                <li>✓ Upload image proof for verification</li>
                <li>✓ Automatic absence detection</li>
                <li>✓ Progress towards completion</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Setup */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
        {step === "choice" ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">How are you applying for this job?</h2>
              <p className="text-gray-600">This helps us track your journey accurately</p>
            </div>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChoice(false)}
                className="w-full bg-white border-2 border-blue-200 rounded-xl p-6 text-left hover:border-blue-500 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">Applied Through Seekr</p>
                    <p className="text-gray-600 text-sm">We have your job details on record</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChoice(true)}
                className="w-full bg-white border-2 border-blue-200 rounded-xl p-6 text-left hover:border-blue-500 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <span className="text-2xl">🔗</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">Applied Outside the App</p>
                    <p className="text-gray-600 text-sm">Tell us about your job placement</p>
                  </div>
                </div>
              </motion.button>
            </div>
          </>
        ) : step === "form" && loading ? (
          <div className="flex items-center justify-center h-40">
            <span className="text-blue-600 font-semibold">Loading Seekr jobs...</span>
          </div>
        ) : step === "form" && !formData.externalApplication && seekrJobs.length > 0 && !seekrSelected ? (
          <>
            {console.log("Rendering Seekr job cards:", seekrJobs)}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Select a job for your DTR</h2>
              <div className="grid gap-4">
                {seekrJobs.map((job) => (
                  <motion.button
                    key={job.job_id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectSeekrJob(job)}
                    className="w-full bg-white border-2 border-blue-200 rounded-xl p-4 text-left hover:border-blue-500 hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col gap-2">
                      <span className="font-bold text-blue-700 text-lg">{job.job_title}</span>
                      <span className="text-gray-700">{job.company_name}</span>
                      <span className="text-sm text-gray-500">
                        {job.work_type} | {job.remote_options}
                      </span>
                      <span className="text-xs text-gray-400">
                        Applied: {new Date(job.applied_at).toLocaleDateString()} | Status: {job.status}
                      </span>
                      <span className="text-xs text-gray-400">
                        Employer: {job.employer_first_name} {job.employer_last_name}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep("choice")
                  setSeekrJobs([])
                  setSeekrSelected(null)
                  setFormData({
                    jobTitle: "",
                    company: "",
                    totalHours: "",
                    startDate: "",
                    externalApplication: false,
                  })
                }}
                className="mt-4 px-6 py-3 rounded-lg border border-gray-300 text-gray-900 font-semibold hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            </div>
          </>
        ) : step === "form" && (formData.externalApplication || seekrSelected) ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Information</h2>
              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-900">
                  {formData.externalApplication
                    ? "Please provide your job details below"
                    : "Verify your job information"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  placeholder="e.g., Software Developer"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  disabled={seekrSelected !== null}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="e.g., Tech Corp"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  disabled={seekrSelected !== null}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Total Hours Required</label>
                  <input
                    type="number"
                    name="totalHours"
                    value={formData.totalHours}
                    onChange={handleInputChange}
                    placeholder="e.g., 480"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setStep("choice")
                  setFormData((prev) => ({
                    ...prev,
                    jobTitle: "",
                    company: "",
                    totalHours: "",
                    startDate: "",
                  }))
                }}
                className="flex-1 px-6 py-3 rounded-lg border border-gray-300 text-gray-900 font-semibold hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold hover:shadow-lg transition-all"
              >
                Continue
              </motion.button>
            </div>
          </form>
        ) : null}
      </motion.div>
    </div>
  )
}
