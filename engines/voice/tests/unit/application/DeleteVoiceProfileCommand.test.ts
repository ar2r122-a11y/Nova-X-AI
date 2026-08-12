import { describe, it, expect } from "vitest";
import { DeleteVoiceProfileCommand } from "../../../src/Application/Commands/DeleteVoiceProfileCommand";

describe("DeleteVoiceProfileCommand", () => {
    it("creates with required profileId", () => {
        const command = new DeleteVoiceProfileCommand("profile-1");
        expect(command.profileId).toBe("profile-1");
    });

    it("generates correlationId by default", () => {
        const command = new DeleteVoiceProfileCommand("profile-1");
        expect(command.correlationId).toMatch(/^delete-profile-\d+$/);
    });

    it("uses custom correlationId when provided", () => {
        const command = new DeleteVoiceProfileCommand("profile-1", "custom-corr");
        expect(command.correlationId).toBe("custom-corr");
    });

    it("has empty causationId by default", () => {
        const command = new DeleteVoiceProfileCommand("profile-1");
        expect(command.causationId).toBe("");
    });

    it("has empty claims by default", () => {
        const command = new DeleteVoiceProfileCommand("profile-1");
        expect(command.claims).toEqual({ roles: [], permissions: [] });
    });

    it("accepts custom claims", () => {
        const claims = { roles: ["admin"], permissions: ["write"] };
        const command = new DeleteVoiceProfileCommand("profile-1", "corr", "caus", claims);
        expect(command.claims).toEqual(claims);
    });

    it("implements ICommand", () => {
        const command = new DeleteVoiceProfileCommand("profile-1");
        expect(typeof command).toBe("object");
        expect("profileId" in command).toBe(true);
    });
});
