"use client"
import { FileText, Home, List } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function JobPostingDraftModal({ onClose }: { onClose: () => void }) {
  const bubbles = Array.from({ length: 15 }, (_, i) => i)

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] backdrop-blur-sm"
      style={{ overflow: "hidden" }} // Prevent layout shifts
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg w-[90%] max-w-md h-auto overflow-auto shadow-xl relative"
      >
        <div className="p-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>

          {/* Floating Bubbles Background */}
          {bubbles.map((bubble, index) => (
            <motion.div
              key={index}
              className="absolute rounded-full bg-blue-200 opacity-30"
              style={{
                width: Math.random() * 50 + 10,
                height: Math.random() * 50 + 10,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                zIndex: 0,
              }}
              animate={{
                y: [0, -10, 0],
                x: [0, Math.random() * 5 - 2.5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Draft Icon */}
            <motion.div
              className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.5,
              }}
            >
              <FileText size={40} className="text-blue-500" />
            </motion.div>

            {/* Draft Saved Text */}
            <motion.h1
              className="text-2xl font-bold text-blue-600 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              Draft Saved!
            </motion.h1>

            <motion.p
              className="text-blue-700 text-sm max-w-xs mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              Your job posting has been saved as a draft. You can come back anytime to complete and publish it.
            </motion.p>

            {/* Next Steps Section */}
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.5 }}
            >
              <div className="grid grid-cols-1 gap-4">
                {/* View Drafts */}
                <motion.div
                  whileHover={{ y: -5, boxShadow: "0 5px 15px -5px rgba(59, 130, 246, 0.5)" }}
                  className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg p-4 border border-blue-200 transition-all duration-300"
                >
                  <Link href="#" className="flex flex-col items-center text-center">
                    <List size={24} className="text-blue-500 mb-2" />
                    <p className="text-blue-600 text-sm">View Drafts</p>
                  </Link>
                </motion.div>

                {/* Post Another Job */}
                <motion.div
                  whileHover={{ y: -5, boxShadow: "0 5px 15px -5px rgba(59, 130, 246, 0.5)" }}
                  className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg p-4 border border-blue-200 transition-all duration-300"
                >
                  <Link href="/employers/post-a-job" className="flex flex-col items-center text-center">
                    <FileText size={24} className="text-blue-500 mb-2" />
                    <p className="text-blue-600 text-sm">Post Another Job</p>
                  </Link>
                </motion.div>

                {/* Go Back Home */}
                <motion.div
                  whileHover={{ y: -5, boxShadow: "0 5px 15px -5px rgba(59, 130, 246, 0.5)" }}
                  className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg p-4 border border-blue-200 transition-all duration-300"
                >
                  <Link href="#" className="flex flex-col items-center text-center">
                    <Home size={24} className="text-blue-500 mb-2" />
                    <p className="text-blue-600 text-sm">Go Back Home</p>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
