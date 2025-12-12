/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Typography,
  CircularProgress,
  Tooltip
} from "@mui/material"
import Lottie from "lottie-react"
import offerAnim from "../../../../../../public/animations/offer-sent.json"
import { Briefcase } from "lucide-react"
import { Confetti, ConfettiRef } from "@/components/magicui/confetti"
import { Warning as WarningIcon } from "@mui/icons-material"
import DialogTitle from "@mui/material/DialogTitle"

export function ViewOfferModal({
  open,
  onClose,
  applicationId,
  onAcceptOffer
}: {
  open: boolean
  onClose: () => void
  applicationId: string | null
  onAcceptOffer?: () => void
}) {
  const [loading, setLoading] = useState(true)
  const [offer, setOffer] = useState<any>(null)
  const [accepting, setAccepting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [rejecting, setRejecting] = useState(false)
  const [rejectModal, setRejectModal] = useState(false)
  const [rejected, setRejected] = useState(false)
  const confettiRef = useRef<ConfettiRef>(null)

  useEffect(() => {
    if (!open || !applicationId) return
    setLoading(true)
    fetch(`/api/employers/applications/postJobOffer/getJobOffer?application_id=${applicationId}`)
      .then(res => res.json())
      .then(data => {
        setOffer(data.offer || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [open, applicationId])

  useEffect(() => {
    if (success && confettiRef.current && typeof confettiRef.current.fire === "function") {
      confettiRef.current.fire()
    }
  }, [success])

  const handleAcceptOffer = async () => {
    if (!applicationId || accepting) return
    setAccepting(true)
    try {
      await fetch("/api/employers/applications/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ application_id: applicationId, action: "hired" })
      })
      setSuccess(true)
      if (onAcceptOffer) onAcceptOffer()
    } finally {
      setAccepting(false)
    }
  }

  const handleRejectOffer = async () => {
    if (!applicationId || rejecting) return
    setRejecting(true)
    try {
      await fetch("/api/employers/applications/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ application_id: applicationId, action: "reject_offer" })
      })
      setRejected(true)
    } finally {
      setRejecting(false)
      setRejectModal(false)
    }
  }

  // Add a wrapper to reset success/rejected state on close
  const handleClose = () => {
    setSuccess(false)
    setRejected(false)
    onClose()
  }

  if (rejected) {
    return (
      <Dialog
        open={true}
        onClose={handleClose}
        PaperProps={{
          sx: {
            minWidth: 500,
            maxWidth: 650,
            width: 650,
            boxShadow: 8,
            borderRadius: 3,
            overflow: "hidden"
          }
        }}
      >
        <Box sx={{
          background: "linear-gradient(90deg, #f87171 0%, #ef4444 100%)",
          pt: 5, pb: 3, px: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative"
        }}>
          <Button
            onClick={handleClose}
            sx={{
              position: "absolute", top: 18, right: 18, minWidth: 0, width: 38, height: 38,
              borderRadius: "50%", color: "#ef4444", background: "#fff", zIndex: 2, boxShadow: 1,
              '&:hover': { background: "#fef2f2" }
            }}>
            <svg width={22} height={22} viewBox="0 0 20 20" fill="none">
              <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </Button>
          <Box sx={{
            width: 120, height: 120, borderRadius: "50%", background: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center", boxShadow: 3, mb: 2
          }}>
            <WarningIcon sx={{ color: "#ef4444", fontSize: 80 }} />
          </Box>
        </Box>
        <DialogContent sx={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          py: 4, minHeight: 220, position: "relative", background: "linear-gradient(90deg, #fef2f2 0%, #f3e8ff 100%)"
        }}>
          <Typography sx={{ color: "#ef4444", fontWeight: 700, fontSize: 26, mb: 0.5, letterSpacing: 0.2, textAlign: "center" }}>
            Offer Rejected
          </Typography>
          <Typography sx={{ fontSize: 14, color: "#991b1b", textAlign: "center", mt: 1.5, fontWeight: 500, maxWidth: 340, mx: "auto" }}>
            You have rejected this job offer. The employer has been notified.
          </Typography>
          <Box sx={{ px: 3, pb: 3, pt: 3, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 2 }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{ color: "#ef4444", borderColor: "#ef4444", fontWeight: 600, fontSize: 16, background: "#fff", borderRadius: 2, px: 4, '&:hover': { borderColor: "#991b1b", background: "#fef2f2" } }}
            >Close</Button>
          </Box>
        </DialogContent>
      </Dialog>
    )
  }

  if (success) {
    return (
      <Dialog
        open={true}
        onClose={handleClose}
        PaperProps={{
          sx: {
            minWidth: 500,
            maxWidth: 650,
            width: 650,
            boxShadow: 8,
            borderRadius: 3,
            overflow: "hidden"
          }
        }}
      >
        <Box sx={{
          background: "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)",
          pt: 5, pb: 3, px: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative"
        }}>
          <Button onClick={handleClose} sx={{
            position: "absolute", top: 18, right: 18, minWidth: 0, width: 38, height: 38,
            borderRadius: "50%", color: "#16a34a", background: "#fff", zIndex: 2, boxShadow: 1,
            '&:hover': { background: "#f0fdf4" }
          }}>
            <svg width={22} height={22} viewBox="0 0 20 20" fill="none">
              <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </Button>
          <Box sx={{
            width: 120, height: 120, borderRadius: "50%", background: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center", boxShadow: 3, mb: 2
          }}>
            <Lottie animationData={offerAnim} style={{ width: 100, height: 100 }} loop={false} />
          </Box>
        </Box>
        <DialogContent sx={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          py: 4, minHeight: 220, position: "relative", background: "linear-gradient(90deg, #f0fdf4 0%, #f3e8ff 100%)"
        }}>
          <Confetti
            ref={confettiRef}
            manualstart
            style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 1400 }}
            options={{ particleCount: 120, spread: 360, ticks: 70, gravity: 0, decay: 0.94, startVelocity: 40, colors: ["#FACC15", "#FDE68A", "#A7F3D0", "#4ADE80", "#22D3EE"], shapes: ["star"] }}
          />
          <Box sx={{ border: "1.5px solid #bbf7d0", background: "#fff", boxShadow: 1, borderRadius: 3, mb: 2.5, width: "100%", maxWidth: 340, p: 2.5, display: "flex", alignItems: "center", gap: 2, mx: "auto" }}>
            <Box sx={{ width: 54, height: 54, fontWeight: 600, fontSize: 24, bgcolor: "#16a34a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", mr: 2 }}>
              <Briefcase size={32} />
            </Box>
            <Box>
              <Typography fontWeight={700} fontSize={18} color="#166534" sx={{ lineHeight: 1.2 }}>
                {offer?.applicant_name || offer?.company_name}
              </Typography>
              <Typography variant="body2" color="#6ee7b7" sx={{ fontSize: 13, fontWeight: 500 }}>
                {offer?.job_title}
              </Typography>
            </Box>
          </Box>
          <Typography sx={{ color: "#16a34a", fontWeight: 700, fontSize: 26, mb: 0.5, letterSpacing: 0.2, textAlign: "center" }}>
            Offer Accepted!
          </Typography>
          <Typography sx={{ fontSize: 14, color: "#166534", textAlign: "center", mt: 1.5, fontWeight: 500, maxWidth: 340, mx: "auto" }}>
            Congratulations! You are now officially hired for this job. The employer has been notified.
          </Typography>
          <Box sx={{ px: 3, pb: 3, pt: 3, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 2 }}>
            <Button onClick={handleClose} variant="outlined" sx={{ color: "#16a34a", borderColor: "#16a34a", fontWeight: 600, fontSize: 16, background: "#fff", borderRadius: 2, px: 4, '&:hover': { borderColor: "#166534", background: "#f1f5f9" } }}>Close</Button>
          </Box>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            minWidth: 500,
            maxWidth: 650,
            width: 650,
            boxShadow: 8,
            borderRadius: 3,
            overflow: "hidden"
          }
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            width: "100%",
            overflowX: "hidden"
          }}
        >
          <Box sx={{
            background: "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)",
            py: 4,
            px: 0,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            position: "relative",
            width: "100%",
            gap: 2
          }}>
            <Button onClick={handleClose} sx={{
              position: "absolute", top: 18, right: 18, minWidth: 0, width: 38, height: 38,
              borderRadius: "50%", color: "#16a34a", background: "#fff", zIndex: 2, boxShadow: 1,
              '&:hover': { background: "#f0fdf4" }
            }}>
              <svg width={22} height={22} viewBox="0 0 20 20" fill="none">
                <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
              </svg>
            </Button>
            <Box sx={{ flex: 1, minWidth: 0, ml: 4 }}>
              <Typography sx={{
                color: "#ffff", fontWeight: 700, fontSize: 22, mb: 0.5, letterSpacing: 0.2, textAlign: "left"
              }}>
                Offer Received!
              </Typography>
              <Typography sx={{
                fontSize: 15, color: "#eef1efff", textAlign: "left", mt: 0.5, fontWeight: 500, maxWidth: 340
              }}>
                Congratulations! You have received a job offer. Please review the details below.
              </Typography>
            </Box>
            <Box sx={{
              width: 100, height: 100, borderRadius: "50%", background: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center", boxShadow: 3, mr: 4, ml: 3
            }}>
              <Lottie animationData={offerAnim} style={{ width: 80, height: 80 }} loop={false} />
            </Box>
          </Box>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 3,
              minHeight: 220,
              position: "relative",
              background: "linear-gradient(90deg, #f0fdf4 0%, #f3e8ff 100%)",
              width: "100%",
              overflowX: "hidden"
            }}
          >
            {loading ? (
              <CircularProgress sx={{ color: "#22c55e", mt: 4 }} />
            ) : offer && (offer.start_date || offer.work_setup || offer.work_schedule || offer.custom_message || offer.contract_file_url) ? (
              <>
                <Box sx={{
                  border: "1.5px solid #bbf7d0", background: "#fff", boxShadow: 1, borderRadius: 3, mb: 2.5,
                  width: "100%", maxWidth: 500, p: 2.5, display: "flex", alignItems: "center", gap: 3, mx: "auto"
                }}>
                  <Box sx={{
                    width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center",
                    bgcolor: "#16a34a", borderRadius: "50%"
                  }}>
                    <Briefcase size={36} color="#fff" />
                  </Box>
                  <Box>
                    <Typography fontWeight={700} fontSize={22} color="#166534" sx={{ lineHeight: 1.2 }}>
                      {offer.applicant_name || offer.company_name || "Job Offer"}
                    </Typography>
                    <Typography variant="body2" color="#38bc87ff" sx={{ fontSize: 15, fontWeight: 500 }}>
                      {offer.job_title || ""}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{
                  mt: 3, width: "100%", maxWidth: 500, mx: "auto", background: "#fff", borderRadius: 3, boxShadow: 1, p: 3
                }}>
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: 16, color: "#22c55e", mb: 1 }}>Start Date</Typography>
                      <Typography sx={{ fontSize: 15, color: "#166534", mb: 1 }}>{offer.start_date || "-"}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: 16, color: "#22c55e", mb: 1 }}>Work Setup</Typography>
                      <Typography sx={{ fontSize: 15, color: "#166534", mb: 1 }}>{offer.work_setup || "-"}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: 16, color: "#22c55e", mb: 1 }}>Work Schedule</Typography>
                      <Typography sx={{ fontSize: 15, color: "#166534", mb: 1 }}>{offer.work_schedule || "-"}</Typography>
                    </Box>
                  </Box>
                  {offer.custom_message && (
                    <Box sx={{ mt: 2 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: 16, color: "#22c55e", mb: 1 }}>Message</Typography>
                      <Typography sx={{ fontSize: 15, color: "#166534", mb: 1 }}>{offer.custom_message}</Typography>
                    </Box>
                  )}
                  {offer.contract_file_url && (
                    <Button
                      variant="outlined"
                      sx={{
                        mt: 2, color: "#22c55e", borderColor: "#22c55e", fontWeight: 500, fontSize: 15, background: "#fff",
                        '&:hover': { borderColor: "#16a34a", background: "#dcfce7" }
                      }}
                      onClick={async () => {
                        const url = offer.contract_file_url
                        const parts = url.split("/storage/v1/object/public/")
                        if (parts.length < 2) {
                          window.open(url, "_blank")
                          return
                        }
                        const [bucket, ...pathArr] = parts[1].split("/")
                        const path = pathArr.join("/")
                        try {
                          const res = await fetch("/api/employers/get-signed-url", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ bucket, path })
                          })
                          const data = await res.json()
                          if (data.signedUrl) {
                            window.open(data.signedUrl, "_blank")
                          } else {
                            window.open(url, "_blank")
                          }
                        } catch {
                          window.open(url, "_blank")
                        }
                      }}
                    >
                      View Contract
                    </Button>
                  )}
                </Box>
                <Box sx={{
                  mt: 4,
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  width: "100%",
                  maxWidth: 500,
                  mx: "auto",
                  gap: 1
                }}>
                  <Button
                    onClick={handleClose}
                    variant="outlined"
                    sx={{
                      color: "#16a34a",
                      borderColor: "#16a34a",
                      fontWeight: 600,
                      fontSize: 14,
                      background: "#fff",
                      borderRadius: 2,
                      px: 2.5,
                      py: 1,
                      minWidth: 110,
                      minHeight: 38,
                      lineHeight: 1.1,
                      '&:hover': { borderColor: "#166534", background: "#f1f5f9" }
                    }}
                  >
                    Close
                  </Button>
                  <Tooltip title="Reject this job offer" arrow>
                    <span>
                      <Button
                        onClick={() => setRejectModal(true)}
                        variant="outlined"
                        sx={{
                          color: "#ef4444",
                          borderColor: "#ef4444",
                          fontWeight: 700,
                          fontSize: 14,
                          background: "#fff",
                          borderRadius: 2,
                          px: 2.5,
                          py: 1,
                          minWidth: 110,
                          minHeight: 38,
                          lineHeight: 1.1,
                          letterSpacing: 0.5,
                          '&:hover': { borderColor: "#991b1b", background: "#fef2f2" }
                        }}
                        disabled={rejecting}
                      >
                        REJECT<br />OFFER
                      </Button>
                    </span>
                  </Tooltip>
                  <Tooltip title="Accept this job offer to be succesfully hired for this job role!" arrow>
                    <span>
                      <Button
                        onClick={handleAcceptOffer}
                        variant="contained"
                        sx={{
                          background: "#22c55e",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: 14,
                          px: 2.5,
                          py: 1,
                          minWidth: 130,
                          minHeight: 38,
                          borderRadius: 2,
                          boxShadow: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          lineHeight: 1.1,
                          letterSpacing: 0.5,
                          '&:hover': { background: "#16a34a" }
                        }}
                        disabled={accepting}
                      >
                        <Briefcase size={16} style={{ marginRight: 6 }} />
                        ACCEPT<br />OFFER
                      </Button>
                    </span>
                  </Tooltip>
                </Box>
              </>
            ) : (
              <Typography sx={{ color: "#ef4444", fontWeight: 600, fontSize: 18, mt: 4 }}>
                {loading
                  ? "Loading offer..."
                  : "No offer found. If you believe this is an error, please contact your employer or refresh the page."}
              </Typography>
            )}
          </DialogContent>
        </DialogContent>
      </Dialog>
      <Dialog open={rejectModal} onClose={() => setRejectModal(false)}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningIcon sx={{ color: "#ef4444", mr: 1 }} />
          Reject Offer
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to reject this job offer? This action cannot be undone.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mt: 2, justifyContent: "flex-end" }}>
            <Button onClick={() => setRejectModal(false)} variant="outlined" color="inherit">
              Cancel
            </Button>
            <Button onClick={handleRejectOffer} variant="contained" color="error" disabled={rejecting}>
              {rejecting ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Reject Offer"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}
