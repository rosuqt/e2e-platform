"use client";
import { useState, forwardRef } from "react";
import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Avatar,
  Slide,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Typography,
  Card,
  CardContent
} from "@mui/material";
import type { SlideProps } from "@mui/material";
import { Mail, Star, Briefcase, GraduationCap, Sparkles, Send } from "lucide-react";
import { Confetti } from "@/components/magicui/confetti";

type Candidate = {
  name: string;
  matchScore?: number;
  program?: string;
  yearSection?: string;
  avatar?: string;
  skills?: string[];
};

type Job = {
  title: string;
  matchScore: number;
  department?: string;
};

type InvitationModalProps = {
  open: boolean;
  onClose?: () => void;
  onSend?: (message: string, jobTitle: string) => void;
  candidate: Candidate;
  jobTitles?: string[];
  jobMatchScores?: Record<string, number>;
  jobs?: Job[];
};

const SlideUp = forwardRef(function Transition(
  props: SlideProps,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const JOB_TITLES = [
  "Frontend Developer",
  "Backend Developer",
  "UI/UX Designer",
  "QA Tester",
  "Project Intern"
];

export default function InvitationModal({
  open,
  onClose,
  onSend,
  candidate,
  jobTitles,
  jobMatchScores,
  jobs
}: InvitationModalProps) {
  const jobsList: Job[] =
    jobs && jobs.length > 0
      ? jobs
      : (jobTitles || JOB_TITLES).map((title) => ({
          title,
          matchScore:
            jobMatchScores && jobMatchScores[title] !== undefined
              ? jobMatchScores[title]
              : candidate.matchScore ?? 0,
          department: ""
        }));

  const [selectedJob, setSelectedJob] = useState<string>(jobsList[0]?.title || "");
  const [message, setMessage] = useState(
    `Hi ${candidate?.name},\n\nWe're excited to invite you to apply for this position! Your profile caught our attention, and we believe you'd be a fantastic addition to our team.\n\nWe'd love to discuss this opportunity with you further.\n\nBest regards,\nThe Hiring Team`
  );
  const [sent, setSent] = useState(false);

  const selectedJobData = jobsList.find((job) => job.title === selectedJob);

  const handleSend = () => {
    setSent(true);
    onSend?.(message, selectedJob);
    setMessage(
      `Hi ${candidate?.name},\n\nWe're excited to invite you to apply for this position! Your profile caught our attention, and we believe you'd be a fantastic addition to our team.\n\nWe'd love to discuss this opportunity with you further.\n\nBest regards,\nThe Hiring Team`
    );
  };

  const handleClose = () => {
    onClose?.();
    setMessage(
      `Hi ${candidate?.name},\n\nWe're excited to invite you to apply for this position! Your profile caught our attention, and we believe you'd be a fantastic addition to our team.\n\nWe'd love to discuss this opportunity with you further.\n\nBest regards,\nThe Hiring Team`
    );
    setSent(false);
  };

  const handleViewInvited = () => {
    window.location.href = "/employers/jobs/invited-candidates";
  };

  if (sent) {
    return (
      <Dialog
        open={true}
        onClose={handleClose}
        TransitionComponent={SlideUp}
        PaperProps={{
          sx: {
            p: 0,
            minWidth: 500,
            maxWidth: 600,
            boxShadow: 8,
            background: "#fff",
            borderRadius: 3,
            overflow: "hidden"
          }
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)",
            p: 4,
            display: "flex",
            alignItems: "center",
            gap: 2,
            position: "relative"
          }}
        >
          <Button
            onClick={handleClose}
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
          <Box
            sx={{
              p: 1.5,
              background: "rgba(255,255,255,0.18)",
              borderRadius: 2,
              display: "flex",
              alignItems: "center"
            }}
          >
            <Mail size={28} color="#fff" />
          </Box>
          <Box>
            <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: 22, p: 0 }}>
              Invitation Sent!
            </Typography>
            <Typography sx={{ color: "#dbeafe", fontSize: 15 }}>
              You’ve invited <b>{candidate?.name}</b> to apply for your job
            </Typography>
          </Box>
        </Box>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 5,
            minHeight: 220,
            position: "relative",
            background: "linear-gradient(90deg, #f0f9ff 0%, #f3e8ff 100%)"
          }}
        >
          <Confetti
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              pointerEvents: "none",
              zIndex: 1400
            }}
            options={{
              particleCount: 120,
              spread: 360,
              ticks: 70,
              gravity: 0,
              decay: 0.94,
              startVelocity: 40,
              colors: ["#FFE400", "#FFBD00", "#E89400", "#FFCA6C", "#FDFFB8"],
              shapes: ["star"]
            }}
          />
          <Card
            sx={{
              border: "2px solid #dbeafe",
              background: "linear-gradient(90deg, #f0f9ff 0%, #f3e8ff 100%)",
              boxShadow: "none",
              borderRadius: 3,
              mb: 2,
              width: "100%",
              maxWidth: 380
            }}
          >
            <CardContent sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  fontWeight: 600,
                  fontSize: 24,
                  bgcolor: "#2563eb",
                  mr: 2
                }}
                src={candidate.avatar}
              >
                {candidate?.name?.[0] || "?"}
              </Avatar>
              <Box>
                <Typography fontWeight={600} fontSize={18} color="#1e293b">
                  {candidate?.name}
                </Typography>
                {candidate.program && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                    <GraduationCap size={16} style={{ marginRight: 4, color: "#64748b" }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                      {candidate.program}
                    </Typography>
                  </Box>
                )}
                {candidate.yearSection && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                    {candidate.yearSection}
                  </Typography>
                )}
                {candidate.skills && candidate.skills.length > 0 && (
                  <Box sx={{ display: "flex", gap: 0.5, mt: 1, flexWrap: "wrap" }}>
                    {candidate.skills.slice(0, 3).map((skill, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          px: 1,
                          py: 0.2,
                          bgcolor: "#e0e7ff",
                          color: "#3730a3",
                          borderRadius: 1,
                          fontSize: 12,
                          fontWeight: 500,
                          mr: 0.5
                        }}
                      >
                        {skill}
                      </Box>
                    ))}
                    {candidate.skills.length > 3 && (
                      <Box
                        sx={{
                          px: 1,
                          py: 0.2,
                          bgcolor: "#f1f5f9",
                          color: "#334155",
                          borderRadius: 1,
                          fontSize: 12,
                          fontWeight: 500
                        }}
                      >
                        +{candidate.skills.length - 3} more
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
          {selectedJobData && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1,
                bgcolor: "#dcfce7",
                border: "1px solid #bbf7d0",
                borderRadius: 2,
                mb: 2
              }}
            >
              <Sparkles size={18} style={{ color: "#16a34a" }} />
              <Typography sx={{ fontSize: 14, color: "#166534" }}>
                <b>{selectedJobData.matchScore}% match</b> - Great compatibility!
              </Typography>
            </Box>
          )}
          <Typography sx={{ fontSize: 16, color: "#334155", textAlign: "center", mt: 1 }}>
            Your invitation has been sent successfully.
          </Typography>
        </DialogContent>
        <Box sx={{ px: 3, pb: 3, pt: 0, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              color: "#2563eb",
              borderColor: "#2563eb",
              fontWeight: 500,
              fontSize: 16,
              background: "#fff",
              "&:hover": { borderColor: "#1e40af", background: "#f1f5f9" }
            }}
          >
            Close
          </Button>
          <Button
            onClick={handleViewInvited}
            variant="contained"
            sx={{
              background: "#2563eb",
              color: "#fff",
              fontWeight: 500,
              fontSize: 16,
              px: 3,
              "&:hover": { background: "#1e40af" }
            }}
          >
            View Invited Candidates
          </Button>
        </Box>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={SlideUp}
      PaperProps={{
        sx: {
          p: 0,
          minWidth: 700,
          maxWidth: 900,
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
            onClick={handleClose}
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
            <Box
              sx={{
                p: 1.5,
                background: "rgba(255,255,255,0.18)",
                borderRadius: 2,
                display: "flex",
                alignItems: "center"
              }}
            >
              <Mail size={28} color="#fff" />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: 22, color: "#fff" }}>
                Send Job Invitation
              </Typography>
              <Typography sx={{ color: "#dbeafe", fontSize: 15 }}>
                Invite a talented candidate to join your team
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ p: 4, pt: 3 }}>
          <Card sx={{ border: "2px solid #dbeafe", background: "linear-gradient(90deg, #f0f9ff 0%, #e0e7ff 100%)", mb: 4 }}>
            <CardContent sx={{ p: 3, display: "flex", alignItems: "flex-start", gap: 2 }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  fontWeight: 600,
                  fontSize: 24,
                  bgcolor: "#2563eb",
                  mr: 2
                }}
                src={candidate.avatar}
              >
                {candidate?.name?.[0] || "?"}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={600} fontSize={18} color="#1e293b">
                  {candidate?.name}
                </Typography>
                {candidate.program && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                    <GraduationCap size={16} style={{ marginRight: 4, color: "#64748b" }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                      {candidate.program}
                    </Typography>
                  </Box>
                )}
                {candidate.yearSection && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                    {candidate.yearSection}
                  </Typography>
                )}
                {candidate.skills && candidate.skills.length > 0 && (
                  <Box sx={{ display: "flex", gap: 0.5, mt: 1, flexWrap: "wrap" }}>
                    {candidate.skills.slice(0, 3).map((skill, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          px: 1,
                          py: 0.2,
                          bgcolor: "#e0e7ff",
                          color: "#3730a3",
                          borderRadius: 1,
                          fontSize: 12,
                          fontWeight: 500,
                          mr: 0.5
                        }}
                      >
                        {skill}
                      </Box>
                    ))}
                    {candidate.skills.length > 3 && (
                      <Box
                        sx={{
                          px: 1,
                          py: 0.2,
                          bgcolor: "#f1f5f9",
                          color: "#334155",
                          borderRadius: 1,
                          fontSize: 12,
                          fontWeight: 500
                        }}
                      >
                        +{candidate.skills.length - 3} more
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb", display: "flex", alignItems: "center", gap: 1 }}>
              <Briefcase size={16} style={{ marginRight: 4 }} />
              Select Position
            </Typography>
            <FormControl fullWidth>
              <Select
                value={selectedJob}
                onChange={e => setSelectedJob(e.target.value as string)}
                sx={{
                  background: "#fff",
                  borderRadius: 2,
                  mb: 1,
                  fontSize: 15,
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#2563eb44" }
                }}
              >
                {jobsList.map((job) => (
                  <MenuItem key={job.title} value={job.title} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography sx={{ fontWeight: 500 }}>{job.title}</Typography>
                      {job.department && (
                        <Typography sx={{ fontSize: 12, color: "#64748b" }}>{job.department}</Typography>
                      )}
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: 2 }}>
                      <Star size={14} style={{ color: "#facc15", marginRight: 2 }} />
                      <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#16a34a" }}>
                        {job.matchScore}%
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedJobData && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 1,
                  bgcolor: "#dcfce7",
                  border: "1px solid #bbf7d0",
                  borderRadius: 2,
                  mt: 1
                }}
              >
                <Sparkles size={18} style={{ color: "#16a34a" }} />
                <Typography sx={{ fontSize: 14, color: "#166534" }}>
                  <b>{selectedJobData.matchScore}% match</b> - Great compatibility!
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
              Personal Message
            </Typography>
            <TextField
              multiline
              minRows={4}
              fullWidth
              value={message}
              onChange={e => setMessage(e.target.value)}
              variant="outlined"
              sx={{
                background: "#fff",
                borderRadius: 2,
                mb: 1,
                fontSize: 15,
                "& .MuiOutlinedInput-root": { fontSize: 15 }
              }}
              inputProps={{ maxLength: 500 }}
            />
            <Typography sx={{ fontSize: 12, color: "#64748b", textAlign: "right" }}>
              {message.length}/500 characters
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, pt: 2 }}>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{
                flex: 1,
                color: "#2563eb",
                borderColor: "#2563eb",
                fontWeight: 500,
                fontSize: 15,
                background: "#fff",
                "&:hover": { borderColor: "#1e40af", background: "#f1f5f9" }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={!selectedJob}
              sx={{
                flex: 1,
                background: "#2563eb",
                color: "#fff",
                fontWeight: 500,
                fontSize: 16,
                px: 3,
                boxShadow: "none",
                letterSpacing: 1,
                "&:hover": { background: "#1e40af" }
              }}
            >
              <Send size={18} style={{ marginRight: 8 }} />
              Send Invitation
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
