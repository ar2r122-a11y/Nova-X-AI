import type { IMemoryEngine } from "../../Contracts/IMemoryEngine";
import type { IMemoryWorker } from "../../Contracts/IMemoryEngine";
import type { IMemoryRepository } from "../../Domain/Repositories/IMemoryRepository";
import { MemoryClusterId } from "../../Domain/ValueObjects/MemoryClusterId";
import { MemoryAggregate } from "../../Domain/Aggregates/MemoryAggregate";

export class MemoryConsolidationWorker implements IMemoryWorker {
    private repository: IMemoryRepository | null = null;
    private intervalId: ReturnType<typeof setInterval> | null = null;
    private running = false;
    private readonly intervalMs = 300000;

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
            this.attemptConsolidation();
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
        return "MemoryConsolidationWorker";
    }

    private async attemptConsolidation(): Promise<void> {
        if (!this.repository) {
            return;
        }
        const allMemories = await this.repository.getAll();
        const activeMemories = allMemories.filter((m) => m.getState().isActive());
        const ownerGroups = new Map<string, typeof activeMemories>();
        for (const memory of activeMemories) {
            const key = memory.getOwnerId();
            const group = ownerGroups.get(key) ?? [];
            group.push(memory);
            ownerGroups.set(key, group);
        }
        for (const [, memories] of ownerGroups) {
            const unclustered = memories.filter((m) => m.getClusterId() === undefined);
            if (unclustered.length < 2) {
                continue;
            }
            const clusterId = MemoryClusterId.generate();
            const aggregate = MemoryAggregate.reconstitute(unclustered);
            aggregate.formCluster(clusterId, unclustered.map((m) => m.getId()));
            for (const memory of unclustered) {
                memory.consolidate(clusterId);
                await this.repository.save(memory);
            }
        }
    }
}
