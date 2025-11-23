"use client"

import { motion } from "framer-motion"
import { Zap, ArrowRight } from "lucide-react"

const trendingTags = [
  { tag: "#TechJobs", count: 1240, trending: true, emoji: "💻" },
  { tag: "#Internship", count: 856, trending: true, emoji: "🎓" },
  { tag: "#StartupLife", count: 642, trending: false, emoji: "🚀" },
  { tag: "#RemoteWork", count: 521, trending: false, emoji: "🏠" },
  { tag: "#DataScience", count: 438, trending: true, emoji: "📊" },
  { tag: "#WebDevelopment", count: 392, trending: false, emoji: "🌐" },
]

export default function TrendingSidebar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl shadow-md border border-blue-100/50 overflow-hidden hover:shadow-lg transition-all"
    >
      {/* CHANGE: Enhanced header with gradient and emojis */}
      <div className="p-5 border-b border-blue-100/50 bg-gradient-to-r from-blue-50 to-sky-50">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🔥</div>
          <div>
            <h3 className="font-bold text-gray-900">Trending Now</h3>
            <p className="text-xs text-gray-600 mt-0.5">Hot opportunities this week</p>
          </div>
        </div>
      </div>

      {/* CHANGE: Improved trending items with better visual design and interactions */}
      <div className="divide-y divide-blue-100/30">
        {trendingTags.map((item, index) => (
          <motion.button
            key={item.tag}
            whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)", paddingLeft: "24px" }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-5 py-4 text-left transition-all group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg">{item.emoji}</span>
                  <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{item.tag}</p>
                  {item.trending && (
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 px-2 py-0.5 rounded-full"
                    >
                      <Zap className="w-3 h-3 fill-orange-600" />
                      <span className="text-xs font-bold">Hot</span>
                    </motion.div>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-2 font-medium">{item.count.toLocaleString()} opportunities</p>
              </div>
              <motion.div
                whileHover={{ translateX: 4 }}
                className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* CHANGE: Enhanced call-to-action footer */}
      <div className="p-5 bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 border-t border-blue-400/30">
        <motion.button
          whileHover={{ scale: 1.05, translateY: -2 }}
          whileTap={{ scale: 0.95 }}
          className="w-full text-white font-bold text-sm hover:text-blue-50 transition-colors flex items-center justify-center gap-2"
        >
          ✨ Explore all trending topics
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  )
}
