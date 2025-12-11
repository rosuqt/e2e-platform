/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Calendar, Maximize2, X } from "lucide-react"
import DTRJobSetup from "./components/dtr-job-setup"
import DTRDashboard from "./components/dtr-dashboard"
import DTRDailyLog from "./components/dtr-daily-log"

type JobInfo = {
  id: string
  jobTitle: string
  company: string
  totalHours: number
  startDate: string
  externalApplication: boolean
}

export default function DTRPage() {
  const [jobInfo, setJobInfo] = useState<JobInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLogModal, setShowLogModal] = useState(false)
  const [logs, setLogs] = useState<any[]>([])
  const [refreshKey, setRefreshKey] = useState(0)
  const [showLogsFullscreen, setShowLogsFullscreen] = useState(false)
  const [logsPage, setLogsPage] = useState(1)
  const [showResetModal, setShowResetModal] = useState(false)
  const logsPerPage = 5
  const paginatedLogs = logs.slice((logsPage - 1) * logsPerPage, logsPage * logsPerPage)
  const totalPages = Math.ceil(logs.length / logsPerPage)

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchJobInfo()
  }, [])

  const fetchJobInfo = async () => {
    try {
      const res = await fetch("/api/students/dtr/getJobInfo")
      const data = await res.json()
      let info = null
      if (data.jobs && data.jobs.length > 0) {
        info = data.jobs[0] 
      } else if (data.jobInfo) {
        info = data.jobInfo
      }
      setJobInfo(info)
      if (info) {
        fetchLogs(info.id)
      }
      setLoading(false)
    } catch (error) {
      console.error("Error fetching job info:", error)
      setLoading(false)
    }
  }

  const fetchLogs = async (jobId: string) => {
    try {
      const res = await fetch(`/api/students/dtr/getLogs?jobId=${jobId}`)
      const data = await res.json()
      setLogs(data.logs || [])
    } catch (error) {
      console.error("Error fetching logs:", error)
    }
  }

  const handleJobSetup = async (data: any) => {
    setJobInfo(data)
    if (data?.id) {
      fetchLogs(data.id)
    }
    setRefreshKey((prev) => prev + 1)
  }

  const handleAddLog = async (logData: any) => {
    try {
      const res = await fetch("/api/students/dtr/addLog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...logData,
          jobId: jobInfo?.id,
        }),
      })
      const result = await res.json()
      if (result.success) {
        setShowLogModal(false)
        fetchLogs(jobInfo?.id || "")
      }
    } catch (error) {
      console.error("Error adding log:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your DTR...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {!jobInfo ? (
          <DTRJobSetup onSubmit={handleJobSetup} />
        ) : (
          <div className="space-y-6">
            {/* Header with Job Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-600 via-blue-500 to-sky-500 rounded-2xl shadow-lg p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">{jobInfo.jobTitle}</h1>
                    <p className="text-white/80 text-lg mb-2">{jobInfo.company || "No company"}</p>
                    <div className="mt-4 flex items-center gap-6">
                      <div>
                        <p className="text-white/60 text-sm">Total Required Hours</p>
                        <p className="text-white text-2xl font-bold">
                          {jobInfo.totalHours ? jobInfo.totalHours : "N/A"} hrs
                        </p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Start Date</p>
                        <p className="text-white text-2xl font-bold">
                          {(jobInfo.startDate && !isNaN(Date.parse(jobInfo.startDate)))
                            ? new Date(jobInfo.startDate).toLocaleDateString()
                            : "N/A"}
                        </p>
                        <p className="text-white/80 text-lg mt-1">
                      
                        </p>
                      </div>
                      <div>
                
                      </div>
                    </div>
                  </div>
                  <div>
                    <motion.button
                      whileHover={{ scale: 1.05, translateY: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowLogModal(true)}
                      className="bg-white hover:bg-slate-50 text-blue-600 font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
                    >
                      <Plus className="w-5 h-5" />
                      Log Hours
                    </motion.button>
                    <button
                      onClick={() => setShowResetModal(true)}
                      className="mt-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 px-6 rounded-xl flex items-center gap-2 transition-all shadow"
                      type="button"
                    >
                      Reset Progress
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Dashboard Overview */}
            <DTRDashboard
              jobInfo={{
                jobTitle: jobInfo.jobTitle || "",
                company: jobInfo.company || "",
                totalHours: jobInfo.totalHours || 0,
                startDate: jobInfo.startDate || "",
                externalApplication: jobInfo.externalApplication || false,
              }}
              logs={logs}
              refreshKey={refreshKey}
            />

            {/* Daily Logs Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-blue-100/50 p-6 relative"
            >
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Daily Logs</h2>
                <button
                  className="ml-auto p-2 rounded-lg hover:bg-blue-100 transition absolute top-4 right-4"
                  onClick={() => setShowLogsFullscreen(true)}
                  aria-label="Fullscreen"
                  type="button"
                >
                  <Maximize2 className="w-5 h-5 text-blue-600" />
                </button>
              </div>

              {logs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-12 text-center border border-blue-100"
                >
                  <Calendar className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                  <p className="text-gray-700 text-lg font-semibold mb-2">No logs yet</p>
                  <p className="text-gray-600">Start logging your daily hours and activities</p>
                </motion.div>
              ) : (
                <>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {paginatedLogs.map((log, index) => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={
                          log.hours === 0
                            ? "bg-gradient-to-r from-orange-100 to-amber-100 p-4 rounded-lg border border-amber-300 hover:border-orange-400 transition-colors"
                            : "bg-gradient-to-r from-blue-50 to-sky-50 p-4 rounded-lg border border-blue-100/50 hover:border-blue-200 transition-colors"
                        }
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-bold text-gray-900">{log.date}</p>
                            <p className="text-sm text-gray-600">{log.description}</p>
                          </div>
                          <div className="text-right">
                            <p className={log.hours === 0 ? "font-bold text-orange-600" : "font-bold text-blue-600"}>
                              {log.hours} hrs
                            </p>
                          </div>
                        </div>
                        {log.imageProofUrl && (
                          <div className="mt-2">
                            <img
                              src={log.imageProofUrl}
                              alt="Proof"
                              className="w-32 h-32 object-cover rounded-lg border mx-auto"
                            />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex justify-center items-center gap-2 mt-4">
                    <button
                      disabled={logsPage === 1}
                      onClick={() => setLogsPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-1 rounded bg-blue-100 text-blue-600 font-bold disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <span className="text-gray-700">{logsPage} / {totalPages}</span>
                    <button
                      disabled={logsPage === totalPages}
                      onClick={() => setLogsPage((p) => Math.min(totalPages, p + 1))}
                      className="px-3 py-1 rounded bg-blue-100 text-blue-600 font-bold disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </div>

      {/* Daily Log Modal */}
      {jobInfo && showLogModal && <DTRDailyLog onClose={() => setShowLogModal(false)} onSubmit={handleAddLog} />}

      {/* Fullscreen Logs Section */}
      {showLogsFullscreen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex items-center justify-between px-8 py-6 border-b border-blue-100">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Daily Logs</h2>
            </div>
            <button
              className="p-2 rounded-lg hover:bg-blue-100 transition"
              onClick={() => setShowLogsFullscreen(false)}
              aria-label="Close"
              type="button"
            >
              <X className="w-6 h-6 text-blue-600" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-8 py-6">
            {logs.length === 0 ? (
              <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-12 text-center border border-blue-100 mt-12">
                <Calendar className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                <p className="text-gray-700 text-lg font-semibold mb-2">No logs yet</p>
                <p className="text-gray-600">Start logging your daily hours and activities</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-[80vh] overflow-y-auto">
                  {paginatedLogs.map((log, index) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gradient-to-r from-blue-50 to-sky-50 p-4 rounded-lg border border-blue-100/50 hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-bold text-gray-900">{log.date}</p>
                          <p className="text-sm text-gray-600">{log.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">{log.hours} hrs</p>
                        </div>
                      </div>
                      {log.imageProofUrl && (
                        <div className="mt-2">
                          <img
                            src={log.imageProofUrl}
                            alt="Proof"
                            className="w-32 h-32 object-cover rounded-lg border mx-auto"
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-center items-center gap-2 mt-4">
                  <button
                    disabled={logsPage === 1}
                    onClick={() => setLogsPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded bg-blue-100 text-blue-600 font-bold disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span className="text-gray-700">{logsPage} / {totalPages}</span>
                  <button
                    disabled={logsPage === totalPages}
                    onClick={() => setLogsPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1 rounded bg-blue-100 text-blue-600 font-bold disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Reset Progress Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center">
            <h2 className="text-xl font-bold text-red-700 mb-4">Reset Progress?</h2>
            <p className="text-gray-700 mb-6">
              This will permanently delete all logs and job info for this DTR. This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-900 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!jobInfo?.id) return
                  await fetch("/api/students/dtr/resetProgress", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ jobId: jobInfo.id }),
                  })
                  setShowResetModal(false)
                  setJobInfo(null)
                  setLogs([])
                  setLogsPage(1)
                }}
                className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
