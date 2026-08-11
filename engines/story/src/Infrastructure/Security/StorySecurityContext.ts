export interface StorySecurityContextData {
    readonly userId: string;
    readonly roles: string[];
    readonly permissions: string[];
    readonly correlationId: string;
    readonly causationId: string | null;
    readonly nonce: string;
    readonly timestamp: number;
}

const RECENT_NONCES = new Map<string, number>();
const NONCE_TTL_MS = 5 * 60 * 1000;

export class StorySecurityContext implements StorySecurityContextData {
    readonly userId: string;
    readonly roles: string[];
    readonly permissions: string[];
    readonly correlationId: string;
    readonly causationId: string | null;
    readonly nonce: string;
    readonly timestamp: number;

    private constructor(data: StorySecurityContextData) {
        this.userId = data.userId;
        this.roles = data.roles;
        this.permissions = data.permissions;
        this.correlationId = data.correlationId;
        this.causationId = data.causationId;
        this.nonce = data.nonce;
        this.timestamp = data.timestamp;
    }

    static create(data: StorySecurityContextData): StorySecurityContext {
        return new StorySecurityContext(data);
    }

    isExpired(ttlMs: number = 300000): boolean {
        return Date.now() - this.timestamp > ttlMs;
    }

    hasRole(role: string): boolean {
        return this.roles.includes(role);
    }

    hasPermission(permission: string): boolean {
        return this.permissions.includes(permission);
    }

    validateNonce(): void {
        const existing = RECENT_NONCES.get(this.nonce);
        if (existing !== undefined && Date.now() - existing < NONCE_TTL_MS) {
            throw new Error(`Nonce replay detected: ${this.nonce}`);
        }
        RECENT_NONCES.set(this.nonce, Date.now());
    }

    static detectTamper(payload: unknown): boolean {
        return payload === null || payload === undefined;
    }
}
