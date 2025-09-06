import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "./badge";
import { Star, FileText, Bell } from "lucide-react";
import { FaHandSparkles } from "react-icons/fa";
import { Button } from "@/components/ui/button"

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
    // ...other fields if needed
  }
  // ...add more fields as needed
}

type QuickApplyForm = {
  first_name: string
  last_name: string
  email: string
  phone: string
  resume: string
  cover_letter: string
  experience_years: string
  portfolio: string
  terms_accepted: boolean
  application_answers: Record<string, unknown>
}

function QuickApplyModal({ jobId, onClose }: { jobId: number; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"application" | "resume" | "cover" | "questions">("application");
  const [student, setStudent] = useState<StudentDetails | null>(null)
  const [form, setForm] = useState<QuickApplyForm>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    resume: "",
    cover_letter: "",
    experience_years: "",
    portfolio: "",
    terms_accepted: false,
    application_answers: {},
  })
  const [usePersonalEmail, setUsePersonalEmail] = useState(false);
  const [usePersonalPhone, setUsePersonalPhone] = useState(false);

  useEffect(() => {
    fetch("/api/students/get-student-details")
      .then(res => res.ok ? res.json() : null)
      .then((data: StudentDetails) => {
        if (data) {
          setStudent(data)
          setForm((prev: QuickApplyForm) => ({
            ...prev,
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            email: data.email || "",
            phone: "",
            // ...other fields if available...
          }))
        }
      })
  }, [])

  useEffect(() => {
    if (student) {
      if (usePersonalEmail && Array.isArray(student.contact_info?.email) && student.contact_info.email[0]) {
        setForm((prev: QuickApplyForm) => ({ ...prev, email: student.contact_info!.email![0] }))
      } else {
        setForm((prev: QuickApplyForm) => ({ ...prev, email: student.email || "" }))
      }
    }
  }, [usePersonalEmail, student])

  useEffect(() => {
    if (student) {
      if (usePersonalPhone && Array.isArray(student.contact_info?.phone) && student.contact_info.phone[0]) {
        setForm((prev: QuickApplyForm) => ({ ...prev, phone: student.contact_info!.phone![0] }))
      } else {
        setForm((prev: QuickApplyForm) => ({ ...prev, phone: "" }))
      }
    }
  }, [usePersonalPhone, student])

  const handleChange = (field: keyof QuickApplyForm, value: QuickApplyForm[keyof QuickApplyForm]) => {
    setForm((prev: QuickApplyForm) => ({ ...prev, [field]: value }))
  }

  const tabOrder: Array<"application" | "resume" | "cover" | "questions"> = [
    "application",
    "resume",
    "cover",
    "questions",
  ];

  const handleNext = () => {
    const idx = tabOrder.indexOf(activeTab);
    if (idx < tabOrder.length - 1) {
      setActiveTab(tabOrder[idx + 1]);
    }
  };

  const handlePrev = () => {
    const idx = tabOrder.indexOf(activeTab);
    if (idx > 0) {
      setActiveTab(tabOrder[idx - 1]);
    }
  };

  const handleSubmit = async () => {
    await fetch("/api/students/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        job_id: jobId,
        student_id: student?.id,
      }),
    });
    onClose();
  };

  const jobData = {
    0: {
      title: "UI/UX Designer",
      company: "Fb Mark-it Place",
      location: "San Jose Del Monte, Pampanga",
      salary: "800",
      type: "OJT",
      description:
        "Seeking a creative UI/UX Designer to craft intuitive and visually engaging user experiences. You will design user-friendly interfaces that enhance functionality and aesthetics.",
      requirements:
        "- 1+ year of experience with UI/UX design\n- Proficiency in Figma, Adobe XD\n- Strong portfolio showcasing UI/UX projects\n- Knowledge of user research and testing",
      deadline: "2023-05-10",
    },
  }[jobId] || {
    title: "UI/UX Designer",
    company: "Fb Mark-it Place",
    location: "San Jose Del Monte, Pampanga",
    salary: "800",
    type: "OJT",
    description:
      "Seeking a creative UI/UX Designer to craft intuitive and visually engaging user experiences. You will design user-friendly interfaces that enhance functionality and aesthetics.",
    requirements:
      "- 1+ year of experience with UI/UX design\n- Proficiency in Figma, Adobe XD\n- Strong portfolio showcasing UI/UX projects\n- Knowledge of user research and testing",
    deadline: "2023-05-10",
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xl">Quick Apply</h3>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={onClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <p className="text-blue-100 text-sm">
            {jobData.title} - {jobData.company}
          </p>
        </div>

        <div className="flex border-b">
          {["application", "resume", "cover", "questions"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === tab ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab as "application" | "resume" | "cover" | "questions")}
            >
              {tab === "application" && "Application"}
              {tab === "resume" && "Resume"}
              {tab === "cover" && "Cover Letter"}
              {tab === "questions" && "Questions"}
            </button>
          ))}
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === "application" && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-blue-600 fill-blue-500" />
                  <h4 className="font-medium text-blue-700">You&apos;re a 93% match for this position!</h4>
                </div>
                <p className="text-sm text-blue-600">
                  Your skills and experience align well with this job. Complete your application to stand out from other
                  candidates.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Application Summary</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Name</span>
                    <span className="text-sm font-medium">
                      <input className="bg-transparent border-none outline-none" value={form.first_name} onChange={e => handleChange("first_name", e.target.value)} />
                      {" "}
                      <input className="bg-transparent border-none outline-none" value={form.last_name} onChange={e => handleChange("last_name", e.target.value)} />
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Email</span>
                    <div className="flex items-center gap-2">
                      <input
                        className="text-sm font-medium bg-transparent border-none outline-none"
                        value={form.email}
                        onChange={e => handleChange("email", e.target.value)}
                      />
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={usePersonalEmail}
                          onChange={e => setUsePersonalEmail(e.target.checked)}
                        />
                        Use personal email
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Phone</span>
                    <div className="flex items-center gap-2">
                      <input
                        className="text-sm font-medium bg-transparent border-none outline-none"
                        value={form.phone}
                        onChange={e => handleChange("phone", e.target.value)}
                      />
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={usePersonalPhone}
                          onChange={e => setUsePersonalPhone(e.target.checked)}
                        />
                        Use personal phone
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Education</span>
                    {/* Remove the input for education since it's not in QuickApplyForm */}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Resume</span>
                    <input className="text-sm font-medium text-blue-600 bg-transparent border-none outline-none" value={form.resume} onChange={e => handleChange("resume", e.target.value)} />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Matching Skills</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-green-100 text-green-700 border-none">React (95%)</Badge>
                  <Badge className="bg-green-100 text-green-700 border-none">UI/UX Design (90%)</Badge>
                  <Badge className="bg-green-100 text-green-700 border-none">JavaScript (85%)</Badge>
                  <Badge className="bg-yellow-100 text-yellow-700 border-none">CSS/Tailwind (75%)</Badge>
                  <Badge className="bg-yellow-100 text-yellow-700 border-none">Node.js (70%)</Badge>
                </div>
              </div>

              <div className="pt-4">
                <h4 className="font-medium text-gray-700 mb-2">Application Status</h4>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="rounded-full w-6 h-6 bg-blue-600 flex items-center justify-center text-white text-xs">
                        1
                      </div>
                      <span className="ml-2 text-sm font-medium text-blue-600">Profile</span>
                    </div>
                    <div className="flex items-center">
                      <div className="rounded-full w-6 h-6 bg-gray-200 flex items-center justify-center text-gray-600 text-xs">
                        2
                      </div>
                      <span className="ml-2 text-sm text-gray-600">Resume</span>
                    </div>
                    <div className="flex items-center">
                      <div className="rounded-full w-6 h-6 bg-gray-200 flex items-center justify-center text-gray-600 text-xs">
                        3
                      </div>
                      <span className="ml-2 text-sm text-gray-600">Questions</span>
                    </div>
                    <div className="flex items-center">
                      <div className="rounded-full w-6 h-6 bg-gray-200 flex items-center justify-center text-gray-600 text-xs">
                        4
                      </div>
                      <span className="ml-2 text-sm text-gray-600">Submit</span>
                    </div>
                  </div>
                  <div className="h-1 bg-gray-200 absolute top-3 left-0 right-0 z-0">
                    <div className="h-1 bg-blue-600 w-1/4"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "resume" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-700">Your Resume</h4>
                <Button variant="outline" size="sm" className="text-blue-600 border-blue-200">
                  <FileText className="h-4 w-4 mr-1" />
                  Upload New
                </Button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">KemlyRose_Resume.pdf</span>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-none">Current</Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Uploaded on May 2, 2025</span>
                  <span>2 pages • 1.2 MB</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" className="text-blue-600 border-blue-200">
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-200">
                    Delete
                  </Button>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="h-5 w-5 text-yellow-600" />
                  <h4 className="font-medium text-yellow-700">Resume Tips</h4>
                </div>
                <ul className="text-sm text-yellow-600 space-y-1 list-disc pl-5">
                  <li>Highlight your UI/UX design experience to match this job</li>
                  <li>Include links to your portfolio or design projects</li>
                  <li>Quantify your achievements with metrics when possible</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "cover" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-700">Cover Letter</h4>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-blue-600 border-blue-200">
                    Use Template
                  </Button>
                  <Button variant="outline" size="sm" className="text-blue-600 border-blue-200">
                    <FaHandSparkles className="h-4 w-4 mr-1" />
                    AI Generate
                  </Button>
                </div>
              </div>

              <textarea
                className="w-full min-h-[300px] rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Write your cover letter here..."
                value={form.cover_letter}
                onChange={e => handleChange("cover_letter", e.target.value)}
              ></textarea>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium text-blue-700">Cover Letter Tips</h4>
                </div>
                <ul className="text-sm text-blue-600 space-y-1 list-disc pl-5">
                  <li>Personalize your letter for this specific position</li>
                  <li>Highlight relevant projects and achievements</li>
                  <li>Keep it concise - aim for 250-400 words</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "questions" && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Screening Questions</h4>
              <p className="text-sm text-gray-500">
                Please answer the following questions to complete your application.
              </p>

              <div className="space-y-6 mt-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    How many years of experience do you have in UI/UX design?
                  </label>
                  <select className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={form.experience_years}
                    onChange={e => handleChange("experience_years", e.target.value)}
                  >
                    <option>Select an option</option>
                    <option>Less than 1 year</option>
                    <option>1-2 years</option>
                    <option>3-5 years</option>
                    <option>5+ years</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Do you have experience with Figma?</label>
                  <div className="flex gap-4">
                    {/* Remove all references to form.figma_experience */}
                    <div className="flex items-center gap-2">
                      <input type="radio" id="figma-yes" name="figma" />
                      <label htmlFor="figma-yes" className="text-sm">
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="radio" id="figma-no" name="figma" />
                      <label htmlFor="figma-no" className="text-sm">
                        No
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Please describe a UI/UX project you&apos;ve worked on and your role in it.
                  </label>
                  {/* Remove all references to form.project_description */}
                  <textarea
                    className="w-full min-h-[100px] rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your experience..."
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Are you available to start immediately?
                  </label>
                  <div className="flex gap-4">
                    {/* Remove all references to form.start_immediately */}
                    <div className="flex items-center gap-2">
                      <input type="radio" id="start-yes" name="start" />
                      <label htmlFor="start-yes" className="text-sm">
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="radio" id="start-no" name="start" />
                      <label htmlFor="start-no" className="text-sm">
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Save as Draft
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="text-blue-600 border-blue-200"
              onClick={handlePrev}
              disabled={activeTab === "application"}
            >
              Previous
            </Button>
            {activeTab === "questions" ? (
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>
                Submit Application
              </Button>
            ) : (
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default QuickApplyModal;
