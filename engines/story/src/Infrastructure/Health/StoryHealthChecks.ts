import type { IEventBus } from "@nova-x-ai/core";
import type { IStoryRepository } from "../../Domain/Repositories/IStoryRepository";
import type { IStoryEventStoreRepository } from "../../Domain/Repositories/IStoryEventStoreRepository";
import { ProjectionEngine } from "../../Infrastructure/Projections/ProjectionEngine";
import type { IStoryRuntime } from "../../Application/Services/IStoryRuntime";
import type { IWorkerLifecycleManager } from "../../Infrastructure/Workers/IWorkerLifecycleManager";

export interface StoryHealthStatus {
    readonly checks: Array<{
        readonly name: string;
        readonly status: "healthy" | "degraded" | "unhealthy";
        readonly details?: string;
    }>;
    readonly overall: "healthy" | "degraded" | "unhealthy";
}

export class StoryHealthChecks {
    constructor(
        _eventBus: IEventBus,
        private readonly storyRepository: IStoryRepository,
        private readonly eventStoreRepository: IStoryEventStoreRepository,
        private readonly projectionEngine: ProjectionEngine,
        private readonly runtime: IStoryRuntime,
        private readonly workerLifecycleManager: IWorkerLifecycleManager
    ) {}

    async checkHealth(): Promise<StoryHealthStatus> {
        const checks: StoryHealthStatus["checks"] = [];

        try {
            await this.storyRepository.getAll();
            checks.push({ name: "repository", status: "healthy" });
        } catch {
            checks.push({ name: "repository", status: "unhealthy", details: "Repository check failed" });
        }

        try {
            await this.eventStoreRepository.getStreamVersion("health-check");
            checks.push({ name: "eventStore", status: "healthy" });
        } catch {
            checks.push({ name: "eventStore", status: "unhealthy", details: "Event Store check failed" });
        }

        try {
            await this.projectionEngine.getStatus();
            checks.push({ name: "projection", status: "healthy" });
        } catch {
            checks.push({ name: "projection", status: "unhealthy", details: "Projection check failed" });
        }

        checks.push({ name: "runtime", status: this.runtime.getRuntimeState() === "active" ? "healthy" : "degraded" });

        const workerHealth = this.workerLifecycleManager.getWorkerHealth();
        const workerStatuses = Object.values(workerHealth);
        const hasUnhealthyWorker = workerStatuses.some((s) => s === "failed" || s === "terminated");
        checks.push({
            name: "workers",
            status: hasUnhealthyWorker ? "degraded" : "healthy",
            details: JSON.stringify(workerHealth),
        });

        const overall = checks.some((c) => c.status === "unhealthy")
            ? "unhealthy"
            : checks.some((c) => c.status === "degraded")
                ? "degraded"
                : "healthy";

        return { checks, overall };
    }
}
