// This is only a placeholder. Replace this with the actual job list database.

import React from "react";

interface Job {
  title: string;
  company: string;
  location: string;
  description: string;
  detail: string;
  jobtype: string;
  salaryrange: string;
}

export default function JobDetails({ job }: { job: Job | null }) {
    if (!job) {
      return <p className="text-gray-500">Select a job to see details</p>;
    }
  
    return (
      <div className="w-2/3 p-6 bg-white shadow-md rounded-lg">
        <h3 className="font-bold text-lg">{job.title}</h3>
        <p className="text-gray-600">{job.company} • {job.location}</p>
        <p className="mt-4">{job.description}</p>
  
        {/* Job Details Section */}
        <div className="mt-4">
          <h4 className="font-semibold">Job details</h4>
          <p className="text-sm text-gray-600">Work Type</p>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
            {job.jobtype} {/* Display job type */}
          </span>
        </div>
  
        {/* Salary Range */}
        <div className="mt-4">
          <h4 className="font-semibold">Salary Range</h4>
          <p className="text-sm text-gray-600">{job.salaryrange}</p>
        </div>
  
        {/* Location */}
        <div className="mt-4">
          <h4 className="font-semibold">Location</h4>
          <p className="text-sm text-gray-600">{job.location}</p>
        </div>
  
        {/* Apply Button */}
        <div className="mt-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Apply Now
          </button>
        </div>
      </div>
    );
  }
  