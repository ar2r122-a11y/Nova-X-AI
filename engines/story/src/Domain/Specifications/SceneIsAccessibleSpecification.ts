import { Scene } from "../Entities/Scene";

export class SceneIsAccessibleSpecification {
    static isSatisfiedBy(
        scene: Scene,
        flags: Map<string, unknown>,
        completedScenes: string[]
    ): boolean {
        const status = scene.getStatus().getValue();
        if (status === "completed" || status === "skipped") {
            return false;
        }

        for (const prerequisite of scene.getPrerequisites()) {
            if (prerequisite.required && !completedScenes.includes(prerequisite.sceneId.getValue())) {
                return false;
            }
        }

        const requiredFlags = scene.getChoices().flatMap((c) => Object.keys(c.requiredFlags));
        for (const flagKey of requiredFlags) {
            if (!flags.has(flagKey)) {
                return false;
            }
        }

        return true;
    }
}
