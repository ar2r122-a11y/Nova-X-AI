import { IQuery } from "@nova-x-ai/core";
import type { GetTelemetryEventsQuery as IGetTelemetryEventsQuery } from "../../Contracts/IAnalyticsEngine";

export class GetTelemetryEventsQuery implements IQuery, IGetTelemetryEventsQuery {
    constructor(
        public readonly eventType?: string,
        public readonly startTime?: number,
        public readonly endTime?: number,
        public readonly limit: number = 100,
        public readonly requesterId: string = "anonymous"
    ) {}
}
