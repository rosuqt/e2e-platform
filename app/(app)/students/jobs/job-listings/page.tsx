"use client"

import { useState, useRef, useEffect } from "react"
import {
  Search,
  ChevronDown,
  CheckCircle,
  Clock,
  Bookmark,
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import Drawer from "@mui/material/Drawer"
import { createPortal } from "react-dom"
import FilterModal from "./components/filter-modal"
import JobCard from "./components/job-cards"
import JobMatches from "./components/job-matches"
import ProfileCompletion from "./components/profile-completion"
import JobDetails from "./components/job-details"

export default function JobListingPage() {
  useEffect(() => {
    document.documentElement.classList.add("overflow-hidden");

    return () => {
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, []);

  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false)
  const [showProfileColumn, setShowProfileColumn] = useState(true)

  const rightSectionRef = useRef<HTMLDivElement | null>(null)
  const leftSectionRef = useRef<HTMLDivElement | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
      {/* Mobile Navigation */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm md:hidden">
        <Drawer
          anchor="left"
          open={isSidebarMinimized}
          onClose={() => setIsSidebarMinimized(false)}
          className="w-[85%] sm:w-[350px] p-0 overflow-y-auto bg-gradient-to-br from-blue-50 to-sky-100"
        >
          <MobileUserProfile />
        </Drawer>

        <motion.h1
          className="text-lg font-bold text-blue-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Job Listings
        </motion.h1>


      </div>
      <div
        className={`
          flex flex-col md:flex-row h-[calc(100vh-56px)] md:h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-sky-100
        `}
      >
        {/* Left Column - User Profile - Hidden on mobile, visible on md and up */}
        {showProfileColumn && (
          <div className="hidden md:block w-80 flex-shrink-0 overflow-y-auto border-r border-blue-200 relative">
            <button
              className="absolute top-2 right-2 z-20 bg-white border border-blue-200 rounded-full p-1 shadow hover:bg-blue-50 transition-colors"
              title="Hide Column"
              onClick={() => setShowProfileColumn(false)}
            >
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
                className="lucide lucide-chevron-left text-blue-600"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <UserProfile />
          </div>
        )}

        {!showProfileColumn && (
          <div className="hidden md:flex w-6 flex-shrink-0 items-start justify-center pt-4">
            <button
              className="bg-white border border-blue-200 rounded-full p-1 shadow hover:bg-blue-50 transition-colors"
              title="Show Profile Column"
              onClick={() => setShowProfileColumn(true)}
            >
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
                className="lucide lucide-chevron-right text-blue-600"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}
        {/* Middle Column - Job Listings - SCROLLABLE */}
        <div
          ref={leftSectionRef}
          className={`
            flex-1 overflow-y-auto
            transition-all duration-300
            ${selectedJob !== null ? "lg:basis-2/3" : ""}
          `}
        >

          <JobListings selectedJob={selectedJob} onSelectJob={setSelectedJob} />
        </div>
        {/* Right Column - Job Details - Only visible when a job is selected */}
        {selectedJob !== null && (
          <div
            ref={rightSectionRef}
            className={`
              hidden lg:block flex-shrink-0 overflow-y-auto border-l border-blue-200 transition-all duration-300 ease-in-out
              w-[35%] max-w-[600px]
            `}
          >
            {/* Debug: log selected job's responsibilities */}
            {/* 
            {(() => {
              const job = jobs.find(j => j.id === selectedJob);
              if (job) {
                console.log("DEBUG responsibilities:", job.responsibilities);
              }
              return null;
            })()}
            */}
            <JobDetails onClose={() => setSelectedJob(null)} jobId={selectedJob} />
          </div>
        )}
      </div>
    </div>
  )
}

// Mobile User Profile Component
function MobileUserProfile() {
  return <UserProfile />
}

// User Profile Component
function UserProfile() {
  return (
    <div className="p-4 mt-1">
      {/* Profile Completion */}
      <ProfileCompletion />

      {/* Job Matches */}
      <JobMatches />
    </div>
  )
}

// Job Listings Component
function JobListings({ onSelectJob, selectedJob }: { onSelectJob: (id: string | null) => void; selectedJob: string | null }) {
  type Job = {
    id: string | number;
    title?: string;
    location?: string;
    type?: string;
    isSaved?: boolean;
    isApplied?: boolean;
    isRemote?: boolean;
    [key: string]: string | number | boolean | undefined;
  }
  const [showQuickApply, setShowQuickApply] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("recommended");
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [filters, setFilters] = useState<Record<string, string | boolean>>({});
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/students/job-listings")
      .then(res => res.json())
      .then(data => {
        setJobs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/students/job-listings/saved-jobs")
      .then(res => res.json())
      .then(data => setSavedJobIds(data.jobIds?.map(String) ?? []));
  }, []);

  useEffect(() => {
    setJobs(jobs =>
      jobs.map(job => ({
        ...job,
        isSaved: savedJobIds.includes(String(job.id)),
      }))
    );
  }, [savedJobIds]);

  const handleTabFilter = (tabId: string) => {
    setActiveTab(tabId);
    setFilters((prev) => {
      if (tabId === "saved") return { ...prev, isSaved: true };
      return {};
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        if (scrollContainerRef.current!.scrollTop > 50) {
          setIsHeaderCollapsed(true);
        } else {
          setIsHeaderCollapsed(false);
        }
      }, 100);
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (e.target.value.trim() === "") {
      setSearchQuery("");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim() === "") {
      setSearchQuery("");
    } else {
      setSearchQuery(search);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (activeTab === "saved" && !job.isSaved) return false;
    if (searchQuery.trim() !== "") {
      const title = typeof job.title === "string" ? job.title : "";
      const jobTitle =
        typeof job["job_title"] === "string" ? job["job_title"] as string : "";
      if (
        !title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
      ) return false;
    }
    if (filters.type) {
      const filterTypes = String(filters.type).split(",");
      if (!filterTypes.includes(String(job.type))) return false;
    }
    if (filters.location) {
      const filterLocations = String(filters.location).split(",");
      if (!filterLocations.includes(String(job.location))) return false;
    }
    if (filters.salary) {
      const salaryValue = Number(filters.salary);
      if (typeof job.salary === "number" && job.salary < salaryValue) return false;
    }
    return true;
  });

  const tabCounts = {
    recommended: jobs.length,
    recent: jobs.length,
    saved: jobs.filter(j => j.isSaved).length,
  };

  // Add this handler with the correct type
  function handleFilterModalApply(newFilters: Record<string, string | boolean>) {
    setFilters(newFilters);
  }

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-30 pt-2 pb-4 bg-gradient-to-br from-blue-50 to-sky-100 mx-2 -mb-6">
          <motion.div
            className=" mt-3 bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl shadow-xl text-white mb-4 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              padding: isHeaderCollapsed ? "8px 16px" : "48px 16px",
              transition: "padding 0.3s ease",
            }}
          >
            <motion.div
              style={{
                height: isHeaderCollapsed ? 0 : "auto",
                opacity: isHeaderCollapsed ? 0 : 1,
                overflow: "hidden",
                marginBottom: isHeaderCollapsed ? 0 : 16,
                transition: "height 0.5s ease, opacity 0.5s ease, margin-bottom 0.5s ease",
              }}
            >
              <motion.h2
                className="text-2xl font-bold relative z-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Find your perfect job
              </motion.h2>

              <motion.p
                className="text-blue-100 text-sm relative z-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Explore job listings tailored to your skills and interests. Find the right opportunity and take the next
                step in your career!
              </motion.p>
            </motion.div>

            <motion.form
              className="bg-white rounded-xl p-2 flex flex-col sm:flex-row relative z-10 items-center justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              onSubmit={handleSearchSubmit}
            >
              <Input
                type="text"
                placeholder="Search jobs"
                className="border-0 text-black focus-visible:ring-0 focus-visible:ring-offset-0 mb-1 sm:mb-0 flex-1"
                value={search}
                onChange={handleSearchChange}
              />
              <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto" type="submit">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </motion.form>
          </motion.div>

          <div className="flex items-center justify-between pb-2 mb-2 scrollbar-hide">
            <div className="flex overflow-x-auto space-x-2">
              {[{ id: "recommended", label: "Recommended", icon: <CheckCircle className="w-3 h-3" /> },
                { id: "recent", label: "Recent", icon: <Clock className="w-3 h-3" /> },
                { id: "saved", label: "Saved", icon: <Bookmark className="w-3 h-3" /> },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  className={`${
                    selectedJob !== null
                      ? "w-10 h-10 rounded-full flex items-center justify-center bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
                      : `px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-1 ${
                          activeTab === tab.id
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
                        }`
                  }`}
                  onClick={() => handleTabFilter(tab.id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tab.icon}
                  {selectedJob === null && <span>{tab.label}</span>}
                  {selectedJob === null && (
                    <span className="ml-1 bg-white text-blue-600 text-xs rounded-full px-1.5">
                      {tabCounts[tab.id as keyof typeof tabCounts]}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
            <div className="flex items-center gap-2 ">
              <div className="relative flex items-center gap-1">
                <span className="text-sm font-medium text-blue-600">Sort by</span>
                <motion.button
                  className="bg-white px-3 py-1 rounded-full text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 flex items-center gap-1"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Relevance
                  <ChevronDown className="h-3 w-3" />
                </motion.button>
              </div>
              <Button
                className="bg-white px-3 py-1 rounded-full text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-50"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                {isFilterOpen ? "Close Filters" : "Filters"}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-4 mb-20 ">
          {loading ? (
            <div>Loading...</div>
          ) : filteredJobs.length === 0 ? (
            <div>No jobs found.</div>
          ) : (
            filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                id={job.id}
                isSelected={selectedJob === String(job.id)}
                onSelect={() => onSelectJob(selectedJob === String(job.id) ? null : String(job.id))}
                onQuickApply={() => {
                  setShowQuickApply(true);
                }}
                job={job}
              />
            ))
          )}
        </div>
      </div>

      {isFilterOpen &&
        createPortal(
          <FilterModal
            onClose={() => setIsFilterOpen(false)}
            onApply={handleFilterModalApply}
            currentFilters={filters}
          />,
          document.body
        )}

      {showQuickApply &&
        createPortal(
          <QuickApplyModal onClose={() => setShowQuickApply(false)} />,
          document.body
        )}
    </div>
  );
}

// Quick Apply Modal
function QuickApplyModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1)
  const totalSteps = 3

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xl">Quick Apply</h3>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={onClose}>
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
              <span className="sr-only">Close</span>
            </Button>
          </div>
       

          {/* Progress bar */}
          <div className="mt-4 h-1.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-1 text-blue-100">
            <span>
              Step {step} of {totalSteps}
            </span>
            <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="font-medium text-lg text-blue-700">Personal Information</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <Input defaultValue="Kemly Rose" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input defaultValue="kemly.rose@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <Input placeholder="Enter your phone number" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h4 className="font-medium text-lg text-blue-700">Resume & Cover Letter</h4>
              <div className="space-y-3">
                <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 text-center">
                  <div className="flex flex-col items-center justify-center">
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
                      className="text-blue-500 mb-2"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <path d="M16 13H8" />
                      <path d="M16 17H8" />
                      <path d="M10 9H8" />
                    </svg>
                    <p className="text-sm text-blue-700 font-medium">Upload your resume</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOCX or TXT (Max 5MB)</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Browse Files
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter (Optional)</label>
                  <textarea
                    className="w-full min-h-[100px] rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us why you're a good fit for this position..."
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h4 className="font-medium text-lg text-blue-700">Additional Questions</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    How many years of experience do you have in this field?
                  </label>
                  <select className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Less than 1 year</option>
                    <option>1-2 years</option>
                    <option>3-5 years</option>
                    <option>5+ years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">When can you start?</label>
                  <select className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Immediately</option>
                    <option>In 2 weeks</option>
                    <option>In 1 month</option>
                    <option>More than 1 month</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">What is your expected salary?</label>
                  <Input placeholder="Enter amount in PHP" />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : (
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}

            {step < totalSteps ? (
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setStep(step + 1)}>
                Continue
              </Button>
            ) : (
              <Button className="bg-green-600 hover:bg-green-700" onClick={onClose}>
                Submit Application
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
