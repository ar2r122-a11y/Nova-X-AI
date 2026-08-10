import type { IQuery } from "@nova-x-ai/core";

export class ValidatePermissionsQuery implements IQuery {
    constructor(
        public readonly identityId: string,
        public readonly resource: string,
        public readonly action: string,
        public readonly claims?: Record<string, unknown>
    ) {}
}

export class GetSecurityStatusQuery implements IQuery {
    constructor(
        public readonly identityId?: string
    ) {}
}

export class GetAuditLogQuery implements IQuery {
    constructor(
        public readonly identityId?: string,
        public readonly limit: number = 100
    ) {}
}

export class GetVaultStatusQuery implements IQuery {
    constructor(
        public readonly identityId?: string
    ) {}
}
