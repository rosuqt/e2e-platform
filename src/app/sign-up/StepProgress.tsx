"use client";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react"; // Import CheckCircle from lucide-react

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
                ${isCompleted ? "bg-blue-600 text-white" : ""}
  ${isActive && !isCompleted ? "bg-blue-600 text-white" : "border-[3px] border-blue-600 text-blue-600 bg-white"}`}
              initial={{ scale: 0.9 }}
              animate={{ scale: isActive ? 1.3 : 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              {isCompleted ? (
                <CheckCircle className="text-blue-700" size={18} /> // Checkmark for completed steps
              ) : (
                stepNumber // Show number for active/incomplete steps
              )}
            </motion.div>

            {/* Animated Step Divider (Loading Effect) */}
            {index < steps.length - 1 && (
              <motion.div
                className={`h-1 bg-blue-600 rounded-full`}
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
