"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import {
  Search,
  Calendar,
  FileText,
  Bookmark,
  MessageCircle,
  Filter,
  MoreHorizontal,
  ArrowUpRight,
  AlertCircle,
  ChevronRight,
  Briefcase,
  Globe,
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ApplicationDetailsModal } from "./application-details"
import { FollowUpChatModal } from "./follow-up-chat-modal"
import { JobRatingModal } from "./job-rating-modal"
import { toast } from "react-toastify"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import IconButton from "@mui/material/IconButton"
import { PiMoneyDuotone } from "react-icons/pi"
import Image from "next/image"
import { TbUserSearch } from "react-icons/tb"
import { MdOutlineExitToApp } from "react-icons/md"
import { HiBadgeCheck } from "react-icons/hi"
import { RiErrorWarningLine } from "react-icons/ri"
import { BadgeCheck as LuBadgeCheck } from "lucide-react"
import Tooltip from "@mui/material/Tooltip"
import { styled } from "@mui/material/styles"
import { AiFillStar } from "react-icons/ai"

type JobPosting = {
  employer_id?: string
  job_title?: string
  location?: string
  remote_options?: string
  work_type?: string
  pay_type?: string
  pay_amount?: string | number
  recommended_course?: string
  job_description?: string
  job_summary?: string
  must_have_qualifications?: string[]
  nice_to_have_qualifications?: string[]
  application_deadline?: string
  max_applicants?: number
  perks_and_benefits?: string[]
  verification_tier?: string
  created_at?: string
  responsibilities?: string
  id?: string
  paused?: boolean
  company_id?: string
  company_logo_image_path?: string
  registered_employers?: {
    company_name?: string
    first_name?: string
    last_name?: string
    job_title?: string
    email?: string
    phone?: string
    country_code?: string
  }
  achievements?: string[]
  portfolio?: string[]
}

type ApplicationData = {
  job_postings?: JobPosting
  applied_at?: string
  match_score?: string
  company_name?: string
  status?: string
  remote_options?: string
  company_logo_image_path?: string
  profile_img?: string
  resume?: string
  resumeUrl?: string
  id?: string | number
  achievements?: string[]
  portfolio?: string[]
}

type JobRatingData = {
  companyLogo: string
  jobTitle: string
  recruiterName: string
  companyName: string
  dateOfHiring: string
  jobType: string
  department: string
  location: string
}

