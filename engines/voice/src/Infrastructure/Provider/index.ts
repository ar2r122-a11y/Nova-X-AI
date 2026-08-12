import { AudioChunk } from "../../Domain/ValueObjects/AudioChunk";
import { AudioChunkSequence } from "../../Domain/ValueObjects/AudioChunkSequence";
import { AudioCodec } from "../../Domain/ValueObjects/AudioCodec";
import { VoiceProviderId } from "../../Domain/ValueObjects/VoiceProviderId";
import { ProviderCostMetadata } from "../../Domain/ValueObjects/ProviderCostMetadata";

export class ProviderInvocationQueue {
    private readonly queue: Array<{
        providerId: VoiceProviderId;
        chunks: AudioChunk[];
        cost: ProviderCostMetadata;
    }> = [];

    enqueue(providerId: VoiceProviderId, chunks: AudioChunk[], cost: ProviderCostMetadata): void {
        this.queue.push({ providerId, chunks, cost });
    }

    dequeue(): { providerId: VoiceProviderId; chunks: AudioChunk[]; cost: ProviderCostMetadata } | undefined {
        return this.queue.shift();
    }

    size(): number {
        return this.queue.length;
    }

    clear(): void {
        this.queue.length = 0;
    }
}

export class AudioResultCollector {
    private readonly results: Map<string, { success: boolean; chunks: AudioChunk[]; error?: string }> = new Map();

    recordResult(requestId: string, success: boolean, chunks: AudioChunk[], error?: string): void {
        this.results.set(requestId, { success, chunks, error });
    }

    getResult(requestId: string): { success: boolean; chunks: AudioChunk[]; error?: string } | undefined {
        return this.results.get(requestId);
    }

    clear(): void {
        this.results.clear();
    }
}

export class ProviderTimeoutHandler {
    private readonly timeouts: Map<string, ReturnType<typeof setTimeout>> = new Map();

    set(streamId: string, timeoutMs: number, onTimeout: () => void): void {
        const timeout = setTimeout(() => {
            this.clear(streamId);
            onTimeout();
        }, timeoutMs);
        this.timeouts.set(streamId, timeout);
    }

    clear(streamId: string): void {
        const timeout = this.timeouts.get(streamId);
        if (timeout) {
            clearTimeout(timeout);
            this.timeouts.delete(streamId);
        }
    }

    clearAll(): void {
        for (const timeout of this.timeouts.values()) {
            clearTimeout(timeout);
        }
        this.timeouts.clear();
    }
}

export class ProviderRetryManager {
    private readonly retries: Map<string, number> = new Map();

    increment(streamId: string): number {
        const count = (this.retries.get(streamId) || 0) + 1;
        this.retries.set(streamId, count);
        return count;
    }

    getCount(streamId: string): number {
        return this.retries.get(streamId) || 0;
    }

    reset(streamId: string): void {
        this.retries.delete(streamId);
    }

    clear(): void {
        this.retries.clear();
    }
}

export class AudioResponseMerger {
    merge(chunks: AudioChunk[]): AudioChunk[] {
        return chunks;
    }
}

export class AudioAuditLog {
    private readonly entries: Array<{ timestamp: number; providerId: string; action: string; streamId: string }> = [];

    log(providerId: string, action: string, streamId: string): void {
        this.entries.push({ timestamp: Date.now(), providerId, action, streamId });
    }

    getEntries(): Array<{ timestamp: number; providerId: string; action: string; streamId: string }> {
        return [...this.entries];
    }

    clear(): void {
        this.entries.length = 0;
    }
}

export class ProviderExecutionStateMachine {
    private state: "idle" | "invoking" | "streaming" | "completed" | "failed" | "retrying" = "idle";

    transition(action: "start" | "stream" | "complete" | "fail" | "retry"): void {
        const transitions: Record<string, string[]> = {
            "idle": ["start"],
            "invoking": ["stream", "fail", "retry"],
            "streaming": ["complete", "fail", "retry"],
            "completed": ["start"],
            "failed": ["retry", "start"],
            "retrying": ["start", "stream", "fail"]
        };
        if (!transitions[this.state].includes(action)) {
            throw new Error(`Invalid state transition: ${this.state} -> ${action}`);
        }
        const nextState: Record<string, string> = {
            "start": "invoking",
            "stream": "streaming",
            "complete": "completed",
            "fail": "failed",
            "retry": "retrying"
        };
        this.state = nextState[action] as any;
    }

    getState(): string {
        return this.state;
    }
}
