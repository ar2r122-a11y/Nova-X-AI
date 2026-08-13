export class PurgeResultDto {
    constructor(
        public readonly metricsPurged: number,
        public readonly telemetryPurged: number,
        public readonly executedAt: number
    ) {}
}
