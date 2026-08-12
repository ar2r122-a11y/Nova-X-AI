import { describe, it, expect } from "vitest";
import { VoiceStateRef } from "../../../src/Domain/ValueObjects/VoiceState";

describe("VoiceStateRef", () => {

    describe("create", () => {

        it("creates a VoiceStateRef for a valid state", () => {
            const ref = VoiceStateRef.create("synthesizing");
            expect(ref.getValue()).toBe("synthesizing");
        });

        it("throws for an invalid state", () => {
            expect(() => VoiceStateRef.create("invalid_state" as any)).toThrow("Invalid VoiceState: invalid_state");
        });

    });

    describe("waitingForInput", () => {

        it("returns a ref with waiting_for_input state", () => {
            const ref = VoiceStateRef.waitingForInput();
            expect(ref.getValue()).toBe("waiting_for_input");
        });

    });

    describe("synthesizing", () => {

        it("returns a ref with synthesizing state", () => {
            const ref = VoiceStateRef.synthesizing();
            expect(ref.getValue()).toBe("synthesizing");
        });

    });

    describe("streamingAudio", () => {

        it("returns a ref with streaming_audio state", () => {
            const ref = VoiceStateRef.streamingAudio();
            expect(ref.getValue()).toBe("streaming_audio");
        });

    });

    describe("buffering", () => {

        it("returns a ref with buffering state", () => {
            const ref = VoiceStateRef.buffering();
            expect(ref.getValue()).toBe("buffering");
        });

    });

    describe("awaitingStt", () => {

        it("returns a ref with awaiting_stt state", () => {
            const ref = VoiceStateRef.awaitingStt();
            expect(ref.getValue()).toBe("awaiting_stt");
        });

    });

    describe("processingTranscription", () => {

        it("returns a ref with processing_transcription state", () => {
            const ref = VoiceStateRef.processingTranscription();
            expect(ref.getValue()).toBe("processing_transcription");
        });

    });

    describe("completed", () => {

        it("returns a ref with completed state", () => {
            const ref = VoiceStateRef.completed();
            expect(ref.getValue()).toBe("completed");
        });

    });

    describe("paused", () => {

        it("returns a ref with paused state", () => {
            const ref = VoiceStateRef.paused();
            expect(ref.getValue()).toBe("paused");
        });

    });

    describe("failed", () => {

        it("returns a ref with failed state", () => {
            const ref = VoiceStateRef.failed();
            expect(ref.getValue()).toBe("failed");
        });

    });

    describe("recovering", () => {

        it("returns a ref with recovering state", () => {
            const ref = VoiceStateRef.recovering();
            expect(ref.getValue()).toBe("recovering");
        });

    });

    describe("getValue", () => {

        it("returns the stored state value", () => {
            const ref = VoiceStateRef.create("buffering");
            expect(ref.getValue()).toBe("buffering");
        });

    });

    describe("equals", () => {

        it("returns true for the same state", () => {
            const a = VoiceStateRef.completed();
            const b = VoiceStateRef.completed();
            expect(a.equals(b)).toBe(true);
        });

        it("returns false for different states", () => {
            const a = VoiceStateRef.completed();
            const b = VoiceStateRef.failed();
            expect(a.equals(b)).toBe(false);
        });

    });

});
