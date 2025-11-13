"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Briefcase, Clock, MapPin, Calendar, Filter, EyeIcon,  } from "lucide-react"
import JobDetails from "../../../../students/jobs/job-listings/components/job-details"

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

export default function JobListingsTab() {
  const [showJobDetails, setShowJobDetails] = useState(false)
  const [jobListings, setJobListings] = useState<JobListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
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

  const handleViewDetails = () => {
    setShowJobDetails(true)
  }

  const handleCloseDetails = () => {
    setShowJobDetails(false)
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
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
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
                            Deadline: {formatDate(job.application_deadline)}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            Posted: {formatDate(job.created_at)}
                          </div>
                        </div>
                        <Button className="w-full gap-2" onClick={handleViewDetails}>
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
        <JobDetails onClose={handleCloseDetails} />
      )}
    </div>
  )
}
