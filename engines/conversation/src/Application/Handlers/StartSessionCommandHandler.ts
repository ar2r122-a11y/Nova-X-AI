import type { IEventBus } from "@nova-x-ai/core";
import { StartSessionCommand } from "../Commands/StartSessionCommand";
import { ConversationSessionDto } from "../DTO/ConversationSessionDto";
import { StartSessionValidator } from "../Validators/StartSessionValidator";
import { ConversationAggregate } from "../../Domain/Aggregates/ConversationAggregate";
import { ConversationId } from "../../Domain/ValueObjects/ConversationId";
import { SessionId } from "../../Domain/ValueObjects/SessionId";
import { ParticipantId } from "../../Domain/ValueObjects/ParticipantId";
import { Participant } from "../../Domain/Entities/Participant";
import { TokenBudget } from "../../Domain/ValueObjects/TokenBudget";
import { CompressionStrategy } from "../../Domain/ValueObjects/CompressionStrategy";
import { ConversationStartedEvent } from "../../Domain/Events/ConversationStartedEvent";
import { ConversationQuotaPolicy } from "../../Domain/Policies/ConversationQuotaPolicy";

export class StartSessionCommandHandler {
    constructor(
        private readonly eventBus: IEventBus,
        private readonly repository: import("../../Domain/Repositories/IConversationRepository").IConversationRepository,
        private readonly quotaPolicy: ConversationQuotaPolicy
    ) {}

    async handle(command: StartSessionCommand): Promise<ConversationSessionDto> {
        StartSessionValidator.validate(command);

        if (!this.quotaPolicy.canStartNewConversation()) {
            throw new Error("Conversation quota exceeded.");
        }
        this.quotaPolicy.incrementActive();

        const conversationId = ConversationId.create(command.conversationId);
        const sessionId = SessionId.generate();
        const tokenBudget = TokenBudget.default();
        const compressionStrategy = CompressionStrategy.none();

        const aggregate = new ConversationAggregate(
            conversationId,
            sessionId,
            tokenBudget,
            compressionStrategy
        );

        for (const participantId of command.participantIds) {
            aggregate.addParticipant(Participant.create(
                ParticipantId.create(participantId),
                "user",
                participantId,
                1,
                true,
                Date.now()
            ));
        }

        const initiatorId = ParticipantId.create(command.participantIds[0]);
        aggregate.start(initiatorId);

        await this.repository.save(aggregate);

        const correlationId = `conv-start-${Date.now()}`;
        const startedEvent = new ConversationStartedEvent(
            conversationId,
            sessionId,
            initiatorId,
            Date.now(),
            correlationId
        );
        await this.eventBus.publish(startedEvent);

        return ConversationSessionDto.fromAggregate(aggregate);
    }
}
