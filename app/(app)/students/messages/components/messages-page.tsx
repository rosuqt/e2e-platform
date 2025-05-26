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
  Phone,
  Video,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: string
  sender: string
  content: string
  time: string
  isRead: boolean
  avatar: string
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
        },
        {
          id: "1-2",
          sender: "Kemelerina Valentines",
          content:
            "Are you available for a virtual interview on March 5 at 10:00 AM? Let me know if this works for you or if you need to reschedule.",
          time: "6:09",
          isRead: true,
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "1-3",
          sender: "Kemelerina Valentines",
          content: "Looking forward to speaking with you!\n\nBest,\n[Employer Name]",
          time: "6:09",
          isRead: true,
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "1-4",
          sender: "me",
          content: "Really, that's amazing thank you",
          time: "6:10",
          isRead: true,
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "1-5",
          sender: "Kemelerina Valentines",
          content: "Yes, please make sure to send your resume and lorem ipsum nyenyeneye",
          time: "6:12",
          isRead: true,
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          id: "1-6",
          sender: "me",
          content:
            "I appreciate the job offer! I just wanted to ask—does the role come with any additional perks or benefits? Looking forward to your response. Thanks!",
          time: "6:12",
          isRead: true,
          avatar: "/placeholder.svg?height=40&width=40",
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
      // In a real app, you would add the message to the conversation
      // and potentially send it to a backend
      setMessageInput("")
    }
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Left sidebar - conversation list */}
      <div className="w-80 border-r flex flex-col h-full bg-white">
        <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          <h1 className="text-xl font-semibold">Messages</h1>
        </div>
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <Input
              placeholder="Search messages"
              className="pl-10 bg-white border-slate-200 rounded-md focus-visible:ring-blue-500"
            />
          </div>
        </div>
        <div className="px-3 py-2 border-b">
          <div className="grid w-full grid-cols-2 rounded-full overflow-hidden border">
            <button className="py-2 px-4 text-center bg-white hover:bg-slate-50 text-slate-700">Inbox</button>
            <button className="py-2 px-4 text-center bg-blue-600 text-white">Unread</button>
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50 border-l-4 ${
                activeConversation === conversation.id ? "border-l-blue-600 bg-slate-50" : "border-l-transparent"
              }`}
              onClick={() => setActiveConversation(conversation.id)}
            >
              <Avatar className="h-10 w-10 border border-slate-200">
                <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {conversation.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-medium truncate">{conversation.name}</p>
                  <span className="text-xs text-slate-500">{conversation.lastMessage.time}</span>
                </div>
                <p className="text-sm text-slate-600 truncate">
                  {conversation.isTyping ? (
                    <span className="text-blue-600 font-medium">is typing...</span>
                  ) : (
                    conversation.lastMessage.content
                  )}
                </p>
              </div>
              {!conversation.lastMessage.isRead && (
                <Badge variant="default" className="bg-blue-600 hover:bg-blue-700 h-2 w-2 rounded-full p-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right side - active conversation */}
      <div className="flex-1 flex flex-col h-full">
        {activeConvo && (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b bg-white shadow-sm">
              <Avatar className="h-10 w-10 border border-slate-200">
                <AvatarImage src={activeConvo.avatar || "/placeholder.svg"} alt={activeConvo.name} />
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {activeConvo.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{activeConvo.name}</p>
                {activeConvo.isTyping && <p className="text-xs text-blue-600">is typing...</p>}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                >
                  <Phone className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                >
                  <Video className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                >
                  <Plus className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Messaging Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Bell className="mr-2 h-4 w-4" />
                        <span>Notification Preferences</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <UserCog className="mr-2 h-4 w-4" />
                        <span>Privacy Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Blocked Contacts</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Archive className="mr-2 h-4 w-4" />
                        <span>Archived Messages</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete Conversations</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Moon className="mr-2 h-4 w-4" />
                        <span>Dark Mode</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Advanced Settings</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages area - only this should scroll */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {activeConvo.messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                  {message.sender !== "me" && (
                    <Avatar className="h-8 w-8 mr-2 mt-1 border border-slate-200">
                      <AvatarImage src={activeConvo.avatar || "/placeholder.svg"} alt={activeConvo.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {activeConvo.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="space-y-1 max-w-[70%]">
                    {message.sender !== "me" && (
                      <p className="text-sm font-medium text-slate-700">{activeConvo.name}</p>
                    )}
                    <div
                      className={`p-3 rounded-lg whitespace-pre-wrap ${
                        message.sender === "me"
                          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
                          : "bg-white border border-slate-200 text-slate-800 shadow-sm"
                      }`}
                    >
                      {message.content}
                    </div>
                    <p className="text-xs text-slate-500 text-right">{message.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input area - fixed at the bottom of the chat area */}
            <div className="p-3 border-t bg-white shadow-md">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input
                  placeholder="Type your message"
                  className="flex-1 border-slate-200 focus-visible:ring-blue-500"
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
                  className="rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-900 shadow-md"
                  onClick={handleSendMessage}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
