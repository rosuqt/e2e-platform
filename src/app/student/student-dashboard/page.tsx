"use client";
import React from "react";
import { Search, MapPin, ChevronDown } from "lucide-react";

import TopNav from "./TopNav";
import Sidebar from "@/app/side-nav/sidebar";
import JobCards from "./JobCards";

export default function JobSearchPlatform() {
  const [isSideNavMinimized, setIsSideNavMinimized] = React.useState(false);

  return (
    <div className="flex bg-blue-50 min-h-screen w-full overflow-x-hidden relative">
      <Sidebar onToggle={(expanded) => setIsSideNavMinimized(!expanded)} />

      {/* Main Content */}
      <main
        className={`transition-all duration-200 ease-in-out w-full ${
          isSideNavMinimized ? "ml-20" : "ml-64"
        }`}
        style={{ marginLeft: isSideNavMinimized ? "80px" : "280px" }}
      >
        <div className="flex-1">
          {/* Top Navigation */}
          <TopNav isSidebarMinimized={isSideNavMinimized} />

          {/* Search Section */}
          <div className="p-9 mt-24 bg-white rounded-lg shadow-sm m-4">
            <h1 className="text-3xl font-bold text-[#1551a9] mb-6">
              Find your perfect job
            </h1>

            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-5 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Find your perfect job"
                  className="w-full pl-10 pr-4 py-4 rounded-md bg-[#f5f5f5] border border-[#e6e6ed]"
                />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-5 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full pl-10 pr-4 py-4 rounded-md bg-[#f5f5f5] border border-[#e6e6ed]"
                />
              </div>
              <button className="bg-[#3b82f6] text-white px-14 py-3 rounded-xl font-medium">
                Search
              </button>
            </div>

            <div className="flex gap-32 justify-center w-full">
              {["All work types", "All remote options", "Program", "Listed anytime"].map((label, idx) => (
                <div className="relative" key={idx}>
                  <button className="flex items-center gap-4 px-6 py-4 rounded-full border border-[#babaf6] text-base text-gray-600">
                    {label}
                    <ChevronDown size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Job Listings and Right Content */}
          <div className="flex gap-4 px-4 pb-4">
            {/* Left Content (scrolls normally with the page) */}
            <div className="w-1/2 pr-4 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#1551a9]">Job Postings</h2>
                <div className="text-sm text-gray-500">
                  Sorted by <span className="font-medium">relevance</span>
                </div>
              </div>

              {/* Use JobCards Component */}
              <JobCards />
            </div>

            {/* Right Content (sticky and scrollable) */}
            <div className="w-1/2 pl-4">
              <div className="sticky top-0 h-screen overflow-y-auto">
                <div className="bg-white p-4 shadow rounded">
                  <p className="font-bold mb-2">Sticky Content</p>
                  {Array.from({ length: 50 }).map((_, i) => (
                    <p key={i}>Content {i + 1}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
