'use client'
import Sidebar from "../components/sidebar";
import TopBar from "../components/topbar";
import FriendRequests from "../components/AddFriend";
import Friends from "../components/Friends"
export default function Connections() {
  return (
  <div>
    <TopBar/>
    <Sidebar/>
    <FriendRequests/>    
    <Friends/>
  </div>
  );
}


