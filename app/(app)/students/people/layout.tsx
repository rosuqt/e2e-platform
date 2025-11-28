"use client";

import Sidebar from "../../side-nav/sidebar";
import BaseLayout from "../../base-layout";
import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { TbUserStar, TbUserCheck, TbUserHeart } from "react-icons/tb";
import { BsBuildingCheck } from "react-icons/bs";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [friendRequestCount, setFriendRequestCount] = useState<number>(0);

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch("/api/students/people/fetchRequest");
        if (res.ok) {
          const data = await res.json();
          setFriendRequestCount(Array.isArray(data) ? data.length : data.length ?? 0);
        }
      } catch {}
    }
    fetchCount();
  }, []);

  const menuItems = useMemo(
    () => [
      { icon: TbUserStar, text: "Suggestions", href: "/students/people/suggestions" },
      {
        icon: TbUserHeart,
        text: "Connections",
        href: "/students/people/connections",
      },
      { icon: TbUserCheck, text: "Following", href: "/students/people/following" },
      { icon: BsBuildingCheck, text: "Companies", href: "/students/people/companies" },
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
          onToggle={(expanded: boolean) => setIsSidebarMinimized(!expanded)}
          menuItems={menuItems.map((item) => ({
            ...item,
            isActive: pathname === item.href,
          }))}
          friendRequestCount={friendRequestCount}
        />
      }
      isSidebarMinimized={isSidebarMinimized}
    >
      {children}
    </BaseLayout>
  );
}
