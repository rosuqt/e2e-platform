"use client";

import { useState } from "react";
import { Navigation } from "lucide-react";
import { motion } from "framer-motion";

export default function SideNav({ onToggle }: { onToggle: (isMinimized: boolean) => void }) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [status, setStatus] = useState("Available for Work");

  const toggleSidebar = () => {
    const next = !isMinimized;
    setIsMinimized(next);
    onToggle(next);
  };

  const getStatusColor = (status:string) => {
    switch (status) {
      case "Available for Work":
        return "#00d23f"; // Green
      case "Application in Progress":
        return "#ffa500"; // Orange
      case "Hired":
        return "#ff0000"; // Red
      default:
        return "#00d23f"; // Default green
    }
  };
  

  const statusColor = getStatusColor(status);

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-[#1551a9] text-white flex flex-col z-50 transition-all duration-300 ${isMinimized ? "w-20" : "w-64"}`}
    >
      {/* Toggle Button */}
      <div
        className="absolute top-4 right-4 z-60 flex flex-col justify-center items-center space-y-2 cursor-pointer"
        onClick={toggleSidebar}
      >
        <Navigation />
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 mt-10">
        {/* Profile Section - always shown */}
        <div className="p-4 flex items-center gap-3 justify-center">
          <div className="relative w-10 h-10">
            <img
              src="/images/tempo.png"
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full"
            />
            {/* Dynamic status dot */}
            <span
              className="absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-[#1551a9]"
              style={{ backgroundColor: statusColor }}
            />
          </div>

          {!isMinimized && (
            <div>
              <h3 className="font-medium">Kemly Rose</h3>
              <p className="text-xs opacity-80">BS: Information Technology</p>
            </div>
          )}
        </div>

        {/* Status Section */}
        {!isMinimized && (
  <div className="px-4 py-2">
    <div className="bg-[#3361ac] rounded-full py-1 px-3 inline-flex items-center mb-2">
      {/* Animated Status Dot */}
      <motion.span
        className="mr-2"
        style={{
          width: "0.5rem",
          height: "0.5rem",
        }}
        animate={{
          backgroundColor: statusColor, // Update color based on the status
          clipPath:
            status === "Available for Work"
              ? "circle(50%)" // Green circle for Available
              : status === "Application in Progress"
              ? "ellipse(50% 60% at 50% 50%)" // Orange crescent for In Progress
              : "polygon(50% 0%, 100% 30%, 80% 100%, 20% 100%, 0% 30%)", // Red octagon for DND (Hired)
        }}
        transition={{ duration: 0.5 }} // Duration of 0.5 seconds for the transition
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="bg-transparent text-xs text-white outline-none cursor-pointer"
      >
        <option value="Available for Work">Available for Work</option>
        <option value="Application in Progress">Application in Progress</option>
        <option value="Hired">Hired</option>
      </select>
    </div>
  </div>
)}




        {/* Interview Button */}
        {!isMinimized && (
          <div className="px-4 py-2">
            <button className="bg-white text-[#1551a9] rounded-full py-2 px-4 w-full text-sm font-medium">
              Interview practice
            </button>
          </div>
        )}

        {/* Nav */}
        <nav className="mt-4">
          <ul className="space-y-1">
            <li className="flex items-center px-4 py-3">
              <div className="mr-3 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                </svg>
              </div>
              {!isMinimized && <span>Job Matches</span>}
            </li>
            <li className="flex items-center px-4 py-3">
              <div className="mr-3 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                </svg>
              </div>
              {!isMinimized && <span>Applications</span>}
            </li>
            {/* Add more as needed */}
          </ul>
        </nav>
      </div>
    </div>
  );
}
