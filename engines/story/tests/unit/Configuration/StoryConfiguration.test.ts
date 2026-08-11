import { describe, test, expect } from "vitest";
import { StoryConfiguration, DEFAULT_STORY_CONFIGURATION } from "../../../src/Infrastructure/Configuration/StoryConfiguration";

describe("StoryConfiguration", () => {
    test("has default configuration", () => {
        expect(DEFAULT_STORY_CONFIGURATION.version).toBe("2.0.0");
        expect(DEFAULT_STORY_CONFIGURATION.featureFlags.ENABLE_REALTIME_COOP).toBe(false);
        expect(DEFAULT_STORY_CONFIGURATION.featureFlags.ENABLE_ADVANCED_AI_PROMPTING).toBe(false);
    });

    test("accepts custom configuration", () => {
        const config: StoryConfiguration = {
            version: "2.1.0",
            featureFlags: {
                ENABLE_REALTIME_COOP: true,
                ENABLE_ADVANCED_AI_PROMPTING: true,
            },
        };

        expect(config.featureFlags.ENABLE_REALTIME_COOP).toBe(true);
        expect(config.featureFlags.ENABLE_ADVANCED_AI_PROMPTING).toBe(true);
    });
});
