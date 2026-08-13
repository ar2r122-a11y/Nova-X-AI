export class AnalyticsSettingsDto {
    constructor(
        public readonly optedOut: boolean,
        public readonly rawRetentionDays: number,
        public readonly summaryRetentionDays: number,
        public readonly piiStrippingEnabled: boolean,
        public readonly promptTextHashingEnabled: boolean,
        public readonly ipAnonymizationEnabled: boolean,
        public readonly updatedAt: number
    ) {}
}
