import { CharacterAggregate } from "../../Domain/Aggregates";

export class CharacterProfileDto {
    constructor(
        public readonly characterId: string,
        public readonly identity: object,
        public readonly profile: object,
        public readonly personality: object,
        public readonly appearance: object,
        public readonly voiceProfile: object,
        public readonly knowledge: object,
        public readonly state: object,
        public readonly capabilities: object,
        public readonly permissions: object
    ) {}

    static fromAggregate(aggregate: CharacterAggregate): CharacterProfileDto {
        const identity = aggregate.getIdentity();
        const profile = aggregate.getProfile();
        const personality = aggregate.getPersonality();
        const appearance = aggregate.getAppearance();
        const voiceProfile = aggregate.getVoiceProfile();
        const knowledge = aggregate.getKnowledge();
        const state = aggregate.getState();
        const capabilities = aggregate.getCapabilities();
        const permissions = aggregate.getPermissions();

        return new CharacterProfileDto(
            identity.id.getValue(),
            {
                id: identity.id.getValue(),
                name: identity.name,
                title: identity.title,
                origin: identity.origin,
                age: identity.age
            },
            {
                biography: profile.biography,
                tagline: profile.tagline,
                occupation: profile.occupation,
                publicNotes: profile.publicNotes
            },
            {
                traits: Array.from(personality.traits.values()).map((trait) => {
                    const t = trait.getValue();
                    return { name: t.name, score: t.score };
                }),
                moralAlignment: personality.moralAlignment.getValue(),
                quirks: personality.quirks.map((q) => q.getValue()),
                fears: personality.fears.map((f) => f.getValue()),
                desires: personality.desires.map((d) => d.getValue())
            },
            {
                visualDescription: appearance.visualDescription,
                avatarUri: appearance.avatarUri,
                clothingStyle: appearance.clothingStyle.getValue(),
                distinguishingMarks: appearance.distinguishingMarks
            },
            {
                tone: voiceProfile.tone.getValue(),
                pitch: voiceProfile.pitch,
                speechTempo: voiceProfile.speechTempo,
                vocabularyLevel: voiceProfile.vocabularyLevel.getValue(),
                dialectNotes: voiceProfile.dialectNotes.map((d) => d.getValue())
            },
            {
                knownFacts: knowledge.knownFacts.map((f) => f.getValue()),
                expertiseAreas: knowledge.expertiseAreas.map((a) => a.getValue()),
                blindSpots: knowledge.blindSpots.map((s) => s.getValue())
            },
            {
                currentLocation: state.currentLocation.getValue(),
                status: state.status.getValue(),
                energyLevel: state.energyLevel.getValue()
            },
            {
                allowedActions: capabilities.allowedActions.map((a) => a.getValue()),
                toolAccess: capabilities.toolAccess.getValue()
            },
            {
                privateBoundaries: permissions.privateBoundaries.map((b) => b.getValue()),
                accessControlList: permissions.accessControlList.map((t) => t.getValue())
            }
        );
    }
}
