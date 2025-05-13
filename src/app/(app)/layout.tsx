"use client";

import TopNav from "@/app/(app)/top-nav/TopNav";
import { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarMinimized] = useState(false);

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
    <div className="flex">
      {/* Main Content */}
      <div className="flex-1 transition-all duration-300">
        {/* Top Navigation */}
        <TopNav
          isSidebarMinimized={isSidebarMinimized}
          topNavStyle={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
          }}
        />
        <div>{children}</div>
      </div>
    </div>
  );
}
