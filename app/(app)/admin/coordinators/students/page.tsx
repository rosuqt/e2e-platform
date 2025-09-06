"use client"
import Image from "next/image"

import type React from "react"

import { useState, useRef } from "react"
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Upload,
  FileText,
  X,
  Check,
  Info,
  AlertTriangle,
} from "lucide-react"
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

interface Student {
  id: number
  name: string
  studentId: string
  course: string
  year: number
  status: "not_hired" | "in_progress" | "hired" | "finished"
  progress: number
  company?: string
  employer?: string
}

interface BulkUploadPreviewData {
  studentId: string
  name: string
  course: string
  year: number
  status: string
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

  // Mock data
  const students: Student[] = [
    {
      id: 1,
      name: "Alex Johnson",
      studentId: "2023-IT-0001",
      course: "BSIT",
      year: 4,
      status: "hired",
      progress: 100,
      company: "Tech Solutions Inc.",
      employer: "John Smith",
    },
    {
      id: 2,
      name: "Maria Garcia",
      studentId: "2023-IT-0002",
      course: "BSIT",
      year: 4,
      status: "in_progress",
      progress: 65,
      company: "Digital Innovations",
      employer: "Sarah Williams",
    },
    {
      id: 3,
      name: "James Wilson",
      studentId: "2023-IT-0003",
      course: "BSIT",
      year: 3,
      status: "not_hired",
      progress: 10,
    },
    {
      id: 4,
      name: "Emily Davis",
      studentId: "2023-IT-0004",
      course: "BSIT",
      year: 4,
      status: "finished",
      progress: 100,
      company: "WebTech Solutions",
      employer: "Michael Brown",
    },
    {
      id: 5,
      name: "Robert Martinez",
      studentId: "2023-IT-0005",
      course: "BSIT",
      year: 3,
      status: "in_progress",
      progress: 45,
      company: "Innovative Systems",
      employer: "Jennifer Lee",
    },
  ]

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.company && student.company.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "not_hired" && student.status === "not_hired") ||
      (activeTab === "in_progress" && student.status === "in_progress") ||
      (activeTab === "hired" && student.status === "hired") ||
      (activeTab === "finished" && student.status === "finished")

    return matchesSearch && matchesTab
  })

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student)
    setIsViewDialogOpen(true)
  }

  const handleEditStatus = (student: Student) => {
    setSelectedStudent(student)
    setSelectedStatus(mapStatusToEditOptions(student.status))
    setIsEditStatusDialogOpen(true)
  }

  const mapStatusToEditOptions = (status: string): string => {
    switch (status) {
      case "not_hired":
        return "not-started"
      case "in_progress":
        return "in-progress"
      case "hired":
      case "finished":
        return "completed"
      default:
        return "not-started"
    }
  }

  const updateStudentStatus = () => {
    if (!selectedStudent) return

    // In a real application, you would call an API to update the student status
    console.log(`Updating student ${selectedStudent.name} status to ${selectedStatus}`)

    // Close the dialog
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
      // Mock parsing CSV file
      setTimeout(() => {
        const mockPreviewData: BulkUploadPreviewData[] = [
          {
            studentId: "2023-IT-0010",
            name: "John Doe",
            course: "BSIT",
            year: 3,
            status: "not_hired",
            isValid: true,
          },
          {
            studentId: "2023-IT-0011",
            name: "Jane Smith",
            course: "BSIT",
            year: 4,
            status: "in_progress",
            isValid: true,
          },
          {
            studentId: "2023-IT-0012",
            name: "Michael Johnson",
            course: "BSCS",
            year: 2,
            status: "not_hired",
            isValid: true,
          },
          {
            studentId: "2023-IT-0013",
            name: "Sarah Williams",
            course: "BSIT",
            year: 3,
            status: "invalid_status",
            isValid: false,
            errors: ["Invalid status value"],
          },
          {
            studentId: "",
            name: "David Brown",
            course: "BSIT",
            year: 4,
            status: "not_hired",
            isValid: false,
            errors: ["Student ID is required"],
          },
        ]
        setPreviewData(mockPreviewData)
        setUploadStep("preview")
      }, 1000)
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
        // Mock parsing CSV file (same as handleFileChange)
        setTimeout(() => {
          const mockPreviewData: BulkUploadPreviewData[] = [
            {
              studentId: "2023-IT-0010",
              name: "John Doe",
              course: "BSIT",
              year: 3,
              status: "not_hired",
              isValid: true,
            },
            {
              studentId: "2023-IT-0011",
              name: "Jane Smith",
              course: "BSIT",
              year: 4,
              status: "in_progress",
              isValid: true,
            },
            {
              studentId: "2023-IT-0012",
              name: "Michael Johnson",
              course: "BSCS",
              year: 2,
              status: "not_hired",
              isValid: true,
            },
            {
              studentId: "2023-IT-0013",
              name: "Sarah Williams",
              course: "BSIT",
              year: 3,
              status: "invalid_status",
              isValid: false,
              errors: ["Invalid status value"],
            },
            {
              studentId: "",
              name: "David Brown",
              course: "BSIT",
              year: 4,
              status: "not_hired",
              isValid: false,
              errors: ["Student ID is required"],
            },
          ]
          setPreviewData(mockPreviewData)
          setUploadStep("preview")
        }, 1000)
      } else {
        alert("Please upload a CSV file")
      }
    }
  }

  const handleUpload = () => {
    setUploadStep("uploading")

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)

        // Mock results
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
    // Create CSV content
    const csvContent = "studentId,name,course,year,status\n2023-IT-XXXX,Student Name,BSIT,3,not_hired"

    // Create a blob and download
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Student Management</h2>
          <p className="text-muted-foreground">Manage IT department students and track their progress</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={handleBulkUploadClick}>
            <Upload className="h-4 w-4" />
            Bulk Upload
          </Button>
          <Button className="flex items-center gap-2" >
            <Download className="h-4 w-4" />
            Export List
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>IT Department Students</CardTitle>
          <CardDescription>View and manage all students in the IT department</CardDescription>
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
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="not_hired">Not Hired</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="hired">Hired</TabsTrigger>
              <TabsTrigger value="finished">Finished</TabsTrigger>
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

      {/* View Student Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>Detailed information about the student and their progress.</DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="grid gap-6 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <Image src="/placeholder.svg?height=64&width=64" alt="Student" width={64} height={64} />
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
                  <p className="text-muted-foreground">{selectedStudent.studentId}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={selectedStudent.status} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Course</Label>
                  <p className="font-medium">{selectedStudent.course}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Year</Label>
                  <p className="font-medium">{selectedStudent.year}</p>
                </div>
                {selectedStudent.company && (
                  <div>
                    <Label className="text-sm text-muted-foreground">Company</Label>
                    <p className="font-medium">{selectedStudent.company}</p>
                  </div>
                )}
                {selectedStudent.employer && (
                  <div>
                    <Label className="text-sm text-muted-foreground">Employer</Label>
                    <p className="font-medium">{selectedStudent.employer}</p>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Progress</Label>
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{selectedStudent.progress}% Complete</span>
                  </div>
                  <Progress value={selectedStudent.progress} className="h-2" />
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Timeline</h4>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-blue-500 p-1">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <div className="w-px h-full bg-blue-200"></div>
                    </div>
                    <div>
                      <p className="font-medium">Application Submitted</p>
                      <p className="text-sm text-muted-foreground">Jan 15, 2023</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-blue-500 p-1">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <div className="w-px h-full bg-blue-200"></div>
                    </div>
                    <div>
                      <p className="font-medium">Interview Scheduled</p>
                      <p className="text-sm text-muted-foreground">Jan 20, 2023</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`rounded-full p-1 ${selectedStudent.progress >= 50 ? "bg-blue-500" : "bg-gray-300"}`}
                      >
                        {selectedStudent.progress >= 50 ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : (
                          <Clock className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div className="w-px h-full bg-blue-200"></div>
                    </div>
                    <div>
                      <p className="font-medium">Placement Confirmed</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedStudent.progress >= 50 ? "Feb 1, 2023" : "Pending"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`rounded-full p-1 ${selectedStudent.progress === 100 ? "bg-blue-500" : "bg-gray-300"}`}
                      >
                        {selectedStudent.progress === 100 ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : (
                          <Clock className="h-4 w-4 text-white" />
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Internship Completed</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedStudent.progress === 100 ? "May 30, 2023" : "Pending"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Message Employer
            </Button>
          </DialogFooter>
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
                    <Image src="/placeholder.svg?height=48&width=48" alt="Student" width={48} height={48} />
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
                  Your CSV file should include the following columns: studentId, name, course, year, status.
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
                      <TableHead>Course</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Valid</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((record, index) => (
                      <TableRow key={index} className={!record.isValid ? "bg-red-50" : ""}>
                        <TableCell className="font-medium">{record.studentId || "-"}</TableCell>
                        <TableCell>{record.name}</TableCell>
                        <TableCell>{record.course}</TableCell>
                        <TableCell>{record.year}</TableCell>
                        <TableCell>{record.status}</TableCell>
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
                    ))}
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No students found
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.studentId}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.course}</TableCell>
                <TableCell>{student.year}</TableCell>
                <TableCell>
                  <StatusBadge status={student.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={student.progress} className="h-2 w-24" />
                    <span className="text-xs">{student.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>{student.company || "-"}</TableCell>
                <TableCell className="text-right">
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
                        View Details
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === "not_hired") {
    return (
      <Badge variant="outline" className="text-yellow-600 border-yellow-600 flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        Not Hired
      </Badge>
    )
  } else if (status === "in_progress") {
    return (
      <Badge className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1">
        <Clock className="h-3 w-3" />
        In Progress
      </Badge>
    )
  } else if (status === "hired") {
    return (
      <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        Hired
      </Badge>
    )
  } else if (status === "finished") {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        Finished
      </Badge>
    )
  }
  return null
}
