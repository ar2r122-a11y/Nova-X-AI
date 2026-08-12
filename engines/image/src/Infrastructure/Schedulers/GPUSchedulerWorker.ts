import type { IImageWorker } from "../../Contracts/IImageWorker";

export class GPUSchedulerWorker implements IImageWorker {
    private running = false;
    private intervalId: ReturnType<typeof setInterval> | null = null;
    private readonly maxVRAM: number;

    constructor(maxVRAM: number = 4096) {
        this.maxVRAM = maxVRAM;
    }

    async start(): Promise<void> {
        if (this.running) {
            return;
        }
        this.running = true;
        this.intervalId = setInterval(() => {
            this.allocateResources();
        }, 2000);
    }

    async stop(): Promise<void> {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.running = false;
    }

    isRunning(): boolean {
        return this.running;
    }

    getWorkerName(): string {
        return "GPUSchedulerWorker";
    }

    getAvailableVRAM(): number {
        return this.maxVRAM;
    }

    private allocateResources(): void {
        console.log(`[GPUSchedulerWorker] Allocating GPU resources. Max VRAM: ${this.maxVRAM}MB`);
    }
}
