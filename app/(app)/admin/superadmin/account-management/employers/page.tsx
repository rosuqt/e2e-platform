"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Download,
  MoreHorizontal,
  Eye,
  Trash,
  Edit,
  User,
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
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { HiBadgeCheck } from "react-icons/hi"
import { LuBadgeCheck } from "react-icons/lu"
import { Tooltip } from "@mui/material"
import { EmployerDetailsModal } from "./components/employer-details"
import { PiWarningFill } from "react-icons/pi"

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
  location: string
  employeesCount: number
  description: string
  verify_status?: string
  job_title?: string
  company_branch?: string
  username?: string
  company_website?: string
  profile_img?: string
}

interface ApiEmployer {
  profile_img: string
  id: string
  first_name?: string
  middle_name?: string
  last_name?: string
  suffix?: string
  country_code?: string
  phone?: string
  email?: string
  company_email?: string
  company_name?: string
  company_branch?: string
  company_role?: string
  company_industry?: string
  verify_status?: string
  created_at?: string
  job_title?: string
  username?: string
  company_website?: string
}

function StatusBadge({ status }: { status: string }) {
  let label = ""
  let badgeClass = ""
  let icon = null
  let badgeContent = null

  if (status === "full") {
    label = "Full"
    badgeClass =
      "bg-blue-100 text-blue-700 border-blue-200 flex items-center gap-1"
    icon = <HiBadgeCheck className="inline-block mr-1 h-4 w-4" />
    badgeContent = (
      <Tooltip title="Fully Verified" arrow>
        <span className="flex items-center cursor-pointer">{icon}{label}</span>
      </Tooltip>
    )
  } else if (status === "basic") {
    label = "Basic"
    badgeClass =
      "bg-orange-100 text-orange-700 border-orange-200 flex items-center gap-1"
    icon = <PiWarningFill className="inline-block mr-1 h-4 w-4" />
    badgeContent = (
      <Tooltip title="Not Verified" arrow>
        <span className="flex items-center cursor-pointer">{icon}{label}</span>
      </Tooltip>
    )
  } else if (status === "standard") {
    label = "Standard"
    badgeClass =
      "bg-violet-100 text-violet-700 border-violet-200 flex items-center gap-1"
    icon = <LuBadgeCheck className="inline-block mr-1 h-4 w-4" />
    badgeContent = (
      <Tooltip title="Partially Verified" arrow>
        <span className="flex items-center cursor-pointer">{icon}{label}</span>
      </Tooltip>
    )
  } else if (status === "active") {
    label = "Active"
    badgeClass =
      "bg-green-100 text-green-700 border-green-200 flex items-center gap-1"
    badgeContent = <span className="flex items-center">{label}</span>
  } else if (status === "inactive") {
    label = "Inactive"
    badgeClass =
      "bg-gray-100 text-gray-700 border-gray-200 flex items-center gap-1"
    badgeContent = <span className="flex items-center">{label}</span>
  } else if (status === "suspended") {
    label = "Suspended"
    badgeClass =
      "bg-red-100 text-red-700 border-red-200 flex items-center gap-1"
    badgeContent = <span className="flex items-center">{label}</span>
  } else {
    label = status.charAt(0).toUpperCase() + status.slice(1)
    badgeClass =
      "bg-gray-100 text-gray-700 border-gray-200 flex items-center gap-1"
    badgeContent = <span className="flex items-center">{label}</span>
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-3 py-1 text-sm font-semibold",
        badgeClass
      )}
    >
      {badgeContent}
    </Badge>
  )
}

