import React, { useState } from "react"
import { Avatar, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, MoreHorizontal, Star, Trash2 } from "lucide-react"
import { BsPersonAdd } from "react-icons/bs"
import { MessageSquare } from "lucide-react"

interface Student {
  id: string
  name: string
  title: string
  field: string
  avatar: string
  yearAndSection: string
}

interface GridStudentsProps {
  students: Student[]
  connectionStates: Record<string, string>
  onConnect: (id: string) => void
  showMessageForConnected?: boolean
  onUnfriend?: (id: string) => void
  onToggleFavorite?: (id: string) => void
  favoriteIds?: string[] 
}

export function GridStudents({
  students,
  connectionStates,
  onConnect,
  showMessageForConnected = false,
  onUnfriend,
  onToggleFavorite,
  favoriteIds = [],
}: GridStudentsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {students.map((student) => (
        <StudentCard
          key={student.id}
          student={student}
          connectionState={connectionStates[student.id] || "Connect"}
          onConnect={() => onConnect(student.id)}
          showMessageForConnected={showMessageForConnected}
          onUnfriend={onUnfriend}
          onToggleFavorite={onToggleFavorite}
          isFavorite={favoriteIds.includes(student.id)}
        />
      ))}
    </div>
  )
}

interface StudentCardProps {
  student: Student
  connectionState: string
  onConnect: () => void
  showMessageForConnected?: boolean
  onUnfriend?: (id: string) => void
  onToggleFavorite?: (id: string) => void
  isFavorite?: boolean
}

function StudentCard({
  student,
  connectionState,
  onConnect,
  showMessageForConnected,
  onUnfriend,
  onToggleFavorite,
  isFavorite,
}: StudentCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const [unfriendDialogOpen, setUnfriendDialogOpen] = useState(false)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => setAnchorEl(null)

  const handleUnfriendClick = () => {
    handleMenuClose()
    setUnfriendDialogOpen(true)
  }

  const handleUnfriendConfirm = () => {
    setUnfriendDialogOpen(false)
    onUnfriend?.(student.id)
  }

  const handleUnfriendCancel = () => {
    setUnfriendDialogOpen(false)
  }

  return (
    <div className="bg-white border border-blue-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-16 relative">
        {showMessageForConnected && connectionState === "Connected" ? (
          <>
            <button
              className="absolute top-2 right-2 text-white hover:bg-white/20 rounded-full p-1"
              onClick={handleMenuOpen}
            >
              <MoreHorizontal size={16} />
            </button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
              <MenuItem onClick={() => { onToggleFavorite?.(student.id); handleMenuClose(); }}>
                <Star className={`h-4 w-4 mr-2 text-yellow-500 ${isFavorite ? "fill-yellow-500" : ""}`} />
                {isFavorite ? "Unfavorite" : "Favorite"}
              </MenuItem>
              <MenuItem onClick={handleUnfriendClick}>
                <Trash2 className="h-4 w-4 mr-2 text-gray-500" />
                Unfriend
              </MenuItem>
            </Menu>
            <Dialog open={unfriendDialogOpen} onClose={handleUnfriendCancel}>
              <DialogTitle>Are you sure you want to unfriend?</DialogTitle>
              <DialogContent>
                This action cannot be undone. You will be removed from each other&apos;s friends list.
              </DialogContent>
              <DialogActions>
                <Button variant="outline" onClick={handleUnfriendCancel}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleUnfriendConfirm}>
                  Unfriend
                </Button>
              </DialogActions>
            </Dialog>
          </>
        ) : (
          <button className="absolute top-2 right-2 text-white hover:bg-white/20 rounded-full p-1">
            <X size={16} />
          </button>
        )}
      </div>
      <div className="px-4 pt-10 pb-4 relative">
        <Avatar
          src={student.avatar || "/placeholder.svg"}
          alt={student.name}
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-white"
        >
          {student.name.charAt(0)}
        </Avatar>

        <div className="text-center mb-2">
          <h3 className="font-medium text-gray-900 flex items-center justify-center">
            {student.name}
            {isFavorite && (
              <Star className="h-3 w-3 ml-1 text-yellow-500 fill-yellow-500" />
            )}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-1">{student.title}</p>
          <p className="text-sm text-gray-400">{student.yearAndSection}</p>
        </div>

        <div className="flex items-center justify-center mb-3">
          <div className="bg-yellow-400 text-black text-xs font-bold px-1 py-0.5 rounded mr-1 flex items-center justify-center">
            STI
          </div>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
            BS - {student.field}
          </Badge>
        </div>

        {showMessageForConnected && connectionState === "Connected" ? (
          <Button
            variant="default"
            size="sm"
            className="w-full rounded-full bg-blue-500 text-white hover:bg-blue-600 border-0"
          >
            <MessageSquare className="mr-1" />
            Message
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            className="w-full rounded-full bg-blue-500 text-white hover:bg-blue-600 border-0"
            onClick={onConnect}
          >
            <BsPersonAdd className="mr-1" />
            {connectionState}
          </Button>
        )}
      </div>
    </div>
  )
}