"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react"; 

export default function LandingNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-[#5D4AB1] text-white">
      <h1 className="text-xl font-bold">InternConnect</h1>

      {/* Desktop Nav */}
      <div className="hidden lg:flex space-x-8">
        <a href="#" className="hover:underline">People</a>
        <a href="#" className="hover:underline">Jobs</a>
        <a href="#" className="hover:underline">Companies</a>
        <a href="#" className="hover:underline">STI Hiring</a>
        <a href="#" className="font-bold hover:underline">Employer’s Sign-up</a>
        <button className="bg-white text-[#5D4AB1] px-4 py-2 rounded-md font-semibold">Sign in</button>
      </div>

      {/* Mobile Menu Button */}
      <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#5D4AB1] shadow-lg lg:hidden flex flex-col items-center py-4 space-y-4 z-50">
          <a href="#" className="hover:underline">People</a>
          <a href="#" className="hover:underline">Jobs</a>
          <a href="#" className="hover:underline">Companies</a>
          <a href="#" className="hover:underline">STI Hiring</a>
          <a href="#" className="font-bold hover:underline">Employer’s Sign-up</a>
          <button className="bg-white text-[#5D4AB1] px-4 py-2 rounded-md font-semibold">Sign in</button>
        </div>
      )}
    </nav>
  );
}
