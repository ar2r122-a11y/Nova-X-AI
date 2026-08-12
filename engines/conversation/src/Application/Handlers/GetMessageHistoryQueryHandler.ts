import { GetMessageHistoryQuery } from "../Queries/GetMessageHistoryQuery";
import { MessageDto } from "../DTO/MessageDto";

export class GetMessageHistoryQueryHandler {
    constructor(
        private readonly repository: import("../../Domain/Repositories/IConversationRepository").IConversationRepository
    ) {}

    async handle(query: GetMessageHistoryQuery): Promise<MessageDto[]> {
        const aggregate = await this.repository.getById(query.conversationId);
        if (!aggregate) {
            throw new Error(`Conversation ${query.conversationId} not found.`);
        }

        const messages = aggregate.getMessages();
        const offset = Math.max(0, query.offset);
        const limit = Math.max(1, query.limit);
        const paginated = messages.slice(offset, offset + limit);

        return paginated.map(message => MessageDto.fromEntity(
            message as any,
            query.conversationId,
            aggregate.getSessionId().getValue(),
            "system"
        ));
    }
}
