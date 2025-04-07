"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function LandingNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center px-6 py-6 bg-customPurple text-white">
      <h1 className="text-xl font-bold">InternConnect</h1>

      {/* Desktop Nav */}
      <div className="hidden lg:flex space-x-8">
        <Link
          href="/landing/people"
          className="transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          People
        </Link>
        <Link
          href="#"
          className="transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Jobs
        </Link>
        <Link
          href="#"
          className="transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Companies
        </Link>
        <Link
          href="#"
          className="transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          STI Hiring
        </Link>
        <Link
          href="/sign-up"
          className="font-bold transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Employer’s Sign-up
        </Link>
        <Link href="/sign-in">
          <button className="bg-white text-[#5D4AB1] px-4 py-2 rounded-md font-semibold hover:bg-button hover:text-white transition-all duration-300 ease-in-out">
            Sign in
          </button>
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#5D4AB1] shadow-lg lg:hidden flex flex-col items-center py-4 space-y-4 z-50">
          <a
            href="#"
            className="transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            People
          </a>
          <a
            href="#"
            className="transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Jobs
          </a>
          <a
            href="#"
            className="transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Companies
          </a>
          <a
            href="#"
            className="transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            STI Hiring
          </a>
          <a
            href="#"
            className="font-bold transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Employer’s Sign-up
          </a>
          <button className="bg-white text-[#5D4AB1] px-4 py-2 rounded-md font-semibold">
            Sign in
          </button>
        </div>
      )}
    </nav>
  );
}
