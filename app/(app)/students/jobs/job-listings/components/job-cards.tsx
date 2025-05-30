import { motion } from "framer-motion";
import { BookOpen, Clock, Users, Award, Bookmark } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CgSmile } from "react-icons/cg";
import { IoIosRocket } from "react-icons/io";
import { useEffect, useState } from "react";

type Employer = {
  first_name?: string;
  last_name?: string;
  company_name?: string;
};

type Job = {
  id: number | string;
  title?: string;
  job_title?: string;
  description?: string;
  location?: string;
  type?: string;
  vacancies?: number;
  deadline?: string;
  application_deadline?: string;
  skills?: string[];
  match_percentage?: number;
  employers?: Employer;
  registered_employers?: { company_name?: string };
};

function JobCard({
  id,
  isSelected,
  onSelect,
  onQuickApply,
}: {
  id: number | string;
  isSelected: boolean;
  onSelect: () => void;
  onQuickApply: () => void;
}) {
  function getDaysLeft(deadline?: string): string {
    if (!deadline) return "N/A";
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diff = deadlineDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (isNaN(days)) return "N/A";
    if (days < 0) return "Closed";
    if (days === 0) return "Closes today";
    if (days === 1) return "1 day left";
    return `${days} days left`;
  }

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (typeof id !== "string" || !uuidRegex.test(id)) {
      setError("Invalid job id");
      setJob(null);
      setLoading(false);
      return;
    }

    fetch(`/api/students/job-listings/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to fetch job details");
        }
        return res.json();
      })
      .then((data) => {
        if (!data || data.error) {
          setError(data?.error || "No job data");
          setJob(null);
        } else {
          setJob(data);
        }
        setLoading(false);
      })
      .catch((e) => {
        setError(typeof e === "string" ? e : e.message || "Unable to load job details");
        setLoading(false);
      });
  }, [id]);

  const transitionDelay = typeof id === "number" ? id * 0.1 : 0;

  if (loading) {
    return (
      <motion.div
        className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-l-transparent border-gray-200 relative overflow-hidden mt-2 animate-pulse"
      >
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-1/4 mb-4" />
        <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-1/3" />
      </motion.div>
    );
  }

  if (error || !job) {
    return (
      <motion.div
        className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-l-transparent border-gray-200 relative overflow-hidden mt-2"
      >
        <div className="text-red-500">{error || "No job data"}</div>
      </motion.div>
    );
  }

  const company =
    job.registered_employers?.company_name ||
    job.employers?.company_name ||
    [job.employers?.first_name, job.employers?.last_name].filter(Boolean).join(" ") ||
    "Unknown Company";

  const title = job.job_title || job.title || "Untitled Position";
  const description = job.description || "";
  const location = job.location || "Unknown Location";
  const type = job.type || "Full-time";
  const vacancies = job.vacancies || 1;
  const deadline = job.deadline || job.application_deadline || "";
  const skills = job.skills || [];
  const matchPercentage = job.match_percentage || 80;

  return (
    <motion.div
      className={`bg-white rounded-lg shadow-sm p-5 border-l-4 ${
        isSelected ? "border-l-blue-500 border-blue-200" : "border-l-transparent border-gray-200"
      } relative overflow-hidden mt-2`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: transitionDelay }}
      whileHover={{
        y: -2,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        borderColor: "rgba(96, 165, 250, 0.8)",
      }}
    >
      <div className="flex justify-between">
        <div className="flex gap-3">
          <motion.div
            className="w-12 h-12 bg-black rounded-full flex items-center justify-center overflow-hidden text-white"
            whileHover={{ scale: 1.1 }}
          >
            <Image
              src={`/placeholder.svg?height=48&width=48&text=${company.charAt(0)}`}
              alt="Company logo"
              width={48}
              height={48}
              className="object-cover"
            />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
            </div>
            <p className="text-sm text-gray-500">{company}</p>
          </div>
        </div>
        <motion.button
          className={`text-gray-400 hover:text-blue-500 transition-colors ${isSelected ? "text-blue-500" : ""}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Bookmark size={20} className={isSelected ? "fill-blue-500" : ""} />
        </motion.button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {(skills.length > 0 ? skills : ["React", "Node.js", "UI/UX", "Python", "Java"]).map((skill: string, i: number) => (
          <Badge key={i} className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">{skill}</Badge>
        ))}
      </div>

      {description && (
        <p className="text-gray-600 text-sm mt-3">
          {description}
        </p>
      )}

      {matchPercentage && (
        <div className="bg-green-100 text-green-700 text-sm font-semibold mt-4 px-4 py-2 rounded-lg flex items-center gap-2">
          <CgSmile className="w-5 h-5" />
          <span>You are {matchPercentage}% match to this job.</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm text-gray-600">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-gray-400" />
          <span>{getDaysLeft(deadline)}</span>
        </div>
        <div className="flex items-center">
          <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
          <span>{type}</span>
        </div>
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-2 text-gray-400" />
          <span>{vacancies} vacancies left</span>
        </div>
        <div className="flex items-center">
          <Award className="h-4 w-4 mr-2 text-gray-400" />
          <span>{location}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2 w-full sm:w-auto">
          {isSelected ? (
            <motion.button
              className="bg-blue-500 hover:bg-gray-300 text-white px-6 py-2 rounded-full font-medium shadow-sm flex-1 sm:flex-none flex items-center justify-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
            >
              Close
            </motion.button>
          ) : (
            <motion.button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium shadow-sm flex-1 sm:flex-none flex items-center justify-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
            >
              View Details
            </motion.button>
          )}
          <motion.button
            className="bg-white hover:bg-blue-50 text-blue-600 px-6 py-2 rounded-full font-medium shadow-sm border border-blue-600 flex-1 sm:flex-none flex items-center justify-center gap-2"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => {
              e.stopPropagation();
              onQuickApply();
            }}
          >
            <IoIosRocket className="w-4 h-4" />
            Quick Apply
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default JobCard;
