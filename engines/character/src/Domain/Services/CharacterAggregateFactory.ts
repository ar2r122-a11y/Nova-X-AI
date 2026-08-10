
import { CharacterAggregate } from "../Aggregates";
import { CharacterId } from "../ValueObjects";
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
    CharacterStage,
    PersonalityTrait,
    MoralAlignment,
    Quirk,
    Fear,
    Desire,
    AppearanceStyle,
    VoiceTone,
    VocabularyLevel,
    DialectNote,
    KnowledgeFact,
    KnowledgeArea,
    BlindSpot,
    GoalStatus,
    RoutineSchedule,
    SkillProficiency,
    InventoryItemStatus,
    RelationshipMetric,
    EmotionalStateRef,
    CapabilityAction,
    ToolAccessLevel,
    BoundaryRule,
    AccessControlToken,
    WorldCoordinate,
    EnergyLevel,
    CharacterStatus
} from "../ValueObjects";

export interface CharacterTemplate {
    name: string;
    title: string;
    origin: string;
    age: string;
    biography: string;
    tagline: string;
    occupation: string;
    publicNotes: string;
    visualDescription: string;
    avatarUri: string;
    clothingStyle: string;
    distinguishingMarks: string;
    tone: string;
    pitch: number;
    speechTempo: string;
    vocabularyLevel: number;
    dialectNotes: string[];
    knownFacts: string[];
    expertiseAreas: string[];
    blindSpots: string[];
    activeGoals: Array<{ description: string; status: string; progress: number }>;
    motivations: string[];
    schedule: Array<{ timeBlock: string; activity: string; worldCoordinate?: string }>;
    fallbackBehavior: string;
    skillMatrix: Array<{ skillName: string; level: number }>;
    inventoryItems: Array<{ id: string; name: string; status: string; description?: string }>;
    affinityMap: Array<{ targetId: string; trust: number; affection: number; familiarity: number }>;
    currentEmotion: string;
    arousalLevel: number;
    interactionCount: number;
    evolutionStage: string;
    allowedActions: string[];
    toolAccess: string;
    privateBoundaries: string[];
    accessControlList: string[];
    currentLocation: string;
    characterStatus: string;
    energyLevel: number;
    moralAlignment: string;
    quirks: string[];
    fears: string[];
    desires: string[];
    traits: Array<{ name: string; score: number }>;
}

export class CharacterAggregateFactory {
    public static createFromTemplate(template: CharacterTemplate): CharacterAggregate {
        const id = CharacterId.create();

        const identity: CharacterIdentity = {
            id,
            name: template.name,
            title: template.title,
            origin: template.origin,
            age: template.age
        };

        const profile: CharacterProfile = {
            biography: template.biography,
            tagline: template.tagline,
            occupation: template.occupation,
            publicNotes: template.publicNotes
        };

        const traits = new Map<string, PersonalityTrait>();
        if (template.traits && Array.isArray(template.traits)) {
            template.traits.forEach((t: any) => {
                if (t && t.name !== undefined) {
                    traits.set(t.name, PersonalityTrait.create(t.name, t.score));
                }
            });
        }

        const personality: CharacterPersonality = {
            traits,
            moralAlignment: MoralAlignment.create(template.moralAlignment),
            quirks: template.quirks.map((q) => Quirk.create(q)),
            fears: template.fears.map((f) => Fear.create(f)),
            desires: template.desires.map((d) => Desire.create(d))
        };

        const appearance: CharacterAppearance = {
            visualDescription: template.visualDescription,
            avatarUri: template.avatarUri,
            clothingStyle: AppearanceStyle.create(template.clothingStyle),
            distinguishingMarks: template.distinguishingMarks
        };

        const voiceProfile: CharacterVoiceProfile = {
            tone: VoiceTone.create(template.tone),
            pitch: template.pitch,
            speechTempo: template.speechTempo,
            vocabularyLevel: VocabularyLevel.create(template.vocabularyLevel),
            dialectNotes: template.dialectNotes.map((d) => DialectNote.create(d))
        };

        const knowledge: CharacterKnowledge = {
            knownFacts: template.knownFacts.map((f) => KnowledgeFact.create(f)),
            expertiseAreas: template.expertiseAreas.map((a) => KnowledgeArea.create(a)),
            blindSpots: template.blindSpots.map((s) => BlindSpot.create(s))
        };

        const goals: CharacterGoals = {
            activeGoals: template.activeGoals.map((g) => ({
                description: g.description,
                status: GoalStatus.create(g.status),
                progress: g.progress
            })),
            motivations: template.motivations
        };

        const routine: CharacterRoutine = {
            schedule: template.schedule.map((s) => RoutineSchedule.create(s.timeBlock, s.activity, s.worldCoordinate)),
            fallbackBehavior: template.fallbackBehavior
        };

        const skillMatrix = new Map<string, SkillProficiency>();
        template.skillMatrix.forEach((s) => {
            skillMatrix.set(s.skillName, SkillProficiency.create(s.skillName, s.level));
        });

        const skills: CharacterSkills = {
            skillMatrix
        };

        const inventory: CharacterInventory = {
            items: template.inventoryItems.map((i) => ({
                id: i.id,
                name: i.name,
                status: InventoryItemStatus.create(i.status),
                description: i.description
            }))
        };

        const affinityMap = new Map<string, RelationshipMetric>();
        template.affinityMap.forEach((r) => {
            affinityMap.set(r.targetId, RelationshipMetric.create(r.targetId, r.trust, r.affection, r.familiarity));
        });

        const relationships: CharacterRelationships = {
            affinityMap
        };

        const emotionalSnapshot: CharacterEmotionalSnapshot = {
            currentEmotion: EmotionalStateRef.create(template.currentEmotion),
            arousalLevel: template.arousalLevel
        };

        const statistics: CharacterStatistics = {
            interactionCount: template.interactionCount,
            evolutionStage: CharacterStage.create(template.evolutionStage)
        };

        const capabilities: CharacterCapabilities = {
            allowedActions: template.allowedActions.map((a) => CapabilityAction.create(a)),
            toolAccess: ToolAccessLevel.create(template.toolAccess)
        };

        const permissions: CharacterPermissions = {
            privateBoundaries: template.privateBoundaries.map((b) => BoundaryRule.create(b)),
            accessControlList: template.accessControlList.map((t) => AccessControlToken.create(t))
        };

        const state: CharacterState = {
            currentLocation: WorldCoordinate.create(template.currentLocation),
            status: CharacterStatus.create(template.characterStatus),
            energyLevel: EnergyLevel.create(template.energyLevel)
        };

        return new CharacterAggregate(
            identity,
            profile,
            personality,
            appearance,
            voiceProfile,
            knowledge,
            goals,
            routine,
            skills,
            inventory,
            relationships,
            emotionalSnapshot,
            statistics,
            capabilities,
            permissions,
            state
        );
    }
}
