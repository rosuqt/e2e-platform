"use client";

import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import Slider from "@mui/material/Slider";
import { useState } from "react";
import type { Job } from "./job-details";

type FilterModalProps = {
  onClose: () => void;
  onApply: (newFilters: Partial<Pick<Job, "type" | "location">> & { salary?: string }) => void;
  currentFilters: Partial<Pick<Job, "type" | "location">> & { salary?: string };
};

const JOB_TYPE_OPTIONS = [
  { id: "Fulltime", label: "Full-time" },
  { id: "Part-time", label: "Part-time" },
  { id: "OJT", label: "OJT" },
  { id: "Internship", label: "Internship" },
];

const LOCATION_OPTIONS = [
  { id: "Remote", label: "Remote" },
  { id: "Onsite", label: "Onsite" },
  { id: "Hybrid", label: "Hybrid" },
];

export default function FilterModal({ onClose, onApply, currentFilters }: FilterModalProps) {
  const [jobType, setJobType] = useState<string[]>(
    typeof currentFilters.type === "string" && currentFilters.type
      ? currentFilters.type.split(",")
      : []
  );
  const [location, setLocation] = useState<string[]>(
    typeof currentFilters.location === "string" && currentFilters.location
      ? currentFilters.location.split(",")
      : []
  );
  const [salary, setSalary] = useState<number>(
    typeof currentFilters.salary === "string"
      ? Number(currentFilters.salary)
      : 50
  );

  function handleCheckboxChange(type: "type" | "location", value: string, checked: boolean) {
    if (type === "type") {
      setJobType(prev =>
        checked ? [...prev, value] : prev.filter(v => v !== value)
      );
    } else {
      setLocation(prev =>
        checked ? [...prev, value] : prev.filter(v => v !== value)
      );
    }
  }

  function handleSalaryChange(_: Event, value: number | number[]) {
    setSalary(Array.isArray(value) ? value[0] : value);
  }

  function handleApplyFilters() {
    const filters: Partial<Pick<Job, "type" | "location">> & { salary?: string } = {
      type: jobType.join(","),
      location: location.join(","),
      salary: String(salary),
    };
    onApply(filters);
    onClose();
  }

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
              {JOB_TYPE_OPTIONS.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Checkbox
                    id={item.id}
                    checked={jobType.includes(item.id)}
                    onCheckedChange={checked =>
                      handleCheckboxChange("type", item.id, !!checked)
                    }
                  />
                  <label htmlFor={item.id} className="text-sm text-blue-600 cursor-pointer">
                    {item.label}
                  </label>
                </div>
              )) }
            </div>
          </div>
          {/* Location */}
          <div>
            <h4 className="font-medium mb-3 text-blue-700">Location</h4>
            <div className="space-y-2">
              {LOCATION_OPTIONS.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Checkbox
                    id={item.id}
                    checked={location.includes(item.id)}
                    onCheckedChange={checked =>
                      handleCheckboxChange("location", item.id, !!checked)
                    }
                  />
                  <label htmlFor={item.id} className="text-sm text-blue-600 cursor-pointer">
                    {item.label}
                  </label>
                </div>
              )) }
            </div>
          </div>
          {/* Salary Range */}
          <div>
            <h4 className="font-medium mb-3 text-blue-700">Salary Range</h4>
            <div className="px-1">
              <Slider
                value={salary}
                onChange={handleSalaryChange}
                max={100}
                step={1}
                className="my-4"
                valueLabelDisplay="auto"
              />
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
            onClick={handleApplyFilters}
          >
            Apply filters
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
