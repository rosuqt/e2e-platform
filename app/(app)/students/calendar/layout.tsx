"use client";

import { useState,  useMemo, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "../../side-nav/sidebar";
import BaseLayout from "../../base-layout";
import { TbSettings } from "react-icons/tb";
import { FiCalendar } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import {  LogOut } from "lucide-react";

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const pathname = usePathname();
  const router = useRouter();


  const menuItems = useMemo(
    () => [
      { icon: FaUser, text: "Me", href: "/students/profile" },
      { icon: FiCalendar, text: "Calendar", href: "/students/calendar" },
     // { icon: TbBug, text: "Report a bug", href: "#" }, 
      { icon: TbSettings, text: "Settings", href: "/students/settings" },
      { icon: LogOut, text: "Logout", href: "/landing" },
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