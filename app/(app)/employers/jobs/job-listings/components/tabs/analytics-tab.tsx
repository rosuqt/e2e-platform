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
import { Calendar, Clock, Users, Eye, MousePointerClick, FileText, Search, CalendarX } from "lucide-react"
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

interface JobAnalyticsProps {
  jobId?: string
  employerId?: string
}

interface AgendaItem {
  id: string
  application_id?: string
  mode: string
  platform?: string
  address?: string
  team?: string[]
  date: string
  time: string
  notes?: string
  summary?: string
  status?: string
  student_name?: string
}

interface AgendaResponse {
  agenda: AgendaItem[]
  interviewsScheduled: number
}

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

interface ApplicationStatus {
  name: string
  value: number
  color: string
}

interface TopApplicant {
  id: string
  first_name: string
  last_name: string
  match_score: number
  applied_at: string
  profile_image_url?: string
  student_id?: string
}

interface ApplicantResponse {
  id: string
  first_name: string
  last_name: string
  match_score: number
  applied_at: string
  student_id?: string
}

interface StudentDetails {
  profile_img?: string
}

interface SignedUrlResponse {
  signedUrl?: string
}

export default function JobAnalytics({ jobId, employerId }: JobAnalyticsProps) {
  const [timeRange, setTimeRange] = useState("all")
  const [metricHistory, setMetricHistory] = useState<MetricHistory>({
    summary: { view: 0, click: 0, apply: 0 },
    weeklyData: [],
    totalRecords: 0
  })
  const [applicationStatusData, setApplicationStatusData] = useState<ApplicationStatus[]>([
    { name: "New", value: 0, color: "#eab308" },
    { name: "Shortlisted", value: 0, color: "#06b6d4" },
    { name: "Interview", value: 0, color: "#8b5cf6" },
    { name: "Waitlisted", value: 0, color: "#3b82f6" },
    { name: "Hired", value: 0, color: "#059669" },
    { name: "Rejected", value: 0, color: "#dc2626" },
  ])
  const [topApplicants, setTopApplicants] = useState<TopApplicant[]>([])
  const [loadingTopApplicants, setLoadingTopApplicants] = useState(false)
  const [upcomingInterviews, setUpcomingInterviews] = useState<AgendaItem[]>([])
  const [loadingInterviews, setLoadingInterviews] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [previousMetrics, setPreviousMetrics] = useState<MetricHistory>({
    summary: { view: 0, click: 0, apply: 0 },
    weeklyData: [],
    totalRecords: 0
  })

  const fetchApplicationStatus = async () => {
    if (!jobId) return
    
    try {
      const response = await fetch(`/api/employers/fetch-applicants/${jobId}`)
      if (response.ok) {
        const data = await response.json()
        setApplicationStatusData(data)
      }
    } catch (err) {
      console.error('Failed to fetch application status:', err)
    }
  }

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

  const fetchTopApplicants = async () => {
    if (!jobId) return
    
    try {
      setLoadingTopApplicants(true)
      const response = await fetch(`/api/employers/fetch-applicants/${jobId}/recent-applicants`)
      if (response.ok) {
        const applicants: ApplicantResponse[] = await response.json()
        
        const sortedApplicants = applicants
          .sort((a: ApplicantResponse, b: ApplicantResponse) => b.match_score - a.match_score)
          .slice(0, 5)
        
        const applicantsWithImages = await Promise.all(
          sortedApplicants.map(async (applicant: ApplicantResponse): Promise<TopApplicant> => {
            if (!applicant.student_id) return { ...applicant, profile_image_url: "" }
            
            try {
              const detailsRes = await fetch(`/api/employers/applications/getStudentDetails?student_id=${applicant.student_id}`)
              const details: StudentDetails = await detailsRes.json()

              let profile_image_url = ""
              if (details && details.profile_img) {
                const signedUrlRes = await fetch("/api/students/get-signed-url", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    bucket: "user.avatars",
                    path: details.profile_img
                  })
                })
                const signedUrlData: SignedUrlResponse = await signedUrlRes.json()
                if (signedUrlData && signedUrlData.signedUrl) {
                  profile_image_url = signedUrlData.signedUrl
                }
              }
              return { ...applicant, profile_image_url }
            } catch {
              return { ...applicant, profile_image_url: "" }
            }
          })
        )
        
        setTopApplicants(applicantsWithImages)
      }
    } catch (err) {
      console.error('Failed to fetch top applicants:', err)
      setTopApplicants([])
    } finally {
      setLoadingTopApplicants(false)
    }
  }

  const fetchUpcomingInterviews = async () => {
    if (!employerId) {
      console.log("No employerId provided for interviews")
      return
    }
    
    try {
      setLoadingInterviews(true)
      const url = `/api/employers/applications/agenda?employer_id=${employerId}&range=week`
      console.log("Fetching interviews from:", url)
      
      const response = await fetch(url)
      if (response.ok) {
        const data: AgendaResponse = await response.json()
        console.log("Interview data received:", data)
        setUpcomingInterviews(data.agenda || [])
      } else {
        console.error("Failed to fetch interviews:", response.status, response.statusText)
      }
    } catch (err) {
      console.error('Failed to fetch upcoming interviews:', err)
      setUpcomingInterviews([])
    } finally {
      setLoadingInterviews(false)
    }
  }

  useEffect(() => {
    fetchJobMetrics()
    fetchApplicationStatus()
    fetchTopApplicants()
    fetchUpcomingInterviews()
  }, [jobId, timeRange, employerId])

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

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const applied = new Date(dateString)
    const diffMs = now.getTime() - applied.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Applied today"
    if (diffDays === 1) return "Applied 1 day ago"
    if (diffDays < 7) return `Applied ${diffDays} days ago`
    if (diffDays < 30) return `Applied ${Math.floor(diffDays / 7)} weeks ago`
    return `Applied ${Math.floor(diffDays / 30)} months ago`
  }

  const getRankingBadgeColor = (index: number) => {
    switch (index) {
      case 0: return "bg-yellow-500 text-white"
      case 1: return "bg-gray-400 text-white"
      case 2: return "bg-amber-600 text-white"
      case 3: return "bg-blue-500 text-white"
      case 4: return "bg-purple-500 text-white"
      default: return "bg-gray-500 text-white"
    }
  }

  const hasHighMatchApplicants = topApplicants.some(applicant => applicant.match_score >= 70)

  const formatInterviewTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':')
      const date = new Date()
      date.setHours(parseInt(hours), parseInt(minutes))
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    } catch {
      return timeString
    }
  }

  const formatInterviewDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const getStatusColors = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': 
        return { backgroundColor: '#dbeafe', color: '#1d4ed8' }
      case 'pending': 
        return { backgroundColor: '#fef3c7', color: '#d97706' }
      case 'cancelled': 
        return { backgroundColor: '#fecaca', color: '#dc2626' }
      case 'rescheduled': 
        return { backgroundColor: '#fed7aa', color: '#ea580c' }
      case 'completed': 
        return { backgroundColor: '#dcfce7', color: '#16a34a' }
      default: 
        return { backgroundColor: '#f3f4f6', color: '#374151' }
    }
  }

  return (
    <div className="space-y-6">
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
     
        
        {/* Top Applicants */}
        <Card className="col-span-1 h-[460px] flex flex-col w-full">
          <CardHeader>
            <CardTitle>Top Applicants</CardTitle>
            <CardDescription>Highest match scores for this position</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            {loadingTopApplicants ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
              </div>
            ) : topApplicants.length === 0 ? (
              <div className="flex flex-col items-center py-8">
                <Users className="w-10 h-10 text-gray-300 mb-2" />
                <div className="text-gray-400 text-center text-sm max-w-xs">
                  No applicants yet
                </div>
              </div>
            ) : !hasHighMatchApplicants ? (
              <div className="flex flex-col items-center py-8">
                <Search className="w-10 h-10 text-gray-300 mb-2" />
                <div className="text-gray-400 text-center text-sm max-w-xs">
                  We haven&apos;t found any candidates who are a strong match for this position yet. Don&apos;t worry - great candidates might still be on their way!
                </div>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto">
                {topApplicants.map((applicant, index) => (
                  <div key={applicant.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                          {applicant.profile_image_url ? (
                            <img 
                              src={applicant.profile_image_url} 
                              alt={`${applicant.first_name} ${applicant.last_name}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-blue-600 font-medium text-sm">
                              {applicant.first_name[0]}{applicant.last_name[0]}
                            </span>
                          )}
                        </div>
                        <div className={`absolute -top-1 -right-1 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold ${getRankingBadgeColor(index)}`}>
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{applicant.first_name} {applicant.last_name}</p>
                        <p className="text-xs text-gray-500">{formatTimeAgo(applicant.applied_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-semibold text-green-600">{applicant.match_score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            <CardTitle className="text-base">Upcoming Interviews</CardTitle>
            <CardDescription>Next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingInterviews ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
              </div>
            ) : upcomingInterviews.length === 0 ? (
              <div className="flex flex-col items-center py-8">
                <CalendarX className="w-12 h-12 text-gray-300 mb-3" />
                <div className="text-gray-500 text-center">
                  <p className="font-medium mb-1">No interviews scheduled</p>
                  <p className="text-sm text-gray-400">No interviews in the next 7 days</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingInterviews.slice(0, 3).map((interview) => (
                  <div key={interview.id} className="flex items-start gap-4 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="bg-blue-100 text-blue-700 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{interview.student_name || 'Candidate'}</h4>
                        <Chip
                          label={interview.status || 'Pending'}
                          size="small"
                          sx={{
                            fontSize: '11px',
                            height: '20px',
                            ...getStatusColors(interview.status),
                            '& .MuiChip-label': {
                              padding: '0 6px'
                            }
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{interview.mode} Interview</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatInterviewDate(interview.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatInterviewTime(interview.time)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {upcomingInterviews.length > 3 && (
              <Button variant="outline" className="w-full mt-3 border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-700" size="sm">
                View All {upcomingInterviews.length} Interviews
              </Button>
            )}
            {upcomingInterviews.length > 0 && upcomingInterviews.length <= 3 && (
              <Button variant="outline" className="w-full mt-3 border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-700" size="sm">
                View Interview Calendar
              </Button>
            )}
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

