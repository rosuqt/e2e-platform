"use client"
import { useState, useEffect } from "react"
import { Search, Bell, ChevronDown } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu, MenuItem, Button as MUIButton } from "@mui/material"
import NotificationItem from "./notification-item"
import NotificationOverlay from "../../../top-nav/notification-overlay"

const notifications = [
  {
    id: 1,
    title: "Under Review",
    description: "Your application for [Job Title] is being reviewed by [Company].",
    time: "3 mins ago",
    read: false,
  },
  {
    id: 2,
    title: "Under Review",
    description: "Your application for [Job Title] is being reviewed by [Company].",
    time: "3 mins ago",
    read: false,
  },
  {
    id: 3,
    title: "Under Review",
    description: "Your application for [Job Title] is being reviewed by [Company].",
    time: "3 mins ago",
    read: false,
  },
  {
    id: 4,
    title: "Under Review",
    description: "Your application for [Job Title] is being reviewed by [Company].",
    time: "3 mins ago",
    read: false,
  },
  {
    id: 5,
    title: "Under Review",
    description: "Your application for [Job Title] is being reviewed by [Company].",
    time: "3 mins ago",
    read: false,
  },
]

type Activity = {
  id: string;
  employer_id: string;
  student_id: string;
  job_id: string;
  type: string;
  message: string;
  created_at: Date;
};

type Access = {
  id: string;
  employer_id: string;
  role: string;
  updated_at: Date;
};

type Offer = {
  id: string;
  created_at: Date;
  accept_status: string;
}


export default function NotificationsPage() {
  const [selectedNotification, setSelectedNotification] = useState<number | null>(null)
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  
  const [activity, setActivity] = useState<Activity[]>([]);
  const [access, setAccess] = useState<Access[]>([]);
  const [offer, setOffer] = useState<Offer[]>([]);

  //FETCH NOTIFS
  const getNotif = async () => {
    async function loadNotif() {
      try {
        const res = await fetch("/api/employers/notifications");
        const data = await res.json();
        setActivity(data.activity);
        setAccess(data.access);
        setOffer(data.offer);
        console.log(data.activity);
        console.log(data.access);
        console.log(data.offer);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    }

    loadNotif();
  };
  useEffect(() => { getNotif() }, []);

  const handleNotificationClick = (id: number) => {
    setSelectedNotification(id)
    setIsOverlayOpen(true)
  }

  const closeOverlay = () => {
    setIsOverlayOpen(false)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }


  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50">
      <div className="min-h-screen max-w-6xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-1"></div>
          <div className="p-8 md:p-12">
            <div className="pb-2">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-blue-700">Notifications</h1>
                <Button variant="outline" size="icon" className="rounded-full bg-blue-50 text-blue-700">
                  <Bell className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid grid-cols-5 mb-4">
                  <TabsTrigger value="all" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="applications"
                    className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                  >
                    Applications
                  </TabsTrigger>
                  <TabsTrigger
                    value="interactions"
                    className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                  >
                    Interactions
                  </TabsTrigger>
                  <TabsTrigger value="jobs" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                    Jobs
                  </TabsTrigger>
                  <TabsTrigger
                    value="account"
                    className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                  >
                    Account
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center justify-between mb-6 gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Search messages" className="pl-10 border-blue-200 focus:border-blue-500" />
                  </div>
                  <div>
                    <MUIButton
                      variant="outlined"
                      onClick={handleMenuOpen}
                      className="flex items-center gap-2 border-blue-200"
                    >
                      Sort by: Newest First
                      <ChevronDown className="h-4 w-4" />
                    </MUIButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                    >
                      <MenuItem onClick={handleMenuClose}>Newest First</MenuItem>
                      <MenuItem onClick={handleMenuClose}>Oldest First</MenuItem>
                      <MenuItem onClick={handleMenuClose}>Unread</MenuItem>
                    </Menu>
                  </div>
                </div>
                
                {/* NOTIF STARTS HERE */}
                <TabsContent value="all" className="mt-0 min-h-[400px]">
                  <h3 className="text-lg font-semibold mb-4 text-blue-800">Latest Notifications</h3>
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onClick={() => handleNotificationClick(notification.id)}
                      />
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <Button variant="ghost" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                      Load more
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="applications" className="min-h-[400px]">
                  <div className="p-8 text-center text-gray-500">
                    <p>Application notifications will appear here</p>
                  </div>
                </TabsContent>

                <TabsContent value="interactions" className="min-h-[400px]">
                  <div className="p-8 text-center text-gray-500">
                    <p>Interaction notifications will appear here</p>
                  </div>
                </TabsContent>

                <TabsContent value="jobs" className="min-h-[400px]">
                  <div className="p-8 text-center text-gray-500">
                    <p>Job notifications will appear here</p>
                  </div>
                </TabsContent>

                <TabsContent value="account" className="min-h-[400px]">
                  <div className="p-8 text-center text-gray-500">
                    <p>Account notifications will appear here</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {isOverlayOpen && selectedNotification && (
        <NotificationOverlay
          notification={notifications.find((n) => n.id === selectedNotification)!}
          onClose={closeOverlay}
        />
      )}
    </main>
  )
}
