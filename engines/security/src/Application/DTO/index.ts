export class SecurityClaimsDto {
    constructor(
        public readonly identityId: string,
        public readonly roles: string[],
        public readonly permissions: string[],
        public readonly sessionId: string,
        public readonly expiresAt: number
    ) {}
}

export class SecurityBudgetDto {
    constructor(
        public readonly argon2MemoryMB: number,
        public readonly argon2Iterations: number,
        public readonly maxCryptoOpsPerSec: number,
        public readonly tokenCacheLimitMB: number,
        public readonly tokenCacheLimitBytes: number
    ) {}

    public static create(
        argon2MemoryMB: number = 64,
        argon2Iterations: number = 3,
        maxCryptoOpsPerSec: number = 200,
        tokenCacheLimitMB: number = 16
    ): SecurityBudgetDto {
        return new SecurityBudgetDto(argon2MemoryMB, argon2Iterations, maxCryptoOpsPerSec, tokenCacheLimitMB, tokenCacheLimitMB * 1024 * 1024);
    }
}

export class AuditLogDto {
    constructor(
        public readonly logId: string,
        public readonly identityId: string,
        public readonly action: string,
        public readonly resource: string,
        public readonly result: string,
        public readonly timestamp: number,
        public readonly correlationId: string
    ) {}
}

export class VaultStatusDto {
    constructor(
        public readonly credentialId: string,
        public readonly identityId: string,
        public readonly credentialType: string,
        public readonly createdAt: number,
        public readonly lastAccessedAt: number
    ) {}
}

export class PermissionResultDto {
    constructor(
        public readonly allowed: boolean,
        public readonly reason?: string,
        public readonly matchedPolicy?: string
    ) {}
}

export class SessionValidationResultDto {
    constructor(
        public readonly valid: boolean,
        public readonly sessionId?: string,
        public readonly identityId?: string,
        public readonly roles?: string[],
        public readonly permissions?: string[],
        public readonly error?: string
    ) {}
}

export class ContentBoundaryDto {
    constructor(
        public readonly boundaryId: string,
        public readonly name: string,
        public readonly description: string,
        public readonly allowedCategories: string[],
        public readonly blockedCategories: string[],
        public readonly severityThreshold: string,
        public readonly createdAt: number,
        public readonly updatedAt: number,
        public readonly identityId?: string
    ) {}
}

export class AgeControlDto {
    constructor(
        public readonly controlId: string,
        public readonly identityId: string,
        public readonly ageRating: string,
        public readonly blockedContentTypes: string[],
        public readonly allowedContentTypes: string[],
        public readonly requiresParentalConsent: boolean,
        public readonly createdAt: number,
        public readonly updatedAt: number
    ) {}
}

export class ProviderPolicyDto {
    constructor(
        public readonly policyId: string,
        public readonly providerId: string,
        public readonly providerName: string,
        public readonly allowedContentCategories: string[],
        public readonly blockedContentCategories: string[],
        public readonly safetySettings: Record<string, unknown>,
        public readonly compatible: boolean,
        public readonly createdAt: number,
        public readonly updatedAt: number
    ) {}
}

export class SafetyEventDto {
    constructor(
        public readonly eventId: string,
        public readonly eventType: string,
        public readonly severity: string,
        public readonly source: string,
        public readonly resource: string,
        public readonly action: string,
        public readonly details: Record<string, unknown>,
        public readonly timestamp: number,
        public readonly correlationId: string,
        public readonly identityId?: string
    ) {}
}
