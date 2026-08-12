import { describe, it, expect } from "vitest";
import { RetryUtteranceCommand } from "../../../src/Application/Commands/RetryUtteranceCommand";

describe("RetryUtteranceCommand", () => {
    it("creates with all required properties", () => {
        const command = new RetryUtteranceCommand("voice-1", "req-1");
        expect(command.voiceId).toBe("voice-1");
        expect(command.requestId).toBe("req-1");
    });

    it("generates correlationId by default", () => {
        const command = new RetryUtteranceCommand("voice-1", "req-1");
        expect(command.correlationId).toMatch(/^retry-\d+$/);
    });

    it("uses custom correlationId when provided", () => {
        const command = new RetryUtteranceCommand("voice-1", "req-1", "custom-corr");
        expect(command.correlationId).toBe("custom-corr");
    });

    it("has empty causationId by default", () => {
        const command = new RetryUtteranceCommand("voice-1", "req-1");
        expect(command.causationId).toBe("");
    });

    it("has empty claims by default", () => {
        const command = new RetryUtteranceCommand("voice-1", "req-1");
        expect(command.claims).toEqual({ roles: [], permissions: [] });
    });

    it("accepts custom claims", () => {
        const claims = { roles: ["user"], permissions: ["read"] };
        const command = new RetryUtteranceCommand("voice-1", "req-1", "corr", "caus", claims);
        expect(command.claims).toEqual(claims);
    });

    it("implements ICommand", () => {
        const command = new RetryUtteranceCommand("voice-1", "req-1");
        expect(typeof command).toBe("object");
        expect("voiceId" in command).toBe(true);
        expect("requestId" in command).toBe(true);
    });
});
