import { StoryAggregate } from "../Aggregates/StoryAggregate";
import { Scene } from "../Entities/Scene";

export class StoryConsistencyPolicy {
    static validateStoryConsistency(story: StoryAggregate): string[] {
        const errors: string[] = [];

        if (StoryConsistencyPolicy.hasOrphanedChapters(story)) {
            errors.push("Story contains orphaned chapters.");
        }

        if (StoryConsistencyPolicy.hasOrphanedQuests(story)) {
            errors.push("Story contains orphaned quests.");
        }

        if (StoryConsistencyPolicy.hasInvalidSceneOrder(story)) {
            errors.push("Story contains scenes with invalid order.");
        }

        return errors;
    }

    static hasOrphanedChapters(story: StoryAggregate): boolean {
        const chapters = story.getChapters();
        const scenes = story.getScenes();

        const chapterIds = new Set(chapters.map((c) => c.getId().getValue()));

        for (const scene of scenes) {
            const chapterId = scene.getChapterId().getValue();
            if (!chapterIds.has(chapterId)) {
                return true;
            }
        }

        for (const chapter of chapters) {
            if (chapter.getSceneIds().length === 0) {
                return true;
            }
        }

        return false;
    }

    static hasOrphanedQuests(story: StoryAggregate): boolean {
        const quests = story.getQuests();

        for (const quest of quests) {
            if (quest.getObjectives().length === 0) {
                return true;
            }
        }

        return false;
    }

    static hasInvalidSceneOrder(story: StoryAggregate): boolean {
        const scenes = story.getScenes();

        const scenesByChapter = new Map<string, Scene[]>();
        for (const scene of scenes) {
            const chapterId = scene.getChapterId().getValue();
            if (!scenesByChapter.has(chapterId)) {
                scenesByChapter.set(chapterId, []);
            }
            scenesByChapter.get(chapterId)!.push(scene);
        }

        for (const [_chapterId, chapterScenes] of scenesByChapter.entries()) {
            chapterScenes.sort((a, b) => a.getOrder() - b.getOrder());
            const seenOrders = new Set<number>();
            for (const scene of chapterScenes) {
                if (scene.getOrder() < 0) {
                    return true;
                }
                if (seenOrders.has(scene.getOrder())) {
                    return true;
                }
                seenOrders.add(scene.getOrder());
            }
        }

        return false;
    }
}
