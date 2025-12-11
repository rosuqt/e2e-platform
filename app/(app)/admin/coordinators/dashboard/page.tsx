"use client"

import { useState, useEffect } from "react"
import {
  Users,
  FileText,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  GraduationCap,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

export default function AdminDashboard() {
  const [topCompanies, setTopCompanies] = useState<
    { company_id: string, company_name: string, applicant_count: number, company_logo_url?: string }[]
  >([])
  const [loadingCompanies, setLoadingCompanies] = useState(true)
  const [studentStats, setStudentStats] = useState<{ count: number, statusCounts?: Record<string, number> }>({ count: 0, statusCounts: {} })
  const [recentActivities, setRecentActivities] = useState<
    { name: string; position: string; update: string; time: string; icon: string }[]
  >([])
  const [loadingActivities, setLoadingActivities] = useState(true)

  useEffect(() => {
    setLoadingCompanies(true)
    fetch("/api/admin/dashboard/fetchTopCompany")
      .then(res => res.json())
      .then(data => setTopCompanies(data.companies || []))
      .finally(() => setLoadingCompanies(false))
  }, [])

  useEffect(() => {
    fetch("/api/admin/dashboard/fetchStudent")
      .then(res => res.json())
      .then(data => setStudentStats({ count: data.count || 0, statusCounts: data.statusCounts || {} }))
  }, [])

  useEffect(() => {
    setLoadingActivities(true)
    fetch("/api/employers/applications/activity")
      .then(res => res.json())
      .then(data => setRecentActivities(data || []))
      .finally(() => setLoadingActivities(false))
  }, [])

  const hiredCount =
    studentStats.statusCounts?.hired ??
    studentStats.statusCounts?.Hired ??
    0
  const inProgressCount =
    studentStats.count - hiredCount

  const statsCards = [
    {
      title: "Total Students",
      value: studentStats.count.toString(),
      change: "",
      trend: "up",
      icon: GraduationCap,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      sub: "",
    },
    {
      title: "Hired Students",
      value: hiredCount.toString(),
      change: "",
      trend: "up",
      icon: Users,
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50",
      sub: "",
    },
    {
      title: "In Progress",
      value: inProgressCount.toString(),
      change: "",
      trend: "down",
      icon: FileText,
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50",
      sub: "",
    },
  ]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
      >
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-lg text-gray-600">IT Department Admin Dashboard</p>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              <div className={`absolute inset-0 bg-gradient-to-br opacity-5 ${stat.bgColor}`} />
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  {stat.title}
                </CardTitle>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div
                  className={
                    stat.trend === "up"
                      ? "flex items-center text-sm font-semibold text-emerald-600"
                      : "flex items-center text-sm font-semibold text-red-600"
                  }
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  <span>{stat.change} {stat.sub}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="grid w-full grid-cols-1 lg:w-auto lg:grid-cols-none lg:flex rounded-2xl bg-gray-100 p-1.5 h-auto">
          <TabsTrigger
            value="overview"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-6 font-semibold"
          >
            Overview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Student Status Overview</CardTitle>
                  <CardDescription className="text-gray-600">
                    Distribution of student application statuses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-200 p-6">
                    {loadingActivities || loadingCompanies || !studentStats.statusCounts ? (
                      <div className="w-full max-w-lg flex items-center justify-center h-full">
                        <div className="animate-pulse w-full">
                          <div className="h-8 w-2/3 bg-gray-200 rounded mb-4 mx-auto" />
                          <div className="flex gap-4 justify-center">
                            {Array.from({ length: 6 }).map((_, i) => (
                              <div key={i} className="w-10 h-24 bg-gray-200 rounded" />
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : studentStats.statusCounts && Object.keys(studentStats.statusCounts).length > 0 ? (
                      <div className="w-full max-w-lg">
                        {/* Simple SVG Bar Chart */}
                        <svg width="100%" height="200">
                          {Object.entries(studentStats.statusCounts).map(([status, count], i) => {
                            const barWidth = 40
                            const gap = 20
                            const maxCount = Math.max(...Object.values(studentStats.statusCounts ?? {}))
                            const barHeight = maxCount ? (count / maxCount) * 140 : 0
                            return (
                              <g key={status} transform={`translate(${i * (barWidth + gap)},0)`}>
                                <rect
                                  x={0}
                                  y={160 - barHeight}
                                  width={barWidth}
                                  height={barHeight}
                                  rx={8}
                                  fill="#6366f1"
                                />
                                <text
                                  x={barWidth / 2}
                                  y={175}
                                  textAnchor="middle"
                                  fontSize="14"
                                  fill="#444"
                                >
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </text>
                                <text
                                  x={barWidth / 2}
                                  y={160 - barHeight - 8}
                                  textAnchor="middle"
                                  fontSize="14"
                                  fill="#222"
                                  fontWeight="bold"
                                >
                                  {count}
                                </text>
                              </g>
                            )
                          })}
                        </svg>
                      </div>
                    ) : (
                      <p className="text-gray-500 font-medium text-lg">No status data available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="border-0 shadow-lg bg-white h-full">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Student Status</CardTitle>
                  <CardDescription className="text-gray-600">Breakdown by placement status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-200 p-6">
                    {loadingActivities || loadingCompanies || !studentStats.statusCounts ? (
                      <div className="w-full max-w-xs flex flex-col gap-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <div className="h-4 w-24 bg-gray-200 rounded" />
                            <div className="h-4 w-8 bg-gray-200 rounded" />
                          </div>
                        ))}
                      </div>
                    ) : studentStats.statusCounts && Object.keys(studentStats.statusCounts).length > 0 ? (
                      <div className="w-full max-w-xs">
                        <ul className="space-y-2">
                          {Object.entries(studentStats.statusCounts).map(([status, count]) => (
                            <li key={status} className="flex justify-between items-center text-gray-700 font-medium">
                              <span className="capitalize">{status}</span>
                              <span className="font-bold">{count}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-gray-500 font-medium text-lg">No status data available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Recent Activities</CardTitle>
                  <CardDescription className="text-gray-600">Latest department activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loadingActivities ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-4 p-4 rounded-2xl animate-pulse bg-gray-50"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500" />
                          <div className="flex-1 min-w-0">
                            <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                            <div className="h-3 w-20 bg-gray-100 rounded" />
                          </div>
                        </div>
                      ))
                    ) : recentActivities.length === 0 ? (
                      <p className="text-gray-500 font-medium text-lg">No recent activities</p>
                    ) : (
                      recentActivities.slice(0, 5).map((activity, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <Users className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                              {activity.name ? `${activity.name} - ` : ""}{activity.update}
                            </p>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {activity.position ? `${activity.position} · ` : ""}
                              {new Date(activity.time).toLocaleString()}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Top Companies</CardTitle>
                  <CardDescription className="text-gray-600">Companies hiring the most students</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loadingCompanies ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 rounded-2xl animate-pulse bg-gray-50"
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gray-200" />
                            <div>
                              <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                              <div className="h-3 w-20 bg-gray-100 rounded" />
                            </div>
                          </div>
                          <div className="h-5 w-5 rounded bg-gray-200" />
                        </div>
                      ))
                    ) : topCompanies.length === 0 ? (
                      <p className="text-gray-500 font-medium text-lg">No data available</p>
                    ) : (
                      topCompanies.slice(0, 5).map((company, i) => (
                        <motion.div
                          key={company.company_id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + i * 0.1 }}
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
                                {company.company_name}
                              </p>
                              <p className="text-xs text-gray-600">{company.applicant_count} total applications</p>
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

