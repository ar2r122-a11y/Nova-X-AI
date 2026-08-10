class QueuedEvent {
    event: unknown;
    attempts = 0;
    nextAttemptAt = 0;
}

export class EventAppendRetryQueue {
    private readonly queue: QueuedEvent[] = [];
    private readonly baseDelayMs: number;
    private readonly maxDelayMs: number;
    private readonly maxAttempts: number;

    constructor(baseDelayMs = 1000, maxDelayMs = 30000, maxAttempts = 5) {
        this.baseDelayMs = baseDelayMs;
        this.maxDelayMs = maxDelayMs;
        this.maxAttempts = maxAttempts;
    }

    enqueue(event: unknown): void {
        const queuedEvent = new QueuedEvent();
        queuedEvent.event = event;
        queuedEvent.nextAttemptAt = Date.now();
        this.queue.push(queuedEvent);
    }

    async process(processor: (event: unknown) => Promise<void>): Promise<void> {
        const now = Date.now();
        const pending = this.queue.filter(q => q.nextAttemptAt <= now);

        for (const item of pending) {
            try {
                await processor(item.event);
                const index = this.queue.indexOf(item);
                if (index !== -1) {
                    this.queue.splice(index, 1);
                }
            } catch {
                item.attempts++;
                if (item.attempts >= this.maxAttempts) {
                    const index = this.queue.indexOf(item);
                    if (index !== -1) {
                        this.queue.splice(index, 1);
                    }
                    throw new Error(`Event failed after ${this.maxAttempts} attempts.`);
                }
                item.nextAttemptAt = now + Math.min(this.baseDelayMs * Math.pow(2, item.attempts), this.maxDelayMs);
            }
        }
    }

    clear(): void {
        this.queue.length = 0;
    }

    get pendingCount(): number {
        return this.queue.length;
    }
}
