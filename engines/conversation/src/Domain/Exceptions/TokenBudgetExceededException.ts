import { ConversationException } from "./ConversationException";

export class TokenBudgetExceededException extends ConversationException {
    constructor(required: number, budget: number) {
        super(`Token budget exceeded. Required: ${required}, Budget: ${budget}.`);
        this.name = "TokenBudgetExceededException";
    }
}
