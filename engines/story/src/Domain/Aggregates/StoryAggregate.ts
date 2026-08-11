import { IDomainEvent } from "@nova-x-ai/core";
import { StoryId } from "../ValueObjects/StoryId";
import { StoryStateRef } from "../ValueObjects/StoryState";
import { StoryStatusRef } from "../ValueObjects/StoryStatus";
import { StoryVersion } from "../ValueObjects/StoryVersion";
import { StoryProgress } from "../ValueObjects/StoryProgress";
import { ChapterId } from "../ValueObjects/ChapterId";
import { SceneId } from "../ValueObjects/SceneId";
import { BranchId } from "../ValueObjects/BranchId";
import { EndingId } from "../ValueObjects/EndingId";
import { QuestId } from "../ValueObjects/QuestId";
import { Chapter } from "../Entities/Chapter";
import { Scene } from "../Entities/Scene";
import { Quest } from "../Entities/Quest";
import { Ending } from "../Entities/Ending";
import { Branch } from "../Entities/Branch";
import {
    StoryStartedEvent,
    SceneAdvancedEvent,
    ChoiceSelectedEvent,
    StoryCompletedEvent,
    StoryFailedEvent
} from "../Events";

export interface StoryAggregateProps {
    storyId: StoryId;
    title: string;
    description: string;
    state: StoryStateRef;
    status: StoryStatusRef;
    chapters: Chapter[];
    scenes: Scene[];
    quests: Quest[];
    endings: Ending[];
    branches: Branch[];
    flags: Map<string, unknown>;
    progress: StoryProgress;
    version: StoryVersion;
    createdAt: number;
    updatedAt: number;
}

export class StoryAggregate {
    private readonly props: StoryAggregateProps;
    private readonly uncommittedEvents: IDomainEvent[];

    private constructor(props: StoryAggregateProps) {
        this.props = props;
        this.uncommittedEvents = [];
    }

    static create(storyId: StoryId, title: string, description: string): StoryAggregate {
        const now = Date.now();
        const aggregate = new StoryAggregate({
            storyId,
            title,
            description: description ?? "",
            state: StoryStateRef.initial(),
            status: StoryStatusRef.initial(),
            chapters: [],
            scenes: [],
            quests: [],
            endings: [],
            branches: [],
            flags: new Map(),
            progress: StoryProgress.initial(),
            version: StoryVersion.initial(),
            createdAt: now,
            updatedAt: now,
        });

        aggregate.uncommittedEvents.push(new StoryStartedEvent(
            storyId.getValue(),
            title,
            now,
            ""
        ));

        return aggregate;
    }

    static reconstitute(props: StoryAggregateProps): StoryAggregate {
        const aggregate = new StoryAggregate({
            ...props,
            flags: new Map(props.flags),
        });
        return aggregate;
    }

    getStoryId(): StoryId {
        return this.props.storyId;
    }

    getTitle(): string {
        return this.props.title;
    }

    getDescription(): string {
        return this.props.description;
    }

    getState(): StoryStateRef {
        return this.props.state;
    }

    getStatus(): StoryStatusRef {
        return this.props.status;
    }

    getVersion(): StoryVersion {
        return this.props.version;
    }

    getChapters(): readonly Chapter[] {
        return this.props.chapters;
    }

    getScenes(): readonly Scene[] {
        return this.props.scenes;
    }

    getQuests(): readonly Quest[] {
        return this.props.quests;
    }

    getEndings(): readonly Ending[] {
        return this.props.endings;
    }

    getBranches(): readonly Branch[] {
        return this.props.branches;
    }

    getFlags(): ReadonlyMap<string, unknown> {
        return this.props.flags;
    }

    getProgress(): StoryProgress {
        return this.props.progress;
    }

    getCreatedAt(): number {
        return this.props.createdAt;
    }

    getUpdatedAt(): number {
        return this.props.updatedAt;
    }

    getUncommittedEvents(): readonly IDomainEvent[] {
        return this.uncommittedEvents;
    }

    start(): void {
        if (this.props.status.getValue() !== "draft") {
            throw new Error(`Cannot start story from status: ${this.props.status.getValue()}`);
        }
        if (this.props.state.getValue() !== "initialized") {
            throw new Error(`Cannot start story from state: ${this.props.state.getValue()}`);
        }

        this.props.status = StoryStatusRef.active();
        this.props.state = StoryStateRef.inProgress();
        this.props.version = StoryVersion.next(this.props.version);
        this.props.updatedAt = Date.now();

        this.uncommittedEvents.push(new StoryStartedEvent(
            this.props.storyId.getValue(),
            this.props.title,
            Date.now(),
            ""
        ));
    }

