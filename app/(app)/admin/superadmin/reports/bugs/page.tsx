"use client"

import { useState } from "react"
import { Search,  Eye, CheckCircle, XCircle, Clock, Bug, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
// MUI imports
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"

interface BugReport {
  id: number
  title: string
  reportedBy: string
  dateReported: string
  severity: "low" | "medium" | "high" | "critical"
  status: "pending" | "in_progress" | "resolved" | "closed"
  description: string
  module: string
  browser?: string
  device?: string
  stepsToReproduce?: string
  assignedTo?: string
}

export default function BugReports() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("pending")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedBug, setSelectedBug] = useState<BugReport | null>(null)
  const [actionNote, setActionNote] = useState("")
  const [moduleFilter, setModuleFilter] = useState("all")

  // Mock data
  const bugs: BugReport[] = [
    {
      id: 1,
      title: "Login button not working on Safari",
      reportedBy: "John Smith",
      dateReported: "2023-05-15",
      severity: "high",
      status: "pending",
      description:
        "When clicking the login button on Safari browser, nothing happens. Works fine on Chrome and Firefox.",
      module: "Authentication",
      browser: "Safari 15.4",
      device: "MacBook Pro",
      stepsToReproduce: "1. Go to login page\n2. Enter credentials\n3. Click login button",
    },
    {
      id: 2,
      title: "Dashboard statistics not updating",
      reportedBy: "Maria Garcia",
      dateReported: "2023-06-20",
      severity: "medium",
      status: "in_progress",
      description: "The statistics on the dashboard are not updating in real-time as expected.",
      module: "Dashboard",
      browser: "Chrome 112",
      device: "Windows 11 Desktop",
      stepsToReproduce: "1. Login to the system\n2. Navigate to dashboard\n3. Wait for statistics to update",
      assignedTo: "Robert Chen",
    },
    {
      id: 3,
      title: "Error 500 when uploading large files",
      reportedBy: "David Lee",
      dateReported: "2023-07-10",
      severity: "critical",
      status: "resolved",
      description: "System returns a 500 error when trying to upload files larger than 10MB.",
      module: "File Management",
      browser: "Firefox 102",
      device: "Dell XPS Laptop",
      stepsToReproduce: "1. Go to file upload section\n2. Select a file larger than 10MB\n3. Click upload",
      assignedTo: "Sarah Williams",
    },
    {
      id: 4,
      title: "Incorrect sorting in student list",
      reportedBy: "Emily Davis",
      dateReported: "2023-08-05",
      severity: "low",
      status: "closed",
      description:
        "When sorting the student list by name, it sorts by first name instead of last name as specified in requirements.",
      module: "Student Management",
      browser: "Edge 105",
      device: "Surface Pro",
      stepsToReproduce: "1. Go to student management\n2. Click on the name column header to sort",
    },
    {
      id: 5,
      title: "PDF reports missing footer information",
      reportedBy: "Michael Brown",
      dateReported: "2023-09-15",
      severity: "medium",
      status: "pending",
      description: "Generated PDF reports are missing the footer information including page numbers and timestamp.",
      module: "Reporting",
      browser: "Chrome 114",
      device: "HP Pavilion Desktop",
      stepsToReproduce:
        "1. Go to reports section\n2. Generate any PDF report\n3. Check the footer of the generated PDF",
    },
  ]

  const filteredBugs = bugs.filter((bug) => {
    const matchesSearch =
      bug.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bug.reportedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bug.module.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && bug.status === "pending") ||
      (activeTab === "in_progress" && bug.status === "in_progress") ||
      (activeTab === "resolved" && bug.status === "resolved") ||
      (activeTab === "closed" && bug.status === "closed")

    const matchesModule =
      moduleFilter === "all" || bug.module === moduleFilter

    return matchesSearch && matchesTab && matchesModule
  })

  const handleViewBug = (bug: BugReport) => {
    setSelectedBug(bug)
    setActionNote(bug.assignedTo ? `Currently assigned to ${bug.assignedTo}` : "")
    setIsViewDialogOpen(true)
  }

  const exportBugs = () => {
    // In a real application, you would generate a CSV or Excel file
    const header = "ID,Title,Reported By,Date,Severity,Status,Module\n"
    const csv = filteredBugs
      .map(
        (bug) =>
          `${bug.id},"${bug.title}",${bug.reportedBy},${bug.dateReported},${bug.severity},${bug.status},${bug.module}`,
      )
      .join("\n")

    const blob = new Blob([header + csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "bug-reports.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bug Reports</h2>
          <p className="text-muted-foreground">Track and manage system bugs and issues</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button className="flex items-center gap-2" onClick={exportBugs}>
            <Download className="h-4 w-4" />
            Export Reports
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>System Bugs</CardTitle>
          <CardDescription>Review and manage reported bugs and issues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search bugs..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {/* MUI Select for module filter */}
              <Select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                displayEmpty
                className="w-[180px] bg-white"
                size="small"
              >
                <MenuItem value="all">All Modules</MenuItem>
                <MenuItem value="Authentication">Authentication</MenuItem>
                <MenuItem value="Dashboard">Dashboard</MenuItem>
                <MenuItem value="File Management">File Management</MenuItem>
                <MenuItem value="Student Management">Student Management</MenuItem>
                <MenuItem value="Reporting">Reporting</MenuItem>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="pending" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <BugsTable bugs={filteredBugs} onViewBug={handleViewBug} />
            </TabsContent>
            <TabsContent value="pending" className="mt-4">
              <BugsTable bugs={filteredBugs} onViewBug={handleViewBug} />
            </TabsContent>
            <TabsContent value="in_progress" className="mt-4">
              <BugsTable bugs={filteredBugs} onViewBug={handleViewBug} />
            </TabsContent>
            <TabsContent value="resolved" className="mt-4">
              <BugsTable bugs={filteredBugs} onViewBug={handleViewBug} />
            </TabsContent>
            <TabsContent value="closed" className="mt-4">
              <BugsTable bugs={filteredBugs} onViewBug={handleViewBug} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Bug Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Bug Report Details</DialogTitle>
            <DialogDescription>Detailed information about the reported bug.</DialogDescription>
          </DialogHeader>
          {selectedBug && (
            <div className="grid gap-6 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold">{selectedBug.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-gray-600 border-gray-600">
                      {selectedBug.module}
                    </Badge>
                    <SeverityBadge severity={selectedBug.severity} />
                    <StatusBadge status={selectedBug.status} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Reported By</Label>
                  <p className="font-medium">{selectedBug.reportedBy}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Date Reported</Label>
                  <p className="font-medium">{selectedBug.dateReported}</p>
                </div>
                {selectedBug.browser && (
                  <div>
                    <Label className="text-sm text-muted-foreground">Browser</Label>
                    <p className="font-medium">{selectedBug.browser}</p>
                  </div>
                )}
                {selectedBug.device && (
                  <div>
                    <Label className="text-sm text-muted-foreground">Device</Label>
                    <p className="font-medium">{selectedBug.device}</p>
                  </div>
                )}
                {selectedBug.assignedTo && (
                  <div>
                    <Label className="text-sm text-muted-foreground">Assigned To</Label>
                    <p className="font-medium">{selectedBug.assignedTo}</p>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Description</Label>
                <div className="mt-1 p-3 bg-slate-50 rounded-md">
                  <p>{selectedBug.description}</p>
                </div>
              </div>

              {selectedBug.stepsToReproduce && (
                <div>
                  <Label className="text-sm text-muted-foreground">Steps to Reproduce</Label>
                  <div className="mt-1 p-3 bg-slate-50 rounded-md whitespace-pre-line">
                    <p>{selectedBug.stepsToReproduce}</p>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="action-note">Notes & Actions</Label>
                <Textarea
                  id="action-note"
                  placeholder="Add notes or next steps for this bug..."
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:justify-between">
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                <Button variant="outline">Assign</Button>
              </div>
              <div className="flex gap-2">
                {selectedBug?.status === "pending" && (
                  <Button className="bg-blue-600 hover:bg-blue-700">Mark In Progress</Button>
                )}
                {selectedBug?.status === "in_progress" && (
                  <Button className="bg-green-600 hover:bg-green-700">Mark Resolved</Button>
                )}
                {selectedBug?.status === "resolved" && (
                  <Button className="bg-gray-600 hover:bg-gray-700">Close Bug</Button>
                )}
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Replace BugsTable with MUI Table
function BugsTable({
  bugs,
  onViewBug,
}: {
  bugs: BugReport[]
  onViewBug: (bug: BugReport) => void
}) {
  return (
    <TableContainer component={Paper} className="rounded-md border">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Module</TableCell>
            <TableCell>Reported By</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Severity</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bugs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center" className="py-8 text-muted-foreground">
                No bugs found
              </TableCell>
            </TableRow>
          ) : (
            bugs.map((bug) => (
              <TableRow key={bug.id}>
                <TableCell>#{bug.id}</TableCell>
                <TableCell className="font-medium">{bug.title}</TableCell>
                <TableCell>{bug.module}</TableCell>
                <TableCell>{bug.reportedBy}</TableCell>
                <TableCell>{bug.dateReported}</TableCell>
                <TableCell>
                  <SeverityBadge severity={bug.severity} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={bug.status} />
                </TableCell>
                <TableCell align="right">
                  {/* Keep your custom actions here, or migrate to MUI Menu if desired */}
                  <Button variant="ghost" size="icon" onClick={() => onViewBug(bug)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  {/* ...other action buttons as needed... */}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === "pending") {
    return (
      <Badge variant="outline" className="text-yellow-600 border-yellow-600 flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Pending
      </Badge>
    )
  } else if (status === "in_progress") {
    return (
      <Badge className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1">
        <Clock className="h-3 w-3" />
        In Progress
      </Badge>
    )
  } else if (status === "resolved") {
    return (
      <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        Resolved
      </Badge>
    )
  } else if (status === "closed") {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        Closed
      </Badge>
    )
  }
  return null
}

function SeverityBadge({ severity }: { severity: string }) {
  if (severity === "low") {
    return (
      <Badge variant="outline" className="text-green-600 border-green-600 flex items-center gap-1">
        <Bug className="h-3 w-3" />
        Low
      </Badge>
    )
  } else if (severity === "medium") {
    return (
      <Badge variant="outline" className="text-blue-600 border-blue-600 flex items-center gap-1">
        <Bug className="h-3 w-3" />
        Medium
      </Badge>
    )
  } else if (severity === "high") {
    return (
      <Badge variant="outline" className="text-orange-600 border-orange-600 flex items-center gap-1">
        <Bug className="h-3 w-3" />
        High
      </Badge>
    )
  } else if (severity === "critical") {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <Bug className="h-3 w-3" />
        Critical
      </Badge>
    )
  }
  return null
}
