"use client"

import { useState } from "react"
import {
  Users,
  PlusCircle,
  ChevronRight,
  Briefcase,
  UserCheck,
  FileText,
  ArrowUpRight,
  Filter,
  MoreHorizontal,
  Calendar,
  MapPin,
  Star,
} from "lucide-react"
import { motion } from "framer-motion"
import { Avatar } from "@mui/material"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader, DashboardLayout, DashboardMain, DashboardSection } from "./dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function EmployeeDashboard() {
  const [selectedApplicant, setSelectedApplicant] = useState<number | null>(null)

  // Mock data for analytics
  const analyticsData = {
    totalApplicants: 124,
    newToday: 18,
    activeJobs: 8,
    interviewsScheduled: 12,
    hiringProgress: 68,
  }

  const topPerformingJob = {
    title: "Senior Software Engineer",
    applicants: 45,
    views: 1200,
    applicationsRate: "3.75%",
  }

  const candidateMatches = [
    { name: "Alice Brown", position: "Backend Developer", match: 96 },
    { name: "John Doe", position: "UI/UX Designer", match: 92 },
    { name: "Jane Smith", position: "DevOps Engineer", match: 89 },
    { name: "Linda Lee", position: "Mobile Developer", match: 88 },
    { name: "Tom White", position: "Cloud Architect", match: 91 },
    { name: "Nina Gupta", position: "Data Scientist", match: 93 },
  ]

  // Mock data for today's agenda
  const todayAgenda = [
    { time: "10:00 AM", event: "Interview with Kemly R", type: "interview" },
    { time: "11:30 AM", event: "Team meeting - Hiring updates", type: "meeting" },
    { time: "2:00 PM", event: "Review applications for Senior Developer", type: "review" },
    { time: "4:30 PM", event: "Call with Marketing about job descriptions", type: "call" },
  ]

  // Mock data for applicants
  const applicants = [
    {
      id: 0,
      name: "Sarah Johnson",
      position: "Software Engineer",
      initials: "SJ",
      photo: "",
      location: "San Francisco, CA",
      experience: "5 years",
      appliedDate: "Today",
      match: 98,
      email: "sarah.j@example.com",
      phone: "(123) 456-7890",
      status: "new",
    },
    {
      id: 1,
      name: "Michael Chen",
      position: "Frontend Developer",
      initials: "MC",
      photo: "",
      location: "Remote",
      experience: "3 years",
      appliedDate: "Yesterday",
      match: 95,
      email: "michael.c@example.com",
      phone: "(234) 567-8901",
      status: "reviewed",
    },
    {
      id: 2,
      name: "Emily Rodriguez",
      position: "Product Manager",
      initials: "ER",
      photo: "",
      location: "New York, NY",
      experience: "7 years",
      appliedDate: "2 days ago",
      match: 92,
      email: "emily.r@example.com",
      phone: "(345) 678-9012",
      status: "interview",
    },
    {
      id: 3,
      name: "David Kim",
      position: "Data Analyst",
      initials: "DK",
      photo: "",
      location: "Chicago, IL",
      experience: "4 years",
      appliedDate: "3 days ago",
      match: 89,
      email: "david.k@example.com",
      phone: "(456) 789-0123",
      status: "offer",
    },
    {
      id: 4,
      name: "Priya Patel",
      position: "QA Engineer",
      initials: "PP",
      photo: "",
      location: "Austin, TX",
      experience: "2 years",
      appliedDate: "Today",
      match: 90,
      email: "priya.p@example.com",
      phone: "(567) 890-1234",
      status: "new",
    },

    {
      id: 5,
      name: "Carlos Martinez",
      position: "Full Stack Developer",
      initials: "CM",
      photo: "",
      location: "Miami, FL",
      experience: "6 years",
      appliedDate: "Yesterday",
      match: 94,
      email: "carlos.m@example.com",
      phone: "(678) 901-2345",
      status: "reviewed",
    },
  ]

  const getStatusText = (status: string) => {
    switch (status) {
      case "new":
        return "New"
      case "reviewed":
        return "Reviewed"
      case "interview":
        return "Interview"
      case "offer":
        return "Offer"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="overflow-x-hidden -mt-20">
      <DashboardLayout>
        {/* Header */}
        <DashboardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <motion.div
                className="p-3 bg-white rounded-xl shadow-lg"
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.05 }}
                transition={{ duration: 0.5 }}
              >
                <Briefcase className="h-8 w-8 text-blue-600" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-white">Recruitment Dashboard</h1>
                <p className="text-blue-100">Grow your team with top talent</p>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="transition-transform duration-300"
              >
                <Button
                  size="lg"
                  className="h-12 px-6 bg-white text-blue-600 font-bold shadow-md border border-blue-300 hover:bg-blue-50 hover:shadow-lg"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  <span>Post Job</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </DashboardHeader>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="overflow-hidden border-blue-200 bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardDescription className="text-blue-600 font-medium">Total Applicants</CardDescription>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-3xl text-blue-900">{analyticsData.totalApplicants}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-green-600 font-medium">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>12% increase this month</span>
                </div>
              </CardContent>
              <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="overflow-hidden border-blue-200 bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardDescription className="text-blue-600 font-medium">Active Jobs</CardDescription>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-3xl text-blue-900">{analyticsData.activeJobs}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-green-600 font-medium">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>2 new postings this week</span>
                </div>
              </CardContent>
              <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="overflow-hidden border-blue-200 bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardDescription className="text-blue-600 font-medium">Interviews Scheduled</CardDescription>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <UserCheck className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-3xl text-blue-900">{analyticsData.interviewsScheduled}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-green-600 font-medium">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>4 scheduled for tomorrow</span>
                </div>
              </CardContent>
              <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="overflow-hidden border-blue-200 bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardDescription className="text-blue-600 font-medium">Top Performing Job Listing</CardDescription>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-blue-900">{topPerformingJob.title}</CardTitle>
              </CardHeader>
              <CardContent>
              </CardContent>
              <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <DashboardMain>
          {/* Applicants Section */}
          <DashboardSection colSpan="col-span-12 lg:col-span-7 flex flex-col">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="h-full flex flex-col">
              <Card className="border-blue-200 overflow-visible flex flex-col h-full min-h-[600px] max-h-none">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <div>
                    <CardTitle className="text-white flex items-center">
                      <Users className="mr-2 h-5 w-5" /> Recent Applicants
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      You have  new applicants today
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-blue-600/30 border-blue-400 text-white hover:bg-blue-600/50 hover:text-white"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-blue-600/30 border-blue-400 text-white hover:bg-blue-600/50 hover:text-white"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 min-h-0 p-0 overflow-visible">
                  <Tabs defaultValue="all" className="w-full">
                    <div className="px-6 pt-4 bg-gradient-to-b from-blue-50 to-white">
                      <TabsList className="grid grid-cols-4 h-10 bg-blue-100/50 p-1">
                        <TabsTrigger
                          value="all"
                          className="data-[state=active]:bg-white data-[state=active]:text-blue-700"
                        >
                          All
                        </TabsTrigger>
                        <TabsTrigger
                          value="new"
                          className="data-[state=active]:bg-white data-[state=active]:text-blue-700"
                        >
                          New
                        </TabsTrigger>
                        <TabsTrigger
                          value="reviewed"
                          className="data-[state=active]:bg-white data-[state=active]:text-blue-700"
                        >
                          Reviewed
                        </TabsTrigger>
                        <TabsTrigger
                          value="interview"
                          className="data-[state=active]:bg-white data-[state=active]:text-blue-700"
                        >
                          Interview
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value="all" className="m-0">
                      <div className="divide-y divide-blue-100">
                        {applicants.map((applicant) => (
                          <motion.div
                            key={applicant.id}
                            className={`flex items-center p-4 hover:bg-blue-50 transition-colors cursor-pointer ${
                              selectedApplicant === applicant.id ? "bg-blue-50" : ""
                            }`}
                            onClick={() => setSelectedApplicant(applicant.id)}
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Avatar className="h-12 w-12 mr-4 border-2 border-blue-200">
                              {applicant.initials}
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-blue-900">{applicant.name}</h4>
                                {/* Badge on the right with margin */}
                                {applicant.status === "new" && (
                                  <Badge className="ml-2 bg-blue-600 text-white border-none">{getStatusText(applicant.status)}</Badge>
                                )}
                                {applicant.status === "reviewed" && (
                                  <Badge className="ml-2 bg-amber-500 text-white border-none">{getStatusText(applicant.status)}</Badge>
                                )}
                                {applicant.status === "interview" && (
                                  <Badge className="ml-2 bg-purple-500 text-white border-none">{getStatusText(applicant.status)}</Badge>
                                )}
                                {applicant.status === "offer" && (
                                  <Badge className="ml-2 bg-green-600 text-white border-none">{getStatusText(applicant.status)}</Badge>
                                )}
                              </div>
                              <div className="flex items-center text-sm text-blue-700">
                                <Briefcase className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span className="truncate">{applicant.position}</span>
                                <span className="mx-2 text-blue-300">•</span>
                                <span className="text-xs">{applicant.appliedDate}</span>
                              </div>
                              <div className="flex items-center mt-1 text-xs text-blue-600">
                                <div className="flex items-center mr-3">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  <span>{applicant.location}</span>
                                </div>
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 mr-1 text-yellow-500 fill-yellow-500" />
                                  <span className="font-medium">{applicant.match}% match</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="new" className="m-0">
                      <div className="divide-y divide-blue-100">
                        {applicants
                          .filter((a) => a.status === "new")
                          .map((applicant) => (
                            <motion.div
                              key={applicant.id}
                              className={`flex items-center p-4 hover:bg-blue-50 transition-colors cursor-pointer ${
                                selectedApplicant === applicant.id ? "bg-blue-50" : ""
                              }`}
                              onClick={() => setSelectedApplicant(applicant.id)}
                              whileHover={{ scale: 1.03 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Avatar className="h-12 w-12 mr-4 border-2 border-blue-200">
                                {applicant.initials}
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-blue-900">{applicant.name}</h4>
                                  <Badge className="ml-2 bg-blue-600 text-white border-none">{getStatusText(applicant.status)}</Badge>
                                </div>
                                <div className="flex items-center text-sm text-blue-700">
                                  <Briefcase className="h-3 w-3 mr-1 flex-shrink-0" />
                                  <span className="truncate">{applicant.position}</span>
                                  <span className="mx-2 text-blue-300">•</span>
                                  <span className="text-xs">{applicant.appliedDate}</span>
                                </div>
                                <div className="flex items-center mt-1 text-xs text-blue-600">
                                  <div className="flex items-center mr-3">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    <span>{applicant.location}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Star className="h-3 w-3 mr-1 text-yellow-500 fill-yellow-500" />
                                    <span className="font-medium">{applicant.match}% match</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    </TabsContent>

                    {/* Similar content for other tabs */}
                  </Tabs>
                </CardContent>
                <CardFooter className="border-t bg-gradient-to-b from-white to-blue-50 p-4">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                    View All Applicants
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </DashboardSection>

          {/* Agenda and Candidate Matches Section */}
          <DashboardSection colSpan="col-span-12 lg:col-span-5 flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="h-full flex flex-col"
            >
              <Card className="border-blue-200 bg-gradient-to-br from-blue-600 to-blue-700 text-white overflow-visible flex flex-col h-full min-h-[600px] max-h-none">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <Calendar className="mr-2 h-5 w-5" /> Today&apos;s Agenda
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-blue-100 hover:text-white hover:bg-blue-500/20">
                      View Calendar
                    </Button>
                  </div>
                  <CardDescription className="text-blue-200">
                    {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 min-h-0 overflow-visible">
                  <div className="space-y-4">
                    {todayAgenda.map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index + 0.3 }}
                        whileHover={{ y: -3, transition: { duration: 0.2 } }}
                      >
                        <div className="flex flex-col items-center mr-4">
                          <div className="text-sm font-medium text-blue-200">{item.time.split(" ")[0]}</div>
                          <div className="text-xs text-blue-300">{item.time.split(" ")[1]}</div>
                          {index < todayAgenda.length - 1 && (
                            <div className="w-px h-full bg-blue-400/30 my-1 flex-grow"></div>
                          )}
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 flex-1 shadow-lg hover:bg-white/20 transition-colors">
                          <div className="flex items-start">
                            <div
                              className={`p-2 rounded-md mr-3 ${
                                item.type === "interview"
                                  ? "bg-purple-500/20"
                                  : item.type === "meeting"
                                    ? "bg-blue-500/20"
                                    : item.type === "review"
                                      ? "bg-yellow-500/20"
                                      : "bg-green-500/20"
                              }`}
                            >
                              {item.type === "interview" && <UserCheck className={`h-4 w-4 text-purple-200`} />}
                              {item.type === "meeting" && <Users className={`h-4 w-4 text-blue-200`} />}
                              {item.type === "review" && <FileText className={`h-4 w-4 text-yellow-200`} />}
                              {item.type === "call" && <Briefcase className={`h-4 w-4 text-green-200`} />}
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-white">{item.event}</h4>
                              <p className="text-xs text-blue-200 mt-1">
                                {item.type === "interview"
                                  ? "Interview"
                                  : item.type === "meeting"
                                    ? "Meeting"
                                    : item.type === "review"
                                      ? "Review"
                                      : "Call"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-gradient-to-b from-blue-700 to-blue-800 p-4">
                  <div className="flex flex-col items-center">
                    <h3 className="text-lg font-medium text-white mb-4">Candidate Matches for You</h3>
                    <div className="grid grid-cols-3 gap-3 justify-center">
                      {candidateMatches.slice(0, 6).map((candidate, index) => (
                        <motion.div
                          key={index}
                          className="flex flex-col justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors min-h-[72px]"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.05 * index }}
                        >
                          <div>
                            <h4 className="text-sm font-medium text-white">{candidate.name}</h4>
                            <p className="text-xs text-blue-200">{candidate.position}</p>
                          </div>
                          <div className="text-sm font-medium text-yellow-400 mt-2">{candidate.match}%</div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex justify-end w-full mt-3">
                      <button type="button" className="text-blue-200 hover:text-white text-sm font-medium px-2 py-1 bg-transparent border-none cursor-pointer">
                        View More
                      </button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </DashboardSection>
        </DashboardMain>
      </DashboardLayout>
    </div>
  )
}
