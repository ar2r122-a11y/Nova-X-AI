export interface StoryProgressProps {
    currentChapterId: string | null;
    currentSceneId: string | null;
    completedScenes: string[];
    activeQuests: string[];
    completedQuests: string[];
    narrativeFlags: Record<string, unknown>;
}

export class StoryProgress {
    private readonly props: StoryProgressProps;

    private constructor(props: StoryProgressProps) {
        this.props = props;
    }

    static create(props: StoryProgressProps): StoryProgress {
        return new StoryProgress({
            currentChapterId: props.currentChapterId ?? null,
            currentSceneId: props.currentSceneId ?? null,
            completedScenes: [...(props.completedScenes ?? [])],
            activeQuests: [...(props.activeQuests ?? [])],
            completedQuests: [...(props.completedQuests ?? [])],
            narrativeFlags: { ...(props.narrativeFlags ?? {}) },
        });
    }

    static initial(): StoryProgress {
        return StoryProgress.create({
            currentChapterId: null,
            currentSceneId: null,
            completedScenes: [],
            activeQuests: [],
            completedQuests: [],
            narrativeFlags: {},
        });
    }

    getCurrentChapterId(): string | null {
        return this.props.currentChapterId;
    }

    getCurrentSceneId(): string | null {
        return this.props.currentSceneId;
    }

    getCompletedScenes(): readonly string[] {
        return this.props.completedScenes;
    }

    getActiveQuests(): readonly string[] {
        return this.props.activeQuests;
    }

    getCompletedQuests(): readonly string[] {
        return this.props.completedQuests;
    }

    getNarrativeFlags(): Readonly<Record<string, unknown>> {
        return this.props.narrativeFlags;
    }

    getValue(): string {
        return JSON.stringify({
            currentChapterId: this.props.currentChapterId,
            currentSceneId: this.props.currentSceneId,
            completedScenes: this.props.completedScenes,
            activeQuests: this.props.activeQuests,
            completedQuests: this.props.completedQuests,
            narrativeFlags: this.props.narrativeFlags,
        });
    }

    equals(other: StoryProgress): boolean {
        return this.getValue() === other.getValue();
    }

    withCurrentChapter(chapterId: string): StoryProgress {
        return StoryProgress.create({ ...this.props, currentChapterId: chapterId });
    }

    withCurrentScene(sceneId: string): StoryProgress {
        return StoryProgress.create({ ...this.props, currentSceneId: sceneId });
    }

    markSceneCompleted(sceneId: string): StoryProgress {
        if (this.props.completedScenes.includes(sceneId)) {
            return this;
        }
        return StoryProgress.create({
            ...this.props,
            completedScenes: [...this.props.completedScenes, sceneId],
        });
    }

    markQuestActive(questId: string): StoryProgress {
        const activeQuests = this.props.activeQuests.includes(questId)
            ? this.props.activeQuests
            : [...this.props.activeQuests, questId];
        const completedQuests = this.props.completedQuests.filter((id) => id !== questId);
        return StoryProgress.create({ ...this.props, activeQuests, completedQuests });
    }

    markQuestCompleted(questId: string): StoryProgress {
        const activeQuests = this.props.activeQuests.filter((id) => id !== questId);
        const completedQuests = this.props.completedQuests.includes(questId)
            ? this.props.completedQuests
            : [...this.props.completedQuests, questId];
        return StoryProgress.create({ ...this.props, activeQuests, completedQuests });
    }

    withFlag(key: string, value: unknown): StoryProgress {
        return StoryProgress.create({
            ...this.props,
            narrativeFlags: { ...this.props.narrativeFlags, [key]: value },
        });
    }
}
