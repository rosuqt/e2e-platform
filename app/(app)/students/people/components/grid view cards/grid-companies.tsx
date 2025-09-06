import React, { useState } from "react"
import { Avatar, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, MoreHorizontal, Star, Trash2, Eye, MapPin } from "lucide-react"
import { BsPersonAdd } from "react-icons/bs"

interface Company {
  id: string
  name: string
  industry: string
  location: string
  avatar: string
}

interface GridCompaniesProps {
  companies: Company[]
  connectionStates: Record<string, string>
  onConnect: (id: string) => void
  onUnfollow?: (id: string) => void
  onToggleFavorite?: (id: string) => void
  favoriteIds?: string[]
}

export function GridCompanies({
  companies,
  connectionStates,
  onConnect,
  onUnfollow,
  onToggleFavorite,
  favoriteIds = [],
}: GridCompaniesProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          connectionState={connectionStates[company.id] || "Follow"}
          onConnect={() => onConnect(company.id)}
          onUnfollow={onUnfollow}
          onToggleFavorite={onToggleFavorite}
          isFavorite={favoriteIds.includes(company.id)}
        />
      ))}
    </div>
  )
}

interface CompanyCardProps {
  company: Company
  connectionState: string
  onConnect: () => void
  onUnfollow?: (id: string) => void
  onToggleFavorite?: (id: string) => void
  isFavorite?: boolean
}

function CompanyCard({
  company,
  connectionState,
  onConnect,
  onUnfollow,
  onToggleFavorite,
  isFavorite,
}: CompanyCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const [unfollowDialogOpen, setUnfollowDialogOpen] = useState(false)

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
    onUnfollow?.(company.id)
  }

  const handleUnfollowCancel = () => {
    setUnfollowDialogOpen(false)
  }

  const isFollowed = connectionState === "Followed" || connectionState === "Connected"

  return (
    <div className="bg-white border border-blue-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-16 relative">
        {isFollowed ? (
          <>
            <button
              className="absolute top-2 right-2 text-white hover:bg-white/20 rounded-full p-1"
              onClick={handleMenuOpen}
            >
              <MoreHorizontal size={16} />
            </button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
              <MenuItem onClick={() => { onToggleFavorite?.(company.id); handleMenuClose(); }}>
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
                This action cannot be undone. You will stop following this company.
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
          src={company.avatar || "/placeholder.svg"}
          alt={company.name}
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-white"
        >
          {company.name.charAt(0)}
        </Avatar>

        <div className="text-center mb-2">
          <h3 className="font-medium text-gray-900 flex items-center justify-center">
            {company.name}
            {isFavorite && (
              <Star className="h-3 w-3 ml-1 text-yellow-500 fill-yellow-500" />
            )}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-1">{company.industry}</p>
        </div>

        <div className="flex items-center justify-center mb-3">
          <div className="bg-blue-500 text-white text-xs font-bold px-1 py-0.5 rounded mr-1 flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
            {company.location}
          </Badge>
        </div>

        {isFollowed ? (
          <Button
            variant="default"
            size="sm"
            className="w-full rounded-full bg-blue-500 text-white hover:bg-blue-600 border-0"
          >
            <Eye className="mr-1" />
            View Profile
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
