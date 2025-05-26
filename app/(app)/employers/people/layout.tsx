"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import {  TbUserStar } from "react-icons/tb";
import {  HiOutlineUserGroup } from "react-icons/hi2";
import Sidebar from "../../side-nav/sidebar";
import BaseLayout from "../base-layout";
import { RiFolderUserLine } from "react-icons/ri";
import { LiaUsersCogSolid  } from "react-icons/lia";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = useMemo(
    () => [
       { icon: TbUserStar, text: "Candidate Matches", href: "/employers/people/candidate-matches" },
      { icon: RiFolderUserLine , text: "Saved Candidates", href: "/employers/people/saved-candidates" },
      { icon: HiOutlineUserGroup , text: "Followers", href: "/employers/people/followers" },
      { icon: LiaUsersCogSolid  , text: "Colleagues", href: "/employers/people/colleagues" },
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
