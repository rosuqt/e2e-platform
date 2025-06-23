import { FileText, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ResumeTab({
  resumeUrl,
  resume,
  documents
}: {
  resumeUrl?: string | null
  resume?: string
  documents: { name: string; date: string; size: string }[]
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-md font-semibold text-blue-700">Candidate Documents</h3>
      {resumeUrl && resume && (
        <div className="flex items-center justify-between border rounded-md p-3 mb-4">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-medium text-sm capitalize">
                {resume.split("/").pop()}
              </div>
              <div className="text-xs text-gray-500">
                {(() => {
                  const fileName = resume?.split("/").pop()?.toLowerCase() || ""
                  if (fileName.includes("cover")) return "Cover Letter"
                  return "Resume"
                })()}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" download>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
            </a>
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Open</span>
              </Button>
            </a>
          </div>
        </div>
      )}
      {documents.map((doc, index) => (
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
      <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
        {resumeUrl ? (
          <iframe
            src={resumeUrl}
            title="Resume PDF"
            className="w-full h-[600px] rounded"
            style={{ border: 0 }}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <h3 className="text-lg font-medium text-gray-700">Resume Preview</h3>
            <p className="text-sm">Click on a document above to preview it here</p>
          </div>
        )}
      </div>
    </div>
  )
}
