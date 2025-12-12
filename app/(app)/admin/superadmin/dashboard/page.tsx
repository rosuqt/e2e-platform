/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {
  BarChart3,
  Users,
  Building2,
  FileText,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import supabase from "@/lib/supabase"

export default function Dashboard() {
  const [, setShowFeedback] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const [settingId, setSettingId] = useState<string | null>(null)
  const [counts, setCounts] = useState({
    totalUsers: 0,
    activeEmployers: 0,
    companies: 0,
    totalStudents: 0
  })
  const [topCompanies, setTopCompanies] = useState<
    {
      company_logo_url: any, company_id: string; company_name: string; applicant_count: number 
}[]
  >([])
  const [verificationCounts, setVerificationCounts] = useState({
    pending: 0,
    partiallyCompleted: 0,
    approved: 0
  })

  useEffect(() => {
    fetch("/api/superadmin/dashboard/fetchCounts")
      .then(res => res.json())
      .then(data => {
        setCounts({
          totalUsers: (data.totalAdmins ?? 0) + (data.totalEmployers ?? 0) + (data.totalStudents ?? 0),
          activeEmployers: data.totalEmployers ?? 0,
          companies: data.totalCompanies ?? 0,
          totalStudents: data.totalStudents ?? 0
        })
      })
  }, [])

  useEffect(() => {
    fetch("/api/admin/fetchTopCompany")
      .then(res => res.json())
      .then(data => {
        console.log("Top companies API response:", data); // Debug log
        setTopCompanies(data.companies ?? [])
      })
  }, [])

  useEffect(() => {
    const fetchSetting = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("id, show_feedback_button")
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle()
      if (data && typeof data.show_feedback_button === "boolean") {
        setShowFeedback(data.show_feedback_button)
        setSettingId(data.id)
      } else {
        const { data: inserted } = await supabase
          .from("site_settings")
          .insert([{ show_feedback_button: true }])
          .select("id, show_feedback_button")
          .single()
        if (inserted && typeof inserted.show_feedback_button === "boolean") {
          setShowFeedback(inserted.show_feedback_button)
          setSettingId(inserted.id)
        } else {
          setShowFeedback(true)
        }
      }
    }
    fetchSetting()
  }, [])

  useEffect(() => {
    fetch("/api/superadmin/dashboard/fetchVerification")
      .then(res => res.json())
      .then(data => {
        setVerificationCounts({
          pending: data.pending ?? 0,
          partiallyCompleted: data.partiallyCompleted ?? 0,
          approved: data.approved ?? 0
        })
      })
  }, [])


  const statsCards = [
    {
      title: "Total Users",
      value: counts.totalUsers.toLocaleString(),
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
    },
    {
      title: "Active Employers",
      value: counts.activeEmployers.toLocaleString(),
      change: "+8%",
      trend: "up",
      icon: Building2,
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50",
    },
    {
      title: "Companies",
      value: counts.companies.toLocaleString(),
      change: "+18%",
      trend: "up",
      icon: FileText,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
    },
    {
      title: "Total Students",
      value: counts.totalStudents.toLocaleString(),
      change: "+4%",
      trend: "up",
      icon: BarChart3,
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-lg text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your platform today.</p>
        </div>

      
             
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="group"
          >
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-5", stat.bgColor)} />
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  {stat.title}
                </CardTitle>
                <div
                  className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center", stat.color)}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div
                  className={cn(
                    "flex items-center text-sm font-semibold",
                    stat.trend === "up" ? "text-emerald-600" : "text-red-600",
                  )}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  <span>{stat.change} from last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="grid w-full grid-cols-1 rounded-2xl bg-gray-100 p-1.5 h-auto">
          <TabsTrigger
            value="overview"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-6 font-semibold"
          >
            Overview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Chart Placeholder */}
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Top Companies */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Top Companies</CardTitle>
                  <CardDescription className="text-gray-600">Most active companies by applicants</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topCompanies.length === 0 ? (
                      <div className="text-gray-500 text-center py-8">
                        No company data available.<br />
                        {/* Optionally show debug info */}
                        Please check if companies exist or if the API is returning data.
                      </div>
                    ) : (
                      topCompanies.slice(0, 5).map((company, index) => (
                        <motion.div
                          key={company.company_id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors group"
                        >
                          <div className="flex items-center gap-2">
                            {company.company_logo_url ? (
                              <img
                                src={company.company_logo_url}
                                alt={company.company_name}
                                className="h-8 w-8 rounded-full object-cover border border-gray-200"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center"></div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                {company.company_name || "Unnamed Company"}
                              </p>
                              <p className="text-xs text-gray-600">
                                {typeof company.applicant_count === "number" ? company.applicant_count : 0} total applications
                              </p>
                            </div>
                          </div>
                          <TrendingUp className="h-5 w-5 text-emerald-500" />
                        </motion.div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Company Verification Status */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Company Verification</CardTitle>
                  <CardDescription className="text-gray-600">Verification status overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-700">Pending (basic)</span>
                      <span className="font-bold text-2xl text-yellow-600">{verificationCounts.pending}</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${verificationCounts.pending > 0 ? Math.min(verificationCounts.pending / (verificationCounts.pending + verificationCounts.partiallyCompleted + verificationCounts.approved) * 100, 100) : 0}%` }}
                        transition={{ delay: 0.8, duration: 1 }}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-700">Partially Completed (standard)</span>
                      <span className="font-bold text-2xl text-blue-600">{verificationCounts.partiallyCompleted}</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${verificationCounts.partiallyCompleted > 0 ? Math.min(verificationCounts.partiallyCompleted / (verificationCounts.pending + verificationCounts.partiallyCompleted + verificationCounts.approved) * 100, 100) : 0}%` }}
                        transition={{ delay: 1, duration: 1 }}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-700">Approved (full)</span>
                      <span className="font-bold text-2xl text-emerald-600">{verificationCounts.approved}</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${verificationCounts.approved > 0 ? Math.min(verificationCounts.approved / (verificationCounts.pending + verificationCounts.partiallyCompleted + verificationCounts.approved) * 100, 100) : 0}%` }}
                        transition={{ delay: 1.2, duration: 1 }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
