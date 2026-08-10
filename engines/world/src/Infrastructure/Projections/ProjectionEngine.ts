import { IEventBus, IDomainEvent, IEventHandler } from "@nova-x-ai/core";
import { IProjectionStore } from "@nova-x-ai/storage";

export interface ProjectionStatus {
    readonly name: string;
    readonly version: number;
    readonly lastBuiltAt: number;
    readonly isRunning: boolean;
}

export class ProjectionEngine {
    private readonly handlers = new Map<string, IEventHandler<IDomainEvent>[]>();
    private running = false;

    constructor(private readonly eventBus: IEventBus, private readonly projectionStore: IProjectionStore) {}

    start(): void {
        if (this.running) {
            return;
        }
        this.running = true;

        for (const [eventType, handlers] of this.handlers.entries()) {
            for (const handler of handlers) {
                this.eventBus.subscribe(eventType, handler);
            }
        }
    }

    stop(): void {
        this.running = false;
    }

    registerHandler<T extends IDomainEvent>(eventType: string, handler: IEventHandler<T>): void {
        const existing = this.handlers.get(eventType) || [];
        existing.push(handler as IEventHandler<IDomainEvent>);
        this.handlers.set(eventType, existing);
    }

    async rebuild(projectionName: string): Promise<void> {
        await this.projectionStore.resetProjection(projectionName);
    }

    async getStatus(): Promise<ProjectionStatus[]> {
        const names = await this.projectionStore.listProjections();
        return names.map((name: string) => ({
            name,
            version: 0,
            lastBuiltAt: Date.now(),
            isRunning: this.running
        }));
    }
}
