
import { ImageEngineException } from "./ImageEngineException";

export class InvalidDimensionException extends ImageEngineException {
    constructor(dimensions: string) {
        super(`Invalid dimensions: ${dimensions}.`);
        this.name = "InvalidDimensionException";
    }
}
