"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  Mail,
  Phone,
  Download,
  Edit,
  Clock,
  MapPin,
  Briefcase,
  Star,
  CheckCircle,
  XCircle,
  Calendar,
  ExternalLink,
  Linkedin,
  Github,
  Globe,
} from "lucide-react"
import Avatar from "@mui/material/Avatar"
import { Progress } from "@/components/ui/progress"
import type React from "react"

interface Applicant {
  application_id: string
  job_id: string
  job_title?: string
  status?: string
  first_name?: string
  last_name?: string
  address?: string
  experience_years?: string
  applied_date?: string
  skills?: string[]
  education?: { degree: string; school: string; year: string }[]
  work_history?: { company: string; position: string; duration: string; description: string }[]
  timeline?: { status: string; date: string; icon: React.JSX.Element; iconBg: string; current?: boolean }[]
  notes?: string
  email?: string
  phone?: string
  linkedin?: string
  github?: string
  portfolio?: string
  documents?: { name: string; date: string; size: string }[]
}

interface RecruiterApplicationDetailsProps {
  applicant: Applicant | null
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
}

export function RecruiterApplicationDetailsModal({
  applicant,
  isModalOpen,
  setIsModalOpen,
}: RecruiterApplicationDetailsProps) {
  if (!applicant) return null

  const application = {
    id: applicant.application_id, 
    name: `${applicant.first_name || "Applicant"} ${applicant.last_name || ""}`.trim(),
    title: applicant.job_title || "Job Applicant",
    status: applicant.status || "New",
    statusColor:
      (applicant.status || "").toLowerCase() === "interview"
        ? "bg-purple-100 text-purple-700"
        : (applicant.status || "").toLowerCase() === "invited"
        ? "bg-green-100 text-green-700"
        : "bg-yellow-100 text-yellow-700",
    location: applicant.address || "N/A",
    experience: applicant.experience_years || "N/A",
    appliedDate: applicant.applied_date || "N/A",
    matchScore: 90,
    skills: applicant.skills || [],
    education: applicant.education || [],
    workHistory: applicant.work_history || [],
    timeline: applicant.timeline || [],
    notes: applicant.notes || "",
    contact: {
      email: applicant.email || "",
      phone: applicant.phone || "",
      linkedin: applicant.linkedin || "",
      github: applicant.github || "",
      portfolio: applicant.portfolio || "",
    },
    documents: applicant.documents || [],
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto mt-10 p-0">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white rounded-t-lg relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  fontWeight: "bold",
                  bgcolor: "#fff",
                  color: "#2563EB",
                  fontSize: 28,
                  border: "2px solid #fff",
                }}
              >
                {application.name.charAt(0)}
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{application.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Briefcase className="h-4 w-4 text-blue-100" />
                  <span className="text-blue-100">{application.title}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={application.statusColor + " px-3 py-1 text-sm font-medium"}>{application.status}</Badge>
              <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-md">
                <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
                <span className="text-white font-medium">{application.matchScore}% Match</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <DialogTitle className="sr-only">Applicant Details</DialogTitle>
          <RecruiterApplicationDetailsContent application={application} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface Application {
  id: string
  name: string
  title: string
  status: string
  statusColor: string
  location: string
  experience: string
  appliedDate: string
  matchScore: number
  skills: string[]
  education: { degree: string; school: string; year: string }[]
  workHistory: { company: string; position: string; duration: string; description: string }[]
  timeline: { status: string; date: string; icon: React.JSX.Element; iconBg: string; current?: boolean }[]
  notes: string
  contact: {
    email: string
    phone: string
    linkedin?: string
    github?: string
    portfolio?: string
  }
  documents: { name: string; date: string; size: string }[]
}

function RecruiterApplicationDetailsContent({ application }: { application: Application }) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="resume">Resume</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 pt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-semibold text-blue-700">Candidate Summary</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Match Score:</span>
                <div className="w-32">
                  <Progress value={application.matchScore} className="h-2" />
                </div>
                <span className="text-sm font-medium">{application.matchScore}%</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Candidate Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Briefcase className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm">{application.experience} experience</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm">Applied on {application.appliedDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm">{application.location}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-md font-semibold text-blue-700">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {application.skills.map((skill: string, index: number) => (
                <Badge key={index} className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-md font-semibold text-blue-700">Education</h3>
            {application.education.map((edu: { [key: string]: string }, index: number) => (
              <div key={index} className="bg-gray-50 border rounded-md p-3">
                <div className="font-medium">{edu.degree}</div>
                <div className="text-sm text-gray-500">
                  {edu.school}, {edu.year}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-md font-semibold text-blue-700">Work Experience</h3>
            {application.workHistory.map((work: { [key: string]: string }, index: number) => (
              <div key={index} className="bg-gray-50 border rounded-md p-3">
                <div className="font-medium">{work.position}</div>
                <div className="text-sm text-gray-500">
                  {work.company} • {work.duration}
                </div>
                <div className="text-sm text-gray-600 mt-2">{work.description}</div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-md font-semibold text-blue-700">Contact Information</h3>
            <div className="bg-gray-50 border rounded-md p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{application.contact.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{application.contact.phone}</span>
              </div>
              {application.contact.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-muted-foreground" />
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    {application.contact.linkedin}
                  </a>
                </div>
              )}
              {application.contact.github && (
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-muted-foreground" />
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    {application.contact.github}
                  </a>
                </div>
              )}
              {application.contact.portfolio && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    {application.contact.portfolio}
                  </a>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="resume" className="space-y-4 pt-4">
          <div className="space-y-2">
            <h3 className="text-md font-semibold text-blue-700">Candidate Documents</h3>

            {application.documents.map((doc: { [key: string]: string }, index: number) => (
              <div key={index} className="flex items-center justify-between border rounded-md p-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-sm">{doc.name}</div>
                    <div className="text-xs text-gray-500">
                      {doc.date} • {doc.size}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">Open</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="text-center text-gray-500 py-8">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <h3 className="text-lg font-medium text-gray-700">Resume Preview</h3>
              <p className="text-sm">Click on a document above to preview it here</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4 pt-4">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            {/* Timeline events */}
            {application.timeline.map((event: Application["timeline"][number], index: number) => (
              <div key={index} className="relative pl-12 pb-8">
                <div
                  className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${event.iconBg}`}
                >
                  {event.icon}
                </div>
                <div
                  className={`border rounded-lg p-3 ${event.current ? "border-purple-300 bg-purple-50" : "border-gray-200"}`}
                >
                  <div className="font-medium text-sm">{event.status}</div>
                  <div className="text-xs text-gray-500 mt-1">{event.date}</div>
                </div>
              </div>
            ))}

            {/* Next steps */}
            <div className="relative pl-12 pb-4">
              <div className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200">
                <Clock className="h-4 w-4 text-gray-500" />
              </div>
              <div className="text-sm text-gray-600">
                <strong>Next Steps:</strong> <br />
                {application.status === "New" && <em>Review candidate&apos;s resume and decide whether to move forward.</em>}
                {application.status === "Interview" && <em>Conduct interview and provide feedback.</em>}
                {application.status === "Invited" && <em>Waiting for candidate to confirm interview time.</em>}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4 pt-4">
          <div className="space-y-2">
            <h3 className="text-md font-semibold text-blue-700">Recruiter Notes</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-sm text-gray-700">{application.notes}</p>
            </div>  
            <Button variant="outline" size="sm" className="mt-2">
              <Edit className="h-4 w-4 mr-2" />
              Edit Notes
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-md font-semibold text-blue-700">Add New Note</h3>
            <textarea
              className="w-full border border-gray-200 rounded-md p-3 text-sm"
              rows={4}
              placeholder="Add your notes about this candidate..."
            ></textarea>
            <Button size="sm" className="mt-2">
              Save Note
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-md font-semibold text-blue-700">Team Feedback</h3>
            <div className="space-y-3">
              <div className="bg-gray-50 border rounded-md p-3">
                <div className="flex items-center gap-2">
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      fontWeight: "bold",
                      bgcolor: "#DBEAFE",
                      color: "#2563EB",
                      fontSize: 16,
                    }}
                  >
                    JD
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">John Doe</div>
                    <div className="text-xs text-gray-500">Technical Lead • May 14, 2025</div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-2">
                  Strong technical skills. Good understanding of React and TypeScript. Would be a good fit for our team.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between pt-4 border-t">
        <div className="flex gap-2">
          <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Contact
          </Button>
          {application.status.toLowerCase() === "new" && (
            <Button variant="outline" className="text-green-700 border-green-200 hover:bg-green-50">
              Shortlist
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {["new", "interview"].includes(application.status.toLowerCase()) ? (
            <Button className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              {application.status.toLowerCase() === "new" ? "Move to Interview" : "Extend Offer"}
            </Button>
          ) : (
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Interview
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
