
import { IDomainEvent } from "@nova-x-ai/core";
import {
    CharacterIdentity,
    CharacterProfile,
    CharacterPersonality,
    CharacterAppearance,
    CharacterVoiceProfile,
    CharacterKnowledge,
    CharacterGoals,
    CharacterRoutine,
    CharacterSkills,
    CharacterInventory,
    CharacterRelationships,
    CharacterEmotionalSnapshot,
    CharacterStatistics,
    CharacterCapabilities,
    CharacterPermissions,
    CharacterState
} from "../Entities";
import {
    CharacterId,
    CharacterStage,
    PersonalityTrait,
    SkillProficiency,
    RelationshipMetric,
    EmotionalStateRef,
    BoundaryRule,
    WorldCoordinate,
    CharacterStatus,
    EnergyLevel,
    MoralAlignment,
    AppearanceStyle,
    VoiceTone,
    VocabularyLevel,
    DialectNote,
    Quirk,
    Fear,
    Desire,
    KnowledgeFact,
    KnowledgeArea,
    BlindSpot,
    GoalStatus,
    RoutineSchedule,
    InventoryItemStatus
} from "../ValueObjects";
import {
    CharacterStateChangedEvent,
    CharacterTraitsUpdatedEvent,
    CharacterProfileUpdatedEvent,
    CharacterRoutineCompletedEvent,
    CharacterEmotionalStateUpdatedEvent,
    CharacterContextAssembledEvent,
    CharacterEvolutionTriggeredEvent,
    CharacterBoundaryViolatedEvent
} from "../Events";
import { CharacterInvariantsValidator } from "../Services/CharacterInvariantsValidator";

export class CharacterAggregate {
    private readonly identity: CharacterIdentity;
    private profile: CharacterProfile;
    private personality: CharacterPersonality;
    private appearance: CharacterAppearance;
    private voiceProfile: CharacterVoiceProfile;
    private knowledge: CharacterKnowledge;
    private goals: CharacterGoals;
    private routine: CharacterRoutine;
    private skills: CharacterSkills;
    private inventory: CharacterInventory;
    private relationships: CharacterRelationships;
    private emotionalSnapshot: CharacterEmotionalSnapshot;
    private statistics: CharacterStatistics;
    private capabilities: CharacterCapabilities;
    private permissions: CharacterPermissions;
    private state: CharacterState;
    private readonly uncommittedEvents: IDomainEvent[] = [];
    private evolutionStage: CharacterStage;

    constructor(
        identity: CharacterIdentity,
        profile: CharacterProfile,
        personality: CharacterPersonality,
        appearance: CharacterAppearance,
        voiceProfile: CharacterVoiceProfile,
        knowledge: CharacterKnowledge,
        goals: CharacterGoals,
        routine: CharacterRoutine,
        skills: CharacterSkills,
        inventory: CharacterInventory,
        relationships: CharacterRelationships,
        emotionalSnapshot: CharacterEmotionalSnapshot,
        statistics: CharacterStatistics,
        capabilities: CharacterCapabilities,
        permissions: CharacterPermissions,
        state: CharacterState
    ) {
        this.identity = identity;
        this.profile = profile;
        this.personality = personality;
        this.appearance = appearance;
        this.voiceProfile = voiceProfile;
        this.knowledge = knowledge;
        this.goals = goals;
        this.routine = routine;
        this.skills = skills;
        this.inventory = inventory;
        this.relationships = relationships;
        this.emotionalSnapshot = emotionalSnapshot;
        this.statistics = statistics;
        this.capabilities = capabilities;
        this.permissions = permissions;
        this.state = state;
        this.evolutionStage = statistics.evolutionStage;
    }

    public getId(): CharacterId {
        return this.identity.id;
    }

    public getName(): string {
        return this.identity.name;
    }

    public updateState(patch: Partial<CharacterState>): void {
        const previousStatus = this.state.status;

        if (patch.status) {
            const newStatusValue = typeof patch.status === "string" ? patch.status : patch.status.getValue();
            CharacterInvariantsValidator.validateStateTransition(this.state.status, newStatusValue);
            this.state = {
                currentLocation: this.state.currentLocation,
                status: CharacterStatus.create(newStatusValue),
                energyLevel: this.state.energyLevel
            };
        }
        if (patch.currentLocation) {
            this.state = {
                currentLocation: patch.currentLocation,
                status: this.state.status,
                energyLevel: this.state.energyLevel
            };
        }
        if (patch.energyLevel) {
            this.state = {
                currentLocation: this.state.currentLocation,
                status: this.state.status,
                energyLevel: patch.energyLevel
            };
        }

        if (patch.status) {
            const newStatusValue = typeof patch.status === "string" ? patch.status : patch.status.getValue();
            const previousVal = typeof previousStatus === "string" ? previousStatus : previousStatus.getValue();
            if (newStatusValue !== previousVal) {
                this.uncommittedEvents.push(
                    new CharacterStateChangedEvent(
                        this.identity.id,
                        previousVal,
                        newStatusValue,
                        Date.now(),
                        ""
                    )
                );
            }
        }
    }

