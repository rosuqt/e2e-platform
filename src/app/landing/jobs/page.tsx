"use client";

import { useState } from "react";
import JobList from "./JobList";
import JobDetails from "./JobDetails";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";

interface Job {
  title: string;
  company: string;
  location: string;
  description: string;
  detail: string;
  jobtype: string;
  salaryrange: string;
}

interface JobListProps {
  onSelectJob: (job: Job) => void;
}

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    program: "",
    course: "",
    remote: "",
    workType: "",
  });
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white shadow-md py-3 px-6 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <span className="text-blue-600 font-bold text-lg">InternConnect</span>
          <div className="hidden md:flex gap-6 text-gray-700 text-sm">
            <Link href="#" className="hover:text-blue-600">People</Link>
            <Link href="#" className="hover:text-blue-600">Jobs</Link>
            <Link href="#" className="hover:text-blue-600">Companies</Link>
            <Link href="#" className="hover:text-blue-600">STI Hiring</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-blue-600 hover:underline text-sm">Sign in</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
            Employers/Post job
          </button>
        </div>
      </nav>

      {/* Search Bar & Filters */}
      <div className="flex flex-col items-center mt-4">
        <div className="flex border rounded-lg overflow-hidden max-w-4xl w-full shadow-lg">
          <div className="flex items-center px-3 bg-gray-100">
            <FaSearch className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Job title, keywords, or company"
            className="w-full px-3 py-3 outline-none text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex gap-4 mt-4">
          {["Program", "Course", "Remote options", "Work Type"].map((label, index) => (
            <select
              key={index}
              className="border rounded-lg px-4 py-2 shadow-md text-black font-semibold"
              value={filters[label.toLowerCase() as keyof typeof filters]}
              onChange={(e) => setFilters({ ...filters, [label.toLowerCase()]: e.target.value })}
            >
              <option value="">{label}</option>
            </select>
          ))}
        </div>
      </div>

      {/* Section Title */}
      <div className="text-center font-bold text-xl mt-6">
        Jobs for you
        <hr className="mt-2 border-t-2 border-gray-300 w-full max-w-6xl mx-auto" />
      </div>

      {/* Jobs Layout */}
      <div className="flex mt-6 gap-6 w-full max-w-6xl mx-auto">
        {/* Left - Job List (Scrollable) */}
        <div className="w-1/3 h-[500px] overflow-y-auto border-r pr-4">
          <JobList onSelectJob={setSelectedJob} />
        </div>

        {/* Right - Job Details */}
        <div className="w-2/3 p-6 bg-white shadow-md rounded-lg">
          <JobDetails job={selectedJob} />
        </div>
      </div>
    </>
  );
}
