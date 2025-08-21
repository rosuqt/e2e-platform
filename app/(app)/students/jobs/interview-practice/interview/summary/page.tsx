"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "../../components/ui/progress"
import {
  ChevronLeft,
  ChevronRight,
  Trophy,
  Clock,
  Zap,
  Star,
  TrendingUp,
  CheckCircle,
} from "lucide-react"
import { MdOutlineQuestionAnswer } from "react-icons/md"
import { FaFileCircleQuestion } from "react-icons/fa6"
import { FaRegSadTear } from "react-icons/fa"
import dynamic from "next/dynamic"
import { VscDebugRestart } from "react-icons/vsc"
import { IoCaretBackCircleOutline } from "react-icons/io5"
import sadStarAnimation from "@/../public/animations/sad_star.json"
import starSmileAnimation from "@/../public/animations/star_smile.json"
import starGreatAnimation from "@/../public/animations/star_great.json"
import starHappyAnimation from "@/../public/animations/star_happy.json"
import interviewLoaderAnimation from "@/../public/animations/interview_loader.json"


const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

function getPerformanceLevel(score: number) {
  if (score >= 90)
    return {
      level: "Excellent",
      color: "text-green-800",
      bg: "bg-green-100 border border-green-300",
      icon: Trophy,
      progressColor: "#16a34a",
      lottie: starHappyAnimation
    }
  if (score >= 80)
    return {
      level: "Great",
      color: "text-blue-800",
      bg: "bg-blue-100 border border-blue-300",
      icon: TrendingUp,
      progressColor: "#2563eb",
      lottie: starGreatAnimation
    }
  if (score >= 70)
    return {
      level: "Good",
      color: "text-sky-800",
      bg: "bg-sky-100 border border-sky-300",
      icon: Star,
      progressColor: "#0ea5e9",
      lottie: starGreatAnimation
    }
  if (score >= 60)
    return {
      level: "Fair",
      color: "text-orange-800",
      bg: "bg-orange-100 border border-orange-300",
      icon: Zap,
      progressColor: "#ea580c",
      lottie: starSmileAnimation
    }
  if (score >= 50)
    return {
      level: "Partial",
      color: "text-amber-800",
      bg: "bg-amber-100 border border-amber-300",
      icon: TrendingUp,
      progressColor: "#f59e42",
      lottie: starSmileAnimation
    }
  if (score >= 40)
    return {
      level: "Weak",
      color: "text-rose-800",
      bg: "bg-rose-100 border border-rose-300",
      icon: Star,
      progressColor: "#e11d48",
      lottie: sadStarAnimation
    }
  if (score >= 30)
    return {
      level: "Poor",
      color: "text-pink-800",
      bg: "bg-pink-100 border border-pink-300",
      icon: FaRegSadTear,
      progressColor: "#db2777",
      lottie: sadStarAnimation
    }
  return {
    level: "Needs Work",
    color: "text-red-800",
    bg: "bg-red-100 border border-red-300",
    icon: FaRegSadTear,
    progressColor: "#dc2626",
    lottie: sadStarAnimation
  }
}

type InterviewSessionData = {
  interview_type?: string
  difficulty?: string
  answer_type?: string
  questions: string[]
  answers: string[]
  tips: string[]
  suggestions: string[]
  duration?: string
  score?: number
  scores?: number[]
  question_scores?: string
  finished_at?: string
}

