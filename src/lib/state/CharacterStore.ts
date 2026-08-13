import { create } from "zustand";

export interface Character {
    id: string;
    name: string;
    description: string;
    avatarImageId: string | null;
    createdAt: number;
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
