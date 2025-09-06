"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const questions = [
  "Tell me about yourself and your background.",
  "What are your greatest strengths and weaknesses?",
  "Where do you see yourself in five years?",
  "Why should we hire you for this position?",
  "Describe a challenge you faced and how you overcame it.",
]

export default function InterviewCard() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [direction, setDirection] = useState(0)

  const handleSwipe = (newDirection: number) => {
    setDirection(newDirection)
    setTimeout(() => {
      setCurrentQuestion((prev) => (prev + 1) % questions.length)
      setDirection(0)
    }, 300)
  }

  return (
    <div className="relative w-[350px] h-[220px]">
      {/* Card shadow */}
      <div className="absolute w-[90%] h-[90%] bg-blue-900/50 rounded-2xl bottom-0 left-1/2 transform -translate-x-1/2 blur-md"></div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          className="absolute inset-0 bg-white text-gray-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl cursor-grab active:cursor-grabbing"
          initial={{
            x: direction * 300,
            opacity: 0,
            rotateZ: direction * 5,
          }}
          animate={{
            x: 0,
            opacity: 1,
            rotateZ: 0,
            y: [0, -5, 5, -3, 3, 0],
          }}
          exit={{
            x: -direction * 300,
            opacity: 0,
            rotateZ: -direction * 5,
          }}
          transition={{
            duration: 0.3,
            y: {
              repeat: Number.POSITIVE_INFINITY,
              duration: 3,
              repeatType: "mirror",
            },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragEnd={(_, info) => {
            if (info.offset.x < -100) {
              handleSwipe(-1)
            } else if (info.offset.x > 100) {
              handleSwipe(1)
            }
          }}
        >
          <div className="text-xl font-medium">{questions[currentQuestion]}</div>

          <div className="text-sm text-gray-500 mt-4">Swipe to see next question</div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
