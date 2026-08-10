import { WorldEventVersion } from "../../Domain/ValueObjects/WorldEventVersion";

export class EventStreamDto {
    constructor(
        public readonly events: {
            version: number;
            eventType: string;
            timestamp: number;
            payload: Record<string, unknown>;
            correlationId: string;
        }[]
    ) {}

    static fromHistory(history: readonly {
        getVersion(): WorldEventVersion;
        getEventType(): string;
        getTimestamp(): number;
        getPayload(): Record<string, unknown>;
        getCorrelationId(): string;
    }[]): EventStreamDto {
        return new EventStreamDto(
            history.map(e => ({
                version: e.getVersion().getValue(),
                eventType: e.getEventType(),
                timestamp: e.getTimestamp(),
                payload: e.getPayload(),
                correlationId: e.getCorrelationId()
            }))
        );
    }
}
