export class EmotionNotFoundException extends Error {
    constructor(characterId: string) {
        super(`Emotional state for character "${characterId}" was not found.`);
        this.name = "EmotionNotFoundException";
        Object.setPrototypeOf(this, EmotionNotFoundException.prototype);
    }
}

export class InvalidPADVectorException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidPADVectorException";
        Object.setPrototypeOf(this, InvalidPADVectorException.prototype);
    }
}

export class StimulusProcessingException extends Error {
    constructor(message: string, public readonly correlationId: string) {
        super(message);
        this.name = "StimulusProcessingException";
        Object.setPrototypeOf(this, StimulusProcessingException.prototype);
    }
}
