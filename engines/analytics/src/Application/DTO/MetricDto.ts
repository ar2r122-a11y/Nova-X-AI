export class MetricDto {
    constructor(
        public readonly metricId: string,
        public readonly type: string,
        public readonly name: string,
        public readonly value: number,
        public readonly unit: string,
        public readonly tags: string[],
        public readonly piiMasked: boolean,
        public readonly recordedAt: number,
        public readonly featureTag?: string,
        public readonly performanceTag?: string,
        public readonly sessionId?: string,
        public readonly engineSource?: string,
        public readonly correlationId?: string
    ) {}
}
