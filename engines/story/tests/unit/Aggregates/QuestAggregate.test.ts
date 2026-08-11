import { describe, it, expect } from "vitest";
import { QuestAggregate } from "../../../src/Domain/Aggregates/QuestAggregate";
import { QuestId } from "../../../src/Domain/ValueObjects/QuestId";
import { StoryId } from "../../../src/Domain/ValueObjects/StoryId";
import { QuestTypeRef } from "../../../src/Domain/ValueObjects/QuestType";
import { QuestStatusRef } from "../../../src/Domain/ValueObjects/QuestStatus";
import { Objective } from "../../../src/Domain/Entities/Objective";
import { ObjectiveId } from "../../../src/Domain/ValueObjects/ObjectiveId";
import { ObjectiveTypeRef } from "../../../src/Domain/ValueObjects/ObjectiveType";

describe("QuestAggregate", () => {
    it("should create a new quest", () => {
        const questId = QuestId.create("123e4567-e89b-12d3-a456-426614174001");
        const storyId = StoryId.create("123e4567-e89b-12d3-a456-426614174000");
        const aggregate = QuestAggregate.create(questId, storyId, "Main Quest", "Description", QuestTypeRef.initial());

        expect(aggregate.getQuestId().getValue()).toBe("123e4567-e89b-12d3-a456-426614174001");
        expect(aggregate.getStatus().getValue()).toBe("not_started");
        expect(aggregate.getProgress()).toBe(0);
    });

    it("should activate quest", () => {
        const questId = QuestId.create("123e4567-e89b-12d3-a456-426614174001");
        const storyId = StoryId.create("123e4567-e89b-12d3-a456-426614174000");
        const aggregate = QuestAggregate.create(questId, storyId, "Main Quest", "Description", QuestTypeRef.initial());

        aggregate.activate();
        expect(aggregate.getStatus().getValue()).toBe("active");
    });

    it("should throw when activating non-not_started quest", () => {
        const questId = QuestId.create("123e4567-e89b-12d3-a456-426614174001");
        const storyId = StoryId.create("123e4567-e89b-12d3-a456-426614174000");
        const aggregate = QuestAggregate.create(questId, storyId, "Main Quest", "Description", QuestTypeRef.initial());
        aggregate.activate();

        expect(() => aggregate.activate()).toThrow("Quest can only be activated from not_started");
    });

    it("should complete quest when all required objectives are complete", () => {
        const questId = QuestId.create("123e4567-e89b-12d3-a456-426614174001");
        const storyId = StoryId.create("123e4567-e89b-12d3-a456-426614174000");
        const aggregate = QuestAggregate.create(questId, storyId, "Main Quest", "Description", QuestTypeRef.initial());

        const objective = Objective.create({
            questId,
            description: "Test objective",
            type: ObjectiveTypeRef.required(),
        });
        objective.complete();
        aggregate.addObjective(objective);

        aggregate.activate();
        aggregate.complete();

        expect(aggregate.getStatus().getValue()).toBe("completed");
    });

    it("should fail quest", () => {
        const questId = QuestId.create("123e4567-e89b-12d3-a456-426614174001");
        const storyId = StoryId.create("123e4567-e89b-12d3-a456-426614174000");
        const aggregate = QuestAggregate.create(questId, storyId, "Main Quest", "Description", QuestTypeRef.initial());

        aggregate.activate();
        aggregate.fail("Failed");

        expect(aggregate.getStatus().getValue()).toBe("failed");
    });

    it("should calculate progress", () => {
        const questId = QuestId.create("123e4567-e89b-12d3-a456-426614174001");
        const storyId = StoryId.create("123e4567-e89b-12d3-a456-426614174000");
        const aggregate = QuestAggregate.create(questId, storyId, "Main Quest", "Description", QuestTypeRef.initial());

        const objective1 = Objective.create({ questId, description: "Obj 1", type: ObjectiveTypeRef.required() });
        const objective2 = Objective.create({ questId, description: "Obj 2", type: ObjectiveTypeRef.required() });
        objective1.complete();
        aggregate.addObjective(objective1);
        aggregate.addObjective(objective2);

        expect(aggregate.getProgress()).toBe(50);
    });
});
