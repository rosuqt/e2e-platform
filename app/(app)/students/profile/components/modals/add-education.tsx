"use client";
import { useState, forwardRef } from "react";
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
  MenuItem,
  ListSubheader
} from "@mui/material";
import type { SlideProps } from "@mui/material";
import { GraduationCap } from "lucide-react";
import { useSession } from "next-auth/react";

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
    level: string;
    iconColor?: string;
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
  const [level, setLevel] = useState(""); 
  const [iconColor, setIconColor] = useState("#2563eb");
  const [saving, setSaving] = useState(false);
  const { data: session } = useSession();

  const handleClose = () => {
    onClose?.();
    setSchool("");
    setAcronym("");
    setDegree("");
    setYears("");
    setLevel("");
    setIconColor("#2563eb");
    setSaving(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const studentId = (session?.user as { studentId?: string })?.studentId;
    if (studentId) {
      await fetch("/api/students/student-profile/postHandlers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "education",
          student_id: studentId,
          data: { school, acronym, degree, years, level, iconColor }
        })
      });
    }
    onSave?.({ school, acronym, degree, years, level, iconColor });
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
                  {acronym
                    ? <span style={{ color: "#fff", width: "100%", textAlign: "center" }}>{acronym}</span>
                    : <GraduationCap size={28} color="#fff" />}
                </Box>
              </Avatar>
              <Box>
                <Typography fontWeight={600} fontSize={18} color="#1e293b">
                  {school || "School Name"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                  {(level || "Level") + " | " + (degree && degree !== "None" ? degree : "Strand/Degree")}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                  {years || "Years Attended"}
                </Typography>
              </Box>
            </CardContent>
          </Card>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
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
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
                Level
              </Typography>
              <TextField
                select
                fullWidth
                value={level}
                onChange={e => setLevel(e.target.value)}
                variant="outlined"
                placeholder="Select Level"
                SelectProps={{ native: true }}
                sx={{
                  background: "#fff",
                  borderRadius: 2,
                  mb: 2,
                  fontSize: 15,
                  "& .MuiOutlinedInput-root": { fontSize: 15 }
                }}
              >
                <option value="">Select Level</option>
                <option value="College">College</option>
                <option value="Senior High">Senior High</option>
                <option value="Junior High">Junior High</option>
              </TextField>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
                Strand/Degree
              </Typography>
              <TextField
                select
                fullWidth
                value={degree}
                onChange={e => setDegree(e.target.value)}
                variant="outlined"
                placeholder="Select Strand/Degree"
                SelectProps={{
                  native: false,
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        overflowY: "auto"
                      }
                    }
                  }
                }}
                sx={{
                  background: "#fff",
                  borderRadius: 2,
                  mb: 2,
                  fontSize: 15,
                  "& .MuiOutlinedInput-root": { fontSize: 15 }
                }}
              >
                <MenuItem value="" disabled>
                  Select Strand/Degree
                </MenuItem>
                <MenuItem value="None">None</MenuItem>
                <ListSubheader>College Courses</ListSubheader>
                <MenuItem value="BS - Information Technology">BS - Information Technology</MenuItem>
                <MenuItem value="BS - Computer Science">BS - Computer Science</MenuItem>
                <MenuItem value="BS - Business Administration">BS - Business Administration</MenuItem>
                <MenuItem value="BS - Accountancy">BS - Accountancy</MenuItem>
                <MenuItem value="BS - Hospitality Management">BS - Hospitality Management</MenuItem>
                <MenuItem value="BS - Tourism Management">BS - Tourism Management</MenuItem>
                <MenuItem value="BS - Engineering">BS - Engineering</MenuItem>
                <MenuItem value="BA - Communication">BA - Communication</MenuItem>
                <ListSubheader>SHS Strands</ListSubheader>
                <MenuItem value="STEM">STEM</MenuItem>
                <MenuItem value="ABM">ABM</MenuItem>
                <MenuItem value="HUMSS">HUMSS</MenuItem>
                <MenuItem value="GAS">GAS</MenuItem>
                <MenuItem value="TVL">TVL</MenuItem>
                <MenuItem value="ICT">ICT</MenuItem>
                <MenuItem value="Sports">Sports</MenuItem>
                <MenuItem value="Arts and Design">Arts and Design</MenuItem>
              </TextField>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
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
            </Box>
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
              disabled={!school || !years || !level || saving}
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
