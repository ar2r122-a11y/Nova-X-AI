import { create } from "zustand";

export interface ChatMessage {
    id: string;
    conversationId: string;
    sessionId: string;
    authorId: string;
    role: string;
    content: string;
    timestamp: number;
    images?: Array<{
        uri: string;
        width: number;
        height: number;
        mimeType: string;
    }>;
    isStreaming?: boolean;
    isError?: boolean;
    isRegenerating?: boolean;
}

export interface StorySceneState {
    storyId: string | null;
    currentSceneId: string | null;
    currentSceneTitle: string | null;
    currentSceneDescription: string | null;
    choices: Array<{ choiceId: string; text: string; targetSceneId: string }>;
    quests: Array<{
        questId: string;
        title: string;
        description: string;
        status: string;
        progress: number;
        objectives: Array<{
            objectiveId: string;
            description: string;
            status: string;
            progress: number;
        }>;
    }>;
    storyProgress: {
        currentChapterId: string | null;
        completedScenes: string[];
        activeQuests: string[];
        completedQuests: string[];
    } | null;
}

export interface WorldContextState {
    currentLocation: string | null;
    timeOfDay: string | null;
    weather: string | null;
    environment: string | null;
    participatingCharacters: Array<{
        characterId: string;
        name: string;
        status: string;
        avatarUri: string | null;
    }>;
}

export interface ChatState {
    messages: ChatMessage[];
    conversationId: string | null;
    sessionId: string | null;
    isLoading: boolean;
    isStreaming: boolean;
    isGeneratingImage: boolean;
    isSpeaking: boolean;
    error: string | null;
    streamingMessageId: string | null;
    storyScene: StorySceneState;
    worldContext: WorldContextState;
    characterId: string | null;
    characterName: string | null;
    characterAvatarUri: string | null;

    setMessages: (messages: ChatMessage[]) => void;
    addMessage: (message: ChatMessage) => void;
    updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
    removeMessage: (id: string) => void;
    setConversationId: (conversationId: string | null) => void;
    setSessionId: (sessionId: string | null) => void;
    setLoading: (loading: boolean) => void;
    setStreaming: (streaming: boolean) => void;
    setStreamingMessageId: (id: string | null) => void;
    setGeneratingImage: (generating: boolean) => void;
    setSpeaking: (speaking: boolean) => void;
    setError: (error: string | null) => void;
    clearChat: () => void;
    setStoryScene: (scene: Partial<StorySceneState>) => void;
    setWorldContext: (context: Partial<WorldContextState>) => void;
    setCharacterContext: (context: { characterId: string; name: string; avatarUri: string | null }) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    messages: [],
    conversationId: null,
    sessionId: null,
    isLoading: false,
    isStreaming: false,
    isGeneratingImage: false,
    isSpeaking: false,
    error: null,
    streamingMessageId: null,
    storyScene: {
        storyId: null,
        currentSceneId: null,
        currentSceneTitle: null,
        currentSceneDescription: null,
        choices: [],
        quests: [],
        storyProgress: null,
    },
    worldContext: {
        currentLocation: null,
        timeOfDay: null,
        weather: null,
        environment: null,
        participatingCharacters: [],
    },
    characterId: null,
    characterName: null,
    characterAvatarUri: null,

    setMessages: (messages) => set({ messages }),
    addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
    })),
    updateMessage: (id, updates) => set((state) => ({
        messages: state.messages.map((m) => (m.id === id ? { ...m, ...updates } : m))
    })),
    removeMessage: (id) => set((state) => ({
        messages: state.messages.filter((m) => m.id !== id)
    })),
    setConversationId: (conversationId) => set({ conversationId }),
    setSessionId: (sessionId) => set({ sessionId }),
    setLoading: (isLoading) => set({ isLoading }),
    setStreaming: (isStreaming) => set({ isStreaming }),
    setStreamingMessageId: (streamingMessageId) => set({ streamingMessageId }),
    setGeneratingImage: (isGeneratingImage) => set({ isGeneratingImage }),
    setSpeaking: (isSpeaking) => set({ isSpeaking }),
    setError: (error) => set({ error }),
    clearChat: () => set({
        messages: [],
        conversationId: null,
        sessionId: null,
        error: null,
        isStreaming: false,
        isGeneratingImage: false,
        isSpeaking: false,
        streamingMessageId: null,
        storyScene: {
            storyId: null,
            currentSceneId: null,
            currentSceneTitle: null,
            currentSceneDescription: null,
            choices: [],
            quests: [],
            storyProgress: null,
        },
        worldContext: {
            currentLocation: null,
            timeOfDay: null,
            weather: null,
            environment: null,
            participatingCharacters: [],
        },
        characterId: null,
        characterName: null,
        characterAvatarUri: null,
    }),
    setStoryScene: (scene) => set((state) => ({
        storyScene: { ...state.storyScene, ...scene }
    })),
    setWorldContext: (context) => set((state) => ({
        worldContext: { ...state.worldContext, ...context }
    })),
    setCharacterContext: (context) => set({
        characterId: context.characterId,
        characterName: context.name,
        characterAvatarUri: context.avatarUri,
    }),
}));
