import { IProjectionStore } from "@nova-x-ai/storage";

export interface ProjectionStatus {
    readonly name: string;
    readonly version: number;
    readonly lastBuiltAt: number;
    readonly isRunning: boolean;
}

export class ProjectionEngine {
    private readonly handlers = new Map<string, ((event: any) => Promise<void>)[]>();
    private running = false;

    constructor(private readonly projectionStore: IProjectionStore) {}

    start(): void {
        if (this.running) {
            return;
        }
        this.running = true;
    }

    stop(): void {
        this.running = false;
    }

    registerHandler<T extends { eventType: string }>(eventType: string, handler: (event: T) => Promise<void>): void {
        const existing = this.handlers.get(eventType) || [];
        existing.push(handler as (event: any) => Promise<void>);
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
            isRunning: this.running,
        }));
    }
}
