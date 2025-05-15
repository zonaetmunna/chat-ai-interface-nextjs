"use client"

import type React from "react"

import { useState } from "react"
import { useChat } from "ai/react"
import { Send, Bot, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  })
  const [inputHeight, setInputHeight] = useState("h-12")

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e)
    // Adjust height based on content
    const height = Math.min(e.target.scrollHeight, 200)
    setInputHeight(height <= 48 ? "h-12" : `h-[${height}px]`)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto px-4">
      <div className="flex-1 overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-6 max-w-lg">
              <Bot className="mx-auto h-12 w-12 text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-800">How can I help you today?</h2>
              <p className="text-gray-500">
                Ask me anything! I can help with coding, answer questions, generate content, and more.
              </p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-full pr-4">
            <div className="space-y-6 py-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-4 rounded-lg p-4",
                    message.role === "user" ? "bg-gray-100" : "bg-gray-50 border border-gray-100",
                  )}
                >
                  <div className="flex-shrink-0">
                    {message.role === "user" ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="font-medium">{message.role === "user" ? "You" : "Assistant"}</div>
                    <div className="prose prose-sm">{message.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <div className="border-t py-4">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            value={input}
            onChange={handleTextareaChange}
            placeholder="Type your message..."
            className={cn("pr-12 resize-none py-3", inputHeight)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e as any)
              }
            }}
          />
          <Button type="submit" size="icon" className="absolute right-2 bottom-2" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  )
}

