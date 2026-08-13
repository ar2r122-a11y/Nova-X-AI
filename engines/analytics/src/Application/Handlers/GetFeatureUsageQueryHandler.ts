import { GetFeatureUsageQuery } from "../Queries/GetFeatureUsageQuery";
import { FeatureUsageMetricDto } from "../DTO/FeatureUsageMetricDto";
import { PrivacyPolicy } from "../../Domain/Policies/PrivacyPolicy";
import { MetricAggregationService } from "../../Domain/Services/MetricAggregationService";
import type { IMetricRepository } from "../../Domain/Repositories/IMetricRepository";

export class GetFeatureUsageQueryHandler {
    constructor(
        private readonly metricRepository: IMetricRepository,
        private readonly aggregationService: MetricAggregationService
    ) {}

    async handle(query: GetFeatureUsageQuery): Promise<FeatureUsageMetricDto[]> {
        if (!PrivacyPolicy.canAccessMetrics(query.requesterId, query.requesterId)) {
            throw new Error("Unauthorized: requester cannot access feature usage.");
        }

        let metrics = await this.metricRepository.getAll();

        if (query.feature) {
            metrics = metrics.filter((m) => m.getFeatureTag()?.getValue() === query.feature);
        }
        const startTime = query.startTime;
        const endTime = query.endTime;
        if (startTime !== undefined) {
            metrics = metrics.filter((m) => m.getRecordedAt() >= startTime);
        }
        if (endTime !== undefined) {
            metrics = metrics.filter((m) => m.getRecordedAt() <= endTime);
        }

        const aggregated = this.aggregationService.aggregateByFeature(metrics);

        return Array.from(aggregated.entries()).map(([feature, data]) => new FeatureUsageMetricDto(
            feature,
            data.count,
            data.totalValue,
            data.count > 0 ? data.totalValue / data.count : 0
        ));
    }
}
