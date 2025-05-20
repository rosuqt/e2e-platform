"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { TbCards } from "react-icons/tb";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { FiCalendar } from "react-icons/fi";
import Sidebar from "@/app/(app)/side-nav/sidebar";
import BaseLayout from "@/app/(app)/base-layout";
import { MdAddCircleOutline } from "react-icons/md";
import { TbUserCheck } from "react-icons/tb";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = useMemo(
    () => [
      { icon: MdAddCircleOutline, text: "Post a Job", href: "/employer/jobs/post-a-job" },
      { icon: TbCards, text: "Job Postings", href: "/employers/jobs/job-listings" },
      { icon: HiOutlineClipboardDocumentList, text: "Applications", href: "/employers/jobs/applications" },
      { icon: TbUserCheck, text: "Candidate Matches", href: "/employers/jobs/candidate-matches" },
      { icon: FiCalendar, text: "Calendar", href: "/calendar" },
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
