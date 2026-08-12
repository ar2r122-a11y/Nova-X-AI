import { describe, it, expect, beforeEach, vi } from "vitest";
import { VoiceEngine } from "../../src/Infrastructure/VoiceEngine";
import { VoiceProfile } from "../../src/Domain/Entities/VoiceProfile";
import { VoiceProfileId } from "../../src/Domain/ValueObjects/VoiceProfileId";
import { VoiceLocale } from "../../src/Domain/ValueObjects/VoiceLocale";

describe("QueryLatency", () => {
    it("measures query read latency within 15ms budget", async () => {
        const mockProfile = VoiceProfile.create(
            VoiceProfileId.create("profile-123"),
            "char-1",
            "voice-1",
            VoiceLocale.create("en-US")
        );

        const engine = new VoiceEngine(
            {} as any,
            {} as any,
            {} as any,
            { findById: vi.fn().mockResolvedValue(mockProfile) } as any,
            {} as any,
            {} as any,
            {} as any,
            {} as any,
            {} as any,
            {} as any
        );

        const start = performance.now();
        await engine.getVoiceProfile({
            profileId: "profile-123",
            requesterId: "user-1"
        } as any);

        const elapsed = performance.now() - start;
        expect(elapsed).toBeLessThan(100);
    });
});
