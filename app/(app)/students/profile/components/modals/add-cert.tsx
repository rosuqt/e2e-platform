"use client";
import { useState, useEffect, forwardRef } from "react";
import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Slide,
  TextField,
  Typography,
  MenuItem,
  FormHelperText,
  CircularProgress
} from "@mui/material";
import type { SlideProps } from "@mui/material";
import { Award } from "lucide-react";
import { useSession } from "next-auth/react";

const SlideUp = forwardRef(function Transition(
  props: SlideProps,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type AddCertModalProps = {
  open: boolean;
  onClose?: () => void;
  onSave?: (data: {
    title: string;
    issuer: string;
    issueDate: string;
    description?: string;
    attachment?: File | null;
    category?: string;
    attachmentUrl?: string;
  }) => void;
  initial?: {
    title: string;
    issuer: string;
    issueDate: string;
    description?: string;
    attachment?: File | null;
    category?: string;
    attachmentUrl?: string;
  };
  editMode?: boolean;
};

export default function AddCertModal({
  open,
  onClose,
  onSave,
  initial,
  editMode
}: AddCertModalProps) {
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (open && initial) {
      setTitle(initial.title || "");
      setIssuer(initial.issuer || "");
      setIssueDate(initial.issueDate || "");
      setDescription(initial.description || "");
      setAttachment(null);
      setCategory(initial.category || "");
    } else if (open && !initial) {
      setTitle("");
      setIssuer("");
      setIssueDate("");
      setDescription("");
      setAttachment(null);
      setCategory("");
    }
  }, [open, initial]);

  const handleClose = () => {
    onClose?.();
    setTitle("");
    setIssuer("");
    setIssueDate("");
    setDescription("");
    setAttachment(null);
    setCategory("");
    setSaving(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const studentId = (session?.user as { studentId?: string })?.studentId;
    let attachmentUrl = initial?.attachmentUrl || "";
    if (attachment && studentId) {
      const ext = attachment.name.split(".").pop();
      const safeTitle = title
        .replace(/[^a-zA-Z0-9]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, "")
        .toUpperCase();
      const fileName = `${studentId}/certs/${safeTitle}.${ext}`;
      const form = new FormData();

      form.append("file", attachment, attachment.name);
      form.append("fileType", "cert");
      form.append("student_id", studentId);
      form.append("customPath", fileName);
      form.append("certTitle", title); 
      const res = await fetch("/api/students/student-profile/postHandlers", {
        method: "POST",
        body: form
      });
      const { data, error } = await res.json();
      if (!error && data?.path) {
        attachmentUrl = data.path;
      }
    }
    if (studentId) {
      if (editMode && initial) {
        await fetch("/api/students/student-profile/postHandlers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "cert_update",
            student_id: studentId,
            old: {
              title: initial.title,
              issuer: initial.issuer,
              issueDate: initial.issueDate
            },
            data: { title, issuer, issueDate, description, attachmentUrl, category }
          })
        });
        await fetch("/api/ai-matches/embeddings/student", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_id: studentId }),
        });
        await fetch("/api/ai-matches/match/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_id: studentId }),
        });
        await fetch("/api/ai-matches/rescore", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_id: studentId }),
        });
      } else {
        await fetch("/api/students/student-profile/postHandlers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "cert",
            student_id: studentId,
            data: { title, issuer, issueDate, description, attachmentUrl, category }
          })
        });
        await fetch("/api/ai-matches/embeddings/student", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_id: studentId }),
        });
        await fetch("/api/ai-matches/match/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_id: studentId }),
        });
        await fetch("/api/ai-matches/rescore", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_id: studentId }),
        });
      }
    }
    onSave?.({ title, issuer, issueDate, description, attachment, category, attachmentUrl });
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
          minWidth: 600,
          maxWidth: 700,
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
              <Award size={28} color="#fff" />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: 22, color: "#fff" }}>
                {editMode ? "Edit Certificate or Achievement" : "Add Certificate or Achievement"}
              </Typography>
              <Typography sx={{ color: "#dbeafe", fontSize: 15 }}>
                {editMode
                  ? "Update details about your certification or achievement"
                  : "Enter details about your certification or achievement"}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ p: 4, pt: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
              Title/Name of Certification or Achievement <span style={{ color: "#ef4444" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              value={title}
              onChange={e => setTitle(e.target.value)}
              variant="outlined"
              placeholder="e.g. Top Performer Award"
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
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
              Issuer/Organization Name <span style={{ color: "#ef4444" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              value={issuer}
              onChange={e => setIssuer(e.target.value)}
              variant="outlined"
              placeholder="e.g. Coursera, Google, Microsoft, University Name"
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
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
              Issue Date <span style={{ color: "#ef4444" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              type="date"
              value={issueDate}
              onChange={e => setIssueDate(e.target.value)}
              variant="outlined"
              sx={{
                background: "#fff",
                borderRadius: 2,
                mb: 2,
                fontSize: 15,
                "& .MuiOutlinedInput-root": { fontSize: 15 }
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
              Description (optional)
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              variant="outlined"
              placeholder="Brief info about what was achieved, skills gained, or context"
              sx={{
                background: "#fff",
                borderRadius: 2,
                mb: 2,
                fontSize: 15,
                "& .MuiOutlinedInput-root": { fontSize: 15 }
              }}
              inputProps={{ maxLength: 300 }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
                Attachment/Upload (optional)
              </Typography>
              <Button
                variant="outlined"
                component="label"
                sx={{
                  borderColor: "#2563eb",
                  color: "#2563eb",
                  fontWeight: 500,
                  fontSize: 15,
                  background: "#fff",
                  "&:hover": { borderColor: "#1e40af", background: "#f1f5f9" },
                  mb: 1
                }}
              >
                {attachment ? "Change File" : "Upload File"}
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  hidden
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setAttachment(e.target.files[0]);
                    }
                  }}
                />
              </Button>
              {attachment && (
                <Typography variant="body2" sx={{ ml: 1, color: "#2563eb", fontSize: 13 }}>
                  {attachment.name}
                </Typography>
              )}
              <FormHelperText sx={{ ml: 0, color: "#64748b" }}>
                PDF, JPG, or PNG. Max 5MB.
              </FormHelperText>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
                Category or Type (optional)
              </Typography>
              <TextField
                select
                fullWidth
                value={category}
                onChange={e => setCategory(e.target.value)}
                variant="outlined"
                placeholder="Select Category"
                sx={{
                  background: "#fff",
                  borderRadius: 2,
                  mb: 2,
                  fontSize: 15,
                  "& .MuiOutlinedInput-root": { fontSize: 15 }
                }}
              >
                <MenuItem value="">Select Category</MenuItem>
                <MenuItem value="Academic">Academic</MenuItem>
                <MenuItem value="Technical">Technical</MenuItem>
                <MenuItem value="Professional">Professional</MenuItem>
                <MenuItem value="Award">Award</MenuItem>
                <MenuItem value="Online Course">Online Course</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
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
              disabled={!title || !issuer || !issueDate || saving}
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
              {saving ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : (editMode ? "Update" : "Save")}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
