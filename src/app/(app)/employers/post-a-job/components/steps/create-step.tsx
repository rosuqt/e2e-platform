"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "../ui/card"
import { Briefcase, MapPin, Globe, Clock, DollarSign, GraduationCap, Lightbulb } from "lucide-react"
import type { JobPostingData } from "../../lib/types"
import MUIDropdown from "../../../../components/MUIDropdown"
import { FreeSolo } from "../../../../components/customSection"
import { jobTitleSections } from "../../lib/jobTitles"
import { TextField } from "@mui/material"
import Checkbox from "@mui/material/Checkbox"
import Autocomplete from "@mui/material/Autocomplete"
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank"
import CheckBoxIcon from "@mui/icons-material/CheckBox"

interface CreateStepProps {
  formData: JobPostingData
  handleFieldChange: <T extends keyof JobPostingData>(field: T, value: JobPostingData[T]) => void
  errors: Record<string, boolean>
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkedIcon = <CheckBoxIcon fontSize="small" />

export function CreateStep({ formData, handleFieldChange, errors }: CreateStepProps) {
  const [showPayAmount, setShowPayAmount] = useState<boolean>(
    formData.payType !== "" && formData.payType !== "No Pay"
  )

  const courses = [
    { title: "BSIT - Bachelor of Science in Information Technology", value: "BSIT" },
    { title: "BSBA - Bachelor of Science in Business Administration", value: "BSBA" },
    { title: "BSHM - Bachelor of Science in Hospitality Management", value: "BSHM" },
    { title: "BSTM - Bachelor of Science in Tourism Management", value: "BSTM" },
  ]

  const recommendedCourses = Array.isArray(formData.recommendedCourse)
    ? formData.recommendedCourse
    : formData.recommendedCourse
        ?.split(", ")
        .map((title) => courses.find((course) => course.title === title))
        .filter(Boolean) || []

  const handleRecommendedCourseChange = (newValue: { title: string; value: string }[]) => {
    handleFieldChange(
      "recommendedCourse",
      newValue.map((course) => course.title).join(", ") 
    )
  }

  const handlePayTypeChange = (value: string) => {
    handleFieldChange("payType", value)
    setShowPayAmount(value !== "" && value !== "No Pay")
    if (value === "No Pay") {
      handleFieldChange("payAmount", "") 
    }
  }

  const validatePayAmount = () => {
    if (showPayAmount && !formData.payAmount) {
      return "Pay amount is required"
    }
    return ""
  }

  const payAmountError = validatePayAmount()

  const commonPayAmounts = {
    Weekly: ["500", "750", "1000", "1500", "2000"],
    Monthly: ["2000", "3000", "4000", "5000", "6000"],
    Yearly: ["30000", "45000", "60000", "75000", "90000", "120000"],
  }

  const workTypes = [
    { value: "OJT", label: "OJT" },
    { value: "Internship", label: "Internship" },
    { value: "Part-time", label: "Part-time" },
    { value: "Full-time", label: "Full-time" },
  ]

  const payTypes = [
    { value: "No Pay", label: "No Pay" },
    { value: "Weekly", label: "Weekly" },
    { value: "Monthly", label: "Monthly" },
    { value: "Yearly", label: "Yearly" },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 pb-2 border-b border-gray-100">
        <div className="bg-blue-100 p-2 rounded-full">
          <Briefcase className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Job Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Title */}
        <Card className="overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
              <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-500" />
                Job Title
              </Label>
            </div>
            <div className="p-4">
              <FreeSolo
                options={Object.values(jobTitleSections).flat()}
                label="Select or type a job title"
                onSelectionChange={(key) => handleFieldChange("jobTitle", key)}
                error={errors.jobTitle}
                errorMessage="Job title is required"
              />
              <p className="text-xs text-gray-500 mt-2">
                Be specific with your job title to attract the right candidates
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
              <Label htmlFor="location" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-500" />
                Location
              </Label>
            </div>
            <div className="p-4">
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleFieldChange("location", e.target.value)}
                className={`border-gray-200 focus:ring-blue-500 ${errors.location ? "border-red-500" : ""}`}
                placeholder="Enter location"
              />
              {errors.location && <p className="text-red-500 text-sm">Location is required</p>}
              <p className="text-xs text-gray-500 mt-2">Enter the primary location where the job will be performed</p>
            </div>
          </CardContent>
        </Card>

