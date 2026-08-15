import { CharacterEngineClient } from "./CharacterEngineClient";
import type { Character } from "../state/CharacterStore";

export async function loadCharactersFromEngine(): Promise<Character[]> {
    try {
        const engine = await CharacterEngineClient.getEngine();
        const aggregates = await engine.getActiveCharacters();
        return aggregates.map((aggregate) => aggregateToCharacter(aggregate));
    } catch {
        return [];
    }
}

function aggregateToCharacter(aggregate: any): Character {
    const snapshot: any = aggregate.getSnapshot();
    const identity = snapshot.identity || {};
    const profile = snapshot.profile || {};
    const personality = snapshot.personality || {};
    const appearance = snapshot.appearance || {};
    const voiceProfile = snapshot.voiceProfile || {};

    const traits: Array<{ name: string; score: number }> = personality.traits || [];

    return {
        id: aggregate.getId().getValue(),
        name: identity.name || "Unnamed",
        title: identity.title || "",
        description: profile.biography || "",
        age: identity.age || "",
        gender: "",
        role: profile.occupation || identity.origin || "",
        origin: identity.origin || "",
        language: "",
        tags: [],
        createdAt: 0,
        avatarImageId: appearance.avatarUri ? appearance.avatarUri : null,
        appearance: {
            visualDescription: appearance.visualDescription || "",
            skinTone: "",
            faceCharacteristics: appearance.distinguishingMarks || "",
            bodyType: "",
            bodySize: "",
            height: "",
            hairStyle: "",
            hairLength: "",
            hairColor: "",
            eyeCharacteristics: "",
            eyeColor: "",
            clothing: appearance.clothingStyle || "",
            accessories: []
        },
        personality: {
            description: "",
            speakingStyle: "",
            tone: voiceProfile.tone || "neutral",
            traits,
            interests: [],
            likes: [],
            dislikes: [],
            background: "",
            relationshipStyle: "",
            goals: Array.isArray(snapshot.goals?.activeGoals)
                ? snapshot.goals.activeGoals.map((g: any) => g.description || "").filter(Boolean)
                : [],
            moralAlignment: personality.moralAlignment || "neutral",
            quirks: personality.quirks || [],
            fears: personality.fears || [],
            desires: personality.desires || [],
            customInstructions: ""
        },
        voice: {
            tone: voiceProfile.tone || "neutral",
            speechTempo: voiceProfile.speechTempo || "normal",
            vocabularyLevel: voiceProfile.vocabularyLevel
                ? String(voiceProfile.vocabularyLevel)
                : "normal",
            dialectNotes: voiceProfile.dialectNotes || []
        }
    };
}
