"use client";

import Sidebar from "../../side-nav/sidebar";
import BaseLayout from "../../base-layout";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FiCalendar } from "react-icons/fi";
import { useSession, signOut } from "next-auth/react";
import { LuBadgeCheck } from "react-icons/lu";
import { LogOut } from "lucide-react";
import { FaUser } from "react-icons/fa";
import { TbSettings } from "react-icons/tb";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const verifyStatus = (session?.user as { verifyStatus?: string } | undefined)?.verifyStatus;

  const verificationHref =
    verifyStatus === "full"
      ? "/employers/verification/fully-verified"
      : verifyStatus === "standard"
      ? "/employers/verification/partially-verified"
      : "/employers/verification/unverified";

  const menuItems = [
    { icon: FaUser, text: "Me", href: "/employers/profile" },
    {
      icon: TbSettings,
      text: "My Company",
      href: "/employers/profile/company",
    },
    { icon: TbSettings, text: "Settings", href: "/employers/settings" },
    { icon: FiCalendar, text: "Calendar", href: "/employers/calendar" },
    { icon: LuBadgeCheck, text: "Verification", href: verificationHref },
    { icon: LogOut, text: "Logout", href: "/landing" },
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
            ...(item.text === "Logout"
              ? {
                  onClick: (e: React.MouseEvent) => {
                    e.preventDefault();
                    signOut({ callbackUrl: "/landing" });
                  },
                }
              : {}),
          }))}
        />
      }
      isSidebarMinimized={isSidebarMinimized}
    >
      {children}
    </BaseLayout>
  );
}