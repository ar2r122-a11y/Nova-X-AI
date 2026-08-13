export class TelemetryEventDto {
    constructor(
        public readonly eventId: string,
        public readonly eventType: string,
        public readonly payload: Record<string, unknown>,
        public readonly piiMasked: boolean,
        public readonly timestamp: number,
        public readonly correlationId?: string,
        public readonly engineSource?: string
    ) {}
}
