export class VoiceException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "VoiceException";
    }
}

export class InvalidVoiceStateException extends VoiceException {
    constructor(currentState: string, attemptedTransition: string) {
        super(`Invalid voice state transition: ${currentState} -> ${attemptedTransition}`);
        this.name = "InvalidVoiceStateException";
    }
}

export class VoiceProviderException extends VoiceException {
    constructor(providerId: string, reason: string) {
        super(`Voice provider '${providerId}' error: ${reason}`);
        this.name = "VoiceProviderException";
    }
}

export class VoiceQuotaExceededException extends VoiceException {
    constructor(quotaType: string) {
        super(`Voice quota exceeded: ${quotaType}`);
        this.name = "VoiceQuotaExceededException";
    }
}

export class VoiceTimeoutException extends VoiceException {
    constructor(timeoutMs: number) {
        super(`Voice operation timed out after ${timeoutMs}ms`);
        this.name = "VoiceTimeoutException";
    }
}

export class VoiceProfileNotFoundException extends VoiceException {
    constructor(profileId: string) {
        super(`Voice profile not found: ${profileId}`);
        this.name = "VoiceProfileNotFoundException";
    }
}

export class VoiceSessionNotFoundException extends VoiceException {
    constructor(sessionId: string) {
        super(`Voice session not found: ${sessionId}`);
        this.name = "VoiceSessionNotFoundException";
    }
}

export class VoiceProviderUnavailableException extends VoiceException {
    constructor(providerId: string) {
        super(`Voice provider unavailable: ${providerId}`);
        this.name = "VoiceProviderUnavailableException";
    }
}
