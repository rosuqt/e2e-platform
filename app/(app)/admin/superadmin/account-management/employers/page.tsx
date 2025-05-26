"use client"

import { useState } from "react"
import {
  Search,
  Download,
  MoreHorizontal,
  Eye,
  Trash,
  Edit,
  Mail,
  Phone,
  Building,
  Calendar,
  User,
  Briefcase,
  MapPin,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Button from "@mui/material/Button"
import { Input } from "@mui/material"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Avatar from "@mui/material/Avatar"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import InputLabel from "@mui/material/InputLabel"
import FormControl from "@mui/material/FormControl"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"

interface Employer {
  id: number
  employerId: string
  name: string
  email: string
  phone: string
  company: string
  position: string
  status: "active" | "inactive" | "suspended" | "pending"
  registrationDate: string
  industry: string
  location: string
  website: string
  employeesCount: number
  description: string
}

export default function EmployersManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("active")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null)
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all")
  const [selectedLocation, setSelectedLocation] = useState<string>("all")

  // Mock data
  const employers: Employer[] = [
    {
      id: 1,
      employerId: "EMP-001",
      name: "John Smith",
      email: "john.smith@techsolutions.com",
      phone: "+63 912 345 6789",
      company: "Tech Solutions Inc.",
      position: "HR Manager",
      status: "active",
      registrationDate: "2022-03-15",
      industry: "Information Technology",
      location: "Manila",
      website: "www.techsolutions.com",
      employeesCount: 120,
      description:
        "Tech Solutions Inc. is a leading IT services company specializing in software development and cloud solutions.",
    },
    {
      id: 2,
      employerId: "EMP-002",
      name: "Sarah Williams",
      email: "sarah.williams@digitalinnovations.com",
      phone: "+63 923 456 7890",
      company: "Digital Innovations",
      position: "Talent Acquisition Specialist",
      status: "active",
      registrationDate: "2022-05-20",
      industry: "Information Technology",
      location: "Cebu",
      website: "www.digitalinnovations.com",
      employeesCount: 85,
      description:
        "Digital Innovations is a digital transformation company helping businesses adopt modern technologies.",
    },
    {
      id: 3,
      employerId: "EMP-003",
      name: "Michael Brown",
      email: "michael.brown@webtech.com",
      phone: "+63 934 567 8901",
      company: "WebTech Solutions",
      position: "Recruitment Manager",
      status: "inactive",
      registrationDate: "2022-01-10",
      industry: "Web Development",
      location: "Manila",
      website: "www.webtech.com",
      employeesCount: 45,
      description:
        "WebTech Solutions specializes in web development and digital marketing services for small to medium businesses.",
    },
    {
      id: 4,
      employerId: "EMP-004",
      name: "Jennifer Lee",
      email: "jennifer.lee@innovativesystems.com",
      phone: "+63 945 678 9012",
      company: "Innovative Systems",
      position: "HR Director",
      status: "suspended",
      registrationDate: "2021-11-05",
      industry: "Software Development",
      location: "Davao",
      website: "www.innovativesystems.com",
      employeesCount: 60,
      description:
        "Innovative Systems develops custom software solutions for various industries including healthcare and finance.",
    },
    {
      id: 5,
      employerId: "EMP-005",
      name: "David Wilson",
      email: "david.wilson@futuretechnologies.com",
      phone: "+63 956 789 0123",
      company: "Future Technologies",
      position: "Recruitment Specialist",
      status: "pending",
      registrationDate: "2023-01-20",
      industry: "Artificial Intelligence",
      location: "Makati",
      website: "www.futuretechnologies.com",
      employeesCount: 30,
      description:
        "Future Technologies is a startup focused on artificial intelligence and machine learning applications.",
    },
    {
      id: 6,
      employerId: "EMP-006",
      name: "Maria Rodriguez",
      email: "maria.rodriguez@globalfinance.com",
      phone: "+63 967 890 1234",
      company: "Global Finance Corp",
      position: "Talent Manager",
      status: "active",
      registrationDate: "2022-08-15",
      industry: "Finance",
      location: "Makati",
      website: "www.globalfinance.com",
      employeesCount: 200,
      description:
        "Global Finance Corp provides financial services and solutions to businesses and individuals across the Philippines.",
    },
  ]

  const industries = Array.from(new Set(employers.map((employer) => employer.industry)))
  const locations = Array.from(new Set(employers.map((employer) => employer.location)))

  const filteredEmployers = employers.filter((employer) => {
    const matchesSearch =
      employer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employer.employerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employer.company.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab =
      (activeTab === "active" && employer.status === "active") ||
      (activeTab === "inactive" && employer.status === "inactive") ||
      (activeTab === "suspended" && employer.status === "suspended") ||
      (activeTab === "pending" && employer.status === "pending") ||
      activeTab === "all"

    const matchesIndustry = selectedIndustry === "all" || employer.industry === selectedIndustry
    const matchesLocation = selectedLocation === "all" || employer.location === selectedLocation

    return matchesSearch && matchesTab && matchesIndustry && matchesLocation
  })

  const handleViewEmployer = (employer: Employer) => {
    setSelectedEmployer(employer)
    setIsViewDialogOpen(true)
  }

  const handleDeleteEmployer = (employer: Employer) => {
    setSelectedEmployer(employer)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteEmployer = () => {
    // In a real application, you would call an API to delete the employer
    console.log(`Deleting employer with ID: ${selectedEmployer?.id}`)
    setIsDeleteDialogOpen(false)
    // Then refresh the employer list
  }

  const exportEmployers = () => {
    // In a real application, you would generate a CSV or Excel file
    const header = "Employer ID,Name,Email,Phone,Company,Position,Status,Industry,Location\n"
    const csv = filteredEmployers
      .map(
        (employer) =>
          `${employer.employerId},${employer.name},${employer.email},${employer.phone},${employer.company},${employer.position},${employer.status},${employer.industry},${employer.location}`,
      )
      .join("\n")

    const blob = new Blob([header + csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "employers.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Employer Management</h2>
          <p className="text-muted-foreground">View, export, and manage employer records</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button className="flex items-center gap-2" onClick={exportEmployers}>
            <Download className="h-4 w-4" />
            Export Employers
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Employer Records</CardTitle>
          <CardDescription>Comprehensive list of all employers in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search employers..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <FormControl className="w-[180px]">
                  <InputLabel>Industry</InputLabel>
                  <Select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    label="Industry"
                  >
                    <MenuItem value="all">All Industries</MenuItem>
                    {industries.map((industry) => (
                      <MenuItem key={industry} value={industry}>
                        {industry}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl className="w-[150px]">
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    label="Location"
                  >
                    <MenuItem value="all">All Locations</MenuItem>
                    {locations.map((location) => (
                      <MenuItem key={location} value={location}>
                        {location}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>

          <Tabs defaultValue="active" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="suspended">Suspended</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <EmployersTable
                employers={filteredEmployers}
                onViewEmployer={handleViewEmployer}
                onDeleteEmployer={handleDeleteEmployer}
              />
            </TabsContent>
            <TabsContent value="active" className="mt-4">
              <EmployersTable
                employers={filteredEmployers}
                onViewEmployer={handleViewEmployer}
                onDeleteEmployer={handleDeleteEmployer}
              />
            </TabsContent>
            <TabsContent value="inactive" className="mt-4">
              <EmployersTable
                employers={filteredEmployers}
                onViewEmployer={handleViewEmployer}
                onDeleteEmployer={handleDeleteEmployer}
              />
            </TabsContent>
            <TabsContent value="suspended" className="mt-4">
              <EmployersTable
                employers={filteredEmployers}
                onViewEmployer={handleViewEmployer}
                onDeleteEmployer={handleDeleteEmployer}
              />
            </TabsContent>
            <TabsContent value="pending" className="mt-4">
              <EmployersTable
                employers={filteredEmployers}
                onViewEmployer={handleViewEmployer}
                onDeleteEmployer={handleDeleteEmployer}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Employer Dialog */}
      <Dialog open={isViewDialogOpen} onClose={() => setIsViewDialogOpen(false)}>
        <DialogTitle>Employer Details</DialogTitle>
        <DialogContent>
          <DialogContentText>Comprehensive information about the employer.</DialogContentText>
          {selectedEmployer && (
            <div className="grid gap-6 py-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <User className="h-8 w-8" />
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedEmployer.name}</h3>
                  <p className="text-muted-foreground">{selectedEmployer.employerId}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={selectedEmployer.status} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Email:</strong> {selectedEmployer.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Phone:</strong> {selectedEmployer.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Company:</strong> {selectedEmployer.company}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Position:</strong> {selectedEmployer.position}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Registration Date:</strong> {selectedEmployer.registrationDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Industry:</strong> {selectedEmployer.industry}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Location:</strong> {selectedEmployer.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Employees:</strong> {selectedEmployer.employeesCount}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Website</Label>
                <p className="font-medium">{selectedEmployer.website}</p>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Company Description</Label>
                <p className="mt-1">{selectedEmployer.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsViewDialogOpen(false)} color="primary">
            Close
          </Button>
          <Button>Edit Employer</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Are you sure you want to delete this employer?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. This will permanently delete the employer record and remove all associated
            data from the system.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteEmployer} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

function EmployersTable({
  employers,
  onViewEmployer,
  onDeleteEmployer,
}: {
  employers: Employer[]
  onViewEmployer: (employer: Employer) => void
  onDeleteEmployer: (employer: Employer) => void
}) {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [menuEmployerId, setMenuEmployerId] = useState<number | null>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, employerId: number) => {
    setMenuAnchorEl(event.currentTarget)
    setMenuEmployerId(employerId)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
    setMenuEmployerId(null)
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employer ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Location</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} align="center">
                No employers found
              </TableCell>
            </TableRow>
          ) : (
            employers.map((employer) => (
              <TableRow key={employer.id}>
                <TableCell>{employer.employerId}</TableCell>
                <TableCell>{employer.name}</TableCell>
                <TableCell>{employer.email}</TableCell>
                <TableCell>{employer.phone}</TableCell>
                <TableCell>{employer.company}</TableCell>
                <TableCell>{employer.position}</TableCell>
                <TableCell>
                  <StatusBadge status={employer.status} />
                </TableCell>
                <TableCell>{employer.location}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={(e) => handleMenuOpen(e, employer.id)}>
                    <MoreHorizontal />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchorEl}
                    open={Boolean(menuAnchorEl) && menuEmployerId === employer.id}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        onViewEmployer(employer)
                        handleMenuClose()
                      }}
                    >
                      <ListItemIcon>
                        <Eye />
                      </ListItemIcon>
                      <ListItemText>View Details</ListItemText>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        // Add edit logic here if needed
                        handleMenuClose()
                      }}
                    >
                      <ListItemIcon>
                        <Edit />
                      </ListItemIcon>
                      <ListItemText>Edit</ListItemText>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        onDeleteEmployer(employer)
                        handleMenuClose()
                      }}
                    >
                      <ListItemIcon>
                        <Trash />
                      </ListItemIcon>
                      <ListItemText>Delete</ListItemText>
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
  if (status === "active") {
    return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
  } else if (status === "inactive") {
    return (
      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
        Inactive
      </Badge>
    )
  } else if (status === "suspended") {
    return <Badge variant="destructive">Suspended</Badge>
  } else if (status === "pending") {
    return (
      <Badge variant="outline" className="text-blue-600 border-blue-600">
        Pending
      </Badge>
    )
  }
  return null
}
