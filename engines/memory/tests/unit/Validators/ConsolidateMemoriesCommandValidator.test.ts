import { describe, it, expect } from "vitest";
import { ConsolidateMemoriesCommandValidator } from "../../../src/Application/Validators/ConsolidateMemoriesCommandValidator";
import { ConsolidateMemoriesCommand } from "../../../src/Application/Commands/ConsolidateMemoriesCommand";

describe("ConsolidateMemoriesCommandValidator", () => {
    it("should pass for valid command", () => {
        const validator = new ConsolidateMemoriesCommandValidator();
        const command = new ConsolidateMemoriesCommand("owner-1", ["mem-1", "mem-2"], undefined, { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).not.toThrow();
    });

    it("should throw for empty memoryIds", () => {
        const validator = new ConsolidateMemoriesCommandValidator();
        const command = new ConsolidateMemoriesCommand("owner-1", [], undefined, { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("at least 2 memory IDs");
    });

    it("should throw for too many memoryIds", () => {
        const validator = new ConsolidateMemoriesCommandValidator();
        const ids = Array.from({ length: 101 }, (_, i) => `mem-${i}`);
        const command = new ConsolidateMemoriesCommand("owner-1", ids, undefined, { roles: ["admin"], permissions: [] });
        expect(() => validator.validate(command)).toThrow("more than 100");
    });
});
