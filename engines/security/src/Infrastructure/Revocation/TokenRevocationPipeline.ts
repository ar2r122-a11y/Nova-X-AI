import type { ISecurityEngine } from "../../Contracts";

export class TokenRevocationPipeline {
    private security: ISecurityEngine | null = null;

    setSecurity(security: ISecurityEngine): void {
        this.security = security;
    }

    async revoke(tokenId: string, reason: string): Promise<void> {
        if (!this.security) {
            throw new Error("Security engine not configured for TokenRevocationPipeline");
        }

        await this.security.revokeToken(tokenId, reason);
    }

    async revokeAllForIdentity(identityId: string, reason: string): Promise<void> {
        if (!this.security) {
            throw new Error("Security engine not configured for TokenRevocationPipeline");
        }

        const sessions = this.security.getSessions();
        for (const session of sessions) {
            if (session.identityId === identityId && session.status === "active") {
                await this.security.revokeToken(session.sessionId, reason);
            }
        }
    }
}
