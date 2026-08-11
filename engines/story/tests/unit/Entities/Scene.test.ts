import { describe, it, expect } from "vitest";
import { Scene } from "../../../src/Domain/Entities/Scene";
import { SceneId } from "../../../src/Domain/ValueObjects/SceneId";
import { ChapterId } from "../../../src/Domain/ValueObjects/ChapterId";
import { SceneTypeRef } from "../../../src/Domain/ValueObjects/SceneType";
import { SceneStatusRef } from "../../../src/Domain/ValueObjects/SceneStatus";

describe("Scene", () => {
    it("should create a scene", () => {
        const scene = Scene.create({
            chapterId: ChapterId.create("123e4567-e89b-12d3-a456-426614174000"),
            title: "Forest Path",
            description: "A dark forest path",
            status: SceneStatusRef.initial(),
            type: SceneTypeRef.initial(),
            order: 1,
        });

        expect(scene.getTitle()).toBe("Forest Path");
        expect(scene.getStatus().getValue()).toBe("pending");
    });

    it("should add choices", () => {
        const scene = Scene.create({
            chapterId: ChapterId.create("123e4567-e89b-12d3-a456-426614174000"),
            title: "Forest Path",
            description: "A dark forest path",
            status: SceneStatusRef.initial(),
            type: SceneTypeRef.initial(),
            order: 1,
        });

        scene.addChoice({
            choiceId: "choice-1",
            text: "Go left",
            targetSceneId: "scene-2",
            requiredFlags: {},
        });

        expect(scene.getChoices()).toHaveLength(1);
        expect(scene.getChoice("choice-1")?.text).toBe("Go left");
    });

    it("should mark completed", () => {
        const scene = Scene.create({
            chapterId: ChapterId.create("123e4567-e89b-12d3-a456-426614174000"),
            title: "Forest Path",
            description: "A dark forest path",
            status: SceneStatusRef.initial(),
            type: SceneTypeRef.initial(),
            order: 1,
        });

        scene.markCompleted();
        expect(scene.isCompleted()).toBe(true);
    });
});