    advanceScene(sceneId: SceneId): void {
        this.ensureActive();

        const scene = this.props.scenes.find((s) => s.getSceneId().equals(sceneId));
        if (!scene) {
            throw new Error(`Scene not found: ${sceneId.getValue()}`);
        }

        const sceneStatus = scene.getStatus().getValue();
        if (sceneStatus !== "pending" && sceneStatus !== "active") {
            throw new Error(`Cannot advance scene from status: ${sceneStatus}`);
        }

        const previousSceneId = this.props.progress.getCurrentSceneId();
        if (previousSceneId) {
            const previousScene = this.props.scenes.find((s) => s.getSceneId().getValue() === previousSceneId);
            if (previousScene) {
                previousScene.markCompleted();
            }
        }

        scene.markActive();
        this.props.progress = this.props.progress.withCurrentScene(sceneId.getValue());
        this.props.version = StoryVersion.next(this.props.version);
        this.props.updatedAt = Date.now();

        this.uncommittedEvents.push(new SceneAdvancedEvent(
            this.props.storyId.getValue(),
            sceneId.getValue(),
            previousSceneId ?? "",
            Date.now(),
            ""
        ));
    }

    selectChoice(sceneId: SceneId, choiceId: string, branchId: BranchId): void {
        this.ensureActive();

        const scene = this.props.scenes.find((s) => s.getSceneId().equals(sceneId));
        if (!scene) {
            throw new Error(`Scene not found: ${sceneId.getValue()}`);
        }

        const choice = scene.getChoice(choiceId);
        if (!choice) {
            throw new Error(`Choice not found: ${choiceId}`);
        }

        const branch = this.props.branches.find((b) => b.getBranchId().equals(branchId));
        if (!branch || !branch.isActive()) {
            throw new Error(`Branch not found or inactive: ${branchId.getValue()}`);
        }

        const selectedFlags: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(choice.requiredFlags)) {
            this.props.flags.set(key, value);
            selectedFlags[key] = value;
        }

        this.props.progress = this.props.progress.withFlag(`choice_${sceneId.getValue()}`, choiceId);
        this.props.version = StoryVersion.next(this.props.version);
        this.props.updatedAt = Date.now();

