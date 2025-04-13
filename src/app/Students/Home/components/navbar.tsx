'use client';
import React from "react";
import Link from "next/link";
import { Home, Users, Briefcase, Mail, Bell, UserCircle } from "lucide-react";

export default function TopBar() {
  return (
    <div className="flex items-center justify-center space-x-8 bg-white shadow-md p-4 border-b">
      
      <Link href="/Students/Home">
        <div className="flex flex-col items-center text-sm cursor-pointer text-gray-500 hover:text-gray-700">
          <Home size={20} />
          <span>Home</span>
        </div>
      </Link>

      <Link href="/Students/Following/Connections">
        <div className="flex flex-col items-center text-sm cursor-pointer text-gray-500 hover:text-gray-700">
          <Users size={20} />
          <span>People</span>
        </div>
      </Link>

      <Link href="/Students/Job Listing">
        <div className="flex flex-col items-center text-sm cursor-pointer text-blue-500">
          <Briefcase size={20} />
          <span>Jobs</span>
        </div>
      </Link>

      <Link href="/Students/Messages">
        <div className="flex flex-col items-center text-sm cursor-pointer text-gray-500 hover:text-gray-700">
          <Mail size={20} />
          <span>Messages</span>
        </div>
      </Link>

      <Link href="/Students/Notifications">
        <div className="flex flex-col items-center text-sm cursor-pointer text-gray-500 hover:text-gray-700">
          <Bell size={20} />
          <span>Notifications</span>
        </div>
      </Link>

      <Link href="/Students/Profile">
        <div className="flex flex-col items-center text-sm cursor-pointer text-gray-500 hover:text-gray-700">
          <UserCircle size={20} />
          <span>Me</span>
        </div>
      </Link>
      
    </div>
  );
}
