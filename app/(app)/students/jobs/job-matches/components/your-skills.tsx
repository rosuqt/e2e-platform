import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "../components/progress"
import { Badge } from "../components/badge"
import { Dialog } from "@mui/material"
import ViewSkillsModal from "./view-skills"

type Skill = {
  name?: string
  level?: string
  value?: number
}

type RawExpertise = { 
  skill: string
  mastery: number
}

export function YourSkills() {
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false)
  const [skills, setSkills] = useState<Skill[]>([])
  const [expertise, setExpertise] = useState<Skill[]>([])
  const [isViewAllOpen, setIsViewAllOpen] = useState(false)

  useEffect(() => {
    fetch("/api/students/student-profile/getHandlers")
      .then(res => res.json())
      .then(data => {
        setSkills(Array.isArray(data.skills) ? data.skills : [])
        if (Array.isArray(data.expertise)) {
          setExpertise(
            data.expertise.map((e: RawExpertise) => ({
              name: e.skill,
              value: e.mastery,
              level:
                e.mastery >= 80
                  ? "Expert"
                  : e.mastery >= 60
                  ? "Advanced"
                  : e.mastery >= 40
                  ? "Intermediate"
                  : e.mastery >= 20
                  ? "Beginner"
                  : "Novice"
            }))
          )
        } else {
          setExpertise([])
        }
      })
  }, [])

  const handleOpenSkillsModal = () => setIsSkillsModalOpen(true)
  const handleCloseSkillsModal = () => setIsSkillsModalOpen(false)

  return (
    <>
      <motion.div
        className="bg-white rounded-2xl shadow-lg mb-6 p-4 border-2 border-blue-200 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-blue-700">Your Skills & Expertise</h3>
          <motion.button
            className="text-blue-500 hover:text-blue-700 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
          </motion.button>
        </div>

        {/* Expertise with progress bars */}
        <div className="space-y-3">
          {expertise.length === 0 && (
            <div className="text-sm text-gray-400">No expertise added yet.</div>
          )}
          {expertise.slice(0, 3).map((item, idx) => (
            <div key={`expertise-bar-${idx}`} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-700">
                    {typeof item === "string" ? item : item.name}
                  </span>
                </div>
                {typeof item !== "string" && item.level && (
                  <span className="text-xs font-medium text-blue-600">{item.level}</span>
                )}
              </div>
              {typeof item !== "string" && item.value && (
                <Progress value={item.value} className="h-1.5" />
              )}
            </div>
          ))}
          {expertise.length > 3 && (
            <button
              className="text-blue-600 text-sm hover:underline mt-2"
              onClick={handleOpenSkillsModal}
            >
              View More
            </button>
          )}
        </div>

        {/* Skills as badges */}
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.slice(0, 8).map((item, idx) => (
            <Badge key={idx} className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">
              {typeof item === "string" ? item : item.name}
            </Badge>
          ))}
          {skills.length > 8 && (
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">
              +{skills.length - 8} more
            </Badge>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
            onClick={() => setIsViewAllOpen(true)}
          >
            View All
          </Button>
        </div>
      </motion.div>

      <Dialog open={isSkillsModalOpen} onClose={handleCloseSkillsModal}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">All Expertise & Skills</h3>
          <div className="space-y-3">
            {expertise.map((item, idx) => (
              <div key={`expertise-modal-${idx}`} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-blue-700">
                      {typeof item === "string" ? item : item.name}
                    </span>
                  </div>
                  {typeof item !== "string" && item.level && (
                    <span className="text-xs font-medium text-blue-600">{item.level}</span>
                  )}
                </div>
                {typeof item !== "string" && item.value && (
                  <Progress value={item.value} className="h-1.5" />
                )}
              </div>
            ))}
            <div className="flex flex-wrap gap-2 mt-4">
              {skills.map((item, idx) => (
                <Badge key={`skill-modal-${idx}`} className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">
                  {typeof item === "string" ? item : item.name}
                </Badge>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
              onClick={handleCloseSkillsModal}
            >
              Close
            </Button>
          </div>
        </div>
      </Dialog>

      <ViewSkillsModal
        open={isViewAllOpen}
        onClose={() => setIsViewAllOpen(false)}
        skills={skills}
        expertise={expertise}
      />
    </>
  )
}

export default YourSkills
