import { GetConversationQuery } from "../Queries/GetConversationQuery";
import { ConversationSessionDto } from "../DTO/ConversationSessionDto";

export class GetConversationQueryHandler {
    constructor(
        private readonly repository: import("../../Domain/Repositories/IConversationRepository").IConversationRepository
    ) {}

    async handle(query: GetConversationQuery): Promise<ConversationSessionDto | null> {
        const aggregate = await this.repository.getById(query.conversationId);
        if (!aggregate) {
            return null;
        }
        return ConversationSessionDto.fromAggregate(aggregate);
    }
}
