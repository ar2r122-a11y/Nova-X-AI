import { describe, it, expect, vi, beforeEach } from "vitest";
import { SpeakerVoiceMapping } from "../../../src/Infrastructure/MultiSpeaker";

describe("SpeakerVoiceMapping", () => {
    let mapping: SpeakerVoiceMapping;

    beforeEach(() => {
        mapping = new SpeakerVoiceMapping();
    });

    describe("map", () => {

        it("maps character id to voice profile id", () => {
            mapping.map("character-1", "profile-1");
            expect(mapping.get("character-1")).toBe("profile-1");
        });

        it("overwrites existing mapping", () => {
            mapping.map("character-1", "profile-1");
            mapping.map("character-1", "profile-2");
            expect(mapping.get("character-1")).toBe("profile-2");
        });

    });

    describe("get", () => {

        it("returns voice profile id for mapped character", () => {
            mapping.map("character-1", "profile-1");
            expect(mapping.get("character-1")).toBe("profile-1");
        });

        it("returns undefined for unknown character", () => {
            expect(mapping.get("unknown")).toBeUndefined();
        });

    });

    describe("remove", () => {

        it("removes mapping for character", () => {
            mapping.map("character-1", "profile-1");
            mapping.remove("character-1");
            expect(mapping.get("character-1")).toBeUndefined();
        });

        it("does nothing when removing unknown character", () => {
            expect(() => mapping.remove("unknown")).not.toThrow();
        });

    });

    describe("clear", () => {

        it("removes all mappings", () => {
            mapping.map("character-1", "profile-1");
            mapping.map("character-2", "profile-2");
            mapping.clear();
            expect(mapping.get("character-1")).toBeUndefined();
            expect(mapping.get("character-2")).toBeUndefined();
        });

    });

});
