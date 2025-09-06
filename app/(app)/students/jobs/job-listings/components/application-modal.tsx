"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { X, FileText, Upload, CheckCircle } from "lucide-react"
import Switch from "@mui/material/Switch"
import { Tooltip } from "@mui/material"
import AddressAutocomplete from "@/components/AddressAutocomplete"
import Image from "next/image"

type StudentDetails = {
  id: string
  first_name: string
  last_name: string
  email: string
  course?: string
  year?: string
  section?: string
  contact_info?: {
    email?: string[]
    phone?: string[]
  }
}

type ApplicationForm = {
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  resume: string
  cover_letter: string
  experience_years: string
  portfolio: string
  portfolio_custom: string
  terms_accepted: boolean
  application_answers: Record<string, unknown>
  project_description?: string
}

type QuestionOption = {
  id: string
  question_id: string
  option_value: string
}

type Question = {
  id: string
  question: string
  type: "text" | "single" | "multi"
  auto_reject: boolean
  options?: QuestionOption[]
}

export function ApplicationModal({ jobId, onClose }: { jobId: number; onClose: () => void }) {
  const [step, setStep] = useState(1)
  const totalSteps = 4

  const [student, setStudent] = useState<StudentDetails | null>(null)
  const [form, setForm] = useState<ApplicationForm>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    resume: "",
    cover_letter: "",
    experience_years: "",
    portfolio: "",
    portfolio_custom: "",
    terms_accepted: false,
    application_answers: {},
    project_description: "",
  })
  const [usePersonalEmail, setUsePersonalEmail] = useState(false)
  const [uploadingResume, setUploadingResume] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [existingResume, setExistingResume] = useState<{ name: string; url: string } | null>(null)
  const [existingCover, setExistingCover] = useState<{ name: string; url: string } | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [loadingStudent, setLoadingStudent] = useState(true)
  const [certs, setCerts] = useState<{ name?: string; signedUrl?: string }[]>([]) 
  const [allResumes, setAllResumes] = useState<{ name: string; url: string }[]>([])
  const [allCovers, setAllCovers] = useState<{ name: string; url: string }[]>([])
  const resumeInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setLoadingStudent(true)
    fetch("/api/students/get-student-details")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: StudentDetails) => {
        if (data) {
          setStudent(data)
          let formattedPhone = ""
          if (Array.isArray(data.contact_info?.phone)) {
            if (data.contact_info.phone.length > 1) {
              formattedPhone = `+${data.contact_info.phone[0]} ${data.contact_info.phone[1]}`
            } else if (data.contact_info.phone.length === 1) {
              formattedPhone = data.contact_info.phone[0]
            }
          }
          setForm((prev: ApplicationForm) => ({
            ...prev,
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            email: data.email || (Array.isArray(data.contact_info?.email) ? data.contact_info.email[0] ?? "" : ""),
            phone: formattedPhone,
          }))
        }
        setLoadingStudent(false)
      })
  }, [])

  useEffect(() => {
    if (student) {
      if (usePersonalEmail && Array.isArray(student.contact_info?.email) && student.contact_info.email[0]) {
        setForm((prev: ApplicationForm) => ({ ...prev, email: student.contact_info!.email![0] }))
      } else if (!usePersonalEmail) {
        setForm((prev: ApplicationForm) => ({
          ...prev,
          email: student.email || (Array.isArray(student.contact_info?.email) ? student.contact_info.email[0] ?? "" : "")
        }))
      }
    }
  }, [usePersonalEmail, student])

  useEffect(() => {
    if (student) {
      let formattedPhone = ""
      if (Array.isArray(student.contact_info?.phone)) {
        if (student.contact_info.phone.length > 1) {
          formattedPhone = `+${student.contact_info.phone[0]} ${student.contact_info.phone[1]}`
        } else if (student.contact_info.phone.length === 1) {
          formattedPhone = student.contact_info.phone[0]
        }
      }
      setForm((prev: ApplicationForm) => ({
        ...prev,
        phone: formattedPhone
      }))
    }
  }, [student])

  useEffect(() => {
    const fetchExistingDocs = async () => {
      if (!student) return
      const safeFirst = student.first_name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
      const safeLast = student.last_name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
      const resumeName = `${safeFirst}${safeLast}_RESUME`
      const coverName = `${safeFirst}${safeLast}_COVER_LETTER`
      const res = await fetch(`/api/students/student-profile/getDocuments?student_id=${student.id}`)
      const data = await res.json()
      let resumeObj = null
      let coverObj = null
      const cleanFileName = (filename: string, fallback: string) => {
        if (!filename) return fallback
        const base = filename.replace(/(_RESUME|_COVER_LETTER).*/i, "$1")
        const extMatch = filename.match(/\.(pdf|docx?|txt)$/i)
        return base + (extMatch ? extMatch[0].toUpperCase() : "")
      }
      if (data?.uploaded_resume_url && data.resumeUrl) {
        const rawName = data.uploaded_resume_url.split("/").pop() || `${resumeName}.DOC`
        resumeObj = {
          name: cleanFileName(rawName, resumeName),
          url: data.resumeUrl
        }
      } else if (data?.resumeUrl) {
        const rawName = `${resumeName}.${(data.resumeUrl.split(".").pop() || "DOC").toUpperCase()}`
        resumeObj = {
          name: cleanFileName(rawName, resumeName),
          url: data.resumeUrl
        }
      }
      if (data?.uploaded_cover_letter_url && data.coverLetterUrl) {
        const rawName = data.uploaded_cover_letter_url.split("/").pop() || `${coverName}.DOC`
        coverObj = {
          name: cleanFileName(rawName, coverName),
          url: data.coverLetterUrl
        }
      } else if (data?.coverLetterUrl) {
        const rawName = `${coverName}.${(data.coverLetterUrl.split(".").pop() || "DOC").toUpperCase()}`
        coverObj = {
          name: cleanFileName(rawName, coverName),
          url: data.coverLetterUrl
        }
      }
      setExistingResume(resumeObj)
      setExistingCover(coverObj)
      setCerts(Array.isArray(data?.certs) ? data.certs : [])
      if (Array.isArray(data?.resumeUrls)) {
        setAllResumes(
          data.resumeUrls.map((url: string, idx: number) => ({
            name: (data.uploaded_resume_url && Array.isArray(data.uploaded_resume_url) && data.uploaded_resume_url[idx])
              ? cleanFileName(data.uploaded_resume_url[idx].split("/").pop() || resumeName, resumeName)
              : `Resume #${idx + 1}`,
            url
          }))
        )
      }
      if (Array.isArray(data?.coverLetterUrls)) {
        setAllCovers(
          data.coverLetterUrls.map((url: string, idx: number) => ({
            name: (data.uploaded_cover_letter_url && Array.isArray(data.uploaded_cover_letter_url) && data.uploaded_cover_letter_url[idx])
              ? cleanFileName(data.uploaded_cover_letter_url[idx].split("/").pop() || coverName, coverName)
              : `Cover Letter #${idx + 1}`,
            url
          }))
        )
      }
    }
    if (student) fetchExistingDocs()
  }, [student])

  const refetchDocuments = async () => {
    if (!student) return
    const safeFirst = student.first_name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
    const safeLast = student.last_name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
    const resumeName = `${safeFirst}${safeLast}_RESUME`
    const coverName = `${safeFirst}${safeLast}_COVER_LETTER`
    const res = await fetch(`/api/students/student-profile/getDocuments?student_id=${student.id}`)
    const data = await res.json()

    const cleanFileName = (filename: string, fallback: string) => {
      if (!filename) return fallback
      const base = filename.replace(/(_RESUME|_COVER_LETTER).*/i, "$1")
      const extMatch = filename.match(/\.(pdf|docx?|txt)$/i)
      return base + (extMatch ? extMatch[0].toUpperCase() : "")
    }
    let resumeObj = null
    let coverObj = null
    if (data?.uploaded_resume_url && data.resumeUrl) {
      const rawName = data.uploaded_resume_url.split("/").pop() || `${resumeName}.DOC`
      resumeObj = {
        name: cleanFileName(rawName, resumeName),
        url: data.resumeUrl
      }
    } else if (data?.resumeUrl) {
      const rawName = `${resumeName}.${(data.resumeUrl.split(".").pop() || "DOC").toUpperCase()}`
      resumeObj = {
        name: cleanFileName(rawName, resumeName),
        url: data.resumeUrl
      }
    }
    if (data?.uploaded_cover_letter_url && data.coverLetterUrl) {
      const rawName = data.uploaded_cover_letter_url.split("/").pop() || `${coverName}.DOC`
      coverObj = {
        name: cleanFileName(rawName, coverName),
        url: data.coverLetterUrl
      }
    } else if (data?.coverLetterUrl) {
      const rawName = `${coverName}.${(data.coverLetterUrl.split(".").pop() || "DOC").toUpperCase()}`
      coverObj = {
        name: cleanFileName(rawName, coverName),
        url: data.coverLetterUrl
      }
    }
    setExistingResume(resumeObj)
    setExistingCover(coverObj)
    setCerts(Array.isArray(data?.certs) ? data.certs : []) 
  }

  const handleChange = (field: keyof ApplicationForm, value: ApplicationForm[keyof ApplicationForm]) => {
    setForm((prev: ApplicationForm) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    let resumePath = ""
    let coverLetterPath = ""
    if (existingResume?.name) {
      resumePath = student?.id + "/" + existingResume.name
    } else if (form.resume) {
      try {
        const urlObj = new URL(form.resume)
        resumePath = urlObj.pathname.startsWith("/") ? urlObj.pathname.slice(1) : urlObj.pathname
      } catch {
        resumePath = form.resume
      }
    }
    if (existingCover?.name) {
      coverLetterPath = student?.id + "/" + existingCover.name
    } else if (form.cover_letter) {
      try {
        const urlObj = new URL(form.cover_letter)
        coverLetterPath = urlObj.pathname.startsWith("/") ? urlObj.pathname.slice(1) : urlObj.pathname
      } catch {
        coverLetterPath = form.cover_letter
      }
    }

    await fetch("/api/students/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        resume: resumePath || "",
        cover_letter: coverLetterPath || "",
        job_id: jobId,
        student_id: student?.id,
        project_description: form.project_description,
        portfolio:
          form.portfolio === "__custom__"
            ? form.portfolio_custom
            : form.portfolio,
      }),
    })
    onClose()
  }

  const jobTitles = {
    0: "UI/UX Designer at Fb Mark-it Place",
    1: "Frontend Developer at Meta",
    2: "Product Manager at Google",
  }

  const handleFileUpload = async (
    file: File,
    type: "resume" | "cover_letter"
  ) => {
    if (!student) return
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", type)
    formData.append("student_id", student.id)
    formData.append("first_name", student.first_name)
    formData.append("last_name", student.last_name)
    formData.append("override", "true")
    formData.append("application_upload", "true")
    setUploadingResume(type === "resume")
    setUploadingCover(type === "cover_letter")
    const res = await fetch("/api/students/student-profile/uploadDocument", {
      method: "POST",
      body: formData,
    })
    setUploadingResume(false)
    setUploadingCover(false)
    if (res.ok) {
      const data = await res.json()
      if (type === "resume" && data.path) {
        setForm((prev) => ({ ...prev, resume: data.path }))
      }
      if (type === "cover_letter" && data.path) {
        setForm((prev) => ({ ...prev, cover_letter: data.path }))
      }
      await refetchDocuments()
    }
  }

  useEffect(() => {
    if (!jobId) return
    setLoadingQuestions(true)
    fetch(`/api/employers/application-questions?job_id=${jobId}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setQuestions((data || []) as Question[])
        setLoadingQuestions(false)
      })
      .catch(() => setLoadingQuestions(false))
  }, [jobId])

  const handleQuestionAnswer = (questionId: string, value: string | string[]) => {
    setForm(prev => ({
      ...prev,
      application_answers: {
        ...prev.application_answers,
        [questionId]: value
      }
    }))
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white shrink-0">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xl">Complete Application</h3>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={onClose}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <p className="text-blue-100 text-sm">{jobTitles[jobId as keyof typeof jobTitles] || "Job Position"}</p>

          {/* Progress bar */}
          <div className="mt-4 h-1.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-1 text-blue-100">
            <span>
              Step {step} of {totalSteps}
            </span>
            <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 72px)" }}>
          {loadingStudent ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-400 border-t-transparent"></div>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div className="space-y-4">
                  <div className="rounded-lg border p-4 bg-green-50">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-700">Your profile is a good match!</p>
                        <p className="text-xs text-green-600 mt-1">
                          Based on your skills and experience, you appear to be a strong candidate for this position.
                        </p>
                      </div>
                    </div>
                  </div>
                  <h4 className="font-medium text-lg text-blue-700">Personal Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <Input
                        value={form.first_name}
                        onChange={(e) => handleChange("first_name", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <Input
                        value={form.last_name}
                        onChange={(e) => handleChange("last_name", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <Input
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                      />
                      <div className="flex items-center gap-2 mt-1">
                        <Switch
                          checked={usePersonalEmail}
                          onChange={(_, checked) => setUsePersonalEmail(checked)}
                          size="small"
                          color="primary"
                        />
                        <span className="text-xs">Use personal email</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <div className="flex items-center gap-2">
                        {Array.isArray(student?.contact_info?.phone) && student.contact_info.phone.length > 1 && (
                          <>
                            <Input
                              value={`+${student.contact_info.phone[0]}`}
                              disabled
                              className="w-20"
                            />
                            <Input
                              value={student.contact_info.phone[1]}
                              onChange={(e) => {
                                const newPhone = e.target.value
                                setForm((prev) => ({
                                  ...prev,
                                  phone: `+${student.contact_info!.phone![0]} ${newPhone}`
                                }))
                              }}
                            />
                          </>
                        )}
                        {(!student?.contact_info?.phone || student.contact_info.phone.length === 1) && (
                          <Input
                            value={form.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                          />
                        )}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <div className="w-full">
                        <AddressAutocomplete
                          value={form.address}
                          onChange={(val: string) => handleChange("address", val)}
                          label=""
                          error={false}
                          helperText={null}
                          height="40px"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-lg text-blue-700">Resume & Cover Letter</h4>
                  <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upload">Upload Documents</TabsTrigger>
                      <TabsTrigger value="select">Select Existing</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload" className="space-y-4 pt-4">
                      <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 text-center">
                        <div className="flex flex-col items-center justify-center">
                          {(existingResume || form.resume) && !allResumes.some(r => r.url === form.resume) ? (
                            <>
                              <div className="flex items-center gap-3">
                                <Image
                                  src={
                                    (existingResume?.name?.toLowerCase().endsWith('.pdf') || existingResume?.url?.toLowerCase().endsWith('.pdf'))
                                      ? "/images/icon/pdf.png"
                                      : "/images/icon/doc.png"
                                  }
                                  alt="icon"
                                  width={32}
                                  height={32}
                                  className="w-8 h-8"
                                />
                                <span className="text-base text-gray-800 flex items-center gap-2">
                                  {existingResume?.name || form.resume?.split("/").pop()}
                                  {form.resume && !existingResume && (
                                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full align-middle animate-pulse">
                                      New Resume
                                    </span>
                                  )}
                                </span>
                                <a
                                  href={existingResume?.url || form.resume}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium"
                                >
                                  View
                                </a>
                              </div>
                              <Tooltip title="Want to use something else? Upload a new one here and we'll store it for you for future use!." placement="top" arrow>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-2 border-blue-400 text-blue-600 hover:bg-red-50"
                                  disabled={uploadingResume}
                                  onClick={() => resumeInputRef.current?.click()}
                                >
                                  {uploadingResume ? "Uploading..." : "Upload a new Resume"}
                                </Button>
                              </Tooltip>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,.txt"
                                className="hidden"
                                ref={resumeInputRef}
                                onChange={async (e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    await handleFileUpload(e.target.files[0], "resume")
                                  }
                                }}
                              />
                            </>
                          ) : (
                            <>
                              <FileText className="h-10 w-10 text-blue-500 mb-2" />
                              <p className="text-sm text-blue-700 font-medium">Upload your resume</p>
                              <p className="text-xs text-gray-500 mt-1">PDF, DOCX or TXT (Max 5MB)</p>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,.txt"
                                className="hidden"
                                ref={resumeInputRef}
                                onChange={async (e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    await handleFileUpload(e.target.files[0], "resume")
                                  }
                                }}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-3"
                                disabled={uploadingResume}
                                onClick={() => resumeInputRef.current?.click()}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                {uploadingResume ? "Uploading..." : "Browse Files"}
                              </Button>
                              {form.resume && (
                                <div className="mt-2 text-xs text-green-600">
                                  Resume uploaded successfully
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter (Optional)</label>
                        <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 text-center flex flex-col items-center justify-center">
                          {(existingCover || form.cover_letter) && !allCovers.some(c => c.url === form.cover_letter) ? (
                            <>
                              <div className="flex items-center gap-3">
                                <Image
                                  src={
                                    (existingCover?.name?.toLowerCase().endsWith('.pdf') || existingCover?.url?.toLowerCase().endsWith('.pdf'))
                                      ? "/images/icon/pdf.png"
                                      : "/images/icon/doc.png"
                                  }
                                  alt="icon"
                                  width={32}
                                  height={32}
                                  className="w-8 h-8"
                                />
                                <span className="text-base text-gray-800">
                                  {existingCover?.name || form.cover_letter?.split("/").pop()}
                                  {form.cover_letter && !existingCover && (
                                    <span className="ml-2 inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full align-middle">
                                      New
                                    </span>
                                  )}
                                </span>
                                <a
                                  href={existingCover?.url || form.cover_letter}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium"
                                >
                                  View
                                </a>
                              </div>
                              <Tooltip title="Uploading a new file will override your existing cover letter." placement="top" arrow>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-2 border-blue-400 text-blue-600 hover:bg-red-50"
                                  disabled={uploadingCover}
                                  onClick={() => coverInputRef.current?.click()}
                                >
                                  {uploadingCover ? "Uploading..." : "Upload a new Resume"}
                                </Button>
                              </Tooltip>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,.txt"
                                className="hidden"
                                ref={coverInputRef}
                                onChange={async (e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    await handleFileUpload(e.target.files[0], "cover_letter")
                                  }
                                }}
                              />
                            </>
                          ) : (
                            <>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,.txt"
                                className="hidden"
                                ref={coverInputRef}
                                onChange={async (e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    await handleFileUpload(e.target.files[0], "cover_letter")
                                  }
                                }}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={uploadingCover}
                                onClick={() => coverInputRef.current?.click()}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                {uploadingCover ? "Uploading..." : "Upload Cover Letter"}
                              </Button>
                              {form.cover_letter && (
                                <div className="mt-2 text-xs text-green-600">
                                  Cover letter uploaded successfully
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="select" className="space-y-4 pt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Existing Resume</label>
                        {allResumes.length === 0 ? (
                          <div className="text-xs text-gray-500">No resumes found.</div>
                        ) : (
                          <div className="space-y-2">
                            {allResumes.map((resume, idx) => (
                              <div key={idx} className="flex items-center gap-3 border rounded p-2">
                                <input
                                  type="radio"
                                  name="resume-select"
                                  checked={form.resume === resume.url}
                                  onChange={() => setForm(prev => ({ ...prev, resume: resume.url }))}
                                />
                                <Image
                                  src={
                                    (resume.name?.toLowerCase().endsWith('.pdf') || resume.url?.toLowerCase().endsWith('.pdf'))
                                      ? "/images/icon/pdf.png"
                                      : "/images/icon/doc.png"
                                  }
                                  alt="icon"
                                  width={24}
                                  height={24}
                                  className="w-6 h-6"
                                />
                                <span className="text-sm">{resume.name}</span>
                                <a
                                  href={resume.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium"
                                >
                                  View
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Existing Cover Letter</label>
                        {allCovers.length === 0 ? (
                          <div className="text-xs text-gray-500">No cover letters found.</div>
                        ) : (
                          <div className="space-y-2">
                            {allCovers.map((cover, idx) => (
                              <div key={idx} className="flex items-center gap-3 border rounded p-2">
                                <input
                                  type="radio"
                                  name="cover-select"
                                  checked={form.cover_letter === cover.url}
                                  onChange={() => setForm(prev => ({ ...prev, cover_letter: cover.url }))}
                                />
                                <Image
                                  src={
                                    (cover.name?.toLowerCase().endsWith('.pdf') || cover.url?.toLowerCase().endsWith('.pdf'))
                                      ? "/images/icon/pdf.png"
                                      : "/images/icon/doc.png"
                                  }
                                  alt="icon"
                                  width={24}
                                  height={24}
                                  className="w-6 h-6"
                                />
                                <span className="text-sm">{cover.name}</span>
                                <a
                                  href={cover.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium"
                                >
                                  View
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      How many years of experience do you have in this field?
                    </label>
                    <select
                      className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={form.experience_years}
                      onChange={e => handleChange("experience_years", e.target.value)}
                    >
                      <option value="">Select...</option>
                      <option>Less than 1 year</option>
                      <option>1-2 years</option>
                      <option>3-5 years</option>
                      <option>5+ years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Describe a project you&apos;re most proud of (optional)
                    </label>
                    <textarea
                      className="w-full min-h-[100px] rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about a project that showcases your skills and experience..."
                      value={form.project_description || ""}
                      onChange={e => handleChange("project_description", e.target.value)}
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Choose an achievement or portfolio piece to include with your application (optional)
                    </label>
                    <select
                      className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={form.portfolio}
                      onChange={e => {
                        const val: string = e.target.value
                        if (val === "__custom__") {
                          setForm(prev => ({ ...prev, portfolio: val }))
                        } else {
                          const cert = certs.find(c => {
                            if (!c.signedUrl) return false
                            try {
                              const urlObj = new URL(c.signedUrl)
                              const filePath = urlObj.pathname.startsWith("/") ? urlObj.pathname.slice(1) : urlObj.pathname
                              return filePath === val
                            } catch {
                              return c.signedUrl === val
                            }
                          })
                          if (cert && cert.signedUrl) {
                            const urlObj = new URL(cert.signedUrl)
                            const filePath = urlObj.pathname.startsWith("/") ? urlObj.pathname.slice(1) : urlObj.pathname
                            setForm(prev => ({ ...prev, portfolio: filePath, portfolio_custom: "" }))
                          } else {
                            setForm(prev => ({ ...prev, portfolio: val, portfolio_custom: "" }))
                          }
                        }
                      }}
                    >
                      <option value="">Select a certificate...</option>
                      {certs
                        .map((cert, idx) => {
                          if (!cert.signedUrl) return null
                          let filePath = ""
                          let displayName = ""
                          try {
                            const urlObj = new URL(cert.signedUrl)
                            filePath = urlObj.pathname.startsWith("/") ? urlObj.pathname.slice(1) : urlObj.pathname
                            displayName = cert.name
                              ? cert.name
                              : decodeURIComponent(urlObj.pathname.split("/").pop() || `Certificate #${idx + 1}`)
                          } catch {
                            filePath = cert.signedUrl
                            displayName = cert.name || `Certificate #${idx + 1}`
                          }
                          if (!filePath) return null
                          return (
                            <option key={idx} value={filePath}>
                              {displayName}
                            </option>
                          )
                        })
                        .filter(Boolean)}
                      <option value="__custom__">Other (enter link below)</option>
                    </select>
                    {form.portfolio === "__custom__" && (
                      <Input
                        className="mt-2"
                        placeholder="https://yourportfolio.com"
                        value={form.portfolio_custom || ""}
                        onChange={e => setForm(prev => ({ ...prev, portfolio_custom: e.target.value }))}
                      />
                    )}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-lg text-blue-700">Additional Questions</h4>
                  <div className="space-y-4 border rounded-lg p-4 bg-blue-50">
                    <p className="text-sm text-blue-700 font-medium">Company Questions</p>
                    {loadingQuestions ? (
                      <div className="text-sm text-gray-500">Loading questions...</div>
                    ) : (
                      <div className="space-y-3">
                        {questions.length === 0 && (
                          <div className="text-sm text-gray-500">No additional questions.</div>
                        )}
                        {questions.map((q) => (
                          <div key={q.id}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {q.question}
                            </label>
                            {q.type === "text" && (
                              <textarea
                                className="w-full min-h-[80px] rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Your answer..."
                                value={typeof form.application_answers[q.id] === "string" ? form.application_answers[q.id] as string : ""}
                                onChange={e => handleQuestionAnswer(q.id, e.target.value)}
                              />
                            )}
                            {q.type === "single" && (
                              <div className="flex flex-col gap-2 mt-1">
                                {q.options?.map((opt) => (
                                  <label key={opt.id} className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name={`question-${q.id}`}
                                      value={opt.option_value}
                                      checked={form.application_answers[q.id] === opt.option_value}
                                      onChange={() => handleQuestionAnswer(q.id, opt.option_value)}
                                      className="text-blue-600"
                                    />
                                    <span className="text-sm">{opt.option_value}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                            {q.type === "multi" && (
                              <div className="flex flex-col gap-2 mt-1">
                                {q.options?.map((opt) => (
                                  <label key={opt.id} className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      value={opt.option_value}
                                      checked={Array.isArray(form.application_answers[q.id]) && (form.application_answers[q.id] as string[]).includes(opt.option_value)}
                                      onChange={e => {
                                        const prev = Array.isArray(form.application_answers[q.id]) ? form.application_answers[q.id] as string[] : []
                                        if (e.target.checked) {
                                          handleQuestionAnswer(q.id, [...prev, opt.option_value])
                                        } else {
                                          handleQuestionAnswer(q.id, prev.filter((v: string) => v !== opt.option_value))
                                        }
                                      }}
                                      className="text-blue-600"
                                    />
                                    <span className="text-sm">{opt.option_value}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={form.terms_accepted}
                        onCheckedChange={(v) => handleChange("terms_accepted", !!v)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the terms and conditions
                        </label>
                        <p className="text-xs text-muted-foreground">
                          By submitting this application, you agree to our privacy policy and terms of service.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-6">
                {step > 1 ? (
                  <Button variant="outline" onClick={handlePrev}>
                    Back
                  </Button>
                ) : (
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                )}

                {step < totalSteps ? (
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleNext}>
                    Continue
                  </Button>
                ) : (
                  <Button className="bg-green-600 hover:bg-green-700" onClick={handleSubmit}>
                    Submit Application
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
