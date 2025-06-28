import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Avatar from "@mui/material/Avatar"
import { User, Mail, Phone, Building, Calendar, Briefcase, MapPin } from "lucide-react"
import { PiSubtitlesBold } from "react-icons/pi"
import { StatusBadge } from "../page"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useEffect, useState } from "react"

interface Employer {
  id: number
  employerId: string
  name: string
  email: string
  phone: string
  company: string
  position: string
  status: "active" | "inactive" | "suspended" | "pending"
  registrationDate: string
  location: string
  employeesCount: number
  description: string
  verify_status?: string
  job_title?: string
  company_branch?: string
  username?: string
  company_website?: string
  company_admin?: boolean
  profile_img?: string
}

export function EmployerDetailsModal({
  open,
  onOpenChange,
  employer,
  onEdit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  employer: Employer | null
  onEdit?: () => void
}) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarLoading, setAvatarLoading] = useState(false)

  useEffect(() => {
    let isMounted = true
    setAvatarUrl(null)
    if (employer?.profile_img) {
      setAvatarLoading(true)
      fetch(`/api/employers/get-signed-url?bucket=user.avatars&path=${encodeURIComponent(employer.profile_img)}`)
        .then(res => res.json())
        .then(data => {
          if (isMounted) setAvatarUrl(data.signedUrl || null)
        })
        .catch(() => {
          if (isMounted) setAvatarUrl(null)
        })
        .finally(() => {
          if (isMounted) setAvatarLoading(false)
        })
    } else {
      setAvatarLoading(false)
      setAvatarUrl(null)
    }
    return () => { isMounted = false }
  }, [employer?.profile_img])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Employer Details</DialogTitle>
          <DialogDescription className="text-gray-600">
            Comprehensive information about the employer.
          </DialogDescription>
        </DialogHeader>
        {employer && (
          <Tabs defaultValue="employer" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="employer">Employer Details</TabsTrigger>
              <TabsTrigger value="company">Company Details</TabsTrigger>
            </TabsList>
            <TabsContent value="employer">
              <div className="grid gap-6 py-4">
                <div className="flex items-start gap-4">
                  <Avatar sx={{ width: 64, height: 64 }}>
                    {avatarLoading ? (
                      <span className="w-8 h-8 block animate-spin border-4 border-indigo-400 border-t-transparent rounded-full mx-auto" />
                    ) : avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        style={{ width: 64, height: 64, borderRadius: "50%" }}
                        className="rounded-full object-cover"
                        onLoad={() => setAvatarLoading(false)}
                      />
                    ) : (
                      <User className="h-8 w-8" />
                    )}
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      {(() => {
                        const nameParts = employer.name.split(" ")
                        const firstName = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase() : ""
                        const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0).toUpperCase() + nameParts[nameParts.length - 1].slice(1).toLowerCase() : ""
                        return `${firstName} ${lastName}`.trim()
                      })()}
                      {employer.company_admin && (
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                          Company Admin
                        </span>
                      )}
                    </h3>
                    <p className="text-muted-foreground">{employer.username || "-"}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={employer.status} />
                      <StatusBadge status={employer.verify_status || ""} />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <strong>Email:</strong> {employer.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <strong>Phone:</strong> {employer.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PiSubtitlesBold className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <strong>Position:</strong> {employer.position.charAt(0).toUpperCase() + employer.position.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <strong>Job Title:</strong> {employer.job_title || "-"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <strong>Registration Date:</strong> {employer.registrationDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="company">
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <strong>Company:</strong> {employer.company}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <strong>Branch:</strong> {employer.company_branch || "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <strong>Employees:</strong> {employer.employeesCount}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-sm text-muted-foreground">Website</Label>
                      <p className="font-medium">{employer.company_website}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Company Description</Label>
                      <p className="mt-1">{employer.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl px-6">
            Close
          </Button>
          <Button className="rounded-xl px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" onClick={onEdit}>
            Edit Employer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
