"use client"
import { useState, useEffect } from "react"
import { Search, Bell, ChevronDown } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu, MenuItem, Button as MUIButton } from "@mui/material"
import NotificationItem from "./notification-item"
import NotificationOverlay from "../../../top-nav/notification-overlay"

type Notif = {
  content: string;
  created_at: Date;
  external_id: string;
  source: string;
  title: string;
  updated_at: Date;
  user_id: string;
}


export default function NotificationsPage() {
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null)
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [notif, setnotif] = useState<Notif[]>();

  const fetchNotifications = async() => {
  const res = await fetch("/api/employers/notifications", {
    method: "GET",
  });

 

  if (!res.ok) {
    throw new Error("Failed to load notifications");
  }

  const data = await res.json();
  setnotif(data.notifications);
  console.log(data);
  
  }
  useEffect(() => { fetchNotifications() }, []);

  const handleNotificationClick = (id: string) => {
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
                <TabsList className="grid grid-cols-4  mb-4">
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
                  <TabsTrigger
                    value="account"
                    className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                  >
                    Account
                  </TabsTrigger>
                </TabsList>

             
                
                {/* NOTIF STARTS HERE */}
                <TabsContent value="all" className="mt-0 min-h-[400px]">
                  <h3 className="text-lg font-semibold mb-4 text-blue-800">Latest Notifications</h3>
                  <div className="space-y-3">
                    {notif?.map((notification) => (
                      <NotificationItem 
                        key={notification.external_id}
                        notification={notification}
                        onClick={() => handleNotificationClick(notification.external_id)}
                      />
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                  </div>
                </TabsContent>

                <TabsContent value="applications" className="mt-0 min-h-[400px]">
                  <div className="text-lg font-semibold mb-4 text-blue-800">
                    <div className="space-y-3">
                      {notif
                        ?.filter((notification) => notification.source === "applications") 
                        .map((notification) => (
                          <NotificationItem
                            key={notification.external_id}
                            notification={notification}
                            onClick={() => handleNotificationClick(notification.external_id)}
                          />
                        ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="interactions" className="min-h-[400px]">
                  <div className="text-lg font-semibold mb-4 text-blue-800">
                    <div className="space-y-3">
                      {notif
                        ?.filter((notification) => notification.source === "job_offers") 
                        .map((notification) => (
                          <NotificationItem
                            key={notification.external_id}
                            notification={notification}
                            onClick={() => handleNotificationClick(notification.external_id)}
                          />
                        ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="account" className="min-h-[400px]">
                  <div className="text-lg font-semibold mb-4 text-blue-800">
                    <div className="space-y-3">
                      {notif
                        ?.filter((notification) => notification.source === "job_team_access") 
                        .map((notification) => (
                          <NotificationItem
                            key={notification.external_id}
                            notification={notification}
                            onClick={() => handleNotificationClick(notification.external_id)}
                          />
                        ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      
    </main>
  )
}
