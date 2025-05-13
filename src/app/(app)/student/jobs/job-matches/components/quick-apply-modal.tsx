import React, { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "./badge";
import { Star, FileText, Bell } from "lucide-react";
import { FaHandSparkles } from "react-icons/fa";
import { Button } from "@/components/ui/button"

function QuickApplyModal({ jobId, onClose }: { jobId: number; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"application" | "resume" | "cover" | "questions">("application");

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
                    <span className="text-sm font-medium">Kemly Rose</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Email</span>
                    <span className="text-sm font-medium">kemly.rose@example.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Phone</span>
                    <span className="text-sm font-medium">+63 912 345 6789</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Education</span>
                    <span className="text-sm font-medium">BS Information Technology</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Resume</span>
                    <span className="text-sm font-medium text-blue-600 cursor-pointer">KemlyRose_Resume.pdf</span>
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
                defaultValue="Dear Hiring Manager,

I am writing to express my interest in the UI/UX Designer position at Fb Mark-it Place. As a fourth-year Information Technology student with a strong background in frontend development and UI/UX design, I believe I would be a valuable addition to your team.

My experience includes designing and developing responsive web applications using React, Next.js, and various design tools like Figma. I have a keen eye for detail and a passion for creating intuitive, user-friendly interfaces that enhance the overall user experience.

I am particularly drawn to Fb Mark-it Place because of your innovative approach to digital solutions and your commitment to user-centered design. I am excited about the opportunity to contribute to your projects and grow as a designer in your collaborative environment.

Thank you for considering my application. I look forward to the possibility of discussing how my skills and experiences align with your needs.

Sincerely,
Kemly Rose"
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
                  <select className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Select an option</option>
                    <option>Less than 1 year</option>
                    <option selected>1-2 years</option>
                    <option>3-5 years</option>
                    <option>5+ years</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Do you have experience with Figma?</label>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <input type="radio" id="figma-yes" name="figma" checked />
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
                  <textarea
                    className="w-full min-h-[100px] rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your experience..."
                    defaultValue="For my capstone project, I designed and developed a student job matching platform using React and Figma. I conducted user research with 50+ students, created wireframes and prototypes, and implemented the frontend interface. The platform improved job discovery by 40% in our user testing."
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Are you available to start immediately?
                  </label>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <input type="radio" id="start-yes" name="start" checked />
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
            <Button variant="outline" className="text-blue-600 border-blue-200">
              Previous
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              {activeTab === "questions" ? "Submit Application" : "Next"}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default QuickApplyModal;
