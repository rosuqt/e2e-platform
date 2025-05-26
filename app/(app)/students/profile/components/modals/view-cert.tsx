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
    title: string;
    issuer: string;
    issueDate: string;
    description?: string;
    attachment?: File | null;
    category?: string;
  };
};

export default function ViewCertModal({
  open,
  onClose,
  cert
}: ViewCertModalProps) {
  let fileUrl: string | null = null;
  if (cert.attachment) {
    fileUrl = URL.createObjectURL(cert.attachment);
  }

  const isImage =
    cert.attachment &&
    ["image/png", "image/jpeg", "image/jpg"].includes(cert.attachment.type);

  const isPdf = cert.attachment && cert.attachment.type === "application/pdf";

  const [medalAnimation, setMedalAnimation] = useState<object | null>(null);

  useEffect(() => {
    import("../../../../../../public/animations/medal.json").then((mod) => {
      setMedalAnimation(mod.default as object);
    });
  }, []);

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
          {cert.attachment ? (
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
                <img
                  src={fileUrl}
                  alt={cert.attachment.name}
                  style={{
                    maxWidth: 320,
                    maxHeight: 320,
                    borderRadius: 8,
                    marginBottom: 12,
                    boxShadow: "0 2px 8px #0001"
                  }}
                />
              )}
              {isPdf && fileUrl && (
                <Box sx={{ width: "100%", mb: 2 }}>
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
                </Box>
              )}
              <Button
                variant="contained"
                color="primary"
                href={fileUrl || "#"}
                download={cert.attachment.name}
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
