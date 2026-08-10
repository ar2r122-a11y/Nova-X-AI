import type { IMemoryEngine } from "../../Contracts/IMemoryEngine";
import type { IMemoryWorker } from "../../Contracts/IMemoryEngine";
import type { IMemoryRepository } from "../../Domain/Repositories/IMemoryRepository";

export class MemoryDecayWorker implements IMemoryWorker {
    private repository: IMemoryRepository | null = null;
    private intervalId: ReturnType<typeof setInterval> | null = null;
    private running = false;
    private readonly intervalMs = 60000;

    setMemoryEngine(_engine: IMemoryEngine): void {
    }

    setRepository(repository: IMemoryRepository): void {
        this.repository = repository;
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
        return "MemoryDecayWorker";
    }

    private async applyDecay(): Promise<void> {
        if (!this.repository) {
            return;
        }
        const allMemories = await this.repository.getAll();
        for (const memory of allMemories) {
            if (memory.getState().isActive()) {
                memory.decaySalience(memory.getDecayRate());
                await this.repository.save(memory);
            }
        }
    }
}
