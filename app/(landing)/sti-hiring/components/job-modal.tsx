"use client"

import type React from "react"
import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { X, MapPin, Building, Clock, DollarSign, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

type JobModalProps = {
  job: {
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
  phone: string
  resume: File | null
  coverLetter: string
}

type FormErrors = {
  [K in keyof FormData]?: string
}

export default function JobModal({ job, isOpen, onClose }: JobModalProps) {
  const [activeTab, setActiveTab] = useState<"details" | "apply">("details")
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    middleName: "",
    suffix: "",
    email: "",
    phone: "",
    resume: null,
    coverLetter: "",
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const namePattern = /^[A-Za-z]+([ -][A-Za-z]+)*$/

  const validate = (data: FormData): FormErrors => {
    const errors: FormErrors = {}
    if (!data.firstName.trim()) errors.firstName = "First name is required."
    else if (!namePattern.test(data.firstName.trim())) errors.firstName = "First name must only contain letters, spaces, or dashes."
    if (!data.lastName.trim()) errors.lastName = "Last name is required."
    else if (!namePattern.test(data.lastName.trim())) errors.lastName = "Last name must only contain letters, spaces, or dashes."
    if (!data.middleName.trim()) errors.middleName = "Middle name is required."
    else if (!namePattern.test(data.middleName.trim())) errors.middleName = "Middle name must only contain letters, spaces, or dashes."
    if (!data.email.trim()) errors.email = "Email is required."
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(data.email)) errors.email = "Invalid email address."
    if (!data.phone.trim()) errors.phone = "Phone number is required."
    else if (!/^\+?\d{10,15}$/.test(data.phone.replace(/[\s()-]/g, ""))) errors.phone = "Invalid phone number."
    if (!data.resume) errors.resume = "Resume is required."
    else {
      const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
      if (!allowed.includes(data.resume.type)) errors.resume = "Accepted formats: PDF, DOC, DOCX."
      if (data.resume.size > 2 * 1024 * 1024) errors.resume = "File size must be under 2MB."
    }
    if (!data.coverLetter.trim()) errors.coverLetter = "Cover letter is required."
    return errors
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFormErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, resume: e.target.files![0] }))
      setFormErrors((prev) => ({ ...prev, resume: undefined }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errors = validate(formData)
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1500)
  }

  const handleInquire = () => {
    setActiveTab("apply")
  }

  return (
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
                <div className="flex justify-between items-start">
                  <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900">
                    {job.title}
                  </Dialog.Title>
                  <button type="button" className="text-gray-400 hover:text-gray-500" onClick={onClose}>
                    <X className="h-6 w-6" />
                  </button>
                </div>

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
                    <DollarSign className="h-4 w-4 mr-2 text-blue-700" />
                    <span>{job.salary}</span>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {job.type}
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
                        <p className="text-gray-600">{job.description}</p>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold mb-2">Responsibilities</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                          {job.responsibilities.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold mb-2">Requirements</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                          {job.requirements.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold mb-2">Benefits</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                          {job.benefits.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
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
                      {isSubmitted ? (
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
                                First Name
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
                                Last Name
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
                                required
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
                              <input
                                type="text"
                                id="suffix"
                                name="suffix"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.suffix}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                              Email Address
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
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              required
                              className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                formErrors.phone ? "border-red-500" : "border-gray-300"
                              }`}
                              value={formData.phone}
                              onChange={handleInputChange}
                            />
                            {formErrors.phone && (
                              <p className="text-xs text-red-600 mt-1">{formErrors.phone}</p>
                            )}
                          </div>
                          <div>
                            <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                              Resume/CV
                            </label>
                            <input
                              type="file"
                              id="resume"
                              name="resume"
                              required
                              accept=".pdf,.doc,.docx"
                              className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                formErrors.resume ? "border-red-500" : "border-gray-300"
                              }`}
                              onChange={handleFileChange}
                            />
                            <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX. Max 2MB.</p>
                            {formErrors.resume && (
                              <p className="text-xs text-red-600 mt-1">{formErrors.resume}</p>
                            )}
                          </div>
                          <div>
                            <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
                              Cover Letter
                            </label>
                            <textarea
                              id="coverLetter"
                              name="coverLetter"
                              rows={4}
                              required
                              className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                formErrors.coverLetter ? "border-red-500" : "border-gray-300"
                              }`}
                              value={formData.coverLetter}
                              onChange={handleInputChange}
                            ></textarea>
                            {formErrors.coverLetter && (
                              <p className="text-xs text-red-600 mt-1">{formErrors.coverLetter}</p>
                            )}
                          </div>
                          <div className="pt-4 flex space-x-4">
                            <Button type="submit" className="bg-blue-700 hover:bg-blue-800" disabled={isSubmitting}>
                              {isSubmitting ? "Submitting..." : "Submit Application"}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              className="border-blue-700 text-blue-700 hover:bg-blue-50"
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
  )
}
