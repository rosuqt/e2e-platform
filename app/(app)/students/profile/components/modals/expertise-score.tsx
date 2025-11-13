import { useState, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  Slider
} from "@mui/material";
import { Brain } from "lucide-react";

const frequencyOptions = [
  "Daily",
  "Weekly",
  "Occasionally",
  "Rarely",
  "Just started learning"
];

const confidenceMarks = [
  { value: 0, label: "Not confident" },
  { value: 25, label: "" },
  { value: 50, label: "Somewhat" },
  { value: 75, label: "" },
  { value: 100, label: "Very confident" }
];

const yearsOptions = [
  { label: "0", value: 0 },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3–5", value: 4 },
  { label: "6+", value: 7 }
];

const categoryQuestions = {
  Technology: [
    {
      key: "years",
      label: "How many years have you used this technology?",
      type: "select",
      options: yearsOptions
    },
    {
      key: "frequency",
      label: "How frequently do you use this technology?",
      type: "radio",
      options: frequencyOptions
    },
    {
      key: "context",
      label: "In what context do you use this technology?",
      type: "checkbox",
      options: [
        "Personal projects",
        "Academic work",
        "Freelance or contract work",
        "Full-time professional job",
        "Teaching or mentoring others"
      ]
    },
    {
      key: "conf",
      label: "How confident are you in solving technical problems with this technology?",
      type: "slider"
    },
    {
      key: "built",
      label: "Have you built or shipped a real-world project using this technology?",
      type: "radio",
      options: ["yes", "no"]
    },
    {
      key: "explain",
      label: "Can you explain technical concepts or help others debug with this technology?",
      type: "radio",
      options: ["yes", "somewhat", "no"]
    }
  ],
  Tourism: [
    {
      key: "years",
      label: "How many years have you practiced or studied this tourism skill?",
      type: "select",
      options: yearsOptions
    },
    {
      key: "frequency",
      label: "How often do you apply this skill in tourism settings?",
      type: "radio",
      options: frequencyOptions
    },
    {
      key: "context",
      label: "In what tourism contexts have you used this skill?",
      type: "checkbox",
      options: [
        "Tour guiding",
        "Travel agency work",
        "Academic projects",
        "Event planning",
        "Cultural exchange"
      ]
    },
    {
      key: "conf",
      label: "How confident are you in handling real-world tourism scenarios with this skill?",
      type: "slider"
    },
    {
      key: "built",
      label: "Have you organized or participated in actual tours or tourism events using this skill?",
      type: "radio",
      options: ["yes", "no"]
    },
    {
      key: "explain",
      label: "Can you train others or explain tourism concepts related to this skill?",
      type: "radio",
      options: ["yes", "somewhat", "no"]
    }
  ],
  Hospitality: [
    {
      key: "years",
      label: "How many years have you worked or trained in this hospitality area?",
      type: "select",
      options: yearsOptions
    },
    {
      key: "frequency",
      label: "How frequently do you use this hospitality skill?",
      type: "radio",
      options: frequencyOptions
    },
    {
      key: "context",
      label: "In what hospitality settings have you applied this skill?",
      type: "checkbox",
      options: [
        "Hotels",
        "Restaurants",
        "Events",
        "Academic training",
        "Internships"
      ]
    },
    {
      key: "conf",
      label: "How confident are you in delivering excellent service with this skill?",
      type: "slider"
    },
    {
      key: "built",
      label: "Have you managed or contributed to real hospitality operations using this skill?",
      type: "radio",
      options: ["yes", "no"]
    },
    {
      key: "explain",
      label: "Can you mentor others or explain hospitality procedures for this skill?",
      type: "radio",
      options: ["yes", "somewhat", "no"]
    }
  ],
  Business: [
    {
      key: "years",
      label: "How many years have you practiced this business skill?",
      type: "select",
      options: yearsOptions
    },
    {
      key: "frequency",
      label: "How often do you use this business skill?",
      type: "radio",
      options: frequencyOptions
    },
    {
      key: "context",
      label: "In what business contexts have you used this skill?",
      type: "checkbox",
      options: [
        "Academic projects",
        "Internships",
        "Entrepreneurship",
        "Corporate work",
        "Consulting"
      ]
    },
    {
      key: "conf",
      label: "How confident are you in making business decisions with this skill?",
      type: "slider"
    },
    {
      key: "built",
      label: "Have you led or contributed to real business projects using this skill?",
      type: "radio",
      options: ["yes", "no"]
    },
    {
      key: "explain",
      label: "Can you teach others or explain business concepts related to this skill?",
      type: "radio",
      options: ["yes", "somewhat", "no"]
    }
  ]
};

