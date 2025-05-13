"use client"

import { useState } from "react"
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

const teamMembers = [
  { id: 1, name: "John Smith", email: "john@example.com", role: "Admin", avatar: "JS" },
  { id: 2, name: "Emily Johnson", email: "emily@example.com", role: "Editor", avatar: "EJ" },
  { id: 3, name: "Michael Brown", email: "michael@example.com", role: "Viewer", avatar: "MB" },
]

const initialTags = [
  { id: 1, name: "Urgent", color: "red" },
  { id: 2, name: "Remote", color: "blue" },
  { id: 3, name: "Part-time", color: "green" },
]

export default function JobSettings({ jobId }: { jobId: number }) {
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false)
  const [members, setMembers] = useState(teamMembers)
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [newMemberRole, setNewMemberRole] = useState("Viewer")
  const [tags, setTags] = useState(initialTags)
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState("blue")
  const [notifications, setNotifications] = useState({
    newApplications: true,
    statusChanges: true,
    messages: true,
    interviews: true,
    dailyDigest: false,
  })

  const handleAddMember = () => {
    if (newMemberEmail.trim() === "") return

    const newMember = {
      id: members.length + 1,
      name: newMemberEmail.split("@")[0],
      email: newMemberEmail,
      role: newMemberRole,
      avatar: newMemberEmail.substring(0, 2).toUpperCase(),
    }

    setMembers([...members, newMember])
    setNewMemberEmail("")
  }

  const handleRemoveMember = (id: number) => {
    setMembers(members.filter((member) => member.id !== id))
  }

  const handleChangeRole = (id: number, newRole: string) => {
    setMembers(members.map((member) => (member.id === id ? { ...member, role: newRole } : member)))
  }

  const handleAddTag = () => {
    if (newTagName.trim() === "") return

    const newTag = {
      id: tags.length + 1,
      name: newTagName,
      color: newTagColor,
    }

    setTags([...tags, newTag])
    setNewTagName("")
  }

  const handleRemoveTag = (id: number) => {
    setTags(tags.filter((tag) => tag.id !== id))
  }

  const handleNotificationToggle = (key: string) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key as keyof typeof notifications],
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Job Settings</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Job ID: {jobId}</span>
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
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
                    {member.avatar}
                  </div>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Select defaultValue={member.role} onValueChange={(value) => handleChangeRole(member.id, value)}>
                    <SelectTrigger className="w-[110px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Editor">Editor</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Tooltip
                    title={
                      member.role === "Admin" && members.filter((m) => m.role === "Admin").length === 1
                        ? "Cannot remove the only admin"
                        : "Remove member"
                    }
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={member.role === "Admin" && members.filter((m) => m.role === "Admin").length === 1}
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>

          <Divider className="my-4" />

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium">Add Team Member</h3>
            <div className="flex gap-3">
              <Input
                placeholder="Email address"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="flex-1"
              />
              <Select defaultValue={newMemberRole} onValueChange={setNewMemberRole}>
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddMember}>Add</Button>
            </div>

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
                onChange={(e) => setNewTagName(e.target.value)}
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
              {members.map((member) => (
                <div key={member.id} className="flex items-center gap-2">
                  <Checkbox id={`notify-${member.id}`} defaultChecked={member.role === "Admin"} />
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
