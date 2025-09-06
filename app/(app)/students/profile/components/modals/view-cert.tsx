"use client";
import { forwardRef, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Slide,
  Typography
} from "@mui/material";
import type { SlideProps } from "@mui/material";
import dynamic from "next/dynamic";
import Image from "next/image";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const SlideUp = forwardRef(function Transition(
  props: SlideProps,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type ViewCertModalProps = {
  open: boolean;
  onClose?: () => void;
  cert: {
    student_id: string; 
    title: string;
    issuer: string;
    issueDate: string;
    description?: string;
    attachment?: File | null;
    attachmentUrl?: string | null;
    category?: string;
  };
};

export default function ViewCertModal({
  open,
  onClose,
  cert
}: ViewCertModalProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function fetchSignedUrl() {
      if (cert.attachmentUrl && cert.attachmentUrl.startsWith("http")) {
        setSignedUrl(cert.attachmentUrl);
      } else if (cert.attachmentUrl && cert.attachmentUrl.length > 0) {
        const params = new URLSearchParams();
        params.set("student_id", cert.student_id);
        const res = await fetch(`/api/students/student-profile/getDocuments?${params.toString()}`);
        const { certs } = await res.json();
        const found = Array.isArray(certs)
          ? certs.find((c: { attachmentUrl?: string; signedUrl?: string }) => c.attachmentUrl === cert.attachmentUrl)
          : null;
        if (active) setSignedUrl(found?.signedUrl || null);
      } else {
        setSignedUrl(null);
      }
    }
    fetchSignedUrl();
    return () => { active = false; };
  }, [cert.attachmentUrl, cert.student_id, open]);

  let fileUrl: string | null = null;
  let fileType: string | null = null;
  let fileName: string | null = null;

  if (cert.attachment && cert.attachment instanceof File) {
    fileUrl = URL.createObjectURL(cert.attachment);
    fileType = cert.attachment.type;
    fileName = cert.attachment.name;
  } else if (signedUrl) {
    fileUrl = signedUrl;
    fileName = cert.attachmentUrl || "";
  } else if (cert.attachmentUrl && cert.attachmentUrl.length > 0 && cert.attachmentUrl.startsWith("http")) {
    fileUrl = cert.attachmentUrl;
    fileName = cert.attachmentUrl;
  }

  if (!fileType && fileName) {
    if (/\.pdf(\?.*)?$/i.test(fileName)) fileType = "application/pdf";
    else if (/\.(png|jpe?g|gif|bmp|webp)$/i.test(fileName)) fileType = "image";
    else if (/\.docx(\?.*)?$/i.test(fileName)) fileType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    else fileType = "";
  }

  if (!fileType && fileUrl) {
    if (/\.pdf(\?.*)?$/i.test(fileUrl)) fileType = "application/pdf";
    else if (/\.(png|jpe?g|gif|bmp|webp)$/i.test(fileUrl)) fileType = "image";
    else if (/\.docx(\?.*)?$/i.test(fileUrl)) fileType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    else fileType = "";
  }

  const isImage =
    (fileType === "image" || (fileType && fileType.startsWith("image/")));

  const isPdf =
    fileType === "application/pdf";

  const isDocx =
    fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  useEffect(() => {
    console.log("DEBUG ViewCertModal:", { fileUrl, fileType, fileName, cert });
  }, [fileUrl, fileType, fileName, cert]);

  const [medalAnimation, setMedalAnimation] = useState<object | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    import("../../../../../../public/animations/medal.json").then((mod) => {
      setMedalAnimation(mod.default as object);
    });
  }, []);

  useEffect(() => {
    let active = true;
    async function fetchSignedUrl() {
      if (cert.attachmentUrl && cert.attachmentUrl.startsWith("http")) {
        setSignedUrl(cert.attachmentUrl);
        setLoadingPreview(false);
      } else if (cert.attachmentUrl && cert.attachmentUrl.length > 0) {
        setLoadingPreview(true);
        const params = new URLSearchParams();
        params.set("student_id", cert.student_id);
        const res = await fetch(`/api/students/student-profile/getDocuments?${params.toString()}`);
        const { certs } = await res.json();
        const found = Array.isArray(certs)
          ? certs.find((c: { attachmentUrl?: string; signedUrl?: string }) => c.attachmentUrl === cert.attachmentUrl)
          : null;
        if (active) {
          setSignedUrl(found?.signedUrl || null);
          setLoadingPreview(false);
        }
      } else {
        setSignedUrl(null);
        setLoadingPreview(false);
      }
    }
    setLoadingPreview(!!cert.attachmentUrl);
    fetchSignedUrl();
    return () => { active = false; };
  }, [cert.attachmentUrl, cert.student_id, open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
            p: 0,
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
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 4, pb: 2 }}>
            <Box sx={{ width: 110, height: 110, mb: 1 }}>
              {medalAnimation && (
                <Lottie
                  animationData={medalAnimation}
                  loop={false}
                  autoplay
                  style={{ width: "100%", height: "100%" }}
                  initialSegment={[0, 75]}
                />
              )}
            </Box>
            <Typography sx={{ fontWeight: 600, fontSize: 22, color: "#fff", mb: 0.5 }}>
              {cert.title}
            </Typography>
            <Typography sx={{ color: "#dbeafe", fontSize: 15 }}>
              {cert.issuer} {cert.issueDate && <>| {cert.issueDate}</>}
            </Typography>
            {cert.category && (
              <Typography sx={{ color: "#facc15", fontSize: 13, mt: 0.5 }}>
                {cert.category}
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ p: 4, pt: 3 }}>
          {cert.description && (
            <Typography sx={{ mb: 2, color: "#334155", fontSize: 15 }}>
              {cert.description}
            </Typography>
          )}
          {loadingPreview ? (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4 }}>
              <svg className="animate-spin h-8 w-8 text-blue-600 mb-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
              </svg>
              <Typography sx={{ color: "#2563eb", fontSize: 16 }}>Loading certificate preview...</Typography>
            </Box>
          ) : fileUrl ? (
            <Box
              sx={{
                border: "1px solid #e0e7ef",
                borderRadius: 2,
                p: 2,
                mb: 2,
                background: "#f8fafc",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              {isImage && fileUrl && (
                <Image
                  src={fileUrl}
                  alt={cert.attachment?.name || cert.title}
                  width={320}
                  height={320}
                  style={{
                    maxWidth: 320,
                    maxHeight: 320,
                    borderRadius: 8,
                    marginBottom: 12,
                    boxShadow: "0 2px 8px #0001",
                    height: "auto",
                    width: "auto"
                  }}
                />
              )}
              {isPdf && fileUrl && (
                <Box sx={{ width: "100%", mb: 2 }}>
                  {fileUrl.startsWith("http") ? (
                    <iframe
                      src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
                      title="Certificate PDF"
                      style={{
                        width: "100%",
                        minHeight: 320,
                        border: "none",
                        borderRadius: 8
                      }}
                    />
                  ) : (
                    <iframe
                      src={fileUrl}
                      title="Certificate PDF"
                      style={{
                        width: "100%",
                        minHeight: 320,
                        border: "none",
                        borderRadius: 8
                      }}
                    />
                  )}
                </Box>
              )}
              {isDocx && fileUrl && (
                <Box sx={{ width: "100%", mb: 2 }}>
                  {fileUrl.startsWith("http") ? (
                    <iframe
                      src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
                      title="Certificate DOCX"
                      style={{
                        width: "100%",
                        minHeight: 320,
                        border: "none",
                        borderRadius: 8
                      }}
                    />
                  ) : (
                    <Typography sx={{ color: "#64748b", fontSize: 15, mb: 1 }}>
                      DOCX preview not supported for local files. Please download to view.
                    </Typography>
                  )}
                </Box>
              )}
              {!isImage && !isPdf && !isDocx && fileUrl && (
                <Box sx={{ width: "100%", mb: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Typography sx={{ color: "#64748b", fontSize: 15, mb: 1 }}>
                    File preview not available. You can download the file below.
                  </Typography>
                </Box>
              )}
              <Button
                variant="contained"
                color="primary"
                href={fileUrl || "#"}
                download={cert.attachment?.name || cert.title}
                sx={{
                  mt: 1,
                  background: "#2563eb",
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: 15,
                  px: 3,
                  "&:hover": { background: "#1e40af" }
                }}
              >
                Download Certificate
              </Button>
            </Box>
          ) : (
            <Typography sx={{ color: "#64748b", fontSize: 15, textAlign: "center", mb: 2 }}>
              No certificate file uploaded.
            </Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
