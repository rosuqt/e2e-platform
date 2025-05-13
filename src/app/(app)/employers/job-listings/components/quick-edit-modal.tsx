"use client"

import { Button } from "@/components/ui/button"

export default function QuickEditModal({ jobId, onClose }: { jobId: number; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-bold mb-4">Quick Edit Job #{jobId}</h2>
        <p className="text-sm text-gray-600 mb-6">This is a placeholder for the Quick Edit Modal content.</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={onClose}>
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
