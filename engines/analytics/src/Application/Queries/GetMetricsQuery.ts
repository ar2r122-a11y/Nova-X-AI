import { IQuery } from "@nova-x-ai/core";
import type { GetMetricsQuery as IGetMetricsQuery } from "../../Contracts/IAnalyticsEngine";
import { MetricType } from "../../Domain/ValueObjects/MetricType";

export class GetMetricsQuery implements IQuery, IGetMetricsQuery {
    constructor(
        public readonly metricType?: MetricType,
        public readonly startTime?: number,
        public readonly endTime?: number,
        public readonly limit: number = 100,
        public readonly requesterId: string = "anonymous"
    ) {}
}
