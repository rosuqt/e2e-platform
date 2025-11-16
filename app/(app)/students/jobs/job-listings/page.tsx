/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

import Drawer from "@mui/material/Drawer"
import { createPortal } from "react-dom"
import FilterModal from "./components/filter-modal"
import JobCard from "./components/job-cards"
import JobMatches from "./components/job-matches"
import ProfileCompletion from "./components/profile-completion"
import JobDetails from "./components/job-details"
import SavedJobs from "./components/saved-jobs"
import listLoadAnimation from "../../../../../public/animations/list-load.json";
import notFoundAnimation from "../../../../../public/animations/not-found.json";
import Lottie from "lottie-react";
import type { Job } from "./components/job-details";

type JobFilters = Partial<Pick<Job, "work_type" | "location">> & { salary?: string; match_score_min?: number; match_score_max?: number };

export default function JobListingPage() {
  useEffect(() => {
    document.documentElement.classList.add("overflow-hidden");

    return () => {
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, []);

  const searchParams = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : null;
  const initialJobId = searchParams?.get("jobId") ?? null;
  const [selectedJob, setSelectedJob] = useState<string | null>(initialJobId);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false)
  const [showProfileColumn, setShowProfileColumn] = useState(true)

  const rightSectionRef = useRef<HTMLDivElement | null>(null)
  const leftSectionRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const jobId = params.get("jobId");
      if (jobId) setSelectedJob(jobId);
    }
  }, []);

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
      <ProfileCompletion />
      <JobMatches />
      <SavedJobs />
    </div>
  )
}

