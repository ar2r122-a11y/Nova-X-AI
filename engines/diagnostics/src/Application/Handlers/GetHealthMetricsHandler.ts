import type { IQueryHandler } from "@nova-x-ai/core";
import type { GetHealthMetricsQuery } from "../Queries/GetHealthMetricsQuery";
import type { HealthMetricsDto } from "../DTOs/HealthMetricsDto";

export class GetHealthMetricsHandler implements IQueryHandler<GetHealthMetricsQuery, HealthMetricsDto> {
    constructor(
        private readonly healthProbe: {
            probeAll(): Promise<Array<{
                engineName: string;
                healthy: boolean;
                durationMs: number;
                message: string | null;
            }>>;
        },
        private readonly metricsAggregator: {
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
        }
    ) {}

    public async handle(query: GetHealthMetricsQuery): Promise<HealthMetricsDto> {
        const healthReports = await this.healthProbe.probeAll();
        const metrics = await this.metricsAggregator.getAggregates(query.engineName);

        const overallHealthy = healthReports.length === 0 ? true : healthReports.every(h => h.healthy);

        return {
            metrics: metrics.map(m => ({
                engineName: m.engineName,
                metricName: m.metricName,
                value: m.avg,
                unit: m.unit,
                timestamp: m.lastUpdated,
                tags: {}
            })),
            overallHealthy,
            generatedAt: Date.now()
        };
    }
}
