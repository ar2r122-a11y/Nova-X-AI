import { SecuritySession, SecurityToken, SecurityPolicy, CredentialVaultEntry, AuditLogEntry, ContentBoundary, AgeControl, ProviderPolicy, SafetyEvent } from "../Entities";
import { SessionValidatedEvent, LockoutEvent, TokenRevokedEvent, KeyRotatedEvent, ContentBoundaryViolationEvent, AgeControlViolationEvent, SafetyViolationEvent, ProviderPolicyIncompatibleEvent } from "../Events";
import { SessionId } from "../ValueObjects";
import { LockoutReason } from "../ValueObjects";

export class SecurityEngineAggregate {
    private readonly sessions = new Map<string, SecuritySession>();
    private readonly tokens = new Map<string, SecurityToken>();
    private readonly policies = new Map<string, SecurityPolicy>();
    private readonly vaultEntries = new Map<string, CredentialVaultEntry>();
    private readonly auditLog: AuditLogEntry[] = [];
    private readonly contentBoundaries = new Map<string, ContentBoundary>();
    private readonly ageControls = new Map<string, AgeControl>();
    private readonly providerPolicies = new Map<string, ProviderPolicy>();
    private readonly safetyEvents: SafetyEvent[] = [];
    private state: "initialized" | "running" | "locked" | "failed" | "stopped" = "initialized";
    private lockoutReason: LockoutReason | null = null;

    constructor() {}

    public registerSession(session: SecuritySession): void {
        this.sessions.set(session.sessionId, session);
    }

    public validateSession(sessionId: string): SecuritySession | undefined {
        const session = this.sessions.get(sessionId);
        if (!session) return undefined;

        if (session.status === "locked") {
            return undefined;
        }

        if (session.expiresAt < Date.now()) {
            return undefined;
        }

        return session;
    }

    public incrementRetry(sessionId: string): SecuritySession | undefined {
        const session = this.sessions.get(sessionId);
        if (!session) return undefined;

        const updated: SecuritySession = {
            ...session,
            retryCount: session.retryCount + 1,
            lastValidatedAt: Date.now()
        };

        this.sessions.set(sessionId, updated);
        return updated;
    }

    public lockSession(sessionId: string, reason: LockoutReason): SecuritySession | undefined {
        const session = this.sessions.get(sessionId);
        if (!session) return undefined;

        const locked: SecuritySession = {
            ...session,
            status: "locked",
            lockoutReason: reason.getValue(),
            lastValidatedAt: Date.now()
        };

        this.sessions.set(sessionId, locked);
        this.state = "locked";
        this.lockoutReason = reason;
        return locked;
    }

    public revokeToken(tokenId: string): SecurityToken | undefined {
        const token = this.tokens.get(tokenId);
        if (!token) return undefined;

        const revoked: SecurityToken = {
            ...token,
            revoked: true,
            lastUsedAt: Date.now()
        };

        this.tokens.set(tokenId, revoked);
        return revoked;
    }

    public rotateTokenKey(tokenId: string, newHashedToken: string): SecurityToken | undefined {
        const token = this.tokens.get(tokenId);
        if (!token) return undefined;

        const rotated: SecurityToken = {
            ...token,
            hashedToken: newHashedToken,
            rotationCount: token.rotationCount + 1,
            lastUsedAt: Date.now()
        };

        this.tokens.set(tokenId, rotated);
        return rotated;
    }

    public addPolicy(policy: SecurityPolicy): void {
        this.policies.set(policy.policyId, policy);
    }

    public getPolicy(policyId: string): SecurityPolicy | undefined {
        return this.policies.get(policyId);
    }

    public getAllPolicies(): SecurityPolicy[] {
        return Array.from(this.policies.values()).sort((a, b) => b.priority - a.priority);
    }

    public storeVaultEntry(entry: CredentialVaultEntry): void {
        this.vaultEntries.set(entry.credentialId, entry);
    }

    public getVaultEntry(credentialId: string): CredentialVaultEntry | undefined {
        return this.vaultEntries.get(credentialId);
    }

    public removeVaultEntry(credentialId: string): boolean {
        return this.vaultEntries.delete(credentialId);
    }

    public appendAuditLog(entry: AuditLogEntry): void {
        this.auditLog.push(entry);
    }

    public getAuditLog(): AuditLogEntry[] {
        return [...this.auditLog];
    }

    public getSession(sessionId: string): SecuritySession | undefined {
        return this.sessions.get(sessionId);
    }

    public getSessions(): SecuritySession[] {
        return Array.from(this.sessions.values());
    }

    public getToken(tokenId: string): SecurityToken | undefined {
        return this.tokens.get(tokenId);
    }

    public addToken(token: SecurityToken): void {
        this.tokens.set(token.tokenId, token);
    }

    public removeToken(tokenId: string): boolean {
        return this.tokens.delete(tokenId);
    }

    public setState(state: "initialized" | "running" | "locked" | "failed" | "stopped"): void {
        this.state = state;
    }

    public getState(): string {
        return this.state;
    }

    public getLockoutReason(): LockoutReason | null {
        return this.lockoutReason;
    }

    public addContentBoundary(boundary: ContentBoundary): void {
        this.contentBoundaries.set(boundary.boundaryId, boundary);
    }

    public getContentBoundary(boundaryId: string): ContentBoundary | undefined {
        return this.contentBoundaries.get(boundaryId);
    }

    public getContentBoundaries(identityId?: string): ContentBoundary[] {
        const all = Array.from(this.contentBoundaries.values());
        if (!identityId) return all;
        return all.filter(b => b.identityId === identityId || !b.identityId);
    }

    public addAgeControl(control: AgeControl): void {
        this.ageControls.set(control.controlId, control);
    }

    public getAgeControl(controlId: string): AgeControl | undefined {
        return this.ageControls.get(controlId);
    }

    public getAgeControls(identityId: string): AgeControl[] {
        return Array.from(this.ageControls.values()).filter(c => c.identityId === identityId);
    }

    public addProviderPolicy(policy: ProviderPolicy): void {
        this.providerPolicies.set(policy.policyId, policy);
    }

    public getProviderPolicy(policyId: string): ProviderPolicy | undefined {
        return this.providerPolicies.get(policyId);
    }

    public getAllProviderPolicies(): ProviderPolicy[] {
        return Array.from(this.providerPolicies.values());
    }

    public appendSafetyEvent(event: SafetyEvent): void {
        this.safetyEvents.push(event);
    }

    public getSafetyEvents(limit: number = 100): SafetyEvent[] {
        return this.safetyEvents.slice(-limit);
    }
}
