"use client"

import { useState, useEffect } from "react"
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
  DollarSign,
  MapPin,
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
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import { Tooltip } from "@mui/material"

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
  salaryRange?: string // add this
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
    location: "STI College Alabang",
    type: "full-time",
    description: "",
    requirements: [],
    responsibilities: [],
  })
  const [opportunities, setOpportunities] = useState<CareerOpportunity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  async function fetchOpportunities() {
    setIsLoading(true)
    const res = await fetch("/api/superadmin/careers/fetch")
    setIsLoading(false)
    if (!res.ok) return
    const { data } = await res.json()
    if (Array.isArray(data)) {
      setOpportunities(
        data.map((item: Record<string, unknown>, idx: number): CareerOpportunity => ({
          id: idx + 1,
          title: typeof item.position_title === "string" ? item.position_title : "",
          department: typeof item.department === "string" ? item.department : "",
          location: typeof item.campus === "string" ? item.campus : "STI College Alabang",
          type: (item.employment_type as CareerOpportunity["type"]) || "full-time",
          status: "active",
          postedAt: typeof item.posted_date === "string" ? new Date(item.posted_date).toISOString().split("T")[0] : "",
          closingDate: "",
          applicants: 0,
          description: typeof item.job_description === "string" ? item.job_description : "",
          requirements: Array.isArray(item.requirements) ? item.requirements as string[] : [],
          responsibilities: Array.isArray(item.responsibilities) ? item.responsibilities as string[] : [],
          salaryRange: typeof item.salary_range === "string" ? item.salary_range : undefined,
        }))
      )
    }
  }

  useEffect(() => {
    fetchOpportunities()
  }, [])

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
      location: "STI College Alabang",
      type: opportunity.type,
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

  async function handleCreateOpportunity(e: React.FormEvent) {
    e.preventDefault()
    setIsCreating(true)
    const payload = {
      title: newOpportunity.title,
      department: newOpportunity.department,
      type: newOpportunity.type,
      description: newOpportunity.description,
      requirements: newOpportunity.requirements,
      responsibilities: newOpportunity.responsibilities,
    }
    const res = await fetch("/api/superadmin/careers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    setIsCreating(false)
    if (res.ok) {
      setIsCreateDialogOpen(false)
      setNewOpportunity({
        title: "",
        department: "",
        location: "STI College Alabang",
        type: "full-time",
        description: "",
        requirements: [],
        responsibilities: [], 
      })
      toast.success('Career opportunity created successfully!', {
        position: 'bottom-right',
        duration: 5000,
        style: {
          border: '1px solid #2563eb',
          padding: '16px',
          color: '#2563eb',
        },
        iconTheme: {
          primary: '#2563eb',
          secondary: '#EFF6FF',
        },
      })
      fetchOpportunities()
    } else {
      toast.error('Failed to create career opportunity.', {
        position: 'bottom-right',
        duration: 5000,
        style: {
          border: '1px solid #dc2626',
          padding: '16px',
          color: '#dc2626',
        },
        iconTheme: {
          primary: '#dc2626',
          secondary: '#FEF2F2',
        },
      })
    }
  }

  async function handleEditOpportunitySubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedOpportunity) return
    setIsUpdating(true)
    const payload = {
      id: selectedOpportunity.id,
      title: newOpportunity.title,
      department: newOpportunity.department,
      type: newOpportunity.type,
      description: newOpportunity.description,
      requirements: newOpportunity.requirements,
      responsibilities: newOpportunity.responsibilities,
    }
    const res = await fetch("/api/superadmin/careers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    setIsUpdating(false)
    if (res.ok) {
      setIsEditDialogOpen(false)
      toast.success('Career opportunity updated successfully!', {
        position: 'bottom-right',
        duration: 5000,
        style: {
          border: '1px solid #2563eb',
          padding: '16px',
          color: '#2563eb',
        },
        iconTheme: {
          primary: '#2563eb',
          secondary: '#EFF6FF',
        },
      })
      fetchOpportunities()
    } else {
      toast.error('Failed to update career opportunity.', {
        position: 'bottom-right',
        duration: 5000,
        style: {
          border: '1px solid #dc2626',
          padding: '16px',
          color: '#dc2626',
        },
        iconTheme: {
          primary: '#dc2626',
          secondary: '#FEF2F2',
        },
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Career Opportunities</h2>
          <p className="text-lg text-gray-600">Manage job listings and career opportunities</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 rounded-2xl px-6 py-3 font-semibold"
            >
              <Plus className="h-4 w-4" />
              Create Opportunity
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[650px]">
            <form onSubmit={handleCreateOpportunity}>
              <DialogHeader>
                <DialogTitle>Create New Career Opportunity</DialogTitle>
                <DialogDescription>Fill in the details to create a new job listing.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Job Title & Job Type side by side */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Job Title
                  </Label>
                  <Input
                    id="title"
                    className="col-span-1"
                    value={newOpportunity.title}
                    onChange={(e) => setNewOpportunity({ ...newOpportunity, title: e.target.value })}
                  />
                  <Label htmlFor="type" className="text-right">
                    Job Type
                  </Label>
                  <Select
                    value={newOpportunity.type}
                    onValueChange={(value: "full-time" | "part-time" | "contract" | "internship") =>
                      setNewOpportunity({ ...newOpportunity, type: value })
                    }
                  >
                    <SelectTrigger className="col-span-1">
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
                {/* Department only */}
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
                {/* Location (read-only, uneditable) with tooltip */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Tooltip title="Location is fixed to STI College Alabang for all opportunities" arrow placement="right">
                    <span className="col-span-3">
                      <Input
                        id="location"
                        value="STI College Alabang"
                        readOnly
                        disabled
                        className="w-full cursor-not-allowed bg-gray-100"
                      />
                    </span>
                  </Tooltip>
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
                    placeholder="Enter each requirement separated by comma"
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
                    placeholder="Enter each responsibility separated by comma"
                    value={newOpportunity.responsibilities?.join("\n")}
                    onChange={(e) => handleResponsibilitiesChange(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} type="button">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl px-6 py-2 font-semibold flex items-center justify-center"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Creating...
                    </span>
                  ) : (
                    "Create Opportunity"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 pb-8">
            <CardTitle className="text-2xl font-bold text-gray-900">Job Listings</CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              View and manage all career opportunities in the system
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mb-4" />
                <div className="text-lg font-semibold text-indigo-500 animate-pulse">Fetching opportunities...</div>
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                  <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-80">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Search opportunities..."
                        className="pl-12 rounded-2xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200 h-12 text-base"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 rounded-2xl border-gray-200 h-12 text-base"
                    >
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </div>
                <Tabs defaultValue="active" onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4 md:w-auto md:grid-cols-none md:flex rounded-2xl bg-gray-100 p-1.5 h-auto">
                    <TabsTrigger
                      value="all"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 font-semibold"
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger
                      value="active"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 font-semibold"
                    >
                      Active
                    </TabsTrigger>
                    <TabsTrigger
                      value="closed"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 font-semibold"
                    >
                      Closed
                    </TabsTrigger>
                    <TabsTrigger
                      value="draft"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 font-semibold"
                    >
                      Draft
                    </TabsTrigger>
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
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

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
                    {selectedOpportunity.salaryRange && (
                      <>
                        <span className="mx-1">•</span>
                        <DollarSign className="h-4 w-4" />
                        <span>
                          {(() => {
                            const [min, max] = selectedOpportunity.salaryRange.split(",").map(s => s.trim())
                            if (min && max) return `₱${min} - ₱${max}`
                            if (min) return `₱${min}`
                            return ""
                          })()}
                        </span>
                      </>
                    )}
                    <span className="mx-1">•</span>
                    <MapPin className="h-4 w-4" />
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Requirements</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {(
                      Array.isArray(selectedOpportunity.requirements)
                        ? selectedOpportunity.requirements.flatMap((req: string) =>
                            typeof req === "string" ? req.split(",") : []
                          )
                        : typeof selectedOpportunity.requirements === "string"
                          ? (selectedOpportunity.requirements as string).split(",")
                          : []
                    ).map((req: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {req.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Responsibilities</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {(
                      Array.isArray(selectedOpportunity.responsibilities)
                        ? selectedOpportunity.responsibilities.flatMap((resp: string) =>
                            typeof resp === "string" ? resp.split(",") : []
                          )
                        : typeof selectedOpportunity.responsibilities === "string"
                          ? (selectedOpportunity.responsibilities as string).split(",")
                          : []
                    ).map((resp: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {resp.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl px-6 py-2 font-semibold"
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
          <form onSubmit={handleEditOpportunitySubmit}>
            <DialogHeader>
              <DialogTitle>Edit Career Opportunity</DialogTitle>
              <DialogDescription>Update the details of this job listing.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Job Title & Job Type side by side */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">
                  Job Title
                </Label>
                <Input
                  id="edit-title"
                  className="col-span-1"
                  value={newOpportunity.title}
                  onChange={(e) => setNewOpportunity({ ...newOpportunity, title: e.target.value })}
                />
                <Label htmlFor="edit-type" className="text-right">
                  Job Type
                </Label>
                <Select
                  value={newOpportunity.type}
                  onValueChange={(value: "full-time" | "part-time" | "contract" | "internship") =>
                    setNewOpportunity({ ...newOpportunity, type: value })
                  }
                >
                  <SelectTrigger id="edit-type" className="col-span-1">
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
              {/* Department only */}
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
              {/* Location (read-only, uneditable) with tooltip */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-location" className="text-right">
                  Location
                </Label>
                <Tooltip title="Location is fixed to STI College Alabang for all opportunities" arrow placement="right">
                  <span className="col-span-3">
                    <Input
                      id="edit-location"
                      value="STI College Alabang"
                      readOnly
                      disabled
                      className="w-full cursor-not-allowed bg-gray-100"
                    />
                  </span>
                </Tooltip>
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
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} type="button">
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl px-6 py-2 font-semibold flex items-center justify-center"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Updating...
                  </span>
                ) : (
                  "Update Opportunity"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
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
  const [anchorEls, setAnchorEls] = useState<{ [key: number]: HTMLElement | null }>({})

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setAnchorEls((prev) => ({ ...prev, [id]: event.currentTarget }))
  }

  const handleMenuClose = (id: number) => {
    setAnchorEls((prev) => ({ ...prev, [id]: null }))
  }

  return (
    <MuiTableContainer component={MuiPaper} className="rounded-2xl border shadow-none bg-white">
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
              <MuiTableCell colSpan={8} align="center" className="py-16 text-muted-foreground">
                <div className="flex flex-col items-center space-y-4">
                  <Briefcase className="w-16 h-16 text-gray-300" />
                  <p className="text-gray-500 font-semibold text-lg">No career opportunities found</p>
                  <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                </div>
              </MuiTableCell>
            </MuiTableRow>
          ) : (
            opportunities.map((opportunity, index) => (
              <motion.tr
                key={opportunity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
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
              </motion.tr>
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
      <Badge
        variant="outline"
        className={cn("rounded-full px-3 py-1 text-sm font-semibold bg-green-100 text-green-700 border-green-200 flex items-center gap-1")}
      >
        <CheckCircle className="h-3 w-3" />
        Active
      </Badge>
    )
  } else if (status === "closed") {
    return (
      <Badge
        variant="outline"
        className={cn("rounded-full px-3 py-1 text-sm font-semibold bg-gray-100 text-gray-700 border-gray-200 flex items-center gap-1")}
      >
        <XCircle className="h-3 w-3" />
        Closed
      </Badge>
    )
  } else if (status === "draft") {
    return (
      <Badge
        variant="outline"
        className={cn("rounded-full px-3 py-1 text-sm font-semibold bg-yellow-100 text-yellow-700 border-yellow-200 flex items-center gap-1")}
      >
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
