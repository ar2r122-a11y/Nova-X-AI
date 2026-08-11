export interface IStoryEngineOpenApi {
    getTimeline(storyId: string, requesterId: string, version?: string): Promise<{
        readonly storyId: string;
        readonly events: Array<{
            readonly eventType: string;
            readonly timestamp: number;
            readonly version: number;
        }>;
        readonly apiVersion: string;
    }>;
    getStoryState(storyId: string, requesterId: string, version?: string): Promise<{
        readonly storyId: string;
        readonly status: string;
        readonly state: string;
        readonly version: number;
        readonly apiVersion: string;
    }>;
    executeCommand(command: unknown, version: string, context: unknown): Promise<{
        readonly success: boolean;
        readonly result?: unknown;
        readonly error?: string;
        readonly correlationId: string;
    }>;
    executeQuery(query: unknown, version: string, context: unknown): Promise<{
        readonly success: boolean;
        readonly result?: unknown;
        readonly error?: string;
        readonly correlationId: string;
    }>;
    registerExtension(extension: unknown, context: unknown): Promise<void>;
}
