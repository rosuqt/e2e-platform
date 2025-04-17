import Image from "next/image";
import { MapPin, Bookmark, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

export default function JobListingPage() {
  return (
    <div className="flex h-screen">
      <div className="w-64 bg-blue-700 text-white flex flex-col">
        <div className="p-4 flex items-center justify-between">
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
              <h3 className="font-semibold">Kemly Rose</h3>
              <p className="text-xs">BS: Information Technology</p>
            </div>
          </div>
          <button className="text-white">
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
              className="lucide lucide-menu"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-4 py-2">
          <div className="bg-green-400 text-green-800 text-xs px-3 py-1 rounded-full inline-flex items-center">
            <span className="w-2 h-2 bg-green-800 rounded-full mr-1"></span>
            Available for Work
          </div>
        </div>

        <div className="mt-4 px-4">
          <Button className="w-full bg-white text-blue-700 hover:bg-blue-100">
            Interview practice
          </Button>
        </div>

        <nav className="mt-8 flex-1">
          <ul>
            <li className="flex items-center px-4 py-3 hover:bg-blue-800 cursor-pointer">
              <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-list"
                >
                  <line x1="8" x2="21" y1="6" y2="6" />
                  <line x1="8" x2="21" y1="12" y2="12" />
                  <line x1="8" x2="21" y1="18" y2="18" />
                  <line x1="3" x2="3.01" y1="6" y2="6" />
                  <line x1="3" x2="3.01" y1="12" y2="12" />
                  <line x1="3" x2="3.01" y1="18" y2="18" />
                </svg>
              </div>
              Job listings
            </li>
            <li className="flex items-center px-4 py-3 hover:bg-blue-800 cursor-pointer">
              <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-mail"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              My applications
            </li>
            <li className="flex items-center px-4 py-3 hover:bg-blue-800 cursor-pointer">
              <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-bookmark"
                >
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                </svg>
              </div>
              Saved Jobs
            </li>
            <li className="flex items-center px-4 py-3 hover:bg-blue-800 cursor-pointer">
              <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-calendar"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
              </div>
              Calendar
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="h-16 border-b flex items-center px-4">
          <div className="flex items-center gap-2 text-blue-500 mr-auto">
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
              className="lucide lucide-link"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span className="font-semibold">Seekr</span>
          </div>

          <nav className="flex items-center">
            <a
              href="#"
              className="px-6 py-4 text-gray-500 hover:text-gray-800 flex flex-col items-center text-xs"
            >
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
                className="lucide lucide-home"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Home</span>
            </a>
            <a
              href="#"
              className="px-6 py-4 text-gray-500 hover:text-gray-800 flex flex-col items-center text-xs"
            >
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
                className="lucide lucide-users"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>People</span>
            </a>
            <a
              href="#"
              className="px-6 py-4 text-blue-600 border-b-2 border-blue-600 flex flex-col items-center text-xs"
            >
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
                className="lucide lucide-briefcase"
              >
                <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <span>Jobs</span>
            </a>
            <a
              href="#"
              className="px-6 py-4 text-gray-500 hover:text-gray-800 flex flex-col items-center text-xs"
            >
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
                className="lucide lucide-message-square"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>Messages</span>
            </a>
            <a
              href="#"
              className="px-6 py-4 text-gray-500 hover:text-gray-800 flex flex-col items-center text-xs"
            >
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
                className="lucide lucide-bell"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <span>Notifications</span>
            </a>
            <a
              href="#"
              className="px-6 py-4 text-gray-500 hover:text-gray-800 flex flex-col items-center text-xs"
            >
              <div className="relative w-6 h-6 rounded-full overflow-hidden">
                <Image
                  src="/placeholder.svg?height=24&width=24"
                  alt="Profile"
                  width={24}
                  height={24}
                  className="object-cover"
                />
              </div>
              <span>Me</span>
            </a>
          </nav>
        </header>

        {/* Main Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 py-6">
            {/* Top row with search and filters */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
              {/* User Greeting */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg shadow-sm p-4 h-full">
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=32&width=32"
                        alt="Profile"
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1 max-w-xs">
                        <p className="font-medium text-sm">Hello, Kemly Rose</p>
                        <div className="bg-green-400 text-green-800 text-xs px-2 py-0.5 rounded-full inline-flex items-center">
                          <span className="w-1.5 h-1.5 bg-green-1000 rounded-full mr-0.5"></span>
                          Available for work
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compact Job Search */}
              <div className="lg:col-span-6">
                <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-lg shadow-sm p-4 text-white h-full">
                  <h2 className="text-xl font-bold mb-2">
                    Find your perfect job
                  </h2>
                  <p className="text-gray-200 text-sm mb-3">
                    Explore job listings tailored to your skills and interests.
                    Find the right opportunity and take the next step in your
                    career!
                  </p>
                  <div className="bg-white rounded-lg p-1 flex">
                    <Input
                      type="text"
                      placeholder="Search jobs"
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Search
                    </Button>
                  </div>
                  <div className="mt-2 text-sm">
                    <span>Sort by: Relevance</span>
                  </div>
                </div>
              </div>

              {/* Filter Section */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg shadow-sm p-4 h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Filter by</h3>
                    <button className="text-blue-600 text-sm">Clear</button>
                  </div>

                  {/* Job Type - First filter section */}
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
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
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
                          <p className="text-xs text-gray-500">
                            Fb Mark-it Place
                          </p>
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
                          <p className="text-xs text-gray-500">
                            Fb Mark-it Place
                          </p>
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
                          <p className="text-xs text-gray-500">
                            Fb Mark-it Place
                          </p>
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

              {/* Right Column - Job Listings and Filters */}
              <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Job Listings - 2 columns on larger screens */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Job Listing 1 */}
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
                          <h3 className="font-semibold text-lg">
                            UI/UX Designer
                          </h3>
                          <p className="text-sm text-gray-500">
                            Fb Mark-it Place
                          </p>
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
                      <p className="text-gray-700 font-medium">
                        ₱20,000-30,000 / a month
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Seeking a creative UI/UX Designer to craft intuitive and
                        visually engaging user experiences. You will design
                        user-friendly interfaces that enhance functionality and
                        aesthetics
                      </p>
                      <p className="text-green-500 font-medium mt-2">
                        You are 98% matched to this job!
                      </p>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <Button className="bg-blue-500 hover:bg-blue-600">
                        Apply
                      </Button>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <Clock size={16} />
                          <span>3 days left</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
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
                            className="lucide lucide-briefcase"
                          >
                            <rect
                              width="20"
                              height="14"
                              x="2"
                              y="7"
                              rx="2"
                              ry="2"
                            />
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                          </svg>
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

                  {/* Job Listing 2 */}
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
                          <h3 className="font-semibold text-lg">
                            UI/UX Designer
                          </h3>
                          <p className="text-sm text-gray-500">
                            Fb Mark-it Place
                          </p>
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
                      <p className="text-gray-700 font-medium">
                        ₱20,000-30,000 / a month
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Seeking a creative UI/UX Designer to craft intuitive and
                        visually engaging user experiences. You will design
                        user-friendly interfaces that enhance functionality and
                        aesthetics
                      </p>
                      <p className="text-green-500 font-medium mt-2">
                        You are 98% matched to this job!
                      </p>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <Button className="bg-blue-500 hover:bg-blue-600">
                        Apply
                      </Button>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <Clock size={16} />
                          <span>3 days left</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
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
                            className="lucide lucide-briefcase"
                          >
                            <rect
                              width="20"
                              height="14"
                              x="2"
                              y="7"
                              rx="2"
                              ry="2"
                            />
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                          </svg>
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

                  {/* Job Listing 3 */}
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
                          <h3 className="font-semibold text-lg">
                            UI/UX Designer
                          </h3>
                          <p className="text-sm text-gray-500">
                            Fb Mark-it Place
                          </p>
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
                      <p className="text-gray-700 font-medium">
                        ₱20,000-30,000 / a month
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Seeking a creative UI/UX Designer to craft intuitive and
                        visually engaging user experiences. You will design
                        user-friendly interfaces that enhance functionality and
                        aesthetics
                      </p>
                      <p className="text-green-500 font-medium mt-2">
                        You are 98% matched to this job!
                      </p>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <Button className="bg-blue-500 hover:bg-blue-600">
                        Apply
                      </Button>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <Clock size={16} />
                          <span>3 days left</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
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
                            className="lucide lucide-briefcase"
                          >
                            <rect
                              width="20"
                              height="14"
                              x="2"
                              y="7"
                              rx="2"
                              ry="2"
                            />
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                          </svg>
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
                </div>

                {/* Additional Filters Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
                    <div className="space-y-6">
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
                          <Slider
                            defaultValue={[50]}
                            max={100}
                            step={1}
                            className="my-6"
                          />
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
                            <label
                              htmlFor="mostapplications"
                              className="text-sm"
                            >
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
