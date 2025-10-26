"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CreateStep } from "../../post-a-job/components/steps/create-step"
import { WriteStep } from "../../post-a-job/components/steps/write-step"
import { ManageStep } from "../../post-a-job/components/steps/manage-step"
import { PreviewStep } from "../../post-a-job/components/steps/preview-step"
import type { JobPostingData } from "../../post-a-job/lib/types"
import { X, Copy, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react"

interface DuplicateModalProps {
  open: boolean
  onClose: () => void
  jobData: Record<string, unknown> | null
  onSuccess?: () => void
}

const STEPS_PER_PAGE = 2;
const TOTAL_STEPS = 4;

export default function DuplicateModal({
  open,
  onClose,
  jobData,
  onSuccess,
}: DuplicateModalProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [hasAttemptedNext, setHasAttemptedNext] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
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
  const [originalJobData, setOriginalJobData] = useState<JobPostingData | null>(null)
  const [similarityWarning, setSimilarityWarning] = useState<string | null>(null)
  const [showSimilarityWarning, setShowSimilarityWarning] = useState(true)

  const totalPages = Math.ceil(TOTAL_STEPS / STEPS_PER_PAGE);
  const startStep = (currentPage - 1) * STEPS_PER_PAGE + 1;
  const endStep = Math.min(currentPage * STEPS_PER_PAGE, TOTAL_STEPS);
  const stepsOnCurrentPage = Array.from({ length: endStep - startStep + 1 }, (_, i) => startStep + i);

  useEffect(() => {
    async function fetchJobDetails(id: string) {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/job-listings/job-cards/${id}`)
        const job = await res.json()
        const questionsRes = await fetch(`/api/job-listings/job-cards/${id}/questions`)
        const questionsData = await questionsRes.json()
        const jobDetails = Array.isArray(job) ? job.find(j => String(j.id) === String(id)) : (job?.data ? job.data : job)
        
        if (jobDetails && !jobDetails.error) {
          const normalizedJobData = {
            jobTitle: jobDetails.jobTitle ?? jobDetails.job_title ?? jobDetails.title ?? "",
            location: jobDetails.location ?? jobDetails.job_location ?? jobDetails.jobLocation ?? "",
            remoteOptions: jobDetails.remoteOptions ?? jobDetails.remote_options ?? jobDetails.remote ?? jobDetails.isRemote ?? jobDetails.remoteOption ?? "",
            workType: jobDetails.workType ?? jobDetails.work_type ?? jobDetails.type ?? jobDetails.job_type ?? jobDetails.jobType ?? "",
            payType: jobDetails.payType ?? jobDetails.pay_type ?? jobDetails.pay_type_label ?? jobDetails.compensationType ?? jobDetails.compensation_type ?? "",
            payAmount: jobDetails.payAmount ?? jobDetails.pay_amount ?? jobDetails.salary ?? jobDetails.compensation ?? jobDetails.compensationAmount ?? jobDetails.compensation_amount ?? "",
            recommendedCourse: (() => {
              const courseVal = jobDetails.recommendedCourse ?? jobDetails.recommended_course ?? jobDetails.course ?? jobDetails.recommended_course_name ?? jobDetails.recommended_course_label ?? "";
              const normalize = (val: string) => {
                const v = val.replace(/\s*-\s*/g, " - ").replace(/Hospitaly/, "Hospitality").trim();
                if (/BSIT/i.test(v) || /Information Technology/i.test(v)) return "BS - Information Technology";
                if (/BSHM/i.test(v) || /Hospitality Management/i.test(v)) return "BS - Hospitality Management";
                if (/BSBA/i.test(v) || /Business Administration/i.test(v)) return "BS - Business Administration";
                if (/BSTM/i.test(v) || /Tourism Management/i.test(v)) return "BS - Tourism Management";
                return v;
              };
              if (courseVal.includes(",")) {
                return courseVal.split(",").map((v: string) => normalize(v)).join(", ");
              }
              return normalize(courseVal);
            })(),
            verificationTier: jobDetails.verificationTier ?? jobDetails.verification_tier ?? "basic",
            jobDescription: jobDetails.jobDescription ?? jobDetails.job_description ?? jobDetails.description ?? "",
            responsibilities: Array.isArray(jobDetails.responsibilities)
              ? jobDetails.responsibilities
              : typeof jobDetails.responsibilities === "string"
              ? jobDetails.responsibilities.split(",").map((s: string) => s.trim())
              : [""],
            mustHaveQualifications: Array.isArray(jobDetails.mustHaveQualifications)
              ? jobDetails.mustHaveQualifications
              : Array.isArray(jobDetails.must_have_qualifications)
              ? jobDetails.must_have_qualifications
              : typeof jobDetails.must_have_qualifications === "string"
              ? jobDetails.must_have_qualifications.split(",").map((s: string) => s.trim())
              : [""],
            niceToHaveQualifications: Array.isArray(jobDetails.niceToHaveQualifications)
              ? jobDetails.niceToHaveQualifications
              : Array.isArray(jobDetails.nice_to_have_qualifications)
              ? jobDetails.nice_to_have_qualifications
              : typeof jobDetails.nice_to_have_qualifications === "string"
              ? jobDetails.nice_to_have_qualifications.split(",").map((s: string) => s.trim())
              : [""],
            jobSummary: jobDetails.jobSummary ?? jobDetails.job_summary ?? "",
            applicationDeadline: { date: "", time: "" },
            maxApplicants: jobDetails.maxApplicants ?? jobDetails.max_applicants ?? "",
            applicationQuestions: Array.isArray(questionsData)
              ? questionsData.map(q => {
                  let opts: string[] = [];
                  if (q.options) {
                    let parsedOptions: unknown = q.options;
                    if (typeof parsedOptions === "string") {
                      try {
                        parsedOptions = JSON.parse(parsedOptions);
                      } catch {
                        parsedOptions = [parsedOptions];
                      }
                    }
                    if (Array.isArray(parsedOptions)) {
                      if (parsedOptions.length > 0 && typeof parsedOptions[0] === "object" && parsedOptions[0] !== null && "option_value" in parsedOptions[0]) {
                        opts = (parsedOptions as { option_value: string }[]).map(optObj => optObj.option_value);
                      } else {
                        opts = parsedOptions as string[];
                      }
                    }
                  }
                  return {
                    question: q.question ?? "",
                    type: q.type ?? "",
                    options: opts,
                    autoReject: q.auto_reject ?? false,
                    correctAnswer: q.correct_answer ?? undefined,
                  };
                })
              : [],
            perksAndBenefits: Array.isArray(jobDetails.perksAndBenefits)
              ? jobDetails.perksAndBenefits
              : Array.isArray(jobDetails.perks_and_benefits)
              ? jobDetails.perks_and_benefits
              : [],
            skills: Array.isArray(jobDetails.skills) ? jobDetails.skills : [],
          }

          setOriginalJobData(normalizedJobData)
          setFormData({
            ...normalizedJobData,
            jobTitle: `${normalizedJobData.jobTitle} (Copy)`,
          })
        }
      } catch (error) {
        console.error("Error fetching job details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (open && jobData && jobData.id) {
      fetchJobDetails(String(jobData.id))
      setCurrentStep(1)
      setErrors({})
      setHasAttemptedNext(false)
      setSimilarityWarning(null)
    }
  }, [open, jobData])

  const calculateSimilarity = (original: JobPostingData, current: JobPostingData): number => {
    const fieldsToCompare = [
      'jobTitle',
      'location', 
      'remoteOptions',
      'workType',
      'payType',
      'payAmount',
      'recommendedCourse',
      'jobDescription',
      'jobSummary',
      'maxApplicants'
    ]

    let matches = 0
    let totalFields = fieldsToCompare.length

    fieldsToCompare.forEach(field => {
      const originalValue = String(original[field as keyof JobPostingData] || '').trim().toLowerCase()
      const currentValue = String(current[field as keyof JobPostingData] || '').trim().toLowerCase()
      
      if (originalValue === currentValue) {
        matches++
      }
    })

    const arrayFields = ['responsibilities', 'mustHaveQualifications', 'niceToHaveQualifications', 'perksAndBenefits']
    arrayFields.forEach(field => {
      const originalArray = original[field as keyof JobPostingData] as string[] || []
      const currentArray = current[field as keyof JobPostingData] as string[] || []
      
      if (JSON.stringify(originalArray.sort()) === JSON.stringify(currentArray.sort())) {
        matches++
      }
      totalFields++
    })

    const originalQuestions = JSON.stringify(original.applicationQuestions || [])
    const currentQuestions = JSON.stringify(current.applicationQuestions || [])
    if (originalQuestions === currentQuestions) {
      matches++
    }
    totalFields++

    return (matches / totalFields) * 100
  }

  const checkSimilarity = () => {
    if (!originalJobData) return true

    if (
      formData.jobTitle.trim().toLowerCase() !== (originalJobData.jobTitle || "").trim().toLowerCase()
    ) {
      setSimilarityWarning(null)
      setShowSimilarityWarning(false)
      return true
    }

    const similarity = calculateSimilarity(originalJobData, formData)
    
    if (similarity >= 90) {
      setSimilarityWarning(`BLOCKED:This job is ${Math.round(similarity)}% identical to the original. Duplication is not allowed for jobs that are too similar.`)
      setShowSimilarityWarning(true)
      return false
    } else if (similarity >= 75) {
      setSimilarityWarning(`This job is ${Math.round(similarity)}% similar to the original. Consider making more changes to differentiate it.`)
      setShowSimilarityWarning(true)
    } else {
      setSimilarityWarning(null)
      setShowSimilarityWarning(true)
    }
    
    return true
  }

  const handleFieldChange = <T extends keyof JobPostingData>(field: T, value: JobPostingData[T]) => {
    const updatedData = { ...formData, [field]: value }
    setFormData(updatedData)
    
    const keyFields = ['jobTitle', 'jobDescription', 'responsibilities', 'mustHaveQualifications']
    if (keyFields.includes(field as string) && originalJobData) {
      if (
        field === "jobTitle" &&
        updatedData.jobTitle.trim().toLowerCase() !== (originalJobData.jobTitle || "").trim().toLowerCase()
      ) {
        setSimilarityWarning(null)
        setShowSimilarityWarning(false)
        return
      }
      const similarity = calculateSimilarity(originalJobData, updatedData)
      
      if (similarity >= 90) {
        setSimilarityWarning(`BLOCKED:This job is ${Math.round(similarity)}% identical to the original. Duplication is not allowed for jobs that are too similar.`)
        setShowSimilarityWarning(true)
      } else if (similarity >= 75) {
        setSimilarityWarning(`This job is ${Math.round(similarity)}% similar to the original. Consider making more changes.`)
        setShowSimilarityWarning(true)
      } else {
        setSimilarityWarning(null)
        setShowSimilarityWarning(true)
      }
    }
  }

  const updateFormData = (data: Partial<JobPostingData>) => {
    const updatedData = { ...formData, ...data }
    setFormData(updatedData)
    
    if (originalJobData) {
      if (
        updatedData.jobTitle.trim().toLowerCase() !== (originalJobData.jobTitle || "").trim().toLowerCase()
      ) {
        setSimilarityWarning(null)
        setShowSimilarityWarning(false)
        return
      }
      const similarity = calculateSimilarity(originalJobData, updatedData)
      
      if (similarity >= 90) {
        setSimilarityWarning(`BLOCKED:This job is ${Math.round(similarity)}% identical to the original. Duplication is not allowed for jobs that are too similar.`)
        setShowSimilarityWarning(true)
      } else if (similarity >= 75) {
        setSimilarityWarning(`This job is ${Math.round(similarity)}% similar to the original. Consider making more changes.`)
        setShowSimilarityWarning(true)
      } else {
        setSimilarityWarning(null)
        setShowSimilarityWarning(true)
      }
    }
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
      newErrors = {
        jobDescription: !formData.jobDescription.trim(),
        responsibilities: formData.responsibilities.every((item) => !item.trim()),
        mustHaveQualifications: formData.mustHaveQualifications.every((item) => !item.trim()),
        jobSummary: !formData.jobSummary.trim(),
      }
    }
    setErrors(newErrors)
    const isValid = Object.values(newErrors).every((isValid) => !isValid)
    
    if (isValid) {
      setCompletedSteps(prev => new Set([...prev, currentStep]))
    } else {
      setCompletedSteps(prev => {
        const newSet = new Set(prev)
        newSet.delete(currentStep)
        return newSet
      })
    }
    
    return isValid
  }

  const nextStep = () => {
    setHasAttemptedNext(true)
    const isValid = validateFields()
    if (isValid) {
      if (currentStep < TOTAL_STEPS) {
        const nextStepNum = currentStep + 1
        setCurrentStep(nextStepNum)
        setHasAttemptedNext(false)
        
        const nextStepPage = Math.ceil(nextStepNum / STEPS_PER_PAGE)
        if (nextStepPage !== currentPage) {
          setCurrentPage(nextStepPage)
        }
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      const prevStepNum = currentStep - 1
      setCurrentStep(prevStepNum)
      
      const prevStepPage = Math.ceil(prevStepNum / STEPS_PER_PAGE)
      if (prevStepPage !== currentPage) {
        setCurrentPage(prevStepPage)
      }
    }
  }

  const goToStep = (stepNumber: number) => {
    setCurrentStep(stepNumber)
    setHasAttemptedNext(false)
  }

  const handleDuplicateJob = async () => {
    setHasAttemptedNext(true)
    const isValid = validateFields()
    if (!isValid) {
      setLoading(false)
      return
    }

    const canProceed = checkSimilarity()
    if (!canProceed) {
      setLoading(false)
      return
    }
    
    setLoading(true)
    try {
      let application_deadline: string | null = null;
      if (formData.applicationDeadline && formData.applicationDeadline.date) {
        const date = formData.applicationDeadline.date;
        const time = formData.applicationDeadline.time || "00:00";
        application_deadline = `${date} ${time}`;
      }

      const response = await fetch("/api/employers/post-a-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          action: "publishJob",
          formData: {
            ...formData,
            applicationDeadline: application_deadline,
          },
        }),
      })

      if (response.ok) {
        onSuccess?.()
        onClose()
      }
    } catch (error) {
      console.error("Error duplicating job:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return "Job Details"
      case 2: return "Job Description"
      case 3: return "Application Settings"
      case 4: return "Review & Duplicate"
      default: return `Step ${step}`
    }
  }

  const getStepIcon = (step: number) => {
    const isCompleted = completedSteps.has(step)
    const isCurrent = step === currentStep
    
    if (isCompleted) {
      return (
        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
          ✓
        </div>
      )
    }
    
    if (isCurrent) {
      return (
        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
          {step}
        </div>
      )
    }
    
    return (
      <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
        {step}
      </div>
    )
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
        return (
          <WriteStep
            formData={formData}
            updateFormData={updateFormData}
            errors={hasAttemptedNext ? errors : {}}
            setErrors={setErrors}
          />
        )
      case 3:
        return <ManageStep formData={formData} updateFormData={updateFormData} />
      case 4:
        return (
          <PreviewStep formData={formData} onPreview={() => {}} />
        )
      default:
        return null
    }
  }

  if (!open) return null

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Copy className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Duplicate Job Listing</h2>
              <p className="text-sm text-gray-500">Create a copy of this job with modifications</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Similarity Warning */}
        {similarityWarning && showSimilarityWarning && (
          <div className={`mx-6 mt-4 p-4 rounded-lg ${
            similarityWarning.startsWith('BLOCKED:') 
              ? 'bg-red-50 border border-red-200' 
              : 'bg-amber-50 border border-amber-200'
          }`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                similarityWarning.startsWith('BLOCKED:') ? 'text-red-600' : 'text-amber-600'
              }`} />
              <div className="flex-1">
                <h4 className={`text-sm font-medium ${
                  similarityWarning.startsWith('BLOCKED:') ? 'text-red-800' : 'text-amber-800'
                }`}>
                  {similarityWarning.startsWith('BLOCKED:') ? 'Duplication Blocked' : 'Similarity Warning'}
                </h4>
                <p className={`text-sm mt-1 ${
                  similarityWarning.startsWith('BLOCKED:') ? 'text-red-700' : 'text-amber-700'
                }`}>
                  {similarityWarning.startsWith('BLOCKED:') ? similarityWarning.replace('BLOCKED:', '') : similarityWarning}
                </p>
                <p className={`text-xs mt-2 ${
                  similarityWarning.startsWith('BLOCKED:') ? 'text-red-600' : 'text-amber-600'
                }`}>
                  {similarityWarning.startsWith('BLOCKED:') 
                    ? 'You must make more significant changes before duplicating this job.'
                    : 'Consider changing the job title, description, requirements, or other key details to create a more unique listing.'
                  }
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSimilarityWarning(false)}
                className={`px-3 py-1 text-xs font-medium rounded-md hover:bg-opacity-80 ${
                  similarityWarning.startsWith('BLOCKED:')
                    ? 'text-red-700 hover:bg-red-100'
                    : 'text-amber-700 hover:bg-amber-100'
                }`}
              >
                Understood
              </Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500" />
          </div>
        ) : (
          <>
            {/* Step Navigation with Pagination */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <span className="text-xs text-gray-400">
                    (Steps {startStep}-{endStep} of {TOTAL_STEPS})
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                {stepsOnCurrentPage.map((step, index) => (
                  <React.Fragment key={step}>
                    <button
                      onClick={() => goToStep(step)}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white transition-colors"
                      disabled={loading}
                    >
                      {getStepIcon(step)}
                      <span className={`text-xs font-medium ${
                        currentStep === step ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {getStepTitle(step)}
                      </span>
                    </button>
                    {index < stepsOnCurrentPage.length - 1 && (
                      <div className="w-8 h-0.5 bg-gray-300" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1 || loading}
                className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              {currentStep < TOTAL_STEPS ? (
                <Button
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2"
                  disabled={loading}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleDuplicateJob}
                  disabled={loading || !formData.jobTitle.trim() || (similarityWarning !== null && similarityWarning.startsWith('BLOCKED:'))}
                  className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                    (similarityWarning !== null && similarityWarning.startsWith('BLOCKED:'))
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                  }`}
                  title={
                    (similarityWarning !== null && similarityWarning.startsWith('BLOCKED:'))
                      ? 'Job is too similar to original - make more changes to enable duplication'
                      : ''
                  }
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Duplicating...
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      {(similarityWarning !== null && similarityWarning.startsWith('BLOCKED:')) ? 'Duplication Blocked' : 'Duplicate Job'}
                    </>
                  )}
                </Button>
              )}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
