import { describe, it, expect } from "vitest";
import { GetVoiceProfileQuery } from "../../../src/Application/Queries/GetVoiceProfileQuery";

describe("GetVoiceProfileQuery", () => {
    it("creates with required profileId", () => {
        const query = new GetVoiceProfileQuery("profile-1");
        expect(query.profileId).toBe("profile-1");
    });

    it("has undefined requesterId by default", () => {
        const query = new GetVoiceProfileQuery("profile-1");
        expect(query.requesterId).toBeUndefined();
    });

    it("accepts optional requesterId", () => {
        const query = new GetVoiceProfileQuery("profile-1", "user-1");
        expect(query.requesterId).toBe("user-1");
    });

    it("implements IQuery", () => {
        const query = new GetVoiceProfileQuery("profile-1");
        expect(typeof query).toBe("object");
        expect("profileId" in query).toBe(true);
        expect("requesterId" in query).toBe(true);
    });
});
