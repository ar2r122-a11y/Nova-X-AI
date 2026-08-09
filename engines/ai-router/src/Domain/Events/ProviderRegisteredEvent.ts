/**
 * Nova X AI
 * AI Router
 * Domain Event: ProviderRegisteredEvent
 *
 * Internal domain event raised when a provider is registered.
 */
import type { ProviderRegistration } from "../Entities/ProviderRegistration";

export class ProviderRegisteredEvent {

    public readonly eventType =
        "AI_Router_ProviderRegistered";

    public readonly timestamp: number;

    public readonly providerId: string;

    public readonly providerName: string;

    constructor(
        provider: ProviderRegistration,
        timestamp: number = Date.now()
    ) {

        this.timestamp = timestamp;

        this.providerId = provider.id.value;

        this.providerName = provider.name;

    }

}
