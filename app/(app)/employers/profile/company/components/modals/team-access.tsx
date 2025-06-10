"use client"
import { useState, useEffect, forwardRef } from "react"
import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Typography,
  Avatar,
  Slide,
  TextField,
  MenuItem,
  CircularProgress
} from "@mui/material"
import type { SlideProps } from "@mui/material"
import { FiLock } from "react-icons/fi"

const SlideUp = forwardRef(function Transition(
  props: SlideProps,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />
})

type TeamMember = {
  id: string
  name: string
  email: string
  canEdit: boolean
  canView: boolean
  avatarUrl?: string | null
  isAdmin?: boolean
}

type TeamAccessModalProps = {
  open: boolean
  onClose?: () => void
  companyId: string
}

const generalAccessOptions = [
  { value: "restricted", label: "Restricted" },
  { value: "company", label: "Anyone in the company" }
]

export default function TeamAccessModal({
  open,
  onClose,
  companyId
}: TeamAccessModalProps) {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [generalAccess, setGeneralAccess] = useState("restricted")

  async function getSignedUrlIfNeeded(img: string | undefined | null, bucket: string): Promise<string | null> {
    if (!img) return null
    if (/^https?:\/\//.test(img)) return img
    const res = await fetch("/api/employers/get-signed-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bucket, path: img }),
    })
    if (!res.ok) return null
    const { signedUrl } = await res.json()
    return signedUrl || null
  }

  useEffect(() => {
    if (!open) return
    setLoading(true)
    fetch(`/api/employers/company-profile/team-access?company_id=${companyId}`)
      .then(res => res.json())
      .then(async data => {
        const membersWithAvatars = await Promise.all(
          (data.members || []).map(async (member: TeamMember) => {
            let avatarUrl = member.avatarUrl
            if (avatarUrl) {
              avatarUrl = await getSignedUrlIfNeeded(avatarUrl, "user.avatars")
            }
            return { ...member, avatarUrl }
          })
        )
        setMembers(membersWithAvatars)
        setGeneralAccess(data.profile_access || "restricted")
      })
      .finally(() => setLoading(false))
  }, [open, companyId])

  const handleSave = async () => {
    setSaving(true)
    await fetch("/api/employers/company-profile/team-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_id: companyId, members, generalAccess }),
    })
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
          minWidth: 520, 
          maxWidth: 520,
          borderRadius: 3,
          overflow: "hidden",
          background: "#fff"
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 0 }}>
          <Box sx={{ p: 3, pb: 2, borderBottom: "1px solid #e5e7eb" }}>
            <Typography sx={{ fontWeight: 600, fontSize: 20, mb: 0.5 }}>
              Manage Edit Access for Company Profile
            </Typography>
            <TextField
              fullWidth
              placeholder="Add people, groups, and calendar events"
              variant="outlined"
              size="small"
              sx={{
                mt: 2,
                background: "#f8fafc",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": { fontSize: 15 }
              }}
            />
          </Box>
          <Box sx={{ p: 3, pt: 2, borderBottom: "1px solid #e5e7eb" }}>
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 2, color: "#64748b" }}>
              Team Members
            </Typography>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 80 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <Box>
                {members.map(member => (
                  <Box
                    key={member.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5, 
                      mb: 1.2,
                      px: 1.5, 
                      py: 0.5,
                      borderRadius: 2,
                      background: "#f8fafc",
                      boxShadow: "0 1px 2px rgba(16,30,54,0.04)",
                      minHeight: 48
                    }}
                  >
                    <Avatar
                      src={member.avatarUrl || undefined}
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "#2563eb",
                        fontWeight: 600,
                        fontSize: 15
                      }}
                    >
                      {member.name?.[0]?.toUpperCase() || "U"}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight={600} fontSize={14} color="#1e293b">
                        {member.name}
                        {member.isAdmin && (
                          <Typography component="span" sx={{ ml: 1, fontWeight: 400, fontSize: 12, color: "#2563eb" }}>
                            (Owner)
                          </Typography>
                        )}
                      </Typography>
                      <Typography fontSize={12} color="#64748b">
                        {member.email}
                      </Typography>
                    </Box>
                    {!member.isAdmin && (
                      <TextField
                        select
                        size="small"
                        value={member.canEdit ? "editor" : member.canView ? "viewer" : "none"}
                        onChange={e => {
                          const val = e.target.value
                          setMembers(members =>
                            members.map(m =>
                              m.id === member.id
                                ? {
                                    ...m,
                                    canEdit: val === "editor",
                                    canView: val === "editor" || val === "viewer"
                                  }
                                : m
                            )
                          )
                        }}
                        sx={{
                          minWidth: 90,
                          background: "#f1f5f9",
                          borderRadius: 2,
                          fontSize: 13,
                          "& .MuiOutlinedInput-root": { fontSize: 13 }
                        }}
                      >
                        <MenuItem value="viewer">Viewer</MenuItem>
                        <MenuItem value="editor">Editor</MenuItem>
                      </TextField>
                    )}
                    {member.isAdmin && (
                      <Typography sx={{ fontSize: 12, color: "#64748b", ml: 1 }}>
                        Owner
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          <Box sx={{ p: 3, pt: 2, borderBottom: "1px solid #e5e7eb" }}>
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 2, color: "#64748b" }}>
              General access
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <FiLock size={20} color="#64748b" />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  select
                  variant="standard"
                  size="small"
                  value={generalAccess}
                  onChange={e => setGeneralAccess(e.target.value)}
                  sx={{
                    minWidth: 0,
                    background: "none",
                    borderRadius: 0,
                    fontSize: 14,
                    "& .MuiInputBase-root": {
                      fontSize: 14,
                      background: "none",
                      borderRadius: 0,
                      px: 0,
                      py: 0
                    },
                    "& .MuiInput-underline:before, & .MuiInput-underline:after": {
                      borderBottom: "none"
                    },
                    "& .MuiSelect-select": {
                      paddingLeft: 0,
                      paddingRight: 2,
                      color: "#334155"
                    }
                  }}
                  InputProps={{
                    disableUnderline: true
                  }}
                >
                  {generalAccessOptions.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
                <Typography fontSize={12} color="#64748b">
                  {generalAccess === "company"
                    ? "Anyone from the company can edit the company profile"
                    : "Only people with access can edit the company profile"}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ p: 3, display: "flex", gap: 2, alignItems: "center" }}>
            <Button
              variant="outlined"
              sx={{
                flex: 1,
                color: "#2563eb",
                borderColor: "#2563eb",
                fontWeight: 500,
                fontSize: 15,
                background: "#fff",
                "&:hover": { borderColor: "#1e40af", background: "#f1f5f9" }
              }}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
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
              Done
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
