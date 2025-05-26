"use client"

import { useState } from "react"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash,
  Eye,
  Calendar,
  Briefcase,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  Users,
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import MuiTable from "@mui/material/Table"
import MuiTableBody from "@mui/material/TableBody"
import MuiTableCell from "@mui/material/TableCell"
import MuiTableContainer from "@mui/material/TableContainer"
import MuiTableHead from "@mui/material/TableHead"
import MuiTableRow from "@mui/material/TableRow"
import MuiPaper from "@mui/material/Paper"
import MuiMenu from "@mui/material/Menu"
import MuiMenuItem from "@mui/material/MenuItem"
import MuiIconButton from "@mui/material/IconButton"

interface CareerOpportunity {
  id: number
  title: string
  department: string
  location: string
  type: "full-time" | "part-time" | "contract" | "internship"
  status: "active" | "closed" | "draft"
  postedAt: string
  closingDate: string
  applicants: number
  description: string
  requirements: string[]
  responsibilities: string[]
}

export default function CareerOpportunities() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("active")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState<CareerOpportunity | null>(null)
  const [newOpportunity, setNewOpportunity] = useState<Partial<CareerOpportunity>>({
    title: "",
    department: "",
    location: "",
    type: "full-time",
    status: "draft",
    description: "",
    requirements: [],
    responsibilities: [],
  })

  // Mock data
  const opportunities: CareerOpportunity[] = [
    {
      id: 1,
      title: "Software Developer",
      department: "IT",
      location: "Manila",
      type: "full-time",
      status: "active",
      postedAt: "2023-05-15",
      closingDate: "2023-06-15",
      applicants: 12,
      description:
        "We are looking for a skilled software developer to join our IT team. The ideal candidate will have experience in web development and be proficient in JavaScript frameworks.",
      requirements: [
        "Bachelor's degree in Computer Science or related field",
        "2+ years of experience in web development",
        "Proficiency in JavaScript, React, and Node.js",
        "Experience with database systems like MySQL or MongoDB",
      ],
      responsibilities: [
        "Develop and maintain web applications",
        "Collaborate with cross-functional teams",
        "Troubleshoot and debug applications",
        "Implement security and data protection measures",
      ],
    },
    {
      id: 2,
      title: "Data Analyst",
      department: "Analytics",
      location: "Cebu",
      type: "full-time",
      status: "active",
      postedAt: "2023-05-20",
      closingDate: "2023-06-20",
      applicants: 8,
      description:
        "We are seeking a data analyst to help interpret data and turn it into information which can offer ways to improve our business, make it more efficient, and increase profits.",
      requirements: [
        "Bachelor's degree in Statistics, Mathematics, or related field",
        "Experience with data visualization tools",
        "Proficiency in SQL and Excel",
        "Knowledge of Python or R for data analysis",
      ],
      responsibilities: [
        "Collect and analyze data to identify patterns and trends",
        "Create reports and dashboards",
        "Collaborate with teams to implement data-driven strategies",
        "Monitor performance metrics",
      ],
    },
    {
      id: 3,
      title: "UI/UX Designer",
      department: "Design",
      location: "Manila",
      type: "part-time",
      status: "active",
      postedAt: "2023-05-25",
      closingDate: "2023-06-25",
      applicants: 15,
      description:
        "We are looking for a UI/UX Designer to turn our software into easy-to-use products for our clients. You will be responsible for the user interface design and user experience.",
      requirements: [
        "Bachelor's degree in Design, Computer Science, or related field",
        "Portfolio demonstrating UI/UX projects",
        "Proficiency in design software like Figma or Adobe XD",
        "Understanding of user-centered design principles",
      ],
      responsibilities: [
        "Create user flows, wireframes, and prototypes",
        "Conduct user research and testing",
        "Collaborate with developers to implement designs",
        "Ensure consistency in design elements",
      ],
    },
    {
      id: 4,
      title: "Network Administrator",
      department: "IT",
      location: "Davao",
      type: "full-time",
      status: "closed",
      postedAt: "2023-04-10",
      closingDate: "2023-05-10",
      applicants: 6,
      description:
        "We are seeking a Network Administrator to maintain and optimize our company's network infrastructure. The ideal candidate will have experience in network security and troubleshooting.",
      requirements: [
        "Bachelor's degree in IT, Computer Science, or related field",
        "Network certification (CCNA, CompTIA Network+)",
        "Experience with network hardware and software",
        "Knowledge of security protocols and procedures",
      ],
      responsibilities: [
        "Maintain network infrastructure and security",
        "Monitor network performance and troubleshoot issues",
        "Implement and manage network hardware and software",
        "Provide technical support to staff",
      ],
    },
    {
      id: 5,
      title: "IT Intern",
      department: "IT",
      location: "Manila",
      type: "internship",
      status: "draft",
      postedAt: "",
      closingDate: "",
      applicants: 0,
      description:
        "We are offering an internship opportunity for IT students to gain practical experience in a professional environment. Interns will work on real projects under the guidance of experienced professionals.",
      requirements: [
        "Currently enrolled in a Computer Science or IT-related program",
        "Basic knowledge of programming languages",
        "Eagerness to learn and grow",
        "Good communication skills",
      ],
      responsibilities: [
        "Assist in software development projects",
        "Help with technical support tasks",
        "Learn about IT operations in a corporate environment",
        "Participate in team meetings and discussions",
      ],
    },
  ]

  const filteredOpportunities = opportunities.filter((opportunity) => {
    const matchesSearch =
      opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opportunity.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opportunity.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab =
      (activeTab === "active" && opportunity.status === "active") ||
      (activeTab === "closed" && opportunity.status === "closed") ||
      (activeTab === "draft" && opportunity.status === "draft") ||
      activeTab === "all"

    return matchesSearch && matchesTab
  })

  const handleViewOpportunity = (opportunity: CareerOpportunity) => {
    setSelectedOpportunity(opportunity)
    setIsViewDialogOpen(true)
  }

  const handleEditOpportunity = (opportunity: CareerOpportunity) => {
    setSelectedOpportunity(opportunity)
    setNewOpportunity({
      title: opportunity.title,
      department: opportunity.department,
      location: opportunity.location,
      type: opportunity.type,
      status: opportunity.status,
      description: opportunity.description,
      requirements: opportunity.requirements,
      responsibilities: opportunity.responsibilities,
    })
    setIsEditDialogOpen(true)
  }

  const handleRequirementsChange = (value: string) => {
    setNewOpportunity({
      ...newOpportunity,
      requirements: value.split("\n").filter((item) => item.trim() !== ""),
    })
  }

  const handleResponsibilitiesChange = (value: string) => {
    setNewOpportunity({
      ...newOpportunity,
      responsibilities: value.split("\n").filter((item) => item.trim() !== ""),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Career Opportunities</h2>
          <p className="text-muted-foreground">Manage job listings and career opportunities</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Opportunity
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px]">
              <DialogHeader>
                <DialogTitle>Create New Career Opportunity</DialogTitle>
                <DialogDescription>Fill in the details to create a new job listing.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Job Title
                  </Label>
                  <Input
                    id="title"
                    className="col-span-3"
                    value={newOpportunity.title}
                    onChange={(e) => setNewOpportunity({ ...newOpportunity, title: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">
                    Department
                  </Label>
                  <Input
                    id="department"
                    className="col-span-3"
                    value={newOpportunity.department}
                    onChange={(e) => setNewOpportunity({ ...newOpportunity, department: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="location"
                    className="col-span-3"
                    value={newOpportunity.location}
                    onChange={(e) => setNewOpportunity({ ...newOpportunity, location: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Job Type
                  </Label>
                  <Select
                    value={newOpportunity.type}
                    onValueChange={(value: "full-time" | "part-time" | "contract" | "internship") =>
                      setNewOpportunity({ ...newOpportunity, type: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={newOpportunity.status}
                    onValueChange={(value: "active" | "closed" | "draft") =>
                      setNewOpportunity({ ...newOpportunity, status: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    className="col-span-3"
                    rows={4}
                    value={newOpportunity.description}
                    onChange={(e) => setNewOpportunity({ ...newOpportunity, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="requirements" className="text-right pt-2">
                    Requirements
                  </Label>
                  <Textarea
                    id="requirements"
                    className="col-span-3"
                    rows={4}
                    placeholder="Enter each requirement on a new line"
                    value={newOpportunity.requirements?.join("\n")}
                    onChange={(e) => handleRequirementsChange(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="responsibilities" className="text-right pt-2">
                    Responsibilities
                  </Label>
                  <Textarea
                    id="responsibilities"
                    className="col-span-3"
                    rows={4}
                    placeholder="Enter each responsibility on a new line"
                    value={newOpportunity.responsibilities?.join("\n")}
                    onChange={(e) => handleResponsibilitiesChange(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Opportunity</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Job Listings</CardTitle>
          <CardDescription>View and manage all career opportunities in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search opportunities..."
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

          <Tabs defaultValue="active" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <OpportunitiesTable
                opportunities={filteredOpportunities}
                onViewOpportunity={handleViewOpportunity}
                onEditOpportunity={handleEditOpportunity}
              />
            </TabsContent>
            <TabsContent value="active" className="mt-4">
              <OpportunitiesTable
                opportunities={filteredOpportunities}
                onViewOpportunity={handleViewOpportunity}
                onEditOpportunity={handleEditOpportunity}
              />
            </TabsContent>
            <TabsContent value="closed" className="mt-4">
              <OpportunitiesTable
                opportunities={filteredOpportunities}
                onViewOpportunity={handleViewOpportunity}
                onEditOpportunity={handleEditOpportunity}
              />
            </TabsContent>
            <TabsContent value="draft" className="mt-4">
              <OpportunitiesTable
                opportunities={filteredOpportunities}
                onViewOpportunity={handleViewOpportunity}
                onEditOpportunity={handleEditOpportunity}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Opportunity Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Career Opportunity Details</DialogTitle>
            <DialogDescription>Detailed information about the job listing.</DialogDescription>
          </DialogHeader>
          {selectedOpportunity && (
            <div className="grid gap-6 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold">{selectedOpportunity.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                    <Building className="h-4 w-4" />
                    <span>{selectedOpportunity.department}</span>
                    <span className="mx-1">•</span>
                    <span>{selectedOpportunity.location}</span>
                  </div>
                </div>
                <StatusBadge status={selectedOpportunity.status} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{getJobTypeLabel(selectedOpportunity.type)}</span>
                </div>
                {selectedOpportunity.postedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Posted: {selectedOpportunity.postedAt}</span>
                  </div>
                )}
                {selectedOpportunity.closingDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Closing: {selectedOpportunity.closingDate}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedOpportunity.applicants} Applicants</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedOpportunity.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Requirements</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedOpportunity.requirements.map((req, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Responsibilities</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedOpportunity.responsibilities.map((resp, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setIsViewDialogOpen(false)
                if (selectedOpportunity) {
                  handleEditOpportunity(selectedOpportunity)
                }
              }}
            >
              Edit Opportunity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Opportunity Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Edit Career Opportunity</DialogTitle>
            <DialogDescription>Update the details of this job listing.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Job Title
              </Label>
              <Input
                id="edit-title"
                className="col-span-3"
                value={newOpportunity.title}
                onChange={(e) => setNewOpportunity({ ...newOpportunity, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-department" className="text-right">
                Department
              </Label>
              <Input
                id="edit-department"
                className="col-span-3"
                value={newOpportunity.department}
                onChange={(e) => setNewOpportunity({ ...newOpportunity, department: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-location" className="text-right">
                Location
              </Label>
              <Input
                id="edit-location"
                className="col-span-3"
                value={newOpportunity.location}
                onChange={(e) => setNewOpportunity({ ...newOpportunity, location: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">
                Job Type
              </Label>
              <Select
                value={newOpportunity.type}
                onValueChange={(value: "full-time" | "part-time" | "contract" | "internship") =>
                  setNewOpportunity({ ...newOpportunity, type: value })
                }
              >
                <SelectTrigger id="edit-type" className="col-span-3">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <Select
                value={newOpportunity.status}
                onValueChange={(value: "active" | "closed" | "draft") =>
                  setNewOpportunity({ ...newOpportunity, status: value })
                }
              >
                <SelectTrigger id="edit-status" className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-description" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="edit-description"
                className="col-span-3"
                rows={4}
                value={newOpportunity.description}
                onChange={(e) => setNewOpportunity({ ...newOpportunity, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-requirements" className="text-right pt-2">
                Requirements
              </Label>
              <Textarea
                id="edit-requirements"
                className="col-span-3"
                rows={4}
                placeholder="Enter each requirement on a new line"
                value={newOpportunity.requirements?.join("\n")}
                onChange={(e) => handleRequirementsChange(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-responsibilities" className="text-right pt-2">
                Responsibilities
              </Label>
              <Textarea
                id="edit-responsibilities"
                className="col-span-3"
                rows={4}
                placeholder="Enter each responsibility on a new line"
                value={newOpportunity.responsibilities?.join("\n")}
                onChange={(e) => handleResponsibilitiesChange(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Opportunity</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function OpportunitiesTable({
  opportunities,
  onViewOpportunity,
  onEditOpportunity,
}: {
  opportunities: CareerOpportunity[]
  onViewOpportunity: (opportunity: CareerOpportunity) => void
  onEditOpportunity: (opportunity: CareerOpportunity) => void
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
    <MuiTableContainer component={MuiPaper} className="rounded-md border shadow-none">
      <MuiTable>
        <MuiTableHead>
          <MuiTableRow>
            <MuiTableCell>Job Title</MuiTableCell>
            <MuiTableCell>Department</MuiTableCell>
            <MuiTableCell>Location</MuiTableCell>
            <MuiTableCell>Type</MuiTableCell>
            <MuiTableCell>Status</MuiTableCell>
            <MuiTableCell>Posted Date</MuiTableCell>
            <MuiTableCell>Applicants</MuiTableCell>
            <MuiTableCell align="right">Actions</MuiTableCell>
          </MuiTableRow>
        </MuiTableHead>
        <MuiTableBody>
          {opportunities.length === 0 ? (
            <MuiTableRow>
              <MuiTableCell colSpan={8} align="center" className="py-8 text-muted-foreground">
                No career opportunities found
              </MuiTableCell>
            </MuiTableRow>
          ) : (
            opportunities.map((opportunity) => (
              <MuiTableRow key={opportunity.id}>
                <MuiTableCell className="font-medium">{opportunity.title}</MuiTableCell>
                <MuiTableCell>{opportunity.department}</MuiTableCell>
                <MuiTableCell>{opportunity.location}</MuiTableCell>
                <MuiTableCell>{getJobTypeLabel(opportunity.type)}</MuiTableCell>
                <MuiTableCell>
                  <StatusBadge status={opportunity.status} />
                </MuiTableCell>
                <MuiTableCell>{opportunity.postedAt || "Not posted"}</MuiTableCell>
                <MuiTableCell>{opportunity.applicants}</MuiTableCell>
                <MuiTableCell align="right">
                  <MuiIconButton
                    aria-label="more"
                    aria-controls={`menu-${opportunity.id}`}
                    aria-haspopup="true"
                    onClick={(e) => handleMenuOpen(e, opportunity.id)}
                    size="small"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </MuiIconButton>
                  <MuiMenu
                    id={`menu-${opportunity.id}`}
                    anchorEl={anchorEls[opportunity.id] || null}
                    open={Boolean(anchorEls[opportunity.id])}
                    onClose={() => handleMenuClose(opportunity.id)}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <MuiMenuItem
                      onClick={() => {
                        handleMenuClose(opportunity.id)
                        onViewOpportunity(opportunity)
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </MuiMenuItem>
                    <MuiMenuItem
                      onClick={() => {
                        handleMenuClose(opportunity.id)
                        onEditOpportunity(opportunity)
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </MuiMenuItem>
                    <MuiMenuItem
                      onClick={() => handleMenuClose(opportunity.id)}
                      sx={{ color: "#dc2626" }}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </MuiMenuItem>
                  </MuiMenu>
                </MuiTableCell>
              </MuiTableRow>
            ))
          )}
        </MuiTableBody>
      </MuiTable>
    </MuiTableContainer>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === "active") {
    return (
      <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        Active
      </Badge>
    )
  } else if (status === "closed") {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        Closed
      </Badge>
    )
  } else if (status === "draft") {
    return (
      <Badge variant="outline" className="text-yellow-600 border-yellow-600 flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Draft
      </Badge>
    )
  }
  return null
}

function getJobTypeLabel(type: string): string {
  switch (type) {
    case "full-time":
      return "Full-time"
    case "part-time":
      return "Part-time"
    case "contract":
      return "Contract"
    case "internship":
      return "Internship"
    default:
      return type
  }
}
