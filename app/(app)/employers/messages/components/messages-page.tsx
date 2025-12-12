"use client"
import { useState, useEffect } from "react"
import {
  Search,
  Send,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
  time: Date;
  content: string;
  sender_id: string;
}

type Contacts = {
  id: number;
  first_name: string;
  last_name: string;
};

interface Conversation {
  id: string
  name: string
  avatar?: string
  role: string
  messages?: Message[]
  lastMessage?: {
    content: string
    time: string
  }
  userId: string
}

export default function MessageInterface() {
  const [active, setActive] = useState<"contacts" | "messages">("messages");
  const [students, setStudents] = useState<Contacts[]>([]);
  const [ setEmployers] = useState<Contacts[]>([]);
  const [admins, setAdmins] = useState<Contacts[]>([]);
  const [isOpenS, setIsOpenS] = useState(false);
  const [isOpenA, setIsOpenA] = useState(false);

  //FETCHING CONTACTS 4 EMPLOYERS
  useEffect(() => {
    async function loadStudents() {
      try {
        const res = await fetch("/api/employers/messages-events");
        const data = await res.json();
        setStudents(data.students);
        setEmployers(data.employers);
        setAdmins(data.admins);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    }

    loadStudents();
  }, []);

  //STARTING CONVO
  const handleClick = async (chosenUserId: number) => {
      const res = await fetch('/api/employers/messages-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user2_id: chosenUserId }),
      })

      const result = await res.json()

      if (result.error) {
        alert('Error: ' + result.error)
      } else if (result.message === 'Conversation already exists') {
        alert('You already have a chat with this user.')
        console.log(result.data)
      } else {
        setActive("messages");
        setActiveConversation(chosenUserId.toString());
        getConversations();
      }
    }

  //FETCH CONVERSATIONS
  const [conversations, setConversations] = useState<Conversation[]>([]); 

  const getConversations = async () => {
    async function fetchConversations() {
      try {
        const res = await fetch("/api/employers/messages-events/get-contacts", { method: "GET" });
        const data = await res.json();
        if (data.conversations) {
          setConversations(data.conversations);
        }
        console.log(data);
      } catch (err) {
        console.error("❌ Error fetching conversations:", err);
      }
    }
    fetchConversations();
  };

  useEffect(() => {
    getConversations(); // run immediately

    const interval = setInterval(() => {
      getConversations();
    }, 5000); // every 5 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const activeConvo = conversations.find((c) => c.id === activeConversation);
  const [search, setSearch] = useState("");
  
  //SENDING MESSAGE
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const handleSendMessage = async (convId: string) => {
    if (!message.trim()) return;
    setSending(true);

    try {
      const res = await fetch("/api/employers/messages-events/get-contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: convId, content: message }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("");
      } else {
        console.error("❌ API Error:", data.error);
      }
    } catch (err) {
      console.error("❌ Network error:", err);
    } finally {
      setSending(false);
      getConversations();
    }
  };


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
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white border-slate-200 rounded-md focus-visible:ring-blue-500"
            />
          </div>
        </div>
        <div className="px-3 py-2 border-b">
          <div className="grid w-full grid-cols-2 rounded-full overflow-hidden border">
            {/* Contacts Button */}
            <button
              onClick={() => setActive("contacts")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${active === "contacts" ? "bg-blue-600 text-white shadow" : "text-gray-500"}`}
            >
              Contacts
            </button>
            {/* Messages Button */}
            <button
              onClick={() => setActive("messages")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${active === "messages" ? "bg-blue-600 text-white shadow" : "text-gray-500"}`}
            >
              Messages
            </button>
          </div>
        </div> 

        {/* MESSAGING MODE */}
        {active !== "contacts" &&(
        <div className="overflow-y-auto flex-1">         
          {conversations.filter(adacc => adacc.name.toLowerCase().includes(search.toLowerCase())).map((conversation) => (
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
                  <span className="text-xs text-slate-500">
                    {conversation.lastMessage?.time
                      ? new Date(conversation.lastMessage.time).toLocaleString("en-PH", {
                          timeZone: "Asia/Manila",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        }).replace(',', '')
                      : ""}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{conversation.role}</p>        
                <p className="text-sm text-slate-600 truncate">
                  {conversation.lastMessage?.content}
                </p>
              </div>
            </div>
          ))}          
        </div>)}
          
        {/* CONTACTS MODE */}   
        {active === "contacts" &&(
        <div className="overflow-y-auto flex-1">
          {/* STUDENTS */}
          <div className="w-full text-sm">
            {/* Header / Toggle */}
            <div
              onClick={() => setIsOpenS(!isOpenS)}
              className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-blue-100 rounded-md transition-colors"
            >
              <h2 className="font-semibold text-gray-800">Students</h2>
              {isOpenS ? (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              )}
            </div>
            {/* Collapsible Content */}
            {isOpenS && (
              <div className="mt-1 space-y-1">
              {students.filter(adacc => adacc.first_name.toLowerCase().includes(search.toLowerCase())).map((s) => (
            <div
              key={s.id}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50 border-l-4`}
              onClick={() => handleClick(s.id)}
            >
              <Avatar className="h-10 w-10 border border-slate-200">
                <AvatarImage src={"/placeholder.svg"} alt={s.first_name + " " + s.last_name} />
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {s.last_name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-medium truncate">{s.first_name}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium truncate text-xs">Student</p>
                </div>
              </div>
            </div>
          ))}

          </div>
            )}
          </div>

          {/* ADMINS */}
          <div className="w-full text-sm">
            {/* Header / Toggle */}
            <div
              onClick={() => setIsOpenA(!isOpenA)}
              className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-blue-100 rounded-md transition-colors"
            >
              <h2 className="font-semibold text-gray-800">OJT Coordinator</h2>
              {isOpenA ? (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              )}
            </div>
            {/* Collapsible Content */}
            {isOpenA && (
              <div className="mt-1 space-y-1">
              {admins.filter(adacc => adacc.first_name.toLowerCase().includes(search.toLowerCase())).map((a) => (
            <div
              key={a.id}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50 border-l-4`}
              onClick={() => handleClick(a.id)}
            >
              <Avatar className="h-10 w-10 border border-slate-200">
                <AvatarImage src={"/placeholder.svg"} alt={a.first_name + " " + a.last_name} />
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {a.last_name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-medium truncate">{a.first_name}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium truncate text-xs">Admin</p>
                </div>
              </div>
            </div>
          ))}
          </div>
            )}
          </div>
                    
        </div>)}
      </div> 

      {/* Right side - active conversation */}
      <div className="flex-1 flex flex-col h-full relative">
        {activeConvo&&(
          <>
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b bg-white shadow-sm relative">
              <Avatar className="h-10 w-10 border border-slate-200">
                <AvatarImage src={activeConvo.avatar || "/placeholder.svg"} alt={activeConvo.name} />
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {activeConvo.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex gap-2">
              </div>
            </div>

            {/* Messages area - only this should scroll */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 ">
              {activeConvo.messages?.map((message) => (
                <div key={activeConvo.id} className={`flex ${message.sender_id === activeConvo.userId ? "justify-end" : "justify-start"}`}>
                  {message.sender_id !== activeConvo.userId && (
                    <Avatar className="h-8 w-8 mr-2 mt-1 border border-slate-200">
                      <AvatarImage src={activeConvo.avatar || "/placeholder.svg"} alt={activeConvo.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {activeConvo.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="space-y-1 max-w-[70%]">
                    {message.sender_id !== activeConvo.userId && (
                      <p className="text-sm font-medium text-slate-700">{activeConvo.name}</p>
                    )}
                    <div
                      className={`p-3 rounded-lg whitespace-pre-wrap ${
                        message.sender_id === activeConvo.userId
                          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
                          : "bg-white border border-slate-200 text-slate-800 shadow-sm"
                      }`}
                    >
                      {message.content}
                    </div>
                    
                    <p className="text-xs text-slate-500 text-right">{new Date(message.time).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input area - fixed at the bottom of the chat area */}
            <div className="bottom-0 relative">
            <div className="p-3 border-t bg-white shadow-md  bottom-0 right-0 flex-1 ">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Type your message"
                  className="flex-1 border-slate-200 focus-visible:ring-blue-500"
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage(activeConvo.id)
                    }
                  }}
                  
                />
                <Button
                  size="icon"
                  className="rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-900 shadow-md flex"
                  onClick={() => handleSendMessage(activeConvo.id)}
                  disabled={sending}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
            </div>
          </>
        )}
      </div>
      
    </div>
  )
}