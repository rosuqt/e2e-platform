import { Dialog, DialogContent, Box, Typography, Button } from "@mui/material"
import { Progress } from "../components/progress"
import { Badge } from "../components/badge"
import { useRouter } from "next/navigation"

type Skill = {
  name?: string
  level?: string
  value?: number
}

type ViewSkillsModalProps = {
  open: boolean
  onClose: () => void
  skills: Skill[]
  expertise: Skill[]
}

export default function ViewSkillsModal({ open, onClose, skills, expertise }: ViewSkillsModalProps) {
  const router = useRouter()
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          p: 0,
          minWidth: 500,
          maxWidth: 600,
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
            <Typography sx={{ fontWeight: 600, fontSize: 22, color: "#fff", mb: 0.5 }}>
              All Expertise & Skills
            </Typography>
          </Box>
        </Box>
        <Box sx={{ p: 4, pt: 3 }}>
          <Typography sx={{ fontWeight: 500, fontSize: 17, color: "#2563eb", mb: 2 }}>
            Expertise
          </Typography>
          {expertise.length === 0 && (
            <Typography sx={{ color: "#64748b", fontSize: 15, mb: 2 }}>
              No expertise added yet.
            </Typography>
          )}
          {expertise.map((item, idx) => (
            <Box key={`expertise-modal-${idx}`} sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontWeight: 500, color: "#2563eb" }}>
                  {item.name}
                </Typography>
                {item.level && (
                  <Typography sx={{ fontSize: 13, color: "#38bdf8" }}>{item.level}</Typography>
                )}
              </Box>
              {item.value !== undefined && (
                <Progress value={item.value} className="h-1.5" />
              )}
            </Box>
          ))}
          <Typography sx={{ fontWeight: 500, fontSize: 17, color: "#2563eb", mt: 4, mb: 2 }}>
            Skills
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {(!skills || skills.length === 0) && (
              <Typography sx={{ color: "#64748b", fontSize: 15 }}>
                No skills added yet.
              </Typography>
            )}
            {skills && skills.map((item, idx) => (
              <Badge key={`skill-modal-${idx}`} className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">
                {typeof item === "string" ? item : item.name}
              </Badge>
            ))}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <Button
              variant="outlined"
              sx={{
                color: "#2563eb",
                borderColor: "#2563eb",
                "&:hover": { borderColor: "#1e40af", background: "#eff6ff" }
              }}
              onClick={() => router.push("/students/profile?tab=skills-tab")}
            >
              Update
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
