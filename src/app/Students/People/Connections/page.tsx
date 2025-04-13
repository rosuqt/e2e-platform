'use client'
import Sidebar from "../components/sidebar-following";
import TopBar from "../components/topbar";
import Friends from "../components/Friends";
import FriendRequests from "../components/AddFriend";  

  export default function Connections() {
    return (
      <div className="flex">
        <div className="group relative">
          <Sidebar />
        </div>
  
        <div className="flex-1 transition-all duration-300 ml-16">
          <TopBar />
          <div className="p-4">
            <FriendRequests/>
            <Friends/>
          </div>
        </div>
      </div>
    );
  }