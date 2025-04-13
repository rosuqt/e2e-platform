'use client'
import SidebarJob from "../components/sidebar-job";
import TopBar from "../components/topbar";

export default function Suggestions() {
    return (
        <div className="flex group">
            <div className="group relative">
                <SidebarJob />
            </div>
            <div className="flex-1 transition-all duration-300 ml-16 group-hover:ml-64">
              <TopBar />
                <div className="p-4">
                    <h1>Put Content here for Suggestions</h1>
                </div>
            </div>
        </div>
        );
}