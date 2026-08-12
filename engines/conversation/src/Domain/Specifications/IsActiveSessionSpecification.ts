import { ConversationState } from "../ValueObjects/ConversationState";

export class IsActiveSessionSpecification {
    public static isSatisfiedBy(state: ConversationState): boolean {
        return !state.equals(ConversationState.ended()) && !state.equals(ConversationState.error());
    }
}
