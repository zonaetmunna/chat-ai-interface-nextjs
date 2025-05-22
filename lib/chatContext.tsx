"use client"

import { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';

// Define the message types that can be handled by the AI
export type MessageContentType = 'text' | 'code' | 'image' | 'video' | 'file';

export interface MessageContent {
  type: MessageContentType;
  content: string;
  language?: string; // For code blocks
  caption?: string; // For media
  url?: string; // For images, videos, files
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: MessageContent[];
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  lastUpdatedAt: Date;
}

interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
}

type ChatAction =
  | { type: 'CREATE_SESSION'; payload: { title: string } }
  | { type: 'SET_CURRENT_SESSION'; payload: { sessionId: string } }
  | { type: 'ADD_MESSAGE'; payload: { sessionId: string; message: ChatMessage } }
  | { type: 'RENAME_SESSION'; payload: { sessionId: string; title: string } }
  | { type: 'DELETE_SESSION'; payload: { sessionId: string } }
  | { type: 'CLEAR_ALL_SESSIONS' };

const initialState: ChatState = {
  sessions: [],
  currentSessionId: null,
};

// Generate a unique ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Create a reducer to handle state updates
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'CREATE_SESSION': {
      const newSession: ChatSession = {
        id: generateId(),
        title: action.payload.title,
        messages: [],
        createdAt: new Date(),
        lastUpdatedAt: new Date(),
      };
      return {
        ...state,
        sessions: [newSession, ...state.sessions],
        currentSessionId: newSession.id,
      };
    }
    case 'SET_CURRENT_SESSION':
      return {
        ...state,
        currentSessionId: action.payload.sessionId,
      };
    case 'ADD_MESSAGE': {
      return {
        ...state,
        sessions: state.sessions.map(session => {
          if (session.id === action.payload.sessionId) {
            return {
              ...session,
              messages: [...session.messages, action.payload.message],
              lastUpdatedAt: new Date(),
              title: session.title === 'New Chat' && action.payload.message.role === 'user'
                ? action.payload.message.content[0].content.slice(0, 30) + '...'
                : session.title,
            };
          }
          return session;
        }),
      };
    }
    case 'RENAME_SESSION':
      return {
        ...state,
        sessions: state.sessions.map(session => {
          if (session.id === action.payload.sessionId) {
            return {
              ...session,
              title: action.payload.title,
              lastUpdatedAt: new Date(),
            };
          }
          return session;
        }),
      };
    case 'DELETE_SESSION': {
      const updatedSessions = state.sessions.filter(
        session => session.id !== action.payload.sessionId
      );
      let currentSessionId = state.currentSessionId;
      
      // If deleting the current session, set to the first available or null
      if (state.currentSessionId === action.payload.sessionId) {
        currentSessionId = updatedSessions.length > 0 ? updatedSessions[0].id : null;
      }
      
      return {
        ...state,
        sessions: updatedSessions,
        currentSessionId,
      };
    }
    case 'CLEAR_ALL_SESSIONS':
      return initialState;
    default:
      return state;
  }
};

// Create the context
interface ChatContextType {
  state: ChatState;
  createSession: (title: string) => void;
  setCurrentSession: (sessionId: string) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  renameSession: (sessionId: string, title: string) => void;
  deleteSession: (sessionId: string) => void;
  clearAllSessions: () => void;
  getCurrentSession: () => ChatSession | null;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Create a provider component
export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Load state from localStorage on initial render
  useEffect(() => {
    const savedState = localStorage.getItem('chatState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState, (key, value) => {
          // Convert string dates back to Date objects
          if (key === 'createdAt' || key === 'lastUpdatedAt' || key === 'timestamp') {
            return new Date(value);
          }
          return value;
        });
        if (parsedState.sessions && Array.isArray(parsedState.sessions)) {
          dispatch({ type: 'CLEAR_ALL_SESSIONS' });
          parsedState.sessions.forEach((session: ChatSession) => {
            dispatch({ type: 'CREATE_SESSION', payload: { title: session.title } });
            session.messages.forEach((message: ChatMessage) => {
              dispatch({
                type: 'ADD_MESSAGE',
                payload: { sessionId: session.id, message },
              });
            });
          });
          if (parsedState.currentSessionId) {
            dispatch({
              type: 'SET_CURRENT_SESSION',
              payload: { sessionId: parsedState.currentSessionId },
            });
          }
        }
      } catch (error) {
        console.error('Error parsing saved chat state:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chatState', JSON.stringify(state));
  }, [state]);

  const createSession = (title: string) => {
    dispatch({ type: 'CREATE_SESSION', payload: { title } });
  };

  const setCurrentSession = (sessionId: string) => {
    dispatch({ type: 'SET_CURRENT_SESSION', payload: { sessionId } });
  };

  const addMessage = (messageData: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    if (!state.currentSessionId) {
      // Create a new session if there's no current session
      const newSessionAction = { type: 'CREATE_SESSION', payload: { title: 'New Chat' } } as const;
      dispatch(newSessionAction);
      
      // We need to use the new session ID for adding the message
      setTimeout(() => {
        const sessionId = state.currentSessionId!;
        const message: ChatMessage = {
          ...messageData,
          id: generateId(),
          timestamp: new Date(),
        };
        dispatch({ type: 'ADD_MESSAGE', payload: { sessionId, message } });
      }, 0);
    } else {
      const message: ChatMessage = {
        ...messageData,
        id: generateId(),
        timestamp: new Date(),
      };
      dispatch({
        type: 'ADD_MESSAGE',
        payload: { sessionId: state.currentSessionId, message },
      });
    }
  };

  const renameSession = (sessionId: string, title: string) => {
    dispatch({ type: 'RENAME_SESSION', payload: { sessionId, title } });
  };

  const deleteSession = (sessionId: string) => {
    dispatch({ type: 'DELETE_SESSION', payload: { sessionId } });
  };

  const clearAllSessions = () => {
    dispatch({ type: 'CLEAR_ALL_SESSIONS' });
  };

  const getCurrentSession = (): ChatSession | null => {
    if (!state.currentSessionId) return null;
    return state.sessions.find(session => session.id === state.currentSessionId) || null;
  };

  return (
    <ChatContext.Provider
      value={{
        state,
        createSession,
        setCurrentSession,
        addMessage,
        renameSession,
        deleteSession,
        clearAllSessions,
        getCurrentSession,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Create a custom hook to use the context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 