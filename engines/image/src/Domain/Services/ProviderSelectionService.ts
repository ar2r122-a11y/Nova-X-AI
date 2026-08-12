
import { ProviderExecutionState } from "../Entities/ProviderExecutionState";

export class ProviderSelectionService {
    public selectProvider(providers: ProviderExecutionState[], preferredProvider?: string): string {
        const available = providers.filter(p => p.isAvailable && p.health === "healthy");
        if (available.length === 0) {
            throw new Error("No available providers.");
        }
        if (preferredProvider) {
            const preferred = available.find(p => p.providerId === preferredProvider);
            if (preferred) {
                return preferred.providerId;
            }
        }
        available.sort((a, b) => a.latencyMs - b.latencyMs);
        return available[0].providerId;
    }

    public getFallbackProvider(providers: ProviderExecutionState[], currentProviderId: string): string {
        const available = providers.filter(p => p.isAvailable && p.providerId !== currentProviderId);
        if (available.length === 0) {
            throw new Error("No fallback providers available.");
        }
        available.sort((a, b) => a.latencyMs - b.latencyMs);
        return available[0].providerId;
    }
}
