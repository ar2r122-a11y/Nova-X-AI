import type { ISafetyEventManager } from "../../Contracts";
import type { SafetyEvent } from "../../Domain/Entities";

export class SafetyEventManager implements ISafetyEventManager {
    private events: SafetyEvent[] = [];

    async logEvent(event: Omit<SafetyEvent, "eventId" | "timestamp" | "correlationId">): Promise<SafetyEvent> {
        const safetyEvent: SafetyEvent = {
            ...event,
            eventId: `safety-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            timestamp: Date.now(),
            correlationId: `security-${Date.now()}`
        };

        this.events.push(safetyEvent);
        return safetyEvent;
    }

    async getEvents(identityId?: string, severity?: string, limit: number = 100): Promise<SafetyEvent[]> {
        let filtered = this.events;

        if (identityId) {
            filtered = filtered.filter(e => e.identityId === identityId);
        }

        if (severity) {
            filtered = filtered.filter(e => e.severity === severity);
        }

        return filtered.slice(-limit);
    }
}
