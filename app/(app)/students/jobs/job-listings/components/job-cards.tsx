/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import {  Clock, Users, Bookmark, Briefcase, Calendar, Globe } from "lucide-react";
import Image from "next/image";
import { IoIosRocket } from "react-icons/io";
import { useEffect, useState } from "react";
import { PiMoneyDuotone, PiBuildingsFill } from "react-icons/pi";
import { AiFillSmile, AiOutlineMeh } from "react-icons/ai";
import { TbMoodConfuzed } from "react-icons/tb";
import { SiStarship } from "react-icons/si";
import { useSession } from "next-auth/react";
import QuickApplyModal from "./quick-apply-modal";
import { ApplicationModal } from "./application-modal";
import ApplicationModalQuickVersion from "./application-modal-quick-version";
import { Tooltip, CircularProgress } from "@mui/material";

type Employer = {
  first_name?: string;
  last_name?: string;
  company_name?: string;
};

type Job = {
  work_type?: string; 
  id: number | string;
  title?: string;
  job_title?: string;
  description?: string;
  location?: string;
  type?: string;
  vacancies?: number;
  max_applicants?: number;
  deadline?: string;
  application_deadline?: string;
  skills?: string[];
  match_percentage?: number;
  gpt_score?: number;
  employers?: Employer;
  registered_employers?: { company_name?: string };
  registered_companies?: { company_logo_image_path?: string };
  company_logo_image_path?: string; 
  pay_type?: string;
  pay_amount?: string | number;
  created_at?: string;
  remote_options?: string;
  job_summary?: string;
};

function extractCityRegionCountry(address?: string) {
  if (!address) return "Unknown Location";
  const parts = address.split(",").map(s => s.trim()).filter(Boolean);
  if (parts.length === 0) return "Unknown Location";
  if (parts.length >= 3) {
    return parts.slice(-3).join(", ");
  }
  return parts.join(", ");
}

function formatPostedDate(postedDate?: string) {
  if (!postedDate) return "";
  const posted = new Date(postedDate);
  const now = new Date();
  const diffMs = now.getTime() - posted.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Posted today";
  if (diffDays === 1) return "Posted 1 day ago";
  if (diffDays <= 7) return `Posted ${diffDays} days ago`;
  return posted.toLocaleString("default", { month: "short", day: "numeric" });
}

function getMatchIcon(percent: number) {
  if (percent >= 60) return <AiFillSmile color="#4CAF50" size={24} />;
  if (percent >= 31) return <AiOutlineMeh color="#FFC107" size={24} />;
  return <TbMoodConfuzed color="#F44336" size={24} />;
}

