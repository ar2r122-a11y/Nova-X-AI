
import { CharacterId } from "../ValueObjects";
import { PersonalityTrait, MoralAlignment, Quirk, Fear, Desire } from "../ValueObjects";
import { AppearanceStyle } from "../ValueObjects";
import { VoiceTone, VocabularyLevel, DialectNote } from "../ValueObjects";
import { KnowledgeFact, KnowledgeArea, BlindSpot } from "../ValueObjects";
import { GoalStatus } from "../ValueObjects";
import { RoutineSchedule } from "../ValueObjects";
import { SkillProficiency } from "../ValueObjects";
import { InventoryItemStatus } from "../ValueObjects";
import { RelationshipMetric } from "../ValueObjects";
import { EmotionalStateRef } from "../ValueObjects";
import { CharacterStage } from "../ValueObjects";
import { CapabilityAction, ToolAccessLevel } from "../ValueObjects";
import { BoundaryRule, AccessControlToken } from "../ValueObjects";
import { WorldCoordinate, CharacterStatus, EnergyLevel } from "../ValueObjects";

export interface CharacterIdentity {
    readonly id: CharacterId;
    readonly name: string;
    readonly title: string;
    readonly origin: string;
    readonly age: string;
}

export interface CharacterProfile {
    readonly biography: string;
    readonly tagline: string;
    readonly occupation: string;
    readonly publicNotes: string;
}

export interface CharacterPersonality {
    readonly traits: Map<string, PersonalityTrait>;
    readonly moralAlignment: MoralAlignment;
    readonly quirks: Quirk[];
    readonly fears: Fear[];
    readonly desires: Desire[];
}

export interface CharacterAppearance {
    readonly visualDescription: string;
    readonly avatarUri: string;
    readonly clothingStyle: AppearanceStyle;
    readonly distinguishingMarks: string;
}

export interface CharacterVoiceProfile {
    readonly tone: VoiceTone;
    readonly pitch: number;
    readonly speechTempo: string;
    readonly vocabularyLevel: VocabularyLevel;
    readonly dialectNotes: DialectNote[];
}

export interface CharacterKnowledge {
    readonly knownFacts: KnowledgeFact[];
    readonly expertiseAreas: KnowledgeArea[];
    readonly blindSpots: BlindSpot[];
}

export interface CharacterGoals {
    readonly activeGoals: Array<{ description: string; status: GoalStatus; progress: number }>;
    readonly motivations: string[];
}

export interface CharacterRoutine {
    readonly schedule: RoutineSchedule[];
    readonly fallbackBehavior: string;
}

export interface CharacterSkills {
    readonly skillMatrix: Map<string, SkillProficiency>;
}

export interface CharacterInventory {
    readonly items: Array<{ id: string; name: string; status: InventoryItemStatus; description?: string }>;
}

export interface CharacterRelationships {
    readonly affinityMap: Map<string, RelationshipMetric>;
}

export interface CharacterEmotionalSnapshot {
    readonly currentEmotion: EmotionalStateRef;
    readonly arousalLevel: number;
}

export interface CharacterStatistics {
    readonly interactionCount: number;
    readonly evolutionStage: CharacterStage;
}

export interface CharacterCapabilities {
    readonly allowedActions: CapabilityAction[];
    readonly toolAccess: ToolAccessLevel;
}

export interface CharacterPermissions {
    readonly privateBoundaries: BoundaryRule[];
    readonly accessControlList: AccessControlToken[];
}

export interface CharacterState {
    readonly currentLocation: WorldCoordinate;
    readonly status: CharacterStatus;
    readonly energyLevel: EnergyLevel;
}
