"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { Card, CardContent } from "../ui/card"
import { Briefcase, MapPin, Globe, Clock, DollarSign, GraduationCap, Lightbulb } from "lucide-react"
import type { JobPostingData } from "../../lib/types"
import MUIDropdown from "../ui/MUIDropdown"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { FreeSolo } from "../ui/customSection"
import { jobTitleSections } from "../../lib/jobTitles"

interface CreateStepProps {
  formData: JobPostingData
  updateFormData: (data: Partial<JobPostingData>) => void
}

export function CreateStep({ formData, updateFormData }: CreateStepProps) {
  const [showPayAmount, setShowPayAmount] = useState<boolean>(
    formData.payType !== "" && formData.payType !== "No Pay"
  );

  const handlePayTypeChange = (value: string) => {
    const updatedData = { ...formData, payType: value };
    updateFormData(updatedData);
    sessionStorage.setItem("jobFormData", JSON.stringify(updatedData));
    setShowPayAmount(value !== "" && value !== "No Pay");
  };

  const handleInputChange = <T extends keyof JobPostingData>(field: T, value: JobPostingData[T]) => {
    const updatedData = { ...formData, [field]: value };
    updateFormData(updatedData);
    sessionStorage.setItem("jobFormData", JSON.stringify(updatedData));
  };

  const commonPayAmounts = {
    Weekly: ["$500", "$750", "$1,000", "$1,500", "$2,000"],
    Monthly: ["$2,000", "$3,000", "$4,000", "$5,000", "$6,000"],
    Yearly: ["$30,000", "$45,000", "$60,000", "$75,000", "$90,000", "$120,000"],
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

  const courses = [
    { value: "BSIT", label: "BSIT - Bachelor of Science in Information Technology" },
    { value: "BSBA", label: "BSBA - Bachelor of Science in Business Administration" },
    { value: "BSHM", label: "BSHM - Bachelor of Science in Hospitality Management" },
    { value: "BSTM", label: "BSTM - Bachelor of Science in Tourism Management" },
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
                onSelectionChange={(key) => handleInputChange("jobTitle", key)}
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
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="placeholder for location (thnking pa of this)"
              />
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
                label="Select a Remote Options"
                options={[
                  { value: "On-site", label: "On-site" },
                  { value: "Hybrid", label: "Hybrid" },
                  { value: "Work from home", label: "Work from home" },
                ]}
                value={formData.remoteOptions || ""}
                onChange={(value) => handleInputChange("remoteOptions", value as string)}
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
                onChange={(value) => handleInputChange("workType", value)}
              />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="payType" className="text-sm text-gray-600 mb-2 block">
                    Pay Type
                  </Label>
                  <Select value={formData.payType} onValueChange={handlePayTypeChange}>
                    <SelectTrigger
                      className="border-gray-200 focus:ring-blue-500 text-medium"
                      style={{
                        height: "50px",
                      }}
                    >
                      <SelectValue placeholder="Select pay type" />
                    </SelectTrigger>
                    <SelectContent>
                      {payTypes.map((type) => (
                        <SelectItem
                          key={type.value}
                          value={type.value}
                          style={{
                            backgroundColor: "white",
                            transition: "background-color 0.2s",
                            
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ebf8ff")} // blue-50
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                        >
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {showPayAmount && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Label htmlFor="payAmount" className="text-sm text-gray-600 mb-2 block">
                      Pay Amount
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="payAmount"
                        value={formData.payAmount}
                        onChange={(e) => handleInputChange("payAmount", e.target.value)}
                        placeholder={`e.g. ${
                          formData.payType === "Yearly" ? "50,000" : formData.payType === "Monthly" ? "4,000" : "1,000"
                        }`}
                        className="flex-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        style={{
                          height: "50px",
                        }}
                      />
                      <Select
                        onValueChange={(value) => handleInputChange("payAmount", value)}
                        value={formData.payAmount}
                      >
                        <SelectTrigger
                          className="w-[180px] border-gray-200 focus:ring-blue-500"
                          style={{
                            height: "50px",
                          }}
                        >
                          <SelectValue placeholder="Common amounts" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.payType &&
                            formData.payType !== "No Pay" &&
                            commonPayAmounts[formData.payType as keyof typeof commonPayAmounts]?.map((amount) => (
                              <SelectItem
                                key={amount}
                                value={amount}
                                style={{
                                  backgroundColor: "white",
                                  transition: "background-color 0.2s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ebf8ff")} // blue-50
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                              >
                                {amount}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
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
              <MUIDropdown
                label="Recommended Course"
                options={courses}
                value={formData.recommendedCourse || ""}
                onChange={(value) => handleInputChange("recommendedCourse", value as string)}
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
