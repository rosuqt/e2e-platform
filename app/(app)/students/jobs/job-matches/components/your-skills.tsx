import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Progress } from "../components/progress"
import { Badge } from "../components/badge"
import ViewSkillsModal from "./view-skills"
import { RiAddCircleLine } from "react-icons/ri"

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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
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
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleOpenSkillsModal = () => setIsSkillsModalOpen(true)
  const handleCloseSkillsModal = () => setIsSkillsModalOpen(false)

  return (
    <>
      <motion.div
        className="rounded-xl shadow-lg mb-4 p-3 relative overflow-hidden border-2 border-blue-200"
        style={{
          background: "rgba(255,255,255,0.65)",
          minHeight: 260,
          height: "auto",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "0 8px 32px rgba(60,120,220,0.10)"
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-semibold bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 bg-clip-text text-transparent">
            Your Skills & Expertise
          </h3>
        </div>

        {loading ? (
          <div className="space-y-2">
            <div className="h-4 w-1/2 bg-blue-100 rounded animate-pulse" />
            <div className="h-3 w-full bg-blue-100 rounded animate-pulse" />
            <div className="h-3 w-2/3 bg-blue-100 rounded animate-pulse" />
            <div className="flex gap-1 mt-2">
              <div className="h-6 w-16 bg-sky-100 rounded animate-pulse" />
              <div className="h-6 w-12 bg-sky-100 rounded animate-pulse" />
              <div className="h-6 w-10 bg-sky-100 rounded animate-pulse" />
            </div>
            <div className="mt-4 flex items-center justify-center">
              <div className="h-10 w-full bg-blue-200 rounded-full animate-pulse" />
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {expertise.length === 0 && (
                <div className="text-xs text-blue-400">No expertise added yet.</div>
              )}
              {expertise.slice(0, 2).map((item, idx) => (
                <div key={`expertise-bar-${idx}`} className="space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 bg-clip-text text-transparent">
                      {typeof item === "string" ? item : item.name}
                    </span>
                    {typeof item !== "string" && item.level && (
                      <span className="text-[10px] font-medium text-blue-500">{item.level}</span>
                    )}
                  </div>
                  {typeof item !== "string" && item.value && (
                    <Progress value={item.value} className="h-1" />
                  )}
                </div>
              ))}
              {expertise.length > 2 && (
                <button
                  className="text-blue-500 text-xs hover:underline mt-1"
                  onClick={handleOpenSkillsModal}
                >
                  View More
                </button>
              )}
            </div>

            <div className="mt-2 flex flex-wrap gap-1">
              {skills.slice(0, 5).map((item, idx) => (
                <Badge
                  key={idx}
                  className="bg-sky-100 border border-sky-300 text-sky-700 hover:bg-sky-200 transition-colors text-xs px-2 py-1 shadow-sm"
                >
                  {typeof item === "string" ? item : item.name}
                </Badge>
              ))}
              {skills.length > 5 && (
                <Badge className="bg-sky-100 border border-sky-300 text-sky-700 text-xs px-2 py-1 shadow-sm">
                  +{skills.length - 5} more
                </Badge>
              )}
            </div>
            <div className="mt-4 flex items-center justify-center">
              <motion.button
                className="w-full px-3 py-3 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 text-white text-sm font-medium shadow-sm flex items-center justify-center gap-2"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleOpenSkillsModal}
              >
                <RiAddCircleLine className="w-4 h-4" />
                <span>View Skills</span>
              </motion.button>
            </div>
          </>
        )}
      </motion.div>

      <ViewSkillsModal
        open={isSkillsModalOpen}
        onClose={handleCloseSkillsModal}
        skills={skills}
        expertise={expertise}
      />
    </>
  )
}

export default YourSkills
