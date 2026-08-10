import { MemoryEntry } from "../Entities/MemoryEntry";

export interface RetentionThreshold {
    readonly minSalience: number;
    readonly maxAgeMs: number;
    readonly maxAccessCount: number;
}

export class MemoryRetentionPolicy {
    private readonly thresholds: RetentionThreshold;

    constructor(thresholds?: Partial<RetentionThreshold>) {
        this.thresholds = {
            minSalience: thresholds?.minSalience ?? 0.1,
            maxAgeMs: thresholds?.maxAgeMs ?? 1000 * 60 * 60 * 24 * 90,
            maxAccessCount: thresholds?.maxAccessCount ?? 1
        };
    }

    shouldRetain(memory: MemoryEntry): boolean {
        const age = Date.now() - memory.getCreatedAt();
        if (age > this.thresholds.maxAgeMs) {
            return false;
        }
        if (memory.getAccessCount() > this.thresholds.maxAccessCount && memory.getSalience().isBelow(this.thresholds.minSalience)) {
            return false;
        }
        return true;
    }

    getExpiredMemories(memories: MemoryEntry[]): MemoryEntry[] {
        return memories.filter((m) => !this.shouldRetain(m));
    }

    getThresholds(): RetentionThreshold {
        return this.thresholds;
    }
}
