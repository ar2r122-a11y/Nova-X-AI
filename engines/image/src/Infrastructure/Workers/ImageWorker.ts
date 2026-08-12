import type { IImageEngine } from "../../Contracts/IImageEngine";
import type { IImageWorker } from "../../Contracts/IImageWorker";

export class ImageWorker implements IImageWorker {
    private imageEngine: IImageEngine | null = null;
    private running = false;
    private intervalId: ReturnType<typeof setInterval> | null = null;

    setImageEngine(engine: IImageEngine): void {
        this.imageEngine = engine;
    }

    async start(): Promise<void> {
        if (this.running) {
            return;
        }
        this.running = true;
        this.intervalId = setInterval(() => {
            this.processPendingGenerations();
        }, 5000);
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
        return "ImageWorker";
    }

    private async processPendingGenerations(): Promise<void> {
        if (!this.imageEngine) {
            return;
        }
        console.log("[ImageWorker] Processing pending image generations...");
    }
}
