import { ConversationState } from "../ValueObjects/ConversationState";

export class CanInterruptSpecification {
    public static isSatisfiedBy(state: ConversationState): boolean {
        return state.equals(ConversationState.waitingForAI()) ||
            state.equals(ConversationState.streaming()) ||
            state.equals(ConversationState.toolExecution());
    }
}
