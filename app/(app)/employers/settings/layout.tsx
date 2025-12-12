"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { TbSettings } from "react-icons/tb";
import Sidebar from "../../side-nav/sidebar";
import BaseLayout from "../base-layout";
import { LuBadgeCheck } from "react-icons/lu";
import { useSession, signOut } from "next-auth/react";
import { FaUser } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import { LogOut } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const verifyStatus = (session?.user as { verifyStatus?: string } | undefined)?.verifyStatus;

  const verificationHref =
    verifyStatus === "full"
      ? "/employers/verification/fully-verified"
      : verifyStatus === "standard"
      ? "/employers/verification/partially-verified"
      : "/employers/verification/unverified";

  const menuItems = useMemo(
    () => [
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
    ],
    [verificationHref]
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
    >
      <div className="mt-[64px]">{children}</div>
    </BaseLayout>
  );
}
