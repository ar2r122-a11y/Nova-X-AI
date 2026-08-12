import { describe, it, expect } from "vitest";
import { InterruptCommand } from "../../../src/Application/Commands/InterruptCommand";

describe("InterruptCommand", () => {
    it("creates with all required properties", () => {
        const command = new InterruptCommand("voice-1", "req-1", "user request");
        expect(command.voiceId).toBe("voice-1");
        expect(command.requestId).toBe("req-1");
        expect(command.reason).toBe("user request");
    });

    it("generates correlationId by default", () => {
        const command = new InterruptCommand("voice-1", "req-1", "user request");
        expect(command.correlationId).toMatch(/^interrupt-\d+$/);
    });

    it("uses custom correlationId when provided", () => {
        const command = new InterruptCommand("voice-1", "req-1", "user request", "custom-corr");
        expect(command.correlationId).toBe("custom-corr");
    });

    it("has empty causationId by default", () => {
        const command = new InterruptCommand("voice-1", "req-1", "user request");
        expect(command.causationId).toBe("");
    });

    it("has empty claims by default", () => {
        const command = new InterruptCommand("voice-1", "req-1", "user request");
        expect(command.claims).toEqual({ roles: [], permissions: [] });
    });

    it("accepts custom claims", () => {
        const claims = { roles: ["admin"], permissions: ["write"] };
        const command = new InterruptCommand("voice-1", "req-1", "user request", "corr", "caus", claims);
        expect(command.claims).toEqual(claims);
    });

    it("implements ICommand", () => {
        const command = new InterruptCommand("voice-1", "req-1", "user request");
        expect(typeof command).toBe("object");
        expect("voiceId" in command).toBe(true);
        expect("requestId" in command).toBe(true);
        expect("reason" in command).toBe(true);
    });
});
