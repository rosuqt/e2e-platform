"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, Eye, MousePointerClick, FileText } from "lucide-react"
import Chip from "@mui/material/Chip"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { IconCloudDemo } from "@/components/magicui/skill-cloud"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const matchPercentageData = [
  { range: "90-100%", count: 5, color: "#4f46e5" }, 
  { range: "80-89%", count: 8, color: "#2563eb" }, 
  { range: "70-79%", count: 6, color: "#7c3aed" },
  { range: "60-69%", count: 3, color: "#eab308" },
  { range: "Below 60%", count: 1, color: "#ea580c" },
]

const applicationStatusData = [
  { name: "Shortlisted", value: 7, color: "#4f46e5" },
  { name: "Pending", value: 11, color: "#2563eb" },
  { name: "Interview", value: 5, color: "#7c3aed" },
]



const upcomingInterviews = [
  {
    candidate: "Alex Johnson",
    position: "UI/UX Designer",
    date: "May 10, 2025",
    time: "10:00 AM",
    status: "Confirmed",
  },
  {
    candidate: "Maria Garcia",
    position: "UI/UX Designer",
    date: "May 11, 2025",
    time: "2:30 PM",
    status: "Pending",
  },
  {
    candidate: "David Kim",
    position: "UI/UX Designer",
    date: "May 12, 2025",
    time: "11:15 AM",
    status: "Confirmed",
  },
]

interface MetricHistory {
  summary: {
    view: number
    click: number
    apply: number
  }
  weeklyData: Array<{
    name: string
    views: number
    clicks: number
    applicants: number
  }>
  totalRecords: number
  usingFallback?: boolean
}

interface JobAnalyticsProps {
  jobId?: string
}

