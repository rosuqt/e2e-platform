import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "../components/progress"
import { Badge } from "../components/badge"
import { Sliders, Code, Database, PenTool, Smartphone, Cpu } from "lucide-react"
import { Dialog } from "@mui/material"

export function YourSkills() {
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false)

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
          <h3 className="text-lg font-semibold text-blue-700">Your Skills</h3>
          <motion.button
            className="text-blue-500 hover:text-blue-700 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sliders className="h-4 w-4" />
          </motion.button>
        </div>

        <div className="space-y-3">
          {/* Display only the first 3 skills */}
          {[{ skill: "Frontend Development", level: "Expert", value: 95, icon: Code },
            { skill: "Backend Development", level: "Advanced", value: 80, icon: Database },
            { skill: "UI/UX Design", level: "Intermediate", value: 70, icon: PenTool }]
            .map(({ skill, level, value, icon: Icon }, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">{skill}</span>
                  </div>
                  <span className="text-xs font-medium text-blue-600">{level}</span>
                </div>
                <Progress value={value} className="h-1.5" />
              </div>
            ))}

          {/* View More Button */}
          <button
            className="text-blue-600 text-sm hover:underline mt-2"
            onClick={handleOpenSkillsModal}
          >
            View More
          </button>
        </div>

        {/* Pill-shaped skills */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">React</Badge>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">Next.js</Badge>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">TypeScript</Badge>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">Node.js</Badge>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">Figma</Badge>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">Tailwind</Badge>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">MongoDB</Badge>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">+5 more</Badge>
        </div>

        {/* Update Skills Button */}
        <div className="mt-4">
          <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50">
            Update Skills
          </Button>
        </div>
      </motion.div>

      {/* Skills Modal */}
      <Dialog open={isSkillsModalOpen} onClose={handleCloseSkillsModal}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">All Skills</h3>
          <div className="space-y-3">
            {[{ skill: "Frontend Development", level: "Expert", value: 95, icon: Code },
              { skill: "Backend Development", level: "Advanced", value: 80, icon: Database },
              { skill: "UI/UX Design", level: "Intermediate", value: 70, icon: PenTool },
              { skill: "Mobile Development", level: "Beginner", value: 40, icon: Smartphone },
              { skill: "Machine Learning", level: "Beginner", value: 30, icon: Cpu }]
              .map(({ skill, level, value, icon: Icon }, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">{skill}</span>
                    </div>
                    <span className="text-xs font-medium text-blue-600">{level}</span>
                  </div>
                  <Progress value={value} className="h-1.5" />
                </div>
              ))}
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
    </>
  )
}

export default YourSkills
