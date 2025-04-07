"use client";
import React from "react";
import {
  Search,
  MapPin,
  ChevronDown,
  Bookmark,
  Clock,
  Briefcase,
  DollarSign,
  CheckCircle,
} from "lucide-react";


import TopNav from "./TopNav";
import SideNav from "./SideNav";

export default function JobSearchPlatform() {
  const [isSideNavMinimized, setIsSideNavMinimized] = React.useState(false);

  return (
    <div className="flex bg-blue-50 min-h-screen w-full overflow-x-hidden">
      <SideNav onToggle={setIsSideNavMinimized} />

      {/* Main Content */}

      <main
        className={`transition-all duration-300 w-full ${
        isSideNavMinimized ? "ml-20" : "ml-64"
        }`}
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

        {/* Job Listings */}
        <div className="flex flex-1 gap-4 px-4 pb-4 h-[calc(100vh-100px)]">
          <div className="w-1/2 pr-4 flex flex-col h-full overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#1551a9]">Job Postings</h2>
              <div className="text-sm text-gray-500">
                Sorted by <span className="font-medium">relevance</span>
              </div>
            </div>

            {/* Scrollable Job Cards */}
            <div className="space-y-4">
              {[
                {
                  title: "Software Engineer",
                  company: "Alibaba Group",
                  reviews: "4.2/5 (12 reviews)",
                  closing: "Closing in 1 month",
                  match: "98%",
                  salary: "800 / a day",
                  posted: "1hr ago",
                },
                {
                  title: "Frontend Developer",
                  company: "Meta",
                  reviews: "4.5/5 (24 reviews)",
                  closing: "Closing in 2 weeks",
                  match: "95%",
                  salary: "900 / a day",
                  posted: "3hr ago",
                },
                {
                  title: "Product Manager",
                  company: "Google",
                  reviews: "4.7/5 (18 reviews)",
                  closing: "Closing in 1 week",
                  match: "92%",
                  salary: "950 / a day",
                  posted: "5hr ago",
                },
                {
                  title: "Data Analyst",
                  company: "Apple",
                  reviews: "4.3/5 (15 reviews)",
                  closing: "Closing in 3 days",
                  match: "89%",
                  salary: "850 / a day",
                  posted: "7hr ago",
                },
              ].map((job, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-[#e6e6ed] p-4 relative"
                >
                  <button className="absolute top-4 right-4">
                    <Bookmark className="text-gray-400" size={20} />
                  </button>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#dfebfb] flex items-center justify-center">
                      {/* Icon Placeholder */}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.company}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs ml-1">{job.reviews}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <Clock size={16} className="text-[#1551a9] mr-2" />
                      <span>{job.closing}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Briefcase size={16} className="text-gray-500 mr-2" />
                      <span>On-the-Job Training</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <DollarSign size={16} className="text-gray-500 mr-2" />
                      <span>{job.salary}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="bg-[#00d23f] text-white rounded-full py-2 px-4 flex items-center justify-center">
                      <CheckCircle size={16} className="mr-2" />
                      <span>You are {job.match} Matched to this job</span>
                    </div>
                  </div>

                  <div className="mt-2 text-right text-xs text-gray-500">
                    {job.posted}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optional: Add a right-side panel if needed */}
        </div>
        </div>
      </main>
    </div>
   

  );
}
  