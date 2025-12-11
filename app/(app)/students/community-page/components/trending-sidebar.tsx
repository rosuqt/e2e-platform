"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Zap, ArrowRight } from "lucide-react"
import { Loader2 } from "lucide-react"

const emojiMap: Record<string, string> = {
  "#TechJobs": "💻",
  "#Internship": "🎓",
  "#StartupLife": "🚀",
  "#RemoteWork": "🏠",
  "#DataScience": "📊",
  "#WebDevelopment": "🌐",
}

export default function TrendingSidebar({ onTagClick }: { onTagClick?: (tag: string) => void }) {
  const [tags, setTags] = useState<{ tag: string; count: number }[]>([])
  const [hotTags, setHotTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch("/api/community-page/hashtagCounter")
      .then((res) => res.json())
      .then((data) => {
        const arr = Object.entries(data)
          .map(([tag, count]) => ({
            tag,
            count: typeof count === "number" ? count : typeof count === "string" ? parseInt(count) : 0,
          }))
          .sort((a, b) => {
            const aCount = typeof a.count === "number" ? a.count : 0
            const bCount = typeof b.count === "number" ? b.count : 0
            return bCount - aCount
          })
        setTags(arr)
        setHotTags(arr.slice(0, 3).map((t) => t.tag))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl shadow-md border border-blue-100/50 overflow-hidden hover:shadow-lg transition-all"
    >
      <div className="p-5 border-b border-blue-100/50 bg-gradient-to-r from-blue-50 to-sky-50">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🔥</div>
          <div>
            <h3 className="font-bold text-gray-900">Trending Now</h3>
            <p className="text-xs text-gray-600 mt-0.5">Hot opportunities this week</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-blue-100/30">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin w-8 h-8 text-blue-400" />
          </div>
        ) : (
          tags.map((item) => {
            const isHot = hotTags.includes(item.tag)
            const emoji = emojiMap[item.tag] || "🏷️"
            return (
              <motion.button
                key={item.tag}
                whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)", paddingLeft: "24px" }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-5 py-4 text-left transition-all group"
                onClick={() => onTagClick?.(item.tag)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg">{emoji}</span>
                      <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{item.tag}</p>
                      {isHot && (
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
            )
          })
        )}
      </div>

      <div className="p-5 bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 border-t border-blue-400/30">

      </div>
    </motion.div>
  )
}
