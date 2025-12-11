"use client"
import { useState, forwardRef, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Slide,
  TextField,
  Typography,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
  Avatar,
  CircularProgress
} from "@mui/material"
import type { SlideProps } from "@mui/material"
import Lottie from "lottie-react"
import offerAnim from "../../../../../../../public/animations/offer-sent.json"
import { Confetti } from "@/components/magicui/confetti"
import { createClient } from '@supabase/supabase-js'

const SlideUp = forwardRef(function Transition(
  props: SlideProps,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export type JobPosting = {
  job_title?: string
  work_type?: string
  remote_options?: string
  pay_amount?: string
  pay_type?: string
  perks_and_benefits?: string[]
  location?: string
}

export type SendOfferModalProps = {
  open: boolean
  onClose: () => void
  initial?: {
    salary?: string
    start_date?: string
    notes?: string
    application_id?: string
    student_id?: string
    employer_id?: string
    company_name?: string
    applicant_name?: string
    job_title?: string
    job_postings?: JobPosting
    salary_type?: string
    work_setup?: string
    employment_type?: string
    work_location?: string
    work_schedule?: string
    bonuses?: string
    allowances?: string
    benefits?: string[]
    offer_expiry?: string
    offer_date?: string
    custom_message?: string
    contract_file_url?: string
    id?: string
  }
  editMode?: boolean
  onOfferSent?: (application_id: string) => void
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function SendOfferModal({
  open,
  onClose,
  initial,
  editMode,
  onOfferSent
}: SendOfferModalProps & { onOfferSent?: (application_id: string) => void }) {
  const [salary, setSalary] = useState("")
  const [startDate, setStartDate] = useState(initial?.start_date ?? "")
  const [notes] = useState(initial?.notes ?? "")
  const [saving, setSaving] = useState(false)
  const [employmentType, setEmploymentType] = useState(initial?.employment_type ?? "Full-time")
  const [workSetup, setWorkSetup] = useState(initial?.work_setup ?? "Onsite")
  const [workSchedule, setWorkSchedule] = useState(initial?.work_schedule ?? "")
  const [salaryType, setSalaryType] = useState("Monthly")
  const [bonuses, setBonuses] = useState<string[]>(
    initial?.bonuses
      ? initial.bonuses.split(",").map(s => s.trim()).filter(Boolean)
      : []
  );
  const [allowances, setAllowances] = useState<string[]>(
    initial?.allowances
      ? initial.allowances.split(",").map(s => s.trim()).filter(Boolean)
      : []
  );
  const [benefits, setBenefits] = useState(initial?.benefits ?? [])
  const [offerExpiry, setOfferExpiry] = useState(initial?.offer_expiry ?? "")
  const [customMessage, setCustomMessage] = useState(initial?.custom_message ?? "")
  const [contractFile, setContractFile] = useState<File | null>(null)
  const [salaryError, setSalaryError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [checkingMode, setCheckingMode] = useState(true)

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ]
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

  const benefitOptions = [
    { id: "training", label: "Free Training & Workshops - Skill development" },
    { id: "certification", label: "Certification Upon Completion - Proof of experience" },
    { id: "potential", label: "Potential Job Offer - Possible full-time employment" },
    { id: "transportation", label: "Transportation Allowance - Support for expenses" },
    { id: "mentorship", label: "Mentorship & Guidance - Hands-on learning" },
    { id: "flexible", label: "Flexible Hours - Adjusted schedules for students" },
  ]
  const [selectedBenefitIds, setSelectedBenefitIds] = useState<string[]>([])

  const typicalDayOptions = [
    { label: "Mon–Fri", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { label: "Mon–Sat", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
    { label: "All Week", days: daysOfWeek }
  ]
  const typicalTimeOptions = [
    { label: "9:00 AM–5:00 PM", start: "09:00", end: "17:00" },
    { label: "8:00 AM–6:00 PM", start: "08:00", end: "18:00" },
    { label: "10:00 AM–7:00 PM", start: "10:00", end: "19:00" }
  ]

  const salarySuggestions: Record<string, string[]> = {
    Monthly: ["₱8,000", "₱10,000", "₱12,000", "₱15,000", "₱20,000"],
    Annual: ["₱100,000", "₱150,000", "₱200,000", "₱250,000", "₱300,000"],
    Weekly: ["₱2,000", "₱2,500", "₱3,000", "₱4,000"],
    Daily: ["₱400", "₱500", "₱600", "₱800"],
    Hourly: ["₱50", "₱75", "₱100", "₱150"]
  }

  const validate = () => {
    let valid = true
    if (!salary) {
      setSalaryError("Salary is required")
      valid = false
    } else {
      setSalaryError(null)
    }
    if (!startDate) {
      setSalaryError("Start date is required")
      valid = false
    } else {
      setSalaryError(null)
    }
    return valid
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    let contract_file_url = null
    try {
      if (contractFile && initial?.application_id) {
        const fileExt = contractFile.name.split('.').pop()
        const jobTitle = (initial?.job_title || "Job").replace(/[^a-zA-Z0-9]/g, "_")
        const applicantName = (initial?.applicant_name || "Applicant").replace(/[^a-zA-Z0-9]/g, "_")
        const folderName = initial.application_id
        const fileName = `${jobTitle}_WORK_CONTRACT_FOR_${applicantName}.${fileExt}`
        const filePath = `${folderName}/${fileName}`
        const uploadResult = await supabase.storage
          .from('work.contracts')
          .upload(filePath, contractFile as Blob, { cacheControl: '3600', upsert: true })
        if (uploadResult.error) {
          setSalaryError("Failed to upload contract file")
          setSaving(false)
          alert("Failed to upload contract file: " + uploadResult.error.message)
          return
        }
        const urlResult = supabase.storage
          .from('work.contracts')
          .getPublicUrl(filePath)
        contract_file_url = urlResult.data.publicUrl
      }
      const selectedLabels = benefitOptions.filter(opt => selectedBenefitIds.includes(opt.id)).map(opt => opt.label)
      const allBenefits = [...selectedLabels, ...benefits]
      const payload: Record<string, unknown> = {
        salary,
        start_date: startDate,
        notes,
        application_id: initial?.application_id,
        student_id: initial?.student_id,
        employer_id: initial?.employer_id,
        company_name: initial?.company_name,
        applicant_name: initial?.applicant_name,
        job_title: initial?.job_title,
        salary_type: salaryType,
        work_setup: workSetup,
        employment_type: employmentType,
        work_schedule: workSchedule,
        bonuses: bonuses.join(", "),
        allowances: allowances.join(", "),
        benefits: allBenefits,
        offer_expiry: offerExpiry,
        offer_date: initial?.offer_date,
        custom_message: customMessage,
        contract_file_url
      }
      if (initial?.id) {
        payload.id = initial.id
      }
      const res = await fetch("/api/employers/applications/postJobOffer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const err = await res.json()
        setSalaryError(err.error || "Failed to send offer")
        setSaving(false)
        alert("Failed to send offer: " + (err.error || res.statusText))
        return
      }
      if (initial?.application_id) {
        if (editMode) {
          await fetch("/api/employers/applications/actions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              application_id: initial.application_id,
              action: "offer_updated",
              message: `Your job offer for   has been updated`
            })
          })
        } else {
          await fetch("/api/employers/applications/actions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              application_id: initial.application_id,
              action: "offer_sent"
            })
          })
        }
        onOfferSent?.(initial.application_id)
      }
      setSaving(false)
      setSuccess(true)
    } catch (e: unknown) {
      let message = "Unknown error"
      if (e instanceof Error) {
        message = e.message
      }
      setSalaryError(message)
      setSaving(false)
      alert("Error: " + message)
    }
  }

  const handleClose = () => {
    setSuccess(false)
    onClose?.()
  }

  const isUnchanged = () => {
    if (!editMode) return false
    if (
      salary !== (initial?.salary ?? "") ||
      startDate !== (initial?.start_date ?? "") ||
      employmentType !== (initial?.employment_type ?? "Full-time") ||
      workSetup !== (initial?.work_setup ?? "Onsite") ||
      workSchedule !== (initial?.work_schedule ?? "") ||
      salaryType !== (initial?.salary_type ?? "Monthly") ||
      offerExpiry !== (initial?.offer_expiry ?? "") ||
      customMessage !== (initial?.custom_message ?? "") ||
      bonuses.join(", ") !== (initial?.bonuses ?? "") ||
      allowances.join(", ") !== (initial?.allowances ?? "") ||
      JSON.stringify([...benefitOptions.filter(opt => selectedBenefitIds.includes(opt.id)).map(opt => opt.label), ...benefits]) !== JSON.stringify(initial?.benefits ?? [])
    ) return false
    return true
  }


  const handleViewContract = async () => {
    if (!initial?.contract_file_url) return
    try {
      const url = initial.contract_file_url
      const parts = url.split("/storage/v1/object/public/")
      if (parts.length < 2) return window.open(url, "_blank")
      const [bucket, ...pathArr] = parts[1].split("/")
      const path = pathArr.join("/")
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
      window.open(initial.contract_file_url, "_blank")
    }
  }

  const prevOpen = useRef<boolean>(false)
  const prevInitialId = useRef<string | undefined>(undefined)

  useEffect(() => {
    const shouldReset =
      (!prevOpen.current && open) ||
      (open && initial?.id && prevInitialId.current !== initial.id)
    if (shouldReset) {
      setSalary(initial?.salary ?? "")
      setEmploymentType(initial?.employment_type ?? "Full-time")
      setWorkSetup(initial?.work_setup ?? "Onsite")
      setSalaryType(initial?.salary_type ?? "Monthly")
      setOfferExpiry(initial?.offer_expiry ?? "")
      setCustomMessage(initial?.custom_message ?? "")
      setStartDate(initial?.start_date ?? "")
      setWorkSchedule(initial?.work_schedule ?? "")
      setBonuses(
        initial?.bonuses
          ? initial.bonuses.split(",").map(s => s.trim()).filter(Boolean)
          : []
      )
      setAllowances(
        initial?.allowances
          ? initial.allowances.split(",").map(s => s.trim()).filter(Boolean)
          : []
      )
      const incomingBenefits = initial?.benefits ?? []
      const mappedIds = benefitOptions
        .filter(opt => incomingBenefits.includes(opt.label) || incomingBenefits.includes(opt.id))
        .map(opt => opt.id)
      setSelectedBenefitIds(mappedIds)
      setBenefits(incomingBenefits.filter(b => !benefitOptions.some(opt => opt.label === b || opt.id === b)))
      if (initial?.work_schedule) {
        const [days, times] = initial.work_schedule.split(",")
        if (days) {
          if (days.includes("–")) {
            const [startDay, endDay] = days.split("–").map(d => d.trim())
            const startIdx = daysOfWeek.indexOf(startDay)
            const endIdx = daysOfWeek.indexOf(endDay)
            if (startIdx !== -1 && endIdx !== -1) {
              setSelectedDays(daysOfWeek.slice(startIdx, endIdx + 1))
            }
          } else {
            setSelectedDays(days.split("/").map(d => d.trim()))
          }
        }
        if (times) {
          const [start, end] = times.split("–").map(t => t.trim())
          setStartTime(start || "")
          setEndTime(end || "")
        }
      } else {
        setSelectedDays([])
        setStartTime("")
        setEndTime("")
      }
    }
    prevOpen.current = open
    prevInitialId.current = initial?.id
  }, [open, initial])

  useEffect(() => {
    if (selectedDays.length && startTime && endTime) {
      const daysStr = selectedDays.length === 1 ? selectedDays[0] : `${selectedDays[0]}–${selectedDays[selectedDays.length-1]}`
      setWorkSchedule(`${daysStr}, ${startTime}–${endTime}`)
    }
  }, [selectedDays, startTime, endTime])

  useEffect(() => {
    if (open) {
      setCheckingMode(true)
      setTimeout(() => setCheckingMode(false), 400)
    }
  }, [open])

  if (checkingMode) {
    return (
      <Dialog open={open} onClose={onClose} TransitionComponent={SlideUp}>
        <DialogContent className="flex flex-col items-center justify-center min-h-[320px] w-[400px]">
          <div className="w-full flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-gray-200 animate-pulse w-16 h-16" />
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
                <div className="h-4 bg-gray-100 rounded w-24 animate-pulse" />
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-2/3 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
            <div className="flex gap-2 mt-6">
              <div className="h-10 bg-gray-200 rounded w-1/2 animate-pulse" />
              <div className="h-10 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (success) {
    return (
      <Dialog open={true} onClose={onClose} TransitionComponent={SlideUp} PaperProps={{
        sx: {
          p: 0,
          minWidth: 700,
          maxWidth: 700,
          boxShadow: 8,
          background: "#fff",
          borderRadius: 3,
          overflow: "hidden"
        }
      }}>
        <Box sx={{ background: "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)", pt: 5, pb: 3, px: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <Button onClick={onClose} sx={{ position: "absolute", top: 18, right: 18, minWidth: 0, width: 38, height: 38, borderRadius: "50%", color: "#16a34a", background: "#fff", zIndex: 2, boxShadow: 1, '&:hover': { background: "#f0fdf4" } }}>
            <svg width={22} height={22} viewBox="0 0 20 20" fill="none">
              <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </Button>
          <Box sx={{ width: 120, height: 120, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: 3, mb: 2 }}>
            <Lottie animationData={offerAnim} style={{ width: 100, height: 100 }} loop={false} />
          </Box>
        </Box>
        <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 4, minHeight: 220, position: "relative", background: "linear-gradient(90deg, #f0fdf4 0%, #f3e8ff 100%)" }}>
          <Confetti style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 1400 }} options={{ particleCount: 120, spread: 360, ticks: 70, gravity: 0, decay: 0.94, startVelocity: 40, colors: ["#FACC15", "#FDE68A", "#A7F3D0", "#4ADE80", "#22D3EE"], shapes: ["star"] }} />
          <Box sx={{ border: "1.5px solid #bbf7d0", background: "#fff", boxShadow: 1, borderRadius: 3, mb: 2.5, width: "100%", maxWidth: 340, p: 2.5, display: "flex", alignItems: "center", gap: 2, mx: "auto" }}>
            <Avatar sx={{ width: 54, height: 54, fontWeight: 600, fontSize: 24, bgcolor: "#16a34a", mr: 2 }} src={undefined}>{initial?.applicant_name?.[0] || "?"}</Avatar>
            <Box>
              <Typography fontWeight={700} fontSize={18} color="#166534" sx={{ lineHeight: 1.2 }}>
                {initial?.applicant_name}
              </Typography>
              <Typography variant="body2" color="#6ee7b7" sx={{ fontSize: 13, fontWeight: 500 }}>
                {initial?.job_title}
              </Typography>
            </Box>
          </Box>
          <Typography sx={{ color: "#16a34a", fontWeight: 700, fontSize: 26, mb: 0.5, letterSpacing: 0.2, textAlign: "center" }}>
            {editMode ? "Offer Updated!" : "Offer Sent!"}
          </Typography>
          <Typography sx={{ fontSize: 14, color: "#166534", textAlign: "center", mt: 1.5, fontWeight: 500, maxWidth: 340, mx: "auto" }}>
            {editMode
              ? "Your changes have been saved and the applicant has been notified of the updated offer details."
              : "Congratulations! Your offer is on its way. We hope this is the start of something amazing for both of you."
            }
          </Typography>
          {initial?.contract_file_url && (
            <Button
              variant="outlined"
              sx={{ mt: 3, color: "#22c55e", borderColor: "#22c55e", fontWeight: 500, fontSize: 15, background: "#fff", '&:hover': { borderColor: "#16a34a", background: "#dcfce7" } }}
              onClick={handleViewContract}
            >
              View Contract
            </Button>
          )}
        </DialogContent>
        <Box sx={{ px: 3, pb: 3, pt: 0, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 2 }}>
          <Button onClick={handleClose} variant="outlined" sx={{ color: "#16a34a", borderColor: "#16a34a", fontWeight: 600, fontSize: 16, background: "#fff", borderRadius: 2, px: 4, '&:hover': { borderColor: "#166534", background: "#f1f5f9" } }}>Close</Button>
        </Box>
      </Dialog>
    )
  }


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={SlideUp}
      PaperProps={{
        sx: {
          p: 0,
          minWidth: 700,
          maxWidth: 700,
          width: 700,
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
                {editMode
                  ? `You’re about to edit your offer to ${initial?.applicant_name}. Update the fields below and save your changes.`
                  : `You’re about to send a new offer to ${initial?.applicant_name}. Fill out the fields below before sending.`}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ px: 4, pt: 3, pb: 1, background: '#f0fdf4', borderBottom: '1px solid #dcfce7' }}>
          <Typography sx={{ fontWeight: 700, fontSize: 20, color: '#16a34a' }}>
            {initial?.applicant_name || initial?.company_name || 'Applicant Name'}
          </Typography>
          <Typography sx={{ fontWeight: 500, fontSize: 16, color: '#166534', mt: 0.5 }}>
            {initial?.job_title || 'Job Title'}
          </Typography>
          <Typography sx={{ fontSize: 14, color: '#4ade80', mt: 0.5 }}>
            Offer Date: {initial?.offer_date ? initial.offer_date : new Date().toISOString().slice(0, 10)}
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
            <Typography sx={{ fontSize: 14, color: '#16a34a' }}>
              {employmentType}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ p: 4, pt: 3 }}>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#22c55e" }}>
                Work Setup
              </Typography>
              <Select
                fullWidth
                value={workSetup}
                onChange={e => setWorkSetup(e.target.value)}
                variant="outlined"
                sx={{ background: "#fff", borderRadius: 2, mb: 2, fontSize: 15, "& .MuiOutlinedInput-root": { fontSize: 15 } }}
              >
                <MenuItem value="Onsite">Onsite</MenuItem>
                <MenuItem value="Remote">Remote</MenuItem>
                <MenuItem value="Hybrid">Hybrid</MenuItem>
              </Select>
            </Box>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#22c55e" }}>
              Work Schedule
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <Select
                multiple
                value={selectedDays}
                onChange={e => setSelectedDays(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value as string[])}
                renderValue={selected => selected.join(', ')}
                sx={{ minWidth: 180, background: '#fff', borderRadius: 2 }}
              >
                {daysOfWeek.map(day => (
                  <MenuItem key={day} value={day}>
                    <Checkbox checked={selectedDays.indexOf(day) > -1} />
                    <ListItemText primary={day} />
                  </MenuItem>
                ))}
              </Select>
              <TextField
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                label="Start Time"
                InputLabelProps={{ shrink: true }}
                sx={{ background: '#fff', borderRadius: 2, minWidth: 120 }}
              />
              <TextField
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                label="End Time"
                InputLabelProps={{ shrink: true }}
                sx={{ background: '#fff', borderRadius: 2, minWidth: 120 }}
              />
            </Box>
              <Typography sx={{ fontSize: 13, color: '#16a34a', fontWeight: 500, mb: 0.5, mt: 1 }}>
               Suggestions
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              {typicalDayOptions.map(opt => (
                <Button
                  key={opt.label}
                  variant="outlined"
                  size="small"
                  sx={{ color: '#22c55e', borderColor: '#22c55e', fontWeight: 500, fontSize: 13, background: '#fff', '&:hover': { borderColor: '#16a34a', background: '#dcfce7' } }}
                  onClick={() => setSelectedDays(opt.days)}
                >
                  {opt.label}
                </Button>
              ))}
            </Box>
          
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              {typicalTimeOptions.map(opt => (
                <Button
                  key={opt.label}
                  variant="outlined"
                  size="small"
                  sx={{ color: '#22c55e', borderColor: '#22c55e', fontWeight: 500, fontSize: 13, background: '#fff', '&:hover': { borderColor: '#16a34a', background: '#dcfce7' } }}
                  onClick={() => { setStartTime(opt.start); setEndTime(opt.end); }}
                >
                  {opt.label}
                </Button>
              ))}
            </Box>
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#16a34a', mb: 2 }}>
            Compensation
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#22c55e" }}>
                Salary Offer <span style={{ color: "#ef4444", marginLeft: 4 }}>*</span>
              </Typography>
              <Select
                fullWidth
                value={salary}
                onChange={e => setSalary(e.target.value)}
                displayEmpty
                variant="outlined"
                sx={{ background: "#fff", borderRadius: 2, mb: 1, fontSize: 15, "& .MuiOutlinedInput-root": { fontSize: 15 } }}
                renderValue={selected => selected ? selected : "Enter or select salary offer"}
                MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
              >
                <MenuItem value="">
                  Custom...
                </MenuItem>
                {(/ojt|internship/i.test(employmentType)) && (
                  <MenuItem value="No pay">
                    No pay
                  </MenuItem>
                )}
                {salarySuggestions[salaryType]?.map(val => (
                  <MenuItem key={val} value={val}>{val}</MenuItem>
                ))}
              </Select>

              {salary === "" && (
                <TextField
                  fullWidth
                  value={salary}
                  onChange={e => setSalary(e.target.value)}
                  error={!!salaryError}
                  helperText={salaryError}
                  variant="outlined"
                  placeholder="Enter salary offer"
                  sx={{ background: "#fff", borderRadius: 2, fontSize: 15, "& .MuiOutlinedInput-root": { fontSize: 15 } }}
                  style={{ marginTop: 8 }}
                />
              )}
              {salary !== "" && (
                <TextField
                  fullWidth
                  value={salary}
                  onChange={e => setSalary(e.target.value)}
                  error={!!salaryError}
                  helperText={salaryError}
                  variant="outlined"
                  sx={{ background: "#fff", borderRadius: 2, fontSize: 15, "& .MuiOutlinedInput-root": { fontSize: 15 }, mt: 1 }}
                />
              )}
            </Box>
            {salary !== "No pay" && (
              <Box sx={{ width: 180 }}>
                <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#22c55e" }}>
                  Salary Type
                </Typography>
                <Select
                  fullWidth
                  value={salaryType}
                  onChange={e => setSalaryType(e.target.value)}
                  variant="outlined"
                  sx={{ background: "#fff", borderRadius: 2, mb: 2, fontSize: 15, "& .MuiOutlinedInput-root": { fontSize: 15 } }}
                >
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Annual">Annual</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Hourly">Hourly</MenuItem>
                </Select>
              </Box>
            )}
          </Box>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#22c55e" }}>
                Offer Expiry Date <span style={{ color: "#ef4444", marginLeft: 4 }}>*</span>
              </Typography>
              <TextField
                type="date"
                fullWidth
                value={offerExpiry}
                onChange={e => setOfferExpiry(e.target.value)}
                variant="outlined"
                sx={{ background: "#fff", borderRadius: 2, mb: 2, fontSize: 15, "& .MuiOutlinedInput-root": { fontSize: 15 } }}
                InputLabelProps={{ shrink: true }}
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
                variant="outlined"
                sx={{ background: "#fff", borderRadius: 2, mb: 2, fontSize: 15, "& .MuiOutlinedInput-root": { fontSize: 15 } }}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#22c55e" }}>
              Custom Message / Notes to Candidate
            </Typography>
            <TextField
              multiline
              minRows={2}
              fullWidth
              value={customMessage}
              onChange={e => setCustomMessage(e.target.value)}
              variant="outlined"
              placeholder="e.g., We’re excited to have you onboard. Please reach out if you have questions."
              sx={{ background: "#fff", borderRadius: 2, mb: 2, fontSize: 15, "& .MuiOutlinedInput-root": { fontSize: 15 } }}
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 14, mb: 1, color: "#22c55e" }}>
              Attach File (PDF contract)
            </Typography>
            <Button
              variant="outlined"
              component="label"
              sx={{ color: '#22c55e', borderColor: '#22c55e', fontWeight: 500, fontSize: 15, background: '#fff', '&:hover': { borderColor: '#16a34a', background: '#dcfce7' } }}
            >
              {contractFile ? contractFile.name : 'Upload PDF'}
              <input
                type="file"
                accept="application/pdf"
                hidden
                onChange={e => {
                  if (e.target.files && e.target.files[0]) setContractFile(e.target.files[0])
                }}
              />
            </Button>
            {editMode && initial?.contract_file_url && (
              <Box sx={{ mt: 1 }}>
                <span
                  style={{
                    color: "#22c55e",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: 15,
                    background: "none",
                    border: "none",
                    padding: 0
                  }}
                  onClick={handleViewContract}
                >
                  {initial.contract_file_url.split("/").pop()}
                </span>
              </Box>
            )}
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
              disabled={saving || !salary || !startDate || isUnchanged()}
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
              {saving ? (
                <>
                  <CircularProgress size={22} sx={{ color: '#fff', mr: 1 }} /> {editMode ? "Updating..." : "Sending..."}
                </>
              ) : (
                editMode ? "Edit Offer" : "Send Offer"
              )}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default SendOfferModal
