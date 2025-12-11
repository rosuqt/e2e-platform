"use client";

import Sidebar from "../../side-nav/sidebar";
import BaseLayout from "../../base-layout";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { TbCards,TbUserStar} from "react-icons/tb";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { FiCalendar } from "react-icons/fi";
import { RiAddCircleLine } from "react-icons/ri";
import { useSession } from "next-auth/react";
import { Lock } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const verifyStatus = session?.user?.verifyStatus;

  const menuItems = [
    { icon: RiAddCircleLine, text: "Post a Job", href: "/employers/jobs/post-a-job" },
    { icon: TbCards, text: "Job Listings", href: "/employers/jobs/job-listings" },
    {
      icon: TbUserStar,
      text: "Candidate Matches",
      href: verifyStatus !== "full" ? "#" : "/employers/jobs/candidate-matches",
      render: verifyStatus !== "full"
        ? () => (
            <Tooltip title="Verify to access Candidate Matches" arrow>
              <span style={{ display: "flex", alignItems: "center", cursor: "not-allowed", opacity: 0.7 }}>
                <TbUserStar style={{ marginRight: 4 }} />
                <span style={{ flex: 1 }} />
                <Lock fontSize="small" style={{ marginLeft: "auto" }} />
              </span>
            </Tooltip>
          )
        : undefined,
      disabled: verifyStatus !== "full",
      style: verifyStatus !== "full" ? { cursor: "not-allowed", opacity: 0.7 } : {},
    },
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