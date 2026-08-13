import { TelemetryEventId } from "../ValueObjects/TelemetryEventId";
import { PIIMask } from "../ValueObjects/PIIMask";

export interface TelemetryEventProps {
    id: TelemetryEventId;
    eventType: string;
    payload: Record<string, unknown>;
    piiMask: PIIMask;
    timestamp: number;
    correlationId?: string;
    engineSource?: string;
}

export class TelemetryEvent {
    private readonly props: TelemetryEventProps;

    private constructor(props: TelemetryEventProps) {
        this.props = props;
    }

    static create(props: Omit<TelemetryEventProps, "id" | "timestamp">): TelemetryEvent {
        return new TelemetryEvent({
            ...props,
            id: TelemetryEventId.generate(),
            timestamp: Date.now()
        });
    }

    static reconstitute(props: TelemetryEventProps): TelemetryEvent {
        return new TelemetryEvent(props);
    }

    getId(): TelemetryEventId {
        return this.props.id;
    }

    getEventType(): string {
        return this.props.eventType;
    }

    getPayload(): Record<string, unknown> {
        return this.props.payload;
    }

    getPIIMask(): PIIMask {
        return this.props.piiMask;
    }

    getTimestamp(): number {
        return this.props.timestamp;
    }

    getCorrelationId(): string | undefined {
        return this.props.correlationId;
    }

    getEngineSource(): string | undefined {
        return this.props.engineSource;
    }

    toSnapshot(): TelemetryEventProps {
        return { ...this.props };
    }
}
