"use client"

import { useState } from "react"
import {
  Search,
  Plus,
  ImageIcon,
  Paperclip,
  Send,
  MoreVertical,
  Bell,
  UserCog,
  Shield,
  Trash2,
  Archive,
  Moon,
  Settings,
} from "lucide-react"
import { Avatar, Menu, MenuItem, MenuList, Divider, Button as MUIButton } from "@mui/material"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  id: string
  sender: string
  content: string
  time: string
  isRead: boolean
  avatar: string
  preview: string
}

interface Conversation {
  id: string
  name: string
  avatar: string
  messages: Message[]
  isTyping?: boolean
  lastMessage: {
    content: string
    time: string
    isRead: boolean
  }
}

export default function MessageInterface() {
  const [activeConversation, setActiveConversation] = useState<string>("1")
  const [messageInput, setMessageInput] = useState("")
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
  }

  const conversations: Conversation[] = [
    {
      id: "1",
      name: "Kemelerina Valentines",
      avatar: "/placeholder.svg?height=40&width=40",
      isTyping: true,
      lastMessage: {
        content: "Hello! Good morning, we'd like to interview...",
        time: "8:09 pm",
        isRead: false,
      },
      messages: [
        {
          id: "1-1",
          sender: "Kemelerina Valentines",
          content:
            "Hello [Your Name], I'm [Employer Name], the HR Manager at ABC Tech Solutions. Thank you for applying for our IT Internship Program. We've reviewed your application and would love to schedule an interview with you.",
          time: "6:09",
          isRead: true,
          avatar: "/placeholder.svg?height=40&width=40",
          preview: "Hello! Good morning, we'd like to interview...",
        },
        {
          id: "1-2",
          sender: "Kemelerina Valentines",
          content:
            "Are you available for a virtual interview on March 5 at 10:00 AM? Let me know if this works for you or if you need to reschedule.",
          time: "6:09",
          isRead: true,
          avatar: "/placeholder.svg?height=40&width=40",
          preview: "Hello! Good morning, we'd like to interview...",
        },
        {
          id: "1-3",
          sender: "Kemelerina Valentines",
          content: "Looking forward to speaking with you!\n\nBest,\n[Employer Name]",
          time: "6:09",
          isRead: true,
          avatar: "/placeholder.svg?height=40&width=40",
          preview: "Hello! Good morning, we'd like to interview...",
        },
        {
          id: "1-4",
          sender: "me",
          content: "Really, that's amazing thank you",
          time: "6:10",
          isRead: true,
          avatar: "/placeholder.svg?height=40&width=40",
          preview: "Hello! Good morning, we'd like to interview...",
        },
        {
          id: "1-5",
          sender: "Kemelerina Valentines",
          content: "Yes, please make sure to send your resume and lorem ipsum nyenyeneye",
          time: "6:12",
          isRead: true,
          avatar: "/placeholder.svg?height=40&width=40",
          preview: "Hello! Good morning, we'd like to interview...",
        },
        {
          id: "1-6",
          sender: "me",
          content:
            "I appreciate the job offer! I just wanted to ask—does the role come with any additional perks or benefits? Looking forward to your response. Thanks!",
          time: "6:12",
          isRead: true,
          avatar: "/placeholder.svg?height=40&width=40",
          preview: "Hello! Good morning, we'd like to interview...",
        },
      ],
    },
    {
      id: "2",
      name: "MJ Despi",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: {
        content: "Hello! Good morning, we'd like to interview...",
        time: "8:09 pm",
        isRead: false,
      },
      messages: [],
    },
    {
      id: "3",
      name: "Kemly Wemly",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: {
        content: "Hello! Good morning, we'd like to interview...",
        time: "8:09 pm",
        isRead: false,
      },
      messages: [],
    },
    {
      id: "4",
      name: "Markjecil Bausa",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: {
        content: "Hello! Good morning, we'd like to interview...",
        time: "8:09 pm",
        isRead: false,
      },
      messages: [],
    },
    {
      id: "5",
      name: "Zeyn Malik",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: {
        content: "Hello! Good morning, we'd like to interview...",
        time: "8:09 pm",
        isRead: false,
      },
      messages: [],
    },
    {
      id: "6",
      name: "Rose Cayer",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: {
        content: "Hello! Good morning, we'd like to interview...",
        time: "8:09 pm",
        isRead: false,
      },
      messages: [],
    },
    {
      id: "7",
      name: "Adrian Seva",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: {
        content: "Hello! Good morning, we'd like to interview...",
        time: "8:09 pm",
        isRead: false,
      },
      messages: [],
    },
  ]

  const activeConvo = conversations.find((c) => c.id === activeConversation)

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessageInput("")
    }
  }

  return (
    <div className="flex flex-col h-screen w-full border-x bg-[#f0f5fb] overflow-hidden">
      <div className="flex h-full overflow-hidden">
        {/* Left sidebar - conversation list */}
        <div className="w-80 border-r flex flex-col bg-white overflow-hidden">
          <div className="p-4 border-b">
            <h1 className="text-xl font-semibold">Messages</h1>
          </div>
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={18} />
              <Input placeholder="Search messages" className="pl-10 bg-white border-gray-300 rounded-md" />
            </div>
          </div>
          <div className="px-3 py-2">
            <div className="grid w-full grid-cols-2 rounded-full overflow-hidden border">
              <button className="py-2 px-4 text-center bg-white hover:bg-gray-50">Inbox</button>
              <button className="py-2 px-4 text-center bg-blue-500 text-white">Unread</button>
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 ${
                  activeConversation === conversation.id ? "bg-gray-100" : ""
                }`}
                onClick={() => setActiveConversation(conversation.id)}
              >
                <Avatar src={conversation.avatar || "/placeholder.svg"}>
                  {conversation.name.substring(0, 2)}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-medium truncate">{conversation.name}</p>
                    <span className="text-xs text-gray-500">{conversation.lastMessage.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.isTyping ? (
                      <span className="text-primary font-medium">is typing...</span>
                    ) : (
                      conversation.lastMessage.content
                    )}
                  </p>
                </div>
                {!conversation.lastMessage.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Right side - active conversation */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeConvo && (
            <>
              <div className="flex items-center gap-3 p-4 border-b bg-white">
                <Avatar src={activeConvo.avatar || "/placeholder.svg"}>
                  {activeConvo.name.substring(0, 2)}
                </Avatar>
                <div>
                  <p className="font-medium">{activeConvo.name}</p>
                  {activeConvo.isTyping && <p className="text-xs text-primary">is typing...</p>}
                </div>
                <div className="ml-auto flex gap-2">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Plus className="h-5 w-5" />
                  </Button>
                  <MUIButton
                    variant="outlined"
                    size="small"
                    className="rounded-full"
                    onClick={handleMenuOpen}
                  >
                    <MoreVertical className="h-5 w-5" />
                  </MUIButton>
                  <Menu
                    anchorEl={menuAnchorEl}
                    open={Boolean(menuAnchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuList>
                      <MenuItem disabled>Messaging Settings Placeholder</MenuItem>
                      <Divider />
                      <MenuItem>
                        <Bell className="mr-2 h-4 w-4" />
                        <span>Notification Preferences</span>
                      </MenuItem>
                      <MenuItem>
                        <UserCog className="mr-2 h-4 w-4" />
                        <span>Privacy Settings</span>
                      </MenuItem>
                      <MenuItem>
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Blocked Contacts</span>
                      </MenuItem>
                      <Divider />
                      <MenuItem>
                        <Archive className="mr-2 h-4 w-4" />
                        <span>Archived Messages</span>
                      </MenuItem>
                      <MenuItem>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete Conversations</span>
                      </MenuItem>
                      <Divider />
                      <MenuItem>
                        <Moon className="mr-2 h-4 w-4" />
                        <span>Dark Mode</span>
                      </MenuItem>
                      <MenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Advanced Settings</span>
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeConvo.messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                    {message.sender !== "me" && (
                      <Avatar src={activeConvo.avatar || "/placeholder.svg"} className="mr-2 mt-1">
                        {activeConvo.name.substring(0, 2)}
                      </Avatar>
                    )}
                    <div className="space-y-1 max-w-[70%]">
                      {message.sender !== "me" && <p className="text-sm font-medium">{activeConvo.name}</p>}
                      <div
                        className={`p-3 rounded-lg whitespace-pre-wrap ${
                          message.sender === "me" ? "bg-blue-500 text-white" : "bg-white border border-gray-200"
                        }`}
                      >
                        {message.content}
                      </div>
                      <p className="text-xs text-gray-500 text-right">{message.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t flex items-center gap-2 bg-white">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input
                  placeholder="Type your message"
                  className="flex-1"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button
                  size="icon"
                  className="rounded-full bg-blue-500 text-white hover:bg-blue-600"
                  onClick={handleSendMessage}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
