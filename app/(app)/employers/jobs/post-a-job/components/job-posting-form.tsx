"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { jwtDecode } from "jwt-decode"
import { getSession } from "next-auth/react"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction } from "@/components/ui/alert-dialog"


const MySwal = withReactContent(Swal)

export default function JobPostingForm() {
  const router = useRouter()
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
  const [employerId, setEmployerId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [hasAttemptedNext, setHasAttemptedNext] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [isPostingJob, setIsPostingJob] = useState(false)
  const [showUnauthorized, setShowUnauthorized] = useState(false)

  useEffect(() => {
    async function fetchEmployerId() {
      const session = await getSession()
      const employerIdFromSession =
        session?.user && typeof session.user === "object" && "employerId" in session.user
          ? (session.user as { employerId?: string }).employerId
          : undefined
      if (employerIdFromSession) {
        setEmployerId(employerIdFromSession)
      } else {
        const token = localStorage.getItem("token")
        if (token) {
          const decoded: { id: string } = jwtDecode(token)
          setEmployerId(decoded.id)
        } else {
          setEmployerId(null)
        }
      }
    }
    fetchEmployerId()
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
        responsibilities: formData.responsibilities.every((item) => !item.trim()), 
        mustHaveQualifications: formData.mustHaveQualifications.every((item) => !item.trim()),
        jobSummary: !formData.jobSummary.trim(),
      }
    }

    setErrors(newErrors)
    return Object.values(newErrors).every((isValid) => !isValid)
  }

  const handleFieldChange = <T extends keyof JobPostingData>(field: T, value: JobPostingData[T]) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      console.log("formData after change:", updated)
      return updated
    })
    setErrors((prevErrors) => ({ ...prevErrors, [field]: false }))
  }

  const nextStep = () => {
    setHasAttemptedNext(true)
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
      setShowUnauthorized(true)
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
        credentials: "include",
        body: JSON.stringify({
          action: "publishJob",
          formData: sanitizedFormData,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Job posted successfully:", result)
        toast.success("Job posted successfully!")
        setCurrentStep(6)
      } else {
        const error = await response.json()
        if (error.error === "Session expired" || error.error.includes("violates foreign key constraint")) {
          setShowUnauthorized(true)
        } else {
          MySwal.fire({
            title: "Error",
            text: `Failed to post job: ${error.error}`,
            icon: "error",
            confirmButtonText: "Close",
            confirmButtonColor: "#1D4ED8",
          })
        }
      }
    } catch (error) {
      console.error("Error posting job:", error)
      MySwal.fire({
        title: "Error",
        text: "An error occurred while posting the job. Please try again.",
        icon: "error",
        confirmButtonText: "Close",
        confirmButtonColor: "#1D4ED8",
      })
    } finally {
      setIsPostingJob(false)
    }
  }

  const saveDraft = async () => {
    if (!employerId) {
      setShowUnauthorized(true)
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
        credentials: "include",
        body: JSON.stringify({
          action: "saveDraft",
          formData: sanitizedFormData,
        }),
      })

      if (response.ok) {
        localStorage.setItem("draftSaved", "true")
        toast.dismiss(savingToastId) 
        toast.success(
          <div>
            Draft saved successfully!
            <button
              style={{
                marginLeft: 12,
                color: "#2563eb",
                textDecoration: "underline",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontWeight: 500,
                fontSize: "1em"
              }}
              onClick={() => {
                window.location.href = "/employers/jobs/job-listings"
              }}
            >
              View Job Drafts
            </button>
          </div>
        )
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
        return <PreviewStep formData={formData} onPreview={() => {}} />
      case 6:
        return (
          <div className="flex justify-center items-center min-h-screen bg-gradient-to-br">
            <JobPostingLive
              onPostAnotherJob={() => {
                setCurrentStep(1);
                setFormData({
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
                });
                setErrors({});
              }}
            />
          </div>
        )
      default:
        return (
          <CreateStep
            formData={formData}
            handleFieldChange={handleFieldChange}
            errors={hasAttemptedNext ? errors : {}} 
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

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isFormEmpty() && currentStep !== 6) {
        e.preventDefault()
        e.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [formData, currentStep])

  return (
    <>
      <div className="w-full flex justify-center items-start">
        <div className="w-full">
          <div className="p-0">
            <div className="bg-white rounded-xl shadow-lg  border border-blue-100">
              <div className="h-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600" />
              <div className="p-6 sm:p-14">
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-2xl font-bold text-gray-800">
                    Create a job posting
                  </h1>
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

              <div className="bg-gray-50 p-4 sm:p-10 flex flex-col sm:flex-row justify-between border-t border-gray-100 gap-3">
                {currentStep !== 6 && (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AlertDialog open={showUnauthorized}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Session expired</AlertDialogTitle>
            <AlertDialogDescription>
              You are not authorized or your session has expired. Please log in again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowUnauthorized(false)
                router.push("/sign-in")
              }}
            >
              Go to Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </>
  )
}
