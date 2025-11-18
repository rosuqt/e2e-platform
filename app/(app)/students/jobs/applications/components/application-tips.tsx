/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "./ui/badge"
import { FileText, Search, MessageSquare, Wrench } from "lucide-react"
import Lottie from "lottie-react"
import { motion, AnimatePresence } from "framer-motion"
import catTyping from "../../../../../../public/animations/application-tips/Cat typing.json"
import studentResearch from "../../../../../../public/animations/application-tips/STUDENT.json"
import interviewAnim from "../../../../../../public/animations/application-tips/interview.json"
import devSkillsAnim from "../../../../../../public/animations/application-tips/skills_cat.json"


type Tip = { icon?: React.ReactNode; text: string; animation?: any };

export function ApplicationTips() {
  const defaultTips: Tip[] = [
    { icon: <FileText className="h-4 w-4" />, text: "Give your resume a quick refresh before applying.", animation: catTyping },
    { icon: <Search className="h-4 w-4" />, text: "It’s worth getting to know each company a bit before sending your application.", animation: studentResearch },
    { icon: <MessageSquare className="h-4 w-4" />, text: "Ace your next interview with help from our AI practice tool", animation: interviewAnim },
    { icon: <Wrench className="h-4 w-4" />, text: "Add job-specific skills to stand out in your applications.", animation: devSkillsAnim },
  ]
  const list = defaultTips
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => {
      setIndex(i => (i + 1) % list.length)
    }, 60000)
    return () => clearInterval(id)
  }, [list.length])
  const tip = list[index]
  return (
    <Card className="shadow-sm border-blue-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          Application Tips
          <Badge className="ml-2 bg-red-500 text-white text-xs">{list.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={tip.text}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center text-center gap-6 min-h-[320px]"
          >
            <div className="w-48 h-48 mx-auto">
              {tip.animation && (
                <Lottie
                  animationData={tip.animation}
                  loop
                  autoplay
                  style={{ width: "100%", height: "100%" }}
                />
              )}
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                {tip.icon}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed max-w-[300px] text-left">{tip.text}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
