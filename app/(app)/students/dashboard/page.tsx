"use client"
import { useEffect, useState, useRef, useLayoutEffect } from "react"
import { Search, MapPin, ChevronDown, Briefcase, ArrowLeft, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import JobCards from "./components/JobCards"
import Image from "next/image";

export default function Home() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null)
  
  const searchRef = useRef<HTMLDivElement | null>(null)
  const rightSectionRef = useRef<HTMLDivElement | null>(null)
  const leftSectionRef = useRef<HTMLDivElement | null>(null)
  const emptyStateRef = useRef<HTMLDivElement | null>(null)

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

    if (window.scrollY === 0) {
      rightSectionRef.current.style.marginRight = isSidebarMinimized ? "15px" : "20px"; 
      rightSectionRef.current.style.width = isSidebarMinimized
        ? `calc(${rightSectionWidth}px - 15px)`
        : `${rightSectionWidth}px`;
      searchRef.current.style.marginRight = isSidebarMinimized ? "55px" : "50px";
    } else if (searchRect.bottom <= 0) {
      rightSectionRef.current.style.transition = "none";
      rightSectionRef.current.style.position = "fixed";
      rightSectionRef.current.style.top = "5rem";
      rightSectionRef.current.style.right = isSidebarMinimized ? "15px" : "10px";
      rightSectionRef.current.style.width = isSidebarMinimized
        ? `calc(${rightSectionWidth}px - 15px)`
        : `${rightSectionWidth}px`;
      rightSectionRef.current.style.marginRight = "0";
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
      rightSectionRef.current.style.right = isSidebarMinimized ? "5px" : "18px";
      rightSectionRef.current.style.width = `${rightSectionWidth}px`;
      rightSectionRef.current.style.marginRight = isSidebarMinimized ? "5px" : "20px";
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

    if (rightSectionRef.current) {
      resizeObserver.observe(rightSectionRef.current);
    }

    return () => {
      if (rightSectionRef.current) {
        resizeObserver.unobserve(rightSectionRef.current);
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

  const handleJobSelect = (id: number) => {
    setSelectedJob(id)
  }

  const handleCloseJobDetails = () => {
    setSelectedJob(null)
  }

  return (
    <div className="flex overflow-x-hidden bg-gradient-to-br from-blue-50 to-sky-100">
      <div className="w-full pr-4">
        <div className="mt-[14px]">
          <div className="bg-gradient-to-br from-blue-50 to-sky-100 min-h-screen w-full relative overflow-hidden">
            <main className="transition-all duration-300 ease-in-out flex-1 relative z-10">
              <div>
                {/* Search Section */}
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
                        placeholder="What job are you looking for?"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-blue-50 border-2 border-blue-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none text-blue-700"
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
                        placeholder="Where? (City or Remote)"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-blue-50 border-2 border-blue-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none text-blue-700"
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
                      { label: "All work types", icon: "briefcase" },
                      { label: "All remote options", icon: "home" },
                      { label: "Program", icon: "graduation-cap" },
                      { label: "Listed anytime", icon: "calendar" },
                    ].map((filter, idx) => (
                      <motion.div
                        className="relative"
                        key={idx}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <button className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-blue-200 bg-white text-base text-blue-700 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 shadow-md">
                          {filter.label}
                          <ChevronDown size={16} className="text-blue-500" />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>

                <div className="flex px-4 pb-4 gap-6">
                  {/* Left Content */}
                  <motion.div
                    ref={leftSectionRef}
                    className="left-section space-y-4 pb-64"
                    style={{
                      width: "40%",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <JobCards onSelectJob={handleJobSelect} selectedJob={selectedJob} />
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
                    <div className="h-[calc(100vh-2rem)] overflow-y-auto rounded-3xl">
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
                                <Image
                                  src="/path/to/image"
                                  alt="Job Selection Illustration"
                                  width={256}
                                  height={256}
                                  className="w-full h-full rounded-full object-cover relative z-10 border-4 border-white/30"
                                />
                              </motion.div>
                              <h3 className="text-white text-2xl font-bold mb-2">No Job Selected</h3>
                              <p className="text-blue-100 text-center max-w-md">
                                Browse through the available positions and click on a job card to view detailed information.
                              </p>
                            </motion.div>
                          ) : (
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
                                    {selectedJob === 0
                                      ? "Software Engineer"
                                      : selectedJob === 1
                                        ? "Frontend Developer"
                                        : selectedJob === 2
                                          ? "Product Manager"
                                          : "Data Analyst"}
                                  </h2>
                                  <p className="text-blue-100">
                                    {selectedJob === 0
                                      ? "Alibaba Group"
                                      : selectedJob === 1
                                        ? "Meta"
                                        : selectedJob === 2
                                          ? "Google"
                                          : "Apple"}
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-6">
                                <motion.div
                                  className="bg-white/10 rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300"
                                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                                >
                                  <h3 className="text-white font-bold mb-2 text-lg">Job Description</h3>
                                  <p className="text-blue-100 text-sm">
                                    We are looking for a talented professional to join our growing team. This role offers
                                    competitive compensation and opportunities for career advancement in a dynamic, fast-paced
                                    environment.
                                  </p>
                                </motion.div>

                                <motion.div
                                  className="bg-white/10 rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300"
                                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                                >
                                  <h3 className="text-white font-bold mb-2 text-lg">Requirements</h3>
                                  <ul className="text-blue-100 text-sm space-y-3">
                                    <li className="flex items-start">
                                      <motion.span
                                        className="inline-block w-3 h-3 rounded-full bg-blue-300 mt-1.5 mr-2"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                      ></motion.span>
                                      Bachelor&apos;s degree in relevant field
                                    </li>
                                    <li className="flex items-start">
                                      <motion.span
                                        className="inline-block w-3 h-3 rounded-full bg-blue-300 mt-1.5 mr-2"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                                      ></motion.span>
                                      2+ years of experience in similar role
                                    </li>
                                    <li className="flex items-start">
                                      <motion.span
                                        className="inline-block w-3 h-3 rounded-full bg-blue-300 mt-1.5 mr-2"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                                      ></motion.span>
                                      Strong communication skills
                                    </li>
                                    <li className="flex items-start">
                                      <motion.span
                                        className="inline-block w-3 h-3 rounded-full bg-blue-300 mt-1.5 mr-2"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1.5 }}
                                      ></motion.span>
                                      Problem-solving abilities
                                    </li>
                                  </ul>
                                </motion.div>

                                <motion.div
                                  className="bg-white/10 rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300"
                                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                                >
                                  <h3 className="text-white font-bold mb-2 text-lg">Benefits</h3>
                                  <ul className="text-blue-100 text-sm space-y-3">
                                    <li className="flex items-start">
                                      <motion.span
                                        className="inline-block w-3 h-3 rounded-full bg-blue-300 mt-1.5 mr-2"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                      ></motion.span>
                                      Competitive salary
                                    </li>
                                    <li className="flex items-start">
                                      <motion.span
                                        className="inline-block w-3 h-3 rounded-full bg-blue-300 mt-1.5 mr-2"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                                      ></motion.span>
                                      Health insurance
                                    </li>
                                    <li className="flex items-start">
                                      <motion.span
                                        className="inline-block w-3 h-3 rounded-full bg-blue-300 mt-1.5 mr-2"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                                      ></motion.span>
                                      Flexible working hours
                                    </li>
                                    <li className="flex items-start">
                                      <motion.span
                                        className="inline-block w-3 h-3 rounded-full bg-blue-300 mt-1.5 mr-2"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1.5 }}
                                      ></motion.span>
                                      Professional development opportunities
                                    </li>
                                  </ul>
                                </motion.div>

                                <motion.button
                                  className="w-full bg-gradient-to-r from-blue-400 to-sky-400 text-white font-bold py-4 rounded-xl hover:from-blue-500 hover:to-sky-500 transition-all duration-300 shadow-lg"
                                  whileHover={{
                                    scale: 1.03,
                                    boxShadow: "0 15px 25px -5px rgba(0, 0, 0, 0.2)",
                                  }}
                                  whileTap={{ scale: 0.97 }}
                                >
                                  Apply Now
                                </motion.button>
                              </div>
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
