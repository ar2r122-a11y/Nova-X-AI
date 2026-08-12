import type { IImageWorker } from "../../Contracts/IImageWorker";

export class CandidateBatchWorker implements IImageWorker {
    private running = false;
    private intervalId: ReturnType<typeof setInterval> | null = null;
    private readonly batchSize: number;

    constructor(batchSize: number = 4) {
        this.batchSize = batchSize;
    }

    async start(): Promise<void> {
        if (this.running) {
            return;
        }
        this.running = true;
        this.intervalId = setInterval(() => {
            this.processBatches();
        }, 8000);
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
        return "CandidateBatchWorker";
    }

    private processBatches(): void {
        console.log(`[CandidateBatchWorker] Processing candidate batches of size ${this.batchSize}...`);
    }
}
