import type { IMetricsAggregator } from "../Domain/Services/IMetricsAggregator";

export class MetricsAggregator implements IMetricsAggregator {
    private readonly samples: Array<{
        engineName: string;
        metricName: string;
        value: number;
        unit: string;
        tags: Record<string, string>;
        timestamp: number;
    }> = [];

    private readonly maxSamples = 10000;

    public async recordSample(sample: {
        engineName: string;
        metricName: string;
        value: number;
        unit: string;
        tags: Record<string, string>;
    }): Promise<void> {
        if (this.samples.length >= this.maxSamples) {
            this.samples.shift();
        }

        this.samples.push({
            ...sample,
            timestamp: Date.now()
        });
    }

    public async getAggregates(engineName?: string): Promise<Array<{
        engineName: string;
        metricName: string;
        min: number;
        max: number;
        avg: number;
        count: number;
        unit: string;
        lastUpdated: number;
    }>> {
        const filtered = engineName
            ? this.samples.filter(s => s.engineName === engineName)
            : this.samples;

        const groups = new Map<string, typeof filtered>();

        for (const sample of filtered) {
            const key = `${sample.engineName}:${sample.metricName}`;
            const group = groups.get(key);
            if (group) {
                group.push(sample);
            } else {
                groups.set(key, [sample]);
            }
        }

        const result: Array<{
            engineName: string;
            metricName: string;
            min: number;
            max: number;
            avg: number;
            count: number;
            unit: string;
            lastUpdated: number;
        }> = [];

        for (const [key, samples] of groups) {
            const [engineName, metricName] = key.split(":");
            const values = samples.map(s => s.value);
            const min = Math.min(...values);
            const max = Math.max(...values);
            const avg = values.reduce((a, b) => a + b, 0) / values.length;
            const lastUpdated = Math.max(...samples.map(s => s.timestamp));

            result.push({
                engineName,
                metricName,
                min,
                max,
                avg,
                count: samples.length,
                unit: samples[0].unit,
                lastUpdated
            });
        }

        return result;
    }

    public async reset(engineName?: string): Promise<void> {
        if (engineName) {
            for (let i = this.samples.length - 1; i >= 0; i--) {
                if (this.samples[i].engineName === engineName) {
                    this.samples.splice(i, 1);
                }
            }
        } else {
            this.samples.length = 0;
        }
    }
}
