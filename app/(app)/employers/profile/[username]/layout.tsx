"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { TbSettings } from "react-icons/tb";
import Sidebar from "../../../side-nav/sidebar";
import BaseLayout from "../../base-layout";
import { BsBuilding } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { LuBadgeCheck } from "react-icons/lu";
import { useSession } from "next-auth/react";
import supabase from "@/lib/supabase";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const verifyStatus = (session?.user as { verifyStatus?: string } | undefined)?.verifyStatus;

  const [username, setUsername] = useState<string | null>(null);

  const verificationHref =
    verifyStatus === "full"
      ? "/employers/verification/fully-verified"
      : verifyStatus === "partially_verified"
      ? "/employers/verification/partially-verified"
      : "/employers/verification/unverified";

  const menuItems = useMemo(
    () => [
      { icon: FaUser, text: "My Profile", href: username ? `/employers/profile/${username}` : "/employers/profile" },
      { icon: BsBuilding, text: "My Company", href: "/employers/profile/company" },
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

  useEffect(() => {
    const fetchUsername = async () => {
      if (!session?.user?.email) return;
  
      const { data, error } = await supabase
        .from("employer_profile")
        .select("username")
        .eq("email", session.user.email)
        .single();
  
      if (!error && data) setUsername(data.username);
    };
  
    fetchUsername();
  }, [session]);

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
