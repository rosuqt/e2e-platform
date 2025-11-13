"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, Star, MapPin, Clock, DollarSign, Users, CheckCircle, XCircle, ExternalLink, Heart } from "lucide-react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

type JobInvitation = {
  id: string
  companyName: string
  companyLogo?: string
  employerName: string
  employerAvatar?: string
  employerTitle: string
  jobTitle: string
  jobLocation: string
  jobType: string
  salary?: string
  matchScore: number
  message: string
  companySize: string
  benefits: string[]
  requirements: string[]
  receivedDate: string
}

type StudentInvitationViewProps = {
  open: boolean
  onClose: () => void
  invitation: JobInvitation
  onAccept: () => void
  onDecline: () => void
}

export default function StudentInvitationView({
  open,
  onClose,
  invitation,
  onAccept,
  onDecline,
}: StudentInvitationViewProps) {
  const [isAccepting, setIsAccepting] = useState(false)
  const [isDeclining, setIsDeclining] = useState(false)

  const handleAccept = async () => {
    setIsAccepting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000)) 
    onAccept()
    setIsAccepting(false)
  }

  const handleDecline = async () => {
    setIsDeclining(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onDecline()
    setIsDeclining(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full h-full max-h-[90vh] p-0 bg-white flex flex-col overflow-y-auto">
        <DialogTitle asChild>
          <VisuallyHidden>
            <h2>Job Invitation</h2>
          </VisuallyHidden>
        </DialogTitle>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">You&apos;ve received a job invitation!</h1>
              <p className="text-blue-100 text-sm">Received on {invitation.receivedDate}</p>
            </div>
          </div>

          {/* Match Score Highlight */}
          <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{invitation.matchScore}% Match</span>
            <span className="text-blue-100">• Great compatibility!</span>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {/* Company & Employer Section */}
          <Card className="mb-6 border-2 border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 border-2 border-white shadow-lg">
                  <AvatarImage src={invitation.companyLogo || "/placeholder.svg"} />
                  <AvatarFallback className="bg-blue-600 text-white text-lg">
                    {invitation.companyName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">{invitation.companyName}</h2>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{invitation.companySize}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={invitation.employerAvatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gray-600 text-white">
                    {invitation.employerName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{invitation.employerName}</h3>
                  <p className="text-sm text-gray-600">{invitation.employerTitle}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Details */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{invitation.jobTitle}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {invitation.jobLocation}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {invitation.jobType}
                    </div>
                    {invitation.salary && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {invitation.salary}
                      </div>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </div>

              {/* Benefits */}
              {invitation.benefits.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Benefits & Perks</h4>
                  <div className="flex flex-wrap gap-2">
                    {invitation.benefits.map((benefit, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {invitation.requirements.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Key Requirements</h4>
                  <div className="flex flex-wrap gap-2">
                    {invitation.requirements.map((req, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Personal Message */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Personal Message from {invitation.employerName}
              </h3>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{invitation.message}</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 sticky bottom-0 bg-white pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleDecline}
              disabled={isAccepting || isDeclining}
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
            >
              {isDeclining ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                  Declining...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Decline
                </>
              )}
            </Button>
            <Button
              onClick={handleAccept}
              disabled={isAccepting || isDeclining}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isAccepting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Accepting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept Invitation
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
