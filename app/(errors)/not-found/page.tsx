"use client"
import { motion, easeOut, easeInOut } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Search, Home, MapPin, Compass } from "lucide-react"

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
}

const floatAnimation = {
  y: [0, -20, 0],
  transition: {
    duration: 3,
    repeat: Number.POSITIVE_INFINITY,
    ease: easeInOut,
  },
}

const popularPages = [
  { name: "Find Jobs", href: "/jobs", icon: <Search className="w-4 h-4" /> },
  { name: "Browse Companies", href: "/companies", icon: <MapPin className="w-4 h-4" /> },
  { name: "How It Works", href: "/how-it-works", icon: <Compass className="w-4 h-4" /> },
]

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900 flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="text-white">
            {/* Error Code */}
            <motion.div className="text-8xl md:text-9xl font-bold text-yellow-400 mb-4" animate={floatAnimation}>
              404
            </motion.div>

            {/* Search Icon */}
            <motion.div
              className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-8"
              initial={{ scale: 0, rotate: 360 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <Search className="w-12 h-12 text-yellow-400" />
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Page <span className="text-yellow-400">Not Found</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Oops! The page you&apos;re looking for seems to have wandered off. Don&apos;t worry, let&apos;s get you back on the right
              path to your dream opportunity!
            </motion.p>

            {/* Illustration */}
            <motion.div
              className="relative w-full max-w-lg mx-auto mb-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="relative h-80 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  alt="Page not found illustration"
                  fill
                  className="object-cover opacity-80"
                />

                {/* Floating compass overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl"
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <Compass className="w-16 h-16 text-blue-700" />
                  </motion.div>
                </div>

                {/* Floating elements */}
                <motion.div
                  className="absolute top-6 right-6 bg-yellow-400/20 backdrop-blur-sm p-3 rounded-xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                >
                  <span className="text-yellow-400 font-bold">?</span>
                </motion.div>

                <motion.div
                  className="absolute bottom-6 left-6 bg-blue-400/20 backdrop-blur-sm p-3 rounded-xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                >
                  <span className="text-blue-400 font-bold">!</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Popular Pages */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-blue-100 mb-4">Try visiting one of these popular pages:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {popularPages.map((page, index) => (
                  <Link key={index} href={page.href}>
                    <motion.button
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {page.icon}
                      {page.name}
                    </motion.button>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link href="/">
                <motion.button
                  className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 shadow-lg"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 30px rgba(251, 191, 36, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Home className="w-5 h-5" />
                  Back to Home
                </motion.button>
              </Link>

              <motion.button
                onClick={() => window.history.back()}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-medium text-lg flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                Go Back
              </motion.button>
            </motion.div>

            {/* Fun fact */}
            <motion.div
              className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <p className="text-blue-100 mb-2">
                <strong className="text-white">Fun Fact:</strong>
              </p>
              <p className="text-sm text-blue-200">
                The 404 error was named after room 404 at CERN, where the original web servers were located. When files
                couldn&apos;t be found, they were &quot;404&quot; - not found in room 404! 🚀
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
