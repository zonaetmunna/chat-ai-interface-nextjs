"use client"

import { ChatMessage as ChatMessageType } from '@/lib/chatContext';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import React from 'react';
import MessageContents from './MessageContent';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-lg p-4",
        isUser ? "bg-gray-100" : "bg-gray-50 border border-gray-100",
      )}
    >
      <div className="flex-shrink-0">
        {isUser ? (
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
        <div className="font-medium">{isUser ? "You" : "Assistant"}</div>
        <div className="prose prose-sm max-w-none">
          <MessageContents contents={message.content} />
        </div>
      </div>
    </div>
  );
};

export default ChatMessage; 