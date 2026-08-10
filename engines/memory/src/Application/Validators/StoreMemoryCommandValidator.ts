export class StoreMemoryCommandValidator {
    validate(command: import("../Commands/StoreMemoryCommand").StoreMemoryCommand): void {
        if (!command.content || command.content.trim().length === 0) {
            throw new Error("Memory content cannot be empty.");
        }
        if (!command.ownerId || command.ownerId.trim().length === 0) {
            throw new Error("Memory ownerId cannot be empty.");
        }
        if (!command.memoryType || command.memoryType.trim().length === 0) {
            throw new Error("Memory type cannot be empty.");
        }
        if (!command.claims || !command.claims.roles || command.claims.roles.length === 0) {
            throw new Error("Unauthenticated: claims must contain at least one role.");
        }
        if (typeof command.salience !== "number" || command.salience < 0.0 || command.salience > 1.0) {
            throw new Error("Memory salience must be between 0.0 and 1.0.");
        }
        if (command.tags.length > 20) {
            throw new Error("Memory cannot have more than 20 tags.");
        }
        if (command.content.length > 50000) {
            throw new Error("Memory content exceeds maximum length of 50000 characters.");
        }
    }
}
