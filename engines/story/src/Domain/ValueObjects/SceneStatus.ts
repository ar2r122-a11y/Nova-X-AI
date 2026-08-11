export type SceneStatus = "pending" | "active" | "completed" | "skipped";

export class SceneStatusRef {
    private readonly value: SceneStatus;

    private constructor(value: SceneStatus) {
        this.value = value;
    }

    static create(value: string): SceneStatusRef {
        if (!SceneStatusRef.isValid(value)) {
            throw new Error(`Invalid SceneStatus: ${value}`);
        }
        return new SceneStatusRef(value as SceneStatus);
    }

    static initial(): SceneStatusRef {
        return SceneStatusRef.create("pending");
    }

    static pending(): SceneStatusRef {
        return SceneStatusRef.create("pending");
    }

    static active(): SceneStatusRef {
        return SceneStatusRef.create("active");
    }

    static completed(): SceneStatusRef {
        return SceneStatusRef.create("completed");
    }

    static skipped(): SceneStatusRef {
        return SceneStatusRef.create("skipped");
    }

    getValue(): SceneStatus {
        return this.value;
    }

    equals(other: SceneStatusRef): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    private static readonly VALUES: SceneStatus[] = ["pending", "active", "completed", "skipped"];

    private static isValid(value: string): boolean {
        return SceneStatusRef.VALUES.includes(value as SceneStatus);
    }
}
