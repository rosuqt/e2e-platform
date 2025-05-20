"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Users,
  Search,
  Calendar,
  MapPin,
  ChevronDown,
  FileText,
  Bookmark, // add Bookmark icon
  Filter,
  MoreHorizontal,
  ArrowUpRight,
  ChevronRight,
  Briefcase,
  CheckCircle,
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RecruiterApplicationDetailsModal } from "./recruiter-application-details"
import { toast } from "react-toastify"
import Avatar from "@mui/material/Avatar"

export default function RecruiterApplicationTracker() {
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalApplicationId, setModalApplicationId] = useState<number | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)

  const jobPostings = [
    {
      id: 0,
      title: "All Job Postings",
      department: "",
      location: "",
      applicants: 144,
      newApplicants: 35,
      active: true,
    },
    {
      id: 1,
      title: "Frontend Developer",
      department: "Engineering",
      location: "Remote",
      applicants: 45,
      newApplicants: 12,
      active: true,
    },
    {
      id: 2,
      title: "UI/UX Designer",
      department: "Design",
      location: "On-site",
      applicants: 32,
      newApplicants: 8,
      active: true,
    },
    {
      id: 3,
      title: "Software Engineer",
      department: "Engineering",
      location: "Hybrid",
      applicants: 67,
      newApplicants: 15,
      active: true,
    },
  ]

  const [selectedJob, setSelectedJob] = useState(jobPostings[0])

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

  const handleViewDetails = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setModalApplicationId(id)
    setIsModalOpen(true)
  }

  const handleInviteToInterview = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    toast.success("Interview invitation sent successfully!")
  }

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
                      value={selectedJob.id}
                      onChange={(e) => {
                        const job = jobPostings.find((j) => j.id === Number.parseInt(e.target.value))
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
                    <p className="text-xl font-bold text-white">{selectedJob.applicants}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                    <p className="text-xs text-white/80">New Today</p>
                    <p className="text-xl font-bold text-white">{selectedJob.newApplicants}</p>
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
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="flex w-full border-b border-gray-200">
                      <TabsTrigger
                        value="all"
                        className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent hover:text-blue-600 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600"
                      >
                        All
                      </TabsTrigger>
                      <TabsTrigger
                        value="new"
                        className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent hover:text-blue-600 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600"
                      >
                        New
                      </TabsTrigger>
                      <TabsTrigger
                        value="review"
                        className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent hover:text-blue-600 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600"
                      >
                        Under Review
                      </TabsTrigger>
                      <TabsTrigger
                        value="interview"
                        className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent hover:text-blue-600 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600"
                      >
                        Interview
                      </TabsTrigger>
                      <TabsTrigger
                        value="invited"
                        className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent hover:text-blue-600 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600"
                      >
                        Invited
                      </TabsTrigger>
                      <TabsTrigger
                        value="rejected"
                        className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent hover:text-blue-600 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600"
                      >
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
                      {generateApplicantCards(
                        5,
                        "all",
                        selectedApplication,
                        setSelectedApplication,
                        handleViewDetails,
                        handleInviteToInterview,
                      )}
                    </TabsContent>
                    <TabsContent value="new" className="mt-4 space-y-4">
                      {generateApplicantCards(
                        5,
                        "new",
                        selectedApplication,
                        setSelectedApplication,
                        handleViewDetails,
                        handleInviteToInterview,
                      )}
                    </TabsContent>
                    <TabsContent value="review" className="mt-4 space-y-4">
                      {generateApplicantCards(
                        5,
                        "review",
                        selectedApplication,
                        setSelectedApplication,
                        handleViewDetails,
                        handleInviteToInterview,
                      )}
                    </TabsContent>
                    <TabsContent value="interview" className="mt-4 space-y-4">
                      {generateApplicantCards(
                        5,
                        "interview",
                        selectedApplication,
                        setSelectedApplication,
                        handleViewDetails,
                        handleInviteToInterview,
                      )}
                    </TabsContent>
                    <TabsContent value="invited" className="mt-4 space-y-4">
                      {generateApplicantCards(
                        5,
                        "invited",
                        selectedApplication,
                        setSelectedApplication,
                        handleViewDetails,
                        handleInviteToInterview,
                      )}
                    </TabsContent>
                    <TabsContent value="rejected" className="mt-4 space-y-4">
                      {generateApplicantCards(
                        4,
                        "rejected",
                        selectedApplication,
                        setSelectedApplication,
                        handleViewDetails,
                        handleInviteToInterview,
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
                  <CardTitle>Upcoming Interviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="border border-blue-100 rounded-lg p-3 hover:bg-blue-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">Sarah Williams</p>
                          <p className="text-xs text-gray-500">Frontend Developer Position</p>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-none">Tomorrow</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>May 12, 2025 • 10:00 AM</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Users className="h-3 w-3" />
                        <span>John Smith, Technical Lead</span>
                      </div>
                      <div className="mt-3">
                        <Button size="sm" className="bg-blue-600 text-xs w-full">
                          View Interview Details
                        </Button>
                      </div>
                    </div>

                    <div className="border border-blue-100 rounded-lg p-3 hover:bg-blue-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">David Lee</p>
                          <p className="text-xs text-gray-500">Frontend Developer Position</p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-700 border-none">3 Days</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>May 15, 2025 • 2:00 PM</span>
                      </div>
                      <div className="mt-3">
                        <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 text-xs w-full">
                          Reschedule
                        </Button>
                      </div>
                    </div>
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
          applicationId={modalApplicationId}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </div>
    </>
  )
}

function generateApplicantCards(
  count: number,
  status: string,
  selectedApplication: number | null,
  setSelectedApplication: (id: number | null) => void,
  handleViewDetails: (id: number, e: React.MouseEvent) => void,
  handleInviteToInterview: (id: number, e: React.MouseEvent) => void,
) {
  const statusConfig = {
    all: { title: "Mixed", badge: "" },
    new: { title: "New", badge: "bg-yellow-100 text-yellow-700" },
    review: { title: "Under Review", badge: "bg-blue-100 text-blue-700" },
    interview: { title: "Interview", badge: "bg-purple-100 text-purple-700" },
    invited: { title: "Invited", badge: "bg-green-100 text-green-700" },
    rejected: { title: "Rejected", badge: "bg-red-100 text-red-700" },
  }

  const names = [
    "Alex Johnson",
    "Sarah Williams",
    "Michael Chen",
    "Emily Zhang",
    "David Lee",
    "Jessica Brown",
    "Ryan Garcia",
    "Olivia Martinez",
  ]

  const jobTitles = [
    "Frontend Developer",
    "UI/UX Designer",
    "Software Engineer",
    "Frontend Engineer",
    "Full Stack Developer",
    "Web Developer",
    "JavaScript Developer",
    "React Developer",
  ]

  const locations = ["Remote", "San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX", "Boston, MA"]
  const experiences = ["2 years", "3 years", "4 years", "5 years", "6 years", "7+ years"]
  const matchScores = ["98%", "95%", "92%", "89%", "87%", "85%", "82%", "78%"]

  return Array.from({ length: count }).map((_, index) => {
    const id = index + 1
    let cardStatus = status
    if (status === "all") {
      const statuses = ["new", "review", "interview", "invited", "rejected"]
      cardStatus = statuses[index % statuses.length]
    }

    const badgeClass = statusConfig[cardStatus as keyof typeof statusConfig].badge

    const daysAgo = index + 1
    const applicationDate = new Date()
    applicationDate.setDate(applicationDate.getDate() - daysAgo)
    const formattedDate = applicationDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })

    return (
      <motion.div
        key={id}
        className={`bg-white rounded-lg shadow-sm p-5 border-l-4 ${
          selectedApplication === id
            ? "border-l-blue-500 border-blue-200"
            : cardStatus === "invited"
              ? "border-l-green-500 border-gray-200"
              : cardStatus === "rejected"
                ? "border-l-red-500 border-gray-200"
                : cardStatus === "interview"
                  ? "border-l-purple-500 border-gray-200"
                  : cardStatus === "review"
                    ? "border-l-blue-500 border-gray-200"
                    : "border-l-yellow-500 border-gray-200"
        } relative overflow-hidden`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{
          y: -2,
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
        onClick={() => setSelectedApplication(id === selectedApplication ? null : id)}
      >
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <Avatar
              sx={{
                width: 48,
                height: 48,
                fontWeight: "bold",
                bgcolor:
                  index % 3 === 0
                    ? "#DBEAFE"
                    : index % 3 === 1
                      ? "#DCFCE7"
                      : "#F3E8FF",
                color:
                  index % 3 === 0
                    ? "#2563EB"
                    : index % 3 === 1
                      ? "#15803D"
                      : "#9333EA",
                border: "1px solid #E5E7EB",
                fontSize: 22,
              }}
            >
              {names[index % names.length].charAt(0)}
            </Avatar>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-lg text-gray-800">{names[index % names.length]}</h3>
                <Badge className={badgeClass}>
                  {cardStatus === "new"
                    ? "New"
                    : cardStatus === "review"
                      ? "Under Review"
                      : cardStatus === "interview"
                        ? "Interview"
                        : cardStatus === "invited"
                          ? "Invited"
                          : "Rejected"}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                Applied for {jobTitles[index % jobTitles.length]}
              </p>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" />
                  <span>{locations[index % locations.length]}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Briefcase className="h-3 w-3" />
                  <span>{experiences[index % experiences.length]}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>Applied {formattedDate}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <Badge className="bg-green-100 text-green-700">{matchScores[index % matchScores.length]} Match</Badge>
            <button
              className="text-gray-400 hover:text-blue-500 transition-colors p-1.5 rounded-full hover:bg-blue-50"
              onClick={(e) => e.stopPropagation()}
            >
              <Bookmark className="h-4 w-4" /> {/* Use Bookmark icon */}
            </button>
            <button
              className="text-gray-400 hover:text-blue-500 transition-colors p-1.5 rounded-full hover:bg-blue-50"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs"
              onClick={(e) => handleViewDetails(id, e)}
            >
              View Profile
            </Button>
            {cardStatus === "new" && (
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs" onClick={(e) => e.stopPropagation()}>
                Review
              </Button>
            )}
            {(cardStatus === "new" || cardStatus === "review") && (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-xs"
                onClick={(e) => handleInviteToInterview(id, e)}
              >
                Invite to Interview
              </Button>
            )}
            {cardStatus === "interview" && (
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                Schedule
              </Button>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">
              {cardStatus === "new"
                ? "New application"
                : cardStatus === "review"
                  ? "In review"
                  : cardStatus === "interview"
                    ? "Interview phase"
                    : cardStatus === "invited"
                      ? "Invitation sent"
                      : "Not selected"}
            </span>
            <ArrowUpRight className="h-3 w-3 text-gray-600" />
          </div>
        </div>
      </motion.div>
    )
  })
}
