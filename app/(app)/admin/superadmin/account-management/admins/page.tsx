"use client"

import React, { useState } from "react"

import { Plus, Search, Filter, Download, MoreHorizontal, Edit, Trash, Archive, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog as UIDialog,
  DialogContent as UIDialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle as UIDialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import IconButton from "@mui/material/IconButton"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Typography from "@mui/material/Typography"


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
  const [adminList, setAdminList] = useState<Admin[]>([
    {
      id: 1,
      username: "johndoe",
      name: {
        first: "John",
        middle: "A",
        last: "Doe",
      },
      department: "IT",
      status: "active",
      createdAt: "2023-01-15",
    },
    {
      id: 2,
      username: "janesmith",
      name: {
        first: "Jane",
        middle: "B",
        last: "Smith",
      },
      department: "HR",
      status: "active",
      createdAt: "2023-02-20",
    },
    {
      id: 3,
      username: "mikebrown",
      name: {
        first: "Mike",
        middle: "C",
        last: "Brown",
      },
      department: "Marketing",
      status: "inactive",
      createdAt: "2023-03-10",
    },
    {
      id: 4,
      username: "sarahjones",
      name: {
        first: "Sarah",
        middle: "D",
        last: "Jones",
      },
      department: "Finance",
      status: "archived",
      createdAt: "2023-04-05",
    },
    {
      id: 5,
      username: "robertwilson",
      name: {
        first: "Robert",
        middle: "E",
        last: "Wilson",
      },
      department: "IT",
      status: "active",
      createdAt: "2023-05-12",
    },
  ])

  const filteredAdmins = adminList.filter((admin) => {
    const matchesSearch =
      admin.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.name.first.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.name.last.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.department.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && admin.status === "active") ||
      (activeTab === "inactive" && admin.status === "inactive") ||
      (activeTab === "archived" && admin.status === "archived")

    return matchesSearch && matchesTab
  })

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

  const handleArchiveAdmin = (admin: Admin) => {
    const updatedAdmins = adminList.map((item) => {
      if (item.id === admin.id) {
        return {
          ...item,
          status: item.status === "archived" ? "active" : "archived" as "active" | "archived",
        }
      }
      return item
    })
    setAdminList(updatedAdmins)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData({
      ...formData,
      [id]: value,
    })
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setEditFormData({
      ...editFormData,
      [id]: value,
    })
  }

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      department: value,
    })
  }

  const handleEditSelectChange = (field: string, value: string) => {
    setEditFormData({
      ...editFormData,
      [field]: value,
    })
  }

  const handleCreateAdmin = () => {
    if (!formData.username || !formData.password || !formData.firstName || !formData.lastName || !formData.department) {
      alert("Please fill in all required fields")
      return
    }

    const newAdmin: Admin = {
      id: adminList.length > 0 ? Math.max(...adminList.map((admin) => admin.id)) + 1 : 1,
      username: formData.username,
      name: {
        first: formData.firstName,
        middle: formData.middleName,
        last: formData.lastName,
      },
      department: formData.department,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    }

    setAdminList([...adminList, newAdmin])

    setFormData({
      username: "",
      password: "",
      firstName: "",
      middleName: "",
      lastName: "",
      department: "",
    })
    setIsCreateDialogOpen(false)

    alert("Admin created successfully!")
  }

  const handleUpdateAdmin = () => {
    if (!selectedAdmin) return

    
    if (!editFormData.username || !editFormData.firstName || !editFormData.lastName || !editFormData.department) {
      alert("Please fill in all required fields")
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
          status: (["active", "inactive", "archived"].includes(editFormData.status)
            ? editFormData.status
            : "active") as "active" | "inactive" | "archived",
        }
      }
      return admin
    })

    setAdminList(updatedAdmins)
    setIsEditDialogOpen(false)
    alert("Admin updated successfully!")
  }

  const confirmDeleteAdmin = () => {
    if (!selectedAdmin) return

    const updatedAdmins = adminList.filter((admin) => admin.id !== selectedAdmin.id)
    setAdminList(updatedAdmins)
    setIsDeleteDialogOpen(false)
    alert("Admin deleted successfully!")
  }

  const exportAdmins = () => {

    const headers = "ID,Username,First Name,Middle Name,Last Name,Department,Status,Created At\n"
    const csvContent = filteredAdmins
      .map(
        (admin) =>
          `${admin.id},${admin.username},${admin.name.first},${admin.name.middle},${admin.name.last},${admin.department},${admin.status},${admin.createdAt}`,
      )
      .join("\n")

    const blob = new Blob([headers + csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "admins.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Management</h2>
          <p className="text-muted-foreground">Manage administrator accounts and permissions</p>
        </div>
        <div className="mt-4 md:mt-0">
          <UIDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="flex items-center gap-2"
                onClick={() => {
                  setIsCreateDialogOpen(true)
                  setFormData({
                    username: "",
                    password: "",
                    firstName: "",
                    middleName: "",
                    lastName: "",
                    department: "",
                  })
                }}
              >
                <Plus className="h-4 w-4" />
                Create Admin
              </Button>
            </DialogTrigger>
            <UIDialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <UIDialogTitle>Create New Admin Account</UIDialogTitle>
                <DialogDescription>Fill in the details to create a new administrator account.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username*
                  </Label>
                  <Input id="username" className="col-span-3" value={formData.username} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password*
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    className="col-span-3"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="firstName" className="text-right">
                    First Name*
                  </Label>
                  <Input
                    id="firstName"
                    className="col-span-3"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="middleName" className="text-right">
                    Middle Name
                  </Label>
                  <Input
                    id="middleName"
                    className="col-span-3"
                    value={formData.middleName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lastName" className="text-right">
                    Last Name*
                  </Label>
                  <Input id="lastName" className="col-span-3" value={formData.lastName} onChange={handleInputChange} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">
                    Department*
                  </Label>
                  <Select onValueChange={handleSelectChange} value={formData.department}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleCreateAdmin}>
                  Create Admin
                </Button>
              </DialogFooter>
            </UIDialogContent>
          </UIDialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Admin Accounts</CardTitle>
          <CardDescription>View and manage all administrator accounts in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search admins..."
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
            <div className="flex items-center gap-2">
              <Button variant="outline" className="flex items-center gap-2" onClick={exportAdmins}>
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <Tabs defaultValue="active" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <AdminsTable
                admins={filteredAdmins}
                onViewAdmin={handleViewAdmin}
                onEditAdmin={handleEditAdmin}
                onDeleteAdmin={handleDeleteAdmin}
                onArchiveAdmin={handleArchiveAdmin}
              />
            </TabsContent>
            <TabsContent value="active" className="mt-4">
              <AdminsTable
                admins={filteredAdmins}
                onViewAdmin={handleViewAdmin}
                onEditAdmin={handleEditAdmin}
                onDeleteAdmin={handleDeleteAdmin}
                onArchiveAdmin={handleArchiveAdmin}
              />
            </TabsContent>
            <TabsContent value="inactive" className="mt-4">
              <AdminsTable
                admins={filteredAdmins}
                onViewAdmin={handleViewAdmin}
                onEditAdmin={handleEditAdmin}
                onDeleteAdmin={handleDeleteAdmin}
                onArchiveAdmin={handleArchiveAdmin}
              />
            </TabsContent>
            <TabsContent value="archived" className="mt-4">
              <AdminsTable
                admins={filteredAdmins}
                onViewAdmin={handleViewAdmin}
                onEditAdmin={handleEditAdmin}
                onDeleteAdmin={handleDeleteAdmin}
                onArchiveAdmin={handleArchiveAdmin}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Admin Dialog */}
      <UIDialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <UIDialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <UIDialogTitle>Admin Details</UIDialogTitle>
            <DialogDescription>Detailed information about the admin account.</DialogDescription>
          </DialogHeader>
          {selectedAdmin && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Username</Label>
                <div className="col-span-3">{selectedAdmin.username}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Full Name</Label>
                <div className="col-span-3">
                  {selectedAdmin.name.first} {selectedAdmin.name.middle} {selectedAdmin.name.last}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Department</Label>
                <div className="col-span-3">{selectedAdmin.department}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Status</Label>
                <div className="col-span-3">
                  <StatusBadge status={selectedAdmin.status} />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Created At</Label>
                <div className="col-span-3">{selectedAdmin.createdAt}</div>
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
                if (selectedAdmin) {
                  handleEditAdmin(selectedAdmin)
                }
              }}
            >
              Edit Admin
            </Button>
          </DialogFooter>
        </UIDialogContent>
      </UIDialog>

      {/* Edit Admin Dialog */}
      <UIDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <UIDialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <UIDialogTitle>Edit Admin Account</UIDialogTitle>
            <DialogDescription>Update the details of this administrator account.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-username" className="text-right">
                Username*
              </Label>
              <Input
                id="username"
                className="col-span-3"
                value={editFormData.username}
                onChange={handleEditInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-firstName" className="text-right">
                First Name*
              </Label>
              <Input
                id="firstName"
                className="col-span-3"
                value={editFormData.firstName}
                onChange={handleEditInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-middleName" className="text-right">
                Middle Name
              </Label>
              <Input
                id="middleName"
                className="col-span-3"
                value={editFormData.middleName}
                onChange={handleEditInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-lastName" className="text-right">
                Last Name*
              </Label>
              <Input
                id="lastName"
                className="col-span-3"
                value={editFormData.lastName}
                onChange={handleEditInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-department" className="text-right">
                Department*
              </Label>
              <Select
                onValueChange={(value) => handleEditSelectChange("department", value)}
                value={editFormData.department}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status*
              </Label>
              <Select onValueChange={(value) => handleEditSelectChange("status", value)} value={editFormData.status}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleUpdateAdmin}>
              Update Admin
            </Button>
          </DialogFooter>
        </UIDialogContent>
      </UIDialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Are you sure you want to delete this admin?</DialogTitle>
        <DialogContent>
          <Typography>
            This action cannot be undone. This will permanently delete the admin account and remove all associated data.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)} >
            Cancel
          </Button>
          <Button onClick={confirmDeleteAdmin} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

function AdminsTable({
  admins,
  onViewAdmin,
  onEditAdmin,
  onDeleteAdmin,
  onArchiveAdmin,
}: {
  admins: Admin[]
  onViewAdmin: (admin: Admin) => void
  onEditAdmin: (admin: Admin) => void
  onDeleteAdmin: (admin: Admin) => void
  onArchiveAdmin: (admin: Admin) => void
}) {
  const [anchorEls, setAnchorEls] = React.useState<{ [key: number]: HTMLElement | null }>({})

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setAnchorEls((prev) => ({ ...prev, [id]: event.currentTarget }))
  }

  const handleMenuClose = (id: number) => {
    setAnchorEls((prev) => ({ ...prev, [id]: null }))
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {admins.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" style={{ padding: "2rem", color: "#888" }}>
                No admin accounts found
              </TableCell>
            </TableRow>
          ) : (
            admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell style={{ fontWeight: 500 }}>{admin.username}</TableCell>
                <TableCell>
                  {admin.name.first} {admin.name.last}
                </TableCell>
                <TableCell>{admin.department}</TableCell>
                <TableCell>
                  <StatusBadge status={admin.status} />
                </TableCell>
                <TableCell>{admin.createdAt}</TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="more"
                    aria-controls={`admin-menu-${admin.id}`}
                    aria-haspopup="true"
                    onClick={(e) => handleMenuOpen(e, admin.id)}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </IconButton>
                  <Menu
                    id={`admin-menu-${admin.id}`}
                    anchorEl={anchorEls[admin.id] || null}
                    open={Boolean(anchorEls[admin.id])}
                    onClose={() => handleMenuClose(admin.id)}
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
                        handleMenuClose(admin.id)
                        onViewAdmin(admin)
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose(admin.id)
                        onEditAdmin(admin)
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </MenuItem>
                    {admin.status !== "archived" ? (
                      <MenuItem
                        onClick={() => {
                          handleMenuClose(admin.id)
                          onArchiveAdmin(admin)
                        }}
                      >
                        <Archive className="mr-2 h-4 w-4" />
                        Archive
                      </MenuItem>
                    ) : (
                      <MenuItem
                        onClick={() => {
                          handleMenuClose(admin.id)
                          onArchiveAdmin(admin)
                        }}
                      >
                        <Archive className="mr-2 h-4 w-4" />
                        Unarchive
                      </MenuItem>
                    )}
                    <MenuItem
                      onClick={() => {
                        handleMenuClose(admin.id)
                        onDeleteAdmin(admin)
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
  } else if (status === "archived") {
    return <Badge variant="secondary">Archived</Badge>
  }
  return null
}
