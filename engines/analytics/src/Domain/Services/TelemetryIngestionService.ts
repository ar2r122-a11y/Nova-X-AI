import { TelemetryEvent } from "../Entities/TelemetryEvent";
import { PIIMaskingPolicy } from "../Policies/PIIMaskingPolicy";

export class TelemetryIngestionService {
    ingest(event: TelemetryEvent): { event: TelemetryEvent; fieldsStripped: string[] } {
        const { sanitized, fieldsStripped } = PIIMaskingPolicy.stripPII(event.getPayload());
        const updatedEvent = TelemetryEvent.reconstitute({
            ...event.toSnapshot(),
            payload: sanitized
        });
        return { event: updatedEvent, fieldsStripped };
    }
}
