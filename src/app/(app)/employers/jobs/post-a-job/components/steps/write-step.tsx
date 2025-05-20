"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, FileText, ListChecks, FileEdit, Lightbulb, ClipboardList } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent } from "../ui/card"
import type { JobPostingData } from "../../lib/types"
import { TextField } from "@mui/material"

interface WriteStepProps {
  formData: JobPostingData
  updateFormData: (data: Partial<JobPostingData>) => void
  errors: Record<string, boolean>
  setErrors: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
}

export function WriteStep({ formData, updateFormData, errors, setErrors }: WriteStepProps) {
  const [mustHaves, setMustHaves] = useState<string[]>(
    formData.mustHaveQualifications.length ? formData.mustHaveQualifications : [""],
  )

  const [niceToHaves, setNiceToHaves] = useState<string[]>(
    formData.niceToHaveQualifications.length ? formData.niceToHaveQualifications : [""],
  )

  const [responsibilities, setResponsibilities] = useState<string[]>(
    formData.responsibilities?.length ? formData.responsibilities : [""],
  )

  const handleMustHaveChange = (index: number, value: string) => {
    const newMustHaves = [...mustHaves]
    newMustHaves[index] = value
    setMustHaves(newMustHaves)
    updateFormData({ mustHaveQualifications: newMustHaves })
  }

  const handleNiceToHaveChange = (index: number, value: string) => {
    const newNiceToHaves = [...niceToHaves]
    newNiceToHaves[index] = value
    setNiceToHaves(newNiceToHaves)
    updateFormData({ niceToHaveQualifications: newNiceToHaves })
  }

  const handleResponsibilityChange = (index: number, value: string) => {
    const newResponsibilities = [...responsibilities]
    newResponsibilities[index] = value
    setResponsibilities(newResponsibilities)
    updateFormData({ responsibilities: newResponsibilities })
    setErrors((prevErrors) => ({
      ...prevErrors,
      responsibilities: false,
    }))
  }

  const addMustHave = () => {
    setMustHaves([...mustHaves, ""])
  }

  const addNiceToHave = () => {
    setNiceToHaves([...niceToHaves, ""])
  }

  const addResponsibility = () => {
    setResponsibilities([...responsibilities, ""])
  }

  const removeMustHave = (index: number) => {
    if (mustHaves.length > 1) {
      const newMustHaves = mustHaves.filter((_, i) => i !== index)
      setMustHaves(newMustHaves)
      updateFormData({ mustHaveQualifications: newMustHaves })
    }
  }

  const removeNiceToHave = (index: number) => {
    if (niceToHaves.length > 1) {
      const newNiceToHaves = niceToHaves.filter((_, i) => i !== index)
      setNiceToHaves(newNiceToHaves)
      updateFormData({ niceToHaveQualifications: newNiceToHaves })
    }
  }

  const removeResponsibility = (index: number) => {
    if (responsibilities.length > 1) {
      const newResponsibilities = responsibilities.filter((_, i) => i !== index)
      setResponsibilities(newResponsibilities)
      updateFormData({ responsibilities: newResponsibilities })
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 pb-2 border-b border-gray-100">
        <div className="bg-blue-100 p-2 rounded-full">
          <FileEdit className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Write about your job</h2>
      </div>

      <div className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white p-5 rounded-xl flex items-center justify-between shadow-md">
        <div className="flex items-start gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <p className="text-sm">Write clear, detailed job descriptions with AI based on your job title.</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full border-none shadow-lg">
          Smart Writer
        </Button>
      </div>

      <div className="space-y-6">
        <Card className="border-gray-200 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <Label htmlFor="jobDescription" className="font-medium text-gray-700">
                Job description
              </Label>
            </div>
            <div className="border-b border-gray-200">
              <TextField
                id="jobDescription"
                value={formData.jobDescription}
                onChange={(e) => updateFormData({ jobDescription: e.target.value })}
                multiline
                rows={6}
                variant="outlined"
                fullWidth
                placeholder="Describe the responsibilities, requirements, and benefits of the job..."
                InputProps={{
                  style: {
                    fontFamily: "Roboto, Arial, sans-serif",
                    fontSize: "14px",
                    color: "#333",
                  },
                }}
                error={errors.jobDescription}
                helperText={errors.jobDescription ? "Job description is required." : ""}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium text-gray-800">Responsibilities</h3>
            </div>
            <motion.div className="space-y-2" layout>
              {responsibilities.map((item, index) => (
                <motion.div
                  key={`responsibility-${index}`}
                  className="flex gap-2 items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <TextField
                    value={item}
                    onChange={(e) => handleResponsibilityChange(index, e.target.value)}
                    placeholder="e.g. Lead a team of developers"
                    variant="outlined"
                    fullWidth
                    size="small"
                    error={errors.responsibilities && !item.trim()}
                    helperText={
                      errors.responsibilities && !item.trim()
                        ? "At least one responsibility is required."
                        : ""
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeResponsibility(index)}
                    disabled={responsibilities.length === 1}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </Button>
                </motion.div>
              ))}
            </motion.div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addResponsibility}
              className="mt-3 border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <Plus size={16} className="mr-1" /> Add responsibility
            </Button>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <ListChecks className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium text-gray-800">Qualifications</h3>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700">Must-haves</h4>
                  <div className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Required</div>
                </div>
                <motion.div className="space-y-2" layout>
                  {mustHaves.map((item, index) => (
                    <motion.div
                      key={`must-${index}`}
                      className="flex gap-2 items-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TextField
                        value={item}
                        onChange={(e) => handleMustHaveChange(index, e.target.value)}
                        placeholder="e.g. 2+ years of experience with React"
                        variant="outlined"
                        fullWidth
                        size="small"
                        error={errors.mustHaveQualifications && !item.trim()}
                        helperText={
                          errors.mustHaveQualifications && !item.trim()
                            ? "At least one must-have qualification is required."
                            : ""
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMustHave(index)}
                        disabled={mustHaves.length === 1}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addMustHave}
                  className="mt-3 border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Plus size={16} className="mr-1" /> Add must-have
                </Button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700">Nice-to-haves</h4>
                  <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Optional</div>
                </div>
                <motion.div className="space-y-2" layout>
                  {niceToHaves.map((item, index) => (
                    <motion.div
                      key={`nice-${index}`}
                      className="flex gap-2 items-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TextField
                        value={item}
                        onChange={(e) => handleNiceToHaveChange(index, e.target.value)}
                        placeholder="e.g. Experience with TypeScript"
                        variant="outlined"
                        fullWidth
                        size="small"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeNiceToHave(index)}
                        disabled={niceToHaves.length === 1}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addNiceToHave}
                  className="mt-3 border-green-200 text-green-600 hover:bg-green-50"
                >
                  <Plus size={16} className="mr-1" /> Add nice-to-have
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-blue-500" />
              <Label htmlFor="jobSummary" className="font-medium text-gray-800">
                Job Summary
              </Label>
            </div>
            <TextField
              id="jobSummary"
              value={formData.jobSummary}
              onChange={(e) => updateFormData({ jobSummary: e.target.value })}
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              placeholder="Provide a brief summary of the job..."
              InputProps={{
                style: {
                  fontFamily: "Roboto, Arial, sans-serif",
                  fontSize: "14px",
                  color: "#333",
                },
              }}
              error={errors.jobSummary}
              helperText={errors.jobSummary ? "Job summary is required." : ""}
            />
            <p className="text-xs text-gray-500 mt-2">
              A concise summary helps candidates quickly understand the role and increases application rates.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mt-6">
        <p className="text-sm text-blue-700 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-blue-500" />
          <span className="font-medium">Pro tip:</span> Be specific about qualifications to attract candidates who are
          the right fit for your role.
        </p>
      </div>
    </div>
  )
}
