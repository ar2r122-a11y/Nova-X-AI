import { describe, it, expect } from "vitest";
import { ForgetMemoryCommandValidator } from "../../../src/Application/Validators/ForgetMemoryCommandValidator";
import { ForgetMemoryCommand } from "../../../src/Application/Commands/ForgetMemoryCommand";

describe("ForgetMemoryCommandValidator", () => {
    it("should pass for valid command", () => {
        const validator = new ForgetMemoryCommandValidator();
        const command = new ForgetMemoryCommand("mem-1", "owner-1", { roles: ["user"], permissions: [] });
        expect(() => validator.validate(command)).not.toThrow();
    });

    it("should throw for empty memoryId", () => {
        const validator = new ForgetMemoryCommandValidator();
        const command = new ForgetMemoryCommand("", "owner-1", { roles: ["user"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("Forget memoryId cannot be empty.");
    });

    it("should throw for empty ownerId", () => {
        const validator = new ForgetMemoryCommandValidator();
        const command = new ForgetMemoryCommand("mem-1", "", { roles: ["user"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("Forget ownerId cannot be empty.");
    });
});
