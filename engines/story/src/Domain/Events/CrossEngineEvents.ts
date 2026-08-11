import type { IDomainEvent } from "@nova-x-ai/core";

export class NarrativeMilestoneReachedEvent implements IDomainEvent {
    readonly eventType = "EVT_STORY_NarrativeMilestoneReached";
    readonly timestamp: number;
    readonly correlationId: string;
    readonly storyId: string;
    readonly milestoneId: string;
    readonly milestoneType: string;

    constructor(storyId: string, milestoneId: string, milestoneType: string, correlationId: string) {
        this.storyId = storyId;
        this.milestoneId = milestoneId;
        this.milestoneType = milestoneType;
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class SceneNarrativeUpdatedEvent implements IDomainEvent {
    readonly eventType = "EVT_STORY_SceneNarrativeUpdated";
    readonly timestamp: number;
    readonly correlationId: string;
    readonly storyId: string;
    readonly sceneId: string;
    readonly narrativeText: string;

    constructor(storyId: string, sceneId: string, narrativeText: string, correlationId: string) {
        this.storyId = storyId;
        this.sceneId = sceneId;
        this.narrativeText = narrativeText;
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class RelationshipMilestoneEvent implements IDomainEvent {
    readonly eventType = "EVT_STORY_RelationshipMilestone";
    readonly timestamp: number;
    readonly correlationId: string;
    readonly storyId: string;
    readonly characterId: string;
    readonly milestoneType: string;

    constructor(storyId: string, characterId: string, milestoneType: string, correlationId: string) {
        this.storyId = storyId;
        this.characterId = characterId;
        this.milestoneType = milestoneType;
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class WorldTemporalContextEvent implements IDomainEvent {
    readonly eventType = "EVT_STORY_WorldTemporalContext";
    readonly timestamp: number;
    readonly correlationId: string;
    readonly storyId: string;
    readonly worldTime: number;
    readonly locationId: string;

    constructor(storyId: string, worldTime: number, locationId: string, correlationId: string) {
        this.storyId = storyId;
        this.worldTime = worldTime;
        this.locationId = locationId;
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class CharacterNarrativeEvent implements IDomainEvent {
    readonly eventType = "EVT_STORY_CharacterNarrative";
    readonly timestamp: number;
    readonly correlationId: string;
    readonly storyId: string;
    readonly characterId: string;
    readonly narrativeRole: string;

    constructor(storyId: string, characterId: string, narrativeRole: string, correlationId: string) {
        this.storyId = storyId;
        this.characterId = characterId;
        this.narrativeRole = narrativeRole;
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class AssetSceneBoundaryEvent implements IDomainEvent {
    readonly eventType = "EVT_STORY_AssetSceneBoundary";
    readonly timestamp: number;
    readonly correlationId: string;
    readonly storyId: string;
    readonly sceneId: string;
    readonly assetType: string;
    readonly assetId: string;

    constructor(storyId: string, sceneId: string, assetType: string, assetId: string, correlationId: string) {
        this.storyId = storyId;
        this.sceneId = sceneId;
        this.assetType = assetType;
        this.assetId = assetId;
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}
