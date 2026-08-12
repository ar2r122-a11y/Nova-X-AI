import { ConversationException } from "./ConversationException";

export class UnauthorizedParticipantException extends ConversationException {
    constructor(participantId: string) {
        super(`Participant ${participantId} is not authorized for this operation.`);
        this.name = "UnauthorizedParticipantException";
    }
}
