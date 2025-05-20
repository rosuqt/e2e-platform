"use client"

import { AnimatePresence, motion } from "framer-motion"

interface AnimatedCheckIconProps {
  isVisible: boolean
}

export const AnimatedCheckIcon = ({ isVisible }: AnimatedCheckIconProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={4}
          stroke="currentColor"
          className="h-3.5 w-3.5 text-white"
        >
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            exit={{ pathLength: 0 }}
            transition={{
              type: "tween",
              duration: 0.4,
              delay: 0.2,
              ease: isVisible ? "easeOut" : "easeIn",
            }}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      )}
    </AnimatePresence>
  )
}
