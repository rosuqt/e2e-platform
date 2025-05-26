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
  TextField,
  Typography,
  Card,
  CardContent
} from "@mui/material";
import type { SlideProps } from "@mui/material";
import { GraduationCap } from "lucide-react";

const SlideUp = forwardRef(function Transition(
  props: SlideProps,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type AddEducationalModalProps = {
  open: boolean;
  onClose?: () => void;
  onSave?: (data: {
    school: string;
    acronym?: string;
    degree: string;
    years: string;
  }) => void;
};

export default function AddEducationalModal({
  open,
  onClose,
  onSave
}: AddEducationalModalProps) {
  const [school, setSchool] = useState("");
  const [acronym, setAcronym] = useState("");
  const [degree, setDegree] = useState("");
  const [years, setYears] = useState("");
  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    onClose?.();
    setSchool("");
    setAcronym("");
    setDegree("");
    setYears("");
    setSaving(false);
  };

  const handleSave = () => {
    setSaving(true);
    onSave?.({ school, acronym, degree, years });
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
              <GraduationCap size={28} color="#fff" />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: 22, color: "#fff" }}>
                Add Education Background
              </Typography>
              <Typography sx={{ color: "#dbeafe", fontSize: 15 }}>
                Enter your school, degree, and years attended
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
                  bgcolor: "#2563eb",
                  mr: 2
                }}
              >
                <GraduationCap size={24} style={{ marginRight: 6, color: "#fff" }} />
                {acronym ? (
                  <span style={{ marginLeft: 4 }}>{acronym}</span>
                ) : (
                  <span style={{ marginLeft: 4 }}>?</span>
                )}
              </Avatar>
              <Box>
                <Typography fontWeight={600} fontSize={18} color="#1e293b">
                  {school || "School Name"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                  {degree || "Degree"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                  {years || "Years Attended"}
                </Typography>
              </Box>
            </CardContent>
          </Card>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
              School Name
            </Typography>
            <TextField
              fullWidth
              value={school}
              onChange={e => setSchool(e.target.value)}
              variant="outlined"
              placeholder="e.g. STI College"
              sx={{
                background: "#fff",
                borderRadius: 2,
                mb: 2,
                fontSize: 15,
                "& .MuiOutlinedInput-root": { fontSize: 15 }
              }}
              inputProps={{ maxLength: 100 }}
            />
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
              Acronym (optional)
            </Typography>
            <TextField
              fullWidth
              value={acronym}
              onChange={e => setAcronym(e.target.value)}
              variant="outlined"
              placeholder="e.g. STI"
              sx={{
                background: "#fff",
                borderRadius: 2,
                mb: 2,
                fontSize: 15,
                "& .MuiOutlinedInput-root": { fontSize: 15 }
              }}
              inputProps={{ maxLength: 10 }}
            />
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
              Degree
            </Typography>
            <TextField
              fullWidth
              value={degree}
              onChange={e => setDegree(e.target.value)}
              variant="outlined"
              placeholder="e.g. Bachelor of Science - Information Technology"
              sx={{
                background: "#fff",
                borderRadius: 2,
                mb: 2,
                fontSize: 15,
                "& .MuiOutlinedInput-root": { fontSize: 15 }
              }}
              inputProps={{ maxLength: 100 }}
            />
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
              Years Attended
            </Typography>
            <TextField
              fullWidth
              value={years}
              onChange={e => setYears(e.target.value)}
              variant="outlined"
              placeholder="e.g. 2019 - Present"
              sx={{
                background: "#fff",
                borderRadius: 2,
                mb: 2,
                fontSize: 15,
                "& .MuiOutlinedInput-root": { fontSize: 15 }
              }}
              inputProps={{ maxLength: 30 }}
            />
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
              onClick={handleSave}
              disabled={!school || !degree || !years || saving}
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
              Save
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
