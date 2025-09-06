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
import { FaLinkedin, FaFacebook, FaTwitter } from "react-icons/fa"
import dynamic from "next/dynamic"
import Image from "next/image"
import { MarqueeDemo } from "./marquee-ratings"
import { Star as StarIcon } from "lucide-react"

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false })

export default function AboutTab({ goToRatingsTab }: { goToRatingsTab?: () => void }) {
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
    { label: "Response Rate", value: 92, color: "#3b82f6" },
    { label: "Interview Rate", value: 78, color: "#10b981" },
    { label: "Offer Acceptance", value: 85, color: "#f59e0b" },
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
          { value: 45, name: "Applications" },
          { value: 25, name: "Interviews" },
          { value: 15, name: "Final Round" },
          { value: 15, name: "Offers" },
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
        data: [12, 8, 15, 10, 18, 14],
        type: "line",
        smooth: true,
        lineStyle: { color: "#3b82f6", width: 3 },
        itemStyle: { color: "#3b82f6" },
        areaStyle: { color: "rgba(59, 130, 246, 0.1)" },
      },
    ],
    grid: { left: 40, right: 20, top: 20, bottom: 40 },
  }

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
              placeholder="Write about your role and responsibilities..."
              defaultValue="Experienced HR Manager with over 10 years in the tech industry. Specialized in talent acquisition and employee development programs. Passionate about creating inclusive work environments and implementing innovative HR strategies that drive company growth."
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
              placeholder="Describe your hiring philosophy..."
              defaultValue="I believe in looking beyond just technical skills to find candidates who align with our company culture and values. I focus on potential, adaptability, and a growth mindset when building diverse and high-performing teams. Every hiring decision is made with long-term growth and development in mind, both for the individual and the organization."
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
          <MarqueeDemo />
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
                  <p className="text-sm text-gray-600">john.doe@techcorp.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 flex items-center justify-center rounded-full">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 text-gray-600 flex items-center justify-center rounded-full">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Company Website</p>
                  <p className="text-sm text-gray-600">www.techcorp.com</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Social Media</h4>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full hover:bg-blue-200 transition-colors cursor-pointer">
                    <FaLinkedin size={20} />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">LinkedIn</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full hover:bg-blue-700 transition-colors cursor-pointer">
                    <FaFacebook size={20} />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Facebook</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-400 text-white flex items-center justify-center rounded-full hover:bg-blue-500 transition-colors cursor-pointer">
                    <FaTwitter size={20} />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Twitter</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-blue-300 text-blue-600 hover:bg-blue-50 mt-6">
                Edit Contact Info
              </Button>
            </div>
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Response Time
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Typically replies within 2 hours</span>
                </div>
                <p className="text-xs text-gray-600">Available Monday - Friday, 9 AM - 6 PM PST</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
