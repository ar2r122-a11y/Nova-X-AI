
import { ImageEngineException } from "./ImageEngineException";

export class ImageNotFoundException extends ImageEngineException {
    constructor(imageId: string) {
        super(`Image not found: ${imageId}`);
        this.name = "ImageNotFoundException";
    }
}
