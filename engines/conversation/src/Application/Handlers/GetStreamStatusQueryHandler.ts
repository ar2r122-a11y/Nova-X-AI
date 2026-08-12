import { GetStreamStatusQuery } from "../Queries/GetStreamStatusQuery";
import { StreamChunkDto } from "../DTO/StreamChunkDto";

export class GetStreamStatusQueryHandler {
    constructor(
        private readonly repository: import("../../Domain/Repositories/IConversationRepository").IConversationRepository
    ) {}

    async handle(query: GetStreamStatusQuery): Promise<StreamChunkDto | null> {
        const aggregate = await this.repository.getById(query.conversationId);
        if (!aggregate) {
            return null;
        }
        return new StreamChunkDto(
            query.conversationId,
            query.sessionId,
            0,
            "",
            aggregate.getStreamState().getValue() === "completed"
        );
    }
}
