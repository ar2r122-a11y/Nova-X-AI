import type { IImageStreamingWorker } from "../../Contracts/IImageStreamingWorker";
import type { IImageWorker } from "../../Contracts/IImageWorker";

interface StreamState {
    active: boolean;
    progress: number;
    chunksReceived: number;
}

export class ImageStreamingWorker implements IImageStreamingWorker, IImageWorker {
    private readonly streams: Map<string, StreamState> = new Map();
    private running = false;

    async start(): Promise<void> {
        this.running = true;
    }

    async stop(): Promise<void> {
        this.running = false;
        this.streams.clear();
    }

    isRunning(): boolean {
        return this.running;
    }

    getWorkerName(): string {
        return "ImageStreamingWorker";
    }

    async startStream(imageId: string, _request: { prompt: string; width: number; height: number }): Promise<void> {
        this.streams.set(imageId, {
            active: true,
            progress: 0,
            chunksReceived: 0
        });
        console.log(`[ImageStreamingWorker] Started streaming for image ${imageId}`);
    }

    async stopStream(imageId: string): Promise<void> {
        this.streams.delete(imageId);
        console.log(`[ImageStreamingWorker] Stopped streaming for image ${imageId}`);
    }

    isStreaming(imageId: string): boolean {
        const state = this.streams.get(imageId);
        return state?.active ?? false;
    }

    getStreamStatus(imageId: string): { status: string; progress: number; chunksReceived: number } {
        const state = this.streams.get(imageId);
        if (!state) {
            return { status: "inactive", progress: 0, chunksReceived: 0 };
        }
        return {
            status: state.active ? "active" : "completed",
            progress: state.progress,
            chunksReceived: state.chunksReceived
        };
    }

    updateProgress(imageId: string, progress: number): void {
        const state = this.streams.get(imageId);
        if (state) {
            state.progress = Math.min(1, Math.max(0, progress));
        }
    }

    incrementChunks(imageId: string): void {
        const state = this.streams.get(imageId);
        if (state) {
            state.chunksReceived += 1;
        }
    }
}
