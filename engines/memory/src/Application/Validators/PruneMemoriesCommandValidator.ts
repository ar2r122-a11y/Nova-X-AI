export class PruneMemoriesCommandValidator {
    validate(command: import("../Commands/PruneMemoriesCommand").PruneMemoriesCommand): void {
        if (!command.ownerId || command.ownerId.trim().length === 0) {
            throw new Error("Prune ownerId cannot be empty.");
        }
        if (typeof command.minSalience !== "number" || command.minSalience < 0.0 || command.minSalience > 1.0) {
            throw new Error("Prune minSalience must be between 0.0 and 1.0.");
        }
        if (typeof command.maxAgeMs !== "number" || command.maxAgeMs <= 0) {
            throw new Error("Prune maxAgeMs must be a positive number.");
        }
        if (!command.claims || !command.claims.roles || command.claims.roles.length === 0) {
            throw new Error("Unauthenticated: claims must contain at least one role.");
        }
    }
}
