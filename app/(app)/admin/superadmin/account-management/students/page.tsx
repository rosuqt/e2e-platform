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

// MUI imports
import MuiAvatar from "@mui/material/Avatar"
import MuiTable from "@mui/material/Table"
import MuiTableBody from "@mui/material/TableBody"
import MuiTableCell from "@mui/material/TableCell"
import MuiTableContainer from "@mui/material/TableContainer"
import MuiTableHead from "@mui/material/TableHead"
import MuiTableRow from "@mui/material/TableRow"
import MuiPaper from "@mui/material/Paper"
import MuiDialog from "@mui/material/Dialog"
import MuiDialogTitle from "@mui/material/DialogTitle"
import MuiDialogContent from "@mui/material/DialogContent"
import MuiDialogContentText from "@mui/material/DialogContentText"
import MuiDialogActions from "@mui/material/DialogActions"
import MuiButton from "@mui/material/Button"
import MuiMenu from "@mui/material/Menu"
import MuiMenuItem from "@mui/material/MenuItem"
import MuiIconButton from "@mui/material/IconButton"

interface Student {
  id: number
  studentId: string
  name: string
  email: string
  phone: string
  course: string
  year: number
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

  // Mock data
  const students: Student[] = [
    {
      id: 1,
      studentId: "2023-IT-0001",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      phone: "+63 912 345 6789",
      course: "BSIT",
      year: 4,
      status: "active",
      enrollmentDate: "2020-06-15",
      gender: "Male",
      address: "123 Main St, Manila",
      dateOfBirth: "2002-03-15",
      department: "IT",
    },
    {
      id: 2,
      studentId: "2023-IT-0002",
      name: "Maria Garcia",
      email: "maria.garcia@example.com",
      phone: "+63 923 456 7890",
      course: "BSIT",
      year: 4,
      status: "active",
      enrollmentDate: "2020-06-15",
      gender: "Female",
      address: "456 Oak Ave, Quezon City",
      dateOfBirth: "2002-05-22",
      department: "IT",
    },
    {
      id: 3,
      studentId: "2023-BUS-0001",
      name: "James Wilson",
      email: "james.wilson@example.com",
      phone: "+63 934 567 8901",
      course: "BSBA",
      year: 3,
      status: "active",
      enrollmentDate: "2021-06-10",
      gender: "Male",
      address: "789 Pine St, Makati",
      dateOfBirth: "2003-01-10",
      department: "Business",
    },
    {
      id: 4,
      studentId: "2022-IT-0015",
      name: "Emily Davis",
      email: "emily.davis@example.com",
      phone: "+63 945 678 9012",
      course: "BSIT",
      year: 2,
      status: "inactive",
      enrollmentDate: "2022-06-20",
      gender: "Female",
      address: "101 Cedar Rd, Pasig",
      dateOfBirth: "2004-07-30",
      department: "IT",
    },
    {
      id: 5,
      studentId: "2021-ENG-0022",
      name: "Robert Martinez",
      email: "robert.martinez@example.com",
      phone: "+63 956 789 0123",
      course: "BSCE",
      year: 3,
      status: "on_leave",
      enrollmentDate: "2021-06-15",
      gender: "Male",
      address: "202 Maple Dr, Taguig",
      dateOfBirth: "2003-11-05",
      department: "Engineering",
    },
    {
      id: 6,
      studentId: "2020-IT-0008",
      name: "Sophia Lee",
      email: "sophia.lee@example.com",
      phone: "+63 967 890 1234",
      course: "BSIT",
      year: 4,
      status: "graduated",
      enrollmentDate: "2020-06-10",
      gender: "Female",
      address: "303 Birch Ln, Mandaluyong",
      dateOfBirth: "2002-09-18",
      department: "IT",
    },
  ]

  const departments = Array.from(new Set(students.map((student) => student.department)))
  const years = Array.from(new Set(students.map((student) => student.year)))

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
    const matchesYear = selectedYear === "all" || student.year.toString() === selectedYear

