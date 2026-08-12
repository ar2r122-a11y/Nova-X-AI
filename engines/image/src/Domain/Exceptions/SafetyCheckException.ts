import { ImageEngineException } from "./ImageEngineException";

export class SafetyCheckException extends ImageEngineException {
    constructor(reason: string) {
        super(`Safety check failed: ${reason}.`);
        this.name = "SafetyCheckException";
    }
}
