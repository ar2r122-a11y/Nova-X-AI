
export class ResourceBudget {
    private readonly vramBudget: number;
    private readonly memoryBudget: number;
    private readonly timeoutMs: number;
    private readonly maxResolution: number;
    private consumed: { vram: number; memory: number; timeMs: number };

    private constructor(vramBudget: number, memoryBudget: number, timeoutMs: number, maxResolution: number) {
        this.vramBudget = vramBudget;
        this.memoryBudget = memoryBudget;
        this.timeoutMs = timeoutMs;
        this.maxResolution = maxResolution;
        this.consumed = { vram: 0, memory: 0, timeMs: 0 };
    }

    public static create(vramBudget: number, memoryBudget: number, timeoutMs: number, maxResolution: number): ResourceBudget {
        if (vramBudget < 0 || memoryBudget < 0 || timeoutMs < 0 || maxResolution < 0) {
            throw new Error("Budget values cannot be negative.");
        }
        return new ResourceBudget(vramBudget, memoryBudget, timeoutMs, maxResolution);
    }

    public getVRAMBudget(): number {
        return this.vramBudget;
    }

    public getMemoryBudget(): number {
        return this.memoryBudget;
    }

    public getTimeoutMs(): number {
        return this.timeoutMs;
    }

    public getMaxResolution(): number {
        return this.maxResolution;
    }

    public consume(vram: number, memory: number, timeMs: number): void {
        this.consumed.vram += vram;
        this.consumed.memory += memory;
        this.consumed.timeMs += timeMs;
    }

    public isExhausted(): boolean {
        return (
            this.consumed.vram >= this.vramBudget ||
            this.consumed.memory >= this.memoryBudget ||
            this.consumed.timeMs >= this.timeoutMs
        );
    }

    public getRemainingVRAM(): number {
        return Math.max(0, this.vramBudget - this.consumed.vram);
    }

    public getRemainingMemory(): number {
        return Math.max(0, this.memoryBudget - this.consumed.memory);
    }

    public getRemainingTimeMs(): number {
        return Math.max(0, this.timeoutMs - this.consumed.timeMs);
    }

    public getConsumedVRAM(): number {
        return this.consumed.vram;
    }

    public getConsumedMemory(): number {
        return this.consumed.memory;
    }

    public getConsumedTimeMs(): number {
        return this.consumed.timeMs;
    }
}
