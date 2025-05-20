"use client"

import { useState } from "react"
import {
  BarChart3,
  Users,
  Building2,
  FileText,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  ChevronDown,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Popover from "@mui/material/Popover"
import MenuItem from "@mui/material/MenuItem"

export default function Dashboard() {
  const [dateRange, setDateRange] = useState("This Month")
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handlePopoverClose = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Overview of system performance and key metrics</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          {/* MUI Popover for date range */}
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handlePopoverOpen}
          >
            <Calendar className="h-4 w-4" />
            {dateRange}
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Popover
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
            PaperProps={{ style: { minWidth: 160, padding: 0 } }}
          >
            <div className="p-2">
              {["Today", "Yesterday", "This Week", "This Month", "This Year", "All Time"].map((range) => (
                <MenuItem
                  key={range}
                  selected={dateRange === range}
                  onClick={() => {
                    setDateRange(range)
                    handlePopoverClose()
                  }}
                  sx={{ fontWeight: dateRange === range ? 600 : 400 }}
                >
                  {range}
                </MenuItem>
              ))}
            </div>
          </Popover>
          <Button>Export Report</Button>
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
            <CardTitle className="text-sm font-medium">Job Listings</CardTitle>
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
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
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
                <CardTitle>System Health</CardTitle>
                <CardDescription>Current system status and metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">Server Uptime</p>
                      <p className="text-sm text-green-500">99.9%</p>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[99.9%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">Database Load</p>
                      <p className="text-sm text-yellow-500">68%</p>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 w-[68%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">API Response Time</p>
                      <p className="text-sm text-green-500">120ms</p>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[85%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">Storage Usage</p>
                      <p className="text-sm text-blue-500">42%</p>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[42%]"></div>
                    </div>
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
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>System Notifications</CardTitle>
              <CardDescription>Important alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-slate-50 rounded-md">
                <p className="text-muted-foreground">Notifications content</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
