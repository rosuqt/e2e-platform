"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { TbSettings } from "react-icons/tb";
import Sidebar from "../../side-nav/sidebar";
import BaseLayout from "../base-layout";
import { LuBadgeCheck } from "react-icons/lu";
import { useSession } from "next-auth/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const verifyStatus = (session?.user as { verifyStatus?: string } | undefined)?.verifyStatus;

  const verificationHref =
    verifyStatus === "full"
      ? "/employers/verification/fully-verified"
      : verifyStatus === "partially_verified"
      ? "/employers/verification/partially-verified"
      : "/employers/verification/unverified";

  const menuItems = useMemo(
    () => [
      { icon: TbSettings, text: "Settings", href: "/employers/settings" },
      { icon: LuBadgeCheck, text: "Verification", href: verificationHref },
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
          }))}
        />
      }
    >
      <div className="mt-[64px]">{children}</div>
    </BaseLayout>
  );
}
