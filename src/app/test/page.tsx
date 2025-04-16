
"use client";
import React, { useEffect, useState, useRef } from "react";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { IoIosArrowRoundBack } from "react-icons/io";
import Sidebar from "@/app/side-nav/sidebar";
import TopNav from "@/app/student/student-dashboard/TopNav";
import JobCards from "@/app/student/student-dashboard/JobCards";

{/* Needs fix, 
    -figure out why nag scroscroll down ung right 
    content pag nasa dulo na, dpt hanggang dulo wla parin space */}

export default function Home() {
  const [isSideNavMinimized, setIsSideNavMinimized] = React.useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const rightContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!searchRef.current || !rightContentRef.current) return;
      const searchRect = searchRef.current.getBoundingClientRect();
      setIsFixed(searchRect.bottom <= 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex bg-blue-50 min-h-screen w-full relative">
      {/* Sidebar */}
      <Sidebar onToggle={(expanded) => setIsSideNavMinimized(!expanded)} />

      {/* Main Content */}
      <main
        className={`transition-all duration-200 ease-in-out flex-1 ${
          isSideNavMinimized ? "ml-20" : "ml-72"
        }`}
      >
        {/* Top Navigation */}
        <TopNav isSidebarMinimized={isSideNavMinimized} />

        {/* Content Wrapper */}
        <div className="pt-16">
          {/* Search Section */}
          <div ref={searchRef} className="p-9 bg-white rounded-lg shadow-sm m-4">
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
              {["All work types", "All remote options", "Program", "Listed anytime"].map(
                (label, idx) => (
                  <div className="relative" key={idx}>
                    <button className="flex items-center gap-4 px-6 py-4 rounded-full border border-[#babaf6] text-base text-gray-600">
                      {label}
                      <ChevronDown size={16} />
                    </button>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="flex px-4 pb-4 gap-4 relative overflow-clip">
            {/* Left Content - scrolls with page */}
            <div className="w-1/2 space-y-4 pb-64 ">
              <JobCards />
            </div>

            {/* Right Content - sticky after scroll */}
            <div className="w-1/2 resize-none pl-10 h-[400vh] right-5 absolute ">
              <div
                ref={rightContentRef}
                className={`transition-all duration-200 ease-in-out bg-[#1551a9] p-4 shadow rounded overflow-y-auto ${
                  isFixed ? "sticky top-24" : ""
                }`}
                style={{
                  maxHeight: "calc(100vh - 2rem)",
                  minHeight: "calc(100vh - 2rem)",
                  position: isFixed ? "sticky" : "relative",
                  top: isFixed ? "70px" : "auto",
                }}
              >
                <div className="mb-4 mt-3">
                  <div className="flex items-center ml-3">
                    <IoIosArrowRoundBack className="h-8 w-8 text-white mr-5" />
                    <h1 className="font-medium text-2xl text-white">Select a Job</h1>
                  </div>
                  <p className="text-gray-300 text-sm pl-[65px]">Display details here</p>
                </div>
                <div className="flex justify-center mt-6">
                  <img
                    src="https://img.freepik.com/free-vector/business-people-arranging-appointment-digital-booking-app_74855-20006.jpg"
                    alt="Working from Home Illustration"
                    className="w-96 h-96   rounded-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