    public updateTraits(traits: Map<string, PersonalityTrait>): void {
        CharacterInvariantsValidator.validateTraitSchema(traits);

        const updatedTraitNames: string[] = [];
        traits.forEach((_, name) => updatedTraitNames.push(name));

        this.personality = {
            ...this.personality,
            traits: new Map(traits)
        };

        this.uncommittedEvents.push(
            new CharacterTraitsUpdatedEvent(this.identity.id, updatedTraitNames, "")
        );
    }

    public updateProfile(profile: Partial<CharacterProfile>): void {
        if (profile.biography !== undefined && profile.biography.length > 5000) {
            throw new Error("Biography exceeds maximum length of 5000 characters.");
        }
        if (profile.tagline !== undefined && profile.tagline.length > 200) {
            throw new Error("Tagline exceeds maximum length of 200 characters.");
        }
        if (profile.occupation !== undefined && profile.occupation.length > 100) {
            throw new Error("Occupation exceeds maximum length of 100 characters.");
        }
        if (profile.publicNotes !== undefined && profile.publicNotes.length > 1000) {
            throw new Error("PublicNotes exceeds maximum length of 1000 characters.");
        }

        const newProfile = { ...this.profile, ...profile } as CharacterProfile;
        this.profile = newProfile;

        const updatedFields: string[] = [];
        Object.keys(profile).forEach((key) => {
            updatedFields.push(key);
        });

        this.uncommittedEvents.push(
            new CharacterProfileUpdatedEvent(this.identity.id, updatedFields, "")
        );
    }

    public completeRoutineActivity(activity: string): void {
        this.uncommittedEvents.push(
            new CharacterRoutineCompletedEvent(this.identity.id, activity, Date.now(), "")
        );
    }

    public updateEmotionalState(emotion: EmotionalStateRef, arousal: number): void {
        if (arousal < 0.0 || arousal > 1.0) {
            throw new Error("Arousal level must be between 0.0 and 1.0.");
        }

        this.emotionalSnapshot = {
            currentEmotion: emotion,
            arousalLevel: arousal
        };

        this.uncommittedEvents.push(
            new CharacterEmotionalStateUpdatedEvent(this.identity.id, emotion.getValue(), arousal, "")
        );
    }

    public evolve(): void {
        const currentStage = this.evolutionStage.getValue();
        const stages = ["initial", "developing", "mature", "evolved"];
        const currentIndex = stages.indexOf(currentStage);

        if (currentIndex >= stages.length - 1) {
            throw new Error("Character is already at maximum evolution stage.");
        }

        const nextStage = CharacterStage.create(stages[currentIndex + 1]);
        const previousStage = this.evolutionStage;

        this.evolutionStage = nextStage;

        this.statistics = {
            interactionCount: this.statistics.interactionCount,
            evolutionStage: nextStage
        };

        this.uncommittedEvents.push(
            new CharacterEvolutionTriggeredEvent(this.identity.id, previousStage.getValue(), nextStage.getValue(), "")
        );
    }

    public assembleContext(_tokenLimit: number): string {
        const contextParts: string[] = [];

        contextParts.push(`Identity: ${this.identity.name} (${this.identity.title})`);
        contextParts.push(`Origin: ${this.identity.origin}`);
        contextParts.push(`Status: ${this.state.status.getValue()}`);
        contextParts.push(`Biography: ${this.profile.biography}`);

        const traits = Array.from(this.personality.traits.values())
            .map((t) => `${t.getValue().name}:${t.getValue().score}`)
            .join(", ");
        if (traits) {
            contextParts.push(`Personality Traits: ${traits}`);
        }

        const context = contextParts.join("\n");

        this.uncommittedEvents.push(
            new CharacterContextAssembledEvent(this.identity.id, context.length, "")
        );

        return context;
    }

    public checkBoundary(requesterId: string, rule: BoundaryRule): boolean {
        const isViolated = this.permissions.privateBoundaries.some(
            (boundary) => boundary.getValue() === rule.getValue()
        );

        if (isViolated) {
            this.uncommittedEvents.push(
                new CharacterBoundaryViolatedEvent(this.identity.id, rule.getValue(), requesterId, "")
            );
        }

        return isViolated;
    }

