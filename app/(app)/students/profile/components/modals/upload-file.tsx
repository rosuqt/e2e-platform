"use client";
import { useState, forwardRef, useRef } from "react";
import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Slide,
  Typography,
  CircularProgress
} from "@mui/material";
import type { SlideProps } from "@mui/material";
import { IoMdCloudUpload } from "react-icons/io";
import { useSession } from "next-auth/react";

const SlideUp = forwardRef(function Transition(
  props: SlideProps,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type UploadFileModalProps = {
  open: boolean;
  onClose?: () => void;
  onUpload?: (file: File) => void;
  header?: string;
  desc?: string;
  uploadedFiles?: string[]; 
};

export default function UploadFileModal({
  open,
  onClose,
  onUpload,
  header = "Upload File",
  desc = "Select a file to upload.",
  uploadedFiles = []
}: UploadFileModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const MAX_FILES = 3;

  const handleClose = () => {
    onClose?.();
    setFile(null);
    setUploading(false);
    setDragActive(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleUpload = async () => {
    if (!file) return;
    if (uploadedFiles.length >= MAX_FILES) return;
    setUploading(true);
    const studentId = (session?.user as { studentId?: string })?.studentId;
    const fileType = header?.toLowerCase().includes("cover") ? "cover_letter" : "resume";

    if (studentId) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileType", fileType);
      formData.append("student_id", studentId);

      const response = await fetch("/api/students/student-profile/postHandlers", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        onUpload?.(file);
        handleClose();
      } else {
        setUploading(false);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={SlideUp}
      PaperProps={{
        sx: {
          p: 0,
          minWidth: 540,
          maxWidth: 600,
          boxShadow: 8,
          background: "#fff",
          borderRadius: 4,
          overflow: "hidden"
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 0, background: "#fff" }}>
          <Box
            sx={{
              p: 4,
              pb: 3,
              background: "linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)",
              color: "#fff",
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              textAlign: "center"
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 1 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2
                }}
              >
                <IoMdCloudUpload size={38} color="#fff" />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: 22, color: "#fff" }}>
                {header}
              </Typography>
              <Typography sx={{ color: "#dbeafe", fontSize: 15, mt: 1 }}>
                {desc}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              mt: 3,
              mx: 3,
              mb: 0,
              border: dragActive ? "2px solid #2563eb" : "2px dashed #93c5fd",
              borderRadius: 3,
              background: dragActive
                ? "linear-gradient(90deg, #dbeafe 0%, #f0f9ff 100%)"
                : "linear-gradient(90deg, #f8fafc 0%, #f3f4f6 100%)",
              transition: "border 0.2s, background 0.2s",
              minHeight: 170,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              cursor: uploading ? "not-allowed" : "pointer"
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !uploading && inputRef.current?.click()}
          >
            <Box sx={{ mb: 2 }}>
              <IoMdCloudUpload size={44} color="#2563eb" />
            </Box>
            <Typography sx={{ fontWeight: 500, fontSize: 17, color: "#2563eb" }}>
              Drag &amp; drop your file here
            </Typography>
            <Typography sx={{ color: "#64748b", fontSize: 14, mt: 1 }}>
              or <span style={{ color: "#2563eb", textDecoration: "underline", cursor: "pointer" }}>browse files</span> on your computer
            </Typography>
            <Typography sx={{ color: "gray", fontSize: 13, mt: 1.5 }}>
              Only accepts PDF or DOCX files
            </Typography>
            <input
              ref={inputRef}
              type="file"
              id="upload-file-input"
              style={{ display: "none" }}
              onChange={handleFileChange}
              disabled={uploading}
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            />
            {file && (
              <Box sx={{ mt: 2, color: "#2563eb", fontWeight: 500, fontSize: 15 }}>
                {file.name} <span style={{ color: "#64748b", fontWeight: 400, fontSize: 13 }}>({(file.size / 1024).toFixed(2)} KB)</span>
              </Box>
            )}
          </Box>
          <Box sx={{ px: 3, pb: 3, pt: 4 }}>
            <Button
              fullWidth
              onClick={handleUpload}
              disabled={!file || uploading || uploadedFiles.length >= MAX_FILES}
              sx={{
                background: "#2563eb",
                color: "#fff",
                fontWeight: 600,
                fontSize: 17,
                borderRadius: 999,
                py: 1.5,
                boxShadow: "none",
                textTransform: "none",
                "&:hover": { background: "#1e40af" }
              }}
            >
              {uploading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Upload"}
            </Button>
            <Button
              onClick={handleClose}
              sx={{
                mt: 2,
                color: "#2563eb",
                fontWeight: 500,
                fontSize: 15,
                background: "transparent",
                borderRadius: 999,
                textTransform: "none",
                width: "100%",
                "&:hover": { background: "#f3f4f6" }
              }}
              disabled={uploading}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
