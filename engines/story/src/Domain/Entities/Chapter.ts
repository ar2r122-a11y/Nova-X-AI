import { ChapterId } from "../ValueObjects/ChapterId";
import { StoryId } from "../ValueObjects/StoryId";
import { SceneId } from "../ValueObjects/SceneId";
import { ChapterStatusRef } from "../ValueObjects/ChapterStatus";

export interface ChapterProps {
    chapterId: ChapterId;
    storyId: StoryId;
    title: string;
    status: ChapterStatusRef;
    order: number;
    sceneIds: SceneId[];
    createdAt: number;
    updatedAt: number;
}

export class Chapter {
    private readonly props: ChapterProps;

    private constructor(props: ChapterProps) {
        this.props = props;
    }

    static create(
        props: Omit<ChapterProps, "chapterId" | "createdAt" | "updatedAt" | "sceneIds"> & {
            sceneIds?: SceneId[];
        }
    ): Chapter {
        if (!props.title || props.title.trim().length === 0) {
            throw new Error("Chapter title cannot be empty.");
        }
        if (props.order < 0) {
            throw new Error("Chapter order cannot be negative.");
        }
        const now = Date.now();
        return new Chapter({
            chapterId: ChapterId.generate(),
            storyId: props.storyId,
            title: props.title.trim(),
            status: props.status ?? ChapterStatusRef.initial(),
            order: props.order,
            sceneIds: [...(props.sceneIds ?? [])],
            createdAt: now,
            updatedAt: now,
        });
    }

    static reconstitute(props: ChapterProps): Chapter {
        return new Chapter(props);
    }

    getId(): ChapterId {
        return this.props.chapterId;
    }

    getChapterId(): ChapterId {
        return this.props.chapterId;
    }

    getStoryId(): StoryId {
        return this.props.storyId;
    }

    getTitle(): string {
        return this.props.title;
    }

    getStatus(): ChapterStatusRef {
        return this.props.status;
    }

    getOrder(): number {
        return this.props.order;
    }

    getSceneIds(): readonly SceneId[] {
        return this.props.sceneIds;
    }

    getCreatedAt(): number {
        return this.props.createdAt;
    }

    getUpdatedAt(): number {
        return this.props.updatedAt;
    }

    markAvailable(): void {
        this.props.status = ChapterStatusRef.available();
        this.props.updatedAt = Date.now();
    }

    markActive(): void {
        this.props.status = ChapterStatusRef.active();
        this.props.updatedAt = Date.now();
    }

    markCompleted(): void {
        this.props.status = ChapterStatusRef.completed();
        this.props.updatedAt = Date.now();
    }

    lock(): void {
        this.props.status = ChapterStatusRef.locked();
        this.props.updatedAt = Date.now();
    }

    addScene(sceneId: SceneId): void {
        if (this.props.sceneIds.some((id) => id.equals(sceneId))) {
            throw new Error(`Scene already exists in chapter: ${sceneId.getValue()}`);
        }
        this.props.sceneIds.push(sceneId);
        this.props.updatedAt = Date.now();
    }

    removeScene(sceneId: SceneId): void {
        const index = this.props.sceneIds.findIndex((id) => id.equals(sceneId));
        if (index === -1) {
            throw new Error(`Scene not found in chapter: ${sceneId.getValue()}`);
        }
        this.props.sceneIds.splice(index, 1);
        this.props.updatedAt = Date.now();
    }

    toSnapshot(): Record<string, unknown> {
        return {
            chapterId: this.props.chapterId.getValue(),
            storyId: this.props.storyId.getValue(),
            title: this.props.title,
            status: this.props.status.getValue(),
            order: this.props.order,
            sceneIds: this.props.sceneIds.map((id) => id.getValue()),
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,
        };
    }
}
