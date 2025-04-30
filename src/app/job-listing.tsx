"use client";

import Image from "next/image";
import {
  MapPin,
  Bookmark,
  Clock,
  Users,
  Filter,
  User,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function JobListingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <User className="h-5 w-5" />
              <span className="sr-only">Open profile sidebar</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[85%] sm:w-[350px] p-0 overflow-y-auto"
          >
            <LeftSidebar />
          </SheetContent>
        </Sheet>

        <h1 className="text-lg font-bold">Job Listings</h1>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Filter className="h-5 w-5" />
              <span className="sr-only">Open filters</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[85%] sm:w-[350px] p-0 overflow-y-auto"
          >
            <RightSidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Area with 3 columns */}
      <div className="flex flex-col md:flex-row h-[calc(100vh-56px)] md:h-screen overflow-hidden bg-gray-50">
        {/* Left Column - Job Matches and Skills - Hidden on mobile, visible on md and up */}
        <div className="hidden md:block w-80 flex-shrink-0 overflow-y-auto border-r border-gray-200">
          <LeftSidebar />
        </div>

        {/* Middle Column - Job Listings - SCROLLABLE */}
        <div className="flex-1 overflow-y-auto">
          <JobListings />
        </div>

        {/* Right Column - Filters - Hidden on mobile, visible on lg and up */}
        <div className="hidden lg:block w-80 flex-shrink-0 overflow-y-auto border-l border-gray-200">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}

