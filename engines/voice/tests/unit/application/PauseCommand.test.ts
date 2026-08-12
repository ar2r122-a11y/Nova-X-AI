import { describe, it, expect } from "vitest";
import { PauseCommand } from "../../../src/Application/Commands/PauseCommand";

describe("PauseCommand", () => {
    it("creates with required voiceId", () => {
        const command = new PauseCommand("voice-1");
        expect(command.voiceId).toBe("voice-1");
    });

    it("generates correlationId by default", () => {
        const command = new PauseCommand("voice-1");
        expect(command.correlationId).toMatch(/^pause-\d+$/);
    });

    it("uses custom correlationId when provided", () => {
        const command = new PauseCommand("voice-1", "custom-corr");
        expect(command.correlationId).toBe("custom-corr");
    });

    it("has empty causationId by default", () => {
        const command = new PauseCommand("voice-1");
        expect(command.causationId).toBe("");
    });

    it("has empty claims by default", () => {
        const command = new PauseCommand("voice-1");
        expect(command.claims).toEqual({ roles: [], permissions: [] });
    });

    it("accepts custom claims", () => {
        const claims = { roles: ["user"], permissions: ["read"] };
        const command = new PauseCommand("voice-1", "corr", "caus", claims);
        expect(command.claims).toEqual(claims);
    });

    it("implements ICommand", () => {
        const command = new PauseCommand("voice-1");
        expect(typeof command).toBe("object");
        expect("voiceId" in command).toBe(true);
    });
});
