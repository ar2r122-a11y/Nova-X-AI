export interface ISceneExecutionPipeline {
    execute(storyId: string, sceneId: string, context: { correlationId: string; causationId?: string | null }): Promise<void>;
}