export default function EmployersManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null)
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all")
  const [selectedLocation, setSelectedLocation] = useState<string>("all")
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [menuEmployerId, setMenuEmployerId] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const pageSize = 7

  const [employers, setEmployers] = useState<Employer[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const statuses = ["active", "inactive", "suspended"]
    fetch("/api/superadmin/fetchUsers?employers=true")
      .then((res) => res.json())
      .then(async (res) => {
        if (Array.isArray(res.employers)) {
          setEmployers(
            res.employers.map((e: ApiEmployer, idx: number) => ({
              id: idx + 1,
              employerId: e.id,
              name: [e.first_name, e.middle_name, e.last_name, e.suffix].filter(Boolean).join(" "),
              email: e.email || e.company_email || "",
              phone: (e.country_code ? "+" + e.country_code + " " : "") + (e.phone || ""),
              company: e.company_name || "",
              position: e.company_role || "",
              status: statuses[idx % statuses.length] as "active" | "inactive" | "suspended",
              registrationDate: e.created_at ? new Date(e.created_at).toISOString().slice(0, 10) : "",
              industry: e.company_industry || "",
              location: e.company_branch || "",
              company_website: e.company_website || "",
              employeesCount: 0,
              description: "",
              verify_status: e.verify_status ?? "",
              job_title: e.job_title || "",
              company_branch: e.company_branch || "",
              username: e.username || "",
              profile_img: e.profile_img || "",
            })),
          )
        }
      })
      .finally(() => setIsLoading(false))
  }, [])

  const locations = Array.from(
    new Set(employers.map((employer) => employer.location).filter((v) => v && v !== ""))
  )

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

    const matchesLocation = selectedLocation === "all" || employer.location === selectedLocation

    return matchesSearch && matchesTab && matchesLocation
  })

  const pageCount = Math.ceil(filteredEmployers.length / pageSize)
  const paginatedEmployers = filteredEmployers.slice((page - 1) * pageSize, page * pageSize)

  const fetchCompanyDetails = async (employerId: string) => {
    const res = await fetch(`/api/superadmin/fetchUsers?employers=true&employerId=${employerId}`)
    const data = await res.json()
    return data.companies?.[0]
  }

  const handleViewEmployer = async (employer: Employer) => {
    const company = await fetchCompanyDetails(employer.employerId)
    setSelectedEmployer({
      ...employer,
      ...(company || {}),
      company_website: company?.company_website || employer.company_website || "",
      profile_img: employer.profile_img, 
    })
    setIsViewDialogOpen(true)
  }

  const handleDeleteEmployer = (employer: Employer) => {
    setSelectedEmployer(employer)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteEmployer = async () => {
    if (!selectedEmployer) return
    await fetch("/api/superadmin/actions/deleteUsers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedEmployer.employerId, table: "registered_employers" }),
    })
    setEmployers(employers.filter((employer) => employer.employerId !== selectedEmployer.employerId))
    setIsDeleteDialogOpen(false)
  }

  const exportEmployers = () => {
    const header = "Employer ID,Name,Email,Phone,Company,Position,Status,Industry,Location\n"
    const csv = filteredEmployers
      .map(
        (employer) =>
          `${employer.employerId},${employer.name},${employer.email},${employer.phone},${employer.company},${employer.position},${employer.status},${employer.location}`,
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
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Employer Management</h1>
          <p className="text-lg text-gray-600">View, export, and manage employer records</p>
        </div>
        <Button
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 rounded-2xl px-6 py-3 font-semibold"
          onClick={exportEmployers}
        >
          <Download className="h-5 w-5" />
          <span>Export Employers</span>
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 pb-8">
            <CardTitle className="text-2xl font-bold text-gray-900">Employer Records</CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Comprehensive list of all employers in the system
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mb-4" />
                <div className="text-lg font-semibold text-indigo-500 animate-pulse">Fetching users...</div>
              </div>
            ) : (
              <>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-6">
                  <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <div className="relative w-full lg:w-96">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Search employers..."
                        className="pl-12 rounded-2xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200 h-12 text-base"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                        <SelectTrigger className="w-[180px] rounded-2xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200 h-12">
                          <SelectValue placeholder="Industry" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="all">All Industries</SelectItem>
        
                        </SelectContent>
                      </Select>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger className="w-[150px] rounded-2xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200 h-12">
                          <SelectValue placeholder="Location" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="all">All Locations</SelectItem>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location || "-"}
                            >
                              {location || "-"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                  <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-none lg:flex rounded-2xl bg-gray-100 p-1.5 h-auto">
                    <TabsTrigger
                      value="all"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 font-semibold"
                    >
                      All ({employers.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="active"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 font-semibold"
                    >
                      Active ({employers.filter((e) => e.status === "active").length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="inactive"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 font-semibold"
                    >
                      Inactive ({employers.filter((e) => e.status === "inactive").length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="suspended"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 font-semibold"
                    >
                      Suspended ({employers.filter((e) => e.status === "suspended").length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="pending"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 font-semibold"
                    >
                      Pending ({employers.filter((e) => e.status === "pending").length})
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="mt-4">
                    <EmployersTable
                      employers={paginatedEmployers}
                      onViewEmployer={handleViewEmployer}
                      onDeleteEmployer={handleDeleteEmployer}
                      menuAnchorEl={menuAnchorEl}
                      setMenuAnchorEl={setMenuAnchorEl}
                      menuEmployerId={menuEmployerId}
                      setMenuEmployerId={setMenuEmployerId}
                    />
                  </TabsContent>
                  <TabsContent value="active" className="mt-4">
                    <EmployersTable
                      employers={paginatedEmployers}
                      onViewEmployer={handleViewEmployer}
                      onDeleteEmployer={handleDeleteEmployer}
                      menuAnchorEl={menuAnchorEl}
                      setMenuAnchorEl={setMenuAnchorEl}
                      menuEmployerId={menuEmployerId}
                      setMenuEmployerId={setMenuEmployerId}
                    />
                  </TabsContent>
                  <TabsContent value="inactive" className="mt-4">
                    <EmployersTable
                      employers={paginatedEmployers}
                      onViewEmployer={handleViewEmployer}
                      onDeleteEmployer={handleDeleteEmployer}
                      menuAnchorEl={menuAnchorEl}
                      setMenuAnchorEl={setMenuAnchorEl}
                      menuEmployerId={menuEmployerId}
                      setMenuEmployerId={setMenuEmployerId}
                    />
                  </TabsContent>
                  <TabsContent value="suspended" className="mt-4">
                    <EmployersTable
                      employers={paginatedEmployers}
                      onViewEmployer={handleViewEmployer}
                      onDeleteEmployer={handleDeleteEmployer}
                      menuAnchorEl={menuAnchorEl}
                      setMenuAnchorEl={setMenuAnchorEl}
                      menuEmployerId={menuEmployerId}
                      setMenuEmployerId={setMenuEmployerId}
                    />
                  </TabsContent>
                  <TabsContent value="pending" className="mt-4">
                    <EmployersTable
                      employers={paginatedEmployers}
                      onViewEmployer={handleViewEmployer}
                      onDeleteEmployer={handleDeleteEmployer}
                      menuAnchorEl={menuAnchorEl}
                      setMenuAnchorEl={setMenuAnchorEl}
                      menuEmployerId={menuEmployerId}
                      setMenuEmployerId={setMenuEmployerId}
                    />
                  </TabsContent>
                </Tabs>
                {pageCount > 1 && (
                  <div className="flex justify-end items-center gap-2 px-6 py-4 bg-white border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Prev
                    </Button>
                    <span className="mx-2 text-gray-600 text-sm">
                      Page {page} of {pageCount}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      disabled={page === pageCount}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <EmployerDetailsModal
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        employer={selectedEmployer}
        onEdit={() => {}}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Are you sure you want to delete this employer?</DialogTitle>
            <DialogDescription className="text-gray-600 text-base">
              This action cannot be undone. This will permanently delete the employer record and remove all associated data from the system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="rounded-xl px-6">
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteEmployer}
              className="rounded-xl px-6 bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function EmployersTable({
  employers,
  onViewEmployer,
  onDeleteEmployer,
  menuAnchorEl,
  setMenuAnchorEl,
  menuEmployerId,
  setMenuEmployerId,
}: {
  employers: (Employer & { verify_status?: string; profile_img?: string })[]
  onViewEmployer: (employer: Employer & { profile_img?: string }) => void
  onDeleteEmployer: (employer: Employer) => void
  menuAnchorEl: null | HTMLElement
  setMenuAnchorEl: (el: null | HTMLElement) => void
  menuEmployerId: number | null
  setMenuEmployerId: (id: number | null) => void
}) {
  const handleFetchCompany = async (employerId: string) => {
    const res = await fetch(`/api/superadmin/fetchUsers?employers=true&employerId=${employerId}`)
    const data = await res.json()
    return data.companies?.[0]
  }

  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {/* Avatar column removed */}
            <th className="font-bold text-gray-700 py-4 px-6 text-left">Name</th>
            <th className="font-bold text-gray-700 py-4 px-6 text-left">Email</th>
            <th className="font-bold text-gray-700 py-4 px-6 text-left">Company</th>
            <th className="font-bold text-gray-700 py-4 px-6 text-left">Position</th>
            <th className="font-bold text-gray-700 py-4 px-6 text-left">Verification</th>
            <th className="font-bold text-gray-700 py-4 px-6 text-left">Status</th>
            <th className="font-bold text-gray-700 py-4 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employers.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-16">
                <div className="flex flex-col items-center space-y-4">
                  <User className="w-16 h-16 text-gray-300" />
                  <p className="text-gray-500 font-semibold text-lg">No employers found</p>
                  <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                </div>
              </td>
            </tr>
          ) : (
            employers.map((employer, index) => (
              <motion.tr
                key={employer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                {/* Avatar cell removed */}
                <td className="text-gray-700 py-4 px-6">{employer.name}</td>
                <td className="text-gray-700 py-4 px-6">{employer.email}</td>
                <td className="text-gray-700 py-4 px-6">{employer.company.charAt(0).toUpperCase() + employer.company.slice(1)}</td>
                <td className="text-gray-700 py-4 px-6">{employer.position.charAt(0).toUpperCase() + employer.position.slice(1)}</td>
                <td className="py-4 px-6">
                  <StatusBadge status={employer.verify_status || ""} />
                </td>
                <td className="py-4 px-6">
                  <StatusBadge status={employer.status} />
                </td>
                <td className="text-right py-4 px-6">
                  <button
                    className="rounded-xl hover:bg-gray-100 p-2"
                    onClick={async (e) => {
                      setMenuAnchorEl(e.currentTarget)
                      setMenuEmployerId(employer.id)
                      await handleFetchCompany(employer.employerId)
                    }}
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                  {menuEmployerId === employer.id && menuAnchorEl && (
                    <div
                      className="absolute z-50 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-200"
                      style={{
                        left: menuAnchorEl.getBoundingClientRect().left,
                        top: menuAnchorEl.getBoundingClientRect().bottom + window.scrollY,
                      }}
                      onMouseLeave={() => {
                        setMenuAnchorEl(null)
                        setMenuEmployerId(null)
                      }}
                    >
                      <button
                        className="flex items-center w-full px-4 py-3 hover:bg-gray-50 rounded-xl"
                        onClick={() => {
                          setMenuAnchorEl(null)
                          setMenuEmployerId(null)
                          onViewEmployer(employer)
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-3 hover:bg-gray-50 rounded-xl"
                        onClick={() => {
                          setMenuAnchorEl(null)
                          setMenuEmployerId(null)
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-3 hover:red-50 rounded-xl text-red-600"
                        onClick={() => {
                          setMenuAnchorEl(null)
                          setMenuEmployerId(null)
                          onDeleteEmployer(employer)
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
