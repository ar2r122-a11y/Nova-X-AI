export interface IMemoryLeakDetector {
    recordAllocation(engine: string, bytes: number, label?: string): Promise<void>;

    detectLeaks(): Promise<Array<{
        engine: string;
        label: string | null;
        allocatedBytes: number;
        allocationCount: number;
        firstSeen: number;
        lastSeen: number;
    }>>;

    reset(engine?: string): Promise<void>;
}
