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
import { Heart, Award, Users, ShieldCheck, CheckCircle, Star } from "lucide-react"

const SlideUp = forwardRef(function Transition(
  props: SlideProps,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const coreValues = [
  {
    value: "Customer-Focused",
    icon: "Heart",
    iconColor: "#2563eb",
    paragraph: "We put our customers' needs at the center of everything we do, ensuring our solutions add real value."
  },
  {
    value: "Innovation",
    icon: "Award",
    iconColor: "#a855f7",
    paragraph: "We continuously explore new technologies and methods to stay ahead in a rapidly changing industry."
  },
  {
    value: "Collaboration",
    icon: "Users",
    iconColor: "#22c55e",
    paragraph: "We believe great things happen when diverse minds work together toward common goals."
  },
  {
    value: "Integrity",
    icon: "ShieldCheck",
    iconColor: "#facc15",
    paragraph: "We act with honesty and adhere to the highest standards of moral and ethical values."
  },
  {
    value: "Accountability",
    icon: "CheckCircle",
    iconColor: "#ef4444",
    paragraph: "We take responsibility for our actions and deliver on our commitments."
  },
  {
    value: "Excellence",
    icon: "Star",
    iconColor: "#ec4899",
    paragraph: "We strive for the highest quality in everything we do."
  }
]

const iconMap = {
  Heart: Heart,
  Award: Award,
  Users: Users,
  ShieldCheck: ShieldCheck,
  CheckCircle: CheckCircle,
  Star: Star
}

type AddCoreValueModalProps = {
  open: boolean
  onClose?: () => void
  onSave?: (data: {
    value: string
    icon: string
    iconColor: string
    paragraph: string
  }) => void
  initial?: {
    value: string
    icon: string
    iconColor: string
    paragraph: string
  } | null
  editMode?: boolean
  error?: string | null
}

export default function AddCoreValueModal({
  open,
  onClose,
  onSave,
  initial,
  editMode,
  error
}: AddCoreValueModalProps) {
  const [value, setValue] = useState(initial?.value || "")
  const [icon, setIcon] = useState(initial?.icon || "Heart")
  const [iconColor, setIconColor] = useState(initial?.iconColor || "#2563eb")
  const [paragraph, setParagraph] = useState(initial?.paragraph || "")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setValue(initial?.value || "")
    setIcon(initial?.icon || "Heart")
    setIconColor(initial?.iconColor || "#2563eb")
    setParagraph(initial?.paragraph || "")
  }, [initial, open])

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = coreValues.find(v => v.value === e.target.value)
    setValue(e.target.value)
    if (selected) {
      setIcon(selected.icon)
      setIconColor(selected.iconColor)
      setParagraph(selected.paragraph)
    } else {
      setParagraph("")
    }
  }

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIcon(e.target.value)
  }

  const handleIconColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIconColor(e.target.value)
  }

  const handleSave = () => {
    setSaving(true)
    onSave?.({ value, icon, iconColor, paragraph })
    setSaving(false)

  }

  const handleClose = () => {
    onClose?.()
  }

  const IconComponent = iconMap[icon as keyof typeof iconMap] || Heart

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
                {editMode ? "Edit Core Value" : "Add Core Value"}
              </Typography>
              <Typography sx={{ color: "#dbeafe", fontSize: 15 }}>
                Select a value and customize its details
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
                {value || "Core Value"}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
              Value
            </Typography>
            <TextField
              select
              fullWidth
              value={value}
              onChange={handleValueChange}
              variant="outlined"
              placeholder="Select Value"
              sx={{
                background: "#fff",
                borderRadius: 2,
                mb: 2,
                fontSize: 15,
                "& .MuiOutlinedInput-root": { fontSize: 15 }
              }}
            >
              <MenuItem value="" disabled>
                Select Value
              </MenuItem>
              {coreValues.map(v => (
                <MenuItem key={v.value} value={v.value}>{v.value}</MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#2563eb" }}>
              Description
            </Typography>
            <TextField
              multiline
              minRows={3}
              fullWidth
              value={paragraph}
              onChange={e => setParagraph(e.target.value)}
              variant="outlined"
              placeholder="Describe this core value"
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
                Icon Type
              </Typography>
              <TextField
                select
                fullWidth
                value={icon}
                onChange={handleIconChange}
                variant="outlined"
                sx={{
                  background: "#fff",
                  borderRadius: 2,
                  mb: 2,
                  fontSize: 15,
                  "& .MuiOutlinedInput-root": { fontSize: 15 }
                }}
              >
                <MenuItem value="Heart">Heart</MenuItem>
                <MenuItem value="Award">Award</MenuItem>
                <MenuItem value="Users">Users</MenuItem>
                <MenuItem value="ShieldCheck">Shield Check</MenuItem>
                <MenuItem value="CheckCircle">Check Circle</MenuItem>
                <MenuItem value="Star">Star</MenuItem>
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
                onChange={handleIconColorChange}
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
          {error && (
            <Typography sx={{ color: "#ef4444", mb: 2, fontSize: 14, fontWeight: 500 }}>
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
              disabled={!value || !paragraph || saving}
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
