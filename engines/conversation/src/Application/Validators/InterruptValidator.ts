export class InterruptValidator {
    public static validate(command: {
        conversationId: string;
        sessionId: string;
        interruptionType: string;
        requesterId: string;
        claims: { roles: string[]; permissions: string[] };
    }): void {
        if (!command.conversationId || command.conversationId.trim().length === 0) {
            throw new Error("conversationId is required.");
        }
        if (!command.sessionId || command.sessionId.trim().length === 0) {
            throw new Error("sessionId is required.");
        }
        if (!command.interruptionType || command.interruptionType.trim().length === 0) {
            throw new Error("interruptionType is required.");
        }
        if (!command.requesterId || command.requesterId.trim().length === 0) {
            throw new Error("requesterId is required.");
        }
    }
}
