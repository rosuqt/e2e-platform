"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Briefcase, Clock, MapPin, Calendar, Filter, EyeIcon, Plus } from "lucide-react"
import JobDetails from "../../../../students/jobs/job-listings/components/job-details"

export default function JobListingsTab() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null)
  const [showJobDetails, setShowJobDetails] = useState(false)

  const handleViewDetails = (jobId: number) => {
    setSelectedJob(jobId)
    setShowJobDetails(true)
  }

  const handleCloseDetails = () => {
    setShowJobDetails(false)
  }

  const jobListings = [
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
      status: "active",
    },
    {
      id: 5,
      title: "DevOps Engineer",
      type: "Full-time",
      location: "San Francisco, CA",
      salary: "$110,000 - $140,000",
      deadline: "July 25, 2023",
      postedDate: "May 8, 2023",
      applicants: 15,
      status: "active",
    },
    {
      id: 6,
      title: "QA Specialist",
      type: "Full-time",
      location: "Chicago, IL",
      salary: "$75,000 - $95,000",
      deadline: "June 30, 2023",
      postedDate: "May 3, 2023",
      applicants: 22,
      status: "active",
    },
  ]

  return (
    <div className="space-y-6">
      {!showJobDetails ? (
        <>
          <div className="bg-white rounded-xl shadow-md p-6 border border-blue-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Recent Job Postings</h2>
              <Button className="gap-2 rounded-full">
                <Plus className="w-4 h-4" />
                View All Jobs
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobListings.map((job) => (
                <div
                  key={job.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-blue-600" />
                      </div>
                      <Badge className="bg-green-100 text-green-800">{job.type}</Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
                    <div className="text-sm text-gray-500 mb-4">{job.salary}</div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        Deadline: {job.deadline}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Posted: {job.postedDate}
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
          </div>
        </>
      ) : (
        <JobDetails onClose={handleCloseDetails} />
      )}
    </div>
  )
}
