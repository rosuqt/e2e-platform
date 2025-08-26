"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import Lottie from "lottie-react"
import starLottie from "../../../../../../public/animations/star.json"
import briefcaseLottie from "../../../../../../public/animations/Briefcase.json"
import celebrationLottie from "../../../../../../public/animations/Star rating.json"
import Image from "next/image"
import { FaUserLarge } from "react-icons/fa6"
import { ConfettiStars } from "@/components/magicui/star"

interface JobRatingModalProps {
  isOpen: boolean
  onClose: () => void
  jobId: string
  jobTitle?: string
  companyName?: string
  recruiterProfileImg?: string
  companyLogoImg?: string
  recruiterName?: string
}

type RatingStep = "intro" | "recruiter" | "company" | "overall" | "complete"

interface RatingData {
  overall: { rating: number; comment: string }
  recruiter: { rating: number; comment: string }
  company: { rating: number; comment: string }
}

export function JobRatingModal({
  isOpen,
  onClose,
  jobId,
  jobTitle = "Software Engineer",
  companyName = "TechCorp",
  recruiterProfileImg,
  companyLogoImg,
  recruiterName,
}: JobRatingModalProps) {
  const [currentStep, setCurrentStep] = useState<RatingStep>("intro")
  const [ratings, setRatings] = useState<RatingData>({
    overall: { rating: 0, comment: "" },
    recruiter: { rating: 0, comment: "" },
    company: { rating: 0, comment: "" },
  })
  const [recruiterImgUrl, setRecruiterImgUrl] = useState<string | null>(null)
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(null)

  // NEW: track if already rated
  const [alreadyRated, setAlreadyRated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkIfRated() {
      if (!isOpen) return
      setLoading(true)
      try {
        const res = await fetch(`/api/students/ratings?jobId=${jobId}`)
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setAlreadyRated(true)
        } else {
          setAlreadyRated(false)
        }
      } catch (err) {
        console.error("Failed to check rating:", err)
        setAlreadyRated(false)
      } finally {
        setLoading(false)
      }
    }
    checkIfRated()
  }, [isOpen, jobId])

  useEffect(() => {
    async function fetchRecruiterImg() {
      if (!recruiterProfileImg) {
        setRecruiterImgUrl(null)
        return
      }
      if (recruiterProfileImg.startsWith("http")) {
        setRecruiterImgUrl(recruiterProfileImg)
        return
      }
      try {
        const res = await fetch("/api/employers/get-signed-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bucket: "user.avatars",
            path: recruiterProfileImg,
          }),
        })
        const data = await res.json()
        setRecruiterImgUrl(data.signedUrl || null)
      } catch {
        setRecruiterImgUrl(null)
      }
    }
    if (isOpen && currentStep === "recruiter") fetchRecruiterImg()
  }, [recruiterProfileImg, isOpen, currentStep])

  useEffect(() => {
    async function fetchCompanyLogo() {
      if (companyLogoImg) {
        setCompanyLogoUrl(companyLogoImg)
        return
      }
      if (!companyName) {
        setCompanyLogoUrl(null)
        return
      }
      try {
        const res = await fetch("/api/employers/get-signed-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bucket: "company.logo",
            path: companyName,
          }),
        })
        const data = await res.json()
        setCompanyLogoUrl(data.signedUrl || null)
      } catch {
        setCompanyLogoUrl(null)
      }
    }
    if (isOpen && currentStep === "company") fetchCompanyLogo()
  }, [companyLogoImg, companyName, isOpen, currentStep])

  const handleRatingChange = (step: keyof RatingData, rating: number) => {
    setRatings((prev) => ({
      ...prev,
      [step]: { ...prev[step], rating },
    }))
  }

  const handleCommentChange = (step: keyof RatingData, comment: string) => {
    setRatings((prev) => ({
      ...prev,
      [step]: { ...prev[step], comment: comment.slice(0, 200) },
    }))
  }

  const handleNext = async () => {
    switch (currentStep) {
      case "intro":
        setCurrentStep("recruiter")
        break
      case "recruiter":
        setCurrentStep("company")
        break
      case "company":
        setCurrentStep("overall")
        break
      case "overall":
        try {
          await fetch("/api/students/ratings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobId, ...ratings }),
          })
        } catch (error) {
          console.error("Failed to submit ratings:", error)
        }
        setCurrentStep("complete")
        break
      case "complete":
        onClose()
        setCurrentStep("intro")
        break
    }
  }

  const handleBack = () => {
    switch (currentStep) {
      case "recruiter":
        setCurrentStep("intro")
        break
      case "company":
        setCurrentStep("recruiter")
        break
      case "overall":
        setCurrentStep("company")
        break
    }
  }

  const StarRating = ({
    rating,
    onRatingChange,
  }: {
    rating: number
    onRatingChange: (rating: number) => void
  }) => (
    <div className="flex gap-1 justify-center mb-6">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRatingChange(star)}
          className="transition-colors hover:scale-110 transform duration-200"
        >
          <Star
            className={`w-8 h-8 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 hover:text-yellow-300"
            }`}
          />
        </button>
      ))}
    </div>
  )

  const getStepContent = () => {
    if (loading) {
      return <p className="text-center text-gray-500">Checking rating...</p>
    }
    if (alreadyRated) {
      return (
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            You already rated this job
          </h2>
          <p className="text-gray-600 text-sm">
            Thanks for your feedback on <b>{jobTitle}</b> at{" "}
            <b>{companyName}</b>. You can only submit one rating per job.
          </p>
          <Button
            onClick={onClose}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            Close
          </Button>
        </div>
      )
    }

    // ... existing step-based UI
    switch (currentStep) {
      case "intro":
        return (
          <div className="text-center space-y-3">
            <h2 className="text-2xl -mt-6 font-semibold text-gray-800">
              Share Your Experience
            </h2>
            <p className="text-gray-600 max-w-sm text-sm mx-auto">
              Help others by rating your experience with the <b>{jobTitle}</b>{" "}
              position at <b>{companyName}</b>
            </p>
            <div className="h-2" />
            <p className="text-xs text-gray-400">
              This is a multi-step rating that will only take a moment
            </p>
            <div className="flex gap-2 mt-2">
              <button
                className="flex-1 text-gray-400 text-sm hover:underline bg-transparent border-0 outline-none"
                onClick={onClose}
                tabIndex={0}
                type="button"
              >
                Not Now
              </button>
              <Button
                onClick={handleNext}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              >
                Rate Now
              </Button>
            </div>
          </div>
        )
      // ... keep recruiter, company, overall, complete steps as in your code
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[700px] bg-gradient-to-b from-blue-50 to-white border-0 shadow-2xl p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Job Rating Modal</DialogTitle>
        </DialogHeader>
        <div className={`p-8 pt-4 ${currentStep !== "complete" ? "mt-16" : ""}`}>
          {getStepContent()}
        </div>
      </DialogContent>
    </Dialog>
  )
}
