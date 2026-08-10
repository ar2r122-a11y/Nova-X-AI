import { IDomainEvent } from "@nova-x-ai/core";

export class SessionValidatedEvent implements IDomainEvent {
    readonly eventType = "EVT_SEC_SessionValidated";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly sessionId: string,
        public readonly identityId: string,
        public readonly roles: string[],
        public readonly permissions: string[],
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class ExecutionFailedEvent implements IDomainEvent {
    readonly eventType = "EVT_SEC_ExecutionFailed";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly operation: string,
        public readonly error: string,
        public readonly retryCount: number,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class LockoutEvent implements IDomainEvent {
    readonly eventType = "EVT_SEC_Lockout";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly identityId: string,
        public readonly reason: string,
        public readonly retryCount: number,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class AccessDeniedEvent implements IDomainEvent {
    readonly eventType = "EVT_SEC_AccessDenied";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly identityId: string,
        public readonly resource: string,
        public readonly action: string,
        public readonly reason: string,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class TokenRevokedEvent implements IDomainEvent {
    readonly eventType = "EVT_SEC_TokenRevoked";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly tokenId: string,
        public readonly identityId: string,
        public readonly reason: string,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class KeyRotatedEvent implements IDomainEvent {
    readonly eventType = "EVT_SEC_KeyRotated";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly keyId: string,
        public readonly previousKeyId: string,
        public readonly algorithm: string,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class CredentialIsolatedEvent implements IDomainEvent {
    readonly eventType = "EVT_SEC_CredentialIsolated";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly credentialId: string,
        public readonly identityId: string,
        public readonly isolationLevel: string,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class PayloadSanitizedEvent implements IDomainEvent {
    readonly eventType = "EVT_SEC_PayloadSanitized";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly resource: string,
        public readonly threatsRemoved: number,
        public readonly sanitizedAt: number,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}

export class SecurityBudgetExceededEvent implements IDomainEvent {
    readonly eventType = "EVT_SEC_BudgetExceeded";
    readonly timestamp: number;
    readonly correlationId: string;

    constructor(
        public readonly resource: string,
        public readonly limit: number,
        public readonly current: number,
        correlationId: string
    ) {
        this.timestamp = Date.now();
        this.correlationId = correlationId;
    }
}
