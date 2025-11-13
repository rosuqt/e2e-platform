import { Avatar, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { Star, MoreHorizontal, Trash2, Eye } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface Company {
  id: string
  name: string
  industry: string
  location: string
  avatar: string
  isFavorite: boolean
}

interface ListCompaniesProps {
  companies: Company[]
  onToggleFavorite?: (id: string) => void
  onUnfollow?: (id: string) => void
  favoriteIds?: string[]
}

export function ListCompanies({
  companies,
  onToggleFavorite,
  onUnfollow,
  favoriteIds = [],
}: ListCompaniesProps) {
  return (
    <div className="divide-y divide-blue-100">
      {companies.map(company => (
        <CompanyListItem
          key={company.id}
          company={company}
          onToggleFavorite={onToggleFavorite}
          onUnfollow={onUnfollow}
          isFavorite={favoriteIds.includes(company.id)}
        />
      ))}
    </div>
  )
}

function CompanyListItem({
  company,
  onToggleFavorite,
  onUnfollow,
  isFavorite,
}: {
  company: Company
  onToggleFavorite?: (id: string) => void
  onUnfollow?: (id: string) => void
  isFavorite?: boolean
}) {
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

  return (
    <div className="flex items-center py-3 px-2 hover:bg-blue-50 transition">
      <Avatar src={company.avatar || "/placeholder.svg"} alt={company.name} className="w-12 h-12 mr-4" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <span className="font-medium text-gray-900">{company.name}</span>
          {isFavorite && <Star className="h-3 w-3 ml-1 text-yellow-500 fill-yellow-500" />}
        </div>
        <div className="text-sm text-gray-500">{company.industry} &middot; {company.location}</div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="default"
          size="sm"
          className="rounded-full bg-blue-500 text-white hover:bg-blue-600 border-0"
        >
          <Eye className="h-4 w-4 mr-1" />
          View Profile
        </Button>
        <IconButton onClick={handleMenuOpen} size="small">
          <MoreHorizontal className="h-4 w-4" />
        </IconButton>
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
      </div>
    </div>
  )
}
