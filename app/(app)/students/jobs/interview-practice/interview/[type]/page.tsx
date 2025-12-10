"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { Mic, MicOff, Shuffle, ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "../../components/ui/progress"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import genericInterviewQuestions from "../../generic-questions"
import { Tooltip as MuiTooltip } from "@mui/material"
import { SiAnswer } from "react-icons/si"
import { useSession } from "next-auth/react"
import Lottie from "lottie-react"
import feedbackLottie from "../../../../../../../public/animations/ai_loading.json"


function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
      <div className="text-blue-700 font-semibold text-lg">Loading questions...</div>
    </div>
  )
}

export default function InterviewPage() {
  const paramsRaw = useParams()
  const params = Object.fromEntries(
    Object.entries(paramsRaw ?? {}).map(([k, v]): [string, string] =>
      [k, Array.isArray(v) ? String((v as string[])[0]) : String(v as string)]
    )
  ) as { [key: string]: string }
  const searchParams = useSearchParams()
  const jobTitle = searchParams ? searchParams.get("title") : "" 

  const [questions, setQuestions] = useState<{ id: number; text: string }[]>([])
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecorded, setHasRecorded] = useState(false)
  const [answerMode, setAnswerMode] = useState<"recorded" | "typed" | null>(null)
  const [typedAnswer, setTypedAnswer] = useState("")
  interface Feedback {
    text: string;
    confidence: number;
    speechSpeed: string;
    fillerWords: string;
    timeAnalysis: string;
    tip: string;
    improvement: string;
  }
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [difficulty, setDifficulty] = useState("medium")

  const [answeredQuestions, setAnsweredQuestions] = useState<{ [idx: number]: { answer: string; feedback: Feedback } }>({})
  const [interviewStart, setInterviewStart] = useState<number | null>(null)
  const [duration, setDuration] = useState<number>(0)
  const [questionScores, setQuestionScores] = useState<{ [idx: number]: number }>({})
  const router = useRouter()
  const { data: session } = useSession()
  const [generatingFeedback, setGeneratingFeedback] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [transcribing, setTranscribing] = useState(false)
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)
  const [audioAnalyser, setAudioAnalyser] = useState<AnalyserNode | null>(null)
  const [audioLevels, setAudioLevels] = useState<number[]>([])
  const [recordError, setRecordError] = useState<string | null>(null)

  function getSessionQuestionsKey() {
    if (params.type === "job-specific") {
      return `interview_questions_${params.type}_${jobTitle}_${difficulty}`
    }
    return `interview_questions_${params.type}_${difficulty}`
  }

  function saveQuestionsToSession(questionsArr: { id: number; text: string }[]) {
    sessionStorage.setItem(getSessionQuestionsKey(), JSON.stringify(questionsArr))
  }

  function loadQuestionsFromSession(): { id: number; text: string }[] | null {
    const raw = sessionStorage.getItem(getSessionQuestionsKey())
    if (!raw) return null
    try {
      const arr = JSON.parse(raw)
      if (Array.isArray(arr) && arr.length > 0 && typeof arr[0].text === "string") {
        return arr
      }
    } catch {}
    return null
  }

  useEffect(() => {
    setCurrentQuestionIndex(0)
    setLoadingQuestions(true)
    if (params.type === "generic") {
      let set: string[]
      if (difficulty === "easy") {
        set = genericInterviewQuestions.easy
        const count = Math.min(7, set.length, Math.floor(Math.random() * (7 - 3 + 1)) + 3)
        const shuffled = [...set].sort(() => Math.random() - 0.5)
        const qs = shuffled.slice(0, count).map((q: string, i: number) => ({ id: i + 1, text: q }))
        setQuestions(qs)
        saveQuestionsToSession(qs)
        setLoadingQuestions(false)
        return
      } else if (difficulty === "medium") {
        set = genericInterviewQuestions.medium
        const count = Math.min(12, set.length, Math.floor(Math.random() * (12 - 8 + 1)) + 8)
        const shuffled = [...set].sort(() => Math.random() - 0.5)
        const qs = shuffled.slice(0, count).map((q: string, i: number) => ({ id: i + 1, text: q }))
        setQuestions(qs)
        saveQuestionsToSession(qs)
        setLoadingQuestions(false)
        return
      } else {
        // Hard mode: show all hard questions, no random count
        set = genericInterviewQuestions.hard
        const qs = set.map((q: string, i: number) => ({ id: i + 1, text: q }))
        setQuestions(qs)
        saveQuestionsToSession(qs)
        setLoadingQuestions(false)
        return
      }
    }
    const stored = loadQuestionsFromSession()
    if (stored) {
      setQuestions(stored)
      setLoadingQuestions(false)
      return
    }
    if (params.type === "job-specific") {
      const jobTitle = searchParams ? searchParams.get("title") : ""
      if (jobTitle) {
        fetch("/api/interview-questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobTitle, difficulty })
        })
          .then(res => res.json())
          .then(data => {
            const arr = (data.questions || "")
              .split(/\n+/)
              .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
              .filter(Boolean)
            const qs = arr.map((q: string, i: number) => ({ id: i + 1, text: q }))
            setQuestions(qs)
            saveQuestionsToSession(qs)
            setLoadingQuestions(false)
          })
          .catch(() => setLoadingQuestions(false))
      } else {
        setLoadingQuestions(false)
      }
    } else {
      setLoadingQuestions(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.type, difficulty, searchParams])

  useEffect(() => {
    let raf: number
    if (audioAnalyser) {
      const dataArray = new Uint8Array(audioAnalyser.frequencyBinCount)
      const update = () => {
        audioAnalyser.getByteFrequencyData(dataArray)
        const levels = Array.from(dataArray).slice(0, 16)
        setAudioLevels(levels)
        raf = requestAnimationFrame(update)
      }
      update()
      return () => cancelAnimationFrame(raf)
    }
  }, [audioAnalyser])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      setRecordingTime(0)
    }
    return () => clearInterval(timer)
  }, [isRecording])

  useEffect(() => {
    if (answerMode && !interviewStart) {
      setInterviewStart(Date.now())
      setDuration(0)
    }
  }, [answerMode, interviewStart])

  useEffect(() => {
    if (!interviewStart) return
    const interval = setInterval(() => {
      setDuration(Math.floor((Date.now() - interviewStart) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [interviewStart])

  const handleRecord = async () => {
    if (isRecording) {
      setIsRecording(false)
      mediaRecorderRef.current?.stop()
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop())
        setAudioStream(null)
      }
      setAudioAnalyser(null)
    } else {
      setFeedback(null)
      setTranscribing(false)
      setRecordError(null)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        setAudioStream(stream)
        const AudioContextClass: typeof AudioContext =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        const audioCtx = new AudioContextClass()
        const source = audioCtx.createMediaStreamSource(stream)
        const analyser = audioCtx.createAnalyser()
        analyser.fftSize = 64
        source.connect(analyser)
        setAudioAnalyser(analyser)
        setIsRecording(true)
        const recorder = new MediaRecorder(stream)
        const chunks: BlobPart[] = []
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data)
        }
        recorder.onstop = async () => {
          setAudioAnalyser(null)
          audioCtx.close()
          setTranscribing(true)
          const blob = new Blob(chunks, { type: "audio/webm" })
          const formData = new FormData()
          formData.append("file", blob, "audio.webm")
          try {
            const res = await fetch("/api/whisper-transcribe", {
              method: "POST",
              body: formData
            })
            const data = await res.json()
            const transcript = data.text || ""
            setTranscribing(false)
            if (!transcript.trim()) {
              setRecordError("No answer was detected. Please try recording again and speak clearly into your microphone.")
              setHasRecorded(false)
              setFeedback(null)
              return
            }
            setHasRecorded(true)
            const wordCount = transcript.trim().split(/\s+/).length
            const seconds = recordingTime > 0 ? recordingTime : 1
            const wpm = Math.round((wordCount / seconds) * 60)
            let speechSpeedLabel = ""
            if (wpm < 90) speechSpeedLabel = `${wpm} WPM (Slow)`
            else if (wpm <= 150) speechSpeedLabel = `${wpm} WPM (Normal)`
            else speechSpeedLabel = `${wpm} WPM (Fast)`
            const fillerWordsList = ["um", "uh"]
            const transcriptLower = transcript.toLowerCase()
            const foundFillers = fillerWordsList.filter(word =>
              transcriptLower.includes(word)
            )
            let fillerWordsSummary = ""
            if (foundFillers.length === 0) {
              fillerWordsSummary = "No common filler words detected."
            } else {
              fillerWordsSummary = `Detected: ${[...new Set(foundFillers)].join(", ")}`
            }
            setGeneratingFeedback(true)
            try {
              const feedbackRes = await fetch("/api/interview-practice/generateFeedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  question: questions[currentQuestionIndex]?.text || "",
                  answer: transcript,
                  mode: "record"
                })
              })
              const aiFeedback = await feedbackRes.json()
              const feedbackObj = {
                text: transcript,
                confidence: aiFeedback.score ?? 76,
                speechSpeed: aiFeedback.speechSpeed ?? speechSpeedLabel,
                fillerWords: aiFeedback.fillerWords ?? fillerWordsSummary,
                timeAnalysis: aiFeedback.timeAnalysis ?? "",
                tip: aiFeedback.tip ?? "",
                improvement: aiFeedback.improvement ?? ""
              }
              setFeedback(feedbackObj)
              setAnsweredQuestions(prev => ({
                ...prev,
                [currentQuestionIndex]: {
                  answer: transcript,
                  feedback: feedbackObj
                }
              }))
              setQuestionScores(prev => ({
                ...prev,
                [currentQuestionIndex]: feedbackObj.confidence
              }))
              saveRecordedAnswerToSession(
                transcript,
                currentQuestionIndex,
                feedbackObj.confidence,
                feedbackObj.tip,
                feedbackObj.improvement,
                feedbackObj.speechSpeed,
                feedbackObj.fillerWords,
                feedbackObj.timeAnalysis
              )
            } catch {
              const feedbackObj = {
                text: transcript,
                confidence: 76,
                speechSpeed: speechSpeedLabel,
                fillerWords: fillerWordsSummary,
                timeAnalysis: "",
                tip: "",
                improvement: ""
              }
              setFeedback(feedbackObj)
              setAnsweredQuestions(prev => ({
                ...prev,
                [currentQuestionIndex]: {
                  answer: transcript,
                  feedback: feedbackObj
                }
              }))
              setQuestionScores(prev => ({
                ...prev,
                [currentQuestionIndex]: feedbackObj.confidence
              }))
              saveRecordedAnswerToSession(
                transcript,
                currentQuestionIndex,
                feedbackObj.confidence,
                feedbackObj.tip,
                feedbackObj.improvement,
                feedbackObj.speechSpeed,
                feedbackObj.fillerWords,
                feedbackObj.timeAnalysis
              )
            } finally {
              setGeneratingFeedback(false)
            }
          } catch {
            setTranscribing(false)
            setFeedback({
              text: "Transcription failed.",
              confidence: 0,
              speechSpeed: "",
              fillerWords: "",
              timeAnalysis: "",
              tip: "",
              improvement: ""
            })
          }
        }
        mediaRecorderRef.current = recorder
        recorder.start()
      } catch {
        setIsRecording(false)
        setAudioAnalyser(null)
        setAudioStream(null)
      }
    }
  }

  const resetRecording = () => {
    setHasRecorded(false)
    setFeedback(null)
    setTranscribing(false)
    setAudioAnalyser(null)
    setRecordError(null)
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop())
      setAudioStream(null)
    }
  }

  const nextQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length)
    resetRecording()
  }

  const prevQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev - 1 + questions.length) % questions.length)
    resetRecording()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  function formatDuration(seconds: number) {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  function saveInterviewSession(answerType: "recorded" | "typed") {
    const sessionData = {
      interview_type: params.type,
      difficulty,
      answer_type: answerType,
      questions: questions.map(q => q.text),
      answers: [],
      tips: [],
      suggestions: [],
      duration: "00:00:00",
      score: null,
      finished_at: null
    }
    sessionStorage.setItem("current_interview_practice", JSON.stringify(sessionData))
  }

  function saveTypedAnswerToSession(answer: string, questionIdx: number, score?: number, tip?: string, suggestion?: string) {
    const sessionRaw = sessionStorage.getItem("current_interview_practice")
    if (!sessionRaw) return
    const session = JSON.parse(sessionRaw)
    if (!Array.isArray(session.answers)) session.answers = []
    session.answers[questionIdx] = answer
    session.duration = formatDuration(duration)
    if (!Array.isArray(session.scores)) session.scores = []
    if (typeof score === "number") session.scores[questionIdx] = score
    if (!Array.isArray(session.tips)) session.tips = []
    if (!Array.isArray(session.suggestions)) session.suggestions = []
    session.tips[questionIdx] = tip ?? ""
    session.suggestions[questionIdx] = suggestion ?? ""
    sessionStorage.setItem("current_interview_practice", JSON.stringify(session))
    setAnsweredQuestions(prev => ({
      ...prev,
      [questionIdx]: {
        answer,
        feedback: {
          text: answer,
          confidence: score ?? 80,
          speechSpeed: "N/A (typed answer)",
          fillerWords: "N/A (typed answer)",
          timeAnalysis: "N/A (typed answer)",
          tip: tip ?? "Review your answer for clarity and completeness.",
          improvement: suggestion ?? ""
        }
      }
    }))
    setQuestionScores(prev => ({
      ...prev,
      [questionIdx]: score ?? 80
    }))
  }

  function saveRecordedAnswerToSession(
    answer: string,
    questionIdx: number,
    score?: number,
    tip?: string,
    suggestion?: string,
    speechSpeed?: string,
    fillerWords?: string,
    timeAnalysis?: string
  ) {
    const sessionRaw = sessionStorage.getItem("current_interview_practice")
    if (!sessionRaw) return
    const session = JSON.parse(sessionRaw)
    if (!Array.isArray(session.answers)) session.answers = []
    session.answers[questionIdx] = answer
    session.duration = formatDuration(duration)
    if (!Array.isArray(session.scores)) session.scores = []
    if (typeof score === "number") session.scores[questionIdx] = score
    if (!Array.isArray(session.tips)) session.tips = []
    if (!Array.isArray(session.suggestions)) session.suggestions = []
    session.tips[questionIdx] = tip ?? ""
    session.suggestions[questionIdx] = suggestion ?? ""
    if (!Array.isArray(session.speechSpeeds)) session.speechSpeeds = []
    if (!Array.isArray(session.fillerWordsArr)) session.fillerWordsArr = []
    if (!Array.isArray(session.timeAnalyses)) session.timeAnalyses = []
    session.speechSpeeds[questionIdx] = speechSpeed ?? ""
    session.fillerWordsArr[questionIdx] = fillerWords ?? ""
    session.timeAnalyses[questionIdx] = timeAnalysis ?? ""
    sessionStorage.setItem("current_interview_practice", JSON.stringify(session))
    setAnsweredQuestions(prev => ({
      ...prev,
      [questionIdx]: {
        answer,
        feedback: {
          text: answer,
          confidence: score ?? 76,
          speechSpeed: speechSpeed ?? "",
          fillerWords: fillerWords ?? "",
          timeAnalysis: timeAnalysis ?? "",
          tip: tip ?? "",
          improvement: suggestion ?? ""
        }
      }
    }))
    setQuestionScores(prev => ({
      ...prev,
      [questionIdx]: score ?? 76
    }))
  }

  useEffect(() => {
    if (answerMode === "typed" && answeredQuestions[currentQuestionIndex]) {
      setHasRecorded(true)
      setTypedAnswer(answeredQuestions[currentQuestionIndex].answer)
      setFeedback(answeredQuestions[currentQuestionIndex].feedback)
    } else if (answerMode === "typed") {
      setHasRecorded(false)
      setTypedAnswer("")
      setFeedback(null)
    } else if (answerMode === "recorded" && answeredQuestions[currentQuestionIndex]) {
      setHasRecorded(true)
      setFeedback(answeredQuestions[currentQuestionIndex].feedback)
    } else if (answerMode === "recorded") {
      setHasRecorded(false)
      setFeedback(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, answerMode])

  async function handleFinishInterview() {
    const sessionRaw = sessionStorage.getItem("current_interview_practice")
    if (!sessionRaw) return
    const sessionData = JSON.parse(sessionRaw)
    const user = session?.user as Record<string, unknown> | undefined
    const student_id =
      user && typeof user === "object" && "studentId" in user
        ? (user["studentId"] as string)
        : undefined
    if (!student_id) {
      alert("Student ID missing")
      return
    }
    sessionData.student_id = student_id
    sessionData.finished_at = new Date().toISOString().slice(0, 10)
    sessionData.duration = formatDuration(duration)
    let scoresArr: number[] = []
    if (Array.isArray(sessionData.scores)) {
      scoresArr = sessionData.scores.filter((s: unknown) => typeof s === "number") as number[]
    } else {
      scoresArr = Object.values(questionScores)
    }
    if (!scoresArr.length) {
      scoresArr = Object.values(questionScores)
    }
    let avgScore: number | null = null
    if (scoresArr.length) {
      avgScore = Math.round(scoresArr.reduce((a: number, b: number) => a + b, 0) / scoresArr.length)
    }
    sessionData.score = avgScore
    try {
      const res = await fetch("/api/interview-practice/postInterview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionData)
      })
      const result = await res.json()
      sessionStorage.removeItem("current_interview_practice")
      if (result && result.id) {
        router.push(`/students/jobs/interview-practice/interview/summary?id=${result.id}`)
      } else {
        router.push("/students/jobs/interview-practice/interview/summary")
      }
    } catch (e) {
      console.error(e)
      alert("Failed to submit interview. Please try again.")
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/students/jobs/interview-practice/select-practice"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Selection
        </Link>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-1"></div>
            <div className="p-6 md:p-8 relative">
              
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  {params.type === "job-specific" && jobTitle
                    ? `${jobTitle} Interview`
                    : typeof params.type === "string"
                    ? params.type.charAt(0).toUpperCase() + params.type.slice(1) + " Interview"
                    : "Interview"}
                </h1>

                <div className="relative">
                  <MuiTooltip
                    title={answerMode !== null ? "You can't change this during an interview!" : ""}
                    placement="top"
                    disableHoverListener={answerMode === null}
                    arrow
                  >
                    <span>
                      <select
                        className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm disabled:bg-gray-100 disabled:text-gray-400"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        disabled={answerMode !== null}
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                     
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </span>
                  </MuiTooltip>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded-lg inline-block">
                  {difficulty === "easy" &&
                    "Easy: 3-7 questions, no timer"}
                  {difficulty === "medium" &&
                    "Balanced challenge: 8-12 questions, no timer"}
                  {difficulty === "hard" &&
                    "Hard: 12-15 questions, timer on, next questions blurred until it’s their turn."}
                </div>
                <MuiTooltip
                  title={
                    answerMode !== null && (difficulty === "medium" || difficulty === "hard")
                      ? "You can't shuffle questions during an interview at this difficulty!"
                      : ""
                  }
                  placement="top"
                  disableHoverListener={!(answerMode !== null && (difficulty === "medium" || difficulty === "hard"))}
                  arrow
                >
                  <span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-600 hover:text-blue-700 hover:border-blue-300 group ml-4"
                      onClick={() => {
                        if (params.type === "generic") {
                          let set: string[]
                          if (difficulty === "easy") {
                            set = genericInterviewQuestions.easy
                            const count = Math.min(7, set.length, Math.floor(Math.random() * (7 - 3 + 1)) + 3)
                            const shuffled = [...set].sort(() => Math.random() - 0.5)
                            const qs = shuffled.slice(0, count).map((q: string, i: number) => ({ id: i + 1, text: q }))
                            setQuestions(qs)
                            saveQuestionsToSession(qs)
                            setCurrentQuestionIndex(0)
                          } else if (difficulty === "medium") {
                            set = genericInterviewQuestions.medium
                            const count = Math.min(12, set.length, Math.floor(Math.random() * (12 - 8 + 1)) + 8)
                            const shuffled = [...set].sort(() => Math.random() - 0.5)
                            const qs = shuffled.slice(0, count).map((q: string, i: number) => ({ id: i + 1, text: q }))
                            setQuestions(qs)
                            saveQuestionsToSession(qs)
                            setCurrentQuestionIndex(0)
                          } else {
                            // Hard mode: show all hard questions, shuffled
                            set = genericInterviewQuestions.hard
                            const shuffled = [...set].sort(() => Math.random() - 0.5)
                            const qs = shuffled.map((q: string, i: number) => ({ id: i + 1, text: q }))
                            setQuestions(qs)
                            saveQuestionsToSession(qs)
                            setCurrentQuestionIndex(0)
                          }
                        } else if (params.type === "job-specific" && jobTitle) {
                          setLoadingQuestions(true)
                          fetch("/api/interview-questions", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ jobTitle, difficulty })
                          })
                            .then(res => res.json())
                            .then(data => {
                              const arr = (data.questions || "")
                                .split(/\n+/)
                                .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
                                .filter(Boolean)
                              const shuffled = arr
                                .sort(() => Math.random() - 0.5)
                                .map((q: string, i: number) => ({ id: i + 1, text: q }))
                              setQuestions(shuffled)
                              saveQuestionsToSession(shuffled)
                              setCurrentQuestionIndex(0)
                              setLoadingQuestions(false)
                            })
                            .catch(() => setLoadingQuestions(false))
                        }
                      }}
                      disabled={
                        (answerMode !== null && (difficulty === "medium" || difficulty === "hard")) ||
                        loadingQuestions
                      }
                    >
                      <Shuffle className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" /> Shuffle
                      Questions
                    </Button>
                  </span>
                </MuiTooltip>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-700">Current Question</h3>
                  <div className="text-sm text-gray-500">
                    {loadingQuestions ? "Loading..." : `${currentQuestionIndex + 1} of ${questions.length}`}
                  </div>
                </div>

                <div className="flex justify-between gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={prevQuestion}
                    disabled={currentQuestionIndex === 0 || loadingQuestions || difficulty === "hard"}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={nextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1 || loadingQuestions || difficulty === "hard"}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`p-4 rounded-lg border border-blue-500 bg-blue-50 ${difficulty === "hard" ? "blur-sm pointer-events-none select-none" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
                        {questions.length > 0 && !loadingQuestions ? currentQuestionIndex + 1 : "-"}
                      </div>
                      <div className="text-gray-800 font-medium">
                        {loadingQuestions
                          ? "Loading questions..."
                          : questions.length > 0
                          ? questions[currentQuestionIndex].text
                          : "No questions available."}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              {loadingQuestions ? (
                <Spinner />
              ) : (
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Upcoming Questions</h3>
                  <div className="space-y-3">
                    {questions.slice(currentQuestionIndex + 1, currentQuestionIndex + 4).map((question, index) => (
                      <div
                        key={question.id}
                        className={`p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors ${difficulty === "hard" ? "blur-sm pointer-events-none select-none" : ""}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                            {currentQuestionIndex + index + 2}
                          </div>
                          <div className="text-gray-600">{question.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-1"></div>
            <div className="p-6 md:p-8 flex flex-col h-full">
              {generatingFeedback ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-56 h-56 mb-4">
                    <Lottie animationData={feedbackLottie} loop={true} />
                  </div>
                  <span
                    className="text-lg font-semibold animate-pulse"
                    style={{
                      background: "linear-gradient(90deg, #67e8f9 0%, #a78bfa 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent"
                    }}
                  >
                    Generating feedback
                  </span>
                </div>
              ) : !hasRecorded ? (
                answerMode === null ? (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="flex flex-col w-full mb-6">
                      <div className="flex justify-start items-center">
                        <h2 className="text-2xl font-bold text-gray-800">Select how you want to answer</h2>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 ml-0">
                        You can only select your answer type once per interview.
                      </span>
                    </div>
                    <div className="flex flex-col gap-8 w-full max-w-md">
                      <button
                        type="button"
                        className={`w-full flex flex-col items-center border-2 rounded-2xl p-6 transition-all cursor-pointer border-gray-200 bg-white
                          hover:shadow-[0_0_0_4px_rgba(37,99,235,0.15)]
                          ${isRecording ? "pointer-events-none opacity-70" : ""}
                          ${difficulty === "hard" ? "" : ""}
                        `}
                        onClick={() => {
                          if (!isRecording) {
                            setAnswerMode("recorded")
                            saveInterviewSession("recorded")
                          }
                        }}
                        disabled={isRecording}
                      >
                        <div
                          className={`w-36 h-36 rounded-full flex items-center justify-center mb-6 transition-all transform hover:scale-105 ${
                            isRecording
                              ? "bg-gradient-to-r from-red-500 to-red-600 animate-pulse shadow-lg shadow-red-200"
                              : "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-100"
                          }`}
                          onClick={e => {
                            e.stopPropagation()
                            setAnswerMode("recorded")
                            saveInterviewSession("recorded")
                            handleRecord()
                          }}
                        >
                          {isRecording ? (
                            <MicOff className="w-16 h-16 text-white" />
                          ) : (
                            <Mic className="w-16 h-16 text-white" />
                          )}
                        </div>
                        {isRecording && (
                          <div className="text-red-500 font-medium mb-2 animate-pulse">
                            Recording: {formatTime(recordingTime)}
                          </div>
                        )}
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Record your answer</h2>
                        <p className="text-gray-600 text-center max-w-xs mb-6">
                          Just talk it out! It catches your tone and confidence for more spot-on feedback.
                        </p>
                      </button>
                      <div className="flex items-center w-full my-2">
                        <div className="flex-1 h-px bg-gray-300" />
                        <span className="mx-4 text-gray-400 font-semibold">OR</span>
                        <div className="flex-1 h-px bg-gray-300" />
                      </div>
                      <MuiTooltip
                        title={difficulty === "hard" ? "You can't use typing in Hard difficulty" : ""}
                        placement="top"
                        disableHoverListener={difficulty !== "hard"}
                        arrow
                      >
                        <span
                          style={{ display: "inline-block", width: "100%" }}
                          className={difficulty === "hard" ? "cursor-not-allowed" : ""}
                        >
                          <button
                            type="button"
                            className={`w-full flex flex-col items-center border-2 rounded-2xl p-6 transition-all border-gray-200 bg-white
                              hover:shadow-[0_0_0_4px_rgba(37,99,235,0.15)]
                              ${difficulty === "hard" ? "opacity-60 pointer-events-none" : ""}
                            `}
                            onClick={() => {
                              if (difficulty !== "hard") {
                                setAnswerMode("typed")
                                saveInterviewSession("typed")
                              }
                            }}
                            disabled={difficulty === "hard"}
                            tabIndex={difficulty === "hard" ? -1 : 0}
                          >
                            <div className="w-full">
                              <TypingAnimation />
                            </div>
                            <div className="mt-6 w-full flex flex-col items-center">
                              <span className="text-xl font-bold text-gray-800 mb-2">Type your answer</span>
                              <span className="text-gray-600 text-center max-w-xs">
                                Prefer typing? Writing works too! Quick and easy, but can’t catch tone or confidence.
                              </span>
                            </div>
                          </button>
                        </span>
                      </MuiTooltip>
                    </div>
                  </div>
                ) : answerMode === "recorded" ? (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div
                      className={`w-36 h-36 rounded-full flex items-center justify-center mb-6 transition-all transform hover:scale-105 ${
                        isRecording
                          ? "bg-gradient-to-r from-red-500 to-red-600 animate-pulse shadow-lg shadow-red-200"
                          : "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-100"
                      }`}
                      onClick={e => {
                        e.stopPropagation()
                        handleRecord()
                      }}
                    >
                      {isRecording ? (
                        <MicOff className="w-16 h-16 text-white" />
                      ) : (
                        <Mic className="w-16 h-16 text-white" />
                      )}
                    </div>
                    {isRecording && <AudioVisualizer levels={audioLevels} />}
                    {isRecording && (
                      <div className="text-red-500 font-medium mb-2 animate-pulse">
                        Recording: {formatTime(recordingTime)}
                      </div>
                    )}
                    {transcribing && (
                      <div className="text-blue-600 font-medium mb-2 animate-pulse">
                        Transcribing...
                      </div>
                    )}
                    {recordError && (
                      <div className="text-red-600 font-semibold mb-4 text-center">
                        {recordError}
                      </div>
                    )}
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Record your answer</h2>
                    <p className="text-gray-600 text-center max-w-xs mb-6">
                      Record your answer – Speak it out for more natural and confident responses.
                    </p>
                  </div>
                ) : (
                  <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center">
                    {generatingFeedback ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="w-56 h-56 mb-4">
                          <Lottie animationData={feedbackLottie} loop={true} />
                        </div>
                        <span
                          className="text-lg font-semibold animate-pulse"
                          style={{
                            background: "linear-gradient(90deg, #67e8f9 0%, #a78bfa 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                          }}
                        >
                          Generating feedback
                        </span>
                      </div>
                    ) : !hasRecorded ? (
                      <div className="bg-blue-50 border border-blue-200 rounded-2xl shadow-md p-8 flex flex-col items-center">
                        <h2 className="text-2xl font-bold text-blue-800 mb-2">Type your answer</h2>
                        <p className="text-gray-600 text-center mb-6 max-w-xs">
                          Type your answer – Write it out for clear, straightforward responses.
                        </p>
                        <textarea
                          className="w-full border border-blue-200 rounded-lg p-4 text-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white resize-none transition-shadow shadow-sm focus:shadow-lg"
                          rows={6}
                          value={typedAnswer}
                          onChange={e => setTypedAnswer(e.target.value)}
                          disabled={hasRecorded || difficulty === "hard"}
                          placeholder="Type your answer here..."
                        />
                        <Button
                          className="w-full mt-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg font-semibold py-3 rounded-xl shadow transition-all"
                          onClick={async () => {
                            setGeneratingFeedback(true)
                            setFeedback(null)
                            const question = questions[currentQuestionIndex]?.text || ""
                            const answer = typedAnswer
                            try {
                              const res = await fetch("/api/interview-practice/generateFeedback", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ question, answer })
                              })
                              const aiFeedback = await res.json()
                              setFeedback({
                                text: answer,
                                confidence: aiFeedback.score ?? 80,
                                speechSpeed: "N/A (typed answer)",
                                fillerWords: "N/A (typed answer)",
                                timeAnalysis: "N/A (typed answer)",
                                tip: aiFeedback.tip ?? "Review your answer for clarity and completeness.",
                                improvement: aiFeedback.improvement ?? ""
                              })
                              saveTypedAnswerToSession(
                                typedAnswer,
                                currentQuestionIndex,
                                aiFeedback.score ?? 80,
                                aiFeedback.tip ?? "Review your answer for clarity and completeness.",
                                aiFeedback.improvement ?? ""
                              )
                              setHasRecorded(true)
                            } finally {
                              setGeneratingFeedback(false)
                            }
                          }}
                          disabled={!typedAnswer.trim() || difficulty === "hard" || generatingFeedback}
                        >
                          Submit Answer
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-blue-50 border border-blue-200 rounded-2xl shadow-md p-8 flex flex-col items-center">
                        <div className="flex justify-center mb-4">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-100">
                            <SiAnswer className="w-12 h-12 text-white" />
                          </div>
                        </div>
                        <h2 className="text-2xl font-bold text-blue-800 mb-2">Answer Recorded</h2>
                        <p className="text-gray-600 text-center mb-6 max-w-xs">
                          Your answer has been saved. See feedback below.
                        </p>
                        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 w-full">
                          <p className="text-gray-600 italic">{feedback?.text}</p>
                        </div>
                        <div className="space-y-5 w-full">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700">Overall Rating:</span>
                              <span className="text-sm font-medium text-gray-700">{feedback?.confidence}%</span>
                            </div>
                            <Progress value={feedback?.confidence} className="h-2" />
                            {(() => {
                              const score = feedback?.confidence ?? 0
                              if (score <= 10) {
                                return <p className="text-xs text-red-500 mt-1 font-semibold">Uh-oh! You could do better. Try to give a more complete answer.</p>
                              } else if (score <= 40) {
                                return <p className="text-xs text-orange-500 mt-1 font-semibold">Needs improvement. Add more detail and relevance to your answer.</p>
                              } else if (score <= 70) {
                                return <p className="text-xs text-yellow-600 mt-1 font-semibold">Decent, but could be clearer and more specific.</p>
                              } else if (score <= 89) {
                                return <p className="text-xs text-blue-600 mt-1 font-semibold">Good answer! A little more detail could make it excellent.</p>
                              } else {
                                return <p className="text-xs text-green-600 mt-1 font-semibold">Excellent answer! Keep it up!</p>
                              }
                            })()}
                          </div>
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="flex gap-3">
                              <span className="text-amber-500 text-xl">💡</span>
                              <div>
                                <span className="text-sm font-medium text-gray-800">Key Insight:</span>
                                <p className="text-sm text-gray-700">{feedback?.tip}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button
                          className="w-full mt-4"
                          onClick={() => {
                            setHasRecorded(false)
                            setTypedAnswer("")
                            setFeedback(null)
                          }}
                        >
                          Edit Answer
                        </Button>
                      </div>
                    )}
                  </div>
                )
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-center mb-6">
                    {answerMode === "typed" ? (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-100">
                        <SiAnswer className="w-12 h-12 text-white" />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-100">
                        <Mic className="w-12 h-12 text-white" />
                      </div>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Answer Recorded</h2>

                  <div className="bg-gray-50 rounded-xl p-6 mb-6 overflow-auto flex-1">
                    <h3 className="font-bold text-gray-800 mb-4 text-lg">Feedback</h3>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                      <p className="text-gray-600 italic">{feedback?.text}</p>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">Overall Rating:</span>
                          <span className="text-sm font-medium text-gray-700">{feedback?.confidence}%</span>
                        </div>
                        <Progress value={feedback?.confidence} className="h-2" />
                        {(() => {
                          const score = feedback?.confidence ?? 0
                          if (score <= 10) {
                            return <p className="text-xs text-red-500 mt-1 font-semibold">Uh-oh! You could do better. Try to give a more complete answer.</p>
                          } else if (score <= 40) {
                            return <p className="text-xs text-orange-500 mt-1 font-semibold">Needs improvement. Add more detail and relevance to your answer.</p>
                          } else if (score <= 70) {
                            return <p className="text-xs text-yellow-600 mt-1 font-semibold">Decent, but could be clearer and more specific.</p>
                          } else if (score <= 89) {
                            return <p className="text-xs text-blue-600 mt-1 font-semibold">Good answer! A little more detail could make it excellent.</p>
                          } else {
                            return <p className="text-xs text-green-600 mt-1 font-semibold">Excellent answer! Keep it up!</p>
                          }
                        })()}
                      </div>

                      {answerMode !== "typed" && (
                        <div className="space-y-3">
                          <div className="flex gap-3 items-start bg-blue-50 p-3 rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                              <span className="text-blue-600 text-sm">🎤</span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-800">Speech Speed:</span>
                              <p className="text-sm text-gray-600">{feedback?.speechSpeed}</p>
                            </div>
                          </div>

                          <div className="flex gap-3 items-start bg-blue-50 p-3 rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                              <span className="text-blue-600 text-sm">⏱️</span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-800">Filler Words:</span>
                              <p className="text-sm text-gray-600">{feedback?.fillerWords}</p>
                            </div>
                          </div>

                          <div className="flex gap-3 items-start bg-blue-50 p-3 rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                              <span className="text-blue-600 text-sm">⏳</span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-800">Time Analysis:</span>
                              <p className="text-sm text-gray-600">{feedback?.timeAnalysis}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex gap-3">
                          <span className="text-amber-500 text-xl">💡</span>
                          <div>
                            <span className="text-sm font-medium text-gray-800">Tip:</span>
                            <p className="text-sm text-gray-700">{feedback?.tip}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex gap-3">
                          <span className="text-green-500 text-xl">✨</span>
                          <div>
                            <span className="text-sm font-medium text-gray-800">Suggested Improvement:</span>
                            <p className="text-sm text-gray-700">
                              {feedback?.improvement
                                ? feedback.improvement
                                : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-auto">
                    <Button
                      variant="outline"
                      className="flex-1 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                      onClick={resetRecording}
                    >
                      Try Again
                    </Button>
                    {currentQuestionIndex === questions.length - 1 ? (
                      <Button
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        onClick={handleFinishInterview}
                      >
                        Finish Interview
                      </Button>
                    ) : (
                      <Button
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        onClick={nextQuestion}
                      >
                        Next Question
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function TypingAnimation() {
  const samples = [
    "I'm passionate about web development and love building user-friendly apps.",
    "I have experience with HTML, CSS, JavaScript, and React.",
    "My goal is to contribute my skills to a great team.",
  ]
  const [text, setText] = useState("")
  const [sampleIdx, setSampleIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (!deleting && charIdx < samples[sampleIdx].length) {
      timeout = setTimeout(() => setCharIdx(charIdx + 1), 50)
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(charIdx - 1), 30)
    } else if (!deleting && charIdx === samples[sampleIdx].length) {
      timeout = setTimeout(() => setDeleting(true), 1200)
    } else if (deleting && charIdx === 0) {
      timeout = setTimeout(() => {
        setDeleting(false)
        setSampleIdx((sampleIdx + 1) % samples.length)
      }, 400)
    }
    setText(samples[sampleIdx].slice(0, charIdx))
    return () => clearTimeout(timeout)
  }, [charIdx, deleting, sampleIdx, samples])

  return (
    <div className="w-full max-w-md border border-blue-200 rounded-lg p-4 text-lg bg-white min-h-[72px] font-mono text-blue-700 shadow-inner">
      {text}
      <span className="animate-pulse">|</span>
    </div>
  )
}

function AudioVisualizer({ levels }: { levels: number[] }) {
  return (
    <div className="flex items-end justify-center gap-1 h-8 mt-2 mb-2">
      {levels.map((v, i) => (
        <div
          key={i}
          style={{
            width: 4,
            height: `${(v / 255) * 32 + 4}px`,
            background: "linear-gradient(180deg,#3b82f6,#6366f1)",
            borderRadius: 2,
            opacity: 0.7,
            transition: "height 0.1s"
          }}
        />
      ))}
    </div>
  )
}




