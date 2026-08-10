import { ICoreModule } from "@nova-x-ai/core";
import type { IContainer, IEventBus } from "@nova-x-ai/core";
import type { ISecurityEngine } from "../Contracts";
import { SecurityEngineAggregate } from "../Domain/Aggregates";
import { SecurityBudgetDto, SecurityClaimsDto, PermissionResultDto, SessionValidationResultDto, VaultStatusDto, AuditLogDto } from "../Application/DTO";
import { SecuritySession, SecurityToken, SecurityPolicy, CredentialVaultEntry, AuditLogEntry } from "../Domain/Entities";
import { LockoutReason } from "../Domain/ValueObjects";
import { WebCryptoAdapter } from "../Infrastructure/Crypto/WebCryptoAdapter";
import { SecureCredentialVault } from "../Infrastructure/Vault/SecureCredentialVault";
import { RBACPolicyEvaluator } from "../Infrastructure/Policies/RBACPolicyEvaluator";
import { ABACPolicyEvaluator } from "../Infrastructure/Policies/ABACPolicyEvaluator";
import { PayloadSanitizer } from "../Infrastructure/Sanitization/PayloadSanitizer";
import { AuditLogger } from "../Infrastructure/Audit/AuditLogger";
import { SecurityBudgetAllocator } from "../Infrastructure/Budget/SecurityBudgetAllocator";
import { LockoutManager } from "../Infrastructure/Lockout/LockoutManager";
import { TokenRevocationPipeline } from "../Infrastructure/Revocation/TokenRevocationPipeline";
import { CrossEngineSecurityCoordinator } from "../Infrastructure/Coordinator/CrossEngineSecurityCoordinator";
import { SecurityProjectionUpdater } from "../Infrastructure/ProjectionUpdater";
import { SecurityRecoveryWorker } from "../Infrastructure/RecoveryWorker";
import { SessionStreamingWorker, TokenAccumulator, IdentityChunkAssembler } from "../Infrastructure/Workers";
import type { ISecurityWorker } from "../Contracts";

export class SecurityEngineModule implements ICoreModule {
    readonly moduleName = "@nova-x-ai/security";
    private security: ISecurityEngine | null = null;
    private workers: ISecurityWorker[] = [];

    configureServices(_container: IContainer): void {}