function JobCard({
  isSelected,
  onSelect,
  job,
  onSaveToggle,
  companyLogoImagePath,
  studentPreferredTypes,
  studentPreferredLocations,
  shouldHighlight,
}: {
  id: number | string;
  isSelected: boolean;
  onSelect: () => void;
  onQuickApply: () => void;
  job: Job;
  onSaveToggle?: (jobId: number | string, isSaved: boolean) => void;
  companyLogoImagePath?: string | null;
  studentPreferredTypes?: string[];
  studentPreferredLocations?: string[];
  shouldHighlight?: boolean;
}) {
  function getDaysLeft(deadline?: string): string {
    if (!deadline) return "No application deadline";
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diff = deadlineDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (isNaN(days)) return "No application deadline";
    if (days < 0) return "Closed";
    if (days === 0) return "Closes today";
    if (days === 1) return "1 day left";
    return `${days} days left`;
  }

  const company =
    job.registered_employers?.company_name ||
    job.employers?.company_name ||
    [job.employers?.first_name, job.employers?.last_name].filter(Boolean).join(" ") ||
    "Unknown Company";

  const title = job.job_title || job.title || "Untitled Position";
  const description = job.description || "";
  const location = extractCityRegionCountry(job.location);
  const remoteOptions = job.remote_options || "On-site";
  const type = job.work_type || job.type || "Full-time";
  const vacancies = job.vacancies;
  const deadline = job.deadline || job.application_deadline || "";
  const payType = job.pay_type || "N/A";
  const payAmount = job.pay_amount ? job.pay_amount : "N/A";
  const postedDate = formatPostedDate(job.created_at);
  const jobSummary = job.job_summary;

  const { data: session } = useSession();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logoLoading, setLogoLoading] = useState(true);
  const [viewTracked, setViewTracked] = useState(false);
  const [matchPercent, setMatchPercent] = useState<number | null>(null);
  const [matchLoading, setMatchLoading] = useState<boolean>(false);
  const [showQuickApplyModal, setShowQuickApplyModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showApplicationModalQuickVersion, setShowApplicationModalQuickVersion] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [loadingApply, setLoadingApply] = useState(false);
  const [quickApplyProcessing, setQuickApplyProcessing] = useState(false);

  const logoPath =
    companyLogoImagePath ||
    job.registered_companies?.company_logo_image_path ||
    job.company_logo_image_path;



  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (job.id === "preview" && companyLogoImagePath) {
      const publicUrl = `https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/company.logo/${companyLogoImagePath}`;
      setLogoUrl(publicUrl);
      setLogoLoading(false);
      return;
    }
    setLogoLoading(true);
    let ignore = false;
    async function fetchLogoUrl() {
      if (!logoPath) {
        setLogoUrl(null);
        setLogoLoading(false);
        return;
      }
      const res = await fetch("/api/employers/get-signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bucket: "company.logo",
          path: logoPath,
        }),
      });
      const json = await res.json();
      if (!ignore) {
        if (json.signedUrl && typeof json.signedUrl === "string") {
          setLogoUrl(json.signedUrl);
        } else {
          setLogoUrl(null);
        }
        setLogoLoading(false);
      }
    }
    fetchLogoUrl();
    return () => { ignore = true; };
  }, [logoPath, job.id, companyLogoImagePath]);

  useEffect(() => {
    let ignore = false;
    async function fetchSaved() {
      const res = await fetch("/api/students/job-listings/saved-jobs");
      const json = await res.json();
      const savedIds = Array.isArray(json.jobs)
        ? json.jobs.map((j: { id: string | number }) => String(j.id))
        : [];
      if (!ignore) setSaved(savedIds.includes(String(job.id)));
    }
    fetchSaved();
    return () => { ignore = true; }
  }, [job.id]);


  useEffect(() => {
    let ignore = false;
    async function fetchMatchScore() {
      if (!job.id || !session?.user?.studentId) {
        if (!ignore) {
          setMatchPercent(null);
          setMatchLoading(false);
        }
        return;
      }
      if (!ignore) setMatchLoading(true);
      try {
        const score =
          typeof job.gpt_score === "number"
            ? job.gpt_score
            : null;
        if (score !== null) {
          setMatchPercent(Math.max(10, score));
          setMatchLoading(false);
          return;
        }
        const res = await fetch("/api/ai-matches/fetch-current-matches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_id: session.user.studentId }),
        });
        const json = await res.json();
        if (!ignore) {
          const match = Array.isArray(json.matches)
            ? json.matches.find((m: { job_id: string | number }) => String(m.job_id) === String(job.id))
            : null;
          const apiScore =
            typeof match?.gpt_score === "number"
              ? match.gpt_score
              : null;
          setMatchPercent(apiScore !== null ? Math.max(10, apiScore) : null);
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        if (!ignore) {
          setMatchPercent(null);
        }
      } finally {
        if (!ignore) setMatchLoading(false);
      }
    }
    fetchMatchScore();
    return () => { ignore = true; };
  }, [job.id, session?.user?.studentId]);

  useEffect(() => {
    if (!session?.user?.studentId || !job.id) return;

    setLoadingApply(true);
    fetch("/api/students/apply/check-apply-exist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId: session.user.studentId, jobId: job.id }),
    })
      .then((res) => res.json())
      .then((data) => setHasApplied(data.exists))
      .catch(() => setHasApplied(false))
      .finally(() => setLoadingApply(false));
  }, [session?.user?.studentId, job.id]);

  async function toggleSave(e: React.MouseEvent) {
    e.stopPropagation();
    setLoading(true);
    if (!saved) {
      await fetch("/api/students/job-listings/saved-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id }),
      });
      setSaved(true);
      if (onSaveToggle) onSaveToggle(job.id, true);
    } else {
      await fetch("/api/students/job-listings/saved-jobs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id }),
      });
      setSaved(false);
      if (onSaveToggle) onSaveToggle(job.id, false);
    }
    setLoading(false);
  }

  const trackJobView = async () => {
    if (viewTracked || job.id === "preview") return
    
    try {
      const response = await fetch("/api/employers/job-metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id, action: "view" }),
      })
      
      if (response.ok) {
        setViewTracked(true)
      }
    } catch (error) {
      console.error("Failed to track job view:", error)
    }
  }

  const trackJobClick = async () => {
    if (job.id === "preview") return
    
    try {
      await fetch("/api/employers/job-metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id, action: "click" }),
      })
    } catch (error) {
      console.error("Failed to track job click:", error)
    }
  }

  const matchedPrefs: string[] = [];
  const jobWorkTypeNorm = (job.work_type || "").toLowerCase().trim();
  const jobRemoteNorm = (job.remote_options || "").toLowerCase().trim();
  if (Array.isArray(studentPreferredTypes) && studentPreferredTypes.length > 0) {
    const prefTypesNorm = studentPreferredTypes.map(p => String(p).toLowerCase().trim());
    if (prefTypesNorm.includes(jobWorkTypeNorm) && (job.work_type || "").trim().length > 0) {
      matchedPrefs.push(job.work_type || jobWorkTypeNorm);
    }
  }
  if (Array.isArray(studentPreferredLocations) && studentPreferredLocations.length > 0) {
    const prefLocNorm = studentPreferredLocations.map(p => String(p).toLowerCase().trim());
    if (prefLocNorm.includes(jobRemoteNorm) && (job.remote_options || "").trim().length > 0) {
      matchedPrefs.push(job.remote_options || jobRemoteNorm);
    }
  }

  async function handleQuickApply() {
    if (!session?.user?.studentId || quickApplyProcessing) return;
    setQuickApplyProcessing(true);
    const res = await fetch("/api/students/apply/quick-apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId: session.user.studentId }),
    });
    const json = await res.json();
    if (json.exists) {
      if (!hasApplied) {
        try {
          const copyRes = await fetch("/api/students/apply/copy-to-applications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentId: session.user.studentId, jobId: job.id }),
          });
          const copyJson = await copyRes.json();
          if (copyJson.success) {
            setHasApplied(true);
          }
          setShowApplicationModalQuickVersion(true);
        } catch {
          setShowApplicationModalQuickVersion(true);
        }
      } else {
        setShowApplicationModalQuickVersion(true);
      }
      setShowQuickApplyModal(false);
      setShowApplicationModal(false);
    } else {
      setShowApplicationModal(false);
      setShowQuickApplyModal(true);
    }
    setQuickApplyProcessing(false);
  }

  return (
    <>
      <motion.div
        className={`bg-white rounded-lg shadow-sm p-5 border-l-4 ${
          isSelected ? "border-l-blue-500 border-blue-200" : "border-l-transparent border-gray-200"
        } relative overflow-hidden mt-2`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onMouseEnter={trackJobView}
        whileHover={{
          y: -2,
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          borderColor: "rgba(96, 165, 250, 0.8)",
        }}
      >
        {shouldHighlight && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{
              x: "-100%",
              background:
                "linear-gradient(90deg, rgba(216,180,254,0) 0%, rgba(216,180,254,0.9) 35%, rgba(251,207,232,0.9) 65%, rgba(251,207,232,0) 100%)",
            }}
            animate={{ x: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        )}
        <div className="flex justify-between">
          <div className="flex gap-3">
            <motion.div
              className="w-12 h-12 bg-black rounded-full flex items-center justify-center overflow-hidden text-white"
              whileHover={{ scale: 1.1 }}
            >
              {logoLoading ? (
                <div className="w-12 h-12 rounded-full animate-pulse bg-gradient-to-br from-blue-400 via-blue-500 to-purple-400" />
              ) : logoUrl && logoUrl.startsWith("http") ? (
                <Image
                  src={logoUrl}
                  alt="Company logo"
                  width={48}
                  height={48}
                  className="object-cover"
                  onLoad={() => setLogoLoading(false)}
                  onError={() => setLogoLoading(false)}
                />
              ) : (
                <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full">
                  <PiBuildingsFill className="w-6 h-6" color="#6B7280" />
                </div>
              )}
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
                {matchedPrefs.length > 0 && (
                  <div
                    className="flex items-center gap-2"
                    title="These are your set preferences"
                    aria-label="Your set preferences"
                    role="group"
                  >
                    {matchedPrefs.map((p, i) => (
                      <span
                        key={`${p}-${i}`}
                        title={p === job.work_type ? "Matches your job type preference" : "Matches your remote preference"}
                        className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700"
                        aria-label={`preference-badge-${i}`}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                )}
                {postedDate === "Posted today" && (
                  <span className="ml-2 bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    New
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {company}
                {location && location !== "Unknown Location" && (
                  <>  <span className="text-gray-400">| {location}</span></>
                )}
              </p>
            </div>
          </div>
          <motion.button
            className={`text-gray-400 hover:text-blue-500 transition-colors ${saved ? "text-blue-500" : ""}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSave}
            disabled={loading}
          >
            <Bookmark
              size={20}
              className={`${saved ? "fill-blue-500 text-blue-500" : ""}`}
            />
          </motion.button>
        </div>

        {jobSummary && (
          <p className="text-gray-700 text-sm mt-2">
            {jobSummary}
          </p>
        )}

        {description && (
          <p className="text-gray-600 text-sm mt-3">
            {description}
          </p>
        )}

        {matchLoading ? (
          <div className="mt-4 px-4 py-2 rounded-lg flex items-center gap-2 animate-pulse bg-gradient-to-r from-purple-400 via-blue-400 to-purple-300 min-h-[44px]" />
        ) : matchPercent !== null ? (
          <motion.div
            className="mt-4 px-4 py-2 rounded-lg flex items-center gap-2 pointer-events-none"
            style={{
              background:
                matchPercent >= 60
                  ? "#E6F4EA"
                  : matchPercent >= 31
                  ? "#FFF8E1"
                  : "#FDECEA",
              color:
                matchPercent >= 60
                  ? "#256029"
                  : matchPercent >= 31
                  ? "#8D6E00"
                  : "#B71C1C"
            }}
            whileHover={{ scale: 1.06 }}
          >
            {getMatchIcon(matchPercent)}
            <span>
              You are <span style={{
                color:
                  matchPercent >= 60
                    ? "#256029"
                    : matchPercent >= 31
                    ? "#F59E42"
                    : "#EF4444",
                fontWeight: 700
              }}>{matchPercent}%</span> match to this job.
            </span>
          </motion.div>
        ) : (
          <motion.div
            className="mt-4 px-4 py-2 rounded-lg flex items-center gap-2 pointer-events-none"
            style={{
              background: "#F3F4F6",
              color: "#6B7280"
            }}
            whileHover={{ scale: 1.06 }}
          >
            <SiStarship size={22} color="#9CA3AF" />
            <span>
              Looks like you&apos;re new here! Set up your profile to get a match for you.
            </span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            <span>{getDaysLeft(deadline)}</span>
          </div>
          <div className="flex items-center">
            <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
            <span>{type}</span>
          </div>
          <div className="flex items-center">
            <PiMoneyDuotone  className="h-4 w-4 mr-2 text-gray-400" />
            <span>
              {payType}
              {payAmount !== "N/A" && ` / ${payAmount}`}
            </span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-gray-400" />
            <span>
              {typeof vacancies === "number" && vacancies > 0
                ? `${vacancies} vacancies left`
                : "Unlimited Applicants"}
            </span>
          </div>
          <div className="flex items-center">
            <Globe className="h-4 w-4 mr-2 text-gray-400" />
            <span>{remoteOptions}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-gray-500">{postedDate}</span>
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
              className={`px-6 py-2 rounded-full font-medium shadow-sm border flex-1 sm:flex-none flex items-center justify-center gap-2 ${
                hasApplied
                  ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                  : "bg-white hover:bg-blue-50 text-blue-600 border-blue-600"
              }`}
              whileHover={hasApplied || loadingApply || quickApplyProcessing ? {} : { scale: 1.03 }}
              whileTap={hasApplied || loadingApply || quickApplyProcessing ? {} : { scale: 0.97 }}
              onClick={(e) => {
                e.stopPropagation();
                handleQuickApply();
              }}
              disabled={hasApplied || loadingApply || quickApplyProcessing}
            >
              {(loadingApply || quickApplyProcessing) ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Tooltip title={hasApplied ? "Looks like you’ve applied before — no need to apply again." : ""}>
                  <span className="flex items-center gap-2">
                    <IoIosRocket className="w-4 h-4" />
                    {hasApplied ? "Submitted" : "Quick Apply"}
                  </span>
                </Tooltip>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
      <QuickApplyModal
        open={showQuickApplyModal}
        onClose={() => setShowQuickApplyModal(false)}
        onSubscribe={() => {
          setShowQuickApplyModal(false);
          setShowApplicationModal(true);
        }}
        jobTitle={title}
      />
      {showApplicationModal && (
        <ApplicationModal
          jobId={String(job.id)}
          jobTitle={title}
          onClose={() => setShowApplicationModal(false)}
        />
      )}
      {showApplicationModalQuickVersion && (
        <ApplicationModalQuickVersion
          onClose={() => setShowApplicationModalQuickVersion(false)}
          jobId={String(job.id)} 
        />
      )}
    </>
  );
}

export default JobCard;
