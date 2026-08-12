import { ConversationException } from "./ConversationException";

export class InvalidStateTransitionException extends ConversationException {
    constructor(fromState: string, toState: string) {
        super(`Invalid state transition from ${fromState} to ${toState}.`);
        this.name = "InvalidStateTransitionException";
    }
}
