import type { IEventBus } from "@nova-x-ai/core";
import { PostMessageCommand } from "../Commands/PostMessageCommand";
import { MessageAcknowledgementDto } from "../DTO/MessageAcknowledgementDto";
import { PostMessageValidator } from "../Validators/PostMessageValidator";
import { SafetyPolicy } from "../../Domain/Policies/SafetyPolicy";
import { ConversationId } from "../../Domain/ValueObjects/ConversationId";
import { SessionId } from "../../Domain/ValueObjects/SessionId";
import { MessageId } from "../../Domain/ValueObjects/MessageId";
import { MessageRole } from "../../Domain/ValueObjects/MessageRole";
import { TokenCount } from "../../Domain/ValueObjects/TokenCount";
import { ParticipantId } from "../../Domain/ValueObjects/ParticipantId";
import { Message } from "../../Domain/Entities/Message";
import { MessagePostedEvent } from "../../Domain/Events/MessagePostedEvent";

export class PostMessageCommandHandler {
    constructor(
        private readonly eventBus: IEventBus,
        private readonly repository: import("../../Domain/Repositories/IConversationRepository").IConversationRepository,
        private readonly messageRepository: import("../../Domain/Repositories/IMessageRepository").IMessageRepository
    ) {}

    async handle(command: PostMessageCommand): Promise<MessageAcknowledgementDto> {
        PostMessageValidator.validate(command);

        const conversationId = ConversationId.create(command.conversationId);
        const sessionId = SessionId.create(command.sessionId);

        const aggregate = await this.repository.getById(conversationId.getValue());
        if (!aggregate) {
            throw new Error(`Conversation ${command.conversationId} not found.`);
        }

        const sanitizedContent = SafetyPolicy.sanitizeInput(command.content);
        const estimatedTokens = TokenCount.create(Math.max(1, Math.ceil(sanitizedContent.length / 4)));
        const message = Message.create(
            MessageId.generate(),
            MessageRole.fromString(command.role),
            sanitizedContent,
            estimatedTokens,
            command.languageHint
        );

        const authorId = ParticipantId.create(command.authorId);
        aggregate.postMessage(message, authorId);
        await this.repository.save(aggregate);
        await this.messageRepository.save(message);

        const correlationId = `msg-post-${Date.now()}`;
        const messageEvent = new MessagePostedEvent(
            conversationId,
            sessionId,
            message.getId(),
            authorId,
            command.role,
            sanitizedContent,
            estimatedTokens.getValue(),
            Date.now(),
            correlationId,
            command.languageHint
        );
        await this.eventBus.publish(messageEvent);

        return new MessageAcknowledgementDto(
            message.getId().getValue(),
            command.conversationId,
            Date.now(),
            "posted"
        );
    }
}
