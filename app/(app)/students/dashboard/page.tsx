"use client"
import { useEffect, useState, useRef, useLayoutEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { Search, MapPin, ChevronDown, Briefcase, ArrowLeft, ArrowRight, Award, BookOpen, Bus, CheckCircle, Clock, UserCheck } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import JobCards from "./components/JobCards"
import Lottie from "lottie-react";
import dashboardSearchAnimation from "../../../../public/animations/dashboard-search.json";
import { createPortal } from "react-dom"
import { ApplicationModal } from "../jobs/job-listings/components/application-modal"

type JobDetails = {
  id: string
  job_title: string
  job_description?: string | null
  must_have_qualifications?: string[] | null
  nice_to_have_qualifications?: string[] | null
  perks_and_benefits?: string[] | null
  application_deadline?: string | null
  max_applicants?: number | null
  application_questions?: unknown
  created_at?: string | null
  paused?: boolean
  recommended_course?: string | null
  job_summary?: string | null
  verification_tier?: string | null
  responsibilities?: string | null
  location?: string | null
  remote_options?: string | null
  work_type?: string | null
  pay_type?: string | null
  pay_amount?: string | null
  employers?: {
    first_name: string
    last_name: string
    company_name?: string | null
  } | null
  registered_employers?: {
    company_name?: string | null
  } | null
}

const FILTER_OPTIONS = {
  workType: [
    { label: "All work types", value: "" },
    { label: "Full-time", value: "full-time" },
    { label: "Part-time", value: "part-time" },
    { label: "Internship", value: "internship" },
  ],
  remoteOption: [
    { label: "All remote options", value: "" },
    { label: "Remote", value: "remote" },
    { label: "On-site", value: "on-site" },
    { label: "Hybrid", value: "hybrid" },
  ],
  program: [
  { label: "BSIT", value: "BS-Information Technology" },
{ label: "BSBA", value: "BS-Business Administration" },
{ label: "BSHM", value: "BS-Hospitality Management" },
{ label: "BSTM", value: "BS-Tourism Management" },

  ],
  listedAnytime: [
    { label: "Listed anytime", value: "" },
    { label: "Last 24 hours", value: "24h" },
    { label: "Last 7 days", value: "7d" },
    { label: "Last 30 days", value: "30d" },
  ],
}

function useDropdownPosition(buttonRef: React.RefObject<HTMLButtonElement>, open: boolean) {
  const [pos, setPos] = useState<{top: number, left: number, width: number}>({top: 0, left: 0, width: 0});
  useLayoutEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [open, buttonRef]);
  return pos;
}

function FilterDropdown({
  open,
  options,
  selectedValue,
  onSelect,
  anchorRef,
  onClose,
}: {
  open: boolean,
  options: {label: string, value: string}[],
  selectedValue: string,
  onSelect: (value: string) => void,
  anchorRef: React.RefObject<HTMLButtonElement>,
  onClose: () => void,
}) {
  const pos = useDropdownPosition(anchorRef, open);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('.dropdown-portal-menu')
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open, anchorRef, onClose]);

  if (!open || !anchorRef.current) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.18 }}
      style={{
        position: "absolute",
        top: pos.top,
        left: pos.left,
        width: pos.width,
        zIndex: 1000,
      }}
      className="dropdown-portal-menu rounded-2xl shadow-xl border-2 border-blue-200 bg-white py-2"
    >
      {options.map(opt => (
        <button
          key={opt.value}
          className={`flex w-full text-left px-6 py-3 rounded-full text-blue-700 hover:bg-blue-50 transition-all duration-150 font-medium ${
            selectedValue === opt.value ? "bg-blue-100" : ""
          }`}
          type="button"
          tabIndex={0}
          onClick={e => {
            e.stopPropagation();
            onSelect(opt.value);
            onClose();
          }}
        >
          {opt.label}
        </button>
      ))}
    </motion.div>,
    document.body
  );
}

function ApplicationModalWrapper({ jobId, jobTitle, onClose }: { jobId: string, jobTitle: string, onClose: () => void }) {
  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = original
    }
  }, [])
  return <ApplicationModal jobId={jobId} jobTitle={jobTitle} onClose={onClose} />
}

