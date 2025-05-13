"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Avatar } from "@mui/material";
import { RiMessage3Line } from "react-icons/ri";

interface MessagesModalProps {
  messages: { id: string; sender: string; content: string; timestamp: string; avatarUrl?: string; isUnread?: boolean }[];
  onClose: () => void;
  positionRef: React.RefObject<HTMLAnchorElement | null>;
}

export function MessagesModal({ messages, onClose, positionRef }: MessagesModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setTimeout(onClose, 200);
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [handleClose]);

  useEffect(() => {
    if (positionRef.current) {
      const rect = positionRef.current.getBoundingClientRect();
      setPosition({ 
        top: rect.bottom + window.scrollY, 
        left: rect.left + window.scrollX - 70 
      });
    }
  }, [positionRef]);

  const handleViewAllClick = () => {
    router.push("/student/messages");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute z-50"
          style={{ top: position.top, left: position.left }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg overflow-hidden w-80"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="p-4 border-b border-gray-100 flex items-center gap-2 mt-3">
            <RiMessage3Line className="text-blue-500" />
            <h3 className="text-lg font-medium text-blue-800">Messages</h3>
            </div>

            <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
              {messages.map((message) => (
                <div key={message.id} className="flex items-center space-x-4">
                  <Avatar
                    src={message.avatarUrl || "/placeholder.svg"}
                    alt={message.sender}
                    sx={{ width: 40, height: 40 }}
                  >
                    {!message.avatarUrl &&
                      message.sender
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                  </Avatar>
                  <div className="flex flex-col flex-grow">
                    <span className="font-medium text-gray-800">{message.sender}</span>
                    <span className="text-sm text-gray-500">{message.content}</span>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {message.isUnread && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                    <span className="text-xs text-gray-400">{message.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100">
              <button
                className="w-full text-center text-blue-600 hover:underline"
                onClick={handleViewAllClick}
              >
                View All
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
