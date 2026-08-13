export class FeatureUsageMetricDto {
    constructor(
        public readonly feature: string,
        public readonly count: number,
        public readonly totalValue: number,
        public readonly averageValue: number
    ) {}
}
