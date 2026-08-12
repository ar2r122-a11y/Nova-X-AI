import { RetryTurnCommand } from "../Commands/RetryTurnCommand";
import { ConversationId } from "../../Domain/ValueObjects/ConversationId";

export class RetryTurnCommandHandler {
    constructor(
        private readonly repository: import("../../Domain/Repositories/IConversationRepository").IConversationRepository
    ) {}

    async handle(command: RetryTurnCommand): Promise<void> {
        const conversationId = ConversationId.create(command.conversationId);
        const aggregate = await this.repository.getById(conversationId.getValue());
        if (!aggregate) {
            throw new Error(`Conversation ${command.conversationId} not found.`);
        }

        if (!aggregate.canRetry()) {
            throw new Error("Maximum retry attempts exceeded.");
        }

        aggregate.incrementRetry();
        await this.repository.save(aggregate);
    }
}
