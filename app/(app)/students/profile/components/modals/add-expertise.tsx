"use client";
import { useState, forwardRef } from "react";
import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Slide,
  TextField,
  Typography,
  Slider,
  MenuItem,
} from "@mui/material";
import type { SlideProps } from "@mui/material";
import { Star } from "lucide-react";
import ExpertiseScore from "./expertise-score";
import { expertiseSuggestions } from "../data/expertise-suggestions";
import { useSession } from "next-auth/react";

type ExpertiseCategory = keyof typeof expertiseSuggestions;

const categories = Object.keys(expertiseSuggestions) as ExpertiseCategory[];

const masteryLevels = [
  { label: "Beginner", value: 20 },
  { label: "Intermediate", value: 50 },
  { label: "Advanced", value: 80 },
  { label: "Expert", value: 100 }
];

const SlideUp = forwardRef(function Transition(
  props: SlideProps,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type AddExpertiseModalProps = {
  open: boolean;
  onClose?: () => void;
  onSave?: (data: {
    skill: string;
    mastery: number;
  }) => void;
};

export default function AddExpertiseModal({
  open,
  onClose,
  onSave
}: AddExpertiseModalProps) {
  const [skill, setSkill] = useState("");
  const [mastery, setMastery] = useState(50);
  const [saving, setSaving] = useState(false);
  const [showGauge, setShowGauge] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [focusedSuggestion, setFocusedSuggestion] = useState<number>(-1);
  const { data: session } = useSession();

  const filteredSuggestions = skillInput
    ? categories
        .map(category => ({
          category,
          skills: expertiseSuggestions[category].filter(
            skill =>
              skill.toLowerCase().includes(skillInput.toLowerCase())
          )
        }))
        .filter(group => group.skills.length > 0)
    : categories.map(category => ({
        category,
        skills: expertiseSuggestions[category]
      }));

  const flatSuggestions = filteredSuggestions.flatMap(group =>
    group.skills.map(skill => ({
      skill,
      category: group.category
    }))
  );

  const handleSkillInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkillInput(e.target.value);
    setFocusedSuggestion(-1);
    // update skll if user selects from sggstions or preses enter
    // setSkill(e.target.value);
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (flatSuggestions.length > 0 && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      setFocusedSuggestion(prev =>
        e.key === "ArrowDown"
          ? Math.min(prev + 1, flatSuggestions.length - 1)
          : Math.max(prev - 1, 0)
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (focusedSuggestion >= 0 && flatSuggestions[focusedSuggestion]) {
        setSkill(flatSuggestions[focusedSuggestion].skill);
        setSkillInput(flatSuggestions[focusedSuggestion].skill);
        setShowSkillInput(false);
      } else {
        setSkill(skillInput);
        setShowSkillInput(false);
      }
    } else if (e.key === "Escape") {
      setShowSkillInput(false);
      setSkillInput("");
      setFocusedSuggestion(-1);
    }
  };

  const handleSkillBlur = () => {
    setTimeout(() => {
      setShowSkillInput(false);
      setFocusedSuggestion(-1);
    }, 100);
  };

  const handleClose = () => {
    onClose?.();
    setSkill("");
    setSkillInput("");
    setMastery(50);
    setSaving(false);
    setShowGauge(false);
    setShowSkillInput(false);
    setFocusedSuggestion(-1);
  };

  const handleSave = async () => {
    setSaving(true);
    const studentId = (session?.user as { studentId?: string })?.studentId;
    if (studentId) {
      await fetch("/api/students/student-profile/modal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "expertise",
          student_id: studentId,
          data: { skill, mastery }
        })
      });
    }
    onSave?.({ skill, mastery });
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
              <Star size={28} color="#fff" />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: 22, color: "#fff" }}>
                Add Expertise
              </Typography>
              <Typography sx={{ color: "#dbeafe", fontSize: 15 }}>
                Enter your skill and mastery level
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ p: 4, pt: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
              Expertise Name
            </Typography>
            <Box sx={{ position: "relative" }}>
              <TextField
                fullWidth
                value={showSkillInput ? skillInput : skill}
                onChange={handleSkillInput}
                onFocus={() => setShowSkillInput(true)}
                onBlur={handleSkillBlur}
                onKeyDown={handleSkillKeyDown}
                variant="outlined"
                placeholder="e.g. JavaScript"
                select={false}
                sx={{
                  background: "#fff",
                  borderRadius: 2,
                  mb: 2,
                  fontSize: 15,
                  "& .MuiOutlinedInput-root": { fontSize: 15 }
                }}
                inputProps={{ maxLength: 50 }}
                autoComplete="off"
              />
              {showSkillInput && (
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: 48,
                    width: "100%",
                    bgcolor: "#fff",
                    border: "1px solid #bfdbfe",
                    borderRadius: 2,
                    boxShadow: 3,
                    zIndex: 10,
                    maxHeight: 260,
                    overflowY: "auto"
                  }}
                >
                  {filteredSuggestions.map((group, groupIdx) => (
                    <Box key={group.category}>
                      <Box sx={{
                        px: 2,
                        py: 1,
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#2563eb",
                        bgcolor: "#f0f9ff",
                        borderBottom: "1px solid #e0e7ef",
                        position: "sticky",
                        top: 0,
                        zIndex: 1
                      }}>
                        {group.category}
                      </Box>
                      {group.skills.map((s: string, idx: number) => {
                        const flatIdx =
                          filteredSuggestions
                            .slice(0, groupIdx)
                            .reduce((acc, g) => acc + g.skills.length, 0) + idx;
                        return (
                          <Box
                            key={s}
                            sx={{
                              px: 2,
                              py: 1.5,
                              cursor: "pointer",
                              bgcolor: flatIdx === focusedSuggestion ? "#dbeafe" : "#fff",
                              fontSize: 15,
                              "&:hover": { bgcolor: "#dbeafe" }
                            }}
                            onMouseDown={() => {
                              setSkill(s);
                              setSkillInput(s);
                              setShowSkillInput(false);
                            }}
                            onMouseEnter={() => setFocusedSuggestion(flatIdx)}
                          >
                            {s}
                          </Box>
                        );
                      })}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb", display: "flex", alignItems: "center", gap: 1 }}>
              Mastery Level
              <span style={{ color: "#2563eb", fontWeight: 600, marginLeft: 8, fontSize: 15 }}>
                {mastery}%
              </span>
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ width: "100%", mr: 2 }}>
                <Slider
                  value={mastery}
                  onChange={(_, v) => setMastery(typeof v === "number" ? v : v[0])}
                  min={0}
                  max={100}
                  step={1}
                  sx={{ width: "100%" }}
                  marks={[
                    { value: 20, label: "" },
                    { value: 50, label: "" },
                    { value: 80, label: "" },
                    { value: 100, label: "" }
                  ]}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: "-8px", px: "2px" }}>
                  <Typography sx={{ fontSize: 13, color: "#2563eb", fontWeight: 500 }}>Beginner</Typography>
                  <Typography sx={{ fontSize: 13, color: "#2563eb", fontWeight: 500 }}>Intermediate</Typography>
                  <Typography sx={{ fontSize: 13, color: "#2563eb", fontWeight: 500 }}>Advanced</Typography>
                  <Typography sx={{ fontSize: 13, color: "#2563eb", fontWeight: 500 }}>Expert</Typography>
                </Box>
              </Box>
              <TextField
                select
                value={mastery}
                onChange={e => setMastery(Number(e.target.value))}
                variant="outlined"
                placeholder="Select level"
                sx={{
                  width: 140,
                  background: "#fff",
                  borderRadius: 2,
                  fontSize: 15,
                  "& .MuiOutlinedInput-root": { fontSize: 15 }
                }}
              >
                <MenuItem value="" disabled>
                  Select level
                </MenuItem>
                {masteryLevels.map(l => (
                  <MenuItem value={l.value} key={l.value}>{l.label}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 1 }}>
              <Button
                variant="text"
                sx={{
                  color: "#2563eb",
                  fontWeight: 500,
                  textTransform: "none",
                  fontSize: 15,
                  px: 1,
                  minWidth: 0
                }}
                onClick={() => setShowGauge(true)}
              >
                Unsure? Click here.
              </Button>
            </Box>
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
              disabled={!skill || saving}
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
        {showGauge && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bgcolor: "rgba(255,255,255,0.98)",
              zIndex: 10,
              borderRadius: 3,
              overflow: "auto"
            }}
          >
            <ExpertiseScore
              open={showGauge}
              onClose={() => setShowGauge(false)}
              onApply={level => {
                setMastery(level);
                setShowGauge(false);
              }}
              category={
                flatSuggestions.find(s => s.skill === (showSkillInput ? skillInput : skill))?.category ||
                categories.find(cat =>
                  expertiseSuggestions[cat].some(sugg => sugg === (showSkillInput ? skillInput : skill))
                ) ||
                undefined
              }
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
