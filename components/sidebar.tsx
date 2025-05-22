"use client"

import { Button } from "@/components/ui/button"
import { useChatService } from "@/hooks/use-chat-service"
import { useMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { History, Menu, MessageSquare, Plus, Settings, Trash2, X } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

const navItems = [
  {
    name: "Chat",
    href: "/",
    icon: MessageSquare,
  },
  {
    name: "History",
    href: "/history",
    icon: History,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMobile()
  const { chatState, loadChat, startNewChat, deleteSession } = useChatService()

  // Show only the 5 most recent chats in the sidebar
  const recentChats = chatState.sessions.slice(0, 5)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const handleNewChat = () => {
    startNewChat()
    if (pathname !== '/') {
      router.push('/')
    }
    if (isMobile) {
      setIsOpen(false)
    }
  }

  const handleChatClick = (sessionId: string) => {
    loadChat(sessionId)
    if (pathname !== '/') {
      router.push('/')
    }
    if (isMobile) {
      setIsOpen(false)
    }
  }

  const handleDeleteChat = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation()
    e.preventDefault()
    deleteSession(sessionId)
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true })
  }

  const sidebarContent = (
    <>
      <div className="px-3 py-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold text-gray-900">AI Chat</h1>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        <Button className="w-full mb-6" onClick={handleNewChat}>
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
        
        {recentChats.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xs uppercase text-gray-500 font-semibold mb-2 px-3">Recent Chats</h2>
            <div className="space-y-1">
              {recentChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleChatClick(chat.id)}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2 text-sm cursor-pointer group",
                    chatState.currentSessionId === chat.id
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50",
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{chat.title}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 h-6 w-6"
                    onClick={(e) => handleDeleteChat(e, chat.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                pathname === item.href
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )

  return (
    <>
      {isMobile && (
        <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {isMobile ? (
        <div
          className={cn(
            "fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="absolute inset-0 bg-black/20" onClick={toggleSidebar} />
          <div className="relative w-64 h-full bg-white shadow-lg">{sidebarContent}</div>
        </div>
      ) : (
        <div className="w-64 border-r h-screen bg-white">{sidebarContent}</div>
      )}
    </>
  )
}

