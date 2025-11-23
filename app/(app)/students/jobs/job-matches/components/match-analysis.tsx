import { useMemo, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { SiCodemagic } from "react-icons/si"
import MatchBoosterPopup from "./match-booster"
import { useSession } from "next-auth/react"

const size = 96
const strokeWidth = 8
const radius = (size - strokeWidth) / 2
const circumference = 2 * Math.PI * radius

export function MatchAnalysis() {
  const [isBoosterOpen, setIsBoosterOpen] = useState(false)
  const [skills, setSkills] = useState<{ name: string; count: number }[]>([])
  const [scoreLoading, setScoreLoading] = useState(false)
  const { data: session } = useSession()
  const [avgScore, setAvgScore] = useState<number | null>(null)

  useEffect(() => {
    async function fetchSkills() {
      try {
        const res = await fetch("/api/match-booster/checkSkills")
        if (!res.ok) throw new Error("Failed to fetch skills")
        const data = await res.json()
        console.log("Fetched Skills:", data.skills)
        setSkills(data.skills || [])
      } catch (error) {
        console.error("Error fetching skills:", error)
      }
    }
    fetchSkills()
  }, [])

  useEffect(() => {
    async function fetchAvgScore() {
      if (!session?.user?.studentId) return
      setScoreLoading(true)
      const res = await fetch("/api/match-booster/fetchAvgScore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: session.user.studentId }),
      })
      if (!res.ok) {
        setScoreLoading(false)
        return
      }
      const data = await res.json()
      console.log("Fetched Scores Data:", data)
      if (Array.isArray(data.scores)) {
        console.log("All individual gpt_scores:", data.scores)
      }
      setAvgScore(
        typeof data.average === "number" ? Math.round(data.average) : null
      )
      setScoreLoading(false)
    }
    fetchAvgScore()
  }, [session?.user?.studentId])

  const score = avgScore ?? 0

  const {
    title,
    description,
    accentColor,
    ringColor,
  } = useMemo(() => {
    if (score >= 60) {
      return {
        title: "Nice! You’ve Got Strong Matches!",
        description:
          "You’re on the right track with your matches. With a few tweaks using our Match Guide, you can boost your score and unlock even better opportunities!",
        accentColor: "text-emerald-600",
        ringColor: "#059669",
      }
    }
    if (score >= 25) {
      return {
        title: "Good Progress — You’re Getting Closer!",
        description:
          "You’ve built a decent foundation with your matches. Use your Match Booster to fine-tune your skills and increase your compatibility — you’re closer than you think!",
        accentColor: "text-amber-600",
        ringColor: "#D97706",
      }
    }
    return {
      title: "Just Getting Started — Let’s Improve Your Fit!",
      description:
        "Your current matches are still developing, but don’t worry — everyone starts here. Use your Match Guide to build stronger skills and start finding roles that truly match you!",
      accentColor: "text-rose-600",
      ringColor: "#DC2626",
    }
  }, [score])

  const offset = useMemo(
    () => circumference - ((score ?? 0) / 100) * circumference,
    [score]
  )

  return (
    <>
      {scoreLoading ? (
        <div className="w-full flex-1 bg-white rounded-2xl shadow-lg mb-6 p-4 border-2 border-blue-200 relative overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <div className="h-5 w-32 bg-blue-100 rounded animate-pulse" />
            <div className="h-4 w-20 bg-blue-100 rounded-full animate-pulse" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 bg-blue-100 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2 min-w-0">
                <div className="h-4 w-2/3 bg-amber-100 rounded animate-pulse" />
                <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-blue-100 to-transparent" />
            <div className="h-10 w-full bg-blue-100 rounded-full animate-pulse" />
          </div>
        </div>
      ) : (
        <motion.div
          className="w-full flex-1 bg-white rounded-2xl shadow-lg mb-6 p-4 border-2 border-blue-200 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-blue-700">Match Analysis</h3>
            <span
              className={`text-[11px] font-medium px-2 py-1 rounded-full border ${
                score >= 60
                  ? "bg-emerald-50 border-emerald-600 text-emerald-600"
                  : score >= 25
                  ? "bg-amber-50 border-amber-600 text-amber-600"
                  : "bg-rose-50 border-rose-600 text-rose-600"
              }`}
            >
              Avg Match Score
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center shrink-0">
                <svg width={size} height={size} className="-rotate-90">
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="#E5E7EB"
                    strokeWidth={strokeWidth}
                  />
                  <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={ringColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {scoreLoading ? (
                    <span className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <span className={`text-xl font-bold leading-none ${accentColor}`}>
                      {avgScore !== null ? `${score}%` : "—"}
                    </span>
                  )}
                  <span className={`mt-1 text-[10px] ${accentColor} opacity-70`}>
                    average match
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-1.5 min-w-0">
                {scoreLoading && score >= 25 && score < 60 ? (
                  <div className="space-y-2">
                    <div className="h-4 w-2/3 bg-amber-100 rounded animate-pulse" />
                    <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
                  </div>
                ) : (
                  <>
                    <p className={`text-sm font-semibold ${accentColor}`}>{title}</p>
                    <p className="text-xs text-gray-500 leading-snug">
                      {description}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-blue-100 to-transparent" />

            <div className="flex items-center text-[15px]">
              <motion.button
                className="relative w-full px-3 py-2 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 text-white text-[14px] font-medium shadow-sm flex items-center justify-center gap-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsBoosterOpen(true)}
              >
                <SiCodemagic className="w-4 h-4" />
                <span>Match Booster</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      <MatchBoosterPopup
        open={isBoosterOpen}
        onClose={() => setIsBoosterOpen(false)}
        matchScore={score}
        topSkills={skills.map(skill => skill.name)}
        resources={[]}
        score={score}
      />
    </>
  )
}

export default MatchAnalysis
