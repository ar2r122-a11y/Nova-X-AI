export class SessionId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(): SessionId {
        return new SessionId(`sess-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
    }

    public static fromString(value: string): SessionId {
        return new SessionId(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: SessionId): boolean {
        return this.value === other.value;
    }
}

export class SecurityNonce {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(): SecurityNonce {
        return new SecurityNonce(`nonce-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
    }

    public static fromString(value: string): SecurityNonce {
        return new SecurityNonce(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: SecurityNonce): boolean {
        return this.value === other.value;
    }
}

export class TokenCacheKey {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(token: string): TokenCacheKey {
        return new TokenCacheKey(`token-${token.slice(0, 16)}`);
    }

    public static fromString(value: string): TokenCacheKey {
        return new TokenCacheKey(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: TokenCacheKey): boolean {
        return this.value === other.value;
    }
}

export class CredentialId {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(): CredentialId {
        return new CredentialId(`cred-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
    }

    public static fromString(value: string): CredentialId {
        return new CredentialId(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: CredentialId): boolean {
        return this.value === other.value;
    }
}

export class LockoutReason {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static maxRetriesExceeded(): LockoutReason {
        return new LockoutReason("max_retries_exceeded");
    }

    public static tamperDetected(): LockoutReason {
        return new LockoutReason("tamper_detected");
    }

    public static hardwareFault(): LockoutReason {
        return new LockoutReason("hardware_fault");
    }

    public static manualAdministrative(): LockoutReason {
        return new LockoutReason("manual_administrative");
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: LockoutReason): boolean {
        return this.value === other.value;
    }
}

export class SecurityBudget {
    private readonly argon2MemoryMB: number;
    private readonly argon2Iterations: number;
    private readonly maxCryptoOpsPerSec: number;
    private readonly tokenCacheLimitMB: number;

    private constructor(
        argon2MemoryMB: number,
        argon2Iterations: number,
        maxCryptoOpsPerSec: number,
        tokenCacheLimitMB: number
    ) {
        this.argon2MemoryMB = argon2MemoryMB;
        this.argon2Iterations = argon2Iterations;
        this.maxCryptoOpsPerSec = maxCryptoOpsPerSec;
        this.tokenCacheLimitMB = tokenCacheLimitMB;
    }

    public static create(
        argon2MemoryMB: number = 64,
        argon2Iterations: number = 3,
        maxCryptoOpsPerSec: number = 200,
        tokenCacheLimitMB: number = 16
    ): SecurityBudget {
        return new SecurityBudget(argon2MemoryMB, argon2Iterations, maxCryptoOpsPerSec, tokenCacheLimitMB);
    }

    public static forLowResources(): SecurityBudget {
        return new SecurityBudget(32, 2, 50, 8);
    }

    public getArgon2MemoryMB(): number {
        return this.argon2MemoryMB;
    }

    public getArgon2Iterations(): number {
        return this.argon2Iterations;
    }

    public getMaxCryptoOpsPerSec(): number {
        return this.maxCryptoOpsPerSec;
    }

    public getTokenCacheLimitMB(): number {
        return this.tokenCacheLimitMB;
    }

    public getTokenCacheLimitBytes(): number {
        return this.tokenCacheLimitMB * 1024 * 1024;
    }
}

export class Permission {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(value: string): Permission {
        return new Permission(value);
    }

    public static readonly Read = Permission.create("read");
    public static readonly Write = Permission.create("write");
    public static readonly Admin = Permission.create("admin");
    public static readonly Execute = Permission.create("execute");
    public static readonly Delete = Permission.create("delete");

    public getValue(): string {
        return this.value;
    }

    public equals(other: Permission): boolean {
        return this.value === other.value;
    }
}

export class Role {
    private readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(value: string): Role {
        return new Role(value);
    }

    public static readonly User = Role.create("user");
    public static readonly Moderator = Role.create("moderator");
    public static readonly Administrator = Role.create("administrator");
    public static readonly System = Role.create("system");

    public getValue(): string {
        return this.value;
    }

    public equals(other: Role): boolean {
        return this.value === other.value;
    }
}
