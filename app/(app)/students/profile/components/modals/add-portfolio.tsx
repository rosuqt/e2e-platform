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
import { useSession } from "next-auth/react";

const SlideUp = forwardRef(function Transition(
  props: SlideProps,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type AddPortfolioModalProps = {
  open: boolean;
  onClose?: () => void;
  onSave?: (data: {
    title: string;
    description?: string;
    link?: string;
    attachment?: File | null;
    category?: string;
    attachmentUrl?: string;
  }) => void;
  initial?: {
    title: string;
    description?: string;
    link?: string;
    attachment?: File | null;
    category?: string;
    attachmentUrl?: string;
  };
  editMode?: boolean;
};

export default function AddPortfolioModal({
  open,
  onClose,
  onSave,
  initial,
  editMode
}: AddPortfolioModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (open && initial) {
      setTitle(initial.title || "");
      setDescription(initial.description || "");
      setLink(initial.link || "");
      setAttachment(null);
      setCategory(initial.category || "");
      setError(null);
    } else if (open && !initial) {
      setTitle("");
      setDescription("");
      setLink("");
      setAttachment(null);
      setCategory("");
      setError(null);
    }
  }, [open, initial]);

  const handleClose = () => {
    onClose?.();
    setTitle("");
    setDescription("");
    setLink("");
    setAttachment(null);
    setCategory("");
    setSaving(false);
    setError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    // Validate link if provided
    if (link.trim()) {
      try {
        // Throws if not a valid URL
        new URL(link.trim());
      } catch {
        setError("Please enter a valid URL (e.g. https://example.com).");
        setSaving(false);
        return;
      }
    }
    const studentId = (session?.user as { studentId?: string })?.studentId;
    let attachmentUrl = initial?.attachmentUrl || "";

    // Duplicate check
    let isDuplicate = false;
    if (studentId) {
      const res = await fetch("/api/students/student-profile/getHandlers");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.portfolio)) {
          isDuplicate = data.portfolio.some(
            (item: { title?: string }) =>
              item.title?.trim().toLowerCase() === title.trim().toLowerCase() &&
              (!editMode || (initial && item.title !== initial.title))
          );
        }
      }
    }
    if (isDuplicate) {
      setError("A portfolio item with this title already exists.");
      setSaving(false);
      return;
    }

    if (attachment && studentId) {
      const ext = attachment.name.split(".").pop();
      const safeTitle = title
        .replace(/[^a-zA-Z0-9]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, "")
        .toUpperCase();
      const fileName = `${studentId}/portfolio/${safeTitle}.${ext}`;
      const form = new FormData();

      form.append("file", attachment, attachment.name);
      form.append("fileType", "portfolio");
      form.append("student_id", studentId);
      form.append("customPath", fileName);
      form.append("portfolioTitle", title);
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
            type: "portfolio_update",
            student_id: studentId,
            data: { title, description, link, attachmentUrl, category }
          })
        });
        await fetch("/api/ai-matches/embeddings/student", {
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
            type: "portfolio",
            student_id: studentId,
            data: { title, description, link, attachmentUrl, category }
          })
        });
        await fetch("/api/ai-matches/embeddings/student", {
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
    onSave?.({ title, description, link, attachment, category, attachmentUrl });
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
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: 22, color: "#fff" }}>
              {editMode ? "Edit Portfolio Item" : "Add Portfolio Item"}
            </Typography>
            <Typography sx={{ color: "#dbeafe", fontSize: 15 }}>
              {editMode
                ? "Update details about your portfolio project"
                : "Enter details about your portfolio project"}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ p: 4, pt: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
              Title/Name <span style={{ color: "#ef4444" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              value={title}
              onChange={e => setTitle(e.target.value)}
              variant="outlined"
              placeholder="e.g. My Web App"
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
              Description
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              variant="outlined"
              placeholder="Brief info about the project"
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
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
              Link (optional)
            </Typography>
            <TextField
              fullWidth
              value={link}
              onChange={e => setLink(e.target.value)}
              variant="outlined"
              placeholder="e.g. https://github.com/myproject"
              sx={{
                background: "#fff",
                borderRadius: 2,
                mb: 2,
                fontSize: 15,
                "& .MuiOutlinedInput-root": { fontSize: 15 }
              }}
              inputProps={{ maxLength: 200 }}
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
                Category (optional)
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
                <MenuItem value="Software Project">Software Project</MenuItem>
                <MenuItem value="Mobile App">Mobile App</MenuItem>
                <MenuItem value="Web App">Web App</MenuItem>
                <MenuItem value="UI/UX Design">UI/UX Design</MenuItem>
                <MenuItem value="Research Paper">Research Paper</MenuItem>
                <MenuItem value="Business Plan">Business Plan</MenuItem>
                <MenuItem value="Event Proposal">Event Proposal</MenuItem>
                <MenuItem value="Tour Package">Tour Package</MenuItem>
                <MenuItem value="Hotel Management">Hotel Management</MenuItem>
                <MenuItem value="Marketing Campaign">Marketing Campaign</MenuItem>
                <MenuItem value="Financial Analysis">Financial Analysis</MenuItem>
                <MenuItem value="Operations Plan">Operations Plan</MenuItem>
                <MenuItem value="Culinary Portfolio">Culinary Portfolio</MenuItem>
                <MenuItem value="Travel Itinerary">Travel Itinerary</MenuItem>
                <MenuItem value="Presentation">Presentation</MenuItem>
                <MenuItem value="Internship Report">Internship Report</MenuItem>
                <MenuItem value="Feasibility Study">Feasibility Study</MenuItem>
                <MenuItem value="Case Study">Case Study</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Box>
          </Box>
          {error && (
            <Typography sx={{ color: "#ef4444", mb: 2, fontSize: 15 }}>
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
              disabled={!title || saving}
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
