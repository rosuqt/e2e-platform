"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, FileText, ListChecks, FileEdit, Lightbulb } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent } from "../ui/card"
import type { JobPostingData } from "../../lib/types"

interface WriteStepProps {
  formData: JobPostingData
  updateFormData: (data: Partial<JobPostingData>) => void
}

export function WriteStep({ formData, updateFormData }: WriteStepProps) {
  const [mustHaves, setMustHaves] = useState<string[]>(
    formData.mustHaveQualifications.length ? formData.mustHaveQualifications : [""],
  )

  const [niceToHaves, setNiceToHaves] = useState<string[]>(
    formData.niceToHaveQualifications.length ? formData.niceToHaveQualifications : [""],
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

  const addMustHave = () => {
    setMustHaves([...mustHaves, ""])
  }

  const addNiceToHave = () => {
    setNiceToHaves([...niceToHaves, ""])
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
              <div className="bg-gray-50 px-4 py-2 flex gap-3">
                <button className="text-gray-500 hover:text-gray-700 text-sm font-medium px-2 py-1 rounded hover:bg-gray-100 transition-colors">
                  Paragraph
                </button>
                <button className="text-gray-500 hover:text-gray-700 text-sm font-bold px-2 py-1 rounded hover:bg-gray-100 transition-colors">
                  B
                </button>
                <button className="text-gray-500 hover:text-gray-700 text-sm italic px-2 py-1 rounded hover:bg-gray-100 transition-colors">
                  I
                </button>
                <button className="text-gray-500 hover:text-gray-700 text-sm px-2 py-1 rounded hover:bg-gray-100 transition-colors">
                  • Bullet
                </button>
                <button className="text-gray-500 hover:text-gray-700 text-sm px-2 py-1 rounded hover:bg-gray-100 transition-colors">
                  1. Number
                </button>
              </div>
              <Textarea
                id="jobDescription"
                value={formData.jobDescription}
                onChange={(e) => updateFormData({ jobDescription: e.target.value })}
                className="border-0 focus-visible:ring-0 min-h-[200px] p-4 text-gray-700"
                placeholder="Describe the responsibilities, requirements, and benefits of the job..."
              />
            </div>
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
                      <Input
                        value={item}
                        onChange={(e) => handleMustHaveChange(index, e.target.value)}
                        placeholder="e.g. 2+ years of experience with React"
                        className="flex-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
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
                      <Input
                        value={item}
                        onChange={(e) => handleNiceToHaveChange(index, e.target.value)}
                        placeholder="e.g. Experience with TypeScript"
                        className="flex-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
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
            <Textarea
              id="jobSummary"
              value={formData.jobSummary}
              onChange={(e) => updateFormData({ jobSummary: e.target.value })}
              className="min-h-[100px] border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Provide a brief summary of the job..."
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
