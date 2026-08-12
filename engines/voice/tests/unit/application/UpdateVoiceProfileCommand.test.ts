import { describe, it, expect } from "vitest";
import { UpdateVoiceProfileCommand } from "../../../src/Application/Commands/UpdateVoiceProfileCommand";

describe("UpdateVoiceProfileCommand", () => {
    it("creates with required profileId", () => {
        const command = new UpdateVoiceProfileCommand("profile-1");
        expect(command.profileId).toBe("profile-1");
    });

    it("accepts optional speakingRate", () => {
        const command = new UpdateVoiceProfileCommand("profile-1", 1.2);
        expect(command.speakingRate).toBe(1.2);
    });

    it("accepts optional pitchModifier", () => {
        const command = new UpdateVoiceProfileCommand("profile-1", undefined, 0.5);
        expect(command.pitchModifier).toBe(0.5);
    });

    it("accepts optional supportedParameters", () => {
        const params = ["stability", "similarity"];
        const command = new UpdateVoiceProfileCommand("profile-1", undefined, undefined, params);
        expect(command.supportedParameters).toEqual(params);
    });

    it("accepts optional modelMetadata", () => {
        const metadata = { version: "v2" };
        const command = new UpdateVoiceProfileCommand("profile-1", undefined, undefined, undefined, metadata);
        expect(command.modelMetadata).toEqual(metadata);
    });

    it("accepts optional providerCapabilityMetadata", () => {
        const metadata = { provider: "openai" };
        const command = new UpdateVoiceProfileCommand("profile-1", undefined, undefined, undefined, undefined, metadata);
        expect(command.providerCapabilityMetadata).toEqual(metadata);
    });

    it("generates correlationId by default", () => {
        const command = new UpdateVoiceProfileCommand("profile-1");
        expect(command.correlationId).toMatch(/^update-profile-\d+$/);
    });

    it("uses custom correlationId when provided", () => {
        const command = new UpdateVoiceProfileCommand("profile-1", undefined, undefined, undefined, undefined, undefined, "custom-corr");
        expect(command.correlationId).toBe("custom-corr");
    });

    it("has empty causationId by default", () => {
        const command = new UpdateVoiceProfileCommand("profile-1");
        expect(command.causationId).toBe("");
    });

    it("has empty claims by default", () => {
        const command = new UpdateVoiceProfileCommand("profile-1");
        expect(command.claims).toEqual({ roles: [], permissions: [] });
    });

    it("accepts custom claims", () => {
        const claims = { roles: ["admin"], permissions: ["write"] };
        const command = new UpdateVoiceProfileCommand("profile-1", undefined, undefined, undefined, undefined, undefined, "corr", "caus", claims);
        expect(command.claims).toEqual(claims);
    });

    it("implements ICommand", () => {
        const command = new UpdateVoiceProfileCommand("profile-1");
        expect(typeof command).toBe("object");
        expect("profileId" in command).toBe(true);
        expect("speakingRate" in command).toBe(true);
        expect("pitchModifier" in command).toBe(true);
        expect("supportedParameters" in command).toBe(true);
        expect("modelMetadata" in command).toBe(true);
        expect("providerCapabilityMetadata" in command).toBe(true);
    });
});
