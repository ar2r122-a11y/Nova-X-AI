import { RuntimeState } from "../../Domain/ValueObjects/RuntimeState";

export class StoryRuntimeExecutionContext {
    readonly storyId: string;
    readonly correlationId: string;
    readonly causationId: string | null;
    readonly startTime: number;
    lastActivity: number;
    state: RuntimeState;
    private readonly cancellationSource = new Map<string, () => void>();

    constructor(storyId: string, correlationId: string, causationId: string | null = null) {
        this.storyId = storyId;
        this.correlationId = correlationId;
        this.causationId = causationId;
        this.startTime = Date.now();
        this.lastActivity = Date.now();
        this.state = RuntimeState.Initializing;
    }

    updateActivity(): void {
        this.lastActivity = Date.now();
    }

    cancel(operationId: string): void {
        const cancel = this.cancellationSource.get(operationId);
        if (cancel) {
            cancel();
            this.cancellationSource.delete(operationId);
        }
    }

    cancelAll(): void {
        for (const cancel of this.cancellationSource.values()) {
            cancel();
        }
        this.cancellationSource.clear();
    }

    registerCancellation(operationId: string, cancel: () => void): void {
        this.cancellationSource.set(operationId, cancel);
    }

    getUptime(): number {
        return Date.now() - this.startTime;
    }

    isIdle(idleThresholdMs: number = 60000): boolean {
        return Date.now() - this.lastActivity > idleThresholdMs;
    }
}
