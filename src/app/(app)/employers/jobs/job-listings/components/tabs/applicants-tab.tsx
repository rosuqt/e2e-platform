"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Chip from "@mui/material/Chip"
import LinearProgress from "@mui/material/LinearProgress"
import { AiOutlinePlus, AiOutlineBulb } from "react-icons/ai"
import { IoIosAddCircleOutline } from "react-icons/io"
import Modal from "@mui/material/Modal"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import { TiDelete } from "react-icons/ti"

export default function ApplicantsTab() {
  const [applicants] = useState([
    {
      name: "Alex Johnson",
      role: "Senior UI Designer",
      match: 95,
      status: "New",
      time: "2 hours ago",
    },
    {
      name: "Maria Garcia",
      role: "UX Researcher",
      match: 87,
      status: "In Review",
      time: "1 day ago",
    },
    {
      name: "John Doe",
      role: "Frontend Developer",
      match: 80,
      status: "Shortlisted",
      time: "3 days ago",
    },
    {
      name: "Emily Davis",
      role: "Product Manager",
      match: 92,
      status: "New",
      time: "5 hours ago",
    },
    {
      name: "Michael Brown",
      role: "Backend Developer",
      match: 85,
      status: "In Review",
      time: "2 days ago",
    },
  ])

  const [skills, setSkills] = useState([
    { name: "UI Design", color: "#E3F2FD", textColor: "#1E88E5" },
    { name: "UX Research", color: "#E8F5E9", textColor: "#43A047" },
    { name: "Wireframing", color: "#F3E5F5", textColor: "#8E24AA" },
    { name: "Prototyping", color: "#E3F2FD", textColor: "#1E88E5" },
    { name: "Figma", color: "#E8F5E9", textColor: "#43A047" },
    { name: "Adobe XD", color: "#F3E5F5", textColor: "#8E24AA" },
    { name: "User Testing", color: "#E3F2FD", textColor: "#1E88E5" },
    { name: "Information Architecture", color: "#E8F5E9", textColor: "#43A047" },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newSkill, setNewSkill] = useState("")
  const [isEditingSkills, setIsEditingSkills] = useState(false)

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([
        ...skills,
        { name: newSkill, color: "#E3F2FD", textColor: "#1E88E5" },  
      ])
      setNewSkill("")
      setIsModalOpen(false)
    }
  }

  const handleRemoveSkill = (skillName: string) => {
    setSkills(skills.filter((skill) => skill.name !== skillName))
  }

  const skillMatchData = [
    { skill: "UI Design", match: 18, total: 23 },
    { skill: "Figma", match: 20, total: 23 },
    { skill: "UX Research", match: 12, total: 23 },
    { skill: "Prototyping", match: 15, total: 23 },
    { skill: "Adobe XD", match: 9, total: 23 },
  ]

  return (
    <div className="space-y-6">
      {/* Required Skills Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Required Skills</CardTitle>
            <p className="text-sm text-muted-foreground">AI-generated based on job title</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditingSkills(!isEditingSkills)}
          >
            {isEditingSkills ? "Done" : "Edit Skills"}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div key={skill.name} className="relative">
                <Chip
                  label={skill.name}
                  sx={{
                    backgroundColor: skill.color,
                    color: skill.textColor,
                  }}
                />
                {isEditingSkills && (
                  <button
                    className="absolute top-0 right-0 -mt-2 -mr-2 text-red-500 rounded-full w-5 h-5 flex items-center justify-center"
                    onClick={() => handleRemoveSkill(skill.name)}
                  >
                    <TiDelete size={16} />
                  </button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="rounded-full h-8 px-3 gap-1 border-blue-500 text-blue-500 hover:bg-blue-50"
              onClick={() => setIsModalOpen(true)}
            >
              <AiOutlinePlus className="mr-1" />
              Add Skill
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Skill Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <AiOutlineBulb className="text-blue-500 text-2xl" />
            <h2 className="text-lg font-medium text-gray-800">Add New Skill</h2>
          </div>
          <TextField
            fullWidth
            label="Skill Name"
            variant="outlined"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="mb-6"
          />
          <div className="flex justify-end gap-3 mt-5">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 text-gray-600 hover:bg-gray-100"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-1"
              onClick={handleAddSkill}
            >
              Add
              <IoIosAddCircleOutline />
            </Button>
          </div>
        </Box>
      </Modal>

      {/* Applicants Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Applicants Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-600 font-medium">New</p>
                <p className="text-2xl font-bold text-blue-700">8</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <p className="text-sm text-yellow-600 font-medium">In Review</p>
                <p className="text-2xl font-bold text-yellow-700">10</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-sm text-green-600 font-medium">Shortlisted</p>
                <p className="text-2xl font-bold text-green-700">3</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <p className="text-sm text-red-600 font-medium">Rejected</p>
                <p className="text-2xl font-bold text-red-700">2</p>
              </div>
            </div>

            {/* Recent Applicants */}
            <div>
              <h3 className="text-sm font-medium mb-3">Recent Applicants</h3>
              <div className="space-y-3">
                {applicants.map((applicant, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Image
                          src={`/placeholder.svg?height=40&width=40&text=${applicant.name.charAt(0)}`}
                          alt={applicant.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{applicant.name}</div>
                        <div className="text-xs text-gray-500">
                          {applicant.role} • Applied {applicant.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Chip
                        label={`${applicant.match}% Match`}
                        sx={{
                          backgroundColor:
                            applicant.match >= 90
                              ? "#E8F5E9"
                              : applicant.match >= 80
                              ? "#E3F2FD"
                              : "#FFFDE7",
                          color:
                            applicant.match >= 90
                              ? "#43A047"
                              : applicant.match >= 80
                              ? "#1E88E5"
                              : "#FBC02D",
                          fontWeight: "bold",
                        }}
                      />
                      <Chip
                        label={applicant.status}
                        sx={{
                          backgroundColor:
                            applicant.status === "New"
                              ? "#E3F2FD"
                              : applicant.status === "In Review"
                              ? "#FFFDE7"
                              : "#E8F5E9",
                          color:
                            applicant.status === "New"
                              ? "#1E88E5"
                              : applicant.status === "In Review"
                              ? "#FBC02D"
                              : "#43A047",
                          fontWeight: "bold",
                        }}
                      />
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        ...
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* View All Button */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-500 text-[14px] hover:text-blue-700"
              >
                View all applications
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skill Match Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Skill Match Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skillMatchData.map(({ skill, match, total }) => (
              <div key={skill} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{skill}</span>
                  <span className="font-medium">{`${match}/${total} applicants`}</span>
                </div>
                <LinearProgress variant="determinate" value={(match / total) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}