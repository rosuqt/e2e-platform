"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  Calendar,
  Award,
  TrendingUp,
  Clock,
  Star,
  Building2,
} from "lucide-react"
import { FaLinkedin, FaFacebook, FaTwitter, FaInstagram, FaGithub, FaYoutube } from "react-icons/fa"
import dynamic from "next/dynamic"
import Image from "next/image"
import { RatingsCards } from "./marquee-ratings"
import { Star as StarIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import AddEditContactModal from "./add-edit-contact"
import AvailabilityModal from "./availability-modal"
import { SiIndeed } from "react-icons/si"

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false })

type SessionUser = {
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string | null
  employerId?: string
}

type SocialLink = { key: string; url: string }
type ContactInfo = {
  email?: string
  countryCode?: string
  phone?: string
  socials?: SocialLink[]
  website?: string
} | null

type RegisteredEmployer = {
  email?: string
  phone?: string
  countryCode?: string
  company_email?: string
}
type RegisteredCompany = {
  company_website?: string
}

export default function AboutTab({ goToRatingsTab }: { goToRatingsTab?: () => void }) {
  const { data: session } = useSession()
  const employerID = (session?.user as SessionUser)?.employerId

  const [about, setAbout] = useState("")
  const [hiringPhilosophy, setHiringPhilosophy] = useState("")
  const [contactInfo, setContactInfo] = useState<ContactInfo>(null)
  const [registeredEmployer, setRegisteredEmployer] = useState<RegisteredEmployer | null>(null)
  const [registeredCompany, setRegisteredCompany] = useState<RegisteredCompany | null>(null)
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [availability, setAvailability] = useState<{
    days?: string[];
    start?: string;
    end?: string;
    timezone?: string;
  } | null>(null)

  useEffect(() => {
    if (!employerID) return
    fetch(`/api/employers/employer-profile/getHandlers?employerID=${employerID}`)
      .then((res) => res.json())
      .then((data) => {
        setAbout(data.about || "")
        setHiringPhilosophy(data.hiring_philosophy || "")
        setContactInfo(data.contact_info as ContactInfo || null)
        setRegisteredEmployer(
          data.registered_employer
            ? {
                ...data.registered_employer,
                countryCode: data.registered_employer.country_code || data.registered_employer.countryCode,
                company_email: data.registered_employer.company_email
              }
            : null
        )
        setRegisteredCompany(data.registered_company || null)
        setAvailability(data.availability || null)
      })
  }, [employerID, refreshKey])

  async function saveProfileField(field: "about" | "hiring_philosophy", value: string) {
    if (!employerID) return
    await fetch("/api/employers/employer-profile/postHandlers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employerID, [field]: value }),
    })
  }

  async function saveContactInfo(data: ContactInfo) {
    if (!employerID) return
    await fetch("/api/employers/employer-profile/postHandlers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employerID, contact_info: data }),
    })
    setContactInfo(data)
    setRefreshKey((k) => k + 1)
  }

  function handleAboutChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setAbout(e.target.value)
  }
  function handleAboutKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      saveProfileField("about", about)
    }
  }
  function handleHiringPhilosophyChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setHiringPhilosophy(e.target.value)
  }
  function handleHiringPhilosophyKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      saveProfileField("hiring_philosophy", hiringPhilosophy)
    }
  }

  const company = {
    logo: "/placeholder.svg?height=64&width=64",
    name: "TechCorp Inc.",
    location: "San Francisco, CA",
    industry: "Technology",
    founded: "2015",
    size: "500-1000 employees",
    about:
      "TechCorp is a leading innovator in the tech industry, specializing in cloud solutions, AI, and enterprise software. Our mission is to empower businesses through cutting-edge technology and a commitment to excellence in service and product delivery.",
  }

  const team = [
    {
      id: "1",
      name: "Valentina Johnson",
      job_title: "Frontend Developer",
      avatar: "/images/random-profiles/1.png",
      company: "TechCorp Inc.",
    },
    {
      id: "2",
      name: "Kemelrina Smith",
      job_title: "UX Designer",
      avatar: "/images/random-profiles/3.png",
      company: "TechCorp Inc.",
    },
    {
      id: "3",
      name: "Parker Lee",
      job_title: "Project Manager",
      avatar: "/images/random-profiles/2.png",
      company: "TechCorp Inc.",
    },
    {
      id: "4",
      name: "Zeyn Ali",
      job_title: "Backend Developer",
      avatar: "/images/random-profiles/4.png",
      company: "TechCorp Inc.",
    },
  ]

  const hiringMetrics = [
    { label: "Response Rate", value: 0, color: "#3b82f6" },
    { label: "Interview Rate", value: 0, color: "#10b981" },
    { label: "Offer Acceptance", value: 0, color: "#f59e0b" },
  ]

  const analyticsOption = {
    tooltip: { trigger: "item" },
    legend: {
      top: "bottom",
      textStyle: { fontSize: 12 },
    },
    series: [
      {
        name: "Hiring Pipeline",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 8, borderColor: "#fff", borderWidth: 2 },
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 14, fontWeight: "bold" } },
        labelLine: { show: false },
        data: [
          { value: 0, name: "Applications" },
          { value: 0, name: "Interviews" },
          { value: 0, name: "Final Round" },
          { value: 0, name: "Offers" },
        ],
      },
    ],
    color: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
  }

  const monthlyHiringOption = {
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      axisLabel: { fontSize: 11 },
    },
    yAxis: {
      type: "value",
      axisLabel: { fontSize: 11 },
    },
    series: [
      {
        data: [0, 0, 0, 0, 0, 0],
        type: "line",
        smooth: true,
        lineStyle: { color: "#3b82f6", width: 3 },
        itemStyle: { color: "#3b82f6" },
        areaStyle: { color: "rgba(59, 130, 246, 0.1)" },
      },
    ],
    grid: { left: 40, right: 20, top: 20, bottom: 40 },
  }

  const SOCIALS = [
    { key: "linkedin", icon: <FaLinkedin size={20} />, color: "bg-blue-100", text: "text-blue-600" },
    { key: "facebook", icon: <FaFacebook size={20} />, color: "bg-blue-600", text: "text-white" },
    { key: "twitter", icon: <FaTwitter size={20} />, color: "bg-blue-400", text: "text-white" },
    { key: "instagram", icon: <FaInstagram size={20} />, color: "bg-pink-400", text: "text-white" },
    { key: "github", icon: <FaGithub size={20} />, color: "bg-gray-800", text: "text-white" },
    { key: "youtube", icon: <FaYoutube size={20} />, color: "bg-red-500", text: "text-white" },
    { key: "indeed", icon: <SiIndeed size={20} />, color: "bg-blue-900", text: "text-white" },
    { key: "website", icon: <Globe className="w-5 h-5" />, color: "bg-green-200", text: "text-green-700" }
  ]

  return (
    <div className="space-y-6">
      {/* About Info */}
      <Card className="border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-blue-700 flex items-center gap-2">
                <Building2 className="text-blue-600" size={20} />
                About Info
              </CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-700 font-medium">Active Recruiter</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">Update your background and experience to reflect your career.</p>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Introduction */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Introduction
            </h3>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 min-h-[100px] resize-none"
              placeholder="Write about your role and responsibilities. Press Enter to save."
              value={about}
              onChange={handleAboutChange}
              onKeyDown={handleAboutKeyDown}
            />
          </div>

          <Separator />

          {/* Hiring Philosophy */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              Hiring Philosophy
            </h3>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 min-h-[120px] resize-none"
              placeholder="Describe your hiring philosophy. Press Enter to save."
              value={hiringPhilosophy}
              onChange={handleHiringPhilosophyChange}
              onKeyDown={handleHiringPhilosophyKeyDown}
            />
          </div>

          <Separator />

        </CardContent>
      </Card>

      {/* Candidate Ratings */}
      <section className="bg-white rounded-lg shadow-sm border border-blue-200">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100 rounded-t-lg px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StarIcon className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-semibold text-blue-700">Candidate Ratings</h2>
          </div>
          <button
            type="button"
            onClick={goToRatingsTab}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm px-4 py-2 border border-blue-200 rounded-md transition-colors"
          >
            View All Ratings
          </button>
        </div>
        <div className="p-6">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-medium">4.8/5</span>
            </div>
            <p className="text-xs text-gray-600">Based on 127 candidate reviews</p>
          </div>
          <RatingsCards />
        </div>
      </section>

      {/* Analytics Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
            <CardTitle className="text-blue-700 flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={18} />
              Hiring Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ReactECharts option={analyticsOption} style={{ height: 200 }} />
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
            <CardTitle className="text-blue-700 flex items-center gap-2">
              <Calendar className="text-blue-600" size={18} />
              Monthly Hires
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ReactECharts option={monthlyHiringOption} style={{ height: 200 }} />
          </CardContent>
        </Card>
      </div>

      {/* Hiring Metrics */}
      <Card className="border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
          <CardTitle className="text-blue-700 flex items-center gap-2">
            <Award className="text-blue-600" size={18} />
            Key Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {hiringMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="mb-3">
                  <div className="text-3xl font-bold" style={{ color: metric.color }}>
                    {metric.value}%
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{metric.label}</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${metric.value}%`,
                      backgroundColor: metric.color,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Company Association */}
      <Card className="border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
          <CardTitle className="text-blue-700 flex items-center gap-2">
            <Building2 className="text-blue-600" size={18} />
            Company Association
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-60 h-60 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                  <Image src={"/images/logo-test2.png"} alt={company.name} width={150} height={150  } />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-900 mb-2">{company.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {company.location}
                    </Badge>
                    <Badge variant="outline">{company.industry}</Badge>
                    <Badge variant="outline">Founded {company.founded}</Badge>
                    <Badge variant="outline">{company.size}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{company.about}</p>
                  <Button variant="outline" size="sm" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                    View Company Profile
                  </Button>
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Team Members
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {team.slice(0, 4).map((member) => (
                  <div key={member.id} className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mb-2 mx-auto">
                      <Image src={member.avatar || "/placeholder.svg"} alt={member.name} width={48} height={48} />
                    </div>
                    <div className="text-sm font-medium text-gray-800 truncate">{member.name}</div>
                    <div className="text-xs text-gray-500 truncate">{member.job_title}</div>
                  </div>
                ))}
              </div>
              <Button variant="link" size="sm" className="text-blue-600 hover:text-blue-800 mt-3 w-full">
                View All Team Members
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border-blue-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
          <CardTitle className="text-blue-700 flex items-center gap-2">
            <Mail className="text-blue-600" size={18} />
            Contact Information
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Keep your contact details up-to-date for candidates and networking.
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">
                    {contactInfo?.email ||
                      registeredEmployer?.email ||
                      "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 flex items-center justify-center rounded-full">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">
                    {registeredEmployer?.phone
                      ? `+${registeredEmployer.countryCode || ""} ${registeredEmployer.phone}`
                      : contactInfo?.phone
                      ? `+${contactInfo.countryCode || ""} ${contactInfo.phone}`
                      : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 text-gray-600 flex items-center justify-center rounded-full">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Company Website</p>
                  <p className="text-sm text-gray-600">
                    {registeredCompany?.company_website?.trim()
                      ? registeredCompany.company_website
                      : "Not provided"}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Social Media</h4>
              <div className="flex gap-4 flex-wrap">
                {(contactInfo?.socials || []).filter((s: SocialLink) => s.key !== "website").map((s: SocialLink) => {
                  const social = SOCIALS.find((soc) => soc.key === s.key);
                  const url = s.url ? (s.url.startsWith("http") ? s.url : `https://${s.url}`) : undefined;
                  return (
                    <div key={s.key} className="flex flex-col items-center">
                      {url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-12 h-12 flex items-center justify-center rounded-full ${social?.color ?? "bg-blue-100"} ${social?.text ?? "text-blue-600"}`}
                          style={{ textDecoration: "none" }}
                        >
                          {social?.icon}
                        </a>
                      ) : (
                        <div className={`w-12 h-12 flex items-center justify-center rounded-full ${social?.color ?? "bg-blue-100"} ${social?.text ?? "text-blue-600"}`}>
                          {social?.icon}
                        </div>
                      )}
                      {url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs mt-2 font-medium text-black"
                          style={{ textDecoration: "none" }}
                        >
                          {s.key.charAt(0).toUpperCase() + s.key.slice(1)}
                        </a>
                      ) : (
                        <p className="text-xs mt-2 font-medium text-black">{s.key.charAt(0).toUpperCase() + s.key.slice(1)}</p>
                      )}
                    </div>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-600 hover:bg-blue-50 mt-6"
                onClick={() => setContactModalOpen(true)}
              >
                Edit Contact Info
              </Button>
              <AddEditContactModal
                open={contactModalOpen}
                onClose={() => setContactModalOpen(false)}
                onSave={saveContactInfo}
                initial={{
        
                  email: contactInfo?.email || registeredEmployer?.email || "",
                  personal_email: registeredEmployer?.email || "", 
                  countryCode: contactInfo?.countryCode || registeredEmployer?.countryCode || "",
                  phone: contactInfo?.phone || registeredEmployer?.phone || "",
                  socials: contactInfo?.socials || [],
                  website: contactInfo?.website || registeredCompany?.company_website || "",
                  company_email: registeredEmployer?.company_email
                }}
              />
            </div>
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Response Time
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-medium font-medium">
                    No response data yet
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {(() => {
                      if (
                        availability &&
                        Array.isArray(availability.days) &&
                        availability.days.length > 0 &&
                        availability.start &&
                        availability.end &&
                        availability.timezone
                      ) {
                        const days = availability.days;
                        const week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                        if (days.length === 6) {
                          const missing = week.find(d => !days.includes(d));
                          if (missing) {
                            return (
                              <>
                                {`Available anytime except ${missing}`}
                                <br />
                                {`${availability.start} - ${availability.end} ${availability.timezone}`}
                              </>
                            );
                          }
                        }
                        const indices = days.map(d => week.indexOf(d)).sort((a, b) => a - b);
                        if (days.length === 1) {
                          return (
                            <>
                              {days[0]}
                              <br />
                              {`${availability.start} - ${availability.end} ${availability.timezone}`}
                            </>
                          );
                        }
                        if (
                          days.length > 1 &&
                          indices.every((v, i, arr) => i === 0 || v === arr[i - 1] + 1)
                        ) {
                          return (
                            <>
                              {`${days[0]} - ${days[days.length - 1]}`}
                              <br />
                              {`${availability.start} - ${availability.end} ${availability.timezone}`}
                            </>
                          );
                        }
                        return (
                          <>
                            {days.join(", ")}
                            <br />
                            {`${availability.start} - ${availability.end} ${availability.timezone}`}
                          </>
                        );
                      }
                      return "Anytime";
                    })()}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50 p-1 ml-2"
                    onClick={() => setAvailabilityModalOpen(true)}
                  >
                    <svg width={18} height={18} viewBox="0 0 20 20" fill="none">
                      <path d="M12.5 5.5l2 2m0 0l-7.5 7.5H5v-2l7.5-7.5m2 2l-2-2" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AvailabilityModal
        open={availabilityModalOpen}
        onClose={() => {
          setAvailabilityModalOpen(false)
          setRefreshKey((k) => k + 1)
        }}
      />
    </div>
  )
}
