import React, { useState } from "react"
import { Avatar, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, MoreHorizontal, Star, Trash2 } from "lucide-react"
import { BsPersonAdd } from "react-icons/bs"
import { MessageSquare } from "lucide-react"
import { Loader2 } from "lucide-react"
import { TbUserX } from "react-icons/tb"

interface Student {
  id: string
  name: string
  title: string
  field: string
  avatar: string
  yearAndSection: string
  cover?: string
}

interface GridStudentsProps {
  students: Student[]
  connectionStates: Record<string, string>
  onConnect: (id: string) => void
  showMessageForConnected?: boolean
  onUnfriend?: (id: string) => void
  onToggleFavorite?: (id: string) => void
  favoriteIds?: string[]
  loading?: boolean
  onHide?: (id: string) => void
}

export function GridStudents({
  students,
  connectionStates,
  onConnect,
  showMessageForConnected = false,
  onUnfriend,
  onToggleFavorite,
  favoriteIds = [],
  loading = false,
  onHide,
}: GridStudentsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-12 w-full">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-blue-200 rounded-xl overflow-hidden shadow-sm animate-pulse">
            <div className="h-16 bg-gradient-to-r from-blue-100 to-blue-200" />
            <div className="px-4 pt-10 pb-4 relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 -mb-11" style={{ width: 80, height: 80, top: -64 }}>
                <div className="w-20 h-20 rounded-full bg-blue-100" />
              </div>
              <div className="text-center mb-2 mt-8">
                <div className="h-4 bg-blue-100 rounded w-2/3 mx-auto mb-2" />
                <div className="h-3 bg-blue-50 rounded w-1/2 mx-auto mb-1" />
                <div className="h-3 bg-blue-50 rounded w-1/3 mx-auto" />
              </div>
              <div className="flex items-center justify-center mb-3">
                <div className="bg-yellow-100 text-blue-800 text-xs font-bold px-2 py-1 rounded mr-1 w-10 h-5" />
                <div className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs rounded w-20 h-5" />
              </div>
              <div className="h-8 bg-blue-100 rounded w-full mt-2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
          onHide={onHide}
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
  onHide?: (id: string) => void
}

function StudentCard({
  student,
  connectionState,
  onConnect,
  showMessageForConnected,
  onUnfriend,
  onToggleFavorite,
  isFavorite,
  onHide,
}: StudentCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const [unfriendDialogOpen, setUnfriendDialogOpen] = useState(false)
  const [connectBtnLoading, setConnectBtnLoading] = useState(false)

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

  const handleConnectClick = async () => {
    setConnectBtnLoading(true)
    await onConnect()
    setConnectBtnLoading(false)
  }

  return (
    <div className="bg-white border border-blue-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div
        className="h-16 relative"
        style={{
          background: student.cover
            ? `url(${student.cover}) center/cover no-repeat`
            : "linear-gradient(90deg, #4f8cff 0%, #b36fff 100%)"
        }}
      >
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
          <button className="absolute top-2 right-2 text-white hover:bg-white/20 rounded-full p-1" onClick={() => onHide?.(student.id)}>
            <X size={16} />
          </button>
        )}
      </div>
      <div className="px-4 pt-10 pb-4 relative">
        <Avatar
          src={student.avatar && student.avatar.trim() !== "" ? student.avatar : undefined}
          alt={student.name}
          className="absolute left-1/2 transform -translate-x-1/2 border-4 border-white -mb-11"
          style={{ width: 80, height: 80, top: -64 }}
        >
          {(!student.avatar || student.avatar.trim() === "") &&
            student.name &&
            student.name.trim().length > 0 &&
            student.name.trim()[0].toUpperCase()}
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
          <div className="bg-yellow-400 text-blue-800 text-xs font-bold px-1 py-0.5 rounded mr-1 flex items-center justify-center">
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
        ) : connectionState === "Requested" ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-full border-blue-600 text-blue-600 bg-white hover:text-blue-700 flex items-center justify-center"
            onClick={handleConnectClick}
            disabled={connectBtnLoading}
          >
            {connectBtnLoading ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <TbUserX className="mr-1" />
            )}
            Cancel Request
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            className="w-full rounded-full bg-blue-500 text-white hover:bg-blue-600 border-0 flex items-center justify-center"
            onClick={handleConnectClick}
            disabled={connectBtnLoading}
          >
            {connectBtnLoading ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <BsPersonAdd className="mr-1" />
            )}
            {connectionState}
          </Button>
        )}
      </div>
    </div>
  )
}