"use client"

import React from "react"
import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { X, MapPin, Building, Clock, PiggyBank, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Toaster, toast } from "react-hot-toast"

type JobModalProps = {
  job: {
    raw: { id: string }
    id: number
    title: string
    department: string
    location: string
    type: string
    salary: string
    posted: string
    description: string
    responsibilities: string[]
    requirements: string[]
    benefits: string[]
  }
  isOpen: boolean
  onClose: () => void
}

type FormData = {
  firstName: string
  lastName: string
  middleName: string
  suffix: string
  email: string
  countryCode: string
  phone: string
  resume: File | null
  coverLetter: File | null
}

type FormErrors = {
  [K in keyof FormData]?: string
}

const suffixes = [
  "",
  "Jr.",
  "Sr.",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "MD",
  "PhD",
  "Esq."
]

export default function JobModal({ job, isOpen, onClose }: JobModalProps) {
  const [activeTab, setActiveTab] = useState<"details" | "apply">("details")
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    middleName: "",
    suffix: "",
    email: "",
    countryCode: "63", // always PH
    phone: "",
    resume: null,
    coverLetter: null,
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoadingCareers, setIsLoadingCareers] = useState(false)
  const [alreadyApplied, setAlreadyApplied] = useState(false)

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab("details")
      setFormData({
        firstName: "",
        lastName: "",
        middleName: "",
        suffix: "",
        email: "",
        countryCode: "63", 
        phone: "",
        resume: null,
        coverLetter: null,
      })
      setFormErrors({})
      setIsSubmitting(false)
      setIsSubmitted(false)
      setIsLoadingCareers(true)
      setAlreadyApplied(false)
      if (typeof window !== "undefined") {
        setTimeout(() => setIsLoadingCareers(false), 1000)
        const appliedJobs = JSON.parse(sessionStorage.getItem("appliedJobs") || "[]")
        if (appliedJobs.includes(job.raw?.id)) setAlreadyApplied(true)
      } else {
        setIsLoadingCareers(false)
      }
    }
  }, [isOpen, job?.raw?.id])

  const validate = (data: FormData): FormErrors => {
    const errors: FormErrors = {}
    if (!data.firstName.trim()) {
      errors.firstName = "First Name is required."
    } else {
      // Allow Ma. prefix, letters (including ñ), spaces, hyphens, apostrophes
      // 2-50 characters, no digits, no special symbols except allowed
      const firstName = data.firstName.trim()
      const allowed =
        /^((Ma\.\s?)?)([A-Za-zñÑ]+([ '-][A-Za-zñÑ]+)*|'[A-Za-zñÑ]+)*$/u
      if (firstName.length < 2 || firstName.length > 50) {
        errors.firstName = "First Name must be 2-50 characters."
      } else if (!allowed.test(firstName)) {
        errors.firstName =
          "Only letters, spaces, hyphens, apostrophes, and 'Ma.' prefix allowed. No digits or special symbols."
      } else if (/[0-9]/.test(firstName)) {
        errors.firstName = "No digits allowed."
      }
    }

    // Middle Name validation
    if (data.middleName) {
      const middleName = data.middleName.trim()
      const allowed = /^([A-Za-zñÑ]+([ -][A-Za-zñÑ]+)*)$/u
      if (middleName.length < 1 || middleName.length > 50) {
        errors.middleName = "Middle Name must be 1-50 characters."
      } else if (!allowed.test(middleName)) {
        errors.middleName = "Only letters, hyphens, and spaces allowed. No digits or special symbols."
      }
    }

    // Last Name validation
    if (!data.lastName.trim()) {
      errors.lastName = "Last Name is required."
    } else {
      // Allow letters (including ñ), spaces, hyphens, apostrophes
      // 2-50 characters, no digits, no special symbols except allowed
      const lastName = data.lastName.trim()
      const allowed =
        /^([A-Za-zñÑ]+([ '-][A-Za-zñÑ]+)*|'[A-Za-zñÑ]+)*$/u
      if (lastName.length < 2 || lastName.length > 50) {
        errors.lastName = "Last Name must be 2-50 characters."
      } else if (!allowed.test(lastName)) {
        errors.lastName =
          "Only letters, spaces, hyphens, apostrophes, and enye (ñ) allowed. No digits or special symbols."
      } else if (/[0-9]/.test(lastName)) {
        errors.lastName = "No digits allowed."
      }
    }

    // Phone validation (PH only)
    if (!data.phone.trim()) {
      errors.phone = "Phone Number is required."
    } else {
      const phoneInput = data.phone.trim()
      // Must start with +63, exactly 11 digits, no letters/special chars except +
      if (!/^\+63\d{10}$/.test(phoneInput)) {
        errors.phone = "PH format: +63 followed by 10 digits (e.g. +639123456789)"
      } else if (/[^\d+]/.test(phoneInput)) {
        errors.phone = "Only digits allowed after +63."
      } else if (phoneInput.length !== 13) {
        errors.phone = "Phone number must be exactly 11 digits (+63XXXXXXXXXX)."
      }
    }

    if (!data.email.trim()) {
      errors.email = "Email is required."
    } else {
      const email = data.email.trim()
      // Must contain @, domain, no spaces, no multiple @, no multiple periods, not start/end with period, must end with .com
      if (/\s/.test(email)) {
        errors.email = "Email must not contain spaces."
      } else if ((email.match(/@/g) || []).length !== 1) {
        errors.email = "Email must contain exactly one '@'."
      } else if (email.startsWith('.') || email.endsWith('.')) {
        errors.email = "Email must not start or end with a period."
      } else if (/\.\./.test(email)) {
        errors.email = "Email must not contain consecutive periods."
      } else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
        errors.email = "Email must contain a valid domain."
      } else if (!/\.com$/.test(email.toLowerCase())) {
        errors.email = "Email must end with '.com'."
      } else {
        const [local, domain] = email.split('@')
        if (!local || !domain) {
          errors.email = "Email must contain a valid local and domain part."
        } else if (local.endsWith('-') || domain.startsWith('-') || domain.endsWith('-')) {
          errors.email = "Email must not start or end domain/local with hyphen."
        } else if (local.startsWith('.') || domain.startsWith('.') || domain.endsWith('.')) {
          errors.email = "Email must not start or end with a period."
        }
      }
      if (email.length < 6 || email.length > 254) {
        errors.email = "Email must be between 6 and 254 characters."
      }
    }

    if (data.resume) {
      const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
      if (!allowed.includes(data.resume.type)) errors.resume = "Accepted formats: PDF, DOC, DOCX."
      if (data.resume.size > 2 * 1024 * 1024) errors.resume = "File size must be under 2MB."
    }
    if (data.coverLetter) {
      const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
      if (!allowed.includes(data.coverLetter.type)) errors.coverLetter = "Accepted formats: PDF, DOC, DOCX."
      if (data.coverLetter.size > 2 * 1024 * 1024) errors.coverLetter = "File size must be under 2MB."
    }
    // Suffix validation
    if (data.suffix) {
      const suffixAllowed = [
        "Jr", "Jr.", "Sr", "Sr.",
        "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV",
        "MD", "PhD", "Esq", "Esq."
      ]
      const suffixInput = data.suffix.trim().replace(/\.$/, "") // remove trailing dot for comparison
      const validRoman = /^(II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV)$/i
      if (
        !suffixAllowed.some(s => s.replace(/\.$/, "").toLowerCase() === suffixInput.toLowerCase()) &&
        !validRoman.test(suffixInput)
      ) {
        errors.suffix = "Suffix must be Jr, Sr, II-XV, MD, PhD, or Esq."
      }
    }
    return errors
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFormErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, [name]: e.target.files![0] }))
      setFormErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (alreadyApplied) {
      toast.error("You have already applied for this job in this session.")
      return
    }
    const errors = validate(formData)
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return
    setIsSubmitting(true)
    const fd = new FormData()
    fd.append("career_id", job.raw?.id || "")
    fd.append("first_name", formData.firstName)
    fd.append("last_name", formData.lastName)
    fd.append("middle_name", formData.middleName)
    fd.append("suffix", formData.suffix)
    fd.append("email", formData.email)
    fd.append("country_code", formData.countryCode)
    fd.append("phone", formData.phone)
    if (formData.resume) fd.append("resume", formData.resume)
    if (formData.coverLetter) fd.append("coverLetter", formData.coverLetter)
    try {
      const res = await fetch("/api/superadmin/careers/applications", {
        method: "POST",
        body: fd,
      })
      if (res.ok) {
        toast.success("Application submitted successfully!")
        setIsSubmitting(false)
        setIsSubmitted(true)
        if (typeof window !== "undefined") {
          const appliedJobs = JSON.parse(sessionStorage.getItem("appliedJobs") || "[]")
          if (!appliedJobs.includes(job.raw?.id)) {
            appliedJobs.push(job.raw?.id)
            sessionStorage.setItem("appliedJobs", JSON.stringify(appliedJobs))
          }
        }
        setAlreadyApplied(true)
      } else {
        const err = await res.json()
        toast.error(err?.error || "Failed to submit application.")
        setIsSubmitting(false)
      }
    } catch {
      toast.error("Failed to submit application.")
      setIsSubmitting(false)
    }
  }

  const handleInquire = () => {
    setActiveTab("apply")
  }

  return (
    <>
      {typeof window !== "undefined" && <Toaster position="top-right" />}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {isLoadingCareers ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <div className="text-blue-700 font-semibold">Loading careers...</div>
                    </div>
                  ) : (
                  <div className="flex justify-between items-start">
                    <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900">
                      {job.title}
                    </Dialog.Title>
                    <button type="button" className="text-gray-400 hover:text-gray-500" onClick={onClose}>
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-4">
                    <div className="flex items-center text-gray-600">
                      <Building className="h-4 w-4 mr-2 text-blue-700" />
                      <span>{job.department}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-blue-700" />
                      <span>{job.location}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-blue-700" />
                      <span>Posted {job.posted}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <PiggyBank className="h-4 w-4 mr-2 text-blue-700" />
                      <span>
                        {(() => {
                          if (job.salary && job.salary.includes(",")) {
                            const [min, max] = job.salary.split(",").map(s => s.trim())
                            return `₱${min} - ₱${max}`
                          }
                          if (job.salary) return `₱${job.salary}`
                          return ""
                        })()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
                    </span>
                  </div>

                  {/* Tabs */}
                  <div className="mt-6 border-b border-gray-200">
                    <div className="flex space-x-8">
                      <button
                        className={`pb-4 text-sm font-medium ${
                          activeTab === "details"
                            ? "border-b-2 border-blue-700 text-blue-700"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setActiveTab("details")}
                      >
                        Job Details
                      </button>
                      <button
                        className={`pb-4 text-sm font-medium ${
                          activeTab === "apply"
                            ? "border-b-2 border-blue-700 text-blue-700"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setActiveTab("apply")}
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="mt-6">
                    {activeTab === "details" ? (
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold mb-2">Job Description</h4>
                          <p className="text-gray-600">
                            {job.description
                              .split(/\s+/)
                              .map(word =>
                                word.length > 0
                                  ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                                  : ""
                              )
                              .join(" ")
                            }
                          </p>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold mb-2">Responsibilities</h4>
                          <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            {job.responsibilities
                              .flatMap((item) =>
                                typeof item === "string" ? item.split(",") : []
                              )
                              .map((item, index) =>
                                item.trim() && (
                                  <li key={index}>
                                    {item.trim().replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase())}
                                  </li>
                                )
                              )}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold mb-2">Requirements</h4>
                          <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            {job.requirements
                              .flatMap((item) =>
                                typeof item === "string" ? item.split(",") : []
                              )
                              .map((item, index) =>
                                item.trim() && (
                                  <li key={index}>
                                    {item.trim().replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase())}
                                  </li>
                                )
                              )}
                          </ul>
                        </div>

                        <div className="pt-4 flex space-x-4">
                          <Button className="bg-blue-700 hover:bg-blue-800" onClick={handleInquire}>
                            Apply Now
                          </Button>
                          <Button
                            variant="outline"
                            className="border-blue-700 text-blue-700 hover:bg-blue-50"
                            onClick={onClose}
                          >
                            Close
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {alreadyApplied ? (
                          <div className="text-center py-8">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                              <CheckCircle className="h-6 w-6 text-yellow-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Already Applied</h3>
                            <p className="text-gray-600 mb-6">
                              You have already applied for this job in this session.
                            </p>
                            <Button
                              variant="outline"
                              className="border-blue-700 text-blue-700 hover:bg-blue-50"
                              onClick={onClose}
                            >
                              Close
                            </Button>
                          </div>
                        ) : isSubmitted ? (
                          <div className="text-center py-8">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Application Submitted!</h3>
                            <p className="text-gray-600 mb-6">
                              Thank you for your interest in joining STI College. We&apos;ll review your application and get
                              back to you soon.
                            </p>
                            <Button
                              variant="outline"
                              className="border-blue-700 text-blue-700 hover:bg-blue-50"
                              onClick={onClose}
                            >
                              Close
                            </Button>
                          </div>
                        ) : (
                          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                  First Name <span className="text-red-600">*</span>
                                </label>
                                <input
                                  type="text"
                                  id="firstName"
                                  name="firstName"
                                  required
                                  className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    formErrors.firstName ? "border-red-500" : "border-gray-300"
                                  }`}
                                  value={formData.firstName}
                                  onChange={handleInputChange}
                                />
                                {formErrors.firstName && (
                                  <p className="text-xs text-red-600 mt-1">{formErrors.firstName}</p>
                                )}
                              </div>
                              <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                  Last Name <span className="text-red-600">*</span>
                                </label>
                                <input
                                  type="text"
                                  id="lastName"
                                  name="lastName"
                                  required
                                  className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    formErrors.lastName ? "border-red-500" : "border-gray-300"
                                  }`}
                                  value={formData.lastName}
                                  onChange={handleInputChange}
                                />
                                {formErrors.lastName && (
                                  <p className="text-xs text-red-600 mt-1">{formErrors.lastName}</p>
                                )}
                              </div>
                              <div>
                                <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-1">
                                  Middle Name
                                </label>
                                <input
                                  type="text"
                                  id="middleName"
                                  name="middleName"
                                  className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    formErrors.middleName ? "border-red-500" : "border-gray-300"
                                  }`}
                                  value={formData.middleName}
                                  onChange={handleInputChange}
                                />
                                {formErrors.middleName && (
                                  <p className="text-xs text-red-600 mt-1">{formErrors.middleName}</p>
                                )}
                              </div>
                              <div>
                                <label htmlFor="suffix" className="block text-sm font-medium text-gray-700 mb-1">
                                  Suffix
                                </label>
                                <select
                                  id="suffix"
                                  name="suffix"
                                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={formData.suffix}
                                  onChange={handleInputChange}
                                >
                                  {suffixes.map((suf) => (
                                    <option key={suf} value={suf}>
                                      {suf === "" ? "None" : suf}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-span-2 flex gap-2">
                                <div className="w-2/5">
                                  <label htmlFor="countryCode" className="block text-sm font-medium text-gray-700 mb-1">
                                    Country Code <span className="text-red-600">*</span>
                                  </label>
                                  <input
                                    id="countryCode"
                                    name="countryCode"
                                    type="text"
                                    value="+63"
                                    disabled
                                    className="w-full rounded-md border px-3 py-2 bg-gray-100 text-gray-700"
                                    tabIndex={-1}
                                  />
                                  {/* No error display needed, always PH */}
                                </div>
                                <div className="w-3/5">
                                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number <span className="text-red-600">*</span>
                                  </label>
                                  <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    required
                                    placeholder="+639XXXXXXXXX"
                                    className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                      formErrors.phone ? "border-red-500" : "border-gray-300"
                                    }`}
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    maxLength={13}
                                  />
                                  {formErrors.phone && (
                                    <p className="text-xs text-red-600 mt-1">{formErrors.phone}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div>
                              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address <span className="text-red-600">*</span>
                              </label>
                              <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  formErrors.email ? "border-red-500" : "border-gray-300"
                                }`}
                                value={formData.email}
                                onChange={handleInputChange}
                              />
                              {formErrors.email && (
                                <p className="text-xs text-red-600 mt-1">{formErrors.email}</p>
                              )}
                            </div>
                            <div>
                              <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                                Resume/CV
                              </label>
              
                              <div
                                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-md px-3 py-8 cursor-pointer transition
                                  ${formErrors.resume ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50 hover:border-blue-500"}
                                `}
                                onClick={e => {
                                  if ((e.target as HTMLElement).tagName !== "INPUT") {
                                    const input = document.getElementById("resume") as HTMLInputElement | null
                                    if (input) input.click()
                                  }
                                }}
                                tabIndex={0}
                                onKeyDown={e => {
                                  if ((e.target as HTMLElement).tagName !== "INPUT" && (e.key === "Enter" || e.key === " ")) {
                                    const input = document.getElementById("resume") as HTMLInputElement | null
                                    if (input) input.click()
                                  }
                                }}
                                role="button"
                                aria-label="Upload Resume"
                              >
                                <svg className="w-8 h-8 text-blue-600 mb-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 0l-3 3m3-3l3 3M20 16.5V19a2 2 0 01-2 2H6a2 2 0 01-2-2v-2.5" />
                                </svg>
                                <span className="text-sm text-gray-700">
                                  {typeof window !== "undefined" && formData.resume ? (
                                    <span className="font-medium text-blue-700">{formData.resume.name}</span>
                                  ) : (
                                    <>
                                      <span className="font-medium text-blue-700">Click to upload</span> or drag and drop
                                    </>
                                  )}
                                </span>
                                <span className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX. Max 2MB.</span>
                                <input
                                  type="file"
                                  id="resume"
                                  name="resume"
                                  accept=".pdf,.doc,.docx"
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  onChange={handleFileChange}
                                  tabIndex={-1}
                                  style={{ zIndex: 2 }}
                                />
                              </div>
                              {formErrors.resume && (
                                <p className="text-xs text-red-600 mt-1">{formErrors.resume}</p>
                              )}
                            </div>
                            <div>
                              <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
                                Cover Letter (optional)
                              </label>
                       
                              <div
                                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-md px-3 py-8 cursor-pointer transition
                                  ${formErrors.coverLetter ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50 hover:border-blue-500"}
                                `}
                                onClick={e => {
                                  if ((e.target as HTMLElement).tagName !== "INPUT") {
                                    const input = document.getElementById("coverLetter") as HTMLInputElement | null
                                    if (input) input.click()
                                  }
                                }}
                                tabIndex={0}
                                onKeyDown={e => {
                                  if ((e.target as HTMLElement).tagName !== "INPUT" && (e.key === "Enter" || e.key === " ")) {
                                    const input = document.getElementById("coverLetter") as HTMLInputElement | null
                                    if (input) input.click()
                                  }
                                }}
                                role="button"
                                aria-label="Upload Cover Letter"
                              >
                                <svg className="w-8 h-8 text-blue-600 mb-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 0l-3 3m3-3l3 3M20 16.5V19a2 2 0 01-2 2H6a2 2 0 01-2-2v-2.5" />
                                </svg>
                                <span className="text-sm text-gray-700">
                                  {typeof window !== "undefined" && formData.coverLetter ? (
                                    <span className="font-medium text-blue-700">{formData.coverLetter.name}</span>
                                  ) : (
                                    <>
                                      <span className="font-medium text-blue-700">Click to upload</span> or drag and drop
                                    </>
                                  )}
                                </span>
                                <span className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX. Max 2MB.</span>
                                <input
                                  type="file"
                                  id="coverLetter"
                                  name="coverLetter"
                                  accept=".pdf,.doc,.docx"
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  onChange={handleFileChange}
                                  tabIndex={-1}
                                  style={{ zIndex: 2 }}
                                />
                              </div>
                              {formErrors.coverLetter && (
                                <p className="text-xs text-red-600 mt-1">{formErrors.coverLetter}</p>
                              )}
                            </div>
                            <div className="pt-4 flex space-x-4">
                              <Button type="submit" className="bg-blue-700 hover:bg-blue-800" disabled={isSubmitting}>
                                {isSubmitting ? (
                                  <span className="flex items-center justify-center">
                                    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin mr-2"></span>
                                    Submitting...
                                  </span>
                                ) : (
                                  "Submit Application"
                                )}
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                className="border-blue-700 text-blue-700 hover:bg-blue-50 hover:text-blue-700"
                                onClick={() => setActiveTab("details")}
                              >
                                Back to Details
                              </Button>
                            </div>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

