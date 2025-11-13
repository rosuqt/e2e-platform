"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { CheckCircle, Users, Star, UserPlus } from "lucide-react"

export default function CtaModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
      <motion.div
        className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 rounded-lg shadow-lg p-12 max-w-2xl w-full relative overflow-hidden flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <button
          className="absolute top-4 right-4 text-gray-200 hover:text-gray-400"
          onClick={onClose}
        >
          ✕
        </button>
        <motion.h2
          className="text-4xl font-bold text-center text-white mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Unlock <span className="text-yellow-400">People Features</span>
        </motion.h2>
        <motion.p
          className="text-blue-100 text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Sign in or join now to connect, follow, and discover classmates, employers, and companies.
        </motion.p>

        {/* Features Section */}
        <motion.div
          className="space-y-6 text-left mb-8 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center">
            <Users className="mr-3 text-blue-200 w-6 h-6" />
            <span className="text-blue-100 text-lg">Build your professional network</span>
          </div>
          <div className="flex items-center">
            <Star className="mr-3 text-yellow-300 w-6 h-6" />
            <span className="text-blue-100 text-lg">Favorite and organize connections & employers</span>
          </div>
          <div className="flex items-center">
            <UserPlus className="mr-3 text-emerald-300 w-6 h-6" />
            <span className="text-blue-100 text-lg">Discover new people and opportunities</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="mr-3 text-teal-300 w-6 h-6" />
            <span className="text-blue-100 text-lg">Send and manage connection requests</span>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/sign-in">
            <motion.button
              className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-lg font-medium shadow-glow"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(255, 255, 255, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
          </Link>
          <Link href="/join-now">
            <motion.button
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Now
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
