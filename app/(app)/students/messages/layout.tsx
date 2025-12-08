"use client";


import Sidebar from "../../side-nav/sidebar";
import BaseLayout from "../../base-layout";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { TbCards, TbFileStar, TbUsers } from "react-icons/tb";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { FaEarthAmericas } from "react-icons/fa6";
import { MdAccessTime } from "react-icons/md";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { icon: TbCards, text: "Interview Practice", href: "/students/jobs/interview-practice" },
    { icon: TbFileStar, text: "Job Matches", href: "/students/jobs/job-matches" },
    { icon: HiOutlineClipboardDocumentList, text: "Applications", href: "/students/jobs/applications" },
    { icon: TbUsers, text: "Connections", href: "/students/people/connections" },
    { icon: FaEarthAmericas , text: "Community Jobs", href: "/students/community-page" },
    { icon: MdAccessTime, text: "DTR", href: "/students/jobs/dtr" },
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
    <div className="h-screen overflow-hidden flex flex-col">
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
        <div className="flex-1 flex flex-col min-h-0">{children}</div>
      </BaseLayout>
    </div>
  );
}
