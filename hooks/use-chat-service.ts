"use client"

import { MessageContent, useChat as useChatContext } from '@/lib/chatContext';
import { useState } from 'react';

export function useChatService() {
  const { 
    state, 
    createSession, 
    setCurrentSession, 
    addMessage, 
    getCurrentSession,
    deleteSession,
    clearAllSessions
  } = useChatContext();
  const [isLoading, setIsLoading] = useState(false);

  // Function to send a user message
  const sendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    // Create user message
    const userMessageContent: MessageContent[] = [
      {
        type: 'text',
        content: message,
      }
    ];
    
    // Add user message to the current chat
    addMessage({
      role: 'user',
      content: userMessageContent,
    });
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // In a real application, you would call your AI API here
      // For now, we'll simulate a response
      await simulateAIResponse(message);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message if needed
      addMessage({
        role: 'assistant',
        content: [{
          type: 'text',
          content: 'Sorry, there was an error processing your request. Please try again.'
        }]
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to simulate AI response with different content types
  const simulateAIResponse = async (userMessage: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response: MessageContent[] = [];
    
    // Default text response
    response.push({
      type: 'text',
      content: `I received your message: "${userMessage}"\n\nHere's my response as an AI assistant.`
    });
    
    // Check for keywords to add different content types
    if (userMessage.toLowerCase().includes('code') || userMessage.toLowerCase().includes('programming')) {
      response.push({
        type: 'code',
        language: 'javascript',
        content: 'function greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconst message = greet("World");\nconsole.log(message);'
      });
    }
    
    if (userMessage.toLowerCase().includes('image') || userMessage.toLowerCase().includes('picture')) {
      response.push({
        type: 'image',
        content: 'Image',
        url: 'https://images.unsplash.com/photo-1593642532744-d377ab507dc8',
        caption: 'Example image generated based on your request'
      });
    }
    
    if (userMessage.toLowerCase().includes('file') || userMessage.toLowerCase().includes('document')) {
      response.push({
        type: 'file',
        content: 'example_document.pdf',
        url: '#',
        caption: 'This is a simulated file attachment'
      });
    }
    
    // Add AI response to chat
    addMessage({
      role: 'assistant',
      content: response
    });
  };

  // Create a new chat session
  const startNewChat = () => {
    createSession('New Chat');
  };

  // Load a specific chat session
  const loadChat = (sessionId: string) => {
    setCurrentSession(sessionId);
  };

  return {
    chatState: state,
    currentSession: getCurrentSession(),
    isLoading,
    sendMessage,
    startNewChat,
    loadChat,
    deleteSession,
    clearAllSessions
  };
} 