"use client"
import Image from "next/image"

import { useState } from "react"
import {
  Search,
  Filter,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import Avatar from "@mui/material/Avatar"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"

interface Application {
  id: number
  applicantName: string
  email: string
  phone: string
  jobTitle: string
  department: string
  status: "pending" | "reviewing" | "shortlisted" | "rejected" | "hired"
  appliedAt: string
  resumeUrl: string
  coverLetter: string
  education: string
  experience: string
  skills: string[]
  notes?: string
}

export default function ApplicationsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("pending")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [feedbackNote, setFeedbackNote] = useState("")

  // Mock data
  const applications: Application[] = [
    {
      id: 1,
      applicantName: "John Smith",
      email: "john.smith@example.com",
      phone: "+63 912 345 6789",
      jobTitle: "Software Developer",
      department: "IT",
      status: "pending",
      appliedAt: "2023-05-18",
      resumeUrl: "/resumes/john-smith-resume.pdf",
      coverLetter:
        "I am writing to express my interest in the Software Developer position at your company. With my experience in web development and proficiency in JavaScript frameworks, I believe I would be a valuable addition to your team.",
      education: "Bachelor of Science in Computer Science, University of Manila, 2020",
      experience: "Junior Developer at Tech Solutions (2020-2022), Freelance Web Developer (2022-Present)",
      skills: ["JavaScript", "React", "Node.js", "MongoDB", "Git"],
    },
    {
      id: 2,
      applicantName: "Maria Garcia",
      email: "maria.garcia@example.com",
      phone: "+63 923 456 7890",
      jobTitle: "Data Analyst",
      department: "Analytics",
      status: "reviewing",
      appliedAt: "2023-05-20",
      resumeUrl: "/resumes/maria-garcia-resume.pdf",
      coverLetter:
        "I am excited to apply for the Data Analyst position. My background in statistics and experience with data visualization tools make me well-suited for this role. I am particularly interested in helping your company make data-driven decisions.",
      education: "Master of Science in Statistics, Cebu University, 2021",
      experience:
        "Research Assistant at National Statistics Office (2021-2022), Data Analyst Intern at Global Analytics (2022)",
      skills: ["SQL", "Python", "R", "Tableau", "Excel"],
    },
    {
      id: 3,
      applicantName: "David Lee",
      email: "david.lee@example.com",
      phone: "+63 934 567 8901",
      jobTitle: "UI/UX Designer",
      department: "Design",
      status: "shortlisted",
      appliedAt: "2023-05-22",
      resumeUrl: "/resumes/david-lee-resume.pdf",
      coverLetter:
        "I am applying for the UI/UX Designer position at your company. With my portfolio of design projects and understanding of user-centered design principles, I am confident in my ability to create intuitive and engaging user experiences for your products.",
      education: "Bachelor of Fine Arts in Design, Manila Institute of Arts, 2019",
      experience: "UI Designer at Creative Solutions (2019-2021), Freelance UX Designer (2021-Present)",
      skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research"],
      notes: "Excellent portfolio, strong visual design skills. Schedule second interview.",
    },
    {
      id: 4,
      applicantName: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "+63 945 678 9012",
      jobTitle: "Software Developer",
      department: "IT",
      status: "rejected",
      appliedAt: "2023-05-15",
      resumeUrl: "/resumes/sarah-johnson-resume.pdf",
      coverLetter:
        "I am interested in the Software Developer position at your company. I have experience in web development and am eager to contribute to your team's projects.",
      education: "Associate Degree in Computer Programming, Davao Technical College, 2021",
      experience: "Junior Programmer at Local Tech (2021-2022)",
      skills: ["HTML", "CSS", "JavaScript", "PHP"],
      notes: "Lacks required experience with React and Node.js.",
    },
    {
      id: 5,
      applicantName: "Michael Rodriguez",
      email: "michael.rodriguez@example.com",
      phone: "+63 956 789 0123",
      jobTitle: "Network Administrator",
      department: "IT",
      status: "hired",
      appliedAt: "2023-04-12",
      resumeUrl: "/resumes/michael-rodriguez-resume.pdf",
      coverLetter:
        "I am applying for the Network Administrator position. With my certifications and experience in network management, I am well-prepared to maintain and optimize your company's network infrastructure.",
      education: "Bachelor of Science in Information Technology, University of Davao, 2018",
      experience: "IT Support at Global Tech (2018-2020), Network Technician at Network Solutions (2020-2023)",
      skills: ["Network Security", "Cisco Systems", "Troubleshooting", "CCNA Certified"],
      notes: "Strong technical skills and excellent communication. Offer extended and accepted.",
    },
  ]

  const filteredApplications = applications.filter((application) => {
    const matchesSearch =
      application.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.department.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && application.status === "pending") ||
      (activeTab === "reviewing" && application.status === "reviewing") ||
      (activeTab === "shortlisted" && application.status === "shortlisted") ||
      (activeTab === "rejected" && application.status === "rejected") ||
      (activeTab === "hired" && application.status === "hired")

    return matchesSearch && matchesTab
  })

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application)
    setFeedbackNote(application.notes || "")
    setIsViewDialogOpen(true)
  }

  const getStatusProgress = (status: string): number => {
    switch (status) {
      case "pending":
        return 20
      case "reviewing":
        return 40
      case "shortlisted":
        return 60
      case "rejected":
        return 100
      case "hired":
        return 100
      default:
        return 0
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Job Applications</h2>
          <p className="text-muted-foreground">Manage and review applications for career opportunities</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button className="flex items-center gap-2">
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
              <TabsTrigger value="reviewing">Reviewing</TabsTrigger>
              <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
              <TabsTrigger value="hired">Hired</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <ApplicationsTable applications={filteredApplications} onViewApplication={handleViewApplication} />
            </TabsContent>
            <TabsContent value="pending" className="mt-4">
              <ApplicationsTable applications={filteredApplications} onViewApplication={handleViewApplication} />
            </TabsContent>
            <TabsContent value="reviewing" className="mt-4">
              <ApplicationsTable applications={filteredApplications} onViewApplication={handleViewApplication} />
            </TabsContent>
            <TabsContent value="shortlisted" className="mt-4">
              <ApplicationsTable applications={filteredApplications} onViewApplication={handleViewApplication} />
            </TabsContent>
            <TabsContent value="hired" className="mt-4">
              <ApplicationsTable applications={filteredApplications} onViewApplication={handleViewApplication} />
            </TabsContent>
            <TabsContent value="rejected" className="mt-4">
              <ApplicationsTable applications={filteredApplications} onViewApplication={handleViewApplication} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Application Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Review the applicant&apos;s information and manage their application status.
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="grid gap-6 py-4">
              <div className="flex items-start gap-4">
                <Avatar sx={{ width: 64, height: 64 }}>
                  <Image src="/placeholder.svg?height=64&width=64" alt="Applicant" width={64} height={64} />
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{selectedApplication.applicantName}</h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <strong>Email:</strong> {selectedApplication.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <strong>Phone:</strong> {selectedApplication.phone}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    {selectedApplication.email} • {selectedApplication.phone}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge status={selectedApplication.status} />
                  </div>
                </div>
                <a
                  href={selectedApplication.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline"
                >
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    View Resume
                  </Button>
                </a>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium">Application Progress</h4>
                  <span className="text-sm text-muted-foreground">
                    {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                  </span>
                </div>
                <Progress value={getStatusProgress(selectedApplication.status)} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Position: <strong>{selectedApplication.jobTitle}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Department: <strong>{selectedApplication.department}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Applied: <strong>{selectedApplication.appliedAt}</strong>
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Cover Letter</h4>
                <div className="p-3 bg-slate-50 rounded-md text-sm">
                  <p>{selectedApplication.coverLetter}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Education</h4>
                  <div className="p-3 bg-slate-50 rounded-md text-sm">
                    <p>{selectedApplication.education}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Experience</h4>
                  <div className="p-3 bg-slate-50 rounded-md text-sm">
                    <p>{selectedApplication.experience}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedApplication.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

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
  applications: Application[]
  onViewApplication: (application: Application) => void
}) {
  // MUI Menu state
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
            <TableCell>Applicant</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Applied Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" className="py-8 text-muted-foreground">
                No applications found
              </TableCell>
            </TableRow>
          ) : (
            applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar sx={{ width: 32, height: 32 }}>
                      <User className="h-4 w-4" />
                    </Avatar>
                    <div>
                      <div className="font-medium">{application.applicantName}</div>
                      <div className="text-xs text-muted-foreground">{application.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{application.phone}</TableCell>
                <TableCell>{application.jobTitle}</TableCell>
                <TableCell>{application.department}</TableCell>
                <TableCell>{application.appliedAt}</TableCell>
                <TableCell>
                  <StatusBadge status={application.status} />
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
                      href={application.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleMenuClose(application.id)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View Resume
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
