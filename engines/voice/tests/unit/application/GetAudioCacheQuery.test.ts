import { describe, it, expect } from "vitest";
import { GetAudioCacheQuery } from "../../../src/Application/Queries/GetAudioCacheQuery";

describe("GetAudioCacheQuery", () => {
    it("creates with required voiceId", () => {
        const query = new GetAudioCacheQuery("voice-1");
        expect(query.voiceId).toBe("voice-1");
    });

    it("has undefined requesterId by default", () => {
        const query = new GetAudioCacheQuery("voice-1");
        expect(query.requesterId).toBeUndefined();
    });

    it("accepts optional requesterId", () => {
        const query = new GetAudioCacheQuery("voice-1", "user-1");
        expect(query.requesterId).toBe("user-1");
    });

    it("implements IQuery", () => {
        const query = new GetAudioCacheQuery("voice-1");
        expect(typeof query).toBe("object");
        expect("voiceId" in query).toBe(true);
        expect("requesterId" in query).toBe(true);
    });
});
