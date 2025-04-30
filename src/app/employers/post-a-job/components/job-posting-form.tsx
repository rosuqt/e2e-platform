"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/app/side-nav/sidebar"
import TopNav from "@/app/top-nav/TopNav"
import { CreateStep } from "./steps/create-step"
import { ValidationStep } from "./steps/validation-step"
import { WriteStep } from "./steps/write-step"
import { ManageStep } from "./steps/manage-step"
import { PreviewStep } from "./steps/preview-step"
import JobPostingLive from "./steps/success-step"
import { ProgressBar } from "./progress-bar"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import type { JobPostingData } from "../lib/types"
import { Save } from "lucide-react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { jwtDecode } from "jwt-decode"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function JobPostingForm() {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false)
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
    mustHaveQualifications: [""],
    niceToHaveQualifications: [""],
    jobSummary: "",
    applicationDeadline: { date: "", time: "" },
    maxApplicants: "",
    applicationQuestions: [],
    perksAndBenefits: [],
  })
  const [employerId, setEmployerId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [isPostingJob, setIsPostingJob] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      const decoded: { id: string } = jwtDecode(token)
      setEmployerId(decoded.id)
      console.log("Decoded Employer ID:", decoded.id)
    } else {
      console.warn("No token found in localStorage.")
    }
  }, [])

  useEffect(() => {
    const draftSaved = localStorage.getItem("draftSaved")
    if (draftSaved === "true") {
      toast.success("Draft saved successfully!")
      localStorage.removeItem("draftSaved")
    }
  }, [])

  const updateFormData = (data: Partial<JobPostingData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
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
    } else if (currentStep === 3) {
      newErrors = {
        jobDescription: !formData.jobDescription.trim(),
        mustHaveQualifications: formData.mustHaveQualifications.every((item) => !item.trim()),
        jobSummary: !formData.jobSummary.trim(),
      }
    }

    setErrors(newErrors)
    return Object.values(newErrors).every((isValid) => !isValid)
  }

  const handleFieldChange = <T extends keyof JobPostingData>(field: T, value: JobPostingData[T]) => {
    updateFormData({ [field]: value })
    setErrors((prevErrors) => ({ ...prevErrors, [field]: false }))
  }

  const nextStep = () => {
    const isValid = validateFields()
    if (isValid) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1)
        window.scrollTo(0, 0)
      }
    } else {
      toast.error("Please fill in all required fields.")
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const postJob = async () => {
    if (!employerId) {
      toast.error("Employer ID not found. Please sign in again.")
      return
    }

    setIsPostingJob(true)

    try {
      const sanitizedFormData = {
        ...formData,
        maxApplicants: formData.maxApplicants ? parseInt(formData.maxApplicants, 10) || null : null,
        applicationDeadline: {
          date: formData.applicationDeadline.date || null,
          time: formData.applicationDeadline.time || null,
        },
        perksAndBenefits: formData.perksAndBenefits.length > 0 ? formData.perksAndBenefits : null,
        applicationQuestions: formData.applicationQuestions.length > 0 ? formData.applicationQuestions : null,
      }

      const response = await fetch("/api/employers/post-a-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "publishJob",
          formData: sanitizedFormData,
          employerId,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Job posted successfully:", result)
        toast.success("Job posted successfully!")
        setCurrentStep(6) // Change to success-step
      } else {
        const error = await response.json()
        console.error("Failed to post job:", error)
        toast.error(`Failed to post job: ${error.error}`)
      }
    } catch (error) {
      console.error("Error posting job:", error)
      toast.error("An error occurred while posting the job. Please try again.")
    } finally {
      setIsPostingJob(false)
    }
  }

  const saveDraft = async () => {
    if (!employerId) {
      console.error("Employer ID not found. Please sign in again.")
      return
    }

    setIsSavingDraft(true)
    const savingToastId: string | number = toast.info("Saving draft...", { autoClose: false })

    try {
      const sanitizedFormData = {
        ...formData,
        maxApplicants: formData.maxApplicants ? parseInt(formData.maxApplicants, 10) || null : null,
      }

      const response = await fetch("/api/employers/post-a-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "saveDraft",
          formData: sanitizedFormData,
          employerId,
        }),
      })

      if (response.ok) {
        localStorage.setItem("draftSaved", "true")
        toast.dismiss(savingToastId) 
        window.location.reload()
      } else {
        const error = await response.json()
        console.error("Failed to save draft:", error)
        toast.dismiss(savingToastId)
        toast.error("Oops! Looks like there's nothing to save.")
      }
    } catch (error) {
      console.error("Error saving draft:", error)
      toast.dismiss(savingToastId)
      toast.error("An error occurred while saving the draft. Please try again.")
    } finally {
      setIsSavingDraft(false)
    }
  }

  const isFormEmpty = () => {
    return Object.entries(formData).every(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length === 0 || value.every((item) => typeof item === "string" && item.trim() === "")
      }
      if (typeof value === "object" && value !== null) {
        return Object.values(value).every(
          (nestedValue) => typeof nestedValue === "string" && nestedValue.trim() === ""
        )
      }
      if (key === "verificationTier") {
        return value === "basic"
      }
      if (key === "maxApplicants") {
        return value === null
      }
      return typeof value === "string" && value.trim() === ""
    })
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CreateStep
            formData={formData}
            handleFieldChange={handleFieldChange}
            errors={errors} 
          />
        )
      case 2:
        return <ValidationStep formData={formData} updateFormData={updateFormData} />
      case 3:
        return (
          <WriteStep
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        )
      case 4:
        return <ManageStep formData={formData} updateFormData={updateFormData} />
      case 5:
        return <PreviewStep formData={formData} onPreview={() => {}} />
      case 6:
        return (
          <div className="flex justify-center items-center min-h-screen bg-gradient-to-br">
            <JobPostingLive />
          </div>
        )
      default:
        return (
          <CreateStep
            formData={formData}
            handleFieldChange={handleFieldChange}
            errors={errors} 
          />
        )
    }
  }

  useEffect(() => {
    document.body.classList.add("bg-pattern")
    return () => {
      document.body.classList.remove("bg-pattern")
    }
  }, [])

  return (
    <div className="flex">
      {employerId && (
        <div className="absolute top-4 right-4 bg-gray-100 text-gray-800 p-2 rounded shadow">
          <p>Employer ID: {employerId}</p>
        </div>
      )}
      <Sidebar onToggle={(expanded) => setIsSidebarMinimized(!expanded)} />
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarMinimized ? "ml-[80px]" : "ml-[280px]"
        }`}
      >
        <TopNav isSidebarMinimized={isSidebarMinimized} />
        <div className="p-6 mt-[64px] -mx-14">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Create a job posting</h1>
                <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                  Step {currentStep} of {currentStep >= 5 ? 5 : 4}
                </div>
              </div>

              <ProgressBar currentStep={currentStep} />

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mt-8"
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="bg-gray-50 p-6 flex justify-between border-t border-gray-100">
              {currentStep > 1 ? (
                <Button
                  variant="outline"
                  onClick={prevStep}
                  className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-8 py-4 rounded-full flex items-center gap-2"
                >
                  <FaChevronLeft />
                  Back
                </Button>
              ) : (
                <div />
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={saveDraft}
                  disabled={isFormEmpty() || isSavingDraft}
                  className={`border-gray-200 text-gray-600 bg-white hover:bg-gray-50 flex items-center gap-2 px-8 py-4 rounded-full ${
                    isFormEmpty() || isSavingDraft ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSavingDraft ? (
                    <span className="loader mr-2"></span>
                  ) : (
                    <Save size={16} />
                  )}
                  <span>Save draft</span>
                </Button>

                {currentStep < 5 ? (
                  <Button
                    onClick={nextStep}
                    className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-full flex items-center gap-2"
                  >
                    Continue
                    <FaChevronRight />
                  </Button>
                ) : (
                  <Button
                    onClick={postJob}
                    disabled={isPostingJob}
                    className={`bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-9 py-4 rounded-full flex items-center gap-2 ${
                      isPostingJob ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isPostingJob ? (
                      <span className="loader mr-2"></span>
                    ) : (
                      "Post Job"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .loader {
          border: 2px solid #f3f3f3;
          border-top: 2px solid #3498db;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
