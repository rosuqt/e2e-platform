"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Users,
  Search,
  Clock,
  Calendar,
  DollarSign,
  MapPin,
  ChevronDown,
  FileText,
  Heart,
  X,
  Check,
  MessageCircle,
  Filter,
  MoreHorizontal,
  ArrowUpRight,
  Plus,
  AlertCircle,
  ChevronRight,
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function ApplicationTrackerNoSidebar() {
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalApplicationId, setModalApplicationId] = useState<number | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
      <div className="container mx-auto p-4">
        {/* Header */}
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
                  <h2 className="text-2xl font-bold relative z-10">Your Job Applications</h2>
                  <p className="text-blue-100 text-sm relative z-10 mt-2">
                    Track and manage all your job applications in one place.
                  </p>
                </div>
                <Button className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Application
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-3 mt-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <p className="text-xs text-white/80">Total</p>
                  <p className="text-xl font-bold text-white">24</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <p className="text-xs text-white/80">Active</p>
                  <p className="text-xl font-bold text-white">18</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <p className="text-xs text-white/80">Interviews</p>
                  <p className="text-xl font-bold text-white">5</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <p className="text-xs text-white/80">Offers</p>
                  <p className="text-xl font-bold text-white">2</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-2 flex flex-col sm:flex-row relative z-10">
              <Input
                type="text"
                placeholder="Search applications"
                className="border-0 text-black focus-visible:ring-0 focus-visible:ring-offset-0 mb-1 sm:mb-0"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Applications */}
          <div className="w-full lg:w-2/3" ref={scrollContainerRef}>
            <Card className="shadow-sm border-blue-100">
              <CardHeader className="pb-2">
                <CardTitle>Job Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Application Status Tabs */}
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="flex overflow-x-auto pb-2 mb-2 scrollbar-hide bg-transparent h-auto">
                    <TabsTrigger
                      value="all"
                      className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:bg-white data-[state=inactive]:text-blue-600 data-[state=inactive]:border data-[state=inactive]:border-blue-200 data-[state=inactive]:hover:bg-blue-50"
                    >
                      <FileText className="w-3 h-3" />
                      <span>All</span>
                      <span className="ml-1 bg-white text-blue-600 text-xs rounded-full px-1.5">24</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="pending"
                      className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:bg-white data-[state=inactive]:text-blue-600 data-[state=inactive]:border data-[state=inactive]:border-blue-200 data-[state=inactive]:hover:bg-blue-50"
                    >
                      <Clock className="w-3 h-3" />
                      <span>Pending</span>
                      <span className="ml-1 bg-white text-blue-600 text-xs rounded-full px-1.5">8</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="review"
                      className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:bg-white data-[state=inactive]:text-blue-600 data-[state=inactive]:border data-[state=inactive]:border-blue-200 data-[state=inactive]:hover:bg-blue-50"
                    >
                      <Search className="w-3 h-3" />
                      <span>Under Review</span>
                      <span className="ml-1 bg-white text-blue-600 text-xs rounded-full px-1.5">5</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="interview"
                      className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:bg-white data-[state=inactive]:text-blue-600 data-[state=inactive]:border data-[state=inactive]:border-blue-200 data-[state=inactive]:hover:bg-blue-50"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>Interview</span>
                      <span className="ml-1 bg-white text-blue-600 text-xs rounded-full px-1.5">5</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="hired"
                      className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:bg-white data-[state=inactive]:text-blue-600 data-[state=inactive]:border data-[state=inactive]:border-blue-200 data-[state=inactive]:hover:bg-blue-50"
                    >
                      <Check className="w-3 h-3" />
                      <span>Hired</span>
                      <span className="ml-1 bg-white text-blue-600 text-xs rounded-full px-1.5">2</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="rejected"
                      className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:bg-white data-[state=inactive]:text-blue-600 data-[state=inactive]:border data-[state=inactive]:border-blue-200 data-[state=inactive]:hover:bg-blue-50"
                    >
                      <X className="w-3 h-3" />
                      <span>Rejected</span>
                      <span className="ml-1 bg-white text-blue-600 text-xs rounded-full px-1.5">4</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Sort and Filter Buttons */}
                  <div className="mt-3 text-sm flex items-center gap-2 relative z-10">
                    <span>Sort by:</span>
                    <button className="bg-blue-600/30 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-blue-600/50 transition-colors">
                      Date Applied
                      <ChevronDown className="h-3 w-3" />
                    </button>
                    <button className="bg-white px-3 py-1 rounded-full text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 flex items-center gap-1">
                      <Filter className="h-3 w-3" />
                      Filters
                    </button>
                  </div>

                  {/* Application Cards for Each Tab */}
                  <TabsContent value="all" className="mt-4 space-y-4">
                    {generateApplicationCards(5, "all", selectedApplication, setSelectedApplication, handleViewDetails)}
                  </TabsContent>
                  <TabsContent value="pending" className="mt-4 space-y-4">
                    {generateApplicationCards(
                      5,
                      "pending",
                      selectedApplication,
                      setSelectedApplication,
                      handleViewDetails,
                    )}
                  </TabsContent>
                  <TabsContent value="review" className="mt-4 space-y-4">
                    {generateApplicationCards(
                      5,
                      "review",
                      selectedApplication,
                      setSelectedApplication,
                      handleViewDetails,
                    )}
                  </TabsContent>
                  <TabsContent value="interview" className="mt-4 space-y-4">
                    {generateApplicationCards(
                      5,
                      "interview",
                      selectedApplication,
                      setSelectedApplication,
                      handleViewDetails,
                    )}
                  </TabsContent>
                  <TabsContent value="hired" className="mt-4 space-y-4">
                    {generateApplicationCards(
                      2,
                      "hired",
                      selectedApplication,
                      setSelectedApplication,
                      handleViewDetails,
                    )}
                  </TabsContent>
                  <TabsContent value="rejected" className="mt-4 space-y-4">
                    {generateApplicationCards(
                      4,
                      "rejected",
                      selectedApplication,
                      setSelectedApplication,
                      handleViewDetails,
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats and Updates */}
          <div className="w-full lg:w-1/3 space-y-6">
             {/* Recent Updates */}
            <Card className="shadow-sm border-blue-100">
              <CardHeader className="pb-2">
                <CardTitle>Recent Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      company: "Google",
                      position: "Frontend Developer",
                      update: "Interview scheduled",
                      time: "2 hours ago",
                      icon: <Calendar className="h-4 w-4 text-white" />,
                      iconBg: "bg-green-500",
                    },
                    {
                      company: "Meta",
                      position: "UI/UX Designer",
                      update: "Application under review",
                      time: "1 day ago",
                      icon: <Search className="h-4 w-4 text-white" />,
                      iconBg: "bg-blue-500",
                    },
                    {
                      company: "Amazon",
                      position: "Software Engineer",
                      update: "Technical assessment received",
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
                        <p className="text-sm font-medium text-gray-800">{update.company}</p>
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

            {/* Upcoming Events */}
            <Card className="shadow-sm border-blue-100">
              <CardHeader className="pb-2">
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="border border-blue-100 rounded-lg p-3 hover:bg-blue-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">Google Interview</p>
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
                        Prepare for Interview
                      </Button>
                    </div>
                  </div>

                  <div className="border border-blue-100 rounded-lg p-3 hover:bg-blue-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">Amazon Technical Assessment</p>
                        <p className="text-xs text-gray-500">Software Engineer Position</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-700 border-none">3 Days</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>May 15, 2025 • Due by 11:59 PM</span>
                    </div>
                    <div className="mt-3">
                      <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 text-xs w-full">
                        Start Assessment
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

             {/* Application Tips */}
            <Card className="shadow-sm border-blue-100">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  Application Tips
                  <Badge className="ml-2 bg-red-500 text-white text-xs">New</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    <p className="text-sm text-gray-700">Follow up on applications older than 7 days</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    <p className="text-sm text-gray-700">Update your resume for tech positions</p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <MessageCircle className="h-4 w-4" />
                    </div>
                    <p className="text-sm text-gray-700">Prepare for upcoming Google interview</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      

      {/* Application Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {modalApplicationId !== null && <ApplicationDetailsContent applicationId={modalApplicationId} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Application Details Content
function ApplicationDetailsContent({ applicationId }: { applicationId: number }) {

  const application = {
    id: applicationId,
    company: "Google",
    position: "Frontend Developer",
    status: "Interview",
    statusColor: "bg-purple-100 text-purple-700",
    location: "Remote",
    salary: "$120K - $150K",
    appliedDate: "May 10, 2025",
    description:
      "Google is seeking a talented Frontend Developer to join our team. You will be responsible for building and maintaining user interfaces for our products.",
    timeline: [
      {
        status: "Application Submitted",
        date: "May 10, 2025",
        icon: <FileText className="h-4 w-4 text-white" />,
        iconBg: "bg-green-500",
      },
      {
        status: "Application Under Review",
        date: "May 13, 2025",
        icon: <Search className="h-4 w-4 text-white" />,
        iconBg: "bg-blue-500",
      },
      {
        status: "Interview Scheduled",
        date: "May 17, 2025",
        icon: <MessageCircle className="h-4 w-4 text-white" />,
        iconBg: "bg-purple-500",
        current: true,
      },
    ],
    notes: "Prepare for technical interview. Review React hooks and performance optimization.",
    contacts: [
      {
        name: "Sarah Johnson",
        role: "Recruiter",
        email: "sarah.johnson@google.com",
      },
    ],
    documents: [
      {
        name: "Resume_Frontend_2025.pdf",
        date: "May 10, 2025",
      },
      {
        name: "Cover_Letter_Google.pdf",
        date: "May 10, 2025",
      },
    ],
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
          G
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{application.position}</h3>
          <p className="text-gray-600">{application.company}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={application.statusColor}>{application.status}</Badge>
            <span className="text-xs text-gray-500">Applied on {application.appliedDate}</span>
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Job Details</h4>
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Location</span>
            <span className="text-sm font-medium">{application.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Salary Range</span>
            <span className="text-sm font-medium">{application.salary}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Applied Via</span>
            <span className="text-sm font-medium">Company Website</span>
          </div>
        </div>
      </div>

      {/* Application Timeline */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Application Timeline</h4>
        <div className="relative pl-8 space-y-4">
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          {application.timeline.map((item, index) => (
            <div key={index} className="relative">
              <div
                className={`absolute left-[-20px] top-0 w-6 h-6 rounded-full ${
                  item.iconBg
                } flex items-center justify-center ${item.current ? "ring-2 ring-offset-2 ring-blue-600" : ""}`}
              >
                {item.icon}
              </div>
              <p className="font-medium text-gray-800">{item.status}</p>
              <p className="text-xs text-gray-500 mt-1">{item.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-semibold text-gray-700">Notes</h4>
          <Button variant="ghost" size="sm" className="h-7 text-blue-600 hover:bg-blue-50 p-0">
            Edit
          </Button>
        </div>
        <textarea
          className="w-full min-h-[80px] rounded-lg border border-gray-200 p-3 text-sm"
          defaultValue={application.notes}
          placeholder="Add notes about this application..."
        ></textarea>
      </div>

      {/* Contacts */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Contacts</h4>
        <div className="bg-gray-50 rounded-lg p-3">
          {application.contacts.map((contact, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{contact.name}</p>
                <p className="text-xs text-gray-500">{contact.role}</p>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-blue-600 hover:bg-blue-50">
                Email
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Documents */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Documents</h4>
        <div className="space-y-2">
          {application.documents.map((doc, index) => (
            <div key={index} className="flex justify-between items-center p-2 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-sm">{doc.name}</span>
              </div>
              <span className="text-xs text-gray-500">{doc.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Prepare for Interview</Button>
        <Button variant="outline" className="flex-1 border-gray-200 text-gray-600">
          Follow Up
        </Button>
      </div>
    </div>
  )
}

// Generate Application Cards based on status
function generateApplicationCards(
  count: number,
  status: string,
  selectedApplication: number | null,
  setSelectedApplication: (id: number | null) => void,
  handleViewDetails: (id: number, e: React.MouseEvent) => void,
) {
  const statusConfig = {
    all: { title: "Mixed", badge: "" },
    pending: { title: "Pending", badge: "bg-yellow-100 text-yellow-700" },
    review: { title: "Under Review", badge: "bg-blue-100 text-blue-700" },
    interview: { title: "Interview", badge: "bg-purple-100 text-purple-700" },
    hired: { title: "Hired", badge: "bg-green-100 text-green-700" },
    rejected: { title: "Rejected", badge: "bg-red-100 text-red-700" },
  }

  const companies = ["Google", "Meta", "Amazon", "Microsoft", "Apple", "Netflix", "Uber", "Airbnb"]
  const positions = [
    "Frontend Developer",
    "UI/UX Designer",
    "Software Engineer",
    "Product Manager",
    "Data Analyst",
    "Full Stack Developer",
    "Mobile Developer",
    "DevOps Engineer",
  ]
  const locations = ["Remote", "San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX", "Boston, MA"]
  const salaries = ["$120K - $150K", "$90K - $120K", "$80K - $100K", "$100K - $130K", "$70K - $90K"]

  return Array.from({ length: count }).map((_, id) => {
    let cardStatus = status
    if (status === "all") {
      const statuses = ["pending", "review", "interview", "hired", "rejected"]
      cardStatus = statuses[id % statuses.length]
    }

    const badgeClass = statusConfig[cardStatus as keyof typeof statusConfig].badge

    const daysAgo = id + 1
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
            : cardStatus === "hired"
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
        transition={{ duration: 0.5, delay: id * 0.1 }}
        whileHover={{
          y: -2,
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
        onClick={() => setSelectedApplication(id === selectedApplication ? null : id)}
      >
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold ${
                id % 2 === 0 ? "bg-blue-600" : id % 3 === 0 ? "bg-green-600" : "bg-purple-600"
              }`}
            >
              {companies[id % companies.length].charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-lg text-gray-800">{positions[id % positions.length]}</h3>
                <Badge className={badgeClass}>
                  {cardStatus === "pending"
                    ? "Pending"
                    : cardStatus === "review"
                      ? "Under Review"
                      : cardStatus === "interview"
                        ? "Interview"
                        : cardStatus === "hired"
                          ? "Hired"
                          : "Rejected"}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">{companies[id % companies.length]}</p>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" />
                  <span>{locations[id % locations.length]}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <DollarSign className="h-3 w-3" />
                  <span>{salaries[id % salaries.length]}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>Applied {formattedDate}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <button
              className="text-gray-400 hover:text-blue-500 transition-colors p-1.5 rounded-full hover:bg-blue-50"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart className="h-4 w-4" />
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
              View Details
            </Button>
            {cardStatus === "interview" && (
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                Prepare
              </Button>
            )}
            {cardStatus === "pending" && (
              <Button
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700 text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                Follow Up
              </Button>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">
              {cardStatus === "pending"
                ? "Awaiting response"
                : cardStatus === "review"
                  ? "In progress"
                  : cardStatus === "interview"
                    ? "Interview phase"
                    : cardStatus === "hired"
                      ? "Congratulations!"
                      : "Better luck next time"}
            </span>
            <ArrowUpRight className="h-3 w-3 text-gray-400" />
          </div>
        </div>
      </motion.div>
    )
  })
}
