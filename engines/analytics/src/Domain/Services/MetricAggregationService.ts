import { Metric } from "../Entities/Metric";
import { MetricType } from "../ValueObjects/MetricType";

export class MetricAggregationService {
    aggregateByFeature(metrics: Metric[]): Map<string, { count: number; totalValue: number }> {
        const map = new Map<string, { count: number; totalValue: number }>();
        for (const metric of metrics) {
            if (metric.getType() !== MetricType.FeatureUsage) continue;
            const tag = metric.getFeatureTag()?.getValue() ?? "unknown";
            const current = map.get(tag) ?? { count: 0, totalValue: 0 };
            current.count += 1;
            current.totalValue += metric.getValue().getValue();
            map.set(tag, current);
        }
        return map;
    }

    aggregatePerformance(metrics: Metric[]): Map<string, { count: number; avgValue: number; maxValue: number }> {
        const map = new Map<string, { count: number; avgValue: number; maxValue: number }>();
        for (const metric of metrics) {
            if (metric.getType() !== MetricType.Performance) continue;
            const tag = metric.getPerformanceTag()?.getValue() ?? "unknown";
            const current = map.get(tag) ?? { count: 0, avgValue: 0, maxValue: 0 };
            current.count += 1;
            current.avgValue = (current.avgValue * (current.count - 1) + metric.getValue().getValue()) / current.count;
            current.maxValue = Math.max(current.maxValue, metric.getValue().getValue());
            map.set(tag, current);
        }
        return map;
    }

    calculateTokenUsage(metrics: Metric[]): { totalTokens: number; totalCost: number } {
        let totalTokens = 0;
        let totalCost = 0;
        for (const metric of metrics) {
            if (metric.getType() === MetricType.TokenUsage) {
                totalTokens += metric.getValue().getValue();
            } else if (metric.getType() === MetricType.Cost) {
                totalCost += metric.getValue().getValue();
            }
        }
        return { totalTokens, totalCost };
    }
}
