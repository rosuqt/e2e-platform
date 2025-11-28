/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import Image from "next/image"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  MessageSquare,
  Edit,
  Upload,
  FileText,
  X,
  Check,
  Info,
  AlertTriangle,
  Loader2,
  Building2,
} from "lucide-react"
import { FiCalendar } from "react-icons/fi"
import { HiOutlineUserGroup } from "react-icons/hi2"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Progress } from "@/components/ui/progress"
import { Avatar } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion } from "framer-motion"
import { HiRocketLaunch } from "react-icons/hi2"
import { RiProgress6Fill } from "react-icons/ri"
import { FaMagnifyingGlass } from "react-icons/fa6"
import Tooltip from "@mui/material/Tooltip"
import StudentDetailsModalContent from "./components/studentDetails"
import { PiWarningCircleBold } from "react-icons/pi"
import { LuGraduationCap } from "react-icons/lu"
import Papa from "papaparse"

interface Student {
  id: number
  name: string
  studentId: string
  email: string
  year: number
  status: string
  progress: number
  company?: string
  employer?: string
  course?: string
  profile_img?: string | null
  section?: string | null
  application_id?: string
  student_id?: string | number 
}

interface BulkUploadPreviewData {
  studentId: string
  name: string
  email: string
  course?: string
  year?: number
  status?: string
  isValid: boolean
  errors?: string[]
}

