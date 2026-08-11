import { describe, it, expect } from "vitest";
import { QuestProgressionPolicy } from "../../../src/Domain/Policies/QuestProgressionPolicy";
import { QuestStatusRef } from "../../../src/Domain/ValueObjects/QuestStatus";
import { StoryStatusRef } from "../../../src/Domain/ValueObjects/StoryStatus";
import { Quest } from "../../../src/Domain/Entities/Quest";
import { QuestId } from "../../../src/Domain/ValueObjects/QuestId";
import { StoryId } from "../../../src/Domain/ValueObjects/StoryId";
import { QuestTypeRef } from "../../../src/Domain/ValueObjects/QuestType";
import { Objective } from "../../../src/Domain/Entities/Objective";
import { ObjectiveTypeRef } from "../../../src/Domain/ValueObjects/ObjectiveType";

describe("QuestProgressionPolicy", () => {
    it("should allow activating not_started quest in active story", () => {
        expect(QuestProgressionPolicy.canActivateQuest("not_started", "active")).toBe(true);
        expect(QuestProgressionPolicy.canActivateQuest("not_started", "paused")).toBe(true);
    });

    it("should deny activating non-not_started quest", () => {
        expect(QuestProgressionPolicy.canActivateQuest("active", "active")).toBe(false);
        expect(QuestProgressionPolicy.canActivateQuest("completed", "active")).toBe(false);
    });

    it("should calculate quest progress", () => {
        const questId = QuestId.create("123e4567-e89b-12d3-a456-426614174001");
        const storyId = StoryId.create("123e4567-e89b-12d3-a456-426614174000");
        const quest = Quest.create({
            storyId,
            title: "Quest",
            description: "Desc",
            type: QuestTypeRef.initial(),
            prerequisites: [],
        });

        const obj1 = Objective.create({ questId, description: "Obj 1", type: ObjectiveTypeRef.required() });
        const obj2 = Objective.create({ questId, description: "Obj 2", type: ObjectiveTypeRef.required() });
        obj1.complete();
        quest.addObjective(obj1);
        quest.addObjective(obj2);

        expect(QuestProgressionPolicy.calculateQuestProgress(quest)).toBe(50);
    });
});
