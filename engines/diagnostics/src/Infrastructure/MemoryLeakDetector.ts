import type { IMemoryLeakDetector } from "../Domain/Services/IMemoryLeakDetector";

interface AllocationRecord {
    engine: string;
    label: string | null;
    bytes: number;
    timestamp: number;
}

export class MemoryLeakDetector implements IMemoryLeakDetector {
    private readonly allocations = new Map<string, AllocationRecord[]>();
    private readonly maxAllocations = 5000;

    public async recordAllocation(engine: string, bytes: number, label?: string): Promise<void> {
        const key = engine;
        const list = this.allocations.get(key) ?? [];
        list.push({
            engine,
            label: label ?? null,
            bytes,
            timestamp: Date.now()
        });

        if (list.length > this.maxAllocations) {
            list.splice(0, list.length - this.maxAllocations);
        }

        this.allocations.set(key, list);
    }

    public async detectLeaks(): Promise<Array<{
        engine: string;
        label: string | null;
        allocatedBytes: number;
        allocationCount: number;
        firstSeen: number;
        lastSeen: number;
    }>> {
        const leaks: Array<{
            engine: string;
            label: string | null;
            allocatedBytes: number;
            allocationCount: number;
            firstSeen: number;
            lastSeen: number;
        }> = [];

        for (const [engine, records] of this.allocations) {
            const byLabel = new Map<string | null, AllocationRecord[]>();
            for (const record of records) {
                const list = byLabel.get(record.label) ?? [];
                list.push(record);
                byLabel.set(record.label, list);
            }

            for (const [label, labelRecords] of byLabel) {
                const totalBytes = labelRecords.reduce((sum, r) => sum + r.bytes, 0);
                const firstSeen = Math.min(...labelRecords.map(r => r.timestamp));
                const lastSeen = Math.max(...labelRecords.map(r => r.timestamp));

                if (totalBytes > 1024 * 1024) {
                    leaks.push({
                        engine,
                        label,
                        allocatedBytes: totalBytes,
                        allocationCount: labelRecords.length,
                        firstSeen,
                        lastSeen
                    });
                }
            }
        }

        return leaks.sort((a, b) => b.allocatedBytes - a.allocatedBytes);
    }

    public async reset(engine?: string): Promise<void> {
        if (engine) {
            this.allocations.delete(engine);
        } else {
            this.allocations.clear();
        }
    }
}
