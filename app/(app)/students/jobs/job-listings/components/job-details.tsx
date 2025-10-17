import React, { useState, useEffect } from "react";
import { ArrowRight,  MapPin, Users, Mail, Bookmark, Briefcase, Clock, Globe,   FileText, BadgeCheck as LuBadgeCheck,  } from "lucide-react";
import { HiBadgeCheck } from "react-icons/hi";
import { RiErrorWarningLine } from "react-icons/ri"
import { Divider as Separator, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
//import { FaWandMagicSparkles } from "react-icons/fa6";

import { ApplicationModal } from "./application-modal";
import dynamic from "next/dynamic";
import { FaMoneyBill } from "react-icons/fa";
import { calculateSkillsMatch } from "../../../../../../lib/match-utils";
import { SiStarship } from "react-icons/si";
import { PiBuildingsFill } from "react-icons/pi";
import { Calendar } from "lucide-react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import listLoadAnimation from "../../../../../../public/animations/list-load.json";
import notFoundAnimation from "../../../../../../public/animations/not-found.json";
import { BsPersonAdd } from "react-icons/bs";

type Employer = {
  first_name?: string;
  last_name?: string;
  company_name?: string;
  job_title?: string;
};

export type Job = {
  id: string;
  title?: string;
  job_title?: string;
  description?: string;
  location?: string;
  vacancies?: number;
  deadline?: string;
  application_deadline?: string;
  skills?: string[];
  match_percentage?: number;
  employers?: Employer;
  registered_employers?: { company_name?: string };
  responsibilities?: string;
  must_haves?: string[];
  nice_to_haves?: string[];
  perks?: string[];
  remote_options?: string;
  work_type?: string;
  pay_type?: string;
  pay_amount?: string;
  recommended_course?: string;
  job_summary?: string;
  verification_tier?: string;
  max_applicants?: number;
  paused?: boolean;
  created_at?: string;
  registered_companies?: {
    company_name?: string;
    company_logo_image_path?: string;
    company_industry?: string;
    company_size?: string;
    address?: string;
  };
};

type CompanyEmployee = {
  id: string;
  first_name?: string;
  last_name?: string;
  job_title?: string;
  profile_img?: string | null;
  profile_img_signed_url?: string | null;
};

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


const CustomTooltip = styled(Tooltip)<TooltipProps>(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    color: "#222",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    fontSize: 13,
    borderRadius: 8,
    padding: "8px 14px",
    fontWeight: 500,
    letterSpacing: 0.1,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#fff",
  },
}));

function extractCityRegionCountry(address?: string) {
  if (!address) return "Unknown Location";
  const parts = address.split(",").map(s => s.trim()).filter(Boolean);
  if (parts.length === 0) return "Unknown Location";
  if (parts.length >= 3) {
    return parts.slice(-3).join(", ");
  }
  return parts.join(", ");
}

