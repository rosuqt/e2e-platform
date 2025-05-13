"use client"

import { useState, useEffect } from "react"
import { Mic, MicOff, Shuffle, ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "../../components/ui/progress"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

const genericQuestions = [
  { id: 1, text: "Tell me about yourself." },
  { id: 2, text: "Why do you want to work here?" },
  { id: 3, text: "Can you describe a challenge you faced at work and how you handled it?" },
  { id: 4, text: "Tell me about a time you worked in a team." },
  { id: 5, text: "What would you do if you disagreed with your manager?" },
  { id: 6, text: "How do you handle constructive criticism?" },
  { id: 7, text: "How do you handle stress at work?" },
  { id: 8, text: "How do you stay updated with industry trends?" },
]

export default function InterviewPage({ params }: { params: { type: string } }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecorded, setHasRecorded] = useState(false)
  interface Feedback {
    text: string;
    confidence: number;
    speechSpeed: string;
    fillerWords: string;
    timeAnalysis: string;
    tip: string;
  }

  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [difficulty, setDifficulty] = useState("medium")

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

  const handleRecord = () => {
    if (isRecording) {
      setIsRecording(false)
      setHasRecorded(true)
      setFeedback({
        text: "I am a recent IT graduate passionate about web development. I have experience with HTML, CSS, and JavaScript, and I enjoy building user-friendly websites. I'm excited to apply my skills in a professional setting!",
        confidence: 76,
        speechSpeed: "Slightly fast, which may impact clarity",
        fillerWords: "A few hesitations ('uh', 'um') detected",
        timeAnalysis: "Neutral, but could use more elaboration",
        tip: "Be more structured—start strong, highlight key skills, and end with a goal.",
      })
    } else {
      setIsRecording(true)
      setFeedback(null)
    }
  }

  const resetRecording = () => {
    setHasRecorded(false)
    setFeedback(null)
  }

  const shuffleQuestions = () => {
    resetRecording()
  }

  const nextQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % genericQuestions.length)
    resetRecording()
  }

  const prevQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev - 1 + genericQuestions.length) % genericQuestions.length)
    resetRecording()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/select-practice"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Selection
        </Link>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Questions Panel */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-1"></div>
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  {params.type.charAt(0).toUpperCase() + params.type.slice(1)} Interview
                </h1>

                <div className="relative">
                  <select
                    className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
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
                </div>
              </div>

              <div className="text-xs text-gray-500 mb-4 bg-blue-50 p-2 rounded-lg inline-block">
                Balanced challenge: no timer, 8-12 questions
              </div>

              <Button
                variant="outline"
                size="sm"
                className="mb-6 text-gray-600 hover:text-blue-700 hover:border-blue-300 group"
                onClick={shuffleQuestions}
              >
                <Shuffle className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" /> Shuffle
                Questions
              </Button>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-700">Current Question</h3>
                  <div className="text-sm text-gray-500">
                    {currentQuestionIndex + 1} of {genericQuestions.length}
                  </div>
                </div>

                <div className="flex justify-between gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={prevQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={nextQuestion}
                    disabled={currentQuestionIndex === genericQuestions.length - 1}
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
                    className="p-4 rounded-lg border border-blue-500 bg-blue-50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
                        {currentQuestionIndex + 1}
                      </div>
                      <div className="text-gray-800 font-medium">{genericQuestions[currentQuestionIndex].text}</div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Upcoming Questions</h3>
                <div className="space-y-3">
                  {genericQuestions.slice(currentQuestionIndex + 1, currentQuestionIndex + 4).map((question, index) => (
                    <div
                      key={question.id}
                      className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
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
            </div>
          </div>

          {/* Recording Panel */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-1"></div>
            <div className="p-6 md:p-8 flex flex-col h-full">
              {!hasRecorded ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div
                    className={`w-36 h-36 rounded-full flex items-center justify-center mb-6 transition-all cursor-pointer transform hover:scale-105 ${
                      isRecording
                        ? "bg-gradient-to-r from-red-500 to-red-600 animate-pulse shadow-lg shadow-red-200"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-100"
                    }`}
                    onClick={handleRecord}
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

                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    {isRecording ? "Recording in progress..." : "Record your answer"}
                  </h2>
                  <p className="text-gray-600 text-center max-w-xs mb-6">
                    {isRecording
                      ? "Click the microphone when you're done speaking"
                      : "Click the microphone to start recording your answer"}
                  </p>

                  {isRecording && (
                    <div className="w-full max-w-xs">
                      <div className="h-12 bg-gray-100 rounded-lg overflow-hidden">
                        <div className="h-full w-full flex items-end">
                          {Array.from({ length: 50 }).map((_, i) => (
                            <div
                              key={i}
                              className="w-1 mx-0.5 bg-blue-500 rounded-t-sm"
                              style={{
                                height: `${Math.random() * 100}%`,
                                animationDelay: `${i * 0.05}s`,
                                animation: "pulse 1s infinite",
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-100">
                      <Mic className="w-12 h-12 text-white" />
                    </div>
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
                          <span className="text-sm font-medium text-gray-700">Confidence:</span>
                          <span className="text-sm font-medium text-gray-700">{feedback?.confidence}%</span>
                        </div>
                        <Progress value={feedback?.confidence} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">(Could improve clarity)</p>
                      </div>

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
                              &quot;I&apos;m an IT graduate with a strong passion for web development. Through my studies, I
                              worked on several projects using HTML, CSS, and JavaScript, including a portfolio website
                              that improved my skills in responsive design. I&apos;m excited to contribute these technical
                              abilities to your team.&quot;
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
                    <Button
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      onClick={nextQuestion}
                    >
                      Next Question
                    </Button>
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
