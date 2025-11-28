"use client"

import { useState, useEffect } from "react"
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
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Typography from "@mui/material/Typography"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"  
import { PiWarningFill } from "react-icons/pi"
import { HiBadgeCheck } from "react-icons/hi"
import { Tooltip } from "@mui/material"

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
  contactEmail: string
  contactPhone: string
  address: string
  verified: boolean
  suite_unit_floor?: string
  business_park_landmark?: string
  building_name?: string
  country_code?: string
  contact_number?: string
  logoPath?: string
}

export default function CompaniesManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all")
  const [selectedSize, setSelectedSize] = useState<string>("all")
  const [menuAnchors, setMenuAnchors] = useState<{ [key: number]: HTMLElement | null }>({})
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [employerCount, setEmployerCount] = useState<number | null>(null)

  useEffect(() => {
    setIsLoading(true)
    fetch("/api/superadmin/fetchUsers?allCompanies=true")
      .then(res => res.json())
      .then(res => {
        if (Array.isArray(res.companies)) {
          setCompanies(
            res.companies.map((c: Record<string, unknown>, idx: number) => ({
              id: typeof c.id === "number" ? c.id : idx + 1,
              companyId: typeof c.company_id === "string"
                ? c.company_id
                : typeof c.id === "number"
                  ? c.id.toString()
                  : "",
              name: typeof c.company_name === "string" ? c.company_name : "",
              email: typeof c.contact_email === "string" ? c.contact_email : "",
              phone:
                (typeof c.country_code === "string" && c.country_code
                  ? "+" + c.country_code + " "
                  : "") +
                (typeof c.contact_number === "string" ? c.contact_number : ""),
              country_code: typeof c.country_code === "string" ? c.country_code : "",
              contact_number: typeof c.contact_number === "string" ? c.contact_number : "",
              industry: typeof c.company_industry === "string" ? c.company_industry : "",
              size: typeof c.company_size === "string" ? c.company_size : "small",
              status: typeof c.status === "string" ? c.status : "active",
              registrationDate:
                typeof c.created_at === "string"
                  ? new Date(c.created_at).toISOString().slice(0, 10)
                  : "",
              location: typeof c.company_branch === "string" ? c.company_branch : "",
              website: typeof c.company_website === "string" ? c.company_website : "",
              employeesCount: typeof c.employees_count === "number" ? c.employees_count : 0,
              description: typeof c.description === "string" ? c.description : "",
              contactEmail: typeof c.contact_email === "string" ? c.contact_email : "",
              contactPhone:
                (typeof c.country_code === "string" && c.country_code
                  ? "+" + c.country_code + " "
                  : "") +
                (typeof c.contact_number === "string" ? c.contact_number : ""),
              address: typeof c.exact_address === "string" ? c.exact_address : "",
              suite_unit_floor: typeof c.suite_unit_floor === "string" ? c.suite_unit_floor : "",
              business_park_landmark: typeof c.business_park_landmark === "string" ? c.business_park_landmark : "",
              building_name: typeof c.building_name === "string" ? c.building_name : "",
              verified: c.verify_status === "full",
              logoPath: typeof c.company_logo_image_path === "string" ? c.company_logo_image_path : undefined,
            }))
          )
        }
      })
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    if (selectedCompany && selectedCompany.name) {
      fetch(`/api/superadmin/fetchUsers?countEmployersByCompany=true`)
        .then(res => res.json())
        .then(res => {
          if (typeof res.count === "number") setEmployerCount(res.count)
        })
    }
  }, [selectedCompany])

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setMenuAnchors((prev) => ({ ...prev, [id]: event.currentTarget }))
  }

  const handleMenuClose = (id: number) => {
    setMenuAnchors((prev) => ({ ...prev, [id]: null }))
  }

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

  const confirmDeleteCompany = async () => {
    if (!selectedCompany) return
    await fetch("/api/superadmin/actions/deleteUsers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedCompany.companyId, table: "registered_companies" }),
    })
    setCompanies(companies.filter((company) => company.companyId !== selectedCompany.companyId))
    setIsDeleteDialogOpen(false)
  }

  const exportCompanies = () => {
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
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Company Management</h1>
          <p className="text-lg text-gray-600">View, export, and manage company records</p>
        </div>
        <Button
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 rounded-2xl px-6 py-3 font-semibold"
          onClick={exportCompanies}
        >
          <Download className="h-5 w-5" />
          <span>Export Companies</span>
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 pb-8">
            <CardTitle className="text-2xl font-bold text-gray-900">Company Records</CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Comprehensive list of all companies in the system
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mb-4" />
                <div className="text-lg font-semibold text-indigo-500 animate-pulse">Fetching companies...</div>
              </div>
            ) : (
              <>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-6">
                  <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <div className="relative w-full lg:w-96">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Search companies..."
                        className="pl-12 rounded-2xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200 h-12 text-base"
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
                          className="rounded-2xl bg-white"
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
                          className="rounded-2xl bg-white"
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

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                  <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-none lg:flex rounded-2xl bg-gray-100 p-1.5 h-auto">
                    <TabsTrigger
                      value="all"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 font-semibold"
                    >
                      All ({companies.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="active"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 font-semibold"
                    >
                      Active ({companies.filter((c) => c.status === "active").length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="inactive"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 font-semibold"
                    >
                      Inactive ({companies.filter((c) => c.status === "inactive").length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="suspended"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 font-semibold"
                    >
                      Suspended ({companies.filter((c) => c.status === "suspended").length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="pending"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 font-semibold"
                    >
                      Pending ({companies.filter((c) => c.status === "pending").length})
                    </TabsTrigger>
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
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={isViewDialogOpen} onClose={() => setIsViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Company Details</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Comprehensive information about the company.
          </Typography>
          {selectedCompany && (
            <div className="grid gap-6 py-4">
              <div className="flex items-start gap-4">
                <CompanyLogo logoPath={selectedCompany.logoPath} alt={selectedCompany.name} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">{selectedCompany.name}</h3>
                    <CompanyVerifyBadgeModal verified={selectedCompany.verified} />
                  </div>
                  <p className="text-muted-foreground">{selectedCompany.companyId}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={selectedCompany.status} />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Company Information</h4>
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
                        <strong>Phone:</strong>{" "}
                        {selectedCompany.country_code
                          ? `+${selectedCompany.country_code} `
                          : ""}
                        {selectedCompany.contact_number || selectedCompany.phone}
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
                        <strong>Size:</strong> {getSizeLabel(selectedCompany.size)}
                      </span>
                    </div>
                    {employerCount !== null && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>
                          <strong>Number of registered employers:</strong> {employerCount}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <strong>Registration Date:</strong> {selectedCompany.registrationDate}
                      </span>
                    </div>
                  </div>
                </div>
               
              </div>
              <div className="border-t border-gray-200 my-6" />
              <div>
                <h4 className="font-medium mb-2">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
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
                  </div>
                </div>
                <div className="mt-4">
                  <h5 className="font-medium mb-1 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    Address
                  </h5>
                  <div className="text-sm text-muted-foreground whitespace-pre-line space-y-1">
                    <div>
                      <span className="font-semibold">Exact Address: </span>
                      Montillano St, Muntinlupa City, 1780 Metro Manila
                    </div>
                    <div>
                      <span className="font-semibold">Landmark: </span>
                      Lianas Abandoned Cuh
                    </div>
                    <div>
                      <span className="font-semibold">Building Name: </span>
                      STI College
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
    <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="font-bold text-gray-700 py-4 px-6 text-left">Name</th>
            <th className="font-bold text-gray-700 py-4 px-6 text-left">Industry</th>
            <th className="font-bold text-gray-700 py-4 px-6 text-left">Location</th>
            <th className="font-bold text-gray-700 py-4 px-6 text-left">Status</th>
            <th className="font-bold text-gray-700 py-4 px-6 text-left">Verified</th>
            <th className="font-bold text-gray-700 py-4 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-16">
                <div className="flex flex-col items-center space-y-4">
                  <Building className="w-16 h-16 text-gray-300" />
                  <p className="text-gray-500 font-semibold text-lg">No companies found</p>
                  <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                </div>
              </td>
            </tr>
          ) : (
            companies.map((company, index) => (
              <motion.tr
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <td className="text-gray-700 py-4 px-6">{company.name}</td>
                <td className="text-gray-700 py-4 px-6">
                  {company.industry.charAt(0).toUpperCase() + company.industry.slice(1)}
                </td>
                <td className="text-gray-700 py-4 px-6">{company.location}</td>
                <td className="py-4 px-6">
                  <StatusBadge status={company.status} />
                </td>
                <td className="py-4 px-6">
                  <CompanyVerifyBadge verified={company.verified} />
                </td>
                <td className="text-right py-4 px-6">
                  <button
                    className="rounded-xl hover:bg-gray-100 p-2"
                    onClick={(e) => handleMenuOpen(e, company.id)}
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                  {menuAnchors[company.id] && (
                    <div
                      className="absolute z-50 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-200"
                      style={{
                        left: menuAnchors[company.id]?.getBoundingClientRect
                          ? menuAnchors[company.id]!.getBoundingClientRect().left
                          : 0,
                        top: menuAnchors[company.id]?.getBoundingClientRect
                          ? menuAnchors[company.id]!.getBoundingClientRect().bottom + window.scrollY
                          : 0,
                      }}
                      onMouseLeave={() => handleMenuClose(company.id)}
                    >
                      <button
                        className="flex items-center w-full px-4 py-3 hover:bg-gray-50 rounded-xl"
                        onClick={() => {
                          handleMenuClose(company.id)
                          onViewCompany(company)
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-3 hover:bg-gray-50 rounded-xl"
                        onClick={() => {
                          handleMenuClose(company.id)
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-3 hover:red-50 rounded-xl text-red-600"
                        onClick={() => {
                          handleMenuClose(company.id)
                          onDeleteCompany(company)
                        }}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === "active") {
    return (
      <Badge
        variant="outline"
        className={cn("rounded-full px-3 py-1 text-sm font-semibold bg-green-100 text-green-700 border-green-200")}
      >
        Active
      </Badge>
    )
  } else if (status === "inactive") {
    return (
      <Badge
        variant="outline"
        className={cn("rounded-full px-3 py-1 text-sm font-semibold bg-gray-100 text-gray-700 border-gray-200")}
      >
        Inactive
      </Badge>
    )
  } else if (status === "suspended") {
    return (
      <Badge
        variant="outline"
        className={cn("rounded-full px-3 py-1 text-sm font-semibold bg-red-100 text-red-700 border-red-200")}
      >
        Suspended
      </Badge>
    )
  } else if (status === "pending") {
    return (
      <Badge
        variant="outline"
        className={cn("rounded-full px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-700 border-blue-200")}
      >
        Pending
      </Badge>
    )
  }
  return null
}

function CompanyVerifyBadge({ verified }: { verified: boolean }) {
  if (verified) {
    return (
      <Badge
        variant="outline"
        className={cn(
          "rounded-full px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-700 border-blue-200 flex items-center gap-1"
        )}
      >
        <Tooltip title="Fully Verified" arrow>
          <span className="flex items-center cursor-pointer">
            <HiBadgeCheck className="inline-block mr-1 h-4 w-4" />
            Full
          </span>
        </Tooltip>
      </Badge>
    )
  } else {
    return (
      <Badge
        variant="outline"
        className={cn(
          "rounded-full px-3 py-1 text-sm font-semibold bg-orange-100 text-orange-700 border-orange-200 flex items-center gap-1"
        )}
      >
        <Tooltip title="Not Verified" arrow>
          <span className="flex items-center cursor-pointer">
            <PiWarningFill className="inline-block mr-1 h-4 w-4" />
            Basic
          </span>
        </Tooltip>
      </Badge>
    )
  }
}

function CompanyVerifyBadgeModal({ verified }: { verified: boolean }) {
  if (verified) {
    return (
      <Badge
        variant="outline"
        className={cn(
          "rounded-full px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-700 border-blue-200 flex items-center gap-1"
        )}
      >
        <Tooltip title="Fully Verified" arrow>
          <span className="flex items-center cursor-pointer">
            <HiBadgeCheck className="inline-block mr-1 h-4 w-4" />
            Fully Verified
          </span>
        </Tooltip>
      </Badge>
    )
  } else {
    return (
      <Badge
        variant="outline"
        className={cn(
          "rounded-full px-3 py-1 text-sm font-semibold bg-orange-100 text-orange-700 border-orange-200 flex items-center gap-1"
        )}
      >
        <Tooltip title="Not Verified" arrow>
          <span className="flex items-center cursor-pointer">
            <PiWarningFill className="inline-block mr-1 h-4 w-4" />
            Not Verified
          </span>
        </Tooltip>
      </Badge>
    )
  }
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

function CompanyLogo({ logoPath, alt }: { logoPath?: string; alt?: string }) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!logoPath) {
      setLogoUrl(null)
      setLoading(false)
      return
    }
    setLoading(true)
    fetch(`/api/employers/get-signed-url?bucket=company.logo&path=${encodeURIComponent(logoPath)}`)
      .then(res => res.json())
      .then(res => {
        if (res.signedUrl) setLogoUrl(res.signedUrl)
        else setLogoUrl(null)
      })
      .catch(() => setLogoUrl(null))
      .finally(() => setLoading(false))
  }, [logoPath])

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-full w-16 h-16">
        <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (logoUrl) {
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-full w-16 h-16 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoUrl} alt={alt || "Company Logo"} className="object-cover w-full h-full" />
      </div>
    )
  }
  return (
    <div className="flex items-center justify-center bg-gray-100 rounded-full w-16 h-16">
      <Building className="h-8 w-8 text-gray-400" />
    </div>
  )
}
