/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Briefcase, Clock, MapPin, Calendar, EyeIcon, Plus } from "lucide-react"
import JobDetails from "./job-details"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"

type JobListing = {
  id: string
  job_title: string
  work_type: string
  location: string
  application_deadline: string
  created_at: string
  max_applicants: number | null
  paused: boolean | null
  is_archived: boolean | null
  verification_tier: string | null
}

export default function JobListingsTab() {
  const [showJobDetails, setShowJobDetails] = useState(false)
  const [jobListings, setJobListings] = useState<JobListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const router = useRouter()

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/employers/employer-profile/jobs-tab")
        const data = await res.json()
        if (res.ok) {
          setJobListings(data.jobs)
        } else {
          setError(data.error || "Failed to fetch jobs")
        }
      } catch (err) {
        setError("Failed to fetch jobs")
      }
      setLoading(false)
    }
    fetchJobs()
  }, [])

  const handleViewDetails = (jobId: string) => {
    router.push(`/employers/jobs/job-listings?job=${jobId}`)
  }

  const handleCloseDetails = () => {
    setShowJobDetails(false)
  }

  const filteredJobs = jobListings.filter(
    job =>
      job.job_title.toLowerCase().includes(search.toLowerCase()) ||
      job.work_type.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {!showJobDetails ? (
        <>
          <div className="bg-white rounded-xl shadow-md p-6 border border-blue-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Job Listings</h2>
              <Button className="gap-2 rounded-full" onClick={() => router.push("/employers/jobs/post-a-job")}>
                <Plus className="w-4 h-4" />
                Post a New Job
              </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search job postings..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-10">
                <span className="text-gray-500">Loading job postings...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center py-10">
                <AlertCircle className="w-10 h-10 text-red-400 mb-2" />
                <span className="text-red-500">{error}</span>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center py-10">
                <AlertCircle className="w-10 h-10 text-gray-400 mb-2" />
                <span className="text-gray-500">No job postings found.</span>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Job Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Work Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Deadline
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Briefcase className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{job.job_title}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{job.work_type}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              {job.application_deadline
                                ? new Date(job.application_deadline).toLocaleDateString()
                                : "No Deadline"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              className={
                                job.is_archived
                                  ? "bg-amber-900 text-white"
                                  : job.paused
                                    ? "bg-orange-400 text-white"
                                    : "bg-green-100 text-green-800"
                              }
                            >
                              {job.is_archived
                                ? "Archived"
                                : job.paused
                                  ? "Paused"
                                  : "Active"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleViewDetails(job.id)}
                              >
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                              {/* Delete button removed */}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end mt-6">
                  <Button
                    variant="outline"
                    className="border-blue-500 text-blue-600"
                    onClick={() => router.push("/employers/jobs/job-listings")}
                  >
                    View in Job Listings Page
                  </Button>
                </div>
              </>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-blue-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Quick Job Cards</h2>
              <Button variant="link" className="text-blue-600" onClick={() => router.push("/employers/jobs/job-listings")}>
                View All
              </Button>
            </div>
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <span className="text-gray-500">Loading job postings...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center py-10">
                <AlertCircle className="w-10 h-10 text-red-400 mb-2" />
                <span className="text-red-500">{error}</span>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center py-10">
                <AlertCircle className="w-10 h-10 text-gray-400 mb-2" />
                <span className="text-gray-500">No job postings found.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredJobs.slice(0, 4).map((job) => (
                  <div
                    key={job.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-blue-600" />
                        </div>
                        <Badge
                          className={
                            job.is_archived
                              ? "bg-amber-900 text-white"
                              : job.paused
                                ? "bg-orange-400 text-white"
                                : "bg-green-100 text-green-800"
                          }
                        >
                          {job.is_archived
                            ? "Archived"
                            : job.paused
                              ? "Paused"
                              : "Active"}
                        </Badge>
                      </div>
                      <h3 className="font-medium mb-1">{job.job_title}</h3>
                      <div className="text-sm text-gray-500 mb-3">{job.work_type}</div>
                      <div className="space-y-1 mb-4">
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          Deadline: {job.application_deadline
                            ? new Date(job.application_deadline).toLocaleDateString()
                            : "No Deadline"}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="w-full gap-1" onClick={() => handleViewDetails(job.id)}>
                          <EyeIcon className="h-3 w-3" />
                          View in Job Listings
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <JobDetails onClose={handleCloseDetails} />
      )}
    </div>
  )
}
