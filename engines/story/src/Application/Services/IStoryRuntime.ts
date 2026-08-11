import { RuntimeState } from "../../Domain/ValueObjects/RuntimeState";

export interface IStoryRuntime {
    initialize(): Promise<void>;
    startStory(storyId: string): Promise<void>;
    stopStory(storyId: string): Promise<void>;
    pauseStory(storyId: string): Promise<void>;
    resumeStory(storyId: string): Promise<void>;
    shutdown(): Promise<void>;
    getActiveStories(): string[];
    getRuntimeState(): RuntimeState;
    recover(): Promise<void>;
}
