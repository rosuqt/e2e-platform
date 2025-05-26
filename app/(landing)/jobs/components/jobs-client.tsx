"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import JobCard from "../components/job-card"
import JobDetails from "../components/job-details"

export default function JobsPage() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null)
  const [showSignInPrompt, setShowSignInPrompt] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (!scrollContainerRef.current) return

    const blurThreshold = 3 * 250

    if (scrollContainerRef.current.scrollTop > blurThreshold) {
      setShowSignInPrompt(true)
    } else {
      setShowSignInPrompt(false)
    }
  }

  useEffect(() => {
    const handleResize = () => {}

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [selectedJob])

  return (
    <div className="min-h-screen mt-16 bg-gradient-to-br from-blue-50 to-sky-100">


      <div className="container mx-auto py-8 px-4">
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl shadow-xl text-white mb-8 p-8 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Find your perfect job</h2>
            <p className="text-blue-100 text-sm mb-6">
              Explore job listings tailored to your skills and interests. Find the right opportunity and take the next
              step in your career!
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 overflow-x-auto scrollbar-hide">
          <div className="flex space-x-2">
            {["All Jobs", "Remote", "Full-time", "Part-time", "Internship"].map((filter) => (
              <Button
                key={filter}
                variant="outline"
                className="whitespace-nowrap rounded-full border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                {filter}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-600 whitespace-nowrap">Sort by</span>
            <Button
              variant="outline"
              className="rounded-full border-blue-200 text-blue-600 hover:bg-blue-50 flex items-center gap-1"
            >
              Relevance
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="flex gap-6">
          <div
            className={`${
              selectedJob !== null ? "w-1/2" : "w-full"
            } max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 transition-all duration-300`}
            ref={scrollContainerRef}
            onScroll={handleScroll}
          >
            <div className="space-y-4">
              {[0, 1, 2].map((id) => (
                <JobCard
                  key={id}
                  id={id}
                  isSelected={selectedJob === id}
                  onSelect={() => setSelectedJob(id)}
                  onQuickApply={() => {}}
                />
              ))}

              <div className="relative pointer-events-none">
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10" />
                <div className="pointer-events-none">
                  {[3, 4, 5, 6, 7].map((id) => (
                    <div key={id} className="mb-4">
                      <JobCard
                        id={id}
                        isSelected={selectedJob === id}
                        onSelect={() => {}}
                        onQuickApply={() => {}}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {selectedJob !== null && (
            <div className="w-1/2 sticky top-8 h-[calc(100vh-8rem)] shadow-lg rounded-lg overflow-hidden">
              <JobDetails onClose={() => setSelectedJob(null)} />
            </div>
          )}
        </div>
      </div>

      {showSignInPrompt && (
        <motion.div
          className="fixed bottom-8 left-8 bg-blue-500 text-white rounded-xl shadow-2xl max-w-sm w-full z-50"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>

            <h2 className="text-2xl font-bold mb-2">This is a preview</h2>
            <p className="text-lg mb-6">
              Do you want full access? Sign in and <span className="font-bold">unlock all job listings</span>
            </p>

            <div className="space-y-3 text-left mb-6">
              <div className="flex items-center">
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
                  className="mr-2 text-teal-300"
                >
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
                <span>Access to all job listings</span>
              </div>
              <div className="flex items-center">
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
                  className="mr-2 text-teal-300"
                >
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
                <span>Apply to unlimited jobs</span>
              </div>
              <div className="flex items-center">
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
                  className="mr-2 text-teal-300"
                >
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
                <span>Get personalized job recommendations</span>
              </div>
            </div>

            <div className="flex justify-center">
              <Button className="w-1/2 bg-white hover:bg-yellow-500 border-2 border-blue-500 text-blue-700 font-bold py-7 rounded-full">
                Join us now
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
