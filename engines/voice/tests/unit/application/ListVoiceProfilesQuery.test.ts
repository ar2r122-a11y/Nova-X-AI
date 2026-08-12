import { describe, it, expect } from "vitest";
import { ListVoiceProfilesQuery } from "../../../src/Application/Queries/ListVoiceProfilesQuery";

describe("ListVoiceProfilesQuery", () => {
    it("creates with no parameters", () => {
        const query = new ListVoiceProfilesQuery();
        expect(query.characterId).toBeUndefined();
        expect(query.requesterId).toBeUndefined();
    });

    it("accepts optional characterId", () => {
        const query = new ListVoiceProfilesQuery("char-1");
        expect(query.characterId).toBe("char-1");
    });

    it("accepts optional requesterId", () => {
        const query = new ListVoiceProfilesQuery(undefined, "user-1");
        expect(query.requesterId).toBe("user-1");
    });

    it("accepts both characterId and requesterId", () => {
        const query = new ListVoiceProfilesQuery("char-1", "user-1");
        expect(query.characterId).toBe("char-1");
        expect(query.requesterId).toBe("user-1");
    });

    it("implements IQuery", () => {
        const query = new ListVoiceProfilesQuery();
        expect(typeof query).toBe("object");
        expect("characterId" in query).toBe(true);
        expect("requesterId" in query).toBe(true);
    });
});
