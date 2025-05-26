"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Filter, Search, ArrowUpDown, Pen } from "lucide-react"
import ExcelJS from "exceljs"
import Link from "next/link"
import { RiRobot2Fill } from "react-icons/ri"

type TestCase = {
  id: number
  testerName: string
  date: string
  testCaseTitle: string
  description: string
  stepsToReproduce: string
  expectedResult: string
  actualResult: string
  category: string
  severity: string
  commitVer: string
  feedback?: string
  module?: string
  personalNotes?: string
}

type SortConfig = {
  key: keyof TestCase;
  direction: "asc" | "desc";
}

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-black/70 overflow-y-auto">
      <div
        className="flex flex-col backdrop-blur-lg bg-black/70 border border-purple-500/30 rounded-xl shadow-2xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto"
        style={{
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        }}
      >
        <button
          className="absolute top-2 right-2 text-purple-400 hover:text-white text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="flex flex-col h-full">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function AllyPage() {
  const [testCases, setTestCases] = useState<TestCase[]>([])
  const [filteredTestCases, setFilteredTestCases] = useState<TestCase[]>([])
  const [filters, setFilters] = useState({
    category: "all",
    severity: "all",
    commitVer: "all",
    search: "",
  })
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "date",
    direction: "desc",
  })
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editTestCase, setEditTestCase] = useState<TestCase | null>(null)
  const [editForm, setEditForm] = useState<Partial<TestCase>>({})
  const [loading, setLoading] = useState(true)
  const [viewFeedbackModalOpen, setViewFeedbackModalOpen] = useState(false)
  const [viewFeedbackText, setViewFeedbackText] = useState<string | null>(null)

  const testerOrder = ["Suzanne Esplana", "Adrian Sevilla", "Allyza Rose"]
  const getTesterOrderIndex = (name: string) => {
    const idx = testerOrder.indexOf(name)
    return idx === -1 ? 999 : idx
  }

  // Fetch test cases from API
  const fetchTestCases = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/feedback/display")
      if (!res.ok) throw new Error("Failed to fetch test cases")
      const data: Array<Record<string, unknown>> = await res.json()
      if (Array.isArray(data)) {
        const mapped = data.map((tc): TestCase => ({
          id: tc.id as number,
          testerName: tc.tester_name as string,
          date: tc.date as string,
          testCaseTitle: tc.test_case_title as string,
          description: tc.description as string,
          stepsToReproduce: tc.steps_to_reproduce as string,
          expectedResult: tc.expected_result as string,
          actualResult: tc.actual_result as string,
          category: tc.category as string,
          severity: tc.severity as string,
          commitVer: tc.commit_ver as string,
          feedback: tc.ally_action as string,
          module: tc.module as string,
          personalNotes: tc.personal_notes as string,
        }))
        setTestCases(mapped)
        setFilteredTestCases(mapped)
      } else {
        setTestCases([])
        setFilteredTestCases([])
      }
    } catch {
      setTestCases([])
      setFilteredTestCases([])
    }
    setLoading(false)
  }

  useEffect(() => { 
    fetchTestCases()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      fetchTestCases()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let result = [...testCases]

    if (filters.category !== "all") {
      result = result.filter((testCase) => testCase.category === filters.category)
    }

    if (filters.severity !== "all") {
      result = result.filter((testCase) => testCase.severity === filters.severity)
    }

    if (filters.commitVer !== "all") {
      result = result.filter((testCase) => testCase.commitVer === filters.commitVer)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (testCase) =>
          testCase.testCaseTitle.toLowerCase().includes(searchLower) ||
          testCase.description.toLowerCase().includes(searchLower) ||
          testCase.testerName.toLowerCase().includes(searchLower),
      )
    }

    result.sort((a, b) => {
      if (sortConfig.key === "testerName") {
        const aIdx = getTesterOrderIndex(a.testerName)
        const bIdx = getTesterOrderIndex(b.testerName)
        if (aIdx < bIdx) return sortConfig.direction === "asc" ? -1 : 1
        if (aIdx > bIdx) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      }
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]
      if (aValue == null && bValue == null) return 0
      if (aValue == null) return 1
      if (bValue == null) return -1
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })

    setFilteredTestCases(result)
  }, [filters, testCases, sortConfig])

  const handleFilterChange = (field: string, value: string) => {
    setFilters({
      ...filters,
      [field]: value,
    })
  }

  const handleSort = (key: keyof TestCase) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    })
  }

  const handleEdit = (testCase: TestCase) => {
    setEditTestCase(testCase)
    setEditForm({
      ...testCase,
      category: testCase.category || "",
      severity: testCase.severity || "",
      commitVer: testCase.commitVer || "",
      module: testCase.module || "", 
    })
    setEditModalOpen(true)
  }

  const handleEditFormChange = (field: keyof TestCase, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleEditSubmit = async () => {
    if (!editTestCase) return
    try {
      const res = await fetch(`/api/feedback/display/${editTestCase.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })
      if (!res.ok) throw new Error("Failed to update test case")
      setTestCases((prev) =>
        prev.map((tc) => (tc.id === editTestCase.id ? { ...tc, ...editForm } as TestCase : tc))
      )
      setEditModalOpen(false)
      setEditTestCase(null)
    } catch {

    }
  }

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Test Cases")

    worksheet.columns = [
      { header: "ID", key: "id", width: 15 },
      { header: "Tester Name", key: "testerName", width: 20 },
      { header: "Date", key: "date", width: 18 },
      { header: "Test Case Title", key: "testCaseTitle", width: 25 },
      { header: "Description", key: "description", width: 30 },
      { header: "Steps To Reproduce", key: "stepsToReproduce", width: 30 },
      { header: "Expected Result", key: "expectedResult", width: 25 },
      { header: "Actual Result", key: "actualResult", width: 25 },
      { header: "Category", key: "category", width: 15 },
      { header: "Severity", key: "severity", width: 15 },
      { header: "Commit Version", key: "commitVer", width: 15 },
      { header: "Feedback", key: "feedback", width: 15 },
    ]

    filteredTestCases.forEach((testCase) => {
      worksheet.addRow(testCase)
    })

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "test_cases.xlsx"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportSingleTestCase = async (testCase: TestCase) => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Test Case")

    worksheet.columns = [
      { header: "ID", key: "id", width: 15 },
      { header: "Tester Name", key: "testerName", width: 20 },
      { header: "Date", key: "date", width: 18 },
      { header: "Test Case Title", key: "testCaseTitle", width: 25 },
      { header: "Description", key: "description", width: 30 },
      { header: "Steps To Reproduce", key: "stepsToReproduce", width: 30 },
      { header: "Expected Result", key: "expectedResult", width: 25 },
      { header: "Actual Result", key: "actualResult", width: 25 },
      { header: "Category", key: "category", width: 15 },
      { header: "Severity", key: "severity", width: 15 },
      { header: "Commit Version", key: "commitVer", width: 15 },
      { header: "Feedback", key: "feedback", width: 15 },
    ]

    worksheet.addRow(testCase)

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `test_case_${testCase.id}.xlsx`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const clearAllFilters = () => {
    setFilters({
      category: "all",
      severity: "all",
      commitVer: "all",
      search: "",
    })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600/70 text-white"
      case "high":
        return "bg-orange-500/70 text-white"
      case "medium":
        return "bg-yellow-500/70 text-black"
      case "low":
        return "bg-green-500/70 text-white"
      default:
        return "bg-purple-500/70 text-white"
    }
  }

  const getFeedbackColor = (feedback: string) => {
    const normalized = (feedback || "").trim().toLowerCase();
    switch (normalized) {
      case "not-valid":
        return "bg-red-600/70 text-white"
      case "processing":
        return "bg-yellow-500/70 text-black"
      case "resolved":
        return "bg-green-600/70 text-white"
      case "known-issue":
        return "bg-blue-600/70 text-white"
      default:
        return "bg-purple-500/70 text-white"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "ui":
        return "bg-blue-500/70 text-white"
      case "functionality":
        return "bg-purple-600/70 text-white"
      case "performance":
        return "bg-amber-500/70 text-white"
      case "security":
        return "bg-red-500/70 text-white"
      case "usability":
        return "bg-teal-500/70 text-white"
      case "compatibility":
        return "bg-indigo-500/70 text-white"
      default:
        return "bg-gray-500/70 text-white"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-purple-900 p-4 md:p-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-black/30 backdrop-blur-md border-purple-500/20 shadow-xl mb-6">
          <CardHeader className="border-b border-purple-500/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl text-white">Filed Issues Management</CardTitle>
                <CardDescription className="text-purple-500">
                  View, filter, and manage all issue submissions
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-purple-500/30 text-purple-500 hover:bg-purple-900/30"
                  asChild
                >
                  <Link href="/feedback">Back to Form</Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-purple-500/30 text-purple-500 hover:bg-purple-900/30"
                  onClick={exportToExcel}
                  disabled={filteredTestCases.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-purple-400" />
                  <Input
                    placeholder="Search test cases..."
                    className="pl-8 bg-white/10 border-purple-500/30 text-white"
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
                  <SelectTrigger className="bg-white/10 border-purple-500/30 text-purple-500">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="ui">UI</SelectItem>
                    <SelectItem value="functionality">Functionality</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="usability">Usability</SelectItem>
                    <SelectItem value="compatibility">Compatibility</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={filters.severity} onValueChange={(value) => handleFilterChange("severity", value)}>
                  <SelectTrigger className="bg-white/10 border-purple-500/30 text-white">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={filters.commitVer} onValueChange={(value) => handleFilterChange("commitVer", value)}>
                  <SelectTrigger className="bg-white/10 border-purple-500/30 text-white">
                    <SelectValue placeholder="Commit Version" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Commits</SelectItem>
                    {/* Optionally, dynamically generate commit versions */}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="text-purple-500">
                {filteredTestCases.length} test case{filteredTestCases.length !== 1 && "s"} found
              </div>
              {(filters.category !== "all" ||
                filters.severity !== "all" ||
                filters.commitVer !== "all" ||
                filters.search) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-500/30 text-purple-500 hover:bg-purple-900/30"
                  onClick={clearAllFilters}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>

            {filteredTestCases.length === 0 ? (
              <div className="text-center py-12 text-purple-300">
                {loading ? (
                  <span className="flex flex-col items-center justify-center gap-4">
                    <span
                      className="animate-[pulse_0.9s_cubic-bezier(0.4,0,0.6,1)_infinite] scale-110"
                      style={{
                        display: "inline-flex",
                        color: "#a78bfa",
                        fontSize: "4rem",
                        filter: "drop-shadow(0 0 16px #a78bfa88)",
                      }}
                    >
                      <RiRobot2Fill />
                    </span>
                    <span className="text-purple-400 font-semibold text-lg">Fetching test cases...</span>
                  </span>
                ) : (
                  testCases.length === 0
                    ? "No test cases have been submitted yet. Go to the form page to add some."
                    : "No test cases match your current filters."
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-purple-900/40 rounded-lg text-purple-500 font-medium text-sm">
                  <div
                    className="col-span-3 flex items-center cursor-pointer"
                    onClick={() => handleSort("testCaseTitle")}
                  >
                    Test Case
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                  <div className="col-span-2 flex items-center cursor-pointer" onClick={() => handleSort("testerName")}> 
                    Tester
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                  <div className="col-span-2 flex items-center cursor-pointer" onClick={() => handleSort("date")}> 
                    Date
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                  <div className="col-span-2">Details</div>
                  <div className="col-span-1 flex items-center">Feedback</div>
                  <div className="col-span-2 flex items-center justify-end">Actions</div>
                </div>
                {filteredTestCases.map((testCase) => (
                  <div
                    key={testCase.id}
                    className="grid grid-cols-12 gap-4 px-4 py-3 bg-black/20 backdrop-blur-md border border-purple-500/20 rounded-lg text-white"
                  >
                    <div className="col-span-3">
                      <div className="font-medium">{testCase.testCaseTitle}</div>
                      <div className="flex gap-1 mt-1 items-center">
                        <Badge className={getCategoryColor(testCase.category)}>{testCase.category}</Badge>
                        <Badge className={getSeverityColor(testCase.severity)}>{testCase.severity}</Badge>
                        <Badge className={getFeedbackColor(testCase.feedback || "")}>
                          {testCase.feedback && testCase.feedback.trim() && testCase.feedback.trim().toLowerCase() !== "pending"
                            ? testCase.feedback.trim()
                            : "Pending"}
                        </Badge>
                      </div>
                    </div>
                    <div className="col-span-2 text-purple-500">{testCase.testerName}</div>
                    <div className="col-span-2 text-purple-500">{testCase.date}</div>
                    <div className="col-span-2">
                      <details className="text-sm text-purple-500">
                        <summary className="cursor-pointer hover:text-white">View Details</summary>
                        <div className="mt-2 space-y-1 pl-2 border-l border-purple-500/30">
                          <p>
                            <span className="font-medium">Test Case:</span> {testCase.testCaseTitle}
                          </p>
                          <p>
                            <span className="font-medium">Description:</span> {testCase.description}
                          </p>
                          <p>
                            <span className="font-medium">Steps:</span> {testCase.stepsToReproduce}
                          </p>
                          <p>
                            <span className="font-medium">Expected:</span> {testCase.expectedResult}
                          </p>
                          <p>
                            <span className="font-medium">Actual:</span> {testCase.actualResult}
                          </p>
                          <p>
                            <span className="font-medium">Module:</span> {testCase.module}</p>
                          <p>
                            <span className="font-medium">Commit Version:</span> {testCase.commitVer}
                          </p>
                        </div>
                      </details>
                    </div>
                    <div className="col-span-1 flex flex-col items-start justify-center">
                      <Badge className={getFeedbackColor(testCase.feedback || "")}> 
                        {testCase.feedback && testCase.feedback.trim() && testCase.feedback.trim().toLowerCase() !== "pending"
                          ? testCase.feedback.trim()
                          : "Pending"}
                      </Badge>
                      {!!testCase.personalNotes && !!testCase.personalNotes.trim() && (
                        <span
                          className="mt-1 text-purple-400 underline text-sm cursor-pointer hover:text-purple-300"
                          onClick={() => {
                            setViewFeedbackText(testCase.personalNotes || "")
                            setViewFeedbackModalOpen(true)
                          }}
                        >
                          View Note
                        </span>
                      )}
                    </div>
                    <div className="col-span-2 flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-purple-500/30 text-purple-500 hover:bg-purple-900/30"
                        onClick={() => exportSingleTestCase(testCase)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-blue-500/30 text-blue-400 hover:bg-blue-900/30"
                        onClick={() => handleEdit(testCase)}
                      >
                        <Pen className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {viewFeedbackModalOpen && (
              <Modal open={viewFeedbackModalOpen} onClose={() => setViewFeedbackModalOpen(false)}>
                <div>
                  <h2 className="text-xl font-bold mb-4 text-white">Personal Feedback</h2>
                  <div className="mb-6 text-purple-200 whitespace-pre-line break-words">
                    {viewFeedbackText}
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      className="border-purple-500/30 text-purple-500"
                      onClick={() => setViewFeedbackModalOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </Modal>
            )}
            {editModalOpen && editTestCase && (
              <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
                <div>
                  <h2 className="text-xl font-bold mb-2 text-white">{editTestCase.testCaseTitle}</h2>
                  <div className="mb-2 text-sm text-purple-300">
                    <span className="font-semibold text-purple-400">Tester:</span> {editTestCase.testerName} <br />
                    <span className="font-semibold text-purple-400">Date:</span> {editTestCase.date}
                  </div>
                  <div className="mb-2">
                    <Badge className={getCategoryColor(editTestCase.category)}>{editTestCase.category}</Badge>
                    <Badge className={getSeverityColor(editTestCase.severity) + " ml-1"}>{editTestCase.severity}</Badge>
                    <Badge className={getFeedbackColor(editTestCase.feedback || "") + " ml-1"}>
                      {editTestCase.feedback && editTestCase.feedback.trim() && editTestCase.feedback.trim().toLowerCase() !== "pending"
                        ? editTestCase.feedback.trim()
                        : "Pending"}
                    </Badge>
                  </div>
                  <div className="mb-4">
                    <div className="mb-1 text-purple-200">
                      <span className="font-semibold text-purple-400">Description:</span> {editTestCase.description}
                    </div>
                    <div className="mb-1 text-purple-200">
                      <span className="font-semibold text-purple-400">Steps to Reproduce:</span> {editTestCase.stepsToReproduce}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block font-semibold mb-1 text-purple-400">Test Case Title</label>
                    <Input
                      className="bg-black/40 border-purple-500/30 text-white"
                      value={editForm.testCaseTitle || ""}
                      onChange={e => handleEditFormChange("testCaseTitle", e.target.value)}
                      placeholder="Test Case Title"
                    />
                  </div>
                  {/* Expected/Actual Result side by side */}
                  <div className="mb-4 flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block font-semibold mb-1 text-purple-400">Expected Result</label>
                      <Input
                        className="bg-black/40 border-purple-500/30 text-white"
                        value={editForm.expectedResult || ""}
                        onChange={e => handleEditFormChange("expectedResult", e.target.value)}
                        placeholder="Expected Result"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block font-semibold mb-1 text-purple-400">Actual Result</label>
                      <Input
                        className="bg-black/40 border-purple-500/30 text-white"
                        value={editForm.actualResult || ""}
                        onChange={e => handleEditFormChange("actualResult", e.target.value)}
                        placeholder="Actual Result"
                      />
                    </div>
                  </div>
                  {/* Category, Severity, Status in one row */}
                  <div className="mb-4 flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block font-semibold mb-1 text-purple-400">Category</label>
                      <Select
                        value={editForm.category || ""}
                        onValueChange={value => handleEditFormChange("category", value)}
                      >
                        <SelectTrigger className="bg-black/40 border-purple-500/30 text-white">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-purple-500/30 text-white">
                          <SelectItem value="ui">UI</SelectItem>
                          <SelectItem value="functionality">Functionality</SelectItem>
                          <SelectItem value="performance">Performance</SelectItem>
                          <SelectItem value="security">Security</SelectItem>
                          <SelectItem value="usability">Usability</SelectItem>
                          <SelectItem value="compatibility">Compatibility</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <label className="block font-semibold mb-1 text-purple-400">Severity</label>
                      <Select
                        value={editForm.severity || ""}
                        onValueChange={value => handleEditFormChange("severity", value)}
                      >
                        <SelectTrigger className="bg-black/40 border-purple-500/30 text-white">
                          <SelectValue placeholder="Severity" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-purple-500/30 text-white">
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <label className="block font-semibold mb-1 text-purple-400">Commit Version</label>
                      <Input
                        className="bg-black/40 border-purple-500/30 text-white"
                        value={editForm.commitVer || ""}
                        onChange={e => handleEditFormChange("commitVer", e.target.value)}
                        placeholder="Write the commit version youre working on. (e.g Branch Name | Commit title)."
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block font-semibold mb-1 text-purple-400">Module</label>
                    <Input
                      className="bg-black/40 border-purple-500/30 text-white"
                      value={editForm.module || ""}
                      onChange={e => handleEditFormChange("module", e.target.value)}
                      placeholder="Module"
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Button
                      variant="outline"
                      className="border-purple-500/30 text-purple-500"
                      onClick={() => setEditModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-purple-700 text-white"
                      onClick={handleEditSubmit}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </Modal>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
