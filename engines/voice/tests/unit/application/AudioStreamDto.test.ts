import { describe, it, expect } from "vitest";
import { AudioStreamDto } from "../../../src/Application/DTO/AudioStreamDto";

describe("AudioStreamDto", () => {
    it("creates with all properties", () => {
        const dto = new AudioStreamDto("stream-1", "voice-1", "req-1", "profile-1", "provider-1", "Hello", "streaming", 10, 40960, 1700000000000, null);
        expect(dto.streamId).toBe("stream-1");
        expect(dto.voiceId).toBe("voice-1");
        expect(dto.requestId).toBe("req-1");
        expect(dto.profileId).toBe("profile-1");
        expect(dto.providerId).toBe("provider-1");
        expect(dto.text).toBe("Hello");
        expect(dto.status).toBe("streaming");
        expect(dto.totalChunks).toBe(10);
        expect(dto.totalBytes).toBe(40960);
        expect(dto.createdAt).toBe(1700000000000);
        expect(dto.completedAt).toBeNull();
    });

    it("creates with completedAt set", () => {
        const dto = new AudioStreamDto("stream-1", "voice-1", "req-1", "profile-1", "provider-1", "Hello", "completed", 10, 40960, 1700000000000, 1700000005000);
        expect(dto.completedAt).toBe(1700000005000);
    });

    it("creates from aggregate", () => {
        const aggregate = {
            getStreamId: () => "stream-1",
            getVoiceId: () => "voice-1",
            getRequestId: () => "req-1",
            getProfileId: () => "profile-1",
            getProviderId: () => "provider-1",
            getText: () => "Hello",
            getStatus: () => "streaming",
            getChunks: () => [{ getByteLength: () => 4096 }],
            getTotalBytes: () => 4096,
            getCreatedAt: () => 1700000000000,
            getCompletedAt: () => null
        };
        const dto = AudioStreamDto.fromAggregate(aggregate as any);
        expect(dto.streamId).toBe("stream-1");
        expect(dto.voiceId).toBe("voice-1");
        expect(dto.requestId).toBe("req-1");
        expect(dto.profileId).toBe("profile-1");
        expect(dto.providerId).toBe("provider-1");
        expect(dto.text).toBe("Hello");
        expect(dto.status).toBe("streaming");
        expect(dto.totalChunks).toBe(1);
        expect(dto.totalBytes).toBe(4096);
        expect(dto.createdAt).toBe(1700000000000);
        expect(dto.completedAt).toBeNull();
    });

    it("fromAggregate computes totalChunks from chunks array", () => {
        const aggregate = {
            getStreamId: () => "stream-1",
            getVoiceId: () => "voice-1",
            getRequestId: () => "req-1",
            getProfileId: () => "profile-1",
            getProviderId: () => "provider-1",
            getText: () => "Hello",
            getStatus: () => "streaming",
            getChunks: () => [
                { getByteLength: () => 4096 },
                { getByteLength: () => 4096 },
                { getByteLength: () => 4096 }
            ],
            getTotalBytes: () => 12288,
            getCreatedAt: () => 1700000000000,
            getCompletedAt: () => null
        };
        const dto = AudioStreamDto.fromAggregate(aggregate as any);
        expect(dto.totalChunks).toBe(3);
        expect(dto.totalBytes).toBe(12288);
    });

    it("fromAggregate returns a new instance each call", () => {
        const aggregate = {
            getStreamId: () => "stream-1",
            getVoiceId: () => "voice-1",
            getRequestId: () => "req-1",
            getProfileId: () => "profile-1",
            getProviderId: () => "provider-1",
            getText: () => "Hello",
            getStatus: () => "streaming",
            getChunks: () => [],
            getTotalBytes: () => 0,
            getCreatedAt: () => 1700000000000,
            getCompletedAt: () => null
        };
        const dto1 = AudioStreamDto.fromAggregate(aggregate as any);
        const dto2 = AudioStreamDto.fromAggregate(aggregate as any);
        expect(dto1).not.toBe(dto2);
        expect(dto1.streamId).toBe(dto2.streamId);
    });
});