        {/* Remote Options */}
        <Card className="overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
              <Label htmlFor="remoteOptions" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-500" />
                Remote Options
              </Label>
            </div>
            <div className="p-4">
              <MUIDropdown
                label="Select a Remote Option"
                options={[
                  { value: "On-site", label: "On-site" },
                  { value: "Hybrid", label: "Hybrid" },
                  { value: "Work from home", label: "Work from home" },
                ]}
                value={formData.remoteOptions || ""}
                onChange={(value) => handleFieldChange("remoteOptions", value)}
                error={errors.remoteOptions} 
                errorMessage="Remote option is required"
              />
              <p className="text-xs text-gray-500 mt-2">Specify the work arrangement for this position</p>
            </div>
          </CardContent>
        </Card>

        {/* Work Type */}
        <Card className="overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
              <Label htmlFor="workType" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                Work Type
              </Label>
            </div>
            <div className="p-4">
              <MUIDropdown
                label="Select a Work Type"
                options={workTypes}
                value={formData.workType}
                onChange={(value) => handleFieldChange("workType", value)}
                error={errors.workType}
              />
              {errors.workType && <p className="text-red-500 text-sm mt-1">Work type is required</p>}
              <p className="text-xs text-gray-500 mt-2">Choose the employment type for this position</p>
            </div>
          </CardContent>
        </Card>

        {/* Compensation */}
        <Card className="overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
              <Label htmlFor="payType" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-500" />
                Compensation
              </Label>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MUIDropdown
                  label="Pay Type"
                  options={payTypes}
                  value={formData.payType}
                  onChange={handlePayTypeChange}
                  error={errors.payType}
                  errorMessage="Pay type is required"
                />

                {showPayAmount && (
                  <>
                    <TextField
                      id="payAmount"
                      label="Pay Amount"
                      value={formData.payAmount}
                      onChange={(e) => handleFieldChange("payAmount", e.target.value)}
                      fullWidth
                      error={!!payAmountError}
                      helperText={payAmountError}
                      variant="outlined"
                    />
                    <MUIDropdown
                      label="Common Amounts"
                      options={
                        formData.payType &&
                        formData.payType !== "No Pay" &&
                        commonPayAmounts[formData.payType as keyof typeof commonPayAmounts]?.map((amount) => ({
                          value: amount,
                          label: amount,
                        })) || []
                      }
                      value={formData.payAmount}
                      onChange={(value) => handleFieldChange("payAmount", value)}
                      error={!!payAmountError}
                    />
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-3">Specify the compensation details for this position</p>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Course */}
        <Card className="overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
              <Label htmlFor="recommendedCourse" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-blue-500" />
                Recommended Course
              </Label>
            </div>
            <div className="p-4">
              <Autocomplete
                multiple
                id="recommended-course"
                options={courses}
                disableCloseOnSelect
                getOptionLabel={(option) => option.title}
                value={recommendedCourses}
                onChange={(event, newValue) => handleRecommendedCourseChange(newValue)}
                renderOption={(props, option, { selected }) => {
                  const { key, ...optionProps } = props
                  return (
                    <li key={key} {...optionProps}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.title}
                    </li>
                  )
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Recommended Course"
                    placeholder="Select courses"
                    error={errors.recommendedCourse}
                    helperText={errors.recommendedCourse ? "Recommended course is required" : ""}
                  />
                )}
              />
              <p className="text-xs text-gray-500 mt-2">
                Select the educational background that best fits this position
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mt-6">
        <p className="text-sm text-blue-700 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-blue-500" />
          <span className="font-medium">Pro tip:</span> Complete all fields with detailed information to attract the
          most qualified candidates.
        </p>
      </div>
    </div>
  )
}
