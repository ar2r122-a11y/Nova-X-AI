import { describe, it, expect } from "vitest";
import { AudioChunkDto } from "../../../src/Application/DTO/AudioChunkDto";

describe("AudioChunkDto", () => {
    it("creates with all properties", () => {
        const dto = new AudioChunkDto(1, 4096, "pcm", 1700000000000);
        expect(dto.sequence).toBe(1);
        expect(dto.chunkSizeBytes).toBe(4096);
        expect(dto.codec).toBe("pcm");
        expect(dto.timestamp).toBe(1700000000000);
    });

    it("creates with zero sequence", () => {
        const dto = new AudioChunkDto(0, 1024, "opus", 1700000000000);
        expect(dto.sequence).toBe(0);
        expect(dto.chunkSizeBytes).toBe(1024);
        expect(dto.codec).toBe("opus");
    });

    it("creates with large sequence number", () => {
        const dto = new AudioChunkDto(999999, 8192, "mp3", 1700000000000);
        expect(dto.sequence).toBe(999999);
        expect(dto.chunkSizeBytes).toBe(8192);
    });
});
