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
