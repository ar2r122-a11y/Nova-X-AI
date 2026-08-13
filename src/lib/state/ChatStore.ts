import { create } from "zustand";

export interface ChatMessage {
    id: string;
    conversationId: string;
    sessionId: string;
    authorId: string;
    role: string;
    content: string;
    timestamp: number;
}

export interface ChatState {
    messages: ChatMessage[];
    conversationId: string | null;
    sessionId: string | null;
    isLoading: boolean;
    error: string | null;

    setMessages: (messages: ChatMessage[]) => void;
    addMessage: (message: ChatMessage) => void;
    setConversationId: (conversationId: string | null) => void;
    setSessionId: (sessionId: string | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
    messages: [],
    conversationId: null,
    sessionId: null,
    isLoading: false,
    error: null,

    setMessages: (messages) => set({ messages }),
    addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
    })),
    setConversationId: (conversationId) => set({ conversationId }),
    setSessionId: (sessionId) => set({ sessionId }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    clearChat: () => set({ messages: [], conversationId: null, sessionId: null, error: null })
}));
