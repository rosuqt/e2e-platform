import { FileText, Download, ExternalLink, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function ResumeTab({
  resumeUrl,
  resume,
  documents,
  achievements = [],
  portfolio = []
}: {
  resumeUrl?: string | null
  resume?: string
  documents: { name: string; date: string; size: string }[]
  achievements?: (string | { name: string; url: string })[]
  portfolio?: (string | { name: string; url: string })[]
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(resumeUrl && typeof resumeUrl === "string" && resumeUrl.length > 0 ? resumeUrl : null)
  const [previewLabel, setPreviewLabel] = useState<string>("Resume Preview")

  function handlePreview(url: string, label: string) {
    setPreviewUrl(url)
    setPreviewLabel(label)
  }

  return (
    <div className="space-y-2">
      <h3 className="text-md font-semibold text-blue-700">Candidate Documents</h3>
      <div className="mt-2 border border-gray-200 rounded-lg p-4 bg-gray-50">
        {previewUrl ? (
          <>
            {(() => {
              const ext = previewLabel.split('.').pop()?.toLowerCase() || ""
              if (ext === "pdf") {
                return (
                  <iframe
                    src={previewUrl}
                    title={previewLabel}
                    className="w-full h-[600px] rounded"
                    style={{ border: 0 }}
                  />
                )
              }
              if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) {
                return (
                  <img src={previewUrl} alt={previewLabel} className="w-full max-h-[600px] object-contain rounded" />
                )
              }
              return (
                <div className="text-center text-gray-500 py-8">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <h3 className="text-lg font-medium text-gray-700">{previewLabel}</h3>
                  <p className="text-sm">Click on a document above to preview it her</p>
                </div>
              )
            })()}
          </>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <h3 className="text-lg font-medium text-gray-700">Resume Preview</h3>
            <p className="text-sm">Click on a document above to preview it here</p>
          </div>
        )}
      </div>
      {(resumeUrl && resume) && (
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
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-3"
              onClick={() => handlePreview(resumeUrl, resume.split("/").pop() || "Resume Preview")}
            >
              <Eye className="h-4 w-4 text-blue-600" />
              Preview
            </Button>
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" download>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              >
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
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
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
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
      {achievements.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-blue-700 mt-4 mb-2">Achievements</h4>
          {achievements.map((ach, idx) => {
            if (typeof ach === "string") {
              const fileName = ach.split("/").pop() || ach
              return (
                <div key={idx} className="flex items-center justify-between border rounded-md p-3 mb-2">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-sm">{fileName}</div>
                      <div className="text-xs text-gray-500">Achievement</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-3"
                      onClick={() => handlePreview(ach, fileName)}
                    >
                      <Eye className="h-4 w-4 text-blue-600" />
                      Preview
                    </Button>
                    <a href={ach} target="_blank" rel="noopener noreferrer" download>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </a>
                  </div>
                </div>
              )
            }
            if (ach && typeof ach === "object" && "name" in ach) {
              return (
                <div key={idx} className="flex items-center justify-between border rounded-md p-3 mb-2">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-sm">{ach.name}</div>
                      <div className="text-xs text-gray-500">Achievement</div>
                    </div>
                  </div>
                  {ach.url ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-3"
                        onClick={() => handlePreview(ach.url, ach.name)}
                      >
                        <Eye className="h-4 w-4 text-blue-600" />
                        Preview
                      </Button>
                      <a href={ach.url} target="_blank" rel="noopener noreferrer" download>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                      </a>
                    </div>
                  ) : null}
                </div>
              )
            }
            return null
          })}
        </div>
      )}
      {portfolio.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-blue-700 mt-4 mb-2">Portfolio</h4>
          {portfolio.map((item, idx) => {
            if (typeof item === "string") {
              const fileName = item.split("/").pop() || item
              return (
                <div key={idx} className="flex items-center justify-between border rounded-md p-3 mb-2">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-medium text-sm">{fileName}</div>
                      <div className="text-xs text-gray-500">Portfolio</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-3"
                      onClick={() => handlePreview(item, fileName)}
                    >
                      <Eye className="h-4 w-4 text-blue-600" />
                      Preview
                    </Button>
                    <a href={item} target="_blank" rel="noopener noreferrer" download>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </a>
                  </div>
                </div>
              )
            }
            if (item && typeof item === "object" && "name" in item) {
              return (
                <div key={idx} className="flex items-center justify-between border rounded-md p-3 mb-2">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-gray-500">Portfolio</div>
                    </div>
                  </div>
                  {item.url ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-3"
                        onClick={() => handlePreview(item.url, item.name)}
                      >
                        <Eye className="h-4 w-4 text-blue-600" />
                        Preview
                      </Button>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" download>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                      </a>
                    </div>
                  ) : null}
                </div>
              )
            }
            return null
          })}
        </div>
      )}
    </div>
  )
}
