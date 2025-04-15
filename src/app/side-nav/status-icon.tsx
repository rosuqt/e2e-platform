"use client";

import { cn } from "../lib/utils";
import { MdDoNotDisturbOn } from "react-icons/md";
import { PiMoonFill } from "react-icons/pi";
import { BsCircleFill } from "react-icons/bs";
import { motion } from "framer-motion";

interface StatusIconProps {
  status: "active" | "idle" | "unavailable";
  size?: "sm" | "lg";
  className?: string;
}

export function StatusIcon({ status, size = "sm", className = "" }: StatusIconProps) {
  const iconSize = size === "sm" ? "w-4 h-4" : "w-6 h-6";

  const getStatusIcon = () => {
    switch (status) {
      case "active":
        return (
          <motion.div
            key="active"
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotate: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <BsCircleFill
              className={cn(
                size === "sm" ? "w-3 h-3" : "w-3 h-3",
                "text-green-500",
                className
              )}
            />
          </motion.div>
        );
      case "idle":
        return (
          <motion.div
            key="idle"
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotate: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <PiMoonFill className={cn(iconSize, "text-orange-500", className)} />
          </motion.div>
        );
      case "unavailable":
        return (
          <motion.div
            key="unavailable"
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotate: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <MdDoNotDisturbOn className={cn(iconSize, "text-red-500", className)} />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return <>{getStatusIcon()}</>;
}