function getSuggestedLevel({
  years,
  frequency,
  context,
  confidence,
  built,
  explain
}: {
  years: number;
  frequency: string;
  context: string[];
  confidence: number;
  built: string;
  explain: string;
}) {
  let score = 0;
  if (years >= 7) score += 25;
  else if (years >= 4) score += 20;
  else if (years >= 2) score += 15;
  else if (years === 1) score += 10;
  else score += 5;

  if (frequency === "Daily") score += 20;
  else if (frequency === "Weekly") score += 15;
  else if (frequency === "Occasionally") score += 10;
  else if (frequency === "Rarely") score += 5;
  else score += 2;

  if (context.includes("Full-time professional job") || context.includes("Corporate work") || context.includes("Hotels")) score += 15;
  if (context.includes("Freelance or contract work") || context.includes("Consulting") || context.includes("Restaurants")) score += 10;
  if (context.includes("Academic work") || context.includes("Academic projects") || context.includes("Academic training")) score += 7;
  if (context.includes("Personal projects") || context.includes("Entrepreneurship") || context.includes("Events")) score += 5;
  if (context.includes("Teaching or mentoring others") || context.includes("Cultural exchange") || context.includes("Internships")) score += 8;
  if (context.includes("Event planning")) score += 5;
  if (context.includes("Tour guiding")) score += 7;

  score += Math.round(confidence / 10);

  if (built === "yes") score += 10;
  if (explain === "yes") score += 8;
  else if (explain === "somewhat") score += 4;

  if (score >= 80) return { label: "Expert", value: 100 };
  if (score >= 60) return { label: "Advanced", value: 80 };
  if (score >= 40) return { label: "Intermediate", value: 50 };
  return { label: "Beginner", value: 20 };
}

function GaugeMeter({ value }: { value: number }) {
  return (
    <Box sx={{ width: 180, mx: "auto", mb: 2 }}>
      <Box sx={{ position: "relative", height: 90 }}>
        <svg width="180" height="90">
          <path
            d="M10,90 A80,80 0 0,1 170,90"
            fill="none"
            stroke="#e0e7ef"
            strokeWidth="16"
          />
          <path
            d="M10,90 A80,80 0 0,1 170,90"
            fill="none"
            stroke="#2563eb"
            strokeWidth="16"
            strokeDasharray="252"
            strokeDashoffset={252 - (252 * value) / 100}
            style={{ transition: "stroke-dashoffset 0.5s" }}
          />
        </svg>
        <Box sx={{
          position: "absolute",
          top: 32,
          left: 0,
          width: "100%",
          textAlign: "center",
          fontWeight: 700,  
          fontSize: 28,
          color: "#2563eb"
        }}>
          {value}%
        </Box>
      </Box>
    </Box>
  );
}

type ExpertiseScoreProps = {
  open: boolean;
  onClose: () => void;
  onApply: (level: number) => void;
  category?: string;
};

