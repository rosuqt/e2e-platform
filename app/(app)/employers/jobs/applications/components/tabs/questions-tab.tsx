"use client"

import React, { useEffect, useState } from "react"
import { TbReportSearch } from "react-icons/tb"

type Question = {
  id: string
  job_id: string
  question: string
}

type AnswersMap = Record<string, string | string[]>;

type QuestionsTabProps = {
  jobId: string
  answers?: AnswersMap
}

export default function QuestionsTab({ jobId, answers }: QuestionsTabProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!jobId) {
      setQuestions([])
      setLoading(false)
      setError("No job ID provided")
      return
    }
    setLoading(true)
    setError(null)
    fetch(`/api/employers/applications/getQuestions?job_id=${jobId}`)
      .then(res => {
        if (!res.ok) throw new Error(`API error: ${res.status}`)
        return res.json()
      })
      .then(data => {
        setQuestions(data.questions || [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [jobId])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[120px]">
        <span className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  if (!questions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[180px] text-gray-500">
       
        <TbReportSearch className="w-20 h-20 mb-4 text-gray-400" />
        No application questions for this job.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-blue-700">Application Questions</h3>
      <div className="flex flex-col gap-6">
        {questions.map((q, idx) => {
          const answer: string | string[] | undefined = answers?.[q.id]
          let displayAnswer: React.ReactNode
          if (Array.isArray(answer)) {
            displayAnswer = answer.length > 0
              ? (
                <div className="flex flex-wrap gap-2">
                  {answer.map((ans, i) => (
                    <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{ans}</span>
                  ))}
                </div>
              )
              : <span className="text-gray-400">No answer</span>
          } else if (typeof answer === "string" && answer.trim() !== "") {
            displayAnswer = <span className="text-gray-800">{answer}</span>
          } else {
            displayAnswer = <span className="text-gray-400">No answer</span>
          }
          return (
            <div
              key={q.id}
              className="bg-white border border-blue-100 rounded-xl shadow-sm p-5 flex flex-col gap-2"
            >
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-semibold text-base">{idx + 1}.</span>
                <span className="text-base font-medium text-blue-900">{q.question}</span>
              </div>
              <div className="mt-2 flex items-start gap-2">
                <span className="font-semibold text-blue-700">Answer:</span>
                <div>{displayAnswer}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
