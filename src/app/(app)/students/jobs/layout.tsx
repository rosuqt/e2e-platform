"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { TbCards, TbFileStar, TbUsers } from "react-icons/tb";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { FiCalendar } from "react-icons/fi";
import Sidebar from "@/app/(app)/side-nav/sidebar";
import BaseLayout from "@/app/(app)/base-layout";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = useMemo(
    () => [
      { icon: TbCards, text: "Job Listings", href: "/student/jobs/job-listings" },
      { icon: HiOutlineClipboardDocumentList, text: "My Applications", href: "/student/jobs/applications" },
      { icon: TbFileStar, text: "Job Matches", href: "/student/jobs/job-matches" },
      { icon: TbUsers, text: "Interview Practice", href: "/student/jobs/interview-practice" },
      { icon: FiCalendar, text: "Calendar", href: "/calendar" },
    ],
    []
  );HiOutlineClipboardDocumentList

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
