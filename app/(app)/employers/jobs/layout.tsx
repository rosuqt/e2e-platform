"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { TbCards } from "react-icons/tb";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { FiCalendar } from "react-icons/fi";
import Sidebar from "../../side-nav/sidebar";
import BaseLayout from "../base-layout";
import { MdAddCircleOutline } from "react-icons/md";
import { TbMailStar } from "react-icons/tb";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = useMemo(
    () => [
       { icon: MdAddCircleOutline, text: "Post a Job", href: "/employers/jobs/post-a-job" },
      { icon: TbCards, text: "Job Listings", href: "/employers/jobs/job-listings" },
      { icon: HiOutlineClipboardDocumentList, text: "Applications", href: "/employers/jobs/applications" },
      { icon: TbMailStar, text: "Invited Candidates", href: "/employers/jobs/invited-candidates" },
      { icon: FiCalendar, text: "Calendar", href: "/employers/calendar" },
    ],
    []
  );

  useEffect(() => {
    menuItems.forEach((item) => {
      router.prefetch(item.href);
    });
  }, [menuItems, router]);

  return (
    <BaseLayout
      isSidebarMinimized={isSidebarMinimized}
      sidebar={
        <Sidebar
          onToggle={(expanded) => setIsSidebarMinimized(!expanded)}
          menuItems={menuItems.map((item) => ({
            ...item,
            isActive: pathname === item.href,
          }))}
        />
      }
    >
      <div className="mt-[64px]">{children}</div>
    </BaseLayout>
  );
}
