"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { TbCards, TbFileStar, TbUsers } from "react-icons/tb";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import Sidebar from "../../side-nav/sidebar";
import BaseLayout from "../../base-layout";
import { FaEarthAmericas } from "react-icons/fa6";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = useMemo(
    () => [
      { icon: TbCards, text: "Job Listings", href: "/students/jobs/job-listings" },
      { icon: HiOutlineClipboardDocumentList, text: "My Applications", href: "/students/jobs/applications" },
      { icon: TbFileStar, text: "Job Matches", href: "/students/jobs/job-matches" },
      { icon: TbUsers, text: "Interview Practice", href: "/students/jobs/interview-practice" },
      { icon: FaEarthAmericas , text: "Community Jobs", href: "/students/community-page" },
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
          onToggle={(expanded: boolean) => setIsSidebarMinimized(!expanded)}
          menuItems={menuItems.map((item) => ({
            ...item,
            isActive: pathname === item.href,
          }))}
        />
      }
    >
      {children}
    </BaseLayout>
  );
}