    public getUncommittedEvents(): readonly IDomainEvent[] {
        return this.uncommittedEvents;
    }

    public commitEvents(): void {
        this.uncommittedEvents.length = 0;
    }

    public getSnapshot(): object {
        return {
            identity: this.identity,
            profile: this.profile,
            personality: {
                moralAlignment: this.personality.moralAlignment.getValue(),
                quirks: this.personality.quirks.map((q) => q.getValue()),
                fears: this.personality.fears.map((f) => f.getValue()),
                desires: this.personality.desires.map((d) => d.getValue()),
                traits: Array.from(this.personality.traits.values()).map((t) => t.getValue())
            },
            appearance: {
                visualDescription: this.appearance.visualDescription,
                avatarUri: this.appearance.avatarUri,
                clothingStyle: this.appearance.clothingStyle.getValue(),
                distinguishingMarks: this.appearance.distinguishingMarks
            },
            voiceProfile: {
                tone: this.voiceProfile.tone.getValue(),
                pitch: this.voiceProfile.pitch,
                speechTempo: this.voiceProfile.speechTempo,
                vocabularyLevel: this.voiceProfile.vocabularyLevel.getValue(),
                dialectNotes: this.voiceProfile.dialectNotes.map((d) => d.getValue())
            },
            knowledge: {
                knownFacts: this.knowledge.knownFacts.map((f) => f.getValue()),
                expertiseAreas: this.knowledge.expertiseAreas.map((a) => a.getValue()),
                blindSpots: this.knowledge.blindSpots.map((s) => s.getValue())
            },
            goals: {
                activeGoals: this.goals.activeGoals.map((g) => ({
                    description: g.description,
                    status: g.status.getValue(),
                    progress: g.progress
                })),
                motivations: this.goals.motivations
            },
            routine: {
                schedule: this.routine.schedule.map((s) => ({
                    timeBlock: s.timeBlock,
                    activity: s.activity,
                    worldCoordinate: s.worldCoordinate
                })),
                fallbackBehavior: this.routine.fallbackBehavior
            },
            skills: {
                skillMatrix: Array.from(this.skills.skillMatrix.values()).map((s) => s.getValue())
            },
            inventory: {
                items: this.inventory.items.map((i) => ({
                    id: i.id,
                    name: i.name,
                    status: i.status.getValue(),
                    description: i.description
                }))
            },
            relationships: {
                affinityMap: Array.from(this.relationships.affinityMap.values()).map((r) => r.getValue())
            },
            emotionalSnapshot: {
                currentEmotion: this.emotionalSnapshot.currentEmotion.getValue(),
                arousalLevel: this.emotionalSnapshot.arousalLevel
            },
            statistics: {
                interactionCount: this.statistics.interactionCount
            },
            capabilities: {
                allowedActions: this.capabilities.allowedActions,
                toolAccess: this.capabilities.toolAccess.getValue()
            },
            permissions: {
                accessControlList: this.permissions.accessControlList,
                privateBoundaries: this.permissions.privateBoundaries
            },
            state: {
                currentLocation: this.state.currentLocation.getValue(),
                status: this.state.status.getValue(),
                energyLevel: this.state.energyLevel.getValue()
            },
            evolutionStage: this.evolutionStage.getValue()
        };
    }

