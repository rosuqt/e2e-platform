/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { forwardRef } from "react";
import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Typography,
  Slide,
  Avatar,
} from "@mui/material";
import type { SlideProps } from "@mui/material";
import { Briefcase, Calendar, Users, Clock, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const SlideUp = forwardRef(function Transition(
  props: SlideProps,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type QuickViewModalProps = {
  open: boolean;
  onClose: () => void;
  job: {
    job_id?: string;
    title: string;
    company: string;
    location: string;
    salary?: string;
    posted?: string;
    logoUrl?: string;
    type?: string;
    vacancies?: number;
    companyLocation?: string;
    description?: string;
    closingDate?: string;
    applicants?: number;
    remote_options?: string;
    work_type?: string;
    recommended_course?: string;
    job_description?: string;
    job_summary?: string;
    must_have_qualifications?: string[];
    nice_to_have_qualifications?: string[];
    application_deadline?: string;
    max_applicants?: number;
    perks_and_benefits?: string[];
    verification_tier?: string;
    created_at?: string;
    responsibilities?: string;
    paused?: boolean;
    tags?: Record<string, any>;
    ai_skills?: string[];
    is_archived?: boolean;
    remote?: boolean;
    matchScore?: number;
  };
};



export default function QuickViewModal({
  open,
  onClose,
  job
}: QuickViewModalProps) {
  const router = useRouter();

  const handleViewFull = () => {
    if (job && job.job_id) {
      router.push(`/students/jobs/job-listings?jobId=${job.job_id}`);
    } else {
      router.push("/students/jobs/job-listings");
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={SlideUp}
      PaperProps={{
        sx: {
          p: 0,
          minWidth: 400,
          maxWidth: 540,
          boxShadow: 8,
          background: "#fff",
          borderRadius: 3,
          overflow: "hidden"
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box
          sx={{
            background: "linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)",
            p: 4,
            color: "#fff",
            position: "relative"
          }}
        >
          <Button
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              minWidth: 0,
              width: 36,
              height: 36,
              borderRadius: "50%",
              color: "#fff",
              background: "rgba(30, 41, 59, 0.18)",
              zIndex: 2,
              "&:hover": { background: "rgba(30,41,59,0.28)" }
            }}
          >
            <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
              <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </Button>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src={job.logoUrl || ""}
              sx={{
                width: 56,
                height: 56,
                fontWeight: 600,
                fontSize: 24,
                bgcolor: "#2563eb",
                mr: 2
              }}
            >
              {job.company?.[0] || ""}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: 22, color: "#fff" }}>
                {job.title}
              </Typography>
              <Typography sx={{ color: "#dbeafe", fontSize: 15 }}>
                {job.company}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            {/* removed Match Score pill */}
          </Box>
        </Box>
        <Box sx={{ p: 4, pt: 3 }}>
          {/* Job Match Section */}
          {typeof job.matchScore === "number" && (
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3, mb: 3 }}>
              <Box sx={{ position: "relative", width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width={64} height={64} viewBox="0 0 64 64">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke={job.matchScore < 40 ? "#dc2626" : job.matchScore < 60 ? "#facc15" : "#22c55e"}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 28}
                    strokeDashoffset={2 * Math.PI * 28 * (1 - job.matchScore / 100)}
                    strokeLinecap="round"
                    transform="rotate(-90 32 32)"
                  />
                </svg>
                <Typography
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 64,
                    height: 64,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 20,
                    color: job.matchScore < 40 ? "#dc2626" : job.matchScore < 60 ? "#f59e42" : "#22c55e"
                  }}
                >
                  {job.matchScore}%
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: job.matchScore < 40 ? "#dc2626" : job.matchScore < 60 ? "#f59e42" : "#22c55e",
                    fontSize: 16
                  }}
                >
                  {job.matchScore < 40
                    ? "This Job Isn't a Strong Match"
                    : job.matchScore < 60
                    ? "This Job is a Moderate Match"
                    : "This Job is a Strong Match"}
                </Typography>
                <Typography sx={{ fontSize: 13, color: "#64748b", mt: 0.5 }}>
                  {job.matchScore < 40
                    ? "We've checked your resume and selected skills, and unfortunately, this job isn't the best match for your profile. You can still apply, but the job may be seeking candidates with different qualifications."
                    : job.matchScore < 60
                    ? "You meet some of the requirements for this job. Consider applying if you're interested and highlight your relevant skills."
                    : "You are a great fit for this job based on your profile and skills!"}
                </Typography>
              </Box>
            </Box>
          )}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
              mb: 2,
              alignItems: "start"
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Briefcase size={18} color="#2563eb" />
              <Typography fontSize={15} color="#334155">
                {job.work_type || job.type || "Job Type"}
              </Typography>
            </Box>
            {/* Removed pay/salary UI */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Calendar size={18} color="#2563eb" />
              <Typography fontSize={15} color="#334155">
                {job.created_at
                  ? `Posted ${new Date(job.created_at).toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}`
                  : job.posted
                  ? `Posted ${new Date(job.posted).toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}`
                  : ""}
              </Typography>
            </Box>
            {job.application_deadline && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Clock size={18} color="#2563eb" />
                <Typography fontSize={15} color="#334155">
                  Closes at {new Date(job.application_deadline).toLocaleString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </Typography>
              </Box>
            )}
            {typeof job.max_applicants === "number" && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Users size={18} color="#2563eb" />
                <Typography fontSize={15} color="#334155">
                  {job.max_applicants} vacancies
                </Typography>
              </Box>
            )}
            {(job.remote_options || typeof job.remote === "boolean") && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CheckCircle size={18} color="#2563eb" />
                <Typography fontSize={15} color="#334155">
                  {job.remote_options
                    ? job.remote_options
                    : job.remote
                    ? "Remote Option Available"
                    : "On-site"}
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography fontWeight={600} fontSize={16} color="#2563eb" mb={0.5}>
              Job Description
            </Typography>
            <Typography fontSize={15} color="#64748b">
              {job.job_description ||
                job.description ||
                job.job_summary ||
                "No job description provided."}
            </Typography>
          </Box>
          {Array.isArray(job.must_have_qualifications) && job.must_have_qualifications.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography fontWeight={600} fontSize={15} color="#2563eb" mb={0.5}>
                Must-have Qualifications
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {job.must_have_qualifications.map((q, i) => (
                  <li key={i} style={{ color: "#64748b", fontSize: 14 }}>{q}</li>
                ))}
              </ul>
            </Box>
          )}
          {Array.isArray(job.nice_to_have_qualifications) && job.nice_to_have_qualifications.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography fontWeight={600} fontSize={15} color="#2563eb" mb={0.5}>
                Nice-to-have Qualifications
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {job.nice_to_have_qualifications.map((q, i) => (
                  <li key={i} style={{ color: "#64748b", fontSize: 14 }}>{q}</li>
                ))}
              </ul>
            </Box>
          )}
          {Array.isArray(job.perks_and_benefits) && job.perks_and_benefits.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography fontWeight={600} fontSize={15} color="#2563eb" mb={0.5}>
                Perks & Benefits
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {job.perks_and_benefits.map((p, i) => (
                  <li key={i} style={{ color: "#64748b", fontSize: 14 }}>{p}</li>
                ))}
              </ul>
            </Box>
          )}
          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              background: "#2563eb",
              color: "#fff",
              fontWeight: 600,
              borderRadius: 2,
              fontSize: 16,
              "&:hover": { background: "#1e40af" }
            }}
            onClick={handleViewFull}
          >
            View Full Job Listing
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
