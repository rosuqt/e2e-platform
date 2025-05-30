"use client";

import Sidebar from "../../side-nav/sidebar";
import BaseLayout from "../../base-layout";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { TbCards, TbFileStar, TbUsers } from "react-icons/tb";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { FiCalendar } from "react-icons/fi";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { icon: TbCards, text: "Interview Practice", href: "/students/interview-practice" },
    { icon: TbFileStar, text: "Job Matches", href: "/students/job-matches" },
    { icon: HiOutlineClipboardDocumentList, text: "Applications", href: "/students/applications" },
    { icon: TbUsers, text: "Connections", href: "/students/connections" },
    { icon: FiCalendar, text: "Calendar", href: "/students/calendar" },
  ];

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
      {children}
    </BaseLayout>
  );
}
