import { describe, it, expect } from "vitest";
import { GetVoiceProfileQuery } from "../../../src/Application/Queries/GetVoiceProfileQuery";
import { GetVoiceSessionQuery } from "../../../src/Application/Queries/GetVoiceSessionQuery";
import { GetAudioStreamQuery } from "../../../src/Application/Queries/GetAudioStreamQuery";
import { ListVoiceProfilesQuery } from "../../../src/Application/Queries/ListVoiceProfilesQuery";
import { GetSynthesisStatusQuery } from "../../../src/Application/Queries/GetSynthesisStatusQuery";
import { GetProviderHealthQuery } from "../../../src/Application/Queries/GetProviderHealthQuery";
import { GetAudioCacheQuery } from "../../../src/Application/Queries/GetAudioCacheQuery";
import type { IQuery } from "@nova-x-ai/core";

describe("QueryContract", () => {
    it("GetVoiceProfileQuery implements IQuery", () => {
        const query = new GetVoiceProfileQuery("profile-1", "user-1");
        expect(query).toBeInstanceOf(GetVoiceProfileQuery);
        expect(query.profileId).toBe("profile-1");
        expect(query.requesterId).toBe("user-1");
    });

    it("GetVoiceSessionQuery implements IQuery", () => {
        const query = new GetVoiceSessionQuery("session-1", "user-1");
        expect(query).toBeInstanceOf(GetVoiceSessionQuery);
        expect(query.sessionId).toBe("session-1");
    });

    it("GetAudioStreamQuery implements IQuery", () => {
        const query = new GetAudioStreamQuery("stream-1", "user-1");
        expect(query).toBeInstanceOf(GetAudioStreamQuery);
        expect(query.streamId).toBe("stream-1");
    });

    it("ListVoiceProfilesQuery implements IQuery", () => {
        const query = new ListVoiceProfilesQuery("char-1", "user-1");
        expect(query).toBeInstanceOf(ListVoiceProfilesQuery);
        expect(query.characterId).toBe("char-1");
    });

    it("GetSynthesisStatusQuery implements IQuery", () => {
        const query = new GetSynthesisStatusQuery("voice-1", "user-1");
        expect(query).toBeInstanceOf(GetSynthesisStatusQuery);
        expect(query.voiceId).toBe("voice-1");
    });

    it("GetProviderHealthQuery implements IQuery", () => {
        const query = new GetProviderHealthQuery("default", "user-1");
        expect(query).toBeInstanceOf(GetProviderHealthQuery);
        expect(query.providerId).toBe("default");
    });

    it("GetAudioCacheQuery implements IQuery", () => {
        const query = new GetAudioCacheQuery("voice-1", "user-1");
        expect(query).toBeInstanceOf(GetAudioCacheQuery);
        expect(query.voiceId).toBe("voice-1");
    });
});
