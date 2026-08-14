export interface IMetricsAggregator {
    recordSample(sample: {
        engineName: string;
        metricName: string;
        value: number;
        unit: string;
        tags: Record<string, string>;
    }): Promise<void>;

    getAggregates(engineName?: string): Promise<Array<{
        engineName: string;
        metricName: string;
        min: number;
        max: number;
        avg: number;
        count: number;
        unit: string;
        lastUpdated: number;
    }>>;

    reset(engineName?: string): Promise<void>;
}
