import type { IImageWorker } from "../../Contracts/IImageWorker";

export class ThumbnailSchedulerWorker implements IImageWorker {
    private running = false;
    private intervalId: ReturnType<typeof setInterval> | null = null;

    async start(): Promise<void> {
        if (this.running) {
            return;
        }
        this.running = true;
        this.intervalId = setInterval(() => {
            this.scheduleThumbnails();
        }, 15000);
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
        return "ThumbnailSchedulerWorker";
    }

    private scheduleThumbnails(): void {
        console.log("[ThumbnailSchedulerWorker] Scheduling thumbnail generation...");
    }
}
