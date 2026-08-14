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

export class CreateContentBoundaryCommand implements ICommand {
    constructor(
        public readonly boundaryId: string,
        public readonly name: string,
        public readonly description: string,
        public readonly allowedCategories: string[],
        public readonly blockedCategories: string[],
        public readonly severityThreshold: "low" | "medium" | "high" | "strict",
        public readonly identityId?: string
    ) {}
}

export class UpdateContentBoundaryCommand implements ICommand {
    constructor(
        public readonly boundaryId: string,
        public readonly allowedCategories?: string[],
        public readonly blockedCategories?: string[],
        public readonly severityThreshold?: "low" | "medium" | "high" | "strict"
    ) {}
}

export class CreateAgeControlCommand implements ICommand {
    constructor(
        public readonly controlId: string,
        public readonly identityId: string,
        public readonly ageRating: "child" | "teen" | "adult" | "unrestricted",
        public readonly blockedContentTypes: string[],
        public readonly allowedContentTypes: string[],
        public readonly requiresParentalConsent: boolean
    ) {}
}

export class UpdateAgeControlCommand implements ICommand {
    constructor(
        public readonly controlId: string,
        public readonly ageRating?: "child" | "teen" | "adult" | "unrestricted",
        public readonly blockedContentTypes?: string[],
        public readonly allowedContentTypes?: string[],
        public readonly requiresParentalConsent?: boolean
    ) {}
}

export class RegisterProviderPolicyCommand implements ICommand {
    constructor(
        public readonly policyId: string,
        public readonly providerId: string,
        public readonly providerName: string,
        public readonly allowedContentCategories: string[],
        public readonly blockedContentCategories: string[],
        public readonly safetySettings: Record<string, unknown>,
        public readonly compatible: boolean
    ) {}
}

export class CheckProviderCompatibilityCommand implements ICommand {
    constructor(
        public readonly providerId: string,
        public readonly contentCategory: string
    ) {}
}

export class LogSafetyEventCommand implements ICommand {
    constructor(
        public readonly eventType: string,
        public readonly severity: "info" | "warning" | "error" | "critical",
        public readonly source: string,
        public readonly resource: string,
        public readonly action: string,
        public readonly details: Record<string, unknown>,
        public readonly identityId?: string
    ) {}
}
