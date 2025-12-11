/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useEffect } from "react"
import {
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  FileText,
  MessageSquare,
  Calendar,
  User,
  Briefcase,
  Building,
  Phone,
} from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
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


export default function ApplicationsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [feedbackNote, setFeedbackNote] = useState("")
  const [applications, setApplications] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/superadmin/careers/applicants")
      .then((res) => res.json())
      .then(({ data }) => {
        console.log("Fetched applications:", data)
        setApplications(data || [])
      })
  }, [])

  const filteredApplications = applications.filter((application) => {
    const matchesSearch =
      (application.first_name + " " + application.last_name).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (application.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (application.position_title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (application.department || "").toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch 
  })

  const handleViewApplication = (application: any) => {
    setSelectedApplication(application)
    setFeedbackNote(application.notes || "")
    setIsViewDialogOpen(true)
  }

  const handleExportApplications = () => {
    if (!applications.length) return
    const csvRows = [
      [
        "Applicant Name",
        "Email",
        "Phone",
        "Position",
        "Department",
        "Applied Date",
        "Status",
        "Resume URL",
        "Cover Letter URL"
      ].join(","),
      ...applications.map(app =>
        [
          `"${(app.first_name || "N/A") + " " + (app.last_name || "")}"`,
          `"${app.email || "N/A"}"`,
          `"${app.phone || "N/A"}"`,
          `"${app.position_title || "N/A"}"`,
          `"${app.department || "N/A"}"`,
          `"${app.created_at ? String(app.created_at).split("T")[0] : "N/A"}"`,
          `"${app.status || "pending"}"`,
          `"${app.resume_url || ""}"`,
          `"${app.cover_letter_url || ""}"`
        ].join(",")
      )
    ]
    const csvContent = csvRows.join("\r\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "applications_export.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Job Applications</h2>
          <p className="text-muted-foreground">Manage and review applications for career opportunities</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button className="flex items-center gap-2" onClick={handleExportApplications}>
            <Download className="h-4 w-4" />
            Export Applications
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Applications</CardTitle>
          <CardDescription>Review and process job applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search applications..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          <ApplicationsTable applications={filteredApplications} onViewApplication={handleViewApplication} />
        </CardContent>
      </Card>
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Review the applicant&apos;s information.
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="grid gap-6 py-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold">
                    {(selectedApplication.first_name || "N/A") + " " + (selectedApplication.last_name || "")}
                  </h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <strong>Email:</strong> {selectedApplication.email || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <strong>Phone:</strong> {selectedApplication.phone || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge status={selectedApplication.status || "pending"} />
                  </div>
                </div>
                {selectedApplication.resume_url && (
                  <a
                    href={selectedApplication.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline"
                  >
                    <Button variant="outline" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      View Resume
                    </Button>
                  </a>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Position: <strong>{selectedApplication.position_title || "N/A"}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Department: <strong>{selectedApplication.department || "N/A"}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Applied: <strong>{selectedApplication.created_at ? String(selectedApplication.created_at).split("T")[0] : "N/A"}</strong>
                  </span>
                </div>
              </div>
              {selectedApplication.cover_letter && (
                <div>
                  <h4 className="font-medium mb-2">Cover Letter</h4>
                  <div className="p-3 bg-slate-50 rounded-md text-sm">
                    <p>{selectedApplication.cover_letter}</p>
                  </div>
                </div>
              )}
              <div>
                <Label htmlFor="notes">Notes & Feedback</Label>
                <Textarea
                  id="notes"
                  placeholder="Add notes about this applicant..."
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Message
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule Interview
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="destructive" className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
              <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ApplicationsTable({
  applications,
  onViewApplication,
}: {
  applications: any[]
  onViewApplication: (application: any) => void
}) {
  const [anchorEls, setAnchorEls] = useState<{ [key: number]: HTMLElement | null }>({})

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: number) => {
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
            <TableCell>Applicant Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Applied Date</TableCell>
            <TableCell>Resume</TableCell>
            <TableCell>Cover Letter</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} align="center" className="py-8 text-muted-foreground font-semibold text-lg">
                No applications found. Please check back later.
              </TableCell>
            </TableRow>
          ) : (
            applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>
                  {(application.first_name || "N/A") + " " + (application.last_name || "")}
                </TableCell>
                <TableCell>{application.email || "N/A"}</TableCell>
                <TableCell>{application.phone || "N/A"}</TableCell>
                <TableCell>{application.position_title || "N/A"}</TableCell>
                <TableCell>{application.department || "N/A"}</TableCell>
                <TableCell>{application.created_at ? String(application.created_at).split("T")[0] : "N/A"}</TableCell>
                <TableCell>
                  {application.resume_url ? (
                    <a href={application.resume_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">View</Button>
                    </a>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>
                  {application.cover_letter_url ? (
                    <a href={application.cover_letter_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">View</Button>
                    </a>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="more"
                    onClick={(e) => handleMenuOpen(e, application.id)}
                    size="small"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEls[application.id]}
                    open={Boolean(anchorEls[application.id])}
                    onClose={() => handleMenuClose(application.id)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <MenuItem onClick={() => { onViewApplication(application); handleMenuClose(application.id) }}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </MenuItem>
                    <MenuItem
                      component="a"
                      href={application.resume_url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleMenuClose(application.id)}
                      disabled={!application.resume_url}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View Resume
                    </MenuItem>
                    <MenuItem
                      component="a"
                      href={application.cover_letter_url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleMenuClose(application.id)}
                      disabled={!application.cover_letter_url}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View Cover Letter
                    </MenuItem>
                    <MenuItem onClick={() => handleMenuClose(application.id)}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message
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
  } else if (status === "reviewing") {
    return (
      <Badge className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Reviewing
      </Badge>
    )
  } else if (status === "shortlisted") {
    return (
      <Badge className="bg-purple-500 hover:bg-purple-600 flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        Shortlisted
      </Badge>
    )
  } else if (status === "rejected") {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        Rejected
      </Badge>
    )
  } else if (status === "hired") {
    return (
      <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-200">
        <CheckCircle className="h-3 w-3" />
        Hired
      </Badge>
    )
  }
  return null
}
