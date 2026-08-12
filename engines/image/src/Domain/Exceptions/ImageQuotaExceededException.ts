import { ImageEngineException } from "./ImageEngineException";

export class ImageQuotaExceededException extends ImageEngineException {
    constructor(limit: number) {
        super(`Image quota exceeded. Maximum allowed: ${limit}.`);
        this.name = "ImageQuotaExceededException";
    }
}
