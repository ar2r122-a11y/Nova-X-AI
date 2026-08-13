import { create } from "zustand";

export interface Character {
    id: string;
    name: string;
    title: string;
    description: string;
    age: string;
    gender: string;
    role: string;
    origin: string;
    language: string;
    tags: string[];
    createdAt: number;
    avatarImageId: string | null;
    appearance: {
        visualDescription: string;
        skinTone: string;
        faceCharacteristics: string;
        bodyType: string;
        bodySize: string;
        height: string;
        hairStyle: string;
        hairLength: string;
        hairColor: string;
        eyeCharacteristics: string;
        eyeColor: string;
        clothing: string;
        accessories: string[];
    };
    personality: {
        description: string;
        speakingStyle: string;
        tone: string;
        traits: Array<{ name: string; score: number }>;
        interests: string[];
        likes: string[];
        dislikes: string[];
        background: string;
        relationshipStyle: string;
        goals: string[];
        moralAlignment: string;
        quirks: string[];
        fears: string[];
        desires: string[];
        customInstructions: string;
    };
    voice: {
        tone: string;
        speechTempo: string;
        vocabularyLevel: string;
        dialectNotes: string[];
    };
}

export interface GeneratedImage {
    id: string;
    characterId: string;
    prompt: string;
    candidates: Array<{
        id: string;
        uri: string;
        score: number;
        width: number;
        height: number;
    }>;
    selectedCandidateId: string | null;
    status: string;
    createdAt: number;
}

export interface AppState {
    characters: Character[];
    currentCharacterId: string | null;
    images: GeneratedImage[];
    isLoading: boolean;
    error: string | null;

    setCharacters: (characters: Character[]) => void;
    addCharacter: (character: Character) => void;
    updateCharacter: (id: string, updates: Partial<Character>) => void;
    setCurrentCharacterId: (id: string | null) => void;
    setImages: (images: GeneratedImage[]) => void;
    addImage: (image: GeneratedImage) => void;
    updateImage: (id: string, updates: Partial<GeneratedImage>) => void;
    removeImage: (id: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
    characters: [],
    currentCharacterId: null,
    images: [],
    isLoading: false,
    error: null,

    setCharacters: (characters) => set({ characters }),
    addCharacter: (character) => set((state) => ({
        characters: [...state.characters, character]
    })),
    updateCharacter: (id, updates) => set((state) => ({
        characters: state.characters.map((c) => (c.id === id ? { ...c, ...updates } : c))
    })),
    setCurrentCharacterId: (currentCharacterId) => set({ currentCharacterId }),
    setImages: (images) => set({ images }),
    addImage: (image) => set((state) => ({
        images: [...state.images, image]
    })),
    updateImage: (id, updates) => set((state) => ({
        images: state.images.map((img) =>
            img.id === id ? { ...img, ...updates } : img
        )
    })),
    removeImage: (id) => set((state) => ({
        images: state.images.filter((img) => img.id !== id)
    })),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error })
}));
