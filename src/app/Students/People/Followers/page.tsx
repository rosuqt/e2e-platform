'use client'
import Sidebar from "../components/sidebar-following";
import TopBar from "../components/topbar";
import FavoriteEmployers from "../components/Favorite_Employers";
import All_Followers from "../components/All_Following";
export default function Followers() {
    return (
    <div className="flex group">
        <div className="group relative">
            <Sidebar />
        </div>
        <div className="flex-1 transition-all duration-300 ml-16">
          <TopBar />
            <div className="p-4">
                <FavoriteEmployers/>
                <All_Followers/>
            </div>
        </div>
    </div>
    );
}