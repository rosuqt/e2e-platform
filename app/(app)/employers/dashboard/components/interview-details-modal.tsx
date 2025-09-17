"use client";
import { Dialog, DialogContent, Button } from "@mui/material";
import { UserCheck, Calendar, Users } from "lucide-react";

type InterviewDetails = {
  id: string;
  application_id?: string;
  mode: string;
  platform?: string;
  address?: string;
  team?: string[];
  date: string;
  time: string;
  notes?: string;
  summary?: string;
  created_at?: string;
  updated_at?: string;
  student_id?: string;
  employer_id?: string;
  student_name?: string;
};

type InterviewDetailsModalProps = {
  open: boolean;
  onClose: () => void;
  interview: InterviewDetails | null;
};

function formatTime(time?: string) {
  if (!time) return "";
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = ((hour + 11) % 12 + 1);
  return `${hour12}:${m.padStart(2, "0")} ${ampm}`;
}

export default function InterviewDetailsModal({ open, onClose, interview }: InterviewDetailsModalProps) {
  if (!interview) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, overflow: "visible" } }}>
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-5 pt-6 pb-4 flex items-center justify-between relative">
        <div className="flex items-center gap-3">
          <span className="bg-white/20 rounded-full p-2">
            <UserCheck className="h-7 w-7 text-white" />
          </span>
          <div>
            <h3 className="font-bold text-xl text-white">
              Interview{interview.student_name ? ` with ${interview.student_name}` : ""}
            </h3>
            <p className="text-blue-100 text-sm">
              {interview.date || <span className="text-blue-200">No date</span>} &nbsp; {formatTime(interview.time)}
            </p>
          </div>
        </div>
        <Button
          variant="text"
          size="small"
          onClick={onClose}
          sx={{
            minWidth: 0,
            color: "#fff",
            position: "absolute",
            top: 12,
            right: 12,
            '&:hover': { background: "rgba(255,255,255,0.08)" }
          }}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </Button>
      </div>
      <DialogContent sx={{ p: 0, background: "#fff" }}>
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-700">
                {interview.date || <span className="text-blue-300">No date</span>} &nbsp; {formatTime(interview.time)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-blue-700">{interview.mode || <span className="text-blue-300">No mode</span>} Meeting</span>
              <span className="text-blue-400">|</span>
              <span className="text-blue-700">
                {interview.mode === "Online"
                  ? interview.platform || <span className="text-blue-300">No platform</span>
                  : interview.address || <span className="text-blue-300">No address</span>}
              </span>
            </div>
          </div>
          {/* Always show Team Invited section */}
          <div className="flex items-center gap-2 bg-blue-50 p-4 rounded-lg">
            <Users className="h-5 w-5 text-blue-500" />
            <span className="text-blue-700 font-medium">Team Invited:</span>
            <span className="text-blue-900">
              {interview.team && interview.team.length > 0
                ? interview.team.join(", ")
                : <span className="text-blue-300">No team invited.</span>}
            </span>
          </div>
          {/* Always show Notes section, blue themed */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <span className="block text-blue-700 font-medium mb-1">Notes</span>
            <span className="text-blue-900">
              {interview.notes && interview.notes.trim() !== ""
                ? interview.notes
                : <span className="text-blue-300">No notes provided.</span>}
            </span>
          </div>
          {/* Always show Summary section, blue themed */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <span className="block text-blue-700 font-medium mb-1">Summary</span>
            <span className="text-blue-900">
              {interview.summary && interview.summary.trim() !== ""
                ? interview.summary
                : <span className="text-blue-300">No summary provided.</span>}
            </span>
          </div>
        </div>
      </DialogContent>
      <div className="p-4 border-t flex justify-end bg-white">
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            background: "linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)",
            color: "#fff",
            fontWeight: 600,
            borderRadius: 2,
            px: 4,
            '&:hover': { background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)" }
          }}
        >
          Close
        </Button>
      </div>
    </Dialog>
  );
}
