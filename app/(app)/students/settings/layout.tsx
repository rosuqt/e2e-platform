"use client";

import Sidebar from "../../side-nav/sidebar";
import BaseLayout from "../../base-layout";
import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { TbSettings } from "react-icons/tb";
import { FaUser } from "react-icons/fa6";
import { FiCalendar } from "react-icons/fi";
import { LogOut } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = useMemo(
    () => [
      { icon: FaUser, text: "Me", href: "/students/profile" },
      { icon: FiCalendar, text: "Calendar", href: "/students/calendar" },
      { icon: TbSettings, text: "Settings", href: "/students/settings" },
      { icon: LogOut, text: "Logout", href: "/landing", onClick: () => handleLogout() },
    ],
    []
  );

  function handleLogout() {
    localStorage.clear();
    sessionStorage.clear();
    router.push("/landing");
  }

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
      if (item.href !== "/landing") {
        router.prefetch(item.href);
      }
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
        />
      }
      isSidebarMinimized={isSidebarMinimized}
    >
      {children}
    </BaseLayout>
  );
}
