"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { XCircle, Loader2, AlertCircle } from "lucide-react"

interface RejectionDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => Promise<void>
  entityName: string
}

const PREDEFINED_REASONS = [
  "Incomplete documentation",
  "Invalid business information",
  "Unverified contact details",
  "Suspicious activity detected",
  "Does not meet requirements",
  "Other"
]

export function RejectionDialog({ isOpen, onClose, onConfirm, entityName }: RejectionDialogProps) {
  const [reason, setReason] = useState<string>("")
  const [otherText, setOtherText] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Clear states whenever the dialog is closed
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setReason("")
        setOtherText("")
      }, 200) // Small delay to avoid flickering during close animation
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleConfirm = async () => {
    const finalReason = reason === "Other" ? otherText : reason
    
    setIsSubmitting(true)
    try {
      await onConfirm(finalReason)
      onClose()
    } catch (error) {
      console.error("Rejection failed", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isInvalid = !reason || (reason === "Other" && !otherText.trim())

  return (
    <Dialog open={isOpen} onOpenChange={() => !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />
            Reject Verification
          </DialogTitle>
          <DialogDescription>
            You are rejecting <strong>{entityName}</strong>. This will update the 
            <code className="bg-muted px-1 rounded mx-1">reason</code> field in your database.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason-select">Select Primary Reason</Label>
            <Select 
              onValueChange={setReason} 
              value={reason}
              disabled={isSubmitting}
            >
              <SelectTrigger id="reason-select">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {PREDEFINED_REASONS.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {reason === "Other" && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex justify-between items-center">
                <Label htmlFor="other-reason">Detailed Explanation</Label>
                <span className="text-[10px] text-muted-foreground uppercase font-bold">
                  {otherText.length} / 500
                </span>
              </div>
              <Textarea 
                id="other-reason"
                placeholder="Type the specific reason here..."
                value={otherText}
                onChange={(e) => setOtherText(e.target.value.slice(0, 500))}
                className="min-h-[120px] resize-none"
                disabled={isSubmitting}
              />
            </div>
          )}

          {reason && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>The user will see this message in their dashboard.</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm} 
            disabled={isInvalid || isSubmitting}
            className="min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Confirm Rejection"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}