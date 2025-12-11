"use client";

import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import Slider from "@mui/material/Slider";
import { useState } from "react";
import type { Job } from "./job-details";

type FilterModalProps = {
  onClose: () => void;
  onApply: (newFilters: Partial<Pick<Job, "work_type" | "location">> & { salary?: string; match_score_min?: number; match_score_max?: number }) => void;
  currentFilters: Partial<Pick<Job, "work_type" | "location">> & { salary?: string; match_score_min?: number; match_score_max?: number };
};

const JOB_TYPE_OPTIONS = [
  { id: "OJT/Internship", label: "OJT/Internship" },
  { id: "Part-time", label: "Part-time" },
  { id: "Full-time", label: "Full-time" },
  { id: "Contract", label: "Contract" },
];

const LOCATION_OPTIONS = [
  { id: "On-site", label: "On-site" },
  { id: "Hybrid", label: "Hybrid" },
  { id: "Work from home", label: "Work from home" },
];

export default function FilterModal({ onClose, onApply, currentFilters }: FilterModalProps) {
  const [jobType, setJobType] = useState<string[]>(
    typeof currentFilters.work_type === "string" && currentFilters.work_type
      ? currentFilters.work_type.split(",")
      : []
  );
  const [location, setLocation] = useState<string[]>(
    typeof currentFilters.location === "string" && currentFilters.location
      ? currentFilters.location.split(",")
      : []
  );

  const [salary, setSalary] = useState<string>(
    typeof currentFilters.salary === "string"
      ? (
          currentFilters.salary === "unpaid"
            ? "unpaid"
            : /^\d+$/.test(currentFilters.salary.trim())
              ? `>=${currentFilters.salary.trim()}`
              : currentFilters.salary
        )
      : ""
  );

  const [customSalary, setCustomSalary] = useState<string>(() => {
    if (typeof currentFilters.salary === "string" && currentFilters.salary.startsWith(">=")) {
      return currentFilters.salary.replace(/^\>=\s*/, "").replace(/[^0-9]/g, "");
    }
    return "";
  });

  const [matchRange, setMatchRange] = useState<number[] | null>(() => {
    const min = typeof currentFilters.match_score_min === "number" ? currentFilters.match_score_min : null;
    const max = typeof currentFilters.match_score_max === "number" ? currentFilters.match_score_max : null;
    return (min !== null || max !== null) ? [min ?? 0, max ?? 100] : null;
  });
  const matchEnabled = matchRange !== null;

  const SALARY_OPTIONS = [
    { label: "No Pay", value: "unpaid" },
    { label: ">= ₱15,000", value: ">=15000" },
    { label: ">= ₱30,000", value: ">=30000" },
    { label: ">= ₱50,000", value: ">=50000" },
    { label: ">= ₱100,000", value: ">=100000" },
    { label: "Custom", value: "custom" },
  ];

  const MARKS = Array.from({ length: 11 }, (_, i) => ({ value: i * 10, label: `${i * 10}%` }));

  function handleCheckboxChange(type: "work_type" | "location", value: string, checked: boolean) {
    if (type === "work_type") {
      setJobType(prev =>
        checked ? [...prev, value] : prev.filter(v => v !== value)
      );
    } else {
      setLocation(prev =>
        checked ? [...prev, value] : prev.filter(v => v !== value)
      );
    }
  }

  function handleApplyFilters() {
    const filters: Partial<Pick<Job, "work_type" | "location">> & { salary?: string; match_score_min?: number; match_score_max?: number } = {
      work_type: jobType.join(","),
      location: location.join(","),
      salary:
        salary === "custom"
          ? (customSalary.trim() ? `>=${customSalary.replace(/[^0-9]/g, "")}` : undefined)
          : (salary || undefined),
      ...(matchRange !== null ? { match_score_min: matchRange[0], match_score_max: matchRange[1] } : {}),
    };
    onApply(filters);
    onClose();
  }

  function handleClearFilters() {
    setJobType([]);
    setLocation([]);
    setSalary("");
    setMatchRange(null);
    setCustomSalary("");
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        handleCheckboxChange("work_type", item.id, !!checked)
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
          </div>

          {/* Salary Range */}
          <div>
            <h4 className="font-medium mb-3 text-blue-700">Salary Range</h4>
            <div className="px-1">
              <div className="text-center text-sm font-medium text-blue-600 mb-2">
                {salary === "" ? "Any" : salary === "unpaid" ? "No Pay / Volunteer" : salary === "custom" ? (customSalary ? `>= ₱${Number(customSalary).toLocaleString()}` : "Custom") : (salary.startsWith(">=") ? `${salary.replace(">=", ">= ₱").replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` : `${Number(salary).toLocaleString()} ₱`)}
              </div>

              <div className="flex flex-wrap gap-2 justify-center mb-3">
                {SALARY_OPTIONS.map(opt => {
                  const selected = salary === opt.value;
                  if (opt.value === "custom") {
                    return selected ? (
                      <input
                        key="custom-input"
                        type="text"
                        inputMode="numeric"
                        value={customSalary}
                        onChange={(e) => {
                          const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                          setCustomSalary(onlyNums);
                        }}
                        placeholder="₱ amount"
                        className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors border border-blue-200 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center min-w-[120px]"
                      />
                    ) : (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setSalary(selected ? "" : opt.value);
                          if (!selected && customSalary === "") {
                            setCustomSalary("");
                          }
                        }}
                        className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors bg-white border border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        {opt.label}
                      </button>
                    );
                  }

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSalary(selected ? "" : opt.value)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selected
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white border border-blue-200 text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              <div className="text-xs text-center text-blue-500">
                Select &quot;No Pay&quot; for unpaid or volunteer positions, or pick a common monthly amount.
              </div>
            </div>
          </div>

          {/* Match Score */}
          <div>
            <h4 className="font-medium mb-3 text-blue-700">Match Score</h4>
            <div className="px-2">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="enable-match-score"
                    checked={matchEnabled}
                    onCheckedChange={(checked) => {
                      const isChecked = !!checked;
                      if (isChecked && matchRange === null) setMatchRange([50, 50]);
                      if (!isChecked) setMatchRange(null);
                    }}
                  />
                  <label htmlFor="enable-match-score" className="text-sm text-blue-600 cursor-pointer">
                    Enable match score range
                  </label>
                </div>
                <div className="text-center text-sm font-medium text-blue-600">
                  {matchEnabled ? `${matchRange?.[0]}% - ${matchRange?.[1]}%` : "Any"}
                </div>
              </div>

              <Slider
                value={matchEnabled ? matchRange ?? [50, 50] : [0, 100]}
                onChange={(_: Event, value: number | number[]) => {
                  const v = Array.isArray(value) ? value : [value, value];
                  setMatchRange(v);
                }}
                min={0}
                max={100}
                step={10}
                valueLabelDisplay="auto"
                valueLabelFormat={(val) => `${val}%`}
                disabled={!matchEnabled}
                marks={MARKS}
              />
               <div className="flex justify-between text-xs text-blue-500">
                 <span>0%</span>
                 <span>100%</span>
               </div>
             </div>
           </div>

          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={handleClearFilters}
              className="flex-1 py-2 bg-white border border-blue-200 text-blue-600 rounded-lg font-medium hover:bg-blue-50"
            >
              Clear
            </button>

            <motion.button
              className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg"
              whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.97 }}
              onClick={handleApplyFilters}
            >
              Apply filters
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
