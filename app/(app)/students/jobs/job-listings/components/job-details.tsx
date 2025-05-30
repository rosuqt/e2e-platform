import React, { useState, useEffect } from "react";
import { ArrowRight, CheckCircle, MapPin, Users, Mail, Bookmark, Briefcase, Clock, Globe, Home, DollarSign,  FileText, BadgeAlert, BadgeCheck as LuBadgeCheck } from "lucide-react";
import { HiBadgeCheck } from "react-icons/hi";
import { Divider as Separator, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
//import { FaWandMagicSparkles } from "react-icons/fa6";
import { ApplicationModal } from "./application-modal";
import clsx from "clsx";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import listLoadAnimation from "../../../../../../public/animations/list-load.json";

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
  type?: string;
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
};

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

const progressStates = [
  { value: 15, color: "#ef4444", label: "15%" },
  { value: 36, color: "#f97316", label: "36%" },
  { value: 98, color: "#22c55e", label: "98%" },
];

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

const JobDetails = ({ onClose, jobId }: { onClose: () => void; jobId?: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [progressIdx, setProgressIdx] = useState(0);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (!jobId) return;
    setLoading(true);
    fetch(`/api/students/job-listings/${jobId}`)
      .then(res => res.json())
      .then(data => {
        setJob(data && !data.error ? data : null);
        // Debug log
        if (data) {
          console.log("MUST HAVES:", data.must_haves);
          console.log("NICE TO HAVES:", data.nice_to_haves);
          console.log("PERKS:", data.perks);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [jobId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgressIdx((prev) => (prev + 1) % progressStates.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setShowText(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm p-8 flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-40 h-40 flex items-center justify-center">
          <Lottie animationData={listLoadAnimation} loop={true} />
        </div>
        <div className="mt-4 text-gray-500 font-medium">Loading job details...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm p-8">
        Unable to load job details.
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
  const type = job.type || "Full-time";
  const vacancies = job.vacancies || 1;
  const deadline = job.deadline || job.application_deadline || "";
  const skills = job.skills || [];
  const responsibilities = job.responsibilities || [];
  const mustHaves = job.must_haves || [];
  const niceToHaves = job.nice_to_haves || [];
  const perks = job.perks || [];

  const remoteOptions = job.remote_options || "Not specified";
  const workType = job.work_type || "Not specified";
  const payType = job.pay_type || "Not specified";
  const payAmount = job.pay_amount || "Not specified";
  const jobSummary = job.job_summary || "";
  const verificationTier = job.verification_tier || "basic";

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
          <div className="bg-black rounded-full w-14 h-14 flex items-center justify-center text-white">
            <span className="font-bold text-sm">{company.slice(0, 8)}</span>
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
                    <BadgeAlert className="w-5 h-5 text-gray-400" />
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

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm bg-gray-200 px-4 py-1 rounded-full">
            <span className="text-blue-600 font-medium">{skills.length} Skills Matched</span>
          </div>
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
            className="gap-2 rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 px-5"
          >
            <Bookmark className="w-4 h-4" />
            <span>Save</span>
          </Button>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      <Separator />

      <div className="p-6">
        <div className="flex items-start gap-4">
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
                stroke={progressStates[progressIdx].color}
                strokeWidth="12"
                fill="none"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={
                  2 * Math.PI * 40 * (1 - progressStates[progressIdx].value / 100)
                }
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.5s, stroke 0.5s" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold">{progressStates[progressIdx].label}</span>
            </div>
          </div>
          <div className="flex-1">
            <h3
              className={clsx(
                "text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 font-semibold text-lg",
                "animate-shiny",
                { "opacity-0": !showText, "opacity-100 transition-opacity duration-500": showText }
              )}
            >
              Get a Personalized Job Match Percentage
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Job match percentage indicates how well a job aligns with your profile, skills, and resume—helping you find roles tailored to your qualifications and experience.
            </p>
            <Button variant="link" className="p-0 h-auto text-primary mt-2">
              View Details
            </Button>
            {/*<div className="mt-4 flex justify-end">
              <Button className="flex items-center gap-2 bg-yellow-100 text-yellow-600 text-xs px-3 py-1 rounded-full">
                <FaWandMagicSparkles className="w-4 h-4" />
                How can I make myself a stronger candidate?
              </Button>
            </div>*/}
          </div>
        </div>
      </div>

      <Separator />

      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Job Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{type}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{getDaysLeft(deadline)}</span>
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{vacancies} vacancies</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Recommended for you</span>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{remoteOptions}</span>
          </div>
          <div className="flex items-center gap-3">
            <Home className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{workType}</span>
          </div>
          <div className="flex items-center gap-3">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              {payAmount}
              {payAmount !== "Not specified" && payType !== "Not specified" ? " / " : ""}
              {payType !== "Not specified" ? payType : ""}
            </span>
          </div>
        </div>
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
              <Image
                src="/placeholder.svg?height=48&width=48"
                alt="Profile picture"
                width={48}
                height={48}
                className="object-cover"
              />
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
                      <BadgeAlert className="w-4 h-4 text-gray-400" />
                    </motion.span>
                  </CustomTooltip>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {job.employers?.job_title || "N/A"}
              </span>
            </div>
          </div>
          <Button variant="outline" className="rounded-full text-blue-500 border-blue-500">
            Message
          </Button>
        </div>
      </div>

      <Separator />

      <Card className="m-6">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">About the Company</h2>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
              <div className="relative w-12 h-12">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="25" r="20" fill="#FF4D8D" />
                  <circle cx="25" cy="75" r="20" fill="#4D8DFF" />
                  <circle cx="75" cy="75" r="20" fill="#8DFF4D" />
                  <path d="M50,45 L35,65 L65,65 Z" fill="#8D4DFF" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold">{company}</h3>
              <div className="text-sm font-medium">Software Development</div>
              <div className="text-xs text-muted-foreground mt-1">{location}</div>
              <div className="text-xs text-muted-foreground">Medium (200-500 employees)</div>
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
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="p-4">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mb-2">
                    <Image
                      src="/placeholder.svg?height=64&width=64"
                      alt="Employee"
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm">Employee {i}</div>
                    <div className="text-xs text-muted-foreground">Position</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="  text-blue-500 border-blue-500 w-full mt-3 rounded-full">
                  Follow
                </Button>
              </div>
            </Card>
          ))}
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
          jobId={Number(job.id)}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default JobDetails;
