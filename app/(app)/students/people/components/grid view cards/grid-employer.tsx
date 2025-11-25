import React, { useState } from "react"
import { Avatar, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, MoreHorizontal, Star, Trash2, MessageSquare, Loader2 } from "lucide-react"
import { BsPersonAdd } from "react-icons/bs"
import { LuBriefcase } from "react-icons/lu"
import { TbUserX } from "react-icons/tb"
import Image from "next/image"

interface Employer {
  id: string
  name: string
  company: string
  job_title: string
  avatar: string
  cover?: string
}

interface GridEmployerProps {
  employers: Employer[]
  connectionStates: Record<string, string>
  onConnect: (id: string) => void
  onUnfollow?: (id: string) => void
  onToggleFavorite?: (id: string) => void
  favoriteIds?: string[]
  loading?: boolean
}

export function GridEmployer({
  employers,
  connectionStates,
  onConnect,
  onUnfollow,
  onToggleFavorite,
  favoriteIds = [],
  loading,
}: GridEmployerProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-12 w-full">
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
              </div>
              <div className="flex items-center justify-center mb-3">
                <div className="bg-blue-100 text-white text-xs font-bold px-2 py-1 rounded mr-1 w-10 h-5" />
                <div className="bg-blue-50 text-blue-700 border-blue-200 text-xs rounded w-20 h-5" />
              </div>
              <div className="h-8 bg-blue-100 rounded w-full mt-2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {employers.map((employer) => (
        <EmployerCard
          key={employer.id}
          employer={employer}
          connectionState={connectionStates[employer.id] || "Follow"}
          onConnect={() => onConnect(employer.id)}
          onUnfollow={onUnfollow}
          onToggleFavorite={onToggleFavorite}
          isFavorite={favoriteIds.includes(employer.id)}
        />
      ))}
    </div>
  )
}

interface EmployerCardProps {
  employer: Employer
  connectionState: string
  onConnect: () => void
  onUnfollow?: (id: string) => void
  onToggleFavorite?: (id: string) => void
  isFavorite?: boolean
}

function EmployerCard({
  employer,
  connectionState,
  onConnect,
  onUnfollow,
  onToggleFavorite,
  isFavorite,
}: EmployerCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const [unfollowDialogOpen, setUnfollowDialogOpen] = useState(false)
  const [connectBtnLoading, setConnectBtnLoading] = useState(false)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => setAnchorEl(null)

  const handleUnfollowClick = () => {
    handleMenuClose()
    setUnfollowDialogOpen(true)
  }

  const handleUnfollowConfirm = () => {
    setUnfollowDialogOpen(false)
    onUnfollow?.(employer.id)
  }

  const handleUnfollowCancel = () => {
    setUnfollowDialogOpen(false)
  }

  const handleConnectClick = async () => {
    setConnectBtnLoading(true)
    await onConnect()
    setConnectBtnLoading(false)
  }

  const isFollowed = connectionState === "Followed" || connectionState === "Connected" || connectionState === "Following"

  const coverStyle =
    employer.cover && employer.cover !== "gradient-blue-indigo-purple"
      ? { backgroundImage: `url(${employer.cover})`, backgroundSize: "cover", backgroundPosition: "center" }
      : { background: "linear-gradient(90deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)" }

  return (
    <div className="bg-white border border-blue-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div
        className="h-16 relative"
        style={coverStyle}
      >
        {isFollowed ? (
          <>
            <button
              className="absolute top-2 right-2 text-white hover:bg-white/20 rounded-full p-1"
              onClick={handleMenuOpen}
            >
              <MoreHorizontal size={16} />
            </button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
              <MenuItem onClick={() => { onToggleFavorite?.(employer.id); handleMenuClose(); }}>
                <Star className={`h-4 w-4 mr-2 text-yellow-500 ${isFavorite ? "fill-yellow-500" : ""}`} />
                {isFavorite ? "Unfavorite" : "Favorite"}
              </MenuItem>
              <MenuItem onClick={handleUnfollowClick}>
                <Trash2 className="h-4 w-4 mr-2 text-gray-500" />
                Unfollow
              </MenuItem>
            </Menu>
            <Dialog open={unfollowDialogOpen} onClose={handleUnfollowCancel}>
              <DialogTitle>Are you sure you want to unfollow?</DialogTitle>
              <DialogContent>
                This action cannot be undone. You will stop following this employer.
              </DialogContent>
              <DialogActions>
                <Button variant="outline" onClick={handleUnfollowCancel}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleUnfollowConfirm}>
                  Unfollow
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
          src={employer.avatar || "/placeholder.svg"}
          alt={employer.name}
          className="absolute left-1/2 transform -translate-x-1/2 border-4 border-white -mb-11"
          style={{ width: 80, height: 80, top: -64 }}
        >
          <Image
            src={employer.avatar || "/placeholder.svg"}
            alt={employer.name}
            fill
            className="object-cover w-full h-full absolute inset-0 rounded-full"
            style={{ width: "100%", height: "100%" }}
            sizes="80px"
          />
        </Avatar>

        <div className="text-center mb-2">
          <h3 className="font-medium text-gray-900 flex items-center justify-center">
            {employer.name}
            {isFavorite && (
              <Star className="h-3 w-3 ml-1 text-yellow-500 fill-yellow-500" />
            )}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-1">{employer.company}</p>
        </div>

        <div className="flex items-center justify-center mb-3">
          <div className="bg-blue-500 text-white text-xs font-bold px-1 py-0.5 rounded mr-1 flex items-center justify-center">
            <LuBriefcase  />
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
            {employer.job_title}
          </Badge>
        </div>

        {connectionState === "Following" ? (
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
            Unfollow
          </Button>
        ) : isFollowed ? (
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
            onClick={handleConnectClick}
            disabled={connectBtnLoading}
          >
            {connectBtnLoading ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <BsPersonAdd className="mr-1" />
            )}
            Follow
          </Button>
        )}
      </div>
    </div>
  )
}