export default function InterviewSummaryPage() {
  const [sessionData, setSessionData] = useState<InterviewSessionData | null>(null)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [loading, setLoading] = useState(false)
  const [minDelayPassed, setMinDelayPassed] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const interviewId = searchParams ? searchParams.get("id") : null

  useEffect(() => {
    setMinDelayPassed(false)
    const timeout = setTimeout(() => setMinDelayPassed(true), 2000)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const raw = sessionStorage.getItem("current_interview_practice")
    if (raw) {
      setLoading(true)
      setTimeout(() => {
        setSessionData(JSON.parse(raw) as InterviewSessionData)
        setLoading(false)
      }, 0)
    } else if (interviewId) {
      setLoading(true)
      fetch(`/api/interview-practice/getInterview?id=${interviewId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("API interview summary response:", data)
          const d = data && data.data ? data.data : data
          if (!d || typeof d !== "object") {
            setSessionData(null)
            return
          }
          function parseArr(val: unknown): string[] {
            if (typeof val === "string") {
              try {
                const parsed = JSON.parse(val)
                return Array.isArray(parsed) ? parsed : []
              } catch {
                return []
              }
            }
            return Array.isArray(val) ? (val as string[]) : []
          }
          d.questions = parseArr(d.questions)
          d.answers = parseArr(d.answers)
          d.tips = parseArr(d.tips)
          d.suggestions = parseArr(d.suggestions)
          let questionScoresArr: number[] = []
          if (typeof d.question_scores === "string") {
            try {
              const arr = JSON.parse(d.question_scores)
              if (Array.isArray(arr)) questionScoresArr = arr
            } catch {}
          }
          d.scores = questionScoresArr.length ? questionScoresArr : parseArr(d.scores)
          setSessionData(d)
        })
        .finally(() => setLoading(false))
    }
  }, [interviewId])

  if (loading || !minDelayPassed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="w-96 h-96 flex items-center justify-center">
            <Lottie animationData={interviewLoaderAnimation} loop={true} />
          </div>
          <div
            className="text-lg font-semibold animate-pulse"
            style={{
              background: "linear-gradient(90deg, #67e8f9 0%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            Generating Summary, please wait
          </div>
        </div>
      </main>
    )
  }

  if (!sessionData) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50">
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-700 mb-2">No summary data found</div>
          <div className="text-slate-500 mb-4">We couldn&apos;t find any interview summary for this session.</div>
          <Button onClick={() => router.push("/students/jobs/interview-practice")}>
            Go Back to History
          </Button>
        </div>
      </main>
    )
  }

  const { questions = [], answers = [], tips = [], suggestions = [], scores = [], score } = sessionData
  const speechSpeeds: string[] =
    typeof (sessionData as Record<string, unknown>).speech_speed === "string"
      ? JSON.parse((sessionData as Record<string, unknown>).speech_speed as string)
      : ((sessionData as Record<string, unknown>).speechSpeeds as string[] || []);
  const fillerWordsArr: string[] =
    typeof (sessionData as Record<string, unknown>).filler_words === "string"
      ? JSON.parse((sessionData as Record<string, unknown>).filler_words as string)
      : ((sessionData as Record<string, unknown>).fillerWordsArr as string[] || []);
  const answerType = sessionData.answer_type
  const feedbacks = questions.map((q: string, idx: number) => ({
    question: q,
    answer: answers[idx] ?? "",
    tip: tips[idx] ?? "",
    suggestion: suggestions[idx] ?? "",
    score: scores && scores[idx] != null ? scores[idx] : (score ?? 0),
    speechSpeed: speechSpeeds[idx] ?? "",
    fillerWords: fillerWordsArr[idx] ?? "",
  }))

  const overallScore =
    typeof score === "number"
      ? score
      : scores && scores.length
        ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
        : 0

  const performance = getPerformanceLevel(overallScore)
  const PerformanceIcon = performance.icon
  const progressColor = performance.progressColor

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 py-9">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col gap-3 relative h-full overflow-hidden">
            <div className="h-2 w-full bg-blue-500 rounded-t-2xl absolute left-0 top-0" />
            <div className="relative z-10">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Interview Summary</h1>
                <p className="text-slate-600 text-sm">Overall Score & Summary</p>
              </div>

              <div className="mb-4 flex justify-center relative">
                <div className="relative flex items-center justify-center">
                  <svg viewBox="0 0 100 100" width={100} height={100} className="block">
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      stroke={progressColor}
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 46}
                      strokeDashoffset={2 * Math.PI * 46 * (1 - overallScore / 100)}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 0.5s, stroke 0.5s" }}
                    />
                  </svg>
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.8rem",
                      fontWeight: "bold",
                      color: performance.level === "Needs Work" ? "#b91c1c" : "#1e293b",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {overallScore}%
                  </span>
                  {overallScore >= 90 && (
                    <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>

              {performance.lottie ? (
                <div className={`flex items-center justify-center gap-4 ${performance.bg} border rounded-xl p-4 mb-4 text-center`}>
                  <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
                    <Lottie animationData={performance.lottie} loop={true} />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className={`text-lg font-semibold ${performance.color} mb-1`}>{performance.level}</span>
                    <p className={`text-sm ${performance.color} opacity-80`}>
                      Keep practicing! Consistent effort leads to improvement.
                    </p>
                  </div>
                </div>
              ) : (
                <div className={`${performance.bg} ${performance.color} rounded-xl p-4 mb-4 text-center relative`}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <PerformanceIcon className={`w-5 h-5`} />
                    <span className="text-lg font-semibold">{performance.level}</span>
                  </div>
                  <p className="text-sm opacity-80">
                    {overallScore >= 90
                      ? "Outstanding performance! You're well-prepared for interviews."
                      : overallScore >= 80
                        ? "Strong performance! Minor improvements will perfect your skills."
                        : overallScore >= 70
                          ? "Good foundation! Focus on key areas for improvement."
                          : overallScore >= 60
                            ? "Solid effort! Additional practice will boost your confidence."
                            : "Keep practicing! Consistent effort leads to improvement."}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {sessionData.duration && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-3 text-center">
                    <Clock className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                    <div className="text-xs text-blue-600 font-medium">Duration</div>
                    <div className="text-sm font-semibold text-blue-800">{sessionData.duration}</div>
                  </div>
                )}
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl p-3 text-center">
                  <FaFileCircleQuestion  className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                  <div className="text-xs text-indigo-600 font-medium">Questions</div>
                  <div className="text-sm font-semibold text-indigo-800">{feedbacks.length}</div>
                </div>
                {sessionData.difficulty && (
                  <div
                    className={
                      sessionData.difficulty === "easy"
                        ? "bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-3 text-center"
                        : sessionData.difficulty === "medium"
                        ? "bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-3 text-center"
                        : sessionData.difficulty === "hard"
                        ? "bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-3 text-center"
                        : "bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-3 text-center"
                    }
                  >
                    <Zap
                      className={
                        sessionData.difficulty === "easy"
                          ? "w-4 h-4 text-green-600 mx-auto mb-1"
                          : sessionData.difficulty === "medium"
                          ? "w-4 h-4 text-purple-600 mx-auto mb-1"
                          : sessionData.difficulty === "hard"
                          ? "w-4 h-4 text-orange-600 mx-auto mb-1"
                          : "w-4 h-4 text-slate-600 mx-auto mb-1"
                      }
                    />
                    <div
                      className={
                        sessionData.difficulty === "easy"
                          ? "text-xs text-green-600 font-medium"
                          : sessionData.difficulty === "medium"
                          ? "text-xs text-purple-600 font-medium"
                          : sessionData.difficulty === "hard"
                          ? "text-xs text-orange-600 font-medium"
                          : "text-xs text-slate-600 font-medium"
                      }
                    >
                      Difficulty
                    </div>
                    <div
                      className={
                        sessionData.difficulty === "easy"
                          ? "text-sm font-semibold text-green-800 capitalize"
                          : sessionData.difficulty === "medium"
                          ? "text-sm font-semibold text-purple-800 capitalize"
                          : sessionData.difficulty === "hard"
                          ? "text-sm font-semibold text-orange-800 capitalize"
                          : "text-sm font-semibold text-slate-800 capitalize"
                      }
                    >
                      {sessionData.difficulty}
                    </div>
                  </div>
                )}
                {sessionData.answer_type && (
                  <div className="bg-gradient-to-br from-blue-50 to-slate-100 border border-slate-200 rounded-xl p-3 text-center">
                    <MdOutlineQuestionAnswer className="w-4 h-4 text-slate-600 mx-auto mb-1" />
                    <div className="text-xs text-slate-600 font-medium">Answer Type</div>
                    <div className="text-sm font-semibold text-slate-800 capitalize">{answerType}</div>
                  </div>
                )}
  
              </div>
            </div>

            <div className="flex gap-3 mt-5 relative z-10">
              <Button
                variant="outline"
                className="flex-1 border-blue-300 hover:bg-blue-50 text-blue-700 hover:text-blue-600 bg-transparent flex items-center justify-center gap-2"
                onClick={() => router.push("/students/jobs/interview-practice")}
              >
                <IoCaretBackCircleOutline className="w-5 h-5" />
                Go Back
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-md flex items-center justify-center gap-2"
                onClick={() => {
                  router.push(`/students/jobs/interview-practice/select-practice`)
                }}
              >
                <VscDebugRestart className="w-5 h-5" />
                Practice a New Interview
              </Button>
            </div>I
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 flex flex-col h-full overflow-hidden relative">
            <div className="h-2 w-full bg-blue-500 rounded-t-2xl absolute left-0 top-0" />
            <div className="flex items-center justify-between mb-4 mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-slate-300 hover:bg-white bg-transparent"
                onClick={() => setCurrentIdx((idx) => Math.max(0, idx - 1))}
                disabled={currentIdx === 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="text-center">
                <div className="text-lg font-semibold text-slate-800">
                  Question {currentIdx + 1} of {feedbacks.length}
                </div>
                <div className="text-sm text-slate-600">Performance Review</div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-slate-300 hover:bg-white bg-transparent"
                onClick={() => setCurrentIdx((idx) => Math.min(feedbacks.length - 1, idx + 1))}
                disabled={currentIdx === feedbacks.length - 1}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-auto min-h-0">
              <div className="flex flex-col gap-4 min-h-full">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-semibold text-slate-700">Question</span>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 rounded-lg p-4 text-slate-800">
                      {feedbacks[currentIdx].question}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-semibold text-green-700">Your Answer</span>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500 rounded-lg p-4 text-green-800 max-h-32 overflow-y-auto">
                      {feedbacks[currentIdx].answer}
                    </div>
                  </div>
                </div>
          
                <div
                  className={
                    feedbacks[currentIdx].score >= 90
                      ? "bg-green-50 border border-green-200 rounded-xl p-3 flex flex-col justify-between mb-0"
                      : feedbacks[currentIdx].score >= 80
                      ? "bg-blue-50 border border-blue-200 rounded-xl p-3 flex flex-col justify-between mb-0"
                      : feedbacks[currentIdx].score >= 70
                      ? "bg-sky-50 border border-sky-200 rounded-xl p-3 flex flex-col justify-between mb-0"
                      : feedbacks[currentIdx].score >= 60
                      ? "bg-orange-50 border border-orange-200 rounded-xl p-3 flex flex-col justify-between mb-0"
                      : feedbacks[currentIdx].score >= 50
                      ? "bg-amber-50 border border-amber-200 rounded-xl p-3 flex flex-col justify-between mb-0"
                      : feedbacks[currentIdx].score >= 40
                      ? "bg-rose-50 border border-rose-200 rounded-xl p-3 flex flex-col justify-between mb-0"
                      : feedbacks[currentIdx].score >= 30
                      ? "bg-pink-50 border border-pink-200 rounded-xl p-3 flex flex-col justify-between mb-0"
                      : "bg-red-50 border border-red-200 rounded-xl p-3 flex flex-col justify-between mb-0"
                  }
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-slate-700">Question Score</span>
                    <span
                      className={
                        feedbacks[currentIdx].score >= 90
                          ? "text-lg font-bold text-green-600"
                          : feedbacks[currentIdx].score >= 80
                          ? "text-lg font-bold text-blue-600"
                          : feedbacks[currentIdx].score >= 70
                          ? "text-lg font-bold text-sky-600"
                          : feedbacks[currentIdx].score >= 60
                          ? "text-lg font-bold text-orange-600"
                          : feedbacks[currentIdx].score >= 50
                          ? "text-lg font-bold text-amber-600"
                          : feedbacks[currentIdx].score >= 40
                          ? "text-lg font-bold text-rose-600"
                          : feedbacks[currentIdx].score >= 30
                          ? "text-lg font-bold text-pink-600"
                          : "text-lg font-bold text-red-600"
                      }
                    >
                      {feedbacks[currentIdx].score}%
                    </span>
                  </div>
                  <Progress
                    value={feedbacks[currentIdx].score}
                    className={
                      feedbacks[currentIdx].score >= 90
                        ? "h-2 bg-green-200 [&>div]:bg-green-600"
                        : feedbacks[currentIdx].score >= 80
                        ? "h-2 bg-blue-200 [&>div]:bg-blue-600"
                        : feedbacks[currentIdx].score >= 70
                        ? "h-2 bg-sky-200 [&>div]:bg-sky-600"
                        : feedbacks[currentIdx].score >= 60
                        ? "h-2 bg-orange-200 [&>div]:bg-orange-600"
                        : feedbacks[currentIdx].score >= 50
                        ? "h-2 bg-amber-200 [&>div]:bg-amber-600"
                        : feedbacks[currentIdx].score >= 40
                        ? "h-2 bg-rose-200 [&>div]:bg-rose-600"
                        : feedbacks[currentIdx].score >= 30
                        ? "h-2 bg-pink-200 [&>div]:bg-pink-600"
                        : "h-2 bg-red-200 [&>div]:bg-red-600"
                    }
                  />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-5">
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-amber-600" />
                      </div>
                      <span className="font-semibold text-amber-800">Key Insight</span>
                    </div>
                    <p className="text-sm text-amber-700 leading-relaxed">{feedbacks[currentIdx].tip}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-semibold text-blue-800">Suggested Improvement</span>
                    </div>
                    <p className="text-sm text-blue-700 leading-relaxed">{feedbacks[currentIdx].suggestion}</p>
                  </div>
                </div>
                {answerType === "recorded" && (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-5">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-blue-600 text-lg">🎤</span>
                        <span className="font-semibold text-blue-800">Speech Speed</span>
                      </div>
                      <p className="text-sm text-blue-700 leading-relaxed">
                        {(() => {
                          const speed = feedbacks[currentIdx].speechSpeed || "";
                          if (speed.toLowerCase().includes("fast")) {
                            return "You're speaking too fast. Try to slow down for better clarity and understanding.";
                          }
                          if (speed.toLowerCase().includes("slow")) {
                            return "You're speaking a bit slowly. Try to increase your pace for a more engaging delivery.";
                          }
                          if (speed.toLowerCase().includes("normal")) {
                            return "Your speech speed is just right. Keep it up!";
                          }
                          return speed || "N/A";
                        })()}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-blue-600 text-lg">⏱️</span>
                        <span className="font-semibold text-blue-800">Filler Words</span>
                      </div>
                      <p className="text-sm text-blue-700 leading-relaxed">{feedbacks[currentIdx].fillerWords || "N/A"}</p>
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium text-slate-700 mb-2 text-center">Question Navigation</div>
                  <div className="grid grid-cols-5 gap-1">
                    {feedbacks.map((feedback, idx) => (
                      <Button
                        key={idx}
                        variant={idx === currentIdx ? "default" : "outline"}
                        size="sm"
                        className={`h-10 relative ${
                          idx === currentIdx
                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                            : "hover:bg-blue-50 border-slate-200"
                        }`}
                        onClick={() => setCurrentIdx(idx)}
                      >
                        {idx + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}