
import { ImageEngineException } from "./ImageEngineException";

export class ProviderUnavailableException extends ImageEngineException {
    constructor(providerId: string) {
        super(`Provider unavailable: ${providerId}.`);
        this.name = "ProviderUnavailableException";
    }
}
