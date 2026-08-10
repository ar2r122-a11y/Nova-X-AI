import type { IEmotionEngine } from "../../Contracts/IEmotionEngine";
import type { IEmotionWorker } from "../../Contracts/IEmotionEngine";

export class DecayWorker implements IEmotionWorker {
    private engine: IEmotionEngine | null = null;
    private intervalId: ReturnType<typeof setInterval> | null = null;
    private running = false;
    private readonly intervalMs = 5000;

    setEngine(engine: IEmotionEngine): void {
        this.engine = engine;
    }

    async start(): Promise<void> {
        if (this.running) {
            return;
        }
        this.running = true;
        this.intervalId = setInterval(() => {
            this.applyDecay();
        }, this.intervalMs);
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
        return "DecayWorker";
    }

    private async applyDecay(): Promise<void> {
        if (!this.engine) {
            return;
        }
        try {
            await this.engine.evaluateDecay("", this.intervalMs);
        } catch {
            // preserve last valid state on failure
        }
    }
}
