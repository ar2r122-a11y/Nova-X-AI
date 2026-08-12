import type { IImageRecoveryWorker } from "../../Contracts/IImageRecoveryWorker";
import type { IImageWorker } from "../../Contracts/IImageWorker";

interface RecoveryState {
    status: string;
    attempts: number;
    maxAttempts: number;
}

export class ImageRecoveryWorker implements IImageRecoveryWorker, IImageWorker {
    private readonly recoveries: Map<string, RecoveryState> = new Map();
    private running = false;

    async start(): Promise<void> {
        this.running = true;
    }

    async stop(): Promise<void> {
        this.running = false;
    }

    isRunning(): boolean {
        return this.running;
    }

    getWorkerName(): string {
        return "ImageRecoveryWorker";
    }

    async recover(imageId: string): Promise<boolean> {
        const existing = this.recoveries.get(imageId);
        if (existing) {
            if (existing.attempts >= existing.maxAttempts) {
                return false;
            }
            existing.attempts += 1;
        } else {
            this.recoveries.set(imageId, {
                status: "recovering",
                attempts: 1,
                maxAttempts: 3
            });
        }
        const state = this.recoveries.get(imageId)!;
        state.status = "recovering";
        console.log(`[ImageRecoveryWorker] Recovering image ${imageId}, attempt ${state.attempts}/${state.maxAttempts}`);
        const success = await this.performRecovery(imageId);
        state.status = success ? "recovered" : "failed";
        return success;
    }

    isRecovering(imageId: string): boolean {
        const state = this.recoveries.get(imageId);
        return state?.status === "recovering" || false;
    }

    getRecoveryStatus(imageId: string): { status: string; attempts: number; maxAttempts: number } {
        const state = this.recoveries.get(imageId);
        if (!state) {
            return { status: "idle", attempts: 0, maxAttempts: 3 };
        }
        return {
            status: state.status,
            attempts: state.attempts,
            maxAttempts: state.maxAttempts
        };
    }

    private async performRecovery(_imageId: string): Promise<boolean> {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return Math.random() > 0.5;
    }
}
