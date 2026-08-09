/**
 * Nova X AI
 * AI Router
 * Domain Event: ProviderStatusChangedEvent
 *
 * Internal domain event raised when a provider's status changes.
 */
import type { ProviderRegistration } from "../Entities/ProviderRegistration";
import type { ProviderHealth } from "../ValueObjects/ProviderHealth";

export class ProviderStatusChangedEvent {

    public readonly eventType =
        "AI_Router_ProviderStatusChanged";

    public readonly timestamp: number;

    public readonly providerId: string;

    public readonly providerName: string;

    public readonly healthStatus: string;

    public readonly wasActive: boolean;

    constructor(
        provider: ProviderRegistration,
        health: ProviderHealth,
        timestamp: number = Date.now()
    ) {

        this.timestamp = timestamp;

        this.providerId = provider.id.value;

        this.providerName = provider.name;

        this.healthStatus = health.status;

        this.wasActive = provider.isActiveProvider();

    }

}
