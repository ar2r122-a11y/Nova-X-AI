import type { IMemoryEngine } from "../../Contracts/IMemoryEngine";
import type { IMemoryWorker } from "../../Contracts/IMemoryEngine";
import type { IMemoryRepository } from "../../Domain/Repositories/IMemoryRepository";

export class MemoryCacheWorker implements IMemoryWorker {
    private repository: IMemoryRepository | null = null;
    private intervalId: ReturnType<typeof setInterval> | null = null;
    private running = false;
    private readonly intervalMs = 120000;

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
            this.warmCache();
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
        return "MemoryCacheWorker";
    }

    private async warmCache(): Promise<void> {
        if (!this.repository) {
            return;
        }
        await this.repository.getAll();
    }
}
