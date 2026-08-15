import type { IEventBus } from "@nova-x-ai/core";
import { StorySecurityContext } from "./StorySecurityContext";

export class StorySecurityBoundary {
    constructor(private readonly eventBus: IEventBus) {}

    async authorizeCommand(command: { claims?: { roles?: string[] }; userId?: string }, context: StorySecurityContext): Promise<void> {
        if (!context) {
            throw new Error("Security context is required.");
        }
        if (context.isExpired()) {
            throw new Error("Security context has expired.");
        }
        context.validateNonce();

        const requiredRoles = command.claims?.roles ?? [];
        const hasRole = requiredRoles.length === 0 || requiredRoles.some((role) => context.hasRole(role));
        if (!hasRole) {
            await this.eventBus.publish({
                eventType: "EVT_STORY_SecurityAuthorizationFailed",
                timestamp: Date.now(),
                correlationId: context.correlationId,
                payload: {
                    userId: context.userId,
                    command: command,
                    reason: "Role authorization failed",
                },
            });
            throw new Error("Unauthorized: insufficient roles.");
        }
    }

    async authorizeQuery(_query: { requesterId?: string }, context: StorySecurityContext): Promise<void> {
        if (!context) {
            throw new Error("Security context is required.");
        }
        if (context.isExpired()) {
            throw new Error("Security context has expired.");
        }
        context.validateNonce();
    }

    validateNonce(context: StorySecurityContext): void {
        context.validateNonce();
    }

    detectTamper(payload: unknown): boolean {
        return StorySecurityContext.detectTamper(payload);
    }
}
