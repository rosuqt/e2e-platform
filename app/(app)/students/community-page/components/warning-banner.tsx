"use client"

import { X, Shield } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function CommunityWarningBanner() {
  const [isVisible, setIsVisible] = useState(true)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-b-2 border-amber-300 px-4 py-4 relative overflow-hidden"
        >
          {/* CHANGE: Decorative background element */}
          <div className="absolute right-0 top-0 w-48 h-48 bg-amber-100/20 rounded-full -mr-24 -mt-24" />

          <div className="max-w-5xl mx-auto flex items-start gap-4 relative z-10">
            {/* CHANGE: Enhanced icon with animation */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              className="flex-shrink-0 mt-0.5"
            >
              <Shield className="w-6 h-6 text-amber-700" />
            </motion.div>

            <div className="flex-1">
              <h3 className="font-bold text-amber-900 text-lg flex items-center gap-2">
                🚨 External Jobs - Please Be Cautious
              </h3>
              <p className="text-sm text-amber-800 mt-2 leading-relaxed">
                These job listings are shared by community members from external sources. Always verify company
                information, check for red flags (typos, unprofessional emails, requests for money), and never share
                personal or financial information before confirming the opportunity is legitimate.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-full text-xs font-semibold text-amber-800 border border-amber-200">
                  ✓ Verify the company website
                </div>
                <div className="inline-flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-full text-xs font-semibold text-amber-800 border border-amber-200">
                  ✓ Check LinkedIn profiles
                </div>
                <div className="inline-flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-full text-xs font-semibold text-amber-800 border border-amber-200">
                  ✓ Report suspicious posts
                </div>
              </div>
            </div>

            {/* CHANGE: Better close button with animation */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsVisible(false)}
              className="text-amber-600 hover:text-amber-700 flex-shrink-0 transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
