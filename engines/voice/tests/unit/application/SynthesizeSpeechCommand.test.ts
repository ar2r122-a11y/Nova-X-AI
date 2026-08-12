import { describe, it, expect } from "vitest";
import { SynthesizeSpeechCommand } from "../../../src/Application/Commands/SynthesizeSpeechCommand";

describe("SynthesizeSpeechCommand", () => {
    it("creates with all required properties", () => {
        const command = new SynthesizeSpeechCommand("voice-1", "Hello world", "profile-1", "provider-1");
        expect(command.voiceId).toBe("voice-1");
        expect(command.text).toBe("Hello world");
        expect(command.voiceProfileId).toBe("profile-1");
        expect(command.providerId).toBe("provider-1");
    });

    it("uses optional providerId as undefined", () => {
        const command = new SynthesizeSpeechCommand("voice-1", "Hello", "profile-1");
        expect(command.providerId).toBeUndefined();
    });

    it("generates correlationId by default", () => {
        const command = new SynthesizeSpeechCommand("voice-1", "Hello", "profile-1");
        expect(command.correlationId).toMatch(/^synth-\d+$/);
    });

    it("uses custom correlationId when provided", () => {
        const command = new SynthesizeSpeechCommand("voice-1", "Hello", "profile-1", undefined, "custom-corr");
        expect(command.correlationId).toBe("custom-corr");
    });

    it("has empty causationId by default", () => {
        const command = new SynthesizeSpeechCommand("voice-1", "Hello", "profile-1");
        expect(command.causationId).toBe("");
    });

    it("has empty claims by default", () => {
        const command = new SynthesizeSpeechCommand("voice-1", "Hello", "profile-1");
        expect(command.claims).toEqual({ roles: [], permissions: [] });
    });

    it("accepts custom claims", () => {
        const claims = { roles: ["user"], permissions: ["read"] };
        const command = new SynthesizeSpeechCommand("voice-1", "Hello", "profile-1", undefined, "corr", "caus", claims);
        expect(command.claims).toEqual(claims);
    });

    it("implements ICommand", () => {
        const command = new SynthesizeSpeechCommand("voice-1", "Hello", "profile-1");
        expect(typeof command).toBe("object");
        expect("voiceId" in command).toBe(true);
        expect("text" in command).toBe(true);
        expect("voiceProfileId" in command).toBe(true);
    });
});
