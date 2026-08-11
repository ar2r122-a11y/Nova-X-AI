import { EndingId } from "../ValueObjects/EndingId";
import { StoryId } from "../ValueObjects/StoryId";
import { EndingTypeRef } from "../ValueObjects/EndingType";

export interface EndingProps {
    endingId: EndingId;
    storyId: StoryId;
    title: string;
    description: string;
    type: EndingTypeRef;
    conditions: Map<string, unknown>;
    narrativeFlags: Map<string, unknown>;
    isUnlocked: boolean;
    createdAt: number;
    updatedAt: number;
}

export class Ending {
    private readonly props: EndingProps;

    private constructor(props: EndingProps) {
        this.props = props;
    }

    static create(
        props: Omit<EndingProps, "endingId" | "createdAt" | "updatedAt" | "isUnlocked" | "conditions" | "narrativeFlags"> & {
            conditions?: Map<string, unknown>;
            narrativeFlags?: Map<string, unknown>;
            isUnlocked?: boolean;
        }
    ): Ending {
        if (!props.title || props.title.trim().length === 0) {
            throw new Error("Ending title cannot be empty.");
        }
        const now = Date.now();
        return new Ending({
            endingId: EndingId.generate(),
            storyId: props.storyId,
            title: props.title.trim(),
            description: props.description ?? "",
            type: props.type ?? EndingTypeRef.initial(),
            conditions: new Map(props.conditions),
            narrativeFlags: new Map(props.narrativeFlags),
            isUnlocked: props.isUnlocked ?? false,
            createdAt: now,
            updatedAt: now,
        });
    }

    static reconstitute(props: EndingProps): Ending {
        return new Ending(props);
    }

    getId(): EndingId {
        return this.props.endingId;
    }

    getEndingId(): EndingId {
        return this.props.endingId;
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

    getType(): EndingTypeRef {
        return this.props.type;
    }

    getConditions(): ReadonlyMap<string, unknown> {
        return this.props.conditions;
    }

    getNarrativeFlags(): ReadonlyMap<string, unknown> {
        return this.props.narrativeFlags;
    }

    isUnlocked(): boolean {
        return this.props.isUnlocked;
    }

    getCreatedAt(): number {
        return this.props.createdAt;
    }

    getUpdatedAt(): number {
        return this.props.updatedAt;
    }

    unlock(): void {
        this.props.isUnlocked = true;
        this.props.updatedAt = Date.now();
    }

    lock(): void {
        this.props.isUnlocked = false;
        this.props.updatedAt = Date.now();
    }

    setFlag(key: string, value: unknown): void {
        this.props.narrativeFlags.set(key, value);
        this.props.updatedAt = Date.now();
    }

    toSnapshot(): Record<string, unknown> {
        const conditions: Record<string, unknown> = {};
        const narrativeFlags: Record<string, unknown> = {};
        this.props.conditions.forEach((value, key) => {
            conditions[key] = value;
        });
        this.props.narrativeFlags.forEach((value, key) => {
            narrativeFlags[key] = value;
        });
        return {
            endingId: this.props.endingId.getValue(),
            storyId: this.props.storyId.getValue(),
            title: this.props.title,
            description: this.props.description,
            type: this.props.type.getValue(),
            conditions,
            narrativeFlags,
            isUnlocked: this.props.isUnlocked,
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,
        };
    }
}
