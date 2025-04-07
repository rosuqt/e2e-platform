import React from "react";

const SingleLineFooter = () => (
  <footer className="w-full bg-transparent text-gray-600 text-sm py-2 fixed bottom-0">
    <div className="max-w-screen-xl mx-auto px-6 flex justify-between items-center">
      <div className="flex space-x-28">
        <span className="font-semibold">© 2025 InternConnect</span>
        <a href="/about" className="hover:no-underline">
          About Us
        </a>
        <a href="/privacy-policy" className="hover:no-underline">
          Privacy Policy
        </a>
        <a href="/terms-of-service" className="hover:no-underline">
          Terms of Service
        </a>
        <a href="/contact" className="hover:no-underline">
          Contact Us
        </a>
        <a href="/community-guidelines" className="hover:no-underline">
          Community Guidelines
        </a>
      </div>
    </div>
  </footer>
);

export default SingleLineFooter;
