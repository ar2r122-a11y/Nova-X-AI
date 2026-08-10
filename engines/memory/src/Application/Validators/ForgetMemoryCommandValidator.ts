export class ForgetMemoryCommandValidator {
    validate(command: import("../Commands/ForgetMemoryCommand").ForgetMemoryCommand): void {
        if (!command.memoryId || command.memoryId.trim().length === 0) {
            throw new Error("Forget memoryId cannot be empty.");
        }
        if (!command.ownerId || command.ownerId.trim().length === 0) {
            throw new Error("Forget ownerId cannot be empty.");
        }
        if (!command.claims || !command.claims.roles || command.claims.roles.length === 0) {
            throw new Error("Unauthenticated: claims must contain at least one role.");
        }
    }
}
