
export class ImageEngineException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ImageEngineException";
    }
}
