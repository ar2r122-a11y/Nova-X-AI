import type { IMemoryEngine } from "../../Contracts/IMemoryEngine";
import type { IMemoryWorker } from "../../Contracts/IMemoryEngine";
import type { IMemoryRepository } from "../../Domain/Repositories/IMemoryRepository";

export class MemoryPruningWorker implements IMemoryWorker {
    private repository: IMemoryRepository | null = null;
    private intervalId: ReturnType<typeof setInterval> | null = null;
    private running = false;
    private readonly intervalMs = 3600000;

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
            this.pruneExpired();
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
        return "MemoryPruningWorker";
    }

    private async pruneExpired(): Promise<void> {
        if (!this.repository) {
            return;
        }
        const allMemories = await this.repository.getAll();
        const now = Date.now();
        for (const memory of allMemories) {
            if (!memory.getState().isActive()) {
                continue;
            }
            const age = now - memory.getCreatedAt();
            const maxAge = 31536000000;
            if (memory.getSalience().getValue() < 0.05 || age > maxAge) {
                memory.archive();
                await this.repository.save(memory);
            }
        }
    }
}
