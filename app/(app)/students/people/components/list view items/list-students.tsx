import { useState } from "react"
import { Avatar, Menu, MenuItem } from "@mui/material"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Star, Trash2, MessageSquare } from "lucide-react"

export interface Student {
  id: string
  name: string
  title: string
  field: string
  avatar: string
  yearAndSection: string
}

interface ListStudentsProps {
  students: Student[]
  connectionStates?: Record<string, string>
  onToggleFavorite?: (id: string) => void
  onUnfriend?: (id: string) => void
  favoriteIds?: string[]
  showMessageForConnected?: boolean
}

export function ListStudents({
  students,
  connectionStates = {},
  onToggleFavorite,
  onUnfriend,
  favoriteIds = [],
  showMessageForConnected = false,
}: ListStudentsProps) {
  return (
    <div className="space-y-4">
      {students.map((student) => (
        <StudentListItem
          key={student.id}
          student={student}
          isFavorite={favoriteIds.includes(student.id)}
          onToggleFavorite={onToggleFavorite}
          onUnfriend={onUnfriend}
          showMessage={showMessageForConnected && connectionStates[student.id] === "Connected"}
        />
      ))}
    </div>
  )
}

function StudentListItem({
  student,
  isFavorite,
  onToggleFavorite,
  onUnfriend,
  showMessage,
}: {
  student: Student
  isFavorite: boolean
  onToggleFavorite?: (id: string) => void
  onUnfriend?: (id: string) => void
  showMessage?: boolean
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
      <div className="flex items-center">
        <Avatar className="h-12 w-12 mr-3">
          <Image src={student.avatar || "/placeholder.svg"} alt={student.name} width={48} height={48} />
        </Avatar>
        <div>
          <h3 className="font-medium text-gray-900 flex items-center">
            {student.name}
            {isFavorite && <Star className="h-3 w-3 ml-1 text-yellow-500 fill-yellow-500" />}
          </h3>
          <div className="text-sm text-gray-500">
            {student.yearAndSection}
            <br />
            {student.title}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {showMessage && (
          <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4">
            <MessageSquare className="h-4 w-4 mr-2" />
            Message
          </Button>
        )}
        <button
          className="text-gray-600 hover:bg-gray-100 rounded-full p-1"
          onClick={handleMenuOpen}
        >
          <MoreHorizontal size={16} />
        </button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem
            onClick={() => {
              onToggleFavorite?.(student.id)
              handleMenuClose()
            }}
          >
            <Star className="h-4 w-4 mr-2 text-yellow-500" />
            {isFavorite ? "Unfavorite" : "Favorite"}
          </MenuItem>
          <MenuItem
            onClick={() => {
              onUnfriend?.(student.id)
              handleMenuClose()
            }}
          >
            <Trash2 className="h-4 w-4 mr-2 text-gray-500" />
            Unfriend
          </MenuItem>
        </Menu>
      </div>
    </div>
  )
}
