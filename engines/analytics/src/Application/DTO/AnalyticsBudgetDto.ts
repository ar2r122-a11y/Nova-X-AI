export class AnalyticsBudgetDto {
    constructor(
        public readonly hardRamBytes: number,
        public readonly softRamBytes: number,
        public readonly maxStorageBytes: number,
        public readonly maxIngestionPerSecond: number,
        public readonly exportTimeoutMs: number,
        public readonly exportBandwidthBps: number
    ) {}
}
