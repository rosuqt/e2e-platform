"use client";

import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import Slider from "@mui/material/Slider";

export default function FilterModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-5 border-2 border-blue-200 w-full max-w-md relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-x"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-blue-700">Filter by</h3>
        </div>

        <div className="space-y-5">
          {/* Job Type */}
          <div>
            <h4 className="font-medium mb-3 text-blue-700">Job Type</h4>
            <div className="space-y-2">
              {[{ id: "fulltime", label: "Fulltime" }, { id: "parttime", label: "Part-time" }, { id: "ojt", label: "OJT", checked: true }, { id: "internship", label: "Internship" }].map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Checkbox id={item.id} checked={item.checked} />
                  <label htmlFor={item.id} className="text-sm text-blue-600 cursor-pointer">
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="font-medium mb-3 text-blue-700">Location</h4>
            <div className="space-y-2">
              {[{ id: "remote", label: "Remote" }, { id: "onsite", label: "Onsite" }, { id: "hybrid", label: "Hybrid", checked: true }].map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Checkbox id={item.id} checked={item.checked} />
                  <label htmlFor={item.id} className="text-sm text-blue-600 cursor-pointer">
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Salary Range */}
          <div>
            <h4 className="font-medium mb-3 text-blue-700">Salary Range</h4>
            <div className="px-1">
              <Slider defaultValue={50} max={100} step={1} className="my-4" valueLabelDisplay="auto" />
              <div className="flex justify-between text-xs text-blue-500">
                <span>15,000 ₱</span>
                <span>30,000 ₱</span>
              </div>
            </div>
          </div>

          <motion.button
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.97 }}
          >
            Apply filters
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
