import { GetMetricsQuery } from "../Queries/GetMetricsQuery";
import { MetricDto } from "../DTO/MetricDto";
import { PrivacyPolicy } from "../../Domain/Policies/PrivacyPolicy";
import type { IMetricRepository } from "../../Domain/Repositories/IMetricRepository";

export class GetMetricsQueryHandler {
    constructor(private readonly metricRepository: IMetricRepository) {}

    async handle(query: GetMetricsQuery): Promise<MetricDto[]> {
        if (!PrivacyPolicy.canAccessMetrics(query.requesterId, query.requesterId)) {
            throw new Error("Unauthorized: requester cannot access metrics.");
        }

        let metrics = await this.metricRepository.getAll();

        if (query.metricType) {
            metrics = metrics.filter((m) => m.getType() === query.metricType);
        }
        const startTime = query.startTime;
        const endTime = query.endTime;
        if (startTime !== undefined) {
            metrics = metrics.filter((m) => m.getRecordedAt() >= startTime);
        }
        if (endTime !== undefined) {
            metrics = metrics.filter((m) => m.getRecordedAt() <= endTime);
        }

        metrics = metrics.slice(0, query.limit);

        return metrics.map((m) => new MetricDto(
            m.getId().getValue(),
            m.getType(),
            m.getName(),
            m.getValue().getValue(),
            m.getValue().getUnit(),
            m.getTags(),
            m.getPIIMask().isMasked(),
            m.getRecordedAt(),
            m.getFeatureTag()?.getValue(),
            m.getPerformanceTag()?.getValue(),
            m.getSessionId(),
            m.getEngineSource(),
            m.getCorrelationId()
        ));
    }
}
