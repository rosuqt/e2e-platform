import { useState } from "react"
import { Avatar, Menu, MenuItem } from "@mui/material"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Star,  Trash2 } from "lucide-react"
import { MessageSquare } from "lucide-react"

interface Employer {
  id: string
  name: string
  company: string
  job_title: string
  avatar: string
  isFavorite?: boolean
}

interface ListEmployersProps {
  employers: Employer[]
  onToggleFavorite?: (id: string) => void
  onUnfollow?: (id: string) => void
  favoriteIds?: string[]
}

export function ListEmployers({
  employers,
  onToggleFavorite,
  onUnfollow,
  favoriteIds = [],
}: ListEmployersProps) {
  return (
    <div className="space-y-4">
      {employers.map((employer) => (
        <EmployerListItem
          key={employer.id}
          employer={employer}
          onToggleFavorite={onToggleFavorite}
          onUnfollow={onUnfollow}
          isFavorite={favoriteIds.includes(employer.id)}
        />
      ))}
    </div>
  )
}

interface EmployerListItemProps {
  employer: Employer
  onToggleFavorite?: (id: string) => void
  onUnfollow?: (id: string) => void
  isFavorite?: boolean
}

function EmployerListItem({
  employer,
  onToggleFavorite,
  onUnfollow,
  isFavorite,
}: EmployerListItemProps) {
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
        <Avatar className="h-12 w-12 mr-3" src={employer.avatar || "/placeholder.svg"} alt={employer.name}>
          {employer.name.charAt(0)}
        </Avatar>
        <div>
          <h3 className="font-medium text-gray-900 flex items-center text-base">
            {employer.name}
            {isFavorite && <Star className="h-3 w-3 ml-1 text-yellow-500 fill-yellow-500" />}
          </h3>
          <div className="text-sm text-gray-500">
            {employer.company}
            <br />
            {employer.job_title}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="default"
          size="sm"
          className="border-0 bg-blue-500 text-white hover:bg-blue-600 rounded-full"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Message
        </Button>
        <button
          className="text-gray-600 hover:bg-gray-100 rounded-full p-1"
          onClick={handleMenuOpen}
        >
          <MoreHorizontal size={16} />
        </button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={() => { onToggleFavorite?.(employer.id); handleMenuClose(); }}>
            <Star className={`h-4 w-4 mr-2 text-yellow-500 ${isFavorite ? "fill-yellow-500" : ""}`} />
            {isFavorite ? "Unfavorite" : "Favorite"}
          </MenuItem>
          <MenuItem onClick={() => { onUnfollow?.(employer.id); handleMenuClose(); }}>
            <Trash2 className="h-4 w-4 mr-2 text-gray-500" />
            Unfollow
          </MenuItem>
        </Menu>
      </div>
    </div>
  )
}
