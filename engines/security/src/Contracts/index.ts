import type { IEventBus } from "@nova-x-ai/core";
import type { SecuritySession, SecurityToken, SecurityPolicy, CredentialVaultEntry, AuditLogEntry } from "../Domain";
import { SecurityBudgetDto, SecurityClaimsDto, PermissionResultDto, SessionValidationResultDto, VaultStatusDto, AuditLogDto } from "../Application";

export interface ISecurityEngine {
    readonly eventBus: IEventBus;
    authenticateToken(token: string, identityId: string): Promise<SecurityClaimsDto>;
    validatePermissions(identityId: string, resource: string, action: string, claims?: Record<string, unknown>): Promise<PermissionResultDto>;
    registerSession(session: SecuritySession): Promise<void>;
    revokeToken(tokenId: string, reason: string): Promise<void>;
    rotateKey(keyId: string, newKeyId: string): Promise<void>;
    sanitizePayload(payload: unknown, resource: string): Promise<number>;
    lockoutIdentity(identityId: string, reason: string): Promise<void>;
    getSession(sessionId: string): SecuritySession | undefined;
    getSessions(): SecuritySession[];
    getToken(tokenId: string): SecurityToken | undefined;
    addToken(token: SecurityToken): Promise<void>;
    addPolicy(policy: SecurityPolicy): Promise<void>;
    getPolicies(): SecurityPolicy[];
    storeVaultEntry(entry: CredentialVaultEntry): Promise<void>;
    getVaultEntry(credentialId: string): CredentialVaultEntry | undefined;
    getVaultEntries(identityId?: string): CredentialVaultEntry[];
    removeVaultEntry(credentialId: string): Promise<boolean>;
    appendAuditLog(entry: AuditLogEntry): Promise<void>;
    getAuditLog(identityId?: string, limit?: number): Promise<AuditLogEntry[]>;
    getSecurityBudget(): SecurityBudgetDto;
    setBudget(budget: SecurityBudgetDto): void;
    getAggregate(): import("../Domain/Aggregates").SecurityEngineAggregate;
}

export interface ISecurityWorker {
    start(): Promise<void>;
    stop(): Promise<void>;
    isRunning(): boolean;
    getWorkerName(): string;
}

export interface ISecurityVault {
    store(entry: CredentialVaultEntry): Promise<void>;
    retrieve(credentialId: string): Promise<CredentialVaultEntry | null>;
    delete(credentialId: string): Promise<boolean>;
    list(identityId?: string): Promise<CredentialVaultEntry[]>;
    rotateKey(oldKeyId: string, newKeyId: string): Promise<void>;
}

export interface ICryptoAdapter {
    generateKey(algorithm: string): Promise<string>;
    encrypt(data: ArrayBuffer, keyId: string): Promise<{ data: ArrayBuffer; keyId: string }>;
    decrypt(data: ArrayBuffer, keyId: string): Promise<ArrayBuffer>;
    sign(data: ArrayBuffer, keyId: string): Promise<ArrayBuffer>;
    verify(data: ArrayBuffer, signature: ArrayBuffer, keyId: string): Promise<boolean>;
    rotateKey(oldKeyId: string, newKeyId: string): Promise<void>;
}

export interface IPolicyEvaluator {
    evaluate(identityId: string, resource: string, action: string, claims?: Record<string, unknown>): PermissionResultDto;
}

export interface ISanitizer {
    sanitize(payload: unknown, resource: string): Promise<{ sanitized: unknown; threatsRemoved: number }>;
}

export interface IAuditLogger {
    log(entry: Omit<AuditLogEntry, "logId" | "timestamp" | "signature">): Promise<AuditLogEntry>;
    getLog(identityId?: string, limit?: number): Promise<AuditLogEntry[]>;
}