export default function StudentManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isEditStatusDialogOpen, setIsEditStatusDialogOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false)
  const [uploadStep, setUploadStep] = useState<"select" | "preview" | "uploading" | "results">("select")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<BulkUploadPreviewData[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadResults, setUploadResults] = useState<{
    total: number
    successful: number
    failed: number
    errors: string[]
  }>({ total: 0, successful: 0, failed: 0, errors: [] })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [parsedRows, setParsedRows] = useState<any[]>([])

  useEffect(() => {
    setIsLoading(true)
    fetch("/api/superadmin/coordinators/fetchDeptStudents")
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false)
        if (Array.isArray(data)) {
          setStudents(
            data.map((row) => {
              let studentId = "No Student ID"
              const email = String(row.email ?? "")
              if (email.endsWith("@alabang.sti.edu.ph")) {
                const match = email.match(/\.(\d+)@alabang\.sti\.edu\.ph$/)
                if (match && match[1]) {
                  studentId = `02000-${match[1]}`
                }
              }
              return {
                id: row.id,
                name: [row.first_name, row.last_name].filter(Boolean).join(" "),
                studentId,
                email: row.email || "",
                year: row.year || "",
                status: row.status || "New",
                progress: row.progress || 0,
                company: row.company || "",
                employer: row.employer || "",
                course: row.course || "",
                profile_img: row.profile_img || null,
                section: row.section || null,
                application_id: row.application_id || "",
                student_id: row.id,
              }
            })
          )
        }
      })
  }, [])

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.course ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.company && student.company.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "not_hired" && student.status.toLowerCase() === "not_hired") ||
      (activeTab === "in_progress" && student.status.toLowerCase() === "in_progress") ||
      (activeTab === "hired" && student.status.toLowerCase() === "hired") ||
      (activeTab === "finished" && student.status.toLowerCase() === "finished")

    return matchesSearch && matchesTab
  })

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student)
    setIsViewDialogOpen(true)
  }

  const handleEditStatus = (student: Student) => {
    setSelectedStudent(student)
    setSelectedStatus(student.status)
    setIsEditStatusDialogOpen(true)
  }

  const updateStudentStatus = () => {
    if (!selectedStudent) return

    console.log(`Updating student ${selectedStudent.name} status to ${selectedStatus}`)

    setIsEditStatusDialogOpen(false)
  }

  const handleBulkUploadClick = () => {
    setIsBulkUploadOpen(true)
    setUploadStep("select")
    setSelectedFile(null)
    setPreviewData([])
    setUploadProgress(0)
    setUploadResults({ total: 0, successful: 0, failed: 0, errors: [] })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          setParsedRows(results.data)
          const preview: BulkUploadPreviewData[] = results.data.map((row: any) => {
            const studentId = row["Student ID"] || row.studentId || ""
            const name = row["Full Name"] || row.name || ""
            let email = row.Email || row.email || ""
            if (!email && Array.isArray(row.__parsed_extra) && row.__parsed_extra.length > 0) {
              email = row.__parsed_extra[0]
            }
            const errors: string[] = []
            if (!studentId) errors.push("Student ID is required")
            if (!name) errors.push("Name is required")
            if (!email) errors.push("Email is required")
            return {
              studentId,
              name,
              email,
              isValid: errors.length === 0,
              errors,
            }
          })
          setPreviewData(preview)
          setUploadStep("preview")
        }
      })
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setSelectedFile(file)
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results: any) => {
            setParsedRows(results.data)
            const preview: BulkUploadPreviewData[] = results.data.map((row: any) => {
              const studentId = row["Student ID"] || row.studentId || ""
              const name = row["Full Name"] || row.name || ""
              let email = row.Email || row.email || ""
              if (!email && Array.isArray(row.__parsed_extra) && row.__parsed_extra.length > 0) {
                email = row.__parsed_extra[0]
              }
              const errors: string[] = []
              if (!studentId) errors.push("Student ID is required")
              if (!name) errors.push("Name is required")
              if (!email) errors.push("Email is required")
              return {
                studentId,
                name,
                email,
                isValid: errors.length === 0,
                errors,
              }
            })
            setPreviewData(preview)
            setUploadStep("preview")
          }
        })
      } else {
        alert("Please upload a CSV file")
      }
    }
  }

  const handleUpload = () => {
    setUploadStep("uploading")

    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)

        const validRecords = previewData.filter((record) => record.isValid)
        const invalidRecords = previewData.filter((record) => !record.isValid)

        setUploadResults({
          total: previewData.length,
          successful: validRecords.length,
          failed: invalidRecords.length,
          errors: invalidRecords.flatMap((record) => record.errors || []),
        })

        setUploadStep("results")
      }
    }, 300)
  }

  const resetBulkUpload = () => {
    setUploadStep("select")
    setSelectedFile(null)
    setPreviewData([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const closeBulkUpload = () => {
    setIsBulkUploadOpen(false)
  }

  const downloadTemplate = () => {
    const csvContent = "studentId,name,email\n2023-IT-XXXX,Student Name,student@alabang.sti.edu.ph"
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "student_upload_template.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mb-4" />
          <div className="text-lg font-semibold text-indigo-500 animate-pulse">Fetching users...</div>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
          >
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Student Management</h2>
              <p className="text-lg text-gray-600">Manage IT department students and track their progress</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2 rounded-2xl border-gray-200 shadow"
                onClick={handleBulkUploadClick}
              >
                <Upload className="h-4 w-4" />
                Bulk Upload
              </Button>
              <Button
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg rounded-2xl px-6 py-3 font-semibold"
                onClick={() => {
                  const csvRows = [
                    [
                      "Student ID",
                      "Name",
                      "School Email",
                      "Year",
                      "Status",
                      "Company",
                      "Course",
                      "Section"
                    ].join(","),
                    ...students.map(s =>
                      [
                        `"${s.studentId}"`,
                        `"${s.name}"`,
                        `"${s.email}"`,
                        `"${s.year}"`,
                        `"${s.status}"`,
                        `"${s.company || ""}"`,
                        `"${s.course || ""}"`,
                        `"${s.section || ""}"`
                      ].join(",")
                    )
                  ]
                  const csvContent = csvRows.join("\r\n")
                  const blob = new Blob([csvContent], { type: "text/csv" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = "students_export.csv"
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  URL.revokeObjectURL(url)
                }}
              >
                <Download className="h-4 w-4" />
                Export List
              </Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-0 shadow-xl bg-white rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 pb-8">
                <CardTitle className="text-2xl font-bold text-gray-900">IT Department Students</CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  View and manage all students in the IT department
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
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
                    <Button variant="outline" className="flex items-center gap-2 rounded-2xl border-gray-200">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </div>
                <Tabs defaultValue="all" onValueChange={setActiveTab} className="space-y-8">
                  <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-none lg:flex rounded-2xl bg-gray-100 p-1.5 h-auto">
                    <TabsTrigger
                      value="all"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 font-semibold"
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger
                      value="not_hired"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 font-semibold"
                    >
                      Not Hired
                    </TabsTrigger>
                    <TabsTrigger
                      value="in_progress"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 font-semibold"
                    >
                      In Progress
                    </TabsTrigger>
                    <TabsTrigger
                      value="hired"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 font-semibold"
                    >
                      Hired
                    </TabsTrigger>
                    <TabsTrigger
                      value="finished"
                      className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 font-semibold"
                    >
                      Finished
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="mt-4">
                    <StudentsTable
                      students={filteredStudents}
                      onViewStudent={handleViewStudent}
                      onEditStatus={handleEditStatus}
                    />
                  </TabsContent>
                  <TabsContent value="not_hired" className="mt-4">
                    <StudentsTable
                      students={filteredStudents}
                      onViewStudent={handleViewStudent}
                      onEditStatus={handleEditStatus}
                    />
                  </TabsContent>
                  <TabsContent value="in_progress" className="mt-4">
                    <StudentsTable
                      students={filteredStudents}
                      onViewStudent={handleViewStudent}
                      onEditStatus={handleEditStatus}
                    />
                  </TabsContent>
                  <TabsContent value="hired" className="mt-4">
                    <StudentsTable
                      students={filteredStudents}
                      onViewStudent={handleViewStudent}
                      onEditStatus={handleEditStatus}
                    />
                  </TabsContent>
                  <TabsContent value="finished" className="mt-4">
                    <StudentsTable
                      students={filteredStudents}
                      onViewStudent={handleViewStudent}
                      onEditStatus={handleEditStatus}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* View Student Dialog */}
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="sm:max-w-[800px] p-0">
              {selectedStudent && (
                <div className="w-full">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="w-full rounded-t-xl bg-gradient-to-br from-blue-700 to-indigo-400 border-b border-blue-700 p-8"
                    style={{ marginBottom: 0 }}
                  >
                    <div className="relative flex items-center gap-4 w-full">
                      <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Avatar className="h-16 w-16 ring-4 ring-white shadow-lg">
                          <ProfileImage profile_img={selectedStudent.profile_img} name={selectedStudent.name} />
                        </Avatar>
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-white">{selectedStudent.name}</h3>
                          <motion.span
                            whileHover={{ scale: 1.2 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="scale-110 font-bold"
                          >
                            <StatusBadge status={selectedStudent.status} />
                          </motion.span>
                        </div>
                        <p className="text-blue-100 font-medium">{selectedStudent.studentId}</p>
                        <div
                          className="whitespace-nowrap flex flex-nowrap items-center gap-8 mt-2 text-sm text-blue-100 overflow-x-auto"
                          style={{ minWidth: 0 }}
                        >
                          <span className="flex items-center gap-1 min-w-0">
                            <LuGraduationCap className="w-4 h-4" />
                            <span className="font-bold">Course:</span>
                            <span className="truncate font-normal">{selectedStudent.course}</span>
                          </span>
                          <span className="flex items-center gap-1 min-w-0">
                            <FiCalendar className="w-4 h-4" />
                            <span className="font-bold">Year:</span>
                            <span className="truncate font-medium">{selectedStudent.year}</span>
                          </span>
                          <span className="flex items-center gap-1 min-w-0">
                            <HiOutlineUserGroup className="w-4 h-4" />
                            <span className="font-bold">Section:</span>
                            <span className="truncate font-medium">{selectedStudent.section}</span>
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        {selectedStudent.company && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-sm text-blue-100 mt-2 flex items-center gap-1"
                          >
                            <Building2 className="w-4 h-4" />
                            {selectedStudent.company}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                  <div className="px-8">
                    <StudentDetailsModalContent
                      student={selectedStudent}
                      onClose={() => setIsViewDialogOpen(false)}
                    />
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Edit Status Dialog */}
          <Dialog open={isEditStatusDialogOpen} onOpenChange={setIsEditStatusDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Update Student Status</DialogTitle>
                <DialogDescription>Change the current status of the student.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {selectedStudent && (
                  <>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <ProfileImage profile_img={selectedStudent.profile_img} name={selectedStudent.name} />
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{selectedStudent.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedStudent.studentId}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not-started">Not-started</SelectItem>
                          <SelectItem value="in-progress">In-progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditStatusDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={updateStudentStatus}>Update Status</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Bulk Upload Dialog */}
          <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Bulk Upload Students</DialogTitle>
                <DialogDescription>Upload multiple student records at once using a CSV file.</DialogDescription>
              </DialogHeader>

              {uploadStep === "select" && (
                <div className="grid gap-6 py-4">
                  <div
                    className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-10 w-10 text-gray-400" />
                      <h3 className="font-medium text-lg">Upload CSV File</h3>
                      <p className="text-sm text-muted-foreground max-w-md">
                        Drag and drop your CSV file here, or click to browse
                      </p>
                      <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileChange} />
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          fileInputRef.current?.click()
                        }}
                      >
                        Select File
                      </Button>
                    </div>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>CSV Format</AlertTitle>
                    <AlertDescription>
                      Your CSV file should include the following columns: <b>studentId, name, email</b>.
                      <Button
                        variant="link"
                        className="p-0 h-auto text-blue-600 hover:text-blue-800"
                        onClick={downloadTemplate}
                      >
                        Download template
                      </Button>
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {uploadStep === "preview" && (
                <div className="grid gap-6 py-4">
                  {/* Debug: Show parsed rows */}
                  <div className="mb-4">
                    <pre className="bg-gray-50 p-2 rounded text-xs max-h-32 overflow-auto">{JSON.stringify(parsedRows, null, 2)}</pre>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">File Preview</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedFile?.name} ({previewData.length} records)
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={resetBulkUpload}>
                      Change File
                    </Button>
                  </div>

                  {previewData.some((record) => !record.isValid) && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Validation Errors</AlertTitle>
                      <AlertDescription>
                        Some records have validation errors. Please fix them before uploading.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="rounded-md border max-h-[300px] overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Student ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead className="w-[100px]">Valid</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewData.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                              No data found in CSV file
                            </TableCell>
                          </TableRow>
                        ) : (
                          previewData.map((record, index) => (
                            <TableRow key={index} className={!record.isValid ? "bg-red-50" : ""}>
                              <TableCell className="font-medium">{record.studentId || "-"}</TableCell>
                              <TableCell>{record.name}</TableCell>
                              <TableCell>{record.email || "-"}</TableCell>
                              <TableCell>
                                {record.isValid ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <div className="group relative">
                                    <X className="h-4 w-4 text-red-500" />
                                    {record.errors && record.errors.length > 0 && (
                                      <div className="absolute left-6 top-0 hidden group-hover:block bg-white p-2 rounded shadow-md border z-10 w-48">
                                        <ul className="text-xs text-red-600 list-disc pl-4">
                                          {record.errors.map((error, i) => (
                                            <li key={i}>{error}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {uploadStep === "uploading" && (
                <div className="grid gap-6 py-8">
                  <div className="flex flex-col items-center justify-center">
                    <h3 className="font-medium text-lg mb-4">Uploading Students...</h3>
                    <Progress value={uploadProgress} className="w-full h-2 mb-2" />
                    <p className="text-sm text-muted-foreground">{uploadProgress}% complete</p>
                  </div>
                </div>
              )}

              {uploadStep === "results" && (
                <div className="grid gap-6 py-4">
                  <div className="flex flex-col items-center justify-center">
                    {uploadResults.failed === 0 ? (
                      <div className="bg-green-100 rounded-full p-3 mb-4">
                        <Check className="h-6 w-6 text-green-600" />
                      </div>
                    ) : (
                      <div className="bg-yellow-100 rounded-full p-3 mb-4">
                        <AlertTriangle className="h-6 w-6 text-yellow-600" />
                      </div>
                    )}

                    <h3 className="font-medium text-lg">Upload Complete</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {uploadResults.successful} of {uploadResults.total} records were successfully uploaded
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <p className="text-2xl font-bold">{uploadResults.total}</p>
                        <p className="text-sm text-muted-foreground">Total Records</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <p className="text-2xl font-bold text-green-600">{uploadResults.successful}</p>
                        <p className="text-sm text-muted-foreground">Successful</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <p className="text-2xl font-bold text-red-600">{uploadResults.failed}</p>
                        <p className="text-sm text-muted-foreground">Failed</p>
                      </CardContent>
                    </Card>
                  </div>

                  {uploadResults.failed > 0 && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Upload Errors</AlertTitle>
                      <AlertDescription>
                        <p className="mb-2">The following errors occurred during upload:</p>
                        <ul className="list-disc pl-5 text-sm">
                          {uploadResults.errors.slice(0, 3).map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                          {uploadResults.errors.length > 3 && <li>...and {uploadResults.errors.length - 3} more errors</li>}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              <DialogFooter>
                {uploadStep === "select" && (
                  <Button variant="outline" onClick={closeBulkUpload}>
                    Cancel
                  </Button>
                )}

                {uploadStep === "preview" && (
                  <>
                    <Button variant="outline" onClick={resetBulkUpload}>
                      Back
                    </Button>
                    <Button onClick={handleUpload} disabled={previewData.some((record) => !record.isValid)}>
                      Upload {previewData.filter((record) => record.isValid).length} Records
                    </Button>
                  </>
                )}

                {uploadStep === "uploading" && <Button disabled>Uploading...</Button>}

                {uploadStep === "results" && (
                  <>
                    <Button variant="outline" onClick={resetBulkUpload}>
                      Upload More
                    </Button>
                    <Button onClick={closeBulkUpload}>Done</Button>
                  </>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}

function StudentsTable({
  students,
  onViewStudent,
  onEditStatus,
}: {
  students: Student[]
  onViewStudent: (student: Student) => void
  onEditStatus: (student: Student) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm"
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-bold text-gray-700 py-4 px-6 text-left">Student ID</TableHead>
            <TableHead className="font-bold text-gray-700 py-4 px-6 text-left">Name</TableHead>
            <TableHead className="font-bold text-gray-700 py-4 px-6 text-left">School Email</TableHead>
            <TableHead className="font-bold text-gray-700 py-4 px-6 text-left">Year</TableHead>
            <TableHead className="font-bold text-gray-700 py-4 px-6 text-left">Status</TableHead>
            <TableHead className="font-bold text-gray-700 py-4 px-6 text-left">Company</TableHead>
            <TableHead className="font-bold text-gray-700 py-4 px-6 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No students found
              </TableCell>
            </TableRow>
          ) : (
            students.map((student, idx) => (
              <motion.tr
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <TableCell className="font-semibold text-gray-900 py-4 px-6">{student.studentId}</TableCell>
                <TableCell className="text-gray-700 py-4 px-6">{student.name}</TableCell>
                <TableCell className="text-gray-700 py-4 px-6">{student.email}</TableCell>
                <TableCell className="text-gray-700 py-4 px-6">{student.year}</TableCell>
                <TableCell className="text-gray-700 py-4 px-6">
                  <StatusBadge status={student.status} />
                </TableCell>
                <TableCell className="text-gray-700 py-4 px-6">{student.company || "-"}</TableCell>
                <TableCell className="text-right py-4 px-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewStudent(student)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditStatus(student)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Status
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Message Employer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>
    </motion.div>
  )
}



function getStatusDisplay(status: string) {
  switch (status.toLowerCase()) {
    case "new":
      return {
        label: "Not Applied",
        bg: "bg-orange-100",
        text: "text-orange-700",
        border: "border-orange-200",
        icon: <PiWarningCircleBold  className="inline-block mr-1 -mt-0.5" size={16} />,
      }
    case "shortlisted":
    case "waitlisted":
      return {
        label: "Seeking Jobs",
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        border: "border-yellow-200",
        icon: <FaMagnifyingGlass className="inline-block mr-1 -mt-0.5" size={15} />,
      }
    case "interview scheduled":
      return {
        label: "In Progress",
        bg: "bg-blue-100",
        text: "text-blue-700",
        border: "border-blue-200",
        icon: <RiProgress6Fill className="inline-block mr-1 -mt-0.5" size={16} />,
      }
    case "hired":
      return {
        label: "Hired",
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-200",
        icon: <HiRocketLaunch className="inline-block mr-1 -mt-0.5" size={16} />,
      }
    case "rejected":
      return {
        label: "",
        bg: "",
        text: "",
        border: "",
        icon: null,
      }
    default:
      return {
        label: status.charAt(0).toUpperCase() + status.slice(1),
        bg: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-200",
        icon: null,
      }
  }
}

function StatusBadge({ status }: { status: string }) {
  const display = getStatusDisplay(status)
  if (!display.label) return null
  let tooltip = "Indicates the highest progress reached in the application process."
  if (display.label === "Not Applied") {
    tooltip = "This student hasn't applied for any jobs yet."
  } else if (display.label === "Seeking Jobs") {
    tooltip = "This student has applied for some jobs and is awaiting updates."
  } else if (display.label === "In Progress") {
    tooltip = "This student has an application currently in progress."
  } else if (display.label === "Hired") {
    tooltip = "This student has been hired for an OJT placement."
  } else if (display.label === "Rejected") {
    tooltip = "This student's application was not successful."
  }
  return (
    <Tooltip title={tooltip} arrow>
      <span>
        <Badge
          variant="outline"
          className={`${display.bg} ${display.text} ${display.border} flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold`}
        >
          {display.icon}
          {display.label}
        </Badge>
      </span>
    </Tooltip>
  )
}

function ProfileImage({ profile_img, name }: { profile_img?: string | null, name: string }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let ignore = false
    async function fetchAvatar() {
      if (profile_img) {
        setLoading(true)
        try {
          const res = await fetch("/api/students/get-signed-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bucket: "user.avatars",
              path: profile_img,
            }),
          })
          const data = await res.json()
          if (!ignore) setAvatarUrl(data.signedUrl || null)
        } catch {
          if (!ignore) setAvatarUrl(null)
        } finally {
          if (!ignore) setLoading(false)
        }
      } else {
        setAvatarUrl(null)
      }
    }
    fetchAvatar()
    return () => { ignore = true }
  }, [profile_img])

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-400 to-purple-500">
        <Loader2 className="w-6 h-6 animate-spin text-white" />
      </div>
    )
  }
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name}
        width={64}
        height={64}
        className="object-cover"
        unoptimized
      />
    )
  }
  if (profile_img === null) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-400 to-purple-500">
        <Loader2 className="w-6 h-6 animate-spin text-white" />
      </div>
    )
  }
  return (
    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 text-white">
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" fill="currentColor" />
        <path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4" fill="currentColor" />
      </svg>
    </div>
  )
}

