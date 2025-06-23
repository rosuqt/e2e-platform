import Avatar from "@mui/material/Avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Edit, Trash2 } from "lucide-react"
import { LuNotebookPen } from "react-icons/lu"
import type React from "react"

type RecruiterNote = {
  employer_name: string
  job_title: string
  date_added: string
  note: string
  profile_img?: string | null
}

export default function NoteTab({
  notes,
  employerName,
  editMode,
  editNoteIdx,
  editNoteText,
  loading,
  newNote,
  setEditMode,
  setEditNoteIdx,
  setEditNoteText,
  handleEditNote,
  handleSaveEditNote,
  handleDeleteNote,
  setNewNote,
  handleAddNote
}: {
  notes: RecruiterNote[]
  employerName: string
  editMode: boolean
  editNoteIdx: number | null
  editNoteText: string
  loading: boolean
  newNote: string
  setEditMode: (v: boolean) => void
  setEditNoteIdx: (v: number | null) => void
  setEditNoteText: (v: string) => void
  handleEditNote: (idx: number) => void
  handleSaveEditNote: () => void
  handleDeleteNote: (idx: number) => void
  setNewNote: (v: string) => void
  handleAddNote: () => void
}) {
  function formatNoteDate(dateString?: string) {
    if (!dateString) return ""
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const month = monthNames[date.getMonth()]
    const day = date.getDate().toString().padStart(2, '0')
    const year = date.getFullYear().toString()
    return `${month} ${day} ${year}`
  }

  return (
    <>
      <div className="space-y-2">
        <h3 className="text-md font-semibold text-blue-700">Recruiter Notes</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 min-h-[48px]">
          {notes.length === 0 && <p className="text-sm text-gray-500">No notes yet.</p>}
          {notes.map((n, idx) => {
            const isOwnNote = n.employer_name === employerName
            return (
              <div key={idx} className="mb-4">
                <div className="flex items-center gap-2">
                  {n.profile_img ? (
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        fontWeight: "bold",
                        bgcolor: "#DBEAFE",
                        color: "#2563EB",
                        fontSize: 16,
                      }}
                      src={n.profile_img}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        fontWeight: "bold",
                        bgcolor: "#DBEAFE",
                        color: "#2563EB",
                        fontSize: 16,
                      }}
                    >
                      {(n.employer_name || "R")[0]}
                    </Avatar>
                  )}
                  <div>
                    <div className="font-medium text-sm">{n.employer_name}</div>
                    <div className="text-xs text-gray-500">{n.job_title} • {formatNoteDate(n.date_added)}</div>
                  </div>
                </div>
                {editMode && editNoteIdx === idx ? (
                  <div className="mt-2">
                    <textarea
                      className="w-full border border-gray-200 rounded-md p-2 text-sm"
                      rows={3}
                      value={editNoteText}
                      onChange={e => setEditNoteText(e.target.value)}
                    />
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={handleSaveEditNote} disabled={loading}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { setEditMode(false); setEditNoteIdx(null); }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-700">{n.note}</p>
                    {isOwnNote && (
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditNote(idx)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteNote(idx)} disabled={loading}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <Separator />
      <div className="space-y-2">
        <h3 className="text-md font-semibold text-blue-700">Add New Note</h3>
        <textarea
          className="w-full border border-gray-200 rounded-md p-3 text-sm"
          rows={4}
          placeholder="Add your notes about this candidate..."
          value={newNote}
          onChange={e => setNewNote(e.target.value)}
          disabled={loading}
        ></textarea>
        <Button size="sm" className="mt-2" onClick={handleAddNote} disabled={loading || !newNote.trim()}>
          <LuNotebookPen className="h-4 w-4 mr-2" />
          Save Note
        </Button>
      </div>
    </>
  )
}
