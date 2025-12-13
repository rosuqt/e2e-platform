/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Star } from "lucide-react"

type StudentInvitationPreviewProps = {
  invitationId: string
}

export default function StudentInvitationPreview({ invitationId }: StudentInvitationPreviewProps) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!invitationId) return
    setLoading(true)
    setError(null)
    fetch(`/api/students/invitations?invitation_id=${invitationId}`)
      .then(res => res.json())
      .then(json => {
        if (json.invitation) setData(json.invitation)
        else setError(json.error || "Not found")
      })
      .catch(e => setError(e.message || "Error"))
      .finally(() => setLoading(false))
  }, [invitationId])

  if (loading) {
    return (
      <Card className="shadow-2xl">
        <CardContent className="p-6 text-center text-gray-500">Loading invitation...</CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card className="shadow-2xl">
        <CardContent className="p-6 text-center text-red-500">{error || "Invitation not found"}</CardContent>
      </Card>
    )
  }

  return (
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
            <AvatarImage src={data.company_logo || "/placeholder.svg"} />
            <AvatarFallback className="bg-blue-600 text-white">
              {/* Remove company_name initial */}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            {/* <h3 className="font-semibold text-sm">{data.company_name}</h3> */}
            <p className="text-xs text-gray-600">
              by {data.employer_first_name} {data.employer_last_name}
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold text-lg text-gray-900">{data.job_title}</h3>
          <div className="flex items-center gap-1 mt-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-green-600">
              {typeof data.match_score === "number"
                ? data.match_score
                : (data.match_score && !isNaN(Number(data.match_score)) ? Number(data.match_score) : 0)
              }
              % match
            </span>
          </div>
        </div>
        <div className="mb-2">
          <h4 className="font-medium text-sm text-gray-700 mb-2">Personal Message</h4>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700 line-clamp-3">{data.message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
