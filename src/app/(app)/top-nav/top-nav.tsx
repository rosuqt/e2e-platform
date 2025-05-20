"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface TopNavProps {
  menuItems: { text: string; href: string; isActive?: boolean }[];
}

export default function TopNav({ menuItems }: TopNavProps) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  return (
    <motion.div
      className="fixed top-0 left-0 w-full z-20 shadow-md bg-white"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
    >
      <div className="flex items-center justify-between px-6 h-16">
        <div className="text-blue-600 font-bold text-lg">Logo</div>
        <ul className="flex space-x-6">
          {menuItems.map((item, index) => (
            <li
              key={index}
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
              className={cn(
                "relative font-medium cursor-pointer rounded-md transition-all",
                "px-3 py-2",
                item.isActive
                  ? "bg-blue-600 text-white"
                  : "text-blue-600 hover:bg-blue-600 hover:text-white",
                hoveredItem === index ? "scale-105" : ""
              )}
            >
              <motion.a
                href={item.href}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                {item.text}
              </motion.a>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
