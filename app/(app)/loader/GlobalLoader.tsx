"use client";

import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import animation1 from './animations/animation1.json';
import animation2 from './animations/animation2.json';
import animation3 from './animations/animation3.json';

const animations = [animation1, animation2, animation3];

const helperTexts = [
  "Connecting you to the best deals!",
  "Find the perfect match for you!",
  "Search various categories and items.",
];

const GlobalLoader = () => {
  const [currentAnimation, setCurrentAnimation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimation((prev) => (prev + 1) % animations.length);
    }, 10000); // Change animation every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-sky-100">
      <div className="relative text-center">
        {/* Background shape */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-80 h-80 bg-blue-200 rounded-full blur-xl opacity-50"></div>
        </div>
        {/* Lottie animation */}
        <Lottie animationData={animations[currentAnimation]} loop={true} className="relative w-96 h-96 mx-auto" />
        {/* Helper text */}
        <p className="relative mt-2 text-gray-700">{helperTexts[currentAnimation]}</p>
      </div>
    </div>
  );
};

export default GlobalLoader;
