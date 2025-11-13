"use client"

import {
  Users,
  Clock,
  Calendar,
  MapPin,
  Briefcase,
  Eye,
  BarChart3,
  Edit,
  Share2,
  Pause,
  Trash2,
  MessageSquare,
  UserCheck,
  FileText,
  BookOpen,
  Award,
  Bus,
  Clock as ClockIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LinearProgress } from "@mui/material"
import Chip from "@mui/material/Chip"
import ApplicantsTab from "./applicants-tab"
import JobAnalytics from "./analytics-tab"
import JobSettings from "./settings-tab"
import { PiMoneyLight } from "react-icons/pi";
import { FaUser } from "react-icons/fa";
import React from "react"
import QuickEditModal from "../quick-edit-modal"

type JobData = {
  jobTitle: string
  location: string
  remoteOptions?: string
  workType: string
  payType?: string
  payAmount: string
  recommendedCourse?: string
  verificationTier?: string
  jobDescription: string
  responsibilities: string[]
  mustHaveQualifications: string[]
  niceToHaveQualifications: string[]
  jobSummary?: string
  applicationDeadline?: { date: string; time: string }
  maxApplicants?: string
  applicationQuestions?: string[]
  perksAndBenefits: string[]
  views?: number
  total_applicants?: number
  qualified_applicants?: number
  interviews?: number
  posted?: string
  closing?: string
  hired?: number
  status?: string
  paused?: boolean
  paused_status?: "paused" | "active" | "paused_orange"
  companyName?: string 
  postingDate?: string
  tags?: { name: string; color: string }[]
}

type ApplicationQuestion = {
  id: string
  question: string
  type: string
  auto_reject: boolean
  correct_answer?: string | null
}

const PERKS_MAP = [
  { id: "training", label: "Free Training & Workshops - Skill development", icon: <BookOpen className="h-5 w-5 text-green-500" /> },
  { id: "certification", label: "Certification Upon Completion - Proof of experience", icon: <Award className="h-5 w-5 text-blue-500" /> },
  { id: "potential", label: "Potential Job Offer - Possible full-time employment", icon: <Briefcase className="h-5 w-5 text-yellow-500" /> },
  { id: "transportation", label: "Transportation Allowance - Support for expenses", icon: <Bus className="h-5 w-5 text-purple-500" /> },
  { id: "mentorship", label: "Mentorship & Guidance - Hands-on learning", icon: <UserCheck className="h-5 w-5 text-orange-500" /> },
  { id: "flexible", label: "Flexible Hours - Adjusted schedules for students", icon: <ClockIcon className="h-5 w-5 text-pink-500" /> },
]

