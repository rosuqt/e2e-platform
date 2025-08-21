"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "../ui/card"
import { Briefcase, MapPin, Globe, Clock, DollarSign, GraduationCap, Lightbulb } from "lucide-react"
import type { JobPostingData } from "../../lib/types"
import MUIDropdown from "../../../../../components/MUIDropdown"
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import { TextField } from "@mui/material"
import Checkbox from "@mui/material/Checkbox"
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank"
import CheckBoxIcon from "@mui/icons-material/CheckBox"
import { useSession } from "next-auth/react"
import { jobTitleSections } from "../../lib/jobTitles"
import { courseExpertise, getRandomSkillsForCourse } from "../../lib/skills"

interface CreateStepProps {
  formData: JobPostingData
  handleFieldChange: <T extends keyof JobPostingData>(field: T, value: JobPostingData[T]) => void
  errors: Record<string, boolean>
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkedIcon = <CheckBoxIcon fontSize="small" />

const jobTitleOptions = Object.entries(jobTitleSections).flatMap(([category, titles]) =>
  titles.map(title => ({ title, category }))
);

export function CreateStep({ formData, handleFieldChange, errors }: CreateStepProps) {
  const [showPayAmount, setShowPayAmount] = useState<boolean>(
    formData.payType !== "" && formData.payType !== "No Pay"
  )
  const [locationOptions, setLocationOptions] = useState<{ address: string; label: string }[]>([])

  const { data: session } = useSession()

  useEffect(() => {
    const employerId = (session?.user as { employerId?: string })?.employerId
    if (employerId) {
      fetch("/api/employers/post-a-job/fetchAddress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employer_id: employerId }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.addresses && Array.isArray(data.addresses)) {
            setLocationOptions(data.addresses)
            if (!formData.location && data.addresses.length > 0) {
              handleFieldChange("location", data.addresses[0].address)
            }
          }
        })
        .catch(() => {})
    }
  }, [session?.user, handleFieldChange, formData.location])

  useEffect(() => {
    if (!Array.isArray(formData.skills)) {
      handleFieldChange("skills", []);
    }
  }, [formData.skills, handleFieldChange]);

  useEffect(() => {
    if (
      formData.recommendedCourse &&
      courseExpertise[formData.recommendedCourse] &&
      (!Array.isArray(formData.skills) || formData.skills.length === 0)
    ) {
      const newSkills = getRandomSkillsForCourse(formData.recommendedCourse, 5);
      handleFieldChange("skills", newSkills);
    }
    else if (!formData.recommendedCourse && Array.isArray(formData.skills) && formData.skills.length > 0) {
      handleFieldChange("skills", []);
    }
  }, [formData.recommendedCourse, formData.skills, handleFieldChange]);

  const courses = [
    { title: "BS - Information Technology", value: "BS-Information Technology" },
    { title: "BS - Business Administration", value: "BS-Business Administration" },
    { title: "BS - Hospitality Management", value: "BS-Hospitality Management" },
    { title: "BS - Tourism Management", value: "BS-Tourism Management" },
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

  const workTypes = [
    { value: "OJT/Internship", label: "OJT/Internship" },
    { value: "Part-time", label: "Part-time" },
    { value: "Full-time", label: "Full-time" },
    { value: "Contract", label: "Contract" },
  ]

  const payTypes = [
    ...(formData.workType === "OJT/Internship"
      ? [{ value: "No Pay", label: "No Pay" }]
      : []),
    { value: "Weekly", label: "Weekly" },
    { value: "Monthly", label: "Monthly" },
    { value: "Yearly", label: "Yearly" },
  ];

  function getPayPerHour(payType: string, payAmount: string) {
    const amount = Number(payAmount);
    if (!payAmount || isNaN(amount)) return "";
    if (payType === "Weekly") return `Pay per hour: ₱${(amount / 40).toFixed(2)} / hr (est.)`;
    if (payType === "Monthly") return `Pay per hour: ₱${(amount / 160).toFixed(2)} / hr (est.)`;
    if (payType === "Yearly") return `Pay per hour: ₱${(amount / 2080).toFixed(2)} / hr (est.)`;
    return "";
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 pb-2 border-b border-blue-100">
        <div className="bg-blue-100 p-2 rounded-full">
          <Briefcase className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Job Details</h2>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <p className="text-sm text-blue-700 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-blue-500" />
          <span className="font-medium">Pro tip:</span> Complete all fields with detailed information to attract the
          most qualified candidates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
              <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-500" />
                Job Title
              </Label>
            </div>
            <div className="p-4">
              <Stack spacing={2} sx={{ width: "100%" }}>
                <Autocomplete
                  freeSolo
                  options={jobTitleOptions}
                  groupBy={option =>
                    typeof option === "object" && "category" in option ? option.category : ""
                  }
                  getOptionLabel={option =>
                    typeof option === "string" ? option : option.title
                  }
                  isOptionEqualToValue={(option, value) => {
                    if (typeof option === "string" && typeof value === "string") return option === value;
                    if (typeof option === "object" && typeof value === "object") return option.title === value.title;
                    if (typeof option === "object" && typeof value === "string") return option.title === value;
                    if (typeof option === "string" && typeof value === "object") return option === value.title;
                    return false;
                  }}
                  value={

                    jobTitleOptions.find(opt => opt.title === formData.jobTitle) || null
                  }
                  inputValue={formData.jobTitle}
                  onInputChange={(_, value) => {
 
                    handleFieldChange("jobTitle", value || "");
                  }}
                  onChange={(_, value) => {
                    if (typeof value === "string") {
                      handleFieldChange("jobTitle", value);
                    } else if (value && typeof value === "object" && "title" in value) {
                      handleFieldChange("jobTitle", value.title);
                    } else if (value === null) {
                      handleFieldChange("jobTitle", "");
                    }
                  }}
                  renderGroup={(params) => (
                    <li key={params.key}>
                      <div
                        style={{
                          background: "#e0e7ff", 
                          color: "#2563eb",     
                          fontWeight: 600,
                          padding: "4px 12px",
                          fontSize: "0.95em",
                          borderRadius: "4px",
                          margin: "4px 8px 2px 8px"
                        }}
                      >
                        {params.group}
                      </div>
                      <ul style={{ padding: 0, margin: 0 }}>{params.children}</ul>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select or type a job title"
                      error={errors.jobTitle}
                      helperText={errors.jobTitle ? "Job title is required" : ""}
                    />
                  )}
                />
              </Stack>
              <p className="text-xs text-gray-500 mt-2">
                Be specific with your job title to attract the right candidates
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
              <Label htmlFor="location" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-500" />
                Location
              </Label>
            </div>
            <div className="p-4" style={{ position: "relative" }}>
              <MUIDropdown
                label="Select a Location"
                options={locationOptions.map(opt => ({
                  value: opt.address,
                  label: opt.label ? `${opt.label} - ${opt.address}` : opt.address
                }))}
                value={formData.location || ""}
                onChange={(value) => handleFieldChange("location", value)}
                error={errors.location}
                errorMessage="Location is required"
              />
              <p className="text-xs text-gray-500 mt-2">Select the company or branch address for this job posting.</p>
            </div>
          </CardContent>
        </Card>
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
                      value={formData.payAmount.startsWith("₱") ? formData.payAmount : formData.payAmount ? `₱${formData.payAmount.replace(/^₱/, "")}` : ""}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, "");
                        handleFieldChange("payAmount", val ? `₱${val}` : "");
                      }}
                      fullWidth
                      error={!!payAmountError}
                      helperText={payAmountError}
                      variant="outlined"
                    />
                    <div className="flex items-center text-xs text-blue-700 font-medium pl-2">
                      {getPayPerHour(formData.payType, formData.payAmount.replace(/^₱/, ""))}
                    </div>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-3">Specify the compensation details for this position</p>
            </div>
          </CardContent>
        </Card>

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
                freeSolo={false}
                filterSelectedOptions
              />
              <p className="text-xs text-gray-500 mt-2">
                Select the educational background that best fits this position
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
