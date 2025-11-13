"use client";
import { useRef, useState } from "react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Facebook, Twitter, Send, Copy, Link as LinkIcon, Mail } from "lucide-react";

type ShareModalProps = {
  open: boolean;
  onClose: () => void;
  shareUrl: string;
};

type Social = {
  name: string;
  icon: React.ReactNode;
  url: (link: string) => string;
  color: string;
  disabled?: boolean;
};

const socials: Social[] = [
  {
    name: "Facebook",
    icon: <Facebook size={24} />,
    url: (link: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
    color: "#1877f2",
  },
  {
    name: "Twitter",
    icon: <Twitter size={24} />,
    url: (link: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}`,
    color: "#1da1f2",
  },
  {
    name: "Gmail",
    icon: <Mail size={24} />,
    url: (link: string) =>
      `https://mail.google.com/mail/?view=cm&fs=1&to=&su=Check%20out%20this%20job%20posting!&body=${encodeURIComponent(link)}`,
    color: "#ea4335",
  },
  {
    name: "WhatsApp",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <g>
          <path fill="#25D366" d="M12 2A10 10 0 0 0 2 12c0 1.77.46 3.43 1.26 4.87L2 22l5.27-1.23A9.96 9.96 0 0 0 12 22a10 10 0 1 0 0-20z"/>
          <path fill="#fff" d="M17.47 14.37c-.25-.13-1.47-.73-1.7-.82-.23-.09-.4-.13-.57.13-.17.25-.65.82-.8.99-.15.17-.3.19-.55.06-.25-.13-1.06-.39-2.02-1.23-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.38.11-.5.12-.12.25-.3.37-.45.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.57-1.37-.78-1.87-.21-.5-.42-.43-.57-.44-.15-.01-.32-.01-.5-.01-.17 0-.45.06-.68.32-.23.25-.9.88-.9 2.13 0 1.25.92 2.46 1.05 2.63.13.17 1.81 2.77 4.4 3.77.62.22 1.1.35 1.48.45.62.16 1.18.14 1.62.09.5-.06 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.29z"/>
        </g>
      </svg>
    ),
    url: (link: string) => `https://wa.me/?text=${encodeURIComponent(link)}`,
    color: "#25d366",
  },
  {
    name: "Telegram",
    icon: <Send size={24} />,
    url: (link: string) => `https://t.me/share/url?url=${encodeURIComponent(link)}`,
    color: "#229ed9",
  },
];

export function ShareModal({ open, onClose, shareUrl }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto"
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <button
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-2">Share Modal</h2>
            <hr className="my-4 border-gray-200" />
            <div className="mb-4">
              <div className="text-gray-700 font-medium mb-3">Share this link via</div>
              <div className="flex gap-4 justify-center">
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.disabled ? undefined : s.url(shareUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`rounded-full border-2 flex items-center justify-center w-12 h-12 transition hover:scale-110`}
                    style={{
                      borderColor: s.color,
                      color: s.color,
                      opacity: s.disabled ? 0.5 : 1,
                      pointerEvents: s.disabled ? "none" : "auto",
                      background: "white",
                    }}
                    aria-label={s.name}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
            <div className="text-gray-700 font-medium mb-2 mt-6">Or copy link</div>
            <div className="flex items-center bg-gray-50 rounded-lg border px-3 py-2">
              <LinkIcon size={18} className="text-gray-400 mr-2" />
              <input
                ref={inputRef}
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-transparent outline-none text-gray-800 text-sm"
                onFocus={e => e.target.select()}
              />
              <button
                onClick={handleCopy}
                className="ml-2 px-4 py-1 rounded-lg bg-[#7c3aed] text-white font-semibold text-sm transition hover:bg-[#5b21b6] focus:outline-none"
                style={{
                  boxShadow: copied ? "0 0 0 2px #a78bfa" : undefined,
                  background: copied ? "#a78bfa" : undefined,
                }}
              >
                {copied ? "Copied!" : (
                  <span className="flex items-center gap-1">
                    <Copy size={16} /> Copy
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
