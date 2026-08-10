import { describe, it, expect } from "vitest";
import { PruneMemoriesCommandValidator } from "../../../src/Application/Validators/PruneMemoriesCommandValidator";
import { PruneMemoriesCommand } from "../../../src/Application/Commands/PruneMemoriesCommand";

describe("PruneMemoriesCommandValidator", () => {
    it("should pass for valid command", () => {
        const validator = new PruneMemoriesCommandValidator();
        const command = new PruneMemoriesCommand("owner-1", 0.1, 1000000000, { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).not.toThrow();
    });

    it("should throw for empty ownerId", () => {
        const validator = new PruneMemoriesCommandValidator();
        const command = new PruneMemoriesCommand("", 0.1, 1000000000, { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("Prune ownerId cannot be empty.");
    });

    it("should throw for invalid minSalience", () => {
        const validator = new PruneMemoriesCommandValidator();
        const command = new PruneMemoriesCommand("owner-1", -0.1, 1000000000, { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("between 0.0 and 1.0");
    });

    it("should throw for non-positive maxAgeMs", () => {
        const validator = new PruneMemoriesCommandValidator();
        const command = new PruneMemoriesCommand("owner-1", 0.1, 0, { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("positive number");
    });
});
