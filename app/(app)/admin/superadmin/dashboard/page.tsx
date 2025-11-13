"use client"

import {
  BarChart3,
  Users,
  Building2,
  FileText,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import supabase from "@/lib/supabase"

const statsCards = [
  {
    title: "Total Users",
    value: "2,853",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-50 to-cyan-50",
  },
  {
    title: "Active Employers",
    value: "432",
    change: "+8%",
    trend: "up",
    icon: Building2,
    color: "from-emerald-500 to-teal-500",
    bgColor: "from-emerald-50 to-teal-50",
  },
  {
    title: "Companies",
    value: "1,234",
    change: "+18%",
    trend: "up",
    icon: FileText,
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-50 to-pink-50",
  },
  {
    title: "Pending Reports",
    value: "24",
    change: "-4%",
    trend: "down",
    icon: BarChart3,
    color: "from-orange-500 to-red-500",
    bgColor: "from-orange-50 to-red-50",
  },
]

const recentActivities = [
  {
    id: 1,
    type: "user",
    title: "New admin account created",
    description: "John Smith created a new admin account",
    time: "2 hours ago",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    type: "company",
    title: "Company verification completed",
    description: "TechCorp Inc. has been verified",
    time: "4 hours ago",
    icon: CheckCircle,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: 3,
    type: "report",
    title: "New bug report submitted",
    description: "Critical issue reported in job application system",
    time: "6 hours ago",
    icon: AlertTriangle,
    color: "from-orange-500 to-red-500",
  },
]
const topEmployers = [
  { id: 1, name: "TechCorp Inc.", listings: 18, growth: "+15%" },
  { id: 2, name: "InnovateLab", listings: 16, growth: "+12%" },
  { id: 3, name: "DataSystems", listings: 14, growth: "+8%" },
  { id: 4, name: "CloudTech", listings: 12, growth: "+22%" },
  { id: 5, name: "StartupHub", listings: 10, growth: "+5%" },
]

export default function Dashboard() {
  const [showFeedback, setShowFeedback] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const [settingId, setSettingId] = useState<string | null>(null)

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

  const handleToggle = async () => {
    setLoading(true)
    if (settingId) {
      await supabase
        .from("site_settings")
        .update({ show_feedback_button: !showFeedback })
        .eq("id", settingId)
      setShowFeedback(!showFeedback)
    } else {
      const { data } = await supabase
        .from("site_settings")
        .insert([{ show_feedback_button: !showFeedback }])
        .select("id, show_feedback_button")
        .single()
      if (data) {
        setShowFeedback(data.show_feedback_button)
        setSettingId(data.id)
      }
    }
    setLoading(false)
  }

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

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center space-x-4 p-6 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
        >
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <div className="flex items-center space-x-4">
            <div>
              <p className="font-semibold">Testing Mode</p>
              <p className="text-sm text-white/80">Enable feedback collection</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={!!showFeedback}
                onChange={handleToggle}
                disabled={loading}
                className="sr-only peer"
                aria-label="Testing Mode"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:bg-white/40 transition-all duration-200"></div>
              <div
                className={cn(
                  "absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200",
                  showFeedback ? "translate-x-5" : ""
                )}
              />
            </label>
          </div>
        </motion.div>
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
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none lg:flex rounded-2xl bg-gray-100 p-1.5 h-auto">
          <TabsTrigger
            value="overview"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-6 font-semibold"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-6 font-semibold"
          >
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-6 font-semibold"
          >
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Chart Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">User Registration Trends</CardTitle>
                  <CardDescription className="text-gray-600">
                    Monthly user registrations over the past year
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium text-lg">Chart: Monthly user registrations</p>
                      <p className="text-gray-400 text-sm mt-2">Interactive chart will be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activities */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="border-0 shadow-lg bg-white h-full">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Recent Activities</CardTitle>
                  <CardDescription className="text-gray-600">Latest system activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group"
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center",
                            activity.color,
                          )}
                        >
                          <activity.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{activity.description}</p>
                          <div className="flex items-center space-x-1 mt-2">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Top Employers */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Top Employers</CardTitle>
                  <CardDescription className="text-gray-600">Most active employers on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topEmployers.map((employer, index) => (
                      <motion.div
                        key={employer.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                              {employer.name}
                            </p>
                            <p className="text-sm text-gray-600">{employer.listings} job listings</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-semibold px-3 py-1 rounded-full">
                            {employer.growth}
                          </Badge>
                          <TrendingUp className="w-5 h-5 text-emerald-500" />
                        </div>
                      </motion.div>
                    ))}
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
                      <span className="font-semibold text-gray-700">Pending</span>
                      <span className="font-bold text-2xl text-yellow-600">7</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "35%" }}
                        transition={{ delay: 0.8, duration: 1 }}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-700">Verified This Month</span>
                      <span className="font-bold text-2xl text-emerald-600">15</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "75%" }}
                        transition={{ delay: 1, duration: 1 }}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-700">Rejected</span>
                      <span className="font-bold text-2xl text-red-600">2</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "10%" }}
                        transition={{ delay: 1.2, duration: 1 }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Advanced Analytics</CardTitle>
                <CardDescription className="text-gray-600">Detailed platform analytics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-200">
                  <div className="text-center">
                    <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium text-lg">Advanced Analytics Dashboard</p>
                    <p className="text-gray-400 text-sm mt-2">Comprehensive analytics will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="reports">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">System Reports</CardTitle>
                <CardDescription className="text-gray-600">Generated reports and statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-200">
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium text-lg">System Reports</p>
                    <p className="text-gray-400 text-sm mt-2">Detailed reports and statistics will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
