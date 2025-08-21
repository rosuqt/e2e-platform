"use client"
import Link from "next/link"
import { Clock, BarChart2, Award, Zap } from "lucide-react"
import { IoIosRocket } from "react-icons/io";
import StackCards from "./components/stack-cards"
import { useEffect, useState } from "react"
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";


function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, l => l.toUpperCase())
}

function formatDuration(interval: string) {
  const match = interval.match(/(\d+):(\d+):(\d+)/)
  if (!match) return interval
  const [, h, m, s] = match
  const hours = parseInt(h)
  const mins = parseInt(m)
  const secs = parseInt(s)
  const out = []
  if (hours) out.push(`${hours}h`)
  if (mins) out.push(`${mins}m`)
  if (secs && !hours && !mins) out.push(`${secs}s`)
  return out.join(" ")
}

function getAnswerTypeLabel(type: string) {
  if (type === "type") return "Typed Answer"
  if (type === "record") return "Recorded Answer"
  return capitalizeWords(type)
}

function getProgressCircleColor(score: number) {
  if (score < 30) return "#ef4444"
  if (score >= 90) return "#22c55e"
  if (score >= 70) return "#3b82f6"
  if (score >= 40) return "#facc15"
  return "#ef4444"
}

function ProgressCircle({ value }: { value: number }) {
  const radius = 22
  const stroke = 4
  const normalizedRadius = radius - stroke / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const percent = Math.max(0, Math.min(1, value / 100))
  const strokeDashoffset = circumference - percent * circumference
  const color = getProgressCircleColor(value)
  return (
    <svg width={radius * 2} height={radius * 2}>
      <circle
        stroke="#e5e7eb"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference + " " + circumference}
        strokeDashoffset={strokeDashoffset}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        style={{ transition: "stroke-dashoffset 0.5s" }}
      />
      <text
        x="50%"
        y="54%"
        textAnchor="middle"
        fill={color}
        fontSize="1rem"
        fontWeight="bold"
        dy=".3em"
      >
        {Math.round(value)}
      </text>
    </svg>
  )
}

