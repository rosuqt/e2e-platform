"use client"
import { useState, forwardRef, useEffect } from "react"
import {
  DialogContent,
  Button,
  Box,
  Slide,
  TextField,
  Typography,
  MenuItem,
  Avatar,
  Select,
  Checkbox,
  ListItemText,
  CircularProgress
} from "@mui/material"
import type { SlideProps } from "@mui/material"
import { MapPin, Video } from "lucide-react"
import Lottie from "lottie-react"
import interviewSchedAnim from "../../../../../../../public/animations/interview-sched.json"
import DialogMui from "@mui/material/Dialog"

const SlideUp = forwardRef(function Transition(
  props: SlideProps,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const platforms = [
  { label: "Zoom", value: "Zoom" },
  { label: "Google Meet", value: "Google Meet" },
  { label: "Microsoft Teams", value: "Microsoft Teams" },
  { label: "Skype", value: "Skype" },
  { label: "Other", value: "Other" }
]

type Colleague = {
  id?: string
  first_name: string
  last_name: string
  email?: string
  company_admin?: boolean
  profile_img?: string
  avatarUrl?: string
}

type InterviewScheduleModalProps = {
  open: boolean
  onClose?: () => void
  initial?: {
    id?: string
    mode?: string
    platform?: string
    address?: string
    team?: string[]
    date?: string
    time?: string
    notes?: string
    summary?: string
    application_id?: string
    student_id?: string
    employer_id?: string
    company_name?: string
    status?: string
  }
  editMode?: boolean
}

function InterviewScheduleModal({
  open,
  onClose,
  initial,
  editMode,
  onInterviewScheduled
}: InterviewScheduleModalProps & { onInterviewScheduled?: (application_id: string) => void }) {
  const [mode, setMode] = useState(initial?.mode || "Online")
  const [platform, setPlatform] = useState(initial?.platform || "")
  const [address, setAddress] = useState(initial?.address || "")
  const [teamInput] = useState("")
  const [team, setTeam] = useState<string[]>(initial?.team || [])
  const [allColleagues, setAllColleagues] = useState<Colleague[]>([])
  const [, setFilteredColleagues] = useState<Colleague[]>([])
  const [, setTeamLoading] = useState(false)
  const [date, setDate] = useState(initial?.date || "")
  const [time, setTime] = useState(initial?.time || "")
  const [notes, setNotes] = useState(initial?.notes || "")
  const [summary, setSummary] = useState(initial?.summary || "")
  const [saving, setSaving] = useState(false)
  const [companyName, setCompanyName] = useState<string>(initial?.company_name || "")
  const [status] = useState(initial?.status || "Pending")

  const [dateError, setDateError] = useState<string | null>(null)
  const [timeError, setTimeError] = useState<string | null>(null)
  const [locationOptions, setLocationOptions] = useState<{ address: string; label: string }[]>([])

  useEffect(() => {
    if (!companyName && initial?.employer_id) {
      fetch(`/api/employers/colleagues/fetchCompanyName?employer_id=${initial.employer_id}`)
        .then(res => res.json())
        .then(data => {
          if (data.company_name) setCompanyName(data.company_name)
        })
    }
  }, [initial?.company_name, initial?.employer_id, companyName])

  useEffect(() => {
    if (!open) return
    setTeamLoading(true)
    if (!companyName) {
      setAllColleagues([])
      setFilteredColleagues([])
      setTeamLoading(false)
      return
    }
    fetch(`/api/employers/colleagues/fetchByCompany?company_name=${encodeURIComponent(companyName)}&_=${Date.now()}`)
      .then(res => res.json())
      .then(async json => {
        const colleagues: Colleague[] = Array.isArray(json.data) ? json.data : json.data ? [json.data] : []
        let currentUserEmail = undefined
        try {
          const sessionRes = await fetch("/api/auth/session")
          const sessionData = await sessionRes.json()
          currentUserEmail = sessionData?.user?.email
        } catch {}
        const filteredColleagues = colleagues.filter(u => u.email && u.email !== currentUserEmail)
        const withAvatars = await Promise.all(
          filteredColleagues.map(async (u) => {
            let profile_img = u.profile_img
            if (!profile_img && u.id) {
              try {
                const res = await fetch(`/api/employers/colleagues/fetchByCompany?employer_id=${u.id}`)
                const json = await res.json()
                profile_img = json.profile_img
              } catch {}
            }
            if (profile_img) {
              try {
                const urlRes = await fetch(`/api/employers/get-signed-url?bucket=user.avatars&path=${encodeURIComponent(profile_img)}`)
                const urlJson = await urlRes.json()
                return { ...u, avatarUrl: urlJson.signedUrl || undefined }
              } catch {
                return { ...u, avatarUrl: undefined }
              }
            }
            return { ...u, avatarUrl: undefined }
          })
        )
        setAllColleagues(withAvatars)
        setFilteredColleagues(withAvatars)
        setTeamLoading(false)
      })
      .catch(() => {
        setAllColleagues([])
        setFilteredColleagues([])
        setTeamLoading(false)
      })
  }, [companyName, open])

  useEffect(() => {
    if (mode === "Onsite" && initial?.employer_id) {
      fetch("/api/employers/post-a-job/fetchAddress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employer_id: initial.employer_id }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.addresses && Array.isArray(data.addresses)) {
            setLocationOptions(data.addresses)
            if (!address && data.addresses.length > 0) {
              setAddress(data.addresses[0].address)
            }
          }
        })
        .catch(() => {})
    }
  }, [mode, initial?.employer_id, address])

  useEffect(() => {
    if (!teamInput) {
      setFilteredColleagues(allColleagues)
      return
    }
    setFilteredColleagues(
      allColleagues.filter(
        c =>
          (c.first_name + " " + c.last_name)
            .toLowerCase()
            .includes(teamInput.toLowerCase())
      )
    )
  }, [teamInput, allColleagues])

  useEffect(() => {
    if (!open) return
    setMode(initial?.mode || "Online")
    setPlatform(initial?.platform || "")
    setAddress(initial?.address || "")
    setTeam(initial?.team || [])
    setDate(initial?.date || "")
    setTime(initial?.time || "")
    setNotes(initial?.notes || "")
    setSummary(initial?.summary || "")
  }, [
    open,
    initial?.mode,
    initial?.platform,
    initial?.address,
    initial?.team,
    initial?.date,
    initial?.time,
    initial?.notes,
    initial?.summary
  ])

  const validateDateTime = (d: string, t: string) => {
    if (!d) {
      setDateError("Date is required")
      return false
    }
    if (!t) {
      setTimeError("Time is required")
      return false
    }
    const now = new Date()
    const selected = new Date(`${d}T${t}`)
    if (selected < now) {
      setDateError("Date and time must be in the future")
      setTimeError("Date and time must be in the future")
      return false
    }
    setDateError(null)
    setTimeError(null)
    return true
  }

  const handleSave = async () => {
    const valid = validateDateTime(date, time)
    if (!valid) return
    setSaving(true)
    const payload = {
      mode,
      platform,
      address,
      team,
      date,
      time,
      notes,
      summary,
      application_id: initial?.application_id,
      student_id: initial?.student_id,
      employer_id: initial?.employer_id,
      status
    }
    if (editMode && initial?.application_id) {
      await fetch(`/api/employers/applications/postInterviewSched`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, id: initial.id })
      })
    } else {
      await fetch("/api/employers/applications/postInterviewSched", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
    }
    if (initial?.application_id) {
      await fetch("/api/employers/applications/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application_id: initial.application_id,
          action: "interview_scheduled"
        })
      })
      onInterviewScheduled?.(initial.application_id)
    }
    setSaving(false)
    onClose?.()
  }

  const handleClose = () => {
    onClose?.()
  }

  return (
    <DialogMui
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
      hideBackdrop={false}
      disableEnforceFocus={false}
      disableAutoFocus={false}
      disableRestoreFocus={false}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box
          sx={{
            background: "linear-gradient(90deg, #a855f7 0%, #6366f1 100%)",
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
              background: "rgba(30, 41, 59, 0.18)",
              zIndex: 2,
              "&:hover": { background: "rgba(30,41,59,0.28)" }
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
              <Lottie animationData={interviewSchedAnim} style={{ width: 150, height: 150 }} loop={false} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 24, color: "#fff" }}>
                {editMode ? "Edit Interview" : "Schedule Interview"}
              </Typography>
              <Typography sx={{ color: "#ede9fe", fontSize: 14, mt: 1 }}>
                Set up interview details
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ p: 4, pt: 3 }}>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#a855f7", display: "flex", alignItems: "center" }}>
                Interview Mode <span style={{ color: "#ef4444", marginLeft: 4 }}>*</span>
              </Typography>
              <TextField
                select
                fullWidth
                value={mode}
                onChange={e => setMode(e.target.value)}
                variant="outlined"
                sx={{
                  background: "#fff",
                  borderRadius: 2,
                  mb: 2,
                  fontSize: 15,
                  "& .MuiOutlinedInput-root": { fontSize: 15 }
                }}
              >
                <MenuItem value="Online">
                  <Video className="inline-block mr-2" size={16} /> Online
                </MenuItem>
                <MenuItem value="Onsite">
                  <MapPin className="inline-block mr-2" size={16} /> Onsite
                </MenuItem>
              </TextField>
            </Box>
            <Box sx={{ flex: 1 }}>
              {mode === "Online" ? (
                <>
                  <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#a855f7", display: "flex", alignItems: "center" }}>
                    Platform <span style={{ color: "#ef4444", marginLeft: 4 }}>*</span>
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    value={platform}
                    onChange={e => setPlatform(e.target.value)}
                    variant="outlined"
                    sx={{
                      background: "#fff",
                      borderRadius: 2,
                      mb: 2,
                      fontSize: 15,
                      "& .MuiOutlinedInput-root": { fontSize: 15 }
                    }}
                  >
                    {platforms.map(p => (
                      <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
                    ))}
                  </TextField>
                </>
              ) : (
                <>
                  <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#a855f7", display: "flex", alignItems: "center" }}>
                    Address <span style={{ color: "#ef4444", marginLeft: 4 }}>*</span>
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    variant="outlined"
                    placeholder="Select onsite address"
                    sx={{
                      background: "#fff",
                      borderRadius: 2,
                      mb: 2,
                      fontSize: 15,
                      "& .MuiOutlinedInput-root": { fontSize: 15 }
                    }}
                  >
                    {locationOptions.map(opt => (
                      <MenuItem key={opt.address} value={opt.address}>
                        {opt.label ? `${opt.label} - ${opt.address}` : opt.address}
                      </MenuItem>
                    ))}
                  </TextField>
                </>
              )}
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#a855f7", display: "flex", alignItems: "center" }}>
                Date <span style={{ color: "#ef4444", marginLeft: 4 }}>*</span>
              </Typography>
              <TextField
                type="date"
                fullWidth
                value={date}
                onChange={e => setDate(e.target.value)}
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
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#a855f7", display: "flex", alignItems: "center" }}>
                Time <span style={{ color: "#ef4444", marginLeft: 4 }}>*</span>
              </Typography>
              <TextField
                type="time"
                fullWidth
                value={time}
                onChange={e => setTime(e.target.value)}
                error={!!timeError}
                helperText={timeError}
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
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#a855f7", display: "flex", alignItems: "center" }}>
              Invite Team Members
            </Typography>
            <Select
              multiple
              fullWidth
              displayEmpty
              value={team}
              onChange={e => setTeam(typeof e.target.value === "string" ? e.target.value.split(",") : e.target.value as string[])}
              renderValue={selected => {
                if ((selected as string[]).length === 0) {
                  return <span style={{ color: "#888" }}>Select team members</span>
                }
                return (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    {(selected as string[]).map(email => (
                      <span key={email}>{email}</span>
                    ))}
                  </Box>
                )
              }}
              sx={{
                background: "#fff",
                borderRadius: 2,
                mb: 1,
                fontSize: 15,
                "& .MuiOutlinedInput-root": { fontSize: 15 }
              }}
            >
              {allColleagues.map(option => (
                <MenuItem key={option.email} value={option.email}>
                  <Checkbox checked={team.indexOf(option.email ?? "") > -1} />
                  <Avatar src={option.avatarUrl || undefined} sx={{ width: 28, height: 28, mr: 1.5 }}>
                    {option.first_name?.[0]}
                  </Avatar>
                  <ListItemText primary={`${option.first_name} ${option.last_name}`} secondary={option.email} />
                </MenuItem>
              ))}
            </Select>

            {team.length > 0 && (
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
                {team.map(email => {
                  const member = allColleagues.find(c => c.email === email)
                  return (
                    <Box
                      key={email}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        background: "#f3f4f6",
                        border: "1px solid #e5e7eb",
                        minWidth: 0,
                        maxWidth: 220,
                      }}
                    >
                      <Avatar
                        src={member?.avatarUrl || undefined}
                        sx={{ width: 28, height: 28, mr: 1 }}
                      >
                        {member?.first_name?.[0]}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#222", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {member ? `${member.first_name} ${member.last_name}` : email}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: "#666", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {email}
                        </Typography>
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            )}
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#a855f7" }}>
              Interview Notes
            </Typography>
            <TextField
              multiline
              minRows={2}
              fullWidth
              value={notes}
              onChange={e => setNotes(e.target.value)}
              variant="outlined"
              placeholder="Add notes for the interview"
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
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#a855f7" }}>
              Interview Summary
            </Typography>
            <TextField
              multiline
              minRows={2}
              fullWidth
              value={summary}
              onChange={e => setSummary(e.target.value)}
              variant="outlined"
              placeholder="Summary or agenda for the interview"
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
                color: "#a855f7",
                borderColor: "#a855f7",
                fontWeight: 500,
                fontSize: 15,
                background: "#fff",
                "&:hover": { borderColor: "#7c3aed", background: "#f3e8ff" }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !date || !time || (mode === "Online" ? !platform : !address)}
              sx={{
                flex: 1,
                background: "#a855f7",
                color: "#fff",
                fontWeight: 500,
                fontSize: 16,
                px: 3,
                boxShadow: "none",
                letterSpacing: 1,
                "&:hover": { background: "#7c3aed" }
              }}
            >
              {saving ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                  <CircularProgress size={22} sx={{ color: '#fff' }} />
                </Box>
              ) : (
                editMode ? "Update" : "Schedule"
              )}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </DialogMui>
  )
}

export default InterviewScheduleModal