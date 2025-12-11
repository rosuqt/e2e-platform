/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { X, FileText, Upload, CheckCircle } from "lucide-react"
import Switch from "@mui/material/Switch"
import { Tooltip } from "@mui/material"
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
import jsPDF from "jspdf"

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
  address?: string[]
}

type ApplicationForm = {
  first_name: string
  last_name: string
  email: string
  phone: string
  country: string
  city: string
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
import { TbFileLike } from "react-icons/tb"

export function ApplicationModal({
  onClose,
  jobId,
  jobTitle,
  gpt_score
}: {
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  gpt_score: number;
}) {
  console.log("ApplicationModal initialized for jobId:", jobId)

  const [step, setStep] = useState(1)
  const totalSteps = 4

  const [student, setStudent] = useState<StudentDetails | null>(null)
  const [form, setForm] = useState<ApplicationForm>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
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
  const router = useRouter()

  const [countries, setCountries] = useState<{ code: string; name: string }[]>([])
  const [cities, setCities] = useState<{ id: string; name: string }[]>([])
  const [cityInput, setCityInput] = useState("")
  const [loadingCountries, setLoadingCountries] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)
  const cityFieldRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState("upload")
  const [resumeSource, setResumeSource] = useState<"upload" | "select" | null>(null)
  const [coverSource, setCoverSource] = useState<"upload" | "select" | null>(null)
  const [writingCover, setWritingCover] = useState(false)
  const [coverText, setCoverText] = useState("")
  const [rememberDetails, setRememberDetails] = useState(false)
  const [saveAddress, setSaveAddress] = useState(false)
  const [savePhone, setSavePhone] = useState(false)

  useEffect(() => {
    setLoadingStudent(true)
    fetch("/api/students/get-student-details")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: StudentDetails & { address?: string[] | string, country?: string, city?: string }) => {
        let addressArr: string[] = []
        if (Array.isArray(data?.address)) {
          addressArr = data.address
        } else if (typeof data?.address === "string") {
          try {
            addressArr = JSON.parse(data.address)
          } catch {
            addressArr = []
          }
        }
        const countryMap: Record<string, string> = {
          "Philippines": "PH",
          "United States": "US",
          "Canada": "CA",
          "Australia": "AU",
          "United Kingdom": "GB",
          "Germany": "DE",
          "France": "FR",
          "Japan": "JP",
          "China": "CN",
          "India": "IN",
          "Singapore": "SG",
          "South Korea": "KR",
          "Italy": "IT",
          "Spain": "ES",
          "Brazil": "BR",
          "Mexico": "MX",
          "Russia": "RU",
          "Netherlands": "NL",
          "Sweden": "SE",
          "Norway": "NO",
          "Denmark": "DK",
          "Finland": "FI",
          "Switzerland": "CH",
          "New Zealand": "NZ",
          "South Africa": "ZA",
          "Ireland": "IE",
          "Belgium": "BE",
          "Austria": "AT",
          "Turkey": "TR",
          "Indonesia": "ID",
          "Malaysia": "MY",
          "Thailand": "TH",
          "Vietnam": "VN",
          "Saudi Arabia": "SA",
          "United Arab Emirates": "AE",
          "Pakistan": "PK",
          "Bangladesh": "BD",
          "Egypt": "EG",
          "Argentina": "AR",
          "Chile": "CL",
          "Colombia": "CO",
          "Poland": "PL",
          "Portugal": "PT",
          "Greece": "GR",
          "Czech Republic": "CZ",
          "Hungary": "HU",
          "Romania": "RO",
          "Israel": "IL",
          "Ukraine": "UA"
        }
        let countryValue = ""
        if (typeof data.country === "string" && data.country) {
          countryValue = data.country
        } else if (addressArr[0]) {
          countryValue = countryMap[addressArr[0]] || addressArr[0]
        }
        let cityValue = ""
        if (typeof data.city === "string" && data.city) {
          cityValue = data.city
        } else if (addressArr[1]) {
          cityValue = addressArr[1]
        }
        if (data) {
          setStudent(data)
          let formattedPhone = ""
          if (Array.isArray(data.contact_info?.phone)) {
            if (data.contact_info.phone.length > 1) {
              formattedPhone = `+${data.contact_info.phone[0]} ${data.contact_info.phone[1]}`
            } else if (data.contact_info.phone.length === 1) {
              formattedPhone = `+${data.contact_info.phone[0]}`
            }
          } else if (typeof data.contact_info?.phone === "string" && data.contact_info.phone) {
            formattedPhone = data.contact_info.phone
          } else {
            formattedPhone = "+63 "
          }
          setForm((prev: ApplicationForm) => ({
            ...prev,
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            email: data.email || (Array.isArray(data.contact_info?.email) ? data.contact_info.email[0] ?? "" : ""),
            phone: formattedPhone,
            country: countryValue,
            city: cityValue,
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
          formattedPhone = `+${student.contact_info.phone[0]}`
        }
      } else if (typeof student.contact_info?.phone === "string" && student.contact_info.phone) {
        formattedPhone = student.contact_info.phone
      } else {
        formattedPhone = "+63 "
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
    setSubmitting(true);
    let resumePath = "";
    let coverLetterPath = "";
    if (existingResume?.name) {
      resumePath = student?.id + "/" + existingResume.name;
    } else if (form.resume) {
      try {
        const urlObj = new URL(form.resume);
        resumePath = urlObj.pathname.startsWith("/") ? urlObj.pathname.slice(1) : urlObj.pathname;
      } catch {
        resumePath = form.resume;
      }
    }
    if (existingCover?.name) {
      coverLetterPath = student?.id + "/" + existingCover.name;
    } else if (form.cover_letter) {
      try {
        const urlObj = new URL(form.cover_letter);
        coverLetterPath = urlObj.pathname.startsWith("/") ? urlObj.pathname.slice(1) : urlObj.pathname;
      } catch {
        coverLetterPath = form.cover_letter;
      }
    }

    await fetch("/api/students/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        resume: resumePath || "",
        cover_letter: coverLetterPath || "",
        student_id: student?.id,
        job_id: jobId,
        project_description: form.project_description,
        portfolio: form.portfolio,
        achievements: form.achievements,
        rememberDetails,
        saveAddress,
      }),
    });
    if (saveAddress && student?.id && form.country && form.city) {
      await fetch("/api/students/update-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: student.id,
          address: [form.country, form.city],
        }),
      });
    }
    if (savePhone && student?.id && form.phone) {
      await fetch("/api/students/update-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: student.id,
          phone: form.phone,
        }),
      });
    }
    setSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => {
      if (typeof window !== "undefined" && window.scrollTo) window.scrollTo(0, 0);
    }, 0);
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
    if (!student) return
    setLoadingQuestions(true)
    fetch(`/api/employers/application-questions?job_id=${student.id}`)
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
  }, [student])

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
  }, [student]);

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
        setPortfolioItems(Array.isArray(data?.portfolio) ? data.portfolio : []);
        console.log("Portfolio items:", data?.portfolio);
      });
  }, [student?.id]);

  useEffect(() => {
    setLoadingCountries(true)
    fetch("/api/students/apply/countries-api")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        const arr = Array.isArray(data?.data) ? data.data : [];
        setCountries(arr.map((c: any) => ({
          code: c.code,
          name: c.name
        })));
        setLoadingCountries(false);
      })
      .catch(() => setLoadingCountries(false))
  }, [])

  useEffect(() => {
    if (!form.country || !cityInput) {
      setCities([])
      return
    }
    setLoadingCities(true)
    fetch(`/api/students/apply/cities-api?country=${form.country}&prefix=${cityInput}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data.data)) {
          setCities(data.data.map((c: any) => ({
            id: c.id,
            name: c.name
          })))
        }
        setLoadingCities(false)
      })
      .catch(() => setLoadingCities(false))
  }, [form.country, cityInput])

  const getSignedUrlAndOpen = async (bucket: string, path: string) => {
    if (!bucket || !path) return
    const res = await fetch("/api/students/get-signed-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bucket, path }),
    })
    const data = await res.json()
    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ width: "100vw", height: "100vh", top: 0, margin: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col relative z-[61]"
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
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-600"
                  onClick={onClose}
                >
                  Close
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    onClose()
                    router.push("/students/jobs/applications")
                  }}
                >
                  View Applications
                </Button>
              </div>
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
                  {gpt_score >= 60 && (
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
                  )}
                  {gpt_score >= 25 && gpt_score < 60 && (
                    <div className="rounded-lg border p-4 bg-orange-50">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-orange-700">Your profile is a partial match.</p>
                          <p className="text-xs text-orange-600 mt-1">
                            You meet some of the requirements for this position. Consider highlighting relevant skills and experience in your application.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {gpt_score < 25 && (
                    <div className="rounded-lg border p-4 bg-red-50">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-red-700">Your profile is not a strong match.</p>
                          <p className="text-xs text-red-600 mt-1">
                            You do not meet most requirements for this position. You can still apply, but consider updating your profile or gaining more relevant experience.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
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
                        {true ? (
                          <>
                            <TextField
                              label="Country Code"
                              variant="outlined"
                              size="small"
                              value={form.phone.startsWith("+") ? form.phone.split(" ")[0] : "+63"}
                              onChange={e => {
                                const code = e.target.value.replace(/[^+\d]/g, "")
                                const rest = form.phone.replace(/^(\+\d+\s*)/, "")
                                setForm(prev => ({
                                  ...prev,
                                  phone: `${code} ${rest}`
                                }))
                              }}
                              sx={{ width: 80 }}
                            />
                            <TextField
                              label=""
                              variant="outlined"
                              size="small"
                              value={form.phone.replace(/^(\+\d+\s*)/, "")}
                              onChange={e => {
                                const newPhone = e.target.value.replace(/[^\d]/g, "")
                                const code = form.phone.startsWith("+") ? form.phone.split(" ")[0] : "+63"
                                setForm(prev => ({
                                  ...prev,
                                  phone: `${code} ${newPhone}`
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
                      <div className="flex items-center mt-2">
                        <Switch
                          checked={savePhone}
                          onChange={(_, checked) => setSavePhone(checked)}
                          size="small"
                          color="primary"
                        />
                        <span className="ml-2 text-xs">Save for next time</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                        <Select
                          label="Country"
                          value={form.country}
                          onChange={e => {
                            handleChange("country", e.target.value)
                            handleChange("city", "")
                            setCityInput("")
                          }}
                          fullWidth
                          size="small"
                          disabled={loadingCountries}
                          sx={{ fontSize: 14 }}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 600,
                                overflowY: 'auto',
                              },
                            },
                            anchorOrigin: {
                              vertical: "bottom",
                              horizontal: "left"
                            },
                            transformOrigin: {
                              vertical: "top",
                              horizontal: "left"
                            }
                          }}
                        >
                          <MenuItem value="" disabled>Select country...</MenuItem>
                          {countries.map(c => (
                            <MenuItem key={c.code} value={c.code}>{c.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <div ref={cityFieldRef}>
                        <TextField
                          placeholder="Start typing to search city"
                          variant="outlined"
                          size="small"
                          fullWidth
                          value={form.city}
                          onChange={e => {
                            handleChange("city", e.target.value)
                            setCityInput(e.target.value)
                          }}
                          sx={{ mb: 1, fontSize: 14 }}
                          disabled={!form.country}
                          autoComplete="off"
                        />
                        {form.country && cityInput && (
                          <div
                            className="border rounded bg-white shadow mt-1 max-h-40 overflow-y-auto z-10 absolute"
                            style={{
                              width: cityFieldRef.current
                                ? `${cityFieldRef.current.offsetWidth}px`
                                : "100%"
                            }}
                          >
                            {loadingCities ? (
                              <div className="p-2 text-xs text-gray-500">Loading cities...</div>
                            ) : (
                              cities.map(city => (
                                <div
                                  key={city.id}
                                  className="p-2 text-sm cursor-pointer hover:bg-blue-50"
                                  onClick={() => {
                                    handleChange("city", city.name)
                                    setCityInput("")
                                  }}
                                >
                                  {city.name}
                                </div>
                              ))
                            )}
                            {(!loadingCities && cities.length === 0 && cityInput) && (
                              <div className="p-2 text-xs text-gray-500">No cities found.</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <Switch
                      checked={saveAddress}
                      onChange={(_, checked) => setSaveAddress(checked)}
                      size="small"
                      color="primary"
                    />
                    <span className="ml-2 text-xs">Save for next time</span>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-lg text-blue-700">Resume & Cover Letter</h4>
                  {(form.resume || form.cover_letter) && (
                    <div className="mb-2 flex gap-4 items-center">
                      {form.resume && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          Resume selected
                        </span>
                      )}
                      {form.cover_letter && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          Cover letter selected
                        </span>
                      )}
                    </div>
                  )}
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upload">
                        Upload Documents
                        {(
                          (form.resume && !allResumes.some(r => r.url === form.resume)) ||
                          (form.cover_letter && !allCovers.some(c => c.url === form.cover_letter))
                        ) && (
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            Data selected
                          </span>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="select">
                        Select Existing
                        {(
                          (form.resume && allResumes.some(r => r.url === form.resume)) ||
                          (form.cover_letter && allCovers.some(c => c.url === form.cover_letter))
                        ) && (
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            Data selected
                          </span>
                        )}
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload" className="space-y-4 pt-4">
                      <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Resume <span className="text-red-500">*</span>
                          </label>
                          {(form.resume && resumeSource === "select") && (
                            <div className="mb-2 text-xs text-red-600 font-semibold">
                              You&apos;ve already selected a resume. Uploading a new one will override the selected resume.
                            </div>
                          )}
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
                                <Button
                                  type="button"
                                  className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium"
                                  onClick={() => getSignedUrlAndOpen("student.documents", existingResume?.name ? (student?.id + "/" + existingResume.name) : form.resume)}
                                >
                                  View
                                </Button>
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
                                    setResumeSource("upload")
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
                                    setResumeSource("upload")
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
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cover Letter (Optional)
                        </label>
                        <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 text-center flex flex-col items-center justify-center">
                          {(form.cover_letter && coverSource === "select") && (
                            <div className="mb-2 text-xs text-red-600 font-semibold">
                              You&apos;ve already selected a cover letter. Uploading a new one will override the selected cover letter.
                            </div>
                          )}
                          {!writingCover ? (
                            <>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,.txt"
                                className="hidden"
                                ref={coverInputRef}
                                onChange={async (e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    await handleFileUpload(e.target.files[0], "cover_letter")
                                    setCoverSource("upload")
                                  }
                                }}
                              />
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={uploadingCover}
                                  onClick={() => coverInputRef.current?.click()}
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  {uploadingCover ? "Uploading..." : "Upload Cover Letter"}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setWritingCover(true)}
                                >
                                  Write your cover letter
                                </Button>
                              </div>
                              {form.cover_letter && (
                                <div className="mt-3 flex items-center gap-2">
                                  <TbFileLike  className="w-4 h-4 text-green-600" />
                                  <span className="text-green-700 text-xs font-semibold">
                                    Cover letter written successfully!
                                  </span>
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="text-blue-600 underline"
                                    onClick={() => {
                                      if (form.cover_letter) getSignedUrlAndOpen("student.documents", form.cover_letter)
                                    }}
                                  >
                                    View
                                  </Button>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="w-full flex flex-col items-center">
                              <textarea
                                className="border border-blue-500 rounded p-2 w-full mb-2"
                                rows={8}
                                value={coverText}
                                onChange={e => setCoverText(e.target.value)}
                                placeholder="Write your cover letter here..."
                                style={{ fontSize: 14 }}
                              />
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setWritingCover(false)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                  size="sm"
                                  disabled={!coverText.trim() || uploadingCover}
                                  onClick={async () => {
                                    const doc = new jsPDF()
                                    doc.setFontSize(12)
                                    const lines = doc.splitTextToSize(coverText, 180)
                                    doc.text(lines, 10, 20)
                                    const pdfBlob = doc.output("blob")
                                    const file = new File([pdfBlob], "cover_letter.pdf", { type: "application/pdf" })
                                    await handleFileUpload(file, "cover_letter")
                                    setCoverSource("upload")
                                    setWritingCover(false)
                                    setCoverText("")
                                  }}
                                >
                                  Save & Upload
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="select" className="space-y-4 pt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select Existing Resume <span className="text-red-500">*</span>
                        </label>
                        {(form.resume && resumeSource === "upload") && (
                          <div className="mb-2 text-xs text-red-600 font-semibold">
                            You&apos;ve already uploaded a resume. Selecting a new one will override the uploaded resume.
                          </div>
                        )}
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
                                  onChange={() => {
                                    setForm(prev => ({ ...prev, resume: String(resume.url) }))
                                    setResumeSource("select")
                                  }}
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
                                <Button
                                  type="button"
                                  className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium"
                                  onClick={() => getSignedUrlAndOpen("student.documents", resume.name ? (student?.id + "/" + resume.name) : resume.url)}
                                >
                                  View
                                </Button>
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
                        {(form.cover_letter && coverSource === "upload") && (
                          <div className="mb-2 text-xs text-red-600 font-semibold">
                            You&apos;ve already uploaded a cover letter. Selecting a new one will override the uploaded cover letter.
                          </div>
                        )}
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
                                  onChange={() => {
                                    setForm(prev => ({ ...prev, cover_letter: String(cover.url) }))
                                    setCoverSource("select")
                                  }}
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
                                <Button
                                  type="button"
                                  className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium"
                                  onClick={() => getSignedUrlAndOpen("student.documents", cover.name ? (student?.id + "/" + cover.name) : cover.url)}
                                >
                                  View
                                </Button>
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
                    <div className="mb-2">
                      <span className="block font-semibold text-blue-700 text-base">Achievements</span>
                      <span className="block text-sm text-gray-600">
                        Select achievements to show off to the recruiter.
                      </span>
                    </div>
                    {certs.length === 0 && (
                      <div className="text-xs text-gray-500 mb-2">
                        You haven&apos;t set up any achievements yet, set it in your profile!
                      </div>
                    )}
                    <FormControl fullWidth size="small" sx={{ mt: 0 }}>
                      <Select
                        multiple
                        value={form.achievements}
                        onChange={e => {
                          const val = e.target.value as string[];
                          setForm(prev => ({ ...prev, achievements: val }));
                        }}
                        input={
                          <OutlinedInput
                            sx={{ fontSize: 14 }}
                            placeholder="Choose achievements (optional)"
                          />
                        }
                        renderValue={(selected) => (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                            {(selected as string[]).map((value) => {
                              const cert = certs.find(c => c.attachmentUrl === value);
                              return (
                                <Chip
                                  key={value}
                                  label={cert && typeof cert.title === "string" && cert.title.trim() !== "" ? cert.title : "Achievement"}
                                  size="small"
                                  sx={{ fontSize: 13, height: 22 }}
                                />
                              );
                            })}
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
                          .filter(cert => cert.attachmentUrl && typeof cert.attachmentUrl === "string" && cert.attachmentUrl.trim() !== "")
                          .map((cert, idx) => {
                            const display = cert.title || cert.attachmentUrl || `Certificate #${idx + 1}`;
                            const value = cert.attachmentUrl as string;
                            return (
                              <MenuItem key={`cert-${idx}`} value={value} sx={{ fontSize: 14 }}>
                                <Checkbox
                                  checked={form.achievements.indexOf(value) > -1}
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
                  <div>
                    <div className="mb-2">
                      <span className="block font-semibold text-blue-700 text-base">Portfolio</span>
                      <span className="block text-sm text-gray-600">
                        Select portfolio pieces to show off to the recruiter.
                      </span>
                    </div>
                    {portfolioItems.length === 0 && (
                      <div className="text-xs text-gray-500 mb-2">
                        You haven&apos;t set up any portfolio yet, set it in your profile!
                      </div>
                    )}
                    <FormControl fullWidth size="small" sx={{ mt: 0 }}>
                      <Select
                        multiple
                        value={form.portfolio}
                        onChange={e => {
                          const val = e.target.value as string[];
                          setForm(prev => ({ ...prev, portfolio: val, portfolio_custom: "" }))
                        }}
                        input={
                          <OutlinedInput
                            sx={{ fontSize: 14 }}
                            placeholder="Choose portfolio pieces (optional)"
                          />
                        }
                        renderValue={(selected) => (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                            {(selected as string[]).map((value) => {
                              const item = portfolioItems.find(i => i.attachmentUrl === value);
                              return (
                                <Chip
                                  key={value}
                                  label={
                                    (item && typeof item.title === "string" && item.title.trim() !== "")
                                      ? item.title
                                      : (item && typeof item.name === "string" && item.name.trim() !== "")
                                        ? item.name
                                        : "Portfolio"
                                  }
                                  size="small"
                                  sx={{ fontSize: 13, height: 22 }}
                                />
                              );
                            })}
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
                          .filter(item => typeof item.attachmentUrl === "string" && item.attachmentUrl.trim() !== "")
                          .map((item, idx) => {
                            const display = item.title || item.name || item.attachmentUrl || `Portfolio #${idx + 1}`;
                            const value = item.attachmentUrl as string;
                            return (
                              <MenuItem key={`portfolio-${idx}`} value={value} sx={{ fontSize: 14 }}>
                                <Checkbox
                                  checked={form.portfolio.indexOf(value) > -1}
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
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="remember-details"
                        checked={rememberDetails}
                        onCheckedChange={v => setRememberDetails(v === true)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="remember-details"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Remember these details for quick apply
                        </label>
                         <p className="text-xs text-muted-foreground">
                          Your details will be used to fill future applications automatically when using Quick Apply.
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
                          !form.phone.trim()
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
                    className="bg-blue-600 hover:bg-blue-700"
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

