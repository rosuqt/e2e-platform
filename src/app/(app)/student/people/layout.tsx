"use client";

import Sidebar from "@/app/(app)/side-nav/sidebar";
import TopNav from "@/app/(app)/top-nav/TopNav";
import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { TbUserStar, TbUserCheck, TbUserHeart } from "react-icons/tb";
import { BsBuildingCheck } from "react-icons/bs";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = useMemo(
    () => [
      { icon: TbUserStar, text: "Suggestions", href: "/student/people/suggestions" },
      { icon: TbUserHeart, text: "Connections", href: "/student/people/connections" },
      { icon: TbUserCheck, text: "Following", href: "/student/people/following" },
      { icon: BsBuildingCheck, text: "Companies", href: "/student/people/companies" },
    ],
    []
  );

  useEffect(() => {
    if (isSidebarMinimized) {
      document.body.classList.add("sidebar-minimized");
    } else {
      document.body.classList.remove("sidebar-minimized");
    }

    const event = new CustomEvent("sidebarToggle", { detail: { isSidebarMinimized } });
    window.dispatchEvent(event);

    setTimeout(() => {
      const recalcEvent = new CustomEvent("forceRecalc");
      window.dispatchEvent(recalcEvent);
    }, 300);
  }, [isSidebarMinimized]);

  useEffect(() => {
    menuItems.forEach((item) => {
      router.prefetch(item.href);
    });
  }, [menuItems, router]);

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
        <div className="mt-[64px]">{children}</div>
      </div>
    </div>
  );
}
