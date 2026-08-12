import { describe, it, expect } from "vitest";
import { ValidStateTransitionSpecification } from "../../../src/Domain/Specifications/index";
import { VoiceStateRef } from "../../../src/Domain/ValueObjects/VoiceState";

describe("ValidStateTransitionSpecification", () => {

    describe("isSatisfiedBy", () => {

        it("allows waiting_for_input to synthesizing", () => {
            expect(ValidStateTransitionSpecification.isSatisfiedBy(VoiceStateRef.waitingForInput(), VoiceStateRef.synthesizing())).toBe(true);
        });

        it("allows waiting_for_input to paused", () => {
            expect(ValidStateTransitionSpecification.isSatisfiedBy(VoiceStateRef.waitingForInput(), VoiceStateRef.paused())).toBe(true);
        });

        it("allows waiting_for_input to recovering", () => {
            expect(ValidStateTransitionSpecification.isSatisfiedBy(VoiceStateRef.waitingForInput(), VoiceStateRef.recovering())).toBe(true);
        });

        it("allows synthesizing to streaming_audio", () => {
            expect(ValidStateTransitionSpecification.isSatisfiedBy(VoiceStateRef.synthesizing(), VoiceStateRef.streamingAudio())).toBe(true);
        });

        it("allows synthesizing to failed", () => {
            expect(ValidStateTransitionSpecification.isSatisfiedBy(VoiceStateRef.synthesizing(), VoiceStateRef.failed())).toBe(true);
        });

        it("allows synthesizing to buffering", () => {
            expect(ValidStateTransitionSpecification.isSatisfiedBy(VoiceStateRef.synthesizing(), VoiceStateRef.buffering())).toBe(true);
        });

        it("allows streaming_audio to completed", () => {
            expect(ValidStateTransitionSpecification.isSatisfiedBy(VoiceStateRef.streamingAudio(), VoiceStateRef.completed())).toBe(true);
        });

        it("allows streaming_audio to failed", () => {
            expect(ValidStateTransitionSpecification.isSatisfiedBy(VoiceStateRef.streamingAudio(), VoiceStateRef.failed())).toBe(true);
        });

        it("allows streaming_audio to buffering", () => {
            expect(ValidStateTransitionSpecification.isSatisfiedBy(VoiceStateRef.streamingAudio(), VoiceStateRef.buffering())).toBe(true);
        });

        it("allows buffering to streaming_audio", () => {
            expect(ValidStateTransitionSpecification.isSatisfiedBy(VoiceStateRef.buffering(), VoiceStateRef.streamingAudio())).toBe(true);
        });

        it("allows buffering to failed", () => {
            expect(ValidStateTransitionSpecification.isSatisfiedBy(VoiceStateRef.buffering(), VoiceStateRef.failed())).toBe(true);
        });

        it("allows awaiting_stt to processing_transcription", () => {
            expect(ValidStateTransitionSpecification.isSatisfiedBy(VoiceStateRef.awaitingStt(), VoiceStateRef.processingTranscription())).toBe(true);
        });

        it("allows awaiting_stt to failed", () => {
            expect(ValidStateTransitionSpecification.isSatisfiedBy(VoiceStateRef.awaitingStt(), VoiceStateRef.failed())).toBe(true);
        });

        it("allows processing_transcription to completed", () => {
            expect(ValidStateTransitionSpecification.isSatisfiedBy(VoiceStateRef.processingTranscription(), VoiceStateRef.completed())).toBe(true);
        });

        it("allows processing_transcription to failed", () => {
            expect(ValidStateTransitionSpecification.isSatisfiedBy(VoiceStateRef.processingTranscription(), VoiceStateRef.failed())).toBe(true);
        });

        it("allows processing_transcription to waiting_for_input", () => {
            expect(ValidStateTransitionSpecification.isSatisfiedBy(VoiceStateRef.processingTranscription(), VoiceStateRef.waitingForInput())).toBe(true);
        });

        it("allows completed to waiting_for_input", () => {
            expect(ValidStateTransitionSpecification.isSatisfiedBy(VoiceStateRef.completed(), VoiceStateRef.waitingForInput())).toBe(true);
        });

        it("allows paused to waiting_for_input", () => {
            expect(ValidStateTransitionSpecification.isSatisfiedBy(VoiceStateRef.paused(), VoiceStateRef.waitingForInput())).toBe(true);
        });

        it("allows failed to recovering", () => {
            expect(ValidStateTransitionSpecification.isSatisfiedBy(VoiceStateRef.failed(), VoiceStateRef.recovering())).toBe(true);
        });

        it("allows failed to waiting_for_input", () => {
            expect(ValidStateTransitionSpecification.isSatisfiedBy(VoiceStateRef.failed(), VoiceStateRef.waitingForInput())).toBe(true);
        });

        it("allows recovering to waiting_for_input", () => {
            expect(ValidStateTransitionSpecification.isSatisfiedBy(VoiceStateRef.recovering(), VoiceStateRef.waitingForInput())).toBe(true);
        });

        it("disallows waiting_for_input to completed", () => {
            expect(ValidStateTransitionSpecification.isSatisfiedBy(VoiceStateRef.waitingForInput(), VoiceStateRef.completed())).toBe(false);
        });

        it("disallows completed to failed", () => {
            expect(ValidStateTransitionSpecification.isSatisfiedBy(VoiceStateRef.completed(), VoiceStateRef.failed())).toBe(false);
        });

        it("disallows synthesizing to awaiting_stt", () => {
            expect(ValidStateTransitionSpecification.isSatisfiedBy(VoiceStateRef.synthesizing(), VoiceStateRef.awaitingStt())).toBe(false);
        });

    });

});
