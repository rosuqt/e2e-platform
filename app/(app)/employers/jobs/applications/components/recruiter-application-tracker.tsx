"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  Search,
  Calendar,
  MapPin,
  ChevronDown,
  FileText,
  Bookmark,
  Filter,
  MoreHorizontal,
  ArrowUpRight,
  ChevronRight,
  Briefcase,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RecruiterApplicationDetailsModal } from "./recruiter-application-details"
import { toast } from "react-toastify"
import Avatar from "@mui/material/Avatar"

export default function RecruiterApplicationTracker() {
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalApplicationId, setModalApplicationId] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)
  type Applicant = {
    application_id: string
    job_id: string
    job_title?: string
    status?: string
    first_name?: string
    last_name?: string
    address?: string
    experience_years?: string
  }

  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([])
  const [jobPostings, setJobPostings] = useState<{ id: string; title: string }[]>([])
  const [selectedJob, setSelectedJob] = useState<{ id: string; title: string } | null>(null)
  const [tab, setTab] = useState("all")
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)

  useEffect(() => {
    fetch("/api/employers/applications")
      .then(res => res.json())
      .then(data => {
        setApplicants((data.applicants as Applicant[]) || [])
        const jobs = Array.from(
          new Map(
            ((data.applicants as Applicant[]) || []).map((a) => [
              a.job_id,
              { id: a.job_id, title: a.job_title || "Job Posting" },
            ])
          ).values()
        )
        setJobPostings([{ id: "all", title: "All Job Postings" }, ...jobs])
        setSelectedJob({ id: "all", title: "All Job Postings" })
      })
  }, [])

  useEffect(() => {
    if (selectedJob?.id === "all") {
      setFilteredApplicants(applicants)
    } else {
      setFilteredApplicants(applicants.filter(a => a.job_id === selectedJob?.id))
    }
  }, [selectedJob, applicants])

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current && scrollContainerRef.current.scrollTop > 50) {
        setIsHeaderCollapsed(true)
      } else {
        setIsHeaderCollapsed(false)
      }
    }
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll)
      return () => scrollContainer.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleViewDetails = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const applicant = applicants.find(a => a.application_id === id)
    setSelectedApplicant(applicant || null)
    setIsModalOpen(true)
  }

  const handleInviteToInterview = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    toast.success("Interview invitation sent successfully!")
  }

  const totalApplicants = filteredApplicants.length
  const newApplicants = filteredApplicants.filter(a => a.status === "new").length

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
        <div className="container mx-auto p-4">
          <div className="mb-6">
            <div
              className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl shadow-xl text-white mb-4 relative overflow-hidden transition-all duration-300"
              style={{
                padding: isHeaderCollapsed ? "16px" : "32px",
              }}
            >
              <div
                className="transition-all duration-300 overflow-hidden"
                style={{
                  maxHeight: isHeaderCollapsed ? "0" : "200px",
                  opacity: isHeaderCollapsed ? 0 : 1,
                  marginBottom: isHeaderCollapsed ? 0 : 16,
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold relative z-10">Applicant Tracking</h2>
                    <p className="text-blue-100 text-sm relative z-10 mt-2">
                      Manage and review all applicants for your job postings
                    </p>
                  </div>
                  <div>
                    <select
                      className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-white border border-white/30"
                      value={selectedJob?.id || ""}
                      onChange={(e) => {
                        const job = jobPostings.find((j) => j.id === e.target.value)
                        if (job) setSelectedJob(job)
                      }}
                    >
                      {jobPostings.map((job) => (
                        <option key={job.id} value={job.id} className="text-gray-800">
                          {job.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 mt-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                    <p className="text-xs text-white/80">Total Applicants</p>
                    <p className="text-xl font-bold text-white">{totalApplicants}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                    <p className="text-xs text-white/80">New Today</p>
                    <p className="text-xl font-bold text-white">{newApplicants}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                    <p className="text-xs text-white/80">Interviews Scheduled</p>
                    <p className="text-xl font-bold text-white">8</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                    <p className="text-xs text-white/80">Offers Extended</p>
                    <p className="text-xl font-bold text-white">2</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-2 flex flex-col sm:flex-row relative z-10">
                <Input
                  type="text"
                  placeholder="Search applicants by name, skills, or experience"
                  className="border-0 text-black focus-visible:ring-0 focus-visible:ring-offset-0 mb-1 sm:mb-0"
                />
                <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-2/3" ref={scrollContainerRef}>
              <Card className="shadow-sm border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="mb-2 text-blue-700 text-xl">Your Applicants</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={tab} onValueChange={setTab} className="w-full">
                    <TabsList className="flex w-full border-b border-gray-200">
                      <TabsTrigger value="all" className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent hover:text-blue-600 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600">
                        All
                      </TabsTrigger>
                      <TabsTrigger value="new" className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent hover:text-blue-600 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600">
                        New
                      </TabsTrigger>
                      <TabsTrigger value="review" className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent hover:text-blue-600 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600">
                        Under Review
                      </TabsTrigger>
                      <TabsTrigger value="interview" className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent hover:text-blue-600 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600">
                        Interview
                      </TabsTrigger>
                      <TabsTrigger value="invited" className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent hover:text-blue-600 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600">
                        Invited
                      </TabsTrigger>
                      <TabsTrigger value="rejected" className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent hover:text-blue-600 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600">
                        Rejected
                      </TabsTrigger>
                    </TabsList>

                    <div className="mt-3 text-sm flex items-center gap-2 relative z-10">
                      <span>Sort by:</span>
                      <button className="bg-blue-600/30 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-blue-600/50 transition-colors">
                        Match Score
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      <button className="bg-white px-3 py-1 rounded-full text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 flex items-center gap-1">
                        <Filter className="h-3 w-3" />
                        Filters
                      </button>
                    </div>

                    <TabsContent value="all" className="mt-4 space-y-4">
                      {filteredApplicants.map(app =>
                        <ApplicantCard
                          key={app.application_id}
                          applicant={app}
                          selected={selectedApplication === app.application_id}
                          setSelected={() => setSelectedApplication(app.application_id)}
                          handleViewDetails={handleViewDetails}
                          handleInviteToInterview={handleInviteToInterview}
                        />
                      )}
                    </TabsContent>
                    <TabsContent value="new" className="mt-4 space-y-4">
                      {filteredApplicants.filter(a => a.status === "new").map(app =>
                        <ApplicantCard
                          key={app.application_id}
                          applicant={app}
                          selected={selectedApplication === app.application_id}
                          setSelected={() => setSelectedApplication(app.application_id)}
                          handleViewDetails={handleViewDetails}
                          handleInviteToInterview={handleInviteToInterview}
                        />
                      )}
                    </TabsContent>
                    <TabsContent value="review" className="mt-4 space-y-4">
                      {filteredApplicants.filter(a => a.status === "review").map(app =>
                        <ApplicantCard
                          key={app.application_id}
                          applicant={app}
                          selected={selectedApplication === app.application_id}
                          setSelected={() => setSelectedApplication(app.application_id)}
                          handleViewDetails={handleViewDetails}
                          handleInviteToInterview={handleInviteToInterview}
                        />
                      )}
                    </TabsContent>
                    <TabsContent value="interview" className="mt-4 space-y-4">
                      {filteredApplicants.filter(a => a.status === "interview").map(app =>
                        <ApplicantCard
                          key={app.application_id}
                          applicant={app}
                          selected={selectedApplication === app.application_id}
                          setSelected={() => setSelectedApplication(app.application_id)}
                          handleViewDetails={handleViewDetails}
                          handleInviteToInterview={handleInviteToInterview}
                        />
                      )}
                    </TabsContent>
                    <TabsContent value="invited" className="mt-4 space-y-4">
                      {filteredApplicants.filter(a => a.status === "invited").map(app =>
                        <ApplicantCard
                          key={app.application_id}
                          applicant={app}
                          selected={selectedApplication === app.application_id}
                          setSelected={() => setSelectedApplication(app.application_id)}
                          handleViewDetails={handleViewDetails}
                          handleInviteToInterview={handleInviteToInterview}
                        />
                      )}
                    </TabsContent>
                    <TabsContent value="rejected" className="mt-4 space-y-4">
                      {filteredApplicants.filter(a => a.status === "rejected").map(app =>
                        <ApplicantCard
                          key={app.application_id}
                          applicant={app}
                          selected={selectedApplication === app.application_id}
                          setSelected={() => setSelectedApplication(app.application_id)}
                          handleViewDetails={handleViewDetails}
                          handleInviteToInterview={handleInviteToInterview}
                        />
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div className="w-full lg:w-1/3 space-y-6">
              <Card className="shadow-sm border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: "Alex Johnson",
                        position: "Frontend Developer",
                        update: "Submitted application",
                        time: "2 hours ago",
                        icon: <FileText className="h-4 w-4 text-white" />,
                        iconBg: "bg-green-500",
                      },
                      {
                        name: "Sarah Williams",
                        position: "Frontend Developer",
                        update: "Accepted interview invitation",
                        time: "1 day ago",
                        icon: <CheckCircle className="h-4 w-4 text-white" />,
                        iconBg: "bg-blue-500",
                      },
                      {
                        name: "Michael Chen",
                        position: "Frontend Developer",
                        update: "Completed technical assessment",
                        time: "2 days ago",
                        icon: <FileText className="h-4 w-4 text-white" />,
                        iconBg: "bg-yellow-500",
                      },
                    ].map((update, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="relative">
                          <div className={`w-8 h-8 rounded-full ${update.iconBg} flex items-center justify-center`}>
                            {update.icon}
                          </div>
                          {update.time.includes("hours") && index < 1 ? (
                            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                          ) : null}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{update.name}</p>
                          <p className="text-xs text-gray-500">{update.position}</p>
                          <p className="text-xs font-medium text-blue-600 mt-1">{update.update}</p>
                          <p className="text-xs text-gray-400 mt-1">{update.time}</p>
                        </div>
                        <button className="text-gray-400 hover:text-blue-500">
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    Top 3 Highest Match Applicants
                    <Badge className="ml-2 bg-green-500 text-white text-xs">95%+ Match</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        name: "Alex Johnson",
                        title: "Senior Frontend Developer",
                        match: "98%",
                        skills: ["React", "TypeScript", "Next.js"],
                        experience: "5 years",
                      },
                      {
                        name: "Emily Zhang",
                        title: "Frontend Engineer",
                        match: "97%",
                        skills: ["React", "JavaScript", "CSS"],
                        experience: "4 years",
                      },
                      {
                        name: "Michael Brown",
                        title: "UI Developer",
                        match: "95%",
                        skills: ["React", "Tailwind", "TypeScript"],
                        experience: "3 years",
                      },
                    ].map((candidate, index) => (
                      <div
                        key={index}
                        className="border border-green-100 rounded-lg p-3 hover:bg-green-50 transition-colors"
                      >
                        <div className="flex gap-3 items-start">
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              fontWeight: "bold",
                              bgcolor: "#DCFCE7",
                              color: "#15803D",
                              fontSize: 22,
                            }}
                          >
                            {candidate.name.charAt(0)}
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <p className="font-medium text-gray-800">{candidate.name}</p>
                              <Badge className="bg-green-100 text-green-700">{candidate.match} Match</Badge>
                            </div>
                            <p className="text-xs text-gray-500">{candidate.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{candidate.experience} experience</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {candidate.skills.map((skill, i) => (
                                <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" className="bg-blue-600 text-xs flex-1">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 text-xs flex-1">
                            Invite to Interview
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <RecruiterApplicationDetailsModal
          applicant={selectedApplicant}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </div>
    </>
  )
}

function ApplicantCard({
  applicant,
  selected,
  setSelected,
  handleViewDetails,
  handleInviteToInterview,
}: {
  applicant: {
    application_id: string
    job_id: string
    job_title?: string
    status?: string
    first_name?: string
    last_name?: string
    address?: string
    experience_years?: string

  }
  selected: boolean 
  setSelected: () => void
  handleViewDetails: (id: string, e: React.MouseEvent) => void
  handleInviteToInterview: (id: string, e: React.MouseEvent) => void
}) {

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-5 border-l-4 ${
        selected ? "border-l-blue-500 border-blue-200" : "border-l-yellow-500 border-gray-200"
      } relative overflow-hidden cursor-pointer`}
      onClick={() => setSelected()}
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <Avatar sx={{ width: 48, height: 48, fontWeight: "bold", bgcolor: "#DBEAFE", color: "#2563EB", fontSize: 22 }}>
            {applicant.first_name?.charAt(0) || "A"}
          </Avatar>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-lg text-gray-800">
                {applicant.first_name} {applicant.last_name}
              </h3>
              <Badge className="bg-yellow-100 text-yellow-700">{applicant.status || "New"}</Badge>
            </div>
            <p className="text-sm text-gray-500">
              Applied for {applicant.job_title || "Job"}
            </p>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3 w-3" />
                <span>{applicant.address}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Briefcase className="h-3 w-3" />
                <span>{applicant.experience_years} experience</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>Applied</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <Badge className="bg-green-100 text-green-700">Match</Badge>
          <button className="text-gray-400 hover:text-blue-500 transition-colors p-1.5 rounded-full hover:bg-blue-50" onClick={e => e.stopPropagation()}>
            <Bookmark className="h-4 w-4" />
          </button>
          <button className="text-gray-400 hover:text-blue-500 transition-colors p-1.5 rounded-full hover:bg-blue-50" onClick={e => e.stopPropagation()}>
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          {applicant.status === "new" ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs"
                onClick={e => {
                  e.stopPropagation()
                  setSelected()
                  handleViewDetails(applicant.application_id, e)
                }}
              >
                View Details
              </Button>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-xs"
                onClick={e => {
                  e.stopPropagation()
                  // Review action placeholder
                }}
              >
                Review
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-green-700 border-green-200 hover:bg-green-50 text-xs"
                onClick={e => {
                  e.stopPropagation()
                  // Shortlist action placeholder
                }}
              >
                Shortlist
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs"
                onClick={e => {
                  e.stopPropagation()
                  setSelected()
                  handleViewDetails(applicant.application_id, e)
                }}
              >
                View Details
              </Button>
              {(applicant.status === "review") && (
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs" onClick={e => handleInviteToInterview(applicant.application_id, e)}>
                  Invite to Interview
                </Button>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">
            {applicant.status === "new"
              ? "New application"
              : applicant.status === "review"
              ? "In review"
              : applicant.status === "interview"
              ? "Interview phase"
              : applicant.status === "invited"
              ? "Invitation sent"
              : "Not selected"}
          </span>
          <ArrowUpRight className="h-3 w-3 text-gray-600" />
        </div>
      </div>
    </div>
  )
}