export default function JobAnalytics({ jobId }: JobAnalyticsProps) {
  const [timeRange, setTimeRange] = useState("all")
  const [metricHistory, setMetricHistory] = useState<MetricHistory>({
    summary: { view: 0, click: 0, apply: 0 },
    weeklyData: [],
    totalRecords: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [previousMetrics, setPreviousMetrics] = useState<MetricHistory>({
    summary: { view: 0, click: 0, apply: 0 },
    weeklyData: [],
    totalRecords: 0
  })

  const fetchJobMetrics = async () => {
    if (!jobId) {
      setError("Job ID not provided")
      setIsLoading(false)
      return
    }
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(jobId)) {
      setError(`Invalid Job ID format: ${jobId}. Expected UUID format.`)
      setIsLoading(false)
      return
    }
    
    try {
      setIsLoading(true)
      setError(null)
      
      const [historyResponse, previousResponse] = await Promise.all([
        fetch(`/api/employers/analytics/metric-history?jobId=${jobId}&range=${timeRange}`),
        fetch(`/api/employers/analytics/metric-history?jobId=${jobId}&range=previous-${timeRange}`)
      ])
      
      if (!historyResponse.ok) {
        throw new Error("Failed to fetch data")
      }
      
      const historyData = await historyResponse.json()
      const previousData = previousResponse.ok ? await previousResponse.json() : { summary: { view: 0, click: 0, apply: 0 } }
      
      setMetricHistory(historyData)
      setPreviousMetrics(previousData)
      setError(null)
    } catch (err) {
      setError(`Failed to load metrics: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchJobMetrics()
  }, [jobId, timeRange])

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return Number(((current - previous) / previous * 100).toFixed(1))
  }

  const conversionRate = metricHistory.summary.view > 0 
    ? ((metricHistory.summary.apply / metricHistory.summary.view) * 100).toFixed(1) 
    : "0.0"

  const applicantsChange = calculatePercentageChange(metricHistory.summary.apply, previousMetrics.summary.apply)
  const viewsChange = calculatePercentageChange(metricHistory.summary.view, previousMetrics.summary.view)
  const clicksChange = calculatePercentageChange(metricHistory.summary.click, previousMetrics.summary.click)

  return (
    <div className="space-y-6">
      {/* Show a message if no valid jobId */}
      {!jobId && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            <strong>No Job Selected:</strong> Please select a specific job to view analytics.
          </p>
        </div>
      )}

      {/* Header with time range selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Job Analytics</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Time Range:</span>
          <Tabs defaultValue={timeRange} onValueChange={setTimeRange} className="w-[300px]">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="all">All Time</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Top stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Applicants</p>
                <h3 className="text-3xl font-bold mt-1">
                  {isLoading ? "..." : metricHistory.summary.apply || 0}
                </h3>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className={`mt-2 text-xs flex items-center ${Number(applicantsChange) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d={Number(applicantsChange) >= 0 ? "m6 9 6 6 6-6" : "m18 15-6-6-6 6"} />
              </svg>
              <span>{applicantsChange >= 0 ? '+' : ''}{applicantsChange}% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <h3 className="text-3xl font-bold mt-1">
                  {isLoading ? "..." : metricHistory.summary.view || 0}
                </h3>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className={`mt-2 text-xs flex items-center ${Number(viewsChange) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d={Number(viewsChange) >= 0 ? "m6 9 6 6 6-6" : "m18 15-6-6-6 6"} />
              </svg>
              <span>{viewsChange >= 0 ? '+' : ''}{viewsChange}% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
                <h3 className="text-3xl font-bold mt-1">
                  {isLoading ? "..." : metricHistory.summary.click || 0}
                </h3>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <MousePointerClick className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className={`mt-2 text-xs flex items-center ${Number(clicksChange) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d={Number(clicksChange) >= 0 ? "m6 9 6 6 6-6" : "m18 15-6-6-6 6"} />
              </svg>
              <span>{clicksChange >= 0 ? '+' : ''}{clicksChange}% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <h3 className="text-3xl font-bold mt-1">
                  {isLoading ? "..." : `${conversionRate}%`}
                </h3>
              </div>
              <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground flex items-center">
              <span>Views to applications ratio</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
          <Button 
            onClick={fetchJobMetrics} 
            variant="outline" 
            size="sm" 
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      )}
      
      {/* Main analytics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Candidate Match Percentage Graph */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Candidate Match Percentage</CardTitle>
            <CardDescription>Distribution of applicants by match percentage</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={matchPercentageData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" name="Applicants">
                  {matchPercentageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Application Breakdown */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Application Breakdown</CardTitle>
            <CardDescription>Status of all applications</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <div className="flex flex-col items-center justify-center h-full">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={applicationStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {applicationStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {applicationStatusData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-sm">{entry.name}: {entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Job Posting Overview */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Job Posting Performance</CardTitle>
            <CardDescription>Views, clicks, and applications over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={metricHistory.weeklyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="views" stroke="#2563eb" name="Views" />
                <Line type="monotone" dataKey="clicks" stroke="#7c3aed" name="Clicks" />
                <Line type="monotone" dataKey="applicants" stroke="#eab308" name="Applicants" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Upcoming Interviews */}
        <Card className="col-span-1 h-[460px] flex flex-col w-full">
          <CardHeader>
            <CardTitle>Upcoming Interviews</CardTitle>
            <CardDescription>Next 7 days</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <div className="space-y-4 overflow-y-auto">
              {upcomingInterviews.map((interview, index) => (
                <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="bg-blue-100 text-blue-700 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{interview.candidate}</h4>
                      <Chip
                        label={interview.status}
                        className={
                          interview.status === "Confirmed" 
                            ? "bg-green-100 text-green-700 border-green-200" 
                            : "bg-amber-100 text-amber-700 border-amber-200"
                        }
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">{interview.position}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{interview.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{interview.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-2">View All Interviews</Button>
          </CardContent>
        </Card>
        {/* Top Skills Cloud */}
        <Card className="col-span-1 h-[460px] flex flex-col w-full">
          <CardHeader>
            <CardTitle>Top Skills</CardTitle>
            <CardDescription>Most relevant skills for this job</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="w-full flex items-center justify-center">
              <div className="w-[320px] h-[320px] md:w-[360px] md:h-[360px]">
                <IconCloudDemo />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1 md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Time to Apply</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm\"> 1 minute</span>
                </div>
                <div className="text-sm font-medium">15%</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">1-5 minutes</span>
                </div>
                <div className="text-sm font-medium">45%</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">5-10 minutes</span>
                </div>
                <div className="text-sm font-medium">30%</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm"> 10 minutes</span>
                </div>
                <div className="text-sm font-medium">10%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Candidate Match Percentage</CardTitle>
            <CardDescription>
              This represents the percentage of applicants who are a strong match for the job based on their qualifications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-full">
              <div className="w-32 h-32">
                <CircularProgressbar
                  value={75} 
                  text={`75%`}
                  styles={buildStyles({
                    textSize: "16px",
                    textColor: "#4f46e5", 
                    pathColor: "#4f46e5",
                    trailColor: "#e5e7eb",
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

