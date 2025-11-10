"use client";
import { useState, forwardRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Avatar,
  Slide,
  TextField,
  Typography,
  Card,
  CardContent,
  MenuItem
} from "@mui/material";
import type { SlideProps } from "@mui/material";
import { Briefcase } from "lucide-react";
import { useSession } from "next-auth/react";

const SlideUp = forwardRef(function Transition(
  props: SlideProps,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type AddExpModalProps = {
  open: boolean;
  onClose?: () => void;
  onSave?: (data: {
    jobTitle: string;
    company: string;
    jobType: string;
    years: string;
    iconColor: string;
  }) => void;
  initial?: {
    jobTitle: string;
    company: string;
    jobType: string;
    years: string;
    iconColor: string;
  } | null;
  editMode?: boolean;
};

export default function AddExpModal({
  open,
  onClose,
  onSave,
  initial,
  editMode
}: AddExpModalProps) {
  const [jobTitle, setJobTitle] = useState(initial?.jobTitle || "");
  const [company, setCompany] = useState(initial?.company || "");
  const [jobType, setJobType] = useState(initial?.jobType || "");
  const [iconColor, setIconColor] = useState(initial?.iconColor || "#2563eb");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [yearsError, setYearsError] = useState<string | null>(null);
  const [startYear, setStartYear] = useState(() => {
    if (initial?.years) {
      const match = initial.years.match(/^(\d{4})-(\d{4})$/);
      return match ? match[1] : "";
    }
    return "";
  });
  const [endYear, setEndYear] = useState(() => {
    if (initial?.years) {
      const match = initial.years.match(/^(\d{4})-(\d{4})$/);
      return match ? match[2] : "";
    }
    return "";
  });
  const { data: session } = useSession();

  useEffect(() => {
    setJobTitle(initial?.jobTitle || "");
    setCompany(initial?.company || "");
    setJobType(initial?.jobType || "");
    setIconColor(initial?.iconColor || "#2563eb");
    setError(null);
    setYearsError(null);
    if (initial?.years) {
      const match = initial.years.match(/^(\d{4})-(\d{4})$/);
      setStartYear(match ? match[1] : "");
      setEndYear(match ? match[2] : "");
    } else {
      setStartYear("");
      setEndYear("");
    }
  }, [open, initial]);

  const handleClose = () => {
    onClose?.();
    setJobTitle("");
    setCompany("");
    setJobType("");
    setIconColor("#2563eb");
    setSaving(false);
    setError(null);
    setStartYear("");
    setEndYear("");
  };

  const handleStartYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    setStartYear(value);
    setYearsError(null);
  };

  const handleEndYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    setEndYear(value);
    setYearsError(null);
  };

  const validateYears = (start: string, end: string) => {
    if (!/^\d{4}$/.test(start) || !/^\d{4}$/.test(end)) return false;
    const s = parseInt(start, 10);
    const e = parseInt(end, 10);
    return s <= e && s > 1900 && e < 2100;
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setYearsError(null);
    if (!validateYears(startYear, endYear)) {
      setYearsError("Enter valid years");
      setSaving(false);
      return;
    }
    const yearsValue = `${startYear}-${endYear}`;
    const studentId = (session?.user as { studentId?: string })?.studentId;
    if (studentId && !editMode) {
      const res = await fetch("/api/students/student-profile/postHandlers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "experience",
          student_id: studentId,
          data: { jobTitle, company, jobType, years: yearsValue, iconColor }
        })
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result?.error || "Failed to save.");
        setSaving(false);
        return;
      }
    }
    onSave?.({ jobTitle, company, jobType, years: yearsValue, iconColor });
    handleClose();
  };

  return (
    <Dialog
      open={open}
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
              <Briefcase size={28} color="#fff" />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: 22, color: "#fff" }}>
                {editMode ? "Edit Experience" : "Add Experience"}
              </Typography>
              <Typography sx={{ color: "#dbeafe", fontSize: 15 }}>
                Enter your job title, company, and years attended
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ p: 4, pt: 3 }}>
          <Card sx={{ border: "2px solid #dbeafe", background: "linear-gradient(90deg, #f0f9ff 0%, #e0e7ff 100%)", mb: 4 }}>
            <CardContent sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  fontWeight: 600,
                  fontSize: 24,
                  bgcolor: iconColor,
                  mr: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%"
                  }}
                >
                  <Briefcase size={28} color="#fff" />
                </Box>
              </Avatar>
              <Box>
                <Typography fontWeight={600} fontSize={18} color="#1e293b">
                  {jobTitle || "Job Title"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                  {(company || "Company") + " | " + (jobType || "Job Type")}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                  {startYear && endYear ? `${startYear}-${endYear}` : "Years Attended"}
                </Typography>
              </Box>
            </CardContent>
          </Card>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
                Job Title
              </Typography>
              <TextField
                fullWidth
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                variant="outlined"
                placeholder="e.g. Software Engineer"
                sx={{
                  background: "#fff",
                  borderRadius: 2,
                  mb: 2,
                  fontSize: 15,
                  "& .MuiOutlinedInput-root": { fontSize: 15 }
                }}
                inputProps={{ maxLength: 100 }}
              />
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
                Company Name
              </Typography>
              <TextField
                fullWidth
                value={company}
                onChange={e => setCompany(e.target.value)}
                variant="outlined"
                placeholder="e.g. Google"
                sx={{
                  background: "#fff",
                  borderRadius: 2,
                  mb: 2,
                  fontSize: 15,
                  "& .MuiOutlinedInput-root": { fontSize: 15 }
                }}
                inputProps={{ maxLength: 100 }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
                Job Type
              </Typography>
              <TextField
                select
                fullWidth
                value={jobType}
                onChange={e => setJobType(e.target.value)}
                variant="outlined"
                placeholder="Select Job Type"
                sx={{
                  background: "#fff",
                  borderRadius: 2,
                  mb: 2,
                  fontSize: 15,
                  "& .MuiOutlinedInput-root": { fontSize: 15 }
                }}
              >
                <MenuItem value="">Select Job Type</MenuItem>
                <MenuItem value="Full Time">Full Time</MenuItem>
                <MenuItem value="Part Time">Part Time</MenuItem>
                <MenuItem value="Internship">Internship</MenuItem>
                <MenuItem value="Contract">Contract</MenuItem>
              </TextField>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
                Icon Color
              </Typography>
              <TextField
                select
                fullWidth
                value={iconColor}
                onChange={e => setIconColor(e.target.value)}
                variant="outlined"
                sx={{
                  background: "#fff",
                  borderRadius: 2,
                  mb: 2,
                  fontSize: 15,
                  "& .MuiOutlinedInput-root": { fontSize: 15 }
                }}
              >
                <MenuItem value="#2563eb">Blue</MenuItem>
                <MenuItem value="#22c55e">Green</MenuItem>
                <MenuItem value="#facc15">Yellow</MenuItem>
                <MenuItem value="#f59e42">Orange</MenuItem>
                <MenuItem value="#ef4444">Red</MenuItem>
                <MenuItem value="#a855f7">Purple</MenuItem>
                <MenuItem value="#64748b">Gray</MenuItem>
              </TextField>
            </Box>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
              Years Attended
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                value={startYear}
                onChange={handleStartYearChange}
                variant="outlined"
                placeholder="YYYY"
                sx={{
                  background: "#fff",
                  borderRadius: 2,
                  mb: 2,
                  fontSize: 15,
                  width: 110,
                  "& .MuiOutlinedInput-root": { fontSize: 15 }
                }}
                inputProps={{ maxLength: 4, inputMode: "numeric", pattern: "\\d{4}" }}
                error={!!yearsError}
              />
              <Typography sx={{ mb: 2, fontWeight: 600, fontSize: 18, color: "#64748b" }}>-</Typography>
              <TextField
                value={endYear}
                onChange={handleEndYearChange}
                variant="outlined"
                placeholder="YYYY"
                sx={{
                  background: "#fff",
                  borderRadius: 2,
                  mb: 2,
                  fontSize: 15,
                  width: 110,
                  "& .MuiOutlinedInput-root": { fontSize: 15 }
                }}
                inputProps={{ maxLength: 4, inputMode: "numeric", pattern: "\\d{4}" }}
                error={!!yearsError}
              />
              {yearsError && (
                <Typography sx={{ color: "#ef4444", fontWeight: 500, fontSize: 13, ml: 2, mb: 2, whiteSpace: "nowrap" }}>
                  {yearsError}
                </Typography>
              )}
            </Box>
          </Box>
          {error && (
            <Typography sx={{ color: "#ef4444", mb: 2, fontWeight: 500, fontSize: 15, textAlign: "center" }}>
              {error}
            </Typography>
          )}
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
              onClick={handleSave}
              disabled={!jobTitle || !company || !jobType || !startYear || !endYear || saving}
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
              {editMode ? "Update" : "Save"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
