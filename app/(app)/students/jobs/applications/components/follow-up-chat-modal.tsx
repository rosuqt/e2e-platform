"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, TextareaAutosize } from "@mui/material";
import { Send } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Message = {
  sender: string;
  content: string;
  time: string;
};

export function FollowUpChatModal({
  isOpen,
  onClose,
  employerName,
  jobTitle,
  company,
}: {
  isOpen: boolean;
  onClose: () => void;
  employerName: string;
  jobTitle: string;
  company: string;
}) {
  const [messageInput, setMessageInput] = useState(
    `Hi ${employerName}, I hope you're doing well! I just wanted to follow up on my application for the ${jobTitle} position. If there are any updates or next steps, I’d love to hear from you. Thanks so much for your time!`
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setMessageInput(
      `Hi ${employerName}, I hope you're doing well! I just wanted to follow up on my application for the ${jobTitle} position. If there are any updates or next steps, I’d love to hear from you. Thanks so much for your time!`
    );
  }, [employerName, jobTitle]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessages((prev) => [
        ...prev,
        { sender: "me", content: messageInput, time: "Just now" },
      ]);
      toast.success("Message sent! Visit the Messages page to continue the conversation.", {
        position: "top-center",
        autoClose: 5000,
      });
      setMessageInput("");
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (messageInput.trim()) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [messageInput]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogHeader className="bg-blue-600 text-white p-4 flex flex-row items-center gap-3">
          <Avatar src="/placeholder.svg" alt={employerName} className="w-12 h-12" />
          <div className="flex flex-col">
            <DialogTitle className="text-lg font-semibold">{employerName}</DialogTitle>
            <p className="text-sm">
              {jobTitle} at {company}
            </p>
          </div>
        </DialogHeader>
        <div className="flex flex-col h-96 bg-gray-50">
          {/* Description Text */}
          <p className="text-center text-gray-400 text-sm p-2">
            Send a follow-up to the employer to encourage them to check your application.
          </p>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg text-sm whitespace-pre-wrap ${
                    message.sender === "me"
                      ? "bg-blue-500 text-white"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-end">
                <div className="max-w-xs p-3 rounded-lg text-sm bg-blue-500 text-white">
                  Typing...
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t bg-white flex items-center gap-2">
            <TextareaAutosize
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
              minRows={1}
              maxRows={5}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              size="icon"
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleSendMessage}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
