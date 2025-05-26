"use client";

import Sidebar from "../../side-nav/sidebar";
import BaseLayout from "../../base-layout";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { TbCards,TbUserStar} from "react-icons/tb";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { FiCalendar } from "react-icons/fi";
import { RiAddCircleLine } from "react-icons/ri";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { icon: RiAddCircleLine, text: "Post a Job", href: "/employers/jobs/post-a-job" },
    { icon: TbCards, text: "Job Listings", href: "/employers/jobs/job-listings" },
    { icon: TbUserStar, text: "Candidate Matches", href: "/employers/people/candidate-matches" },
    { icon: HiOutlineClipboardDocumentList, text: "Applications", href: "/employers/jobs/applications" },
    { icon: FiCalendar, text: "Calendar", href: "/employers/calendar" },
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
