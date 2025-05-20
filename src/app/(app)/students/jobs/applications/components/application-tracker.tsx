"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Users,
  Search,
  Calendar,
  DollarSign,
  MapPin,
  ChevronDown,
  FileText,
  Bookmark, // add Bookmark icon
  MessageCircle,
  Filter,
  MoreHorizontal,
  ArrowUpRight,
  AlertCircle,
  ChevronRight,
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ApplicationDetailsModal } from "@/app/(app)/student/jobs/applications/components/application-details"
import { FollowUpChatModal } from "@/app/(app)/student/jobs/applications/components/follow-up-chat-modal"
import { toast } from "react-toastify"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import IconButton from "@mui/material/IconButton"

export default function ApplicationTrackerNoSidebar() {
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalApplicationId, setModalApplicationId] = useState<number | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false)
  const [followUpDetails, setFollowUpDetails] = useState<{ employerName: string; jobTitle: string; company: string } | null>(null)

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [menuCardId, setMenuCardId] = useState<number | null>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    event.stopPropagation()
    setMenuAnchorEl(event.currentTarget)
    setMenuCardId(id)
  }
  const handleMenuClose = () => {
    setMenuAnchorEl(null)
    setMenuCardId(null)
  }

  const handleWithdraw = () => {
    toast.info("Withdrawn application " + menuCardId)
    handleMenuClose()
  }
  const handleEdit = () => {
    toast.info("Edit application " + menuCardId)
    handleMenuClose()
  }
  const handleViewCompany = () => {
    toast.info("View company for application " + menuCardId)
    handleMenuClose()
  }
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href + "?application=" + menuCardId)
    toast.success("Link copied!")
    handleMenuClose()
  }

  const applications = [
    {
      id: 1,
      company: "Google",
      position: "Frontend Developer",
      contacts: [{ name: "Sarah Johnson", role: "Recruiter" }],
    },
    {
      id: 2,
      company: "Meta",
      position: "UI/UX Designer",
      contacts: [{ name: "Michael Brown", role: "Hiring Manager" }],
    },
    {
      id: 3,
      company: "Amazon",
      position: "Software Engineer",
      contacts: [{ name: "Emily Davis", role: "Technical Lead" }],
    },
  ]

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

  const handleFollowUp = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const application = applications.find((app) => app.id === id);
    if (application && application.contacts?.length > 0) {
      const contact = application.contacts[0];
      setFollowUpDetails({
        employerName: contact.name,
        jobTitle: contact.role,
        company: application.company,
      });
      setModalApplicationId(id);
      setIsFollowUpModalOpen(true);
    }
  };

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
                    <h2 className="text-2xl font-bold relative z-10 ">Applications Tracking</h2>
                    <p className="text-blue-100 text-sm relative z-10 mt-2">
                      Track and manage all your job applications in one place.
                    </p>
                  </div>
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

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-2/3" ref={scrollContainerRef}>
              <Card className="shadow-sm border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="mb-2 text-blue-700 text-xl">My Applications</CardTitle>
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
                        value="pending"
                        className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent hover:text-blue-600 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600"
                      >
                        Pending
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
                        value="hired"
                        className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent hover:text-blue-600 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600"
                      >
                        Hired
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
                        Date Applied
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      <button className="bg-white px-3 py-1 rounded-full text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 flex items-center gap-1">
                        <Filter className="h-3 w-3" />
                        Filters
                      </button>
                    </div>

                    <TabsContent value="all" className="mt-4 space-y-4">
                      {generateApplicationCards(
                        5, "all", selectedApplication, setSelectedApplication,
                        handleViewDetails, handleFollowUp,
                        handleMenuOpen
                      )}
                    </TabsContent>
                    <TabsContent value="pending" className="mt-4 space-y-4">
                      {generateApplicationCards(
                        5, "pending", selectedApplication, setSelectedApplication,
                        handleViewDetails, handleFollowUp,
                        handleMenuOpen
                      )}
                    </TabsContent>
                    <TabsContent value="review" className="mt-4 space-y-4">
                      {generateApplicationCards(
                        5, "review", selectedApplication, setSelectedApplication,
                        handleViewDetails, handleFollowUp,
                        handleMenuOpen
                      )}
                    </TabsContent>
                    <TabsContent value="interview" className="mt-4 space-y-4">
                      {generateApplicationCards(
                        5, "interview", selectedApplication, setSelectedApplication,
                        handleViewDetails, handleFollowUp,
                        handleMenuOpen
                      )}
                    </TabsContent>
                    <TabsContent value="hired" className="mt-4 space-y-4">
                      {generateApplicationCards(
                        2, "hired", selectedApplication, setSelectedApplication,
                        handleViewDetails, handleFollowUp,
                        handleMenuOpen
                      )}
                    </TabsContent>
                    <TabsContent value="rejected" className="mt-4 space-y-4">
                      {generateApplicationCards(
                        4, "rejected", selectedApplication, setSelectedApplication,
                        handleViewDetails, handleFollowUp,
                        handleMenuOpen
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div className="w-full lg:w-1/3 space-y-6">
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

        <ApplicationDetailsModal
          applicationId={modalApplicationId}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </div>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleWithdraw}>Withdraw</MenuItem>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleViewCompany}>Contact Recruiter</MenuItem>
        <MenuItem onClick={handleCopyLink}>Copy Link</MenuItem>
      </Menu>

      <FollowUpChatModal
        isOpen={isFollowUpModalOpen}
        onClose={() => setIsFollowUpModalOpen(false)}
        employerName={followUpDetails?.employerName || ""}
        jobTitle={followUpDetails?.jobTitle || ""}
        company={followUpDetails?.company || ""}
      />
    </>
  )
}

