import { describe, it, expect } from "vitest";
import { StoryIsActiveSpecification } from "../../../src/Domain/Specifications/StoryIsActiveSpecification";
import { StoryIsCompletableSpecification } from "../../../src/Domain/Specifications/StoryIsCompletableSpecification";
import { SceneIsAccessibleSpecification } from "../../../src/Domain/Specifications/SceneIsAccessibleSpecification";
import { QuestIsCompletableSpecification } from "../../../src/Domain/Specifications/QuestIsCompletableSpecification";
import { ObjectiveIsAchievableSpecification } from "../../../src/Domain/Specifications/ObjectiveIsAchievableSpecification";
import { BranchConditionIsSatisfiedSpecification } from "../../../src/Domain/Specifications/BranchConditionIsSatisfiedSpecification";
import { StoryAggregate } from "../../../src/Domain/Aggregates/StoryAggregate";
import { StoryId } from "../../../src/Domain/ValueObjects/StoryId";
import { Scene } from "../../../src/Domain/Entities/Scene";
import { SceneId } from "../../../src/Domain/ValueObjects/SceneId";
import { ChapterId } from "../../../src/Domain/ValueObjects/ChapterId";
import { SceneTypeRef } from "../../../src/Domain/ValueObjects/SceneType";
import { SceneStatusRef } from "../../../src/Domain/ValueObjects/SceneStatus";
import { Quest } from "../../../src/Domain/Entities/Quest";
import { QuestId } from "../../../src/Domain/ValueObjects/QuestId";
import { QuestTypeRef } from "../../../src/Domain/ValueObjects/QuestType";
import { QuestStatusRef } from "../../../src/Domain/ValueObjects/QuestStatus";
import { Objective } from "../../../src/Domain/Entities/Objective";
import { ObjectiveId } from "../../../src/Domain/ValueObjects/ObjectiveId";
import { ObjectiveTypeRef } from "../../../src/Domain/ValueObjects/ObjectiveType";
import { Branch } from "../../../src/Domain/Entities/Branch";
import { BranchId } from "../../../src/Domain/ValueObjects/BranchId";
import { BranchCondition } from "../../../src/Domain/ValueObjects/BranchCondition";
import { NarrativePriorityRef } from "../../../src/Domain/ValueObjects/NarrativePriority";

describe("Specifications", () => {
    it("StoryIsActiveSpecification should return true for active story", () => {
        const story = StoryAggregate.create(StoryId.create("123e4567-e89b-12d3-a456-426614174000"), "Test", "Desc");
        story.start();
        story.commitEvents();
        expect(StoryIsActiveSpecification.isSatisfiedBy(story)).toBe(true);
    });

    it("StoryIsActiveSpecification should return false for draft story", () => {
        const story = StoryAggregate.create(StoryId.create("123e4567-e89b-12d3-a456-426614174000"), "Test", "Desc");
        expect(StoryIsActiveSpecification.isSatisfiedBy(story)).toBe(false);
    });

    it("SceneIsAccessibleSpecification should return true for pending scene", () => {
        const scene = Scene.create({
            chapterId: ChapterId.create("123e4567-e89b-12d3-a456-426614174000"),
            title: "Scene",
            description: "A scene",
            status: SceneStatusRef.initial(),
            type: SceneTypeRef.initial(),
            order: 1,
        });
        expect(SceneIsAccessibleSpecification.isSatisfiedBy(scene, new Map(), [])).toBe(true);
    });

    it("QuestIsCompletableSpecification should return true for completable quest", () => {
        const questId = QuestId.create("123e4567-e89b-12d3-a456-426614174001");
        const storyId = StoryId.create("123e4567-e89b-12d3-a456-426614174000");
        const quest = Quest.create({
            storyId,
            title: "Quest",
            description: "Desc",
            type: QuestTypeRef.initial(),
            prerequisites: [],
            status: QuestStatusRef.active(),
        });
        const obj = Objective.create({ questId, description: "Obj", type: ObjectiveTypeRef.required() });
        obj.complete();
        quest.addObjective(obj);
        expect(QuestIsCompletableSpecification.isSatisfiedBy(quest)).toBe(true);
    });

    it("BranchConditionIsSatisfiedSpecification should handle always condition", () => {
        const branch = Branch.create({
            storyId: StoryId.create("123e4567-e89b-12d3-a456-426614174000"),
            sourceSceneId: SceneId.create("123e4567-e89b-12d3-a456-426614174001"),
            targetSceneId: SceneId.create("123e4567-e89b-12d3-a456-426614174002"),
            condition: BranchCondition.always(),
            priority: NarrativePriorityRef.initial(),
        });
        expect(BranchConditionIsSatisfiedSpecification.isSatisfiedBy(branch, {})).toBe(true);
    });
});
