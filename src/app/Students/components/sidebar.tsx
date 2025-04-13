import {AlignJustify, Lightbulb, UsersRound, UserRoundCheck, Building2 } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto bg-[#1551A9]">
    <div className="flex items-center justify-between">
      <h5 className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">MENU PLACEHOLDER</h5>
      <button className="text-gray-400 hover:bg-white p-1.5 rounded-lg dark:hover:bg-gray-600">
        <AlignJustify className="w-5 h-5" />
      </button>
    </div>
    <ul className="space-y-2 font-medium mt-4">
    <li>
          <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-white hover:text-[#1551A9] ">
            <Lightbulb className="w-5 h-5 hover:text-[#1551A9]" />
            <span className="ml-3">Suggestions</span>
          </a>
        </li>
        <li>
          <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-white hover:text-[#1551A9] ">
            <UsersRound className="w-5 h-5 hover:text-[#1551A9]" />
            <span className="ml-3">Connections</span>
          </a>
        </li>
        <li>
          <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-white hover:text-[#1551A9] ">
            <UserRoundCheck className="w-5 h-5 hover:text-[#1551A9]" />
            <span className="ml-3">Following</span>
          </a>
        </li>
        <li>
          <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-white hover:text-[#1551A9]">
            <Building2 className="w-5 h-5 hover:text-[#1551A9]" />
            <span className="ml-3">Companies</span>
          </a>
        </li>       
    </ul>
  </div>
  );
};

export default Sidebar;
