import { IQuery } from "@nova-x-ai/core";
import type { GetPerformanceMetricsQuery as IGetPerformanceMetricsQuery } from "../../Contracts/IAnalyticsEngine";

export class GetPerformanceMetricsQuery implements IQuery, IGetPerformanceMetricsQuery {
    constructor(
        public readonly performanceTag?: string,
        public readonly startTime?: number,
        public readonly endTime?: number,
        public readonly limit: number = 100,
        public readonly requesterId: string = "anonymous"
    ) {}
}
