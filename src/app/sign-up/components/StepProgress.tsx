"use client";
import { motion } from "framer-motion";
import { Check } from 'lucide-react';

interface StepProgressProps {
  currentStep: number;
}

export default function StepProgress({ currentStep }: StepProgressProps) {
  const steps = ["1", "2", "3"];

  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={step} className="flex items-center">
            {/* Animated Step Circle */}
            <motion.div
              className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold transition-all
  ${isActive && !isCompleted ? "bg-button text-white" : "border-[3px] border-button text-button bg-white"}`}
              initial={{ scale: 0.9 }}
              animate={{ scale: isActive ? 1.3 : 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              {isCompleted ? (
                <Check className="text-blue-700" size={20} />
              ) : (
                stepNumber
              )}
            </motion.div>

            {/* Animated Step Divider (Loading Effect) */}
            {index < steps.length - 1 && (
              <motion.div
                className={`h-1 bg-button rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: isCompleted ? 40 : currentStep === stepNumber + 1 ? 40 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
