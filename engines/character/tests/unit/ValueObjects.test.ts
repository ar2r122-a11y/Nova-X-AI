import { describe, it, expect } from "vitest";
import { CharacterId } from "../../src/Domain/ValueObjects";
import { PersonalityTrait } from "../../src/Domain/ValueObjects";
import { CharacterStatus } from "../../src/Domain/ValueObjects";
import { EnergyLevel } from "../../src/Domain/ValueObjects";
import { CharacterStage } from "../../src/Domain/ValueObjects";

describe("ValueObjects", () => {
    it("CharacterId should create unique IDs", () => {
        const id1 = CharacterId.create();
        const id2 = CharacterId.create();
        expect(id1.getValue()).not.toBe(id2.getValue());
        expect(id1.getValue()).toMatch(/^char-/);
    });

    it("CharacterId should support fromString", () => {
        const id = CharacterId.fromString("char-123");
        expect(id.getValue()).toBe("char-123");
    });

    it("CharacterId should support equality", () => {
        const id1 = CharacterId.fromString("char-123");
        const id2 = CharacterId.fromString("char-123");
        const id3 = CharacterId.fromString("char-456");
        expect(id1.equals(id2)).toBe(true);
        expect(id1.equals(id3)).toBe(false);
    });

    it("PersonalityTrait should validate score bounds", () => {
        expect(() => PersonalityTrait.create("openness", 1.5)).toThrow();
        expect(() => PersonalityTrait.create("openness", -0.1)).toThrow();
        const trait = PersonalityTrait.create("openness", 0.8);
        expect(trait.getValue().score).toBe(0.8);
    });

    it("CharacterStatus should have valid states", () => {
        expect(CharacterStatus.create("active").getValue()).toBe("active");
        expect(CharacterStatus.create("sleeping").getValue()).toBe("sleeping");
    });

    it("EnergyLevel should validate bounds", () => {
        expect(() => EnergyLevel.create(1.5)).toThrow();
        expect(() => EnergyLevel.create(-0.1)).toThrow();
        expect(EnergyLevel.create(0.5).getValue()).toBe(0.5);
    });

    it("CharacterStage should have valid stages", () => {
        expect(CharacterStage.create("initial").getValue()).toBe("initial");
        expect(CharacterStage.create("evolved").getValue()).toBe("evolved");
    });
});
