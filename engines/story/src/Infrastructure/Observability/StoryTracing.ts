export class StoryTracing {
    private traces: Map<string, { startTime: number; operationName: string }> = new Map();

    startTrace(operationName: string, correlationId: string): void {
        this.traces.set(correlationId, {
            startTime: Date.now(),
            operationName,
        });
    }

    endTrace(correlationId: string): number {
        const trace = this.traces.get(correlationId);
        if (!trace) {
            return 0;
        }
        const duration = Date.now() - trace.startTime;
        this.traces.delete(correlationId);
        return duration;
    }

    addSpan(operationName: string, durationMs: number): void {
        console.log(`[StoryTracing] ${operationName}: ${durationMs}ms`);
    }
}