// Left Sidebar Component
function LeftSidebar() {
  return (
    <div className="p-4">
      {/* User Greeting */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            <Image
              src="/placeholder.svg?height=48&width=48"
              alt="Profile"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium">Hello, Kemly Rose</h3>
            <p className="text-sm text-gray-500">BS: Information Technology</p>
            <div className="bg-green-400 text-green-800 text-xs px-2 py-0.5 rounded-full inline-flex items-center mt-1">
              <span className="w-1.5 h-1.5 bg-green-800 rounded-full mr-0.5"></span>
              Available for work
            </div>
          </div>
        </div>
      </div>

      {/* Job Matches */}
      <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Job Matches</h3>
          <button className="text-gray-500">
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
              className="lucide lucide-maximize-2"
            >
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" x2="14" y1="3" y2="10" />
              <line x1="3" x2="10" y1="21" y2="14" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center text-red-600 font-bold text-xs">
                ABC
              </div>
              <div>
                <p className="font-medium">Software Engineer</p>
                <p className="text-xs text-gray-500">Fb Mark-it Place</p>
              </div>
            </div>
            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              96%
            </div>
          </div>

          <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center text-purple-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-right"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Software Engineer</p>
                <p className="text-xs text-gray-500">Fb Mark-it Place</p>
              </div>
            </div>
            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              98%
            </div>
          </div>

          <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-circle"
                >
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Software Engineer</p>
                <p className="text-xs text-gray-500">Fb Mark-it Place</p>
              </div>
            </div>
            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              92%
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button className="text-blue-600 text-sm font-medium">
            View All
          </button>
        </div>
      </div>

      {/* Your Skills */}
      <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Your Skills</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-help-circle"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
            Communication
          </span>
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
            Adaptability
          </span>
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
            Leadership
          </span>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-4">Expertise</h3>

        <div className="flex flex-wrap gap-2">
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
            Programming
          </span>
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
            UI/UX
          </span>
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
            Agile
          </span>
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
            SQL
          </span>
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
            Programming
          </span>
        </div>
      </div>
    </div>
  );
}

// Job Listings Component
function JobListings() {
  return (
    <div className="p-4">
      {/* Search and Sort */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-lg shadow-sm p-4 text-white mb-6">
        <h2 className="text-xl font-bold mb-2">Find your perfect job</h2>
        <p className="text-gray-200 text-sm mb-3">
          Explore job listings tailored to your skills and interests. Find the
          right opportunity and take the next step in your career!
        </p>
        <div className="bg-white rounded-lg p-1 flex flex-col sm:flex-row">
          <Input
            type="text"
            placeholder="Search jobs"
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 mb-1 sm:mb-0"
          />
          <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            Search
          </Button>
        </div>
        <div className="mt-2 text-sm">
          <span>Sort by: Relevance</span>
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {/* Job Listing 1 */}
        <JobCard />
        {/* Job Listing 2 */}
        <JobCard />
        {/* Job Listing 3 */}
        <JobCard />
      </div>
    </div>
  );
}

// Job Card Component
function JobCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
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
              className="lucide lucide-t-square"
            >
              <path d="M8 3H5a2 2 0 0 0-2 2v3" />
              <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
              <path d="M3 16v3a2 2 0 0 0 2 2h3" />
              <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg">UI/UX Designer</h3>
            <p className="text-sm text-gray-500">Fb Mark-it Place</p>
            <div className="flex gap-2 mt-1">
              <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs">
                UI/UX
              </span>
              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">
                Creative
              </span>
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <Bookmark size={20} />
        </button>
      </div>

      <div className="mt-3">
        <p className="text-gray-700 font-medium">₱20,000-30,000 / a month</p>
        <p className="text-sm text-gray-600 mt-2">
          Seeking a creative UI/UX Designer to craft intuitive and visually
          engaging user experiences. You will design user-friendly interfaces
          that enhance functionality and aesthetics
        </p>
        <p className="text-green-500 font-medium mt-2">
          You are 98% matched to this job!
        </p>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto">
          Apply
        </Button>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <Clock size={16} />
            <span>3 days left</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <Briefcase size={16} />
            <span>Full-time</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <MapPin size={16} />
            <span>Muntinlupa</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <Users size={16} />
            <span>10 Applied</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Right Sidebar Component
function RightSidebar() {
  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Filter by</h3>
          <button className="text-blue-600 text-sm">Clear</button>
        </div>

        <div className="space-y-6">
          {/* Job Type */}
          <div>
            <h4 className="font-medium mb-3">Job Type</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox id="fulltime" />
                <label htmlFor="fulltime" className="text-sm">
                  Fulltime
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="parttime" />
                <label htmlFor="parttime" className="text-sm">
                  Part-time
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="ojt" checked />
                <label htmlFor="ojt" className="text-sm">
                  OJT
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="internship" />
                <label htmlFor="internship" className="text-sm">
                  Internship
                </label>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="font-medium mb-3">Location</h4>
            <div className="relative mb-3">
              <div className="flex items-center border rounded-md px-3 py-2">
                <MapPin size={16} className="text-gray-400 mr-2" />
                <span className="text-sm">All</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-down ml-auto"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox id="remote" />
                <label htmlFor="remote" className="text-sm">
                  Remote
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="onsite" />
                <label htmlFor="onsite" className="text-sm">
                  Onsite
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="hybrid" checked />
                <label htmlFor="hybrid" className="text-sm">
                  Hybrid
                </label>
              </div>
            </div>
          </div>

          {/* Industry */}
          <div>
            <h4 className="font-medium mb-3">Industry</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox id="technology" checked />
                <label htmlFor="technology" className="text-sm">
                  Technology
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="business" />
                <label htmlFor="business" className="text-sm">
                  Business
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="management" checked />
                <label htmlFor="management" className="text-sm">
                  Management
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="media" />
                <label htmlFor="media" className="text-sm">
                  Media
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="government" />
                <label htmlFor="government" className="text-sm">
                  Government
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="retail" />
                <label htmlFor="retail" className="text-sm">
                  Retail
                </label>
              </div>
            </div>
          </div>

          {/* Salary Range */}
          <div>
            <h4 className="font-medium mb-3">Range Salary</h4>
            <div className="px-1">
              <Slider defaultValue={[50]} max={100} step={1} className="my-6" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>15,000 ₱</span>
                <span>30,000 ₱</span>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div>
            <h4 className="font-medium mb-3">Performance</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox id="mostviews" />
                <label htmlFor="mostviews" className="text-sm">
                  Most Views
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="mostclicks" />
                <label htmlFor="mostclicks" className="text-sm">
                  Most Clicks
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="mostapplications" checked />
                <label htmlFor="mostapplications" className="text-sm">
                  Most Applications
                </label>
              </div>
            </div>
          </div>

          <Button className="w-full bg-blue-500 hover:bg-blue-600">
            Apply filters
          </Button>
        </div>
      </div>
    </div>
  );
}
