/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

const COURSE_OPTIONS = [
  "BS- Information Technology",
  "BS- Hospitality Management",
  "BS- Business Administrator",
  "BS- Tourism",
  "ABM",
  "HUMSS",
  "IT Mobile app and Web Development",
]

const YEAR_OPTIONS = [
  { value: "4th Yr", label: "4th Yr" },
  { value: "Grade 12", label: "Grade 12" },
]

const STATUS_OPTIONS = [
  { value: "new", label: "Not Applied" },
  { value: "shortlisted", label: "Seeking Jobs" },
  { value: "interview scheduled", label: "In Progress" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
]

export default function EditStudentDetailsModal({
  open,
  onClose,
  student,
  onSave,
}: {
  open: boolean
  onClose: () => void
  student: any
  onSave?: (data: any) => void
}) {
  const [form, setForm] = useState({
    id: student?.id ?? "",
    full_name: student?.full_name ?? "",
    email: student?.email ?? "",
    student_id: student?.student_id ?? "",
    year_level: student?.year_level ?? "",
    section: student?.section ?? "",
    course: student?.course ?? "",
    ojt_status: student?.ojt_status ?? student?.status ?? "", // Add ojt_status
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    const res = await fetch("/api/superadmin/coordinators/updateDetails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const result = await res.json()
    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      if (onSave) onSave(form)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit OJT Student</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div>
            <Label>Full Name</Label>
            <Input
              value={form.full_name}
              onChange={(e) => handleChange("full_name", e.target.value)}
              placeholder="Full Name"
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Email"
              type="email"
            />
          </div>
          <div>
            <Label>Student ID</Label>
            <Input
              value={form.student_id}
              onChange={(e) => handleChange("student_id", e.target.value)}
              placeholder="Student ID"
            />
          </div>
          <div>
            <Label>Year Level</Label>
            <Select value={form.year_level} onValueChange={(v) => handleChange("year_level", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select year level" />
              </SelectTrigger>
              <SelectContent>
                {YEAR_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Section</Label>
            <Input
              value={form.section}
              onChange={(e) => handleChange("section", e.target.value)}
              placeholder="Section"
            />
          </div>
          <div>
            <Label>Course</Label>
            <Select value={form.course} onValueChange={(v) => handleChange("course", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {COURSE_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={form.ojt_status} onValueChange={(v) => handleChange("ojt_status", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
