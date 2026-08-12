
import { ImageEngineException } from "./ImageEngineException";

export class ResourceBudgetExhaustedException extends ImageEngineException {
    constructor(resource: string) {
        super(`Resource budget exhausted: ${resource}.`);
        this.name = "ResourceBudgetExhaustedException";
    }
}
