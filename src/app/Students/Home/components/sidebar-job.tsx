'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlignJustify,
  ClipboardList,
  Mail,
  Bookmark,
  Calendar,
} from 'lucide-react';

const SidebarJob = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-0 left-0 z-40 h-screen bg-[#1551A9] text-white transition-all duration-300 
        ${isHovered ? 'w-64' : 'w-16'} overflow-hidden`}
    >
      {/* Profile Section */}
      <div className="flex items-center gap-3 p-4">
        <img
          src="https://via.placeholder.com/40"
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
        <div className={`${isHovered ? 'block' : 'hidden'} transition-all`}>
          <p className="font-semibold">Kemly Rose</p>
          <p className="text-xs">BS - Information Technology</p>
          <span className="text-xs bg-green-500 px-2 py-0.5 mt-1 rounded-full inline-block">
            ● Available for Work
          </span>
        </div>
        <button className="ml-auto">
          <AlignJustify className="w-5 h-5" />
        </button>
      </div>

      {/* Interview Practice Button */}
      <div className={`px-4 ${isHovered ? 'block' : 'hidden'}`}>
        <button className="bg-[#21A1FF] w-full text-white py-2 rounded-full font-semibold">
          Interview practice
        </button>
      </div>

      {/* Menu */}
      <ul className="mt-4 space-y-2 font-medium">
        <li>
          <Link
            href="#"
            className="flex items-center p-2 rounded-l-full bg-white text-[#1551A9] transition"
          >
            <ClipboardList className="w-5 h-5" />
            <span className={`ml-3 ${!isHovered && 'hidden'}`}>Job listings</span>
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="flex items-center p-2 hover:bg-white hover:text-[#1551A9] rounded-full transition"
          >
            <Mail className="w-5 h-5" />
            <span className={`ml-3 ${!isHovered && 'hidden'}`}>My applications</span>
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="flex items-center p-2 hover:bg-white hover:text-[#1551A9] rounded-full transition"
          >
            <Bookmark className="w-5 h-5" />
            <span className={`ml-3 ${!isHovered && 'hidden'}`}>Saved Jobs</span>
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="flex items-center p-2 hover:bg-white hover:text-[#1551A9] rounded-full transition"
          >
            <Calendar className="w-5 h-5" />
            <span className={`ml-3 ${!isHovered && 'hidden'}`}>Calendar</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SidebarJob;
