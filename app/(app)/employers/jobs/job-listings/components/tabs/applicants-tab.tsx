"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Chip from "@mui/material/Chip"
//import LinearProgress from "@mui/material/LinearProgress"
import { AiOutlinePlus } from "react-icons/ai"
import { TiDelete } from "react-icons/ti"
import { FaRankingStar } from "react-icons/fa6"
import { motion } from "framer-motion"
import { Tooltip } from "@mui/material"
import { LiaUsersSolid } from "react-icons/lia"
import { skillSuggestions } from "../../../../../students/profile/components/data/skill-suggestions"
import { expertiseSuggestions } from "../../../../../students/profile/components/data/expertise-suggestions"
export default function ApplicantsTab({ jobId }: { jobId?: string }) {
  const [skills, setSkills] = useState<{ name: string; color: string; textColor: string }[]>([])
  const [loadingSkills, setLoadingSkills] = useState(false)
  const [showSkillInput, setShowSkillInput] = useState(false)
  const [skillInput, setSkillInput] = useState("")
  const [focusedSuggestion, setFocusedSuggestion] = useState(-1)
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    if (!jobId) return
    setLoadingSkills(true)
    fetch(`/api/job-listings/fetchSkills?jobId=${jobId}`)
      .then(res => res.json())
      .then(res => {
        let aiSkills: string[] = []
        if (Array.isArray(res.ai_skills)) {
          aiSkills = res.ai_skills
        } else if (typeof res.ai_skills === "string") {
          try {
            aiSkills = JSON.parse(res.ai_skills)
          } catch {
            aiSkills = []
          }
        }
        const colorPalette = [
          { color: "#E3F2FD", textColor: "#1E88E5" },
          { color: "#E8F5E9", textColor: "#43A047" },
          { color: "#F3E5F5", textColor: "#8E24AA" },
          { color: "#FFFDE7", textColor: "#FBC02D" },
          { color: "#E1F5FE", textColor: "#0288D1" },
          { color: "#FCE4EC", textColor: "#D81B60" },
          { color: "#FFF3E0", textColor: "#FB8C00" },
          { color: "#F9FBE7", textColor: "#689F38" }
        ]
        setSkills(
          aiSkills.map((name: string, idx: number) => {
            const palette = colorPalette[idx % colorPalette.length]
            return {
              name,
              color: palette.color,
              textColor: palette.textColor
            }
          })
        )
        setLoadingSkills(false)
      })
      .catch(() => {
        setSkills([])
        setLoadingSkills(false)
      })
  }, [jobId])

  const handleAddSkill = async (value: string) => {
    const skill = value.trim()
    if (
      !skill ||
      skills.some(s => s.name.toLowerCase() === skill.toLowerCase()) ||
      skill.length > 20
    ) {
      if (skills.some(s => s.name.toLowerCase() === skill.toLowerCase())) {
        setErrorMsg("Skill already exists")
      }
      return
    }
    setErrorMsg("")
    const colorPalette = [
      { color: "#E3F2FD", textColor: "#1E88E5" },
      { color: "#E8F5E9", textColor: "#43A047" },
      { color: "#F3E5F5", textColor: "#8E24AA" },
      { color: "#FFFDE7", textColor: "#FBC02D" },
      { color: "#E1F5FE", textColor: "#0288D1" },
      { color: "#FCE4EC", textColor: "#D81B60" },
      { color: "#FFF3E0", textColor: "#FB8C00" },
      { color: "#F9FBE7", textColor: "#689F38" }
    ]
    const idx = skills.length
    const newSkills = [
      ...skills,
      { name: skill, color: colorPalette[idx % colorPalette.length].color, textColor: colorPalette[idx % colorPalette.length].textColor }
    ]
    setSkills(newSkills)
    setSkillInput("")
    setShowSkillInput(false)
    setFocusedSuggestion(-1)
    if (jobId) {
      fetch("/api/job-listings/updateSkills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          ai_skills: newSkills.map(s => s.name)
        })
      })
    }
  }

  const handleRemoveSkill = (skillName: string) => {
    const newSkills = skills.filter((skill) => skill.name !== skillName)
    setSkills(newSkills)
    if (jobId) {
      fetch("/api/job-listings/updateSkills", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          skill: skillName
        })
      })
    }
  }

  const handleSkillInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkillInput(e.target.value)
    setFocusedSuggestion(-1)
    setErrorMsg("")
  }

  type SkillSuggestionGroup = {
    category: string;
    skills: string[];
  }

  const mergedSuggestions: SkillSuggestionGroup[] = [
    ...((skillSuggestions as SkillSuggestionGroup[]) ?? []),
    ...Object.entries(expertiseSuggestions).map(([category, skills]) => ({
      category: `Expertise: ${category}`,
      skills: skills as string[]
    }))
  ]

  const filteredSuggestions = (showSkillInput || skillInput)
    ? mergedSuggestions
        .map((group: SkillSuggestionGroup) => ({
          category: group.category,
          skills: group.skills.filter(
            skill =>
              skill.toLowerCase().includes(skillInput.toLowerCase()) &&
              !skills.some(s => s.name.toLowerCase() === skill.toLowerCase())
          )
        }))
        .filter((group: SkillSuggestionGroup) => group.skills.length > 0)
    : []

  const flatSuggestions = filteredSuggestions.flatMap((group: SkillSuggestionGroup) =>
    group.skills.map(skill => ({
      skill,
      category: group.category
    }))
  )

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (flatSuggestions.length > 0 && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault()
      setFocusedSuggestion(prev =>
        e.key === "ArrowDown"
          ? Math.min(prev + 1, flatSuggestions.length - 1)
          : Math.max(prev - 1, 0)
      )
    } else if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      if (focusedSuggestion >= 0 && flatSuggestions[focusedSuggestion]) {
        handleAddSkill(flatSuggestions[focusedSuggestion].skill)
      } else {
        handleAddSkill(skillInput)
      }
    } else if (e.key === "Escape") {
      setShowSkillInput(false)
      setSkillInput("")
      setFocusedSuggestion(-1)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Required Skills</CardTitle>
            <p className="text-sm text-muted-foreground">AI-generated based on job title</p>
          </div>
        </CardHeader>
        <CardContent>
          {loadingSkills ? (
            <div className="flex flex-col items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-3" />
              <div className="text-gray-500 text-sm">Loading Job Skills</div>
            </div>
          ) : skills.length === 0 ? (
            <div className="flex flex-col items-center py-8">
              <FaRankingStar className="w-10 h-10 text-gray-300 mb-2" />
              <div className="text-gray-400 text-center text-sm max-w-xs mb-4">
                No skills have been set for this job yet.<br />
                Add relevant skills to help tailor candidate matches for this position.
              </div>
              <div>
                {showSkillInput ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={handleSkillInput}
                      onKeyDown={handleSkillKeyDown}
                      placeholder="Type then press Enter"
                      maxLength={20}
                      autoFocus
                      className="border border-blue-300 rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onBlur={e => {
                        if (e.relatedTarget == null) {
                          setShowSkillInput(false)
                          setSkillInput("")
                          setFocusedSuggestion(-1)
                          setErrorMsg("")
                        }
                      }}
                      style={{ minHeight: 32 }}
                    />
                    {errorMsg && (
                      <div className="text-xs text-red-500 mt-1">{errorMsg}</div>
                    )}
                    {filteredSuggestions.length > 0 && (
                      <div className="absolute left-0 z-10 mt-1 w-full bg-white border border-blue-200 rounded-lg shadow-lg max-h-56 overflow-auto">
                        {filteredSuggestions.map((group, groupIdx) => (
                          <div key={group.category}>
                            <div className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 sticky top-0 z-10">{group.category}</div>
                            {group.skills.map((skill, idx) => {
                              const flatIdx =
                                filteredSuggestions
                                  .slice(0, groupIdx)
                                  .reduce((acc, g) => acc + g.skills.length, 0) + idx
                              return (
                                <div
                                  key={skill}
                                  className={`px-3 py-2 cursor-pointer flex items-center ${
                                    flatIdx === focusedSuggestion ? "bg-blue-100" : ""
                                  }`}
                                  onMouseDown={() => handleAddSkill(skill)}
                                  onMouseEnter={() => setFocusedSuggestion(flatIdx)}
                                >
                                  <span>{skill}</span>
                                </div>
                              )
                            })}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full h-8 px-3 gap-1 border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-700"
                    onClick={() => {
                      setShowSkillInput(true)
                      setTimeout(() => {
                        const input = document.querySelector<HTMLInputElement>('input[placeholder="Type then press Enter"]')
                        input?.focus()
                      }, 0)
                    }}
                  >
                    <AiOutlinePlus className="mr-1" />
                    Add Skill
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <motion.div
                  key={skill.name}
                  className="relative pointer-events-none"
                  style={{ pointerEvents: "none", display: "inline-block" }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <div style={{ pointerEvents: "auto" }}>
                    <Chip
                      label={skill.name}
                      sx={{
                        backgroundColor: skill.color,
                        color: skill.textColor,
                      }}
                    />
                    <Tooltip title="Delete" enterDelay={1000} leaveDelay={0} arrow>
                      <button
                        className="absolute top-0 right-0 -mt-2 -mr-2 text-red-500 rounded-full w-5 h-5 flex items-center justify-center"
                        onClick={() => handleRemoveSkill(skill.name)}
                        style={{ pointerEvents: "auto" }}
                      >
                        <TiDelete size={16} />
                      </button>
                    </Tooltip>
                  </div>
                </motion.div>
              ))}
              <div>
                {showSkillInput ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={handleSkillInput}
                      onKeyDown={handleSkillKeyDown}
                      placeholder="Type then press Enter"
                      maxLength={20}
                      autoFocus
                      className="border border-blue-300 rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onBlur={e => {
                        if (e.relatedTarget == null) {
                          setShowSkillInput(false)
                          setSkillInput("")
                          setFocusedSuggestion(-1)
                          setErrorMsg("")
                        }
                      }}
                      style={{ minHeight: 32 }}
                    />
                    {errorMsg && (
                      <div className="text-xs text-red-500 mt-1">{errorMsg}</div>
                    )}
                    {filteredSuggestions.length > 0 && (
                      <div className="absolute left-0 z-10 mt-1 w-full bg-white border border-blue-200 rounded-lg shadow-lg max-h-56 overflow-auto">
                        {filteredSuggestions.map((group, groupIdx) => (
                          <div key={group.category}>
                            <div className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 sticky top-0 z-10">{group.category}</div>
                            {group.skills.map((skill, idx) => {
                              const flatIdx =
                                filteredSuggestions
                                  .slice(0, groupIdx)
                                  .reduce((acc, g) => acc + g.skills.length, 0) + idx
                              return (
                                <div
                                  key={skill}
                                  className={`px-3 py-2 cursor-pointer flex items-center ${
                                    flatIdx === focusedSuggestion ? "bg-blue-100" : ""
                                  }`}
                                  onMouseDown={() => handleAddSkill(skill)}
                                  onMouseEnter={() => setFocusedSuggestion(flatIdx)}
                                >
                                  <span>{skill}</span>
                                </div>
                              )
                            })}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full h-8 px-3 gap-1 border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-700"
                    onClick={() => {
                      setShowSkillInput(true)
                      setTimeout(() => {
                        const input = document.querySelector<HTMLInputElement>('input[placeholder="Type then press Enter"]')
                        input?.focus()
                      }, 0)
                    }}
                  >
                    <AiOutlinePlus className="mr-1" />
                    Add Skill
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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
                <p className="text-2xl font-bold text-blue-700">0</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <p className="text-sm text-yellow-600 font-medium">In Review</p>
                <p className="text-2xl font-bold text-yellow-700">0</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-sm text-green-600 font-medium">Shortlisted</p>
                <p className="text-2xl font-bold text-green-700">0</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <p className="text-sm text-red-600 font-medium">Rejected</p>
                <p className="text-2xl font-bold text-red-700">0</p>
              </div>
            </div>

            {/* Recent Applicants */}
            <div>
              <h3 className="text-sm font-medium mb-3">Recent Applicants</h3>
              <div className="flex flex-col items-center py-8">
                <LiaUsersSolid className="w-14 h-14 text-gray-300 mb-2" />
                <div className="text-gray-400 text-center text-sm max-w-xs mb-4">
                  Looks like we’re still waiting to meet our first candidate!
                </div>
              </div>
            </div>

            {/* View All Button */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-500 text-[14px] hover:text-blue-700"
                disabled
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
          <div className="flex flex-col items-center py-8">
            <FaRankingStar className="w-10 h-10 text-gray-300 mb-2" />
            <div className="text-gray-400 text-center text-sm max-w-xs mb-4">
              No skill match data yet
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}