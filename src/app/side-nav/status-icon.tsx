"use client"

import { cn } from "../lib/utils"
import { MdDoNotDisturbOn } from "react-icons/md"
import { PiMoonFill } from "react-icons/pi"
import { BsCircleFill } from "react-icons/bs"
import { motion } from "framer-motion"

interface StatusIconProps {
  status: "active" | "idle" | "unavailable"
  size?: "sm" | "lg"
  className?: string
}

export function StatusIcon({ status, size = "sm", className = "" }: StatusIconProps) {
  const iconSize = size === "sm" ? "w-4 h-4" : "w-6 h-6"

  return (
    <div className="relative">
      {/* Active icon */}
      <motion.div
        animate={{
          scale: status === "active" ? 1 : 0,
          opacity: status === "active" ? 1 : 0,
          rotate: status === "active" ? 0 : -30,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 15,
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <BsCircleFill
          className={cn(size === "sm" ? "w-3 h-3" : "w-4 h-4", "text-green-500 relative z-10", className)}
        />
      </motion.div>

      {/* Idle icon */}
      <motion.div
        animate={{
          scale: status === "idle" ? 1 : 0,
          opacity: status === "idle" ? 1 : 0,
          rotate: status === "idle" ? 0 : -30,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 15,
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <PiMoonFill className={cn(iconSize, "text-orange-500 relative z-10", className)} />
      </motion.div>

      {/* Unavailable icon */}
      <motion.div
        animate={{
          scale: status === "unavailable" ? 1 : 0,
          opacity: status === "unavailable" ? 1 : 0,
          rotate: status === "unavailable" ? 0 : -30,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 15,
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <MdDoNotDisturbOn className={cn(iconSize, "text-red-500 relative z-10", className)} />
      </motion.div>

      {/* Invisible placeholder to maintain size */}
      <div className={cn(iconSize, "opacity-0")}>
        <BsCircleFill />
      </div>
    </div>
  )
}
