import { Home, Users, Briefcase, Mail, Bell, UserCircle } from "lucide-react";

export default function TopBar() {
  return (
    <div className="flex items-center justify-center space-x-8 bg-white shadow-md p-4 border-b">
      <div className="flex flex-col items-center text-sm cursor-pointer text-gray-500 hover:text-gray-700">
        <Home size={20} />
        <span>Home</span>
      </div>
      <div className="flex flex-col items-center text-sm cursor-pointer text-blue-500">
        <Users size={20} />
        <span>People</span>
      </div>
      <div className="flex flex-col items-center text-sm cursor-pointer text-gray-500 hover:text-gray-700">
        <Briefcase size={20} />
        <span>Jobs</span>
      </div>
      <div className="flex flex-col items-center text-sm cursor-pointer text-gray-500 hover:text-gray-700">
        <Mail size={20} />
        <span>Messages</span>
      </div>
      <div className="flex flex-col items-center text-sm cursor-pointer text-gray-500 hover:text-gray-700">
        <Bell size={20} />
        <span>Notifications</span>
      </div>
      <div className="flex flex-col items-center text-sm cursor-pointer text-gray-500 hover:text-gray-700">
        <UserCircle size={20} />
        <span>Me</span>
      </div>
    </div>
  );
}