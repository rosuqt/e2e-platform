"use client"

import Image from "next/image"
import {
  Users,
  Clock,
  Calendar,
  DollarSign,
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LinearProgress } from "@mui/material"
import Chip from "@mui/material/Chip"
import ApplicantsTab from "./applicants-tab"
import JobAnalytics from "./analytics-tab"
import JobSettings from "./settings-tab"

export default function EmployerJobOverview({ selectedJob, onClose }: { selectedJob: number | null; onClose: () => void }) {
  const jobData = {
    id: selectedJob,
    title: "UI/UX Designer",
    company: "Fb Mark-it Place",
    logo: "M",
    logoColor: "bg-red-500",
    location: "San Jose Del Monte, Pampanga",
    salary: "₱800 / day",
    type: "OJT",
    posted: "3 days ago",
    closing: "2 days left",
    status: "Active",
    statusColor: "bg-green-100 text-green-600",
    description:
      "Seeking a creative UI/UX Designer to craft intuitive and visually engaging user experiences. You will design user-friendly interfaces that enhance functionality and aesthetics.",
    requirements: [
      "1+ year of experience with UI/UX design",
      "Proficiency in Figma, Adobe XD",
      "Strong portfolio showcasing UI/UX projects",
      "Knowledge of user research and testing",
    ],
    responsibilities: [
      "Design user-friendly interfaces that enhance functionality and aesthetics.",
      "Collaborate with cross-functional teams to define, design, and ship new features.",
      "Conduct user research and usability testing to improve user experience.",
      "Create wireframes, prototypes, and high-fidelity designs.",
    ],
    mustHave: [
      "1+ year of experience with UI/UX design.",
      "Proficiency in Figma, Adobe XD.",
      "Strong portfolio showcasing UI/UX projects.",
      "Knowledge of user research and testing.",
    ],
    niceToHave: [
      "Experience with motion design and animations.",
      "Familiarity with front-end development (HTML, CSS, JavaScript).",
      "Knowledge of accessibility standards and best practices.",
    ],
    applicationQuestions: [
      "How many years of experience do you have in UI/UX design?",
      "Can you provide a link to your portfolio?",
      "Do you have experience with Figma or Adobe XD?",
    ],
    perksAndBenefits: [
      "Remote work flexibility.",
      "Competitive salary and bonuses.",
      "Access to learning and development resources.",
      "Health and wellness benefits.",
    ],
    stats: {
      views: 423,
      applicants: 23,
      qualified: 15,
      interviews: 7,
      hired: 0,
      rejected: 5,
      pending: 11,
    },
    matchRate: {
      excellent: 5,
      good: 8,
      fair: 7,
      poor: 3,
    },
  }

  return (
    <div className="p-6 max-h-screen overflow-y-auto overflow-y-auto relative ">
      {/* Close button at the top-right */}
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        onClick={onClose}
        aria-label="Close"
      >
        ✕
      </button>

      <div className="container mx-auto py-6 max-w-7xl">
        {/* Header with actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{jobData.title}</h1>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <span>{jobData.company}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {jobData.location}
              </span>
              <span>•</span>
              <Chip
                label={jobData.status}
                className={`${jobData.statusColor}`}
                variant="outlined"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-1">
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

        {/* Job overview tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applicants">Applicants</TabsTrigger>
            <TabsTrigger value="analytics" disabled={selectedJob === null}>Analytics</TabsTrigger>
            <TabsTrigger value="settings" disabled={selectedJob === null}>Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left column - Job details */}
              <div className="md:col-span-2 space-y-6">
                {/* Stats cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <Eye className="h-5 w-5 text-blue-500 mb-1" />
                      <div className="text-2xl font-bold">{jobData.stats.views}</div>
                      <div className="text-xs text-gray-500">Views</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <Users className="h-5 w-5 text-indigo-500 mb-1" />
                      <div className="text-2xl font-bold">{jobData.stats.applicants}</div>
                      <div className="text-xs text-gray-500">Applicants</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <UserCheck className="h-5 w-5 text-green-500 mb-1" />
                      <div className="text-2xl font-bold">{jobData.stats.qualified}</div>
                      <div className="text-xs text-gray-500">Qualified</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-purple-500 mb-1" />
                      <div className="text-2xl font-bold">{jobData.stats.interviews}</div>
                      <div className="text-xs text-gray-500">Interviews</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Job details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Job Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium">Job Type</div>
                          <div className="text-sm text-gray-500">{jobData.type}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium">Salary</div>
                          <div className="text-sm text-gray-500">{jobData.salary}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium">Posted</div>
                          <div className="text-sm text-gray-500">{jobData.posted}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium">Closing</div>
                          <div className="text-sm text-gray-500">{jobData.closing}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Description</h3>
                      <p className="text-sm text-gray-500">{jobData.description}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Requirements</h3>
                      <ul className="text-sm text-gray-500 list-disc pl-5 space-y-1">
                        {jobData.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Responsibilities</h3>
                      <ul className="text-sm text-gray-500 list-disc pl-5 space-y-1">
                        {jobData.responsibilities.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Must-Have</h3>
                      <ul className="text-sm text-gray-500 list-disc pl-5 space-y-1">
                        {jobData.mustHave.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Nice-to-Haves</h3>
                      <ul className="text-sm text-gray-500 list-disc pl-5 space-y-1">
                        {jobData.niceToHave.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Application Questions</h3>
                      <ul className="text-sm text-gray-500 list-disc pl-5 space-y-1">
                        {jobData.applicationQuestions.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Perks and Benefits</h3>
                      <ul className="text-sm text-gray-500 list-disc pl-5 space-y-1">
                        {jobData.perksAndBenefits.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent applicants */}
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
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <Image
                                src={`/placeholder.svg?height=40&width=40&text=A${applicant}`}
                                alt="Applicant"
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            </div>
                            <div>
                              <div className="text-sm font-medium">Applicant {applicant}</div>
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

              {/* Right column - Sidebar */}
              <div className="space-y-6">
                {/* Applicant funnel */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Applicant Funnel</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Applied</span>
                        <span className="font-medium">{jobData.stats.applicants}</span>
                      </div>
                      <LinearProgress variant="determinate" value={100} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Qualified</span>
                        <span className="font-medium">{jobData.stats.qualified}</span>
                      </div>
                      <LinearProgress
                        variant="determinate"
                        value={(jobData.stats.qualified / jobData.stats.applicants) * 100}
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Interviewed</span>
                        <span className="font-medium">{jobData.stats.interviews}</span>
                      </div>
                      <LinearProgress
                        variant="determinate"
                        value={(jobData.stats.interviews / jobData.stats.applicants) * 100}
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Hired</span>
                        <span className="font-medium">{jobData.stats.hired}</span>
                      </div>
                      <LinearProgress
                        variant="determinate"
                        value={(jobData.stats.hired / jobData.stats.applicants) * 100}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Match quality */}
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
                        <span className="font-medium">{jobData.matchRate.excellent}</span>
                      </div>
                      <LinearProgress
                        variant="determinate"
                        value={(jobData.matchRate.excellent / jobData.stats.applicants) * 100}
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          Good (70-89%)
                        </span>
                        <span className="font-medium">{jobData.matchRate.good}</span>
                      </div>
                      <LinearProgress
                        variant="determinate"
                        value={(jobData.matchRate.good / jobData.stats.applicants) * 100}
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                          Fair (50-69%)
                        </span>
                        <span className="font-medium">{jobData.matchRate.fair}</span>
                      </div>
                      <LinearProgress
                        variant="determinate"
                        value={(jobData.matchRate.fair / jobData.stats.applicants) * 100}
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          Poor (Below 50%)
                        </span>
                        <span className="font-medium">{jobData.matchRate.poor}</span>
                      </div>
                      <LinearProgress
                        variant="determinate"
                        value={(jobData.matchRate.poor / jobData.stats.applicants) * 100}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Quick actions */}
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
            {typeof jobData.id === "number" ? (
              <JobSettings jobId={jobData.id} />
            ) : (
              <div>No settings available for this job.</div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
