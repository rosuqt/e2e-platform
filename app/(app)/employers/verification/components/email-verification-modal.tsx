"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MdEmail } from "react-icons/md"
import { useSession } from "next-auth/react"
import { Confetti } from "@/components/magicui/confetti"
import sentAnimation from "@/../public/animations/sent.json"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Loader2 } from "lucide-react"

const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

interface EmailVerificationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmailVerificationModal({ open, onOpenChange }: EmailVerificationModalProps) {
  const { data: session } = useSession()
  const sessionEmail = (session?.user as { email?: string })?.email || ""
  const sessionFirstName = (session?.user as { firstName?: string })?.firstName || ""
  const [submitted, setSubmitted] = useState(false)
  const [editing, setEditing] = useState(false)
  const [email, setEmail] = useState(sessionEmail)
  const [cooldown, setCooldown] = useState(0)
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const confettiRef = useRef(null)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [cooldown])

  useEffect(() => {
    if (typeof window !== "undefined" && open) {
      const alreadySubmitted = window.sessionStorage.getItem("email_verification_sent") === "true"
      setSubmitted(alreadySubmitted)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    if (!email) return
    if (cooldown > 0) return
    setLoading(true)
    if (editing && email !== sessionEmail) {
      const res = await fetch("/api/employers/update-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail: email }),
      })
      if (!res.ok) {
        const data = await res.json()
        if (data.error === "Email already exists") {
          setErrorMsg("This email is already registered. Please use a different email.")
          setLoading(false)
          return
        }
        setErrorMsg("Failed to update email. Please try again.")
        setLoading(false)
        return
      }
      await fetch("/api/employers/update-registered-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employer_id: (session?.user as { employerId?: string })?.employerId, email }),
      })
    }
    await fetch("/api/send-verification-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: email,
        subject: "Verify your email address",
        firstName: sessionFirstName,
        employerId: (session?.user as { employerId?: string })?.employerId,
      }),
    })
    setSubmitted(true)
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("email_verification_sent", "true")
    }
    setEditing(false)
    setCooldown(5)
    setLoading(false)
  }

  const handleClose = () => {
    setSubmitted(false)
    setEditing(false)
    setEmail(sessionEmail)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg ">
        <VisuallyHidden>
          <DialogTitle>Verify Your Email</DialogTitle>
        </VisuallyHidden>
        {!submitted ? (
          <>
            <DialogHeader>
              <div className="mx-auto bg-blue-500 p-3 rounded-full mb-4">
                <MdEmail className="h-11 w-11 text-white" />
              </div>
              <DialogTitle className="text-center text-2xl font-bold text-blue-700">Verify Your Email</DialogTitle>
              <DialogDescription className="text-center text-base text-gray-500">
                We need to send you a quick verification link—just making sure you’re really you!
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="text-base py-5 bg-blue-50 text-gray-700 border-blue-300 focus:ring-blue-400"
                  readOnly={!editing}
                />
                {errorMsg && (
                  <div className="text-red-600 text-xs mt-2">{errorMsg}</div>
                )}
                {!editing && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-xs font-medium text-blue-600 hover:bg-blue-50 mt-1"
                      onClick={() => {
                        setEditing(true)
                        setEmail("")
                        setErrorMsg("")
                      }}
                      tabIndex={0}
                    >
                      Not your email?
                    </button>
                  </div>
                )}
                {editing && (
                  <div className="text-xs text-gray-400 mt-1 ">
                    This will become your new registered email for your account.
                  </div>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-base py-3 font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Sending...
                    </span>
                  ) : (
                    "Send Verification Link"
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="relative flex flex-col items-center justify-center space-y-4 py-6">
            <Confetti ref={confettiRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
            <div className="w-40 h-40 ">
              <Lottie animationData={sentAnimation} loop={true} />
            </div>
            <div className="text-center space-y-2 ">
              <div className="text-xl font-bold text-blue-700">Verification Link Sent!</div>
              <p></p>
              <p className="text-base text-muted-foreground">
                We’ve sent a verification link for <strong>{email}</strong> take a peek at your inbox!
                <Button
                  variant="ghost"
                  className="ml-2 p-0 h-auto align-baseline text-blue-600 hover:bg-blue-50 hover:text-blue-700 inline"
                  onClick={async () => {
                    if (cooldown > 0) return
                    setResendLoading(true)
                    await fetch("/api/send-verification-email", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        to: email,
                        subject: "Verify your email address",
                        firstName: sessionFirstName,
                        employerId: (session?.user as { employerId?: string })?.employerId,
                      }),
                    })
                    setCooldown(60)
                    setResendLoading(false)
                  }}
                  disabled={cooldown > 0 || resendLoading}
                >
                  {resendLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Sending...
                    </span>
                  ) : cooldown > 0
                    ? `Resend in ${cooldown}s`
                    : "Didn’t receive anything? Resend"}
                </Button>
              </p>
            </div>
            <div className="w-full flex flex-row gap-2 mt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSubmitted(false)
                  setEditing(true)
                  setEmail("")
                }}
              >
                Back
              </Button>
              <Button onClick={handleClose} className="w-full">
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
