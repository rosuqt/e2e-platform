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
  GraduationCap,
  Calendar,
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
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import MuiAvatar from "@mui/material/Avatar"
import MuiDialog from "@mui/material/Dialog"
import MuiDialogTitle from "@mui/material/DialogTitle"
import MuiDialogContent from "@mui/material/DialogContent"
import MuiDialogContentText from "@mui/material/DialogContentText"
import MuiDialogActions from "@mui/material/DialogActions"
import MuiButton from "@mui/material/Button"
import MuiMenu from "@mui/material/Menu"
import MuiMenuItem from "@mui/material/MenuItem"
import MuiIconButton from "@mui/material/IconButton"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Student {
  id: string 
  studentId: string
  name: string
  email: string
  phone: string
  course: string
  year: string
  section: string
  status: "active" | "inactive" | "graduated" | "on_leave"
  enrollmentDate: string
  gender: string
  address: string
  dateOfBirth: string
  department: string
}

export default function StudentsManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("active")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [page, setPage] = useState(1)
  const pageSize = 7
  const [students, setStudents] = useState<Student[]>([])
  const [profileImgUrl, setProfileImgUrl] = useState<string | null>(null)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [personalEmail, setPersonalEmail] = useState<string>("")
  const [personalPhone, setPersonalPhone] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchStudents() {
      setIsLoading(true)
      const res = await fetch("/api/superadmin/fetchUsers?students=1", { method: "GET" })
      setIsLoading(false)
      if (!res.ok) return
      const { students: apiStudents } = await res.json()
      console.log("Frontend received students:", apiStudents)
      if (Array.isArray(apiStudents)) {
        setStudents(
          apiStudents.map((s: Record<string, unknown>) => {
            let studentId = "No Student ID"
            const email = String(s.email ?? "")
            if (email.endsWith("@alabang.sti.edu.ph")) {
              const match = email.match(/\.(\d+)@alabang\.sti\.edu\.ph$/)
              if (match && match[1]) {
                studentId = `02000-${match[1]}`
              }
            }
            return {
              id: typeof s.id === "string" ? s.id : String(s.id),
              studentId,
              name: `${String(s.first_name ?? "")} ${String(s.last_name ?? "")}`.trim(),
              email,
              phone: "",
              course: String(s.course ?? ""),
              year: s.year ? String(s.year) : "",
              section: String(s.section ?? ""),
              status: "active",
              enrollmentDate: s.created_at ? String(s.created_at) : "",
              gender: "",
              address: String(s.address ?? ""),
              dateOfBirth: "",
              department: "",
            }
          }) as unknown as Student[]
        )
      }
    }
    fetchStudents()
  }, [])

  const departments = Array.from(
    new Set(
      students
        .map((student) => student.department)
        .filter((dept) => dept && dept !== "") 
    )
  )
  const years = Array.from(
    new Set(
      students
        .map((student) => student.year)
        .filter((year) => year && year !== "") 
    )
  )

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.course.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab =
      (activeTab === "active" && student.status === "active") ||
      (activeTab === "inactive" && student.status === "inactive") ||
      (activeTab === "graduated" && student.status === "graduated") ||
      (activeTab === "on_leave" && student.status === "on_leave") ||
      activeTab === "all"

    const matchesDepartment = selectedDepartment === "all" || student.department === selectedDepartment
    const matchesYear = selectedYear === "all" || student.year === selectedYear
    return matchesSearch && matchesTab && matchesDepartment && matchesYear
  })

  const pageCount = Math.ceil(filteredStudents.length / pageSize)
  const paginatedStudents = filteredStudents.slice((page - 1) * pageSize, page * pageSize)

  const handleViewStudent = async (student: Student) => {
    setSelectedStudent(student)
    setIsViewDialogOpen(true)
    setProfileImgUrl(null)
    setAvatarLoading(false)
    setPersonalEmail("")
    setPersonalPhone("")
    setUsername("")
    if (student.id && student.id !== "") {
      try {
        const res = await fetch(`/api/superadmin/fetchUsers?studentId=${encodeURIComponent(student.id)}`)
        if (res.ok) {
          const { profile_img, contact_info, username: uname } = await res.json()
          if (profile_img) {
            setAvatarLoading(true)
            const signedUrlRes = await fetch("/api/students/get-signed-url", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ bucket: "user.avatars", path: profile_img }),
            })
            if (signedUrlRes.ok) {
              const { signedUrl } = await signedUrlRes.json()
              setProfileImgUrl(signedUrl)
            }
            setAvatarLoading(false)
          }
          if (contact_info) {
            let info = contact_info
            if (typeof info === "string") {
              try { info = JSON.parse(info) } catch {}
            }
            if (info && typeof info === "object") {
              if (info.email) setPersonalEmail(info.email)
              if (info.countryCode && info.phone) setPersonalPhone(`+${info.countryCode} ${info.phone}`)
            }
          }
          if (uname) setUsername(uname)
        }
      } catch {
        setAvatarLoading(false)
      }
    }
  }

  const handleDeleteStudent = (student: Student) => {
    setSelectedStudent(student)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteStudent = () => {
    setIsDeleteDialogOpen(false)
  }

  const exportStudents = () => {
    const header = "Student ID,Name,Email,Phone,Course,Year,Status\n"
    const csv = filteredStudents
      .map(
        (student) =>
          `${student.studentId},${student.name},${student.email},${student.phone},${student.course},${student.year},${student.status}`,
      )
      .join("\n")

    const blob = new Blob([header + csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "students.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function formatJoinDate(dateString: string) {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Student Management</h1>
          <p className="text-lg text-gray-600">View, export, and manage student records</p>
        </div>
        <Button
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 rounded-2xl px-6 py-3 font-semibold"
          onClick={exportStudents}
        >
          <Download className="h-5 w-5" />
          <span>Export Students</span>
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 pb-8">
            <CardTitle className="text-2xl font-bold text-gray-900">Student Records</CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Comprehensive list of all students in the system
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
                        placeholder="Search students..."
                        className="pl-12 rounded-2xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200 h-12 text-base"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                        <SelectTrigger className="w-[180px] rounded-2xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200 h-12">
                          <SelectValue placeholder="Department" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="all">All Departments</SelectItem>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-[120px] rounded-2xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200 h-12">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="all">All Years</SelectItem>
                          {years.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
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
                      All ({students.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="active"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 font-semibold"
                    >
                      Active ({students.filter((s) => s.status === "active").length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="inactive"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 font-semibold"
                    >
                      Inactive ({students.filter((s) => s.status === "inactive").length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="graduated"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 font-semibold"
                    >
                      Graduated ({students.filter((s) => s.status === "graduated").length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="on_leave"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 font-semibold"
                    >
                      On Leave ({students.filter((s) => s.status === "on_leave").length})
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="mt-4">
                    <StudentsTable
                      students={paginatedStudents}
                      onViewStudent={handleViewStudent}
                      onDeleteStudent={handleDeleteStudent}
                    />
                  </TabsContent>
                  <TabsContent value="active" className="mt-4">
                    <StudentsTable
                      students={paginatedStudents}
                      onViewStudent={handleViewStudent}
                      onDeleteStudent={handleDeleteStudent}
                    />
                  </TabsContent>
                  <TabsContent value="inactive" className="mt-4">
                    <StudentsTable
                      students={paginatedStudents}
                      onViewStudent={handleViewStudent}
                      onDeleteStudent={handleDeleteStudent}
                    />
                  </TabsContent>
                  <TabsContent value="graduated" className="mt-4">
                    <StudentsTable
                      students={paginatedStudents}
                      onViewStudent={handleViewStudent}
                      onDeleteStudent={handleDeleteStudent}
                    />
                  </TabsContent>
                  <TabsContent value="on_leave" className="mt-4">
                    <StudentsTable
                      students={paginatedStudents}
                      onViewStudent={handleViewStudent}
                      onDeleteStudent={handleDeleteStudent}
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

      {/* View Student Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Student Details</DialogTitle>
            <DialogDescription className="text-gray-600">
              Comprehensive information about the student.
            </DialogDescription>
          </DialogHeader>
          {!selectedStudent ? (
            <div className="grid gap-6 py-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-5 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="grid gap-6 py-4">
              <div className="flex items-start gap-4">
                <MuiAvatar sx={{ width: 64, height: 64 }}>
                  {avatarLoading ? (
                    <span className="w-8 h-8 block animate-spin border-4 border-indigo-400 border-t-transparent rounded-full mx-auto" />
                  ) : profileImgUrl ? (
                    <img
                      src={profileImgUrl}
                      alt="Avatar"
                      style={{ width: 64, height: 64, borderRadius: "50%" }}
                      className="rounded-full object-cover"
                      onLoad={() => setAvatarLoading(false)}
                    />
                  ) : (
                    <User className="h-8 w-8" />
                  )}
                </MuiAvatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
                  <p className="text-muted-foreground">{selectedStudent.studentId}</p>
                  {username && (
                    <div className="text-gray-600 text-sm font-medium">Username: {username}</div>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={selectedStudent.status} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>School Email:</strong> {selectedStudent.email}
                    </span>
                  </div>
                  {personalEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <strong>Personal Email:</strong> {personalEmail}
                      </span>
                    </div>
                  )}
                  {personalPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <strong>Phone:</strong> {personalPhone}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Year:</strong> {selectedStudent.year}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Course:</strong> {selectedStudent.course}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Section:</strong> {selectedStudent.section}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Join Date:</strong> {formatJoinDate(selectedStudent.enrollmentDate)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Address</Label>
                <p className="font-medium">{selectedStudent.address}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} className="rounded-xl px-6">
              Close
            </Button>
            <Button className="rounded-xl px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              Edit Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog using MUI */}
      <MuiDialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <MuiDialogTitle>Are you sure you want to delete this student?</MuiDialogTitle>
        <MuiDialogContent>
          <MuiDialogContentText>
            This action cannot be undone. This will permanently delete the student record and remove all associated
            data from the system.
          </MuiDialogContentText>
        </MuiDialogContent>
        <MuiDialogActions>
          <MuiButton onClick={() => setIsDeleteDialogOpen(false)}>Cancel</MuiButton>
          <MuiButton
            onClick={confirmDeleteStudent}
            color="error"
            variant="contained"
          >
            Delete
          </MuiButton>
        </MuiDialogActions>
      </MuiDialog>
    </div>
  )
}

function StudentsTable({
  students,
  onViewStudent,
  onDeleteStudent,
}: {
  students: Student[]
  onViewStudent: (student: Student) => void
  onDeleteStudent: (student: Student) => void
}) {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [menuStudentId, setMenuStudentId] = useState<string | null>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, studentId: string) => {
    setMenuAnchorEl(event.currentTarget)
    setMenuStudentId(studentId)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
    setMenuStudentId(null)
  }

  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="font-bold text-gray-700 py-4 px-6 text-left">Student ID</th>
            <th className="font-bold text-gray-700 py-4 px-6 text-left">Name</th>
            <th className="font-bold text-gray-700 py-4 px-6 text-left">School Email</th>
            <th className="font-bold text-gray-700 py-4 px-6 text-left">Course</th>
            <th className="font-bold text-gray-700 py-4 px-6 text-left">Year</th>
            <th className="font-bold text-gray-700 py-4 px-6 text-left">Section</th>
            <th className="font-bold text-gray-700 py-4 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-16">
                <div className="flex flex-col items-center space-y-4">
                  <User className="w-16 h-16 text-gray-300" />
                  <p className="text-gray-500 font-semibold text-lg">No students found</p>
                  <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                </div>
              </td>
            </tr>
          ) : (
            students.map((student, index) => (
              <motion.tr
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <td className="font-semibold text-gray-900 py-4 px-6">{student.studentId}</td>
                <td className="text-gray-700 py-4 px-6">{student.name}</td>
                <td className="text-gray-700 py-4 px-6">{student.email}</td>
                <td className="text-gray-700 py-4 px-6">{student.course}</td>
                <td className="text-gray-700 py-4 px-6">{student.year}</td>
                <td className="text-gray-700 py-4 px-6">{student.section}</td>
                <td className="text-right py-4 px-6">
                  <MuiIconButton
                    aria-label="more"
                    aria-controls={menuStudentId === student.id ? "student-actions-menu" : undefined}
                    aria-haspopup="true"
                    onClick={(e) => handleMenuOpen(e, student.id)}
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </MuiIconButton>
                  <MuiMenu
                    id="student-actions-menu"
                    anchorEl={menuAnchorEl}
                    open={menuStudentId === student.id && Boolean(menuAnchorEl)}
                    onClose={handleMenuClose}
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
                        handleMenuClose()
                        onViewStudent(student)
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </MuiMenuItem>
                    <MuiMenuItem
                      onClick={() => {
                        handleMenuClose()
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </MuiMenuItem>
                    <MuiMenuItem
                      onClick={() => {
                        handleMenuClose()
                        onDeleteStudent(student)
                      }}
                      sx={{ color: "red" }}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </MuiMenuItem>
                  </MuiMenu>
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
  const variants = {
    active: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    inactive: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100",
    graduated: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
    on_leave: "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100",
  }

  let label = status.charAt(0).toUpperCase() + status.slice(1)
  if (status === "on_leave") label = "On Leave"
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-3 py-1 text-sm font-semibold",
        variants[status as keyof typeof variants] || variants.active,
      )}
    >
      {label}
    </Badge>
  )
}

