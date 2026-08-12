import { describe, it, expect } from "vitest";
import { VoiceBudgetDto } from "../../../src/Application/DTO/VoiceBudgetDto";

describe("VoiceBudgetDto", () => {
    it("creates with all properties", () => {
        const dto = new VoiceBudgetDto(
            "voice-1",
            300,
            150,
            65536,
            128,
            4096,
            1024,
            100,
            32768,
            64
        );
        expect(dto.voiceId).toBe("voice-1");
        expect(dto.hardLatencyMs).toBe(300);
        expect(dto.softLatencyMs).toBe(150);
        expect(dto.audioRingBufferBytes).toBe(65536);
        expect(dto.networkBitrateKbps).toBe(128);
        expect(dto.maxInputCharacters).toBe(4096);
        expect(dto.chunkSizeBytes).toBe(1024);
        expect(dto.usedLatencyMs).toBe(100);
        expect(dto.usedRingBufferBytes).toBe(32768);
        expect(dto.usedBitrateKbps).toBe(64);
    });

    it("creates with zero used values", () => {
        const dto = new VoiceBudgetDto(
            "voice-1",
            300,
            150,
            65536,
            128,
            4096,
            1024,
            0,
            0,
            0
        );
        expect(dto.usedLatencyMs).toBe(0);
        expect(dto.usedRingBufferBytes).toBe(0);
        expect(dto.usedBitrateKbps).toBe(0);
    });

    it("creates with matching used and limit values", () => {
        const dto = new VoiceBudgetDto(
            "voice-1",
            300,
            150,
            65536,
            128,
            4096,
            1024,
            300,
            65536,
            128
        );
        expect(dto.usedLatencyMs).toBe(dto.hardLatencyMs);
        expect(dto.usedRingBufferBytes).toBe(dto.audioRingBufferBytes);
        expect(dto.usedBitrateKbps).toBe(dto.networkBitrateKbps);
    });
});
