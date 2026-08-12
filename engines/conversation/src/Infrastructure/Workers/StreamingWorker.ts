import type { IStreamingWorker } from "../../Contracts/IStreamingWorker";

export class StreamingWorker implements IStreamingWorker {
    private readonly activeStreams = new Map<string, boolean>();
    private stopped = false;

    public getWorkerName(): string {
        return "ConversationStreamingWorker";
    }

    public async start(): Promise<void> {
        this.stopped = false;
    }

    public async stop(): Promise<void> {
        this.stopped = true;
        for (const key of this.activeStreams.keys()) {
            this.activeStreams.delete(key);
        }
    }

    public async startStream(
        conversationId: string,
        sessionId: string,
        chunks: AsyncIterable<{ delta: string; isLast: boolean; model?: string; usage?: unknown }>
    ): Promise<void> {
        const streamKey = `${conversationId}:${sessionId}`;
        this.activeStreams.set(streamKey, true);

        try {
            for await (const chunk of chunks) {
                if (this.stopped) {
                    break;
                }
                void chunk;
            }
        } finally {
            this.activeStreams.delete(streamKey);
        }
    }

    public async cancelStream(conversationId: string, sessionId: string): Promise<void> {
        const streamKey = `${conversationId}:${sessionId}`;
        this.activeStreams.delete(streamKey);
    }

    public async resumeStream(conversationId: string, sessionId: string, _fromSequence: number): Promise<void> {
        const streamKey = `${conversationId}:${sessionId}`;
        this.activeStreams.set(streamKey, true);
    }

    public isStreaming(conversationId: string, sessionId: string): boolean {
        const streamKey = `${conversationId}:${sessionId}`;
        return this.activeStreams.has(streamKey);
    }
}
