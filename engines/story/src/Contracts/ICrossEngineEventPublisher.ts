export interface ICrossEngineEventPublisher {
    publishNarrativeMilestone(event: { storyId: string; milestoneId: string; milestoneType: string; correlationId: string }): Promise<void>;
    publishSceneNarrativeUpdate(event: { storyId: string; sceneId: string; narrativeText: string; correlationId: string }): Promise<void>;
    publishRelationshipMilestone(event: { storyId: string; characterId: string; milestoneType: string; correlationId: string }): Promise<void>;
    publishWorldTemporalContext(event: { storyId: string; worldTime: number; locationId: string; correlationId: string }): Promise<void>;
    publishCharacterNarrative(event: { storyId: string; characterId: string; narrativeRole: string; correlationId: string }): Promise<void>;
    publishAssetSceneBoundary(event: { storyId: string; sceneId: string; assetType: string; assetId: string; correlationId: string }): Promise<void>;
}
