import Sidebar from "@/components/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { ChatProvider } from "@/lib/chatContext"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Chat Interface",
  description: "A ChatGPT-like interface built with Next.js and AI SDK",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ChatProvider>
            <div className="flex">
              <Sidebar />
              <main className="flex-1 overflow-hidden">{children}</main>
            </div>
            <Toaster position="bottom-right" />
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

