import React from "react";
import Link from "next/link";

const SingleLineFooter = () => (
  <footer className="w-full bg-transparent text-gray-600 text-sm py-2 fixed bottom-0">
    <div className="max-w-screen-xl mx-auto px-6 flex justify-between items-center">
      <div className="flex space-x-28">
        <span className="font-semibold">© 2025 InternConnect</span>
        <Link href="/about" className="hover:no-underline">
          About Us
        </Link>
        <Link href="/privacy-policy" className="hover:no-underline">
          Privacy Policy
        </Link>
        <Link href="/terms-of-service" className="hover:no-underline">
          Terms of Service
        </Link>
        <Link href="/contact" className="hover:no-underline">
          Contact Us
        </Link>
        <Link href="/community-guidelines" className="hover:no-underline">
          Community Guidelines
        </Link>
      </div>
    </div>
  </footer>
);

export default SingleLineFooter;
