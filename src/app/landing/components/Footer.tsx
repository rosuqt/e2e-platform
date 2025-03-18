import React from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <>
      {/* Footer */}
      <footer className="bg-white border-t-2 border-gray-300 mb-14 leading-loose">
        <div className="container mx-auto px-6 py-10 flex justify-between items-center">
          <div className="flex flex-col">
            <div className="flex items-center mb-4">
              <img src="/path/to/logo.png" alt="App Logo" className="w-8 h-8 mr-3" />
              <span className="font-bold text-xl">AppName</span>
            </div>
            <div className="flex items-center mb-2 text-gray-700">
              <MapPin className="w-5 h-5 mr-2" />
              <span>Location</span>
            </div>
            <div className="flex items-center mb-2 text-gray-700">
              <Mail className="w-5 h-5 mr-2" />
              <span>admin@appname.com</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Phone className="w-5 h-5 mr-2" />
              <span>+123 456 7890</span>
            </div>
          </div>

          <div className="flex flex-col items-left leading-loose">
            <h2 className="font-bold text-lg mb-4">Legal</h2>
            <ul className="space-y-2">
              <li><a href="/privacy-policy" className="text-gray-700 hover:text-gray-900">Privacy Policy</a></li>
              <li><a href="/terms-conditions" className="text-gray-700 hover:text-gray-900">Terms and Conditions</a></li>
              <li><a href="/user-agreement" className="text-gray-700 hover:text-gray-900">User Agreement</a></li>
            </ul>
          </div>

          <div className="flex flex-col items-center leading-loose">
            <h2 className="font-bold text-lg mb-4">About AppName</h2>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-700 hover:text-gray-900">About Us</a></li>
              <li><a href="/how-it-works" className="text-gray-700 hover:text-gray-900">How it Works</a></li>
              <li><a href="/faq" className="text-gray-700 hover:text-gray-900">FAQ&apos;s</a></li>
            </ul>
          </div>
        </div>
      </footer>

      <div className="bg-darkBlue text-sm text-white/80 text-left py-10 w-full mt-auto">
        <p className="ml-10">© 2025 STI College Alabang Job Finder. All rights reserved.</p>
        <p className="ml-10">Connecting Students to Opportunities</p>
      </div>
    </>
  );
};

export default Footer;
