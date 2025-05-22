"use client"

import ChatInput from "@/components/message/ChatInput"
import ChatMessage from "@/components/message/ChatMessage"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChatService } from "@/hooks/use-chat-service"
import { Bot } from "lucide-react"
import { useEffect } from "react"

export default function ChatPage() {
  const { 
    currentSession, 
    isLoading, 
    sendMessage, 
    startNewChat
  } = useChatService();
  
  // Automatically create a new chat session if none exists
  useEffect(() => {
    if (!currentSession) {
      startNewChat();
    }
  }, [currentSession]);

  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

  // Get messages from the current session
  const messages = currentSession?.messages || [];

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
                <ChatMessage key={message.id} message={message} />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
    </div>
  )
}

