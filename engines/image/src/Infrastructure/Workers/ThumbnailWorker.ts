import type { IImageWorker } from "../../Contracts/IImageWorker";

export class ThumbnailWorker implements IImageWorker {
    private running = false;
    private intervalId: ReturnType<typeof setInterval> | null = null;
    private readonly sizes: string[];

    constructor(sizes: string[] = ["256x256", "512x512", "1024x1024"]) {
        this.sizes = sizes;
    }

    async start(): Promise<void> {
        if (this.running) {
            return;
        }
        this.running = true;
        this.intervalId = setInterval(() => {
            this.generateThumbnails();
        }, 12000);
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
        return "ThumbnailWorker";
    }

    private generateThumbnails(): void {
        console.log(`[ThumbnailWorker] Generating thumbnails for sizes: ${this.sizes.join(", ")}...`);
    }
}
