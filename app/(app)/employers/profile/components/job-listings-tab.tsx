"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Briefcase, Clock, MapPin, Calendar, Filter, EyeIcon, Edit, Trash2, Plus } from "lucide-react"
import JobDetails from "./job-details"
import QuickEditModal from "../../jobs/job-listings/components/quick-edit-modal"
import { useRouter } from "next/navigation"

type JobListing = {
  id: number
  title: string
  type: string
  location: string
  salary: string
  deadline: string
  postedDate: string
  applicants: number
  status: string
}

export default function JobListingsTab() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null)
  const [showJobDetails, setShowJobDetails] = useState(false)
  const [quickEditOpen, setQuickEditOpen] = useState(false)
  const [quickEditJob, setQuickEditJob] = useState<JobListing | null>(null)
  const router = useRouter()

  const handleViewDetails = (jobId: number) => {
    setSelectedJob(jobId)
    setShowJobDetails(true)
  }

  const handleCloseDetails = () => {
    setShowJobDetails(false)
  }

  const handleEdit = (job: JobListing) => {
    setQuickEditJob(job)
    setQuickEditOpen(true)
  }

  const jobListings: JobListing[] = [
    {
      id: 1,
      title: "UI/UX Designer",
      type: "Full-time",
      location: "San Francisco, CA",
      salary: "$90,000 - $120,000",
      deadline: "July 30, 2023",
      postedDate: "May 15, 2023",
      applicants: 45,
      status: "active",
    },
    {
      id: 2,
      title: "Frontend Developer",
      type: "Full-time",
      location: "Remote",
      salary: "$80,000 - $110,000",
      deadline: "June 28, 2023",
      postedDate: "May 10, 2023",
      applicants: 32,
      status: "active",
    },
    {
      id: 3,
      title: "Product Manager",
      type: "Full-time",
      location: "New York, NY",
      salary: "$100,000 - $130,000",
      deadline: "July 15, 2023",
      postedDate: "May 5, 2023",
      applicants: 28,
      status: "active",
    },
    {
      id: 4,
      title: "Backend Developer",
      type: "Contract",
      location: "Remote",
      salary: "$70 - $90 per hour",
      deadline: "June 20, 2023",
      postedDate: "May 1, 2023",
      applicants: 19,
      status: "closed",
    },
  ]

  return (
    <div className="space-y-6">
      {!showJobDetails ? (
        <>
          <div className="bg-white rounded-xl shadow-md p-6 border border-blue-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Job Listings</h2>
              <Button className="gap-2 rounded-full">
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
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posted Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicants
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
                  {jobListings.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{job.title}</div>
                            <div className="text-sm text-gray-500">{job.type}</div>
                          </div>
                        </div>
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
                          {job.postedDate}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.applicants} applicants</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          className={
                            job.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }
                        >
                          {job.status === "active" ? "Active" : "Closed"}
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
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEdit(job)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-blue-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Quick Job Cards</h2>
              <Button variant="link" className="text-blue-600">
                View All
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {jobListings.slice(0, 4).map((job) => (
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
                          job.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }
                      >
                        {job.status === "active" ? "Active" : "Closed"}
                      </Badge>
                    </div>
                    <h3 className="font-medium mb-1">{job.title}</h3>
                    <div className="text-sm text-gray-500 mb-3">{job.type}</div>
                    <div className="space-y-1 mb-4">
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        Deadline: {job.deadline}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="w-full gap-1" onClick={() => handleViewDetails(job.id)}>
                        <EyeIcon className="h-3 w-3" />
                        Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full gap-1"
                        onClick={() => handleEdit(job)}
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <QuickEditModal
            open={quickEditOpen}
            job={quickEditJob}
            onClose={() => setQuickEditOpen(false)}
            onSave={() => setQuickEditOpen(false)}
          />
        </>
      ) : (
        <JobDetails onClose={handleCloseDetails} />
      )}
    </div>
  )
}
