"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Upload } from "lucide-react"

interface CompanyVerificationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CompanyVerificationModal({ open, onOpenChange }: CompanyVerificationModalProps) {
  const [activeTab, setActiveTab] = useState("business-permit")
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    // Handle file drop logic here
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto bg-blue-100 p-3 rounded-full mb-4">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <DialogTitle className="text-center">Company Verification</DialogTitle>
          <DialogDescription className="text-center">
            To ensure a secure platform, we need to verify your company identity through an official document. This
            verification helps protect your account, enhances security, and allows you to access essential platform
            features.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-green-100 text-green-800 text-sm px-4 py-2 rounded-full flex items-center justify-center">
            <Shield className="h-4 w-4 mr-2" />
            All data is safely stored and encrypted
          </div>

          <Tabs defaultValue="business-permit" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="business-permit">Business Permit</TabsTrigger>
              <TabsTrigger value="sec-registration">SEC Registration</TabsTrigger>
              <TabsTrigger value="business-license">Business License</TabsTrigger>
            </TabsList>

            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-gray-500" />
              </div>
              <p className="text-sm font-medium mb-1">Drop file here or upload</p>
              <p className="text-xs text-muted-foreground mb-4">
                Upload a clear copy of your{" "}
                {activeTab === "business-permit"
                  ? "business permit"
                  : activeTab === "sec-registration"
                    ? "SEC registration"
                    : "business license"}
              </p>

              <div className="flex justify-center space-x-2">
                <div className="px-3 py-1 bg-gray-100 rounded-md text-xs">JPG</div>
                <div className="px-3 py-1 bg-gray-100 rounded-md text-xs">PNG</div>
                <div className="px-3 py-1 bg-gray-100 rounded-md text-xs">PDF</div>
              </div>

              <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" id="file-upload" />
              <label htmlFor="file-upload">
                <Button variant="outline" size="sm" className="mt-4">
                  Select File
                </Button>
              </label>
            </div>
          </Tabs>

          <p className="text-xs text-muted-foreground">
            Your uploaded documents are encrypted and stored securely. They will only be used for verification purposes
            and will not be shared with third parties.
          </p>

          <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
