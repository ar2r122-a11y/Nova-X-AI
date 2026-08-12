export interface IStreamingWorker {
    startStream(
        conversationId: string,
        sessionId: string,
        chunks: AsyncIterable<{ delta: string; isLast: boolean; model?: string; usage?: unknown }>
    ): Promise<void>;
    cancelStream(conversationId: string, sessionId: string): Promise<void>;
    resumeStream(conversationId: string, sessionId: string, fromSequence: number): Promise<void>;
    isStreaming(conversationId: string, sessionId: string): boolean;
    getWorkerName(): string;
    start(): Promise<void>;
    stop(): Promise<void>;
}
