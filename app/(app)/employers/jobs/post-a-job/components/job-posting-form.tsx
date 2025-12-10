/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { FaChevronLeft, FaChevronRight, FaExclamationTriangle } from "react-icons/fa"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { jwtDecode } from "jwt-decode"
import { getSession } from "next-auth/react"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction } from "@/components/ui/alert-dialog"
import { Toaster, toast } from "react-hot-toast"
import Tooltip from "@mui/material/Tooltip"


const MySwal = withReactContent(Swal)

export default function JobPostingForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<JobPostingData>({
    jobTitle: "",
    location: "",
    remoteOptions: "",
    workType: "",
    payType: "", // keep for type compatibility
    payAmount: "", // keep for type compatibility
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
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [jobPostLimit, setJobPostLimit] = useState<number | null>(null)
  const [jobPostCount, setJobPostCount] = useState<number | null>(null)
  const [verifyStatus, setVerifyStatus] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEmployerIdAndLimits() {
      const session = await getSession()
      const employerIdFromSession =
        session?.user && typeof session.user === "object" && "employerId" in session.user
          ? (session.user as { employerId?: string }).employerId
          : undefined
      let eid = employerIdFromSession
      if (!eid) {
        const token = localStorage.getItem("token")
        if (token) {
          const decoded: { id: string } = jwtDecode(token)
          eid = decoded.id
        }
      }
      if (eid) {
        setEmployerId(eid)
        const statusRes = await fetch(`/api/employers/verify-status?employerId=${eid}`)
        if (statusRes.ok) {
          const statusData = await statusRes.json()
          setVerifyStatus(statusData.verify_status)
          let limit = null
          if (statusData.verify_status === "basic") limit = 3
          else if (statusData.verify_status === "standard") limit = 5
          setJobPostLimit(limit)
          if (limit) {
            const countRes = await fetch(`/api/employers/verify-status/jobpostCount?employerId=${eid}`)
            if (countRes.ok) {
              const countData = await countRes.json()
              setJobPostCount(countData.count)
              if (countData.count >= limit) setShowLimitModal(true)
            }
          }
        }
      } else {
        setEmployerId(null)
      }
    }
    fetchEmployerIdAndLimits()
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
      if (currentStep === 2 && !formData.workType) {
        toast.error("Please select a Work Type before continuing.")
        return
      }
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
    if (showLimitModal) return
    console.log("postJob called")
    if (!employerId) {
      setShowUnauthorized(true)
      return
    }

    setIsPostingJob(true)

    const sanitizedFormData = {
      ...formData,
      maxApplicants: formData.maxApplicants
        ? (typeof formData.maxApplicants === "string"
            ? parseInt(formData.maxApplicants, 10) || null
            : formData.maxApplicants)
        : null,
      applicationDeadline: {
        date: formData.applicationDeadline?.date || null,
        time: formData.applicationDeadline?.time || null,
      },
      perksAndBenefits: Array.isArray(formData.perksAndBenefits) && formData.perksAndBenefits.length > 0 ? formData.perksAndBenefits : [],
      applicationQuestions: Array.isArray(formData.applicationQuestions) && formData.applicationQuestions.length > 0 ? formData.applicationQuestions : [],
    }

    console.log("About to POST job with data:", sanitizedFormData)
    const response = await fetch("/api/employers/post-a-job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        action: "publishJob",
        data: sanitizedFormData,
      }),
    })
    console.log("POST /api/employers/post-a-job response status:", response.status, "ok:", response.ok);
    console.log("Response headers:", Array.from(response.headers.entries()));
    response.clone().text().then(t => console.log("DEBUG: response.clone().text():", t));
    if (response.ok) {
      const contentLength = response.headers.get("content-length")
      console.log("Response content-length:", contentLength)
      const text = await response.text()
      console.log("Raw response text:", text)
      let result: any = {}
      try {
        result = JSON.parse(text)
      } catch (err) {
        result = { rawText: text }
      }
      console.log("Job posted successfully, backend response (parsed):", result)
      console.log("Result keys:", result && typeof result === "object" ? Object.keys(result) : [])
      console.log("Result.data:", result.data)

      let createdJobId: string | undefined = result.job_id || undefined;
      if (!createdJobId && result.data) {
        if (Array.isArray(result.data) && result.data.length > 0 && result.data[0].id) {
          createdJobId = result.data[0].id;
        } else if (typeof result.data === "object" && "id" in result.data) {
          createdJobId = result.data.id;
        } else if (typeof result.data === "object" && "job" in result.data && result.data.job.id) {
          createdJobId = result.data.job.id;
        } else if (typeof result.data === "object") {
          for (const key in result.data) {
            const val = result.data[key]
            if (val && typeof val === "object" && "id" in val) {
              createdJobId = val.id
              break
            }
          }
        }
      }

      if (createdJobId && employerId) {
        await fetch("/api/ai-matches/embeddings/job", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ job_id: createdJobId })
        });

        const jobsRes = await fetch("/api/ai-matches/match/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ job_id: createdJobId })
        });

        if (jobsRes.ok) {
          await fetch("/api/ai-matches/rescore-job", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ job_id: createdJobId })
          });
        }
      }

      setCurrentStep(6)
    }
    setIsPostingJob(false)
  }

  const saveDraft = async () => {
    if (!employerId) {
      setShowUnauthorized(true)
      return
    }

    setIsSavingDraft(true)

    const sanitizedFormData = {
      ...formData,
      maxApplicants: formData.maxApplicants
        ? (typeof formData.maxApplicants === "string"
            ? parseInt(formData.maxApplicants, 10) || null
            : formData.maxApplicants)
        : null,
      perksAndBenefits: Array.isArray(formData.perksAndBenefits) && formData.perksAndBenefits.length > 0 ? formData.perksAndBenefits : [],
      applicationQuestions: Array.isArray(formData.applicationQuestions) && formData.applicationQuestions.length > 0 ? formData.applicationQuestions : [],
    }

    const response = await fetch("/api/employers/post-a-job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        action: "saveDraft",
        data: sanitizedFormData,
      }),
    })

    if (response.ok) {
      localStorage.setItem("draftSaved", "true")
      toast.success("Draft saved successfully!")
      setIsSavingDraft(false)
      return
    }
    setIsSavingDraft(false)
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

  const getVerificationHref = () => {
    if (verifyStatus === "full") return "/employers/verification/fully-verified"
    if (verifyStatus === "standard") return "/employers/verification/partially-verified"
    return "/employers/verification/unverified"
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
        if (!formData.workType) {
          return (
            <div className="text-red-600 font-bold p-6">
              Please select a Work Type before continuing.
            </div>
          )
        }
        console.log("job-posting-form: Passing workType to WriteStep:", formData.workType)
        return (
          <WriteStep
            formData={formData}
            updateFormData={updateFormData}
            errors={hasAttemptedNext ? errors : {}}
            setErrors={setErrors}
            workType={formData.workType}
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
                {showLimitModal && (
                  <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaExclamationTriangle className="text-yellow-600 text-xl" />
                      <div>
                        <div className="font-semibold text-yellow-800">
                          You&apos;ve reached your limit of job postings based on your verification status.
                        </div>
                        <div className="text-yellow-700 text-sm mt-1">
                          You can still create and save job drafts, but posting new jobs isn’t available right now. Upgrade your verification to post more jobs.
                        </div>
                      </div>
                    </div>
                    <button
                      className="ml-4 bg-orange-600 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-orange-700"
                      onClick={async () => {
                        setShowLimitModal(false)
                        const href = getVerificationHref()
                        await router.prefetch(href)
                        router.push(href)
                      }}
                    >
                      Verify Now
                    </button>
                  </div>
                )}
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
                        showLimitModal ? (
                          <Tooltip title="You have reached your job posting limit for your verification status. Upgrade to post more jobs.">
                            <span>
                              <Button
                                onClick={postJob}
                                disabled
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-9 py-4 rounded-full flex items-center gap-2 opacity-50 cursor-not-allowed"
                              >
                                Post Job
                              </Button>
                            </span>
                          </Tooltip>
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
                        )
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
      <Toaster position="top-right" />
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
