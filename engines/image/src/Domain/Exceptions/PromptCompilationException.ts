
import { ImageEngineException } from "./ImageEngineException";

export class PromptCompilationException extends ImageEngineException {
    constructor(reason: string) {
        super(`Prompt compilation failed: ${reason}.`);
        this.name = "PromptCompilationException";
    }
}
