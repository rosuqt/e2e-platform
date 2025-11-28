"use client"

import { useState, useEffect } from "react"
import {
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  ChevronDown,
  GraduationCap,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MuiPopover from "@mui/material/Popover"
import MuiButton from "@mui/material/Button"
import { motion } from "framer-motion"

const statsCards = [
  {
    title: "Total Students",
    value: "245",
    change: "+5%",
    trend: "up",
    icon: GraduationCap,
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-50 to-cyan-50",
    sub: "from last month",
  },
  {
    title: "Hired Students",
    value: "87",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "from-emerald-500 to-teal-500",
    bgColor: "from-emerald-50 to-teal-50",
    sub: "from last month",
  },
  {
    title: "In Progress",
    value: "124",
    change: "-3%",
    trend: "down",
    icon: FileText,
    color: "from-orange-500 to-red-500",
    bgColor: "from-orange-50 to-red-50",
    sub: "from last month",
  },
  {
    title: "Pending Reports",
    value: "12",
    change: "+2%",
    trend: "up",
    icon: BarChart3,
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-50 to-pink-50",
    sub: "from last month",
  },
]

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState("This Month")
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [topCompanies, setTopCompanies] = useState<
    { company_id: string, company_name: string, applicant_count: number, company_logo_url?: string }[]
  >([])
  const [loadingCompanies, setLoadingCompanies] = useState(true)
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
  const handlePopoverClose = () => setAnchorEl(null)
  const open = Boolean(anchorEl)

  useEffect(() => {
    setLoadingCompanies(true)
    fetch("/api/admin/dashboard/fetchTopCompany")
      .then(res => res.json())
      .then(data => setTopCompanies(data.companies || []))
      .finally(() => setLoadingCompanies(false))
  }, [])

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
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <MuiButton
            variant="outlined"
            className="flex items-center gap-2"
            onClick={handlePopoverOpen}
            sx={{
              textTransform: "none",
              borderRadius: "0.75rem",
              borderColor: "hsl(var(--border))",
              fontWeight: 500,
              fontSize: "1rem",
              background: "white",
              boxShadow: "0 2px 8px 0 rgba(99,102,241,0.08)",
            }}
            startIcon={<Calendar className="h-4 w-4" />}
            endIcon={<ChevronDown className="h-4 w-4" />}
          >
            {dateRange}
          </MuiButton>
          <MuiPopover
            open={open}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            PaperProps={{
              sx: { p: 1, minWidth: 160, borderRadius: 2 }
            }}
          >
            <div className="p-2">
              <div className="grid gap-1">
                {["Today", "Yesterday", "This Week", "This Month", "This Year", "All Time"].map((range) => (
                  <MuiButton
                    key={range}
                    variant="text"
                    sx={{
                      justifyContent: "flex-start",
                      fontWeight: 400,
                      color: "inherit",
                      borderRadius: 1,
                      textTransform: "none",
                      width: "100%",
                      "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" }
                    }}
                    onClick={() => {
                      setDateRange(range)
                      handlePopoverClose()
                    }}
                  >
                    {range}
                  </MuiButton>
                ))}
              </div>
            </div>
          </MuiPopover>
        </div>
      </motion.div>

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
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none lg:flex rounded-2xl bg-gray-100 p-1.5 h-auto">
          <TabsTrigger
            value="overview"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-6 font-semibold"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="students"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-6 font-semibold"
          >
            Students
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <Card className="border-0 shadow-lg bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">Student Placement Trends</CardTitle>
                  <CardDescription className="text-gray-600">
                    Monthly student placements over the past year
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium text-lg">Chart: Monthly student placements</p>
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
                  <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium text-lg">Chart: Student status distribution</p>
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
                    {[1, 2, 3, 4, 5].map((i) => (
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
                            Student placement updated
                          </p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">2 hours ago</p>
                        </div>
                      </motion.div>
                    ))}
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
        <TabsContent value="students">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Student Analytics</CardTitle>
                  <CardDescription className="text-gray-600">Detailed student performance and placement metrics</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 font-medium text-lg">Student analytics content</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        <TabsContent value="reports">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Department Reports</CardTitle>
                  <CardDescription className="text-gray-600">Generated reports and statistics for IT department</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 font-medium text-lg">Reports content</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

