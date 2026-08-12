import { VoiceProviderId } from "../ValueObjects/VoiceProviderId";
import { ProviderCostMetadata } from "../ValueObjects/ProviderCostMetadata";
import { VoiceProfile } from "../Entities/VoiceProfile";
import { VoiceStateRef } from "../ValueObjects/VoiceState";

export class FreeFirstProviderPolicy {
    static selectProvider(
        candidates: { providerId: VoiceProviderId; cost: ProviderCostMetadata; health: "healthy" | "degraded" | "unhealthy"; supportsStreaming: boolean }[],
        freeOnly: boolean,
        providerHint?: string
    ): { providerId: VoiceProviderId; cost: ProviderCostMetadata } | null {
        const eligible = candidates.filter(c => {
            if (freeOnly && !c.cost.isFree()) {
                return false;
            }
            if (c.health === "unhealthy") {
                return false;
            }
            if (!c.supportsStreaming) {
                return false;
            }
            return true;
        });

        if (eligible.length === 0) {
            return null;
        }

        if (providerHint) {
            const hinted = eligible.find(c => c.providerId.getValue() === providerHint);
            if (hinted) {
                return { providerId: hinted.providerId, cost: hinted.cost };
            }
        }

        const freeProviders = eligible.filter(c => c.cost.isFree());
        const healthyFree = freeProviders.filter(c => c.health === "healthy");

        if (healthyFree.length > 0) {
            return { providerId: healthyFree[0].providerId, cost: healthyFree[0].cost };
        }

        if (freeProviders.length > 0) {
            return { providerId: freeProviders[0].providerId, cost: freeProviders[0].cost };
        }

        if (!freeOnly && eligible.length > 0) {
            return { providerId: eligible[0].providerId, cost: eligible[0].cost };
        }

        return null;
    }

    static canFallbackToPaid(freeOnly: boolean): boolean {
        return !freeOnly;
    }
}
