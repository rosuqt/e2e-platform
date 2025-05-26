"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, CheckCircle } from "lucide-react"

interface EmailVerificationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmailVerificationModal({ open, onOpenChange }: EmailVerificationModalProps) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
    }
  }

  const handleClose = () => {
    setSubmitted(false)
    setEmail("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto bg-purple-100 p-3 rounded-full mb-4">
            <Mail className="h-6 w-6 text-purple-600" />
          </div>
          <DialogTitle className="text-center">Verify Your Email</DialogTitle>
          <DialogDescription className="text-center">
            {!submitted
              ? "Enter your email address to receive a verification link."
              : "Check your inbox for the verification link we just sent."}
          </DialogDescription>
        </DialogHeader>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                Send Verification Link
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="mx-auto bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <p>
              We've sent a verification link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Please check your inbox and click the link to verify your email address. If you don't see the email, check
              your spam folder.
            </p>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
