export class TelemetryEventId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    static generate(): TelemetryEventId {
        return new TelemetryEventId(`telemetry-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
    }

    static fromString(value: string): TelemetryEventId {
        return new TelemetryEventId(value);
    }

    getValue(): string {
        return this.value;
    }
}
