import { create } from "zustand";
import { persist } from "zustand/middleware";

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
    favoriteCharacterIds: string[];
    recentCharacterIds: string[];
    lastVisitedAt: Record<string, number>;
    isLoading: boolean;
    error: string | null;

    setCharacters: (characters: Character[]) => void;
    mergeCharacters: (characters: Character[]) => void;
    addCharacter: (character: Character) => void;
    updateCharacter: (id: string, updates: Partial<Character>) => void;
    setCurrentCharacterId: (id: string | null) => void;
    setImages: (images: GeneratedImage[]) => void;
    addImage: (image: GeneratedImage) => void;
    updateImage: (id: string, updates: Partial<GeneratedImage>) => void;
    removeImage: (id: string) => void;
    toggleFavoriteCharacter: (id: string) => void;
    isFavoriteCharacter: (id: string) => boolean;
    addRecentCharacter: (id: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            characters: [],
            currentCharacterId: null,
            images: [],
            favoriteCharacterIds: [],
            recentCharacterIds: [],
            lastVisitedAt: {},
            isLoading: false,
            error: null,

            setCharacters: (characters) => set({ characters }),
            mergeCharacters: (incoming) => set((state) => {
                const byId = new Map(state.characters.map((c) => [c.id, c]));
                const byName = new Map(state.characters.map((c) => [c.name.toLowerCase(), c]));
                const result: Character[] = [];
                const idRemap: Record<string, string> = {};

                for (const incomingChar of incoming) {
                    const existing = byId.get(incomingChar.id);
                    if (existing) {
                        result.push(incomingChar);
                        byId.delete(incomingChar.id);
                        byName.delete(existing.name.toLowerCase());
                    } else {
                        const existingByName = byName.get(incomingChar.name.toLowerCase());
                        if (existingByName) {
                            idRemap[existingByName.id] = incomingChar.id;
                            result.push(incomingChar);
                            byId.delete(existingByName.id);
                            byName.delete(incomingChar.name.toLowerCase());
                        } else {
                            result.push(incomingChar);
                        }
                    }
                }

                for (const [id, c] of byId) {
                    if (!Object.values(idRemap).includes(id)) {
                        result.push(c);
                    }
                }

                const favoriteCharacterIds = state.favoriteCharacterIds.map((fid) =>
                    idRemap[fid] || fid
                );
                const recentCharacterIds = state.recentCharacterIds.map((rid) =>
                    idRemap[rid] || rid
                );
                const lastVisitedAt = { ...state.lastVisitedAt };
                for (const [oldId, newId] of Object.entries(idRemap)) {
                    if (lastVisitedAt[oldId] !== undefined) {
                        lastVisitedAt[newId] = lastVisitedAt[oldId];
                        delete lastVisitedAt[oldId];
                    }
                }

                return {
                    characters: result,
                    favoriteCharacterIds,
                    recentCharacterIds,
                    lastVisitedAt
                };
            }),
            addCharacter: (character) => set((state) => ({
                characters: state.characters.some((c) => c.id === character.id)
                    ? state.characters.map((c) => (c.id === character.id ? character : c))
                    : [...state.characters, character]
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
            toggleFavoriteCharacter: (id) => set((state) => {
                const exists = state.favoriteCharacterIds.includes(id);
                return {
                    favoriteCharacterIds: exists
                        ? state.favoriteCharacterIds.filter((fid) => fid !== id)
                        : [...state.favoriteCharacterIds, id]
                };
            }),
            isFavoriteCharacter: (id) => get().favoriteCharacterIds.includes(id),
            addRecentCharacter: (id) => set((state) => {
                const filtered = state.recentCharacterIds.filter((rid) => rid !== id);
                return {
                    recentCharacterIds: [id, ...filtered].slice(0, 20),
                    lastVisitedAt: { ...state.lastVisitedAt, [id]: Date.now() }
                };
            }),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error })
        }),
        {
            name: "nova-x-ai-app",
            partialize: (state) => ({
                characters: state.characters,
                currentCharacterId: state.currentCharacterId,
                images: state.images,
                favoriteCharacterIds: state.favoriteCharacterIds,
                recentCharacterIds: state.recentCharacterIds,
                lastVisitedAt: state.lastVisitedAt
            })
        }
    )
);