    async onInit(): Promise<void> {
        const aggregate = new SecurityEngineAggregate();
        const crypto = new WebCryptoAdapter();
        const vault = new SecureCredentialVault(crypto);
        const rbac = new RBACPolicyEvaluator();
        const abac = new ABACPolicyEvaluator();
        const sanitizer = new PayloadSanitizer();
        const auditLogger = new AuditLogger(aggregate);
        const budgetAllocator = new SecurityBudgetAllocator(SecurityBudgetDto.create());
        const lockoutManager = new LockoutManager();
        const revocationPipeline = new TokenRevocationPipeline();
        const coordinator = new CrossEngineSecurityCoordinator();
        const eventBus = {} as IEventBus;

        const securityImpl: ISecurityEngine = {
            get eventBus() { return eventBus; },
            getAggregate: () => aggregate,
            async authenticateToken(token: string, identityId: string): Promise<SecurityClaimsDto> {
                const sessionId = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
                const roles = ["user"];
                const permissions = ["read"];
                const claims = new SecurityClaimsDto(identityId, roles, permissions, sessionId, Date.now() + 3600000);
                const session = {
                    sessionId,
                    identityId,
                    claims: {},
                    roles,
                    permissions,
                    nonce: `nonce-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                    createdAt: Date.now(),
                    expiresAt: Date.now() + 3600000,
                    lastValidatedAt: Date.now(),
                    status: "active" as const,
                    retryCount: 0
                };
                aggregate.registerSession(session);
                return claims;
            },
            async validatePermissions(identityId: string, resource: string, action: string, claims?: Record<string, unknown>): Promise<PermissionResultDto> {
                const rbacResult = rbac.evaluate(identityId, resource, action, claims);
                if (rbacResult.allowed) return rbacResult;
                return abac.evaluate(identityId, resource, action, claims);
            },
            async registerSession(session: SecuritySession): Promise<void> {
                aggregate.registerSession(session);
            },
            async revokeToken(tokenId: string, reason: string): Promise<void> {
                aggregate.revokeToken(tokenId);
                await auditLogger.log({
                    identityId: tokenId,
                    action: "token_revoked",
                    resource: tokenId,
                    result: "success",
                    correlationId: `security-${Date.now()}`,
                    metadata: { reason }
                });
            },
            async rotateKey(keyId: string, newKeyId: string): Promise<void> {
                await crypto.rotateKey(keyId, newKeyId);
            },
            async sanitizePayload(payload: unknown, resource: string): Promise<number> {
                const result = await sanitizer.sanitize(payload, resource);
                return result.threatsRemoved;
            },
            async lockoutIdentity(identityId: string, reason: string): Promise<void> {
                aggregate.setState("locked");
                const sessions = aggregate.getSessions().filter(s => s.identityId === identityId);
                for (const session of sessions) {
                    if (session.status === "active") {
                        aggregate.lockSession(session.sessionId, LockoutReason.maxRetriesExceeded());
                    }
                }
            },
            getSession(sessionId: string): SecuritySession | undefined {
                return aggregate.getSession(sessionId);
            },
            getSessions(): SecuritySession[] {
                return aggregate.getSessions();
            },
            getToken(tokenId: string): SecurityToken | undefined {
                return aggregate.getToken(tokenId);
            },
            async addToken(token: SecurityToken): Promise<void> {
                aggregate.addToken(token);
            },
            async addPolicy(policy: SecurityPolicy): Promise<void> {
                aggregate.addPolicy(policy);
                rbac.addPolicy(policy);
                abac.addPolicy(policy);
            },
            getPolicies(): SecurityPolicy[] {
                return aggregate.getAllPolicies();
            },
            async storeVaultEntry(entry: CredentialVaultEntry): Promise<void> {
                await vault.store(entry);
                aggregate.storeVaultEntry(entry);
            },
            getVaultEntry(credentialId: string): CredentialVaultEntry | undefined {
                return aggregate.getVaultEntry(credentialId);
            },
            getVaultEntries(identityId?: string): CredentialVaultEntry[] {
                return Array.from(aggregate.getSessions()).map(s => ({} as any));
            },
            async removeVaultEntry(credentialId: string): Promise<boolean> {
                return vault.delete(credentialId);
            },
            async appendAuditLog(entry: AuditLogEntry): Promise<void> {
                await auditLogger.log(entry);
            },
            getAuditLog(identityId?: string, limit: number = 100): Promise<AuditLogEntry[]> {
                return auditLogger.getLog(identityId, limit);
            },
            getSecurityBudget(): SecurityBudgetDto {
                return budgetAllocator.getBudget();
            },
            setBudget(budget: SecurityBudgetDto): void {
                budgetAllocator.updateBudget(budget);
            }
        };

        this.security = securityImpl;

        lockoutManager.setSecurity(securityImpl);
        revocationPipeline.setSecurity(securityImpl);
        coordinator.setSecurity(securityImpl);
        coordinator.setEventBus(eventBus);

        const projectionUpdater = new SecurityProjectionUpdater();
        const recoveryWorker = new SecurityRecoveryWorker();
        const sessionStreamingWorker = new SessionStreamingWorker();
        const tokenAccumulator = new TokenAccumulator();
        const identityChunkAssembler = new IdentityChunkAssembler();

        sessionStreamingWorker.setSecurity(securityImpl);

        this.workers = [projectionUpdater, recoveryWorker, sessionStreamingWorker, tokenAccumulator, identityChunkAssembler];

        for (const worker of this.workers) {
            await worker.start();
        }
    }

    async onDestroy(): Promise<void> {
        for (const worker of this.workers) {
            await worker.stop();
        }
        if (this.security) {
            (this.security as any).getAggregate().setState("stopped");
        }
    }

    getSecurity(): ISecurityEngine | null {
        return this.security;
    }
}
