export type StoryState = "initialized" | "in_progress" | "completed" | "failed";

export class StoryStateRef {
    private readonly value: StoryState;

    private constructor(value: StoryState) {
        this.value = value;
    }

    static create(value: string): StoryStateRef {
        if (!StoryStateRef.isValid(value)) {
            throw new Error(`Invalid StoryState: ${value}`);
        }
        return new StoryStateRef(value as StoryState);
    }

    static initial(): StoryStateRef {
        return StoryStateRef.create("initialized");
    }

    static initialized(): StoryStateRef {
        return StoryStateRef.create("initialized");
    }

    static inProgress(): StoryStateRef {
        return StoryStateRef.create("in_progress");
    }

    static completed(): StoryStateRef {
        return StoryStateRef.create("completed");
    }

    static failed(): StoryStateRef {
        return StoryStateRef.create("failed");
    }

    getValue(): StoryState {
        return this.value;
    }

    equals(other: StoryStateRef): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    private static readonly VALUES: StoryState[] = ["initialized", "in_progress", "completed", "failed"];

    private static isValid(value: string): boolean {
        return StoryStateRef.VALUES.includes(value as StoryState);
    }
}
