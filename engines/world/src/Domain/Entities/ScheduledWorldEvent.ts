export class ScheduledWorldEvent {
    private readonly eventId: string;
    private readonly eventType: string;
    private readonly triggerTime: number;
    private readonly payload: Record<string, unknown>;
    private executed: boolean;
    private readonly createdAt: number;

    private constructor(eventId: string, eventType: string, triggerTime: number, payload: Record<string, unknown>, executed: boolean, createdAt: number) {
        this.eventId = eventId;
        this.eventType = eventType;
        this.triggerTime = triggerTime;
        this.payload = payload;
        this.executed = executed;
        this.createdAt = createdAt;
    }

    static create(eventId: string, eventType: string, triggerTime: number, payload: Record<string, unknown>): ScheduledWorldEvent {
        if (!eventId || eventId.trim().length === 0) {
            throw new Error("EventId cannot be empty.");
        }
        if (!eventType || eventType.trim().length === 0) {
            throw new Error("EventType cannot be empty.");
        }
        if (triggerTime < 0) {
            throw new Error("TriggerTime cannot be negative.");
        }
        return new ScheduledWorldEvent(eventId, eventType.trim(), triggerTime, payload, false, Date.now());
    }

    getEventId(): string {
        return this.eventId;
    }

    getEventType(): string {
        return this.eventType;
    }

    getTriggerTime(): number {
        return this.triggerTime;
    }

    getPayload(): Record<string, unknown> {
        return this.payload;
    }

    isExecuted(): boolean {
        return this.executed;
    }

    getCreatedAt(): number {
        return this.createdAt;
    }

    markExecuted(): void {
        this.executed = true;
    }
}
