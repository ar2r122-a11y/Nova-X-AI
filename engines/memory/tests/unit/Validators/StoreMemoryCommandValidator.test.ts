import { describe, it, expect } from "vitest";
import { StoreMemoryCommandValidator } from "../../../src/Application/Validators/StoreMemoryCommandValidator";
import { StoreMemoryCommand } from "../../../src/Application/Commands/StoreMemoryCommand";

describe("StoreMemoryCommandValidator", () => {
    it("should pass for valid command", () => {
        const validator = new StoreMemoryCommandValidator();
        const command = new StoreMemoryCommand("content", "episodic", "owner-1", 0.5, ["tag"], { roles: ["user"], permissions: [] });
        expect(() => validator.validate(command)).not.toThrow();
    });

    it("should throw for empty content", () => {
        const validator = new StoreMemoryCommandValidator();
        const command = new StoreMemoryCommand("", "episodic", "owner-1", 0.5, [], { roles: ["user"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("Memory content cannot be empty.");
    });

    it("should throw for invalid salience", () => {
        const validator = new StoreMemoryCommandValidator();
        const command = new StoreMemoryCommand("content", "episodic", "owner-1", 1.5, [], { roles: ["user"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("between 0.0 and 1.0");
    });

    it("should throw for missing roles", () => {
        const validator = new StoreMemoryCommandValidator();
        const command = new StoreMemoryCommand("content", "episodic", "owner-1", 0.5, [], { roles: [], permissions: [] });
        expect(() => validator.validate(command)).toThrow("at least one role");
    });

    it("should throw for too many tags", () => {
        const validator = new StoreMemoryCommandValidator();
        const tags = Array.from({ length: 21 }, (_, i) => `tag${i}`);
        const command = new StoreMemoryCommand("content", "episodic", "owner-1", 0.5, tags, { roles: ["user"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("more than 20 tags");
    });
});
