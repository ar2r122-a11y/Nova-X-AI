import { InterruptCommand } from "../Commands/InterruptCommand";
import { InterruptValidator } from "../Validators/InterruptValidator";
import { ConversationId } from "../../Domain/ValueObjects/ConversationId";
import { InterruptionType } from "../../Domain/ValueObjects/InterruptionType";

export class InterruptCommandHandler {
    constructor(
        private readonly repository: import("../../Domain/Repositories/IConversationRepository").IConversationRepository
    ) {}

    async handle(command: InterruptCommand): Promise<void> {
        InterruptValidator.validate(command);

        const conversationId = ConversationId.create(command.conversationId);
        const aggregate = await this.repository.getById(conversationId.getValue());
        if (!aggregate) {
            throw new Error(`Conversation ${command.conversationId} not found.`);
        }

        const interruptionType = InterruptionType.fromString(command.interruptionType);
        aggregate.interrupt(interruptionType);
        await this.repository.save(aggregate);
    }
}