export default function EmployerJobOverview({ selectedJob, onClose }: { selectedJob: number | null; onClose: () => void }) {
  const [jobData, setJobData] = React.useState<JobData | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [questions, setQuestions] = React.useState<ApplicationQuestion[]>([])
  const [quickEditOpen, setQuickEditOpen] = React.useState(false);

  React.useEffect(() => {
    if (selectedJob == null) return
    setLoading(true)
    setError(null)
    Promise.all([
      fetch(`/api/job-listings/job-cards/${selectedJob}`).then(r => r.json()),
      fetch(`/api/job-listings/job-cards/${selectedJob}/questions`).then(r => r.json())
    ])
      .then(([job, questions]) => {
        setJobData(job)
        setQuestions(Array.isArray(questions) ? questions : [])
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load job details")
        setLoading(false)
      })
  }, [selectedJob])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">{error}</div>
    )
  }

  if (!jobData) {
    return null
  }

  return (
    <div className="p-6 max-h-screen overflow-y-auto overflow-y-auto relative ">
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        onClick={onClose}
        aria-label="Close"
      >
        ✕
      </button>

      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{jobData.jobTitle}</h1>
            {/* Show company name if available */}
            {jobData.companyName && (
              <div className="text-sm text-gray-600 font-semibold mb-1">
                {jobData.companyName}
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {jobData.location}
              </span>
              <span>•</span>
              {jobData.closing === "Closed" ? (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                  Closed
                </span>
              ) : (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  jobData.paused
                    ? jobData.paused_status === "paused_orange"
                      ? "bg-orange-400 text-white"
                      : "bg-orange-100 text-orange-600"
                    : "bg-green-100 text-green-600"
                }`}>
                  {jobData.paused
                    ? jobData.paused_status === "paused_orange"
                      ? "Paused (Orange)"
                      : "Paused"
                    : jobData.status ?? "Active"}
                </span>
              )}
              {jobData.closing && jobData.closing !== "Closed" && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  (() => {
                    const match = jobData.closing?.match(/\d+/);
                    const daysLeft = match ? parseInt(match[0]) : 0;
                    if (daysLeft <= 9) return "bg-red-100 text-red-600";
                    if (daysLeft <= 15) return "bg-orange-50 text-orange-500";
                    return "bg-blue-50 text-blue-500";
                  })()
                }`}>
                  {jobData.closing}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => setQuickEditOpen(true)}
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="gap-1 text-amber-500 border-amber-200 hover:bg-amber-50">
              <Pause className="h-4 w-4" />
              Pause
            </Button>
            <Button variant="outline" size="sm" className="gap-1 text-red-500 border-red-200 hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applicants">Applicants</TabsTrigger>
            <TabsTrigger value="analytics" disabled={selectedJob === null}>Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <Eye className="h-5 w-5 text-blue-500 mb-1" />
                      <div className="text-2xl font-bold">{jobData.views ?? 0}</div>
                      <div className="text-xs text-gray-500">Views</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <Users className="h-5 w-5 text-indigo-500 mb-1" />
                      <div className="text-2xl font-bold">{jobData.total_applicants ?? 0}</div>
                      <div className="text-xs text-gray-500">Applicants</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <UserCheck className="h-5 w-5 text-green-500 mb-1" />
                      <div className="text-2xl font-bold">{jobData.qualified_applicants ?? 0}</div>
                      <div className="text-xs text-gray-500">Qualified</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-purple-500 mb-1" />
                      <div className="text-2xl font-bold">{jobData.interviews ?? 0}</div>
                      <div className="text-xs text-gray-500">Interviews</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Job Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium">Job Type</div>
                          <div className="text-sm text-gray-500">{jobData.workType}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <PiMoneyLight className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium">Salary</div>
                          <div className="text-sm text-gray-500">PHP {jobData.payAmount}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium">Posted</div>
                          <div className="text-sm text-gray-500">
                            {jobData.postingDate
                              ? new Date(jobData.postingDate).toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : ""}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium">Closing</div>
                          <div className="text-sm text-gray-500">
                            {jobData.applicationDeadline && jobData.applicationDeadline.date
                              ? new Date(
                                  jobData.applicationDeadline.time
                                    ? `${jobData.applicationDeadline.date}T${jobData.applicationDeadline.time}`
                                    : jobData.applicationDeadline.date
                                ).toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : "No application deadline"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium">Remote Options</div>
                          <div className="text-sm text-gray-500">{jobData.remoteOptions || "None"}</div>
                        </div>
                      </div>
          
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Description</h3>
                      <p className="text-sm text-gray-500">{jobData.jobDescription}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Responsibilities</h3>
                      <ul className="text-sm text-gray-500 list-disc pl-5 space-y-1">
                        {(Array.isArray(jobData.responsibilities) ? jobData.responsibilities : [jobData.responsibilities]).map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Must-Have Qualifications</h3>
                      <ul className="text-sm text-gray-500 list-disc pl-5 space-y-1">
                        {(Array.isArray(jobData.mustHaveQualifications) ? jobData.mustHaveQualifications : [jobData.mustHaveQualifications]).map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Nice-to-Have Qualifications</h3>
                      <ul className="text-sm text-gray-500 list-disc pl-5 space-y-1">
                        {(Array.isArray(jobData.niceToHaveQualifications) ? jobData.niceToHaveQualifications : [jobData.niceToHaveQualifications]).map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Perks and Benefits</h3>
                      <ul className="text-sm text-gray-500 list-none pl-0 space-y-2">
                        {Array.isArray(jobData.perksAndBenefits) && jobData.perksAndBenefits.length > 0 ? (
                          jobData.perksAndBenefits.map((perkId: string) => {
                            const perk = PERKS_MAP.find(p => p.id === perkId)
                            return perk ? (
                              <li key={perk.id} className="flex items-center gap-2">
                                {perk.icon}
                                <span>{perk.label}</span>
                              </li>
                            ) : (
                              <li key={perkId}>{perkId}</li>
                            )
                          })
                        ) : (
                          <li>No perks and benefits.</li>
                        )}
                      </ul>
                    </div>
                    {/* Application Questions Section */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Application Questions</h3>
                      <ul className="text-sm text-gray-500 list-disc pl-5 space-y-1">
                        {questions.length === 0 ? (
                          <li>No application questions.</li>
                        ) : (
                          questions.map((q, idx) => (
                            <li key={q.id || idx}>{q.question}</li>
                          ))
                        )}
                      </ul>
                    </div>
                    {jobData.recommendedCourse && (
                      <div>
                        <h3 className="text-sm font-medium mb-2">Recommended Course</h3>
                        <ul className="text-sm text-gray-500 list-disc pl-5 space-y-1">
                          {jobData.recommendedCourse
                            .split(",")
                            .map((course, idx) => (
                              <li key={idx}>{course.trim()}</li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Recent Applicants</CardTitle>
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      View More
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((applicant) => (
                        <div key={applicant} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center">
                              <FaUser className="text-white w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-medium">{`Applicant ${applicant}`}</div>
                              <div className="text-xs text-gray-500">Applied 2 days ago</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Chip label="85% Match" className="bg-green-100 text-green-600 hover:bg-green-200" />
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Applicant Funnel</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Applied</span>
                        <span className="font-medium">{jobData.total_applicants ?? 0}</span>
                      </div>
                      <LinearProgress variant="determinate" value={0} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Qualified</span>
                        <span className="font-medium">{jobData.qualified_applicants ?? 0}</span>
                      </div>
                      <LinearProgress
                        variant="determinate"
                        value={
                          jobData.total_applicants && jobData.qualified_applicants
                            ? (jobData.qualified_applicants / jobData.total_applicants) * 100
                            : 0
                        }
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Interviewed</span>
                        <span className="font-medium">{jobData.interviews ?? 0}</span>
                      </div>
                      <LinearProgress
                        variant="determinate"
                        value={
                          jobData.total_applicants && jobData.interviews
                            ? (jobData.interviews / jobData.total_applicants) * 100
                            : 0
                        }
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Hired</span>
                        <span className="font-medium">{jobData.hired ?? 0}</span>
                      </div>
                      <LinearProgress
                        variant="determinate"
                        value={
                          jobData.total_applicants && jobData.hired
                            ? (jobData.hired / jobData.total_applicants) * 100
                            : 0
                        }
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Match Quality</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          Excellent (90%+)
                        </span>
                        <span className="font-medium">-</span>
                      </div>
                      <LinearProgress variant="determinate" value={0} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          Good (70-89%)
                        </span>
                        <span className="font-medium">-</span>
                      </div>
                      <LinearProgress variant="determinate" value={0} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                          Fair (50-69%)
                        </span>
                        <span className="font-medium">-</span>
                      </div>
                      <LinearProgress variant="determinate" value={0} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          Poor (Below 50%)
                        </span>
                        <span className="font-medium">-</span>
                      </div>
                      <LinearProgress variant="determinate" value={0} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Download Applicant CSV
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Full Analytics
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message All Applicants
                    </Button>
                  </CardContent>
                </Card>

                {Array.isArray(jobData.tags) && jobData.tags.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Tags</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {jobData.tags.map((tag, idx) => (
                        <span
                          key={tag.name + idx}
                          style={{
                            backgroundColor: tag.color,
                            color: "#fff",
                            borderRadius: "9999px",
                            padding: "0.25rem 0.75rem",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            display: "inline-block",
                          }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="applicants" className="mt-6">
            <ApplicantsTab />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <JobAnalytics />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <JobSettings jobId={selectedJob ? String(selectedJob) : ""} companyName={jobData.companyName} />
          </TabsContent>
        </Tabs>
      </div>
      <QuickEditModal
        open={quickEditOpen}
        job={{
          id: selectedJob ?? undefined,
          jobTitle: jobData.jobTitle,
          location: jobData.location,
          remoteOptions: jobData.remoteOptions ?? "",
          workType: jobData.workType,
          payType: jobData.payType ?? "",
          payAmount: jobData.payAmount,
          recommendedCourse: jobData.recommendedCourse ?? "",
          verificationTier: jobData.verificationTier ?? "",
          jobDescription: jobData.jobDescription,
          responsibilities: jobData.responsibilities,
          mustHaveQualifications: jobData.mustHaveQualifications,
          niceToHaveQualifications: jobData.niceToHaveQualifications,
          jobSummary: jobData.jobSummary ?? "",
          applicationDeadline: jobData.applicationDeadline ?? { date: "", time: "" },
          maxApplicants: jobData.maxApplicants ?? "",
          applicationQuestions: questions.map(q => ({
            question: q.question,
            type: q.type,
            autoReject: q.auto_reject,
            correctAnswer: q.correct_answer ?? undefined,
          })),
          perksAndBenefits: jobData.perksAndBenefits,
        }}
        onClose={() => setQuickEditOpen(false)}
        onSave={() => {
          setQuickEditOpen(false);

        }}
      />
    </div>
  )
}