export default function Home() {
  const { data: session, update } = useSession()
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [searchTitle, setSearchTitle] = useState("")
  const [searchLocation, setSearchLocation] = useState("")
  const [filters, setFilters] = useState({
    workType: "",
    remoteOption: "",
    program: "",
    listedAnytime: "",
  })
  const [dropdownOpen, setDropdownOpen] = useState<null | string>(null);
  const [showQuickApply, setShowQuickApply] = useState(false)

  const searchRef = useRef<HTMLDivElement | null>(null)
  const rightSectionRef = useRef<HTMLDivElement | null>(null)
  const leftSectionRef = useRef<HTMLDivElement | null>(null)
  const emptyStateRef = useRef<HTMLDivElement | null>(null)

  const filterBtnRefs = {
  workType: useRef<HTMLButtonElement>(null) as React.RefObject<HTMLButtonElement>,
  remoteOption: useRef<HTMLButtonElement>(null) as React.RefObject<HTMLButtonElement>,
  program: useRef<HTMLButtonElement>(null) as React.RefObject<HTMLButtonElement>,
  listedAnytime: useRef<HTMLButtonElement>(null) as React.RefObject<HTMLButtonElement>,
};

  const adjustSectionWidths = () => {
    if (leftSectionRef.current && rightSectionRef.current && searchRef.current) {
      const isSidebarMinimized = document.body.classList.contains("sidebar-minimized");
      console.log("Sidebar minimized:", isSidebarMinimized);

      const containerWidth = window.innerWidth - (isSidebarMinimized ? 80 : 280);
      const leftSectionWidth = containerWidth * (isSidebarMinimized ? 0.45 : 0.4);
      const rightSectionWidth = containerWidth * (isSidebarMinimized ? 0.55 : 0.6);

      leftSectionRef.current.style.width = `${leftSectionWidth}px`;
      rightSectionRef.current.style.width = `${rightSectionWidth}px`;

      rightSectionRef.current.style.marginRight = isSidebarMinimized ? "5px" : "20px";

      rightSectionRef.current.style.maxWidth = `calc(${containerWidth}px - ${isSidebarMinimized ? 20 : 40}px)`;
      rightSectionRef.current.style.overflowX = "hidden";

      searchRef.current.style.marginLeft = isSidebarMinimized ? "5px !important" : "10px !important";
      searchRef.current.style.marginRight = isSidebarMinimized ? "2px !important" : "50px !important";
      searchRef.current.style.maxWidth = `calc(100% - ${isSidebarMinimized ? 25 : 60}px)`;
    }
  };

  const handleScroll = () => {
    if (!searchRef.current || !rightSectionRef.current || !leftSectionRef.current) return;

    const searchRect = searchRef.current.getBoundingClientRect();
    const isSidebarMinimized = document.body.classList.contains("sidebar-minimized");
    const containerWidth = window.innerWidth - (isSidebarMinimized ? 80 : 280);
    const leftSectionWidth = containerWidth * (isSidebarMinimized ? 0.45 : 0.4);
    const rightSectionWidth = containerWidth * (isSidebarMinimized ? 0.55 : 0.6) - (isSidebarMinimized ? 20 : 40);

    leftSectionRef.current.style.width = `${leftSectionWidth}px`;
    rightSectionRef.current.style.width = `${rightSectionWidth}px`;

    const minimizedMargin = "5px";

    if (window.scrollY === 0) {
      rightSectionRef.current.style.marginRight = isSidebarMinimized ? minimizedMargin : "20px";
      rightSectionRef.current.style.width = `${rightSectionWidth}px`;
      searchRef.current.style.marginRight = isSidebarMinimized ? "60px" : "50px";
    } else if (searchRect.bottom <= 0) {
      rightSectionRef.current.style.transition = "none";
      rightSectionRef.current.style.position = "fixed";
      rightSectionRef.current.style.top = "5rem";
      rightSectionRef.current.style.right = isSidebarMinimized ? minimizedMargin : "10px";
      rightSectionRef.current.style.width = isSidebarMinimized
        ? `calc(${rightSectionWidth}px - ${minimizedMargin})`
        : `${rightSectionWidth}px`;
      rightSectionRef.current.style.marginRight = isSidebarMinimized ? minimizedMargin : "0";
      rightSectionRef.current.style.height = "calc(100vh - 1rem)";
      rightSectionRef.current.style.overflowY = "auto";
      rightSectionRef.current.style.zIndex = "10";
      rightSectionRef.current.style.maxWidth = `calc(100% - ${isSidebarMinimized ? 25 : 40}px)`;

      leftSectionRef.current.style.position = "sticky";
      leftSectionRef.current.style.top = "5rem";

      document.body.style.overflowX = "hidden";

      searchRef.current.style.marginRight = isSidebarMinimized ? "60px" : "50px";
    } else {
      rightSectionRef.current.style.transition = "none";
      rightSectionRef.current.style.position = "relative";
      rightSectionRef.current.style.top = "unset";
      rightSectionRef.current.style.right = isSidebarMinimized ? minimizedMargin : "18px";
      rightSectionRef.current.style.width = `${rightSectionWidth}px`;
      rightSectionRef.current.style.marginRight = isSidebarMinimized ? minimizedMargin : "20px";
      rightSectionRef.current.style.height = "calc(100vh - 2rem)";
      rightSectionRef.current.style.overflowY = "hidden";
      rightSectionRef.current.style.zIndex = "unset";
      rightSectionRef.current.style.maxWidth = `calc(${containerWidth}px - ${isSidebarMinimized ? 20 : 40}px)`;

      leftSectionRef.current.style.position = "relative";
      leftSectionRef.current.style.top = "unset";

      searchRef.current.style.marginRight = isSidebarMinimized ? "60px" : "50px";

      document.body.style.overflowX = "hidden";
    }
  };

  useLayoutEffect(() => {
    document.body.style.overflowX = "hidden";
    adjustSectionWidths();
    handleScroll();

    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const applyStyles = () => {
      adjustSectionWidths();
      handleScroll();
    };

    window.addEventListener("resize", applyStyles);
    window.addEventListener("scroll", handleScroll);

    applyStyles();

    return () => {
      window.removeEventListener("resize", applyStyles);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      adjustSectionWidths();
      handleScroll();
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleSidebarToggle = () => {
      adjustSectionWidths();
      handleScroll();
    };

    const handleForceRecalc = () => {
      adjustSectionWidths();
      handleScroll();
    };

    window.addEventListener("sidebarToggle", handleSidebarToggle);
    window.addEventListener("forceRecalc", handleForceRecalc);

    return () => {
      window.removeEventListener("sidebarToggle", handleSidebarToggle);
      window.removeEventListener("forceRecalc", handleForceRecalc);
    };
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      adjustSectionWidths();
      handleScroll();
    });

    const observed: Element | null = rightSectionRef.current;
    if (observed) {
      resizeObserver.observe(observed);
    }

    return () => {
      if (observed) {
        resizeObserver.unobserve(observed);
      }
    };
  }, []);

  useEffect(() => {
    const rightSection = rightSectionRef.current;
    return () => {
      if (rightSection) {
   
      }
    };
  }, []);

  const handleJobSelect = (id: string) => {
    setSelectedJob(id)
  }

  const handleCloseJobDetails = () => {
    setSelectedJob(null)
    setJobDetails(null)
  }

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "title") setSearchTitle(e.target.value)
    if (e.target.name === "location") setSearchLocation(e.target.value)
  }

  const handleFilter = (type: string, value: string) => {
    setFilters(prev => ({ ...prev, [type]: value }))
  }

  const handleClearFilters = () => {
    setFilters({
      workType: "",
      remoteOption: "",
      program: "",
      listedAnytime: "",
    });
  };

  const handleSearch = useCallback(() => {
  }, [])

  useEffect(() => {
    if (selectedJob !== null) {
      setLoadingDetails(true)
      fetch(`/api/students/job-listings/${encodeURIComponent(selectedJob)}`)
        .then(res => res.json())
        .then(data => {
          setJobDetails(data)
          setLoadingDetails(false)
        })
        .catch(() => setLoadingDetails(false))
    } else {
      setJobDetails(null)
    }
  }, [selectedJob])

  useEffect(() => {
    const sessionKey = "aiMatchAndRescoreRun";
    const studentId = session?.user?.studentId
    if (typeof window !== "undefined" && studentId && !sessionStorage.getItem(sessionKey)) {
      fetch("/api/ai-matches/match/jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ student_id: studentId }) })
        .then(() => fetch("/api/ai-matches/rescore", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ student_id: studentId }) }))
        .finally(() => {
          sessionStorage.setItem(sessionKey, "1");
        });
    }
  }, [session]);

  useEffect(() => {
    let refreshTimeout: NodeJS.Timeout | null = null
    if (session?.expires) {
      const exp = new Date(session.expires).getTime()
      const now = Date.now()
      const msUntilRefresh = exp - now - 60000
      if (msUntilRefresh > 0) {
        refreshTimeout = setTimeout(() => {
          update?.()
        }, msUntilRefresh)
      }
    }
    return () => {
      if (refreshTimeout) clearTimeout(refreshTimeout)
    }
  }, [session, update])

  return (
    <div className="flex overflow-x-hidden bg-gradient-to-br from-blue-50 to-sky-100">
      <div className="w-full pr-4">
        <div className="mt-[14px]">
          <div className="bg-gradient-to-br from-blue-50 to-sky-100 min-h-screen w-full relative overflow-hidden">
              {/* Dropdowns rendered above the parent container */}
              <AnimatePresence>
                {["workType", "remoteOption", "program", "listedAnytime"].map(type =>
                  <FilterDropdown
                    key={type}
                    open={dropdownOpen === type}
                    options={FILTER_OPTIONS[type as keyof typeof FILTER_OPTIONS]}
                    selectedValue={filters[type as keyof typeof filters]}
                    onSelect={val => handleFilter(type, val)}
                    anchorRef={filterBtnRefs[type as keyof typeof filterBtnRefs]}
                    onClose={() => setDropdownOpen(null)}
                  />
                )}
              </AnimatePresence>
            <main className="transition-all duration-300 ease-in-out flex-1 relative z-10">
              <div>
                <motion.div
                  ref={searchRef}
                  className="p-9 bg-white rounded-3xl shadow-xl m-4 border-2 border-blue-200 relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.h1
                    className="text-4xl font-bold text-blue-600 mb-6 flex items-center relative z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <motion.div
                      className="mr-4 bg-blue-500 text-white p-3 rounded-2xl shadow-lg"
                      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Briefcase size={28} />
                    </motion.div>
                    <span className="bg-gradient-to-r from-blue-500 to-sky-400 text-transparent bg-clip-text py-2">
                      Find your dream job!
                    </span>
                  </motion.h1>

                  <motion.div
                    className="flex flex-wrap gap-4 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <div className="relative flex-1 group min-w-[250px]">
                      <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 group-hover:text-blue-500 transition-colors duration-200"
                        size={20}
                      />
                      <input
                        type="text"
                        name="title"
                        value={searchTitle}
                        onChange={handleSearchInput}
                        placeholder="What job are you looking for?"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-blue-50 border-2 border-blue-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none text-blue-700"
                        onKeyDown={e => { if (e.key === "Enter") handleSearch() }}
                      />
                      <motion.div
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-blue-100 opacity-0 group-hover:opacity-100"
                        animate={{ scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                      />
                    </div>
                    <div className="relative flex-1 group min-w-[250px]">
                      <MapPin
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 group-hover:text-blue-500 transition-colors duration-200"
                        size={20}
                      />
                      <input
                        type="text"
                        name="location"
                        value={searchLocation}
                        onChange={handleSearchInput}
                        placeholder="Where? (City or Remote)"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-blue-50 border-2 border-blue-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none text-blue-700"
                        onKeyDown={e => { if (e.key === "Enter") handleSearch() }}
                      />
                      <motion.div
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-blue-100 opacity-0 group-hover:opacity-100"
                        animate={{ scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                      />
                    </div>
                    <motion.button
                      className="bg-gradient-to-r from-blue-500 to-sky-500 text-white px-8 py-4 rounded-2xl font-medium shadow-lg hover:shadow-blue-200/50 transition-all duration-200 flex items-center justify-center min-w-[150px]"
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSearch}
                    >
                      <Search className="mr-2" size={18} />
                      <span>Find Jobs</span>
                    </motion.button>
                  </motion.div>


                  <motion.div
                    className="flex flex-wrap gap-4 justify-center w-full"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    {[
                      { label: "All work types", icon: "briefcase", type: "workType", value: "" },
                      { label: "All remote options", icon: "home", type: "remoteOption", value: "" },
                      { label: "Program", icon: "graduation-cap", type: "program", value: "" },
                      { label: "Listed anytime", icon: "calendar", type: "listedAnytime", value: "" },
                    ].map((filter, idx) => {
                      const selectedValue = filters[filter.type as keyof typeof filters];
                      const options = FILTER_OPTIONS[filter.type as keyof typeof FILTER_OPTIONS];
                      const selectedOption = options.find(opt => opt.value === selectedValue);
                      return (
                        <motion.div
                          className="relative"
                          key={idx}
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <button
                            ref={filterBtnRefs[filter.type as keyof typeof filterBtnRefs]}
                            className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-blue-200 bg-white text-base text-blue-700 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 shadow-md"
                            onClick={e => {
                              e.preventDefault();
                              setDropdownOpen(dropdownOpen === filter.type ? null : filter.type);
                            }}
                          >
                            {selectedOption ? selectedOption.label : filter.label}
                            <ChevronDown size={16} className="text-blue-500" />
                          </button>
                        </motion.div>
                      );
                    })}
                    {(filters.workType || filters.remoteOption || filters.program || filters.listedAnytime) && (
                      <motion.button
                        className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-blue-200 bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition-all duration-200 shadow-md"
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleClearFilters}
                      >
                        Clear Filters
                      </motion.button>
                    )}
                  </motion.div>
                </motion.div>

                <div className="flex px-4 pb-4 gap-6">
                  {/* Left Content */}
                  <motion.div
                    ref={leftSectionRef}
                    className="left-section space-y-4 pb-20"
                    style={{
                      width: "40%",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <JobCards
                      onSelectJob={handleJobSelect}
                      selectedJob={selectedJob}
                      searchTitle={searchTitle}
                      searchLocation={searchLocation}
                      filters={filters}
                    />
                  </motion.div>

                  {/* Right Content */}
                  <div
                    ref={rightSectionRef}
                    className="right-section transition-all duration-200 ease-in-out pl-6 relative-right-section"
                    style={{
                      width: "60%",
                      maxWidth: "calc(100% - 40px)",
                    }}
                  >
                    <div className="h-[calc(100vh-2rem)] overflow-y-auto rounded-3xl pb-11">
                      <div className="bg-gradient-to-br from-blue-500 to-sky-600 p-6 h-full rounded-3xl shadow-2xl relative overflow-hidden">
                        <div className="mb-6 mt-3 relative z-10">
                          <div className="flex items-center">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={selectedJob !== null ? handleCloseJobDetails : undefined}
                              className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-4 text-white hover:bg-white/30 transition-all"
                            >
                              <AnimatePresence mode="wait">
                                {selectedJob !== null ? (
                                  <motion.div
                                    key="arrow-left"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <ArrowLeft className="h-6 w-6" />
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="arrow-right"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <ArrowRight className="h-6 w-6" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.button>
                            <h1 className="font-bold text-2xl text-white">
                              {selectedJob !== null ? "Job Details" : "Select a Job"}
                            </h1>
                          </div>
                          <p className="text-blue-100 text-sm ml-16">
                            {selectedJob !== null
                              ? "View complete information about this position"
                              : "Click on a job card to view details"}
                          </p>
                        </div>

                        <AnimatePresence mode="wait">
                          {selectedJob === null ? (
                            <motion.div
                              ref={emptyStateRef}
                              className="flex flex-col items-center justify-center h-[calc(100%-100px)]"
                              key="empty-state"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{
                                opacity: 0,
                                transition: { duration: 0.5 },
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              <motion.div
                                className="relative w-64 h-64 mb-8"
                                animate={{
                                  y: [0, -10, 0],
                                  rotate: [0, 2, 0, -2, 0],
                                }}
                                transition={{
                                  duration: 5,
                                  repeat: Number.POSITIVE_INFINITY,
                                  ease: "easeInOut",
                                }}
                              >
                                <div className="absolute inset-0 bg-blue-300 rounded-full opacity-30 animate-pulse"></div>
                                <Lottie
                                  animationData={dashboardSearchAnimation}
                                  loop
                                  className="w-full h-full relative z-10"
                                />
                              </motion.div>
                              <h3 className="text-white text-2xl font-bold mb-2">No Job Selected</h3>
                              <p className="text-blue-100 text-center max-w-md">
                                Browse through the available positions and click on a job card to view detailed information.
                              </p>
                            </motion.div>
                          ) : loadingDetails ? (
                            <motion.div
                              className="flex flex-col items-center justify-center h-[calc(100%-100px)]"
                              key="loading-state"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0, transition: { duration: 0.5 } }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white border-solid mb-4"></div>
                                <div className="text-white text-xl">Loading...</div>
                              </div>
                            </motion.div>
                          ) : jobDetails ? (
                            <motion.div
                              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 h-[calc(100%-100px)] overflow-y-auto"
                              key={`job-details-${selectedJob}`}
                              initial={{
                                opacity: 0,
                              }}
                              animate={{
                                opacity: 1,
                                transition: {
                                  duration: 0.5,
                                  type: "spring",
                                  stiffness: 50,
                                },
                              }}
                              exit={{
                                opacity: 0,
                                transition: { duration: 0.3 },
                              }}
                            >
                              <div className="flex items-center mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-sky-500 flex items-center justify-center mr-4 shadow-lg">
                                  <Briefcase className="text-white" size={28} />
                                </div>
                                <div>
                                  <h2 className="text-2xl font-bold text-white">
                                    {jobDetails.job_title}
                                  </h2>
                                  <p className="text-blue-100">
                                    {jobDetails.employers
                                      ? `${jobDetails.employers.first_name} ${jobDetails.employers.last_name}`
                                      : "Unknown Employer"}
                                    {jobDetails.registered_employers?.company_name
                                      ? ` | ${jobDetails.registered_employers.company_name}`
                                      : ""}
                                  </p>
                                  <p className="text-blue-200 text-xs mt-1">
                                    {jobDetails.location || "Location N/A"}
                                    {jobDetails.remote_options ? ` • ${jobDetails.remote_options}` : ""}
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-6">
                                <motion.div
                                  className="bg-white/10 rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300"
                                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                                >
                                  <h3 className="text-white font-bold mb-2 text-lg">Summary</h3>
                                  <p className="text-blue-100 text-sm">
                                    {jobDetails.job_summary || "No summary provided."}
                                  </p>
                                </motion.div>

                                <motion.div
                                  className="bg-white/10 rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300"
                                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                                >
                                  <h3 className="text-white font-bold mb-2 text-lg">Job Description</h3>
                                  <p className="text-blue-100 text-sm">
                                    {jobDetails.job_description || "No description provided."}
                                  </p>
                                </motion.div>

                                {jobDetails.responsibilities && (
                                  <motion.div
                                    className="bg-white/10 rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300"
                                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                                  >
                                    <h3 className="text-white font-bold mb-2 text-lg">Responsibilities</h3>
                                    <p className="text-blue-100 text-sm">{jobDetails.responsibilities}</p>
                                  </motion.div>
                                )}

                                <motion.div
                                  className="bg-white/10 rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300"
                                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                                >
                                  <h3 className="text-white font-bold mb-2 text-lg">Must Have Qualifications</h3>
                                  <ul className="text-blue-100 text-sm space-y-3">
                                    {Array.isArray(jobDetails.must_have_qualifications) && jobDetails.must_have_qualifications.length > 0 ? (
                                      jobDetails.must_have_qualifications.map((q: string, idx: number) => (
                                        <li className="flex items-start" key={idx}>
                                          <motion.span
                                            className="inline-block w-3 h-3 rounded-full bg-blue-300 mt-1.5 mr-2"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: idx * 0.5 }}
                                          ></motion.span>
                                          {q}
                                        </li>
                                      ))
                                    ) : (
                                      <li className="flex items-start">
                                        <motion.span
                                          className="inline-block w-3 h-3 rounded-full bg-blue-300 mt-1.5 mr-2"
                                          animate={{ scale: [1, 1.2, 1] }}
                                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                        ></motion.span>
                                        No requirements listed.
                                      </li>
                                    )}
                                  </ul>
                                </motion.div>

                                <motion.div
                                  className="bg-white/10 rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300"
                                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                                >
                                  <h3 className="text-white font-bold mb-2 text-lg">Nice to Have Qualifications</h3>
                                  <ul className="text-blue-100 text-sm space-y-3">
                                    {Array.isArray(jobDetails.nice_to_have_qualifications) && jobDetails.nice_to_have_qualifications.length > 0 ? (
                                      jobDetails.nice_to_have_qualifications.map((q: string, idx: number) => (
                                        <li className="flex items-start" key={idx}>
                                          <motion.span
                                            className="inline-block w-3 h-3 rounded-full bg-blue-200 mt-1.5 mr-2"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: idx * 0.5 }}
                                          ></motion.span>
                                          {q}
                                        </li>
                                      ))
                                    ) : (
                                      <li className="flex items-start">
                                        <motion.span
                                          className="inline-block w-3 h-3 rounded-full bg-blue-200 mt-1.5 mr-2"
                                          animate={{ scale: [1, 1.2, 1] }}
                                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                        ></motion.span>
                                        None listed.
                                      </li>
                                    )}
                                  </ul>
                                </motion.div>

                                <motion.div
                                  className="bg-white/10 rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300"
                                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                                >
                                  <h3 className="text-white font-bold mb-2 text-lg">Perks & Benefits</h3>
                                  <ul className="text-blue-100 text-sm space-y-3">
                                    {Array.isArray(jobDetails.perks_and_benefits) && jobDetails.perks_and_benefits.length > 0 ? (
                                      jobDetails.perks_and_benefits.map((perk: string, idx: number) => {
                                        const PERK_ICONS: Record<string, { icon: React.ReactNode; label: string }> = {
                                          training: {
                                            icon: <BookOpen className="h-5 w-5 text-white" />,
                                            label: "Free Training & Workshops - Skill development",
                                          },
                                          certification: {
                                            icon: <Award className="h-5 w-5 text-white" />,
                                            label: "Certification Upon Completion - Proof of experience",
                                          },
                                          potential: {
                                            icon: <Briefcase className="h-5 w-5 text-white" />,
                                            label: "Potential Job Offer - Possible full-time employment",
                                          },
                                          transportation: {
                                            icon: <Bus className="h-5 w-5 text-white" />,
                                            label: "Transportation Allowance - Support for expenses",
                                          },
                                          mentorship: {
                                            icon: <UserCheck className="h-5 w-5 text-white" />,
                                            label: "Mentorship & Guidance - Hands-on learning",
                                          },
                                          flexible: {
                                            icon: <Clock className="h-5 w-5 text-white" />,
                                            label: "Flexible Hours - Adjusted schedules for students",
                                          },
                                        };
                                        const perkObj = PERK_ICONS[perk];
                                        return (
                                          <li className="flex items-center gap-2" key={idx}>
                                            {perkObj ? perkObj.icon : <CheckCircle className="h-5 w-5 text-white" />}
                                            <span>{perkObj ? perkObj.label : perk}</span>
                                          </li>
                                        );
                                      })
                                    ) : (
                                      <li className="flex items-start">
                                        <motion.span
                                          className="inline-block w-3 h-3 rounded-full bg-blue-300 mt-1.5 mr-2"
                                          animate={{ scale: [1, 1.2, 1] }}
                                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                        ></motion.span>
                                        No benefits listed.
                                      </li>
                                    )}
                                  </ul>
                                </motion.div>
                                <div className="flex gap-3 mt-8">
                                  <motion.button
                                    className="w-full bg-gradient-to-r from-blue-400 to-sky-400 text-white font-bold py-4 rounded-xl hover:from-blue-500 hover:to-sky-500 transition-all duration-300 shadow-lg"
                                    whileHover={{
                                      scale: 1.03,
                                      boxShadow: "0 15px 25px -5px rgba(0, 0, 0, 0.2)",
                                    }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setShowQuickApply(true)}
                                  >
                                    Apply Now
                                  </motion.button>
                                  <motion.button
                                    className="w-full bg-white text-blue-600 font-bold py-4 rounded-xl border-2 border-blue-400 hover:bg-blue-50 transition-all duration-300 shadow-lg"
                                    whileHover={{
                                      scale: 1.03,
                                      boxShadow: "0 15px 25px -5px rgba(59,130,246,0.08)",
                                    }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={async () => {
                                      try {
                                        await fetch("/api/employers/job-metrics", {
                                          method: "POST",
                                          headers: { "Content-Type": "application/json" },
                                          body: JSON.stringify({ jobId: jobDetails.id, action: "click" }),
                                        })
                                      } catch (error) {
                                        console.error("Failed to track job click:", error)
                                      }
                                      window.location.href = `/students/jobs/job-listings?jobId=${jobDetails.id}`;
                                    }}
                                  >
                                    View Job Listing
                                  </motion.button>
                                </div>
                                {showQuickApply &&
                                  createPortal(
                                    <ApplicationModalWrapper
                                      jobId={jobDetails.id}
                                      jobTitle={jobDetails.job_title}
                                      onClose={() => setShowQuickApply(false)}
                                    />,
                                    document.body
                                  )
                                }
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              className="flex flex-col items-center justify-center h-[calc(100%-100px)]"
                              key="notfound-state"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0, transition: { duration: 0.5 } }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="text-white text-xl">Job not found.</div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
