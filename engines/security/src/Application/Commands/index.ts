import type { ICommand } from "@nova-x-ai/core";

export class AuthenticateTokenCommand implements ICommand {
    constructor(
        public readonly token: string,
        public readonly identityId: string,
        public readonly resource?: string
    ) {}
}

export class ValidatePermissionsCommand implements ICommand {
    constructor(
        public readonly identityId: string,
        public readonly resource: string,
        public readonly action: string,
        public readonly claims?: Record<string, unknown>
    ) {}
}

export class RevokeTokenCommand implements ICommand {
    constructor(
        public readonly tokenId: string,
        public readonly reason: string
    ) {}
}

export class RotateKeyCommand implements ICommand {
    constructor(
        public readonly keyId: string,
        public readonly newKeyId: string
    ) {}
}

export class SanitizePayloadCommand implements ICommand {
    constructor(
        public readonly payload: unknown,
        public readonly resource: string
    ) {}
}

export class LockoutIdentityCommand implements ICommand {
    constructor(
        public readonly identityId: string,
        public readonly reason: string
    ) {}
}
