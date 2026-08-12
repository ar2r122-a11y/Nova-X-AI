import { describe, it, expect } from "vitest";
import { VoiceSessionStateRef } from "../../../src/Domain/ValueObjects/VoiceSessionState";

describe("VoiceSessionStateRef", () => {

    describe("create", () => {

        it("creates a VoiceSessionStateRef for a valid state", () => {
            const ref = VoiceSessionStateRef.create("active");
            expect(ref.getValue()).toBe("active");
        });

        it("throws for an invalid state", () => {
            expect(() => VoiceSessionStateRef.create("invalid" as any)).toThrow("Invalid VoiceSessionState: invalid");
        });

    });

    describe("idle", () => {

        it("returns a ref with idle state", () => {
            const ref = VoiceSessionStateRef.idle();
            expect(ref.getValue()).toBe("idle");
        });

    });

    describe("active", () => {

        it("returns a ref with active state", () => {
            const ref = VoiceSessionStateRef.active();
            expect(ref.getValue()).toBe("active");
        });

    });

    describe("completed", () => {

        it("returns a ref with completed state", () => {
            const ref = VoiceSessionStateRef.completed();
            expect(ref.getValue()).toBe("completed");
        });

    });

    describe("failed", () => {

        it("returns a ref with failed state", () => {
            const ref = VoiceSessionStateRef.failed();
            expect(ref.getValue()).toBe("failed");
        });

    });

    describe("getValue", () => {

        it("returns the stored state value", () => {
            const ref = VoiceSessionStateRef.create("interrupted");
            expect(ref.getValue()).toBe("interrupted");
        });

    });

});
