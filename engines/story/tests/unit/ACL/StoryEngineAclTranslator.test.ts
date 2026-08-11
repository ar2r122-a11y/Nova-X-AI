import { describe, test, expect } from "vitest";
import { StoryEngineAclTranslator } from "../../../src/Infrastructure/ACL/StoryEngineAclTranslator";

describe("StoryEngineAclTranslator", () => {
    const translator = new StoryEngineAclTranslator();

    test("translates valid command payload", () => {
        const payload = { commandType: "StartStoryCommand", storyId: "story-1", title: "Test" };
        expect(() => translator.translateToCommand(payload, "v1")).not.toThrow();
    });

    test("rejects null command payload", () => {
        expect(() => translator.translateToCommand(null, "v1")).toThrow("Invalid command payload");
    });

    test("rejects missing commandType", () => {
        const payload = { storyId: "story-1" };
        expect(() => translator.translateToCommand(payload, "v1")).toThrow("Missing commandType");
    });

    test("normalizes external error", () => {
        const normalized = translator.normalizeExternalError("string error");
        expect(normalized.message).toBe("string error");
        expect(normalized).toBeInstanceOf(Error);
    });

    test("validates external data object", () => {
        expect(() => translator.validateExternalData({ key: "value" }, {})).not.toThrow();
        expect(() => translator.validateExternalData(null, {})).toThrow("null or undefined");
    });
});
