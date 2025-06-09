"use client";
import { useState, forwardRef } from "react";
import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Slide,
  Typography,
  TextField,
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";
import type { SlideProps } from "@mui/material";
import { Clock } from "lucide-react";
import { useSession } from "next-auth/react";
import MenuItem from "@mui/material/MenuItem";

const SlideUp = forwardRef(function Transition(
  props: SlideProps,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type AvailabilityModalProps = {
  open: boolean;
  onClose: () => void;
};

const defaultTimes = {
  start: "09:00",
  end: "18:00",
  timezone: "PST"
};

const TIMEZONES = [
  "UTC", "PST", "PDT", "MST", "MDT", "CST", "CDT", "EST", "EDT",
  "GMT", "CET", "EET", "IST", "SGT", "JST", "AEST", "AEDT"
];

export default function AvailabilityModal({ open, onClose }: AvailabilityModalProps) {
  const [days, setDays] = useState<string[]>(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
  const [start, setStart] = useState(defaultTimes.start);
  const [end, setEnd] = useState(defaultTimes.end);
  const [timezone, setTimezone] = useState(defaultTimes.timezone);
  const { data: session } = useSession();

  const handleSave = async () => {
    const employerId = (session?.user as { employerId?: string })?.employerId;
    if (employerId) {
      await fetch("/api/employers/employer-profile/postHandlers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employerID: employerId,
          availability: {
            days,
            start,
            end,
            timezone
          }
        })
      });
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
            <Box
              sx={{
                p: 1.5,
                background: "rgba(255,255,255,0.18)",
                borderRadius: 2,
                display: "flex",
                alignItems: "center"
              }}
            >
              <Clock size={28} color="#fff" />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: 22, color: "#fff" }}>
                Set Your Availability
              </Typography>
              <Typography sx={{ color: "#dbeafe", fontSize: 15 }}>
                Choose your available days and hours
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ p: 4, pt: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 15, mb: 1, color: "#2563eb" }}>
              Available Days
            </Typography>
            <ToggleButtonGroup
              value={days}
              onChange={(_, newDays) => setDays(newDays)}
              aria-label="days"
              sx={{ flexWrap: "wrap" }}
            >
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <ToggleButton
                  key={day}
                  value={day}
                  sx={{ m: 0.5, fontSize: 13, px: 2, py: 1, minWidth: 80 }}
                >
                  {day.slice(0, 3)}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
                Start Time
              </Typography>
              <TextField
                type="time"
                value={start}
                onChange={e => setStart(e.target.value)}
                fullWidth
                inputProps={{ step: 300 }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
                End Time
              </Typography>
              <TextField
                type="time"
                value={end}
                onChange={e => setEnd(e.target.value)}
                fullWidth
                inputProps={{ step: 300 }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
                Timezone
              </Typography>
              <TextField
                select
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
                fullWidth
                placeholder="e.g. PST"
              >
                {TIMEZONES.map(tz => (
                  <MenuItem key={tz} value={tz}>
                    {tz}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2, pt: 2 }}>
            <Button
              variant="outlined"
              onClick={onClose}
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
