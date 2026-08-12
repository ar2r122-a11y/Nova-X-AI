import { ConversationReadModel } from "./ConversationReadModel";
import { ConversationAggregate } from "../../Domain/Aggregates/ConversationAggregate";
import { ConversationSessionDto } from "../DTO/ConversationSessionDto";

export class ConversationProjectionUpdater {
    private readonly readModel: ConversationReadModel;

    public constructor(readModel: ConversationReadModel) {
        this.readModel = readModel;
    }

    public async update(aggregate: ConversationAggregate): Promise<void> {
        const dto = ConversationSessionDto.fromAggregate(aggregate);
        void dto;
        await this.readModel.getConversation(aggregate.getId().getValue());
    }
}
