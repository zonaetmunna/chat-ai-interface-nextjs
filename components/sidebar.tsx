"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { MessageSquare, History, Settings, Plus, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useMobile } from "@/hooks/use-mobile"

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
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMobile()

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const sidebarContent = (
    <>
      <div className="px-3 py-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold">AI Chat</h1>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        <Button className="w-full mb-6" asChild>
          <Link href="/" onClick={() => isMobile && setIsOpen(false)}>
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Link>
        </Button>
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
        <div className="w-64 border-r bg-white h-screen">{sidebarContent}</div>
      )}
    </>
  )
}

