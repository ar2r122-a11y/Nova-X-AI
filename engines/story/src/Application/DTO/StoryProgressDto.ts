import { StoryProgress } from "../../Domain/ValueObjects/StoryProgress";

export class StoryProgressDto {
    currentChapterId: string | null;
    currentSceneId: string | null;
    completedScenes: string[];
    activeQuests: string[];
    completedQuests: string[];
    narrativeFlags: Record<string, unknown>;

    constructor(
        currentChapterId: string | null,
        currentSceneId: string | null,
        completedScenes: string[],
        activeQuests: string[],
        completedQuests: string[],
        narrativeFlags: Record<string, unknown>
    ) {
        this.currentChapterId = currentChapterId;
        this.currentSceneId = currentSceneId;
        this.completedScenes = completedScenes;
        this.activeQuests = activeQuests;
        this.completedQuests = completedQuests;
        this.narrativeFlags = narrativeFlags;
    }

    static fromProgress(progress: StoryProgress): StoryProgressDto {
        return new StoryProgressDto(
            progress.getCurrentChapterId(),
            progress.getCurrentSceneId(),
            [...progress.getCompletedScenes()],
            [...progress.getActiveQuests()],
            [...progress.getCompletedQuests()],
            progress.getNarrativeFlags()
        );
    }
}
