"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Star } from "lucide-react"
import Lottie from "lottie-react"
import starLottie from "../../../../../../public/animations/star.json"
import Image from "next/image"
import { FaUserLarge } from "react-icons/fa6"

export interface RatingsModalProps {
  isOpen: boolean
  onClose: () => void
  rating: {
    overall_rating: number
    overall_comment: string
    recruiter_rating: number
    recruiter_comment: string
    company_rating: number
    company_comment: string
    employer?: { name?: string }
    company?: { company_name?: string; company_logo_url?: string | null }
    job_postings?: { job_title?: string }
    created_at?: string
  }
  recruiterImgUrl?: string | null
  companyLogoUrl?: string | null
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-6 h-6 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  )
}

function TruncatedText({
  text,
  max = 200,
}: {
  text: string
  max?: number
}) {
  const [expanded, setExpanded] = useState(false)
  if (!text) return <span className="italic text-gray-400">No comment</span>
  if (text.length <= max) return <span>{text}</span>
  if (expanded) {
    return (
      <span>
        {text}
        <button
          className="ml-2 text-blue-500 underline text-xs"
          type="button"
          onClick={() => setExpanded(false)}
        >
          View less
        </button>
      </span>
    )
  }
  return (
    <span>
      {text.slice(0, max)}...
      <button
        className="ml-2 text-blue-500 underline text-xs"
        type="button"
        onClick={() => setExpanded(true)}
      >
        View more
      </button>
    </span>
  )
}

function formatDate(dateStr?: string) {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
  return `You've rated this job on ${date.toLocaleDateString(undefined, options)}`
}

export function RatingsModal({
  isOpen,
  onClose,
  rating,
  recruiterImgUrl,
  companyLogoUrl,
}: RatingsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full p-0 border-0 shadow-2xl rounded-lg overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Rating Details</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row w-full min-h-[420px]">
          <div className="flex flex-col justify-center items-center bg-blue-500 w-[40%] py-10 px-8">
            <Lottie animationData={starLottie} loop={true} className="w-42 h-42" />
            <div className="text-white text-2xl font-bold mb-1">{rating.job_postings?.job_title ?? ""}</div>
            <StarRow rating={rating.overall_rating} />
            <div className="text-white text-sm mt-2">Overall Rating</div>
            <div className="text-gray-300 text-xs mt-1">
              {rating.created_at ? formatDate(rating.created_at) : ""}
            </div>
          </div>
          <div className="flex-1 bg-white px-10 py-8 flex flex-col items-start overflow-y-auto max-h-[520px]">
            <div className="flex items-center gap-4 mb-8">
              {recruiterImgUrl ? (
                <Image
                  src={recruiterImgUrl}
                  alt="Recruiter"
                  width={64}
                  height={64}
                  className="rounded-full border-2 border-blue-200 object-cover w-16 h-16"
                />
              ) : (
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 via-blue-200 to-gray-200">
                  <FaUserLarge className="text-gray-400" style={{ width: 36, height: 36 }} />
                </div>
              )}
              <div className="flex-1">
                <div className="font-semibold text-gray-800 mb-1">
                  Recruiter: {rating.employer?.name ?? "Unknown"}
                </div>
                <StarRow rating={rating.recruiter_rating} />
                <div className="text-gray-600 text-sm mt-2">
                  <TruncatedText text={rating.recruiter_comment} />
                </div>
              </div>
            </div>
            <div className="w-full border-t border-gray-200 my-4" />
            <div className="flex items-center gap-4 mb-8">
              {companyLogoUrl ? (
                <Image
                  src={companyLogoUrl}
                  alt="Company"
                  width={64}
                  height={64}
                  className="rounded-full border-2 border-blue-200 object-cover w-16 h-16"
                />
              ) : (
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 via-blue-200 to-gray-200 text-xl font-bold text-blue-500">
                  {rating.company?.company_name?.charAt(0) || "C"}
                </div>
              )}
              <div className="flex-1">
                <div className="font-semibold text-gray-800 mb-1">
                  Company: {rating.company?.company_name ?? "Unknown"}
                </div>
                <StarRow rating={rating.company_rating} />
                <div className="text-gray-600 text-sm mt-2">
                  <TruncatedText text={rating.company_comment} />
                </div>
              </div>
            </div>
            <div className="w-full border-t border-gray-200 my-4" />
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 font-bold text-xl">
                <Star className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800 mb-1">Overall Experience</div>
                <StarRow rating={rating.overall_rating} />
                <div className="text-gray-600 text-sm mt-2">
                  <TruncatedText text={rating.overall_comment} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
