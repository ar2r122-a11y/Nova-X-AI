
import { ImageEngineException } from "./ImageEngineException";
import { ImageRuntimeState } from "../ValueObjects/ImageRuntimeState";

export class InvalidImageStateException extends ImageEngineException {
    constructor(currentState: ImageRuntimeState, attemptedTransition: ImageRuntimeState) {
        super(`Invalid state transition from ${currentState} to ${attemptedTransition}.`);
        this.name = "InvalidImageStateException";
    }
}
