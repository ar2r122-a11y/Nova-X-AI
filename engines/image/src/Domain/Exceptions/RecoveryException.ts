import { ImageEngineException } from "./ImageEngineException";

export class RecoveryException extends ImageEngineException {
    constructor(reason: string) {
        super(`Recovery error: ${reason}.`);
        this.name = "RecoveryException";
    }
}
