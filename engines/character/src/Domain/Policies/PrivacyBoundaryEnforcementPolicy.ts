
import { CharacterAggregate } from "../Aggregates";

export class PrivacyBoundaryEnforcementPolicy {
    public enforce(
        character: CharacterAggregate,
        requesterId: string,
        userRoles: string[]
    ): { allowed: boolean; sanitizedContext?: string } {
        const isAdmin = userRoles.includes("admin");
        const isOwner = character.getIdentity().id.getValue() === requesterId;

        if (isAdmin || isOwner) {
            return { allowed: true };
        }

        const sanitizedContext = this.buildSanitizedContext(character);
        return { allowed: false, sanitizedContext };
    }

    private buildSanitizedContext(character: CharacterAggregate): string {
        const identity = character.getIdentity();
        const profile = character.getProfile();
        const state = character.getState();

        const parts: string[] = [];
        parts.push(`Identity: ${identity.name} (${identity.title})`);
        parts.push(`Status: ${state.status.getValue()}`);
        parts.push(`Location: ${state.currentLocation.getValue()}`);
        parts.push(`Biography: ${profile.biography.slice(0, 200)}...`);
        parts.push("[Restricted content redacted]");

        return parts.join("\n");
    }
}
