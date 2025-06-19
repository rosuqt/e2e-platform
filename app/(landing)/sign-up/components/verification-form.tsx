"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, ChevronDown, ChevronUp, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Checkbox, FormControlLabel } from "@mui/material"
import { Button } from "@/components/ui/button"
import type { VerificationDetails } from "../types"

function capitalizeWords(str?: string) {
  if (!str) return str;
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}

export default function VerificationForm({
  data,
  onChange,
}: {
  data: VerificationDetails
  onChange: (data: VerificationDetails) => void
}) {
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const termsRef = useRef<HTMLDivElement>(null)
  const guidelinesRef = useRef<HTMLDivElement>(null)
  const agreementRef = useRef<HTMLDivElement>(null)

  const sections = [
    {
      title: "Terms & Conditions",
      ref: termsRef,
      content: `1. Introduction
Welcome to Seekr, a web-based platform connecting students with employment opportunities. By using our platform, you agree to comply with these Terms and Conditions. Failure to adhere may result in restricted access or account termination.

2. Employer Responsibilities
Provide accurate and up-to-date information during registration.
Use the platform solely for lawful job posting and recruitment purposes.
Ensure job listings comply with all labor laws and platform guidelines.
Maintain professionalism in communication with candidates.

3. Verification & Account Access
Upon registration, employers receive limited access until company email verification is completed.
Verification tiers affect job posting visibility and platform privileges.
False or misleading information may result in account suspension.

4. Job Posting & Recruitment Policies
Job descriptions must be clear, truthful, and non-discriminatory.
Unpaid internships must be clearly labeled and comply with labor laws.
No fraudulent, misleading, or spam job postings are allowed.

5. Account Termination & Suspension
We reserve the right to suspend or terminate accounts that violate our policies, provide false information, or engage in unethical hiring practices.

6. Modifications to Terms
We may update these Terms and Conditions periodically. Continued use of the platform after modifications constitutes acceptance of the revised terms.`,
    },
    {
      title: "Platform Guidelines",
      ref: guidelinesRef,
      content: `To maintain a secure and professional environment, all employers must adhere to the following guidelines:

1. Professional Conduct
Maintain respectful communication with job seekers.
Do not request inappropriate personal information from applicants.

2. Job Posting Requirements
Clearly outline job responsibilities, requirements, and compensation (if applicable).
Avoid misleading job titles or descriptions.
Do not post duplicate, expired, or fraudulent job listings.

3. Verification & Compliance
Employers must verify their company email to unlock full platform privileges.
Employers with unverified company emails will have limited job visibility and posting capabilities.
Verified employers gain higher job listing visibility and full feature access.

4. Privacy & Security
Do not share or misuse candidate information.
Respect user privacy in accordance with data protection laws.
Failure to comply with these guidelines may result in restricted access or removal from the platform.`,
    },
    {
      title: "Employer Agreement",
      ref: agreementRef,
      content: `By registering on Seekr as an employer, you confirm that:

1. Verification & Data Submission
You acknowledge that verification is required to gain full access to the platform.
Upon sign-up, employers receive limited access and must verify their company email to unlock higher privileges.
Higher verification tiers require submitting official company documents for enhanced
     visibility and access.
You agree to provide accurate company details and understand that falsified information may result in immediate suspension.

2. Data Usage & Privacy
You consent to sharing your company name, company email, job postings, and submitted documents for verification purposes.
Seekr ensures that all employer information is stored securely and will not be shared with third parties without consent.
Submitted documents will be used solely for verification and compliance with platform policies.

3. Responsibilities & Compliance
You are an authorized representative of the company you associate with.
You agree to comply with all platform policies, labor laws, and ethical hiring practices.
You will ensure that all job postings are accurate and non-deceptive.
You acknowledge that any violation of the platform’s policies may result in account restrictions or removal.`,
    },
  ]

  const handleTermsAccepted = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedData = { ...data, termsAccepted: event.target.checked }
    onChange(updatedData)
  }

  const handleSectionClick = (sectionRef: React.RefObject<HTMLDivElement | null>) => {
    setIsModalOpen(true);
    setTimeout(() => {
      if (sectionRef.current) {
        sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
        <div className="bg-blue-50 p-2 rounded-full">
          <Shield className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Review and Verify</h2>
      </div>

      {/* Expandable Preview Container */}
      <Card className="border border-gray-200 shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <button
            className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 transition-colors"
            onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
          >
            <div className="flex items-center gap-2">
              <div className="bg-blue-50 p-1.5 rounded-full">
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-800">Preview Information</h3>
            </div>
            {isPreviewExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>

          <AnimatePresence initial={false}>
            {isPreviewExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-4">
                  {/* Personal Information Section */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 border-b border-gray-200">
                      <div className="bg-blue-50 p-1 rounded-full">
                        <CheckCircle className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                      <h3 className="font-medium text-sm text-gray-700">Personal Information</h3>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 p-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Full Name</p>
                        <p className="text-sm text-gray-800">{`${capitalizeWords(data?.personalDetails?.firstName) || "First name not provided"} ${capitalizeWords(data?.personalDetails?.lastName) || "Last name not provided"}`}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Phone Number</p>
                        <p className="text-sm text-gray-800">
                          {data?.personalDetails?.countryCode
                            ? `+${data.personalDetails.countryCode} `
                            : ""}
                          {data?.personalDetails?.phone || "Phone number not provided"}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-xs font-medium text-gray-500 mb-1">Personal Email</p>
                        <p className="text-sm text-gray-800">{data?.personalDetails?.email || "Email not provided"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Company Information Section */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 border-b border-gray-200">
                      <div className="bg-blue-50 p-1 rounded-full">
                        <CheckCircle className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                      <h3 className="font-medium text-sm text-gray-700">Company Information</h3>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 p-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Company</p>
                        <p className="text-sm text-gray-800">
                          {capitalizeWords(data?.companyAssociation?.companyName) || "Company name not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Branch</p>
                        <p className="text-sm text-gray-800">
                          {capitalizeWords(data?.companyAssociation?.companyBranch) || "Branch not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Role</p>
                        <p className="text-sm text-gray-800">
                          {capitalizeWords(data?.companyAssociation?.companyRole) || "Role not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Job Title</p>
                        <p className="text-sm text-gray-800">
                          {capitalizeWords(data?.companyAssociation?.jobTitle) || "Job title not provided"}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-xs font-medium text-gray-500 mb-1">Company Email</p>
                        <p className="text-sm text-gray-800">
                          {data?.companyAssociation?.companyEmail || "Company email not provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Terms and Conditions Section */}
      <Card className="border border-gray-200 shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="bg-blue-50 p-1.5 rounded-full">
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-800 text-sm">Terms and Conditions</h3>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              View Full
            </button>
          </div>

          {/* Scrollable Terms and Conditions */}
          <div className="text-sm text-gray-700 overflow-y-auto max-h-32 p-3 border rounded-md bg-gray-50 border-gray-200">
            {sections.map((section, index) => (
              <div key={index} ref={section.ref} className="mb-4">
                <h4 className="font-semibold text-gray-800">{section.title}</h4>
                <p className="text-xs leading-relaxed whitespace-pre-wrap">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-2 mt-4">
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.termsAccepted || false}
                  onChange={handleTermsAccepted}
                  color="primary"
                />
              }
              label={
                <span className="text-sm text-gray-700">
                  I agree to the{" "}
                  <span
                    className="text-blue-600 hover:underline cursor-pointer"
                    onClick={() => handleSectionClick(termsRef)}
                  >
                    Terms & Conditions
                  </span>
                  ,{" "}
                  <span
                    className="text-blue-600 hover:underline cursor-pointer"
                    onClick={() => handleSectionClick(guidelinesRef)}
                  >
                    Platform Guidelines
                  </span>
                  , and{" "}
                  <span
                    className="text-blue-600 hover:underline cursor-pointer"
                    onClick={() => handleSectionClick(agreementRef)}
                  >
                    Employer Agreement
                  </span>
                  .
                </span>
              }
              onClick={(e) => {
                if (e.target instanceof HTMLSpanElement) {
                  e.preventDefault();
                }
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-gray-800">Terms and Conditions</DialogTitle>
            <DialogDescription className="text-center text-gray-500">
              Please read our terms and conditions carefully
            </DialogDescription>
          </DialogHeader>

          <div className="text-sm text-gray-700 space-y-6 mt-4 px-2">
            {sections.map((section, index) => (
              <div key={index} ref={section.ref}>
                <h3 className="font-semibold text-gray-800 text-xl">{section.title}</h3>
                <p className="leading-relaxed whitespace-pre-wrap">{section.content}</p>
              </div>
            ))}
          </div>

          {/* Modal I Agree Checkbox */}
          <div className="flex items-start gap-2 mt-6">
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.termsAccepted || false}
                  onChange={handleTermsAccepted}
                  color="primary"
                />
              }
              label={
                <span className="text-sm text-gray-700">
                  I agree to the Terms & Conditions, Platform Guidelines, and Employer Agreement.
                </span>
              }
            />
          </div>

          {/* Modal Close Button */}
          <div className="flex justify-end mt-6">
            <Button
              onClick={() => setIsModalOpen(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
