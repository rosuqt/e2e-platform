'use client';
import { useState } from "react";
import Link from "next/link";
import {
  AlignJustify,
  Lightbulb,
  UsersRound,
  UserRoundCheck,
  Building2,
} from "lucide-react";

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`fixed top-0 left-0 z-40 h-screen bg-[#1551A9] text-white transition-all duration-300
      ${isHovered ? "w-64" : "w-16"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Profile Section */}
      <div className="flex items-center gap-3 p-4 overflow-hidden">
        <img
          src="https://via.placeholder.com/40"
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
        <div className={`transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0 hidden"}`}>
          <span className="font-semibold block">Kemly Rose</span>
          <span className="text-xs block">BS - Information Technology</span>
          <span className="text-xs bg-green-500 text-white rounded-full px-2 py-0.5 mt-1 inline-block">
            ● Available for Work
          </span>
        </div>
        <button className="ml-auto">
          <AlignJustify className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Menu */}
      <ul className="space-y-2 font-medium mt-4">
        <li>
          <Link
            href="/Students/People/Suggestions"
            className="flex items-center p-2 hover:bg-white hover:text-[#1551A9] rounded-full transition"
          >
            <Lightbulb className="w-5 h-5" />
            <span className={`ml-3 transition-all duration-200 ${!isHovered && "hidden"}`}>
              Suggestions
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/Students/People/Connections"
            className="flex items-center p-2 hover:bg-white hover:text-[#1551A9] rounded-full transition"
          >
            <UsersRound className="w-5 h-5" />
            <span className={`ml-3 transition-all duration-200 ${!isHovered && "hidden"}`}>
              Connections
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/Students/People/Followers"
            className="flex items-center p-2 hover:bg-white hover:text-[#1551A9] rounded-full transition"
          >
            <UserRoundCheck className="w-5 h-5" />
            <span className={`ml-3 transition-all duration-200 ${!isHovered && "hidden"}`}>
              Followers
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/Students/People/Companies"
            className="flex items-center p-2 hover:bg-white hover:text-[#1551A9] rounded-full transition"
          >
            <Building2 className="w-5 h-5" />
            <span className={`ml-3 transition-all duration-200 ${!isHovered && "hidden"}`}>
              Companies
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
