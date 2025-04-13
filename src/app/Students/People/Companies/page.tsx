'use client'
import Sidebar from "../components/sidebar-following";
import TopBar from "../components/topbar";
import CompaniesGrid from "../components/CompaniesGrid";

export default function Companies() {
    return (
        <div className="flex group">
            <div className="group relative">
                <Sidebar />
            </div>
            <div className="flex-1 transition-all duration-300 ml-16 group-hover:ml-64">
              <TopBar />
                <div className="p-4">
                    
                    <CompaniesGrid/>

                </div>
            </div>
        </div>
        );
}