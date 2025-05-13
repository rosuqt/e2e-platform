import { motion } from "framer-motion";
import { DollarSign, Clock, Briefcase } from "lucide-react";
import { RiListView } from "react-icons/ri";

export default function EmployerJobCard({
  id,
  isSelected,
  onSelect,
  onEdit,
}: {
  id: number;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
}) {
  const jobData = {
    0: {
      title: "UI/UX Designer",
      company: "Fb Mark-it Place",
      logo: "M",
      logoColor: "bg-red-500",
      location: "San Jose Del Monte, Pampanga",
      salary: "₱800 / day",
      type: "OJT",
      posted: "3 days ago",
      closing: "2 days left",
      status: "Active",
      statusColor: "bg-green-100 text-green-600",
      applicants: 10,
      views: 400,
      qualified: 7,
      interviews: 3,
    },
  }[id] || {
    title: "UI/UX Designer",
    company: "Fb Mark-it Place",
    logo: "M",
    logoColor: "bg-red-500",
    location: "San Jose Del Monte, Pampanga",
    salary: "₱800 / day",
    type: "OJT",
    posted: "3 days ago",
    closing: "2 days left",
    status: "Active",
    statusColor: "bg-green-100 text-green-600",
    applicants: 10,
    views: 400,
    qualified: 7,
    interviews: 3,
  };

  return (
    <motion.div
      className={`bg-white rounded-lg shadow-sm p-5 border-l-4 ${
        isSelected ? "border-l-blue-500 border-blue-200" : "border-l-transparent border-gray-200"
      } relative overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: id * 0.1 }}
      whileHover={{
        y: -2,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        borderColor: "rgba(96, 165, 250, 0.8)",
      }}
    >
      {/* Job card content */}
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div
            className={`w-12 h-12 ${jobData.logoColor} rounded-lg flex items-center justify-center text-white font-bold`}
          >
            {jobData.logo}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-lg text-gray-800">{jobData.title}</h3>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${jobData.statusColor}`}>
                {jobData.status}
              </span>
              <span className="text-orange-500 text-xs font-medium px-2 py-0.5 bg-orange-50 rounded-full">
                {jobData.closing}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Briefcase className="h-3 w-3" />
                <span>{jobData.type}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <DollarSign className="h-3 w-3" />
                <span>{jobData.salary}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>Posted {jobData.posted}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            className="text-gray-400 hover:text-blue-500 transition-colors p-1.5 rounded-full hover:bg-blue-50"
            onClick={(e) => e.stopPropagation()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3v18M3 12h18" />
            </svg>
          </button>
          <button
            className="text-gray-400 hover:text-blue-500 transition-colors p-1.5 rounded-full hover:bg-blue-50"
            onClick={(e) => e.stopPropagation()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </button>
        </div>
      </div>
      {/* Application Stats */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        <div className="bg-blue-50 rounded-lg p-2 text-center">
          <p className="text-xs text-blue-500">Total Applicants</p>
          <p className="text-xl font-bold text-blue-700">{jobData.applicants}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-2 text-center">
          <p className="text-xs text-green-500">Qualified</p>
          <p className="text-xl font-bold text-green-700">{jobData.qualified}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-2 text-center">
          <p className="text-xs text-purple-500">Interviews</p>
          <p className="text-xl font-bold text-purple-700">{jobData.interviews}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-500">Views</p>
          <p className="text-xl font-bold text-gray-700">{jobData.views}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm flex items-center gap-1.5 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(); // Trigger the modal opening
            }}
          >
            <RiListView />
            View Details
          </button>

          <button
            className="border border-blue-500 text-blue-500 hover:bg-blue-50 px-4 py-1.5 rounded-md text-sm flex items-center gap-1.5 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="text-gray-500 hover:text-red-500 text-xs flex items-center gap-1 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Delete
          </button>
          <span className="text-gray-300">|</span>
          <button
            className="text-gray-500 hover:text-yellow-500 text-xs flex items-center gap-1 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Duplicate
          </button>
        </div>
      </div>
    </motion.div>
  );
}
