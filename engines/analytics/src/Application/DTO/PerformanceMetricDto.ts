export class PerformanceMetricDto {
    constructor(
        public readonly tag: string,
        public readonly count: number,
        public readonly averageValue: number,
        public readonly maxValue: number
    ) {}
}
