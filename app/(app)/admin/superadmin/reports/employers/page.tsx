"use client"

import { useState } from "react"
import { Search, Filter, MoreHorizontal, Eye, CheckCircle, XCircle, Clock } from "lucide-react"
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
import Avatar from "@mui/material/Avatar"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"

interface Report {
  id: number
  employerName: string
  employerId: string
  company: string
  reportType: string
  reason: string
  reportedBy: string
  reportedAt: string
  status: "pending" | "accepted" | "rejected" | "resolved"
  description: string
}

export default function ReportedEmployers() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("pending")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [actionReason, setActionReason] = useState("")
  const [menuAnchorEls, setMenuAnchorEls] = useState<{ [key: number]: HTMLElement | null }>({})

  const handleMenuOpen = (id: number, event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEls((prev) => ({ ...prev, [id]: event.currentTarget }))
  }
  const handleMenuClose = (id: number) => {
    setMenuAnchorEls((prev) => ({ ...prev, [id]: null }))
  }

  // Mock data
  const reports: Report[] = [
    {
      id: 1,
      employerName: "John Smith",
      employerId: "EMP-001",
      company: "Tech Solutions Inc.",
      reportType: "Inappropriate Behavior",
      reason: "Unprofessional communication",
      reportedBy: "Maria Garcia",
      reportedAt: "2023-05-15",
      status: "pending",
      description: "The employer sent unprofessional messages during the interview process.",
    },
    {
      id: 2,
      employerName: "Sarah Williams",
      employerId: "EMP-002",
      company: "Digital Innovations",
      reportType: "False Information",
      reason: "Misrepresented job details",
      reportedBy: "James Wilson",
      reportedAt: "2023-06-20",
      status: "accepted",
      description: "The job description did not match the actual responsibilities discussed during the interview.",
    },
    {
      id: 3,
      employerName: "Michael Brown",
      employerId: "EMP-003",
      company: "WebTech Solutions",
      reportType: "Discrimination",
      reason: "Age discrimination",
      reportedBy: "Emily Davis",
      reportedAt: "2023-07-10",
      status: "rejected",
      description: "The employer made comments suggesting they prefer younger candidates.",
    },
    {
      id: 4,
      employerName: "Jennifer Lee",
      employerId: "EMP-004",
      company: "Innovative Systems",
      reportType: "Payment Issues",
      reason: "Delayed payment",
      reportedBy: "Robert Martinez",
      reportedAt: "2023-08-05",
      status: "resolved",
      description: "The employer consistently delayed payments for completed work.",
    },
    {
      id: 5,
      employerName: "David Wilson",
      employerId: "EMP-005",
      company: "Future Technologies",
      reportType: "Inappropriate Behavior",
      reason: "Harassment",
      reportedBy: "Lisa Johnson",
      reportedAt: "2023-09-15",
      status: "pending",
      description: "The employer made inappropriate comments during meetings.",
    },
  ]

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.employerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && report.status === "pending") ||
      (activeTab === "accepted" && report.status === "accepted") ||
      (activeTab === "rejected" && report.status === "rejected") ||
      (activeTab === "resolved" && report.status === "resolved")

    return matchesSearch && matchesTab
  })

  const handleViewReport = (report: Report) => {
    setSelectedReport(report)
    setIsViewDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reported Employers</h2>
          <p className="text-muted-foreground">Manage and review reports against employers</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Employer Reports</CardTitle>
          <CardDescription>Review and take action on reports submitted against employers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search reports..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          <Tabs defaultValue="pending" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <ReportsTable
                reports={filteredReports}
                onViewReport={handleViewReport}
                menuAnchorEls={menuAnchorEls}
                handleMenuOpen={handleMenuOpen}
                handleMenuClose={handleMenuClose}
              />
            </TabsContent>
            <TabsContent value="pending" className="mt-4">
              <ReportsTable
                reports={filteredReports}
                onViewReport={handleViewReport}
                menuAnchorEls={menuAnchorEls}
                handleMenuOpen={handleMenuOpen}
                handleMenuClose={handleMenuClose}
              />
            </TabsContent>
            <TabsContent value="accepted" className="mt-4">
              <ReportsTable
                reports={filteredReports}
                onViewReport={handleViewReport}
                menuAnchorEls={menuAnchorEls}
                handleMenuOpen={handleMenuOpen}
                handleMenuClose={handleMenuClose}
              />
            </TabsContent>
            <TabsContent value="rejected" className="mt-4">
              <ReportsTable
                reports={filteredReports}
                onViewReport={handleViewReport}
                menuAnchorEls={menuAnchorEls}
                handleMenuOpen={handleMenuOpen}
                handleMenuClose={handleMenuClose}
              />
            </TabsContent>
            <TabsContent value="resolved" className="mt-4">
              <ReportsTable
                reports={filteredReports}
                onViewReport={handleViewReport}
                menuAnchorEls={menuAnchorEls}
                handleMenuOpen={handleMenuOpen}
                handleMenuClose={handleMenuClose}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Report Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>Detailed information about the reported employer.</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="grid gap-6 py-4">
              <div className="flex items-start gap-4">
                <Avatar sx={{ width: 48, height: 48 }} src="/placeholder.svg?height=48&width=48" alt="Employer" />
                <div>
                  <h3 className="text-lg font-bold">{selectedReport.employerName}</h3>
                  <p className="text-muted-foreground">{selectedReport.company}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={selectedReport.status} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Report Type</Label>
                  <p className="font-medium">{selectedReport.reportType}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Reported By</Label>
                  <p className="font-medium">{selectedReport.reportedBy}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Reported At</Label>
                  <p className="font-medium">{selectedReport.reportedAt}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Employer ID</Label>
                  <p className="font-medium">{selectedReport.employerId}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Reason</Label>
                <p className="font-medium">{selectedReport.reason}</p>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Description</Label>
                <div className="mt-1 p-3 bg-slate-50 rounded-md">
                  <p>{selectedReport.description}</p>
                </div>
              </div>

              {selectedReport.status === "pending" && (
                <div>
                  <Label htmlFor="action-reason">Reason for Action</Label>
                  <Textarea
                    id="action-reason"
                    placeholder="Provide a reason for accepting or rejecting this report..."
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            {selectedReport && selectedReport.status === "pending" && (
              <>
                <Button variant="destructive" className="flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Reject Report
                </Button>
                <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4" />
                  Accept Report
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// MUI Table and Dropdown Menu for actions
function ReportsTable({
  reports,
  onViewReport,
  menuAnchorEls,
  handleMenuOpen,
  handleMenuClose,
}: {
  reports: Report[]
  onViewReport: (report: Report) => void
  menuAnchorEls: { [key: number]: HTMLElement | null }
  handleMenuOpen: (id: number, event: React.MouseEvent<HTMLElement>) => void
  handleMenuClose: (id: number) => void
}) {
  return (
    <TableContainer component={Paper} className="rounded-md border">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Employer</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Report Type</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Reported At</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" className="py-8 text-muted-foreground">
                No reports found
              </TableCell>
            </TableRow>
          ) : (
            reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Avatar sx={{ width: 28, height: 28, fontSize: 14, mr: 1 }}>
                    {report.employerName[0]}
                  </Avatar>
                  {report.employerName}
                </TableCell>
                <TableCell>{report.company}</TableCell>
                <TableCell>{report.reportType}</TableCell>
                <TableCell className="max-w-[200px] truncate">{report.reason}</TableCell>
                <TableCell>{report.reportedAt}</TableCell>
                <TableCell>
                  <StatusBadge status={report.status} />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="actions"
                    onClick={(e) => handleMenuOpen(report.id, e)}
                    size="small"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchorEls[report.id] || null}
                    open={Boolean(menuAnchorEls[report.id])}
                    onClose={() => handleMenuClose(report.id)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <MenuItem
                      onClick={() => {
                        onViewReport(report)
                        handleMenuClose(report.id)
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </MenuItem>
                  </Menu>
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
  } else if (status === "accepted") {
    return (
      <Badge className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        Accepted
      </Badge>
    )
  } else if (status === "rejected") {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        Rejected
      </Badge>
    )
  } else if (status === "resolved") {
    return (
      <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-200">
        <CheckCircle className="h-3 w-3" />
        Resolved
      </Badge>
    )
  }
  return null
}
