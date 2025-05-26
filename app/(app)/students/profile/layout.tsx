"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "../../side-nav/sidebar";
import BaseLayout from "../../base-layout";
import { TbSettings, TbBug } from "react-icons/tb";
import { FiCalendar } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { TiCameraOutline } from "react-icons/ti";
import { MdEdit } from "react-icons/md";
import { Camera, LogOut } from "lucide-react";
import AboutPage from "./components/profile-page";
import SkillsPage from "./components/tabs/skills-tab";
import RatingsPage from "./components/tabs/ratings-tab";
import ActivityLogPage from "./components/tabs/activity-tab";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";


export default function ProfileLayout() {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  const menuItems = useMemo(
    () => [
      { icon: FaUser, text: "Me", href: "/student/profile" },
      { icon: FiCalendar, text: "Calendar", href: "student/calendar" },
      { icon: TbBug, text: "Report a bug", href: "/calendar" },
      { icon: TbSettings, text: "Settings", href: "student/settings" },
      { icon: LogOut, text: "Logout", href: "/landing" },
    ],
    []
  );

  useEffect(() => {
    if (pathname === "/profile") {
      setActiveTab(0);
    } else if (pathname === "/profile/skills") {
      setActiveTab(1);
    } else if (pathname === "/profile/ratings") {
      setActiveTab(2);
    } else if (pathname === "/profile/activity") {
      setActiveTab(3);
    }
  }, [pathname]);

  useEffect(() => {
    menuItems.forEach((item) => {
      router.prefetch(item.href);
    });
  }, [menuItems, router]);

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return <AboutPage />;
      case 1:
        return <SkillsPage />;
      case 2:
        return <RatingsPage />;
      case 3:
        return <ActivityLogPage />;
      default:
        return <AboutPage />;
    }
  };

  return (
    <BaseLayout
      sidebar={
        <Sidebar
          onToggle={(expanded: boolean) => setIsSidebarMinimized(!expanded)}
          menuItems={menuItems.map((item) => ({
            ...item,
            isActive: pathname === item.href,
          }))}
        />
      }
      isSidebarMinimized={isSidebarMinimized}
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
        <div className="container mx-auto px-4 py-8">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-md border border-blue-200 overflow-hidden mb-6">
            {/* Cover Image */}
            <div className="h-40 bg-gradient-to-r from-blue-600 to-blue-400 relative">
              <button
                className="absolute top-4 right-4 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full p-2"
              >
                <TiCameraOutline className="h-5 w-5" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="relative px-6 pb-6 pt-4">
              <div className="flex flex-col md:flex-row md:items-end">
                <div className="absolute -top-16 left-6 w-32 h-32">
                  <div className="relative w-full h-full">
                    {/* Profile initials in colored circle with white border */}
                    <div className="w-full h-full rounded-full bg-white border-4 border-white flex items-center justify-center">
                      <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl select-none">
                        KR
                      </div>
                    </div>
                    {/* Floating camera button */}
                    <button
                      className="absolute -top-2 -right-2 bg-white border border-blue-300 text-blue-600 hover:bg-blue-50 rounded-full p-2 shadow"
                      title="Change profile picture"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-16 md:mt-0 md:ml-36 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold">Kemly Rose</h1>
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Available to work</span>
                      </div>
                      <p className="text-gray-600">4th Year | BS- Information Technology</p>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center text-gray-500 text-sm">
                    <span>Add a short bio</span>
                    <MdEdit className="h-4 w-4 ml-1 cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* MUI Tabs */}
              <div className="flex mt-6">
                <Box sx={{ borderBottom: 1, borderColor: "divider", width: "fit-content", minWidth: 0 }}>
                  <Tabs
                    value={activeTab}
                    onChange={(_, v) => setActiveTab(v)}
                    textColor="primary"
                    indicatorColor="primary"
                    aria-label="student profile tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    <Tab
                      label="About"
                      sx={{
                        textTransform: "capitalize",
                        fontWeight: 500,
                        fontSize: 14,
                        "&:hover": { color: "#2563eb" },
                      }}
                    />
                    <Tab
                      label="Skills"
                      sx={{
                        textTransform: "capitalize",
                        fontWeight: 500,
                        fontSize: 14,
                        "&:hover": { color: "#2563eb" },
                      }}
                    />
                    <Tab
                      label="My Ratings"
                      sx={{
                        textTransform: "capitalize",
                        fontWeight: 500,
                        fontSize: 14,
                        "&:hover": { color: "#2563eb" },
                      }}
                    />
                    <Tab
                      label="Activity Log"
                      sx={{
                        textTransform: "capitalize",
                        fontWeight: 500,
                        fontSize: 14,
                        "&:hover": { color: "#2563eb" },
                      }}
                    />
                  </Tabs>
                </Box>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mb-8">{renderContent()}</div>
        </div>
      </div>
    </BaseLayout>
  );
}
