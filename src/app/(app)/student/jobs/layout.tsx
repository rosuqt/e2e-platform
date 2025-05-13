"use client";

import Sidebar from "@/app/(app)/side-nav/sidebar";
import TopNav from "@/app/(app)/top-nav/TopNav";
import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { TbCards, TbFileStar, TbUsers, TbSettings } from "react-icons/tb";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { FiCalendar } from "react-icons/fi";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = useMemo(() => [
    { icon: TbCards, text: "Job Listings", href: "/student/jobs/job-listings" },
    { icon: TbFileStar, text: "My Applications", href: "/student/jobs/applications" },
    { icon: HiOutlineClipboardDocumentList, text: "Job Matches", href: "/student/jobs/job-matches" },
    { icon: TbUsers, text: "Interview Practice", href: "/student/jobs/interview-practice" },
    { icon: FiCalendar, text: "Calendar", href: "/calendar" },
    { icon: TbSettings, text: "Settings", href: "/settings" },
  ], []);

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
