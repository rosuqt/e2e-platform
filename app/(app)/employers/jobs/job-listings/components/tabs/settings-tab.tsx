"use client"

import { useState, useEffect } from "react"
import { Archive, Users, Tag, Bell, Info, X, AlertTriangle, Copy } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Chip } from "@mui/material"
import { Divider } from "@mui/material"
import { Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { useSession } from "next-auth/react"
import { PiCrownSimpleFill } from "react-icons/pi"
import { FaUser } from "react-icons/fa"
import Image from "next/image"


type TagType = {
  id: number;
  name: string;
  color: string;
}

type Colleague = {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  isAdmin: boolean
  avatarUrl?: string
}

type ApiColleague = {
  id?: string
  first_name: string
  last_name: string
  email?: string
  company_admin?: boolean
  profile_img?: string
  avatarUrl?: string
}

type JobTeamAccess = {
  employer_id: string;
  job_id: string;
  role: string;
  can_edit?: boolean;
  can_view?: boolean;
}

export default function JobSettings({ jobId, companyName }: { jobId: string, companyName?: string }) {

  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false)
  const [members, setMembers] = useState<Colleague[]>([])
  const [tags, setTags] = useState<TagType[]>([])
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState("blue")
  const [tagError, setTagError] = useState<string | null>(null)
  const [notifications, setNotifications] = useState({
    newApplications: true,
    statusChanges: true,
    messages: true,
    interviews: true,
    dailyDigest: false,
  })
  const [allColleagues, setAllColleagues] = useState<ApiColleague[]>([])
  const [selectedColleagueId, setSelectedColleagueId] = useState<string | null>(null)
  const [loadingColleagues, setLoadingColleagues] = useState(false)

  useEffect(() => {
    async function fetchTags() {
      if (!jobId) return
      const res = await fetch(`/api/jobs/update-tags?job_id=${jobId}`)
      const json = await res.json()
      if (Array.isArray(json.tags)) {
        setTags(
          json.tags.map((tag: { id?: number; name: string; color: string }, idx: number) => ({
            id: tag.id ?? idx + 1,
            name: tag.name,
            color: tag.color,
          }))
        )
      }
    }
    fetchTags()
  }, [jobId])

  async function fetchProfileImg(employerId?: string | null) {
    if (!employerId) return null
    const res = await fetch(`/api/employers/colleagues/fetchByCompany?employer_id=${employerId}`)
    const json = await res.json()
    if (!json.profile_img) return null
    const imgPath = json.profile_img
    const urlRes = await fetch(`/api/employers/get-signed-url?bucket=user.avatars&path=${encodeURIComponent(imgPath)}`)
    const urlJson = await urlRes.json()
    return urlJson.signedUrl || null
  }

  useEffect(() => {
    async function fetchAdmins() {
      setLoadingColleagues(true)
      const company = companyName || localStorage.getItem("company_name")
      if (!company) {
        setLoadingColleagues(false)
        return
      }
      const res = await fetch(`/api/employers/colleagues/fetchByCompany?company_name=${encodeURIComponent(company)}`)
      const json = await res.json()
      if (json.data) {
        const colleagues: ApiColleague[] = json.data
        const withAvatars = await Promise.all(
          colleagues.map(async (u, idx) => {
            const avatarUrl = await fetchProfileImg(u.id)
            return { ...u, avatarUrl, idx }
          })
        )
        setAllColleagues(withAvatars)
      }
      setLoadingColleagues(false)
    }
    fetchAdmins()
  }, [companyName])

  useEffect(() => {
    async function fetchJobTeamAccess() {
      if (!jobId || allColleagues.length === 0) return
      const res = await fetch(`/api/jobs/team-access?job_id=${jobId}`)
      const json: { data?: JobTeamAccess[] } = await res.json()
      const accessList = json.data ?? []

      const adminMembers: Colleague[] = allColleagues
        .filter(c => c.company_admin)
        .map((c) => ({
          id: String(c.id),
          name: `${c.first_name} ${c.last_name}`,
          email: c.email ?? "",
          role: "Admin",
          avatar: (c.first_name?.[0] || "") + (c.last_name?.[0] || ""),
          isAdmin: true,
          avatarUrl: c.avatarUrl,
        }))

      const nonAdminMembers: Colleague[] = accessList
        .filter(access => {
          const c = allColleagues.find(col => String(col.id) === String(access.employer_id))
          return !c?.company_admin
        })
        .map((access) => {
          const c = allColleagues.find(col => String(col.id) === String(access.employer_id))
          return {
            id: String(access.employer_id),
            name: c ? `${c.first_name} ${c.last_name}` : "Unknown",
            email: c?.email ?? "",
            role: access.role,
            avatar: c ? (c.first_name?.[0] || "") + (c.last_name?.[0] || "") : "",
            isAdmin: false,
            avatarUrl: c?.avatarUrl,
          }
        })

      let owner: Colleague | undefined
      if (currentEmployerId) {
        const ownerColleague = allColleagues.find(c => String(c.id) === String(currentEmployerId))
        if (ownerColleague) {
          owner = {
            id: String(ownerColleague.id),
            name: `${ownerColleague.first_name} ${ownerColleague.last_name}`,
            email: ownerColleague.email ?? "",
            role: "Owner",
            avatar: (ownerColleague.first_name?.[0] || "") + (ownerColleague.last_name?.[0] || ""),
            isAdmin: !!ownerColleague.company_admin,
            avatarUrl: ownerColleague.avatarUrl,
          }
        }
      }
      const allMembers = [...adminMembers, ...nonAdminMembers]
      const filteredMembers = allMembers.filter(m => !owner || m.id !== owner.id)
      setMembers(owner ? [owner, ...filteredMembers] : allMembers)
    }
    fetchJobTeamAccess()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, allColleagues])

  const handleAddMember = async () => {
    if (!selectedColleagueId) return
    const selected = allColleagues.find(c => c.id === selectedColleagueId)
    if (!selected) return
    if (members.some(m => m.email === selected.email)) return
    await fetch("/api/jobs/team-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        job_id: jobId,
        employer_id: selected.id,
        role: "Viewer",
        can_edit: false,
        can_view: true,
      }),
    })

    setSelectedColleagueId(null)
    const res = await fetch(`/api/jobs/team-access?job_id=${jobId}`)
    const json: { data?: JobTeamAccess[] } = await res.json()
    if (json.data) {
      const accessList = json.data
      const membersList: Colleague[] = accessList.map((access) => {
        const c = allColleagues.find(col => String(col.id) === String(access.employer_id))
        return {
          id: String(access.employer_id),
          name: c ? `${c.first_name} ${c.last_name}` : "Unknown",
          email: c?.email ?? "",
          role: access.role,
          avatar: c ? (c.first_name?.[0] || "") + (c.last_name?.[0] || "") : "",
          isAdmin: !!c?.company_admin || access.role === "Admin",
          avatarUrl: c?.avatarUrl,
        }
      })

      let owner: Colleague | undefined
      if (currentEmployerId) {
        const ownerColleague = allColleagues.find(c => String(c.id) === String(currentEmployerId))
        if (ownerColleague) {
          owner = {
            id: String(ownerColleague.id),
            name: `${ownerColleague.first_name} ${ownerColleague.last_name}`,
            email: ownerColleague.email ?? "",
            role: "Owner",
            avatar: (ownerColleague.first_name?.[0] || "") + (ownerColleague.last_name?.[0] || ""),
            isAdmin: !!ownerColleague.company_admin,
            avatarUrl: ownerColleague.avatarUrl,
          }
        }
      }
      const filteredMembers = membersList.filter(m => !owner || m.id !== owner.id)
      setMembers(owner ? [owner, ...filteredMembers] : membersList)
    }
  }

  const handleRemoveMember = async (id: string) => {
    const member = members.find(m => m.id === id)
    if (!member || member.isAdmin) return
    await fetch("/api/jobs/team-access", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        job_id: jobId,
        employer_id: id,
      }),
    })
    const res = await fetch(`/api/jobs/team-access?job_id=${jobId}`)
    const json: { data?: JobTeamAccess[] } = await res.json()
    if (json.data) {
      const accessList = json.data
      const membersList: Colleague[] = accessList.map((access) => {
        const c = allColleagues.find(col => String(col.id) === String(access.employer_id))
        return {
          id: String(access.employer_id),
          name: c ? `${c.first_name} ${c.last_name}` : "Unknown",
          email: c?.email ?? "",
          role: access.role,
          avatar: c ? (c.first_name?.[0] || "") + (c.last_name?.[0] || "") : "",
          isAdmin: !!c?.company_admin || access.role === "Admin",
          avatarUrl: c?.avatarUrl,
        }
      })
      setMembers(membersList)
    }
  }

  const handleChangeRole = async (id: string, newRole: string) => {
    const member = members.find(m => m.id === id)
    if (!member || member.isAdmin) return
    await fetch("/api/jobs/team-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        job_id: jobId,
        employer_id: id,
        role: newRole,
        can_edit: newRole !== "Viewer",
        can_view: true,
      }),
    })
    const res = await fetch(`/api/jobs/team-access?job_id=${jobId}`)
    const json: { data?: JobTeamAccess[] } = await res.json()
    if (json.data) {
      const accessList = json.data
      const membersList: Colleague[] = accessList.map((access) => {
        const c = allColleagues.find(col => String(col.id) === String(access.employer_id))
        return {
          id: String(access.employer_id),
          name: c ? `${c.first_name} ${c.last_name}` : "Unknown",
          email: c?.email ?? "",
          role: access.role,
          avatar: c ? (c.first_name?.[0] || "") + (c.last_name?.[0] || "") : "",
          isAdmin: !!c?.company_admin || access.role === "Admin",
          avatarUrl: c?.avatarUrl,
        }
      })
      setMembers(membersList)
    }
  }

  const handleAddTag = async () => {
    const trimmedName = newTagName.trim()
    if (trimmedName.length < 2) {
      setTagError("Tag name must be at least 2 characters.")
      return
    }
    if (trimmedName.length > 20) {
      setTagError("Tag name must be at most 20 characters.")
      return
    }
    if (tags.some(tag => tag.name.toLowerCase() === trimmedName.toLowerCase())) {
      setTagError("Tag already exists.")
      return
    }
    setTagError(null)
    const newTag = {
      id: tags.length + 1,
      name: trimmedName,
      color: newTagColor,
    }
    const updatedTags = [...tags, newTag]
    setTags(updatedTags)
    setNewTagName("")
    await updateJobTags(updatedTags)
  }

  async function updateJobTags(updatedTags: { id: number; name: string; color: string }[]) {
    await fetch("/api/jobs/update-tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        job_id: jobId,
        tags: Array.isArray(updatedTags) ? updatedTags.map(({ name, color }) => ({ name, color })) : [],
      }),
    })
  }

  const handleRemoveTag = async (id: number) => {
    const updatedTags = tags.filter((tag) => tag.id !== id)
    setTags(updatedTags)
    await updateJobTags(updatedTags)
  }

  const handleNotificationToggle = (key: string) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key as keyof typeof notifications],
    })
  }

  const { data: session } = useSession()
  const currentEmployerId = (session?.user as SessionUser | undefined)?.employerId

  const sortedMembers = [...members].sort((a, b) => {
    if (currentEmployerId) {
      if (a.id === currentEmployerId) return -1
      if (b.id === currentEmployerId) return 1
    }
    return 0
  }).map(m =>
    currentEmployerId && m.id === currentEmployerId
      ? { ...m, role: "Owner" }
      : m
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Job Settings</h2>
        <div className="flex items-center gap-2">
        </div>
      </div>

      {/* Access Control Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            Access Control & Permissions
          </CardTitle>
          <CardDescription>Manage who can access and edit this job listing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4">
            {sortedMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {member.avatarUrl ? (
                    <Image
                      src={member.avatarUrl}
                      alt={member.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center">
                      <FaUser className="text-white w-4 h-4" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {member.name}
                      {currentEmployerId && member.id === currentEmployerId && (
                        <span className="ml-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{member.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {member.role === "Owner" ? (
                    <div className="flex items-center gap-2 mr-14">
                      <span className=" text-gray-500 text-sm ">Owner</span>
                      <PiCrownSimpleFill className="h-5 w-5 text-yellow-500" />
                    </div>
                  ) : (
                    <>
                      <Tooltip
                        title={
                          member.isAdmin
                            ? "This role cannot be changed"
                            : ""
                        }
                      >
                        <div>
                          <Select
                            defaultValue={member.role}
                            onValueChange={(value) => handleChangeRole(member.id, value)}
                            disabled={member.isAdmin}
                          >
                            <SelectTrigger className="w-[110px]">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Admin">Admin</SelectItem>
                              <SelectItem value="Editor">Editor</SelectItem>
                              <SelectItem value="Viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </Tooltip>
                      <Tooltip
                        title={
                          member.isAdmin
                            ? "This member cannot be removed"
                            : "Remove member"
                        }
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMember(member.id)}
                          disabled={member.isAdmin}
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </Tooltip>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Divider className="my-4" />

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium">Add Team Member</h3>
            <div className="flex gap-3 items-center">
              <Select
                value={selectedColleagueId ?? ""}
                onValueChange={v => setSelectedColleagueId(v)}
                disabled={loadingColleagues}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder={loadingColleagues ? "Loading..." : "Select employer"} />
                </SelectTrigger>
                <SelectContent>
                  {loadingColleagues ? (
                    <div className="p-4 text-center text-muted-foreground">Loading...</div>
                  ) : (
                    allColleagues
                      .filter(c => !members.some(m => m.email === c.email))
                      .map((c) => (
                        <SelectItem key={c.id} value={c.id ?? ""}>
                          <div className="flex items-center gap-2">
                            {c.avatarUrl ? (
                              <Image
                                src={c.avatarUrl}
                                alt={`${c.first_name} ${c.last_name}`}
                                width={28}
                                height={28}
                                className="w-7 h-7 rounded-full object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-blue-400 flex items-center justify-center">
                                <FaUser className="text-white w-4 h-4" />
                              </div>
                            )}
                            <span>{c.first_name} {c.last_name}</span>
                          </div>
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>
              <Button onClick={handleAddMember} disabled={!selectedColleagueId || loadingColleagues}>Add</Button>
            </div>
            {/* Removed General Access Option */}
            <div className="text-sm text-muted-foreground mt-2">
              <h4 className="font-medium text-foreground">Role Permissions:</h4>
              <ul className="list-disc pl-5 mt-1 space-y-1">
 
                <li>
                  <span className="font-medium">Admin:</span> Full access to edit, delete, and manage permissions
                </li>
                <li>
                  <span className="font-medium">Editor:</span> Can edit job details and manage applicants
                </li>
                <li>
                  <span className="font-medium">Viewer:</span> Can view job details and applicants, but cannot edit
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-muted-foreground" />
            Tags & Labels
          </CardTitle>
          <CardDescription>Add tags to categorize and filter this job</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                onDelete={() => handleRemoveTag(tag.id)}
                style={{
                  backgroundColor:
                    tag.color === "red"
                      ? "#FFCDD2"
                      : tag.color === "blue"
                      ? "#BBDEFB"
                      : tag.color === "green"
                      ? "#C8E6C9"
                      : tag.color === "purple"
                      ? "#E1BEE7"
                      : tag.color === "amber"
                      ? "#FFE082"
                      : "#E0E0E0",
                  color:
                    tag.color === "red"
                      ? "#D32F2F"
                      : tag.color === "blue"
                      ? "#1976D2"
                      : tag.color === "green"
                      ? "#388E3C"
                      : tag.color === "purple"
                      ? "#7B1FA2"
                      : tag.color === "amber"
                      ? "#FFA000"
                      : "#616161",
                }}
              />
            ))}
          </div>

          <Divider className="my-4" />

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium">Add New Tag</h3>
            <div className="flex gap-3">
              <Input
                placeholder="Tag name"
                value={newTagName}
                onChange={(e) => {
                  setNewTagName(e.target.value)
                  setTagError(null)
                }}
                className="flex-1"
              />
              <Select defaultValue={newTagColor} onValueChange={setNewTagColor}>
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="amber">Amber</SelectItem>
                  <SelectItem value="gray">Gray</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddTag}>Add Tag</Button>
            </div>
            {tagError && (
              <div className="text-sm text-red-600">{tagError}</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            Notification Settings
          </CardTitle>
          <CardDescription>Configure when and how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">New Applications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications when new candidates apply</p>
              </div>
              <Switch
                checked={notifications.newApplications}
                onCheckedChange={() => handleNotificationToggle("newApplications")}
              />
            </div>

            <Divider />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Status Changes</Label>
                <p className="text-sm text-muted-foreground">Notify when application statuses are updated</p>
              </div>
              <Switch
                checked={notifications.statusChanges}
                onCheckedChange={() => handleNotificationToggle("statusChanges")}
              />
            </div>

            <Divider />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Messages</Label>
                <p className="text-sm text-muted-foreground">Receive notifications for new messages from applicants</p>
              </div>
              <Switch checked={notifications.messages} onCheckedChange={() => handleNotificationToggle("messages")} />
            </div>

            <Divider />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Interviews</Label>
                <p className="text-sm text-muted-foreground">Get reminders about upcoming interviews</p>
              </div>
              <Switch
                checked={notifications.interviews}
                onCheckedChange={() => handleNotificationToggle("interviews")}
              />
            </div>

            <Divider />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Daily Digest</Label>
                <p className="text-sm text-muted-foreground">Receive a daily summary of all activity</p>
              </div>
              <Switch
                checked={notifications.dailyDigest}
                onCheckedChange={() => handleNotificationToggle("dailyDigest")}
              />
            </div>
          </div>

          <div className="pt-4">
            <h3 className="text-sm font-medium mb-2">Notification Recipients</h3>
            <div className="space-y-2">
              {sortedMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-2">
                  <Checkbox id={`notify-${member.id}`} defaultChecked={member.role === "Admin" || member.role === "Owner"} />
                  <Label htmlFor={`notify-${member.id}`} className="text-sm">
                    {member.name} ({member.email})
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Save Notification Settings</Button>
        </CardFooter>
      </Card>

      {/* Job Status Section - moved to the bottom */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-muted-foreground" />
            Job Status & Management
          </CardTitle>
          <CardDescription>Archive or delete this job listing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Duplicate Job Section */}
            <div className="flex flex-col items-start p-4 border rounded-lg shadow-sm">
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg shadow-md w-full"
                onClick={() => setIsDuplicateDialogOpen(true)}
              >
                <Copy className="inline-block mr-2 h-5 w-5" />
                Duplicate Job
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Create a copy of this job with the same details. Useful for recurring roles.
              </p>
              <Dialog open={isDuplicateDialogOpen} onClose={() => setIsDuplicateDialogOpen(false)}>
                <DialogTitle>Duplicate Job Listing</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Create a copy of this job with the same details. You can modify the details before creating.
                  </DialogContentText>
                  <div className="py-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="job-title">Job Title</Label>
                      <Input id="job-title" defaultValue="UI/UX Designer (Copy)" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="job-location">Location</Label>
                      <Input id="job-location" defaultValue="San Jose Del Monte, Pampanga" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="job-type">Job Type</Label>
                        <Select defaultValue="OJT">
                          <SelectTrigger id="job-type">
                            <SelectValue placeholder="Select job type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="OJT">OJT</SelectItem>
                            <SelectItem value="Full-time">Full-time</SelectItem>
                            <SelectItem value="Part-time">Part-time</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="job-salary">Salary</Label>
                        <Input id="job-salary" defaultValue="₱800 / day" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="copy-requirements" />
                      <Label htmlFor="copy-requirements">Copy requirements</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="copy-description" defaultChecked />
                      <Label htmlFor="copy-description">Copy description</Label>
                    </div>
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setIsDuplicateDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsDuplicateDialogOpen(false)}>Create Duplicate</Button>
                </DialogActions>
              </Dialog>
            </div>

            {/* Archive Job Section */}
            <div className="flex flex-col items-start p-4 border rounded-lg shadow-sm">
              <Button
                variant="outline"
                className="border-orange-500 text-orange-500 py-3 px-4 rounded-lg shadow-md w-full hover:bg-orange-50"
                onClick={() => setIsArchiveDialogOpen(true)}
              >
                <Archive className="inline-block mr-2 h-5 w-5 text-orange-500" />
                Archive Job
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Archiving hides the job from active listings but keeps all data for reporting and history.
              </p>
              <Dialog open={isArchiveDialogOpen} onClose={() => setIsArchiveDialogOpen(false)}>
                <DialogTitle>Archive Job Listing</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    This job will be hidden from active listings but all data will be preserved for reporting and
                    history.
                  </DialogContentText>
                  <div className="py-4">
                    <div className="flex items-start gap-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
                      <Info className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div className="text-sm text-amber-700">
                        <p className="font-medium">What happens when you archive:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li>Job is removed from public listings</li>
                          <li>All applications and data are preserved</li>
                          <li>You can restore the job at any time</li>
                          <li>Team members can still access archived jobs</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setIsArchiveDialogOpen(false)}>Cancel</Button>
                  <Button
                    variant="default"
                    className="bg-amber-600 hover:bg-amber-700"
                    onClick={() => setIsArchiveDialogOpen(false)}
                  >
                    Archive Job
                  </Button>
                </DialogActions>
              </Dialog>
            </div>

            {/* Delete Job Section */}
            <div className="flex flex-col items-start p-4 border rounded-lg shadow-sm">
              <Button
                variant="outline"
                className="border-red-500 text-red-600 py-3 px-4 rounded-lg w-full hover:bg-red-50"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <AlertTriangle className="inline-block mr-2 h-5 w-5 text-red-600" />
                Delete Job
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Permanently delete this job and all associated data. This action cannot be undone.
              </p>
              <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    This action cannot be undone. This will permanently delete the job listing and all associated
                    data including applications, messages, and analytics.
                  </DialogContentText>
                  <div className="py-4">
                    <div className="flex items-start gap-4 p-3 rounded-lg bg-red-50 border border-red-200">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div className="text-sm text-red-700">
                        <p className="font-medium">Warning:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li>All applicant data will be permanently deleted</li>
                          <li>All messages and communication history will be lost</li>
                          <li>All analytics and reporting data will be removed</li>
                          <li>This action CANNOT be reversed</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                  <Button className="bg-red-600 hover:bg-red-700" onClick={() => setIsDeleteDialogOpen(false)}>
                    Delete Permanently
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Checkbox({ id, defaultChecked }: { id: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={id}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
      />
    </div>
  )
}

type SessionUser = {
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string | null
  employerId?: string
}
