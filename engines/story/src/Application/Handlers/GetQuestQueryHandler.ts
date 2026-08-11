import { GetQuestQuery } from "../Queries/GetQuestQuery";
import { QuestDto } from "../DTO/QuestDto";
import { IQuestRepository } from "../../Domain/Repositories/IQuestRepository";
import { QuestId } from "../../Domain/ValueObjects/QuestId";

export class GetQuestQueryHandler {
    constructor(private readonly questRepository: IQuestRepository) {}

    async handle(query: GetQuestQuery): Promise<QuestDto | null> {
        const questId = QuestId.create(query.questId);
        const aggregate = await this.questRepository.getById(questId);
        if (!aggregate) {
            return null;
        }
        return QuestDto.fromAggregate(aggregate);
    }
}
