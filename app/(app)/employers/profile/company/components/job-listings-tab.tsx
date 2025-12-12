/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Briefcase, Clock, MapPin, Calendar, Filter, EyeIcon, X } from "lucide-react"

type JobListing = {
  id: string
  job_title: string
  work_type: string | null
  location: string | null
  pay_type: string | null
  pay_amount: string | null
  application_deadline: string | null
  created_at: string | null
  employer_name?: string | null
}

type JobDetailsType = {
  id: string
  job_title: string
  work_type: string | null
  location: string | null
  remote_options: string | null
  recommended_course: string | null
  job_description: string | null
  job_summary: string | null
  must_have_qualifications: string[] | null
  nice_to_have_qualifications: string[] | null
  application_deadline: string | null
  max_applicants: number | null
  perks_and_benefits: string[] | null
  verification_tier: string | null
  created_at: string | null
  responsibilities: string | null
  paused: boolean | null
  tags: any
  ai_skills: string[] | null
  is_archived: boolean | null
  employer_name?: string | null
}

export default function JobListingsTab() {
  const [showJobDetails, setShowJobDetails] = useState(false)
  const [jobListings, setJobListings] = useState<JobListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [ setSelectedJobId] = useState<string | null>(null)
  const [jobDetails, setJobDetails] = useState<JobDetailsType | null>(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const pageSize = 6

  useEffect(() => {
    setLoading(true)
    fetch("/api/employers/company-profile/job-listings")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch job listings")
        return res.json()
      })
      .then((data) => {
        setJobListings(data)
        setError(null)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleViewDetails = async (jobId: string) => {
    setDetailsLoading(true)
    setJobDetails(null)
    try {
      const res = await fetch(`/api/employers/company-profile/job-details/${jobId}`)
      if (!res.ok) throw new Error("Failed to fetch job details")
      const data = await res.json()
      setJobDetails(data)
    } catch (err: any) {
      setJobDetails(null)
    } finally {
      setDetailsLoading(false)
    }
    setShowJobDetails(true)
  }

  const handleCloseDetails = () => {
    setShowJobDetails(false)
  
    setJobDetails(null)
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return "-"
    const date = new Date(dateStr)
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
  }

  function formatAddress(location: string | null) {
    if (!location) return "N/A"
    const parts = location.split(",").map((s) => s.trim())
    if (parts.length >= 2) {
      return `${parts[0]}, ${parts[1]}`
    }
    return location
  }

  const filteredListings = search
    ? jobListings.filter((job) =>
        job.job_title.toLowerCase().includes(search.toLowerCase())
      )
    : jobListings

  const totalPages = Math.ceil(filteredListings.length / pageSize)
  const paginatedListings = filteredListings.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="space-y-6">
      {!showJobDetails ? (
        <>
          <div className="bg-white rounded-xl shadow-md p-6 border border-blue-200">

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg overflow-hidden animate-pulse bg-white">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="h-12 w-12 bg-gray-200 rounded-full" />
                        <div className="h-6 w-20 bg-gray-100 rounded" />
                      </div>
                      <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                      <div className="h-4 w-24 bg-gray-100 rounded mb-1" />
                      <div className="h-4 w-20 bg-gray-100 rounded mb-4" />
                      <div className="space-y-2 mb-4">
                        <div className="h-4 w-28 bg-gray-100 rounded" />
                        <div className="h-4 w-32 bg-gray-100 rounded" />
                        <div className="h-4 w-24 bg-gray-100 rounded" />
                      </div>
                      <div className="h-10 w-full bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : filteredListings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No job postings found.</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedListings.map((job) => (
                    <div
                      key={job.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Briefcase className="h-6 w-6 text-blue-600" />
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            {job.work_type || "N/A"}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg mb-1">{job.job_title}</h3>
                        <div className="text-sm text-gray-500 mb-1">
                          {job.employer_name ? (
                            <>Posted by <span className="font-medium text-blue-700">{job.employer_name}</span></>
                          ) : (
                            <>Posted by <span className="text-gray-400">Unknown</span></>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mb-4">
                          {job.pay_amount ? `${job.pay_amount}${job.pay_type ? ` (${job.pay_type})` : ""}` : "-"}
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {formatAddress(job.location)}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            Deadline: {job.application_deadline ? formatDate(job.application_deadline) : "No deadline set"}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            Posted: {formatDate(job.created_at)}
                          </div>
                        </div>
                        <Button className="w-full gap-2" onClick={() => handleViewDetails(job.id)}>
                          <EyeIcon className="h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8 gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className={`transition-all px-4 py-2 rounded-full font-semibold shadow-sm ${
                        page === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      }`}
                      style={{ minWidth: 80 }}
                    >
                      Prev
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setPage(idx + 1)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold transition-all ${
                            page === idx + 1
                              ? "bg-blue-100 text-blue-700 scale-110 shadow-lg"
                              : "bg-white text-blue-700 hover:bg-blue-50"
                          }`}
                          style={{ fontSize: 16 }}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className={`transition-all px-4 py-2 rounded-full font-semibold shadow-sm ${
                        page === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      }`}
                      style={{ minWidth: 80 }}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-6 border border-blue-200 max-w-2xl mx-auto relative">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-blue-600"
            onClick={handleCloseDetails}
            aria-label="Close details"
          >
            <X className="w-6 h-6" />
          </button>
          {detailsLoading ? (
            <div className="py-16 text-center text-blue-500">Loading...</div>
          ) : jobDetails ? (
            <div>
              <h2 className="text-2xl font-bold mb-2">{jobDetails.job_title}</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-green-100 text-green-800">{jobDetails.work_type || "N/A"}</Badge>
                {jobDetails.remote_options && (
                  <Badge className="bg-blue-100 text-blue-800">{jobDetails.remote_options}</Badge>
                )}
                {jobDetails.verification_tier && (
                  <Badge className="bg-purple-100 text-purple-800">{jobDetails.verification_tier}</Badge>
                )}
                {jobDetails.paused && (
                  <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>
                )}
                {jobDetails.is_archived && (
                  <Badge className="bg-gray-100 text-gray-800">Archived</Badge>
                )}
              </div>
              <div className="mb-2 flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {formatAddress(jobDetails.location)}
              </div>
              <div className="mb-2 flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                Deadline: {jobDetails.application_deadline ? formatDate(jobDetails.application_deadline) : "No deadline set"}
              </div>
              <div className="mb-2 flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                Posted: {formatDate(jobDetails.created_at)}
              </div>
              <div className="mb-4">
                <span className="font-semibold">Summary:</span>
                <div className="text-gray-700">{jobDetails.job_summary || <span className="text-gray-400">No summary provided.</span>}</div>
              </div>
              <div className="mb-4">
                <span className="font-semibold">Description:</span>
                <div className="text-gray-700 whitespace-pre-line">{jobDetails.job_description || <span className="text-gray-400">No description provided.</span>}</div>
              </div>
              <div className="mb-4">
                <span className="font-semibold">Must-have Qualifications:</span>
                <ul className="list-disc ml-6 text-gray-700">
                  {jobDetails.must_have_qualifications && jobDetails.must_have_qualifications.length > 0
                    ? jobDetails.must_have_qualifications.map((q, i) => <li key={i}>{q}</li>)
                    : <li className="text-gray-400">None specified.</li>}
                </ul>
              </div>
              <div className="mb-4">
                <span className="font-semibold">Nice-to-have Qualifications:</span>
                <ul className="list-disc ml-6 text-gray-700">
                  {jobDetails.nice_to_have_qualifications && jobDetails.nice_to_have_qualifications.length > 0
                    ? jobDetails.nice_to_have_qualifications.map((q, i) => <li key={i}>{q}</li>)
                    : <li className="text-gray-400">None specified.</li>}
                </ul>
              </div>
              <div className="mb-4">
                <span className="font-semibold">Perks & Benefits:</span>
                <ul className="list-disc ml-6 text-gray-700">
                  {jobDetails.perks_and_benefits && jobDetails.perks_and_benefits.length > 0
                    ? jobDetails.perks_and_benefits.map((p, i) => <li key={i}>{p}</li>)
                    : <li className="text-gray-400">None specified.</li>}
                </ul>
              </div>
              <div className="mb-4">
                <span className="font-semibold">Responsibilities:</span>
                <div className="text-gray-700">
                  {Array.isArray(jobDetails.responsibilities)
                    ? (
                        <ul className="list-disc ml-6">
                          {jobDetails.responsibilities.map((r: string, i: number) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      )
                    : typeof jobDetails.responsibilities === "string" && jobDetails.responsibilities.trim().startsWith("[")
                      ? (() => {
                          try {
                            const arr = JSON.parse(jobDetails.responsibilities);
                            if (Array.isArray(arr)) {
                              return (
                                <ul className="list-disc ml-6">
                                  {arr.map((r: string, i: number) => <li key={i}>{r}</li>)}
                                </ul>
                              );
                            }
                            return <span className="text-gray-400">Not specified.</span>;
                          } catch {
                            return jobDetails.responsibilities;
                          }
                        })()
                    : jobDetails.responsibilities
                      ? jobDetails.responsibilities
                      : <span className="text-gray-400">Not specified.</span>
                  }
                </div>
              </div>
              <div className="mb-4">
                <span className="font-semibold">Recommended Course:</span>
                <div className="text-gray-700">{jobDetails.recommended_course || <span className="text-gray-400">Not specified.</span>}</div>
              </div>
              <div className="mb-4">
                <span className="font-semibold">AI Skills:</span>
                <ul className="list-disc ml-6 text-gray-700">
                  {jobDetails.ai_skills && jobDetails.ai_skills.length > 0
                    ? jobDetails.ai_skills.map((s, i) => <li key={i}>{s}</li>)
                    : <li className="text-gray-400">None specified.</li>}
                </ul>
              </div>
              <div className="mb-4">
                <span className="font-semibold">Tags:</span>
                <div className="text-gray-700">
                  {jobDetails.tags && Array.isArray(jobDetails.tags)
                    ? jobDetails.tags.join(", ")
                    : jobDetails.tags
                      ? JSON.stringify(jobDetails.tags)
                      : <span className="text-gray-400">None specified.</span>
                  }
                </div>
              </div>
              <div className="mb-4">
                <span className="font-semibold">Max Applicants:</span>
                <div className="text-gray-700">{jobDetails.max_applicants ?? <span className="text-gray-400">Not specified.</span>}</div>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-red-500">Failed to load job details.</div>
          )}
        </div>
      )}
    </div>
  )
}
