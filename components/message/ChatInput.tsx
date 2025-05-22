"use client"

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Loader2, Send } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSend, 
  isLoading, 
  placeholder = "Type your message..." 
}) => {
  const [input, setInput] = useState('');
  const [inputHeight, setInputHeight] = useState('h-12');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      
      // Calculate new height (with max height of 200px)
      const height = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${height}px`;
      
      // Update height state for styling
      setInputHeight(height <= 48 ? 'h-12' : `h-[${height}px]`);
    }
  };

  // Adjust height on input changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
      // Reset height after sending
      setInputHeight('h-12');
      if (textareaRef.current) {
        textareaRef.current.style.height = '48px';
      }
    }
  };

  return (
    <div className="border-t py-4">
      <form onSubmit={handleSubmit} className="relative">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={cn("pr-12 resize-none py-3", inputHeight)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          size="icon" 
          className="absolute right-2 bottom-2" 
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? 
            <Loader2 className="h-4 w-4 animate-spin" /> : 
            <Send className="h-4 w-4" />
          }
        </Button>
      </form>
    </div>
  );
};

export default ChatInput; 