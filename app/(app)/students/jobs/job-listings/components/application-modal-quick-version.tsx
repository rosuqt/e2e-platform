import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import mailAnim from "@/../public/animations/mail.json"

const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

type QuickApplyFormModalProps = { onClose: () => void }

export default function ApplicationModalQuickVersion({ onClose }: QuickApplyFormModalProps) {
  const [step, setStep] = useState(1)
  const totalSteps = 1
  const [showSuccess, setShowSuccess] = useState(false)
  const [autoCloseSeconds, setAutoCloseSeconds] = useState(5)
  const router = useRouter()

  useEffect(() => {
    console.log("[QuickApplyFormModal] mounted")
    return () => {
      console.log("[QuickApplyFormModal] unmounted")
    }
  }, [])

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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
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
              <div className="w-32 h-32">
                <Lottie animationData={mailAnim} loop={false} />
              </div>
              <h4 className="text-lg font-semibold text-blue-700">Applied via Quick Apply!</h4>
              <p className="text-sm text-gray-600 text-center max-w-xs">
               Your application has been submitted using the details saved in your Quick Apply preferences.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Close{autoCloseSeconds > 0 ? ` (${autoCloseSeconds})` : ""}
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    onClose()
                    router.push("/students/applications")
                  }}
                >
                  View applications
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* questions-only content (previous step 3) */}
              <div className="space-y-4">
                <h4 className="font-medium text-lg text-blue-700">Additional Questions</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      How many years of experience do you have in this field?
                    </label>
                    <select className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Less than 1 year</option>
                      <option>1-2 years</option>
                      <option>3-5 years</option>
                      <option>5+ years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">When can you start?</label>
                    <select className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Immediately</option>
                      <option>In 2 weeks</option>
                      <option>In 1 month</option>
                      <option>More than 1 month</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">What is your expected salary?</label>
                    <Input placeholder="Enter amount in PHP" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>

                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setShowSuccess(true)
                  }}
                >
                  Submit Application
                </Button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
