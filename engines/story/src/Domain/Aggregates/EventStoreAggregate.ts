import { IDomainEvent } from "@nova-x-ai/core";
import { StoryId } from "../ValueObjects/StoryId";
import { StoryVersion } from "../ValueObjects/StoryVersion";
import { StoryEvent } from "../Events";

export interface EventStoreAggregateProps {
    storeId: string;
    storyId: StoryId;
    events: StoryEvent[];
    lastVersion: number;
    version: StoryVersion;
    createdAt: number;
    updatedAt: number;
}

export class EventStoreAggregate {
    private readonly props: EventStoreAggregateProps;
    private readonly uncommittedEvents: IDomainEvent[];

    private constructor(props: EventStoreAggregateProps) {
        this.props = props;
        this.uncommittedEvents = [];
    }

    static create(storyId: StoryId): EventStoreAggregate {
        const now = Date.now();
        return new EventStoreAggregate({
            storeId: `event-store-${storyId.getValue()}`,
            storyId,
            events: [],
            lastVersion: 0,
            version: StoryVersion.initial(),
            createdAt: now,
            updatedAt: now,
        });
    }

    static reconstitute(props: EventStoreAggregateProps): EventStoreAggregate {
        const aggregate = new EventStoreAggregate({
            ...props,
        });
        return aggregate;
    }

    getStoreId(): string {
        return this.props.storeId;
    }

    getStoryId(): StoryId {
        return this.props.storyId;
    }

    getEvents(): readonly StoryEvent[] {
        return this.props.events;
    }

    getLastVersion(): number {
        return this.props.lastVersion;
    }

    getVersion(): StoryVersion {
        return this.props.version;
    }

    getCreatedAt(): number {
        return this.props.createdAt;
    }

    getUpdatedAt(): number {
        return this.props.updatedAt;
    }

    getUncommittedEvents(): readonly IDomainEvent[] {
        return this.uncommittedEvents;
    }

    appendEvent(event: StoryEvent): void {
        this.props.events.push(event);
        this.props.lastVersion = event.version;
        this.props.version = StoryVersion.next(this.props.version);
        this.props.updatedAt = Date.now();
    }

    getEventsFromVersion(fromVersion: number): StoryEvent[] {
        return this.props.events.filter((e) => e.version > fromVersion);
    }

    hasEvent(eventId: string): boolean {
        return this.props.events.some((e) => `${e.streamId}-${e.version}` === eventId);
    }

    commitEvents(): void {
        this.uncommittedEvents.length = 0;
    }

    getSnapshot(): Record<string, unknown> {
        return {
            storeId: this.props.storeId,
            storyId: this.props.storyId.getValue(),
            events: this.props.events.map((e) => ({
                streamId: e.streamId,
                version: e.version,
                eventType: e.eventType,
                payload: e.payload,
                timestamp: e.timestamp,
                correlationId: e.correlationId,
                causationId: e.causationId,
                metadata: e.metadata,
                schemaVersion: e.schemaVersion,
            })),
            lastVersion: this.props.lastVersion,
            version: this.props.version.getValue(),
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,
        };
    }
}
