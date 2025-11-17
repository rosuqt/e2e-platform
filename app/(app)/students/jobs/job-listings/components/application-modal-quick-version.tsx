/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { RiMailSendFill } from "react-icons/ri"
import { useSession } from "next-auth/react"


type QuickApplyFormModalProps = { onClose: () => void; jobId: string }

export default function ApplicationModalQuickVersion({ onClose, jobId }: QuickApplyFormModalProps) {
  const [step] = useState(1)
  const totalSteps = 1
  const [showSuccess, setShowSuccess] = useState(false)
  const [autoCloseSeconds, setAutoCloseSeconds] = useState(5)
  const [questions, setQuestions] = useState<any[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [applicationId, setApplicationId] = useState<string | null>(null)
  const router = useRouter()
  const { data: session } = useSession()
  const studentId = session?.user?.studentId

  useEffect(() => {
    async function fetchQuestionsAndApply() {
      setLoading(true)
      const res = await fetch(`/api/employers/application-questions?job_id=${jobId}`)
      const data = await res.json()
      setQuestions(data)

      if (data.length === 0 && studentId) {
        const applyRes = await fetch(`/api/students/apply/copy-to-applications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId, studentId }),
        })

        if (applyRes.ok) {
          const applyData = await applyRes.json()
          if (applyData.success) {
            setQuestions([]) 
            setShowSuccess(true)
          }
        }
      }

      setLoading(false)
    }
    fetchQuestionsAndApply()
  }, [jobId, studentId])

  useEffect(() => {
    if (!showSuccess || !studentId || !jobId) return
    async function fetchApplicationId() {
      const res = await fetch("/api/students/apply/check-apply-exist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, jobId }),
      })
      const data = await res.json()
      if (data.applicationId) setApplicationId(String(data.applicationId))
    }
    fetchApplicationId()
  }, [showSuccess, studentId, jobId])

  const handleAnswerChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async () => {
    const allAnswered = questions.every((q) => answers[q.id]?.trim())
    if (allAnswered && studentId) {
      setSubmitting(true)
      const applyRes = await fetch(`/api/students/apply/copy-to-applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, studentId }),
      })

      if (applyRes.ok) {
        const applyData = await applyRes.json()
        if (applyData.success) {
          setShowSuccess(true)
        }
      }
      setSubmitting(false)
    } else {
      alert("Please answer all questions before proceeding.")
    }
  }

  useEffect(() => {
    if (!showSuccess) return
    setAutoCloseSeconds(5)
    const interval = setInterval(() => {
      setAutoCloseSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          onClose()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [showSuccess, onClose])

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ width: "100vw", height: "100vh", top: 0, margin: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xl">
              {showSuccess ? "Application Submitted" : "Quick Apply"}
            </h3>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={onClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {!showSuccess && (
            <>
              <div className="mt-4 h-1.5 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1 text-blue-100">
                <span>
                  Step {step} of {totalSteps}
                </span>
                <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
              </div>
            </>
          )}
        </div>

        <div className="p-6">
          {showSuccess ? (
            <div className="flex flex-col items-center justify-center min-h-[260px] space-y-4">
              <div className="w-32 h-32 flex items-center justify-center bg-blue-200 rounded-full">
                <RiMailSendFill className="text-white" size={64} />
              </div>
              <h4 className="text-lg font-semibold text-blue-700">Applied via Quick Apply!</h4>
              <p className="text-sm text-gray-600 text-center max-w-xs">
                Your application has been submitted using the details saved in your Quick Apply preferences.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 border-blue-600" onClick={onClose}>
                  Close{autoCloseSeconds > 0 ? ` (${autoCloseSeconds})` : ""}
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    onClose()
                    if (applicationId) {
                      router.push(`/students/jobs/applications?application=${encodeURIComponent(applicationId)}`)
                    } else {
                      router.push("/students/applications")
                    }
                  }}
                >
                  View Application
                </Button>
              </div>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : questions.length > 0 ? (
            <>
              <div className="space-y-4">
                <h4 className="font-medium text-lg text-blue-700">Application Questions</h4>
                {questions.map((q) => (
                  <div key={q.id} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">{q.question}</label>
                    {q.type === "text" ? (
                      <Input
                        value={answers[q.id] || ""}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        placeholder="Your answer"
                      />
                    ) : (
                      <select
                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={answers[q.id] || ""}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      >
                        <option value="">Select an option</option>
                        {q.options.map((opt: string, idx: number) => (
                          <option key={idx} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  )
}
