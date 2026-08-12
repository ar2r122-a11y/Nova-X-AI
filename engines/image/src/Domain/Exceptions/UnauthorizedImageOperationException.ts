import { ImageEngineException } from "./ImageEngineException";

export class UnauthorizedImageOperationException extends ImageEngineException {
    constructor(operation: string) {
        super(`Unauthorized image operation: ${operation}.`);
        this.name = "UnauthorizedImageOperationException";
    }
}
