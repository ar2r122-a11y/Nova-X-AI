import { GetPerformanceMetricsQuery } from "../Queries/GetPerformanceMetricsQuery";
import { PerformanceMetricDto } from "../DTO/PerformanceMetricDto";
import { PrivacyPolicy } from "../../Domain/Policies/PrivacyPolicy";
import { MetricAggregationService } from "../../Domain/Services/MetricAggregationService";
import type { IMetricRepository } from "../../Domain/Repositories/IMetricRepository";

export class GetPerformanceMetricsQueryHandler {
    constructor(
        private readonly metricRepository: IMetricRepository,
        private readonly aggregationService: MetricAggregationService
    ) {}

    async handle(query: GetPerformanceMetricsQuery): Promise<PerformanceMetricDto[]> {
        if (!PrivacyPolicy.canAccessMetrics(query.requesterId, query.requesterId)) {
            throw new Error("Unauthorized: requester cannot access performance metrics.");
        }

        let metrics = await this.metricRepository.getAll();

        if (query.performanceTag) {
            metrics = metrics.filter((m) => m.getPerformanceTag()?.getValue() === query.performanceTag);
        }
        const startTime = query.startTime;
        const endTime = query.endTime;
        if (startTime !== undefined) {
            metrics = metrics.filter((m) => m.getRecordedAt() >= startTime);
        }
        if (endTime !== undefined) {
            metrics = metrics.filter((m) => m.getRecordedAt() <= endTime);
        }

        const aggregated = this.aggregationService.aggregatePerformance(metrics);

        return Array.from(aggregated.entries()).map(([tag, data]) => new PerformanceMetricDto(
            tag,
            data.count,
            data.avgValue,
            data.maxValue
        ));
    }
}
