import { StoryAggregate } from "../Aggregates/StoryAggregate";
import { Chapter } from "../Entities/Chapter";
import { Quest } from "../Entities/Quest";
import { Objective } from "../Entities/Objective";
import { StoryProgress } from "../ValueObjects/StoryProgress";
import { IProgressionCalculator } from "./IProgressionCalculator";

export class ProgressionCalculator implements IProgressionCalculator {
    calculateStoryProgress(story: StoryAggregate): StoryProgress {
        const chapters = story.getChapters();
        const scenes = story.getScenes();
        const quests = story.getQuests();

        const activeChapter = chapters.find((c) => c.getStatus().getValue() === "active");
        const currentChapterId = activeChapter ? activeChapter.getChapterId().getValue() : null;

        let currentSceneId: string | null = null;
        if (currentChapterId) {
            const chapterScenes = scenes
                .filter((s) => s.getChapterId().getValue() === currentChapterId)
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

    calculateChapterProgress(chapter: Chapter): number {
        const totalScenes = chapter.getSceneIds().length;
        if (totalScenes === 0) {
            return 0;
        }
        return Math.round((chapter.getStatus().getValue() === "completed" ? 100 : 0));
    }

    calculateQuestProgress(quest: Quest): number {
        return quest.getProgress();
    }

    calculateObjectiveProgress(objective: Objective): number {
        return objective.getProgress();
    }
}
