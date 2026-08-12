export class PostMessageValidator {
    public static validate(command: {
        conversationId: string;
        sessionId: string;
        authorId: string;
        content: string;
        role: string;
        claims: { roles: string[]; permissions: string[] };
    }): void {
        if (!command.conversationId || command.conversationId.trim().length === 0) {
            throw new Error("conversationId is required.");
        }
        if (!command.sessionId || command.sessionId.trim().length === 0) {
            throw new Error("sessionId is required.");
        }
        if (!command.authorId || command.authorId.trim().length === 0) {
            throw new Error("authorId is required.");
        }
        if (!command.content || command.content.trim().length === 0) {
            throw new Error("Message content is required.");
        }
        if (command.content.length > 50000) {
            throw new Error("Message content exceeds maximum length of 50000 characters.");
        }
        const validRoles = ["system", "user", "assistant", "tool"];
        if (!validRoles.includes(command.role)) {
            throw new Error(`Invalid role: ${command.role}.`);
        }
    }
}
