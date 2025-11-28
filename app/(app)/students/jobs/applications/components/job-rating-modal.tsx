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
import { Loader2 } from "lucide-react"
import { RatingsModal } from "../../../profile/components/modals/ratings-modal"

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

interface ExistingRating {
  overall_rating: number
  overall_comment: string
  recruiter_rating: number
  recruiter_comment: string
  company_rating: number
  company_comment: string
  employer?: { name?: string; profile_img?: string }
  company?: { name?: string; company_logo_url?: string }
  job_postings?: { [key: string]: unknown }
  created_at?: string
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
  const [alreadyRated, setAlreadyRated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [viewRatingOpen, setViewRatingOpen] = useState(false)
  const [existingRating, setExistingRating] = useState<ExistingRating | null>(null)

  useEffect(() => {
    async function checkIfRated() {
      if (!isOpen) return
      setLoading(true)
      try {
        const res = await fetch(`/api/students/ratings?jobId=${jobId}`)
        const data = await res.json()
        setAlreadyRated(Array.isArray(data) && data.length > 0)
        setExistingRating(Array.isArray(data) && data.length > 0 ? data[0] : null)
      } catch {
        setAlreadyRated(false)
        setExistingRating(null)
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

  const COMMENT_MAX_LENGTH = 500

  const handleCommentChange = (step: keyof RatingData, comment: string) => {
    if (comment.length > COMMENT_MAX_LENGTH) return
    setRatings((prev) => ({
      ...prev,
      [step]: { ...prev[step], comment },
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
        setSubmitting(true)
        try {
          await fetch("/api/students/ratings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobId, ...ratings }),
          })
        } catch (error) {
          console.error("Failed to submit ratings:", error)
        }
        setSubmitting(false)
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

  const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange: (rating: number) => void }) => (
    <div className="flex gap-1 justify-center mb-6">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          className="transition-colors hover:scale-110 transform duration-200"
        >
          <Star
            className={`w-8 h-8 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-300"
            }`}
          />
        </button>
      ))}
    </div>
  )

  const getStepIcon = () => {
    switch (currentStep) {
      case "intro":
        return <Lottie animationData={starLottie} loop={true} className="w-56 h-56" />
      case "overall":
        return <Lottie animationData={briefcaseLottie} loop={true} className="w-32 h-32" />
      case "recruiter":
        return recruiterImgUrl ? (
          <div className="flex justify-center">
            <Image
              src={recruiterImgUrl}
              alt="Recruiter"
              width={96}
              height={96}
              className="rounded-full border-4 border-blue-200 shadow-lg object-cover w-24 h-24"
            />
          </div>
        ) : (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[-10rem] flex justify-center items-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 via-blue-200 to-gray-200">
            <FaUserLarge className="text-gray-400" style={{ width: 56, height: 56 }} />
          </div>
        )
      case "company":
        return companyLogoUrl ? (
          <div className="flex justify-center">
            <Image
              src={companyLogoUrl}
              alt="Company"
              width={96}
              height={96}
              className="rounded-full border-4 border-blue-200 shadow-lg object-cover w-24 h-24"
            />
          </div>
        ) : (
          <div className="flex justify-center items-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 via-blue-200 to-gray-200 text-3xl font-bold text-blue-500">
            {companyName?.charAt(0) || "C"}
          </div>
        )
      case "complete":
        return (
          <div className="flex flex-col items-center justify-center">
            <Lottie animationData={celebrationLottie} loop={false} className="w-52 h-52" />
            <ConfettiStars />
          </div>
        )
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case "intro":
        return "Share Your Experience"
      case "overall":
        return "Overall Job Experience"
      case "recruiter":
        return "Recruiter Experience"
      case "company":
        return "Company Rating"
      default:
        return ""
    }
  }

  const getStepContent = () => {
    if (loading)
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="animate-spin w-8 h-8 text-blue-400 mb-2" />
          <p className="text-center text-gray-500">Checking rating...</p>
        </div>
      )
    if (alreadyRated)
      return (
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            You already rated this job
          </h2>
          <p className="text-gray-600 text-sm">
            Thanks for your feedback on <b>{jobTitle}</b> at <b>{companyName}</b>.
          </p>
          <div className="flex gap-2">
            <Button onClick={onClose} className="flex-1 bg-blue-500 text-white">
              Close
            </Button>
            <Button
              onClick={() => setViewRatingOpen(true)}
              className="flex-1 bg-gray-100 text-blue-500 border border-blue-200 hover:bg-blue-50"
            >
              View Rating
            </Button>
          </div>
        </div>
      )
    switch (currentStep) {
      case "intro":
        return (
          <div className="text-center space-y-3">
            <h2 className="text-2xl -mt-6 font-semibold text-gray-800">{getStepTitle()}</h2>
            <p className="text-gray-600 max-w-sm text-sm mx-auto">
              Help others by rating your experience with the <b>{jobTitle}</b> position at <b>{companyName}</b>
            </p>
            <div className="h-2" />
            <p className="text-xs text-gray-400">This is a multi-step rating that will only take a moment</p>
            <div className="flex gap-2 mt-2">
              <button
                className="flex-1 text-gray-400 text-sm hover:underline bg-transparent border-0 outline-none"
                onClick={onClose}
                tabIndex={0}
                type="button"
              >
                Not Now
              </button>
              <Button onClick={handleNext} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                Rate Now
              </Button>
            </div>
          </div>
        )
      case "overall":
        return (
          <div className="text-center space-y-4">
            <p className="text-gray-600 text-sm">How would you rate your overall experience with this position?</p>
            <StarRating
              rating={ratings.overall.rating}
              onRatingChange={(rating) => handleRatingChange("overall", rating)}
            />
            <Textarea
              placeholder="Share details about your experience (optional)"
              value={ratings.overall.comment}
              onChange={(e) => handleCommentChange("overall", e.target.value)}
              className="min-h-[80px] resize-none"
              maxLength={COMMENT_MAX_LENGTH}
            />
            <div className="text-xs text-gray-400 text-right mt-1">
              {ratings.overall.comment.length}/{COMMENT_MAX_LENGTH}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleBack} className="flex-1 bg-transparent" disabled={submitting}>
                Back
              </Button>
              {submitting ? (
                <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white" disabled>
                  <Loader2 className="animate-spin w-5 h-5 mx-auto" />
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                  disabled={ratings.overall.rating === 0}
                >
                  Submit Rating
                </Button>
              )}
            </div>
          </div>
        )
      case "recruiter":
        return (
          <div className="text-center space-y-4">
            <p className="text-gray-600 text-sm">
              How was your experience with <b>{recruiterName || "the recruiter or hiring team"}</b>?
            </p>
            <StarRating
              rating={ratings.recruiter.rating}
              onRatingChange={(rating) => handleRatingChange("recruiter", rating)}
            />
            <Textarea
              placeholder="Share your thoughts about the recruitment process (optional)"
              value={ratings.recruiter.comment}
              onChange={(e) => handleCommentChange("recruiter", e.target.value)}
              className="min-h-[80px] resize-none"
              maxLength={COMMENT_MAX_LENGTH}
            />
            <div className="text-xs text-gray-400 text-right mt-1">
              {ratings.recruiter.comment.length}/{COMMENT_MAX_LENGTH}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleBack} className="flex-1 bg-transparent">
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                disabled={ratings.recruiter.rating === 0}
              >
                Next
              </Button>
            </div>
          </div>
        )
      case "company":
        return (
          <div className="text-center space-y-4">
            <p className="text-gray-600 text-sm">How would you rate <b>{companyName}</b> as a company?</p>
            <StarRating
              rating={ratings.company.rating}
              onRatingChange={(rating) => handleRatingChange("company", rating)}
            />
            <Textarea
              placeholder="Share your thoughts about the company culture and environment (optional)"
              value={ratings.company.comment}
              onChange={(e) => handleCommentChange("company", e.target.value)}
              className="min-h-[80px] resize-none"
              maxLength={COMMENT_MAX_LENGTH}
            />
            <div className="text-xs text-gray-400 text-right mt-1">
              {ratings.company.comment.length}/{COMMENT_MAX_LENGTH}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleBack} className="flex-1 bg-transparent">
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                disabled={ratings.company.rating === 0}
              >
                Next
              </Button>
            </div>
          </div>
        )
      case "complete":
        return (
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">{getStepIcon()}</div>
            <h2 className="text-2xl -mt-20  font-semibold text-gray-800">Thank You!</h2>
            <p className="text-gray-600">
              Your rating has been submitted successfully. Thank you for helping others make informed career decisions!
            </p>
            <Button onClick={handleNext} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              Close
            </Button>
          </div>
        )
    }
  }

  useEffect(() => {
    async function fetchRecruiterImgForModal() {
      if (!existingRating?.employer?.profile_img) {
        setRecruiterImgUrl(null)
        return
      }
      try {
        const res = await fetch("/api/employers/get-signed-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bucket: "user.avatars",
            path: existingRating.employer.profile_img,
          }),
        })
        const data = await res.json()
        setRecruiterImgUrl(data.signedUrl || null)
      } catch {
        setRecruiterImgUrl(null)
      }
    }
    async function fetchCompanyLogoForModal() {
      if (existingRating?.company?.company_logo_url) {
        setCompanyLogoUrl(existingRating.company.company_logo_url)
        return
      }
      setCompanyLogoUrl(null)
    }
    if (viewRatingOpen && existingRating) {
      fetchRecruiterImgForModal()
      fetchCompanyLogoForModal()
    }
  }, [viewRatingOpen, existingRating])

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md max-h-[700px] bg-gradient-to-b from-blue-50 to-white border-0 shadow-2xl p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Job Rating Modal</DialogTitle>
          </DialogHeader>
          {currentStep !== "complete" && (
            <div className="relative flex flex-col items-center justify-center bg-blue-500 rounded-t-md px-6 pt-4 pb-20">
              {currentStep === "recruiter" ? (
                recruiterImgUrl ? (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4rem] flex justify-center">
                    <Image
                      src={recruiterImgUrl}
                      alt="Recruiter"
                      width={96}
                      height={96}
                      className="rounded-full border-4 border-blue-200 shadow-lg object-cover w-24 h-24"
                    />
                  </div>
                ) : (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4rem] flex justify-center items-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 via-blue-200 to-gray-200">
                    <FaUserLarge className="text-gray-400" style={{ width: 56, height: 56 }} />
                  </div>
                )
              ) : currentStep === "company" ? (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4rem]">
                  {getStepIcon()}
                </div>
              ) : currentStep === "overall" ? (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-[-7rem]">
                  <Lottie animationData={briefcaseLottie} loop={true} className="w-56 h-56" />
                </div>
              ) : (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-[-7rem]">
                  <Lottie animationData={starLottie} loop={true} className="w-56 h-56" />
                </div>
              )}
            </div>
          )}
          <div className={`p-8 pt-4 ${currentStep !== "complete" ? "mt-16" : ""}`}>{getStepContent()}</div>
          {currentStep !== "intro" && currentStep !== "complete" && (
            <div className="px-8 pb-4">
              <div className="flex justify-center space-x-2">
                {["recruiter", "company", "overall"].map((step, index) => (
                  <div
                    key={step}
                    className={`w-2 h-2 rounded-full ${
                      currentStep === step
                        ? "bg-blue-500"
                        : ["recruiter", "company", "overall"].indexOf(currentStep) > index
                        ? "bg-blue-300"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {existingRating && (
        <RatingsModal
          isOpen={viewRatingOpen}
          onClose={() => setViewRatingOpen(false)}
          rating={{
            overall_rating: existingRating.overall_rating,
            overall_comment: existingRating.overall_comment,
            recruiter_rating: existingRating.recruiter_rating,
            recruiter_comment: existingRating.recruiter_comment,
            company_rating: existingRating.company_rating,
            company_comment: existingRating.company_comment,
            employer: existingRating.employer,
            company: existingRating.company,
            job_postings: existingRating.job_postings,
            created_at: existingRating.created_at,
          }}
          recruiterImgUrl={recruiterImgUrl}
          companyLogoUrl={companyLogoUrl}
        />
      )}
    </>
  )
}