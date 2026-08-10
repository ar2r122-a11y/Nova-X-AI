import type { ICommandHandler } from "@nova-x-ai/core";
import type { ISecurityEngine } from "../../Contracts";
import { AuthenticateTokenCommand } from "../Commands";
import { SessionValidatedEvent } from "../../Domain/Events";
import { SessionId, SecurityNonce } from "../../Domain/ValueObjects";

export class AuthenticateTokenHandler implements ICommandHandler<AuthenticateTokenCommand> {
    constructor(private readonly security: ISecurityEngine) {}

    async handle(command: AuthenticateTokenCommand): Promise<void> {
        const sessionId = SessionId.create();
        const nonce = SecurityNonce.create();

        const claims = await this.security.authenticateToken(command.token, command.identityId);

        const session = {
            sessionId: sessionId.getValue(),
            identityId: command.identityId,
            claims: {} as Record<string, unknown>,
            roles: claims.roles,
            permissions: claims.permissions,
            nonce: nonce.getValue(),
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
            lastValidatedAt: Date.now(),
            status: "active" as const,
            retryCount: 0
        };

        await this.security.registerSession(session);

        const correlationId = `security-${Date.now()}`;
        await this.security.eventBus.publish(
            new SessionValidatedEvent(
                sessionId.getValue(),
                command.identityId,
                claims.roles,
                claims.permissions,
                correlationId
            )
        );
    }
}
