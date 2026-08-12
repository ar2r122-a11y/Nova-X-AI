import { describe, it, expect } from "vitest";
import { GetAudioStreamQuery } from "../../../src/Application/Queries/GetAudioStreamQuery";

describe("GetAudioStreamQuery", () => {
    it("creates with required streamId", () => {
        const query = new GetAudioStreamQuery("stream-1");
        expect(query.streamId).toBe("stream-1");
    });

    it("has undefined requesterId by default", () => {
        const query = new GetAudioStreamQuery("stream-1");
        expect(query.requesterId).toBeUndefined();
    });

    it("accepts optional requesterId", () => {
        const query = new GetAudioStreamQuery("stream-1", "user-1");
        expect(query.requesterId).toBe("user-1");
    });

    it("implements IQuery", () => {
        const query = new GetAudioStreamQuery("stream-1");
        expect(typeof query).toBe("object");
        expect("streamId" in query).toBe(true);
        expect("requesterId" in query).toBe(true);
    });
});
