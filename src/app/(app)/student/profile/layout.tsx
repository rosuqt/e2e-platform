"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "@/app/(app)/side-nav/sidebar";
import TopNav from "@/app/(app)/top-nav/TopNav";
import { TbSettings, TbBug } from "react-icons/tb";
import { FiCalendar } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { TiCameraOutline } from "react-icons/ti";
import { MdEdit } from "react-icons/md";
import AboutPage from "./components/profile-page";
import SkillsPage from "./components/tabs/skills-tab";
import RatingsPage from "./components/tabs/ratings-tab";
import ActivityLogPage from "./components/tabs/activity-tab";

export default function ProfileLayout() {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("about");

  const menuItems = useMemo(
    () => [
      { icon: FaUser, text: "Me", href: "/student/profile" },
      { icon: FiCalendar, text: "Calendar", href: "student/calendar" },
      { icon: TbBug, text: "Report a bug", href: "/calendar" },
      { icon: TbSettings, text: "Settings", href: "student/settings" },
    ],
    []
  );

  useEffect(() => {
    if (pathname === "/profile") {
      setActiveTab("about");
    } else if (pathname === "/profile/skills") {
      setActiveTab("skills");
    } else if (pathname === "/profile/ratings") {
      setActiveTab("ratings");
    } else if (pathname === "/profile/activity") {
      setActiveTab("activity");
    }
  }, [pathname]);

  useEffect(() => {
    menuItems.forEach((item) => {
      router.prefetch(item.href);
    });
  }, [menuItems, router]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "about":
        return <AboutPage />;
      case "skills":
        return <SkillsPage />;
      case "ratings":
        return <RatingsPage />;
      case "activity":
        return <ActivityLogPage />;
      default:
        return <AboutPage />;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar
        onToggle={(expanded) => setIsSidebarMinimized(!expanded)}
        menuItems={menuItems.map((item) => ({
          ...item,
          isActive: pathname === item.href,
        }))}
      />

      <div
        className={`flex-1 ${
          isSidebarMinimized ? "ml-[80px]" : "ml-[280px]"
        }`}
      >
        {/* Top Navigation */}
        <TopNav
          isSidebarMinimized={isSidebarMinimized}
          topNavStyle={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
          }}
        />

        {/* Main Content */}
        <div className="mt-[64px] min-h-screen bg-gradient-to-br from-blue-50 to-sky-100">
          <div className="container mx-auto px-4 py-8">
            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
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
                  <div className="absolute -top-16 left-6 w-32 h-32 rounded-full border-4 border-white overflow-hidden">
                    <Image
                      src="/images/tempo.png"
                      alt="Profile"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                    <button
                      className="absolute bottom-0 inset-x-0 bg-black/50 hover:bg-black/60 text-white rounded-none h-8 w-full text-sm"
                    >
                      Change
                    </button>
                  </div>

                  <div className="mt-16 md:mt-0 md:ml-36 flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h1 className="text-2xl font-bold">Kemly Rose</h1>
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Available to work</span>
                        </div>
                        <p className="text-gray-600">4th Year | BS- Information Technology</p>
                        <p className="text-gray-500 text-sm">Expected to Graduate YR 2027</p>
                      </div>

                    </div>

                    <div className="mt-2 flex items-center text-gray-500 text-sm">
                      <span>Add a short bio</span>
                      <MdEdit className="h-4 w-4 ml-1 cursor-pointer" />
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex mt-6 border-b overflow-x-auto scrollbar-hide">
                  <button
                    className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === "about"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                    onClick={() => handleTabChange("about")}
                  >
                    About
                  </button>
                  <button
                    className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === "skills"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                    onClick={() => handleTabChange("skills")}
                  >
                    Skills
                  </button>
                  <button
                    className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === "ratings"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                    onClick={() => handleTabChange("ratings")}
                  >
                    My Ratings
                  </button>
                  <button
                    className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === "activity"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                    onClick={() => handleTabChange("activity")}
                  >
                    Activity Log
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="mb-8">{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
