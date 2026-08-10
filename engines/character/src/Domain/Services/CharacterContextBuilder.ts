import { CharacterAggregate } from "../Aggregates";
import { CharacterProfile, CharacterPersonality, CharacterVoiceProfile } from "../Entities";
import { PersonalityTrait } from "../ValueObjects";
import { CharacterPromptContextDto } from "../../Application/DTO/CharacterPromptContextDto";

export class CharacterContextBuilder {
    public buildPromptContext(
        character: CharacterAggregate,
        memories?: string[],
        _tokenLimit: number = 4096
    ): CharacterPromptContextDto {
        const identity = character.getIdentity();
        const profile = character.getProfile();
        const personality = character.getPersonality();
        const voice = character.getVoiceProfile();
        const emotionalSnapshot = character.getEmotionalSnapshot();

        const identityBlock = this.buildIdentityBlock(identity, profile);
        const personalityBlock = this.buildPersonalityBlock(personality);
        const voiceBlock = this.buildVoiceBlock(voice);
        const memoryBlock = this.buildMemoryBlock(memories ?? []);

        const contextBlock = [identityBlock, personalityBlock, voiceBlock, memoryBlock].join("\n\n");
        const tokenCount = this.estimateTokens(contextBlock);

        return new CharacterPromptContextDto(
            identity.id.getValue(),
            {
                name: identity.name,
                title: identity.title,
                origin: identity.origin,
                age: identity.age
            },
            {
                traits: Array.from(personality.traits.values()).map((t) => {
                    const { name, score } = t.getValue();
                    return { name, score };
                }),
                moralAlignment: personality.moralAlignment.getValue(),
                quirks: personality.quirks.map((q) => q.getValue()),
                fears: personality.fears.map((f) => f.getValue()),
                desires: personality.desires.map((d) => d.getValue())
            },
            memories ?? [],
            {
                emotion: emotionalSnapshot.currentEmotion.getValue(),
                arousalLevel: emotionalSnapshot.arousalLevel
            },
            tokenCount,
            contextBlock
        );
    }

    private buildIdentityBlock(identity: { id: { getValue: () => string }; name: string; title: string; origin: string; age: string }, profile: CharacterProfile): string {
        return [
            `Name: ${identity.name}`,
            `Title: ${identity.title}`,
            `Origin: ${identity.origin}`,
            `Age: ${identity.age}`,
            `Tagline: ${profile.tagline}`,
            `Occupation: ${profile.occupation}`
        ].join("\n");
    }

    private buildPersonalityBlock(personality: CharacterPersonality): string {
        const traits = Array.from(personality.traits.values())
            .map((t: PersonalityTrait) => {
                const { name, score } = t.getValue();
                return `- ${name}: ${score.toFixed(2)}`;
            })
            .join("\n");

        return [
            `Moral Alignment: ${personality.moralAlignment.getValue()}`,
            `Traits:\n${traits}`
        ].join("\n");
    }

    private buildVoiceBlock(voice: CharacterVoiceProfile): string {
        const dialectNotes = voice.dialectNotes.map((d) => d.getValue()).join(", ");

        return [
            `Tone: ${voice.tone.getValue()}`,
            `Pitch: ${voice.pitch}`,
            `Tempo: ${voice.speechTempo}`,
            `Vocabulary Level: ${voice.vocabularyLevel.getValue()}`,
            `Dialect Notes: ${dialectNotes}`
        ].join("\n");
    }

    private buildMemoryBlock(memories: string[]): string {
        if (memories.length === 0) {
            return "Recent Memories: None";
        }

        return `Recent Memories:\n${memories.map((m, i) => `${i + 1}. ${m}`).join("\n")}`;
    }

    private estimateTokens(text: string): number {
        return Math.ceil(text.length / 4);
    }
}
