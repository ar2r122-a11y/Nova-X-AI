import { ICommand } from "@nova-x-ai/core";
import type { RecordTelemetryEventCommand as IRecordTelemetryEventCommand } from "../../Contracts/IAnalyticsEngine";

export class RecordTelemetryEventCommand implements ICommand, IRecordTelemetryEventCommand {
    constructor(
        public readonly eventType: string,
        public readonly payload: Record<string, unknown>,
        public readonly correlationId?: string,
        public readonly engineSource?: string
    ) {}
}
