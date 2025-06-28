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
import Image from "next/image";

const SlideUp = forwardRef(function Transition(
  props: SlideProps,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type PortfolioType = {
  title: string;
  description?: string;
  link?: string;
  attachmentUrl?: string;
  category?: string;
};

type ViewPortfolioModalProps = {
  open: boolean;
  onClose?: () => void;
  portfolio: PortfolioType;
};

async function getSignedUrlIfNeeded(
  attachmentUrl: string | null | undefined
): Promise<string | null> {
  if (!attachmentUrl) return null;
  if (/^https?:\/\//.test(attachmentUrl)) return attachmentUrl;
  const res = await fetch("/api/students/get-signed-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bucket: "student.documents", path: attachmentUrl }),
  });
  if (!res.ok) return null;
  const { signedUrl } = await res.json();
  return signedUrl || null;
}

function getProxyUrl(fileUrl: string | null) {
  if (!fileUrl) return null;
  if (fileUrl.startsWith("blob:") || /^https?:\/\//.test(fileUrl)) return fileUrl;
  return `/api/proxy-image?path=${encodeURIComponent(fileUrl)}`;
}

export default function PublicViewPortfolioModal({
  open,
  onClose,
  portfolio
}: ViewPortfolioModalProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoadingPreview(true);
      setImgError(false);
      const url = await getSignedUrlIfNeeded(portfolio.attachmentUrl || null);
      if (!ignore) setFileUrl(url);
      setLoadingPreview(false);
    })();
    return () => { ignore = true; };
  }, [portfolio.attachmentUrl]);

  let fileType: string | null = null;
  let fileName: string | null = null;

  if (fileUrl) {
    fileName = fileUrl;
  }

  if (!fileType && fileName) {
    if (/\.pdf(\?.*)?$/i.test(fileName)) fileType = "application/pdf";
    else if (/\.(png|jpe?g|gif|bmp|webp)$/i.test(fileName)) fileType = "image";
    else if (/\.docx(\?.*)?$/i.test(fileName)) fileType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    else if (/^blob:|^https?:\/\//.test(fileName) && /\.(png|jpe?g|gif|bmp|webp)$/i.test(fileName)) fileType = "image";
    else fileType = "";
  }

  const isImage =
    (fileType === "image" || (fileType && fileType.startsWith("image/"))) ||
    (fileUrl && /\.(png|jpe?g|gif|bmp|webp)$/i.test(fileUrl.split('?')[0]));

  const isPdf =
    fileType === "application/pdf";

  const isDocx =
    fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

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
              <svg width={110} height={110} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#2563eb" strokeWidth="4" fill="#dbeafe" />
                <path d="M8 12l2 2 4-4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Box>
            <Typography sx={{ fontWeight: 600, fontSize: 22, color: "#fff", mb: 0.5 }}>
              {portfolio.title}
            </Typography>
            {portfolio.link && (
              <Typography sx={{ color: "#dbeafe", fontSize: 15 }}>
                <a href={portfolio.link} target="_blank" rel="noopener noreferrer" className="underline text-blue-100">{portfolio.link}</a>
              </Typography>
            )}
            {portfolio.category && (
              <Typography sx={{ color: "#facc15", fontSize: 13, mt: 0.5 }}>
                {portfolio.category}
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ p: 4, pt: 3 }}>
          {portfolio.description && (
            <Typography sx={{ mb: 2, color: "#334155", fontSize: 15 }}>
              {portfolio.description}
            </Typography>
          )}
          {loadingPreview ? (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4 }}>
              <svg className="animate-spin h-8 w-8 text-blue-600 mb-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
              </svg>
              <Typography sx={{ color: "#2563eb", fontSize: 16 }}>Loading portfolio preview...</Typography>
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
              {isImage && fileUrl && !imgError && (
                <Image
                  src={getProxyUrl(fileUrl) || ""}
                  alt={portfolio.title}
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
                  onError={() => setImgError(true)}
                  unoptimized
                  priority
                />
              )}
              {isImage && imgError && (
                <Box sx={{ width: "100%", mb: 1 }}>
                  <Typography sx={{ color: "#64748b", fontSize: 15 }}>
                    Image preview not available. Please download to view.
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: 12, wordBreak: "break-all" }}>
                    {fileUrl}
                  </Typography>
                </Box>
              )}
              {isPdf && fileUrl && fileUrl.startsWith("http") && (
                <Box sx={{ width: "100%", mb: 2 }}>
                  <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
                    title="Portfolio PDF"
                    style={{
                      width: "100%",
                      minHeight: 320,
                      border: "none",
                      borderRadius: 8
                    }}
                  />
                </Box>
              )}
              {isPdf && fileUrl && fileUrl.startsWith("blob:") && (
                <Typography sx={{ color: "#64748b", fontSize: 15, mb: 1 }}>
                  PDF preview not available for local files. Please download to view.
                </Typography>
              )}
              {isDocx && fileUrl && fileUrl.startsWith("http") && (
                <Box sx={{ width: "100%", mb: 2 }}>
                  <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
                    title="Portfolio DOCX"
                    style={{
                      width: "100%",
                      minHeight: 320,
                      border: "none",
                      borderRadius: 8
                    }}
                  />
                </Box>
              )}
              {isDocx && fileUrl && fileUrl.startsWith("blob:") && (
                <Typography sx={{ color: "#64748b", fontSize: 15, mb: 1 }}>
                  DOCX preview not available for local files. Please download to view.
                </Typography>
              )}
              {!isImage && !isPdf && !isDocx && fileUrl && (
                <Box sx={{ width: "100%", mb: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Typography sx={{ color: "#64748b", fontSize: 15, mb: 1 }}>
                    File preview not available.
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Typography sx={{ color: "#64748b", fontSize: 15, textAlign: "center", mb: 2 }}>
              No portfolio file uploaded.
            </Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
