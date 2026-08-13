import { ICommand } from "@nova-x-ai/core";
import type { RecordMetricCommand as IRecordMetricCommand } from "../../Contracts/IAnalyticsEngine";
import { MetricType } from "../../Domain/ValueObjects/MetricType";

export class RecordMetricCommand implements ICommand, IRecordMetricCommand {
    constructor(
        public readonly type: MetricType,
        public readonly name: string,
        public readonly value: number,
        public readonly unit: string,
        public readonly tags: string[],
        public readonly featureTag?: string,
        public readonly performanceTag?: string,
        public readonly sessionId?: string,
        public readonly engineSource?: string,
        public readonly correlationId?: string
    ) {}
}
