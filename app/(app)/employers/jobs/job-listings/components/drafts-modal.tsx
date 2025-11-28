"use client"

import React, { useState, useEffect } from "react"
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
  onSuccess,
}: {
  open: boolean
  onClose: () => void
  draftData: Partial<JobPostingData> | Record<string, unknown> | null
  onSuccess?: () => void
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
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function fetchDraftDetails(id: string) {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/job-listings/fetchDrafts`)
        const response = await res.json()
        const drafts = response.data || response
        
        if (Array.isArray(drafts)) {
          const draft = drafts.find(d => String(d.id) === String(id))
          if (draft) {
            const d = draft as Record<string, unknown>
            
            function parseStringOrArray(val: unknown): string[] {
              if (Array.isArray(val)) return val as string[]
              if (typeof val === "string") {
                try {
                  const parsed = JSON.parse(val)
                  if (Array.isArray(parsed)) return parsed
                } catch {
                  if (val.trim() === "") return [""]
                  if (val.includes(",")) return val.split(",").map((s) => s.trim())
                  return [val]
                }
              }
              return [""]
            }
            
            function parseArrayOrJson(val: unknown): object[] {
              if (Array.isArray(val)) return val as object[]
              if (typeof val === "string") {
                try {
                  const parsed = JSON.parse(val)
                  if (Array.isArray(parsed)) return parsed as object[]
                } catch {
                  return []
                }
              }
              return []
            }
            
            const normalizeQuestions = (arr: unknown): JobPostingData["applicationQuestions"] =>
              parseArrayOrJson(arr).map((q) => {
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

            setFormData(prev => ({
              ...prev,
              jobTitle: d.job_title as string ?? "",
              location: d.location as string ?? "",
              remoteOptions: d.remote_options as string ?? "",
              workType: d.work_type as string ?? "",
              payType: d.pay_type as string ?? "",
              payAmount: d.pay_amount as string ?? "",
              recommendedCourse: typeof d.recommended_course === "string" && d.recommended_course.trim()
                ? d.recommended_course.trim()
                : "",
              verificationTier: d.verification_tier as string ?? "basic",
              jobDescription: d.job_description as string ?? "",
              responsibilities: parseStringOrArray(d.responsibilities),
              mustHaveQualifications: parseStringOrArray(d.must_have_qualifications),
              niceToHaveQualifications: parseStringOrArray(d.nice_to_have_qualifications),
              jobSummary: d.job_summary as string ?? "",
              applicationDeadline: d.application_deadline && typeof d.application_deadline === "object"
                ? (d.application_deadline as { date: string; time: string })
                : { date: "", time: "" },
              maxApplicants: d.max_applicants as string ?? "",
              applicationQuestions: normalizeQuestions(d.application_questions),
              perksAndBenefits: parseStringOrArray(d.perks_and_benefits),
              skills: parseStringOrArray(d.skills),
            }))
          }
        }
      } catch (err) {
        console.error("Fetch draft details error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    if (draftData && typeof draftData === "object" && "id" in draftData && draftData.id) {
      fetchDraftDetails(String(draftData.id))
    } else if (draftData) {
      setIsLoading(true)
      const d = draftData as Record<string, unknown>
      
      function parseStringOrArray(val: unknown): string[] {
        if (Array.isArray(val)) return val as string[]
        if (typeof val === "string") {
          try {
            const parsed = JSON.parse(val)
            if (Array.isArray(parsed)) return parsed
          } catch {
            if (val.trim() === "") return [""]
            if (val.includes(",")) return val.split(",").map((s) => s.trim())
            return [val]
          }
        }
        return [""]
      }
      
      function parseArrayOrJson(val: unknown): object[] {
        if (Array.isArray(val)) return val as object[]
        if (typeof val === "string") {
          try {
            const parsed = JSON.parse(val)
            if (Array.isArray(parsed)) return parsed as object[]
          } catch {
            return []
          }
        }
        return []
      }
      
      const normalizeQuestions = (arr: unknown): JobPostingData["applicationQuestions"] =>
        parseArrayOrJson(arr).map((q) => {
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

      setFormData({
        jobTitle: d.job_title as string ?? "",
        location: d.location as string ?? "",
        remoteOptions: d.remote_options as string ?? "",
        workType: d.work_type as string ?? "",
        payType: d.pay_type as string ?? "",
        payAmount: d.pay_amount as string ?? "",
        recommendedCourse:
          typeof d.recommended_course === "string" && d.recommended_course.trim()
            ? d.recommended_course.trim()
            : "",
        verificationTier: d.verification_tier as string ?? "basic",
        jobDescription: d.job_description as string ?? "",
        responsibilities: parseStringOrArray(d.responsibilities),
        mustHaveQualifications: parseStringOrArray(d.must_have_qualifications),
        niceToHaveQualifications: parseStringOrArray(d.nice_to_have_qualifications),
        jobSummary: d.job_summary as string ?? "",
        applicationDeadline: d.application_deadline && typeof d.application_deadline === "object"
          ? (d.application_deadline as { date: string; time: string })
          : { date: "", time: "" },
        maxApplicants: d.max_applicants as string ?? "",
        applicationQuestions: normalizeQuestions(d.application_questions),
        perksAndBenefits: parseStringOrArray(d.perks_and_benefits),
        skills: parseStringOrArray(d.skills),
      })
      setIsLoading(false)
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
      if (draftData && "id" in draftData && draftData.id) {
        const response = await fetch("/api/job-listings/publish-draft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            action: "publishFromDraft",
            draftId: draftData.id,
          }),
        })
        
        if (!response.ok) {
          const error = await response.json()
          setPostError(error?.error || "Failed to post job")
          setIsPosting(false)
          return
        }
        const result = await response.json()
        const publishedJobId = result?.jobId ?? result?.id
        if (publishedJobId) {
          await fetch("/api/ai-matches/embeddings/job", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ job_id: publishedJobId }),
          })
          await fetch("/api/ai-matches/rescore-job", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ job_id: publishedJobId }),
          })
        }
      } else {
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
      }
      setIsPosting(false)
      onClose()
      if (onSuccess) onSuccess()
    } catch (err) {
      console.error("Error posting job:", err)
      setPostError("Failed to post job")
      setIsPosting(false)
    }
  }

  const handleSaveDraft = async () => {
    setIsSaving(true)
    try {
      let application_deadline: string | null = null;
      if (
        formData.applicationDeadline &&
        typeof formData.applicationDeadline === "object" &&
        formData.applicationDeadline.date
      ) {
        const date = formData.applicationDeadline.date;
        const time = formData.applicationDeadline.time || "00:00";
        application_deadline = `${date} ${time}`;
      }
      
      const payload: Record<string, unknown> = {
        job_title: formData.jobTitle,
        location: formData.location,
        remote_options: formData.remoteOptions,
        work_type: formData.workType,
        pay_type: formData.payType,
        pay_amount: formData.payAmount,
        recommended_course: formData.recommendedCourse,
        verification_tier: formData.verificationTier,
        job_description: formData.jobDescription,
        responsibilities: formData.responsibilities,
        must_have_qualifications: formData.mustHaveQualifications,
        nice_to_have_qualifications: formData.niceToHaveQualifications,
        job_summary: formData.jobSummary,
        application_deadline,
        max_applicants: formData.maxApplicants,
        perks_and_benefits: formData.perksAndBenefits,
        application_questions: formData.applicationQuestions,
      };

      if (draftData && "id" in draftData && draftData.id) {
        const response = await fetch(`/api/job-listings/drafts/${draftData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error?.error || "Failed to update draft")
        }
      } else {
        const response = await fetch("/api/job-listings/drafts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error?.error || "Failed to create draft")
        }
      }
      
      setIsSaving(false)
      onClose()
      if (onSuccess) onSuccess()
    } catch (err) {
      console.error("Save draft error:", err)
      setIsSaving(false)
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
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500" />
        </div>
      ) : (
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
                <>
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={isSaving || isPosting}
                    className="border-gray-200 text-gray-600 bg-white hover:bg-gray-50 flex items-center gap-2 px-8 py-4 rounded-full"
                  >
                    {isSaving ? "Saving..." : "Save as Draft & Exit"}
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-full flex items-center gap-2"
                    disabled={isPosting || isSaving}
                  >
                    Continue
                    <FaChevronRight />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={isSaving || isPosting}
                    className="border-gray-200 text-gray-600 bg-white hover:bg-gray-50 flex items-center gap-2 px-8 py-4 rounded-full"
                  >
                    {isSaving ? "Saving..." : "Save as Draft"}
                  </Button>
                  <Button
                    onClick={handlePostJob}
                    disabled={isPosting || isSaving}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-9 py-4 rounded-full flex items-center gap-2"
                  >
                    {isPosting ? "Publishing..." : "Publish Job"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
