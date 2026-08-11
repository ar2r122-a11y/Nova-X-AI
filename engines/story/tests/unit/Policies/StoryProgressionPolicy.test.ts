import { describe, it, expect } from "vitest";
import { StoryProgressionPolicy } from "../../../src/Domain/Policies/StoryProgressionPolicy";
import { StoryStatusRef } from "../../../src/Domain/ValueObjects/StoryStatus";
import { SceneStatusRef } from "../../../src/Domain/ValueObjects/SceneStatus";
import { ChapterStatusRef } from "../../../src/Domain/ValueObjects/ChapterStatus";
import { StoryAggregate } from "../../../src/Domain/Aggregates/StoryAggregate";
import { StoryId } from "../../../src/Domain/ValueObjects/StoryId";
import { Chapter } from "../../../src/Domain/Entities/Chapter";
import { ChapterId } from "../../../src/Domain/ValueObjects/ChapterId";
import { Scene } from "../../../src/Domain/Entities/Scene";
import { SceneId } from "../../../src/Domain/ValueObjects/SceneId";
import { SceneTypeRef } from "../../../src/Domain/ValueObjects/SceneType";

describe("StoryProgressionPolicy", () => {
    it("should allow advancing scene from active status with pending scene", () => {
        expect(StoryProgressionPolicy.canAdvanceScene("active", "pending")).toBe(true);
        expect(StoryProgressionPolicy.canAdvanceScene("active", "active")).toBe(true);
    });

    it("should allow advancing scene from paused status", () => {
        expect(StoryProgressionPolicy.canAdvanceScene("paused", "pending")).toBe(true);
    });

    it("should deny advancing scene from completed status", () => {
        expect(StoryProgressionPolicy.canAdvanceScene("completed", "pending")).toBe(false);
    });

    it("should deny advancing scene with completed scene status", () => {
        expect(StoryProgressionPolicy.canAdvanceScene("active", "completed")).toBe(false);
    });

    it("should allow chapter progression from active", () => {
        expect(StoryProgressionPolicy.canProgressChapter("active")).toBe(true);
    });

    it("should deny chapter progression from non-active", () => {
        expect(StoryProgressionPolicy.canProgressChapter("locked")).toBe(false);
    });
});
