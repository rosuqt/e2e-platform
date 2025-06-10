"use client"
import { useState, useEffect, forwardRef } from "react"
import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Avatar,
  Slide,
  TextField,
  Typography,
  MenuItem
} from "@mui/material"
import type { SlideProps } from "@mui/material"
import { Award, Star, Trophy, Medal, ThumbsUp, Rocket } from "lucide-react"

const SlideUp = forwardRef(function Transition(
  props: SlideProps,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const achievementIcons = [
  { label: "Award", value: "Award", icon: Award },
  { label: "Star", value: "Star", icon: Star },
  { label: "Trophy", value: "Trophy", icon: Trophy },
  { label: "Medal", value: "Medal", icon: Medal },
  { label: "Thumbs Up", value: "ThumbsUp", icon: ThumbsUp },
  { label: "Rocket", value: "Rocket", icon: Rocket }
]

const iconMap = {
  Award,
  Star,
  Trophy,
  Medal,
  ThumbsUp,
  Rocket
}

type Achievement = {
  title: string
  icon: string
  iconColor: string
  description: string
  issuer: string
  year: string
}

type AddAchievementModalProps = {
  open: boolean
  onClose?: () => void
  onSave?: (data: {
    title: string
    icon: string
    iconColor: string
    description: string
    issuer: string
    year: string
  }) => void
  initial?: {
    title: string
    icon: string
    iconColor: string
    description: string
    issuer: string
    year: string
  } | null
  editMode?: boolean
}

export default function AddAchievementModal({
  open,
  onClose,
  onSave,
  initial,
  editMode
}: AddAchievementModalProps) {
  const [title, setTitle] = useState(initial?.title || "")
  const [icon, setIcon] = useState(initial?.icon || "Award")
  const [iconColor, setIconColor] = useState(initial?.iconColor || "#2563eb")
  const [description, setDescription] = useState(initial?.description || "")
  const [issuer, setIssuer] = useState(initial?.issuer || "")
  const [year, setYear] = useState(initial?.year || "")
  const [saving, setSaving] = useState(false)
  const [yearError, setYearError] = useState<string | null>(null)
  const [duplicateError, setDuplicateError] = useState<string | null>(null)

  useEffect(() => {
    setTitle(initial?.title || "")
    setIcon(initial?.icon || "Award")
    setIconColor(initial?.iconColor || "#2563eb")
    setDescription(initial?.description || "")
    setIssuer(initial?.issuer || "")
    setYear(initial?.year || "")
    setYearError(null)
  }, [initial, open])

  function validateYear(val: string) {
    if (!val) return "Year is required"
    if (!/^\d{4}$/.test(val)) return "Year must be a 4-digit number"
    const num = parseInt(val, 10)
    const current = new Date().getFullYear()
    if (num < 1900 || num > current + 1) return `Year must be between 1900 and ${current + 1}`
    return null
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const win = window as unknown as { __ACHIEVEMENTS__?: Achievement[] }
      win.__ACHIEVEMENTS__ = win.__ACHIEVEMENTS__ || []
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const win = window as unknown as { __ACHIEVEMENTS__?: Achievement[] }
      if (Array.isArray(win.__ACHIEVEMENTS__)) {
        if (open && onSave) {
          win.__ACHIEVEMENTS__ = win.__ACHIEVEMENTS__
        }
      }
    }
  }, [open, onSave])

  const handleSave = async () => {
    const yerr = validateYear(year)
    setYearError(yerr)
    setDuplicateError(null)
    if (yerr) return
    setSaving(true)
    try {
      if (onSave) {
        await Promise.resolve(onSave({ title, icon, iconColor, description, issuer, year }))
      }
    } catch (err) {
      const error = err as { message?: string }
      if (error?.message?.includes("Achievement already exists")) {
        setDuplicateError("This achievement already exists.")
        setSaving(false)
        return
      }
      setDuplicateError("Failed to save achievement.")
      setSaving(false)
      return
    }
    setSaving(false)
    onClose?.()
  }

  const IconComponent = iconMap[icon as keyof typeof iconMap] || Award

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
          minWidth: 540,
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
              <IconComponent size={28} color="#fff" />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: 22, color: "#fff" }}>
                {editMode ? "Edit Achievement" : "Add Achievement"}
              </Typography>
              <Typography sx={{ color: "#dbeafe", fontSize: 15 }}>
                Enter achievement details
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ p: 4, pt: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: iconColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <IconComponent size={28} color="#fff" />
            </Avatar>
            <Box>
              <Typography fontWeight={600} fontSize={18} color="#1e293b">
                {title || "Achievement Title"}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
              Title
            </Typography>
            <TextField
              fullWidth
              value={title}
              onChange={e => setTitle(e.target.value)}
              variant="outlined"
              placeholder="Achievement Title"
              sx={{
                background: "#fff",
                borderRadius: 2,
                mb: 2,
                fontSize: 15,
                "& .MuiOutlinedInput-root": { fontSize: 15 }
              }}
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
              Description
            </Typography>
            <TextField
              multiline
              minRows={3}
              fullWidth
              value={description}
              onChange={e => setDescription(e.target.value)}
              variant="outlined"
              placeholder="Describe this achievement"
              sx={{
                background: "#fff",
                borderRadius: 2,
                mb: 2,
                fontSize: 15,
                "& .MuiOutlinedInput-root": { fontSize: 15 }
              }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
                Issuer
              </Typography>
              <TextField
                fullWidth
                value={issuer}
                onChange={e => setIssuer(e.target.value)}
                variant="outlined"
                placeholder="Awarded by"
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
              <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
                Year
              </Typography>
              <TextField
                fullWidth
                value={year}
                onChange={e => {
                  setYear(e.target.value)
                  setYearError(null)
                }}
                variant="outlined"
                placeholder="Year"
                error={!!yearError}
                helperText={yearError}
                sx={{
                  background: "#fff",
                  borderRadius: 2,
                  mb: 2,
                  fontSize: 15,
                  "& .MuiOutlinedInput-root": { fontSize: 15 }
                }}
              />
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
                Icon Type
              </Typography>
              <TextField
                select
                fullWidth
                value={icon}
                onChange={e => setIcon(e.target.value)}
                variant="outlined"
                sx={{
                  background: "#fff",
                  borderRadius: 2,
                  mb: 2,
                  fontSize: 15,
                  "& .MuiOutlinedInput-root": { fontSize: 15 }
                }}
              >
                {achievementIcons.map(ic => (
                  <MenuItem key={ic.value} value={ic.value}>{ic.label}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
                Icon Color
              </Typography>
              <TextField
                select
                fullWidth
                value={iconColor}
                onChange={e => setIconColor(e.target.value)}
                variant="outlined"
                sx={{
                  background: "#fff",
                  borderRadius: 2,
                  mb: 2,
                  fontSize: 15,
                  "& .MuiOutlinedInput-root": { fontSize: 15 }
                }}
              >
                <MenuItem value="#2563eb">Blue</MenuItem>
                <MenuItem value="#a855f7">Purple</MenuItem>
                <MenuItem value="#22c55e">Green</MenuItem>
                <MenuItem value="#facc15">Yellow</MenuItem>
                <MenuItem value="#ef4444">Red</MenuItem>
                <MenuItem value="#64748b">Gray</MenuItem>
                <MenuItem value="#ec4899">Pink</MenuItem>
              </TextField>
            </Box>
          </Box>
          {duplicateError && (
            <Typography sx={{ color: "#ef4444", mb: 2, fontSize: 14 }}>
              {duplicateError}
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
              disabled={!title || !description || !issuer || !year || saving}
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
              {editMode ? "Update" : "Save"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
