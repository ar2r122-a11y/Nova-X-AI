/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach } from "vitest";
import { WorldEngineAclTranslator } from "../../../src/Infrastructure/Integration/WorldEngineAclTranslator";

describe("WorldEngineAclTranslator", () => {
    let translator: WorldEngineAclTranslator;

    beforeEach(() => {
        translator = new WorldEngineAclTranslator();
    });

    describe("translateLocationPayload", () => {
        it("should translate location payload with id field", () => {
            const result = translator.translateLocationPayload({ id: "loc-1", regionId: "reg-1", x: 10, y: 20, z: 0 });
            expect(result.locationId).toBe("loc-1");
            expect(result.regionId).toBe("reg-1");
            expect(result.coordinate).toEqual({ x: 10, y: 20, z: 0 });
        });

        it("should translate location payload with locationId field", () => {
            const result = translator.translateLocationPayload({ locationId: "loc-2", region: "reg-2", x: 5, y: 15, z: 3 });
            expect(result.locationId).toBe("loc-2");
            expect(result.regionId).toBe("reg-2");
        });

        it("should handle nested coordinate objects", () => {
            const result = translator.translateLocationPayload({ locationId: "loc-3", coordinate: { x: 1, y: 2, z: 3 } });
            expect(result.coordinate).toEqual({ x: 1, y: 2, z: 3 });
        });

        it("should default missing coordinates to 0", () => {
            const result = translator.translateLocationPayload({ id: "loc-4" });
            expect(result.coordinate).toEqual({ x: 0, y: 0, z: 0 });
        });
    });

    describe("translateCoordinateFormat", () => {
        it("should translate flat coordinate format", () => {
            const result = translator.translateCoordinateFormat({ x: 10, y: 20, z: 30 });
            expect(result).toEqual({ x: 10, y: 20, z: 30 });
        });

        it("should default missing coordinates", () => {
            const result = translator.translateCoordinateFormat({});
            expect(result).toEqual({ x: 0, y: 0, z: 0 });
        });
    });

    describe("translateMapFormat", () => {
        it("should translate map format", () => {
            const result = translator.translateMapFormat({ regions: { "region-1": { locations: [] } } });
            expect(result.regions["region-1"].locations).toEqual([]);
        });

        it("should handle empty regions", () => {
            const result = translator.translateMapFormat({});
            expect(result.regions).toEqual({});
        });
    });

    describe("translateIntegrationDto", () => {
        it("should translate command field", () => {
            const result = translator.translateIntegrationDto({ command: "CreateLocation", payload: { name: "Forest" } });
            expect(result.command).toBe("CreateLocation");
            expect(result.payload).toEqual({ name: "Forest" });
        });

        it("should translate type field", () => {
            const result = translator.translateIntegrationDto({ type: "UpdateWeather", payload: {} });
            expect(result.command).toBe("UpdateWeather");
        });

        it("should default payload to empty object", () => {
            const result = translator.translateIntegrationDto({ command: "Test" });
            expect(result.payload).toEqual({});
        });
    });

    describe("validateExternalPayload", () => {
        it("should validate valid payload", () => {
            expect(translator.validateExternalPayload({ key: "value" }, "1.0")).toBe(true);
        });

        it("should reject null payload", () => {
            expect(translator.validateExternalPayload(null, "1.0")).toBe(false);
        });

        it("should reject primitive payload", () => {
            expect(translator.validateExternalPayload("string", "1.0")).toBe(false);
        });
    });

    describe("toInternalDto", () => {
        it("should throw for unsupported schema", () => {
            expect(() => translator.toInternalDto({}, "1.0")).toThrow("ACL translation to internal DTO requires schema registry.");
        });
    });
});
