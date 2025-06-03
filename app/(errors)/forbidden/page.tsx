"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ShieldX, LayoutDashboard, Home, AlertTriangle } from "lucide-react"

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-red-900 flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="text-white">
            {/* Error Code */}
            <motion.div className="text-8xl md:text-9xl font-bold text-yellow-400 mb-4" animate={shakeAnimation}>
              403
            </motion.div>

            {/* Shield Icon */}
            <motion.div
              className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <ShieldX className="w-12 h-12 text-yellow-400" />
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Access <span className="text-yellow-400">Forbidden</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-xl text-red-100 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              You don&apos;t have permission to access this resource. This might be a restricted area or your account may not
              have the required privileges.
            </motion.p>

            {/* Illustration */}
            <motion.div
              className="relative w-full max-w-md mx-auto mb-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="relative h-64 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
                <Image
                  src="/placeholder.svg?height=300&width=400"
                  alt="Access forbidden illustration"
                  fill
                  className="object-cover opacity-80"
                />

                {/* Floating warning overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl"
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
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link href="/dashboard">
                <motion.button
                  className="bg-yellow-400 hover:bg-yellow-500 text-red-900 px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 shadow-lg"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 30px rgba(251, 191, 36, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Go to Dashboard
                </motion.button>
              </Link>

              <Link href="/">
                <motion.button
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-medium text-lg flex items-center gap-3"
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
              className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-red-100 mb-4">
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
