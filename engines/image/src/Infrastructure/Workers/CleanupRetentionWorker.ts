import type { IImageWorker } from "../../Contracts/IImageWorker";

export class CleanupRetentionWorker implements IImageWorker {
    private running = false;
    private intervalId: ReturnType<typeof setInterval> | null = null;
    private readonly retentionDays: number;

    constructor(retentionDays: number = 30) {
        this.retentionDays = retentionDays;
    }

    async start(): Promise<void> {
        if (this.running) {
            return;
        }
        this.running = true;
        this.intervalId = setInterval(() => {
            this.cleanupOldAssets();
        }, 3600000);
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
        return "CleanupRetentionWorker";
    }

    private cleanupOldAssets(): void {
        const cutoff = Date.now() - this.retentionDays * 24 * 60 * 60 * 1000;
        console.log(`[CleanupRetentionWorker] Cleaning up assets older than ${new Date(cutoff).toISOString()}`);
    }
}
