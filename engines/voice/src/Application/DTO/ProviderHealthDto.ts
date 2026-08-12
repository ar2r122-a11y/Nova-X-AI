export class ProviderHealthDto {
    constructor(
        public readonly providerId: string,
        public readonly status: string,
        public readonly latencyMs: number,
        public readonly lastChecked: number,
        public readonly errorCount: number,
        public readonly successCount: number
    ) {}
}
