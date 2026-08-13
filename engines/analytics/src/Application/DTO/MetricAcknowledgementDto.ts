export class MetricAcknowledgementDto {
    constructor(
        public readonly metricId: string,
        public readonly recordedAt: number,
        public readonly accepted: boolean
    ) {}
}
