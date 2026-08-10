export interface SecuritySession {
    readonly sessionId: string;
    readonly identityId: string;
    readonly claims: Record<string, unknown>;
    readonly roles: string[];
    readonly permissions: string[];
    readonly nonce: string;
    readonly createdAt: number;
    readonly expiresAt: number;
    readonly lastValidatedAt: number;
    readonly status: "active" | "expired" | "revoked" | "locked";
    readonly lockoutReason?: string;
    readonly retryCount: number;
}

export interface SecurityToken {
    readonly tokenId: string;
    readonly identityId: string;
    readonly tokenType: "access" | "refresh" | "api";
    readonly hashedToken: string;
    readonly expiresAt: number;
    readonly createdAt: number;
    readonly lastUsedAt: number;
    readonly revoked: boolean;
    readonly rotationCount: number;
}

export interface SecurityPolicy {
    readonly policyId: string;
    readonly name: string;
    readonly effect: "allow" | "deny";
    readonly resource: string;
    readonly action: string;
    readonly conditions: Record<string, unknown>;
    readonly priority: number;
    readonly createdAt: number;
    readonly updatedAt: number;
}

export interface CredentialVaultEntry {
    readonly credentialId: string;
    readonly identityId: string;
    readonly credentialType: "password" | "api_key" | "certificate" | "seed";
    readonly encryptedData: ArrayBuffer;
    readonly keyId: string;
    readonly createdAt: number;
    readonly updatedAt: number;
    readonly lastAccessedAt: number;
    readonly metadata: Record<string, unknown>;
}

export interface AuditLogEntry {
    readonly logId: string;
    readonly identityId: string;
    readonly action: string;
    readonly resource: string;
    readonly result: "success" | "failure" | "denied";
    readonly timestamp: number;
    readonly correlationId: string;
    readonly metadata: Record<string, unknown>;
    readonly signature: string;
}
