"use client";
import { Tooltip } from "@heroui/react";
import { motion } from "framer-motion";
import { TbInfoCircleFilled } from "react-icons/tb";

type TooltipIconProps = {
  text: string;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
};

export default function TooltipIcon({
  text,
  bgColor = "bg-white",
  textColor = "text-gray-700",
  borderColor = "border-blue-200",
}: TooltipIconProps) {
  return (
    <Tooltip
      content={
        <div
          className={`relative max-w-xs ${bgColor} ${textColor} border ${borderColor} rounded shadow-lg px-3 py-3`}
        >
          <TbInfoCircleFilled className="absolute top-2 left-2 w-4 h-4 text-blue-500" />
          <p className="pl-6 text-sm font-normal">{text}</p>
        </div>
      }
    >
      <motion.div
        whileHover={{ scale: 1.2, y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
        className="inline-block cursor-pointer ml-1"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 16V12M12 8H12.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    </Tooltip>
  );
}
