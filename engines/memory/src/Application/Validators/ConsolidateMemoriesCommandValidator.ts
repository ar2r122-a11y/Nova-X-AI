export class ConsolidateMemoriesCommandValidator {
    validate(command: import("../Commands/ConsolidateMemoriesCommand").ConsolidateMemoriesCommand): void {
        if (!command.ownerId || command.ownerId.trim().length === 0) {
            throw new Error("Consolidation ownerId cannot be empty.");
        }
        if (!Array.isArray(command.memoryIds) || command.memoryIds.length < 2) {
            throw new Error("Consolidation requires at least 2 memory IDs.");
        }
        if (command.memoryIds.length > 100) {
            throw new Error("Cannot consolidate more than 100 memories at once.");
        }
        if (!command.claims || !command.claims.roles || command.claims.roles.length === 0) {
            throw new Error("Unauthenticated: claims must contain at least one role.");
        }
    }
}
