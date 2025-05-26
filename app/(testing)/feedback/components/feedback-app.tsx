"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { Download, ListFilter, Loader2 } from "lucide-react"
import ExcelJS from "exceljs"
import Link from "next/link"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { RiRobot2Fill } from "react-icons/ri"

export type TestCase = {
  id: number
  testerName: string
  testCaseTitle: string
  description: string
  stepsToReproduce: string
  expectedResult: string
  actualResult: string
  category: string
  severity: string
  commitVer: string
  date: string
  module: string
}

export default function TestCaseFeedback() {
  const [testCases, setTestCases] = useState<TestCase[]>([])
  const [formData, setFormData] = useState({
    testerName: "",
    testCaseTitle: "",
    description: "",
    stepsToReproduce: "",
    expectedResult: "",
    actualResult: "",
    category: "",
    severity: "",
    commitVer: "",
    module: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [testerNameSelect, setTesterNameSelect] = useState<string>("")
  const [customTesterName, setCustomTesterName] = useState<string>("") 

  useEffect(() => {
    const storedTestCases = localStorage.getItem("testCases")
    if (storedTestCases) {
      setTestCases(JSON.parse(storedTestCases))
    }
  }, [])

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const now = new Date()
    const formattedDate = format(now, "PPP")
    const newTestCase = {
      ...formData,
      commitVer: formData.commitVer.trim() === "" ? "Not provided" : formData.commitVer,
      date: formattedDate,
      id: Date.now(),
    }

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTestCase),
      })
      if (!res.ok) throw new Error("Failed to submit")
      toast.success("Test case submitted successfully!")

      setTestCases(prev => {
        const updated = [...prev, newTestCase]
        localStorage.setItem("testCases", JSON.stringify(updated))
        return updated
      })

      setFormData({
        testerName: "",
        testCaseTitle: "",
        description: "",
        stepsToReproduce: "",
        expectedResult: "",
        actualResult: "",
        category: "",
        severity: "",
        commitVer: "",
        module: "",
      })
    } catch {
      toast.error("Failed to submit issue.")
    }

    setSubmitting(false)
  }

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Test Cases")

    worksheet.columns = [
      { header: "ID", key: "id", width: 15 },
      { header: "Tester Name", key: "testerName", width: 20 },
      { header: "Test Case Title", key: "testCaseTitle", width: 25 },
      { header: "Description", key: "description", width: 30 },
      { header: "Steps To Reproduce", key: "stepsToReproduce", width: 30 },
      { header: "Expected Result", key: "expectedResult", width: 25 },
      { header: "Actual Result", key: "actualResult", width: 25 },
      { header: "Category", key: "category", width: 15 },
      { header: "Severity", key: "severity", width: 15 },
      { header: "Commit Version", key: "commitVer", width: 30 },
      { header: "Date", key: "date", width: 18 },
      { header: "Module", key: "module", width: 20 },
    ]

    testCases.forEach((testCase) => {
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

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-black to-purple-900 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-black/30 backdrop-blur-md border-purple-500/20 shadow-xl">
            <CardHeader className="border-b border-purple-500/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl text-white">Feedback (Freestyle Testing)</CardTitle>
                  <CardDescription className="text-purple-200">
                    File your issues/bugs and export them to Excel
                  </CardDescription>
                </div>
                <Button variant="outline" className="border-purple-500/30 text-purple-500 hover:bg-purple-900/30" asChild>
                  <Link href="/feedback/manage-cases">
                    <ListFilter className="mr-2 h-4 w-4" />
                    View All Cases
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="testerName" className="text-purple-200">
                      Tester Name
                    </Label>
                    <Select
                      value={testerNameSelect}
                      onValueChange={(value) => {
                        setTesterNameSelect(value)
                        if (value === "other") {
                          setFormData({ ...formData, testerName: customTesterName })
                        } else {
                          setFormData({ ...formData, testerName: value })
                        }
                      }}
                      required
                    >
                      <SelectTrigger className="bg-white/10 border-purple-500/30 text-white">
                        <SelectValue placeholder="Select tester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Suzanne Esplana">Suzanne Esplana</SelectItem>
                        <SelectItem value="Adrian Sevilla">Adrian Sevilla</SelectItem>
                        <SelectItem value="Allyza Rose">Allyza Rose</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {testerNameSelect === "other" && (
                      <Input
                        id="customTesterName"
                        placeholder="Enter your name"
                        className="bg-white/10 border-purple-500/30 text-white mt-2"
                        value={customTesterName}
                        onChange={e => {
                          setCustomTesterName(e.target.value)
                          setFormData({ ...formData, testerName: e.target.value })
                        }}
                        required
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="module" className="text-purple-200">
                      Module
                    </Label>
                    <Input
                      id="module"
                      placeholder="Enter module name with url (e.g Signup Page: /signup)"
                      className="bg-white/10 border-purple-500/30 text-white"
                      value={formData.module}
                      onChange={(e) => handleChange("module", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="testCaseTitle" className="text-purple-200">
                    Issue Title
                  </Label>
                  <Input
                    id="testCaseTitle"
                    placeholder="Make the title clear and specific. It should TL;DR the issue for easy tracking."
                    className="bg-white/10 border-purple-500/30 text-white"
                    value={formData.testCaseTitle}
                    onChange={(e) => handleChange("testCaseTitle", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-purple-200">
                      Category
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => handleChange("category", value)} required>
                      <SelectTrigger className="bg-white/10 border-purple-500/30 text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ui">UI</SelectItem>
                        <SelectItem value="functionality">Functionality</SelectItem>
                        <SelectItem value="performance">Performance</SelectItem>
                        <SelectItem value="broken links">Broken Links</SelectItem>
                        <SelectItem value="usability">Usability</SelectItem>
                        <SelectItem value="suggestion">Suggestion</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="severity" className="text-purple-200">
                      Severity
                    </Label>
                    <Select value={formData.severity} onValueChange={(value) => handleChange("severity", value)} required>
                      <SelectTrigger className="bg-white/10 border-purple-500/30 text-white">
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commitVer" className="text-purple-200">
                      Commit Version
                    </Label>
                    <Input
                      id="commitVer"
                      placeholder="e.g Branch Name | Commit title."
                      className="bg-white/10 border-purple-500/30 text-white"
                      value={formData.commitVer}
                      onChange={(e) => handleChange("commitVer", e.target.value)}
                    />
                    <p className="text-gray-400 text-xs">Skip this field in deployed environment tests</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-purple-200">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the test case"
                    className="bg-white/10 border-purple-500/30 text-white min-h-[80px]"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stepsToReproduce" className="text-purple-200">
                    Steps to Reproduce
                  </Label>
                  <Textarea
                    id="stepsToReproduce"
                    placeholder="List the steps to reproduce"
                    className="bg-white/10 border-purple-500/30 text-white min-h-[80px]"
                    value={formData.stepsToReproduce}
                    onChange={(e) => handleChange("stepsToReproduce", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="expectedResult" className="text-purple-200">
                      Expected Result
                    </Label>
                    <Textarea
                      id="expectedResult"
                      placeholder="What should happen"
                      className="bg-white/10 border-purple-500/30 text-white min-h-[80px]"
                      value={formData.expectedResult}
                      onChange={(e) => handleChange("expectedResult", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="actualResult" className="text-purple-200">
                      Actual Result
                    </Label>
                    <Textarea
                      id="actualResult"
                      placeholder="What actually happened"
                      className="bg-white/10 border-purple-500/30 text-white min-h-[80px]"
                      value={formData.actualResult}
                      onChange={(e) => handleChange("actualResult", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-purple-500/20 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="border-purple-500/30 text-purple-500 hover:bg-purple-900/30"
                  onClick={exportToExcel}
                  disabled={testCases.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export to Excel
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white" disabled={submitting}>
                  {submitting ? (
                    <span className="flex items-center">
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <RiRobot2Fill className="mr-2 h-5 w-5 text-purple-200" />
                      Submit Issue
                    </span>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {testCases.length > 0 && (
            <Card className="mt-8 bg-black/30 backdrop-blur-md border-purple-500/20 shadow-xl">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl text-white">Recent Submissions ({testCases.length})</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-purple-500/30 text-purple-500 hover:bg-purple-900/30"
                    asChild
                  >
                    <Link href="/feedback/manage-cases">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testCases
                    .slice(-3)
                    .reverse()
                    .map((testCase) => (
                      <div key={testCase.id} className="p-4 rounded-lg bg-purple-900/30 border border-purple-500/20">
                        <div className="flex justify-between mb-2">
                          <h3 className="font-medium text-white">{testCase.testCaseTitle}</h3>
                          <div className="flex gap-2">
                            <span className="px-2 py-1 text-xs rounded-full bg-purple-700/50 text-purple-100">
                              {testCase.category}
                            </span>
                            <span className="px-2 py-1 text-xs rounded-full bg-purple-700/50 text-purple-100">
                              {testCase.severity}
                            </span>
                            <span
                              className="px-2 py-1 text-xs rounded-full bg-blue-700/50 text-blue-100"
                            >
                              {testCase.commitVer}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-purple-200">
                          <p>
                            <span className="font-medium">Tester:</span> {testCase.testerName}
                          </p>
                          <p>
                            <span className="font-medium">Date:</span> {testCase.date}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  )
}