function getCompanyLogoPath(job: Job | null): string | undefined {
  return job?.registered_companies?.company_logo_image_path;
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

const JobDetails = ({ onClose, jobId }: { onClose: () => void; jobId?: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [showText, setShowText] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [employerProfileImgUrl, setEmployerProfileImgUrl] = useState<string | null>(null);
  const [companyEmployees, setCompanyEmployees] = useState<CompanyEmployee[]>([]);
  const [saved, setSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [jobSkills, setJobSkills] = useState<string[]>([]);
  const [studentSkills, setStudentSkills] = useState<string[]>([]);
  const [viewTracked, setViewTracked] = useState(false)

  const trackJobView = async (jobId: string) => {
    if (viewTracked) return
    
    try {
      const response = await fetch("/api/employers/job-metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, action: "view" }),
      })
      
      if (response.ok) {
        setViewTracked(true)
      }
    } catch (error) {
      console.error("Failed to track job view:", error)
    }
  }

  useEffect(() => {
    if (!jobId) return;
    setLoading(true);
    const cacheKey = `jobDetails:${jobId}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      setJob(parsed.job);
      let logoUrlVal = parsed.logoUrl;
      if (logoUrlVal && typeof logoUrlVal === "object" && logoUrlVal.url) {
        logoUrlVal = logoUrlVal.url;
      }
      setLogoUrl(typeof logoUrlVal === "string" ? logoUrlVal : null);
      setEmployerProfileImgUrl(parsed.employerProfileImgUrl);
      setCompanyEmployees(parsed.companyEmployees);
      setLoading(false);
      return;
    }
    fetch(`/api/students/job-listings/${jobId}`)
      .then(res => res.json())
      .then(async data => {
        setJob(data && !data.error ? data : null);
        if (data && !data.error && jobId) {
          await trackJobView(jobId);
        }
        const logoPath = getCompanyLogoPath(data);
        let logoUrlVal: string | null = null;
        if (logoPath) {
          const logoCacheKey = `companyLogoUrl:${logoPath}`;
          const cachedLogo = sessionStorage.getItem(logoCacheKey);
          if (cachedLogo) {
            let parsedLogo = cachedLogo;
            try {
              const parsedObj = JSON.parse(cachedLogo);
              if (parsedObj && typeof parsedObj === "object" && parsedObj.url) {
                parsedLogo = parsedObj.url;
              }
            } catch {}
            setLogoUrl(parsedLogo);
            logoUrlVal = parsedLogo;
          } else {
            const res = await fetch("/api/employers/get-signed-url", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                bucket: "company.logo",
                path: logoPath,
              }),
            });
            if (res.ok) {
              const { signedUrl } = await res.json();
              setLogoUrl(signedUrl || null);
              logoUrlVal = signedUrl || null;
              if (signedUrl) sessionStorage.setItem(logoCacheKey, JSON.stringify({ url: signedUrl }));
            } else {
              setLogoUrl(null);
              logoUrlVal = null;
            }
          }
        } else {
          setLogoUrl(null);
          logoUrlVal = null;
        }

        let employerProfileImgUrlVal: string | null = null;
        if (typeof data?.employer_profile_img === "string" && data.employer_profile_img.trim() !== "") {
          const res = await fetch("/api/employers/get-signed-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bucket: "user.avatars",
              path: data.employer_profile_img,
            }),
          });
          if (res.ok) {
            const { signedUrl } = await res.json();
            setEmployerProfileImgUrl(signedUrl || null);
            employerProfileImgUrlVal = signedUrl || null;
          } else {
            setEmployerProfileImgUrl(null);
            employerProfileImgUrlVal = null;
          }
        } else {
          setEmployerProfileImgUrl(null);
          employerProfileImgUrlVal = null;
        }

        let companyEmployeesVal: CompanyEmployee[] = [];
        const companyName =
          data?.registered_companies?.company_name ||
          data?.registered_employers?.company_name ||
          data?.employers?.company_name;
        if (companyName) {
          try {
            const res = await fetch(`/api/employers/colleagues/fetchUsers?company_name=${encodeURIComponent(companyName)}`);
            const resJson = await res.json();
            if (Array.isArray(resJson.data)) {
              const employeesWithSignedUrl = await Promise.all(
                resJson.data.map(async (emp: CompanyEmployee) => {
                  if (emp.profile_img) {
                    const urlRes = await fetch("/api/employers/get-signed-url", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        bucket: "user.avatars",
                        path: emp.profile_img,
                      }),
                    });
                    if (urlRes.ok) {
                      const { signedUrl } = await urlRes.json();
                      return { ...emp, profile_img_signed_url: signedUrl || null };
                    }
                  }
                  return { ...emp, profile_img_signed_url: null };
                })
              );
              setCompanyEmployees(employeesWithSignedUrl);
              companyEmployeesVal = employeesWithSignedUrl;
            } else {
              setCompanyEmployees([]);
              companyEmployeesVal = [];
            }
          } catch {
            setCompanyEmployees([]);
            companyEmployeesVal = [];
          }
        } else {
          setCompanyEmployees([]);
          companyEmployeesVal = [];
        }

        setLoading(false);

        sessionStorage.setItem(
          cacheKey,
          JSON.stringify({
            job: data && !data.error ? data : null,
            logoUrl: logoUrlVal,
            employerProfileImgUrl: employerProfileImgUrlVal,
            companyEmployees: companyEmployeesVal,
          })
        );
      })
      .catch(() => {
        setLoading(false);
      });
  }, [jobId]);

  useEffect(() => {
    if (!jobId) return;
    let ignore = false;
    async function fetchSaved() {
      const res = await fetch("/api/students/job-listings/saved-jobs");
      const json = await res.json();
      if (!ignore) setSaved(json.jobIds?.map(String).includes(String(jobId)));
    }
    fetchSaved();
    return () => { ignore = true; }
  }, [jobId]);

  async function toggleSave(e: React.MouseEvent) {
    e.stopPropagation();
    setSaveLoading(true);
    try {
      let res;
      if (!saved) {
        res = await fetch("/api/students/job-listings/saved-jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId }),
        });
        if (res.ok) setSaved(true);
      } else {
        res = await fetch("/api/students/job-listings/saved-jobs", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId }),
        });
        if (res.ok) setSaved(false);
      }
      if (!res.ok) {
        alert((await res.json()).message || "Failed to save job");
      }
    } catch {
      alert("Network error");
    }
    setSaveLoading(false);
  }

  useEffect(() => {
    const timeout = setTimeout(() => setShowText(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  async function refreshLogoUrl(job: Job | null) {
    const logoPath = getCompanyLogoPath(job);
    if (!logoPath) {
      setLogoUrl(null);
      return;
    }
    const logoCacheKey = `companyLogoUrl:${logoPath}`;

    sessionStorage.removeItem(logoCacheKey);

    const res = await fetch("/api/employers/get-signed-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bucket: "company.logo",
        path: logoPath,
      }),
    });
    if (res.ok) {
      const { signedUrl } = await res.json();
      setLogoUrl(signedUrl || null);
      if (signedUrl) sessionStorage.setItem(logoCacheKey, JSON.stringify({ url: signedUrl }));
    } else {
      setLogoUrl(null);
    }
  }

  useEffect(() => {
    if (!jobId) return;
    fetch(`/api/jobs/${jobId}/skills`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.skills)) setJobSkills(data.skills);
        else setJobSkills([]);
      })
      .catch(() => setJobSkills([]));
  }, [jobId]);

  useEffect(() => {
    fetch("/api/students/student-profile/getHandlers")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.skills)) setStudentSkills(data.skills);
        else if (typeof data.skills === "string") {
          try {
            const arr = JSON.parse(data.skills);
            if (Array.isArray(arr)) setStudentSkills(arr);
            else setStudentSkills(
              (data.skills as string).split(",").map((s: string) => s.trim()).filter((s: string) => !!s)
            );
          } catch {
            setStudentSkills(
              (data.skills as string).split(",").map((s: string) => s.trim()).filter((s: string) => !!s)
            );
          }
        } else setStudentSkills([]);
      })
      .catch(() => setStudentSkills([]));
  }, []);

  useEffect(() => {
    if (studentSkills.length || jobSkills.length) {
      console.log("Student skills:", studentSkills);
      console.log("Job skills:", jobSkills);
    }
  }, [studentSkills, jobSkills]);

  const skillsMatchPercentRaw = studentSkills.length > 0 ? calculateSkillsMatch(studentSkills, jobSkills) : null;
  const skillsMatchPercent = skillsMatchPercentRaw !== null ? Math.max(10, skillsMatchPercentRaw) : null;
  const matchedSkillsCount = jobSkills.filter(
    skill => studentSkills.map(s => s.trim().toLowerCase()).includes(skill.trim().toLowerCase())
  ).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] w-full">
        <div className="w-100 h-100 flex items-center justify-center">
          <Lottie animationData={listLoadAnimation} loop={true} />
        </div>
        <div className="mt-4 text-gray-500 font-medium animate-pulse">Loading job details</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="bg-white rounded-full shadow-lg flex items-center justify-center mt-10 w-64 h-64">
          <Lottie animationData={notFoundAnimation} loop={true} />
        </div>
        <span className="mt-4 text-gray-500 font-medium text-base text-center">
          Uh-oh!<br />Unable to load details — try refreshing or check back later!
        </span>
      </div>
    );
  }

  const company =
    job.registered_employers?.company_name ||
    job.employers?.company_name ||
    [job.employers?.first_name ?? "", job.employers?.last_name ?? ""].filter(Boolean).join(" ") ||
    "Unknown Company";

  const title = job.job_title || job.title || "Untitled Position";
  const description = job.description || "";
  const location = extractCityRegionCountry(job.location);
  const vacancies = job.vacancies;
  const deadline = job.deadline || job.application_deadline || "";

  const responsibilities = job.responsibilities || [];
  const mustHaves = job.must_haves || [];
  const niceToHaves = job.nice_to_haves || [];
  const perks = job.perks || [];

  const remoteOptions = job.remote_options || "Not specified";
  const workType = job.work_type || "Not specified";
  const payType = job.pay_type || "";
  const payAmount = job.pay_amount || "";
  const jobSummary = job.job_summary || "";
  const verificationTier = job.verification_tier || "basic";

  function formatIndustry(industry?: string) {
    if (!industry) return "";
    return industry.charAt(0).toUpperCase() + industry.slice(1).toLowerCase();
  }

  function formatAddress(address?: string) {
    if (!address) return "";
    const parts = address.split(",").map(s => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
      return parts.slice(-2).join(", ");
    }
    return parts.join(", ");
  }

  const companyIndustry = job.registered_companies?.company_industry
    ? formatIndustry(job.registered_companies.company_industry)
    : "";
  const companyAddress = job.registered_companies?.address
    ? formatAddress(job.registered_companies.address)
    : "";


  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm">
      <div className="p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 bg-blue-100 hover:bg-blue-200 rounded-full p-2"
        >
          <ArrowRight className="w-5 h-5 text-blue-600 rotate-180" />
        </button>
        <div className="mt-12 flex items-start gap-4">
          <div className="bg-black rounded-full w-14 h-14 flex items-center justify-center text-white overflow-hidden">
        
            {logoUrl === undefined ? (
              <div className="w-full h-full" />
            ) : logoUrl === null ? (
              <div className="bg-blue-600 w-full h-full flex items-center justify-center rounded-full">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
            ) : logoUrl && typeof logoUrl === "string" && (logoUrl.startsWith("http") || logoUrl.startsWith("/")) ? (
              <Image
                src={logoUrl}
                alt=""
                width={56}
                height={56}
                className="object-cover w-full h-full rounded-full"
                unoptimized
                onError={async e => {
                  e.currentTarget.onerror = null;
                  await refreshLogoUrl(job);
                  if (e.currentTarget && document.body.contains(e.currentTarget)) {
                    e.currentTarget.style.display = "none";
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class='bg-blue-600 w-full h-full flex items-center justify-center rounded-full'><svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="white"><rect width="18" height="12" x="3" y="7" rx="2"/><path d="M16 3v4M8 3v4"/></svg></div>`;
                    }
                  }
                }}
              />
            ) : (
              <div className="animate-pulse bg-gray-200 w-full h-full rounded-full" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{title}</h1>
              {verificationTier === "full" ? (
                <CustomTooltip title="Fully verified and trusted company">
                  <motion.span whileHover={{ scale: 1.25 }} style={{ display: "inline-flex" }}>
                    <HiBadgeCheck className="w-5 h-5 text-blue-600" />
                  </motion.span>
                </CustomTooltip>
              ) : verificationTier === "standard" ? (
                <CustomTooltip title="Partially verified, exercise some caution">
                  <motion.span whileHover={{ scale: 1.25 }} style={{ display: "inline-flex" }}>
                    <LuBadgeCheck className="w-5 h-5" style={{ color: "#7c3aed" }} />
                  </motion.span>
                </CustomTooltip>
              ) : (
                <CustomTooltip title="Not verified, proceed carefully">
                  <motion.span whileHover={{ scale: 1.25 }} style={{ display: "inline-flex" }}>
                    <RiErrorWarningLine className="w-5 h-5 text-orange-500" />
                  </motion.span>
                </CustomTooltip>
              )}
            </div>
            <div className="text-muted-foreground">{company}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 pointer-events-none">
          <div className="flex items-center gap-2 text-sm bg-gray-200 px-4 py-1 rounded-full pointer-events-none">
            <span className="text-blue-600 font-medium">
              {matchedSkillsCount} Skills Matched
              {jobSkills.length > 0 && (
                <>
                  {" "}

                </>
              )}
            </span>
          </div>
          {(payAmount || payType) && (
            <div className="flex items-center gap-2 text-sm bg-green-100 px-4 py-1 rounded-full">
              <FaMoneyBill className="w-4 h-4 text-green-700" />
              <span className="text-green-700 font-medium">
                {payAmount}
                {payAmount && payType ? " / " : ""}
                {payType}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-3">
          <Button
            className="gap-2 rounded-full"
            onClick={() => setIsModalOpen(true)
            }
          >
            <Mail className="w-4 h-4" />
            <span className="text-white px-3">Apply</span>
          </Button>
          <Button
            variant="outline"
            className={`gap-2 rounded-full border-blue-600 ${saved ? "text-blue-600" : "text-blue-600"} hover:bg-blue-50 px-5`}
            onClick={toggleSave}
            disabled={saveLoading}
          >
            <Bookmark className={`w-4 h-4 ${saved ? "fill-blue-600" : ""}`} />
            <span>{saved ? "Saved" : "Save"}</span>
          </Button>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          {description}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-gray-500 text-sm">{formatPostedDate(job.created_at)}</span>
        </div>
      </div>

      <Separator />

      <div className="p-6">
        <div className="flex items-start gap-4">
          {studentSkills.length > 0 ? (
            <>
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={
                      skillsMatchPercent !== null && skillsMatchPercent >= 70
                        ? "#22c55e"
                        : skillsMatchPercent !== null && skillsMatchPercent >= 40
                        ? "#f97316"
                        : "#ef4444"
                    }
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={
                      2 * Math.PI * 40 * (1 - (skillsMatchPercent ?? 0) / 100)
                    }
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.5s, stroke 0.5s" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold">{skillsMatchPercent}%</span>
                </div>
              </div>
              <div className="flex-1">
                <h3
                  style={{
                    color:
                      skillsMatchPercent !== null && skillsMatchPercent >= 70
                        ? "#22c55e"
                        : skillsMatchPercent !== null && skillsMatchPercent >= 40
                        ? "#f59e42"
                        : "#ef4444",
                    fontWeight: 600,
                    fontSize: "1.125rem"
                  }}
                  className={`font-semibold ${showText ? "opacity-100 transition-opacity duration-500" : "opacity-0"}`}
                >
                  {skillsMatchPercent !== null && skillsMatchPercent >= 70
                    ? "This Job Is a Strong Match for You"
                    : skillsMatchPercent !== null && skillsMatchPercent >= 40
                    ? "This Job Is a Partial Match for You"
                    : "This Job Isn’t a Strong Match for You"}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {skillsMatchPercent !== null && skillsMatchPercent >= 70
                    ? "Your background and skills closely match what this role is looking for — it could be a great fit!"
                    : skillsMatchPercent !== null && skillsMatchPercent >= 40
                    ? "You match some key aspects of this role. With a bit of alignment, it could be a solid opportunity."
                    : "Your profile doesn’t closely match the main requirements for this role, but other opportunities may suit you better."}
                </p>
                <Button variant="link" className="p-0 h-auto text-primary mt-2">
                  View Details
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 w-full bg-gray-100 rounded-lg px-6 py-8 pointer-events-none">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-200">
                <SiStarship size={40} color="#9CA3AF" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-500 mb-1">Looks like you&apos;re new here!</h3>
                <p className="text-xs text-gray-400">
                  Set up your profile to get a match for you.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator />

      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Job Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{getDaysLeft(deadline)}</span>
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              {typeof vacancies === "number" && vacancies > 0
                ? `${vacancies} vacancies`
                : "Unlimited Applicants"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{remoteOptions}</span>
          </div>
          <div className="flex items-center gap-3">
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{workType}</span>
          </div>
        </div>
      </div>

      <Separator />
      <div className="p-6">
        <h3 className="font-semibold mb-2">Recommended Course(s)</h3>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
          {(() => {
            if (!job.recommended_course) return <li>No recommended course listed.</li>;
            let courses: string[] = [];
            if (Array.isArray(job.recommended_course)) {
              courses = job.recommended_course;
            } else if (typeof job.recommended_course === "string") {
              try {
                const parsed = JSON.parse(job.recommended_course);
                if (Array.isArray(parsed)) {
                  courses = parsed.filter((v) => typeof v === "string");
                } else {
                  courses = job.recommended_course.split(",").map(s => s.trim());
                }
              } catch {
                const cleaned = job.recommended_course
                  .replace(/^\{|\}$/g, "")
                  .replace(/^\[|\]$/g, "")
                  .replace(/"/g, "");
                courses = cleaned.split(",").map(s => s.trim()).filter(Boolean);
              }
            }
            return courses && courses.length > 0
              ? courses.map((item, i) => <li key={i}>{item}</li>)
              : <li>No recommended course listed.</li>;
          })()}
        </ul>
      </div>
      <Separator />

      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">About the Job</h2>
        {jobSummary && (
          <div className="mb-4 flex items-start gap-2">
            <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1 text-sm">Summary</h4>
              <p className="text-sm text-muted-foreground">{jobSummary}</p>
            </div>
          </div>
        )}
        <p className="text-sm text-muted-foreground mb-4">
          {description}
        </p>
        <h3 className="font-semibold mt-6 mb-2">Responsibilities</h3>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
          {Array.isArray(responsibilities) && responsibilities.length > 0
            ? responsibilities.map((item, i) => <li key={i}>{item}</li>)
            : <li>No responsibilities listed.</li>}
        </ul>
        <h3 className="font-semibold mt-6 mb-2">Qualifications</h3>
        <h4 className="text-sm font-medium mb-2">Must-Haves:</h4>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
          {mustHaves && mustHaves.filter(item => item && item.trim().length > 0).length > 0
            ? mustHaves.filter(item => item && item.trim().length > 0).map((item, i) => <li key={i}>{item}</li>)
            : <li>No must-haves listed.</li>}
        </ul>
        <h4 className="text-sm font-medium mt-4 mb-2">Nice-to-Haves:</h4>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
          {niceToHaves && niceToHaves.filter(item => item && item.trim().length > 0).length > 0
            ? niceToHaves.filter(item => item && item.trim().length > 0).map((item, i) => <li key={i}>{item}</li>)
            : <li>No nice-to-haves listed.</li>}
        </ul>
        <h3 className="font-semibold mt-6 mb-2">Perks and Benefits</h3>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
          {perks && perks.filter(item => item && item.trim().length > 0).length > 0
            ? perks.filter(item => item && item.trim().length > 0).map((item, i) => <li key={i}>{item}</li>)
            : <li>No perks listed.</li>}
        </ul>
        <div className="mt-4">
          <div className="text-sm text-muted-foreground font-semibold mb-1">Full Location</div>
          <div className="text-sm">{job.location || "Unknown Location"}</div>
        </div>

      </div>
      <Separator />

      <div className="p-6">
        <p className="mb-3 text-gray-600 text-sm font-semibold">Job Poster</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
              {employerProfileImgUrl && (employerProfileImgUrl.startsWith("http") || employerProfileImgUrl.startsWith("/")) ? (
                <Image
                  src={employerProfileImgUrl}
                  alt="Profile picture"
                  width={48}
                  height={48}
                  className="object-cover w-full h-full rounded-full"
                />
              ) : (
                <Image
                  src="/placeholder.svg?height=48&width=48"
                  alt="Pfp"
                  width={48}
                  height={48}
                  className="object-cover w-full h-full rounded-full"
                />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                
                <span className="font-medium">
                  {job.employers?.first_name || ""} {job.employers?.last_name || ""}
                </span>
                {verificationTier === "full" ? (
                  <CustomTooltip title="Fully verified and trusted company">
                    <motion.span whileHover={{ scale: 1.25 }} style={{ display: "inline-flex" }}>
                      <HiBadgeCheck className="w-4 h-4 text-blue-600" />
                    </motion.span>
                  </CustomTooltip>
                ) : verificationTier === "standard" ? (
                  <CustomTooltip title="Partially verified, exercise some caution">
                    <motion.span whileHover={{ scale: 1.25 }} style={{ display: "inline-flex" }}>
                      <LuBadgeCheck className="w-4 h-4" style={{ color: "#7c3aed" }} />
                    </motion.span>
                  </CustomTooltip>
                ) : (
                  <CustomTooltip title="Not verified, proceed carefully">
                    <motion.span whileHover={{ scale: 1.25 }} style={{ display: "inline-flex" }}>
                      <RiErrorWarningLine className="w-4 h-4 text-orange-500" />
                    </motion.span>
                  </CustomTooltip>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {job.employers?.job_title || "N/A"}
              </span>
            </div>
          </div>
          <Button variant="outline" className="rounded-full text-blue-500 border-blue-500 flex items-center gap-2">
            <BsPersonAdd className="w-4 h-4" />
            <span>Follow</span>
          </Button>
        </div>
      </div>

      <Separator />

      <Card className="m-6">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">About the Company</h2>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
              <div className="relative w-16 h-16">
                {logoUrl && typeof logoUrl === "string" ? (
                  <Image
                    src={logoUrl}
                    alt="Company Logo"
                    width={64}
                    height={64}
                    className="object-cover w-full h-full rounded-md"
                    unoptimized
                    onError={async e => {
                      e.currentTarget.onerror = null;
                      await refreshLogoUrl(job);
                      if (e.currentTarget && document.body.contains(e.currentTarget)) {
                        e.currentTarget.style.display = "none";
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class='bg-blue-600 w-full h-full flex items-center justify-center rounded-md'><svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="white"><rect width="18" height="12" x="3" y="7" rx="2"/><path d="M16 3v4M8 3v4"/></svg></div>`;
                        }
                      }
                    }}
                  />
                ) : (
                  <div className="bg-gray-200 w-full h-full flex items-center justify-center rounded-md">
                    <PiBuildingsFill className="w-8 h-8" color="#6B7280" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold">{company}</h3>
              <div className="text-xs text-muted-foreground mt-1">
                {companyAddress}
              </div>
              {companyIndustry && (
                <span className="inline-block mt-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {companyIndustry}
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            See company profile for more information.
          </p>
          <div className="mt-2 text-right">
            <Button variant="link" className="p-0 h-auto text-primary">
              View company
            </Button>
          </div>
        </div>
      </Card>

      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Employees linked to this company</h2>
        <div className="grid grid-cols-3 gap-4">
          {companyEmployees.length > 0 ? (
            companyEmployees.slice(0, 3).map((emp, i) => (
              <Card key={emp.id || i} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mb-2">
                      <Image
                        src={
                          emp.profile_img_signed_url
                            ? emp.profile_img_signed_url
                            : "https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/app.images/default-pfp.jpg"
                        }
                        alt={(emp.first_name || "Employee") + " " + (emp.last_name || "")}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full rounded-full"
                      />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-sm truncate max-w-[120px]">
                        {emp.first_name || "Employee"} {emp.last_name || ""}
                      </div>
                      <div
                        className="text-xs text-muted-foreground truncate max-w-[120px]"
                        title={emp.job_title || "Position"}
                      >
                        {emp.job_title || "Position"}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-500 border-blue-500 w-full mt-3 rounded-full flex items-center justify-center gap-2"
                  >
                    <BsPersonAdd  className="w-4 h-4" />
                    <span className="truncate">Follow</span>
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            [1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mb-2">
                      <Image
                        src="https://dbuyxpovejdakzveiprx.supabase.co/storage/v1/object/public/app.images/default-pfp.jpg"
                        alt="Employee"
                        width={64}
                        height={64}
                        className="object-cover w-full h-full rounded-full"
                      />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-sm truncate max-w-[120px]">Employee {i}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[120px]">Position</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-500 border-blue-500 w-full mt-3 rounded-full flex items-center justify-center gap-2"
                  >
                    <BsPersonAdd  className="w-4 h-4" />
                    <span className="truncate">Follow</span>
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="ghost" size="icon" className="rounded-full bg-primary/10">
            <span className="sr-only">Next</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </div>
      </div>
      {isModalOpen && (
        <ApplicationModal
          jobId={job && job.id ? job.id : ""}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};



export default JobDetails;



