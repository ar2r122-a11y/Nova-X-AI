import { ImageEngineException } from "./ImageEngineException";

export class StreamingException extends ImageEngineException {
    constructor(reason: string) {
        super(`Streaming error: ${reason}.`);
        this.name = "StreamingException";
    }
}
