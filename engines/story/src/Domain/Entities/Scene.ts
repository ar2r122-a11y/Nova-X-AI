import { SceneId } from "../ValueObjects/SceneId";
import { ChapterId } from "../ValueObjects/ChapterId";
import { SceneStatusRef } from "../ValueObjects/SceneStatus";
import { SceneTypeRef } from "../ValueObjects/SceneType";

export interface SceneChoice {
    readonly choiceId: string;
    readonly text: string;
    readonly targetSceneId: string;
    readonly branchId?: string;
    readonly requiredFlags: Readonly<Record<string, unknown>>;
}

export interface ScenePrerequisite {
    readonly sceneId: SceneId;
    readonly required: boolean;
}

export interface SceneProps {
    sceneId: SceneId;
    chapterId: ChapterId;
    title: string;
    description: string;
    status: SceneStatusRef;
    type: SceneTypeRef;
    choices: SceneChoice[];
    prerequisites: ScenePrerequisite[];
    narrativeFlags: Map<string, unknown>;
    order: number;
    createdAt: number;
    updatedAt: number;
}

export class Scene {
    private readonly props: SceneProps;

    private constructor(props: SceneProps) {
        this.props = props;
    }

    static create(
        props: Omit<SceneProps, "sceneId" | "createdAt" | "updatedAt" | "choices" | "prerequisites" | "narrativeFlags"> & {
            choices?: SceneChoice[];
            prerequisites?: ScenePrerequisite[];
            narrativeFlags?: Map<string, unknown>;
        }
    ): Scene {
        if (!props.title || props.title.trim().length === 0) {
            throw new Error("Scene title cannot be empty.");
        }
        if (props.order < 0) {
            throw new Error("Scene order cannot be negative.");
        }
        const now = Date.now();
        return new Scene({
            sceneId: SceneId.generate(),
            chapterId: props.chapterId,
            title: props.title.trim(),
            description: props.description ?? "",
            status: props.status ?? SceneStatusRef.initial(),
            type: props.type ?? SceneTypeRef.initial(),
            choices: [...(props.choices ?? [])],
            prerequisites: [...(props.prerequisites ?? [])],
            narrativeFlags: new Map(props.narrativeFlags),
            order: props.order,
            createdAt: now,
            updatedAt: now,
        });
    }

    static reconstitute(props: SceneProps): Scene {
        return new Scene(props);
    }

    getId(): SceneId {
        return this.props.sceneId;
    }

    getSceneId(): SceneId {
        return this.props.sceneId;
    }

    getChapterId(): ChapterId {
        return this.props.chapterId;
    }

    getTitle(): string {
        return this.props.title;
    }

    getDescription(): string {
        return this.props.description;
    }

    getStatus(): SceneStatusRef {
        return this.props.status;
    }

    getType(): SceneTypeRef {
        return this.props.type;
    }

    getChoices(): readonly SceneChoice[] {
        return this.props.choices;
    }

    getPrerequisites(): readonly ScenePrerequisite[] {
        return this.props.prerequisites;
    }

    getNarrativeFlags(): ReadonlyMap<string, unknown> {
        return this.props.narrativeFlags;
    }

    getOrder(): number {
        return this.props.order;
    }

    getCreatedAt(): number {
        return this.props.createdAt;
    }

    getUpdatedAt(): number {
        return this.props.updatedAt;
    }

    hasFlag(key: string): boolean {
        return this.props.narrativeFlags.has(key);
    }

    getFlag(key: string): unknown {
        return this.props.narrativeFlags.get(key);
    }

    markActive(): void {
        this.props.status = SceneStatusRef.active();
        this.props.updatedAt = Date.now();
    }

    markCompleted(): void {
        this.props.status = SceneStatusRef.completed();
        this.props.updatedAt = Date.now();
    }

    markSkipped(): void {
        this.props.status = SceneStatusRef.skipped();
        this.props.updatedAt = Date.now();
    }

    isCompleted(): boolean {
        return this.props.status.getValue() === "completed";
    }

    isSkipped(): boolean {
        return this.props.status.getValue() === "skipped";
    }

    addChoice(choice: SceneChoice): void {
        if (this.props.choices.some((c) => c.choiceId === choice.choiceId)) {
            throw new Error(`Choice already exists: ${choice.choiceId}`);
        }
        this.props.choices.push(choice);
        this.props.updatedAt = Date.now();
    }

    getChoice(choiceId: string): SceneChoice | undefined {
        return this.props.choices.find((c) => c.choiceId === choiceId);
    }

    setFlag(key: string, value: unknown): void {
        this.props.narrativeFlags.set(key, value);
        this.props.updatedAt = Date.now();
    }

    toSnapshot(): Record<string, unknown> {
        const flags: Record<string, unknown> = {};
        this.props.narrativeFlags.forEach((value, key) => {
            flags[key] = value;
        });
        return {
            sceneId: this.props.sceneId.getValue(),
            chapterId: this.props.chapterId.getValue(),
            title: this.props.title,
            description: this.props.description,
            status: this.props.status.getValue(),
            type: this.props.type.getValue(),
            choices: this.props.choices.map((c) => ({ ...c })),
            prerequisites: this.props.prerequisites.map((p) => ({
                sceneId: p.sceneId.getValue(),
                required: p.required,
            })),
            narrativeFlags: flags,
            order: this.props.order,
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,
        };
    }
}
