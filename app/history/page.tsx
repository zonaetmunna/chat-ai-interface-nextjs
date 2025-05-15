import { MessageSquare, Calendar, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HistoryPage() {
  // In a real app, you would fetch chat history from a database
  const chatHistory = [
    {
      id: "1",
      title: "Building a Next.js application",
      date: "Today, 2:30 PM",
      preview: "How do I create a new Next.js project with TypeScript?",
    },
    {
      id: "2",
      title: "React hooks explained",
      date: "Yesterday, 10:15 AM",
      preview: "Can you explain how useEffect works in React?",
    },
    {
      id: "3",
      title: "CSS Grid layout help",
      date: "Apr 4, 2025",
      preview: "I need help with creating a responsive grid layout.",
    },
    {
      id: "4",
      title: "JavaScript promises",
      date: "Apr 2, 2025",
      preview: "What is the difference between promises and async/await?",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Chat History</h1>
        <Button variant="outline" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Clear All
        </Button>
      </div>

      <div className="space-y-4">
        {chatHistory.map((chat) => (
          <div
            key={chat.id}
            className="flex items-start gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <MessageSquare className="h-5 w-5 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-900 truncate">{chat.title}</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-1 h-3 w-3" />
                  {chat.date}
                </div>
              </div>
              <p className="text-sm text-gray-500 truncate">{chat.preview}</p>
            </div>
          </div>
        ))}
      </div>

      {chatHistory.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No chat history</h3>
          <p className="mt-2 text-sm text-gray-500">Your chat history will appear here once you start chatting.</p>
        </div>
      )}
    </div>
  )
}