export default function Home() {
  type PracticeHistory = {
    id: string
    finished_at: string
    interview_type: string
    difficulty: string
    answer_type: string
    duration: string
    score: number
    questions: string[]
  }
  const [history, setHistory] = useState<PracticeHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<"recent" | "oldest" | "score">("recent")
  const itemsPerPage = 10
  const router = useRouter();
  useEffect(() => {
    fetch("/api/interview-practice/getHistory")
      .then(res => res.json())
      .then(res => {
        setHistory(res.history || [])
        setLoading(false)
      })
  }, [])
  let avgScore = 0
  if (history.length) {
    const scores = history.map(h => typeof h.score === "number" ? h.score : 0)
    avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
  }
  const grouped = history.reduce((acc: Record<string, PracticeHistory[]>, item) => {
    const date = new Date(item.finished_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
    if (!acc[date]) acc[date] = []
    acc[date].push(item)
    return acc
  }, {})
  const sortedDates = Object.keys(grouped).sort((a, b) => {
    if (sort === "recent") return new Date(b).getTime() - new Date(a).getTime()
    if (sort === "oldest") return new Date(a).getTime() - new Date(b).getTime()
    return new Date(b).getTime() - new Date(a).getTime()
  })
  const allItems: { date: string, item: PracticeHistory }[] = []
  sortedDates.forEach(date => {
    let items = grouped[date]
    if (sort === "score") {
      items = [...items].sort((a, b) => b.score - a.score)
    }
    items.forEach(item => {
      allItems.push({ date, item })
    })
  })
  const totalPages = Math.ceil(allItems.length / itemsPerPage)
  const pagedItems = allItems.slice((page - 1) * itemsPerPage, page * itemsPerPage)
  const pagedGrouped: Record<string, PracticeHistory[]> = {}
  pagedItems.forEach(({ date, item }) => {
    if (!pagedGrouped[date]) pagedGrouped[date] = []
    pagedGrouped[date].push(item)
  })
  const pagedSortedDates = Object.keys(pagedGrouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50">
      <div className="min-h-screen max-w-6xl mx-auto p-4 md:p-8">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-1"></div>
          <div className="p-8 md:p-12 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 bg-white">
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                AI-Powered Interview Practice
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Master Your <span className="text-blue-600">Interview Skills</span> With Confidence
              </h2>
              <p className="text-lg text-gray-600">
                Practice with real interview questions, get instant feedback, and improve your chances of landing your
                dream job.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="interview-practice/select-practice"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  Start Practicing <IoIosRocket className="w-4 h-4" />
                </Link>
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 font-medium px-6 py-3 rounded-xl transition-all"
                >
                  Watch Demo
                </Link>
              </div>
            </div>
            <div className="relative bg-white">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl transform scale-95 opacity-70"></div>
              <div className="relative z-10 mt-50">
                <StackCards />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-t-4 border-blue-500">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Real-time Feedback</h3>
            <p className="text-gray-600">
              Get instant analysis on your interview performance with AI-powered insights.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-t-4 border-blue-500">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
              <BarChart2 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Track Progress</h3>
            <p className="text-gray-600">Monitor your improvement over time with detailed performance analytics.</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-t-4 border-blue-500">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Industry Questions</h3>
            <p className="text-gray-600">Practice with questions tailored to specific roles and industries.</p>
          </div>
        </div>

        {/* Practice History Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-1"></div>
          <div className="p-8 md:p-10">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Practice History</h2>
                <p className="text-gray-600">Track your progress and see how you&apos;re improving over time.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-1">Avg. Score</span>
                  <ProgressCircle value={avgScore} />
                </div>
                <div>
                  <Select
                    size="small"
                    value={sort}
                    onChange={e => { setSort(e.target.value as "recent" | "oldest" | "score"); setPage(1); }}
                    sx={{
                      minWidth: 170,
                      fontSize: 14,
                      background: "#fff",
                      borderRadius: "8px",
                      boxShadow: 1,
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e5e7eb" },
                    }}
                  >
                    <MenuItem value="recent">Sort by: Recent</MenuItem>
                    <MenuItem value="oldest">Sort by: Oldest</MenuItem>
                    <MenuItem value="score">Sort by: Score</MenuItem>
                  </Select>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              {loading ? (
                <div className="text-center text-gray-400 py-12 flex flex-col items-center justify-center gap-4">
                  <svg className="animate-spin h-8 w-8 text-blue-400 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Loading...
                </div>
              ) : history.length === 0 ? (
                <div className="text-center text-gray-400 py-12">No practice history yet.</div>
              ) : (
                pagedSortedDates.map(date => (
                  <div key={date} className="border-b border-gray-100 pb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-6">{date}</h3>
                    <div className="space-y-8">
                      {pagedGrouped[date].map(item => (
                        <HistoryItem
                          key={item.id}
                          id={item.id}
                          time={new Date(item.finished_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          title={item.interview_type.toLowerCase() === "generic"
                            ? "Generic Interview Practice"
                            : capitalizeWords(item.interview_type) + " Interview Practice"}
                          difficulty={capitalizeWords(item.difficulty)}
                          answerType={getAnswerTypeLabel(item.answer_type)}
                          duration={formatDuration(item.duration)}
                          score={typeof item.score === "number" ? item.score : 0}
                          questionsCount={Array.isArray(item.questions) ? item.questions.length : 0}
                          onViewDetails={() => router.push(`/students/jobs/interview-practice/interview/summary?id=${item.id}`)}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
            {!loading && history.length > itemsPerPage && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  className="px-4 py-2 rounded-lg border text-blue-700 border-blue-200 bg-white hover:bg-blue-50 disabled:opacity-50"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Prev
                </button>
                <span className="px-3 py-2 text-gray-600">{page} / {totalPages}</span>
                <button
                  className="px-4 py-2 rounded-lg border text-blue-700 border-blue-200 bg-white hover:bg-blue-50 disabled:opacity-50"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to ace your next interview?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Start practicing now and get personalized feedback to improve your interview skills.
            </p>
            <Link
              href="interview-practice/select-practice"
              className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-medium px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-lg text-lg"
            >
              Start Free Practice <IoIosRocket className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

function getDifficultyBadgeColor(difficulty: string) {
  const d = difficulty.toLowerCase()
  if (d === "easy") return "bg-green-100 text-green-800"
  if (d === "medium") return "bg-blue-100 text-blue-800"
  if (d === "hard") return "bg-red-100 text-red-800"
  return "bg-gray-100 text-gray-800"
}

function getScoreColor(score: number) {
  if (score < 30) return "bg-red-100 text-red-600"
  if (score >= 90) return "bg-green-100 text-green-700"
  if (score >= 70) return "bg-blue-100 text-blue-700"
  if (score >= 40) return "bg-orange-100 text-orange-700"
  return "bg-red-100 text-red-600"
}

function HistoryItem({
  title,
  difficulty,
  answerType,
  duration,
  score,
  questionsCount,
  onViewDetails,
}: {
  id: string
  time: string
  title: string
  difficulty: string
  answerType: string
  duration: string
  score: number
  questionsCount: number
  onViewDetails: () => void
}) {
  return (
    <div
      className="relative pl-10 flex justify-between items-center group"
      style={{ position: "relative" }}
    >
      <div
        className="absolute -inset-2 z-0 rounded-2xl transition-all duration-200 pointer-events-none group-hover:bg-blue-100/30 group-hover:scale-105"
      ></div>
      <div className="absolute left-0 top-0 h-full flex flex-col items-center z-10">
        <Tooltip title="Interview Score" arrow>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs ${getScoreColor(score)} transition-transform duration-200 group-hover:scale-110`}
            style={{ pointerEvents: "auto" }}
          >
            {Math.round(score)}%
          </div>
        </Tooltip>
        <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
      </div>
      <div className="flex-1 z-10">
        <div className="text-xs text-gray-400 mb-1">{duration} duration</div>
        <div className="font-medium text-gray-800 mb-2 group-hover:text-blue-700 transition-colors">{title}</div>
        <div className="flex flex-wrap gap-3 py-1">
          <Tooltip title="Difficulty" arrow>
            <div
              className={`text-xs px-3 py-1.5 rounded-full ${getDifficultyBadgeColor(difficulty)} transition-transform duration-200 group-hover:scale-110`}
              style={{ display: "inline-block", pointerEvents: "auto" }}
            >
              {difficulty}
            </div>
          </Tooltip>
          <Tooltip title="Answer Type" arrow>
            <div
              className="text-xs px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-800 transition-transform duration-200 group-hover:scale-110"
              style={{ display: "inline-block", pointerEvents: "auto" }}
            >
              {answerType}
            </div>
          </Tooltip>
          <Tooltip title="Questions" arrow>
            <div
              className="text-xs px-3 py-1.5 rounded-full bg-pink-100 text-pink-800 transition-transform duration-200 group-hover:scale-110"
              style={{ display: "inline-block", pointerEvents: "auto" }}
            >
              {questionsCount} questions
            </div>
          </Tooltip>
        </div>
      </div>
      <div className="flex items-center z-10 ml-4">
        <Button
          variant="outlined"
          size="small"
          onClick={onViewDetails}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 500,
            fontSize: 13,
            padding: "4px 20px",
            minWidth: "90px",
            borderColor: "#2563eb",
            color: "#2563eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            '&:hover': {
              background: "#2563eb",
              color: "#fff",
              borderColor: "#2563eb",
            },
          }}
        >
          View Details
        </Button>
      </div>
    </div>
  )
}

