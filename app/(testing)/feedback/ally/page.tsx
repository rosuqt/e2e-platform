"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Search, ArrowUpDown, Loader2, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import { RiRobot2Fill } from "react-icons/ri"
import ReactECharts from "echarts-for-react"

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div
        className="backdrop-blur-lg bg-black/70 border border-purple-500/30 rounded-xl shadow-2xl max-w-5xl w-full p-8 relative"
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
        {children}
      </div>
    </div>
  )
}

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
  module?: string
  ally_action?: string
}

type CaseNote = {
  note: string
  feedback: string
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
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCase, setSelectedCase] = useState<TestCase | null>(null)
  const [caseNotes, setCaseNotes] = useState<Record<number, CaseNote>>({})
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [breakdownOpen, setBreakdownOpen] = useState(false)
  const [breakdownData, setBreakdownData] = useState<Record<string, number>>({})

  useEffect(() => {
    async function fetchTestCases() {
      setLoading(true)
      try {
        const res = await fetch("/api/feedback/display")
        if (!res.ok) throw new Error("Failed to fetch test cases")
        const data: Array<Record<string, unknown>> = await res.json()
        const mapped = data.map((tc) => ({
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
          module: tc.module as string | undefined,
        }))
        setTestCases(mapped)
        setFilteredTestCases(mapped)
      } catch {
        setTestCases([])
        setFilteredTestCases([])
      }
      setLoading(false)
    }
    fetchTestCases()
    const storedNotes = localStorage.getItem("caseNotes")
    if (storedNotes) {
      const parsed = JSON.parse(storedNotes)
      Object.keys(parsed).forEach((id) => {
        if (parsed[id].status && !parsed[id].feedback) {
          parsed[id].feedback = parsed[id].status
          delete parsed[id].status
        }
      })
      setCaseNotes(parsed)
    }
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
      if (!sortConfig?.key || !sortConfig?.direction) return 0
      let aValue: string | number = ""
      let bValue: string | number = ""
      if (sortConfig.key === "feedback") {
        aValue = caseNotes[a.id]?.feedback || ""
        bValue = caseNotes[b.id]?.feedback || ""
      } else {
        aValue = a[sortConfig.key as keyof TestCase] as string | number
        bValue = b[sortConfig.key as keyof TestCase] as string | number
      }
      if (aValue === undefined || bValue === undefined) return 0
      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })

    setFilteredTestCases(result)
  }, [filters, testCases, sortConfig, caseNotes])

  const handleFilterChange = (field: string, value: string) => {
    setFilters({
      ...filters,
      [field]: value,
    })
  }

  const handleOpenModal = (testCase: TestCase) => {
    setSelectedCase(testCase)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedCase(null)
  }

  const handleNoteChange = (id: number, note: string) => {
    setCaseNotes((prev) => {
      const updated = { ...prev, [id]: { ...prev[id], note } }
      localStorage.setItem("caseNotes", JSON.stringify(updated))
      return updated
    })
  }

  const handleFeedbackChange = async (id: number, feedback: string) => {
    setCaseNotes((prev) => {
      const updated = { ...prev, [id]: { ...prev[id], feedback } }
      localStorage.setItem("caseNotes", JSON.stringify(updated))
      return updated
    })
    try {
      await fetch(`/api/feedback/display/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ally_action: feedback }),
      })
    } catch {
    }
  }

  const handleSave = async () => {
    if (!selectedCase) return
    setSaving(true)
    const id = selectedCase.id
    const feedback = caseNotes[id]?.feedback || ""
    const note = caseNotes[id]?.note || ""
    try {
      await fetch(`/api/feedback/display/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ally_action: feedback, personal_notes: note }),
      })
        
    } catch {}
    setSaving(false)
    handleCloseModal()
  }

  const handleDelete = async () => {
    if (!selectedCase) return
    setSaving(true)
    const id = selectedCase.id
    try {
      await fetch(`/api/feedback/display/${id}`, {
        method: "DELETE",
      })
      setTestCases((prev) => prev.filter((tc) => tc.id !== id))
      setFilteredTestCases((prev) => prev.filter((tc) => tc.id !== id))
      setCaseNotes((prev) => {
        const updated = { ...prev }
        delete updated[id]
        localStorage.setItem("caseNotes", JSON.stringify(updated))
        return updated
      })
    } catch {}
    setSaving(false)
    handleCloseModal()
  }

  const getFeedbackColor = (feedback: string) => {
    switch (feedback) {
      case "not-valid":
        return "bg-red-600/70 text-white"
      case "processing":
        return "bg-yellow-500/70 text-black"
      case "resolved":
        return "bg-green-600/70 text-white"
      case "self-fix":
        return "bg-blue-600/70 text-white"  
      case "known-issue":
        return "bg-red-500/70 text-white"
      default:
        return "bg-purple-500/70 text-white"
    }
  }

  useEffect(() => {
    if (!breakdownOpen) return
    fetch("/api/feedback/breakdown")
      .then((res) => res.json())
      .then((data) => setBreakdownData(data))
      .catch(() => setBreakdownData({}))
  }, [breakdownOpen])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-purple-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-black/30 backdrop-blur-md border-purple-500/20 shadow-xl mb-6">
          <CardHeader className="border-b border-purple-500/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl text-white">Ally Filed Issues Review</CardTitle>
                <CardDescription className="text-purple-500">
                  Review, update feedback, and add personal notes to filed issues
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-purple-500/30 text-purple-500 hover:bg-purple-900/30"
                  onClick={() => setBreakdownOpen(true)}
                >
                  Breakdown
                </Button>
                <Button
                  variant="outline"
                  className="border-purple-500/30 text-purple-500 hover:bg-purple-900/30"
                  asChild
                >
                  <Link href="/feedback">Back to Form</Link>
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
                  <SelectTrigger className="bg-white/10 border-purple-500/30 text-white">
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
                  onClick={() =>
                    setFilters({
                      category: "all",
                      severity: "all",
                      commitVer: "all",
                      search: "",
                    })
                  }
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
                <div className="grid grid-cols-10 gap-4 px-4 py-2 bg-purple-900/40 rounded-lg text-purple-500 font-medium text-sm">
                  <div className="col-span-3 flex items-center cursor-pointer" onClick={() => setSortConfig({
                    key: "testCaseTitle",
                    direction: sortConfig.key === "testCaseTitle" && sortConfig.direction === "asc" ? "desc" : "asc",
                  })}>
                    Test Case
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                  <div className="col-span-2 flex items-center cursor-pointer" onClick={() => setSortConfig({
                    key: "testerName",
                    direction: sortConfig.key === "testerName" && sortConfig.direction === "asc" ? "desc" : "asc",
                  })}>
                    Tester
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                  <div className="col-span-2 flex items-center cursor-pointer" onClick={() => setSortConfig({
                    key: "date",
                    direction: sortConfig.key === "date" && sortConfig.direction === "asc" ? "desc" : "asc",
                  })}>
                    Date
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                  <div className="col-span-2 flex items-center cursor-pointer" onClick={() => setSortConfig({
                    key: "feedback",
                    direction: sortConfig.key === "feedback" && sortConfig.direction === "asc" ? "desc" : "asc",
                  })}>
                    Feedback
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                {filteredTestCases.map((testCase) => (
                  <div
                    key={testCase.id}
                    className="grid grid-cols-10 gap-4 px-4 py-3 bg-black/20 backdrop-blur-md border border-purple-500/20 rounded-lg text-white"
                  >
                    <div className="col-span-3 flex flex-col gap-1 justify-center">
                      <span className="font-medium">{testCase.testCaseTitle}</span>
                      <span className="flex gap-1">
                        <Badge className={getFeedbackColor(caseNotes[testCase.id]?.feedback || testCase.ally_action || "")}>
                          {caseNotes[testCase.id]?.feedback || testCase.ally_action || "Pending"}
                        </Badge>
                        <Badge className="bg-blue-500/70 text-white">{testCase.category}</Badge>
                        <Badge className="bg-purple-500/70 text-white">{testCase.severity}</Badge>
                      </span>
                    </div>
                    <div className="col-span-2 text-purple-500 truncate flex items-center">{testCase.testerName}</div>
                    <div className="col-span-2 text-purple-500 truncate flex items-center">{testCase.date}</div>
                    <div className="col-span-2 flex items-center">
                      <Badge className={getFeedbackColor(caseNotes[testCase.id]?.feedback || testCase.ally_action || "")}>
                        {caseNotes[testCase.id]?.feedback || testCase.ally_action || "Pending"}
                      </Badge>
                    </div>
                    <div className="col-span-1 flex justify-end gap-2 items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-purple-400 hover:bg-purple-900/30"
                        onClick={() => handleOpenModal(testCase)}
                        aria-label="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:bg-red-900/30"
                        onClick={async () => {
                          setSelectedCase(testCase)
                          await handleDelete()
                        }}
                        aria-label="Delete"
                        disabled={saving}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Modal open={breakdownOpen} onClose={() => setBreakdownOpen(false)}>
        <div>
          <h2 className="text-xl font-bold mb-2 text-white">Breakdown of issues</h2>
          <div className="mb-2 text-purple-300">
            This is the breakdown of most filed issue per testers.
          </div>
          {Object.keys(breakdownData).length > 0 && (
            <div className="flex justify-center items-center py-4">
              <div
                className="w-full bg-black/30 rounded-xl p-0 flex flex-col items-center overflow-x-auto"
                style={{ maxWidth: "100vw" }}
              >
                <div style={{ minWidth: 700, width: "100%", maxWidth: 1100, padding: 32 }}>
                  <ReactECharts
                    option={{
                      tooltip: { trigger: "item" },
                      legend: {
                        orient: "horizontal",
                        bottom: 0,
                        left: "center",
                        textStyle: { color: "#fff", fontSize: 14 }
                      },
                      grid: { left: 0, right: 0, top: 0, bottom: 60, containLabel: true },
                      series: [
                        {
                          name: "Test Cases",
                          type: "pie",
                          radius: ["30%", "50%"],
                          avoidLabelOverlap: false,
                          data: Object.entries(breakdownData).map(([name, value]) => ({
                            value,
                            name
                          })),
                          label: {
                            color: "#fff",
                            fontSize: 14,
                            formatter: "{b}: {c} ({d}%)"
                          },
                          labelLine: {
                            length: 20,
                            length2: 20
                          },
                          itemStyle: {
                            borderColor: "#22223b",
                            borderWidth: 2
                          }
                        }
                      ]
                    }}
                    style={{ height: 470, width: "100%", minWidth: 700, maxWidth: 1100, background: "transparent" }}
                    theme="dark"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
      <Modal open={modalOpen} onClose={handleCloseModal}>
        {selectedCase && (
          <div>
            <h2 className="text-xl font-bold mb-2 text-white">{selectedCase.testCaseTitle}</h2>
           <Badge className={getFeedbackColor(caseNotes[selectedCase.id]?.feedback || "") + " ml-1"}>
                {caseNotes[selectedCase.id]?.feedback || "Pending"}
              </Badge>

            <div className="mt-2 mb-2 text-sm text-purple-300">
              <span className="font-semibold text-purple-400">Tester:</span> {selectedCase.testerName} <br />
              <span className="font-semibold text-purple-400">Date:</span> {selectedCase.date}
            </div>
             
            <div className="mb-2 text-sm text-purple-300">
              <span className="font-semibold text-purple-400">Category:</span> {selectedCase.category} <br />
              <span className="font-semibold text-purple-400">Severity:</span> {selectedCase.severity} <br />
              <span className="font-semibold text-purple-400">Commit Version:</span> {selectedCase.commitVer} <br />
              <span className="font-semibold text-purple-400">Module:</span> {selectedCase.module ?? <span className="italic text-gray-400">None</span>}
            </div>
            <div className="mb-4">
              <div className="mb-1 text-purple-200">
                <span className="font-semibold text-purple-400">Description:</span> {selectedCase.description}
              </div>
              <div className="mb-1 text-purple-200">
                <span className="font-semibold text-purple-400">Steps to Reproduce:</span> {selectedCase.stepsToReproduce}
              </div>
              <div className="mb-1 text-purple-200">
                <span className="font-semibold text-purple-400">Expected Result:</span> {selectedCase.expectedResult}
              </div>
              <div className="mb-1 text-purple-200">
                <span className="font-semibold text-purple-400">Actual Result:</span> {selectedCase.actualResult}
              </div>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1 text-purple-400">Feedback</label>
              <Select
                value={caseNotes[selectedCase.id]?.feedback || ""}
                onValueChange={(value) => handleFeedbackChange(selectedCase.id, value)}
              >
                <SelectTrigger className="w-48 bg-black/40 border-purple-500/30 text-white">
                  <SelectValue placeholder="Select feedback" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-purple-500/30 text-white">
                  <SelectItem value="not-valid">Not Valid</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="self-fix">Self Fix</SelectItem>
                  <SelectItem value="known-issue">Known Issue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1 text-purple-400">Personal Note</label>
              <textarea
                className="w-full border border-purple-500/30 bg-black/40 rounded p-2 text-sm text-white placeholder:text-purple-300"
                rows={4}
                placeholder="Write what you did or any notes..."
                value={caseNotes[selectedCase.id]?.note || ""}
                onChange={(e) => handleNoteChange(selectedCase.id, e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button
                variant="outline"
                className="mr-2 border-purple-500/30 text-purple-400 hover:bg-purple-900/30"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Saving...
                  </span>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}