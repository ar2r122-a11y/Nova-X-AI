import { GetTelemetryEventsQuery } from "../Queries/GetTelemetryEventsQuery";
import { TelemetryEventDto } from "../DTO/TelemetryEventDto";
import { PrivacyPolicy } from "../../Domain/Policies/PrivacyPolicy";
import type { ITelemetryEventRepository } from "../../Domain/Repositories/ITelemetryEventRepository";

export class GetTelemetryEventsQueryHandler {
    constructor(private readonly telemetryEventRepository: ITelemetryEventRepository) {}

    async handle(query: GetTelemetryEventsQuery): Promise<TelemetryEventDto[]> {
        if (!PrivacyPolicy.canAccessMetrics(query.requesterId, query.requesterId)) {
            throw new Error("Unauthorized: requester cannot access telemetry events.");
        }

        let events = await this.telemetryEventRepository.getAll();

        if (query.eventType) {
            events = events.filter((e) => e.getEventType() === query.eventType);
        }
        const startTime = query.startTime;
        const endTime = query.endTime;
        if (startTime !== undefined) {
            events = events.filter((e) => e.getTimestamp() >= startTime);
        }
        if (endTime !== undefined) {
            events = events.filter((e) => e.getTimestamp() <= endTime);
        }

        events = events.slice(0, query.limit);

        return events.map((e) => new TelemetryEventDto(
            e.getId().getValue(),
            e.getEventType(),
            e.getPayload(),
            e.getPIIMask().isMasked(),
            e.getTimestamp(),
            e.getCorrelationId(),
            e.getEngineSource()
        ));
    }
}
