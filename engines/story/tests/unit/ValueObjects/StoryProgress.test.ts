import { describe, it, expect } from "vitest";
import { StoryProgress } from "../../../src/Domain/ValueObjects/StoryProgress";

describe("StoryProgress", () => {
    it("should create initial progress", () => {
        const progress = StoryProgress.initial();
        expect(progress.getCurrentChapterId()).toBeNull();
        expect(progress.getCurrentSceneId()).toBeNull();
        expect(progress.getCompletedScenes()).toHaveLength(0);
        expect(progress.getActiveQuests()).toHaveLength(0);
        expect(progress.getCompletedQuests()).toHaveLength(0);
        expect(progress.getNarrativeFlags()).toEqual({});
    });

    it("should update current scene", () => {
        const progress = StoryProgress.initial().withCurrentScene("scene-1");
        expect(progress.getCurrentSceneId()).toBe("scene-1");
    });

    it("should mark scene completed", () => {
        const progress = StoryProgress.initial().markSceneCompleted("scene-1");
        expect(progress.getCompletedScenes()).toContain("scene-1");
    });

    it("should mark quest active", () => {
        const progress = StoryProgress.initial().markQuestActive("quest-1");
        expect(progress.getActiveQuests()).toContain("quest-1");
    });

    it("should mark quest completed", () => {
        const progress = StoryProgress.initial().markQuestActive("quest-1").markQuestCompleted("quest-1");
        expect(progress.getCompletedQuests()).toContain("quest-1");
        expect(progress.getActiveQuests()).not.toContain("quest-1");
    });

    it("should set flag", () => {
        const progress = StoryProgress.initial().withFlag("met_hero", true);
        expect(progress.getNarrativeFlags()).toEqual({ met_hero: true });
    });
});
