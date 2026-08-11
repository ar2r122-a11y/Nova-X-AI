export type SceneType = "narrative" | "choice" | "action" | "dialogue" | "transition";

export class SceneTypeRef {
    private readonly value: SceneType;

    private constructor(value: SceneType) {
        this.value = value;
    }

    static create(value: string): SceneTypeRef {
        if (!SceneTypeRef.isValid(value)) {
            throw new Error(`Invalid SceneType: ${value}`);
        }
        return new SceneTypeRef(value as SceneType);
    }

    static initial(): SceneTypeRef {
        return SceneTypeRef.create("narrative");
    }

    static narrative(): SceneTypeRef {
        return SceneTypeRef.create("narrative");
    }

    static choice(): SceneTypeRef {
        return SceneTypeRef.create("choice");
    }

    static action(): SceneTypeRef {
        return SceneTypeRef.create("action");
    }

    static dialogue(): SceneTypeRef {
        return SceneTypeRef.create("dialogue");
    }

    static transition(): SceneTypeRef {
        return SceneTypeRef.create("transition");
    }

    getValue(): SceneType {
        return this.value;
    }

    equals(other: SceneTypeRef): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    private static readonly VALUES: SceneType[] = ["narrative", "choice", "action", "dialogue", "transition"];

    private static isValid(value: string): boolean {
        return SceneTypeRef.VALUES.includes(value as SceneType);
    }
}
