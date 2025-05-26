"use client";

import TopNav from "./top-nav/TopNav";

export default function BaseLayout({
  sidebar,
  children,
  isSidebarMinimized,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  isSidebarMinimized: boolean;
}) {
  return (
    <div className="flex">
      {/* Sidebar */}
      {sidebar}
      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarMinimized ? "ml-[80px]" : "ml-[280px]"
        }`}
      >
        {/* Top Navigation */}
        <TopNav
          isSidebarMinimized={isSidebarMinimized}
          topNavStyle={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 20,
          }}
        />
        <div className="mt-16">{children}</div>
      </div>
    </div>
  );
}
