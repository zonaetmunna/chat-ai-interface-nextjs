"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useChatService } from "@/hooks/use-chat-service"
import { Download, Moon, Sun, Trash2, Zap } from "lucide-react"
import { useTheme } from "next-themes"
import { useState } from "react"
import { toast } from "sonner"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [model, setModel] = useState("gpt-4o")
  const [temperature, setTemperature] = useState([0.7])
  const [saveHistory, setSaveHistory] = useState(true)
  const [notifications, setNotifications] = useState(false)
  const { chatState, clearAllSessions } = useChatService()

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
      clearAllSessions()
      toast.success('All chat history has been cleared')
    }
  }

  const handleExportChats = () => {
    try {
      // Create a JSON blob with the chat data
      const dataStr = JSON.stringify(chatState.sessions, null, 2)
      const blob = new Blob([dataStr], { type: 'application/json' })
      
      // Create a download link and trigger it
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      
      // Clean up
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success('Chat history exported successfully')
    } catch (error) {
      console.error('Error exporting chats:', error)
      toast.error('Failed to export chat history')
    }
  }

  const handleSaveHistoryChange = (checked: boolean) => {
    setSaveHistory(checked)
    if (!checked && window.confirm('Turning this off will clear your current chat history. Continue?')) {
      clearAllSessions()
      toast.success('Chat history preferences updated')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="model">Model</TabsTrigger>
          <TabsTrigger value="data">Data & Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Appearance</h2>
            <div className="grid grid-cols-3 gap-4">
              <div
                className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center ${theme === "light" ? "border-black bg-gray-50" : ""}`}
                onClick={() => setTheme("light")}
              >
                <Sun className="h-6 w-6 mb-2" />
                <span>Light</span>
              </div>
              <div
                className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center ${theme === "dark" ? "border-black bg-gray-50" : ""}`}
                onClick={() => setTheme("dark")}
              >
                <Moon className="h-6 w-6 mb-2" />
                <span>Dark</span>
              </div>
              <div
                className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center ${theme === "system" ? "border-black bg-gray-50" : ""}`}
                onClick={() => setTheme("system")}
              >
                <Zap className="h-6 w-6 mb-2" />
                <span>System</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Notifications</Label>
              <div className="text-sm text-gray-500">Receive notifications for new features</div>
            </div>
            <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
          </div>
        </TabsContent>

        <TabsContent value="model" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Model Selection</h2>
            <div className="space-y-2">
              <Label htmlFor="model-select">AI Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger id="model-select">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="temperature">Temperature: {temperature[0].toFixed(1)}</Label>
            </div>
            <Slider id="temperature" min={0} max={1} step={0.1} value={temperature} onValueChange={setTemperature} />
            <div className="flex justify-between text-xs text-gray-500">
              <span>More Deterministic</span>
              <span>More Creative</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="save-history">Save Chat History</Label>
              <div className="text-sm text-gray-500">Store your conversations for future reference</div>
            </div>
            <Switch id="save-history" checked={saveHistory} onCheckedChange={handleSaveHistoryChange} />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium">Data Management</h2>
            <p className="text-sm text-gray-500">
              Manage your data and privacy settings. Clearing your data will permanently delete all your chat history.
            </p>
            <div className="flex space-x-4">
              <Button variant="outline" className="flex items-center" onClick={handleExportChats}>
                <Download className="mr-2 h-4 w-4" />
                Export Chats
              </Button>
              <Button 
                variant="destructive" 
                className="flex items-center"
                onClick={handleClearAllData}
                disabled={chatState.sessions.length === 0}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All Data
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              {chatState.sessions.length > 0 
                ? `You currently have ${chatState.sessions.length} saved chat${chatState.sessions.length > 1 ? 's' : ''}`
                : 'You don\'t have any saved chats'}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

