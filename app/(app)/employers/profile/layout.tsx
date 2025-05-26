"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { TbSettings } from "react-icons/tb";
import { FiCalendar } from "react-icons/fi";
import Sidebar from "../../side-nav/sidebar";
import BaseLayout from "../base-layout";
import { BsBuilding } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { LogOut } from "lucide-react";





export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = useMemo(
    () => [
      { icon: FaUser, text: "My Profile", href: "/employers/profile" },
      { icon: BsBuilding, text: "My Company", href: "/employers/profile/company" },
      { icon: TbSettings, text: "Settings", href: "/employers/settings" },
      { icon: FiCalendar, text: "Calendar", href: "/employers/calendar" },
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