// Pagination Component
function Pagination({
  totalPages = 1,
  currentPage = 1,
  onPageChange,
}: {
  totalPages?: number
  currentPage?: number
  onPageChange?: (page: number) => void
}) {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange?.(page)
    }
  }

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "…")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("…", totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex flex-col items-center gap-2  min-h-[130px]">
      <div className="flex items-center gap-1 relative">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3   text-gray-600 hover:text-blue-500 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Previous</span>
        </button>
        <div className="flex items-center relative mx-4">
          {visiblePages.map((page, index) => (
            <div key={`${page}-${index}`} className="relative">
              {page === "…" ? (
                <span className="px-3 py-2 text-gray-400 text-sm">…</span>
              ) : (
                <button
                  onClick={() => handlePageChange(page as number)}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                    currentPage === page ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
                  }`}
                >
                  {page}
                  {currentPage === page && (
                    <motion.div
                      layoutId="pagination-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-blue-500 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <span className="text-sm font-medium">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="text-sm text-gray-500" style={{ minHeight: 20 }}>
        Page {currentPage} of {totalPages}
      </div>
    </div>
  )
}

// Job Listings Component
function JobListings({ onSelectJob, selectedJob }: { onSelectJob: (id: string | null) => void; selectedJob: string | null }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [filters, setFilters] = useState<JobFilters>({});
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const [totalPagesState, setTotalPagesState] = useState<number>(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [sortBy, setSortBy] = useState("relevant");
  const [preferredTypes, setPreferredTypes] = useState<string[]>([]);
  const [preferredLocations, setPreferredLocations] = useState<string[]>([]);
  const [, setAllowUnrelatedJobsState] = useState<boolean | null>(null);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (searchQuery) params.set("search", searchQuery);
    if (filters.work_type && typeof filters.work_type === "string" && filters.work_type.length > 0) params.set("work_type", filters.work_type as string);
    if (filters.location && typeof filters.location === "string" && filters.location.length > 0) params.set("location", filters.location as string);
    if (filters.salary && typeof filters.salary === "string" && filters.salary.length > 0) params.set("salary", filters.salary as string);
    if (typeof filters.match_score_min === "number") params.set("match_score_min", String(filters.match_score_min));
    if (typeof filters.match_score_max === "number") params.set("match_score_max", String(filters.match_score_max));
    if (sortBy) params.set("sortBy", sortBy);

    fetch(`/api/students/job-listings?${params.toString()}`)
      .then(res => res.json())
      .then((data) => {
        setJobs(Array.isArray(data.jobs) ? data.jobs : []);
        setTotalJobs(typeof data.total === "number" ? data.total : (Array.isArray(data.jobs) ? data.jobs.length : 0));
        const computedTotalPages = typeof data.totalPages === "number"
          ? data.totalPages
          : Math.max(1, Math.ceil((typeof data.total === "number" ? data.total : (Array.isArray(data.jobs) ? data.jobs.length : 0)) / limit));
        setTotalPagesState(computedTotalPages);
        setPreferredTypes(Array.isArray(data.preferredTypes) ? data.preferredTypes : []);
        setPreferredLocations(Array.isArray(data.preferredLocations) ? data.preferredLocations : []);
        setAllowUnrelatedJobsState(typeof data.allowUnrelatedJobs === "boolean" ? data.allowUnrelatedJobs : null);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [page, limit, searchQuery, filters, sortBy]);

  useEffect(() => {
    onSelectJob(null);
  }, [jobs, onSelectJob]);

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

  useEffect(() => {
    setPage(1);
  }, [searchQuery, filters, sortBy]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.set("page", String(page));
      window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
    }
  }, [page]);

  function handleFilterModalApply(newFilters: Partial<Pick<Job, "work_type" | "location">> & { salary?: string; match_score?: number }) {
    setFilters(newFilters);
  }

  function handleJobSaveToggle(jobId: string | number, isSaved: boolean) {
    setSavedJobIds(prev =>
      isSaved
        ? [...prev, String(jobId)]
        : prev.filter(id => id !== String(jobId))
    );
  }

  const filterCount = Object.values(filters).reduce<number>((acc, val) => {
    if (typeof val === "boolean") return acc + (val ? 1 : 0);
    if (typeof val === "string") return acc + (val.trim().length > 0 ? 1 : 0);
    if (typeof val === "number") return acc + 1;
    return acc;
  }, 0);

  const totalPages = totalPagesState;

  const getJobSalaryNumber = (job: Job): number | null => {
    const hasPayAmountField = Object.prototype.hasOwnProperty.call(job, "pay_amount");
    const rawPay = hasPayAmountField ? (job as any).pay_amount : ((job as any).payAmount ?? (job as any).salary ?? "");

    if (rawPay === null || rawPay === undefined) return null;
    if (typeof rawPay === "number") return rawPay;

    if (typeof rawPay === "string") {
      if (/unpaid|no pay/i.test(rawPay)) return null;
      const digits = rawPay.replace(/[^0-9]/g, "");
      return digits ? Number(digits) : null;
    }

    return null;
  };

  const matchesFilter = (job: Job) => {
    // work_type filter
    if (filters.work_type && typeof filters.work_type === "string" && filters.work_type.trim() !== "") {
      const wanted = filters.work_type.split(",").map(s => s.trim()).filter(Boolean);
      const jobTypes = Array.isArray((job as any).work_type)
        ? (job as any).work_type
        : String((job as any).work_type || "").split(",").map((s: string) => s.trim());
      if (!wanted.some(w => jobTypes.includes(w))) return false;
    }

    // location filter
    if (filters.location && typeof filters.location === "string" && filters.location.trim() !== "") {
      const wantedLoc = filters.location.split(",").map(s => s.trim()).filter(Boolean);
      const jobLocs = Array.isArray((job as any).location)
        ? (job as any).location
        : String((job as any).location || "").split(",").map((s: string) => s.trim());
      if (!wantedLoc.some(w => jobLocs.includes(w))) return false;
    }

    // salary filter
    if (filters.salary && typeof filters.salary === "string" && filters.salary.trim() !== "") {
      const f = filters.salary;

      const jobSalaryNum = getJobSalaryNumber(job);

      const isUnpaid = jobSalaryNum === null && typeof ((job as any).salary || (job as any).pay_amount || (job as any).payAmount) === "string"
        ? /unpaid|no pay/i.test(String((job as any).salary ?? (job as any).pay_amount ?? (job as any).payAmount))
        : jobSalaryNum === null;

      if (f === "unpaid") {
        if (!isUnpaid) return false;
      } else if (f.startsWith(">=")) {
        const val = Number(f.replace(">=", "").replace(/[^0-9]/g, ""));
        if (isNaN(val)) return false;
        if (jobSalaryNum === null) return false;
        if (jobSalaryNum < val) return false;
      } else {
        const val = Number(f.replace(/[^0-9]/g, ""));
        if (!isNaN(val)) {
          if (jobSalaryNum === null) return false;
          if (jobSalaryNum < val) return false;
        }
      }
    }

    // match_score filter
    const min = typeof filters.match_score_min === "number" ? filters.match_score_min : null;
    const max = typeof filters.match_score_max === "number" ? filters.match_score_max : null;
    if (min !== null || max !== null) {
      const jobScore = (job as any).match_score;
      if (typeof jobScore !== "number") return false;
      if (min !== null && jobScore < min) return false;
      if (max !== null && jobScore > max) return false;
    }

    return true;
  };

  const filteredJobs = useMemo(() => {
    if (!filters || Object.keys(filters).length === 0) return jobs;

    const filtered = jobs.filter(matchesFilter);

    if (typeof filters.salary === "string" && /^\s*>=\s*\d+/.test(filters.salary)) {
      return filtered.slice().sort((a, b) => {
        const na = getJobSalaryNumber(a);
        const nb = getJobSalaryNumber(b);
        if (na === null && nb === null) return 0;
        if (na === null) return 1;
        if (nb === null) return -1;
        return na - nb;
      });
    }

    return filtered;
  }, [jobs, filters]);

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
              <div className="relative flex-1 w-full">
                <Input
                  type="text"
                  placeholder="Search jobs"
                  className="border-0 text-black focus-visible:ring-0 focus-visible:ring-offset-0 mb-1 sm:mb-0 pr-10"
                  value={search}
                  onChange={handleSearchChange}
                />
                {search && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                    onClick={() => {
                      setSearch("");
                      setSearchQuery("");
                    }}
                    tabIndex={0}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto" type="submit">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </motion.form>
          </motion.div>

          {/* Controls (shadcn) */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-blue-600">{totalJobs} job listings</span>
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-blue-600">Sort by</Label>
                <Select value={sortBy} onValueChange={(val: string) => setSortBy(val)}>
                  <SelectTrigger className="w-[180px] h-8 bg-white text-blue-600 border font-medium text-center border-blue-200 rounded-full px-3 flex items-center">
                    <SelectValue placeholder="Select sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevant">Relevance</SelectItem>
                    <SelectItem value="reco">Recommended</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              variant="outline"
              className="bg-white px-3 py-1 rounded-full text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 hover:text-blue-700 flex items-center"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="w-4 h-4 mr-1" />
              <span>Filters</span>
              {filterCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-2 rounded-full bg-blue-600 text-white text-xs font-medium">
                  {filterCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col space-y-4 p-4 pb-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-150 h-150 mx-auto">
                <Lottie animationData={listLoadAnimation} loop={true} />
              </div>
              <span className="mt-4 text-blue-700 font-semibold text-base animate-pulse">
                Fetching job listings, please wait...
              </span>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <div className="bg-white rounded-full shadow-lg flex items-center justify-center mt-10 w-64 h-64">
                <Lottie animationData={notFoundAnimation} loop={true} />
              </div>
              <span className="mt-4 text-gray-500 font-medium text-base text-center">
                Hmm... where’d they go?<br />No jobs right now — try refreshing or check back later! 
              </span>
            </div>
          ) : (
            <>
              {filteredJobs
                .map((job) => (
                  <JobCard
                    key={job.id}
                    id={job.id}
                    isSelected={selectedJob === String(job.id)}
                    onSelect={() => onSelectJob(selectedJob === String(job.id) ? null : String(job.id))}
                    onQuickApply={() => {}}
                    job={job}
                    studentPreferredTypes={preferredTypes}
                    studentPreferredLocations={preferredLocations}
                    onSaveToggle={handleJobSaveToggle}
                  />
                ))}
              <div style={{ minHeight: 20 }} />
            </>
          )}

          {!loading && filteredJobs.length > 0 && totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={page}
              onPageChange={setPage}
            />
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
    </div>
  );
}