"use client"

import { Button } from "@/components/ui/button"
import { useChatService } from "@/hooks/use-chat-service"
import { formatDistanceToNow } from "date-fns"
import { Calendar, MessageSquare, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function HistoryPage() {
  const router = useRouter()
  const { chatState, loadChat, deleteSession, clearAllSessions } = useChatService()
  
  const handleChatClick = (sessionId: string) => {
    loadChat(sessionId)
    router.push('/')
  }
  
  const handleDeleteChat = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation() // Prevent triggering the parent onClick
    deleteSession(sessionId)
  }
  
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
      clearAllSessions()
    }
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true })
  }

  // Get the preview text from first user message
  const getPreviewText = (sessionId: string) => {
    const session = chatState.sessions.find(s => s.id === sessionId)
    if (!session || !session.messages.length) return 'No messages'
    
    // Find first user message
    const userMessage = session.messages.find(m => m.role === 'user')
    if (!userMessage) return 'No messages'
    
    // Get text content
    const textContent = userMessage.content.find(c => c.type === 'text')
    if (!textContent) return 'No text content'
    
    return textContent.content.length > 60 
      ? textContent.content.substring(0, 60) + '...' 
      : textContent.content
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Chat History</h1>
        {chatState.sessions.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClearAll}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {chatState.sessions.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleChatClick(chat.id)}
            className="flex items-start gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <MessageSquare className="h-5 w-5 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-900 truncate">{chat.title}</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-1 h-3 w-3" />
                    {formatDate(chat.lastUpdatedAt)}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleDeleteChat(e, chat.id)}
                  >
                    <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-500 truncate">{getPreviewText(chat.id)}</p>
            </div>
          </div>
        ))}
      </div>

      {chatState.sessions.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No chat history</h3>
          <p className="mt-2 text-sm text-gray-500">Your chat history will appear here once you start chatting.</p>
        </div>
      )}
    </div>
  )
}

