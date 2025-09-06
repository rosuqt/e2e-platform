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
  Globe,
  MapPin,
  Users,
  Briefcase,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import Avatar from "@mui/material/Avatar"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import IconButton from "@mui/material/IconButton"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Typography from "@mui/material/Typography"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select from "@mui/material/Select"

interface Company {
  id: number
  companyId: string
  name: string
  email: string
  phone: string
  industry: string
  size: "small" | "medium" | "large" | "enterprise"
  status: "active" | "inactive" | "suspended" | "pending"
  registrationDate: string
  location: string
  website: string
  employeesCount: number
  description: string
  contactPerson: string
  contactEmail: string
  contactPhone: string
  address: string
  verified: boolean
}

export default function CompaniesManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("active")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all")
  const [selectedSize, setSelectedSize] = useState<string>("all")
  const [menuAnchors, setMenuAnchors] = useState<{ [key: number]: HTMLElement | null }>({})

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setMenuAnchors((prev) => ({ ...prev, [id]: event.currentTarget }))
  }

  const handleMenuClose = (id: number) => {
    setMenuAnchors((prev) => ({ ...prev, [id]: null }))
  }

  // Mock data
  const companies: Company[] = [
    {
      id: 1,
      companyId: "COM-001",
      name: "Tech Solutions Inc.",
      email: "info@techsolutions.com",
      phone: "+63 2 8123 4567",
      industry: "Information Technology",
      size: "medium",
      status: "active",
      registrationDate: "2020-03-15",
      location: "Manila",
      website: "www.techsolutions.com",
      employeesCount: 120,
      description:
        "Tech Solutions Inc. is a leading IT services company specializing in software development and cloud solutions.",
      contactPerson: "John Smith",
      contactEmail: "john.smith@techsolutions.com",
      contactPhone: "+63 912 345 6789",
      address: "123 Tech Avenue, Makati City, Metro Manila",
      verified: true,
    },
    {
      id: 2,
      companyId: "COM-002",
      name: "Digital Innovations",
      email: "contact@digitalinnovations.com",
      phone: "+63 2 8234 5678",
      industry: "Information Technology",
      size: "small",
      status: "active",
      registrationDate: "2021-05-20",
      location: "Cebu",
      website: "www.digitalinnovations.com",
      employeesCount: 45,
      description:
        "Digital Innovations is a digital transformation company helping businesses adopt modern technologies.",
      contactPerson: "Sarah Williams",
      contactEmail: "sarah.williams@digitalinnovations.com",
      contactPhone: "+63 923 456 7890",
      address: "456 Digital Street, Cebu City",
      verified: true,
    },
    {
      id: 3,
      companyId: "COM-003",
      name: "WebTech Solutions",
      email: "hello@webtech.com",
      phone: "+63 2 8345 6789",
      industry: "Web Development",
      size: "small",
      status: "inactive",
      registrationDate: "2019-01-10",
      location: "Manila",
      website: "www.webtech.com",
      employeesCount: 30,
      description:
        "WebTech Solutions specializes in web development and digital marketing services for small to medium businesses.",
      contactPerson: "Michael Brown",
      contactEmail: "michael.brown@webtech.com",
      contactPhone: "+63 934 567 8901",
      address: "789 Web Lane, Quezon City, Metro Manila",
      verified: true,
    },
    {
      id: 4,
      companyId: "COM-004",
      name: "Innovative Systems",
      email: "info@innovativesystems.com",
      phone: "+63 2 8456 7890",
      industry: "Software Development",
      size: "medium",
      status: "suspended",
      registrationDate: "2018-11-05",
      location: "Davao",
      website: "www.innovativesystems.com",
      employeesCount: 75,
      description:
        "Innovative Systems develops custom software solutions for various industries including healthcare and finance.",
      contactPerson: "Jennifer Lee",
      contactEmail: "jennifer.lee@innovativesystems.com",
      contactPhone: "+63 945 678 9012",
      address: "101 Innovation Road, Davao City",
      verified: false,
    },
    {
      id: 5,
      companyId: "COM-005",
      name: "Future Technologies",
      email: "contact@futuretechnologies.com",
      phone: "+63 2 8567 8901",
      industry: "Artificial Intelligence",
      size: "small",
      status: "pending",
      registrationDate: "2022-01-20",
      location: "Makati",
      website: "www.futuretechnologies.com",
      employeesCount: 25,
      description:
        "Future Technologies is a startup focused on artificial intelligence and machine learning applications.",
      contactPerson: "David Wilson",
      contactEmail: "david.wilson@futuretechnologies.com",
      contactPhone: "+63 956 789 0123",
      address: "202 Future Street, Makati City, Metro Manila",
      verified: false,
    },
    {
      id: 6,
      companyId: "COM-006",
      name: "Global Finance Corp",
      email: "info@globalfinance.com",
      phone: "+63 2 8678 9012",
      industry: "Finance",
      size: "large",
      status: "active",
      registrationDate: "2015-08-15",
      location: "Makati",
      website: "www.globalfinance.com",
      employeesCount: 350,
      description:
        "Global Finance Corp provides financial services and solutions to businesses and individuals across the Philippines.",
      contactPerson: "Maria Rodriguez",
      contactEmail: "maria.rodriguez@globalfinance.com",
      contactPhone: "+63 967 890 1234",
      address: "303 Finance Tower, Makati City, Metro Manila",
      verified: true,
    },
    {
      id: 7,
      companyId: "COM-007",
      name: "Healthcare Innovations",
      email: "contact@healthcareinnovations.com",
      phone: "+63 2 8789 0123",
      industry: "Healthcare",
      size: "large",
      status: "active",
      registrationDate: "2017-04-10",
      location: "Manila",
      website: "www.healthcareinnovations.com",
      employeesCount: 280,
      description:
        "Healthcare Innovations develops technology solutions for hospitals, clinics, and healthcare providers.",
      contactPerson: "Robert Chen",
      contactEmail: "robert.chen@healthcareinnovations.com",
      contactPhone: "+63 978 901 2345",
      address: "404 Health Plaza, Manila",
      verified: true,
    },
  ]

  const industries = Array.from(new Set(companies.map((company) => company.industry)))
  const sizes = [
    { value: "small", label: "Small (1-50)" },
    { value: "medium", label: "Medium (51-200)" },
    { value: "large", label: "Large (201-500)" },
    { value: "enterprise", label: "Enterprise (500+)" },
  ]

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.companyId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab =
      (activeTab === "active" && company.status === "active") ||
      (activeTab === "inactive" && company.status === "inactive") ||
      (activeTab === "suspended" && company.status === "suspended") ||
      (activeTab === "pending" && company.status === "pending") ||
      activeTab === "all"

    const matchesIndustry = selectedIndustry === "all" || company.industry === selectedIndustry
    const matchesSize = selectedSize === "all" || company.size === selectedSize

    return matchesSearch && matchesTab && matchesIndustry && matchesSize
  })

  const handleViewCompany = (company: Company) => {
    setSelectedCompany(company)
    setIsViewDialogOpen(true)
  }

  const handleDeleteCompany = (company: Company) => {
    setSelectedCompany(company)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteCompany = () => {
    // In a real application, you would call an API to delete the company
    console.log(`Deleting company with ID: ${selectedCompany?.id}`)
    setIsDeleteDialogOpen(false)
    // Then refresh the company list
  }

  const exportCompanies = () => {
    // In a real application, you would generate a CSV or Excel file
    const header = "Company ID,Name,Email,Phone,Industry,Size,Status,Location,Employees,Verified\n"
    const csv = filteredCompanies
      .map(
        (company) =>
          `${company.companyId},${company.name},${company.email},${company.phone},${company.industry},${company.size},${company.status},${company.location},${company.employeesCount},${company.verified}`,
      )
      .join("\n")

    const blob = new Blob([header + csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "companies.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Company Management</h2>
          <p className="text-muted-foreground">View, export, and manage company records</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button className="flex items-center gap-2" onClick={exportCompanies}>
            <Download className="h-4 w-4" />
            Export Companies
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Company Records</CardTitle>
          <CardDescription>Comprehensive list of all companies in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search companies..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <FormControl className="w-[180px]" size="small">
                  <InputLabel id="industry-select-label">Industry</InputLabel>
                  <Select
                    labelId="industry-select-label"
                    value={selectedIndustry}
                    label="Industry"
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                  >
                    <MenuItem value="all">All Industries</MenuItem>
                    {industries.map((industry) => (
                      <MenuItem key={industry} value={industry}>
                        {industry}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl className="w-[180px]" size="small">
                  <InputLabel id="size-select-label">Company Size</InputLabel>
                  <Select
                    labelId="size-select-label"
                    value={selectedSize}
                    label="Company Size"
                    onChange={(e) => setSelectedSize(e.target.value)}
                  >
                    <MenuItem value="all">All Sizes</MenuItem>
                    {sizes.map((size) => (
                      <MenuItem key={size.value} value={size.value}>
                        {size.label}
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
              <CompaniesTable
                companies={filteredCompanies}
                onViewCompany={handleViewCompany}
                onDeleteCompany={handleDeleteCompany}
                menuAnchors={menuAnchors}
                handleMenuOpen={handleMenuOpen}
                handleMenuClose={handleMenuClose}
              />
            </TabsContent>
            <TabsContent value="active" className="mt-4">
              <CompaniesTable
                companies={filteredCompanies}
                onViewCompany={handleViewCompany}
                onDeleteCompany={handleDeleteCompany}
                menuAnchors={menuAnchors}
                handleMenuOpen={handleMenuOpen}
                handleMenuClose={handleMenuClose}
              />
            </TabsContent>
            <TabsContent value="inactive" className="mt-4">
              <CompaniesTable
                companies={filteredCompanies}
                onViewCompany={handleViewCompany}
                onDeleteCompany={handleDeleteCompany}
                menuAnchors={menuAnchors}
                handleMenuOpen={handleMenuOpen}
                handleMenuClose={handleMenuClose}
              />
            </TabsContent>
            <TabsContent value="suspended" className="mt-4">
              <CompaniesTable
                companies={filteredCompanies}
                onViewCompany={handleViewCompany}
                onDeleteCompany={handleDeleteCompany}
                menuAnchors={menuAnchors}
                handleMenuOpen={handleMenuOpen}
                handleMenuClose={handleMenuClose}
              />
            </TabsContent>
            <TabsContent value="pending" className="mt-4">
              <CompaniesTable
                companies={filteredCompanies}
                onViewCompany={handleViewCompany}
                onDeleteCompany={handleDeleteCompany}
                menuAnchors={menuAnchors}
                handleMenuOpen={handleMenuOpen}
                handleMenuClose={handleMenuClose}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Company Dialog */}
      <Dialog open={isViewDialogOpen} onClose={() => setIsViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Company Details</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Comprehensive information about the company.
          </Typography>
          {selectedCompany && (
            <div className="grid gap-6 py-4">
              <div className="flex items-start gap-4">
                <Avatar sx={{ width: 64, height: 64 }}>
                  <Building className="h-8 w-8" />
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">{selectedCompany.name}</h3>
                    {selectedCompany.verified && (
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">{selectedCompany.companyId}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={selectedCompany.status} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Email:</strong> {selectedCompany.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Phone:</strong> {selectedCompany.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Website:</strong>{" "}
                      <a
                        href={`https://${selectedCompany.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {selectedCompany.website}
                      </a>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Location:</strong> {selectedCompany.location}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Industry:</strong> {selectedCompany.industry}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Size:</strong> {getSizeLabel(selectedCompany.size)} ({selectedCompany.employeesCount}{" "}
                      employees)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Registration Date:</strong> {selectedCompany.registrationDate}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Company Description</h4>
                <p className="text-sm text-muted-foreground">{selectedCompany.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <strong>Contact Person:</strong> {selectedCompany.contactPerson}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <strong>Contact Email:</strong> {selectedCompany.contactEmail}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <strong>Contact Phone:</strong> {selectedCompany.contactPhone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <strong>Address:</strong> {selectedCompany.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
            Close
          </Button>
          <Button>Edit Company</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Are you sure you want to delete this company?</DialogTitle>
        <DialogContent>
          <Typography>
            This action cannot be undone. This will permanently delete the company record and remove all associated
            data from the system, including job listings and employer accounts.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={confirmDeleteCompany} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

// MUI Table and Menu for CompaniesTable
function CompaniesTable({
  companies,
  onViewCompany,
  onDeleteCompany,
  menuAnchors,
  handleMenuOpen,
  handleMenuClose,
}: {
  companies: Company[]
  onViewCompany: (company: Company) => void
  onDeleteCompany: (company: Company) => void
  menuAnchors: { [key: number]: HTMLElement | null }
  handleMenuOpen: (event: React.MouseEvent<HTMLElement>, id: number) => void
  handleMenuClose: (id: number) => void
}) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Company ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Industry</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Verified</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {companies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center" style={{ padding: "2rem", color: "#888" }}>
                No companies found
              </TableCell>
            </TableRow>
          ) : (
            companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell style={{ fontWeight: 500 }}>{company.companyId}</TableCell>
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.industry}</TableCell>
                <TableCell>{getSizeLabel(company.size)}</TableCell>
                <TableCell>{company.location}</TableCell>
                <TableCell>
                  <StatusBadge status={company.status} />
                </TableCell>
                <TableCell>
                  {company.verified ? (
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500 border-gray-500">
                      Unverified
                    </Badge>
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="more"
                    aria-controls={`company-menu-${company.id}`}
                    aria-haspopup="true"
                    onClick={(e) => handleMenuOpen(e, company.id)}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </IconButton>
                  <Menu
                    id={`company-menu-${company.id}`}
                    anchorEl={menuAnchors[company.id] || null}
                    open={Boolean(menuAnchors[company.id])}
                    onClose={() => handleMenuClose(company.id)}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleMenuClose(company.id)
                        onViewCompany(company)
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose(company.id)
                        // Add edit logic here if needed
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose(company.id)
                        onDeleteCompany(company)
                      }}
                      style={{ color: "#dc2626" }}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
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

function getSizeLabel(size: string): string {
  switch (size) {
    case "small":
      return "Small (1-50)"
    case "medium":
      return "Medium (51-200)"
    case "large":
      return "Large (201-500)"
    case "enterprise":
      return "Enterprise (500+)"
    default:
      return size
  }
}