export default function ExpertiseScore({ open, onClose, onApply, category }: ExpertiseScoreProps) {
  const [gYears, setGYears] = useState<number | "">("");
  const [gFreq, setGFreq] = useState("");
  const [gContext, setGContext] = useState<string[]>([]);
  const [gConf, setGConf] = useState(50);
  const [gBuilt, setGBuilt] = useState("");
  const [gExplain, setGExplain] = useState("");

  const cat = useMemo(() => {
    if (!category) return "Technology";
    const normalized = category.trim().toLowerCase();
    if (normalized.includes("business")) return "Business";
    if (normalized.includes("hospitality")) return "Hospitality";
    if (normalized.includes("tourism")) return "Tourism";
    if (normalized.includes("tech") || normalized.includes("it") || normalized.includes("computer")) return "Technology";
    
    return "Technology";
  }, [category]);

  const questions = categoryQuestions[cat as keyof typeof categoryQuestions];

  const suggested = getSuggestedLevel({
    years: gYears === "" ? 0 : gYears,
    frequency: gFreq,
    context: gContext,
    confidence: gConf,
    built: gBuilt,
    explain: gExplain
  });

  const handleReset = () => {
    setGYears("");
    setGFreq("");
    setGContext([]);
    setGConf(50);
    setGBuilt("");
    setGExplain("");
  };

  const handleClose = () => {
    onClose();
    handleReset();
  };

  const handleApply = () => {
    onApply(suggested.value);
    handleReset();
  };

  if (!open) return null;

  return (
    <Box>
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
            <Brain size={28} color="#fff" />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: 22, color: "#fff" }}>
              Gauge your expertise level
            </Typography>
            <Typography sx={{ color: "#dbeafe", fontSize: 15 }}>
              Answer a few questions to estimate your mastery
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ p: 4, pt: 3 }}>
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            bgcolor: "#fff",
            borderRadius: 2,
            boxShadow: 2,
            mb: 3,
            pb: 2
          }}
        >
          <GaugeMeter value={suggested.value} />
          <Typography sx={{ textAlign: "center", mb: 2, fontWeight: 500, color: "#2563eb" }}>
            Based on your answers, we suggest: {suggested.label} ({suggested.value}%)
          </Typography>
        </Box>
        {questions.map(q => (
          <Box sx={{ mb: 3 }} key={q.key}>
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb", display: "flex", alignItems: "center", gap: 0.5 }}>
              <span style={{ color: "#ef4444" }}>*</span>
              {q.label}
            </Typography>
            {q.type === "select" && (
              <TextField
                select
                value={gYears === "" ? "" : String(gYears)}
                onChange={e => setGYears(e.target.value === "" ? "" : Number(e.target.value))}
                variant="outlined"
                placeholder="Select years"
                sx={{ width: 180, background: "#fff", borderRadius: 2, fontSize: 15 }}
                SelectProps={{
                  displayEmpty: true
                }}
              >
                <MenuItem value="" disabled>
                  Select years
                </MenuItem>
                {(q.options as { label: string; value: number }[]).map(opt => (
                  <MenuItem value={String(opt.value)} key={opt.value}>{opt.label}</MenuItem>
                ))}
              </TextField>
            )}
            {q.type === "radio" && (
              <RadioGroup
                row
                value={
                  q.key === "frequency" ? gFreq :
                  q.key === "built" ? gBuilt :
                  q.key === "explain" ? gExplain : ""
                }
                onChange={e => {
                  if (q.key === "frequency") setGFreq(e.target.value);
                  if (q.key === "built") setGBuilt(e.target.value);
                  if (q.key === "explain") setGExplain(e.target.value);
                }}
              >
                {(q.options as string[]).map(opt => (
                  <FormControlLabel
                    key={opt}
                    value={opt}
                    control={<Radio sx={{ color: "#2563eb" }} />}
                    label={opt.charAt(0).toUpperCase() + opt.slice(1)}
                  />
                ))}
              </RadioGroup>
            )}
            {q.type === "checkbox" && (
              <FormGroup row>
                {(q.options as string[]).map(opt => (
                  <FormControlLabel
                    key={opt}
                    control={
                      <Checkbox
                        checked={gContext.includes(opt)}
                        onChange={e => {
                          if (e.target.checked) setGContext([...gContext, opt]);
                          else setGContext(gContext.filter(c => c !== opt));
                        }}
                        sx={{ color: "#2563eb" }}
                      />
                    }
                    label={opt}
                  />
                ))}
              </FormGroup>
            )}
            {q.type === "slider" && (
              <Slider
                value={gConf}
                onChange={(_, v) => setGConf(typeof v === "number" ? v : v[0])}
                min={0}
                max={100}
                step={1}
                marks={confidenceMarks}
                sx={{ width: 280, ml: 1 }}
              />
            )}
          </Box>
        ))}
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
            onClick={handleApply}
            disabled={
              gYears === "" ||
              !gFreq ||
              gContext.length === 0 ||
              gBuilt === "" ||
              gExplain === ""
            }
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
            Use this level
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