function generateApplicationCards(
  count: number,
  status: string,
  selectedApplication: number | null,
  setSelectedApplication: (id: number | null) => void,
  handleViewDetails: (id: number, e: React.MouseEvent) => void,
  handleFollowUp: (id: number, e: React.MouseEvent) => void,
  handleMenuOpen: (event: React.MouseEvent<HTMLButtonElement>, id: number) => void
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
  const matchScores = ["98%", "95%", "92%", "89%", "87%", "85%", "82%", "78%"] // mock match scores

  return (
    <>
      {Array.from({ length: count }).map((_, index) => {
        const id = index + 1;
        let cardStatus = status
        if (status === "all") {
          const statuses = ["pending", "review", "interview", "hired", "rejected"]
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
            transition={{ duration: 0.5, delay: index * 0.1 }}
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
                    index % 2 === 0 ? "bg-blue-600" : index % 3 === 0 ? "bg-green-600" : "bg-purple-600"
                  }`}
                >
                  {companies[index % companies.length].charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-lg text-gray-800">{positions[index % positions.length]}</h3>
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
                    <Badge className="bg-green-100 text-green-700">{matchScores[index % matchScores.length]} Match</Badge>
                  </div>
                  <p className="text-sm text-gray-500">{companies[index % companies.length]}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="h-3 w-3" />
                      <span>{locations[index % locations.length]}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <DollarSign className="h-3 w-3" />
                      <span>{salaries[index % salaries.length]}</span>
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
                  <Bookmark className="h-4 w-4" /> {/* Use Bookmark icon */}
                </button>
                <IconButton
                  size="small"
                  className="text-gray-400 hover:text-blue-500 transition-colors p-1.5 rounded-full hover:bg-blue-50"
                  onClick={(e) => handleMenuOpen(e, id)}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </IconButton>
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
                    onClick={(e) => handleFollowUp(id, e)}
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
                <ArrowUpRight className="h-3 w-3 text-gray-600" />
              </div>
            </div>
          </motion.div>
        )
      })}
    </>
  )
}
