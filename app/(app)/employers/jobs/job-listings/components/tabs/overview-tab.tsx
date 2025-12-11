/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {
  Users,
  Clock,
  Calendar,
  MapPin,
  Briefcase,
  Eye,
  Edit,
  Pause,
  Trash2,
  MessageSquare,
  UserCheck,
  BookOpen,
  Award,
  Bus,
  Clock as ClockIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LinearProgress } from "@mui/material"
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { MdWarningAmber, MdBlock, MdLock } from "react-icons/md";
import { Tooltip as MuiTooltip } from "@mui/material"
import { toast } from "react-hot-toast"
import { Lock } from "@mui/icons-material"

import ApplicantsTab from "./applicants-tab"
import JobAnalytics from "./analytics-tab"
import JobSettings from "./settings-tab"
import { PiMoneyLight } from "react-icons/pi";
import React from "react"
import QuickEditModal from "../quick-edit-modal"
import { useSession } from "next-auth/react"

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
  is_archived?: boolean
}

type ApplicationQuestion = {
  id: string
  question: string
  type: string
  auto_reject: boolean
  correct_answer?: string | string[] | null
  options?: string[] | ApplicationQuestionOption[]
}


type ApplicationQuestionOption = { id: string; question_id: string; option_value: string };

const PERKS_MAP = [
  { id: "training", label: "Free Training & Workshops - Skill development", icon: <BookOpen className="h-5 w-5 text-green-500" /> },
  { id: "certification", label: "Certification Upon Completion - Proof of experience", icon: <Award className="h-5 w-5 text-blue-500" /> },
  { id: "potential", label: "Potential Job Offer - Possible full-time employment", icon: <Briefcase className="h-5 w-5 text-yellow-500" /> },
  { id: "transportation", label: "Transportation Allowance - Support for expenses", icon: <Bus className="h-5 w-5 text-purple-500" /> },
  { id: "mentorship", label: "Mentorship & Guidance - Hands-on learning", icon: <UserCheck className="h-5 w-5 text-orange-500" /> },
  { id: "flexible", label: "Flexible Hours - Adjusted schedules for students", icon: <ClockIcon className="h-5 w-5 text-pink-500" /> },
]

