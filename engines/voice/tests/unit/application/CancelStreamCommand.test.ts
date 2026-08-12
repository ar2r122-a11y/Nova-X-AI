import { describe, it, expect } from "vitest";
import { CancelStreamCommand } from "../../../src/Application/Commands/CancelStreamCommand";

describe("CancelStreamCommand", () => {
    it("creates with all required properties", () => {
        const command = new CancelStreamCommand("voice-1", "stream-1");
        expect(command.voiceId).toBe("voice-1");
        expect(command.streamId).toBe("stream-1");
    });

    it("generates correlationId by default", () => {
        const command = new CancelStreamCommand("voice-1", "stream-1");
        expect(command.correlationId).toMatch(/^cancel-\d+$/);
    });

    it("uses custom correlationId when provided", () => {
        const command = new CancelStreamCommand("voice-1", "stream-1", "custom-corr");
        expect(command.correlationId).toBe("custom-corr");
    });

    it("has empty causationId by default", () => {
        const command = new CancelStreamCommand("voice-1", "stream-1");
        expect(command.causationId).toBe("");
    });

    it("has empty claims by default", () => {
        const command = new CancelStreamCommand("voice-1", "stream-1");
        expect(command.claims).toEqual({ roles: [], permissions: [] });
    });

    it("accepts custom claims", () => {
        const claims = { roles: ["admin"], permissions: ["write"] };
        const command = new CancelStreamCommand("voice-1", "stream-1", "corr", "caus", claims);
        expect(command.claims).toEqual(claims);
    });

    it("implements ICommand", () => {
        const command = new CancelStreamCommand("voice-1", "stream-1");
        expect(typeof command).toBe("object");
        expect("voiceId" in command).toBe(true);
        expect("streamId" in command).toBe(true);
    });
});
