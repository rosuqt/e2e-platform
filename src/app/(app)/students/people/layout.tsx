"use client";

import Sidebar from "@/app/(app)/side-nav/sidebar";
import BaseLayout from "@/app/(app)/base-layout";
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
    <BaseLayout
      sidebar={
        <Sidebar
          onToggle={(expanded) => setIsSidebarMinimized(!expanded)}
          menuItems={menuItems.map((item) => ({
            ...item,
            isActive: pathname === item.href,
          }))}
        />
      }
      isSidebarMinimized={isSidebarMinimized}
    >
      <div className="mt-[64px]">{children}</div>
    </BaseLayout>
  );
}
