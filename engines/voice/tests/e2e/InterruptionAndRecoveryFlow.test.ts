import { describe, it, expect, vi } from "vitest";
import { VoiceEngine } from "../../src/Infrastructure/VoiceEngine";
import { VoiceId } from "../../src/Domain/ValueObjects/VoiceId";
import { VoiceStateRef } from "../../src/Domain/ValueObjects/VoiceState";

const createMockAggregate = () => ({
    getVoiceId: () => VoiceId.create("voice-123"),
    getVoiceState: () => VoiceStateRef.waitingForInput(),
    pause: vi.fn(),
    resume: vi.fn(),
    interruptStream: vi.fn(),
    recover: vi.fn(),
    save: vi.fn(),
    getUncommittedEvents: () => [],
    commitEvents: vi.fn()
});

describe("InterruptionAndRecoveryFlow", () => {
    it("handles interruption flow", async () => {
        const engine = new VoiceEngine(
            {} as any,
            { findById: vi.fn().mockResolvedValue(createMockAggregate()), save: vi.fn() } as any,
            {} as any,
            {} as any,
            {} as any,
            {} as any,
            {} as any,
            {} as any,
            {} as any,
            {} as any
        );

        await expect(
            engine.interrupt({
                voiceId: "voice-123",
                reason: "user_cancel",
                claims: { roles: ["user"] },
                correlationId: "corr-1"
            } as any)
        ).resolves.toBeUndefined();
    });

    it("handles pause and resume flow", async () => {
        const engine = new VoiceEngine(
            {} as any,
            { findById: vi.fn().mockResolvedValue(createMockAggregate()), save: vi.fn() } as any,
            {} as any,
            {} as any,
            {} as any,
            {} as any,
            {} as any,
            {} as any,
            {} as any,
            {} as any
        );

        await expect(
            engine.pause({
                voiceId: "voice-123",
                claims: { roles: ["user"] },
                correlationId: "corr-1"
            } as any)
        ).resolves.toBeUndefined();

        await expect(
            engine.resume({
                voiceId: "voice-123",
                claims: { roles: ["user"] },
                correlationId: "corr-1"
            } as any)
        ).resolves.toBeUndefined();
    });

    it("handles cancel stream flow", async () => {
        const engine = new VoiceEngine(
            {} as any,
            {} as any,
            {} as any,
            {} as any,
            {} as any,
            {} as any,
            {} as any,
            {} as any,
            {} as any,
            {} as any
        );

        await expect(
            engine.cancelStream({
                streamId: "stream-1",
                claims: { roles: ["user"] },
                correlationId: "corr-1"
            } as any)
        ).resolves.toBeUndefined();
    });
});
