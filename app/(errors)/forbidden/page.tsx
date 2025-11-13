"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import dynamic from "next/dynamic"
import {  Home, AlertTriangle } from "lucide-react"
import { useSession } from "next-auth/react"

const Lottie = dynamic(() => import("lottie-react"), { ssr: false })
import forbiddenAnimation from "../../../public/animations/forbidden.json"

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

const shakeAnimation = {
  x: [0, -5, 5, -5, 5, 0],
  transition: {
    duration: 0.6,
    repeat: Number.POSITIVE_INFINITY,
    repeatDelay: 3,
  },
}

export default function ForbiddenPage() {
  const { data: session } = useSession()
  const role = session?.user?.role
  const userType =
    role === "student"
      ? "employers"
      : role === "employer"
      ? "students"
      : "authorized users"
  const dashboardHref =
    role === "student"
      ? "/students/dashboard"
      : role === "employer"
      ? "/employers/dashboard"
      : role === "superadmin"
      ? "admin/superadmin/dashboard"
      : role === "admin"
      ? "/admin/coordinators/dashboard"
      : "/sign-in"
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-red-900 flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-20 max-w-6xl mx-auto">
          {/* Illustration */}
          <motion.div
            className="w-full md:w-[320px] flex-shrink-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="relative h-80 w-full rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Lottie
                animationData={forbiddenAnimation}
                loop
                autoPlay
                style={{ width: "100%", height: "100%" }}
              />

    
            </div>
          </motion.div>

          {/* Text and Actions */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="w-full md:w-[520px] text-white flex flex-col items-center md:items-start"
          >
            <div className="flex items-start gap-4 w-full mb-4">
              <motion.div className="text-8xl md:text-9xl font-bold text-yellow-400" animate={shakeAnimation}>
                403
              </motion.div>
              <motion.div
                className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl mt-2"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <AlertTriangle className="w-12 h-12 text-red-600" />
              </motion.div>
            </div>

            {/* Title */}
            <motion.h1
              className="text-3xl md:text-4xl font-bold mb-4 text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Access <span className="text-yellow-400">Forbidden</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-lg text-red-100 mb-6 max-w-xl text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Oops! Are you lost?
              <span className="block mt-2">
                Looks like this page is just for {userType}. If that’s not you, you might’ve taken a wrong turn! Try going back or reach out if you think you should be able to view this.
              </span>
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 w-full justify-center md:justify-start mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link href={dashboardHref}>
                <motion.button
                  className="bg-yellow-400 hover:bg-yellow-500 text-red-900 px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 shadow-lg w-full sm:w-auto"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 30px rgba(251, 191, 36, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Home className="w-5 h-5" />
                  Go to Dashboard
                </motion.button>
              </Link>
            </motion.div>

            {/* Help Text */}
            <motion.div
              className="mt-4 p-5 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-red-100 mb-2">
                <strong className="text-white">Why am I seeing this?</strong>
              </p>
              <ul className="text-sm text-red-200 space-y-2 text-left max-w-md mx-auto">
                <li>• You may not have the required permissions</li>
                <li>• This content might be restricted to certain user types</li>
                <li>• Your account may need additional verification</li>
                <li>• Contact support if you believe this is an error</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
  

