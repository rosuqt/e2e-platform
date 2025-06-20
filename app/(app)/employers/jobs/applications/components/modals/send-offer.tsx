"use client"
import { useState, forwardRef } from "react"
import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Slide,
  TextField,
  Typography
} from "@mui/material"
import type { SlideProps } from "@mui/material"
import Lottie from "lottie-react"
import offerAnim from "../../../../../../../public/animations/offer.json"

const SlideUp = forwardRef(function Transition(
  props: SlideProps,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />
})

type SendOfferModalProps = {
  open: boolean
  onClose?: () => void
  initial?: {
    salary?: string
    start_date?: string
    notes?: string
    application_id?: string
    student_id?: string
    employer_id?: string
    company_name?: string
  }
  editMode?: boolean
}

function SendOfferModal({
  open,
  onClose,
  initial,
  editMode,
  onOfferSent
}: SendOfferModalProps & { onOfferSent?: (application_id: string) => void }) {
  const [salary, setSalary] = useState(initial?.salary || "")
  const [startDate, setStartDate] = useState(initial?.start_date || "")
  const [notes, setNotes] = useState(initial?.notes || "")
  const [saving, setSaving] = useState(false)

  const [salaryError, setSalaryError] = useState<string | null>(null)
  const [dateError, setDateError] = useState<string | null>(null)

  const validate = () => {
    let valid = true
    if (!salary) {
      setSalaryError("Salary is required")
      valid = false
    } else {
      setSalaryError(null)
    }
    if (!startDate) {
      setDateError("Start date is required")
      valid = false
    } else {
      setDateError(null)
    }
    return valid
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    const payload = {
      salary,
      start_date: startDate,
      notes,
      application_id: initial?.application_id,
      student_id: initial?.student_id,
      employer_id: initial?.employer_id
    }
    await fetch("/api/employers/applications/sendOffer", {
      method: editMode ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    if (initial?.application_id) {
      await fetch("/api/employers/applications/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application_id: initial.application_id,
          action: "offer_sent"
        })
      })
      onOfferSent?.(initial.application_id)
    }
    setSaving(false)
    onClose?.()
  }

  const handleClose = () => {
    onClose?.()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={SlideUp}
      PaperProps={{
        sx: {
          p: 0,
          minWidth: 640,
          maxWidth: 900,
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
            background: "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)",
            p: 0,
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
              background: "rgba(22, 163, 74, 0.18)",
              zIndex: 2,
              "&:hover": { background: "rgba(22,163,74,0.28)" }
            }}
          >
            <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
              <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </Button>
          <Box sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 4,
            px: 4,
            py: 1
          }}>
            <Box sx={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Lottie animationData={offerAnim} style={{ width: 150, height: 150 }} loop={false} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 24, color: "#fff" }}>
                {editMode ? "Edit Offer" : "Send Offer"}
              </Typography>
              <Typography sx={{ color: "#dcfce7", fontSize: 14, mt: 1 }}>
                Fill out the offer details
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ p: 4, pt: 3 }}>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#22c55e" }}>
                Salary <span style={{ color: "#ef4444", marginLeft: 4 }}>*</span>
              </Typography>
              <TextField
                fullWidth
                value={salary}
                onChange={e => setSalary(e.target.value)}
                error={!!salaryError}
                helperText={salaryError}
                variant="outlined"
                placeholder="Enter salary offer"
                sx={{
                  background: "#fff",
                  borderRadius: 2,
                  mb: 2,
                  fontSize: 15,
                  "& .MuiOutlinedInput-root": { fontSize: 15 }
                }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#22c55e" }}>
                Start Date <span style={{ color: "#ef4444", marginLeft: 4 }}>*</span>
              </Typography>
              <TextField
                type="date"
                fullWidth
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                error={!!dateError}
                helperText={dateError}
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
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#22c55e" }}>
              Notes
            </Typography>
            <TextField
              multiline
              minRows={2}
              fullWidth
              value={notes}
              onChange={e => setNotes(e.target.value)}
              variant="outlined"
              placeholder="Add notes for the offer"
              sx={{
                background: "#fff",
                borderRadius: 2,
                mb: 2,
                fontSize: 15,
                "& .MuiOutlinedInput-root": { fontSize: 15 }
              }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, pt: 2 }}>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{
                flex: 1,
                color: "#22c55e",
                borderColor: "#22c55e",
                fontWeight: 500,
                fontSize: 15,
                background: "#fff",
                "&:hover": { borderColor: "#16a34a", background: "#dcfce7" }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !salary || !startDate}
              sx={{
                flex: 1,
                background: "#22c55e",
                color: "#fff",
                fontWeight: 500,
                fontSize: 16,
                px: 3,
                boxShadow: "none",
                letterSpacing: 1,
                "&:hover": { background: "#16a34a" }
              }}
            >
              {editMode ? "Update" : "Send Offer"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default SendOfferModal