export default function EmployerJobOverview({ selectedJob, onClose, onSuccess, initialTab }: { selectedJob: string | null; onClose: () => void; onSuccess?: () => void; initialTab?: string }) {
  const { data: session } = useSession()
  const verifyStatus = session?.user?.verifyStatus
  const [jobData, setJobData] = React.useState<JobData | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [questions, setQuestions] = React.useState<ApplicationQuestion[]>([])
  const [quickEditOpen, setQuickEditOpen] = React.useState(false);
  const [showAllQuestions, setShowAllQuestions] = React.useState(false);
  const [jobMetrics, setJobMetrics] = React.useState<{
    views: number;
    total_applicants: number;
    qualified_applicants: number;
    interviews: number;
  }>({
    views: 0,
    total_applicants: 0,
    qualified_applicants: 0,
    interviews: 0,
  });
  const [activeTab, setActiveTab] = React.useState(initialTab || "overview");
  const analyticsRef = React.useRef<HTMLDivElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [hasApplications, setHasApplications] = React.useState<boolean | null>(null)
  const [checkingApplications, setCheckingApplications] = React.useState(false)
  const [matchQualityCounts, setMatchQualityCounts] = React.useState({
    excellent: 0,
    good: 0,
    fair: 0,
    poor: 0,
  });

  const employerId = (session?.user as { employerId?: string })?.employerId

  const checkForApplications = async () => {
    if (!selectedJob) return
    setCheckingApplications(true)
    try {
      const response = await fetch(`/api/job-listings/check-applications?job_id=${selectedJob}`)
      if (response.ok) {
        const data = await response.json()
        setHasApplications(data.hasApplications)
      }
    } catch (error) {
      console.error("Error checking applications:", error)
      setHasApplications(false)
    } finally {
      setCheckingApplications(false)
    }
  }

  const handleDeleteClick = async () => {
    await checkForApplications()
    setIsDeleteDialogOpen(true)
  }

  React.useEffect(() => {
    if (selectedJob == null) return
    setLoading(true)
    setError(null)
    
    Promise.all([
      fetch(`/api/job-listings/job-cards/${selectedJob}`).then(r => r.json()),
      fetch(`/api/job-listings/job-cards/${selectedJob}/questions`).then(r => r.json()),
      fetch(`/api/employers/job-metrics/${selectedJob}`)
        .then(r => {
          if (!r.ok) {
            return { views: 0, total_applicants: 0, qualified_applicants: 0, interviews: 0 }
          }
          return r.json()
        })
        .catch(() => {
          return { views: 0, total_applicants: 0, qualified_applicants: 0, interviews: 0 }
        }),
      fetch(`/api/employers/fetch-applicants/${selectedJob}/recent-applicants?limit=3`)
        .then(r => {
          if (!r.ok) {
            return []
          }
          return r.json()
        })
        .catch(() => {
          return []
        })
    ])
      .then(([job, questions, metrics]) => {
        console.log("Job data received:", job)
        setJobData({
          ...job,
          jobTitle: job.jobTitle || job.title || "",
          status: job.is_archived ? "Archived" : job.status,
          is_archived: job.is_archived ?? false,
        })
        setQuestions(Array.isArray(questions) ? questions : [])
        
        const finalMetrics = {
          views: Number(metrics.views) || 0,
          total_applicants: Number(metrics.total_applicants) || 0,
          qualified_applicants: Number(metrics.qualified_applicants) || 0,
          interviews: Number(metrics.interviews) || 0,
        }
        
        setJobMetrics(finalMetrics)
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load job details")
        setLoading(false)
      })
  }, [selectedJob])

  React.useEffect(() => {
    if (initialTab) setActiveTab(initialTab)
  }, [initialTab])

  React.useEffect(() => {
    if (!employerId || !selectedJob) return;
    fetch("/api/ai-matches/fetch-current-candidates", {
      method: "POST",
      body: JSON.stringify({ employer_id: employerId }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data.candidates)) return;
        const candidates = data.candidates.filter(
          (c: { job_id: any }) => String(c.job_id) === String(selectedJob)
        );
        let excellent = 0, good = 0, fair = 0, poor = 0;
        candidates.forEach((c: { gpt_score: any }) => {
          const score = Number(c.gpt_score);
          if (score >= 90) excellent++;
          else if (score >= 70) good++;
          else if (score >= 50) fair++;
          else poor++;
        });
        setMatchQualityCounts({ excellent, good, fair, poor });
      });
  }, [employerId, selectedJob]);

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

  
  const isArchived =
    jobData?.is_archived === true ||
    jobData?.status?.toLowerCase() === "archived"

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
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-gray-900 break-words whitespace-normal leading-snug">{jobData.jobTitle}</h1>
            {jobData.companyName && (
              <div className="text-sm text-gray-600 font-semibold mb-1">
                {jobData.companyName}
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-500 text-sm flex-wrap">
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
          <div className="flex flex-row flex-nowrap gap-2 shrink-0">
            <MuiTooltip title={isArchived ? "Disabled because this job is archived" : ""}>
              <span>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-blue-500 border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                  onClick={isArchived ? undefined : () => setQuickEditOpen(true)}
                  disabled={isArchived}
                  tabIndex={isArchived ? -1 : 0}
                  aria-disabled={isArchived}
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </span>
            </MuiTooltip>
            <MuiTooltip title={isArchived ? "Disabled because this job is archived" : ""}>
              <span>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-amber-500 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                  onClick={undefined}
                  disabled={isArchived}
                  tabIndex={isArchived ? -1 : 0}
                  aria-disabled={isArchived}
                >
                  <Pause className="h-4 w-4" />
                  Pause
                </Button>
              </span>
            </MuiTooltip>
            <MuiTooltip title={isArchived ? "Disabled because this job is archived" : hasApplications ? "You can't delete jobs with existing applications data" : ""}>
              <span>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-700"
                  onClick={isArchived || hasApplications ? undefined : handleDeleteClick}
                  disabled={isArchived || !!hasApplications}
                  tabIndex={isArchived ? -1 : 0}
                  aria-disabled={isArchived}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </span>
            </MuiTooltip>
            <MuiTooltip title={isArchived ? "Disabled because this job is archived" : ""}>
              <span>
  
              </span>
            </MuiTooltip>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applicants">Applicants</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <Eye className="h-5 w-5 text-blue-500 mb-1" />
                      <div className="text-2xl font-bold">{jobMetrics.views}</div>
                      <div className="text-xs text-gray-500">Views</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <Users className="h-5 w-5 text-indigo-500 mb-1" />
                      <div className="text-2xl font-bold">{jobMetrics.total_applicants}</div>
                      <div className="text-xs text-gray-500">Applicants</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <UserCheck className="h-5 w-5 text-green-500 mb-1" />
                      <div className="text-2xl font-bold">{jobMetrics.qualified_applicants}</div>
                      <div className="text-xs text-gray-500">Qualified</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-purple-500 mb-1" />
                      <div className="text-2xl font-bold">{jobMetrics.interviews}</div>
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
                          <div className="text-sm text-gray-500">
                            {jobData.payAmount && jobData.payAmount.trim() !== ""
                              ? `PHP ${jobData.payAmount}`
                              : "No Pay"}
                          </div>
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
                        {Array.isArray(jobData.responsibilities)
                          ? jobData.responsibilities.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))
                          : typeof jobData.responsibilities === "string"
                            ? JSON.parse(jobData.responsibilities).map((item: string, index: number) => (
                                <li key={index}>{item}</li>
                              ))
                            : null}
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
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Application Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {questions.length === 0 ? (
                      <div className="text-sm text-gray-500">No application questions.</div>
                    ) : (
                      <>
                        <div className="space-y-4">
                          {(showAllQuestions ? questions : questions.slice(0, 3)).map((q, idx) => {
                            let opts: string[] = [];
                            if (q.options) {
                              let parsedOptions: unknown = q.options;
                              if (typeof parsedOptions === "string") {
                                try {
                                  parsedOptions = JSON.parse(parsedOptions);
                                } catch {
                                  parsedOptions = [parsedOptions];
                                }
                              }
                              if (Array.isArray(parsedOptions)) {
                                if (parsedOptions.length > 0 && typeof parsedOptions[0] === "object" && parsedOptions[0] !== null && "option_value" in parsedOptions[0]) {
                                  opts = (parsedOptions as ApplicationQuestionOption[]).map(optObj => optObj.option_value);
                                } else {
                                  opts = parsedOptions as string[];
                                }
                              }
                            }
                            return (
                              <div key={q.id || idx} className="p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                                <div className="flex flex-col gap-2">
                                  <div className="font-medium text-gray-800">{q.question}</div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                      {q.type === "text"
                                        ? "Text"
                                        : q.type === "single"
                                          ? "Single select"
                                          : q.type === "multi"
                                            ? "Multi select"
                                            : "Yes/No"}
                                    </span>
                                    {q.auto_reject && (
                                      <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">Auto-reject</span>
                                    )}
                                  </div>
                                  {opts.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {opts.map((opt, i) => (
                                        <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{opt}</span>
                                      ))}
                                    </div>
                                  )}
                                  {q.auto_reject && q.correct_answer && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      <span className="text-xs text-red-500 font-semibold">Auto-reject criteria:</span>
                                      {(() => {
                                        let answers: string[];
    
                                        if (typeof q.correct_answer === 'string') {
                                          try {
                                            const parsed = JSON.parse(q.correct_answer);
                                            answers = Array.isArray(parsed) ? parsed : [parsed];
                                          } catch {
    
                                            answers = [q.correct_answer];
                                          }
                                        } else if (Array.isArray(q.correct_answer)) {
                                          answers = q.correct_answer;
                                        } else {
                                          answers = [];
                                        }
                                        
                                        return answers.map((ans, i) => (
                                          <span key={i} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                            {String(ans)}
                                          </span>
                                        ));
                                      })()}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {questions.length > 3 && (
                          <div className="mt-2 flex justify-center">
                            <Button variant="ghost" size="sm" onClick={() => setShowAllQuestions(v => !v)} className="text-blue-600 hover:text-blue-900">
                              {showAllQuestions ? "Show Less" : `Show More (${questions.length - 3} more)`}
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Applicant Funnel</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Applied</span>
                          <span className="font-medium">{jobMetrics.total_applicants}</span>
                        </div>
                        <LinearProgress variant="determinate" value={jobMetrics.total_applicants > 0 ? 100 : 0} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Qualified</span>
                          <span className="font-medium">{jobMetrics.qualified_applicants}</span>
                        </div>
                        <LinearProgress
                          variant="determinate"
                          value={
                            jobMetrics.total_applicants > 0
                              ? (jobMetrics.qualified_applicants / jobMetrics.total_applicants) * 100
                              : 0
                          }
                          className="h-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Interviewed</span>
                          <span className="font-medium">{jobMetrics.interviews}</span>
                        </div>
                        <LinearProgress
                          variant="determinate"
                          value={
                            jobMetrics.total_applicants > 0
                              ? (jobMetrics.interviews / jobMetrics.total_applicants) * 100
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
                    {verifyStatus !== "full" && (
                      <div className="flex flex-col items-center justify-center py-4">
                        <Lock className="text-blue-600 mb-2" style={{ fontSize: 40 }} />
                        <span className="text-blue-700 text-base font-semibold text-center">Verify to unlock Match Quality</span>
                      </div>
                    )}
                    <CardContent className="space-y-4" style={verifyStatus !== "full" ? { filter: "blur(6px)", pointerEvents: "none", userSelect: "none" } : {}}>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Excellent (90%+)
                          </span>
                          <span className="font-medium">{matchQualityCounts.excellent}</span>
                        </div>
                        <LinearProgress variant="determinate" value={matchQualityCounts.excellent} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            Good (70-89%)
                          </span>
                          <span className="font-medium">{matchQualityCounts.good}</span>
                        </div>
                        <LinearProgress variant="determinate" value={matchQualityCounts.good} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                            Fair (50-69%)
                          </span>
                          <span className="font-medium">{matchQualityCounts.fair}</span>
                        </div>
                        <LinearProgress variant="determinate" value={matchQualityCounts.fair} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            Poor (Below 50%)
                          </span>
                          <span className="font-medium">{matchQualityCounts.poor}</span>
                        </div>
                        <LinearProgress variant="determinate" value={matchQualityCounts.poor} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="applicants" className="mt-6">
            <ApplicantsTab jobId={selectedJob ? String(selectedJob) : ""} isArchived={isArchived} />
          </TabsContent>
          <TabsContent value="analytics" className="mt-6" ref={analyticsRef}>
            <JobAnalytics 
              jobId={selectedJob ? String(selectedJob) : undefined} 
              employerId={employerId}
            />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <JobSettings jobId={selectedJob ? String(selectedJob) : ""} companyName={jobData.companyName} onSuccess={() => {
              if (onSuccess) onSuccess()
              onClose()
            }} />
          </TabsContent>
        </Tabs>
      </div>
      <QuickEditModal
        open={quickEditOpen}
        draftData={{
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
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle className={hasApplications ? "text-red-600 font-bold" : ""}>
          {hasApplications ? "Cannot Delete Job with Applications" : "Are you absolutely sure?"}
        </DialogTitle>
        <DialogContent className={hasApplications ? "bg-white" : ""}>
          {checkingApplications ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-red-500" />
              <span className="ml-2">Checking for applications...</span>
            </div>
          ) : hasApplications ? (
            <DialogContentText className="text-red-800 font-medium">
              This job listing has existing applications and cannot be deleted. You can archive it instead to preserve all data while hiding it from active listings.
            </DialogContentText>
          ) : (
            <DialogContentText>
              This action cannot be undone. This will permanently delete the job listing and all associated
              data including messages, and analytics.
            </DialogContentText>
          )}
          {!checkingApplications && (
            <div className="py-4">
              <div className={`flex items-start gap-4 p-4 rounded-lg border-2 ${
                hasApplications 
                  ? 'bg-red-100 border-red-300' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {hasApplications ? (
                  <MdBlock className="h-6 w-6 mt-0.5 text-red-700" />
                ) : (
                  <MdWarningAmber className="h-6 w-6 mt-0.5 text-red-600" />
                )}
                <div className={`text-sm ${
                  hasApplications ? 'text-red-800' : 'text-red-700'
                }`}>
                  <p className="font-bold text-base mb-2">
                    {hasApplications ? 'Deletion Blocked!' : 'Warning:'}
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 font-medium">
                    {hasApplications ? (
                      <>
                        <li>This job has active applications and cannot be deleted</li>
                        <li>Archive this job to preserve all application data</li>
                        <li>Applications will remain accessible for review</li>
                        <li>Job will be hidden from public listings</li>
                        <li>You can repost the job anytime, but it will start fresh.</li>
                      </>
                    ) : (
                      <>
                                  <li>All job data will be permanently deleted</li>
                                  <li>All messages and communication history will be lost</li>
                                  <li>All analytics and reporting data will be removed</li>
                                  <li>This action CANNOT be reversed</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions className={hasApplications ? "bg-red-50" : ""}>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          {hasApplications ? (
            <Button
              variant="default"
              className="bg-red-600 hover:bg-red-700 text-white  flex items-center gap-2"
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setActiveTab("settings")
              }}
            >
              <MdLock className="h-4 w-4" />
              Understood
            </Button>
          ) : (
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={async () => {
                if (selectedJob) {
                  try {
                    const res = await fetch(`/api/job-listings/${selectedJob}/delete`, {
                      method: "PATCH",
                    })
                    if (res.ok) {
                      toast.success("Job deleted", {
                        duration: 6000,
                        style: { fontSize: "1.15rem", minWidth: "260px", padding: "18px 24px" },
                      })
                      setIsDeleteDialogOpen(false)
                      if (typeof onSuccess === "function") onSuccess()
                      onClose()
                    } else {
                      toast.error("Failed to delete job", {
                        duration: 6000,
                        style: { fontSize: "1.15rem", minWidth: "260px", padding: "18px 24px" },
                      })
                    }
                  } catch {
                    toast.error("Error deleting job", {
                      duration: 6000,
                      style: { fontSize: "1.15rem", minWidth: "260px", padding: "18px 24px" },
                    })
                  }
                }
              }}
              disabled={checkingApplications}
            >
              {checkingApplications ? (
                <span className="w-4 h-4 border-2 border-white border-t-red-200 rounded-full animate-spin inline-block" />
              ) : (
                "Delete Permanently"
              )}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  )
}

