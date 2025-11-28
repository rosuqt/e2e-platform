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

interface CompanyReport {
  id: number
  companyName: string
  reportedBy: string
  dateReported: string
  reason: string
  status: "pending" | "accepted" | "rejected" | "resolved"
  description: string
  companyId: string
  reporterId: string
}

export default function ReportedCompanies() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("pending")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<CompanyReport | null>(null)
  const [actionReason, setActionReason] = useState("")

  // Mock data
  const reports: CompanyReport[] = [
    {
      id: 1,
      companyName: "Tech Solutions Inc.",
      companyId: "COM-001",
      reportedBy: "Maria Garcia",
      reporterId: "STU-001",
      dateReported: "2023-05-15",
      reason: "False company information",
      status: "pending",
      description: "The company provided false information about their size and available positions.",
    },
    {
      id: 2,
      companyName: "Digital Innovations",
      companyId: "COM-002",
      reportedBy: "James Wilson",
      reporterId: "STU-002",
      dateReported: "2023-06-20",
      reason: "Misleading job descriptions",
      status: "accepted",
      description: "The company consistently posts job listings with misleading descriptions and requirements.",
    },
    {
      id: 3,
      companyName: "WebTech Solutions",
      companyId: "COM-003",
      reportedBy: "Emily Davis",
      reporterId: "STU-003",
      dateReported: "2023-07-10",
      reason: "Discriminatory hiring practices",
      status: "rejected",
      description: "The company appears to have discriminatory hiring practices based on age and gender.",
    },
    {
      id: 4,
      companyName: "Innovative Systems",
      companyId: "COM-004",
      reportedBy: "Robert Martinez",
      reporterId: "STU-004",
      dateReported: "2023-08-05",
      reason: "Unprofessional conduct",
      status: "resolved",
      description: "Company representatives behaved unprofessionally during interviews and communications.",
    },
    {
      id: 5,
      companyName: "Future Technologies",
      companyId: "COM-005",
      reportedBy: "Lisa Johnson",
      reporterId: "STU-005",
      dateReported: "2023-09-15",
      reason: "Fraudulent company",
      status: "pending",
      description: "This appears to be a fraudulent company with no verifiable business operations.",
    },
  ]

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && report.status === "pending") ||
      (activeTab === "accepted" && report.status === "accepted") ||
      (activeTab === "rejected" && report.status === "rejected") ||
      (activeTab === "resolved" && report.status === "resolved")

    return matchesSearch && matchesTab
  })

  const handleViewReport = (report: CompanyReport) => {
    setSelectedReport(report)
    setIsViewDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reported Companies</h2>
          <p className="text-muted-foreground">Manage and review reports against companies</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Company Reports</CardTitle>
          <CardDescription>Review and take action on reports submitted against companies</CardDescription>
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
              <ReportsTable reports={filteredReports} onViewReport={handleViewReport} />
            </TabsContent>
            <TabsContent value="pending" className="mt-4">
              <ReportsTable reports={filteredReports} onViewReport={handleViewReport} />
            </TabsContent>
            <TabsContent value="accepted" className="mt-4">
              <ReportsTable reports={filteredReports} onViewReport={handleViewReport} />
            </TabsContent>
            <TabsContent value="rejected" className="mt-4">
              <ReportsTable reports={filteredReports} onViewReport={handleViewReport} />
            </TabsContent>
            <TabsContent value="resolved" className="mt-4">
              <ReportsTable reports={filteredReports} onViewReport={handleViewReport} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Report Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>Detailed information about the reported company.</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="grid gap-6 py-4">
              <div className="flex items-start gap-4">
                <Avatar sx={{ width: 48, height: 48 }} src="/placeholder.svg?height=48&width=48" alt="Company" />
                <div>
                  <h3 className="text-lg font-bold">{selectedReport.companyName}</h3>
                  <p className="text-muted-foreground">Company ID: {selectedReport.companyId}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={selectedReport.status} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Reported By</Label>
                  <p className="font-medium">{selectedReport.reportedBy}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Date Reported</Label>
                  <p className="font-medium">{selectedReport.dateReported}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Reporter ID</Label>
                  <p className="font-medium">{selectedReport.reporterId}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Reason for Report</Label>
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

// MUI Table & Dropdown for actions
function ReportsTable({
  reports,
  onViewReport,
}: { reports: CompanyReport[]; onViewReport: (report: CompanyReport) => void }) {
  // MUI Menu state
  const [anchorEls, setAnchorEls] = useState<{ [key: number]: HTMLElement | null }>({})

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    setAnchorEls((prev) => ({ ...prev, [id]: event.currentTarget }))
  }

  const handleMenuClose = (id: number) => {
    setAnchorEls((prev) => ({ ...prev, [id]: null }))
  }

  return (
    <TableContainer component={Paper} className="rounded-md border">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Company Name</TableCell>
            <TableCell>Reported By</TableCell>
            <TableCell>Date Reported</TableCell>
            <TableCell>Reason for Report</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reports.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" className="py-8 text-muted-foreground">
                No reports found
              </TableCell>
            </TableRow>
          ) : (
            reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.companyName}</TableCell>
                <TableCell>{report.reportedBy}</TableCell>
                <TableCell>{report.dateReported}</TableCell>
                <TableCell className="max-w-[200px] truncate">{report.reason}</TableCell>
                <TableCell>
                  <StatusBadge status={report.status} />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="actions"
                    onClick={(e) => handleMenuOpen(e, report.id)}
                    size="small"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEls[report.id] || null}
                    open={Boolean(anchorEls[report.id])}
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
