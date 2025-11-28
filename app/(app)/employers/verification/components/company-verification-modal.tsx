"use client"

import React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Shield, Upload } from "lucide-react"
import { useSession } from "next-auth/react"
import Lottie from "lottie-react"
import offerSentAnimation from "../../../../../public/animations/check.json"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface CompanyVerificationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CompanyVerificationModal({ open, onOpenChange }: CompanyVerificationModalProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const { data: session } = useSession()
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [alreadyUploaded, setAlreadyUploaded] = useState(false)
  const [activeTab, setActiveTab] = useState<"instructions" | "upload">("upload")
  const [docType, setDocType] = useState<"Business ID" | "SEC Registration" | "Business Permit" | "Other">("Business ID")
  const [customDocType, setCustomDocType] = useState("")

  React.useEffect(() => {
    const employer_id = (session?.user as { employerId?: string })?.employerId
    if (employer_id) {
      fetch("/api/employers/verification/checkexist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employer_id }),
      })
        .then(res => res.json())
        .then(data => {
          setAlreadyUploaded(!!data.exists)
        })
        .catch(() => setAlreadyUploaded(false))
    }
  }, [session?.user])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    setUploadError(null)
    setUploadSuccess(false)
    if (!file) {
      setUploadError("Please select a file to upload.")
      return
    }
    if (docType === "Other" && !customDocType.trim()) {
      setUploadError("Please specify the document type.")
      return
    }
    setUploading(true)
    try {
      const employer_id = (session?.user as { employerId?: string })?.employerId
      if (!employer_id) {
        setUploadError("Missing employer ID.")
        setUploading(false)
        return
      }
      const filePath = `${employer_id}/${Date.now()}_${file.name}`
      const formData = new FormData()
      formData.append("file", file)
      formData.append("bucket", "employer.documents")
      formData.append("path", filePath)
      formData.append("file_type", docType === "Other" ? customDocType : docType)
      const res = await fetch("/api/employers/verification", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        setUploadError(data.error || "Upload failed.")
      } else {
        setUploadSuccess(true)
        setFile(null)
        setAlreadyUploaded(true)
      }
    } catch {
      setUploadError("Upload failed.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogTitle asChild>
          <VisuallyHidden>Company Verification</VisuallyHidden>
        </DialogTitle>
        {alreadyUploaded ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-52 h-52 mx-auto">
              <Lottie animationData={offerSentAnimation} loop={false} />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-blue-700 mb-2">Document Already Submitted</h2>
              <p className="text-gray-600 mb-4">
                You have already submitted a company verification document. Please wait for review or contact support if you need to upload again.
              </p>
              <Button
                className="mt-2"
                onClick={() => {
                  onOpenChange(false)
                }}
              >
                Close
              </Button>
            </div>
          </div>
        ) : uploadSuccess ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-52 h-52 mx-auto">
              <Lottie animationData={offerSentAnimation} loop={false} />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-blue-700 mb-2">Document Submitted!</h2>
              <p className="text-gray-600 mb-4">
                Your company verification document has been submitted successfully. We will review your submission and
                notify you once the verification is complete.
              </p>
              <Button
                className="mt-2"
                onClick={() => {
                  setUploadSuccess(false)
                  onOpenChange(false)
                }}
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="mx-auto bg-blue-100 p-3 rounded-full mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <DialogTitle className="text-center">Company Verification</DialogTitle>
              <DialogDescription className="text-center">
                To ensure a secure platform, we need to verify your company identity through an official document. This
                verification helps protect your account, enhances security, and allows you to access essential platform
                features.
              </DialogDescription>
            </DialogHeader>
            {/* Tabs UI */}
            <div className="flex justify-center mb-6">
              <button
                className={`px-4 py-2 rounded-t-lg font-medium ${
                  activeTab === "upload"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setActiveTab("upload")}
              >
                Upload Document
              </button>
              <button
                className={`px-4 py-2 rounded-t-lg font-medium ml-2 ${
                  activeTab === "instructions"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setActiveTab("instructions")}
              >
                Instructions
              </button>
            </div>
            {/* Document Type Tabs */}
            {activeTab === "upload" && (
              <div className="flex justify-center mb-4 space-x-2">
                <button
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    docType === "Business ID"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setDocType("Business ID")}
                >
                  Business ID
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    docType === "SEC Registration"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setDocType("SEC Registration")}
                >
                  SEC Registration
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    docType === "Business Permit"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setDocType("Business Permit")}
                >
                  Business Permit
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    docType === "Other"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setDocType("Other")}
                >
                  Other
                </button>
              </div>
            )}
            {activeTab === "upload" && docType === "Other" && (
              <div className="mb-4 flex justify-center">
                <input
                  type="text"
                  className="border rounded px-3 py-1 text-sm w-64"
                  placeholder="Enter document type"
                  value={customDocType}
                  onChange={e => setCustomDocType(e.target.value)}
                />
              </div>
            )}
            {/* Tab Content */}
            {activeTab === "upload" ? (
              <div className="space-y-4">
                <div className="bg-green-100 text-green-800 text-sm px-4 py-2 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 mr-2" />
                  All data is safely stored and encrypted
                </div>
                <div className="text-center text-sm mb-2">
                  Selected Document Type: <span className="font-semibold text-blue-700">
                    {docType === "Other" ? customDocType || "Other" : docType}
                  </span>
                </div>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("file-upload")?.click()}
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") {
                      document.getElementById("file-upload")?.click()
                    }
                  }}
                  role="button"
                  aria-label="Upload file"
                >
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <Upload className="h-6 w-6 text-gray-500" />
                  </div>
                  <p className="text-sm font-medium mb-1">Drop file here or upload</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Upload a clear copy of your company verification document
                  </p>
                  <div className="flex justify-center space-x-2">
                    <div className="px-3 py-1 bg-gray-100 rounded-md text-xs">JPG</div>
                    <div className="px-3 py-1 bg-gray-100 rounded-md text-xs">PNG</div>
                    <div className="px-3 py-1 bg-gray-100 rounded-md text-xs">PDF</div>
                    <div className="px-3 py-1 bg-gray-100 rounded-md text-xs">DOC</div>
                    <div className="px-3 py-1 bg-gray-100 rounded-md text-xs">DOCX</div>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    id="file-upload"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload" className="sr-only">
                    Select File
                  </label>
                  {file && (
                    <div className="mt-2 text-xs text-blue-600">{file.name}</div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Your uploaded documents are encrypted and stored securely. They will only be used for verification purposes
                  and will not be shared with third parties.
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  onClick={handleSubmit}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Submit"}
                </Button>
                {uploadError && (
                  <div className="text-red-500 text-xs mt-2 text-center">{uploadError}</div>
                )}
              </div>
            ) : (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">How to verify your company</h3>
                <ul className="list-disc pl-6 text-sm text-gray-700 mb-2">
                  <li>Prepare an official document that proves your company identity (e.g., SEC registration, business permit, etc.).</li>
                  <li>Accepted formats: JPG, PNG, PDF, DOC, DOCX.</li>
                  <li>Make sure the document is clear and readable.</li>
                  <li>Your information will be kept secure and confidential.</li>
                  <li>After uploading, wait for our team to review your submission.</li>
                </ul>
                <div className="text-xs text-muted-foreground">
                  Need help? Contact support for assistance with your verification.
                </div>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
