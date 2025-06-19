"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { X, FileText, Upload, CheckCircle } from "lucide-react"
import Switch from "@mui/material/Switch"
import { Tooltip } from "@mui/material"
import AddressAutocomplete from "@/components/AddressAutocomplete"
import Image from "next/image"
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Chip from "@mui/material/Chip";
import ListSubheader from "@mui/material/ListSubheader";
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"

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
  portfolio: string[];
  portfolio_custom: string
  achievements: string[];
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

type Cert = {
  name?: string;
  title?: string;
  certificate_title?: string;
  issuer?: string;
  signedUrl?: string;
  [key: string]: unknown;
};

type PortfolioItem = {
  title?: string;
  url?: string;
  [key: string]: unknown;
};

const Lottie = dynamic(() => import("lottie-react"), { ssr: false })
import mailAnim from "@/../public/animations/mail.json"
import { ConfettiStars } from "@/components/magicui/star"

export function ApplicationModal({ jobId = "", onClose }: { jobId: string | number; onClose: () => void }) {
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
    portfolio: [],
    portfolio_custom: "",
    achievements: [],
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
  const [certs, setCerts] = useState<Cert[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [allResumes, setAllResumes] = useState<{ name: string; url: string }[]>([])
  const [allCovers, setAllCovers] = useState<{ name: string; url: string }[]>([])
  const resumeInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const [questionPage, setQuestionPage] = useState(1)
  const QUESTIONS_PER_PAGE = 2
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [jobTitle, setJobTitle] = useState<string>("")
  const router = useRouter()

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
    if (step === 3 && !form.experience_years) {
      setForm(prev => ({ ...prev, experience_years: "No experience" }))
    }
  }, [step, form.experience_years])

  useEffect(() => {
    if (allCovers.length > 0) {
      const urls = allCovers.map(c => c.url);
      const uniqueUrls = Array.from(new Set(urls));
      const emptyUrls = urls.filter(u => !u);
      if (urls.length !== uniqueUrls.length) {
      }
      if (emptyUrls.length > 0) {
      }
    }
    if (allResumes.length > 0) {
      const urls = allResumes.map(r => r.url);
      const uniqueUrls = Array.from(new Set(urls));
      const emptyUrls = urls.filter(u => !u);
      if (urls.length !== uniqueUrls.length) {
      }
      if (emptyUrls.length > 0) {
      }
    }
  }, [
    allResumes.length,
    allCovers.length,
    form.resume,
    form.cover_letter
  ]);

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
    setSubmitting(true)
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

    const safeJobId =
      typeof jobId === "string" && jobId !== ""
        ? jobId
        : typeof jobId === "number" && !isNaN(jobId)
        ? jobId
        : "";

    await fetch("/api/students/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        resume: resumePath || "",
        cover_letter: coverLetterPath || "",
        job_id: safeJobId,
        student_id: student?.id,
        project_description: form.project_description,
        portfolio: form.portfolio,
        achievements: form.achievements,
      }),
    })
    setSubmitting(false)
    setShowSuccess(true)
    setTimeout(() => {
      if (typeof window !== "undefined" && window.scrollTo) window.scrollTo(0, 0)
    }, 0)
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
      .then((data: unknown[]) => {
        const normalized = (data as Question[]).map((q) => {
          let options: QuestionOption[] = []
          if (Array.isArray(q.options)) {
            if (q.options.length > 0 && typeof (q.options as unknown[])[0] === "string") {
              options = (q.options as unknown[]).map((val, idx) => ({
                id: `${q.id}_opt${idx}`,
                question_id: q.id,
                option_value: val as string
              }))
            } else {
              options = q.options as QuestionOption[]
            }
          } else if (typeof q.options === "string") {
            try {
              const parsed = JSON.parse(q.options as string)
              if (Array.isArray(parsed) && typeof parsed[0] === "string") {
                options = parsed.map((val: string, idx: number) => ({
                  id: `${q.id}_opt${idx}`,
                  question_id: q.id,
                  option_value: val
                }))
              } else {
                options = parsed
              }
            } catch {
              options = []
            }
          } else if (q.options && typeof q.options === "object") {
            options = Object.values(q.options)
          }
          return {
            ...q,
            options
          }
        })
        setQuestions(normalized)
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

  useEffect(() => {
  }, [jobId]);

  useEffect(() => {
    if (allCovers.length > 0) {
      const filtered = allCovers
        .filter(c => c.url && c.url.trim() !== "")
        .filter((c, idx, arr) => arr.findIndex(x => x.url === c.url) === idx);
      if (filtered.length !== allCovers.length) {
        setAllCovers(filtered);
      }
    }
    if (allResumes.length > 0) {
      const filtered = allResumes
        .filter(r => r.url && r.url.trim() !== "")
        .filter((r, idx, arr) => arr.findIndex(x => x.url === r.url) === idx);
      if (filtered.length !== allResumes.length) {
        setAllResumes(filtered);
      }
    }
  }, [allResumes, allCovers, form.resume, form.cover_letter]);

  useEffect(() => {
    if (!student?.id) return;

    fetch(`/api/students/student-profile/getHandlers?student_id=${student.id}`)
      .then(res => res.json())
      .then(data => {
        setCerts(Array.isArray(data?.certs) ? data.certs : []);
        setPortfolioItems(Array.isArray(data?.portfolio) ? data.portfolio : []);
      });

    fetch(`/api/students/student-profile/getDocuments?student_id=${student.id}`)
      .then(res => res.json())
      .then(data => {
        let resumes: { name: string; url: string }[] = [];
        if (Array.isArray(data.resumeUrls) && data.resumeUrls.length > 0) {
          resumes = data.resumeUrls.map((url: string, idx: number) => ({
            name: Array.isArray(data.uploaded_resume_url) && data.uploaded_resume_url[idx]
              ? data.uploaded_resume_url[idx].split("/").pop() || `Resume #${idx + 1}`
              : url.split("/").pop() || `Resume #${idx + 1}`,
            url,
          }));
        } else if (Array.isArray(data.uploaded_resume_url) && data.uploaded_resume_url.length > 0) {
          resumes = data.uploaded_resume_url.map((url: string, idx: number) => ({
            name: url.split("/").pop() || `Resume #${idx + 1}`,
            url,
          }));
        }

        let covers: { name: string; url: string }[] = [];
        if (Array.isArray(data.coverLetterUrls) && data.coverLetterUrls.length > 0) {
          covers = data.coverLetterUrls.map((url: string, idx: number) => ({
            name: Array.isArray(data.uploaded_cover_letter_url) && data.uploaded_cover_letter_url[idx]
              ? data.uploaded_cover_letter_url[idx].split("/").pop() || `Cover Letter #${idx + 1}`
              : url.split("/").pop() || `Cover Letter #${idx + 1}`,
            url,
          }));
        } else if (Array.isArray(data.uploaded_cover_letter_url) && data.uploaded_cover_letter_url.length > 0) {
          covers = data.uploaded_cover_letter_url.map((url: string, idx: number) => ({
            name: url.split("/").pop() || `Cover Letter #${idx + 1}`,
            url,
          }));
        }

        setAllResumes(resumes.filter(r => r.url && r.url.trim() !== ""));
        setAllCovers(covers.filter(c => c.url && c.url.trim() !== ""));
      });
  }, [student?.id]);

  useEffect(() => {
    if (!jobId) return
    fetch(`/api/students/job-listings/${jobId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setJobTitle(data.job_title || data.title || "")
        }
      })
  }, [jobId])

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
            <h3 className="font-bold text-xl">
              {showSuccess ? "Application Submitted" : "Complete Application"}
            </h3>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={onClose}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          {!showSuccess && (
            <p className="text-blue-100 text-sm">
              {jobTitle
                ? jobTitle
                : "Job Title"}
            </p>
          )}
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 72px)" }}>
          {showSuccess ? (
            <div className="flex flex-col items-center justify-center min-h-[350px]">
              <div className="w-40 h-40 mb-2">
                <Lottie animationData={mailAnim} loop={false} />
              </div>
              <h2 className="text-2xl font-bold text-blue-700 mb-2">Application Submitted!</h2>
              <p className="text-gray-600 text-sm text-center mb-6 max-w-xs">
                Wow you applied for {jobTitle} ! Your application has been successfully submitted. You can view the status of your applications at any time.
              </p>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  onClose()
                  router.push("/students/applications")
                }}
              >
                View Applications
              </Button>
              <div className="absolute left-0 top-0 w-full h-full pointer-events-none">
                <ConfettiStars />
              </div>
            </div>
          ) : loadingStudent ? (
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <TextField
                        label=""
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={form.first_name}
                        onChange={(e) => handleChange("first_name", e.target.value)}
                        sx={{ mb: 1, '& .MuiInputBase-input': { fontSize: 14 }, '& .MuiInputLabel-root': { fontSize: 14 } }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <TextField
                        label=""
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={form.last_name}
                        onChange={(e) => handleChange("last_name", e.target.value)}
                        sx={{ mb: 1, '& .MuiInputBase-input': { fontSize: 14 }, '& .MuiInputLabel-root': { fontSize: 14 } }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <TextField
                        label=""
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        sx={{ mb: 1, '& .MuiInputBase-input': { fontSize: 14 }, '& .MuiInputLabel-root': { fontSize: 14 } }}
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        {Array.isArray(student?.contact_info?.phone) && student.contact_info.phone.length > 1 ? (
                          <>
                            <TextField
                              label="Country Code"
                              variant="outlined"
                              size="small"
                              value={`+${student.contact_info.phone[0]}`}
                              disabled
                              sx={{ width: 80 }}
                            />
                            <TextField
                              label=""
                              variant="outlined"
                              size="small"
                              value={student.contact_info.phone[1]}
                              onChange={(e) => {
                                const newPhone = e.target.value
                                setForm((prev) => ({
                                  ...prev,
                                  phone: `+${student.contact_info!.phone![0]} ${newPhone}`
                                }))
                              }}
                              fullWidth
                            />
                          </>
                        ) : (
                          <TextField
                            label=""
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={form.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            sx={{ '& .MuiInputBase-input': { fontSize: 14 }, '& .MuiInputLabel-root': { fontSize: 14 } }}
                          />
                        )}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address <span className="text-red-500">*</span>
                      </label>
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Resume <span className="text-red-500">*</span>
                          </label>
                          {(existingResume || form.resume) && !allResumes.some(r => r.url === form.resume) ? (
                            <>
                              <div className="flex items-center gap-3">
                                <Image
                                  src={
                                    (existingResume?.name?.toLowerCase().endsWith('.pdf') ||
                                     existingResume?.url?.toLowerCase().endsWith('.pdf') ||
                                     form.resume?.toLowerCase().endsWith('.pdf'))
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cover Letter (Optional)
                        </label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select Existing Resume <span className="text-red-500">*</span>
                        </label>
                        {allResumes.length === 0 ? (
                          <div className="text-xs text-gray-500">No resumes found.</div>
                        ) : (
                          <div className="space-y-2">
                            {allResumes.map((resume, idx) => (
                              <div key={idx} className="flex items-center gap-3 border rounded p-2">
                                <input
                                  type="radio"
                                  name="resume-select"
                                  checked={String(form.resume) === String(resume.url)}
                                  onChange={() => setForm(prev => ({ ...prev, resume: String(resume.url) }))
                                  }
                                  value={resume.url}
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
                                {String(form.resume) === String(resume.url) && (
                                  <span className="ml-2 text-green-600 text-xs font-semibold">Selected</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select Existing Cover Letter (Optional)
                        </label>
                        {allCovers.length === 0 ? (
                          <div className="text-xs text-gray-500">No cover letters found.</div>
                        ) : (
                          <div className="space-y-2">
                            {allCovers.map((cover, idx) => (
                              <div key={idx} className="flex items-center gap-3 border rounded p-2">
                                <input
                                  type="radio"
                                  name="cover-select"
                                  checked={String(form.cover_letter) === String(cover.url)}
                                  onChange={() => setForm(prev => ({ ...prev, cover_letter: String(cover.url) }))
                                  }
                                  value={cover.url}
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
                                {String(form.cover_letter) === String(cover.url) && (
                                  <span className="ml-2 text-green-600 text-xs font-semibold">Selected</span>
                                )}
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
                  <h4 className="font-medium text-lg text-blue-700">Experience & Achievements</h4>
                  <div>
                    <FormControl fullWidth size="small" sx={{ mb: 2, '& .MuiInputBase-input': { fontSize: 14 }, '& .MuiInputLabel-root': { fontSize: 14 } }}>
                      <InputLabel id="experience-label" sx={{ fontSize: 14 }}>How many years of experience do you have in this field?</InputLabel>
                      <Select
                        labelId="experience-label"
                        label="How many years of experience do you have in this field?"
                        value={form.experience_years}
                        onChange={e => handleChange("experience_years", e.target.value)}
                        sx={{ fontSize: 14 }}
                      >
                        <MenuItem value="" disabled sx={{ fontSize: 14 }}>Select...</MenuItem>
                        <MenuItem value="No experience" sx={{ fontSize: 14 }}>No experience</MenuItem>
                        <MenuItem value="Less than 1 year" sx={{ fontSize: 14 }}>Less than 1 year</MenuItem>
                        <MenuItem value="1-2 years" sx={{ fontSize: 14 }}>1-2 years</MenuItem>
                        <MenuItem value="3-5 years" sx={{ fontSize: 14 }}>3-5 years</MenuItem>
                        <MenuItem value="5+ years" sx={{ fontSize: 14 }}>5+ years</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <TextField
                      label="Describe a project you're most proud of (optional)"
                      variant="outlined"
                      size="small"
                      fullWidth
                      multiline
                      minRows={4}
                      value={form.project_description || ""}
                      onChange={_ => handleChange("project_description", _.target.value)}
                      sx={{ mb: 2, '& .MuiInputBase-input': { fontSize: 14 }, '& .MuiInputLabel-root': { fontSize: 14 } }}
                    />
                  </div>
                  <div>
                    <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                      <InputLabel id="achievements-label" sx={{ fontSize: 14 }}>
                        Choose achievements (optional)
                      </InputLabel>
                      <Select
                        labelId="achievements-label"
                        label="Choose achievements (optional)"
                        multiple
                        value={form.achievements}
                        onChange={e => {
                          const val = e.target.value as string[];
                          setForm(prev => ({ ...prev, achievements: val }));
                        }}
                        input={<OutlinedInput label="Choose achievements (optional)" sx={{ fontSize: 14 }} />}
                        renderValue={(selected) => (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                            {(selected as string[]).map((value) => (
                              <Chip key={value} label={value} size="small" sx={{ fontSize: 13, height: 22 }} />
                            ))}
                          </div>
                        )}
                        sx={{ fontSize: 14 }}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 180,
                              overflowY: 'auto'
                            }
                          }
                        }}
                      >
                        {certs.length > 0 && (
                          <ListSubheader sx={{ fontSize: 13, color: "#666" }}>Achievements</ListSubheader>
                        )}
                        {certs
                          .filter(cert =>
                            cert.title || cert.name || cert.certificate_title || cert.issuer || cert.signedUrl
                          )
                          .map((cert, idx) => {
                            const display =
                              cert.title ||
                              cert.name ||
                              cert.certificate_title ||
                              cert.issuer ||
                              cert.signedUrl ||
                              `Certificate #${idx + 1}`;
                            return (
                              <MenuItem key={`cert-${idx}`} value={String(display)} sx={{ fontSize: 14 }}>
                                <Checkbox
                                  checked={form.achievements.indexOf(String(display)) > -1}
                                  color="primary"
                                  style={{ padding: 0, marginRight: 8 }}
                                />
                                <span style={{ fontSize: 14 }}>
                                  {String(display)}
                                  {cert.signedUrl && (
                                    <a
                                      href={cert.signedUrl as string}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ marginLeft: 8, fontSize: 12, color: "#2563eb" }}
                                      onClick={e => e.stopPropagation()}
                                    >
                                      View
                                    </a>
                                  )}
                                </span>
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                      <InputLabel id="portfolio-label" sx={{ fontSize: 14 }}>
                        Choose portfolio pieces (optional)
                      </InputLabel>
                      <Select
                        labelId="portfolio-label"
                        label="Choose portfolio pieces (optional)"
                        multiple
                        value={form.portfolio}
                        onChange={e => {
                          const val = e.target.value as string[];
                          setForm(prev => ({ ...prev, portfolio: val, portfolio_custom: "" }))
                        }}
                        input={<OutlinedInput label="Choose portfolio pieces (optional)" sx={{ fontSize: 14 }} />}
                        renderValue={(selected) => (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                            {(selected as string[]).map((value) => (
                              <Chip key={value} label={value} size="small" sx={{ fontSize: 13, height: 22 }} />
                            ))}
                          </div>
                        )}
                        sx={{ fontSize: 14 }}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 180,
                              overflowY: 'auto'
                            }
                          }
                        }}
                      >
                        {portfolioItems.length > 0 && (
                          <ListSubheader sx={{ fontSize: 13, color: "#666" }}>Portfolio</ListSubheader>
                        )}
                        {portfolioItems
                          .filter(item => !!(item.title || item.name || item.url))
                          .map((item, idx) => {
                            const display = item.title || item.name || item.url || `Portfolio #${idx + 1}`;
                            return (
                              <MenuItem key={`portfolio-${idx}`} value={String(display)} sx={{ fontSize: 14 }}>
                                <Checkbox
                                  checked={form.portfolio.indexOf(String(display)) > -1}
                                  color="primary"
                                  style={{ padding: 0, marginRight: 8 }}
                                />
                                <span style={{ fontSize: 14 }}>{String(display)}</span>
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-lg text-blue-700">Additional Questions</h4>
                  <div className="space-y-4 border rounded-lg p-4 bg-blue-50 relative">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-blue-700 font-medium flex items-center gap-2">
                        Company Questions
                      </p>
                      {questions.length > 0 && (
                        <span className="inline-block bg-blue-600 text-white text-xs font-semibold rounded-full px-2 py-0.5">
                          {`${Math.min((questionPage - 1) * QUESTIONS_PER_PAGE + 1, questions.length)}-${Math.min(questionPage * QUESTIONS_PER_PAGE, questions.length)} / ${questions.length}`}
                        </span>
                      )}
                    </div>
                    {loadingQuestions ? (
                      <div className="text-sm text-gray-500">Loading questions...</div>
                    ) : (
                      <div className="space-y-3">
                        {questions.length === 0 && (
                          <div className="text-sm text-gray-500">No additional questions.</div>
                        )}
                        {questions
                          .slice((questionPage - 1) * QUESTIONS_PER_PAGE, questionPage * QUESTIONS_PER_PAGE)
                          .map((q, idx) => (
                          <div key={q.id}>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                              <span className="inline-block bg-white text-blue-700 text-xs font-semibold rounded-full px-2 py-0.5">
                                {((questionPage - 1) * QUESTIONS_PER_PAGE) + idx + 1}
                              </span>
                              {q.question}
                            </label>
                            {q.type === "text" && (
                              <TextField
                                variant="outlined"
                                size="small"
                                fullWidth
                                multiline
                                minRows={3}
                                placeholder="Your answer..."
                                value={typeof form.application_answers[q.id] === "string" ? form.application_answers[q.id] as string : ""}
                                onChange={e => handleQuestionAnswer(q.id, e.target.value)}
                                sx={{
                                  backgroundColor: "#fff",
                                  '& .MuiInputBase-input': { fontSize: 14, backgroundColor: "#fff" },
                                  '& .MuiInputLabel-root': { fontSize: 14, backgroundColor: "#fff" }
                                }}
                              />
                            )}
                            {q.type === "single" && (
                              <FormControl fullWidth size="small" sx={{ mt: 1, backgroundColor: "#fff", '& .MuiInputBase-input': { fontSize: 14, backgroundColor: "#fff" }, '& .MuiInputLabel-root': { fontSize: 14, backgroundColor: "#fff" } }}>
                                <Select
                                  value={typeof form.application_answers[q.id] === "string" ? form.application_answers[q.id] as string : ""}
                                  onChange={e => handleQuestionAnswer(q.id, e.target.value as string)}
                                  displayEmpty
                                  sx={{ fontSize: 14, backgroundColor: "#fff" }}
                                >
                                  <MenuItem value="" disabled>Select...</MenuItem>
                                  {q.options?.map((opt) => (
                                    <MenuItem key={opt.id} value={opt.option_value} sx={{ fontSize: 14 }}>
                                      {opt.option_value}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            )}
                            {q.type === "multi" && (
                              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-1" style={{ background: "#fff", borderRadius: 6 }}>
                                {q.options?.map((opt) => (
                                  <label key={opt.id} className="flex items-center gap-2 bg-transparent">
                                    <Checkbox
                                      checked={Array.isArray(form.application_answers[q.id]) && (form.application_answers[q.id] as string[]).includes(opt.option_value)}
                                      onCheckedChange={v => {
                                        const prev = Array.isArray(form.application_answers[q.id]) ? form.application_answers[q.id] as string[] : []
                                        if (v) {
                                          handleQuestionAnswer(q.id, [...prev, opt.option_value])
                                        } else {
                                          handleQuestionAnswer(q.id, prev.filter((val: string) => val !== opt.option_value))
                                        }
                                      }}
                                      color="primary"
                                    />
                                    <span className="text-sm">{opt.option_value}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                        <div className="flex justify-between pt-2">
                          <div>
                            {questionPage > 1 && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 hover:bg-blue-50"
                                onClick={() => setQuestionPage(p => Math.max(1, p - 1))}
                                disabled={questionPage === 1}
                              >
                                Previous
                              </Button>
                            )}
                          </div>
                          <div>
                            {questionPage < Math.ceil(questions.length / QUESTIONS_PER_PAGE) && questions.length > 0 && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 hover:bg-blue-50"
                                onClick={() => setQuestionPage(p => Math.min(Math.ceil(questions.length / QUESTIONS_PER_PAGE), p + 1))}
                              >
                                Next
                              </Button>
                            )}
                          </div>
                        </div>
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
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleNext}
                    disabled={
                      (step === 1 &&
                        (
                          !form.first_name.trim() ||
                          !form.last_name.trim() ||
                          !form.email.trim() ||
                          !form.phone.trim() ||
                          !form.address.trim()
                        )
                      ) ||
                      (step === 2 &&
                        (
                          !form.resume.trim()
                        )
                      )
                    }
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleSubmit}
                    disabled={
                      submitting ||
                      questions.some(q => {
                        if (q.type === "multi") {
                          return !Array.isArray(form.application_answers[q.id]) || (form.application_answers[q.id] as string[]).length === 0
                        }
                        return (
                          form.application_answers[q.id] === undefined ||
                          form.application_answers[q.id] === null ||
                          (typeof form.application_answers[q.id] === "string" && !(form.application_answers[q.id] as string).trim())
                        )
                      }) ||
                      !form.terms_accepted
                    }
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                        Submitting...
                      </span>
                    ) : (
                      "Submit Application"
                    )}
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
