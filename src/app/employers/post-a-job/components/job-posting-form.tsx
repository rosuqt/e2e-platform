"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/app/side-nav/sidebar"
import TopNav from "@/app/student/student-dashboard/TopNav"
import { CreateStep } from "./steps/create-step"
import { ValidationStep } from "./steps/validation-step"
import { WriteStep } from "./steps/write-step"
import { ManageStep } from "./steps/manage-step"
import { PreviewStep } from "./steps/preview-step"
import { ProgressBar } from "./progress-bar"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import type { JobPostingData } from "../lib/types"
import { Save } from "lucide-react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

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

  const updateFormData = (data: Partial<JobPostingData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const [showPreviewModal, setShowPreviewModal] = useState(false)

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CreateStep formData={formData} updateFormData={updateFormData} />
      case 2:
        return <ValidationStep formData={formData} updateFormData={updateFormData} />
      case 3:
        return <WriteStep formData={formData} updateFormData={updateFormData} />
      case 4:
        return <ManageStep formData={formData} updateFormData={updateFormData} />
      case 5:
        return <PreviewStep formData={formData} onPreview={() => setShowPreviewModal(true)} />
      default:
        return <CreateStep formData={formData} updateFormData={updateFormData} />
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
                <Button variant="outline" className="border-gray-200 text-gray-600 bg-white hover:bg-gray-50 flex items-center gap-2 px-8 py-4 rounded-full">
                  <Save size={16} />
                  <span>Save draft</span>
                </Button>

                {currentStep < 5 ? (
                  <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-full flex items-center gap-2">
                    Continue
                    <FaChevronRight />
                  </Button>
                ) : (
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-9 py-4 rounded-full">
                    Post Job
                  </Button>
                )}
              </div>
            </div>

            {showPreviewModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-lg w-[90%] max-w-4xl h-[90vh] overflow-auto shadow-xl"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-gray-800">Job Posting Preview</h2>
                      <Button
                        variant="ghost"
                        onClick={() => setShowPreviewModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Close
                      </Button>
                    </div>
                    <div className="border-t pt-4">
                      {/* Preview content would go here */}
                      <p className="text-gray-500 italic text-center py-12">Preview content will appear here</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