        this.uncommittedEvents.push(new ChoiceSelectedEvent(
            this.props.storyId.getValue(),
            sceneId.getValue(),
            choiceId,
            branchId.getValue(),
            selectedFlags,
            Date.now(),
            ""
        ));
    }

    completeStory(endingId: EndingId): void {
        this.ensureNotTerminal();

        const ending = this.props.endings.find((e) => e.getId().equals(endingId));
        if (!ending) {
            throw new Error(`Ending not found: ${endingId.getValue()}`);
        }
        if (!ending.isUnlocked()) {
            throw new Error(`Ending is not unlocked: ${endingId.getValue()}`);
        }

        this.props.status = StoryStatusRef.completed();
        this.props.state = StoryStateRef.completed();
        this.props.version = StoryVersion.next(this.props.version);
        this.props.updatedAt = Date.now();

        const finalFlags: Record<string, unknown> = {};
        ending.getNarrativeFlags().forEach((value, key) => {
            this.props.flags.set(key, value);
            finalFlags[key] = value;
        });

        this.uncommittedEvents.push(new StoryCompletedEvent(
            this.props.storyId.getValue(),
            endingId.getValue(),
            finalFlags,
            Date.now(),
            ""
        ));
    }

    failStory(reason: string): void {
        this.ensureNotTerminal();

        this.props.status = StoryStatusRef.failed();
        this.props.state = StoryStateRef.failed();
        this.props.version = StoryVersion.next(this.props.version);
        this.props.updatedAt = Date.now();

        this.uncommittedEvents.push(new StoryFailedEvent(
            this.props.storyId.getValue(),
            reason,
            Date.now(),
            ""
        ));
    }

    pause(): void {
        if (this.props.status.getValue() !== "active") {
            throw new Error(`Cannot pause story from status: ${this.props.status.getValue()}`);
        }
        this.props.status = StoryStatusRef.paused();
        this.props.version = StoryVersion.next(this.props.version);
        this.props.updatedAt = Date.now();
    }

    resume(): void {
        if (this.props.status.getValue() !== "paused") {
            throw new Error(`Cannot resume story from status: ${this.props.status.getValue()}`);
        }
        this.props.status = StoryStatusRef.active();
        this.props.version = StoryVersion.next(this.props.version);
        this.props.updatedAt = Date.now();
    }

    archive(): void {
        if (this.props.status.getValue() === "archived") {
            throw new Error("Story is already archived.");
        }
        this.props.status = StoryStatusRef.archived();
        this.props.version = StoryVersion.next(this.props.version);
        this.props.updatedAt = Date.now();
    }

    addChapter(chapter: Chapter): void {
        if (this.props.chapters.some((c) => c.getId().equals(chapter.getId()))) {
            throw new Error(`Chapter already exists: ${chapter.getId().getValue()}`);
        }
        this.props.chapters.push(chapter);
        this.props.version = StoryVersion.next(this.props.version);
        this.props.updatedAt = Date.now();
    }

    addQuest(quest: Quest): void {
        if (this.props.quests.some((q) => q.getId().equals(quest.getId()))) {
            throw new Error(`Quest already exists: ${quest.getId().getValue()}`);
        }
        this.props.quests.push(quest);
        this.props.version = StoryVersion.next(this.props.version);
        this.props.updatedAt = Date.now();
    }

    addEnding(ending: Ending): void {
        if (this.props.endings.some((e) => e.getId().equals(ending.getId()))) {
            throw new Error(`Ending already exists: ${ending.getId().getValue()}`);
        }
        this.props.endings.push(ending);
        this.props.version = StoryVersion.next(this.props.version);
        this.props.updatedAt = Date.now();
    }

    addBranch(branch: Branch): void {
        if (this.props.branches.some((b) => b.getBranchId().equals(branch.getBranchId()))) {
            throw new Error(`Branch already exists: ${branch.getBranchId().getValue()}`);
        }
        this.props.branches.push(branch);
        this.props.version = StoryVersion.next(this.props.version);
        this.props.updatedAt = Date.now();
    }

    updateFlag(key: string, value: unknown): void {
        this.props.flags.set(key, value);
        this.props.progress = this.props.progress.withFlag(key, value);
        this.props.version = StoryVersion.next(this.props.version);
        this.props.updatedAt = Date.now();
    }

    getChapter(chapterId: ChapterId): Chapter | undefined {
        return this.props.chapters.find((c) => c.getId().equals(chapterId));
    }

    getQuest(questId: QuestId): Quest | undefined {
        return this.props.quests.find((q) => q.getId().equals(questId));
    }

    getScene(sceneId: SceneId): Scene | undefined {
        return this.props.scenes.find((s) => s.getId().equals(sceneId));
    }

    getNextScene(sceneId: SceneId): Scene | null {
        const scene = this.getScene(sceneId);
        if (!scene) {
            return null;
        }

        const chapterScenes = this.props.scenes
            .filter((s) => s.getChapterId().equals(scene.getChapterId()))
            .sort((a, b) => a.getOrder() - b.getOrder());

        const currentIndex = chapterScenes.findIndex((s) => s.getId().equals(sceneId));
        if (currentIndex === -1 || currentIndex === chapterScenes.length - 1) {
            return null;
        }

        return chapterScenes[currentIndex + 1];
    }

    canAdvanceTo(sceneId: SceneId): boolean {
        const scene = this.getScene(sceneId);
        if (!scene) {
            return false;
        }

        const sceneStatus = scene.getStatus().getValue();
        return sceneStatus === "pending" || sceneStatus === "active";
    }

    commitEvents(): void {
        this.uncommittedEvents.length = 0;
    }

    getSnapshot(): Record<string, unknown> {
        const flags: Record<string, unknown> = {};
        this.props.flags.forEach((value, key) => {
            flags[key] = value;
        });

        return {
            storyId: this.props.storyId.getValue(),
            title: this.props.title,
            description: this.props.description,
            state: this.props.state.getValue(),
            status: this.props.status.getValue(),
            chapters: this.props.chapters.map((c) => c.toSnapshot()),
            scenes: this.props.scenes.map((s) => s.toSnapshot()),
            quests: this.props.quests.map((q) => q.toSnapshot()),
            endings: this.props.endings.map((e) => e.toSnapshot()),
            branches: this.props.branches.map((b) => b.toSnapshot()),
            flags,
            progress: JSON.parse(this.props.progress.getValue()),
            version: this.props.version.getValue(),
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,
        };
    }

    private ensureActive(): void {
        const status = this.props.status.getValue();
        if (status !== "active" && status !== "paused") {
            throw new Error(`Story is not active or paused: ${status}`);
        }
        if (this.props.state.getValue() === "completed" || this.props.state.getValue() === "failed") {
            throw new Error(`Story is already terminal: ${this.props.state.getValue()}`);
        }
    }

    private ensureNotTerminal(): void {
        const status = this.props.status.getValue();
        if (status === "completed" || status === "failed" || status === "archived") {
            throw new Error(`Story is already terminal: ${status}`);
        }
    }
}
