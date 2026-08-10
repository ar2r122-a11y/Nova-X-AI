import type { ISecurityEngine } from "../../Contracts";
import { LockoutReason } from "../../Domain/ValueObjects";

export class LockoutManager {
    private maxRetries = 5;
    private security: ISecurityEngine | null = null;

    setSecurity(security: ISecurityEngine): void {
        this.security = security;
    }

    setMaxRetries(maxRetries: number): void {
        this.maxRetries = maxRetries;
    }

    async checkAndLockout(identityId: string, retryCount: number): Promise<boolean> {
        if (retryCount >= this.maxRetries && this.security) {
            await this.security.lockoutIdentity(identityId, LockoutReason.maxRetriesExceeded().getValue());
            return true;
        }
        return false;
    }

    async lockout(identityId: string, reason: LockoutReason): Promise<void> {
        if (this.security) {
            await this.security.lockoutIdentity(identityId, reason.getValue());
        }
    }
}
