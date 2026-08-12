import type { IEventBus } from "@nova-x-ai/core";
import type { IProjectionStore } from "@nova-x-ai/storage";
import { AudioChunk } from "../../Domain/ValueObjects/AudioChunk";
import { AudioChunkSequence } from "../../Domain/ValueObjects/AudioChunkSequence";

export class AudioProjectionUpdater {
    private running = false;

    constructor(private readonly eventBus: IEventBus, private readonly projectionStore: IProjectionStore) {}

    start(): void {
        if (this.running) return;
        this.running = true;
    }

    stop(): void {
        this.running = false;
    }

    updateChunk(streamId: string, chunk: AudioChunk): void {
        if (!this.running) return;
    }
}
