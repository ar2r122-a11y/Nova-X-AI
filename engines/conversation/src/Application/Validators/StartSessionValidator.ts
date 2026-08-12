export class StartSessionValidator {
    public static validate(command: {
        conversationId: string;
        ownerId: string;
        participantIds: string[];
        initialPrompt?: string;
        claims: { roles: string[]; permissions: string[] };
    }): void {
        if (!command.conversationId || command.conversationId.trim().length === 0) {
            throw new Error("conversationId is required.");
        }
        if (!command.ownerId || command.ownerId.trim().length === 0) {
            throw new Error("ownerId is required.");
        }
        if (!command.participantIds || command.participantIds.length === 0) {
            throw new Error("At least one participant is required.");
        }
        if (command.initialPrompt !== undefined && command.initialPrompt.length > 10000) {
            throw new Error("initialPrompt exceeds maximum length of 10000 characters.");
        }
    }
}
