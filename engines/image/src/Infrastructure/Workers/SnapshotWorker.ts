import type { IImageWorker } from "../../Contracts/IImageWorker";
import type { IImageRepository } from "../../Contracts/IImageRepository";

export class SnapshotWorker implements IImageWorker {
    private imageRepository: IImageRepository | null = null;
    private running = false;
    private intervalId: ReturnType<typeof setInterval> | null = null;

    setImageRepository(repository: IImageRepository): void {
        this.imageRepository = repository;
    }

    async start(): Promise<void> {
        if (this.running) {
            return;
        }
        this.running = true;
        this.intervalId = setInterval(() => {
            this.createSnapshots();
        }, 60000);
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
        return "SnapshotWorker";
    }

    private async createSnapshots(): Promise<void> {
        if (!this.imageRepository) {
            return;
        }
        console.log("[SnapshotWorker] Creating snapshots...");
    }
}
