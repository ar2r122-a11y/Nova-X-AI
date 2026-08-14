export interface HealthMetricSampleDto {
    readonly engineName: string;
    readonly metricName: string;
    readonly value: number;
    readonly unit: string;
    readonly timestamp: number;
    readonly tags: Record<string, string>;
}

export interface HealthMetricsDto {
    readonly metrics: HealthMetricSampleDto[];
    readonly overallHealthy: boolean;
    readonly generatedAt: number;
}
