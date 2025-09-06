import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "../components/badge"
import { FaWandMagicSparkles } from "react-icons/fa6"
import { Layers, TrendingUp } from "lucide-react"

export function RecoSkills() {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg mb-6 p-4 border-2 border-blue-200 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-blue-700">Recommended Skills</h3>
        <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full">Based on job market</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-2 hover:bg-blue-50 rounded-lg transition-colors">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-700">Docker</span>
          </div>
          <Badge className="bg-green-100 text-green-700 border-none">High Demand</Badge>
        </div>

        <div className="flex items-center justify-between p-2 hover:bg-blue-50 rounded-lg transition-colors">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-700">AWS</span>
          </div>
          <Badge className="bg-green-100 text-green-700 border-none">High Demand</Badge>
        </div>
      </div>

      <div className="mt-4 text-center">
        <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50">
          <FaWandMagicSparkles className="mr-2 h-4 w-4" />
          Skill Development Plan
        </Button>
      </div>
    </motion.div>
  )
}

export default RecoSkills
