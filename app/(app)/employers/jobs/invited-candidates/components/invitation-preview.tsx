/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Edit3, Building2, User, Star, Mail, Calendar, CheckCircle, XCircle } from "lucide-react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import StudentInvitationView from "./student-invitation"

type SentInvitation = {
  id: string
  candidateName: string
  candidateAvatar?: string
  jobTitle: string
  matchScore: number
  message: string
  sentDate: string
  status: "pending" | "accepted" | "declined"
  companyName: string
  companyLogo?: string
  employerName: string
  employerAvatar?: string
  course?: string
  year?: string
  jobTitleRaw?: string
}

type ViewInviteModalProps = {
  open: boolean
  onClose: () => void
  invitation: SentInvitation
  onEdit: () => void
  onResend: () => void
  onRefresh?: () => void
}

export default function ViewInviteModal({ open, onClose, invitation, onEdit, onRefresh }: ViewInviteModalProps) {
  const [showStudentModal, setShowStudentModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)

  if (!invitation) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "text-green-600 bg-green-50 border-green-200"
      case "declined":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-4 w-4" />
      case "declined":
        return <XCircle className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const studentInvitation = {
    id: invitation.id,
    companyName: invitation.companyName,
    companyLogo: invitation.companyLogo,
    employerName: invitation.employerName,
    employerAvatar: invitation.employerAvatar,
    employerTitle: "",
    jobTitle: invitation.jobTitle,
    jobLocation: "",
    jobType: "",
    salary: undefined,
    matchScore: invitation.matchScore,
    message: invitation.message, 
    companySize: "",
    benefits: [],
    requirements: [],
    receivedDate: invitation.sentDate,
  }

  async function handleCancelInvitation() {
    setIsCancelling(true)
    setCancelError(null)
    try {
      const res = await fetch("/api/employers/invitedCandidates/actionsInvites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove", invitationId: invitation.id }),
      })
      const result = await res.json()
      if (!result.success) {
        setCancelError(result.error || "Failed to cancel invitation")
        setIsCancelling(false)
        return
      }
      setIsCancelling(false)
      setShowCancelModal(false)
      onClose()
      if (onRefresh) onRefresh()
    } catch (e: any) {
      setCancelError(e.message || "Failed to cancel invitation")
      setIsCancelling(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl h-[80vh] p-0 flex flex-col overflow-hidden bg-white">
          <DialogTitle asChild>
            <VisuallyHidden>
              <h2>Invitation Preview</h2>
            </VisuallyHidden>
          </DialogTitle>
          <div className="flex flex-1 min-h-0">
            <div className="flex-1 bg-white p-6 overflow-y-auto min-h-0">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Invitation Details</h2>
                    <p className="text-gray-600">Manage your sent invitation</p>
                  </div>
 
                </div>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg border ${getStatusColor(invitation.status)}`}>
                          {getStatusIcon(invitation.status)}
                        </div>
                        <div>
                          <h3 className="font-semibold capitalize">{invitation.status}</h3>
                          <p className="text-sm text-gray-600">Sent on {invitation.sentDate}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {invitation.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Candidate Information
                    </h3>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={invitation.candidateAvatar || "/placeholder.svg"} />
                        <AvatarFallback>{invitation.candidateName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{invitation.candidateName}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-green-600 font-medium">{invitation.matchScore}% match</span>
                        </div>
                        {/* Show course and year here */}
                        <div className="mt-2">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Course:</span> {invitation.course || ""}
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Year:</span> {invitation.year || ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Position Details
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm text-gray-600">Job Title</label>
                        <p className="font-medium">{invitation.jobTitle || invitation.jobTitleRaw || ""}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Personal Message</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">{invitation.message}</p>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={onEdit} className="flex-1">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit & Resend
                  </Button>
                  <Button
                    onClick={() => setShowCancelModal(true)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Invitation
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-gradient-to-br from-blue-600 to-blue-500 p-6 flex items-center justify-center">
              <div className="w-full max-w-md">
                <h3 className="text-white text-lg font-semibold mb-4 text-center">Invitation Preview</h3>
                <Card className="shadow-2xl">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                        <Mail className="h-4 w-4" />
                        Job Invitation
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">You&apos;ve received a job invitation!</h2>
                    </div>
                    <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={invitation.companyLogo || "/placeholder.svg"} />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {invitation.companyName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{invitation.companyName}</h3>
                        <p className="text-xs text-gray-600">by {invitation.employerName}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg text-gray-900">{invitation.jobTitle}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-green-600">{invitation.matchScore}% match</span>
                      </div>
                    </div>
                    <div className="mb-6">
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Personal Message</h4>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700 line-clamp-3">{invitation.message}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Decline
                      </Button>
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                        Accept
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {showStudentModal && (
        <div className="fixed inset-0 z-50 bg-white flex items-center justify-center overflow-auto">
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col">
            <StudentInvitationView
              open={showStudentModal}
              onClose={() => setShowStudentModal(false)}
              invitation={studentInvitation}
              onAccept={() => setShowStudentModal(false)}
              onDecline={() => setShowStudentModal(false)}
            />
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl z-10"
              onClick={() => setShowStudentModal(false)}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}
      {showCancelModal && (
        <Dialog open={showCancelModal} onOpenChange={() => setShowCancelModal(false)}>
          <DialogContent className="max-w-md">
            <DialogTitle>Cancel Invitation</DialogTitle>
            <div className="mt-2 text-gray-700">
              Are you sure you want to cancel this invitation? This action cannot be undone.
            </div>
            {cancelError && (
              <div className="mt-2 text-red-600 text-sm">{cancelError}</div>
            )}
            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowCancelModal(false)}
                disabled={isCancelling}
                className="flex-1"
              >
                Keep Invitation
              </Button>
              <Button
                onClick={handleCancelInvitation}
                disabled={isCancelling}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {isCancelling ? "Cancelling..." : "Cancel Invitation"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