const CustomTooltip = styled(Tooltip)(() => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: "#fff",
    color: "#222",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    fontSize: 13,
    borderRadius: 8,
    padding: "8px 14px",
    fontWeight: 500,
    letterSpacing: 0.1,
  },
  [`& .MuiTooltip-arrow`]: {
    color: "#fff",
  },
}))

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

  const [applicationsData, setApplicationsData] = useState<ApplicationData[] | null>(null)

  const [logoUrls, setLogoUrls] = useState<{ [key: number]: string | null }>({})


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

  useEffect(() => {
    fetch("/api/students/applications")
      .then(res => res.json())
      .then(async data => {
        const applicationsWithResume = await Promise.all(
          (data.applications || []).map(async (app: {
            job_postings?: JobPosting
            applied_at?: string
            match_score?: string
            company_name?: string
            status?: string
            remote_options?: string
            company_logo_image_path?: string
            profile_img?: string
            resume?: string
            resumeUrl?: string
            achievements?: string[]
            portfolio?: string[]
          }) => {
            let resumeUrl = app.resumeUrl ?? ""
            const resume = app.resume ?? ""
        
            if (resume && !resumeUrl) {
              let found = false
              for (const bucket of ["student.documents"]) {
                try {
                  const res = await fetch("/api/students/get-signed-url", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      bucket,
                      path: resume
                    })
                  })
                  const json = await res.json()
                  if (json && json.signedUrl) {
                    resumeUrl = json.signedUrl
                    found = true
                    break
                  }
                } catch {
                
                }
              }
              if (!found) resumeUrl = ""
            }
            return {
              ...app,
              resume,
              resumeUrl,
              achievements: app.achievements || [],
              portfolio: app.portfolio || []
            }
          })
        )
        setApplicationsData(applicationsWithResume)
      })
  }, [])

  useEffect(() => {
    async function fetchLogos() {
      if (!applicationsData) return
      const newLogoUrls: { [key: number]: string | null } = {}
      await Promise.all(
        applicationsData.map(async (app, idx) => {
          const logoPath = app.company_logo_image_path || app.job_postings?.company_logo_image_path
          if (!logoPath) {
            newLogoUrls[idx] = null
            return
          }
          const cacheKey = `companyLogoUrl:${logoPath}`
          const cached = sessionStorage.getItem(cacheKey)
          if (cached) {
            try {
              const parsed = JSON.parse(cached)
              if (typeof parsed === "string") {
                newLogoUrls[idx] = parsed
                return
              }
              if (parsed && typeof parsed === "object" && parsed.url && typeof parsed.url === "string") {
                newLogoUrls[idx] = parsed.url
                sessionStorage.setItem(cacheKey, JSON.stringify(parsed.url))
                return
              }
            } catch {}
            sessionStorage.removeItem(cacheKey)
          }
          const res = await fetch("/api/employers/get-signed-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bucket: "company.logo",
              path: logoPath,
            }),
          })
          const json = await res.json()

          let url = ""
          if (typeof json.signedUrl === "string") {
            url = json.signedUrl
          } else if (json.url && typeof json.url === "string") {
            url = json.url
          }
          if (url && (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/"))) {
            newLogoUrls[idx] = url
            sessionStorage.setItem(cacheKey, JSON.stringify(url))
          } else {
            newLogoUrls[idx] = null
            sessionStorage.removeItem(cacheKey)
          }
        })
      )
      setLogoUrls(newLogoUrls)
    }
    fetchLogos()
  }, [applicationsData])

  useEffect(() => {
    async function fetchProfileImgs() {
      if (!applicationsData) return
      const newProfileImgUrls: { [key: number]: string | null } = {}
      await Promise.all(
        applicationsData.map(async (app, idx) => {
          const profile_img = app?.profile_img
          if (!profile_img) {
            newProfileImgUrls[idx] = null
            return
          }
          if (profile_img.startsWith("http")) {
            newProfileImgUrls[idx] = profile_img
            return
          }
          const url =
            typeof window !== "undefined"
              ? `${window.location.origin}/api/employers/get-signed-url?bucket=user.avatars&path=${encodeURIComponent(
                  profile_img
                )}`
              : `/api/employers/get-signed-url?bucket=user.avatars&path=${encodeURIComponent(
                  profile_img
                )}`
          try {
            const res = await fetch(url)
            const data = await res.json()
            newProfileImgUrls[idx] = data.signedUrl || null
          } catch {
            newProfileImgUrls[idx] = null
          }
        })
      )

    }
    fetchProfileImgs()
  }, [applicationsData])

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

  const [activeTab, setActiveTab] = useState("all")
  const [isJobRatingModalOpen, setIsJobRatingModalOpen] = useState(false)
  const [jobRatingData, setJobRatingData] = useState<JobRatingData | null>(null)
  const [jobRatingCompanyImg, setJobRatingCompanyImg] = useState<string>("")
  const [jobRatingRecruiterImg, setJobRatingRecruiterImg] = useState<string>("")
  const [jobRatingRecruiterName, setJobRatingRecruiterName] = useState<string>("")
  const [jobRatingJobId, setJobRatingJobId] = useState<string>("")

  async function handleOpenJobRatingModal(app: ApplicationData) {
    setJobRatingJobId(app.job_postings?.id || "")
    let logo = ""
    let recruiterImg = ""
    let recruiterName = ""
    const logoPath = app.company_logo_image_path || app.job_postings?.company_logo_image_path || ""
    if (logoPath) {
      try {
        const res = await fetch("/api/employers/get-signed-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bucket: "company.logo",
            path: logoPath,
          }),
        })
        const json = await res.json()
        if (json.signedUrl && typeof json.signedUrl === "string") {
          logo = json.signedUrl
        }
      } catch {
        logo = ""
      }
    }
    const recruiterProfileImg = app.profile_img || ""
    if (recruiterProfileImg) {
      if (recruiterProfileImg.startsWith("http")) {
        recruiterImg = recruiterProfileImg
      } else {
        try {
          const res = await fetch("/api/employers/get-signed-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bucket: "user.avatars",
              path: recruiterProfileImg,
            }),
          })
          const json = await res.json()
          recruiterImg = json.signedUrl || ""
        } catch {
          recruiterImg = ""
        }
      }
    }
    recruiterName = app.job_postings?.registered_employers?.first_name
      ? `${app.job_postings?.registered_employers?.first_name} ${app.job_postings?.registered_employers?.last_name || ""}`.trim()
      : ""
    setJobRatingCompanyImg(logo)
    setJobRatingRecruiterImg(recruiterImg)
    setJobRatingRecruiterName(recruiterName)
    setJobRatingData({
      companyLogo: logo,
      jobTitle: app.job_postings?.job_title || "",
      recruiterName,
      companyName: app.company_name || app.job_postings?.registered_employers?.company_name || "",
      dateOfHiring: app.applied_at || "",
      jobType: app.job_postings?.work_type || "",
      department: "",
      location: app.job_postings?.location || "",
    })
    setIsJobRatingModalOpen(true)
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
                  <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="all" className="w-full">
                    <TabsList className="flex w-full border-b border-gray-200">
                      <TabsTrigger value="all" className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent hover:text-blue-600 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600">All</TabsTrigger>
                      <TabsTrigger value="pending" className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent hover:text-blue-600 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600">Pending</TabsTrigger>
                      <TabsTrigger value="review" className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent hover:text-blue-600 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600">Under Review</TabsTrigger>
                      <TabsTrigger value="interview" className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent hover:text-blue-600 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600">Interview</TabsTrigger>
                      <TabsTrigger value="hired" className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent hover:text-blue-600 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600">Hired</TabsTrigger>
                      <TabsTrigger value="rejected" className="flex-1 text-center py-2 text-sm font-medium text-gray-400 border-b-4 border-transparent hover:text-blue-600 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600">Rejected</TabsTrigger>
                    </TabsList>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-600">
                        {(() => {
                          if (!applicationsData) return 0
                          if (activeTab === "all") return applicationsData.length
                          if (activeTab === "pending") return applicationsData.filter(a => (a.status || "").toLowerCase() === "new").length
                          if (activeTab === "review") return applicationsData.filter(a => (a.status || "").toLowerCase() === "shortlisted").length
                          if (activeTab === "interview") return applicationsData.filter(a => (a.status || "").toLowerCase() === "interview scheduled").length
                          if (activeTab === "hired") return applicationsData.filter(a => (a.status || "").toLowerCase() === "hired").length
                          if (activeTab === "rejected") return applicationsData.filter(a => (a.status || "").toLowerCase() === "rejected").length
                          return 0
                        })()} applications
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-blue-600">Sort by</span>
                        <button className="bg-white px-3 py-1 rounded-full text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 flex items-center gap-1">
                          Date Applied
                        </button>
                        <Button
                          variant="outline"
                          className="bg-white px-3 py-1 rounded-full text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Filter className="w-4 h-4 mr-1" />
                          Filters
                        </Button>
                      </div>
                    </div>

                    <TabsContent value="all" className="mt-4 space-y-4">
                      {applicationsData?.length
                        ? generateApplicationCards(
                            applicationsData.length,
                            "all",
                            selectedApplication,
                            setSelectedApplication,
                            handleViewDetails,
                            handleFollowUp,
                            handleMenuOpen,
                            applicationsData,
                            logoUrls,
                            handleOpenJobRatingModal
                          )
                        : (
                          <div className="flex flex-col items-center justify-center min-h-[220px]">
                            <TbUserSearch size={64} className="text-gray-300 mb-2" />
                            <div className="text-lg font-semibold text-gray-500">No applications yet</div>
                            <div className="text-sm text-blue-500 mt-1">You&apos;ll see your applications here once you apply</div>
                          </div>
                        )
                      }
                    </TabsContent>
                    <TabsContent value="pending" className="mt-4 space-y-4">
                      {applicationsData && applicationsData.filter(a => (a.status || "").toLowerCase() === "new").length
                        ? generateApplicationCards(
                            applicationsData.filter(a => (a.status || "").toLowerCase() === "new").length,
                            "pending",
                            selectedApplication,
                            setSelectedApplication,
                            handleViewDetails,
                            handleFollowUp,
                            handleMenuOpen,
                            applicationsData.filter(a => (a.status || "").toLowerCase() === "new"),
                            logoUrls,
                            handleOpenJobRatingModal
                          )
                        : (
                          <div className="flex flex-col items-center justify-center min-h-[220px]">
                            <TbUserSearch size={64} className="text-gray-300 mb-2" />
                            <div className="text-lg font-semibold text-gray-500">No pending applications</div>
                            <div className="text-sm text-blue-500 mt-1">Pending applications will appear here</div>
                          </div>
                        )
                      }
                    </TabsContent>
                    <TabsContent value="review" className="mt-4 space-y-4">
                      {applicationsData && applicationsData.filter(a => (a.status || "").toLowerCase() === "shortlisted").length
                        ? generateApplicationCards(
                            applicationsData.filter(a => (a.status || "").toLowerCase() === "shortlisted").length,
                            "review",
                            selectedApplication,
                            setSelectedApplication,
                            handleViewDetails,
                            handleFollowUp,
                            handleMenuOpen,
                            applicationsData.filter(a => (a.status || "").toLowerCase() === "shortlisted"),
                            logoUrls,
                            handleOpenJobRatingModal
                          )
                        : (
                          <div className="flex flex-col items-center justify-center min-h-[220px]">
                            <TbUserSearch size={64} className="text-gray-300 mb-2" />
                            <div className="text-lg font-semibold text-gray-500">No applications under review</div>
                            <div className="text-sm text-blue-500 mt-1">Reviewed applications will appear here</div>
                          </div>
                        )
                      }
                    </TabsContent>
                    <TabsContent value="interview" className="mt-4 space-y-4">
                      {applicationsData && applicationsData.filter(a => (a.status || "").toLowerCase() === "interview scheduled").length
                        ? generateApplicationCards(
                            applicationsData.filter(a => (a.status || "").toLowerCase() === "interview scheduled").length,
                            "interview",
                            selectedApplication,
                            setSelectedApplication,
                            handleViewDetails,
                            handleFollowUp,
                            handleMenuOpen,
                            applicationsData.filter(a => (a.status || "").toLowerCase() === "interview scheduled"),
                            logoUrls,
                            handleOpenJobRatingModal
                          )
                        : (
                          <div className="flex flex-col items-center justify-center min-h-[220px]">
                            <TbUserSearch size={64} className="text-gray-300 mb-2" />
                            <div className="text-lg font-semibold text-gray-500">No interviews scheduled</div>
                            <div className="text-sm text-blue-500 mt-1">Interviewed applications will appear here</div>
                          </div>
                        )
                      }
                    </TabsContent>
                    <TabsContent value="hired" className="mt-4 space-y-4">
                      {applicationsData && applicationsData.filter(a => (a.status || "").toLowerCase() === "hired").length
                        ? generateApplicationCards(
                            applicationsData.filter(a => (a.status || "").toLowerCase() === "hired").length,
                            "hired",
                            selectedApplication,
                            setSelectedApplication,
                            handleViewDetails,
                            handleFollowUp,
                            handleMenuOpen,
                            applicationsData.filter(a => (a.status || "").toLowerCase() === "hired"),
                            logoUrls,
                            handleOpenJobRatingModal
                          )
                        : (
                          <div className="flex flex-col items-center justify-center min-h-[220px]">
                            <TbUserSearch size={64} className="text-gray-300 mb-2" />
                            <div className="text-lg font-semibold text-gray-500">No hired applications</div>
                            <div className="text-sm text-green-500 mt-1">Hired applications will appear here</div>
                          </div>
                        )
                      }
                    </TabsContent>
                    <TabsContent value="rejected" className="mt-4 space-y-4">
                      {applicationsData && applicationsData.filter(a => (a.status || "").toLowerCase() === "rejected").length
                        ? generateApplicationCards(
                            applicationsData.filter(a => (a.status || "").toLowerCase() === "rejected").length,
                            "rejected",
                            selectedApplication,
                            setSelectedApplication,
                            handleViewDetails,
                            handleFollowUp,
                            handleMenuOpen,
                            applicationsData.filter(a => (a.status || "").toLowerCase() === "rejected"),
                            logoUrls,
                            handleOpenJobRatingModal
                          )
                        : (
                          <div className="flex flex-col items-center justify-center min-h-[220px]">
                            <TbUserSearch size={64} className="text-gray-300 mb-2" />
                            <div className="text-lg font-semibold text-gray-500">No rejected applications</div>
                            <div className="text-sm text-blue-500 mt-1">Rejected applications will appear here</div>
                          </div>
                        )
                      }
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
          applicationData={
            typeof modalApplicationId === "number" && applicationsData
              ? (() => {
                  const app = applicationsData.find(
                    (app, idx) =>
                      (app.job_postings?.id && Number(app.job_postings.id) === modalApplicationId) ||
                      (app["id"] && Number(app["id"]) === modalApplicationId) ||
                      idx + 1 === modalApplicationId
                  )
                  return app
                    ? {
                        ...app,
                        resume: app.resume ?? "",
                        resumeUrl: app.resumeUrl ?? "",
                        achievements: app.achievements || [],
                        portfolio: app.portfolio || []
                      }
                    : undefined
                })()
              : undefined
          }
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

      <JobRatingModal
        isOpen={isJobRatingModalOpen}
        onClose={() => setIsJobRatingModalOpen(false)}
        jobId={jobRatingJobId}
        jobTitle={jobRatingData?.jobTitle || ""}
        companyName={jobRatingData?.companyName || ""}
        recruiterProfileImg={jobRatingRecruiterImg}
        companyLogoImg={jobRatingCompanyImg}
        recruiterName={jobRatingRecruiterName}
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
  handleMenuOpen: (event: React.MouseEvent<HTMLButtonElement>, id: number) => void,
  applicationsData?: ApplicationData[],
  logoUrls?: { [key: number]: string | null },
  handleOpenJobRatingModal?: (app: ApplicationData) => void
) {
  const statusConfig = {
    all: { title: "Mixed", badge: "", hover: "hover:border-l-yellow-400" },
    pending: { title: "Pending", badge: "bg-yellow-100 text-yellow-700", hover: "hover:border-l-yellow-400" },
    review: { title: "Under Review", badge: "bg-cyan-100 text-cyan-700", hover: "hover:border-l-cyan-400" },
    interview: { title: "To be Interviewed", badge: "bg-purple-100 text-purple-700", hover: "hover:border-l-purple-400" },
    hired: { title: "Hired", badge: "bg-green-100 text-green-700", hover: "hover:border-l-green-400" },
    rejected: { title: "Rejected", badge: "bg-red-100 text-red-700", hover: "hover:border-l-red-400" },
    waitlisted: { title: "Waitlisted", badge: "bg-blue-100 text-blue-700", hover: "hover:border-l-blue-400" },
  }

  function mapStatus(appStatus?: string) {
    switch ((appStatus || "").toLowerCase()) {
      case "new":
        return "pending"
      case "shortlisted":
        return "review"
      case "interview scheduled":
        return "interview"
      case "hired":
        return "hired"
      case "rejected":
        return "rejected"
      case "waitlisted":
        return "waitlisted"
      default:
        return "pending"
    }
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => {
        const id = index + 1
        let cardStatus = status
        let appStatus = ""
        if (applicationsData && applicationsData[index]) {
          appStatus = mapStatus(applicationsData[index].status)
          cardStatus = status === "all" ? appStatus : status
        } else if (status === "all") {
          const statuses = ["pending", "review", "interview", "hired", "rejected", "waitlisted"]
          cardStatus = statuses[index % statuses.length]
        }

        const badgeClass = statusConfig[cardStatus as keyof typeof statusConfig]?.badge
        const hoverBorder = statusConfig[cardStatus as keyof typeof statusConfig]?.hover || "hover:border-l-blue-400"

        let workType = ""
        let payAmount = ""
        let payType = ""
        let appliedAt = ""
        let remoteOptions = ""
        let verificationTier = "basic"
        if (applicationsData && applicationsData[index]) {
          const app = applicationsData[index]
          workType = app.job_postings?.work_type || ""
          payAmount = app.job_postings?.pay_amount ? app.job_postings.pay_amount.toString() : ""
          payType = app.job_postings?.pay_type || ""
          appliedAt = app.applied_at
            ? new Date(app.applied_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : ""
          remoteOptions = app.job_postings?.remote_options || app.remote_options || ""
          verificationTier = app.job_postings?.verification_tier || "basic"
        }


        return (
          <motion.div
            key={id}
            className={`bg-white rounded-lg shadow-sm p-5 border-l-4 border-l-gray-200 ${hoverBorder} relative overflow-hidden transition-colors duration-200`}
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
                  {logoUrls && logoUrls[index] ? (
                    <Image
                      src={logoUrls[index] as string}
                      alt="Company logo"
                      width={48}
                      height={48}
                      className="object-cover rounded-lg"
                    />
                  ) : applicationsData && applicationsData[index]
                    ? (applicationsData[index].company_name || "C").charAt(0)
                    : "C"}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                      {applicationsData && applicationsData[index]
                        ? applicationsData[index].job_postings?.job_title || "Position"
                        : "Position"}
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white">
                        {verificationTier === "full" ? (
                          <CustomTooltip title="Fully verified and trusted company" arrow>
                            <motion.span whileHover={{ scale: 1.25 }} style={{ display: "inline-flex" }}>
                              <HiBadgeCheck className="w-4 h-4 text-blue-600" />
                            </motion.span>
                          </CustomTooltip>
                        ) : verificationTier === "standard" ? (
                          <CustomTooltip title="Partially verified, exercise some caution" arrow>
                            <motion.span whileHover={{ scale: 1.25 }} style={{ display: "inline-flex" }}>
                              <LuBadgeCheck className="w-4 h-4" style={{ color: "#7c3aed" }} />
                            </motion.span>
                          </CustomTooltip>
                        ) : (
                          <CustomTooltip title="Not verified, proceed carefully" arrow>
                            <motion.span whileHover={{ scale: 1.25 }} style={{ display: "inline-flex" }}>
                              <RiErrorWarningLine className="w-4 h-4 text-orange-500" />
                            </motion.span>
                          </CustomTooltip>
                        )}
                      </span>
                    </h3>
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      className="pointer-events-auto"
                    >
                      <Badge className={`${badgeClass} pointer-events-none`}>
                        {statusConfig[cardStatus as keyof typeof statusConfig]?.title || "Pending"}
                      </Badge>
                    </motion.div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-500">
                      {applicationsData && applicationsData[index]
                        ? applicationsData[index].company_name || ""
                        : ""}
                    </p>
         
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Briefcase className="h-3 w-3" />
                        <span>{workType}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <PiMoneyDuotone className="h-3 w-3" />
                        <span>
                          {payAmount && payAmount.toLowerCase() !== "no pay"
                            ? <>{payAmount}{payType ? `/${payType}` : ""}</>
                            : "No pay"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                     
                      {remoteOptions && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                           <Globe className="h-3 w-3" />
                          <span>{remoteOptions}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>Applied {appliedAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-1 items-center">

                  <motion.div whileHover={{ scale: 1.15 }} className="pointer-events-auto">
                  <Badge className="bg-green-100 text-green-700 pointer-events-none">
                    {applicationsData && applicationsData[index]
                      ? applicationsData[index].match_score || "98%"
                      : "98%"} Match
                  </Badge>
                </motion.div>
                
                <button
                  className="text-gray-400 hover:text-blue-500 transition-colors p-1.5 rounded-full hover:bg-blue-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Bookmark className="h-4 w-4" />
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
                {cardStatus === "hired" && (
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-xs flex items-center gap-1"
                    onClick={async e => {
                      e.stopPropagation()
                      if (
                        applicationsData &&
                        applicationsData[index] &&
                        handleOpenJobRatingModal
                      ) {
                        const app = applicationsData[index]
                        await handleOpenJobRatingModal(app)
                      }
                    }}
                  >
                    <AiFillStar className="w-4 h-4" />
                    Rate Job
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 text-xs"
                  onClick={(e) => handleViewDetails(id, e)}
                >
                  View Details
                </Button>
                {cardStatus !== "hired" && cardStatus !== "rejected" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700 text-xs flex items-center gap-1 px-2"
                    onClick={e => {
                      e.stopPropagation()
                      if (typeof window !== "undefined") {
                        navigator.clipboard.writeText("Withdraw application " + id)
                      }
                    }}
                  >
                    <MdOutlineExitToApp className="w-4 h-4" />
                    Withdraw Application
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
                          : cardStatus === "waitlisted"
                            ? "Waitlisted"
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



