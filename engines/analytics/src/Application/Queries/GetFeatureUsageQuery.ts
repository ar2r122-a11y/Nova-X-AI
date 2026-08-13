import { IQuery } from "@nova-x-ai/core";
import type { GetFeatureUsageQuery as IGetFeatureUsageQuery } from "../../Contracts/IAnalyticsEngine";

export class GetFeatureUsageQuery implements IQuery, IGetFeatureUsageQuery {
    constructor(
        public readonly feature?: string,
        public readonly startTime?: number,
        public readonly endTime?: number,
        public readonly limit: number = 100,
        public readonly requesterId: string = "anonymous"
    ) {}
}
