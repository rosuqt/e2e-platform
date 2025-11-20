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
    overall: { rating: 1, comment: "" },
    recruiter: { rating: 1, comment: "" },
    company: { rating: 1, comment: "" },
  })

  const [recruiterImgUrl, setRecruiterImgUrl] = useState<string | null>(null)
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(null)

  const [alreadyRated, setAlreadyRated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkIfRated() {
      if (!isOpen) return
      setLoading(true)
      try {
        const res = await fetch(`/api/students/ratings?jobId=${jobId}`)
        const data = await res.json()
        setAlreadyRated(Array.isArray(data) && data.length > 0)
      } catch {
        setAlreadyRated(false)
      } finally {
        setLoading(false)
      }
    }
    checkIfRated()
  }, [isOpen, jobId])

  useEffect(() => {
    async function fetchRecruiterImg() {
      if (!recruiterProfileImg) return setRecruiterImgUrl(null)
      if (recruiterProfileImg.startsWith("http"))
        return setRecruiterImgUrl(recruiterProfileImg)

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
      if (companyLogoImg) return setCompanyLogoUrl(companyLogoImg)
      if (!companyName) return setCompanyLogoUrl(null)

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
      [step]: { ...prev[step], rating: Math.max(1, rating) }, // force minimum 1
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
        return setCurrentStep("recruiter")
      case "recruiter":
        return setCurrentStep("company")
      case "company":
        return setCurrentStep("overall")
      case "overall":
        try {
          await fetch("/api/students/ratings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobId, ...ratings }),
          })
        } catch (err) {
          console.error("Failed to submit rating:", err)
        }
        return setCurrentStep("complete")
      case "complete":
        onClose()
        return setCurrentStep("intro")
    }
  }

  const handleBack = () => {
    switch (currentStep) {
      case "recruiter":
        return setCurrentStep("intro")
      case "company":
        return setCurrentStep("recruiter")
      case "overall":
        return setCurrentStep("company")
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
          className="transition-all hover:scale-110"
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
    if (loading)
      return <p className="text-center text-gray-500">Checking rating...</p>

    if (alreadyRated)
      return (
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            You already rated this job
          </h2>
          <p className="text-gray-600 text-sm">
            Thanks for your feedback on <b>{jobTitle}</b> at <b>{companyName}</b>.
          </p>
          <Button onClick={onClose} className="w-full bg-blue-500 text-white">
            Close
          </Button>
        </div>
      )

    switch (currentStep) {
      case "intro":
        return (
          <div className="text-center space-y-3">
            <h2 className="text-2xl -mt-6 font-semibold text-gray-800">
              Share Your Experience
            </h2>
            <p className="text-gray-600 text-sm">
              Help others by rating your experience with <b>{jobTitle}</b> at <b>{companyName}</b>.
            </p>
            <Button
              onClick={handleNext}
              className="w-full bg-blue-500 text-white"
            >
              Rate Now
            </Button>
          </div>
        )

      case "recruiter":
        return (
          <div className="space-y-4 text-center">
            <h2 className="text-xl font-semibold">Rate the Recruiter</h2>

            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
              {recruiterImgUrl ? (
                <Image
                  src={recruiterImgUrl}
                  alt="Recruiter"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              ) : (
                <FaUserLarge className="w-12 h-12 text-gray-400" />
              )}
            </div>

            <StarRating
              rating={ratings.recruiter.rating}
              onRatingChange={(r) => handleRatingChange("recruiter", r)}
            />

            <div className="relative">
              <Textarea
                placeholder="Your comments…"
                value={ratings.recruiter.comment}
                maxLength={200}
                onChange={(e) =>
                  handleCommentChange("recruiter", e.target.value)
                }
              />
              <div className="text-xs text-gray-400 mt-1 text-right">
                {ratings.recruiter.comment.length}/200
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext}>Next</Button>
            </div>
          </div>
        )

      case "company":
        return (
          <div className="space-y-4 text-center">
            <h2 className="text-xl font-semibold">Rate the Company</h2>

            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden flex items-center justify-center bg-white border border-gray-200">
              {companyLogoUrl ? (
                <Image
                  src={companyLogoUrl}
                  alt="Company Logo"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Lottie animationData={briefcaseLottie} className="w-20 h-20" />
              )}
            </div>

            <StarRating
              rating={ratings.company.rating}
              onRatingChange={(r) => handleRatingChange("company", r)}
            />

            <div className="relative">
              <Textarea
                placeholder="Your comments…"
                value={ratings.company.comment}
                maxLength={200}
                onChange={(e) =>
                  handleCommentChange("company", e.target.value)
                }
              />
              <div className="text-xs text-gray-400 mt-1 text-right">
                {ratings.company.comment.length}/200
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext}>Next</Button>
            </div>
          </div>
        )

      case "overall":
        return (
          <div className="space-y-4 text-center">
            <h2 className="text-xl font-semibold">Overall Experience</h2>

            <Lottie animationData={starLottie} className="w-24 h-24 mx-auto" />

            <StarRating
              rating={ratings.overall.rating}
              onRatingChange={(r) => handleRatingChange("overall", r)}
            />

            <div className="relative">
              <Textarea
                placeholder="Final comments…"
                value={ratings.overall.comment}
                maxLength={200}
                onChange={(e) =>
                  handleCommentChange("overall", e.target.value)
                }
              />
              <div className="text-xs text-gray-400 mt-1 text-right">
                {ratings.overall.comment.length}/200
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext}>Submit</Button>
            </div>
          </div>
        )

      case "complete":
        return (
          <div className="text-center space-y-4">
            <ConfettiStars />
            <Lottie
              animationData={celebrationLottie}
              className="w-40 h-40 mx-auto"
            />
            <h2 className="text-xl font-semibold">Thank you!</h2>
            <p className="text-gray-600 text-sm">
              Your feedback helps improve the OJT experience.
            </p>
            <Button onClick={handleNext} className="w-full bg-blue-500">
              Close
            </Button>
          </div>
        )
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose() // FIXED: Prevent auto-close bug
      }}
    >
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
