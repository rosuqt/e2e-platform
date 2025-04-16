import React from "react";
import { Bookmark, Clock, Briefcase, DollarSign, CheckCircle } from "lucide-react";

interface Job {
  title: string;
  company: string;
  reviews: string;
  closing: string;
  match: string;
  salary: string;
  posted: string;
}

const jobs: Job[] = [
  {
    title: "Software Engineer",
    company: "Alibaba Group",
    reviews: "4.2/5 (12 reviews)",
    closing: "Closing in 1 month",
    match: "98%",
    salary: "800 / a day",
    posted: "1hr ago",
  },
  {
    title: "Frontend Developer",
    company: "Meta",
    reviews: "4.5/5 (24 reviews)",
    closing: "Closing in 2 weeks",
    match: "95%",
    salary: "900 / a day",
    posted: "3hr ago",
  },
  {
    title: "Product Manager",
    company: "Google",
    reviews: "4.7/5 (18 reviews)",
    closing: "Closing in 1 week",
    match: "92%",
    salary: "950 / a day",
    posted: "5hr ago",
  },
  {
    title: "Data Analyst",
    company: "Apple",
    reviews: "4.3/5 (15 reviews)",
    closing: "Closing in 3 days",
    match: "89%",
    salary: "850 / a day",
    posted: "7hr ago",
  },
];

const JobCards: React.FC = () => {
  return (
    <div className="space-y-4">
      {jobs.map((job, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-[#e6e6ed] p-4 relative"
        >
          <button className="absolute top-4 right-4">
            <Bookmark className="text-gray-400" size={20} />
          </button>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-[#dfebfb] flex items-center justify-center">
              {/* Icon Placeholder */}
            </div>
            <div>
              <h3 className="font-bold text-lg">{job.title}</h3>
              <p className="text-sm text-gray-600">{job.company}</p>
              <div className="flex items-center mt-1">
                <span className="text-xs ml-1">{job.reviews}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm">
              <Clock size={16} className="text-[#1551a9] mr-2" />
              <span>{job.closing}</span>
            </div>
            <div className="flex items-center text-sm">
              <Briefcase size={16} className="text-gray-500 mr-2" />
              <span>On-the-Job Training</span>
            </div>
            <div className="flex items-center text-sm">
              <DollarSign size={16} className="text-gray-500 mr-2" />
              <span>{job.salary}</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="bg-[#00d23f] text-white rounded-full py-2 px-4 flex items-center justify-center">
              <CheckCircle size={16} className="mr-2" />
              <span>You are {job.match} Matched to this job</span>
            </div>
          </div>

          <div className="mt-2 text-right text-xs text-gray-500">
            {job.posted}
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobCards;
