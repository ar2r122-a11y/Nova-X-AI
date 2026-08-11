export class InvalidStateTransitionException extends Error {
    constructor(currentState: string, targetState: string, aggregateType: string) {
        super(`Invalid state transition in ${aggregateType}: ${currentState} -> ${targetState}`);
        this.name = "InvalidStateTransitionException";
    }
}
