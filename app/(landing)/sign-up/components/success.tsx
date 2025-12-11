"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, Loader2 } from "lucide-react"

export default function SuccessPage() {
  const router = useRouter()
  const [stage, setStage] = useState<"loading" | "success">("loading")
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const loaderTimer = setTimeout(() => {
      setStage("success")
    }, 3000)

    return () => clearTimeout(loaderTimer)
  }, [])

  useEffect(() => {
    if (countdown === 0) {
      router.push("/sign-in") 
    }
  }, [countdown, router])

  useEffect(() => {
    if (stage === "success") {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(countdownInterval)
    }
  }, [stage])

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-white px-4 py-6 rounded-lg">

      {stage === "loading" ? (
        <motion.div
          className="flex flex-col items-center w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="mt-3 text-md text-gray-700 text-center">Creating your account...</p>
        </motion.div>
      ) : (
        <motion.div
          className="flex flex-col items-center w-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CheckCircle className="w-16 h-16 text-blue-500" />
          <motion.h1
            className="mt-3 text-2xl font-bold text-blue-600 text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Account Created Successfully!
          </motion.h1>

          <p className="mt-3 text-gray-700 text-center text-sm">
            Redirecting to sign in page in {countdown} seconds...
          </p>

          <div className="w-48 h-2 mt-4 bg-gray-200 rounded-full">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </div>
  )
}
