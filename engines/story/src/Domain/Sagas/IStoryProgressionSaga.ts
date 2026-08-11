export interface IStoryProgressionSaga {
    initialize(storyId: string): Promise<void>;
    handleEvent(event: { eventType: string; correlationId: string; payload: Record<string, unknown> }): Promise<void>;
    compensate(storyId: string, targetVersion: number): Promise<void>;
    getState(): string;
}
