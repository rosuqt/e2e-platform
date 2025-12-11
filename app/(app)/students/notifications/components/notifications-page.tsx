"use client"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import NotificationItem from "./notification-item"
import NotificationOverlay from "../../../top-nav/notification-overlay"

type Notif = {
  company_name: string;
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
  const [notif, setnotif] = useState<Notif[]>();

  const fetchNotifications = async() => {
  const res = await fetch("/api/students/notifications", {
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






  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50">
      <div className="min-h-screen max-w-6xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-1"></div>
          <div className="p-8 md:p-12">
            <div className="pb-2">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-blue-700">Notifications</h1>
              </div>
            </div>
            <div>
              <Tabs defaultValue="applications" className="w-full">
                <TabsList className="grid grid-cols-2  mb-4">
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

                </TabsList>

             
                
                {/* NOTIF STARTS HERE */}
                <TabsContent value="applications" className="mt-0 min-h-[400px]">
                  <div className="text-lg font-semibold mb-4 text-blue-800">
                    <div className="space-y-3">
                      {notif
                        ?.filter((notification) => notification.source === "applications") 
                        .map((notification) => (
                          <NotificationItem
                            key={notification.external_id}
                            notif={notification}
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
                            notif={notification}
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

      {isOverlayOpen && selectedNotification && (
        (() => {
          const notification = notif?.find((n) => n.external_id === selectedNotification);
          if (!notification) return null;
          return (
            <NotificationOverlay
              notification={notification}
              onClose={closeOverlay}
            />
          );
        })()
      )}
    </main>
  )
}