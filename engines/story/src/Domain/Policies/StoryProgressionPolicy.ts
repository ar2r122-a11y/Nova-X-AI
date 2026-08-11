import { StoryAggregate } from "../Aggregates/StoryAggregate";
import { StoryStatus } from "../ValueObjects/StoryStatus";
import { SceneStatus } from "../ValueObjects/SceneStatus";
import { ChapterStatus } from "../ValueObjects/ChapterStatus";
import { StoryProgress } from "../ValueObjects/StoryProgress";

export class StoryProgressionPolicy {
    static canAdvanceScene(currentStatus: StoryStatus, sceneStatus: SceneStatus): boolean {
        const statusOk = currentStatus === "active" || currentStatus === "paused";
        const sceneOk = sceneStatus === "pending" || sceneStatus === "active";
        return statusOk && sceneOk;
    }

    static canProgressChapter(currentChapterStatus: ChapterStatus): boolean {
        return currentChapterStatus === "active";
    }

    static calculateProgress(story: StoryAggregate): StoryProgress {
        const chapters = story.getChapters();
        const scenes = story.getScenes();
        const quests = story.getQuests();

        const activeChapter = chapters.find((c) => c.getStatus().getValue() === "active");
        const currentChapterId = activeChapter ? activeChapter.getChapterId().getValue() : null;

        let currentSceneId: string | null = null;
        if (currentChapterId) {
            const chapterScenes = scenes
                .filter((s) => s.getChapterId().equals(activeChapter!.getId()))
                .sort((a, b) => a.getOrder() - b.getOrder());
            const pendingOrActive = chapterScenes.find(
                (s) => s.getStatus().getValue() === "pending" || s.getStatus().getValue() === "active"
            );
            currentSceneId = pendingOrActive ? pendingOrActive.getSceneId().getValue() : null;
        }

        const completedScenes = scenes
            .filter((s) => s.getStatus().getValue() === "completed")
            .map((s) => s.getSceneId().getValue());

        const activeQuests = quests
            .filter((q) => q.getStatus().getValue() === "active")
            .map((q) => q.getQuestId().getValue());

        const completedQuests = quests
            .filter((q) => q.getStatus().getValue() === "completed")
            .map((q) => q.getQuestId().getValue());

        const narrativeFlags: Record<string, unknown> = {};

        scenes.forEach((s) => {
            s.getNarrativeFlags().forEach((value, key) => {
                narrativeFlags[key] = value;
            });
        });

        quests.forEach((q) => {
            q.getNarrativeFlags().forEach((value, key) => {
                narrativeFlags[key] = value;
            });
        });

        story.getEndings().forEach((e) => {
            if (e.isUnlocked()) {
                e.getNarrativeFlags().forEach((value, key) => {
                    narrativeFlags[key] = value;
                });
            }
        });

        return StoryProgress.create({
            currentChapterId,
            currentSceneId,
            completedScenes,
            activeQuests,
            completedQuests,
            narrativeFlags,
        });
    }
}
