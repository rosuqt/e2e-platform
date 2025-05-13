"use client"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { AnimatedCheckIcon } from "./animated-check-icon"

interface ProgressBarProps {
  currentStep: number
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  const steps = [
    { id: 1, name: "Create", status: "upcoming" },
    { id: 2, name: "Validation", status: "upcoming" },
    { id: 3, name: "Write", status: "upcoming" },
    { id: 4, name: "Manage", status: "upcoming" },
  ].map((step) => ({
    ...step,
    status:
      step.id < currentStep
        ? "completed"
        : step.id === currentStep
        ? "current"
        : "upcoming",
  }))

  return (
    <div className="w-full max-w-3xl mx-auto p-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative w-full">
            {/* Step indicator with animations */}
            <motion.div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-500 ease-in-out",
                step.status === "completed"
                  ? "bg-blue-500 border-blue-500"
                  : step.status === "current"
                  ? "border-blue-500"
                  : "border-gray-300",
              )}
              initial={{ scale: 0.9 }}
              animate={{ scale: step.status === "current" ? 1.2 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {step.status === "completed" ? (
                <AnimatedCheckIcon isVisible={true} />
              ) : step.status === "current" ? (
                <AnimatePresence>
                  {/* Border circle bounces in */}
                  <motion.div
                    key="current-border"
                    className="absolute inset-0 border-2 border-blue-500 rounded-full pointer-events-none"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.3 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  />
                  {/* Inner circle bounces out with delay */}
                  <motion.div
                    key="current-inner"
                    className="w-3.5 h-3.5 bg-blue-500 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 15,
                      delay: 0.2,
                    }}
                  />
                </AnimatePresence>
              ) : null}
            </motion.div>

            {/* Step name */}
            <div className="mt-2 text-sm font-medium">{step.name}</div>

            {/* Progress line */}
            {index < steps.length - 1 && (
              <div className="absolute top-4 left-[calc(50%+20px)] w-[calc(100%-40px)] h-[2px]">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700 ease-in-out",
                    step.status === "completed"
                      ? "bg-blue-500 w-full"
                      : step.status === "current"
                      ? "bg-gray-300 border-dashed border-t-2 border-gray-300 bg-transparent w-full"
                      : "bg-gray-300 border-dashed border-t-2 border-gray-300 bg-transparent w-0",
                  )}
                  style={{
                    transformOrigin: "left",
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
