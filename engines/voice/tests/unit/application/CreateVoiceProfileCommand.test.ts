import { describe, it, expect } from "vitest";
import { CreateVoiceProfileCommand } from "../../../src/Application/Commands/CreateVoiceProfileCommand";

describe("CreateVoiceProfileCommand", () => {
    it("creates with all required properties", () => {
        const command = new CreateVoiceProfileCommand("char-1", "voice-1", "en-US");
        expect(command.characterId).toBe("char-1");
        expect(command.voiceId).toBe("voice-1");
        expect(command.locale).toBe("en-US");
    });

    it("generates correlationId by default", () => {
        const command = new CreateVoiceProfileCommand("char-1", "voice-1", "en-US");
        expect(command.correlationId).toMatch(/^create-profile-\d+$/);
    });

    it("uses custom correlationId when provided", () => {
        const command = new CreateVoiceProfileCommand("char-1", "voice-1", "en-US", "custom-corr");
        expect(command.correlationId).toBe("custom-corr");
    });

    it("has empty causationId by default", () => {
        const command = new CreateVoiceProfileCommand("char-1", "voice-1", "en-US");
        expect(command.causationId).toBe("");
    });

    it("has empty claims by default", () => {
        const command = new CreateVoiceProfileCommand("char-1", "voice-1", "en-US");
        expect(command.claims).toEqual({ roles: [], permissions: [] });
    });

    it("accepts custom claims", () => {
        const claims = { roles: ["admin"], permissions: ["write"] };
        const command = new CreateVoiceProfileCommand("char-1", "voice-1", "en-US", "corr", "caus", claims);
        expect(command.claims).toEqual(claims);
    });

    it("implements ICommand", () => {
        const command = new CreateVoiceProfileCommand("char-1", "voice-1", "en-US");
        expect(typeof command).toBe("object");
        expect("characterId" in command).toBe(true);
        expect("voiceId" in command).toBe(true);
        expect("locale" in command).toBe(true);
    });
});
