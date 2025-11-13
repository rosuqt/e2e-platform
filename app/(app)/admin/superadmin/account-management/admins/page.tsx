"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, Download, MoreHorizontal, Edit, Trash, Archive, Eye, User } from "lucide-react"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import toast from 'react-hot-toast'
import ExcelJS from "exceljs"

interface Coordinator {
  id: number
  username: string
  first_name: string
  middle_name: string
  last_name: string
  suffix?: string
  department: string
  status: "active" | "inactive" | "archived"
  created_at?: string
}

interface Admin {
  id: number
  username: string
  name: {
    first: string
    middle: string
    last: string
  }
  department: string
  status: "active" | "inactive" | "archived"
  createdAt: string
}

export default function AdminsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("active")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    department: "",
  })
  const [editFormData, setEditFormData] = useState({
    username: "",
    firstName: "",
    middleName: "",
    lastName: "",
    department: "",
    status: "",
  })
  const [adminList, setAdminList] = useState<Admin[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    department: "",
  })
  const [page, setPage] = useState(1)
  const pageSize = 7
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchAdmins() {
      setIsLoading(true)
      const res = await fetch("/api/superadmin/fetchUsers")
      setIsLoading(false)
      if (!res.ok) return
      const { coordinators } = await res.json()
      if (Array.isArray(coordinators)) {
        setAdminList(
          coordinators.map((c: Coordinator) => ({
            id: c.id,
            username: c.username,
            name: {
              first: c.first_name,
              middle: c.middle_name,
              last: c.last_name + (c.suffix && c.suffix !== "none" ? `, ${c.suffix}` : ""),
            },
            department: c.department,
            status: c.status,
            createdAt: c.created_at ? c.created_at.split("T")[0] : "",
          }))
        )
      }
    }
    fetchAdmins()
  }, [])

  const filteredAdmins = adminList.filter((admin) => {
    const search = searchQuery.trim().toLowerCase()
    const nameParts = [
      admin.name.first,
      admin.name.middle,
      admin.name.last,
      `${admin.name.first} ${admin.name.last}`,
      `${admin.name.first} ${admin.name.middle} ${admin.name.last}`,
      `${admin.name.last} ${admin.name.first}`,
    ].map(s => s.toLowerCase())
    const matchesSearch =
      admin.username.toLowerCase().includes(search) ||
      admin.department.toLowerCase().includes(search) ||
      nameParts.some(part => part.includes(search))

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && admin.status === "active") ||
      (activeTab === "inactive" && admin.status === "inactive") ||
      (activeTab === "archived" && admin.status === "archived")

    return matchesSearch && matchesTab
  })

  const pageCount = Math.ceil(filteredAdmins.length / pageSize)
  const paginatedAdmins = filteredAdmins.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    if (page > pageCount && pageCount > 0) setPage(pageCount)
  }, [pageCount])

  const handleViewAdmin = (admin: Admin) => {
    setSelectedAdmin(admin)
    setIsViewDialogOpen(true)
  }

  const handleEditAdmin = (admin: Admin) => {
    setSelectedAdmin(admin)
    setEditFormData({
      username: admin.username,
      firstName: admin.name.first,
      middleName: admin.name.middle,
      lastName: admin.name.last,
      department: admin.department,
      status: admin.status,
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteAdmin = (admin: Admin) => {
    setSelectedAdmin(admin)
    setIsDeleteDialogOpen(true)
  }

  const handleArchiveAdmin = async (admin: Admin) => {
    const isArchived = admin.status === "archived"
    const newStatus = isArchived ? "active" : "archived"
    await toast.promise(
      fetch("/api/superadmin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: admin.id, status: newStatus }),
      }).then(res => {
        if (!res.ok) throw new Error()
        setAdminList(list =>
          list.map(item =>
            item.id === admin.id ? { ...item, status: newStatus } : item
          )
        )
      }),
      {
        loading: isArchived ? "Unarchiving..." : "Archiving...",
        success: isArchived ? "Admin unarchived." : "Admin archived.",
        error: isArchived ? "Failed to unarchive admin." : "Failed to archive admin.",
      },
      { position: "bottom-right" }
    )
  }

  const handleCreateAdmin = async () => {
    const errors = {
      username: !formData.username ? "Username is required" : "",
      password: !formData.password ? "Password is required" : "",
      firstName: !formData.firstName ? "First Name is required" : "",
      lastName: !formData.lastName ? "Last Name is required" : "",
      department: !formData.department ? "Department is required" : "",
    }
    setFieldErrors(errors)
    if (Object.values(errors).some(Boolean)) {
      return
    }
    setIsCreating(true)
    try {
      const res = await fetch("/api/superadmin/create-new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          suffix: formData.suffix,
          department: formData.department,
        }),
      })
      if (!res.ok) {
        if (res.status === 409) {
          setFieldErrors(f => ({ ...f, username: "Username already exists" }))
        } else {
          const errorData = await res.json().catch(() => null)
          if (errorData && errorData.error && errorData.error.toLowerCase().includes("username already exists")) {
            setFieldErrors(f => ({ ...f, username: "Username already exists" }))
          } else {
            toast.error('Failed to create OJT Coordinator.', {
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
        setIsCreating(false)
        return
      }
      const { coordinator } = await res.json()
      let newId = coordinator.id
      if (adminList.some(a => a.id === newId)) {
        newId = Math.max(0, ...adminList.map(a => a.id)) + 1
      }
      const newAdmin: Admin = {
        id: newId,
        username: coordinator.username,
        name: {
          first: coordinator.first_name,
          middle: coordinator.middle_name,
          last: coordinator.last_name + (coordinator.suffix && coordinator.suffix !== "none" ? `, ${coordinator.suffix}` : ""),
        },
        department: coordinator.department,
        status: coordinator.status,
        createdAt: coordinator.created_at ? coordinator.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
      }
      setAdminList([...adminList, newAdmin])
      setFormData({
        username: "",
        password: "",
        firstName: "",
        middleName: "",
        lastName: "",
        suffix: "",
        department: "",
      })
      setIsCreateDialogOpen(false)
      toast.success('OJT Coordinator created successfully!', {
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
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdateAdmin = () => {
    if (
      !selectedAdmin ||
      !editFormData.username ||
      !editFormData.firstName ||
      !editFormData.lastName ||
      !editFormData.department
    ) {
      return
    }

    const updatedAdmins = adminList.map((admin) => {
      if (admin.id === selectedAdmin.id) {
        return {
          ...admin,
          username: editFormData.username,
          name: {
            first: editFormData.firstName,
            middle: editFormData.middleName,
            last: editFormData.lastName,
          },
          department: editFormData.department,
          status: (["active", "inactive", "archived"].includes(editFormData.status) ? editFormData.status : "active") as
            | "active"
            | "inactive"
            | "archived",
        }
      }
      return admin
    })

    setAdminList(updatedAdmins)
    setIsEditDialogOpen(false)
  }

  const confirmDeleteAdmin = () => {
    if (!selectedAdmin) return
    const updatedAdmins = adminList.filter((admin) => admin.id !== selectedAdmin.id)
    setAdminList(updatedAdmins)
    setIsDeleteDialogOpen(false)
  }

  const exportAdmins = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Admins")
    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Username", key: "username", width: 20 },
      { header: "First Name", key: "first", width: 20 },
      { header: "Middle Name", key: "middle", width: 20 },
      { header: "Last Name", key: "last", width: 20 },
      { header: "Department", key: "department", width: 25 },
      { header: "Status", key: "status", width: 15 },
      { header: "Created At", key: "createdAt", width: 18 },
    ]
    filteredAdmins.forEach((admin) => {
      worksheet.addRow({
        id: admin.id,
        username: admin.username,
        first: admin.name.first,
        middle: admin.name.middle,
        last: admin.name.last,
        department: admin.department,
        status: admin.status,
        createdAt: admin.createdAt,
      })
    })
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "ojt_coordinators.xlsx"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">OJT Coordinator Management</h1>
          <p className="text-lg text-gray-600">Manage administrator accounts and permissions across the platform.</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 rounded-2xl px-6 py-3 font-semibold">
              <Plus className="w-5 h-5" />
              <span>Create OJT Coordinator</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">Create New OJT Coordinator Account</DialogTitle>
              <DialogDescription className="text-gray-600">
                Fill in the details to create a new coordinator account.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-6">
              {/* Username */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right font-semibold text-gray-700">
                  Username
                  <span className="text-red-500 ml-0.5">*</span>
                </Label>
                <div className="col-span-3">
                  <Input
                    id="username"
                    className="rounded-xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                    value={formData.username}
                    onChange={(e) => {
                      setFormData({ ...formData, username: e.target.value })
                      setFieldErrors(f => ({ ...f, username: "" }))
                    }}
                  />
                  {fieldErrors.username && (
                    <div className="text-red-600 text-sm mt-1">{fieldErrors.username}</div>
                  )}
                </div>
              </div>
              {/* Password */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right font-semibold text-gray-700">
                  Password
                  <span className="text-red-500 ml-0.5">*</span>
                </Label>
                <div className="col-span-3">
                  <Input
                    id="password"
                    type="password"
                    className="rounded-xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value })
                      setFieldErrors(f => ({ ...f, password: "" }))
                    }}
                  />
                  {fieldErrors.password && (
                    <div className="text-red-600 text-sm mt-1">{fieldErrors.password}</div>
                  )}
                </div>
              </div>
    
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-semibold text-gray-700">
                  Name
                  <span className="text-red-500 ml-0.5">*</span>
                </Label>
                <div className="col-span-3 flex gap-2">
                  <div className="flex flex-col w-full">
                    <Input
                      placeholder="First Name"
                      className="rounded-xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                      value={formData.firstName}
                      onChange={(e) => {
                        setFormData({ ...formData, firstName: e.target.value })
                        setFieldErrors(f => ({ ...f, firstName: "" }))
                      }}
                    />
                    {fieldErrors.firstName && (
                      <div className="text-red-600 text-sm mt-1">{fieldErrors.firstName}</div>
                    )}
                  </div>
                  <Input
                    placeholder="Middle"
                    className="rounded-xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                    value={formData.middleName}
                    onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                  />
                  <div className="flex flex-col w-full">
                    <Input
                      placeholder="Last Name"
                      className="rounded-xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                      value={formData.lastName}
                      onChange={(e) => {
                        setFormData({ ...formData, lastName: e.target.value })
                        setFieldErrors(f => ({ ...f, lastName: "" }))
                      }}
                    />
                    {fieldErrors.lastName && (
                      <div className="text-red-600 text-sm mt-1">{fieldErrors.lastName}</div>
                    )}
                  </div>
                  <Select
                    value={formData.suffix}
                    onValueChange={(value) => setFormData({ ...formData, suffix: value })}
                  >
                    <SelectTrigger className="rounded-xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200 min-w-[80px]">
                      <SelectValue placeholder="Suffix" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="Jr.">Jr.</SelectItem>
                      <SelectItem value="Sr.">Sr.</SelectItem>
                      <SelectItem value="II">II</SelectItem>
                      <SelectItem value="III">III</SelectItem>
                      <SelectItem value="IV">IV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Department */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right font-semibold text-gray-700">
                  Department
                  <span className="text-red-500 ml-0.5">*</span>
                </Label>
                <div className="col-span-3">
                  <Select
                    onValueChange={(value) => {
                      setFormData({ ...formData, department: value })
                      setFieldErrors(f => ({ ...f, department: "" }))
                    }}
                    value={formData.department}
                  >
                    <SelectTrigger className="rounded-xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl max-h-60 overflow-y-auto">
                      <div className="px-3 py-1 text-xs font-semibold text-gray-500">College Courses</div>
                      <SelectItem value="BS- Information Technology">BS- Information Technology</SelectItem>
                      <SelectItem value="BS - Hospitality Management">BS - Hospitality Management</SelectItem>
                      <SelectItem value="BS - Business Administration">BS - Business Administration</SelectItem>
                      <SelectItem value="BS - Tourism Management">BS - Tourism Management</SelectItem>
                      <div className="px-3 py-1 text-xs font-semibold text-gray-500">SHS Strands</div>
                      <SelectItem value="ABM">ABM</SelectItem>
                      <SelectItem value="HUMSS">HUMSS</SelectItem>
                      <SelectItem value="IT Mobile app and Web Development">IT Mobile app and Web Development</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldErrors.department && (
                    <div className="text-red-600 text-sm mt-1">{fieldErrors.department}</div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="rounded-xl px-6">
                Cancel
              </Button>
              <Button
                onClick={handleCreateAdmin}
                className="rounded-xl px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={isCreating}
              >
                {isCreating ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Creating...
                  </span>
                ) : (
                  "Create OJT Coordinator"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Main Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 pb-8">
            <CardTitle className="text-2xl font-bold text-gray-900">OJT Coordinator Accounts</CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              View and manage all administrator accounts in the system
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-12 h  -12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mb-4" />
                <div className="text-lg font-semibold text-indigo-500 animate-pulse">Fetching users...</div>
              </div>
            ) : (
              <>
                {/* Search and Filter Bar */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-6">
                  <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <div className="relative w-full lg:w-96">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Search ojt coordinators..."
                        className="pl-12 rounded-2xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200 h-12 text-base"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" className="flex items-center space-x-2 rounded-2xl border-gray-200 h-12 px-6">
                      <Filter className="w-5 h-5" />
                      <span>Filter</span>
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2 nded-2xl border-gray-200 h-12 px-6"
                    onClick={exportAdmins}
                  >
                    <Download className="w-5 h-5" />
                    <span>Export</span>
                  </Button>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                  <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:flex rounded-2xl bg-gray-100 p-1.5 h-auto">
                    <TabsTrigger
                      value="all"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 font-semibold"
                    >
                      All ({adminList.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="active"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 font-semibold"
                    >
                      Active ({adminList.filter((a) => a.status === "active").length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="inactive"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 font-semibold"
                    >
                      Inactive ({adminList.filter((a) => a.status === "inactive").length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="archived"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 font-semibold"
                    >
                      Archived ({adminList.filter((a) => a.status === "archived").length})
                    </TabsTrigger>
                  </TabsList>

                  {/* Table */}
                  <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                          <TableHead className="font-bold text-gray-700 py-4 px-6">Username</TableHead>
                          <TableHead className="font-bold text-gray-700 py-4 px-6">Name</TableHead>
                          <TableHead className="font-bold text-gray-700 py-4 px-6">Department</TableHead>
                          <TableHead className="font-bold text-gray-700 py-4 px-6">Status</TableHead>
                          <TableHead className="font-bold text-gray-700 py-4 px-6">Created At</TableHead>
                          <TableHead className="font-bold text-gray-700 py-4 px-6 text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedAdmins.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-16">
                              <div className="flex flex-col items-center space-y-4">
                                <User className="w-16 h-16 text-gray-300" />
                                <p className="text-gray-500 font-semibold text-lg">No admin accounts found</p>
                                <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedAdmins.map((admin, index) => (
                            <motion.tr
                              key={admin.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              <TableCell className="font-semibold text-gray-900 py-4 px-6">{admin.username}</TableCell>
                              <TableCell className="text-gray-700 py-4 px-6">
                                {admin.name.first} {admin.name.last}
                              </TableCell>
                              <TableCell className="text-gray-700 py-4 px-6">{admin.department}</TableCell>
                              <TableCell className="py-4 px-6">
                                <StatusBadge status={admin.status} />
                              </TableCell>
                              <TableCell className="text-gray-600 py-4 px-6">{admin.createdAt}</TableCell>
                              <TableCell className="text-right py-4 px-6">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-gray-100">
                                      <MoreHorizontal className="w-5 h-5" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="rounded-2xl shadow-xl border-gray-200 w-48">
                                    <DropdownMenuItem onClick={() => handleViewAdmin(admin)} className="rounded-xl py-3">
                                      <Eye className="mr-3 w-4 h-4" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleEditAdmin(admin)} className="rounded-xl py-3">
                                      <Edit className="mr-3 w-4 h-4" />
                                      Edit Admin
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleArchiveAdmin(admin)} className="rounded-xl py-3">
                                      <Archive className="mr-3 w-4 h-4" />
                                      {admin.status === "archived" ? "Unarchive" : "Archive"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteAdmin(admin)}
                                      className="rounded-xl py-3 text-red-600 focus:text-red-600 focus:bg-red-50"
                                    >
                                      <Trash className="mr-3 w-4 h-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </motion.tr>
                          ))
                        )}
                      </TableBody>
                    </Table>
                    {/* Pagination Controls */}
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
                  </div>
                </Tabs>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">OJT Coordinator Details</DialogTitle>
            <DialogDescription className="text-gray-600">
              Detailed information about the admin account.
            </DialogDescription>
          </DialogHeader>
          {selectedAdmin && (
            <div className="grid gap-6 py-6">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-semibold text-gray-700">Username</Label>
                <div className="col-span-3 text-gray-900 font-medium">{selectedAdmin.username}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-semibold text-gray-700">Full Name</Label>
                <div className="col-span-3 text-gray-900 font-medium">
                  {selectedAdmin.name.first} {selectedAdmin.name.middle} {selectedAdmin.name.last}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-semibold text-gray-700">Department</Label>
                <div className="col-span-3 text-gray-900 font-medium">{selectedAdmin.department}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-semibold text-gray-700">Status</Label>
                <div className="col-span-3">
                  <StatusBadge status={selectedAdmin.status} />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-semibold text-gray-700">Created At</Label>
                <div className="col-span-3 text-gray-900 font-medium">{selectedAdmin.createdAt}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} className="rounded-xl px-6">
              Close
            </Button>
            <Button
              onClick={() => {
                setIsViewDialogOpen(false)
                if (selectedAdmin) {
                  handleEditAdmin(selectedAdmin)
                }
              }}
              className="rounded-xl px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Edit Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Edit Admin Account</DialogTitle>
            <DialogDescription className="text-gray-600">
              Update the details of this administrator account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-username" className="text-right font-semibold text-gray-700">
                Username*
              </Label>
              <Input
                id="edit-username"
                className="col-span-3 rounded-xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                value={editFormData.username}
                onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-firstName" className="text-right font-semibold text-gray-700">
                First Name*
              </Label>
              <Input
                id="edit-firstName"
                className="col-span-3 rounded-xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                value={editFormData.firstName}
                onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-middleName" className="text-right font-semibold text-gray-700">
                Middle Name
              </Label>
              <Input
                id="edit-middleName"
                className="col-span-3 rounded-xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                value={editFormData.middleName}
                onChange={(e) => setEditFormData({ ...editFormData, middleName: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-lastName" className="text-right font-semibold text-gray-700">
                Last Name*
              </Label>
              <Input
                id="edit-lastName"
                className="col-span-3 rounded-xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                value={editFormData.lastName}
                onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-department" className="text-right font-semibold text-gray-700">
                Department*
              </Label>
              <Select
                onValueChange={(value) => setEditFormData({ ...editFormData, department: value })}
                value={editFormData.department}
              >
                <SelectTrigger className="col-span-3 rounded-xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="rounded-xl max-h-60 overflow-y-auto">
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500">College Courses</div>
                  <SelectItem value="BS- Information Technology">BS- Information Technology</SelectItem>
                  <SelectItem value="BS - Hospitality Management">BS - Hospitality Management</SelectItem>
                  <SelectItem value="BS - Business Administration">BS - Business Administration</SelectItem>
                  <SelectItem value="BS - Tourism Management">BS - Tourism Management</SelectItem>
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500">SHS Strands</div>
                  <SelectItem value="ABM">ABM</SelectItem>
                  <SelectItem value="HUMSS">HUMSS</SelectItem>
                  <SelectItem value="IT Mobile app and Web Development">IT Mobile app and Web Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right font-semibold text-gray-700">
                Status*
              </Label>
              <Select
                onValueChange={(value) => setEditFormData({ ...editFormData, status: value })}
                value={editFormData.status}
              >
                <SelectTrigger className="col-span-3 rounded-xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl px-6">
              Cancel
            </Button>
            <Button
              onClick={handleUpdateAdmin}
              className="rounded-xl px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Update Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-gray-900">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-base">
              This action cannot be undone. This will permanently delete the admin account and remove all associated
              data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl px-6">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAdmin}
              className="rounded-xl px-6 bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const variants = {
    active: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    inactive: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100",
    archived: "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100",
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-3 py-1 text-sm font-semibold",
        variants[status as keyof typeof variants] || variants.active,
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}
