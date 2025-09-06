"use client"

import type React from "react"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  Search,
  MessageCircle,
  Mail,
  Phone,
  Download,
  Edit,
  Trash2,
  Clock,
  Building,
  MapPin,
  Briefcase,
  DollarSign,
} from "lucide-react"
import { BsQuestionLg } from "react-icons/bs"

interface ApplicationDetailsProps {
  applicationId: number | null 
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
}

export function ApplicationDetailsModal({ applicationId, isModalOpen, setIsModalOpen }: ApplicationDetailsProps) {
  const applications = [
    {
      id: 1,
      company: "Google",
      position: "Frontend Developer",
      status: "Interview",
      statusColor: "bg-purple-100 text-purple-700",
      location: "Remote",
      salary: "$120K - $150K",
      appliedDate: "May 10, 2025",
      description:
        "Google is seeking a talented Frontend Developer to join our team. You will be responsible for building and maintaining user interfaces for our products.",
      timeline: [
        {
          status: "Application Submitted",
          date: "May 10, 2025",
          icon: <FileText className="h-4 w-4 text-white" />,
          iconBg: "bg-green-500",
        },
        {
          status: "Application Under Review",
          date: "May 13, 2025",
          icon: <Search className="h-4 w-4 text-white" />,
          iconBg: "bg-blue-500",
        },
        {
          status: "Interview Scheduled",
          date: "May 17, 2025",
          icon: <MessageCircle className="h-4 w-4 text-white" />,
          iconBg: "bg-purple-500",
          current: true,
        },
      ],
      notes: "Prepare for technical interview. Review React hooks and performance optimization.",
      contacts: [
        {
          name: "Sarah Johnson",
          role: "Recruiter",
          email: "sarah.johnson@google.com",
          phone: "123-456-7890",
        },
      ],
      documents: [
        {
          name: "Resume_Frontend_2025.pdf",
          date: "May 10, 2025",
          time: "2:30 PM",
          phone: "123-456-7890",
        },
        {
          name: "Cover_Letter_Google.pdf",
          date: "May 10, 2025",
          time: "12:30 PM",
          phone: "123-456-7890",
        },
      ],
    },
    {
      id: 2,
      company: "Meta",
      position: "UI/UX Designer",
      status: "Applied",
      statusColor: "bg-blue-100 text-blue-700",
      location: "On-site",
      salary: "$100K - $120K",
      appliedDate: "May 12, 2025",
      description:
        "Meta is looking for a creative UI/UX Designer to design user-friendly interfaces for our applications.",
      timeline: [
        {
          status: "Application Submitted",
          date: "May 12, 2025",
          icon: <FileText className="h-4 w-4 text-white" />,
          iconBg: "bg-green-500",
        },
      ],
      notes: "Research Meta's design guidelines and prepare a portfolio presentation.",
      contacts: [
        {
          name: "John Doe",
          role: "Hiring Manager",
          email: "john.doe@meta.com",
          phone: "987-654-3210",
        },
      ],
      documents: [
        {
          name: "Portfolio_Meta_2025.pdf",
          date: "May 12, 2025",
          time: "10:00 AM",
          phone: "987-654-3210",
        },
      ],
    },
    {
      id: 3,
      company: "Amazon",
      position: "Software Engineer",
      status: "Offer",
      statusColor: "bg-green-100 text-green-700",
      location: "Hybrid",
      salary: "$130K - $160K",
      appliedDate: "May 8, 2025",
      description:
        "Amazon is hiring a Software Engineer to develop scalable solutions for our e-commerce platform.",
      timeline: [
        {
          status: "Application Submitted",
          date: "May 8, 2025",
          icon: <FileText className="h-4 w-4 text-white" />,
          iconBg: "bg-green-500",
        },
        {
          status: "Application Under Review",
          date: "May 10, 2025",
          icon: <Search className="h-4 w-4 text-white" />,
          iconBg: "bg-blue-500",
        },
        {
          status: "Interview Scheduled",
          date: "May 14, 2025",
          icon: <MessageCircle className="h-4 w-4 text-white" />,
          iconBg: "bg-purple-500",
        },
        {
          status: "Offer Extended",
          date: "May 18, 2025",
          icon: <FileText className="h-4 w-4 text-white" />,
          iconBg: "bg-green-500",
          current: true,
        },
      ],
      notes: "Review the offer details and prepare for negotiation.",
      contacts: [
        {
          name: "Emily Smith",
          role: "HR Specialist",
          email: "emily.smith@amazon.com",
          phone: "456-789-0123",
        },
      ],
      documents: [
        {
          name: "Offer_Letter_Amazon_2025.pdf",
          date: "May 18, 2025",
          time: "9:00 AM",
          phone: "456-789-0123",
        },
      ],
    },
  ]

  const application = applications.find((app) => app.id === applicationId)

  if (!application) {
    return null
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto mt-10 p-0">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white rounded-t-lg relative">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{application.position}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Building className="h-4 w-4 text-blue-100" />
                <span className="text-blue-100">{application.company}</span>
              </div>
            </div>
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1 text-sm font-medium">
              {application.status}
            </Badge>
          </div>
        </div>
        <div className="p-6">
          <DialogTitle className="sr-only">Application Details</DialogTitle>
          <ApplicationDetailsContent application={application} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface Application {
  id: number
  company: string
  position: string
  status: string
  statusColor: string
  location: string
  salary: string
  appliedDate: string
  description: string
  timeline: {
    status: string
    date: string
    icon: React.ReactNode
    iconBg: string
    current?: boolean
  }[]
  notes: string
  contacts: {
    name: string
    role: string
    email: string
    phone: string
  }[]
  documents: {
    name: string
    date: string
    time: string
    phone: string
  }[]
}

function ApplicationDetailsContent({ application }: { application: Application }) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-semibold text-blue-700">Application Summary</h3>
            </div>
            <p className="text-sm text-gray-600">{application.description}</p>
          </div>

          <Separator />

          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Job Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Briefcase className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm">Full-time</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm">Applied on {application.appliedDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm">{application.salary}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm">{application.location}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-md font-semibold text-blue-700">Contact Information</h3>
            {application.contacts.map((contact: { [key: string]: string }, index: number) => (
              <div key={index} className="bg-gray-50 border rounded-md p-3 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium">{contact.name[0]}</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{contact.name}</div>
                  <div className="text-xs text-gray-500">{contact.role} at {application.company}</div>
                </div>
                <div className="text-sm text-gray-700 text-left">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{contact.phone || "Phone number not available"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-md font-semibold text-blue-700">Notes</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-sm text-gray-700">{application.notes}</p>
            </div>
            <Button variant="outline" size="sm" className="mt-2">
              <Edit className="h-4 w-4 mr-2" />
              Edit Notes
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4 pt-4">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            {/* Timeline events */}
            {application.timeline.map((event, index) => (
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

            {/* Next step description */}
            <div className="relative pl-12 pb-4">
              <div className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200">
                <BsQuestionLg className="h-4 w-4 text-gray-500" />
              </div>
              <div className="text-sm text-gray-600">
                {application.timeline[application.timeline.length - 1].status === "Interview Scheduled" && (
                  <>
                    <strong>Next Step:</strong> <br />
                    <em>Awaiting Response - The recruiter will contact you with feedback or the next steps.</em>
                  </>
                )}
                {application.timeline[application.timeline.length - 1].status === "Application Under Review" && (
                  <>
                    <strong>Next Step:</strong> <br />
                    <em>Interview Scheduled - Expect an interview. Prepare by reviewing the job requirements and practicing common interview questions.</em>
                  </>
                )}
                {application.timeline[application.timeline.length - 1].status === "Application Submitted" && (
                  <>
                    <strong>Next Step:</strong> <br />
                    <em>Application Under Review - The recruiter is reviewing your application. Stay tuned for updates.</em>
                  </>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4 pt-4">
          <div className="space-y-2">
            <h3 className="text-md font-semibold text-blue-700">Application Documents</h3>

            {application.documents.map((doc: { [key: string]: string }, index: number) => (
              <div key={index} className="flex items-center justify-between border rounded-md p-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-sm">{doc.name}</div>
                    <div className="text-xs text-gray-500">{doc.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            ))}

            <Button variant="outline" className="w-full mt-2">
              <Upload className="h-4 w-4 mr-2" />
              Upload New Document
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
          Withdraw Application
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">Contact Recruiter</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Next</Button>
        </div>
      </div>
    </div>
  )
}

function Upload(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}
