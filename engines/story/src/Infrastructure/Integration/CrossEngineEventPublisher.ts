import type { IEventBus } from "@nova-x-ai/core";
import type { ICrossEngineEventPublisher } from "../../Contracts/ICrossEngineEventPublisher";
import { NarrativeMilestoneReachedEvent } from "../../Domain/Events/CrossEngineEvents";

export class CrossEngineEventPublisher implements ICrossEngineEventPublisher {
    constructor(private readonly eventBus: IEventBus) {}

    async publishNarrativeMilestone(event: { storyId: string; milestoneId: string; milestoneType: string; correlationId: string }): Promise<void> {
        await this.eventBus.publish(new NarrativeMilestoneReachedEvent(event.storyId, event.milestoneId, event.milestoneType, event.correlationId));
    }

    async publishSceneNarrativeUpdate(event: { storyId: string; sceneId: string; narrativeText: string; correlationId: string }): Promise<void> {
        await this.eventBus.publish({
            eventType: "EVT_STORY_SceneNarrativeUpdated",
            timestamp: Date.now(),
            correlationId: event.correlationId,
            payload: {
                storyId: event.storyId,
                sceneId: event.sceneId,
                narrativeText: event.narrativeText,
            },
        });
    }

    async publishRelationshipMilestone(event: { storyId: string; characterId: string; milestoneType: string; correlationId: string }): Promise<void> {
        await this.eventBus.publish({
            eventType: "EVT_STORY_RelationshipMilestone",
            timestamp: Date.now(),
            correlationId: event.correlationId,
            payload: {
                storyId: event.storyId,
                characterId: event.characterId,
                milestoneType: event.milestoneType,
            },
        });
    }

    async publishWorldTemporalContext(event: { storyId: string; worldTime: number; locationId: string; correlationId: string }): Promise<void> {
        await this.eventBus.publish({
            eventType: "EVT_STORY_WorldTemporalContext",
            timestamp: Date.now(),
            correlationId: event.correlationId,
            payload: {
                storyId: event.storyId,
                worldTime: event.worldTime,
                locationId: event.locationId,
            },
        });
    }

    async publishCharacterNarrative(event: { storyId: string; characterId: string; narrativeRole: string; correlationId: string }): Promise<void> {
        await this.eventBus.publish({
            eventType: "EVT_STORY_CharacterNarrative",
            timestamp: Date.now(),
            correlationId: event.correlationId,
            payload: {
                storyId: event.storyId,
                characterId: event.characterId,
                narrativeRole: event.narrativeRole,
            },
        });
    }

    async publishAssetSceneBoundary(event: { storyId: string; sceneId: string; assetType: string; assetId: string; correlationId: string }): Promise<void> {
        await this.eventBus.publish({
            eventType: "EVT_STORY_AssetSceneBoundary",
            timestamp: Date.now(),
            correlationId: event.correlationId,
            payload: {
                storyId: event.storyId,
                sceneId: event.sceneId,
                assetType: event.assetType,
                assetId: event.assetId,
            },
        });
    }
}
