import { IDomainEvent } from "@nova-x-ai/core";
import { WorldId } from "../ValueObjects/WorldId";
import { WorldEventVersion } from "../ValueObjects/WorldEventVersion";
import { WorldHistoryEntry } from "../Entities/WorldHistoryEntry";
import { ScheduledWorldEvent } from "../Entities/ScheduledWorldEvent";

export class WorldEventStoreAggregate {
    private readonly worldId: WorldId;
    private readonly events: WorldHistoryEntry[];
    private readonly scheduledEvents: ScheduledWorldEvent[];
    private version: WorldEventVersion;
    private readonly uncommittedEvents: IDomainEvent[];

    private constructor(
        worldId: WorldId,
        events: WorldHistoryEntry[],
        scheduledEvents: ScheduledWorldEvent[],
        version: WorldEventVersion
    ) {
        this.worldId = worldId;
        this.events = events;
        this.scheduledEvents = scheduledEvents;
        this.version = version;
        this.uncommittedEvents = [];
    }

    static create(worldId: WorldId): WorldEventStoreAggregate {
        return new WorldEventStoreAggregate(worldId, [], [], WorldEventVersion.initial());
    }

    static reconstitute(
        worldId: WorldId,
        events: WorldHistoryEntry[],
        scheduledEvents: ScheduledWorldEvent[],
        version: WorldEventVersion
    ): WorldEventStoreAggregate {
        return new WorldEventStoreAggregate(worldId, events, scheduledEvents, version);
    }

    getWorldId(): WorldId {
        return this.worldId;
    }

    getVersion(): WorldEventVersion {
        return this.version;
    }

    getUncommittedEvents(): readonly IDomainEvent[] {
        return this.uncommittedEvents;
    }

    appendEvent(eventType: string, payload: Record<string, unknown>, correlationId: string): WorldHistoryEntry {
        if (!eventType || eventType.trim().length === 0) {
            throw new Error("EventType cannot be empty.");
        }
        if (!correlationId || correlationId.trim().length === 0) {
            throw new Error("CorrelationId cannot be empty.");
        }

        this.version = WorldEventVersion.next(this.version);
        const entry = WorldHistoryEntry.create(this.version, eventType.trim(), Date.now(), payload, correlationId);
        this.events.push(entry);
        return entry;
    }

    scheduleEvent(eventId: string, eventType: string, triggerTime: number, payload: Record<string, unknown>): ScheduledWorldEvent {
        if (triggerTime < 0) {
            throw new Error("TriggerTime cannot be negative.");
        }
        const event = ScheduledWorldEvent.create(eventId, eventType, triggerTime, payload);
        this.scheduledEvents.push(event);
        this.version = WorldEventVersion.next(this.version);
        return event;
    }

    getEventsFromVersion(fromVersion: WorldEventVersion): readonly WorldHistoryEntry[] {
        return this.events.filter(e => e.getVersion().isGreaterThanOrEqual(fromVersion));
    }

    getEventsUpToVersion(upToVersion: WorldEventVersion): readonly WorldHistoryEntry[] {
        return this.events.filter(e => e.getVersion().isLessThanOrEqual(upToVersion));
    }

    getDueScheduledEvents(now: number): readonly ScheduledWorldEvent[] {
        return this.scheduledEvents.filter(e => !e.isExecuted() && e.getTriggerTime() <= now);
    }

    markScheduledEventExecuted(eventId: string): void {
        const event = this.scheduledEvents.find(e => e.getEventId() === eventId);
        if (!event) {
            throw new Error(`Scheduled event not found: ${eventId}`);
        }
        event.markExecuted();
    }

    commitEvents(): void {
        this.uncommittedEvents.length = 0;
    }

    getSnapshot(): object {
        return {
            worldId: this.worldId.getValue(),
            events: this.events.map(e => ({
                version: e.getVersion().getValue(),
                eventType: e.getEventType(),
                timestamp: e.getTimestamp(),
                payload: e.getPayload(),
                correlationId: e.getCorrelationId()
            })),
            scheduledEvents: this.scheduledEvents.map(e => ({
                eventId: e.getEventId(),
                eventType: e.getEventType(),
                triggerTime: e.getTriggerTime(),
                payload: e.getPayload(),
                executed: e.isExecuted(),
                createdAt: e.getCreatedAt()
            })),
            version: this.version.getValue()
        };
    }
}
