import React from "react";
import { motion } from "framer-motion";
import {  Clock, Briefcase } from "lucide-react";
import { RiListView } from "react-icons/ri";
import { FaComputer, FaHotel } from "react-icons/fa6";
import { MdBusinessCenter, MdOutlinePlayCircle } from "react-icons/md";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { IoMdPlanet } from "react-icons/io";
import { FaRegCirclePause , FaMoneyBill, FaTrash } from "react-icons/fa6";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { MdWarningAmber } from "react-icons/md";
import { TbBusinessplan } from "react-icons/tb";

export type EmployerJobCardJob = {
  id: string;
  title: string;
  status: string;
  closing: string;
  type: string;
  salary: string;
  posted: string;
  recommended_course?: string;
  paused?: boolean;
  paused_status?: "paused" | "active" | "paused_orange";
  views?: number;
  total_applicants?: number;
  qualified_applicants?: number;
  interviews?: number;
  companyName?: string;
};

export default function EmployerJobCard({
  job,
  isSelected,
  onSelect,
  onEdit,
  onStatusChange,
}: {
  job: EmployerJobCardJob | undefined;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onStatusChange?: () => void;
}) {
  const [openPause, setOpenPause] = React.useState(false);
  const [openResume, setOpenResume] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const paused = job?.paused ?? false;
  const pausedStatus = job?.paused_status ?? (paused ? "paused" : "active");

  if (!job) return null;

  let daysLeft = 0;
  let deadlineLabel = "";
  let closingColor = "";
  if (job.closing && job.closing !== "Closed") {
    const match = job.closing.match(/\d+/);
    if (match) {
      daysLeft = parseInt(match[0]);
      const now = new Date();
      const deadlineDate = new Date();
      deadlineDate.setDate(now.getDate() + daysLeft);
      const diffMs = deadlineDate.getTime() - now.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      const diffWeeks = Math.floor(diffDays / 7);
      const diffMonths = Math.floor(diffDays / 30);
      if (diffMonths >= 1) {
        deadlineLabel = `${diffMonths} month${diffMonths > 1 ? "s" : ""} left`;
      } else if (diffWeeks >= 1) {
        deadlineLabel = `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} left`;
      } else if (diffDays >= 1) {
        deadlineLabel = `${diffDays} day${diffDays > 1 ? "s" : ""} left`;
      } else if (diffHours >= 1) {
        deadlineLabel = `${diffHours} hour${diffHours > 1 ? "s" : ""} left`;
      } else if (diffMins >= 1) {
        deadlineLabel = `${diffMins} min${diffMins > 1 ? "s" : ""} left`;
      } else {
        deadlineLabel = "Deadline soon";
      }
      closingColor =
        diffDays <= 9
          ? "bg-red-100 text-red-600"
          : diffDays <= 15
          ? "bg-orange-50 text-orange-500"
          : "bg-blue-50 text-blue-500";
    }
  } else if (job.closing === "Closed") {
    closingColor = "bg-red-100 text-red-600";
    deadlineLabel = "Closed";
  }

  let courseIcon = null;
  let courseBg = "";
  if (job.recommended_course && job.recommended_course.includes(",")) {
    courseIcon = <IoMdPlanet className="w-7 h-7" />;
    courseBg = "bg-orange-500";
  } else if (
    job.recommended_course === "BSIT - Bachelor of Science in Information Technology" ||
    job.recommended_course === "BS - Information Technology"
  ) {
    courseIcon = <FaComputer className="w-7 h-7" />;
    courseBg = "bg-green-500";
  } else if (
    job.recommended_course === "BSHM - Bachelor of Science in Hospitaly Management" ||
    job.recommended_course === "BS - Hospitality Management"
  ) {
    courseIcon = <FaHotel className="w-7 h-7" />;
    courseBg = "bg-pink-500";
  } else if (
    job.recommended_course === "BSBA - Bachelor of Science in Business Administration" ||
    job.recommended_course === "BS - Business Administration"
  ) {
    courseIcon = <TbBusinessplan className="w-7 h-7" />;
    courseBg = "bg-purple-500";
  } else if (
    job.recommended_course === "BSTM - Bachelor of Science in Tourism Management" ||
    job.recommended_course === "BS - Tourism Management"
  ) {
    courseIcon = <BiSolidPlaneAlt className="w-7 h-7" />;
    courseBg = "bg-yellow-400";
  } else {
    courseIcon = <MdBusinessCenter className="w-7 h-7" />;
    courseBg = "bg-blue-500";
  }

  function getPostedLabel(posted: string) {
    const now = new Date();
    let postedDate: Date | null = null;

    if (!isNaN(Date.parse(posted))) {
      postedDate = new Date(posted);
    } else {

      const match = posted.match(/(\d+)\s*(min|hour|day|week|month|year)s?\s*ago/i);
      if (match) {
        const value = parseInt(match[1]);
        const unit = match[2];
        postedDate = new Date(now);
        if (unit === "min") postedDate.setMinutes(now.getMinutes() - value);
        else if (unit === "hour") postedDate.setHours(now.getHours() - value);
        else if (unit === "day") postedDate.setDate(now.getDate() - value);
        else if (unit === "week") postedDate.setDate(now.getDate() - value * 7);
        else if (unit === "month") postedDate.setMonth(now.getMonth() - value);
        else if (unit === "year") postedDate.setFullYear(now.getFullYear() - value);
      }
    }

    if (!postedDate || isNaN(postedDate.getTime())) return posted;

    const diffMs = now.getTime() - postedDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMins < 5) return "Posted Just Now";
    if (diffMins < 60) return `Posted ${diffMins} min${diffMins === 1 ? "" : "s"} ago`;
    if (diffHours < 24) return `Posted ${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    if (diffDays === 1) return "Posted 1 day ago";
    if (diffDays < 7) return `Posted ${diffDays} days ago`;
    if (diffWeeks === 1) return "Posted 1 week ago";
    if (diffWeeks < 5) return `Posted ${diffWeeks} weeks ago`;
    if (diffMonths === 1) return "Posted 1 month ago";
    if (diffMonths < 12) return `Posted ${diffMonths} months ago`;
    return `Posted ${postedDate.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}`;
  }

  return (
    <motion.div
      className={`bg-white rounded-lg shadow-sm p-5 border-l-4 border-l-gray-200 relative overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0 }}
      whileHover={{
        y: -2,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        borderColor:
          job.closing === "Closed"
            ? "rgba(239, 68, 68, 0.8)"
            : paused
            ? "rgba(251, 146, 60, 0.8)"
            : isSelected
            ? "rgba(59, 130, 246, 1)"
            : "rgba(59, 130, 246, 1)",
      }}
    >
      {loading && (
        <div className="absolute inset-0 z-20 bg-white/70 flex flex-col gap-4 items-center justify-center">
          <div className="w-10 h-10 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin mb-2" />
          <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-1/2 h-3 bg-gray-100 rounded animate-pulse" />
        </div>
      )}
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className={`w-12 h-12 ${courseBg} rounded-lg flex items-center justify-center text-white font-bold`}>
            {courseIcon}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-lg text-gray-800">{job.title}</h3>
              {job.closing === "Closed" ? (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                  Closed
                </span>
              ) : (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  paused
                    ? pausedStatus === "paused_orange"
                      ? "bg-orange-400 text-white"
                      : "bg-orange-100 text-orange-600"
                    : "bg-green-100 text-green-600"
                }`}>
                  {paused
                    ? pausedStatus === "paused_orange"
                      ? "Paused (Orange)"
                      : "Paused"
                    : job.status}
                </span>
              )}
              {job.closing && job.closing !== "Closed" && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${closingColor}`}>
                  {deadlineLabel}
                </span>
              )}
            </div>
            {/* Show company name if available */}
            {job.companyName && (
              <div className="text-sm text-gray-600 font-semibold mb-2">
                {job.companyName}
              </div>
            )}
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Briefcase className="h-3 w-3" />
                <span>{job.type}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <FaMoneyBill className="h-3 w-3" />
                <span>{job.salary ? job.salary : "No pay"}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{getPostedLabel(job.posted)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          {job.status === "Draft" ? (
            <button
              className="text-red-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
              onClick={async (e) => {
                e.stopPropagation();
                setLoading(true);
                await fetch(`/api/job-listings/drafts/${job.id}`, {
                  method: "DELETE",
                });
                setLoading(false);
                if (typeof onStatusChange === "function") onStatusChange();
              }}
              disabled={loading}
              title="Delete Draft"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          ) : paused ? (
            <AlertDialog open={openResume} onOpenChange={setOpenResume}>
              <AlertDialogTrigger asChild>
                <button
                  className="text-green-500 hover:text-green-600 transition-colors p-1.5 rounded-full hover:bg-green-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenResume(true);
                  }}
                  disabled={loading}
                >
                  <MdOutlinePlayCircle className="w-5 h-5" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-green-600">Resume Job Listing</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to resume this job listing? Applicants will be able to apply again.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={async () => {
                      setOpenResume(false);
                      setLoading(true);
                      await fetch(`/api/job-listings/${job?.id}/status`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ paused: false }),
                      });
                      setLoading(false);
                      if (typeof onStatusChange === "function") onStatusChange();
                    }}
                  >
                    Resume
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <AlertDialog open={openPause} onOpenChange={setOpenPause}>
              <AlertDialogTrigger asChild>
                <button
                  className="text-orange-400 hover:text-orange-500 transition-colors p-1.5 rounded-full hover:bg-orange-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenPause(true);
                  }}
                  disabled={loading}
                >
                  <FaRegCirclePause className="w-4 h-4" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Pause Job Listing</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to pause this job listing? Applicants will not be able to apply while paused.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={async () => {
                      setOpenPause(false);
                      setLoading(true);
                      await fetch(`/api/job-listings/${job?.id}/status`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ paused: true }),
                      });
                      setLoading(false);
                      if (typeof onStatusChange === "function") onStatusChange();
                    }}
                  >
                    Pause
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {job.status !== "Draft" && (
            <button
              className="text-gray-400 hover:text-blue-500 transition-colors p-1.5 rounded-full hover:bg-blue-50"
              onClick={(e) => e.stopPropagation()}
              disabled={loading}
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
          )}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        <div className="bg-blue-50 rounded-lg p-2 text-center">
          <p className="text-xs text-blue-500">Total Applicants</p>
          <p className="text-xl font-bold text-blue-700">{job.total_applicants ?? 0}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-2 text-center">
          <p className="text-xs text-green-500">Qualified</p>
          <p className="text-xl font-bold text-green-700">{job.qualified_applicants ?? 0}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-2 text-center">
          <p className="text-xs text-purple-500">Interviews</p>
          <p className="text-xl font-bold text-purple-700">{job.interviews ?? 0}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-xs text-gray-500">Views</p>
          <p className="text-xl font-bold text-gray-700">{job.views ?? 0}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm flex items-center gap-1.5 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            <RiListView />
            View Details
          </button>
          {job.status !== "Draft" && (
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
          )}
        </div>
        <div className="flex items-center gap-2">
          {job.status !== "Draft" && (
            <>
              <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                <AlertDialogTrigger asChild>
                  <button
                    className="text-gray-500 hover:text-red-500 text-xs flex items-center gap-1 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDelete(true);
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-red-200 border-t-red-500 rounded-full animate-spin inline-block" />
                    ) : (
                      <>
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
                      </>
                    )}
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white">
                  <AlertDialogHeader>
                    <div className="flex items-center gap-2">
                      <MdWarningAmber className="w-6 h-6 text-orange-500" />
                      <AlertDialogTitle>Delete Job Listing</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription>
                      Are you sure you want to delete this job listing? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-500 hover:bg-red-600 text-white"
                      onClick={async () => {
                        setLoading(true);
                        await fetch(`/api/job-listings/${job?.id}/delete`, {
                          method: "PATCH",
                        });
                        setLoading(false);
                        setOpenDelete(false);
                        if (typeof onStatusChange === "function") onStatusChange();
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="w-4 h-4 border-2 border-white border-t-red-200 rounded-full animate-spin inline-block" />
                      ) : (
                        "Delete"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function sortJobsActiveFirst(jobs: EmployerJobCardJob[]) {
  return [...jobs].sort((a, b) => {
    if (a.closing === "Closed" && b.closing !== "Closed") return 1;
    if ((a.paused ?? false) && !(b.paused ?? false)) return 1;
    if ((b.paused ?? false) && !(a.paused ?? false)) return -1;
    return 0;
  });
}
