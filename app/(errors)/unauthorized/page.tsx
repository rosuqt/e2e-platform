"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Lock, LogIn, Home } from "lucide-react"

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

const bounceAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 2,
    repeat: Number.POSITIVE_INFINITY,
    ease: "easeInOut",
  },
}

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900 flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 max-w-5xl mx-auto">
          {/* Illustration */}
          <motion.div
            className="w-full md:w-[380px] flex-shrink-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="relative h-80 w-full rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=300&width=400"
                alt="Access denied illustration"
                fill
                className="object-cover opacity-80"
                priority
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl"
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 1, 0, -1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <Lock className="w-12 h-12 text-blue-700" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Text and Actions */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="w-full md:w-[420px] text-white flex flex-col items-center md:items-start"
          >
            {/* Error Code */}
            <motion.div className="text-8xl md:text-9xl font-bold text-yellow-400 mb-4" animate={bounceAnimation}>
              401
            </motion.div>

            {/* Lock Icon */}
            <motion.div
              className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <Lock className="w-10 h-10 text-yellow-400" />
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-3xl md:text-4xl font-bold mb-4 text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Access <span className="text-yellow-400">Denied</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-lg text-blue-100 mb-6 max-w-md text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Oops! It looks like you need to sign in to access this page. Don&apos;t worry, it only takes a moment to get
              back on track.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 w-full justify-center md:justify-start mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link href="/sign-in">
                <motion.button
                  className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 shadow-lg w-full sm:w-auto"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 30px rgba(251, 191, 36, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogIn className="w-5 h-5" />
                  Sign In Now
                </motion.button>
              </Link>

              <Link href="/">
                <motion.button
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-medium text-lg flex items-center gap-3 w-full sm:w-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Home className="w-5 h-5" />
                  Go Home
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
              <p className="text-blue-100 mb-2">
                <strong className="text-white">Need help?</strong>
              </p>
              <p className="text-sm text-blue-200">
                If you&apos;re having trouble signing in, try resetting your password or contact our support team for
                assistance.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