    return matchesSearch && matchesTab && matchesDepartment && matchesYear
  })

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student)
    setIsViewDialogOpen(true)
  }

  const handleDeleteStudent = (student: Student) => {
    setSelectedStudent(student)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteStudent = () => {
    // In a real application, you would call an API to delete the student
    console.log(`Deleting student with ID: ${selectedStudent?.id}`)
    setIsDeleteDialogOpen(false)
    // Then refresh the student list
  }

  const exportStudents = () => {
    // In a real application, you would generate a CSV or Excel file
    const header = "Student ID,Name,Email,Phone,Course,Year,Status,Department\n"
    const csv = filteredStudents
      .map(
        (student) =>
          `${student.studentId},${student.name},${student.email},${student.phone},${student.course},${student.year},${student.status},${student.department}`,
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Student Management</h2>
          <p className="text-muted-foreground">View, export, and manage student records</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button className="flex items-center gap-2" onClick={exportStudents}>
            <Download className="h-4 w-4" />
            Export Students
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Student Records</CardTitle>
          <CardDescription>Comprehensive list of all students in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search students..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        Year {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Tabs defaultValue="active" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="graduated">Graduated</TabsTrigger>
              <TabsTrigger value="on_leave">On Leave</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <StudentsTable
                students={filteredStudents}
                onViewStudent={handleViewStudent}
                onDeleteStudent={handleDeleteStudent}
              />
            </TabsContent>
            <TabsContent value="active" className="mt-4">
              <StudentsTable
                students={filteredStudents}
                onViewStudent={handleViewStudent}
                onDeleteStudent={handleDeleteStudent}
              />
            </TabsContent>
            <TabsContent value="inactive" className="mt-4">
              <StudentsTable
                students={filteredStudents}
                onViewStudent={handleViewStudent}
                onDeleteStudent={handleDeleteStudent}
              />
            </TabsContent>
            <TabsContent value="graduated" className="mt-4">
              <StudentsTable
                students={filteredStudents}
                onViewStudent={handleViewStudent}
                onDeleteStudent={handleDeleteStudent}
              />
            </TabsContent>
            <TabsContent value="on_leave" className="mt-4">
              <StudentsTable
                students={filteredStudents}
                onViewStudent={handleViewStudent}
                onDeleteStudent={handleDeleteStudent}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Student Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>Comprehensive information about the student.</DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="grid gap-6 py-4">
              <div className="flex items-start gap-4">
                <MuiAvatar sx={{ width: 64, height: 64 }}>
                  <User className="h-8 w-8" />
                </MuiAvatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
                  <p className="text-muted-foreground">{selectedStudent.studentId}</p>
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
                      <strong>Email:</strong> {selectedStudent.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Phone:</strong> {selectedStudent.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Course:</strong> {selectedStudent.course}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Year:</strong> {selectedStudent.year}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Enrollment Date:</strong> {selectedStudent.enrollmentDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Gender:</strong> {selectedStudent.gender}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Date of Birth:</strong> {selectedStudent.dateOfBirth}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Department:</strong> {selectedStudent.department}
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
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button>Edit Student</Button>
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
  // State for menu anchor and selected student for menu
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [menuStudentId, setMenuStudentId] = useState<number | null>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, studentId: number) => {
    setMenuAnchorEl(event.currentTarget)
    setMenuStudentId(studentId)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
    setMenuStudentId(null)
  }

  return (
    <MuiTableContainer component={MuiPaper}>
      <MuiTable>
        <MuiTableHead>
          <MuiTableRow>
            <MuiTableCell>Student ID</MuiTableCell>
            <MuiTableCell>Name</MuiTableCell>
            <MuiTableCell>Email</MuiTableCell>
            <MuiTableCell>Phone</MuiTableCell>
            <MuiTableCell>Course</MuiTableCell>
            <MuiTableCell>Year</MuiTableCell>
            <MuiTableCell>Status</MuiTableCell>
            <MuiTableCell>Department</MuiTableCell>
            <MuiTableCell align="right">Actions</MuiTableCell>
          </MuiTableRow>
        </MuiTableHead>
        <MuiTableBody>
          {students.length === 0 ? (
            <MuiTableRow>
              <MuiTableCell colSpan={9} align="center" style={{ padding: "32px 0", color: "#888" }}>
                No students found
              </MuiTableCell>
            </MuiTableRow>
          ) : (
            students.map((student) => (
              <MuiTableRow key={student.id}>
                <MuiTableCell className="font-medium">{student.studentId}</MuiTableCell>
                <MuiTableCell>{student.name}</MuiTableCell>
                <MuiTableCell>{student.email}</MuiTableCell>
                <MuiTableCell>{student.phone}</MuiTableCell>
                <MuiTableCell>{student.course}</MuiTableCell>
                <MuiTableCell>{student.year}</MuiTableCell>
                <MuiTableCell>
                  <StatusBadge status={student.status} />
                </MuiTableCell>
                <MuiTableCell>{student.department}</MuiTableCell>
                <MuiTableCell align="right">
                  <MuiIconButton
                    aria-label="more"
                    aria-controls={menuStudentId === student.id ? "student-actions-menu" : undefined}
                    aria-haspopup="true"
                    onClick={(e) => handleMenuOpen(e, student.id)}
                  >
                    <MoreHorizontal className="h-4 w-4" />
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
                        // Add edit logic here if needed
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
    return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
  } else if (status === "inactive") {
    return (
      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
        Inactive
      </Badge>
    )
  } else if (status === "graduated") {
    return (
      <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
        Graduated
      </Badge>
    )
  } else if (status === "on_leave") {
    return (
      <Badge variant="outline" className="text-orange-600 border-orange-600">
        On Leave
      </Badge>
    )
  }
  return null
}
