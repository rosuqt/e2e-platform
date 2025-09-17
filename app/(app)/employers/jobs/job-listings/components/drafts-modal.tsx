"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CreateStep } from "../../post-a-job/components/steps/create-step"
import { ValidationStep } from "../../post-a-job/components/steps/validation-step"
import { WriteStep } from "../../post-a-job/components/steps/write-step"
import { ManageStep } from "../../post-a-job/components/steps/manage-step"
import { PreviewStep } from "../../post-a-job/components/steps/preview-step"
import { ProgressBar } from "../../post-a-job/components/progress-bar"
import type { JobPostingData } from "../../post-a-job/lib/types"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

export default function DraftsModal({
  open,
  onClose,
  draftData,
}: {
  open: boolean
  onClose: () => void
  draftData: Partial<JobPostingData> | Record<string, unknown> | null
}) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<JobPostingData>({
    jobTitle: "",
    location: "",
    remoteOptions: "",
    workType: "",
    payType: "",
    payAmount: "",
    recommendedCourse: "",
    verificationTier: "basic",
    jobDescription: "",
    responsibilities: [""],
    mustHaveQualifications: [""],
    niceToHaveQualifications: [""],
    jobSummary: "",
    applicationDeadline: { date: "", time: "" },
    maxApplicants: "",
    applicationQuestions: [],
    perksAndBenefits: [],
    skills: [],
  })
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [hasAttemptedNext, setHasAttemptedNext] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const [postError, setPostError] = useState<string | null>(null)

  useEffect(() => {
    if (draftData) {
      const d = draftData as Record<string, unknown>
      function parseStringOrArray(val: unknown): string[] {
        if (Array.isArray(val)) return val as string[]
        if (typeof val === "string") {
          try {
            const parsed = JSON.parse(val)
            if (Array.isArray(parsed)) return parsed
          } catch {
            if (val.includes(",")) return val.split(",").map((s) => s.trim())
            return [val]
          }
        }
        return [""]
      }
      const normalizeQuestions = (arr: unknown): JobPostingData["applicationQuestions"] =>
        Array.isArray(arr)
          ? arr.map((q) => {
              if (
                q &&
                typeof q === "object" &&
                "question" in q &&
                "type" in q
              ) {
                const obj = q as {
                  question?: string
                  type?: string
                  options?: string[]
                  autoReject?: boolean
                  correctAnswer?: string | string[]
                }
                return {
                  question: obj.question ?? "",
                  type: obj.type ?? "",
                  options: obj.options ?? undefined,
                  autoReject: obj.autoReject ?? false,
                  correctAnswer: obj.correctAnswer ?? undefined,
                }
              }
              return {
                question: "",
                type: "",
                options: undefined,
                autoReject: false,
                correctAnswer: undefined,
              }
            })
          : []

      const normalized: Partial<JobPostingData> = {
        jobTitle: (d.job_title as string) ?? (d.jobTitle as string) ?? "",
        location: (d.location as string) ?? "",
        remoteOptions: (d.remote_options as string) ?? (d.remoteOptions as string) ?? "",
        workType: (d.work_type as string) ?? (d.workType as string) ?? "",
        payType: (d.pay_type as string) ?? (d.payType as string) ?? "",
        payAmount: (d.pay_amount as string) ?? (d.payAmount as string) ?? "",
        recommendedCourse:
          typeof d.recommended_course === "string" && d.recommended_course.trim()
            ? d.recommended_course.trim()
            : typeof d.recommendedCourse === "string" && d.recommendedCourse.trim()
            ? d.recommendedCourse.trim()
            : typeof d.recommended_course === "number"
            ? String(d.recommended_course)
            : typeof d.recommendedCourse === "number"
            ? String(d.recommendedCourse)
            : "",
        verificationTier: (d.verification_tier as string) ?? (d.verificationTier as string) ?? "basic",
        jobDescription: (d.job_description as string) ?? (d.jobDescription as string) ?? "",
        responsibilities: parseStringOrArray(
          d.responsibilities ??
          d.responsibilities ??
          d["responsibilities"]
        ),
        mustHaveQualifications: parseStringOrArray(
          d.must_have_qualifications ??
          d.mustHaveQualifications ??
          d["must_have_qualifications"]
        ),
        niceToHaveQualifications: parseStringOrArray(
          d.nice_to_have_qualifications ??
          d.niceToHaveQualifications ??
          d["nice_to_have_qualifications"]
        ),
        jobSummary: (d.job_summary as string) ?? (d.jobSummary as string) ?? "",
        applicationDeadline: d.application_deadline
          ? (d.application_deadline as { date: string; time: string })
          : { date: (d.application_deadline_date as string) ?? "", time: (d.application_deadline_time as string) ?? "" },
        maxApplicants: (d.max_applicants as string) ?? (d.maxApplicants as string) ?? "",
        applicationQuestions: normalizeQuestions(
          d.application_questions ??
          d.applicationQuestions ??
          []
        ),
        perksAndBenefits: (d.perks_and_benefits as string[]) ?? (d.perksAndBenefits as string[]) ?? [],
        skills: (d.skills as string[]) ?? [],
      }
      setFormData((prev) => ({
        ...prev,
        ...normalized,
      }))
    }
  }, [draftData])

  const updateFormData = (data: Partial<JobPostingData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const handleFieldChange = <T extends keyof JobPostingData>(field: T, value: JobPostingData[T]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateFields = () => {
    let newErrors: Record<string, boolean> = {}

    if (currentStep === 1) {
      newErrors = {
        jobTitle: !formData.jobTitle.trim(),
        location: !formData.location.trim(),
        remoteOptions: !formData.remoteOptions.trim(),
        workType: !formData.workType.trim(),
        payType: !formData.payType.trim(),
        recommendedCourse: !formData.recommendedCourse.trim(),
      }
    } else if (currentStep === 2) {

    } else if (currentStep === 3) {
      newErrors = {
        jobDescription: !formData.jobDescription.trim(),
        responsibilities: formData.responsibilities.every((item) => !item.trim()),
        mustHaveQualifications: formData.mustHaveQualifications.every((item) => !item.trim()),
        jobSummary: !formData.jobSummary.trim(),
      }
    } else if (currentStep === 4) {

    }
    setErrors(newErrors)
    return Object.values(newErrors).every((isValid) => !isValid)
  }

  const nextStep = () => {
    setHasAttemptedNext(true)
    const isValid = validateFields()
    if (isValid) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1)
        setHasAttemptedNext(false)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handlePostJob = async () => {
    setHasAttemptedNext(true)
    const isValid = validateFields()
    if (!isValid) {
      setIsPosting(false)
      return
    }
    setIsPosting(true)
    setPostError(null)
    try {
      const response = await fetch("/api/employers/post-a-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          action: "publishJob",
          formData,
        }),
      })
      if (!response.ok) {
        const error = await response.json()
        setPostError(error?.error || "Failed to post job")
        setIsPosting(false)
        return
      }
      if (draftData && "id" in draftData && draftData.id) {
        await fetch(`/api/job-listings/actionsDraft?id=${draftData.id}`, {
          method: "DELETE",
        })
      }
      setIsPosting(false)
      onClose()
      window.location.reload()
    } catch (err) {
      console.error("Error posting job:", err)
      setPostError("Failed to post job")
      setIsPosting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CreateStep
            formData={formData}
            handleFieldChange={handleFieldChange}
            errors={hasAttemptedNext ? errors : {}}
          />
        )
      case 2:
        return <ValidationStep formData={formData} updateFormData={updateFormData} />
      case 3:
        return (
          <WriteStep
            formData={formData}
            updateFormData={updateFormData}
            errors={hasAttemptedNext ? errors : {}}
            setErrors={setErrors}
          />
        )
      case 4:
        return <ManageStep formData={formData} updateFormData={updateFormData} />
      case 5:
        return (
          <PreviewStep formData={formData} onPreview={() => {}} />
        )
      default:
        return null
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="flex justify-between items-center px-8 pt-8 pb-2">
          <h2 className="text-2xl font-bold text-gray-800">Continue Job Draft</h2>
          <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-red-500 text-lg px-2 py-1" disabled={isPosting}>
            ×
          </Button>
        </div>
        <div className="px-8">
          <ProgressBar currentStep={currentStep} onStepClick={(step) => setCurrentStep(step)} />
        </div>
        <div className="flex-1 px-8 py-4 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
              {postError && (
                <div className="text-red-500 text-sm font-semibold text-center mt-4">{postError}</div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex justify-between items-center px-8 py-6 border-t border-gray-100 bg-gray-50">
          {currentStep > 1 ? (
            <Button
              variant="outline"
              onClick={prevStep}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-8 py-4 rounded-full flex items-center gap-2"
              disabled={isPosting}
            >
              <FaChevronLeft />
              Back
            </Button>
          ) : (
            <div />
          )}
          <div className="flex gap-3">
            {currentStep < 5 ? (
              <Button
                onClick={nextStep}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-full flex items-center gap-2"
                disabled={isPosting}
              >
                Continue
                <FaChevronRight />
              </Button>
            ) : (
              <Button
                onClick={handlePostJob}
                disabled={isPosting}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-9 py-4 rounded-full flex items-center gap-2"
              >
                {isPosting ? "Posting..." : "Post Job"}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