    public restoreFromSnapshot(snapshot: object): void {
        const snap = snapshot as Record<string, unknown>;

        (this as any).identity = {
            id: CharacterId.fromString((snap.identity as any).id.getValue ? (snap.identity as any).id.getValue() : (snap.identity as any).id),
            name: (snap.identity as any).name,
            title: (snap.identity as any).title,
            origin: (snap.identity as any).origin,
            age: (snap.identity as any).age
        };
        this.profile = snap.profile as any;
        this.personality = {
            moralAlignment: MoralAlignment.create((snap.personality as any).moralAlignment),
            quirks: (snap.personality as any).quirks.map((q: string) => Quirk.create(q)),
            fears: (snap.personality as any).fears.map((f: string) => Fear.create(f)),
            desires: (snap.personality as any).desires.map((d: string) => Desire.create(d)),
            traits: new Map((snap.personality as any).traits.map((t: any) => [t.name, PersonalityTrait.create(t.name, t.score)]))
        };
        this.appearance = {
            visualDescription: (snap.appearance as any).visualDescription,
            avatarUri: (snap.appearance as any).avatarUri,
            clothingStyle: AppearanceStyle.create((snap.appearance as any).clothingStyle),
            distinguishingMarks: (snap.appearance as any).distinguishingMarks
        };
        this.voiceProfile = {
            tone: VoiceTone.create((snap.voiceProfile as any).tone),
            pitch: (snap.voiceProfile as any).pitch,
            speechTempo: (snap.voiceProfile as any).speechTempo,
            vocabularyLevel: VocabularyLevel.create((snap.voiceProfile as any).vocabularyLevel),
            dialectNotes: (snap.voiceProfile as any).dialectNotes.map((d: string) => DialectNote.create(d))
        };
        this.knowledge = {
            knownFacts: (snap.knowledge as any).knownFacts.map((f: string) => KnowledgeFact.create(f)),
            expertiseAreas: (snap.knowledge as any).expertiseAreas.map((a: string) => KnowledgeArea.create(a)),
            blindSpots: (snap.knowledge as any).blindSpots.map((s: string) => BlindSpot.create(s))
        };
        this.goals = {
            activeGoals: (snap.goals as any).activeGoals.map((g: any) => ({
                description: g.description,
                status: GoalStatus.create(g.status),
                progress: g.progress
            })),
            motivations: (snap.goals as any).motivations
        };
        this.routine = {
            schedule: (snap.routine as any).schedule.map((s: any) => RoutineSchedule.create(s.timeBlock, s.activity, s.worldCoordinate)),
            fallbackBehavior: (snap.routine as any).fallbackBehavior
        };
        this.skills = {
            skillMatrix: new Map((snap.skills as any).skillMatrix.map((s: any) => [s.skillName, SkillProficiency.create(s.skillName, s.level)]))
        };
        this.inventory = {
            items: (snap.inventory as any).items.map((i: any) => ({
                id: i.id,
                name: i.name,
                status: InventoryItemStatus.create(i.status),
                description: i.description
            }))
        };
        this.relationships = {
            affinityMap: new Map((snap.relationships as any).affinityMap.map((r: any) => [r.targetId, RelationshipMetric.create(r.targetId, r.trust, r.affection, r.familiarity)]))
        };
        this.emotionalSnapshot = {
            currentEmotion: EmotionalStateRef.create((snap.emotionalSnapshot as any).currentEmotion),
            arousalLevel: (snap.emotionalSnapshot as any).arousalLevel
        };
        this.statistics = {
            interactionCount: (snap.statistics as any).interactionCount,
            evolutionStage: CharacterStage.create(snap.evolutionStage as string)
        };
        this.capabilities = {
            allowedActions: (snap.capabilities as any).allowedActions,
            toolAccess: (snap.capabilities as any).toolAccess
        };
        this.permissions = {
            accessControlList: (snap.permissions as any).accessControlList,
            privateBoundaries: (snap.permissions as any).privateBoundaries
        };
        this.state = {
            currentLocation: WorldCoordinate.create((snap.state as any).currentLocation),
            status: CharacterStatus.create((snap.state as any).status),
            energyLevel: EnergyLevel.create((snap.state as any).energyLevel)
        };
        this.evolutionStage = CharacterStage.create(snap.evolutionStage as string);
    }

    public getState(): CharacterState {
        return this.state;
    }

    public getIdentity(): CharacterIdentity {
        return this.identity;
    }

    public getProfile(): CharacterProfile {
        return this.profile;
    }

    public getPersonality(): CharacterPersonality {
        return this.personality;
    }

    public getAppearance(): CharacterAppearance {
        return this.appearance;
    }

    public getVoiceProfile(): CharacterVoiceProfile {
        return this.voiceProfile;
    }

    public getKnowledge(): CharacterKnowledge {
        return this.knowledge;
    }

    public getGoals(): CharacterGoals {
        return this.goals;
    }

    public getRoutine(): CharacterRoutine {
        return this.routine;
    }

    public getSkills(): CharacterSkills {
        return this.skills;
    }

    public getInventory(): CharacterInventory {
        return this.inventory;
    }

    public getRelationships(): CharacterRelationships {
        return this.relationships;
    }

    public getEmotionalSnapshot(): CharacterEmotionalSnapshot {
        return this.emotionalSnapshot;
    }

    public getStatistics(): CharacterStatistics {
        return this.statistics;
    }

    public getCapabilities(): CharacterCapabilities {
        return this.capabilities;
    }

    public getPermissions(): CharacterPermissions {
        return this.permissions;
    }

    public getEvolutionStage(): CharacterStage {
        return this.evolutionStage;
    }
}
