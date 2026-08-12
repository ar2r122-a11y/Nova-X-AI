import { CancelStreamCommand } from "../Commands/CancelStreamCommand";
import { ConversationId } from "../../Domain/ValueObjects/ConversationId";

export class CancelStreamCommandHandler {
    constructor(
        private readonly repository: import("../../Domain/Repositories/IConversationRepository").IConversationRepository
    ) {}

    async handle(command: CancelStreamCommand): Promise<void> {
        const conversationId = ConversationId.create(command.conversationId);
        const aggregate = await this.repository.getById(conversationId.getValue());
        if (!aggregate) {
            throw new Error(`Conversation ${command.conversationId} not found.`);
        }

        aggregate.interrupt({ getValue: () => "cancelStream" } as any);
        await this.repository.save(aggregate);
    }
}
