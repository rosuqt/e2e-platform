"use client"

import {
  BarChart3,
  Users,
  Building2,
  FileText,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,

} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import Switch from "@mui/material/Switch"
import { styled } from "@mui/material/styles"
import { RiRobot2Fill } from "react-icons/ri"
import Tooltip from "@mui/material/Tooltip"
import supabase from "@/lib/supabase"

const PurpleSwitch = styled(Switch)({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#a21caf",
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#a21caf",
  },
  "& .MuiSwitch-track": {
    backgroundColor: "#e9d5ff",
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "#a21caf",
  },
})

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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Overview of system performance and key metrics</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <Tooltip title="This will make the feedback button in the system visible" arrow>
            <span className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-base bg-black/90">
              <RiRobot2Fill className="text-purple-500 text-2xl" />
              <PurpleSwitch
                checked={!!showFeedback}
                onChange={handleToggle}
                inputProps={{ "aria-label": "Testing Mode" }}
                disabled={loading}
              />
              <span className="text-purple-400 font-bold">Testing Mode</span>
            </span>
          </Tooltip>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,853</div>
            <div className="flex items-center text-sm text-green-500 mt-1">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>12% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Employers</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">432</div>
            <div className="flex items-center text-sm text-green-500 mt-1">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>8% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <div className="flex items-center text-sm text-green-500 mt-1">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>18% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <div className="flex items-center text-sm text-red-500 mt-1">
              <ArrowDownRight className="h-4 w-4 mr-1" />
              <span>4% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>User Registration Trends</CardTitle>
                <CardDescription>Monthly user registrations over the past year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-md">
                  <p className="text-muted-foreground">Chart: Monthly user registrations</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Breakdown by user type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-md">
                  <p className="text-muted-foreground">Chart: User distribution</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest system activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                      <div className="rounded-full bg-blue-100 p-2">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">New admin account created</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Employers</CardTitle>
                <CardDescription>Most active employers on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-slate-200"></div>
                        <div>
                          <p className="text-sm font-medium">Company {i}</p>
                          <p className="text-xs text-muted-foreground">{20 - i * 2} job listings</p>
                        </div>
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pending Company Verification</CardTitle>
                <CardDescription>Companies awaiting verification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">Total Pending</p>
                    <p className="text-sm text-yellow-500">7</p>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 w-[35%]"></div>
                  </div>
                  <div className="flex items-center justify-between mb-1 mt-4">
                    <p className="text-sm font-medium">Verified This Month</p>
                    <p className="text-sm text-green-500">15</p>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[75%]"></div>
                  </div>
                  <div className="flex items-center justify-between mb-1 mt-4">
                    <p className="text-sm font-medium">Rejected</p>
                    <p className="text-sm text-red-500">2</p>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-[10%]"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>Detailed platform analytics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-slate-50 rounded-md">
                <p className="text-muted-foreground">Advanced analytics content</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>System Reports</CardTitle>
              <CardDescription>Generated reports and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-slate-50 rounded-md">
                <p className="text-muted-foreground">Reports content</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
