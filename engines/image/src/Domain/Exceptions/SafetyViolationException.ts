
import { ImageEngineException } from "./ImageEngineException";

export class SafetyViolationException extends ImageEngineException {
    constructor(violation: string) {
        super(`Safety violation: ${violation}.`);
        this.name = "SafetyViolationException";
    }
}
